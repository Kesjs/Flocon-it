-- Table pour les administrateurs (version simplifiée)
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimisation
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
CREATE INDEX IF NOT EXISTS idx_admins_active ON admins(is_active);

-- Insérer un admin par défaut (mot de passe: admin123)
INSERT INTO admins (email, password_hash, first_name, last_name, role) 
VALUES (
  'admin@flocon.market',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkOYr4jGqq3vOB5rKNqXg0iKu5m9J5K5q', -- hash de "admin123"
  'Admin',
  'Flocon',
  'super_admin'
) ON CONFLICT (email) DO NOTHING;
