package com.vinylclub.favorites.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.vinylclub.favorites.entity.Favorite;

@Repository
public interface FavoriteRepository extends MongoRepository<Favorite, String> {

    boolean existsByUserIdAndProductId(Long userId, String productId);

    Optional<Favorite> findByUserIdAndProductId(Long userId, String productId);

    void deleteByUserIdAndProductId(Long userId, String productId);

    List<Favorite> findByUserIdOrderByCreatedAtDesc(long userId);

    long countByUserId(Long userId);
}

