package com.vinylclub.catalog.repository;
import org.springframework.data.jpa.repository.JpaRepository; // Correction ici: vinylshop -> vinylclub
import org.springframework.stereotype.Repository;

import com.vinylclub.catalog.entity.Artist;

/**
 * Repository interface for Artist entity
 * Extends JpaRepository to inherit standard CRUD operations
 */
@Repository
public interface ArtistRepository extends JpaRepository<Artist, Long> {
        
        /**
         * Find an artist by its name
         * 
         * @param name The name of the artist to find
         * @return The artist with the given name, or null if not found
         */
        Artist findByName(String name);
        
        /**
         * Check if an artist with the given name exists
         * 
         * @param name The name to check
         * @return true if the artist exists, false otherwise
         */
        boolean existsByName(String name);
    
}

