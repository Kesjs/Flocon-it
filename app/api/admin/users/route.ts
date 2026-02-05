import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      console.error('Erreur récupération utilisateurs:', error);
      return NextResponse.json(
        { error: 'Erreur récupération utilisateurs' },
        { status: 500 }
      );
    }

    // Transformer les données pour correspondre à notre interface
    const users = data.users.map(user => ({
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at
    }));

    return NextResponse.json({
      users,
      count: users.length
    });

  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
