# Vérification Configuration Supabase - Confirmation Email

## 🔍 Problème identifié
Les utilisateurs peuvent se connecter sans confirmer leur email car la vérification n'est pas activée côté Supabase.

## ✅ Solution implémentée (côté client)
- Ajout d'une vérification dans `signIn()` pour bloquer les connexions non confirmées
- Message d'erreur clair demandant de confirmer l'email

## ⚙️ Configuration requise côté Supabase

### 1. Vérifier les paramètres d'authentification
Allez dans votre dashboard Supabase > Authentication > Settings :

**Enable email confirmations** doit être **coché**.

### 2. Configuration des emails
Dans Authentication > Email Templates :
- **Confirm signup** : Doit être configuré
- **URL de redirection** : `https://votredomaine.com/auth/callback`

### 3. Variables d'environnement
Vérifiez que vous avez :
```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service
```

### 4. Test de la configuration
1. Créez un nouvel utilisateur
2. Vérifiez que vous recevez l'email de confirmation
3. Essayez de vous connecter SANS cliquer sur le lien
4. Vous devriez voir le message : "Veuillez confirmer votre email avant de vous connecter"

## 🚨 Si ça ne fonctionne toujours pas

### Option A : Activer "Enable email confirmations" dans Supabase
1. Dashboard Supabase
2. Authentication > Settings
3. Cocher "Enable email confirmations"
4. Sauvegarder

### Option B : Utiliser un trigger SQL
```sql
-- Créer une fonction pour vérifier la confirmation email
CREATE OR REPLACE FUNCTION check_email_confirmation()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email_confirmed_at IS NULL THEN
    RAISE EXCEPTION 'Email non confirmé';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer un trigger sur auth.users
CREATE TRIGGER enforce_email_confirmation
BEFORE INSERT OR UPDATE ON auth.users
FOR EACH ROW EXECUTE FUNCTION check_email_confirmation();
```

## 📋 Résumé
La correction côté client est faite. Maintenant il faut :
1. ✅ Vérifier la configuration Supabase
2. ✅ Tester le flux complet
3. ✅ S'assurer que les emails de confirmation sont envoyés
