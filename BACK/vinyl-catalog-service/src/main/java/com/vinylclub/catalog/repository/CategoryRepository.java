package com.vinylclub.catalog.repository;

import org.springframework.data.jpa.repository.JpaRepository; // Correction ici: vinylshop -> vinylclub
import org.springframework.stereotype.Repository;

import com.vinylclub.catalog.entity.Category;

/**
 * Repository interface for Category entity
 * Extends JpaRepository to inherit standard CRUD operations
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    /**
     * Find a category by its name
     * 
     * @param name The name of the category to find
     * @return The category with the given name, or null if not found
     */
    Category findByName(String name);
    
    /**
     * Check if a category with the given name exists
     * 
     * @param name The name to check
     * @return true if the category exists, false otherwise
     */
    boolean existsByName(String name);
}
