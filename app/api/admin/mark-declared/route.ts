import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();
    
    if (!orderId) {
      return NextResponse.json(
        { error: 'ID de commande requis' },
        { status: 400 }
      );
    }

    // Mettre à jour le statut FST et la date de déclaration
    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({ 
        fst_status: 'declared',
        payment_declared_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Erreur marquage déclaré:', error);
      return NextResponse.json(
        { error: 'Erreur lors du marquage de la commande' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      order: data
    });

  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
