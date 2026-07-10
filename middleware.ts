import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/signup', '/'];
const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const boardMatch = pathname.match(/^\/board\/([^/]+)/);
  const token =
    req.cookies.get('token')?.value ??
    req.headers.get('authorization')?.replace('Bearer ', '');
  const isPublic = PUBLIC_ROUTES.some((r) => pathname === r);
  if (boardMatch) {
    const boardId = boardMatch[1];
    if (!OBJECT_ID_REGEX.test(boardId)) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
  // No token → redirect to login for protected routes
  if (!token && !isPublic) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Already logged in → redirect away from auth pages
  if (token && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|api).*)'],
};
