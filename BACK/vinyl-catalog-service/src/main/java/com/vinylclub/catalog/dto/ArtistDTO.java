package com.vinylclub.catalog.dto;

public class ArtistDTO {
    private Long id;
    private String name;
    private String bio;

    // Builders
    public ArtistDTO() {}

    public ArtistDTO(Long id, String name, String bio) {
        this.id = id;
        this.name = name;
        this.bio = bio;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
}