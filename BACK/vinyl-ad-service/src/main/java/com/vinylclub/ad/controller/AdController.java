package com.vinylclub.ad.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.vinylclub.ad.dto.AdDetailsDTO;
import com.vinylclub.ad.dto.AdListDTO;
import com.vinylclub.ad.dto.AdDTO;
import com.vinylclub.ad.dto.CreateAdRequestDTO;
import com.vinylclub.ad.client.request.CreateProductRequestDTO;
import com.vinylclub.ad.client.dto.ProductCreatedDTO;
import com.vinylclub.ad.service.AdService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/ad")
// @CrossOrigin(origins = "*")
public class AdController {

    private final AdService adService;

    public AdController(AdService adService) {
        this.adService = adService;
    }

    @GetMapping
    public ResponseEntity<Page<AdListDTO>> getAds(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        Page<AdListDTO> ads = adService.getAllAds(page, size);
        return ResponseEntity.ok(ads);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdDetailsDTO> getAdById(@PathVariable Long id) {
        AdDetailsDTO adDetails = adService.getAdById(id);
        return ResponseEntity.ok(adDetails);
    }

    @PostMapping
    public ResponseEntity<AdDTO> createdAdd(@RequestBody CreateAdRequestDTO request) {
        AdDTO createdAdd = adService.createdAdd(request);
        return ResponseEntity.ok(createdAdd);
    }

    // Update the product of an ad
    @PutMapping("/{id}")
    public ResponseEntity<AdDetailsDTO> updateAd(
            @PathVariable Long id,
            @Valid @RequestBody CreateProductRequestDTO productUpdate) {

        AdDetailsDTO updated = adService.updateAdProduct(id, productUpdate);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdById(@PathVariable Long id) {
        adService.deleteAdById(id);
        return ResponseEntity.noContent().build();
    }

}
