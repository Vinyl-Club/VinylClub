package com.vinylclub.catalog.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vinylclub.catalog.dto.AlbumDTO;
import com.vinylclub.catalog.dto.ArtistDTO;
import com.vinylclub.catalog.dto.CategoryDTO;
import com.vinylclub.catalog.dto.ImageDTO;
import com.vinylclub.catalog.dto.ImageSummaryDTO;
import com.vinylclub.catalog.dto.ProductDTO;
import com.vinylclub.catalog.entity.Album;
import com.vinylclub.catalog.entity.Artist;
import com.vinylclub.catalog.entity.Category;
import com.vinylclub.catalog.entity.Product;
import com.vinylclub.catalog.entity.ProductState;
import com.vinylclub.catalog.entity.ProductStatus;
import com.vinylclub.catalog.repository.AlbumRepository;
import com.vinylclub.catalog.repository.ArtistRepository;
import com.vinylclub.catalog.repository.CategoryRepository;
import com.vinylclub.catalog.repository.ProductRepository;

@Service
@Transactional
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ArtistRepository artistRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private AlbumRepository albumRepository;

    // PAGE D'ACCUEIL - Tous les produits avec pagination
    public Page<ProductDTO> getAllProducts(Pageable pageable) {
        Page<Product> products = productRepository.findByStatus(ProductStatus.AVAILABLE, pageable);
        return products.map(this::convertToDTO);
    }

    // DÉTAILS PRODUIT
    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return convertToDTO(product);
    }

    // RECHERCHE
    public Page<ProductDTO> searchProducts(String query, Pageable pageable) {
        Page<Product> products = productRepository.searchByTitleOrArtist(query, pageable);
        return products.map(this::convertToDTO);
    }

    // FILTRAGE PAR CATÉGORIE
    public Page<ProductDTO> getProductsByCategory(Long categoryId, Pageable pageable) {
        Page<Product> products = productRepository.findByCategoryId(categoryId, pageable);
        return products.map(this::convertToDTO);
    }

    // PRODUITS RÉCENTS (pour page d'accueil)
    public List<ProductDTO> getRecentProducts(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<Product> products = productRepository.findRecentProducts(pageable);
        return products.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    /**
     * CRÉER PRODUIT (pour admin)
     */
    public ProductDTO createProduct(ProductDTO productDTO) {
        Product product = new Product();
        
        // Champs de base
        product.setTitle(productDTO.getTitle());
        product.setDescription(productDTO.getDescription());
        product.setPrice(productDTO.getPrice());
        product.setQuantity(productDTO.getQuantity() != null ? productDTO.getQuantity() : 0);
        product.setReleaseYear(productDTO.getReleaseYear());
        product.setUserId(productDTO.getUserId());
        
        // Gestion des enums
        if (productDTO.getStatus() != null) {
            product.setStatus(ProductStatus.valueOf(productDTO.getStatus()));
        } else {
            product.setStatus(ProductStatus.AVAILABLE);
        }
        
        if (productDTO.getState() != null) {
            product.setState(ProductState.valueOf(productDTO.getState()));
        }
        
        // Relations - Récupération depuis les repositories
        if (productDTO.getArtist() != null && productDTO.getArtist().getId() != null) {
            Artist artist = artistRepository.findById(productDTO.getArtist().getId())
                .orElseThrow(() -> new RuntimeException("Artist not found with id: " + productDTO.getArtist().getId()));
            product.setArtist(artist);
        }
        
        if (productDTO.getCategory() != null && productDTO.getCategory().getId() != null) {
            Category category = categoryRepository.findById(productDTO.getCategory().getId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + productDTO.getCategory().getId()));
            product.setCategory(category);
        }
        
        if (productDTO.getAlbum() != null && productDTO.getAlbum().getId() != null) {
            Album album = albumRepository.findById(productDTO.getAlbum().getId())
                .orElseThrow(() -> new RuntimeException("Album not found with id: " + productDTO.getAlbum().getId()));
            product.setAlbum(album);
        }
        
        Product savedProduct = productRepository.save(product);
        return convertToDTO(savedProduct);
    }

    // METTRE À JOUR PRODUIT
    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        Product existingProduct = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        
        // Mise à jour des champs
        existingProduct.setTitle(productDTO.getTitle());
        existingProduct.setDescription(productDTO.getDescription());
        existingProduct.setPrice(productDTO.getPrice());
        existingProduct.setQuantity(productDTO.getQuantity());
        existingProduct.setReleaseYear(productDTO.getReleaseYear());
        
        Product updatedProduct = productRepository.save(existingProduct);
        return convertToDTO(updatedProduct);
    }

    // SUPPRIMER PRODUIT
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    // CONVERSION ENTITY → DTO (VERSION OPTIMISÉE)
    public ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setTitle(product.getTitle());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setQuantity(product.getQuantity());
        dto.setReleaseYear(product.getReleaseYear());
        dto.setStatus(product.getStatus() != null ? product.getStatus().toString() : null);
        dto.setState(product.getState() != null ? product.getState().toString() : null);
        dto.setUserId(product.getUserId());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());

        // Relations
        if (product.getArtist() != null) {
            dto.setArtist(new ArtistDTO(
                product.getArtist().getId(),
                product.getArtist().getName(),
                product.getArtist().getBio()
            ));
        }

        if (product.getCategory() != null) {
            dto.setCategory(new CategoryDTO(
                product.getCategory().getId(),
                product.getCategory().getName()
            ));
        }

        if (product.getAlbum() != null) {
            dto.setAlbum(new AlbumDTO(
                product.getAlbum().getId(),
                product.getAlbum().getName()
            ));
        }

        // Images (VERSION OPTIMISÉE - sans les bytes, juste les métadonnées + URLs)
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            List<ImageSummaryDTO> imageSummaries = product.getImages().stream()
                .map(this::convertImageToSummaryDTO)
                .collect(Collectors.toList());
            dto.setImages(imageSummaries);
        }

        return dto;
    }

    // CONVERSION Images Entity → ImageDTO (pour usage spécifique avec bytes complets)
    private ImageDTO convertImageToDTO(com.vinylclub.catalog.entity.Images imageEntity) {
        ImageDTO imageDTO = new ImageDTO();
        imageDTO.setId(imageEntity.getId());
        imageDTO.setImage(imageEntity.getImage()); // Les données binaires complètes
        imageDTO.setProductId(imageEntity.getProduct().getId());
        return imageDTO;
    }

    // NOUVELLE MÉTHODE : Conversion Images Entity → ImageSummaryDTO (pour ProductDTO optimisé)
    private ImageSummaryDTO convertImageToSummaryDTO(com.vinylclub.catalog.entity.Images imageEntity) {
        ImageSummaryDTO summaryDTO = new ImageSummaryDTO();
        summaryDTO.setId(imageEntity.getId());
        summaryDTO.setProductId(imageEntity.getProduct().getId());
        return summaryDTO;
    }

    // CONVERSION DTO → ENTITY (pour création/mise à jour)
    private Product convertToEntity(ProductDTO dto) {
        Product product = new Product();
        product.setTitle(dto.getTitle());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setQuantity(dto.getQuantity());
        product.setReleaseYear(dto.getReleaseYear());
        product.setUserId(dto.getUserId());
        
        // Les relations doivent être gérées séparément
        // (récupération depuis les repositories)
        
        return product;
    }
}