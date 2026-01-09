package com.vinylclub.catalog.controller;

import java.util.List;
import java.math.BigDecimal;

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

import com.vinylclub.catalog.dto.ProductDTO;
import com.vinylclub.catalog.service.ProductService;
import com.vinylclub.catalog.entity.ProductFormat;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/products")
// @CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService productService;

    /**
     * Home page -All products with pagination
     * Get /API /Products? Page = 0 & size = 12
     */
    @GetMapping
    public ResponseEntity<Page<ProductDTO>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductDTO> products = productService.getAllProducts(pageable);
        return ResponseEntity.ok(products);
    }

    /**
     * Home page -Recent products/Vedottes
     * Get/API/Products/Recent
     */
    @GetMapping("/recent")
    public ResponseEntity<List<ProductDTO>> getRecentProducts(
            @RequestParam(defaultValue = "8") int limit) {
        List<ProductDTO> recentProducts = productService.getRecentProducts(limit);
        return ResponseEntity.ok(recentProducts);
    }

    /**
     * Product details -A specific product
     * Get/API/Products/1
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        ProductDTO product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    /**
     * Research -Search for products
     * Get/API/Products/Search? Query = Rock & Page = 0 & size = 12
     */
    @GetMapping("/search")
    public ResponseEntity<Page<ProductDTO>> searchProducts(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductDTO> results = productService.searchProducts(query, pageable);
        return ResponseEntity.ok(results);
    }

    /**
     * Filter -Products by category
     * Get/API/Products/Category/1? Page = 0 & size = 12
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<Page<ProductDTO>> getProductsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductDTO> products = productService.getProductsByCategory(categoryId, pageable);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/price")
    public ResponseEntity<Page<ProductDTO>> getProductsByPrice(
            @RequestParam BigDecimal price,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<ProductDTO> products = productService.getProductsByPrice(price, pageable);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/format")
    public ResponseEntity<Page<ProductDTO>> getProductsByFormat(
            @RequestParam ProductFormat format,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<ProductDTO> products = productService.getProductsByFormat(format, pageable);
        return ResponseEntity.ok(products);
    }

    /**
     * Admin -Create a new product
     * Post /API /Products
     */
    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody ProductDTO productDTO) {
        ProductDTO createdProduct = productService.createProduct(productDTO);
        return ResponseEntity.ok(createdProduct);
    }

    /**
     * Admin -Update a product
     * Put/API/Products/1
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductDTO productDTO) {
        ProductDTO updatedProduct = productService.updateProduct(id, productDTO);
        return ResponseEntity.ok(updatedProduct);
    }

    /**
     * Admin -Delete a product
     * Delete/API/Products/1
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}