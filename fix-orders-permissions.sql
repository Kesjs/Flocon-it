-- Donner les permissions nécessaires pour le service role
-- Permettre au service role de mettre à jour les commandes

-- 1. S'assurer que le service role peut tout faire sur la table orders
GRANT ALL ON TABLE orders TO service_role;

-- 2. Si RLS est activé, désactiver temporairement pour le service role
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- 3. Ou créer une politique RLS pour le service role
DROP POLICY IF EXISTS "service_role_full_access" ON orders;
CREATE POLICY "service_role_full_access" ON orders
  FOR ALL USING (auth.role() = 'service_role');

-- 4. Réactiver RLS si nécessaire
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
