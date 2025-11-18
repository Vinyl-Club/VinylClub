package com.vinylclub.catalog.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.vinylclub.catalog.entity.Images;

@Repository
public interface ImageRepository extends JpaRepository<Images, Long> {
    
    /**
     *Find all the images of a product
     */
    @Query("SELECT i FROM Images i WHERE i.product.id = :productId")
    List<Images> findByProductId(@Param("productId") Long productId);
    
    /**
     *Count the number of images of a product
     */
    @Query("SELECT COUNT(i) FROM Images i WHERE i.product.id = :productId")
    long countByProductId(@Param("productId") Long productId);
    
    /**
     *Check if a product has images
     */
    @Query("SELECT CASE WHEN COUNT(i) > 0 THEN true ELSE false END FROM Images i WHERE i.product.id = :productId")
    boolean existsByProductId(@Param("productId") Long productId);
    
    /**
     *Delete all images from a product
     */
    @Query("DELETE FROM Images i WHERE i.product.id = :productId")
    void deleteByProductId(@Param("productId") Long productId);
}