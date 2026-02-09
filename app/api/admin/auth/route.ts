import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    // Vérifier dans la table admins
    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('is_active', true)
      .single();

    if (error || !admin) {
      console.log('❌ Admin non trouvé:', email);
      return NextResponse.json(
        { success: false, error: 'Identifiants invalides' },
        { status: 401 }
      );
    }

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, admin.password_hash);
    
    if (!isValidPassword) {
      console.log('❌ Mot de passe incorrect pour:', email);
      return NextResponse.json(
        { success: false, error: 'Identifiants invalides' },
        { status: 401 }
      );
    }

    // Mettre à jour last_login_at
    await supabase
      .from('admins')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', admin.id);

    // Créer une session admin sécurisée
    const sessionToken = Buffer.from(JSON.stringify({
      adminId: admin.id,
      email: admin.email,
      role: admin.role,
      timestamp: Date.now()
    })).toString('base64');

    // Set cookie sécurisé
    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        firstName: admin.first_name,
        lastName: admin.last_name,
        role: admin.role
      }
    });

    response.cookies.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8 heures
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost'
    });

    console.log('✅ Admin connecté:', email);
    return response;

  } catch (error) {
    console.error('❌ Erreur auth admin:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// Vérification de session admin
export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('admin_session')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { authenticated: false, error: 'Aucune session' },
        { status: 401 }
      );
    }

    // Décoder et vérifier le token
    try {
      const sessionData = JSON.parse(Buffer.from(sessionToken, 'base64').toString());
      
      // Vérifier si la session n'est pas expirée (8 heures)
      const isExpired = Date.now() - sessionData.timestamp > 8 * 60 * 60 * 1000;
      
      if (isExpired) {
        return NextResponse.json(
          { authenticated: false, error: 'Session expirée' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        authenticated: true,
        admin: {
          id: sessionData.adminId,
          email: sessionData.email,
          role: sessionData.role
        }
      });

    } catch (decodeError) {
      return NextResponse.json(
        { authenticated: false, error: 'Session invalide' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('❌ Erreur vérification session:', error);
    return NextResponse.json(
      { authenticated: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
