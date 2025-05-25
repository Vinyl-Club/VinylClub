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
     * Récupérer tous les artistes
     */
    public List<ArtistDTO> getAllArtists() {
        List<Artist> artists = artistRepository.findAll();
        return artists.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Récupérer un artiste par ID
     */
    public ArtistDTO getArtistById(Long id) {
        Artist artist = artistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Artist not found with id: " + id));
        return convertToDTO(artist);
    }

    /**
     * Rechercher des artistes par nom
     */
    public List<ArtistDTO> searchArtists(String query) {
        List<Artist> artists = artistRepository.searchByName(query);
        return artists.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Récupérer les produits d'un artiste
     */
    public Page<ProductDTO> getProductsByArtist(Long artistId, Pageable pageable) {
        // Vérifier que l'artiste existe
        artistRepository.findById(artistId)
                .orElseThrow(() -> new RuntimeException("Artist not found with id: " + artistId));
        
        // Récupérer les produits
        return productRepository.findByArtistId(artistId, pageable)
                .map(product -> productService.convertToDTO(product));
    }

    /**
     * Créer un nouvel artiste
     */
    public ArtistDTO createArtist(ArtistDTO artistDTO) {
        // Vérifier que le nom n'existe pas déjà
        if (artistRepository.findByNameIgnoreCase(artistDTO.getName()).isPresent()) {
            throw new RuntimeException("Artist with name '" + artistDTO.getName() + "' already exists");
        }

        Artist artist = convertToEntity(artistDTO);
        Artist savedArtist = artistRepository.save(artist);
        return convertToDTO(savedArtist);
    }

    /**
     * Mettre à jour un artiste
     */
    public ArtistDTO updateArtist(Long id, ArtistDTO artistDTO) {
        Artist existingArtist = artistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Artist not found with id: " + id));

        // Vérifier que le nouveau nom n'existe pas déjà (sauf si c'est le même artiste)
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
     * Supprimer un artiste
     */
    public void deleteArtist(Long id) {
        // Vérifier que l'artiste n'a pas de produits associés
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