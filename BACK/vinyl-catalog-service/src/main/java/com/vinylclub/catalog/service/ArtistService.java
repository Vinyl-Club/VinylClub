package com.vinylclub.catalog.service;

import com.vinylclub.catalog.entity.Artist;
import com.vinylclub.catalog.repository.ArtistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ArtistService {

    @Autowired
    private ArtistRepository artistRepository;

    public List<Artist> getAllArtists() {
        return artistRepository.findAll();
    }

    
    public Optional<Artist> getArtistById(Long id) {
        return artistRepository.findById(id);
    }

    
    public Artist createArtist(Artist artist) {
        return artistRepository.save(artist);
    }

   
    public Artist updateArtist(Long id, Artist artistDetails) {
        Artist artist = artistRepository.findById(id).orElseThrow(() -> new RuntimeException("Artist not found"));
        artist.setName(artistDetails.getName());
        artist.setBio(artistDetails.getBio());
        return artistRepository.save(artist);
    }

   
    public void deleteArtist(Long id) {
        artistRepository.deleteById(id);
    }

    public Artist findByName(String name) {
        return artistRepository.findByName(name);
    }

    
    public boolean existsByName(String name) {
        return artistRepository.existsByName(name);
    }
}
