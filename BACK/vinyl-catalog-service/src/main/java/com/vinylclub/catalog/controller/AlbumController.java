package com.vinylclub.catalog.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vinylclub.catalog.dto.AlbumDTO;
import com.vinylclub.catalog.service.AlbumService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/albums")
// @CrossOrigin(origins = "*")
public class AlbumController {

    @Autowired
    private AlbumService albumService;

    /**
     * Récupérer tous les albums
     * GET /api/albums
     */
    @GetMapping
    public ResponseEntity<List<AlbumDTO>> getAllAlbums() {
        List<AlbumDTO> albums = albumService.getAllAlbums();
        return ResponseEntity.ok(albums);
    }

    /**
     * Récupérer un album par ID
     * GET /api/albums/1
     */
    @GetMapping("/{id}")
    public ResponseEntity<AlbumDTO> getAlbumById(@PathVariable Long id) {
        AlbumDTO album = albumService.getAlbumById(id);
        return ResponseEntity.ok(album);
    }

    /**
     * Créer un nouvel album
     * POST /api/albums
     */
    @PostMapping
    public ResponseEntity<AlbumDTO> createAlbum(@Valid @RequestBody AlbumDTO albumDTO) {
        AlbumDTO createdAlbum = albumService.createAlbum(albumDTO);
        return ResponseEntity.ok(createdAlbum);
    }

    /**
     * Mettre à jour un album
     * PUT /api/albums/1
     */
    @PutMapping("/{id}")
    public ResponseEntity<AlbumDTO> updateAlbum(
            @PathVariable Long id,
            @Valid @RequestBody AlbumDTO albumDTO) {
        AlbumDTO updatedAlbum = albumService.updateAlbum(id, albumDTO);
        return ResponseEntity.ok(updatedAlbum);
    }

    /**
     * Supprimer un album
     * DELETE /api/albums/1
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAlbum(@PathVariable Long id) {
        albumService.deleteAlbum(id);
        return ResponseEntity.noContent().build();
    }
}