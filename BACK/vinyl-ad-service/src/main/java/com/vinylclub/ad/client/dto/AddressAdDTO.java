package com.vinylclub.ad.client.dto;

/**
 *DTO retrieved from vinyl-user-service for address.
 *Here we only keep the information useful for display (eg: city).
 */
public class AddressAdDTO {

    private Long id;
    private String city;
    // private UserSummaryDTO user; // Add user field

    // Constructors

    public AddressAdDTO() {}

    public AddressAdDTO(Long id, String city) {
        this.id = id;
        this.city = city;
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
}