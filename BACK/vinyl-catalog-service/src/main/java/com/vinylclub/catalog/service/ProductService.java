package com.vinylclub.catalog.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vinylclub.catalog.entity.Product;
import com.vinylclub.catalog.repository.ProductRepository;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // Get all products
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Get an product by its ID
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }
    
    /**
     * Create a new product */
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    /**
     * Create multiple products */
    public List<Product> createProducts(List<Product> products) {
        return productRepository.saveAll(products);
    }

    /**
     * Update an existing product */
    public Product updateProduct(Long id, Product productDetails) {
        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        product.setTitle(productDetails.getTitle());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setCategory(productDetails.getCategory());
        product.setArtist(productDetails.getArtist());
        product.setQuantity(productDetails.getQuantity());
        product.setReleaseYear(productDetails.getReleaseYear());
        product.setImages(productDetails.getImages());
        product.setCreatedAt(productDetails.getCreatedAt());
        product.setUpdatedAt(productDetails.getUpdatedAt());
        product.setStatus(productDetails.getStatus());
        product.setState(productDetails.getState());
        return productRepository.save(product);
    }

    /**
     * Delete a product by its ID */
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    /**
     * Find products by title containing the given substring (case-insensitive) */
    public List<Product> findProductsByTitleContaining(String titlePart) {
        return productRepository.findByTitleContainingIgnoreCase(titlePart);
    }

    /**
     * Find products by user ID */
    public List<Product> findProductsByUserId(Long userId) {
        return productRepository.findByUserId(userId);
    }

    /**
     * Find products by category ID */
    public List<Product> findProductsByCategoryId(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    /**
     * Find products by artist ID */
    public List<Product> findProductsByArtistId(Long artistId) {
        return productRepository.findByArtistId(artistId);
    }

    /**
     * Find products by album ID */
    public List<Product> findProductsByAlbumId(Long albumId) {
        return productRepository.findByAlbumId(albumId);
    }

    /**
     * Find products by price range */
    public List<Product> findProductsByPriceRange(Double minPrice, Double maxPrice) {
        return productRepository.findByPriceBetween(minPrice, maxPrice);
    }
}
