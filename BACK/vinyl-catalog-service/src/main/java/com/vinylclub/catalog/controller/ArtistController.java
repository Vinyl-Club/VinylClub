package com.vinylclub.catalog.controller;

import com.vinylclub.catalog.entity.Artist;
import com.vinylclub.catalog.service.ArtistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/artists")
public class ArtistController {

    @Autowired
    private ArtistService artistService;

    @GetMapping
    public List<Artist> getAllArtists() {
        return artistService.getAllArtists();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Artist> getArtistById(@PathVariable Long id) {
        Optional<Artist> artist = artistService.getArtistById(id);
        return artist.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Artist createArtist(@RequestBody Artist artist) {
        return artistService.createArtist(artist);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Artist> updateArtist(@PathVariable Long id, @RequestBody Artist artistDetails) {
        try {
            Artist updatedArtist = artistService.updateArtist(id, artistDetails);
            return ResponseEntity.ok(updatedArtist);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArtist(@PathVariable Long id) {
        artistService.deleteArtist(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<Artist> getArtistByName(@PathVariable String name) {
        Artist artist = artistService.findByName(name);
        return artist != null ? ResponseEntity.ok(artist) : ResponseEntity.notFound().build();
    }

    @GetMapping("/exists/{name}")
    public ResponseEntity<Boolean> existsByName(@PathVariable String name) {
        boolean exists = artistService.existsByName(name);
        return ResponseEntity.ok(exists);
    }
}

