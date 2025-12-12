package com.vinylclub.ad.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import com.vinylclub.ad.client.dto.ProductSummaryDTO;

@FeignClient(name = "catalog-service")
public interface ProductClient {

    //Product creation
    @PostMapping("/api/products")
    ProductCreatedDTO createProduct(@RequestBody CreateProductRequestDTO dto);

    //Collect the products
    @GetMapping("/api/products/{id}")
    ProductSummaryDTO getProductById(@PathVariable("id") Long id);
}
