-- Migration pour ajouter le champ rejection_reason à la table orders
-- Exécutez ce script dans votre dashboard Supabase

-- Ajouter le champ pour la raison de rejet
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Mettre à jour les politiques RLS si nécessaire
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (
    auth.email() = user_email
  );

-- Commentaire pour la documentation
COMMENT ON COLUMN orders.rejection_reason IS 'Raison du rejet du paiement FST par l\'administrateur';

-- Test de la migration
SELECT 'Migration rejection_reason terminée avec succès' as status;
