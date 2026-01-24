package com.vinylclub.ad.client.dto;

/**
 *An artist's "summary" DTO (used in ProductSummaryDTO).
 */
public class ArtistAdDTO {

    private Long id;
    private String name;

    // Builders
    public ArtistAdDTO() {}

    public ArtistAdDTO(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

}
