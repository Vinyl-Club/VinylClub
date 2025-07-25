package com.vinylclub.catalog.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.vinylclub.catalog.dto.ImageUploadResponse;
import com.vinylclub.catalog.entity.Images;
import com.vinylclub.catalog.service.ImageService;
import com.vinylclub.catalog.dto.ImageDTO;


@RestController
@RequestMapping("/api/images")
// @CrossOrigin(origins = "*")
public class ImageController {

    @Autowired
    private ImageService imageService;

    /**
     *Upload Image -Add an image for a product
     *Post/API/Images/Upload? Productid = 1
     */
    @PostMapping("/upload")
    public ResponseEntity<ImageUploadResponse> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("productId") Long productId) {
        
        try {
            // File validation
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ImageUploadResponse(false, "Fichier vide", null));
            }

            // File type validation
            String contentType = file.getContentType();
            if (!isValidImageType(contentType)) {
                return ResponseEntity.badRequest()
                    .body(new ImageUploadResponse(false, "Type de fichier non supporté. Utilisez JPG, PNG, ou WEBP", null));
            }

            // Size validation (max 5MB)
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest()
                    .body(new ImageUploadResponse(false, "Fichier trop volumineux. Maximum 5MB", null));
            }

            // Save image
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
     *Get Image -Recover an image by his ID
     *Get/API/Images/1
     */
@GetMapping("/{imageId}")
public ResponseEntity<byte[]> getImage(@PathVariable Long imageId) {
    try {
        System.out.println("=== DEBUG: Récupération image ID: " + imageId + " ===");
        
        Images image = imageService.getImageById(imageId);
        
        if (image == null) {
            System.out.println("DEBUG: Image null");
            return ResponseEntity.notFound().build();
        }
        
        byte[] imageBytes = image.getImage();
        if (imageBytes == null) {
            System.out.println("DEBUG: Image bytes null");
            return ResponseEntity.notFound().build();
        }
        
        System.out.println("DEBUG: Image trouvée, taille: " + imageBytes.length + " bytes");
        
        // Simplified version of the Headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_JPEG); // By default JPEG
        headers.setContentLength(imageBytes.length);
        
        System.out.println("DEBUG: Headers configurés, retour de l'image");
        
        return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
        
    } catch (Exception e) {
        System.err.println("=== ERREUR dans getImage: " + e.getMessage() + " ===");
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}

    /**
     *Get images by product -Recover all the images of a product
     *Get/API/Images/Product/1
     */
    @GetMapping("/product/{productId}")
public ResponseEntity<List<ImageDTO>> getImagesByProduct(@PathVariable Long productId) {
 List<ImageDTO> images = imageService.getImageDTOsByProductId(productId);
        return ResponseEntity.ok(images);
}

    /**
     *DELETE IMAGE -Supprimer une image
     *DELETE /api/images/1
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
     *Validation of the image file type
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
     *Determine the MIME type from bytes
     */
    private String determineContentType(byte[] imageBytes) {
        if (imageBytes.length < 4) {
            return "application/octet-stream";
        }

        // Check file signatures
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

        return "image/jpeg"; // By default
    }
}