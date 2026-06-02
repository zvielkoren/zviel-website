import { NextResponse } from 'next/server';

// Mock in-memory feature store
interface Feature {
  id: number;
  name: string;
  demoId: string;
  isEnabled: boolean;
}
let __mockFeatures: Feature[] = [];
let __nextId = 1;

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { demoId, featureName } = await request.json();
    if (!demoId || !featureName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const id = __nextId++;
    const feature: Feature = { id, name: featureName, demoId, isEnabled: true };
    __mockFeatures.push(feature);
    return NextResponse.json(feature);
  } catch (error) {
    console.error('Error creating feature:', error);
    return NextResponse.json({ error: 'Failed to create feature' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, isEnabled } = await request.json();
    const feature = __mockFeatures.find(f => f.id === id);
    if (!feature) {
      return NextResponse.json({ error: 'Feature not found' }, { status: 404 });
    }
    feature.isEnabled = isEnabled;
    return NextResponse.json({ id, isEnabled });
  } catch (error) {
    console.error('Error updating feature:', error);
    return NextResponse.json({ error: 'Failed to update feature' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { featureId } = await request.json();
    if (!featureId) {
      return NextResponse.json({ error: 'Feature ID is required' }, { status: 400 });
    }
    const before = __mockFeatures.length;
    __mockFeatures = __mockFeatures.filter(f => f.id !== featureId);
    if (__mockFeatures.length === before) {
      return NextResponse.json({ error: 'Feature not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Feature deleted successfully' });
  } catch (error) {
    console.error('Error deleting feature:', error);
    return NextResponse.json({ error: 'Failed to delete feature' }, { status: 500 });
  }
}
