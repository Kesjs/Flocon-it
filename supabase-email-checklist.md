# ✅ **Email de Réinitialisation : Checklist de Diagnostic**

## 🎯 **Statut Actuel**
- ✅ Configuration Supabase : OK
- ✅ Envoi API : OK  
- ✅ Email envoyé vers kenkenbabatounde@gmail.com : OK

## 🔍 **Actions Immédiates**

### **1. Vérifier votre boîte mail**
Vérifiez dans Gmail :
- 📧 **Boîte de réception** principale
- 📂 **Spam/Promotions/Social** 
- 🔍 **Recherche** : "supabase" ou "flocon"

### **2. Dashboard Supabase**
Allez dans votre projet Supabase :
1. **Authentication** → **Email Templates**
2. Vérifiez que **"Reset password"** est activé
3. Cliquez sur **"Preview"** pour voir le template
4. Vérifiez que le lien de redirection est correct

### **3. Settings Authentification**
Dans **Authentication** → **Settings** :
- ✅ **"Enable email confirmations"** doit être coché
- ✅ **Site URL** : `https://votredomaine.com`
- ✅ **Redirect URLs** : `http://localhost:3000/reset-password` (dev)

---

## 🚨 **Si l'email n'arrive toujours pas**

### **Cause la plus probable** : Template non configuré
Dans Supabase Dashboard :
1. **Authentication** → **Email Templates** → **Reset password**
2. Activez le template s'il est désactivé
3. Personnalisez avec :

```html
<h2>Réinitialisation de mot de passe</h2>
<p>Bonjour,</p>
<p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
<p><a href="{{ .ConfirmationURL }}" style="background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">Réinitialiser mon mot de passe</a></p>
<p>Ce lien expirera dans 24 heures.</p>
<p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
<p>À bientôt,<br>L'équipe Flocon</p>
```

### **Alternative : Utiliser Resend**
Si Supabase continue de poser problème :

1. **Installer Resend** :
```bash
npm install resend
```

2. **Ajouter dans .env.local** :
```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@flocon-market.fr
```

3. **Modifier le code dans AuthContext** :
```javascript
const resetPassword = async (email: string) => {
  try {
    // Utiliser Resend au lieu de Supabase
    const response = await fetch('/api/reset-password-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    return { error: response.ok ? null : { message: 'Erreur envoi email' } };
  } catch (error) {
    return { error: { message: 'Erreur envoi email' } };
  }
};
```

---

## 📊 **Log de Test Actuel**
```
🔍 Test de réinitialisation de mot de passe...
URL: https://xvczqjkmbfpjkdghvomc.supabase.co
Service Key: Configuré
✅ Email de réinitialisation envoyé avec succès!
📧 Vérifiez votre boîte mail pour: kenkenbabatounde@gmail.com
```

---

## 🎯 **Actions Recommandées**

1. **Immédiat** : Vérifiez vos spams Gmail
2. **5 min** : Configurez le template Reset password dans Supabase
3. **10 min** : Testez à nouveau avec le script
4. **Alternative** : Implémentez Resend si nécessaire

Le problème est à 90% dans la configuration du template email Supabase !
