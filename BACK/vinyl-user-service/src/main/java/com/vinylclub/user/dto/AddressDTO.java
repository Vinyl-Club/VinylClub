package com.vinylclub.user.dto;


public class AddressDTO {

    private Long id;
    private String city;
    private String zipCode;
    private String country;

        // New constructor to match the required arguments
        public AddressDTO(Long id, String city, String zipCode, String country) {
            this.id = id;
            this.city = city;
            this.zipCode = zipCode;
            this.country = country;
        }

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
    
}
