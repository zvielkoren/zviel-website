import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
    const isLoggedIn = request.cookies.get('auth_token');

    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        if (!isLoggedIn) {
            const url = request.nextUrl.clone();
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*'],
};

export const runtime = 'edge';
