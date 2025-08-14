import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";


// Add Edge Runtime configuration
export const runtime = 'edge';
// Add type definition for GitHub Repository
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
    const userIds = ["132788625"]; // Specific GitHub user IDs
    const fetchedProjects = [];

    for (const id of userIds) {
      try {
        const response = await octokit.request(`GET /user/${id}/repos`, {
          per_page: 100,
          sort: "updated",
          direction: "desc",
          type: "all", // Include both public and private repositories
        });

        const userProjects = response.data.map((repo: GitHubRepository) => ({
          id: repo.id.toString(),
          name: repo.name,
          description: repo.description || "",
          githubLink: repo.html_url,
          owner: id, 
          ownerName: repo.owner?.login || "Unknown",
          stars: repo.stargazers_count,
          language: repo.language,
          updatedAt: repo.updated_at,
          private: repo.private,
        }));

        fetchedProjects.push(...userProjects);
      } catch (userError) {
        console.error(
          `Error fetching repositories for user ID ${id}:`,
          userError
        );
        continue;
      }
    }

    return NextResponse.json(fetchedProjects);
  } catch (error) {
    console.error("Unexpected error in projects route:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch projects",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
