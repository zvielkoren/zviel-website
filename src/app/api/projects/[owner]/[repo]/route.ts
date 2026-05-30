// /app/api/projects/[owner]/[repo]/route.ts
import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ owner: string; repo: string }> }
) {
  const { owner, repo } = await params;

  const MOCK_READMES: Record<string, string> = {
    "zviel-website": `# Zviel's Portfolio & Dev Platform

A state-of-the-art personal developer portal built with a modern high-performance stack.

## Tech Stack
- **Framework:** Next.js (App Router, Edge Runtime)
- **Styling:** Tailwind CSS v4 & Vanilla CSS custom design tokens
- **Interactive UI:** HeroUI & Framer Motion
- **Deployment:** Cloudflare Workers & Pages

---

### Features
* **Glassmorphic Design:** Gorgeous ambient glowing grids with rich typography and micro-animations.
* **Accessibility Widget:** Embedded user preferences for font sizes, high-contrast levels, and custom settings.
* **Edge Optimized:** Next.js pages configured for lightning-fast Edge runtimes.`,
    
    "rusty-compiler": `# Rusty Compiler

An experimental ahead-of-time micro-compiler engineered in Rust, compiling a custom typed language directly into optimized x86-64 assembly.

## Key Features
- **Lexical & Syntactic Analysis:** Hand-written recursive descent parser.
- **Type Checker:** Strict compile-time typing with elegant error reports.
- **Code Generation:** Generates raw x86-64 assembly compatible with \`gcc\`.

---

### Architecture
1. **Source Input:** \`.rc\` custom syntax scripts.
2. **AST Construction:** Token stream parsed into abstract syntax tree.
3. **Emitter:** Raw assembly output files ready to compile.`,

    "ai-agent-sdk": `# AI Agent SDK

An autonomous agent orchestration SDK for executing stateful, multi-agent workflows with strict schema-conforming tool execution and real-time visualization.

## Features
- **Strict Structured Outputs:** Native JSON Schema enforcement.
- **Visual Debugger UI:** Real-time state machine viewer.
- **Flexible Tooling:** Asynchronous, isolated function call bindings.

---

### Quick Start
\`\`\`python
from agent_sdk import Agent, Tool

agent = Agent(
    model="gemini-2.5",
    instructions="You are a helpful assistant."
)
\`\`\``
  };

  if (!process.env.GITHUB_TOKEN) {
    const mockReadme = MOCK_READMES[repo.toLowerCase()] || `# ${repo}\n\nLocal development mock repository content. Configure \`GITHUB_TOKEN\` to load active live GitHub data.`;
    return NextResponse.json(
      { readme: mockReadme },
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
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
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
