package com.vinylclub.catalog.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.vinylclub.catalog.entity.Images;

@Repository
public interface ImagesRepository extends JpaRepository<Images, Long> {
    // Méthodes existantes
    List<Images> findByProduct_Id(Long productId);
    boolean existsByProduct_Id(Long productId);
    
    // Nouvelle méthode pour l'insertion directe
    @Modifying
    @Transactional
    @Query(value = "INSERT INTO catalog.images (image, product_id) VALUES (:image, :productId)", nativeQuery = true)
    void insertImageDirectly(@Param("image") byte[] image, @Param("productId") Long productId);
}