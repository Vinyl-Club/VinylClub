package com.vinylclub.catalog.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vinylclub.catalog.entity.Images;
import com.vinylclub.catalog.entity.Product;

import java.util.List;

@Repository
public interface ImagesRepository extends JpaRepository<Images, Long> {
    /**
     * Find all images for a specific product
     *
     * @param product The product
     * @return List of images for the product
     */
    List<Images> findByProduct(Product product);

    /**
     * Check if any images exist for a product
     *
     * @param product The product
     * @return true if images exist, false otherwise
     */
    boolean existsByProduct(Product product);
}
