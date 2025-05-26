package com.vinylclub.catalog.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "images", schema = "catalog")  // ✅ SCHÉMA AJOUTÉ
public class Images {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)  // ✅ LAZY LOADING
    @JoinColumn(name = "product_id", nullable = false)
    @JsonIgnore  // Éviter les références circulaires
    private Product product;
    
    @Lob
    @Column(nullable = false, columnDefinition = "bytea")
    @JsonIgnore  // Ne jamais sérialiser les bytes en JSON
    private byte[] image;
    
    // Constructeurs
    public Images() {}
    
    public Images(Product product, byte[] image) {
        this.product = product;
        this.image = image;
    }
    
    // Getters et Setters
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
}