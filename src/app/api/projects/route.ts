import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";
import { getProjects, addProject, deleteProject } from "@/lib/portfolioService";
import { getEnvVar } from "@/utils/env";

export const runtime = 'edge';

interface GitHubRepository {
  owner: any;
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
  private: boolean;
}

export async function GET() {
  console.log("Projects API: GET request received");
  
  try {
    // 1. Check if there are any projects in the database/in-memory service
    const savedProjects = await getProjects();
    if (savedProjects.length > 0) {
      console.log(`Projects API: Returning ${savedProjects.length} saved projects from database.`);
      return NextResponse.json(savedProjects);
    }

    // 2. If no saved projects, check if we can fetch from GitHub
    const githubToken = getEnvVar("GITHUB_TOKEN");
    if (!githubToken) {
      console.warn("Projects API: GITHUB_TOKEN is not configured.");
      return NextResponse.json(
        [],
        {
          status: 200,
          headers: {
            "X-Offline-Snapshot": "true"
          }
        }
      );
    }

    const octokit = new Octokit({
      auth: githubToken,
    });

    const userIds = ["132788625"]; // Specific GitHub user IDs
    const fetchedProjects = [];

    for (const id of userIds) {
      console.log(`Projects API: Fetching repos for user ID ${id}`);
      try {
        const response = await octokit.request(`GET /user/${id}/repos`, {
          per_page: 100,
          sort: "updated",
          direction: "desc",
          type: "all",
        });
        
        console.log(`Projects API: Found ${response.data.length} repos for user ${id}`);

        const userProjects = response.data.map((repo: GitHubRepository) => ({
          id: repo.id.toString(),
          name: repo.name,
          description: repo.description || "",
          githubLink: repo.html_url,
          owner: id, 
          ownerName: repo.owner?.login || "Unknown",
          stars: repo.stargazers_count,
          language: repo.language || "Not Specified",
          private: repo.private,
        }));

        fetchedProjects.push(...userProjects);
      } catch (userError) {
        console.error(`Projects API: Error fetching repositories for user ID ${id}:`, userError);
        continue;
      }
    }

    // Save fetched projects into the database for future hits
    for (const proj of fetchedProjects) {
      await addProject(proj);
    }

    console.log(`Projects API: Returning ${fetchedProjects.length} dynamic projects from GitHub`);
    return NextResponse.json(fetchedProjects);
  } catch (error) {
    console.error("Projects API: Unexpected error in projects route:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch projects",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, description, githubLink, owner, ownerName, stars, language, private: isPrivate } = body;
    
    if (!name) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 });
    }

    const newProject = await addProject({
      id: id || Date.now().toString(),
      name,
      description: description || "",
      githubLink: githubLink || "",
      owner: owner || "manual",
      ownerName: ownerName || "manual",
      stars: Number(stars) || 0,
      language: language || "TypeScript",
      private: Boolean(isPrivate)
    });

    return NextResponse.json({ success: true, project: newProject });
  } catch (error) {
    console.error("Projects API POST error:", error);
    return NextResponse.json(
      { error: "Failed to create project", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const success = await deleteProject(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("Projects API DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete project", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
