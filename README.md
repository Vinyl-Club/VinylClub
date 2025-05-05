## VinylClub

# Pour exécuter une application Spring Boot avec Maven, vous pouvez utiliser la commande suivante dans votre terminal :
# mvn spring-boot:run

## Création de la base de données
# Connectez-vous à PostgreSQL

# Se connecter en tant que postgres (utilisateur par défaut)
# psql -U postgres        # Sur Windows/macOS

# Une fois connecté, créer le schémasql/
# CREATE SCHEMA catalog;

# Créez un utilisateur dédié (bonne pratique)

# CREATE USER vinyl_user WITH PASSWORD 'votre_mot_de_passe';

# Créez la base de données

# CREATE DATABASE vinyl_ecommerce;

# Accordez les privilèges à l'utilisateur

# GRANT ALL PRIVILEGES ON DATABASE vinyl_ecommerce TO vinyl_user;
# ALTER USER vinyl_user WITH SUPERUSER;

# Connectez-vous à la base de données

# sql\c vinylclub