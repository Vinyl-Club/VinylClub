package com.vinylclub.catalog.dto;

/**
 * Version allégée du DTO Image sans les données binaires
 * Utilisée pour les listes et les réponses où les bytes ne sont pas nécessaires
 */
public class ImageSummaryDTO {
    private Long id;
    private Long productId;

    // Constructeurs
    public ImageSummaryDTO() {}

    public ImageSummaryDTO(Long id, Long productId) {
        this.id = id;
        this.productId = productId;
    }

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    /**
     * Génère l'URL pour récupérer l'image complète
     */
    public String getImageUrl() {
        return "/api/images/" + this.id;
    }
}