package com.vinylclub.ad.client.request;

import java.math.BigDecimal;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Pattern;

/**
 * DTO sent to vinyl-catalog-service to create or update a product.
 * It contains the product fields + references (id) to artist/category/album.
 */
public class CreateProductRequestDTO {

    @NotBlank(message = "Le titre du produit est obligatoire")
    @Size(max = 100, message = "Le titre ne peut pas dépasser 100 caractères")
    private String title;

    @NotBlank(message = "La description du produit est obligatoire")
    @Size(max = 500, message = "La description ne peux pas dépasser 500 caractères")
    private String description;

    @NotNull(message = "Le prix est obligatoire")
    @DecimalMin(value = "0.01", message = "Le prix doit être positif")
    @Digits(integer = 8, fraction = 2, message = "Prix invalide")
    private BigDecimal price;

    @NotBlank(message = "L'état du produit est obligatoire")
    @Pattern(
        regexp = "TRES_BON_ETAT|BON_ETAT|MAUVAIS_ETAT",
        message = "État invalide"
    )
    private String state;

    @NotBlank(message = "Le format du vinyle est obligatoire")
    @Pattern(
        regexp = "T33|T45|T78",
        message = "Format invalide"
    )
    private String format;

    @NotNull(message = "Artiste obligatoire")
    @Valid
    private IdDTO artist;

    @NotNull(message = "La catégorie est obligatoire")
    @Valid
    private IdDTO category;

    @NotNull(message = "Album obligatoire")
    @Valid
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