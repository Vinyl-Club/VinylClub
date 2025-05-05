package com.vinylclub.catalog.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.vinylclub.catalog.entity.Album;
import com.vinylclub.catalog.service.AlbumService;

@RestController
@RequestMapping("/api/albums")
public class AlbumController {
    
    @Autowired
    private AlbumService albumService;
    
    @GetMapping
    public List<Album> getAllAlbums() {
        return albumService.getAllAlbums();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Album> getAlbumById(@PathVariable Long id) {
        Optional<Album> album = albumService.getAlbumById(id);
        return album.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<?> createAlbums(@RequestBody ArrayList<Album> albums) {
        try {
            List<Album> createdAlbums = albumService.createAlbums(albums);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdAlbums);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur lors de la création des albums: " + e.getMessage());
        }
    }
    
    // Support également du format d'un seul album
    @PostMapping("/single")
    public ResponseEntity<?> createSingleAlbum(@RequestBody Album album) {
        try {
            ArrayList<Album> albums = new ArrayList<>();
            albums.add(album);
            List<Album> createdAlbums = albumService.createAlbums(albums);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdAlbums.get(0));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur lors de la création de l'album: " + e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Album> updateAlbum(@PathVariable Long id, @RequestBody Album albumDetails) {
        try {
            Album updatedAlbum = albumService.updateAlbum(id, albumDetails);
            return ResponseEntity.ok(updatedAlbum);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAlbum(@PathVariable Long id) {
        albumService.deleteAlbum(id);
        return ResponseEntity.noContent().build();
    }
    
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<String> handleException(Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Une erreur s'est produite: " + e.getMessage());
    }
}