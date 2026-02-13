package com.vinylclub.ad.client.dto;

/**
 * DTO "summary" of an album (used in ProductSummaryDTO).
 */
public class AlbumAdDTO {

    private Long id;
    private String name;

    // Builders
    public AlbumAdDTO() {}

    public AlbumAdDTO(Long id, String name) {
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
