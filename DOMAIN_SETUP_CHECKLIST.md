# Configuration Domaine Hostinger → Vercel

## ✅ Étapes à suivre

### 1. Dashboard Vercel
- [ ] Aller dans Settings → Domains
- [ ] Ajouter ton domaine (ex: tondomaine.com)
- [ ] Noter les enregistrements DNS fournis par Vercel

### 2. Panel Hostinger
- [ ] Se connecter au panel Hostinger
- [ ] Aller dans "DNS Zone Editor"
- [ ] Ajouter ces enregistrements :

#### Enregistrement A (domaine principal)
```
Type: A
Name: @ (ou vide)
Value: 76.76.19.19
TTL: 3600
```

#### Enregistrement CNAME (www)
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

### 3. Configuration Projet
- [ ] Mettre à jour NEXT_PUBLIC_BASE_URL dans .env.local
- [ ] Redéployer sur Vercel

### 4. Vérification
- [ ] Attendre la propagation DNS (5-30 min)
- [ ] Tester l'accès via le domaine
- [ ] Vérifier le certificat SSL

## 🔧 Commandes utiles

```bash
# Vérifier la propagation DNS
dig tondomaine.com
nslookup tondomaine.com

# Déploiement Vercel
vercel --prod
```

## ⚠️ Notes importantes
- La propagation DNS peut prendre jusqu'à 48h
- Vérifie que ton domaine n'est pas bloqué chez Hostinger
- Assure-toi que les certificats SSL sont bien générés par Vercel
