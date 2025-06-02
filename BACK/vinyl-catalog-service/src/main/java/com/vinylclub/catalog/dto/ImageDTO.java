package com.vinylclub.catalog.dto;

public class ImageDTO {
    private Long id;
    private byte[] image;        // données binaires de l'image (correspond à votre entity Images)
    private Long productId;      // ID du produit associé (au lieu de l'objet Product complet)

    // Constructeurs
    public ImageDTO() {}

    public ImageDTO(byte[] image, Long productId) {
        this.image = image;
        this.productId = productId;
    }

    public ImageDTO(Long id, byte[] image, Long productId) {
        this.id = id;
        this.image = image;
        this.productId = productId;
    }

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public byte[] getImage() { return image; }
    public void setImage(byte[] image) { 
        this.image = image;
    }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    // Méthodes utilitaires
    public String getBase64Image() {
        if (image == null) return null;
        return java.util.Base64.getEncoder().encodeToString(image);
    }

    public void setBase64Image(String base64Image) {
        if (base64Image == null) {
            this.image = null;
        } else {
            this.image = java.util.Base64.getDecoder().decode(base64Image);
        }
    }

    /**
     * Retourne la taille de l'image en bytes
     */
    public long getImageSize() {
        return image != null ? image.length : 0;
    }

    /**
     * Détermine le type MIME à partir des bytes de l'image
     */
    public String determineContentType() {
        if (image == null || image.length < 4) {
            return "application/octet-stream";
        }

        // Vérifier les signatures de fichiers
        if (image[0] == (byte) 0xFF && image[1] == (byte) 0xD8) {
            return "image/jpeg";
        }
        if (image[0] == (byte) 0x89 && image[1] == 'P' && 
            image[2] == 'N' && image[3] == 'G') {
            return "image/png";
        }
        if (image.length > 11 && image[8] == 'W' && image[9] == 'E' && 
            image[10] == 'B' && image[11] == 'P') {
            return "image/webp";
        }

        return "image/jpeg"; // Par défaut
    }

    /**
     * Formate la taille du fichier en format lisible
     */
    public String getFormattedImageSize() {
        long size = getImageSize();
        if (size < 1024) return size + " B";
        if (size < 1024 * 1024) return String.format("%.1f KB", size / 1024.0);
        return String.format("%.1f MB", size / (1024.0 * 1024.0));
    }
} 