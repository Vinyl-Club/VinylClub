package com.vinylclub.catalog.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.vinylclub.catalog.entity.Product;
import com.vinylclub.catalog.service.ProductService;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    /**
     * Get all products */
    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    /**
     * Get a product by its ID */
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> product = productService.getProductById(id);
        return product.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Create a new product */
    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productService.createProduct(product);
    }

    /**
     * Create multiple products */
    @PostMapping("/batch")
    public List<Product> createProducts(@RequestBody List<Product> products) {
        return productService.createProducts(products);
    }

    /**
     * Update an existing product */
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        try {
            Product updatedProduct = productService.updateProduct(id, productDetails);
            return ResponseEntity.ok(updatedProduct);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Delete a product by its ID */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Find products by title containing the given substring (case-insensitive) */
    @GetMapping("/search/title")
    public List<Product> findProductsByTitleContaining(@RequestParam String titlePart) {
        return productService.findProductsByTitleContaining(titlePart);
    }

    /**
     * Find products by user ID */
    @GetMapping("/search/user/{userId}")
    public List<Product> findProductsByUserId(@PathVariable Long userId) {
        return productService.findProductsByUserId(userId);
    }

    /**
     * Find products by category ID */
    @GetMapping("/search/category/{categoryId}")
    public List<Product> findProductsByCategoryId(@PathVariable Long categoryId) {
        return productService.findProductsByCategoryId(categoryId);
    }

    /**
     * Find products by artist ID */
    @GetMapping("/search/artist/{artistId}")
    public List<Product> findProductsByArtistId(@PathVariable Long artistId) {
        return productService.findProductsByArtistId(artistId);
    }

    /**
     * Find products by album ID */
    @GetMapping("/search/album/{albumId}")
    public List<Product> findProductsByAlbumId(@PathVariable Long albumId) {
        return productService.findProductsByAlbumId(albumId);
    }

    /**
     * Find products by price range */
    @GetMapping("/search/price")
    public List<Product> findProductsByPriceRange(@RequestParam Double minPrice, @RequestParam Double maxPrice) {
        return productService.findProductsByPriceRange(minPrice, maxPrice);
    }
}
