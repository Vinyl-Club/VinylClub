package com.vinylclub.catalog.controller;

import com.vinylclub.catalog.dto.ImageUploadResponse;
import com.vinylclub.catalog.entity.Images;
import com.vinylclub.catalog.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "*")
public class ImageController {

    @Autowired
    private ImageService imageService;

    /**
     * UPLOAD IMAGE - Ajouter une image pour un produit
     * POST /api/images/upload?productId=1
     */
    @PostMapping("/upload")
    public ResponseEntity<ImageUploadResponse> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("productId") Long productId) {
        
        try {
            // Validation du fichier
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ImageUploadResponse(false, "Fichier vide", null));
            }

            // Validation du type de fichier
            String contentType = file.getContentType();
            if (!isValidImageType(contentType)) {
                return ResponseEntity.badRequest()
                    .body(new ImageUploadResponse(false, "Type de fichier non supporté. Utilisez JPG, PNG, ou WEBP", null));
            }

            // Validation de la taille (max 5MB)
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest()
                    .body(new ImageUploadResponse(false, "Fichier trop volumineux. Maximum 5MB", null));
            }

            // Sauvegarder l'image
            Images savedImage = imageService.saveImage(file, productId);
            
            ImageUploadResponse response = new ImageUploadResponse(
                true, 
                "Image uploadée avec succès", 
                savedImage.getId()
            );
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ImageUploadResponse(false, "Erreur lors de la lecture du fichier", null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(new ImageUploadResponse(false, e.getMessage(), null));
        }
    }

    /**
     * GET IMAGE - Récupérer une image par son ID
     * GET /api/images/1
     */
    @GetMapping("/{imageId}")
    public ResponseEntity<byte[]> getImage(@PathVariable Long imageId) {
        try {
            Images image = imageService.getImageById(imageId);
            
            // Déterminer le type MIME
            String contentType = determineContentType(image.getImage());
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(contentType));
            headers.setContentLength(image.getImage().length);
            
            // Cache headers pour optimiser les performances
            headers.setCacheControl("public, max-age=31536000"); // 1 an
            
            return new ResponseEntity<>(image.getImage(), headers, HttpStatus.OK);
            
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET IMAGES BY PRODUCT - Récupérer toutes les images d'un produit
     * GET /api/images/product/1
     */
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Long>> getImagesByProduct(@PathVariable Long productId) {
        try {
            List<Long> imageIds = imageService.getImageIdsByProductId(productId);
            return ResponseEntity.ok(imageIds);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    /**
     * DELETE IMAGE - Supprimer une image
     * DELETE /api/images/1
     */
    @DeleteMapping("/{imageId}")
    public ResponseEntity<Void> deleteImage(@PathVariable Long imageId) {
        try {
            imageService.deleteImage(imageId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Validation du type de fichier image
     */
    private boolean isValidImageType(String contentType) {
        return contentType != null && (
            contentType.equals("image/jpeg") ||
            contentType.equals("image/jpg") ||
            contentType.equals("image/png") ||
            contentType.equals("image/webp")
        );
    }

    /**
     * Déterminer le type MIME à partir des bytes
     */
    private String determineContentType(byte[] imageBytes) {
        if (imageBytes.length < 4) {
            return "application/octet-stream";
        }

        // Vérifier les signatures de fichiers
        if (imageBytes[0] == (byte) 0xFF && imageBytes[1] == (byte) 0xD8) {
            return "image/jpeg";
        }
        if (imageBytes[0] == (byte) 0x89 && imageBytes[1] == 'P' && 
            imageBytes[2] == 'N' && imageBytes[3] == 'G') {
            return "image/png";
        }
        if (imageBytes[8] == 'W' && imageBytes[9] == 'E' && 
            imageBytes[10] == 'B' && imageBytes[11] == 'P') {
            return "image/webp";
        }

        return "image/jpeg"; // Par défaut
    }
}