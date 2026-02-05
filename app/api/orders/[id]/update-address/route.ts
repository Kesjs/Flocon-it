import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { shippingAddress, customerName, customerPhone } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID de commande requis' },
        { status: 400 }
      );
    }

    console.log('🔄 Mise à jour adresse pour commande:', id);

    // Mettre à jour la commande avec les informations d'adresse
    const { data: order, error } = await supabase
      .from('orders')
      .update({ 
        shipping_address: shippingAddress,
        customer_name: customerName,
        customer_phone: customerPhone,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Erreur mise à jour adresse:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour de l\'adresse', details: error.message },
        { status: 500 }
      );
    }

    if (!order) {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      );
    }

    console.log('✅ Adresse mise à jour avec succès:', order.id);

    return NextResponse.json({
      success: true,
      message: 'Adresse mise à jour avec succès',
      order
    });

  } catch (error) {
    console.error('💥 Erreur serveur mise à jour adresse:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la mise à jour' },
      { status: 500 }
    );
  }
}
