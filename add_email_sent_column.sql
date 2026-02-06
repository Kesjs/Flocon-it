-- Migration pour ajouter le champ email_sent à la table orders
-- Exécutez ce script dans votre dashboard Supabase

-- Ajouter le champ pour suivre l'envoi d'emails de confirmation
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS email_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_sent_at TIMESTAMP WITH TIME ZONE;

-- Ajouter un index pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_orders_email_sent ON orders(email_sent);

-- Commentaires pour la documentation
COMMENT ON COLUMN orders.email_sent IS 'Indique si l email de confirmation a été envoyé';
COMMENT ON COLUMN orders.email_sent_at IS 'Date et heure d envoi de l email de confirmation';

-- Test de la migration
SELECT 'Migration email_sent terminée avec succès' as status;
