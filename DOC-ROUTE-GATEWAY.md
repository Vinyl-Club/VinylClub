# 🎵 VINYL SHOP API - DOCUMENTATION COMPLÈTE

## 📋 Table des matières

1. [Products (Catalog-Service)](#products)
2. [Artists (Catalog-Service)](#artists)
3. [Categories (Catalog-Service)](#categories)
4. [Albums (Catalog-Service)](#albums)
5. [Images (Catalog-Service)](#images) 
6. [Users (User-Service)](#users)
7. [Addresses (User-Service)](#addresses)
8. [Health Checks](#health-checks)
9. [Résumé par fonctionnalité](#resume)

---

## 🎵 PRODUCTS (CATALOG-SERVICE) {#products}

### GET Routes

| Route | Fonctionnalité | Usage | Paramètres |
|-------|---------------|-------|------------|
| `GET /api/products` | **Page d'accueil** - Liste tous les produits disponibles avec pagination | Affichage principal du site | `?page=0&size=12` |
| `GET /api/products/recent` | **Produits vedettes** - Les produits les plus récents | Section "Nouveautés" page d'accueil | `?limit=8` |
| `GET /api/products/{id}` | **Page détails** - Détails complets d'un produit spécifique | Clic sur un vinyle | `{id}` : ID du produit |
| `GET /api/products/search` | **Recherche** - Recherche par titre ou nom d'artiste | Barre de recherche | `?query=rock&page=0&size=12` |
| `GET /api/products/category/{categoryId}` | **Filtrage** - Produits d'une catégorie spécifique | Menu catégories | `{categoryId}` : ID catégorie |

### POST Routes

| Route | Fonctionnalité | Usage | Body Example |
|-------|---------------|-------|--------------|
| `POST /api/products` | **Créer un produit** - Ajouter un nouveau vinyle au catalogue | Administration | Voir exemple JSON ci-dessous |

#### Exemple POST /api/products
```json
{
  "title": "Abbey Road - Vinyl LP",
  "description": "Album légendaire des Beatles",
  "price": 29.99,
  "quantity": 15,
  "releaseYear": 1969,
  "userId": 1,
  "artist": {"id": 1},
  "category": {"id": 1},
  "album": {"id": 1},
  "status": "AVAILABLE",
  "state": "TRES_BON_ETAT"
}
```

### PUT/DELETE Routes

| Route | Fonctionnalité | Usage |
|-------|---------------|-------|
| `PUT /api/products/{id}` | **Modifier un produit** - Mettre à jour un vinyle existant | Administration |
| `DELETE /api/products/{id}` | **Supprimer un produit** - Retirer un vinyle du catalogue | Administration |

---

## 🎨 ARTISTS (CATALOG-SERVICE) {#artists}

### GET Routes

| Route | Fonctionnalité | Usage | Paramètres |
|-------|---------------|-------|------------|
| `GET /api/artists` | **Liste des artistes** - Tous les artistes disponibles | Menu/Navigation | - |
| `GET /api/artists/{id}` | **Page artiste** - Détails d'un artiste spécifique | Profil artiste | `{id}` : ID artiste |
| `GET /api/artists/search` | **Recherche d'artistes** - Recherche par nom | Recherche artistes | `?query=beatles` |
| `GET /api/artists/{id}/products` | **Discographie** - Tous les produits d'un artiste | Page artiste | `{id}` : ID artiste |

### POST/PUT/DELETE Routes

| Route | Fonctionnalité | Usage | Body Example |
|-------|---------------|-------|--------------|
| `POST /api/artists` | **Créer un artiste** - Ajouter un nouvel artiste | Administration | `{"name": "The Beatles", "bio": "Legendary band"}` |
| `PUT /api/artists/{id}` | **Modifier un artiste** - Mettre à jour infos artiste | Administration | Même format que POST |
| `DELETE /api/artists/{id}` | **Supprimer un artiste** - Retirer un artiste (si aucun produit) | Administration | - |

---

## 📂 CATEGORIES (CATALOG-SERVICE) {#categories}

### GET Routes

| Route | Fonctionnalité | Usage | Paramètres |
|-------|---------------|-------|------------|
| `GET /api/categories` | **Liste des genres** - Tous les genres musicaux disponibles | Menu navigation | - |
| `GET /api/categories/{id}` | **Détails catégorie** - Informations d'une catégorie | Page catégorie | `{id}` : ID catégorie |
| `GET /api/categories/{id}/products` | **Produits par genre** - Tous les vinyles d'un genre | Filtrage par genre | `{id}` : ID catégorie |

### POST/PUT/DELETE Routes

| Route | Fonctionnalité | Usage | Body Example |
|-------|---------------|-------|--------------|
| `POST /api/categories` | **Créer une catégorie** - Ajouter un nouveau genre | Administration | `{"name": "Rock"}` |
| `PUT /api/categories/{id}` | **Modifier une catégorie** - Mettre à jour un genre | Administration | `{"name": "Progressive Rock"}` |
| `DELETE /api/categories/{id}` | **Supprimer une catégorie** - Retirer un genre (si aucun produit) | Administration | - |

---

## 💿 ALBUMS (CATALOG-SERVICE) {#albums}

### GET Routes

| Route | Fonctionnalité | Usage |
|-------|---------------|-------|
| `GET /api/albums` | **Liste des albums** - Tous les albums disponibles | Navigation/Recherche |
| `GET /api/albums/{id}` | **Détails album** - Informations d'un album spécifique | Page album |

### POST/PUT/DELETE Routes

| Route | Fonctionnalité | Usage | Body Example |
|-------|---------------|-------|--------------|
| `POST /api/albums` | **Créer un album** - Ajouter un nouvel album | Administration | `{"name": "Abbey Road"}` |
| `PUT /api/albums/{id}` | **Modifier un album** - Mettre à jour un album | Administration | `{"name": "Abbey Road Remastered"}` |
| `DELETE /api/albums/{id}` | **Supprimer un album** - Retirer un album | Administration | - |

---

## 📸 IMAGES (CATALOG-SERVICE) {#images}

### GET Routes

| Route | Fonctionnalité | Usage | Paramètres |
|-------|---------------|-------|------------|
| `GET /api/images/{imageId}` | **Afficher image** - Récupère et affiche une image spécifique | Affichage des images produits | `{imageId}` : ID de l'image |
| `GET /api/images/product/{productId}` | **Images d'un produit** - Liste des IDs d'images d'un produit | Galerie d'images produit | `{productId}` : ID du produit |

### POST Routes

| Route | Fonctionnalité | Usage | Paramètres |
|-------|---------------|-------|------------|
| `POST /api/images/upload` | **Upload image** - Ajouter une image pour un produit | Administration - Ajouter images produits | `?productId=1` + fichier multipart |

#### Exemple POST /api/images/upload
```http
POST /api/images/upload?productId=1
Content-Type: multipart/form-data

Form data:
- Key: file
- Type: File
- Value: [image.jpg/png/webp]
- Max size: 5MB
- Types acceptés: JPG, PNG, WEBP
```

#### Réponse POST /api/images/upload
```json
{
  "success": true,
  "message": "Image uploadée avec succès",
  "imageId": 15
}
```

### DELETE Routes

| Route | Fonctionnalité | Usage |
|-------|---------------|-------|
| `DELETE /api/images/{imageId}` | **Supprimer image** - Retirer une image spécifique | Administration - Gestion images |

---

## 👤 USERS (USER-SERVICE) {#users}

### GET Routes

| Route | Fonctionnalité | Usage |
|-------|---------------|-------|
| `GET /api/users` | **Liste des utilisateurs** - Tous les utilisateurs (admin) | Administration |
| `GET /api/users/{id}` | **Profil utilisateur** - Détails d'un utilisateur spécifique | Profil personnel |

### POST Routes

| Route | Fonctionnalité | Usage | Body Example |
|-------|---------------|-------|--------------|
| `POST /api/users` | **Inscription** - Créer un nouveau compte utilisateur | Création de compte | Voir exemple ci-dessous |
| `POST /api/users/login` | **Connexion** - Authentifier un utilisateur | Login | `{"email": "user@example.com", "password": "password"}` |

#### Exemple POST /api/users
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+33123456789",
  "password": "securePassword123",
  "authId": "user_john_doe_001"
}
```

### PUT/DELETE Routes

| Route | Fonctionnalité | Usage |
|-------|---------------|-------|
| `PUT /api/users/{id}` | **Modifier profil** - Mettre à jour informations utilisateur | Gestion profil |
| `DELETE /api/users/{id}` | **Supprimer compte** - Supprimer un utilisateur | Suppression compte |

---

## 🏠 ADDRESSES (USER-SERVICE) {#addresses}

### GET Routes

| Route | Fonctionnalité | Usage |
|-------|---------------|-------|
| `GET /api/addresses` | **Liste des adresses** - Toutes les adresses (admin) | Administration |
| `GET /api/addresses/{id}` | **Détails adresse** - Informations d'une adresse spécifique | Gestion adresses |

### POST/PUT/DELETE Routes

| Route | Fonctionnalité | Usage | Body Example |
|-------|---------------|-------|--------------|
| `POST /api/addresses` | **Ajouter adresse** - Créer une nouvelle adresse pour un utilisateur | Livraison/Facturation | Voir exemple ci-dessous |
| `PUT /api/addresses/{id}` | **Modifier adresse** - Mettre à jour une adresse | Gestion adresses | Même format que POST |
| `DELETE /api/addresses/{id}` | **Supprimer adresse** - Retirer une adresse | Gestion adresses | - |

#### Exemple POST /api/addresses
```json
{
  "street": "123 Rue de la Paix",
  "city": "Paris",
  "zipCode": "75001",
  "country": "France",
  "user": {"id": 1}
}
```

---

## 🔍 HEALTH CHECKS {#health-checks}

| Route | Fonctionnalité | Port | Usage |
|-------|---------------|------|-------|
| `GET http://localhost:8761` | **Eureka Dashboard** - Interface de monitoring des services | 8761 | Monitoring |
| `GET /actuator/health` | **Health Check Gateway** | 8090 | Monitoring |
| `GET http://localhost:8081/actuator/health` | **Health Check Catalog** | 8081 | Monitoring |
| `GET http://localhost:8082/actuator/health` | **Health Check User** | 8082 | Monitoring |

---

## 🌐 URLS COMPLÈTES VIA GATEWAY

### Pour votre application frontend

Toutes les routes passent par le Gateway sur le **port 8090** :

```
BASE_URL = http://localhost:8090

// Page d'accueil
GET {BASE_URL}/api/products

// Détails d'un vinyle  
GET {BASE_URL}/api/products/1

// Recherche
GET {BASE_URL}/api/products/search?query=rock

// Genres musicaux
GET {BASE_URL}/api/categories

// Artistes
GET {BASE_URL}/api/artists

// Connexion utilisateur
POST {BASE_URL}/api/users/login

// Inscription
POST {BASE_URL}/api/users

// Gestion des images
POST {BASE_URL}/api/images/upload?productId=1  // Upload image
GET {BASE_URL}/api/images/15                   // Afficher image
GET {BASE_URL}/api/images/product/1           // Images d'un produit
DELETE {BASE_URL}/api/images/15               // Supprimer image
```

---

## 🎯 EXEMPLES D'UTILISATION IMAGES

### Workflow complet pour ajouter un produit avec images :

1. **Créer les données de référence :**
   ```bash
   POST /api/artists     # Créer l'artiste
   POST /api/categories  # Créer la catégorie
   POST /api/albums      # Créer l'album (optionnel)
   ```

2. **Créer le produit :**
   ```bash
   POST /api/products    # → obtenir productId
   ```

3. **Ajouter les images :**
   ```bash
   POST /api/images/upload?productId={id}  # Upload image 1
   POST /api/images/upload?productId={id}  # Upload image 2
   POST /api/images/upload?productId={id}  # Upload image 3
   ```

4. **Récupérer et afficher :**
   ```bash
   GET /api/images/product/{id}  # Liste des imageIds
   GET /api/images/{imageId}     # Afficher chaque image
   ```

### Intégration frontend :

```html
<!-- Affichage d'une image -->
<img src="http://localhost:8090/api/images/15" alt="Vinyl cover" />

<!-- Galerie d'images d'un produit -->
<script>
// Récupérer les IDs des images
fetch('/api/images/product/1')
  .then(r => r.json())
  .then(imageIds => {
    imageIds.forEach(id => {
      const img = document.createElement('img');
      img.src = `/api/images/${id}`;
      gallery.appendChild(img);
    });
  });
</script>

<!-- Upload d'image -->
<form enctype="multipart/form-data">
  <input type="file" name="file" accept="image/*" />
  <button onclick="uploadImage(productId, file)">Upload</button>
</form>
```

---

## 📊 RÉSUMÉ PAR FONCTIONNALITÉ MÉTIER {#resume}

### 🏠 PAGE D'ACCUEIL
- `GET /api/products` - Liste principale
- `GET /api/products/recent` - Nouveautés
- `GET /api/categories` - Menu genres
- `GET /api/artists` - Menu artistes

### 🔍 RECHERCHE/NAVIGATION
- `GET /api/products/search?query=...` - Recherche globale
- `GET /api/products/category/{id}` - Par genre
- `GET /api/artists/{id}/products` - Par artiste
- `GET /api/artists/search?query=...` - Recherche artistes

### 📱 PAGES DÉTAILS
- `GET /api/products/{id}` - Détails vinyle
- `GET /api/images/product/{id}` - **Images du vinyle** ✨
- `GET /api/artists/{id}` - Page artiste
- `GET /api/users/{id}` - Profil utilisateur

### 🔐 GESTION UTILISATEUR
- `POST /api/users` - Inscription
- `POST /api/users/login` - Connexion
- `PUT /api/users/{id}` - Modifier profil
- `POST /api/addresses` - Ajouter adresse

### ⚙️ ADMINISTRATION
- `POST /api/products` - Ajouter vinyle
- `POST /api/images/upload` - **Ajouter images produit** ✨
- `DELETE /api/images/{id}` - **Supprimer images** ✨
- `POST /api/artists` - Ajouter artiste
- `POST /api/categories` - Ajouter genre
- `GET /api/users` - Gérer utilisateurs

### 🖼️ GESTION IMAGES
- `POST /api/images/upload?productId={id}` - Upload image produit
- `GET /api/images/{imageId}` - Afficher image
- `GET /api/images/product/{productId}` - Galerie produit
- `DELETE /api/images/{imageId}` - Supprimer image

---

## 📈 STATISTIQUES

- **Total endpoints créés** : 41
- **Services** : 4 (Discovery, Gateway, Catalog, User)
- **Ports utilisés** : 8761, 8090, 8081, 8082
- **Base de données** : PostgreSQL avec schémas séparés + stockage images bytea
- **Formats images supportés** : JPG, PNG, WEBP
- **Taille max par image** : 5MB

---

## 🔧 ARCHITECTURE TECHNIQUE

### Microservices
- **vinyl-discovery-service** (8761) - Eureka Server
- **vinyl-gateway-service** (8090) - Spring Cloud Gateway
- **vinyl-catalog-service** (8081) - Gestion des produits + images
- **vinyl-user-service** (8082) - Gestion des utilisateurs

### Technologies
- **Framework** : Spring Boot 3.2.4
- **Java** : Version 21
- **Base de données** : PostgreSQL avec stockage BYTEA pour images
- **ORM** : JPA/Hibernate
- **Upload** : Spring Multipart (max 5MB par fichier)
- **Containerisation** : Docker + Docker Compose

### Patterns implémentés
- API Gateway Pattern
- Service Discovery Pattern
- Database per Service Pattern
- DTO Pattern pour la sécurité
- Multipart File Upload Pattern

### Sécurité Images
- ✅ Validation des types de fichiers (JPG, PNG, WEBP)
- ✅ Limitation de taille (5MB max)
- ✅ Vérification de l'existence du produit
- ✅ Gestion des erreurs et exceptions
- ✅ Headers de cache pour optimisation

---

## 🚀 DÉPLOIEMENT

### Prérequis
- Docker & Docker Compose
- Java 21
- Maven 3.6+
- PostgreSQL (via Docker)

### Commandes de déploiement
```bash
# Build des services
./mvnw clean package -DskipTests

# Lancement des services
docker-compose up --build -d

# Vérification
curl http://localhost:8761          # Eureka
curl http://localhost:8090/api/products  # API via Gateway
```

### Monitoring
- **Eureka Dashboard** : http://localhost:8761
- **Gateway Health** : http://localhost:8090/actuator/health
- **Services Health** : http://localhost:808{1,2}/actuator/health

---

*Documentation générée pour Vinyl Shop API - Version 1.1 avec gestion d'images*

**Date de mise à jour** : Décembre 2024  
**Endpoints totaux** : 41  
**Fonctionnalités** : E-commerce complet avec gestion d'images