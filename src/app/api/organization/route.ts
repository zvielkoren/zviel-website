import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";
import { getOrganizations, addOrganization, deleteOrganization } from "@/lib/portfolioService";

export const runtime = "edge";

const FALLBACK_ORGANIZATIONS = [
  {
    name: "DevSphere Collective",
    mission: "An open-source collective developing high-performance developer tools, stateful agentic workflows, and type-safe systems.",
    link: "https://github.com/zvielkoren",
    logo: "https://avatars.githubusercontent.com/u/132788625?v=4"
  },
  {
    name: "CloudForge Labs",
    mission: "A cooperative lab prototyping serverless architectures, custom edge runtimes, and real-time distributed state synchronizations.",
    link: "https://github.com/zvielkoren",
    logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60"
  }
];

export async function GET() {
  console.log("Organization API: GET request received");
  
  try {
    // 1. Check if there are any organizations in the database/in-memory service
    const savedOrgs = await getOrganizations();
    if (savedOrgs.length > 0) {
      console.log(`Organization API: Returning ${savedOrgs.length} saved organizations from database.`);
      return NextResponse.json(savedOrgs);
    }

    // 2. If no saved organizations, check if we can fetch from GitHub
    if (!process.env.GITHUB_TOKEN) {
      console.warn("Organization API: GITHUB_TOKEN is not configured, returning mock fallback data.");
      return NextResponse.json(
        FALLBACK_ORGANIZATIONS,
        {
          status: 200,
          headers: {
            "X-Offline-Snapshot": "true"
          }
        }
      );
    }

    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });

    console.log("Organization API: Fetching orgs for user zvielkoren");
    const response = await octokit.orgs.listForUser({
      username: "zvielkoren",
    });

    console.log(`Organization API: Found ${response.data.length} organizations`);
    const organizations = response.data.map((org) => ({
      name: org.login,
      mission: org.description || "",
      link: org.url || `https://github.com/${org.login}`,
      logo: org.avatar_url || "",
    }));

    // Cache them in DB
    for (const org of organizations) {
      await addOrganization(org);
    }

    return NextResponse.json(organizations);
  } catch (error) {
    console.error("Organization API: Error fetching organizations data:", error);
    return NextResponse.json(
      { error: "Failed to fetch organizations", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, mission, link, logo } = body;

    if (!name) {
      return NextResponse.json({ error: "Organization name is required" }, { status: 400 });
    }

    const newOrg = await addOrganization({
      name,
      mission: mission || "",
      link: link || `https://github.com/${name}`,
      logo: logo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60"
    });

    return NextResponse.json({ success: true, organization: newOrg });
  } catch (error) {
    console.error("Organization API POST error:", error);
    return NextResponse.json(
      { error: "Failed to create organization", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");

    if (!name) {
      return NextResponse.json({ error: "Organization name is required" }, { status: 400 });
    }

    const success = await deleteOrganization(name);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("Organization API DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete organization", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
