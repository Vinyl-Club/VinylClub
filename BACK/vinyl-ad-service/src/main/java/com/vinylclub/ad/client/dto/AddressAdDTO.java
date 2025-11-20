package com.vinylclub.ad.client.dto;

public class AddressAdDTO {

    private Long id;
    private String city;
    private UserSummaryDTO user; // Add user field

    // Constructors

    public AddressAdDTO() {}

    public AddressAdDTO(Long id, String city, UserSummaryDTO user) {
        this.id = id;
        this.city = city;
        this.user = user;
    }

    // Getters and setters
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

    public UserSummaryDTO getUser() {
        return user;
    }

    public void setUser(UserSummaryDTO user) {
        this.user = user;
    }
}