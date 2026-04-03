package com.vinylclub.catalog.service;

import java.util.List;
import java.util.stream.Collectors;
import java.math.BigDecimal;

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
import com.vinylclub.catalog.entity.ProductFormat;
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

    public Page<ProductDTO> getAllProducts(Pageable pageable) {
        Page<Product> products = productRepository.findByStatus(ProductStatus.AVAILABLE, pageable);
        return products.map(this::convertToDTO);
    }

    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return convertToDTO(product);
    }

    public Page<ProductDTO> searchProducts(String query, Pageable pageable) {
        Page<Product> products = productRepository.searchByAlbumOrArtist(query, pageable);
        return products.map(this::convertToDTO);
    }

    public Page<ProductDTO> getProductsByCategory(Long categoryId, Pageable pageable) {
        Page<Product> products = productRepository.findByCategoryId(categoryId, pageable);
        return products.map(this::convertToDTO);
    }

    public Page<ProductDTO> getProductsByPrice(BigDecimal price, Pageable pageable) {
        Page<Product> products = productRepository.findByPrice(price, pageable);
        return products.map(this::convertToDTO);
    }

    public Page<ProductDTO> getProductsByFormat(ProductFormat format, Pageable pageable) {
        Page<Product> products = productRepository.findByFormat(format, pageable);
        return products.map(this::convertToDTO);
    }

    public Page<ProductDTO> getProductsByState(ProductState state, Pageable pageable) {
        Page<Product> products = productRepository.findByState(state, pageable);
        return products.map(this::convertToDTO);
    }

    public List<ProductDTO> getRecentProducts(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<Product> products = productRepository.findRecentProducts(pageable);
        return products.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public ProductDTO createProduct(ProductDTO productDTO) {
        Product product = new Product();

        product.setTitle(productDTO.getTitle());
        product.setDescription(productDTO.getDescription());
        product.setPrice(productDTO.getPrice());

        product.setStatus(productDTO.getStatus() != null
                ? ProductStatus.valueOf(productDTO.getStatus())
                : ProductStatus.AVAILABLE);

        if (productDTO.getState() != null)
            product.setState(ProductState.valueOf(productDTO.getState()));

        if (productDTO.getFormat() != null)
            product.setFormat(ProductFormat.valueOf(productDTO.getFormat()));

        if (productDTO.getArtist() != null && productDTO.getArtist().getId() != null) {
            Long artistId = productDTO.getArtist().getId();
            Artist artist = artistRepository.findById(artistId)
                    .orElseThrow(() -> new RuntimeException("Artist not found with id: " + artistId));
            product.setArtist(artist);
        }

        if (productDTO.getCategory() != null && productDTO.getCategory().getId() != null) {
            Long categoryId = productDTO.getCategory().getId();
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));
            product.setCategory(category);
        }

        if (productDTO.getAlbum() != null && productDTO.getAlbum().getId() != null) {
            Long albumId = productDTO.getAlbum().getId();
            Album album = albumRepository.findById(albumId)
                    .orElseThrow(() -> new RuntimeException("Album not found with id: " + albumId));
            product.setAlbum(album);
        }

        return convertToDTO(productRepository.save(product));
    }

    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        product.setTitle(productDTO.getTitle());
        product.setDescription(productDTO.getDescription());
        product.setPrice(productDTO.getPrice());

        if (productDTO.getStatus() != null)
            product.setStatus(ProductStatus.valueOf(productDTO.getStatus()));

        if (productDTO.getState() != null)
            product.setState(ProductState.valueOf(productDTO.getState()));

        if (productDTO.getFormat() != null)
            product.setFormat(ProductFormat.valueOf(productDTO.getFormat()));

        return convertToDTO(productRepository.save(product));
    }

    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        productRepository.deleteById(id);
    }

    public ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();

        dto.setId(product.getId());
        dto.setTitle(product.getTitle());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setStatus(product.getStatus() != null ? product.getStatus().toString() : null);
        dto.setState(product.getState() != null ? product.getState().toString() : null);
        dto.setFormat(product.getFormat() != null ? product.getFormat().toString() : null);
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());

        if (product.getArtist() != null) {
            dto.setArtist(new ArtistDTO(
                    product.getArtist().getId(),
                    product.getArtist().getName(),
                    product.getArtist().getBio()));
        }

        if (product.getCategory() != null) {
            dto.setCategory(new CategoryDTO(
                    product.getCategory().getId(),
                    product.getCategory().getName()));
        }

        if (product.getAlbum() != null) {
            dto.setAlbum(new AlbumDTO(
                    product.getAlbum().getId(),
                    product.getAlbum().getName()));
        }

        if (product.getImages() != null && !product.getImages().isEmpty()) {
            List<ImageSummaryDTO> summaries = product.getImages().stream()
                    .map(this::convertImageToSummaryDTO)
                    .collect(Collectors.toList());

            dto.setImages(summaries);
        }

        return dto;
    }

    private ImageDTO convertImageToDTO(com.vinylclub.catalog.entity.Images imageEntity) {
        ImageDTO dto = new ImageDTO();
        dto.setId(imageEntity.getId());
        dto.setImageUrl(imageEntity.getImageUrl());
        dto.setPublicId(imageEntity.getPublicId());
        dto.setProductId(imageEntity.getProduct().getId());
        return dto;
    }

    private ImageSummaryDTO convertImageToSummaryDTO(com.vinylclub.catalog.entity.Images imageEntity) {
        ImageSummaryDTO summary = new ImageSummaryDTO();
        summary.setId(imageEntity.getId());
        summary.setImageUrl(imageEntity.getImageUrl());
        return summary;
    }
}