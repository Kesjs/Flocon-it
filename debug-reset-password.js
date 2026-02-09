// Script de test pour la réinitialisation de mot de passe
const { createClient } = require('@supabase/supabase-js');

// Lecture depuis .env.local
const fs = require('fs');
const path = require('path');

function loadEnvFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const env = {};
    
    lines.forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        env[match[1]] = match[2];
      }
    });
    
    return env;
  } catch (err) {
    return {};
  }
}

const env = loadEnvFile('.env.local');
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Test de réinitialisation de mot de passe...');
console.log('URL:', SUPABASE_URL);
console.log('Service Key:', SUPABASE_SERVICE_KEY ? 'Configuré' : 'Manquant');

if (!SUPABASE_URL.includes('your-project') && SUPABASE_SERVICE_KEY !== 'your-service-role-key') {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  
  // Test avec un compte qui existe DANS Supabase
  const testEmail = 'kenkenbabatounde@gmail.com'; // Ce compte EXISTE vraiment
  
  supabase.auth.resetPasswordForEmail(testEmail, {
    redirectTo: 'http://localhost:3000/reset-password'
  }).then(result => {
    if (result.error) {
      console.log('❌ Erreur:', result.error.message);
      console.log('\n🔧 Solutions possibles:');
      console.log('1. Vérifiez que "Enable email confirmations" est coché dans Supabase Dashboard');
      console.log('2. Vérifiez les templates email dans Authentication > Email Templates');
      console.log('3. Vérifiez que votre domaine est vérifié dans Supabase');
    } else {
      console.log('✅ Email de réinitialisation envoyé avec succès!');
      console.log('📧 Vérifiez votre boîte mail pour:', testEmail);
    }
  }).catch(err => {
    console.log('💥 Exception:', err.message);
  });
} else {
  console.log('\n❌ Veuillez configurer vos vraies clés Supabase dans ce script');
  console.log('📝 Modifiez les variables SUPABASE_URL et SUPABASE_SERVICE_KEY');
}
