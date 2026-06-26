<p align="center">
  <img src="./FRONT-WEB/vinyl-club/src/assets/logo.png" alt="Logo VinylClub" width="200">
</p>

<h1 align="center">VinylClub</h1>

<p align="center">
  VinylClub est une application de petites annonces spécialisée dans les vinyles.
</p>

---

## Présentation du projet

**VinylClub**  est une application web de mise en relation entre particuliers pour acheter et vendre des vinyles neufs ou d'occasion.

Elle permet aux utilisateurs de consulter les disques proposés à la vente, de publier leurs propres annonces et de gérer leurs vinyles favoris. L'objectif est de faciliter les échanges entre passionnés au sein d'une plateforme dédiée.

## Fonctionnalités principales

- Création d'un compte utilisateur et authentification sécurisée.
- Consultation du catalogue de vinyles.
- Recherche et filtrage des annonces.
- Consultation du détail d'un vinyle.
- Création, suppression d'une annonce.
- Ajout et retrait de vinyles dans une liste de favoris.
- Consultation, modification  et suppression du profil utilisateur.
- Gestion des autorisations selon le rôle de l'utilisateur.

## Technologies utilisées

### Front-end

- **Next.js 15**
- **React 19**
- **TypeScript**
- **CSS Modules**
- Convention de nommage **BEM**
- **Lucide React** pour les icônes
- **Cloudinary** pour les images
- **Vitest** pour les tests unitaires

### Back-end

- **Java 21**
- **Spring Boot**
- **Spring Cloud Gateway**
- **Spring Cloud Netflix Eureka**
- **Spring Security**
- **JWT**
- **Spring Data JPA**
- **Spring Data MongoDB**
- **Maven**
- **Junit**
- **Testcontainer**

### Données et infrastructure

- **PostgreSQL** pour les utilisateurs, le catalogue et les annonces
- **MongoDB** pour les favoris
- **Docker** et **Docker Compose**
- **Eureka** pour la découverte des services

---

## Architecture

VinylClub repose sur une **architecture en microservices**. Chaque service possède une responsabilité précise et peut évoluer indépendamment des autres services.

```text
Navigateur
    |
    v
Application Next.js
    |
    v
API Gateway : 8090
    |
    +-------------------+-------------------+-------------------+
    |                   |                   |                   |
    v                   v                   v                   v
Auth Service       User Service       Catalog Service      Ad Service
    |                   |                   |                   |
    +-------------------+-------------------+-------------------+
                            |
                            v
                    Favorites Service
```

Tous les services Spring Boot s'enregistrent auprès du **Discovery Service Eureka**. Le **Gateway Service** constitue le point d'entrée principal du back-end et redirige les requêtes vers le service concerné.

### Services du back-end

| Service | Rôle | Port |
|---|---|---:|
| `vinyl-discovery-service` | Enregistrement et découverte des microservices avec Eureka | `8761` |
| `vinyl-gateway-service` | Point d'entrée de l'API et routage des requêtes | `8090` |
| `vinyl-auth-service` | Inscription, connexion, validation et renouvellement des jetons JWT | `8083` |
| `vinyl-user-service` | Gestion des utilisateurs, profils et adresses | `8082` |
| `vinyl-catalog-service` | Gestion des vinyles, albums, artistes, catégories et images | `8081` |
| `vinyl-ad-service` | Gestion des annonces de vente | `8087` |
| `vinyl-favorites-service` | Gestion des favoris dans MongoDB | Port défini dans sa configuration |

### Bases de données

Le projet utilise plusieurs bases de données afin de séparer les responsabilités des services :

| Base de données | Technologie | Utilisation |
|---|---|---|
| `userdb_dev` | PostgreSQL | Utilisateurs et adresses |
| `catalogdb_dev` | PostgreSQL | Catalogue, albums, artistes et produits |
| `addb_dev` | PostgreSQL | Annonces |
| Base des favoris | MongoDB | Favoris des utilisateurs |

---

## Arborescence simplifiée

```text
VinylClub/
├── BACK/
│   ├── vinyl-discovery-service/
│   ├── vinyl-gateway-service/
│   ├── vinyl-auth-service/
│   ├── vinyl-user-service/
│   ├── vinyl-catalog-service/
│   ├── vinyl-ad-service/
│   └── vinyl-favorites-service/
├── FRONT-WEB/
│   └── vinyl-club/
├── docker-compose.yml
└── README.md
```

---

## Prérequis

Avant de démarrer le projet, les outils suivants doivent être installés :

- **Git**
- **Java 21**
- **Maven**
- **Node.js 20 ou supérieur**
- **npm**
- **Docker Desktop**
- **PostgreSQL**, uniquement pour une exécution sans Docker
- **MongoDB**, uniquement pour une exécution sans Docker

Vérification des versions :

```bash
git --version
java --version
mvn --version
node --version
npm --version
docker --version
docker compose version
```

---

## Récupération du projet

Cloner le dépôt Git :

```bash
git clone <URL_DU_DEPOT>
```

# Démarrage avec Docker

Docker Compose est la méthode recommandée pour lancer l'ensemble du back-end et ses bases de données.

## 1. Compiler les microservices

Depuis la racine du projet :

```bash
cd BACK
```

Compiler chaque service :

```bash
cd vinyl-discovery-service
mvn clean package -DskipTests
cd ../vinyl-user-service
mvn clean package -DskipTests
cd ../vinyl-catalog-service
mvn clean package -DskipTests
cd ../vinyl-gateway-service
mvn clean package -DskipTests
cd ../vinyl-auth-service
mvn clean package -DskipTests
cd ../vinyl-favorites-service
mvn clean package -DskipTests
cd ../vinyl-ad-service
mvn clean package -DskipTests
cd ../..
```

