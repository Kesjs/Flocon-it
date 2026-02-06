# Checklist Déploiement Production - Dashboard Admin

## Variables d'environnement OBLIGATOIRES

Ajoute ces variables dans ton environnement de production (Vercel/Hostinger) :

```bash
# URL du site en production
NEXT_PUBLIC_SITE_URL=https://www.flocon-market.fr

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xvczqjkmbfpjkdghvomc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2Y3pxamttYmZwamtkZ2h2b21jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0MjA5MjUsImV4cCI6MjA4NDk5NjkyNX0.Qi9gHILEaBylF8ObdcpXqg9n8wrlX46MFSzlIcZbCG0
SUPABASE_SERVICE_ROLE_KEY=ta_clé_service_role_ici

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51StI7DGZaaEE3nqfEwTdXZCv2SlFfVzt89t8K4erydDn3U06yNBYtfyCG0VINzkTDHw3kjdsbJYO6qv53ntD2uLO00KKHgZnbj
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email Resend
RESEND_API_KEY=re_...
```

## Problèmes corrigés

✅ **Filtrage FST**: Les commandes avec statut 'confirmed' et 'rejected' sont maintenant affichées
✅ **URL Production**: Le fallback utilise maintenant https://www.flocon-market.fr
✅ **Middleware**: Routes admin déjà correctement configurées

## Actions à faire

1. **Ajouter NEXT_PUBLIC_SITE_URL** dans Vercel/Hostinger
2. **Vérifier SUPABASE_SERVICE_ROLE_KEY** (doit être la clé service role, pas anon key)
3. **Redéployer** l'application
4. **Tester** l'accès à https://www.flocon-market.fr/admin

## Si ça ne marche toujours pas

Vérifie les logs de production dans Vercel/Hostinger pour voir les erreurs spécifiques.
