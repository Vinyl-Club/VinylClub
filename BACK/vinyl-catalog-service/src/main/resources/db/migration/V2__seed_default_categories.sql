INSERT INTO catalog.categories (name)
VALUES
  ('Classique'),
  ('Rock'),
  ('Jazz'),
  ('Rap'),
  ('Electro'),
  ('Pop')
ON CONFLICT (name) DO NOTHING;
