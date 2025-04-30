package com.vinylclub.catalog.entity;


import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;

      /**
     * User ID of the product owner
     */
    @Column(name = "user_id")
    private Long userId;

    /**
     * Relation with the artist
     * Many products can belong to one artist
     */
    @ManyToOne
    @JoinColumn(name = "artist_id", nullable = false)
    private Artist artist;

    /**
     * Relation with the category
     * Many products can belong to one category
     */
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = true, length = 500)
    private String description;

    @Column(nullable = false)
    private Double price;

    /**
     * Quantities of the product available in stock
     */
    @Column(name="stock_quantity",nullable = true)
    private Integer quantity;

    /**
     * Realease year of the product
     */
    @Column(name="release_year",nullable = true)
    private Integer releaseYear;

    
   /**
     * Images of the product
     */
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Images> images = new ArrayList<>();

    /**
     * Created at date of the product  
     */
    @Column(name="created_at",nullable = true)
    private Timestamp createdAt;

    /**
     * Updated at date of the product  
     */
    @Column(name="updated_at",nullable = true)
    private Timestamp updatedAt;

    /**
     * Status of the product  
     */
    @Column(name="status",nullable = true)
    private Enum status;

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

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
}
    public Artist getArtist() {
        return artist;
    }

    public void setArtist(Artist artist) {
        this.artist = artist;
    }

    /**
 * Get the quantity of products available in stock
 * 
 * @return The stock quantity
 */
public Integer getQuantity() {
    return quantity;
}

/**
 * Set the quantity of products available in stock
 * 
 * @param quantity The stock quantity to set
 */
public void setQuantity(Integer quantity) {
    this.quantity = quantity;
}

/**
 * Get the release year of the product
 * 
 * @return The release year
 */
public Integer getReleaseYear() {
    return releaseYear;
}

/**
 * Set the release year of the product
 * 
 * @param releaseYear The release year to set
 */
public void setReleaseYear(Integer releaseYear) {
    this.releaseYear = releaseYear;
}

/**
 * Get the ID of the primary image associated with this product
 */
  public List<Images> getImages() {
        return images;
    }
    
    public void setImages(List<Images> images) {
        this.images = images;
    }

/**
 * Get the creation date of the product.
 * 
 * @return The creation timestamp.
 */
public Timestamp getCreatedAt() {
    return createdAt;
}

/**
 * Set the creation date of the product
 * 
 * @param createdAt The creation timestamp to set
 */
public void setCreatedAt(Timestamp createdAt) {
    this.createdAt = createdAt;
}

/**
 * Get the last update date of the product.
 * 
 * @return The update timestamp.
 */
public Timestamp getUpdatedAt() {
    return updatedAt;
}


/**
 * Set the last update date of the product
 * 
 * @param updatedAt The update timestamp to set
 */
public void setUpdatedAt(Timestamp updatedAt) {
    this.updatedAt = updatedAt;
}

/**
 * Get the status of the product.
 * 
 * @return The product status.
 */
public Enum getStatus() {
    return status;
}


/**
 * Set the status of the product
 * 
 * @param status The product status to set
 */
public void setStatus(Enum status) {
    this.status = status;
}
 
}