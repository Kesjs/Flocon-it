-- Ajouter le champ tracking_number à la table orders
-- Cette migration permet d'ajouter le suivi de colis pour les commandes

ALTER TABLE orders 
ADD COLUMN tracking_number TEXT;

-- Ajouter un commentaire pour la documentation
COMMENT ON COLUMN orders.tracking_number IS 'Numéro de suivi du colis pour le transporteur (ex: La Poste, Chronopost, etc.)';

-- Créer un index pour accélérer les recherches par numéro de suivi (optionnel)
-- CREATE INDEX idx_orders_tracking_number ON orders(tracking_number);
