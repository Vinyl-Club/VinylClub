package com.vinylclub.favorites.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vinylclub.favorites.entity.Favorite;
import com.vinylclub.favorites.repository.FavoriteRepository;

@Service
public class FavoriteService {
    
    @Autowired
    private FavoriteRepository favoriteRepository;
    
    public Favorite addFavorite(Long userId, String productId) {
        if (favoriteRepository.existsByUserIdAndProductId(userId, productId)) {
            throw new RuntimeException("Déjà en favoris");
        }
        Favorite favorite = new Favorite(userId, productId);
        return favoriteRepository.save(favorite);
    }
    
    public boolean removeFavorite(Long userId, String productId) {
        if (favoriteRepository.existsByUserIdAndProductId(userId, productId)) {
            favoriteRepository.deleteByUserIdAndProductId(userId, productId);
            return true;
        }
        return false;
    }
    
    public boolean isFavorite(Long userId, String productId) {
        return favoriteRepository.existsByUserIdAndProductId(userId, productId);
    }
    
    public List<Favorite> getUserFavorites(Long userId) {
        return favoriteRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    public long getFavoritesCount(Long userId) {
        return favoriteRepository.countByUserId(userId);
    }
    
    public boolean toggleFavorite(Long userId, String productId) {
        if (isFavorite(userId, productId)) {
            removeFavorite(userId, productId);
            return false; // Deleted
        } else {
            addFavorite(userId, productId);
            return true; // Added
        }
    }

}