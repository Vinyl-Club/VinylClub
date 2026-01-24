package com.vinylclub.ad.dto;

/**
 *"Simple" DTO to confirm the creation of an ad.
 *Contains ad id and related ids (product + user).
 */
public class AdDTO {
    private Long id;
    private Long productId;
    private Long userId;

    public AdDTO() {
    }

    public AdDTO(Long id, Long productId, Long userId) {
        this.id = id;
        this.productId = productId;
        this.userId = userId;
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

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
