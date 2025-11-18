package com.vinylclub.catalog.service;

import com.vinylclub.catalog.dto.ArtistDTO;
import com.vinylclub.catalog.dto.ProductDTO;
import com.vinylclub.catalog.entity.Artist;
import com.vinylclub.catalog.repository.ArtistRepository;
import com.vinylclub.catalog.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ArtistService {

    @Autowired
    private ArtistRepository artistRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductService productService;

    /**
     *Recover all the artists
     */
    public List<ArtistDTO> getAllArtists() {
        List<Artist> artists = artistRepository.findAll();
        return artists.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     *Recover an artist by ID
     */
    public ArtistDTO getArtistById(Long id) {
        Artist artist = artistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Artist not found with id: " + id));
        return convertToDTO(artist);
    }

    /**
     *Search artists by name
     */
    public List<ArtistDTO> searchArtists(String query) {
        List<Artist> artists = artistRepository.searchByName(query);
        return artists.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     *Recover the products of an artist
     */
    public Page<ProductDTO> getProductsByArtist(Long artistId, Pageable pageable) {
        // Check that the artist exists
        artistRepository.findById(artistId)
                .orElseThrow(() -> new RuntimeException("Artist not found with id: " + artistId));
        
        // Recover products
        return productRepository.findByArtistId(artistId, pageable)
                .map(product -> productService.convertToDTO(product));
    }

    /**
     *Create a new artist
     */
    public ArtistDTO createArtist(ArtistDTO artistDTO) {
        // Check that the name does not already exist
        if (artistRepository.findByNameIgnoreCase(artistDTO.getName()).isPresent()) {
            throw new RuntimeException("Artist with name '" + artistDTO.getName() + "' already exists");
        }

        Artist artist = convertToEntity(artistDTO);
        Artist savedArtist = artistRepository.save(artist);
        return convertToDTO(savedArtist);
    }

    /**
     *Update an artist
     */
    public ArtistDTO updateArtist(Long id, ArtistDTO artistDTO) {
        Artist existingArtist = artistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Artist not found with id: " + id));

        // Check that the new name does not already exist (unless it is the same artist)
        artistRepository.findByNameIgnoreCase(artistDTO.getName())
                .ifPresent(artist -> {
                    if (!artist.getId().equals(id)) {
                        throw new RuntimeException("Artist with name '" + artistDTO.getName() + "' already exists");
                    }
                });

        existingArtist.setName(artistDTO.getName());
        existingArtist.setBio(artistDTO.getBio());

        Artist updatedArtist = artistRepository.save(existingArtist);
        return convertToDTO(updatedArtist);
    }

    /**
     * Delete an artiste
     */
    public void deleteArtist(Long id) {
        // Check that the artist has no associated products
        Page<ProductDTO> products = getProductsByArtist(id, Pageable.ofSize(1));
        if (products.getTotalElements() > 0) {
            throw new RuntimeException("Cannot delete artist: " + products.getTotalElements() + " products are associated with this artist");
        }

        artistRepository.deleteById(id);
    }

    /**
     * Conversion Entity → DTO
     */
    private ArtistDTO convertToDTO(Artist artist) {
        return new ArtistDTO(
                artist.getId(),
                artist.getName(),
                artist.getBio()
        );
    }

    /**
     * Conversion DTO → Entity
     */
    private Artist convertToEntity(ArtistDTO dto) {
        Artist artist = new Artist();
        artist.setName(dto.getName());
        artist.setBio(dto.getBio());
        return artist;
    }
}