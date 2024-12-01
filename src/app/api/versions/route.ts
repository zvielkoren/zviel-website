import { NextRequest, NextResponse } from 'next/server';
import { fetchVersionsFromCloudflareWorkers } from './versionsUtils';

// Add Edge Runtime configuration
export const runtime = 'edge';

// Define WebsiteVersion interface
export interface WebsiteVersion {
  version: string;
  deploymentDate: string;
  commitHash: string;
  changelog: Array<{
    type: 'feat' | 'fix' | 'docs' | 'chore';
    description: string;
    date: string;
  }>;
  type?: 'feat' | 'fix' | 'docs' | 'chore';
  description?: string;
  date?: string;
  deploymentPlatform: 'Cloudflare Workers' | 'Cloudflare Workers/Pages';
  links: {
    website: string;
    repository?: string;
  };
  native?: {
    title: string;
    description: string;
    technicalDetails: string[];
    challenges: string[];
    learnings: string[];
    imageUrl?: string;
  };
  originalCommits?: {
    hash: string;
    message: string;
    date: string;
    author: string;
  }[];
  hash?: string;
  message?: string;
  author?: string;
}

export async function GET(request: NextRequest) {
  // Log incoming request and query parameters
  console.log('Incoming version request URL:', request.url);
  
  const { searchParams } = new URL(request.url);
  const websiteFilter = searchParams.get('website');
  const versionFilter = searchParams.get('version');
  const platformFilter = searchParams.get('platform');

  console.log('Filters:', { 
    website: websiteFilter, 
    version: versionFilter,
    platform: platformFilter 
  });

  try {
    // Create client version data object based on query parameters
    const clientVersionData: Partial<WebsiteVersion> | undefined = websiteFilter || versionFilter || platformFilter 
      ? {
          ...(websiteFilter && { links: { website: websiteFilter } }),
          ...(versionFilter && { version: versionFilter }),
          ...(platformFilter && { deploymentPlatform: platformFilter as 'Cloudflare Workers' | 'Cloudflare Workers/Pages' })
        } 
      : undefined;

    // Fetch versions with optional filtering
    const versions = await fetchVersionsFromCloudflareWorkers(clientVersionData);
    
    // Log the number of versions returned
    console.log(`Returned ${versions.length} versions`);

    // Sort versions in descending order
    const sortedVersions = versions.sort((a, b) => 
      new Date(b.deploymentDate).getTime() - new Date(a.deploymentDate).getTime()
    );

    return NextResponse.json(sortedVersions);
  } catch (error) {
    // Log detailed error information
    console.error('Version Fetch Error:', error);
    
    return NextResponse.json({ 
      error: 'Failed to fetch website versions', 
      details: error instanceof Error ? {
        message: error.message,
        name: error.name,
        filters: { 
          website: websiteFilter, 
          version: versionFilter,
          platform: platformFilter 
        }
      } : 'Unknown error'
    }, { status: 500 });
  }
}