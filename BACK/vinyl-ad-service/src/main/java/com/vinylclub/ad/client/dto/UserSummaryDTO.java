package com.vinylclub.ad.client.dto;

import java.sql.Timestamp;

public class UserSummaryDTO {

    private Long id;
    private String firstName;
    private String lastName;

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

}
