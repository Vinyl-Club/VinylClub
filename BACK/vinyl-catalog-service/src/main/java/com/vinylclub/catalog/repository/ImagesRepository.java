package com.vinylclub.catalog.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vinylclub.catalog.entity.Images;
import java.util.List;

@Repository
public interface ImagesRepository extends JpaRepository<Images, Long> {
    /**
     * Find all images for a specific product
     * 
     * @param productId The ID of the product
     * @return List of images for the product
     */
    List<Images> findByProductId(Long productId);
    
    /**
     * Check if any images exist for a product
     * 
     * @param productId The ID of the product
     * @return true if images exist, false otherwise
     */
    boolean existsByProductId(Long productId);
}