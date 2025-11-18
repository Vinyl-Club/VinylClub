package com.vinylclub.catalog.dto;

/**
 *Lighter version of the DTO Image without binary data
 *Used for lists and answers where Bytes are not necessary
 */
public class ImageSummaryDTO {
    private Long id;
    private Long productId;

    // Builders
    public ImageSummaryDTO() {}

    public ImageSummaryDTO(Long id, Long productId) {
        this.id = id;
        this.productId = productId;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    /**
     *Generates the URL to recover the full image
     */
    public String getImageUrl() {
        return "/api/images/" + this.id;
    }
}