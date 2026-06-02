import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import { getEnvVar } from '@/utils/env';

// Add Edge Runtime configuration
export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    const jwtSecret = getEnvVar('JWT_SECRET') || 'your-secret-key';
    const adminUsername = getEnvVar('ADMIN_USERNAME');
    const adminPassword = getEnvVar('ADMIN_PASSWORD');

    // In a real application, you would verify against a database
    // This is just a simple example - replace with your actual authentication logic
    if (username && username === adminUsername && password && password === adminPassword) {
      // Create JWT token using jose
      const secret = new TextEncoder().encode(jwtSecret);
      const token = await new jose.SignJWT({ username })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('1h')
        .sign(secret);
      
      // Set cookie
      (await cookies()).set('auth_token', token, {
        httpOnly: true,
        secure: getEnvVar('NODE_ENV') === 'production',
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
