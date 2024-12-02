import { NextResponse } from 'next/server';
import type { D1Database } from '@cloudflare/workers-types';
import { getD1Client } from '@/lib/db';

// Add Edge Runtime configuration
export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const d1Database: D1Database = getD1Client();
    const { demoId, featureName } = await request.json();

    // Validate input
    if (!demoId || !featureName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if demo exists
    const demoResult = await d1Database.prepare(
      'SELECT * FROM Demo WHERE id = ?'
    ).bind(demoId).first();

    if (!demoResult) {
      return NextResponse.json({ error: 'Demo not found' }, { status: 404 });
    }

    // Create feature
    const result = await d1Database.prepare(
      'INSERT INTO Feature (name, demoId, isEnabled) VALUES (?, ?, ?)'
    ).bind(featureName, demoId, true).run() as unknown as { lastRowId: number };

    return NextResponse.json({ 
      id: result.lastRowId,
      name: featureName,
      demoId,
      isEnabled: true
    });
  } catch (error) {
    console.error('Error creating feature:', error);
    return NextResponse.json({ error: 'Failed to create feature' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const d1Database: D1Database = getD1Client();
    const { id, isEnabled } = await request.json();

    const result = await d1Database.prepare(
      'UPDATE Feature SET isEnabled = ? WHERE id = ?'
    ).bind(isEnabled, id).run();

    // Check if any rows were affected using meta.changes
    if (!result.meta?.changes || result.meta.changes === 0) {
      return NextResponse.json({ error: 'Feature not found' }, { status: 404 });
    }

    return NextResponse.json({ id, isEnabled });
  } catch (error) {
    console.error('Error updating feature:', error);
    return NextResponse.json({ error: 'Failed to update feature' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const d1Database: D1Database = getD1Client();
    const { featureId } = await request.json();

    if (!featureId) {
      return NextResponse.json({ error: 'Feature ID is required' }, { status: 400 });
    }

    const result = await d1Database.prepare(
      'DELETE FROM Feature WHERE id = ?'
    ).bind(featureId).run() as unknown as { changes: number };

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Feature not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Feature deleted successfully' });
  } catch (error) {
    console.error('Error deleting feature:', error);
    return NextResponse.json({ error: 'Failed to delete feature' }, { status: 500 });
  }
}
