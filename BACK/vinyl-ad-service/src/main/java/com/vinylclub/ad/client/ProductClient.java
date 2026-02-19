package com.vinylclub.ad.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.vinylclub.ad.client.dto.ProductSummaryDTO;
import com.vinylclub.ad.client.request.CreateProductRequestDTO;
import com.vinylclub.ad.client.dto.ProductCreatedDTO;

import org.springframework.web.bind.annotation.PutMapping;

/**
 *Feign client to vinyl-catalog-service.
 *Used to create/update/delete the product linked to an ad.
 */
@FeignClient(name = "vinyl-catalog-service")
public interface ProductClient {

    // Product creation
    @PostMapping("/api/products")
    ProductCreatedDTO createProduct(@RequestBody CreateProductRequestDTO dto);

    // Collect the products
    @GetMapping("/api/products/{id}")
    ProductSummaryDTO getProductById(@PathVariable("id") Long id);

    // Product update (update the product linked to the ad)
    @PutMapping("/api/products/{id}")
    ProductSummaryDTO updateProduct(@PathVariable("id") Long id, @RequestBody CreateProductRequestDTO dto);

    // Removing the product linked to the ad
    @DeleteMapping("/api/products/{id}")
    void  deleteProduct(@PathVariable("id") Long id);

}
