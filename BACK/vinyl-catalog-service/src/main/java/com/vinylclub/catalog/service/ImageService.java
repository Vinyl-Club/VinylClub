package com.vinylclub.catalog.service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.vinylclub.catalog.dto.ImageDTO;
import com.vinylclub.catalog.entity.Images;
import com.vinylclub.catalog.entity.Product;
import com.vinylclub.catalog.repository.ImageRepository;
import com.vinylclub.catalog.repository.ProductRepository;

@Service
@Transactional
public class ImageService {

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private ProductRepository productRepository;

    /**
     *Save an image for a product
     */
    public Images saveImage(MultipartFile file, Long productId) throws IOException {
        // Check that the product exists
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        // Create the image entity
        Images image = new Images();
        image.setProduct(product);
        image.setImage(file.getBytes());

        // Save in base
        return imageRepository.save(image);
    }



    /**
     *Recover an image by his ID
     */
    public Images getImageById(Long imageId) {
        return imageRepository.findById(imageId)
            .orElseThrow(() -> new RuntimeException("Image not found with id: " + imageId));
    }

    /**
     *Recover the IDS IDs from a product
     */
    public List<Long> getImageIdsByProductId(Long productId) {
        // Check that the product exists
        if (!productRepository.existsById(productId)) {
            throw new RuntimeException("Product not found with id: " + productId);
        }

        List<Images> images = imageRepository.findByProductId(productId);
        return images.stream()
                .map(Images::getId)
                .collect(Collectors.toList());
    }

    /**
     *Recover all the images of a product (with bytes)
     */
public List<ImageDTO> getImageDTOsByProductId(Long productId) {
    // Suppose you have a method in your restitory to recover by Productid
    List<Images> images = imageRepository.findByProductId(productId);
    
    return images.stream()
        .map(this::convertToDTO)
        .collect(Collectors.toList());
}

/**
 * Conversion Images Entity → ImageDTO
 */
private ImageDTO convertToDTO(Images imageEntity) {
    ImageDTO imageDTO = new ImageDTO();
    imageDTO.setId(imageEntity.getId());
    imageDTO.setImage(imageEntity.getImage());
    imageDTO.setProductId(imageEntity.getProduct().getId());
    return imageDTO;
}

    /**
     * Delete an image
     */
    public void deleteImage(Long imageId) {
        if (!imageRepository.existsById(imageId)) {
            throw new RuntimeException("Image not found with id: " + imageId);
        }
        imageRepository.deleteById(imageId);
    }

    /**
     *Delete all images from a product
     */
    public void deleteImagesByProductId(Long productId) {
        List<Images> images = imageRepository.findByProductId(productId);
        imageRepository.deleteAll(images);
    }

    /**
     *Count the number of images of a product
     */
    public long countImagesByProductId(Long productId) {
        return imageRepository.countByProductId(productId);
    }
}