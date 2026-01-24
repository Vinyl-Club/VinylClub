package com.vinylclub.ad.dto;

import java.math.BigDecimal;

/**
 *DTO used to display the list of announcements (cards on the home).
 *“Light” data: title, artist, price, city, image.
 */
public class AdListDTO {

    private Long id;

    private String title;
    private String artistName;
    private String categoryName;
    private BigDecimal price;
    private String city;
    private String imageUrl;

    public AdListDTO() {}

    public AdListDTO(Long id,
                    String title,
                    String artistName,
                    String categoryName,
                    BigDecimal price,
                    String city,
                    String imageUrl) {

        this.id = id;
        this.title = title;
        this.artistName = artistName;
        this.categoryName = categoryName;
        this.price = price;
        this.city = city;
        this.imageUrl = imageUrl;
    }

    // ---------- Getters & Setters ----------

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

    public String getArtistName() {
        return artistName;
    }

    public void setArtistName(String artistName) {
        this.artistName = artistName;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
