package com.vinylclub.ad.dto;

import com.vinylclub.ad.client.dto.ProductSummaryDTO;
import com.vinylclub.ad.client.dto.UserSummaryDTO;

public class AdDetailsDTO {

    private Long id; // id de l’annonce
    private ProductSummaryDTO product; // vient de client.dto.ProductDTO
    private UserSummaryDTO user; // vient de client.dto.UserSummaryDTO

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

    public void setProductId(ProductSummaryDTO product) {
        this.product = product;
    }

    public UserSummaryDTO getUser() {
        return user;
    }

    public void setUserId(UserSummaryDTO user) {
        this.user = user;
    }

}
