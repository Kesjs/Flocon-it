-- Mettre à jour le hash de l'admin avec le bon hash
UPDATE admins 
SET password_hash = '$2b$12$4jGAnqMTrIdAe/e0eWQb4u5rAK6x7CMLH6waIoNT7qng1pSXTRFjW'
WHERE email = 'admin@flocon.market';
