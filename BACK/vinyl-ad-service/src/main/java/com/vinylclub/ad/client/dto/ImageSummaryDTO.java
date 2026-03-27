package com.vinylclub.ad.client.dto;

/**
 * DTO of a product image returned by catalog-service.
 */
public class ImageSummaryDTO {
    private Long id;
    private Long productId;
    private String imageUrl;

    public ImageSummaryDTO() {
    }

    public ImageSummaryDTO(Long id, Long productId, String imageUrl) {
        this.id = id;
        this.productId = productId;
        this.imageUrl = imageUrl;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
