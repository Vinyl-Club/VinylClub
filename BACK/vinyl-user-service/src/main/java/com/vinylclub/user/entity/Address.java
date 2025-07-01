package com.vinylclub.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "addresses", schema = "users")
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name= "street")
    private String street;
    @Column(name = "city")
    private String city;
    @Column(name = "zip_code")
    private String zipCode;
    @Column(name = "country")
    private String country;
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;
    
    // Add this default manufacturer
    public Address() {
    }
    
    // Constructor to match the required arguments
    public Address(String city, String zipCode, String country, String street, User user) {
        this.city = city;
        this.zipCode = zipCode;
        this.country = country;
        this.street = street;
        this.user = user;
    }
    
    // Getters and Setters
    public User getUser() {
        return user;
    }  

    public void setUser(User user) {
        this.user = user;
    }
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
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

    // @Override
    // public String toString() {
    //     return "Address{" +
    //             "id=" + id +
    //             ", street='" + street + '\'' +
    //             ", city='" + city + '\'' +
    //             ", zipCode='" + zipCode + '\'' +
    //             ", country='" + country + '\'' +
    //             '}';
    // }
}