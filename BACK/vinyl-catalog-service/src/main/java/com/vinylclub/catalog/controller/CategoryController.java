package com.vinylclub.catalog.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vinylclub.catalog.entity.Category;
import com.vinylclub.catalog.repository.CategoryRepository;

/**
 * REST Controller for handling Category-related HTTP requests.
 * Provides endpoints for creating and retrieving music categories.
 */
@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    // Repository for database operations on categories
    private final CategoryRepository categoryRepository;

    /**
     * Constructor with dependency injection for CategoryRepository.
     * @param categoryRepository The repository for Category entities
     */
    @Autowired
    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    /**
     * Creates a new category.
     * 
     * @param category The category object from request body
     * @return ResponseEntity with the created category and HTTP 201 status
     */
    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        Category savedCategory = categoryRepository.save(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCategory);
    }
    
    /**
     * Retrieves all categories.
     * 
     * @return List of all categories
     */
    @GetMapping
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
    
    /**
     * Retrieves a category by its ID.
     * 
     * @param id The ID of the category to retrieve
     * @return ResponseEntity with the category if found, or 404 status if not found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id) {
        return categoryRepository.findById(id)
                .map(category -> ResponseEntity.ok(category))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Retrieves a category by its name.
     * Note: This endpoint conflicts with the getCategoryById method 
     * as they have the same path pattern. Spring won't be able to
     * distinguish between them.
     * 
     * @param name The name of the category to retrieve
     * @return ResponseEntity with the category if found, or 404 status if not found
     */
    @GetMapping("/{name}")
    public ResponseEntity<Category> getCategoryByName(@PathVariable String name) {
        Category category = categoryRepository.findByName(name);
        if (category != null) {
            return ResponseEntity.ok(category);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}