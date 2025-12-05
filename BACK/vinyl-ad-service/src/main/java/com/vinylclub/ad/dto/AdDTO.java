package com.vinylclub.ad.dto;

public class AdDTO {
    private Long id;
    private Long productid;
    private Long userid;

    public AdDTO() {
    }

    public AdDTO(Long id, Long productid, Long userid) {
        this.id = id;
        this.productid = productid;
        this.userid = userid;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductId() {
        return productid;
    }

    public void setProductId(Long productid) {
        this.productid = productid;
    }

    public Long getUserId() {
        return userid;
    }

    public void setUserId(Long userid) {
        this.userid = userid;
    }

}
