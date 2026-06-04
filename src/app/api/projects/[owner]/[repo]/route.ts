// /app/api/projects/[owner]/[repo]/route.ts
import { NextResponse } from "next/server";
import { getEnvVar } from "@/utils/env";
export async function GET(
  req: Request,
  { params }: { params: Promise<{ owner: string; repo: string }> }
) {
  const { owner, repo } = await params;

  const githubToken = getEnvVar("GITHUB_TOKEN");
  if (!githubToken) {
    return NextResponse.json(
      { readme: `# ${repo}\n\nConfigure \`GITHUB_TOKEN\` to load active live GitHub data.` },
      {
        status: 200,
        headers: {
          "X-Offline-Snapshot": "true"
        }
      }
    );
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
      headers: {
        Authorization: `token ${githubToken}`,
        Accept: "application/vnd.github.v3.raw",
      },
    });

    if (!res.ok) {
      if (res.status === 404) {
        // README not found
        return NextResponse.json({ readme: "" }, { status: 200 });
      }
      return NextResponse.json(
        { error: "Failed to fetch README" },
        { status: res.status }
      );
    }

    const readmeText = await res.text();
    return NextResponse.json({ readme: readmeText });
  } catch (err: any) {
    console.error("Error fetching README:", err);
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}
