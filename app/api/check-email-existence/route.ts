import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe avec une méthode plus fiable
    const { data: { users }, error } = await supabase
      .from('auth.users')
      .select('email')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Erreur vérification email:', error);
      return NextResponse.json(
        { error: 'Erreur serveur' },
        { status: 500 }
      );
    }

    const userExists = !error && users;

    return NextResponse.json({
      exists: userExists,
      email: email
    });

  } catch (error) {
    console.error('Erreur check-email-existence:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
