import { NextRequest, NextResponse } from 'next/server';

interface WebsiteVersion {
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

async function fetchVersionsFromCloudflareWorkers(clientVersionData?: Partial<WebsiteVersion>): Promise<WebsiteVersion[]> {
  // Cloudflare Workers and Pages endpoints for version retrieval
  const CLOUDFLARE_VERSIONS_WORKERS_API = 'https://versions.zvielkoren.workers.dev/versions';
  const CLOUDFLARE_VERSIONS_PAGES_API = 'https://versions.zviel-websit.pages.dev/versions';

  try {
    // Fetch from both endpoints concurrently
    const [workersResponse, pagesResponse] = await Promise.allSettled([
      fetch(CLOUDFLARE_VERSIONS_WORKERS_API, {
        method: 'GET',
      }),
      fetch(CLOUDFLARE_VERSIONS_PAGES_API, {
        method: 'GET',
      })
    ]);

    const versions: WebsiteVersion[] = [];

    // Process Workers API response
    if (workersResponse.status === 'fulfilled') {
      const workersData = await workersResponse.value.json();
      versions.push(...workersData);
    }

    // Process Pages API response
    if (pagesResponse.status === 'fulfilled') {
      const pagesData = await pagesResponse.value.json();
      versions.push(...pagesData);
    }

    // Filter versions based on client input if provided
    if (clientVersionData) {
      return versions.filter(version => 
        Object.entries(clientVersionData).every(([key, value]) => 
          version[key as keyof WebsiteVersion] === value
        )
      );
    }

    return versions;
  } catch (error) {
    console.error('Versions Fetch Error:', error);
    return [];
  }
}

export async function GET(
  request: NextRequest, 
  { params }: { params: { version: string } }
) {
  try {
    // Construct a new URL with the version filter
    const url = new URL(`https://example.com/versions?version=${params.version}`);
    
    // Create a mock request with the filtered URL
    const filteredRequest = new NextRequest(url);
    
    // Import the fetchVersionsFromCloudflareWorkers function from the parent route
    const { fetchVersionsFromCloudflareWorkers } = await import('../route');
    
    const versions = await fetchVersionsFromCloudflareWorkers({ version: params.version });
    const foundVersion = versions[0];
    
    if (foundVersion) {
      return NextResponse.json(foundVersion);
    }
    
    return NextResponse.json({ 
      error: `Version ${params.version} not found` 
    }, { status: 404 });
  } catch (error) {
    console.error('Specific Version Fetch Error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch specific version', 
      details: error instanceof Error ? {
        message: error.message,
        name: error.name
      } : 'Unknown error'
    }, { status: 500 });
  }
}
