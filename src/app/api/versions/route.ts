import { NextResponse } from 'next/server';

interface VersionNative {
  title: string;
  description: string;
  technicalDetails: string[];
  challenges: string[];
  learnings: string[];
  imageUrl?: string;
}

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
  native?: VersionNative;
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

// Fetch versions from Cloudflare Workers KV or Worker
async function fetchVersionsFromCloudflareWorkers(clientVersionData?: Partial<WebsiteVersion>): Promise<WebsiteVersion[]> {
  // Cloudflare Workers and Pages endpoints for version retrieval
  const CLOUDFLARE_VERSIONS_WORKERS_API = 'https://versions.zvielkoren.workers.dev/versions';
  const CLOUDFLARE_VERSIONS_PAGES_API = 'https://versions.zviel-websit.pages.dev/versions';

  try {
    // Fetch from both endpoints concurrently
    const [workersResponse, pagesResponse] = await Promise.allSettled([
      fetch(CLOUDFLARE_VERSIONS_WORKERS_API, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      }),
      fetch(CLOUDFLARE_VERSIONS_PAGES_API, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      })
    ]);

    // Process and combine versions
    const combinedVersions: WebsiteVersion[] = [];
    const seenVersions = new Set<string>();

    // Helper function to process a response
    const processResponse = async (response: PromiseFulfilledResult<Response> | PromiseRejectedResult) => {
      if (response.status === 'fulfilled' && response.value.ok) {
        const data: WebsiteVersion[] = await response.value.json();
        data.forEach(version => {
          // Avoid duplicates by checking version and deploymentDate
          const versionKey = `${version.version}-${version.deploymentDate}`;
          
          // If no client version data is provided, add all versions
          // Otherwise, check if the version matches client-provided data
          const matchesClientData = !clientVersionData || Object.entries(clientVersionData).every(
            ([key, value]) => {
              // Special handling for nested objects like links
              if (key === 'links') {
                return Object.entries(value as object).every(
                  ([linkKey, linkValue]) => version.links?.[linkKey as keyof typeof version.links] === linkValue
                );
              }
              return version[key as keyof WebsiteVersion] === value;
            }
          );

          if (matchesClientData && !seenVersions.has(versionKey)) {
            seenVersions.add(versionKey);
            combinedVersions.push({
              ...version,
              deploymentPlatform: 'Cloudflare Workers/Pages',
              links: {
                website: 'https://zvielkoren.com',
                repository: 'https://github.com/zvielkoren/zviel-website',
                ...version.links
              }
            });
          }
        });
      }
    };

    // Process both responses
    await Promise.all([
      processResponse(workersResponse),
      processResponse(pagesResponse)
    ]);

    // If no versions match client data but client data was provided, 
    // create a version based on client data
    // Otherwise, return all combined versions
    return combinedVersions.length > 0 ? combinedVersions : (
      clientVersionData ? [
        {
          version: clientVersionData?.version || '0.0.1',
          deploymentDate: clientVersionData?.deploymentDate || new Date().toISOString(),
          commitHash: clientVersionData?.commitHash || 'custom-version',
          changelog: clientVersionData?.changelog || [],
          deploymentPlatform: 'Cloudflare Workers/Pages',
          links: {
            website: clientVersionData?.links?.website || 'https://zvielkoren.com',
            repository: clientVersionData?.links?.repository
          },
          ...clientVersionData
        }
      ] : combinedVersions
    );
  } catch (error) {
    console.error('Failed to fetch versions from Cloudflare:', error);
    
    // Fallback versions if fetch fails
    return [
      {
        version: clientVersionData?.version || '0.0.1',
        deploymentDate: clientVersionData?.deploymentDate || new Date().toISOString(),
        commitHash: clientVersionData?.commitHash || 'fallback-version',
        changelog: clientVersionData?.changelog || [],
        deploymentPlatform: 'Cloudflare Workers/Pages',
        links: {
          website: clientVersionData?.links?.website || 'https://zvielkoren.com',
          repository: clientVersionData?.links?.repository
        },
        native: {
          title: 'Fallback Version',
          description: 'Unable to fetch versions from Cloudflare',
          technicalDetails: ['Fallback mode activated'],
          challenges: ['Network connectivity issue'],
          learnings: ['Implement robust error handling']
        },
        ...clientVersionData
      }
    ];
  }
}

export async function GET(clientVersionData?: Partial<WebsiteVersion>) {
  try {
    // Fetch versions from Cloudflare Workers
    const versions = await fetchVersionsFromCloudflareWorkers(clientVersionData);
    
    // Sort versions in descending order
    const sortedVersions = versions.sort((a, b) => 
      new Date(b.deploymentDate).getTime() - new Date(a.deploymentDate).getTime()
    );

    return NextResponse.json(sortedVersions);
  } catch (error) {
    console.error('Version Fetch Error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch website versions', 
      details: error instanceof Error ? {
        message: error.message,
        name: error.name
      } : 'Unknown error'
    }, { status: 500 });
  }
}

// Route to get specific version by version number
export async function GET_VERSION(version: string, clientVersionData?: Partial<WebsiteVersion>) {
  try {
    const versions = await fetchVersionsFromCloudflareWorkers(clientVersionData);
    const foundVersion = versions.find(v => v.version === version);
    
    if (foundVersion) {
      return NextResponse.json(foundVersion);
    }
    
    return NextResponse.json({ 
      error: `Version ${version} not found` 
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