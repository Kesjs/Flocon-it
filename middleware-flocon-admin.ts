import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protéger les routes Flocon admin sauf la page de login
  if (pathname.startsWith('/Flocon/admin')) {
    // Autoriser la page de login admin
    if (pathname === '/Flocon/admin/login') {
      return NextResponse.next();
    }

    // Vérifier le token admin depuis les cookies ou localStorage (via header)
    const token = request.cookies.get('flocon_admin_token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      // Rediriger vers la page de login admin
      return NextResponse.redirect(new URL('/Flocon/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/Flocon/admin/:path*'],
};
