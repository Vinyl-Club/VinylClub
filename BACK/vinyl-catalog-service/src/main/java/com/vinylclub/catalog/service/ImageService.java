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
     * Sauvegarder une image pour un produit
     */
    public Images saveImage(MultipartFile file, Long productId) throws IOException {
        // Vérifier que le produit existe
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        // Créer l'entité Image
        Images image = new Images();
        image.setProduct(product);
        image.setImage(file.getBytes());

        // Sauvegarder en base
        return imageRepository.save(image);
    }



    /**
     * Récupérer une image par son ID
     */
    public Images getImageById(Long imageId) {
        return imageRepository.findById(imageId)
            .orElseThrow(() -> new RuntimeException("Image not found with id: " + imageId));
    }

    /**
     * Récupérer les IDs des images d'un produit
     */
    public List<Long> getImageIdsByProductId(Long productId) {
        // Vérifier que le produit existe
        if (!productRepository.existsById(productId)) {
            throw new RuntimeException("Product not found with id: " + productId);
        }

        List<Images> images = imageRepository.findByProductId(productId);
        return images.stream()
                .map(Images::getId)
                .collect(Collectors.toList());
    }

    /**
     * Récupérer toutes les images d'un produit (avec bytes)
     */
public List<ImageDTO> getImageDTOsByProductId(Long productId) {
    // Supposons que vous avez une méthode dans votre repository pour récupérer par productId
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
     * Supprimer une image
     */
    public void deleteImage(Long imageId) {
        if (!imageRepository.existsById(imageId)) {
            throw new RuntimeException("Image not found with id: " + imageId);
        }
        imageRepository.deleteById(imageId);
    }

    /**
     * Supprimer toutes les images d'un produit
     */
    public void deleteImagesByProductId(Long productId) {
        List<Images> images = imageRepository.findByProductId(productId);
        imageRepository.deleteAll(images);
    }

    /**
     * Compter le nombre d'images d'un produit
     */
    public long countImagesByProductId(Long productId) {
        return imageRepository.countByProductId(productId);
    }
}