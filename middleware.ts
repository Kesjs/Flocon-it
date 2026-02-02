import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Middleware simplifié sans Supabase pour tester Hostinger
  
  // Routes protégées (temporairement désactivées pour le test)
  // const protectedRoutes = ['/dashboard', '/checkout']
  // const authRoutes = ['/login', '/register']
  // const { pathname } = request.nextUrl

  // Pour l'instant, on laisse tout passer
  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  })
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
