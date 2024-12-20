import { NextRequest, NextResponse } from 'next/server';
import { getAllDemos, createDemo, deleteDemo } from '@/lib/demoService';
import path from 'path';
import JSZip from 'jszip';

export const runtime = 'edge';
/**
 * GET /api/demos
 * Fetches a list of active demos along with their features and files.
 */
export async function GET() {
  try {
    const demos = await getAllDemos();
    console.log('Fetched demos:', demos); // Log the fetched data
    return NextResponse.json({ demos });
  } catch (error) {
    console.error('Error fetching demos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch demos', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/demos
 * Creates a new demo with the provided details and files.
 */
export async function POST(request: NextRequest) {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*'); // Adjust this in production
  headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  try {
    const formData = await request.formData();
    
    // Extract form fields
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const url = formData.get('url') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const fileType = formData.get('fileType') as string;
    const features = formData.getAll('features[]').map(f => f.toString());
    
    // Handle file uploads
    const files = formData.getAll('files[]');
    const uploadedFiles = [];
    
    if (files.length > 0) {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      
      for (const file of files) {
        if (file instanceof File) {
          if (file.type === 'application/zip') {
            const zip = new JSZip();
            try {
              const unzippedFiles = await zip.loadAsync(file);
              unzippedFiles.forEach(async (relativePath, fileData) => {
                // Process each file in the unzipped content
                const content = await fileData.async("blob"); 
                const arrayBuffer = await content.arrayBuffer(); 
                const buffer = Buffer.from(arrayBuffer); 
                const fileName = `${Date.now()}-${relativePath}`;
                const filePath = path.join(uploadsDir, fileName);
                await writeFile(filePath, buffer); 
                uploadedFiles.push({
                  name: relativePath,
                  path: `/uploads/${fileName}`
                });
              });
            } catch (error) {
              console.error("Error unzipping file:", error);
              return NextResponse.json({ error: 'Failed to unzip the file' }, { status: 500 });
            }
          } else {
            // Handle non-ZIP files
            const fileName = `${Date.now()}-${file.name}`;
            const filePath = path.join(uploadsDir, fileName);
            const buffer = Buffer.from(await file.arrayBuffer());
            
            await writeFile(filePath, buffer);
            uploadedFiles.push({
              name: file.name,
              path: `/uploads/${fileName}`
            });
          }
        }
      }
    }
    
    // Create new demo
    const newDemo = await createDemo({
      title,
      description,
      url,
      imageUrl,
      fileType,
      filePath: uploadedFiles[0]?.path,
      features,
      files: uploadedFiles
    });
    
    return NextResponse.json({ success: true, demo: newDemo });
  } catch (error) {
    console.error('Error creating demo:', error);
    return NextResponse.json(
      { error: 'Failed to create demo', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/demos
 * Deletes a demo by ID.
 */
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id'); // Extract ID from the request
  try {
    // Check if id is null
    if (id === null) {
      return NextResponse.json({ error: 'ID is required to delete a demo' }, { status: 400 });
    }
    if (id === null || id === undefined) {
      return NextResponse.json({ error: 'ID is required to delete a demo' }, { status: 400 });
    }
    await deleteDemo(id); // Call the service to delete the demo
    return NextResponse.json({ message: 'Demo deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete demo' }, { status: 500 });
  }
}
