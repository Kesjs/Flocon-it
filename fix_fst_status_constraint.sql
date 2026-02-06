-- Migration pour corriger la contrainte fst_status et inclure 'rejected'
-- Exécutez ce script dans votre dashboard Supabase

-- Supprimer l'ancienne contrainte
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_fst_status_check;

-- Ajouter la nouvelle contrainte avec toutes les valeurs nécessaires
ALTER TABLE orders 
ADD CONSTRAINT orders_fst_status_check 
CHECK (fst_status IN ('pending', 'declared', 'confirmed', 'processing', 'rejected'));

-- Mettre à jour le commentaire
COMMENT ON COLUMN orders.fst_status IS 'Statut FST: pending, declared, confirmed, processing, rejected';

-- Test de la migration
SELECT 'Contrainte fst_status corrigée avec succès' as status;
