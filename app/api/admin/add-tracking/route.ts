import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { orderId, trackingNumber } = await request.json();

    if (!orderId || !trackingNumber) {
      return NextResponse.json(
        { error: 'ID de commande et numéro de suivi requis' },
        { status: 400 }
      );
    }

    console.log('📦 Ajout numéro de suivi:', orderId, trackingNumber);

    // Vérifier la session admin via les cookies (méthode principale)
    const sessionToken = request.cookies.get('admin_session')?.value;

    if (!sessionToken) {
      // Fallback: essayer de récupérer le token depuis les headers (développement)
      const authHeader = request.headers.get('x-admin-session');
      if (!authHeader) {
        return NextResponse.json(
          { error: 'Session admin requise - veuillez vous reconnecter' },
          { status: 401 }
        );
      }
      
      // Utiliser le token des headers pour le développement
      try {
        const sessionData = JSON.parse(Buffer.from(authHeader, 'base64').toString());
        
        // Vérifier si la session n'est pas expirée (8 heures)
        const isExpired = Date.now() - sessionData.timestamp > 8 * 60 * 60 * 1000;
        
        if (isExpired) {
          return NextResponse.json(
            { error: 'Session admin expirée' },
            { status: 401 }
          );
        }

        console.log('✅ Session admin valide (fallback):', sessionData.email);

      } catch (decodeError) {
        console.error('❌ Session admin invalide (fallback):', decodeError);
        return NextResponse.json(
          { error: 'Session admin invalide' },
          { status: 401 }
        );
      }
    } else {
      // Décoder et vérifier le token de session (cookies)
      try {
        const sessionData = JSON.parse(Buffer.from(sessionToken, 'base64').toString());
        
        // Vérifier si la session n'est pas expirée (8 heures)
        const isExpired = Date.now() - sessionData.timestamp > 8 * 60 * 60 * 1000;
        
        if (isExpired) {
          return NextResponse.json(
            { error: 'Session admin expirée' },
            { status: 401 }
          );
        }

        console.log('✅ Session admin valide (cookies):', sessionData.email);

      } catch (decodeError) {
        console.error('❌ Session admin invalide (cookies):', decodeError);
        return NextResponse.json(
          { error: 'Session admin invalide' },
          { status: 401 }
        );
      }
    }

    // Mettre à jour le numéro de suivi de la commande
    const { data: order, error } = await supabase
      .from('orders')
      .update({ 
        tracking_number: trackingNumber,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Erreur mise à jour suivi:', error);
      return NextResponse.json(
        { error: 'Erreur lors de l\'ajout du numéro de suivi', details: error.message },
        { status: 500 }
      );
    }

    if (!order) {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      );
    }

    console.log('✅ Numéro de suivi ajouté avec succès:', order.id);

    return NextResponse.json({
      success: true,
      message: 'Numéro de suivi ajouté avec succès',
      order
    });

  } catch (error) {
    console.error('💥 Erreur serveur add-tracking:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'ajout du suivi' },
      { status: 500 }
    );
  }
}
