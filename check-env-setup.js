#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification de la configuration des variables d\'environnement...\n');

// Vérifier les fichiers .env
const envFiles = ['.env', '.env.local', '.env.example'];
let configFound = false;

for (const file of envFiles) {
  if (fs.existsSync(file)) {
    console.log(`📄 Fichier trouvé: ${file}`);
    
    if (file === '.env.local') {
      const content = fs.readFileSync(file, 'utf8');
      const hasSupabaseUrl = content.includes('NEXT_PUBLIC_SUPABASE_URL=');
      const hasSupabaseKey = content.includes('SUPABASE_SERVICE_ROLE_KEY=');
      
      console.log(`   ✅ NEXT_PUBLIC_SUPABASE_URL: ${hasSupabaseUrl ? 'Présent' : 'Manquant'}`);
      console.log(`   ✅ SUPABASE_SERVICE_ROLE_KEY: ${hasSupabaseKey ? 'Présent' : 'Manquant'}`);
      
      if (hasSupabaseUrl && hasSupabaseKey) {
        configFound = true;
        
        // Extraire les valeurs (sans afficher les clés complètes)
        const urlMatch = content.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
        const keyMatch = content.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/);
        
        if (urlMatch && !urlMatch[1].includes('your-project')) {
          console.log(`   ✅ URL configurée: ${urlMatch[1].substring(0, 30)}...`);
        } else {
          console.log(`   ⚠️  URL semble être un placeholder`);
        }
        
        if (keyMatch && !keyMatch[1].includes('your-service-role-key')) {
          console.log(`   ✅ Clé service configurée`);
        } else {
          console.log(`   ⚠️  Clé service semble être un placeholder`);
        }
      }
    }
    console.log('');
  }
}

if (!configFound) {
  console.log('❌ Configuration Supabase non trouvée ou incomplète');
  console.log('\n🔧 Actions requises:');
  console.log('1. Copiez .env.example vers .env.local:');
  console.log('   cp .env.example .env.local');
  console.log('\n2. Éditez .env.local avec vos vraies clés Supabase:');
  console.log('   - NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co');
  console.log('   - SUPABASE_SERVICE_ROLE_KEY=votre-clé-service-role');
  console.log('\n3. Redémarrez votre application');
} else {
  console.log('✅ Configuration trouvée! Testez maintenant:');
  console.log('   node debug-reset-password.js');
}
