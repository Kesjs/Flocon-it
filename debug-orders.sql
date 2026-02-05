-- Vérifier si des commandes existent
SELECT id, user_email, total, status, created_at 
FROM orders 
ORDER BY created_at DESC 
LIMIT 10;

-- Chercher spécifiquement cette commande
SELECT * FROM orders WHERE id = 'CMD-1770304852681';

-- Vérifier le format des IDs
SELECT id, LENGTH(id) as id_length FROM orders LIMIT 5;
