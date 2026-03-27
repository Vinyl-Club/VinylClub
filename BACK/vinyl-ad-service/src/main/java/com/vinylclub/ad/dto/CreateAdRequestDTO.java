package com.vinylclub.ad.dto;

import com.vinylclub.ad.client.request.CreateProductRequestDTO;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

/**
 * DTO received from the front to create an announcement.
 * Contains only the product to be created on the catalog side (the userId comes from the X-User-Id header).
 */
public class CreateAdRequestDTO {

    //DTO reçu par la front (CreateAdRequestDTO body envoyer du front)
    @NotNull(message = "Le produit est obligatoire")
    @Valid
    private CreateProductRequestDTO product;

    public CreateAdRequestDTO() {}

    public CreateProductRequestDTO getProduct() {
        return product;
    }
    public void setProduct(CreateProductRequestDTO product) {
        this.product = product;
    }
}