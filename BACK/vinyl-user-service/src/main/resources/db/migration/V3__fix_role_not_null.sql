-- sécurité au cas où
UPDATE users.users
SET role = 'USER'
WHERE role IS NULL;

ALTER TABLE users.users
ALTER COLUMN role SET NOT NULL;