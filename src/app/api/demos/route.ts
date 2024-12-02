import { NextRequest, NextResponse } from 'next/server';
import { getD1Client } from '@/lib/db';

export const runtime = 'edge';

/**
 * GET /api/demos
 * 
 * Returns a list of demos.
 */
export async function GET(request: NextRequest) {
  try {
    const db = getD1Client();
    const results = await db.prepare(
      `SELECT 
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
       GROUP BY d.id`
    ).all();

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
      files: row.file_paths ? row.file_paths.split(',').map((path: string, index: number) => ({
        path,
        name: row.file_names ? row.file_names.split(',')[index] : null
      })) : []
    }));

    return NextResponse.json({ demos });
  } catch (error) {
    console.error('Error fetching demos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch demos', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const db = getD1Client();
    
    // Extract form fields
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const url = formData.get('url') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const fileType = formData.get('fileType') as string;
    const filePath = formData.get('filePath') as string;
    const features = formData.getAll('features[]').map(f => f.toString());
    
    // Start a transaction
    await db.prepare('BEGIN TRANSACTION').run();
    
    try {
      // Insert demo
      const result = await db.prepare(`
        INSERT INTO Demo (title, description, url, imageUrl, fileType, filePath, isActive)
        VALUES (?, ?, ?, ?, ?, ?, 1)
        RETURNING id
      `).bind(title, description, url, imageUrl, fileType, filePath).run();
      
      const demoId = result.results?.[0]?.id;
      
      if (!demoId) {
        throw new Error('Failed to insert demo');
      }

      // Insert features
      if (features.length > 0) {
        for (const feature of features) {
          await db.prepare(`
            INSERT INTO Feature (name, demoId, isEnabled)
            VALUES (?, ?, 1)
          `).bind(feature, demoId).run();
        }
      }

      // Handle file uploads
      const files = formData.getAll('files[]');
      if (files.length > 0) {
        for (const file of files) {
          if (file instanceof File) {
            const content = await file.arrayBuffer();
            await db.prepare(`
              INSERT INTO DemoFile (demoId, name, path, content, fileType, size)
              VALUES (?, ?, ?, ?, ?, ?)
            `).bind(
              demoId,
              file.name,
              `/uploads/${file.name}`,
              content,
              file.type,
              file.size
            ).run();
          }
        }
      }

      await db.prepare('COMMIT').run();
      return NextResponse.json({ success: true, demoId });
    } catch (error) {
      await db.prepare('ROLLBACK').run();
      throw error;
    }
  } catch (error) {
    console.error('Error creating demo:', error);
    return NextResponse.json(
      { error: 'Failed to create demo', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Demo ID is required' }, { status: 400 });
    }

    const db = getD1Client();
    
    // Soft delete the demo
    await db.prepare(`
      UPDATE Demo
      SET isActive = 0
      WHERE id = ?
    `).bind(id).run();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting demo:', error);
    return NextResponse.json(
      { error: 'Failed to delete demo', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
