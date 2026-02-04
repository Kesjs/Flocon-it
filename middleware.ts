import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Headers CORS et optimisation France
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
  
  // Optimisation pour la France
  const country = request.nextUrl.searchParams.get('country') || 
                  request.headers.get('x-vercel-ip-country') || 
                  'Unknown';
  if (country === 'FR') {
    response.headers.set('X-France-Optimized', 'true')
    response.headers.set('Cache-Control', 'public, max-age=7200, must-revalidate')
  }
  
  // Headers SEO et sécurité
  response.headers.set('X-Robots-Tag', 'index, follow')
  response.headers.set('X-CDN-Cache', 'HIT')

  // Vérifier si les variables Supabase sont définies
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    // Continuer sans authentification Supabase si les variables ne sont pas définies
    return response
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Rafraîchit la session si elle a expiré.
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (error) {
    // En cas d'erreur Supabase, continuer sans utilisateur
    console.warn('Supabase auth error in middleware:', error);
  }

  // Routes protégées
  const protectedRoutes = ['/dashboard', '/checkout']
  const authRoutes = ['/login', '/register']
  const { pathname } = request.nextUrl

  // EXCLURE les routes admin Flocon du middleware principal
  if (pathname.startsWith('/Flocon/admin')) {
    return response
  }

  if (!user && protectedRoutes.some(route => pathname.startsWith(route))) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  if (user && authRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
