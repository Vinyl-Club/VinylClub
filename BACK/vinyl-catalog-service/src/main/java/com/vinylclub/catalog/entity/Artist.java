package com.vinylclub.catalog.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "artists")
public class Artist {
    /**
     * Primary key with auto-increment strategy
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Name of the artist
     */
    @Column(nullable = false, length = 100, unique = true)
    private String name;

    /**
     * Bio of the artist
     */
    @Column(nullable = true, length = 500)
    // Correction ici: bio -> biography
    private String bio;
    

    
    


    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

public void setName(String name) {
    this.name = name;
}

public String getBio() {
    return bio;
}
public void setBio(String bio) {
    this.bio = bio;
}

    @Override
    public String toString() {
        return "Artist{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", bio='" + bio + '\'' +
                '}';
    }
}