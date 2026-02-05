// Service d'envoi d'emails pour les notifications FST

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

// Mock du service d'email (à remplacer par Resend, Brevo, etc.)
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    console.log('📧 Envoi email:', {
      to: options.to,
      subject: options.subject
    });

    // En développement, on simule l'envoi
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 [DEV] Email simulé:', options.html);
      return true;
    }

    // TODO: Intégrer un vrai service d'email
    // Exemple avec Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'noreply@flocon-market.fr',
    //   to: options.to,
    //   subject: options.subject,
    //   html: options.html
    // });

    return true;
  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    return false;
  }
};

// Template pour la confirmation de déclaration de paiement
export const getPaymentDeclaredTemplate = (orderId: string, amount: number) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Déclaration de paiement reçue - Flocon</title>
      <style>
        body { font-family: Inter, sans-serif; background-color: #fdfcf7; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: #f87171; }
        .content { text-align: center; }
        .title { font-size: 20px; font-weight: 600; color: #1f2937; margin-bottom: 20px; }
        .info { background-color: #f8fafc; border: 1px solid #e0f2fe; border-radius: 12px; padding: 20px; margin: 20px 0; }
        .order-id { font-family: monospace; font-size: 18px; font-weight: bold; color: #059669; }
        .amount { font-size: 24px; font-weight: bold; color: #1f2937; }
        .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #64748b; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">FLOCON</div>
        </div>
        
        <div class="content">
          <h1 class="title">Déclaration de paiement reçue !</h1>
          
          <p>Nous avons bien reçu votre déclaration de virement pour la commande :</p>
          
          <div class="info">
            <div class="order-id">${orderId}</div>
            <div class="amount">${amount.toFixed(2)}€</div>
          </div>
          
          <p>Nous allons procéder à la validation de votre paiement dans les plus brefs délais.</p>
          <p>Vous recevrez une confirmation email dès que le virement sera effectivement reçu.</p>
        </div>
        
        <div class="footer">
          <p>Merci de votre confiance dans Flocon Market.</p>
          <p>L'équipe Flocon</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Template pour la confirmation de réception du paiement
export const getPaymentConfirmedTemplate = (orderId: string, amount: number) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Paiement confirmé - Flocon</title>
      <style>
        body { font-family: Inter, sans-serif; background-color: #fdfcf7; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: #f87171; }
        .content { text-align: center; }
        .title { font-size: 20px; font-weight: 600; color: #1f2937; margin-bottom: 20px; }
        .success { background-color: #ecfdf5; border: 1px solid #d1fae5; border-radius: 12px; padding: 20px; margin: 20px 0; }
        .order-id { font-family: monospace; font-size: 18px; font-weight: bold; color: #059669; }
        .amount { font-size: 24px; font-weight: bold; color: #1f2937; }
        .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #64748b; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">FLOCON</div>
        </div>
        
        <div class="content">
          <h1 class="title">Paiement confirmé !</h1>
          
          <p>Votre paiement a été validé et votre commande est maintenant en cours de traitement.</p>
          
          <div class="success">
            <div class="order-id">${orderId}</div>
            <div class="amount">${amount.toFixed(2)}€</div>
          </div>
          
          <p>Votre commande sera expédiée dans les plus brefs délais.</p>
          <p>Vous pouvez suivre l'état de votre commande depuis votre espace client.</p>
        </div>
        
        <div class="footer">
          <p>Merci de votre confiance dans Flocon Market.</p>
          <p>L'équipe Flocon</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Fonctions pour envoyer les emails FST
export const sendPaymentDeclaredEmail = async (userEmail: string, orderId: string, amount: number) => {
  return await sendEmail({
    to: userEmail,
    subject: 'Déclaration de paiement reçue - Flocon Market',
    html: getPaymentDeclaredTemplate(orderId, amount)
  });
};

export const sendPaymentConfirmedEmail = async (userEmail: string, orderId: string, amount: number) => {
  return await sendEmail({
    to: userEmail,
    subject: 'Paiement confirmé - Votre commande Flocon',
    html: getPaymentConfirmedTemplate(orderId, amount)
  });
};
