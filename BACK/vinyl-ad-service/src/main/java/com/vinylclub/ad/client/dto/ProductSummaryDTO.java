package com.vinylclub.ad.client.dto;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;

/**
 *DTO retrieved from vinyl-catalog-service (product information for display).
 *Used in the list and details of an announcement.
 */
public class ProductSummaryDTO {

    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private String status;
    private String state;
    private String format;

    // Relations
    private ArtistAdDTO artist;
    private CategoryAdDTO category;
    private AlbumAdDTO album;
    private List<ImageSummaryDTO> images;

    private Timestamp createdAt;
    private Timestamp updatedAt;

    public ProductSummaryDTO() {
    }

    public ProductSummaryDTO(
            Long id,
            String title,
            String description,
            BigDecimal price,
            ArtistAdDTO artist,
            CategoryAdDTO category,
            AlbumAdDTO album,
            List<ImageSummaryDTO> images,
            Timestamp createdAt
            //String format
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.artist = artist;
        this.category = category;
        this.album = album;
        this.images = images;
        this.createdAt = createdAt;
    }

    // Getters / Setters

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

    public ArtistAdDTO getArtist() {
        return artist;
    }

    public void setArtist(ArtistAdDTO artist) {
        this.artist = artist;
    }

    public CategoryAdDTO getCategory() {
        return category;
    }

    public void setCategory(CategoryAdDTO category) {
        this.category = category;
    }

    public AlbumAdDTO getAlbum() {
        return album;
    }

    public void setAlbum(AlbumAdDTO album) {
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
