
package com.vinylclub.catalog.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.vinylclub.catalog.dto.ArtistDTO;
import com.vinylclub.catalog.dto.ProductDTO;
import com.vinylclub.catalog.service.ArtistService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/artists")
// @CrossOrigin(origins = "*")
public class ArtistController {

    @Autowired
    private ArtistService artistService;

    /**
     * Récupérer tous les artistes
     * GET /api/artists
     */
    @GetMapping
    public ResponseEntity<List<ArtistDTO>> getAllArtists() {
        List<ArtistDTO> artists = artistService.getAllArtists();
        return ResponseEntity.ok(artists);
    }

    /**
     * Récupérer un artiste par ID
     * GET /api/artists/1
     */
    @GetMapping("/{id}")
    public ResponseEntity<ArtistDTO> getArtistById(@PathVariable Long id) {
        ArtistDTO artist = artistService.getArtistById(id);
        return ResponseEntity.ok(artist);
    }

    /**
     * Rechercher des artistes
     * GET /api/artists/search?query=rock
     */
    @GetMapping("/search")
    public ResponseEntity<List<ArtistDTO>> searchArtists(@RequestParam String query) {
        List<ArtistDTO> artists = artistService.searchArtists(query);
        return ResponseEntity.ok(artists);
    }

    /**
     * Récupérer les produits d'un artiste
     * GET /api/artists/1/products?page=0&size=12
     */
    @GetMapping("/{id}/products")
    public ResponseEntity<Page<ProductDTO>> getProductsByArtist(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductDTO> products = artistService.getProductsByArtist(id, pageable);
        return ResponseEntity.ok(products);
    }

    /**
     * Créer un nouvel artiste
     * POST /api/artists
     */
    @PostMapping
    public ResponseEntity<ArtistDTO> createArtist(@Valid @RequestBody ArtistDTO artistDTO) {
        ArtistDTO createdArtist = artistService.createArtist(artistDTO);
        return ResponseEntity.ok(createdArtist);
    }

    /**
     * Mettre à jour un artiste
     * PUT /api/artists/1
     */
    @PutMapping("/{id}")
    public ResponseEntity<ArtistDTO> updateArtist(
            @PathVariable Long id,
            @Valid @RequestBody ArtistDTO artistDTO) {
        ArtistDTO updatedArtist = artistService.updateArtist(id, artistDTO);
        return ResponseEntity.ok(updatedArtist);
    }

    /**
     * Supprimer un artiste
     * DELETE /api/artists/1
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArtist(@PathVariable Long id) {
        artistService.deleteArtist(id);
        return ResponseEntity.noContent().build();
    }
}
