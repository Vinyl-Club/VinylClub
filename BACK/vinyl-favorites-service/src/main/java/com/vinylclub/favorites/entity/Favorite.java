package com.vinylclub.favorites.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "favorites")
@CompoundIndex(def = "{'userId': 1, 'productId': 1}", unique = true)
public class Favorite {
   
    @Id
    private String id;
    private String userId;
    private String productId;
    private LocalDateTime createdAt; // Final withdrawn to avoid serialization problems
    
    public Favorite() {
        this.createdAt = LocalDateTime.now();
    }
    
    public Favorite(String userId, String productId) {
        this.userId = userId;
        this.productId = productId;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public String getProductId() {
        return productId;
    }
   
    public void setProductId(String productId) {
        this.productId = productId;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}