package com.vinylclub.catalog.entity;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "images", schema = "catalog")
public class Images {
   
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
   
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @JsonIgnore
    private Product product;
   
    @Column(name = "image", nullable = false)
    @JdbcTypeCode(SqlTypes.VARBINARY)  // ✅ SOLUTION : Force le type VARBINARY pour PostgreSQL
    @JsonIgnore
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