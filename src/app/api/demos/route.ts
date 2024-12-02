import { NextRequest, NextResponse } from 'next/server';
import { getD1Client } from '@/lib/db';

export const runtime = 'edge';

/**
 * GET /api/demos
 * Fetches a list of active demos along with their features and files.
 */
export async function GET(request: NextRequest) {
  try {
    const db = getD1Client();

    const results = await db.prepare(`
      SELECT 
        d.id, 
        d.title, 
        d.description, 
        d.url, 
        d.imageUrl, 
        d.fileType, 
        d.filePath,
        GROUP_CONCAT(f.name) as features,
        GROUP_CONCAT(df.path) as file_paths,
        GROUP_CONCAT(df.name) as file_names
       FROM Demo d
       LEFT JOIN Feature f ON d.id = f.demoId
       LEFT JOIN DemoFile df ON d.id = df.demoId
       WHERE d.isActive = 1
       GROUP BY d.id
    `).all();

    if (!results?.results) {
      return NextResponse.json({ demos: [] });
    }

    const demos = results.results.map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      url: row.url,
      imageUrl: row.imageUrl,
      fileType: row.fileType,
      filePath: row.filePath,
      features: row.features ? row.features.split(',') : [],
      files: row.file_paths
        ? row.file_paths.split(',').map((path: string, index: number) => ({
            path,
            name: row.file_names ? row.file_names.split(',')[index] : null,
          }))
        : [],
    }));

    return NextResponse.json({ demos });
  } catch (error) {
    console.error('Error fetching demos:', error);

    // Use type guard to handle 'unknown' type
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Failed to fetch demos', details: error.message },
        { status: 500 }
      );
    }

    // Handle generic unknown error
    return NextResponse.json(
      { error: 'Failed to fetch demos', details: 'An unknown error occurred' },
      { status: 500 }
    );
  }
}


/**
 * DELETE /api/demos?id=<demoId>
 * Soft deletes a demo by setting isActive to 0.
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Demo ID is required' }, { status: 400 });
    }

    const db = getD1Client();
    await db.prepare(`UPDATE Demo SET isActive = 0 WHERE id = ?`).bind(id).run();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting demo:', error);
    function getErrorMessage(error: unknown): string {
      return error instanceof Error ? error.message : 'An unknown error occurred';
    }
    
    // Usage in a catch block
    return NextResponse.json(
      { error: 'Failed to fetch demos', details: getErrorMessage(error) },
      { status: 500 }
    );
    
  }
}

