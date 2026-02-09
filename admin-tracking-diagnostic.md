# 🔍 **Diagnostic : Erreur Ajout Numéro de Suivi FST**

## 🚨 **Problème Identifié**

L'erreur que vous rencontrez vient probablement de l'une de ces causes :

### **1. Token Admin Invalide ou Expiré**
- **Symptôme** : Erreur 401 "Authorization header manquant ou invalide"
- **Cause** : Votre session admin a expiré
- **Solution** : Reconnectez-vous à l'admin

### **2. Commande Non Trouvée**
- **Symptôme** : Erreur 404 "Commande non trouvée"
- **Cause** : La commande n'existe pas dans la base de données
- **Solution** : Vérifiez que la commande existe bien dans Supabase

### **3. Permissions Base de Données**
- **Symptôme** : Erreur 500 "Erreur lors de l'ajout du suivi"
- **Cause** : La table `orders` n'a pas les permissions nécessaires
- **Solution** : Vérifiez les permissions RLS (Row Level Security)

---

## 🛠️ **Solutions Immédiates**

### **Solution 1 : Vérifier Token Admin**
1. Déconnectez-vous de l'admin
2. Reconnectez-vous avec vos identifiants
3. Réessayez d'ajouter le numéro de suivi

### **Solution 2 : Vérifier Commande**
1. Allez dans Supabase Dashboard
2. Table : `orders`
3. Cherchez l'ID de la commande
4. Vérifiez qu'elle existe bien

### **Solution 3 : Vérifier Permissions**
Exécutez ce SQL dans Supabase :

```sql
-- Vérifier les permissions sur la table orders
SELECT 
  table_name,
  privilege_type,
  grantee,
  grantor
FROM pg_tables 
WHERE table_name = 'orders'
  AND grantee = 'authenticated'
  AND privilege_type IN ('INSERT', 'UPDATE');
```

---

## 🔧 **Code à Vérifier**

### **API Add Tracking** (`/app/api/admin/add-tracking/route.ts`)
Le code semble correct. Vérifiez ces points :

1. **Ligne 23** : `Authorization header` vérifié ✅
2. **Ligne 34** : Token extrait correctement ✅  
3. **Ligne 45-53** : Vérification utilisateur Supabase ✅
4. **Ligne 45-53** : Mise à jour base de données ✅

### **Dashboard Admin** (`/app/admin/dashboard/page.tsx`)
Vérifiez ces points :

1. **Ligne 511** : `Authorization` header inclus ✅
2. **Ligne 513** : Token depuis localStorage ⚠️
3. **Ligne 514** : Body JSON correct ✅

---

## 🎯 **Actions Recommandées**

### **1. Debug en Direct**
1. Ouvrez le dashboard admin
2. Ouvrez les outils de développement (F12)
3. Allez dans l'onglet "Network"
4. Essayez d'ajouter un numéro de suivi
5. Regardez la requête `/api/admin/add-tracking`

### **2. Vérification Base de Données**
Connectez-vous à Supabase et vérifiez :

```sql
-- Structure de la table orders
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'orders' 
  AND table_schema = 'public'
ORDER BY ordinal_position;
```

### **3. Test Manuel**
Testez l'API directement :

```bash
curl -X POST http://localhost:3002/api/admin/add-tracking \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN_ADMIN" \
  -d '{"orderId": "CMD-TEST", "trackingNumber": "6A123456789"}'
```

---

## 📋 **Checklist Complète**

- [ ] Token admin valide et non expiré
- [ ] Commande existe dans la base de données
- [ ] Permissions RLS configurées correctement
- [ ] Colonne `tracking_number` existe dans la table
- [ ] Header Authorization correctement formaté
- [ ] Corps de la requête JSON valide

---

## 🔍 **Si le Problème Persiste**

1. **Vérifiez les logs serveur** : `npm run dev` et regardez la console
2. **Vérifiez les variables d'environnement** : `.env.local`
3. **Testez avec un autre navigateur** : Problème de cache/cookies
4. **Redémarrez le serveur** : `npm run dev` après modifications

---

## 💡 **Amélioration Suggérée**

Ajoutez un logging plus détaillé dans l'API :

```typescript
// Dans /app/api/admin/add-tracking/route.ts
console.log('📦 Request:', {
  orderId,
  trackingNumber,
  authHeader: authHeader?.substring(0, 20) + '...',
  userAgent: request.headers.get('user-agent')
});
```

Cela aidera à identifier rapidement la cause exacte de l'erreur.
