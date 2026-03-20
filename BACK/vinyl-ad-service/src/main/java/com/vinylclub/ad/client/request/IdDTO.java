package com.vinylclub.ad.client.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

/**
 *Small generic DTO that only carries an id.
 *Used to reference artist/category/album when calling the catalog.
 */
public class IdDTO {
    
    @NotNull(message = "L'id est obligatoire")
    @Positive(message = "L'id doit être positif")
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
