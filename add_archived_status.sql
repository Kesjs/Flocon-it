-- Migration pour ajouter le statut 'archived' à la contrainte fst_status
-- Exécutez ce script dans votre dashboard Supabase

-- Supprimer l'ancienne contrainte
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_fst_status_check;

-- Ajouter la nouvelle contrainte avec toutes les valeurs nécessaires y compris 'archived'
ALTER TABLE orders 
ADD CONSTRAINT orders_fst_status_check 
CHECK (fst_status IN ('pending', 'declared', 'confirmed', 'processing', 'rejected', 'archived'));

-- Mettre à jour le commentaire
COMMENT ON COLUMN orders.fst_status IS 'Statut FST: pending, declared, confirmed, processing, rejected, archived';

-- Test de la migration
SELECT 'Contrainte fst_status mise à jour avec succès (archived ajouté)' as status;
