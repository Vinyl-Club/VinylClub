package com.vinylclub.catalog.dto;

public class ImageSummaryDTO {

    private Long id;
    private String imageUrl;

    public ImageSummaryDTO() {}

    public ImageSummaryDTO(Long id, String imageUrl) {
        this.id = id;
        this.imageUrl = imageUrl;
    }

    public Long getId() {
        return id;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}