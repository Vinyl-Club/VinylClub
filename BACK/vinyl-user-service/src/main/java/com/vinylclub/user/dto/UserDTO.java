package com.vinylclub.user.dto;

import java.sql.Timestamp;
public class UserDTO {

    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private Timestamp updatedAt;

    public UserDTO() {
    }

    public UserDTO(Long id, String email, String firstName, String lastName, String phone, Timestamp updatedAt) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.updatedAt = updatedAt;
    }
    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Timestamp getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    // @Override
    // public String toString() {
    //     return "UserDTO{" +
    //             "id=" + id +
    //             ", email='" + email + '\'' +
    //             ", firstName='" + firstName + '\'' +
    //             ", lastName='" + lastName + '\'' +
    //             ", phone='" + phone + '\'' +
    //             ", createdAt='" + createdAt + '\'' +
    //             ", updatedAt='" + updatedAt + '\'' +
    //             '}';
    // }
}