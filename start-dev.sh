#!/bin/bash
echo "🚀 Démarrage de Next.js en mode développement..."
echo "📍 URL: http://localhost:3000"
echo "🌐 Network: http://192.168.1.220:3000"
echo "⏱️  $(date)"
echo ""

# Forcer le port 3000 et éviter les conflits
export PORT=3000
export NODE_ENV=development

# Démarrer Next.js avec gestion des erreurs
npx next dev --port 3000 --hostname 0.0.0.0
