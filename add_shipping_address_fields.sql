-- Migration pour ajouter les champs d'adresse de livraison à la table orders
-- Exécutez ce script dans votre dashboard Supabase

-- Ajouter les champs pour l'adresse de livraison
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS shipping_address JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS customer_name TEXT,
ADD COLUMN IF NOT EXISTS customer_phone TEXT;

-- Ajouter un index pour les recherches par nom de client
CREATE INDEX IF NOT EXISTS idx_orders_customer_name ON orders(customer_name);

-- Mettre à jour les politiques RLS pour inclure les nouveaux champs
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (
    auth.email() = user_email
  );

-- Commentaires pour la documentation
COMMENT ON COLUMN orders.shipping_address IS 'Adresse de livraison au format JSONB avec champs: full_name, address_line1, address_line2, city, postal_code, country, phone';
COMMENT ON COLUMN orders.customer_name IS 'Nom complet du client (pour compatibilité)';
COMMENT ON COLUMN orders.customer_phone IS 'Téléphone du client (pour compatibilité)';

-- Test de la migration
SELECT 'Migration adresse de livraison terminée avec succès' as status;
