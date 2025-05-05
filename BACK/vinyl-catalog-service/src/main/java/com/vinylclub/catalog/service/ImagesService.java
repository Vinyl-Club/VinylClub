package com.vinylclub.catalog.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.vinylclub.catalog.entity.Images;
import com.vinylclub.catalog.entity.Product;
import com.vinylclub.catalog.repository.ImagesRepository;

@Service
public class ImagesService {

    @Autowired
    private ImagesRepository imagesRepository;

    /**
     * Get all images
     */
    public List<Images> getAllImages() {
        return imagesRepository.findAll();
    }

    /**
     * Get an image by its ID
     */
    public Optional<Images> getImageById(Long id) {
        return imagesRepository.findById(id);
    }

    /**
     * Create a new image
     */
    public Images createImage(Images image) {
        return imagesRepository.save(image);
    }

    /**
     * Create multiple images
     */
    public List<Images> createImages(List<Images> images) {
        return images.stream()
                .map(imagesRepository::save)
                .collect(Collectors.toList());
    }

    /**
     * Update an existing image
     */
    public Images updateImage(Long id, Images imageDetails) {
        Images image = imagesRepository.findById(id).orElseThrow(() -> new RuntimeException("Image not found"));
        image.setProduct(imageDetails.getProduct());
        image.setImage(imageDetails.getImage());
        return imagesRepository.save(image);
    }

    /**
     * Delete an image by its ID
     */
    public void deleteImage(Long id) {
        imagesRepository.deleteById(id);
    }

    /**
     * Find all images for a specific product
     */
    public List<Images> findByProductId(Long productId) {
        Product product = new Product();
        product.setId(productId);
        return imagesRepository.findByProduct(product);
    }

    /**
     * Check if any images exist for a product
     */
    public boolean existsByProductId(Long productId) {
        Product product = new Product();
        product.setId(productId);
        return imagesRepository.existsByProduct(product);
    }
}
