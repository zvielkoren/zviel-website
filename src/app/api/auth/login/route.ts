import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';

// Add Edge Runtime configuration
export const runtime = 'edge';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use environment variable in production

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // In a real application, you would verify against a database
    // This is just a simple example - replace with your actual authentication logic
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
      // Create JWT token using jose
      const secret = new TextEncoder().encode(JWT_SECRET);
      const token = await new jose.SignJWT({ username })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('1h')
        .sign(secret);
      
      // Set cookie
      cookies().set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600 // 1 hour
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
