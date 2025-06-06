package com.vinylclub.auth.dto;

import java.sql.Timestamp;

public class UserDTO {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private Timestamp createdAt;
    
    public UserDTO() {}
    
    public UserDTO(Long id, String email, String firstName, String lastName, Timestamp createdAt) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.createdAt = createdAt;
    }
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
}
