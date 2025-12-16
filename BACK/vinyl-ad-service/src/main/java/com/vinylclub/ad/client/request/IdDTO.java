package com.vinylclub.ad.client.dto;

public class IdDTO {
    // DTO générique pour les catégories, l'album, les artistes
    private Long id;

    public IdDTO() {}

    public IdDTO(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
