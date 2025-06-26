package com.vinylclub.favorites.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vinylclub.favorites.entity.Favorite;
import com.vinylclub.favorites.service.FavoriteService;

@RestController
@RequestMapping("/api/favorites")
// @CrossOrigin(origins = "*")
public class FavoriteController {
    
    @Autowired
    private FavoriteService favoriteService;
    
    // Toggle favori (ajouter/supprimer)
    @PostMapping("/toggle")
    public ResponseEntity<?> toggleFavorite(@RequestBody Favorite favorite) {
        try {
            boolean isAdded = favoriteService.toggleFavorite(favorite.getUserId(), favorite.getProductId());
            return ResponseEntity.ok(Map.of(
                "success", true,
                "action", isAdded ? "added" : "removed", 
                "isFavorite", isAdded
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // Vérifier si en favori
    @GetMapping("/check/{userId}/{productId}")
    public ResponseEntity<Map<String, Boolean>> checkFavorite(
            @PathVariable String userId, 
            @PathVariable String productId) {
        boolean isFav = favoriteService.isFavorite(userId, productId);
        return ResponseEntity.ok(Map.of("isFavorite", isFav));
    }
    
    // Liste des favoris
    @GetMapping("/{userId}")
    public ResponseEntity<List<Favorite>> getUserFavorites(@PathVariable String userId) {
        List<Favorite> favorites = favoriteService.getUserFavorites(userId);
        return ResponseEntity.ok(favorites);
    }
    
    // Nombre de favoris
    @GetMapping("/{userId}/count")
    public ResponseEntity<Map<String, Long>> getFavoritesCount(@PathVariable String userId) {
        long count = favoriteService.getFavoritesCount(userId);
        return ResponseEntity.ok(Map.of("count", count));
    }
}
