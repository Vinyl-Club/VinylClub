package com.vinylclub.favorites.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.vinylclub.favorites.entity.Favorite;

@Repository
public interface FavoriteRepository extends MongoRepository<Favorite, String> {
   
    boolean existsByUserIdAndProductId(String userId, String productId);
   
    Optional<Favorite> findByUserIdAndProductId(String userId, String productId);
   
    void deleteByUserIdAndProductId(String userId, String productId);
   
    List<Favorite> findByUserIdOrderByCreatedAtDesc(String userId);
   
    long countByUserId(String userId);
}

