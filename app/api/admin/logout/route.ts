import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Supprimer le cookie de session admin
    const response = NextResponse.json({
      success: true,
      message: 'Déconnexion réussie'
    });

    response.cookies.set('admin_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Supprimer immédiatement
      path: '/'
    });

    console.log('✅ Admin déconnecté');
    return response;

  } catch (error) {
    console.error('❌ Erreur déconnexion admin:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
