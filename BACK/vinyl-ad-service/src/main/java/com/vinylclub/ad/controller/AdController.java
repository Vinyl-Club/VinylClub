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
import org.springframework.web.bind.annotation.RequestBody;

import com.vinylclub.ad.dto.AdDetailsDTO;
import com.vinylclub.ad.dto.AdListDTO;
import com.vinylclub.ad.dto.AdDTO;
import com.vinylclub.ad.dto.CreateAdRequestDTO;
import com.vinylclub.ad.client.request.CreateProductRequestDTO;
import com.vinylclub.ad.client.dto.ProductCreatedDTO;
import com.vinylclub.ad.service.AdService;


@RestController
@RequestMapping("/api/ad")
public class AdController {

    @Autowired
    private AdService adService;

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
    

    /*/
    * 1 route post
    * créer l'annonce
    * appel a user client si ok
    * appel product client
    * appel a ad service
    * retour 200
     */

}
