package com.vinylclub.favorites.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.http.HttpStatus;
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
    
    // Toggle favorite (add/remove)
    @PostMapping("/toggle")
    public ResponseEntity<?> toggleFavorite(
        @RequestHeader("X-User-Id") Long requesterId,
        @RequestBody Favorite favorite
    ) {
        try {
            if(favorite.getUserId() == null || !favorite.getUserId().equals(requesterId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

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
    
    // Check if favorited
    @GetMapping("/check/{userId}/{productId}")
    public ResponseEntity<Map<String, Boolean>> checkFavorite(
            @RequestHeader("X-User-Id") Long requesterId,
            @PathVariable Long userId,
            @PathVariable String productId
        ) {
            if(!userId.equals(requesterId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        
        boolean isFav = favoriteService.isFavorite(userId, productId);
        return ResponseEntity.ok(Map.of("isFavorite", isFav));
    }
    
    // List of favorites
    @GetMapping("/{userId}")
    public ResponseEntity<List<Favorite>> getUserFavorites(
        @PathVariable Long userId,
        @RequestHeader("X-User-Id") Long requesterId
    ) {
        if(!userId.equals(requesterId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

        List<Favorite> favorites = favoriteService.getUserFavorites(userId);
        return ResponseEntity.ok(favorites);
    }
    
    // Number of favorites
    @GetMapping("/{userId}/count")
    public ResponseEntity<Map<String, Long>> getFavoritesCount(
        @PathVariable Long userId,
        @RequestHeader("X-User-Id") Long requesterId
    ) {
        if(!userId.equals(requesterId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

        long count = favoriteService.getFavoritesCount(userId);
        return ResponseEntity.ok(Map.of("count", count));
    }
}
