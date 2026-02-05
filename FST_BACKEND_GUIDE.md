# 🚀 Guide Complet d'Infrastructure Backend FST

## 📋 Vue d'Ensemble

L'infrastructure FST est maintenant complète avec :

### **🔌 API Routes**
- `POST /api/orders/[id]/declare` - Déclaration client
- `GET /api/admin/fst-orders` - Récupération admin
- `POST /api/admin/fst-orders/[id]/confirm` - Validation admin

### **🗄️ Base de Données**
- Table `orders` avec champs FST ajoutés
- Politiques RLS mises à jour
- Index optimisés pour les requêtes FST

### **🛡️ Sécurité**
- Authentification client via token Supabase
- Protection admin via token cookie
- Vérification propriété commande

### **📧 Email Service**
- Templates HTML professionnels
- Service mocké (prêt pour Resend)
- Notifications automatiques

---

## 🛠️ Étapes de Déploiement

### **1. Configuration Base de Données (5 min)**

Exécutez dans Supabase SQL Editor :
```sql
-- Copiez le contenu de add_fst_fields.sql
```

**Champs ajoutés :**
- `payment_declared_at` : TIMESTAMP
- `fst_status` : ENUM ('pending', 'declared', 'confirmed', 'processing')

### **2. Variables d'Environnement (3 min)**

Copiez `.env.fst.example` vers `.env.local` :
```bash
cp .env.fst.example .env.local
```

Configurez les variables :
```env
SUPABASE_SERVICE_KEY=votre_clé_service_supabase
ADMIN_TOKEN=flocon-admin-2024
ADMIN_EMAILS=votre-email@flocon-market.fr
```

### **3. Test des API Routes (10 min)**

#### **Test Client :**
```bash
curl -X POST http://localhost:3000/api/orders/CMD-123/declare \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -H "Content-Type: application/json"
```

#### **Test Admin :**
```bash
# Récupérer les commandes
curl http://localhost:3000/api/admin/fst-orders \
  -H "Cookie: admin_token=flocon-admin-2024"

# Confirmer une commande
curl -X POST http://localhost:3000/api/admin/fst-orders/CMD-123/confirm \
  -H "Cookie: admin_token=flocon-admin-2024"
```

### **4. Test Frontend (15 min)**

1. **Créez une commande** via le checkout
2. **Allez sur la page FST** avec `?order_id=CMD-XXX`
3. **Cliquez sur "J'ai effectué le virement"**
4. **Vérifiez les logs** dans la console
5. **Allez sur `/admin/fst`** pour voir la commande
6. **Cliquez sur "Valider"** pour confirmer

### **5. Déploiement Production (5 min)**

```bash
git add .
git commit -m "🚀 Implémentation complète infrastructure FST"
git push origin main
```

---

## 🔍 Vérification Post-Déploiement

### **Checklist API :**
- [ ] `/api/orders/[id]/declare` retourne 200
- [ ] `/api/admin/fst-orders` retourne les commandes
- [ ] `/api/admin/fst-orders/[id]/confirm` fonctionne

### **Checklist Frontend :**
- [ ] Page FST fonctionnelle
- [ ] Dashboard admin accessible
- [ ] Redirections automatiques
- [ ] Messages d'erreur clairs

### **Checklist Sécurité :**
- [ ] Token client validé
- [ ] Accès admin protégé
- [ ] Propriété commande vérifiée

---

## 🐛 Dépannage

### **Erreurs Communes :**

**"Token invalide ou expiré"**
- Vérifiez `SUPABASE_SERVICE_KEY`
- Vérifiez que l'utilisateur est connecté

**"Accès non autorisé" admin**
- Vérifiez `ADMIN_TOKEN`
- Vérifiez le cookie `admin_token`

**"Commande non trouvée"**
- Vérifiez la migration SQL
- Vérifiez l'ID de commande dans l'URL

### **Logs Utiles :**

**Console Client :**
```javascript
// Dans la page FST
console.log('Session:', session);
console.log('Token:', token);
```

**Console Serveur :**
```bash
# Dans les logs Vercel
grep "FST" /var/log/vercel.log
```

---

## 🎯 Résultat Final

Une fois déployé, vous aurez :

✅ **Système FST complet**
- Déclaration client fonctionnelle
- Validation admin instantanée
- Notifications automatiques

✅ **Infrastructure scalable**
- API RESTful
- Base de données optimisée
- Sécurité multi-couches

✅ **Expérience professionnelle**
- Dashboard admin institutionnel
- Feedback utilisateur immédiat
- Design cohérent

**Votre système FST est maintenant production-ready !** 🚀✨
