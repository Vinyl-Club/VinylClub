package com.vinylclub.ad.client.request;

import java.math.BigDecimal;
import com.vinylclub.ad.client.request.IdDTO;


/**
 *DTO sent to vinyl-catalog-service to create or update a product.
 *It contains the product fields + references (id) to artist/category/album.
 */
public class CreateProductRequestDTO {

    private String title;
    private String description;
    private BigDecimal price;
    private String status;
    private String state;
    private String format;

    private IdDTO artist;
    private IdDTO category;
    private IdDTO album;

    public CreateProductRequestDTO() {
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

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }

    public IdDTO getArtist() {
        return artist;
    }

    public void setArtist(IdDTO artist) {
        this.artist = artist;
    }

    public IdDTO getCategory() {
        return category;
    }

    public void setCategory(IdDTO category) {
        this.category = category;
    }

    public IdDTO getAlbum() {
        return album;
    }

    public void setAlbum(IdDTO album) {
        this.album = album;
    }
}