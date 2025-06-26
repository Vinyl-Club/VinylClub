# 🎵 API Favorites - Documentation

## 📋 Informations générales

- **Service** : vinyl-favorites-service
- **Port** : 8084
- **Base de données** : MongoDB
- **URL de base** : `http://localhost:8084/api/favorites`

## 🔗 Endpoints disponibles

### 1. Toggle Favori (Ajouter/Supprimer)

**Endpoint :** `POST /api/favorites/toggle`

**Description :** Ajoute ou supprime un favori selon son état actuel.

**Request Body :**
```json
{
  "userId": "string",
  "productId": "string"
}
```

**Response :**
```json
{
  "success": true,
  "action": "added|removed",
  "isFavorite": true|false
}
```

**Exemple :**
```bash
curl -X POST http://localhost:8084/api/favorites/toggle \
  -H "Content-Type: application/json" \
  -d '{"userId": "user123", "productId": "vinyl456"}'
```

---

### 2. Vérifier si un produit est en favori

**Endpoint :** `GET /api/favorites/check/{userId}/{productId}`

**Description :** Vérifie si un produit spécifique est dans les favoris d'un utilisateur.

**Paramètres :**
- `userId` : ID de l'utilisateur
- `productId` : ID du produit

**Response :**
```json
{
  "isFavorite": true|false
}
```

**Exemple :**
```bash
curl http://localhost:8084/api/favorites/check/user123/vinyl456
```

---

### 3. Liste des favoris d'un utilisateur

**Endpoint :** `GET /api/favorites/{userId}`

**Description :** Récupère tous les favoris d'un utilisateur, triés par date d'ajout décroissante.

**Paramètres :**
- `userId` : ID de l'utilisateur

**Response :**
```json
[
  {
    "id": "675a1b2c3d4e5f6789012345",
    "userId": "user123",
    "productId": "vinyl456",
    "addedAt": "2025-06-26T08:30:15.123"
  },
  {
    "id": "675a1b2c3d4e5f6789012346",
    "userId": "user123",
    "productId": "vinyl789",
    "addedAt": "2025-06-26T08:25:10.456"
  }
]
```

**Exemple :**
```bash
curl http://localhost:8084/api/favorites/user123
```

---

### 4. Compter les favoris d'un utilisateur

**Endpoint :** `GET /api/favorites/{userId}/count`

**Description :** Retourne le nombre total de favoris d'un utilisateur.

**Paramètres :**
- `userId` : ID de l'utilisateur

**Response :**
```json
{
  "count": 5
}
```

**Exemple :**
```bash
curl http://localhost:8084/api/favorites/user123/count
```

---

### 5. Health Check

**Endpoint :** `GET /actuator/health`

**Description :** Vérifie le statut de santé du service.

**Response :**
```json
{
  "status": "UP"
}
```

**Exemple :**
```bash
curl http://localhost:8084/actuator/health
```

## 📊 Résumé des endpoints

| Endpoint | Méthode | Description | Authentification |
|----------|---------|-------------|------------------|
| `/toggle` | POST | Ajouter/Supprimer favori | Non |
| `/check/{userId}/{productId}` | GET | Vérifier favori | Non |
| `/{userId}` | GET | Liste des favoris | Non |
| `/{userId}/count` | GET | Compter les favoris | Non |
| `/actuator/health` | GET | Santé du service | Non |

## 🛠️ Technologies utilisées

- **Framework** : Spring Boot 3.2.4
- **Base de données** : MongoDB 7
- **Port** : 8084
- **Architecture** : Microservice
- **Registry** : Eureka Discovery

## 🚀 Démarrage rapide

```bash
# Démarrer le service avec Docker Compose
docker-compose up vinyl-favorites-service mongo-db

# Tester l'API
curl http://localhost:8084/actuator/health
```

## 📝 Modèle de données

### Entité Favorite

```json
{
  "id": "string",           // ID unique MongoDB
  "userId": "string",       // ID de l'utilisateur
  "productId": "string",    // ID du produit (référence vers catalog)
  "addedAt": "datetime"     // Date d'ajout du favori
}
```

### Index MongoDB

- **Index unique** : `{ "userId": 1, "productId": 1 }` 
  - Empêche les doublons de favoris pour un même utilisateur/produit
- **Index de tri** : `{ "userId": 1, "addedAt": -1 }`
  - Optimise les requêtes de liste triée par date