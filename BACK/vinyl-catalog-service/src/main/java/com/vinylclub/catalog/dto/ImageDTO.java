package com.vinylclub.catalog.dto;

public class ImageDTO {

    private Long id;
    private String imageUrl;
    private String publicId;
    private Long productId;

    public ImageDTO() {}

    public ImageDTO(Long id, String imageUrl, String publicId, Long productId) {
        this.id = id;
        this.imageUrl = imageUrl;
        this.publicId = publicId;
        this.productId = productId;
    }

    // Getters / Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getPublicId() {
        return publicId;
    }

    public void setPublicId(String publicId) {
        this.publicId = publicId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }
}