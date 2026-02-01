# Configuration Supabase pour la Confirmation Email

## 🔧 Étape 5 : Configurer l'URL de redirection dans Supabase

Pour que le flux de confirmation email fonctionne correctement, vous devez configurer l'URL de redirection dans votre projet Supabase.

### 1. Accéder au tableau de bord Supabase
1. Allez sur [supabase.com](https://supabase.com)
2. Connectez-vous à votre compte
3. Sélectionnez votre projet

### 2. Configurer les URLs de redirection
1. Dans le menu de gauche, allez dans **Authentication** → **URL Configuration**
2. Dans la section **Redirect URLs**, ajoutez les URLs suivantes :

```
http://localhost:3000/confirm-email
https://votredomaine.com/confirm-email
```

3. Cliquez sur **Save**

### 3. Configurer le template d'email
1. Dans **Authentication** → **Email Templates**
2. Sélectionnez **"Confirm signup"**
3. Personnalisez le template avec ce code HTML :

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #fdfbf7; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #fdfbf7; padding-bottom: 40px; }
        .main { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 600px; border-collapse: collapse; border-radius: 8px; overflow: hidden; border: 1px solid #eeeeee; }
        
        /* Design Header */
        .header { background-color: #ffffff; padding: 30px 0; text-align: center; border-bottom: 1px solid #eeeeee; }
        .logo { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: bold; color: #f87171; letter-spacing: 2px; text-decoration: none; }
        
        /* Contenu */
        .content { padding: 40px 40px 20px 40px; text-align: center; color: #4a4a4a; line-height: 1.6; }
        h1 { font-family: 'Playfair Display', serif; color: #1a1a1a; font-size: 24px; margin-bottom: 20px; font-weight: bold; }
        p { margin: 0 0 15px 0; }
        
        /* Bouton */
        .button-container { padding: 20px 0 30px 0; }
        .button { background-color: #f87171; color: #ffffff !important; padding: 15px 30px; text-decoration: none; border-radius: 4px; font-size: 14px; font-weight: bold; display: inline-block; }
        
        /* Footer */
        .footer { text-align: center; font-size: 12px; color: #999999; padding: 20px 40px; }
        .footer a { color: #999999; text-decoration: underline; }
        .divider { border-top: 1px solid #eeeeee; margin: 0 auto 20px auto; width: 80%; }
    </style>
</head>
<body>
    <center class="wrapper">
        <table class="main">
            <tr>
                <td class="header">
                    <a href="{{ .SiteURL }}" class="logo">Flocon</a>
                </td>
            </tr>
            
            <tr>
                <td class="content">
                    <h1>Bienvenue dans votre cocon</h1>
                    <p>Merci d'avoir rejoint l'univers Flocon. Nous sommes ravis de vous compter parmi nous.</p>
                    <p>Pour finaliser la création de votre compte, merci de confirmer votre adresse email en cliquant sur le bouton ci-dessous :</p>
                    
                    <div class="button-container">
                        <a href="{{ .ConfirmationURL }}" class="button">Confirmer mon compte</a>
                    </div>
                    
                    <p style="font-size: 13px; font-style: italic;">L'élégance rencontre la douceur.</p>
                </td>
            </tr>
            
            <tr>
                <td class="footer">
                    <div class="divider"></div>
                    <p>&copy; 2026 Flocon. Tous droits réservés.</p>
                    <p>Vous recevez cet email car vous avez créé un compte sur notre site.</p>
                </td>
            </tr>
        </table>
    </center>
</body>
</html>
```

4. Dans les variables du template, assurez-vous que :
   - `{{ .ConfirmationURL }}` pointe bien vers votre URL de confirmation
   - `{{ .SiteURL }}` est configuré avec votre domaine

### 4. Activer l'inscription par email
1. Dans **Authentication** → **Settings**
2. Activez **"Enable email confirmations"**
3. Désactivez **"Enable phone confirmations"** si vous ne l'utilisez pas

## ✅ Flux complet maintenant fonctionnel

Une fois configuré, le flux sera :

1. **Inscription** → `/register` → Envoi email → Redirection vers `/pending-confirmation`
2. **Page d'attente** → Instructions claires + option de renvoyer l'email
3. **Email reçu** → User clique sur le lien → Redirection vers `/confirm-email?token=xxx`
4. **Confirmation automatique** → Session créée → Redirection vers `/dashboard`
5. **Header connecté** ✅ - L'utilisateur verra "Mon compte" au lieu de "Se connecter"

## 🧪 Test du flux

Pour tester en développement :
1. Créez un compte avec un email réel
2. Vérifiez que vous recevez l'email
3. Cliquez sur le lien de confirmation
4. Vérifiez la redirection automatique vers le dashboard
5. Vérifiez que le header affiche bien "Mon compte"

Le flux est maintenant professionnel et complet ! 🎉
