package com.vinylclub.catalog.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.RequestHeader;

import com.vinylclub.catalog.dto.CategoryDTO;
import com.vinylclub.catalog.dto.ProductDTO;
import com.vinylclub.catalog.service.CategoryService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
public class CategoryController {
    
    @Autowired
    private CategoryService categoryService;
    
    // @Value("${admin.token}")
    // private String adminToken;
    
    /**
     *Protects routes from user inserts
     */
    // private void checkAdminToken(String token) {
    // if (token == null || !token.equals(adminToken)) {
    //     throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden");
    //     }
    // }

    /**
     *Recover all categories
     *Get /API /Categories
     */
    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
        List<CategoryDTO> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    /**
     *Recover a category by ID
     *Get/API/Categories/1
     */
    @GetMapping("/{id}")
    public ResponseEntity<CategoryDTO> getCategoryById(@PathVariable Long id) {
        CategoryDTO category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(category);
    }

    /**
     *Recover products from a category
     *Get/API/Categories/1/Products? Page = 0 & size = 12
     */
    @GetMapping("/{id}/products")
    public ResponseEntity<Page<ProductDTO>> getProductsByCategory(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductDTO> products = categoryService.getProductsByCategory(id, pageable);
        return ResponseEntity.ok(products);
    }

    /**
     *Create a new category
     *Post /API /Categories
     */
    @PostMapping
    public ResponseEntity<CategoryDTO> createCategory(
            // @RequestHeader(value = "X-ADMIN-TOKEN", required = false) String token,
            @Valid @RequestBody CategoryDTO categoryDTO) {
        
        // checkAdminToken(token);
        CategoryDTO createdCategory = categoryService.createCategory(categoryDTO);
        return ResponseEntity.ok(createdCategory);
    }

    /**
     *Update a category
     *Put/api/categories/1
     */
    @PutMapping("/{id}")
    public ResponseEntity<CategoryDTO> updateCategory(
            // @RequestHeader(value = "X-ADMIN-TOKEN", required = false) String token,
            @PathVariable Long id,
            @Valid @RequestBody CategoryDTO categoryDTO) {

        // checkAdminToken(token);
        CategoryDTO updatedCategory = categoryService.updateCategory(id, categoryDTO);
        return ResponseEntity.ok(updatedCategory);
    }

    /**
     *Delete a category
     *Delete/API/Categories/1
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(
            // @RequestHeader(value = "X-ADMIN-TOKEN", required = false) String token,
            @PathVariable Long id) {

        // checkAdminToken(token);
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}