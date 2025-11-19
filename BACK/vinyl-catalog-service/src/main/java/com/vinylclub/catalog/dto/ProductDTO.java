package com.vinylclub.catalog.dto;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;
// import com.vinylclub.catalog.entity.ProductFormat;

public class ProductDTO {
    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private String status;
    private String state;
    private String format;

    // Relationships included
    private ArtistDTO artist;
    private CategoryDTO category;
    private AlbumDTO album;
    private List<ImageSummaryDTO> images;

    private Timestamp createdAt;
    private Timestamp updatedAt;

    // Builders
    public ProductDTO() {
    }

    public ProductDTO(Long id, String title, String description, BigDecimal price,
            ArtistDTO artist, CategoryDTO category, String format) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.artist = artist;
        this.category = category;
        this.format = format;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public ArtistDTO getArtist() {
        return artist;
    }

    public void setArtist(ArtistDTO artist) {
        this.artist = artist;
    }

    public CategoryDTO getCategory() {
        return category;
    }

    public void setCategory(CategoryDTO category) {
        this.category = category;
    }

    public AlbumDTO getAlbum() {
        return album;
    }

    public void setAlbum(AlbumDTO album) {
        this.album = album;
    }

    public List<ImageSummaryDTO> getImages() {
        return images;
    }

    public void setImages(List<ImageSummaryDTO> images) {
        this.images = images;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public Timestamp getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }
}