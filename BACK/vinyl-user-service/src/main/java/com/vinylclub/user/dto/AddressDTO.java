package com.vinylclub.user.dto;

public class AddressDTO {
    private Long id;
    private String city;
    private String zipCode;
    private String country;
    private String street;
    private UserDTO user;  // Ajout de l'utilisateur

    // Constructeurs
    public AddressDTO() {}

    public AddressDTO(Long id, String city, String zipCode, String country, String street, UserDTO user) {
        this.id = id;
        this.city = city;
        this.zipCode = zipCode;
        this.country = country;
        this.street = street;
        this.user = user;
    }

    // Getters et setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getZipCode() {
        return zipCode;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }
}
