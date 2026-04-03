package com.vinylclub.catalog.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

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

    @Autowired
    private Cloudinary cloudinary;

    /**
     * Upload image to Cloudinary + save URL in DB
     */
    public Images saveImage(MultipartFile file, Long productId) throws IOException {

        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        // Upload to Cloudinary
        Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.emptyMap()
        );

        String secureUrl = uploadResult.get("secure_url").toString();
        String publicId = uploadResult.get("public_id").toString();

        Images image = new Images();
        image.setProduct(product);
        image.setImageUrl(secureUrl);
        image.setPublicId(publicId);

        return imageRepository.save(image);
    }

    /**
     * Get image by ID
     */
    public Images getImageById(Long imageId) {
        return imageRepository.findById(imageId)
            .orElseThrow(() -> new RuntimeException("Image not found with id: " + imageId));
    }

    /**
     * Get image IDs by product
     */
    public List<Long> getImageIdsByProductId(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new RuntimeException("Product not found with id: " + productId);
        }

        return imageRepository.findByProductId(productId)
                .stream()
                .map(Images::getId)
                .collect(Collectors.toList());
    }

    /**
     * Get images DTO by product
     */
    public List<ImageDTO> getImageDTOsByProductId(Long productId) {
        return imageRepository.findByProductId(productId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ImageDTO convertToDTO(Images imageEntity) {
        ImageDTO dto = new ImageDTO();
        dto.setId(imageEntity.getId());
        dto.setProductId(imageEntity.getProduct().getId());
        dto.setImageUrl(imageEntity.getImageUrl());
        dto.setPublicId(imageEntity.getPublicId());
        return dto;
    }

    /**
     * Delete image (Cloudinary + DB)
     */
    public void deleteImage(Long imageId) throws IOException {
        Images image = imageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        // Delete from Cloudinary
        cloudinary.uploader().destroy(image.getPublicId(), ObjectUtils.emptyMap());

        imageRepository.delete(image);
    }

    /**
     * Delete all images of product
     */
    public void deleteImagesByProductId(Long productId) throws IOException {
        List<Images> images = imageRepository.findByProductId(productId);

        for (Images image : images) {
            cloudinary.uploader().destroy(image.getPublicId(), ObjectUtils.emptyMap());
        }

        imageRepository.deleteAll(images);
    }

    public long countImagesByProductId(Long productId) {
        return imageRepository.countByProductId(productId);
    }
}