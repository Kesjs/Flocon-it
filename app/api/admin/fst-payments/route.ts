import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .in('fst_status', ['pending', 'declared', 'processing', 'confirmed', 'rejected'])
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur récupération paiements FST:', error);
      return NextResponse.json(
        { error: 'Erreur récupération paiements' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      payments: data || [],
      count: data?.length || 0
    });

  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
