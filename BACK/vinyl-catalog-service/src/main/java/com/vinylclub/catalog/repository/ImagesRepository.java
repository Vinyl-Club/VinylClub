package com.vinylclub.catalog.repository;

import java.sql.Blob;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vinylclub.catalog.entity.Images;

@Repository
public interface ImagesRepository extends JpaRepository<Images, Long> {
    /**
     * Find an image by its content
     * 
     * @param image The Blob content of the image to find
     * @return The image with the given content, or null if not found
     */
    Images findByImage(Blob image);
    
    /**
     * Check if an image with the given content exists
     * 
     * @param image The Blob content to check
     * @return true if the image exists, false otherwise
     */
    boolean existsByImage(Blob image);
}