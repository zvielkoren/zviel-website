import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface WebsiteVersion {
  version: string;
  commitCount: number;
  lastCommitHash: string;
  generatedAt: string;
  changeLog: Array<{
    hash: string;
    message: string;
    author: string;
  }>;
}

export async function GET() {
  try {
    const versionsPath = path.join(process.cwd(), '.versions', 'current.json');
    
    // Check if versions file exists
    if (!fs.existsSync(versionsPath)) {
      return NextResponse.json({ 
        error: 'Version tracking file not found',
        details: 'Ensure GitHub Actions workflow has run'
      }, { status: 404 });
    }

    // Read versions file
    const versionData = JSON.parse(
      fs.readFileSync(versionsPath, 'utf8')
    ) as WebsiteVersion;

    return NextResponse.json(versionData);
  } catch (error) {
    console.error('Version Fetch Error:', error);

    return NextResponse.json({ 
      error: 'Failed to fetch website version', 
      details: error instanceof Error ? {
        message: error.message,
        name: error.name
      } : 'Unknown error'
    }, { status: 500 });
  }
}