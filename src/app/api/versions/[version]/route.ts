import { NextRequest, NextResponse } from 'next/server';
import { fetchVersionsFromCloudflareWorkers } from '../versionsUtils';

// Add Edge Runtime configuration
export const runtime = 'edge';

export async function GET(
  request: NextRequest, 
  { params }: { params: { version: string } }
) {
  try {
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
