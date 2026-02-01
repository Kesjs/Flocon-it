# Guide de Vérification de Connexion Supabase

## 🔍 Comment s'assurer que les URLs pointent vraiment sur Supabase

### 1. Vérifier les variables d'environnement

Vérifiez que votre `.env.local` contient les bonnes clés Supabase :

```bash
# Afficher les variables Supabase (sans afficher les clés complètes)
grep "SUPABASE" .env.local
```

Les URLs doivent ressembler à :
```
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Tester la connexion Supabase

Créez un fichier de test pour vérifier la connexion :

```bash
# Créer un fichier de test
cat > test-supabase-connection.js << 'EOF'
const { createClient } = require('@supabase/supabase-js');

// Récupérer les variables d'environnement
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Test de connexion Supabase...');
console.log('URL:', supabaseUrl);
console.log('Clé anonyme:', supabaseAnonKey ? '✅ Présente' : '❌ Manquante');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables Supabase manquantes');
  process.exit(1);
}

// Tester la connexion
const supabase = createClient(supabaseUrl, supabaseAnonKey);

supabase.from('_test_connection').select('*').limit(1)
  .then(() => {
    console.log('✅ Connexion Supabase établie avec succès');
  })
  .catch(error => {
    if (error.message.includes('does not exist')) {
      console.log('✅ Connexion Supabase établie (table de test inexistante = normal)');
    } else {
      console.error('❌ Erreur de connexion:', error.message);
    }
  });
EOF

# Exécuter le test
node -r dotenv/config test-supabase-connection.js

# Nettoyer
rm test-supabase-connection.js
```

### 3. Vérifier la configuration dans le dashboard Supabase

#### A. URL du projet
1. Allez sur [supabase.com](https://supabase.com)
2. Connectez-vous à votre projet
3. Dans **Settings** → **General**, vérifiez l'URL du projet
4. Elle doit correspondre à votre `NEXT_PUBLIC_SUPABASE_URL`

#### B. URLs de redirection
1. **Authentication** → **URL Configuration**
2. Vérifiez que ces URLs sont présentes :
   ```
   http://localhost:3000/confirm-email
   https://votredomaine.com/confirm-email
   http://localhost:3000/**
   https://votredomaine.com/**
   ```

#### C. Template d'email
1. **Authentication** → **Email Templates**
2. Sélectionnez **"Confirm signup"**
3. Vérifiez que le template contient :
   ```html
   <a href="{{ .ConfirmationURL }}" class="button">Confirmer mon compte</a>
   ```

### 4. Tester le flux complet

```bash
# Démarrer le serveur de développement
npm run dev

# Dans une autre console, tester l'inscription
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123456"}'
```

### 5. Vérifier les logs Supabase

1. Dans le dashboard Supabase
2. **Authentication** → **Logs**
3. Cherchez les logs d'inscription et de confirmation
4. Vérifiez que les URLs de redirection sont correctes

### 6. Debug avec le navigateur

Ouvrez les outils de développement dans votre navigateur :

1. **Onglet Network** lors de l'inscription
2. Cherchez les requêtes vers Supabase
3. Vérifiez que les URLs pointent bien vers votre projet Supabase

### 7. Commandes de vérification rapide

```bash
# Vérifier que le client Supabase est bien configuré
node -e "
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
console.log('URL Supabase:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Client Supabase créé:', !!supabase);
"

# Tester une requête simple
node -e "
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
supabase.auth.getSession().then(({ data, error }) => {
  console.log('Test auth:', error ? error.message : '✅ Auth endpoint accessible');
});
"
```

## ✅ Points de vérification essentiels

- [ ] `NEXT_PUBLIC_SUPABASE_URL` pointe vers `https://votre-projet.supabase.co`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` est valide et commence par `eyJ`
- [ ] URLs de redirection configurées dans Supabase Dashboard
- [ ] Template email contient `{{ .ConfirmationURL }}`
- [ ] Le client Supabase peut se connecter (test ci-dessus)
- [ ] Les logs Supabase montrent les tentatives d'inscription

Si tous ces points sont validés, votre flux fonctionnera correctement ! 🎉
