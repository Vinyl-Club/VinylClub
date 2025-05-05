package com.vinylclub.catalog.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vinylclub.catalog.entity.Album;
import com.vinylclub.catalog.repository.AlbumRepository;

@Service
public class AlbumServiceImpl implements AlbumService {

    private static final Logger logger = LoggerFactory.getLogger(AlbumServiceImpl.class);

    @Autowired
    private AlbumRepository albumRepository;

    @Override
    public List<Album> getAllAlbums() {
        logger.info("Récupération de tous les albums");
        return albumRepository.findAll();
    }

    @Override
    public Optional<Album> getAlbumById(Long id) {
        logger.info("Récupération de l'album avec ID: {}", id);
        return albumRepository.findById(id);
    }

    @Override
    public List<Album> createAlbums(ArrayList<Album> albums) {
        logger.info("Création de {} albums", albums.size());
        
        // Log pour déboguer le contenu
        for (int i = 0; i < albums.size(); i++) {
            Album album = albums.get(i);
            logger.info("Album #{}: name={}", i+1, album.getName());
        }
        
        try {
            return albumRepository.saveAll(albums);
        } catch (Exception e) {
            logger.error("Erreur lors de la création des albums: {}", e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public Album updateAlbum(Long id, Album albumDetails) {
        logger.info("Mise à jour de l'album avec ID: {}", id);
        Optional<Album> album = albumRepository.findById(id);
        if (album.isPresent()) {
            Album existingAlbum = album.get();
            
            // Mettre à jour les propriétés
            if (albumDetails.getName() != null) {
                existingAlbum.setName(albumDetails.getName());
            }
            
            logger.info("Album mis à jour: {}", existingAlbum.getName());
            return albumRepository.save(existingAlbum);
        } else {
            logger.error("Album avec ID {} non trouvé", id);
            throw new RuntimeException("Album not found with id: " + id);
        }
    }

    @Override
    public void deleteAlbum(Long id) {
        logger.info("Suppression de l'album avec ID: {}", id);
        albumRepository.deleteById(id);
    }
}