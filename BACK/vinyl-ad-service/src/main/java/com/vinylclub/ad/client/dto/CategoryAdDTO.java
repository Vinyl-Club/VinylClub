package com.vinylclub.ad.client.dto;

/**
 * DTO "summary" of a category (used in ProductSummaryDTO).
 */
public class CategoryAdDTO {
    private Long id;
    private String name;

    // Builders
    public CategoryAdDTO() {}

    public CategoryAdDTO(Long id, String name) {
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
