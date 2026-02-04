import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protéger les routes admin sauf la page de login
  if (pathname.startsWith('/dashboard/admin') || pathname.startsWith('/admin/')) {
    // Autoriser la page de login admin
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Vérifier le token admin
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      // Rediriger vers la page de login admin
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/admin/:path*', '/admin/:path*'],
};
