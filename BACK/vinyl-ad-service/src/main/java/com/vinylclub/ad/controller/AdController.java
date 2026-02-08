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
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.vinylclub.ad.dto.AdDetailsDTO;
import com.vinylclub.ad.dto.AdListDTO;
import com.vinylclub.ad.dto.AdDTO;
import com.vinylclub.ad.dto.CreateAdRequestDTO;
import com.vinylclub.ad.client.request.CreateProductRequestDTO;
import com.vinylclub.ad.client.dto.ProductCreatedDTO;
import com.vinylclub.ad.service.AdService;

import jakarta.validation.Valid;

/**
 * Ads REST controller.
 * -GET: public roads (list + details)
 * -POST/PUT/DELETE: protected routes (userId retrieved via the X-User-Id header injected by the gateway)
 */
@RestController
@RequestMapping("/api/ad")
// @CrossOrigin(origins = "*")
public class AdController {

    private final AdService adService;

    public AdController(AdService adService) {
        this.adService = adService;
    }

    /**
     * Paginated list of announcements (home).
     * GET /api/ad?page=0&amp;size=12
     */
    @GetMapping
    public ResponseEntity<Page<AdListDTO>> getAds(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        Page<AdListDTO> ads = adService.getAllAds(page, size);
        return ResponseEntity.ok(ads);
    }

    /**
     * Details of an announcement.
     * GET /api/ad/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<AdDetailsDTO> getAdById(@PathVariable Long id) {
        AdDetailsDTO adDetails = adService.getAdById(id);
        return ResponseEntity.ok(adDetails);
    }

    /**
     * Creation of an announcement (authenticated user).
     * POST /api/ad
     */
    @PostMapping
    public ResponseEntity<AdDTO> createdAd(
        @RequestHeader("X-User-Id") Long userId,
        @RequestHeader(value = "X-User-Role", required = false) String role,
        @RequestBody CreateAdRequestDTO request
    ) {
        System.out.println("🔐 [AD] X-User-Id = " + userId);
        System.out.println("🔐 [AD] X-User-Role = " + role);
        return ResponseEntity.ok(adService.createdAd(userId, request));
    }

    /**
     * Updated product linked to an ad (authenticated user + owner).
     * PUT /api/ad/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<AdDetailsDTO> updateAd(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id,
            @Valid @RequestBody CreateProductRequestDTO productUpdate) {

        AdDetailsDTO updated = adService.updateAdProduct(userId, id, productUpdate);
        return ResponseEntity.ok(updated);
    }

    /**
     * Deletion of an ad (authenticated user + owner).
     * DELETE /api/ad/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdById(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id) {

        adService.deleteAdById(userId, id);
        return ResponseEntity.noContent().build();
    }
}
