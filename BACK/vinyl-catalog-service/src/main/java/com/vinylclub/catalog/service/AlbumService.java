package com.vinylclub.catalog.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vinylclub.catalog.dto.AlbumDTO;
import com.vinylclub.catalog.entity.Album;
import com.vinylclub.catalog.repository.AlbumRepository;

@Service
@Transactional
public class AlbumService {

    @Autowired
    private AlbumRepository albumRepository;

    /**
     * Récupérer tous les albums
     */
    public List<AlbumDTO> getAllAlbums() {
        List<Album> albums = albumRepository.findAll();
        return albums.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Récupérer un album par ID
     */
    public AlbumDTO getAlbumById(Long id) {
        Album album = albumRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Album not found with id: " + id));
        return convertToDTO(album);
    }

    /**
     * Créer un nouvel album
     */
    public AlbumDTO createAlbum(AlbumDTO albumDTO) {
        // Vérifier que le nom n'existe pas déjà
        if (albumRepository.findByNameIgnoreCase(albumDTO.getName()).isPresent()) {
            throw new RuntimeException("Album with name '" + albumDTO.getName() + "' already exists");
        }

        Album album = convertToEntity(albumDTO);
        Album savedAlbum = albumRepository.save(album);
        return convertToDTO(savedAlbum);
    }

    /**
     * Mettre à jour un album
     */
    public AlbumDTO updateAlbum(Long id, AlbumDTO albumDTO) {
        Album existingAlbum = albumRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Album not found with id: " + id));

        // Vérifier que le nouveau nom n'existe pas déjà (sauf si c'est le même album)
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
     * Supprimer un album
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