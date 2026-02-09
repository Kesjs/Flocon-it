// Script avancé pour diagnostiquer les problèmes de livraison d'email
const { createClient } = require('@supabase/supabase-js');

// Lecture depuis .env.local
const fs = require('fs');

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
const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

async function testEmailDelivery() {
  console.log('🔍 Test complet de livraison email...\n');
  
  const testEmail = 'floconnew@gmail.com';
  
  // 1. Test si l'utilisateur existe
  console.log('1️⃣ Vérification si l\'utilisateur existe...');
  const { data: users, error: userError } = await supabase.auth.admin.listUsers();
  
  if (userError) {
    console.log('❌ Erreur liste utilisateurs:', userError.message);
    return;
  }
  
  const userExists = users.users.some(user => user.email === testEmail);
  console.log(userExists ? '✅ Utilisateur trouvé' : '⚠️ Utilisateur NON trouvé dans Supabase');
  
  // 2. Test d'envoi d'email
  console.log('\n2️⃣ Envoi email de réinitialisation...');
  const result = await supabase.auth.resetPasswordForEmail(testEmail, {
    redirectTo: 'http://localhost:3000/reset-password'
  });
  
  if (result.error) {
    console.log('❌ Erreur envoi email:', result.error.message);
    
    // Analyse spécifique des erreurs
    if (result.error.message.includes('rate limit')) {
      console.log('🚨 Taux limite atteint - Attendez 1-2 minutes');
    } else if (result.error.message.includes('user')) {
      console.log('🚨 Problème avec l\'utilisateur - Créez d\'abord le compte');
    }
  } else {
    console.log('✅ Email envoyé par Supabase');
  }
  
  // 3. Vérification des logs Supabase
  console.log('\n3️⃣ Conseils de débogage:');
  console.log('📧 Vérifiez dans Gmail:');
  console.log('   - Boîte de réception principale');
  console.log('   - Onglet "Promotions"');
  console.log('   - Onglet "Social"');
  console.log('   - Dossier "Spam"');
  console.log('   - Recherchez: "supabase" OU "flocon"');
  
  console.log('\n🔧 Si toujours rien:');
  console.log('   1. L\'adresse floconnew@gmail.com existe-t-elle vraiment ?');
  console.log('   2. Est-elle blacklistée par Google ?');
  console.log('   3. Le domaine supabase.co est-il marqué comme spam ?');
  
  // 4. Test avec une autre adresse
  console.log('\n4️⃣ Test avec une autre adresse...');
  console.log('Essayez avec: test-temporaire@yopmail.com');
  console.log('(YOPmail reçoit tous les emails sans filtre)');
}

testEmailDelivery().catch(console.error);
