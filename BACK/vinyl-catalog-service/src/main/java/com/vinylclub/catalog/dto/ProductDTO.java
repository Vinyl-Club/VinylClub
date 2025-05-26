package com.vinylclub.catalog.dto;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;

public class ProductDTO {
    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private Integer quantity;
    private Integer releaseYear;
    private String status;
    private String state;
    private Long userId;
    
    // Relations incluses
    private ArtistDTO artist;
    private CategoryDTO category;
    private AlbumDTO album;  // Peut être null
    private List<String> imageUrls;  // URLs des images
    
    private Timestamp createdAt;
    private Timestamp updatedAt;

    // Constructeurs
    public ProductDTO() {}

    public ProductDTO(Long id, String title, String description, BigDecimal price, 
                     Integer quantity, ArtistDTO artist, CategoryDTO category) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.quantity = quantity;
        this.artist = artist;
        this.category = category;
    }

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    
    public Integer getReleaseYear() { return releaseYear; }
    public void setReleaseYear(Integer releaseYear) { this.releaseYear = releaseYear; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public ArtistDTO getArtist() { return artist; }
    public void setArtist(ArtistDTO artist) { this.artist = artist; }
    
    public CategoryDTO getCategory() { return category; }
    public void setCategory(CategoryDTO category) { this.category = category; }
    
    public AlbumDTO getAlbum() { return album; }
    public void setAlbum(AlbumDTO album) { this.album = album; }
    
    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }
    
    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
    
    public Timestamp getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Timestamp updatedAt) { this.updatedAt = updatedAt; }
}