package com.vinylclub.ad.client.dto;

/**
 * Light" DTO for a product image (without bytes).
 * Allows you to construct a URL to retrieve the full image.
 */
public class ImageSummaryDTO {
    private Long id;
    private Long productId;

    // Builders
    public ImageSummaryDTO() {
    }

    public ImageSummaryDTO(Long id, Long productId) {
        this.id = id;
        this.productId = productId;
    }

    // Getters and Setters
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

    /**
     * Generates the URL to recover the full image
     */
    public String getImageUrl() {
        return "/api/images/" + this.id;
    }
}
