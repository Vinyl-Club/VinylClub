package com.vinylclub.ad.client.request;

/**
 *Small generic DTO that only carries an id.
 *Used to reference artist/category/album when calling the catalog.
 */
public class IdDTO {
    
    private Long id;

    public IdDTO() {}

    public IdDTO(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