## 2. Construire et démarrer les conteneurs

Depuis le dossier contenant `docker-compose.yml` :

```bash
docker compose up -d --build
```

## 3. Vérifier les conteneurs

```bash
docker compose ps
```

## 4. Consulter les journaux

Journaux de tous les services :

```bash
docker compose logs -f
```

Journaux d'un service précis :

```bash
docker compose logs -f vinyl-gateway-service
```

## 5. Arrêter les conteneurs

Sans supprimer les données :

```bash
docker compose down
```

En supprimant également les volumes et les données locales :

```bash
docker compose down -v
```

> Attention : l'option `-v` supprime les volumes Docker, notamment les données des bases de données.

La commande suivante supprime les ressources Docker inutilisées sur la machine et doit être utilisée avec prudence :

```bash
docker system prune -a
```

---

# Démarrage manuel du back-end

Pour lancer les services sans Docker, PostgreSQL et MongoDB doivent être démarrés et correctement configurés.

## Ordre de démarrage conseillé

1. PostgreSQL et MongoDB
2. `vinyl-discovery-service`
3. `vinyl-user-service`
4. `vinyl-catalog-service`
5. `vinyl-favorites-service`
6. `vinyl-auth-service`
7. `vinyl-ad-service`
8. `vinyl-gateway-service`

## Lancer un service Spring Boot

Se placer dans le dossier du service :

```bash
cd BACK/vinyl-discovery-service
```

Puis exécuter :

```bash
mvn spring-boot:run
```

La même commande doit être lancée dans un terminal différent pour chaque microservice.

Pour nettoyer et recompiler un service :

```bash
mvn clean install -U
```

---

## Création manuelle des bases PostgreSQL

Se connecter à PostgreSQL :

```bash
psql -U postgres
```

Créer les bases :

```sql
CREATE DATABASE userdb_dev;
CREATE DATABASE catalogdb_dev;
CREATE DATABASE addb_dev;
```

Créer les schémas correspondants :

```sql
\c userdb_dev
CREATE SCHEMA IF NOT EXISTS users;

\c catalogdb_dev
CREATE SCHEMA IF NOT EXISTS catalog;

\c addb_dev
CREATE SCHEMA IF NOT EXISTS ad;
```

Créer éventuellement un utilisateur dédié :

```sql
CREATE USER vinyl_user WITH PASSWORD 'votre_mot_de_passe';

GRANT ALL PRIVILEGES ON DATABASE userdb_dev TO vinyl_user;
GRANT ALL PRIVILEGES ON DATABASE catalogdb_dev TO vinyl_user;
GRANT ALL PRIVILEGES ON DATABASE addb_dev TO vinyl_user;
```

Quitter PostgreSQL :

```sql
\q
```

> Les identifiants utilisés par les services doivent correspondre aux valeurs présentes dans leurs fichiers `application.properties`, leurs profils Spring ou les variables d'environnement.

MongoDB crée généralement la base et les collections du service de favoris lors de la première insertion.

---

# Démarrage du front-end

Se placer dans le projet Next.js :

```bash
cd FRONT-WEB/vinyl-club
```

## 1. Installer les dépendances

Pour une première installation :

```bash
npm install
```

Pour reproduire exactement les versions du fichier `package-lock.json` :

```bash
npm ci
```

## 2. Configurer l'adresse du back-end

Créer un fichier `.env.local` dans `FRONT-WEB/vinyl-club` :

```env
NEXT_PUBLIC_API_BASE=http://localhost:8090
```

Cette adresse correspond au Gateway Spring Boot.

## 3. Démarrer le serveur de développement

```bash
npm run dev
```

Ouvrir ensuite :

```text
http://localhost:3000
```

## 4. Construire la version de production

```bash
npm run build
npm run start
```

## Installer Lucide React

```bash
npm install lucide-react
```

---

## Accès utiles

| Élément | Adresse |
|---|---|
| Application web | `http://localhost:3000` |
| API Gateway | `http://localhost:8090` |
| Tableau de bord Eureka | `http://localhost:8761` |
| User Service en lancement local | `http://localhost:8082/api/users` |
| Catalog Service en lancement local | `http://localhost:8081/api/products` |
| Ad Service en lancement local | `http://localhost:8087/api/ads` |

> Dans une exécution Docker, les microservices internes peuvent ne pas être accessibles directement depuis la machine hôte. Les appels applicatifs doivent alors passer par le Gateway.

---

## Tests

### Tests Maven

Lancer tous les tests d'un service :

```bash
mvn test
```

Lancer le test d'intégration du service Ad:

```bash
mvn -Dtest=AdControllerIT test
```

### Vérification du front-end

```bash
npm run build
```

Cette commande permet notamment de vérifier la compilation TypeScript et la construction de l'application Next.js.

---

## Convention CSS

Le front-end utilise la convention **BEM** dans les fichiers `*.module.css`.

Structure générale :

```text
block
block__element
block__element--modifier
```

Exemples :

```text
topbar__burger
topbar__burger--open
input-field__control
favorite-toggle__button--active
```

Les noms trop génériques comme `container`, `title`, `item` ou `button` doivent être évités lorsqu'ils ne sont pas associés à un bloc clairement identifié.

---

## Auteurs

Projet réalisé dans le cadre de la formation **Concepteur Développeur d'Applications — RNCP niveau 6**.
