package com.vinylclub.ad.client.dto;

public class UserSummaryDTO {

    private Long id;
    private String firstName;
    private String lastName;

    private AddressAdDTO address;

    public UserSummaryDTO() {
    }

    public UserSummaryDTO(Long id, String firstName, String lastName) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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


    public AddressAdDTO getAddress() {
        return address;
    }

    public void setAddress(AddressAdDTO address) {
        this.address = address;
    }
}
