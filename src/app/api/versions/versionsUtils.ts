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
  deploymentPlatform: 'Cloudflare Workers' | 'Cloudflare Workers/Pages' | 'Local Development';
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

// Cloudflare Deployments API function
export async function fetchCloudflareDeployments(): Promise<WebsiteVersion[]> {
  const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
  const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
  const PROJECT_NAME = 'zviel-websit';

  if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_API_TOKEN) {
    console.error('Cloudflare API credentials not configured');
    return [];
  }

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/pages/projects/${PROJECT_NAME}/deployments`, 
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cloudflare API Error:', errorText);
      return [];
    }

    const data = await response.json();

    // Validate API response structure
    if (!data || !data.result || !Array.isArray(data.result)) {
      console.error('Invalid Cloudflare API response structure:', data);
      return [];
    }

    // Transform Cloudflare deployments to WebsiteVersion
    return data.result.map((deployment: any) => ({
      version: deployment.short_id,
      deploymentDate: deployment.created_on,
      commitHash: deployment.id,
      deploymentPlatform: 'Cloudflare Workers/Pages',
      changelog: [
        {
          type: 'chore',
          description: deployment.deployment_trigger?.metadata?.commit_message || 'Deployment',
          date: deployment.created_on
        }
      ],
      links: {
        website: deployment.url,
        repository: `https://github.com/${deployment.source.config.owner}/${deployment.source.config.repo_name}`
      },
      description: `Deployment ${deployment.short_id}`,
      native: {
        title: `Cloudflare Pages Deployment ${deployment.short_id}`,
        description: `Commit: ${deployment.deployment_trigger?.metadata?.commit_hash || 'Unknown'}`,
        technicalDetails: [
          `Environment: ${deployment.environment}`,
          `Build Command: ${deployment.build_config?.build_command || 'N/A'}`
        ]
      }
    }));
  } catch (error) {
    console.error('Failed to fetch Cloudflare deployments:', error);
    return [];
  }
}

// Fetch versions from Cloudflare Workers KV or Worker
export async function fetchVersionsFromCloudflareWorkers(clientVersionData?: Partial<WebsiteVersion>): Promise<WebsiteVersion[]> {
  // Hardcoded fallback versions for local development
  const FALLBACK_VERSIONS: WebsiteVersion[] = [
    {
      version: '1.0.0',
      deploymentDate: new Date().toISOString(),
      commitHash: 'local-dev',
      deploymentPlatform: clientVersionData?.deploymentPlatform ?? 'Local Development',
      changelog: [{ 
        type: 'chore', 
        description: 'Local development fallback version', 
        date: new Date().toISOString() 
      }],
      links: {
        website: 'http://localhost:3000',
        repository: 'https://github.com/zvielkoren/zviel-websit'
      },
      native: {
        title: 'Local Development Version',
        description: 'Fallback version for local development',
        technicalDetails: ['Versions API not accessible'],
        challenges: ['Limited functionality in local environment'],
        learnings: ['Implementing fallback mechanisms']
      }
    }
  ];

  // Cloudflare Workers and Pages endpoints for version retrieval
  const CLOUDFLARE_VERSIONS_WORKERS_API = 'https://versions.zvielkoren.workers.dev/versions';
  const CLOUDFLARE_VERSIONS_PAGES_API = 'https://f599de7b.zviel-websit.pages.dev/versions';

  // Helper function to safely fetch JSON from an endpoint
  const safeFetchJson = async (url: string): Promise<WebsiteVersion[]> => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        cache: 'no-store'
      });

      console.log(`Fetching versions from ${url}`);
      console.log('Response Status:', response.status);
      console.log('Response Headers:', Object.fromEntries(response.headers.entries()));

      // Check content type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error(`Non-JSON response from ${url}. Content-Type: ${contentType}`);
        return [];
      }

      // Check if response is OK
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error fetching versions from ${url}:`, errorText);
        return [];
      }

      // Try to parse JSON
      try {
        const data = await response.json();
        return Array.isArray(data) ? data : [];
      } catch (jsonError) {
        console.error(`JSON parsing error for ${url}:`, jsonError);
        return [];
      }
    } catch (error) {
      console.error(`Fetch error for ${url}:`, error);
      return [];
    }
  };

  try {
    // Fetch from Workers, Pages, and Cloudflare Deployments
    const [workersVersions, pagesVersions, cloudflareDeployments] = await Promise.all([
      safeFetchJson(CLOUDFLARE_VERSIONS_WORKERS_API),
      safeFetchJson(CLOUDFLARE_VERSIONS_PAGES_API),
      fetchCloudflareDeployments()
    ]);

    // Combine all versions, with fallback if no versions are found
    const versions: WebsiteVersion[] = [
      ...workersVersions, 
      ...pagesVersions, 
      ...cloudflareDeployments
    ];

    // If no versions found, use fallback
    const finalVersions = versions.length > 0 ? versions : FALLBACK_VERSIONS;

    // Filter versions based on client data if provided
    const filteredVersions = clientVersionData 
      ? finalVersions.filter(version => 
          (!clientVersionData.version || version.version === clientVersionData.version) &&
          (!clientVersionData.links?.website || version.links.website === clientVersionData.links.website) &&
          (!clientVersionData.deploymentPlatform || version.deploymentPlatform === clientVersionData.deploymentPlatform)
        )
      : finalVersions;

    // Sort versions by deployment date in descending order
    return filteredVersions.sort((a, b) => 
      new Date(b.deploymentDate).getTime() - new Date(a.deploymentDate).getTime()
    );

  } catch (error) {
    console.error('Comprehensive versions fetch error:', error);
    return FALLBACK_VERSIONS;
  }
}
