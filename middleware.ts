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

  // Timeout protection pour éviter les latences 7s
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Supabase timeout')), 5000);
  });

  let user = null;
  try {
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

    // Vérification avec timeout et fail-safe
    const sessionPromise = supabase.auth.getSession();
    const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise]) as any;
    user = session?.user || null;
  } catch (error) {
    // En cas d'erreur ou timeout, continuer sans utilisateur (fail-safe)
    console.warn('Supabase auth error in middleware:', error);
    user = null;
  }

  // PRIORITÉ ABSOLUE : Routes Admin - Traitement isolé
  if (request.nextUrl.pathname.startsWith('/admin')) {
    console.log('🔐 Route admin détectée:', request.nextUrl.pathname)
    
    // 🚨 EXCEPTION : /admin/login est accessible sans session
    if (request.nextUrl.pathname === '/admin/login') {
      console.log('🔓 Accès à /admin/login autorisé sans session')
      return response
    }
    
    // Vérifier la session admin sécurisée
    const sessionToken = request.cookies.get('admin_session')?.value;
    
    if (!sessionToken) {
      console.log('❌ Session admin manquante')
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Vérifier si la session est valide (base64)
    try {
      const sessionData = JSON.parse(Buffer.from(sessionToken, 'base64').toString());
      
      // Vérifier si la session n'est pas expirée (8 heures)
      const isExpired = Date.now() - sessionData.timestamp > 8 * 60 * 60 * 1000;
      
      if (isExpired) {
        console.log('❌ Session admin expirée')
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
      
      console.log('✅ Session admin valide - Accès autorisé')
      return response // Autoriser l'accès admin sans aucune autre règle
      
    } catch (decodeError) {
      console.log('❌ Session admin invalide')
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // EXCLURE les routes admin Flocon du middleware principal
  if (request.nextUrl.pathname.startsWith('/Flocon/admin')) {
    return response
  }

  // Routes protégées - uniquement celles qui nécessitent une auth stricte
  const protectedRoutes = ['/checkout'] // /dashboard géré côté client
  const authRoutes = ['/login', '/register']
  const { pathname } = request.nextUrl

  // 🎯 EXCEPTION : Page de succès FST accessible sans authentification
  if (pathname.startsWith('/checkout/success-fst')) {
    console.log('🔓 Accès à la page de succès FST autorisé sans session')
    return response
  }

  if (!user && protectedRoutes.some(route => pathname.startsWith(route))) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  if (user && authRoutes.some(route => pathname.startsWith(route)) && !pathname.startsWith('/admin')) {
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
