package com.vinylclub.ad.dto;

import com.vinylclub.ad.client.dto.CreateProductRequestDTO;

public class CreateAdRequestDTO {

    //DTO reçu par la front (CreateAdRequestDTO body envoyer du front)
    private Long userId; // TODO: revoyer un token JWT au lieu du userID
    private CreateProductRequestDTO product;

    public CreateAdRequestDTO() {}

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public CreateProductRequestDTO getProduct() {
        return product;
    }
    public void setProduct(CreateProductRequestDTO product) {
        this.product = product;
    }
}