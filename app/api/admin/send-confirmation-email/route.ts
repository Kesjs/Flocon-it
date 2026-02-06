import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdminClient } from '@/lib/supabase-admin-client';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { orderId, email, content, subject } = await request.json();

    if (!orderId || !email || !content || !subject) {
      return NextResponse.json(
        { error: 'Paramètres manquants' },
        { status: 400 }
      );
    }

    // Envoyer l'email via Resend
    const { data, error } = await resend.emails.send({
      from: 'contact@flocon.paris', // À adapter avec votre domaine
      to: [email],
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🌸 Flocon</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Boutique en ligne</p>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
            ${content.replace(/\n/g, '<br>')}
          </div>
          
          <div style="text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px;">
            <p>Cet email a été envoyé automatiquement depuis votre espace client Flocon.</p>
            <p>Si vous n'êtes pas à l'origine de cette demande, merci de nous contacter.</p>
          </div>
        </div>
      `
    });

    if (error) {
      console.error('Erreur Resend:', error);
      return NextResponse.json(
        { error: 'Erreur lors de l envoi de l email' },
        { status: 500 }
      );
    }

    // Mettre à jour la base de données
    const { error: updateError } = await supabaseAdminClient
      .from('orders')
      .update({ 
        email_sent: true, 
        email_sent_at: new Date().toISOString() 
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('Erreur mise à jour BDD:', updateError);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour du statut email' },
        { status: 500 }
      );
    }

    console.log('✅ Email envoyé avec succès:', { orderId, email, messageId: data?.id });

    return NextResponse.json({
      success: true,
      message: 'Email envoyé avec succès',
      messageId: data?.id
    });

  } catch (error) {
    console.error('Erreur API send-confirmation-email:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
