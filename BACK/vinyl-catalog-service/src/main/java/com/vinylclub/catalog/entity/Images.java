package com.vinylclub.catalog.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import jakarta.persistence.Lob;

@Entity
@Table(name = "images")
public class Images {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;
    
    @Lob
    @Column(nullable = false, columnDefinition = "bytea")
    private byte[] image;
    
    // Default constructor
    public Images() {
    }
    
    public Images(Product product, byte[] image) {
        this.product = product;
        this.image = image;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public byte[] getImage() {
        return image;
    }
    
    public void setImage(byte[] image) {
        this.image = image;
    }
    
    public Product getProduct() {
        return product;
    }
    
    public void setProduct(Product product) {
        this.product = product;
    }
    
    // Cette méthode devrait être marquée comme @Transient pour éviter le double mapping
    @Transient
    public Long getProductId() {
        return product != null ? product.getId() : null;
    }
    
    // Cette méthode peut causer des problèmes si elle n'est pas bien utilisée
    @Transient
    public void setProductId(Long productId) {
        if (product != null) {
            product.setId(productId);
        }
    }
}