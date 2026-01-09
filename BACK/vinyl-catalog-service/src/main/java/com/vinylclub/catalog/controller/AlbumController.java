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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;

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
     *Recover all albums
     *Get /API /Albums
     */
    @GetMapping
    public ResponseEntity<List<AlbumDTO>> getAllAlbums() {
        List<AlbumDTO> albums = albumService.getAllAlbums();
        return ResponseEntity.ok(albums);
    }

    /**
     *Recover an album by ID
     *Get/API/Albums/1
     */
    @GetMapping("/{id}")
    public ResponseEntity<AlbumDTO> getAlbumById(@PathVariable Long id) {
        AlbumDTO album = albumService.getAlbumById(id);
        return ResponseEntity.ok(album);
    }

    /**
     * Search for albums
     * GET /api/albums/search?query=the wall
     */
    @GetMapping("/search")
    public ResponseEntity<List<AlbumDTO>> searchAlbums(@RequestParam String query) {
        List<AlbumDTO> albums = albumService.searchAlbums(query);
        return ResponseEntity.ok(albums);
    }

    /**
     *Create a new album
     *Post /API /Albums
     */
    @PostMapping
    public ResponseEntity<AlbumDTO> createAlbum(@Valid @RequestBody AlbumDTO albumDTO) {
        AlbumDTO createdAlbum = albumService.createAlbum(albumDTO);
        return ResponseEntity.ok(createdAlbum);
    }

    /**
     *Update an album
     *Put/API/albums/1
     */
    @PutMapping("/{id}")
    public ResponseEntity<AlbumDTO> updateAlbum(
            @PathVariable Long id,
            @Valid @RequestBody AlbumDTO albumDTO) {
        AlbumDTO updatedAlbum = albumService.updateAlbum(id, albumDTO);
        return ResponseEntity.ok(updatedAlbum);
    }

    /**
     *Supprimer un album
     *DELETE /api/albums/1
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAlbum(@PathVariable Long id) {
        albumService.deleteAlbum(id);
        return ResponseEntity.noContent().build();
    }
}