import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";
// Add Edge Runtime configuration
export const runtime = "edge";
export async function GET() {
  if (!process.env.GITHUB_TOKEN) {
    return NextResponse.json(
      { error: "GitHub token not configured" },
      { status: 500 }
    );
  }

  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  try {
    const response = await octokit.orgs.listForUser({
      username: "zvielkoren",
    });

    const organizations = response.data.map((org) => ({
      name: org.login,
      mission: org.description,
      link: org.url, // Ensure the correct URL field is used
      logo: org.avatar_url, // Assuming `avatar_url` is the logo URL
    }));

    return NextResponse.json(organizations);
  } catch (error) {
    console.error("Error fetching organizations data:", error);
    return NextResponse.json(
      { error: "Failed to fetch organizations" },
      { status: 500 }
    );
  }
}
