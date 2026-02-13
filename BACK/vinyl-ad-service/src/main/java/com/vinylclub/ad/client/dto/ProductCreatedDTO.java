package com.vinylclub.ad.client.dto;

/**
 * DTO de réponse lors de la création d'un produit côté catalog.
 * On récupère principalement l'id créé.
 */
public class ProductCreatedDTO {

    private Long id;
    public ProductCreatedDTO() {}
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}

