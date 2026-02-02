// Script de test de compatibilité Hostinger
const fs = require('fs');
const path = require('path');

console.log('🔍 ANALYSE DE COMPATIBILITÉ HOSTINGER\n');

// 1. Vérification des routes
console.log('📁 ROUTES IDENTIFIÉES:');
const appDir = './app';
const routes = [];

function findRoutes(dir, prefix = '') {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findRoutes(filePath, prefix + '/' + file);
    } else if (file === 'page.tsx' || file === 'page.js') {
      routes.push(prefix || '/');
    } else if (file === 'route.ts' || file === 'route.js') {
      routes.push('API' + prefix);
    }
  });
}

findRoutes(appDir);
routes.forEach(route => console.log(`  ${route}`));

// 2. Vérification des dépendances critiques
console.log('\n📦 DÉPENDANCES CRITIQUES:');
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const criticalDeps = ['@supabase/supabase-js', 'stripe', 'next', 'framer-motion'];

criticalDeps.forEach(dep => {
  if (packageJson.dependencies[dep]) {
    console.log(`  ✅ ${dep}: ${packageJson.dependencies[dep]}`);
  } else {
    console.log(`  ❌ ${dep}: MANQUANT`);
  }
});

// 3. Variables d'environnement requises
console.log('\n🔐 VARIABLES D\'ENVIRONNEMENT REQUISES:');
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET'
];

requiredEnvVars.forEach(envVar => {
  console.log(`  ⚠️  ${envVar}: À configurer sur Hostinger`);
});

console.log('\n🎯 RECOMMANDATIONS:');
console.log('  1. Tester le middleware sur Hostinger');
console.log('  2. Vérifier les routes API');
console.log('  3. Configurer les variables d\'environnement');
console.log('  4. Tester les redirections');
