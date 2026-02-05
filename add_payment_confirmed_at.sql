-- Ajouter la colonne payment_confirmed_at pour suivre la date de confirmation des paiements
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_confirmed_at TIMESTAMP WITH TIME ZONE;

-- Ajouter un index pour les recherches par date de confirmation
CREATE INDEX IF NOT EXISTS idx_orders_payment_confirmed_at ON orders(payment_confirmed_at DESC);

-- Commentaire pour la documentation
COMMENT ON COLUMN orders.payment_confirmed_at IS 'Date et heure de confirmation du paiement par l''admin';

-- Test de la migration
SELECT 'Colonne payment_confirmed_at ajoutée avec succès' as status;
