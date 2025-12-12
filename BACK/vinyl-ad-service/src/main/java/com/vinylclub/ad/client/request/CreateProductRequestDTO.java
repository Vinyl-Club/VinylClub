package com.vinylclub.ad.client.dto;

import java.math.BigDecimal;

public class CreateProductRequestDTO {
    private String title;
    private String description;
    private BigDecimal price;
    private String status;
    private String state;
    private String format;

    private IdDTO artist;
    private IdDTO category;
    private IdDTO album;

    public CreateProductRequestDTO() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

       public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }

}