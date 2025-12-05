package com.vinylclub.catalog.service;

import com.vinylclub.catalog.dto.AlbumDTO;
import com.vinylclub.catalog.entity.Album;
import com.vinylclub.catalog.repository.AlbumRepository;

import org.bouncycastle.pqc.jcajce.provider.xmss.XMSSMTSignatureSpi.withShake128andPrehash;
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

@ExtendWith(MockitoExtension.class)
class AlbumServiceTest {

    @Mock
    private AlbumRepository albumRepository;

    @InjectMocks
    private AlbumService albumService;

    @Test
    void getAllAlbums_shouldReturnDTOList_whenAlbumsExist() {
        // GIVEN : le repository renvoie 2 albums
        Album album1 = new Album();
        album1.setId(1L);
        album1.setName("Thriller");

        Album album2 = new Album();
        album2.setId(2L);
        album2.setName("Back in Black");

        when(albumRepository.findAll()).thenReturn(List.of(album1, album2));

        // WHEN : on appelle le service
        List<AlbumDTO> result = albumService.getAllAlbums();

        // THEN : on vérifie le mapping & la taille
        assertNotNull(result);
        assertEquals(2, result.size());

        AlbumDTO dto1 = result.get(0);
        AlbumDTO dto2 = result.get(1);

        assertEquals(1L, dto1.getId());
        assertEquals("Thriller", dto1.getName());

        assertEquals(2L, dto2.getId());
        assertEquals("Back in Black", dto2.getName());

        // Vérifie que findAll a bien été appelé une fois
        verify(albumRepository, times(1)).findAll();
    }

    @Test
    void getAllAlbums_shouldReturnEmptyList_whenNoAlbumsExist() {
        // GIVEN : le repository renvoie une liste vide
        when(albumRepository.findAll()).thenReturn(Collections.emptyList());

        // WHEN
        List<AlbumDTO> result = albumService.getAllAlbums();

        // THEN
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(albumRepository, times(1)).findAll();
    }

    @Test
    public void TestCreateAlbum_shouldReturnDTO_whenAlbumIsCreated() {
        AlbumDTO dto3 = new AlbumDTO(null, "What Went Down");
        
        Album savedEntituy = new Album();
        savedEntituy.setId(3L);
        savedEntituy.setName("What Went Down");

        when(albumRepository.findByNameIgnoreCase("What Went Down")).thenReturn(Optional.empty());
        when(albumRepository.save(any(Album.class))).thenReturn(savedEntituy);

        AlbumDTO result = albumService.createAlbum(dto3);

        assertEquals(3L, result.getId());
        assertEquals("What Went Down", result.getName());
        
        verify(albumRepository).findByNameIgnoreCase("What Went Down");
        verify(albumRepository).save(any(Album.class));
    }
}
