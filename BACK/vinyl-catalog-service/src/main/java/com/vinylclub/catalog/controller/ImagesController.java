package com.vinylclub.catalog.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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
     * Get image data (binary)
     */
    @GetMapping(value = "/{id}/data", produces = MediaType.IMAGE_JPEG_VALUE)
    public ResponseEntity<byte[]> getImageData(@PathVariable Long id) {
        try {
            Optional<Images> imageOpt = imagesService.getImageById(id);
            if (imageOpt.isPresent()) {
                Images image = imageOpt.get();
                byte[] imageData = image.getImage();
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG) // Vous pourriez déterminer le type dynamiquement
                        .body(imageData);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Upload a new image for a product
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("productId") Long productId) {
        System.out.println("Receiving upload request for product ID: " + productId);
        System.out.println("File name: " + file.getOriginalFilename());
        System.out.println("File size: " + file.getSize());
        
        try {
            Images uploadedImage = imagesService.storeImage(file, productId);
            return ResponseEntity.status(HttpStatus.CREATED).body(uploadedImage);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Erreur lors de l'upload de l'image: " + e.getMessage());
        }
    }

    /**
     * Upload multiple images for a product
     */
    @PostMapping(value = "/batch", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadMultipleImages(
            @RequestParam("files") MultipartFile[] files,
            @RequestParam("productId") Long productId) {
        try {
            List<Images> uploadedImages = imagesService.storeMultipleImages(files, productId);
            return ResponseEntity.status(HttpStatus.CREATED).body(uploadedImages);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Erreur lors de l'upload des images: " + e.getMessage());
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