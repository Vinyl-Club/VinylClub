package com.vinylclub.catalog.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.vinylclub.catalog.dto.ImageDTO;
import com.vinylclub.catalog.dto.ImageUploadResponse;
import com.vinylclub.catalog.entity.Images;
import com.vinylclub.catalog.service.ImageService;
import org.springframework.web.bind.annotation.RequestHeader;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    @Autowired
    private ImageService imageService;

    /**
     * Upload image to Cloudinary
     */
    @PostMapping("/upload")
    public ResponseEntity<ImageUploadResponse> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("productId") Long productId,
            @RequestHeader("X-User-Id") Long userId) {

        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new ImageUploadResponse(false, "Fichier vide", null));
            }

            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest()
                        .body(new ImageUploadResponse(false, "Fichier trop volumineux (max 5MB)", null));
            }

            Images savedImage = imageService.saveImage(file, productId);

            return ResponseEntity.ok(
                    new ImageUploadResponse(
                            true,
                            "Image uploadée avec succès",
                            savedImage.getId()));

        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(new ImageUploadResponse(false, "Erreur lors de l'upload", null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new ImageUploadResponse(false, e.getMessage(), null));
        }
    }

    /**
     * Get all images of a product
     */
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ImageDTO>> getImagesByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(imageService.getImageDTOsByProductId(productId));
    }

    /**
     * Delete image (Cloudinary + DB)
     */
    @DeleteMapping("/{imageId}")
    public ResponseEntity<Void> deleteImage(@PathVariable Long imageId) {
        try {
            imageService.deleteImage(imageId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}