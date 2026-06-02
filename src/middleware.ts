import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const isLoggedIn = request.cookies.get('auth_token');

    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

// Next.js expects runtime and matcher definitions to be properties of a 'config' object
export const config = {
    runtime: 'edge',
};