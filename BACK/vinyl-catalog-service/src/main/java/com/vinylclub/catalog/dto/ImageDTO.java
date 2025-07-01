package com.vinylclub.catalog.dto;

public class ImageDTO {
    private Long id;
    private byte[] image;        // binary image data (corresponds to your entity images)
    private Long productId;      // Id of the associated product (instead of the complete product object)

    // Builders
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

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public byte[] getImage() { return image; }
    public void setImage(byte[] image) { 
        this.image = image;
    }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    // Utility methods
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
     *Return the size of the image to bytes
     */
    public long getImageSize() {
        return image != null ? image.length : 0;
    }

    /**
     *Determines the type MINE from image bytes
     */
    public String determineContentType() {
        if (image == null || image.length < 4) {
            return "application/octet-stream";
        }

        // Check file signatures
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

        return "image/jpeg"; // By default
    }

    /**
     *Format the size of the file in legible format
     */
    public String getFormattedImageSize() {
        long size = getImageSize();
        if (size < 1024) return size + " B";
        if (size < 1024 * 1024) return String.format("%.1f KB", size / 1024.0);
        return String.format("%.1f MB", size / (1024.0 * 1024.0));
    }
} 