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

    @DeleteMapping("/api/products/{id}")
     ProductSummaryDTO  deleteProduct(@PathVariable("id") Long id);

}
