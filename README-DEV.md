# 🚀 Guide de Démarrage - Flocon E-commerce

## Problème courant : Next.js s'arrête immédiatement

### Solutions définitives :

#### 1. Script de démarrage recommandé
```bash
./start-dev.sh
```

#### 2. Commandes alternatives
```bash
# Option 1 : npm run dev (modifié)
npm run dev

# Option 2 : npx direct
npx next dev --port 3000

# Option 3 : avec hostname explicite
npx next dev --port 3000 --hostname 0.0.0.0
```

#### 3. En arrière-plan (pour développement)
```bash
# Démarrer en background
npx next dev --port 3000 &

# Vérifier que le processus tourne
ps aux | grep "next dev"
```

## Variables d'environnement
- `.env.local` : Priorité maximale (déjà configuré)
- `.env` : Configuration de base
- `.env.local.example` : Modèle à copier

## Ports utilisés
- **3000** : Next.js (principal)
- **3001** : Alternative si conflit
- **38993** : Preview IDE

## Dépannage
1. **Conflit de port** : `lsof -ti:3000 | xargs kill -9`
2. **Cache corrompu** : `rm -rf .next && npm run dev`
3. **Dependencies** : `npm install` (déjà fait)

## Accès
- Local : http://localhost:3000
- Network : http://192.168.1.220:3000
- Preview IDE : http://127.0.0.1:38993
