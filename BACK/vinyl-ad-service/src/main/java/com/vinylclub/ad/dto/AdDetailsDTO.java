package com.vinylclub.ad.dto;

import com.vinylclub.ad.client.dto.ProductSummaryDTO;
import com.vinylclub.ad.client.dto.UserSummaryDTO;

/**
 * DTO used to display the details of an ad.
 * Aggregates the announcement + product information (catalog) + user information (user-service).
 */
public class AdDetailsDTO {

    private Long id; // ad id
    private ProductSummaryDTO product; // comes from client.dto.ProductDTO
    private UserSummaryDTO user; // comes from client.dto.UserSummaryDTO


    public AdDetailsDTO() {
    }

    public AdDetailsDTO(Long id, ProductSummaryDTO product, UserSummaryDTO user) {
        this.id = id;
        this.product = product;
        this.user = user;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ProductSummaryDTO getProduct() {
        return product;
    }

    public void setProduct(ProductSummaryDTO product) {
        this.product = product;
    }

    public UserSummaryDTO getUser() {
        return user;
    }

    public void setUser(UserSummaryDTO user) {
        this.user = user;
    }
}
