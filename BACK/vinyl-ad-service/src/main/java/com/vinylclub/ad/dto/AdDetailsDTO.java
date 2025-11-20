package com.vinylclub.ad.dto;

import com.vinylclub.ad.client.dto.ProductSummaryDTO;
import com.vinylclub.ad.client.dto.UserSummaryDTO;

public class AdDetailsDTO {

    private Long id; // id de l’annonce
    private ProductSummaryDTO product; // vient de client.dto.ProductDTO
    private UserSummaryDTO user; // vient de client.dto.UserSummaryDTO

    public AdDetailsDTO() {
    }

    public AdDetailsDTO(Long id, ProductSummaryDTO product, LoUserSummaryDTOng user) {
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
