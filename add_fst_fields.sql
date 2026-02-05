-- Migration pour ajouter les champs FST (Flocon Secure Transfer) à la table orders
-- Exécutez ce script dans votre dashboard Supabase

-- Ajouter les champs pour le suivi FST
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_declared_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS fst_status TEXT DEFAULT 'pending' CHECK (fst_status IN ('pending', 'declared', 'confirmed', 'processing'));

-- Ajouter un index pour les recherches FST
CREATE INDEX IF NOT EXISTS idx_orders_fst_status ON orders(fst_status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_declared_at ON orders(payment_declared_at DESC);

-- Mettre à jour les politiques RLS pour inclure les nouveaux champs
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (
    auth.email() = user_email
  );

-- Politique pour permettre aux utilisateurs de déclarer leur paiement
CREATE POLICY "Users can declare their own payments" ON orders
  FOR UPDATE USING (
    auth.email() = user_email AND 
    fst_status = 'pending'
  );

-- Commentaires pour la documentation
COMMENT ON COLUMN orders.payment_declared_at IS 'Date et heure de déclaration du virement par le client';
COMMENT ON COLUMN orders.fst_status IS 'Statut FST: pending, declared, confirmed, processing';

-- Test de la migration
SELECT 'Migration FST terminée avec succès' as status;
