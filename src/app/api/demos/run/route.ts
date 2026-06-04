import { NextRequest, NextResponse } from 'next/server';
import { CodeRunner } from '@/utils/codeRunner';
// Extend the global scope to include D1
declare global {
  var D1: any;
}

// Initialize D1 database
const d1Database = globalThis.D1;

export async function POST(request: NextRequest) {
  try {
    const { demoId, code, language } = await request.json();

    if (!demoId || !code || !language) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await CodeRunner.runCode(demoId, code, language);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error running code:', error);
    return NextResponse.json(
      { error: 'Failed to run code', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const demoId = searchParams.get('id');

    if (!demoId) {
      return NextResponse.json(
        { error: 'Demo ID is required' },
        { status: 400 }
      );
    }

    CodeRunner.stopCode(demoId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error stopping code:', error);
    return NextResponse.json(
      { error: 'Failed to stop code', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
