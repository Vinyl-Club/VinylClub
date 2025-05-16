## VinylClub

# Pour exécuter une application Spring Boot avec Maven, vous pouvez utiliser la commande suivante dans votre terminal :
# mvn spring-boot:run

# mvn clean install -U

## Création de la base de données
# Connectez-vous à PostgreSQL

# Se connecter en tant que postgres (utilisateur par défaut)
# psql -U postgres        # Sur Windows/macOS

# Une fois connecté, créer le schémasql
# CREATE SCHEMA catalog
# CREATE SCHEMA user

# Créez un utilisateur dédié (bonne pratique)

# CREATE USER vinyl_user WITH PASSWORD 'votre_mot_de_passe'

# Créez la base de données

# CREATE DATABASE vinyl_ecommerce

# Accordez les privilèges à l'utilisateur

# GRANT ALL PRIVILEGES ON DATABASE vinyl_ecommerce TO vinyl_user
# ALTER USER vinyl_user WITH SUPERUSER

# Connectez-vous à la base de données

# sql\c catalogdb
# sql\c userdb


# DOCKER
# Compilez chaque service :

# cd vinyl-discovery-service
# mvn clean package -DskipTests
# cd ../vinyl-user-service
# mvn clean package -DskipTests
# cd ../vinyl-catalog-service
# mvn clean package -DskipTests
# cd ..

# Démarrez les conteneurs :

# docker-compose up -d

# Étape 2 : Construire et déployer

# docker-compose up -d --build

# Vérifiez que les conteneurs sont en cours d'exécution :
# docker-compose ps

# Consultez les journaux en cas de problème :

# docker-compose logs -f

# Test de votre application

# Accédez au tableau de bord Eureka : http://localhost:8761
# Testez l'API User Service : http://localhost:8082/api/users
# Testez l'API Catalog Service : http://localhost:8080/api/products