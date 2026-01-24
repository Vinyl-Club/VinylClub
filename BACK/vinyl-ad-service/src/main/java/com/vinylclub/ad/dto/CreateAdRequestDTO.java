package com.vinylclub.ad.dto;

import com.vinylclub.ad.client.request.CreateProductRequestDTO;

/**
 *DTO received from the front to create an announcement.
 *Contains only the product to be created on the catalog side (the userId comes from the X-User-Id header).
 */
public class CreateAdRequestDTO {

    //DTO reçu par la front (CreateAdRequestDTO body envoyer du front)
    private CreateProductRequestDTO product;

    public CreateAdRequestDTO() {}

    public CreateProductRequestDTO getProduct() {
        return product;
    }
    public void setProduct(CreateProductRequestDTO product) {
        this.product = product;
    }
}