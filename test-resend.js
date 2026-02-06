// Script pour tester Resend
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'contact@flocon.paris',
      to: ['votre_email_test@gmail.com'],
      subject: 'Test Email Flocon',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h1>🌸 Test Email Flocon</h1>
          <p>Ceci est un test de configuration Resend.</p>
          <p>Si vous recevez cet email, tout fonctionne !</p>
        </div>
      `
    });

    if (error) {
      console.error('❌ Erreur:', error);
    } else {
      console.log('✅ Email envoyé avec succès:', data);
    }
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

testEmail();
