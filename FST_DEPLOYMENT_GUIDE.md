# 🚀 Guide de Déploiement FST - Flocon Secure Transfer

## 📋 Étapes à suivre pour activer le système complet

### 1. 🗄️ Migration Base de Données (CRUCIAL)

Exécutez ce script SQL dans votre dashboard Supabase :

```sql
-- Ouvrez votre dashboard Supabase → SQL Editor → Nouvelle requête
-- Copiez-collez le contenu du fichier `add_fst_fields.sql`
-- Cliquez sur "Run"
```

**Champs ajoutés :**
- `payment_declared_at` : Date de déclaration du virement
- `fst_status` : Statut FST (pending, declared, confirmed, processing)

### 2. 🔐 Configuration Variables d'Environnement

Ajoutez à votre fichier `.env.local` :

```env
# Clé de service Supabase (obligatoire pour les mises à jour admin)
SUPABASE_SERVICE_KEY=your_service_role_key_here

# Remplacez par votre vraie clé depuis Supabase → Settings → API
```

### 3. 🛡️ Configuration Admin

**Email admin autorisé :** Modifiez le fichier `/app/api/admin/orders/[id]/confirm/route.ts`

```typescript
const ADMIN_EMAILS = [
  'votre-email@flocon-market.fr', // Remplacez par votre email pro
  // Ajoutez d'autres emails admin ici
];
```

**Token admin :** Le token par défaut est `flocon-admin-2024`
- Pour le changer : modifiez les deux fichiers API et le middleware

### 4. 🧪 Test du Flux Complet

#### Test Client :
1. Ajoutez un produit au panier
2. Cliquez sur "Commander" 
3. Remplissez le formulaire
4. Choisissez "Payer par FST"
5. Cliquez sur "J'ai effectué le virement"
6. Vérifiez l'état de chargement → succès → redirection

#### Test Admin :
1. Allez sur `/admin/fst`
2. Login avec token admin si demandé
3. Vous devriez voir la commande apparaître
4. Cliquez sur "Valider"
5. Vérifiez que la commande disparaît de la liste

### 5. 📧 Configuration Email (Optionnel)

Pour les notifications automatiques, ajoutez :

```env
# Service d'email (Recommandé: Resend)
RESEND_API_KEY=re_your_resend_key
```

Puis décommentez et configurez la fonction `sendConfirmationEmail()` dans l'API admin.

## 🔍 Vérification Post-Déploiement

### ✅ Checklist :
- [ ] Migration SQL exécutée avec succès
- [ ] Variables d'environnement configurées
- [ ] Page FST fonctionnelle (bouton actif)
- [ ] Dashboard admin accessible (`/admin/fst`)
- [ ] Flux de déclaration → validation opérationnel
- [ ] Redirections automatiques fonctionnelles

### 🐛 Dépannage :

**Erreur "Token invalide"** : 
- Vérifiez que l'utilisateur est connecté
- Vérifiez le localStorage pour le token Supabase

**Erreur "Accès non autorisé" admin** :
- Vérifiez le cookie `admin_token`
- Token par défaut : `flocon-admin-2024`

**Commande n'apparaît pas dans le dashboard** :
- Vérifiez la migration SQL
- Vérifiez le statut `fst_status = 'declared'`

## 🎯 Résultat Final

Une fois déployé, vous aurez :

✅ **Système FST opérationnel**
- Déclaration client en 1 clic
- Validation admin instantanée
- Suivi temps réel

✅ **Expérience professionnelle**
- Feedback utilisateur immédiat
- Dashboard admin institutionnel
- Notifications automatiques

✅ **Sécurité renforcée**
- Vérification automatique des droits
- Protection contre les accès non autorisés
- Logs complets des actions

**Votre système FST est maintenant prêt !** 🚀
