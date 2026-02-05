-- Créer une commande de test pour le debugging
INSERT INTO orders (
  id,
  user_email,
  total,
  status,
  payment_status,
  fst_status,
  items,
  products,
  created_at,
  updated_at
) VALUES (
  'CMD-1770304852681',
  'allaeloulitta@gmail.com',
  99.99,
  'pending',
  'pending',
  'pending',
  1,
  '["Produit test"]',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;
