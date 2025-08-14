// /app/api/projects/[owner]/[repo]/route.ts
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { owner: string; repo: string } }
) {
  const { owner, repo } = params;

  if (!process.env.GITHUB_TOKEN) {
    return NextResponse.json(
      { error: "GitHub token not configured" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3.raw",
      },
    });

    if (!res.ok) {
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
