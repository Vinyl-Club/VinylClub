-- 1) ajoute la colonne si elle n'existe pas
ALTER TABLE users.users
ADD COLUMN IF NOT EXISTS role VARCHAR(20);

-- 2) met USER sur toutes les lignes existantes
UPDATE users.users
SET role = 'USER'
WHERE role IS NULL;

-- 3) défaut USER pour les futurs users (même si le code le fait déjà)
ALTER TABLE users.users
ALTER COLUMN role SET DEFAULT 'USER';

-- 4) (optionnel) constraint pour éviter des valeurs bizarres
ALTER TABLE users.users
ADD CONSTRAINT users_role_check
CHECK (role IN ('USER', 'ADMIN'));
