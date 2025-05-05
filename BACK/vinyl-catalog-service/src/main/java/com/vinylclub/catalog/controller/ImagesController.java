package com.vinylclub.catalog.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import com.vinylclub.catalog.entity.Images;
import com.vinylclub.catalog.service.ImagesService;

@RestController
@RequestMapping("/api/images")
public class ImagesController {

    @Autowired
    private ImagesService imagesService;

    /**
     * Get all images
     */
    @GetMapping
    public List<Images> getAllImages() {
        return imagesService.getAllImages();
    }

    /**
     * Get an image by its ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Images> getImageById(@PathVariable Long id) {
        Optional<Images> image = imagesService.getImageById(id);
        return image.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Create a new image
     */
    @PostMapping
    public Images createImage(@RequestBody Images image) {
        return imagesService.createImage(image);
    }

    /**
     * Create multiple images
     */
    @PostMapping("/batch")
    public List<Images> createImages(@RequestBody List<Images> images) {
        return imagesService.createImages(images);
    }

    /**
     * Update an existing image
     */
    @PutMapping("/{id}")
    public ResponseEntity<Images> updateImage(@PathVariable Long id, @RequestBody Images imageDetails) {
        try {
            Images updatedImage = imagesService.updateImage(id, imageDetails);
            return ResponseEntity.ok(updatedImage);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Delete an image by its ID
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteImage(@PathVariable Long id) {
        imagesService.deleteImage(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Find all images for a specific product
     */
    @GetMapping("/product/{productId}")
    public List<Images> getImagesByProductId(@PathVariable Long productId) {
        return imagesService.findByProductId(productId);
    }

    /**
     * Check if any images exist for a product
     */
    @GetMapping("/product/{productId}/exists")
    public ResponseEntity<Boolean> existsByProductId(@PathVariable Long productId) {
        boolean exists = imagesService.existsByProductId(productId);
        return ResponseEntity.ok(exists);
    }
}
