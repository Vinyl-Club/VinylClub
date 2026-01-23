package com.vinylclub.catalog.service;

import com.vinylclub.catalog.dto.AlbumDTO;
import com.vinylclub.catalog.entity.Album;
import com.vinylclub.catalog.repository.AlbumRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.List;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Tests unitaires de AlbumService.
 * Objectif : tester la logique du service en isolant la dépendance AlbumRepository grâce à Mockito.
 */
@ExtendWith(MockitoExtension.class) // Active Mockito avec JUnit 5 (initialisation automatique des mocks)
class AlbumServiceTest {

    
    @Mock
    private AlbumRepository albumRepository;

    
    @InjectMocks
    private AlbumService albumService;

    /**
     * Cas: le repository renvoie une liste d'albums.
     * Attendu: le service renvoie une liste de DTO correctement mappés.
     */
    @Test
    void getAllAlbums_shouldReturnDTOList_whenAlbumsExist() {
        // préparation des données renvoyées par le repository
        Album album1 = new Album();
        album1.setId(1L);
        album1.setName("Thriller");

        Album album2 = new Album();
        album2.setId(2L);
        album2.setName("Back in Black");

        // On configure le mock : quand findAll() est appelé, renvoyer ces 2 albums
        when(albumRepository.findAll()).thenReturn(List.of(album1, album2));

        // appel de la méthode à tester
        List<AlbumDTO> result = albumService.getAllAlbums();

        // assertions sur le résultat (non null, taille, mapping id/name)
        assertNotNull(result);
        assertEquals(2, result.size());

        AlbumDTO dto1 = result.get(0);
        AlbumDTO dto2 = result.get(1);

        assertEquals(1L, dto1.getId());
        assertEquals("Thriller", dto1.getName());

        assertEquals(2L, dto2.getId());
        assertEquals("Back in Black", dto2.getName());

        // Vérifie que le service a bien utilisé le repository comme attendu
        verify(albumRepository, times(1)).findAll();
    }

    /**
     * Cas: aucun album en base (repository renvoie une liste vide).
     * Attendu: le service renvoie une liste vide (et pas null).
     */
    @Test
    void getAllAlbums_shouldReturnEmptyList_whenNoAlbumsExist() {
        
        when(albumRepository.findAll()).thenReturn(Collections.emptyList());

        List<AlbumDTO> result = albumService.getAllAlbums();

        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(albumRepository, times(1)).findAll();
    }

    /**
     * Cas: création d'un album.
     * - Le nom n'existe pas déjà (findByNameIgnoreCase => Optional.empty())
     * - Le save renvoie une entité persistée (avec un id généré)
     * Attendu: le service renvoie un DTO avec id + name.
     */
    @Test
    public void TestCreateAlbum_shouldReturnDTO_whenAlbumIsCreated() {
        
        AlbumDTO dto3 = new AlbumDTO(null, "What Went Down");

        // Entité simulée comme "sauvée" par le repository (id attribué)
        Album savedEntity = new Album();
        savedEntity.setId(3L);
        savedEntity.setName("What Went Down");

        // On simule l'absence de doublon (pas d'album avec ce nom)
        when(albumRepository.findByNameIgnoreCase("What Went Down"))
                .thenReturn(Optional.empty());

        when(albumRepository.save(any(Album.class)))
                .thenReturn(savedEntity);

        AlbumDTO result = albumService.createAlbum(dto3);

        assertEquals(3L, result.getId());
        assertEquals("What Went Down", result.getName());

        verify(albumRepository).findByNameIgnoreCase("What Went Down");
        verify(albumRepository).save(any(Album.class));
    }
}
