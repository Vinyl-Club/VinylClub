package com.vinylclub.catalog.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.vinylclub.catalog.dto.AlbumDTO;
import com.vinylclub.catalog.entity.Album;
import com.vinylclub.catalog.repository.AlbumRepository;
import com.vinylclub.catalog.repository.ProductRepository;

@Service
@Transactional
public class AlbumService {

    @Autowired
    private AlbumRepository albumRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductService productService;

    /**
     *Recover all albums
     */
    public List<AlbumDTO> getAllAlbums() {
        List<Album> albums = albumRepository.findAll();
        return albums.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     *Recover an album by ID
     */
    public AlbumDTO getAlbumById(Long id) {
        Album album = albumRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Album not found with id: " + id));
        return convertToDTO(album);
    }

    /**
     *Search albums by name
     */
    public List<AlbumDTO> searchAlbums(String query) {
        List<Album> albums = albumRepository.searchByName(query);
        return albums.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     *Create a new album
     */
    public AlbumDTO createAlbum(AlbumDTO albumDTO) {
        // Check that the name does not already exist
        if (albumRepository.findByNameIgnoreCase(albumDTO.getName()).isPresent()) {
            throw new RuntimeException("Album with name '" + albumDTO.getName() + "' already exists");
        }

        Album album = convertToEntity(albumDTO);
        Album savedAlbum = albumRepository.save(album);
        return convertToDTO(savedAlbum);
    }

    /**
     *Update an album
     */
    public AlbumDTO updateAlbum(Long id, AlbumDTO albumDTO) {
        Album existingAlbum = albumRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Album not found with id: " + id));

        // Check that the new name does not already exist (unless it's the same album)
        albumRepository.findByNameIgnoreCase(albumDTO.getName())
                .ifPresent(album -> {
                    if (!album.getId().equals(id)) {
                        throw new RuntimeException("Album with name '" + albumDTO.getName() + "' already exists");
                    }
                });

        existingAlbum.setName(albumDTO.getName());

        Album updatedAlbum = albumRepository.save(existingAlbum);
        return convertToDTO(updatedAlbum);
    }

    /**
     * Delete album
     */
    public void deleteAlbum(Long id) {
        albumRepository.deleteById(id);
    }

    /**
     * Conversion Entity → DTO
     */
    private AlbumDTO convertToDTO(Album album) {
        return new AlbumDTO(
                album.getId(),
                album.getName()
        );
    }

    /**
     * Conversion DTO → Entity
     */
    private Album convertToEntity(AlbumDTO dto) {
        Album album = new Album();
        album.setName(dto.getName());
        return album;
    }
}