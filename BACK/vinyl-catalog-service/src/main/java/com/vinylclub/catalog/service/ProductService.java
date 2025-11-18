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

    // Home page -All products with pagination
    public Page<ProductDTO> getAllProducts(Pageable pageable) {
        Page<Product> products = productRepository.findByStatus(ProductStatus.AVAILABLE, pageable);
        return products.map(this::convertToDTO);
    }

    // Product details
    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return convertToDTO(product);
    }

    // Search products by title or artist
    public Page<ProductDTO> searchProducts(String query, Pageable pageable) {
        Page<Product> products = productRepository.searchByTitleOrArtist(query, pageable);
        return products.map(this::convertToDTO);
    }

    // Category filtering
    public Page<ProductDTO> getProductsByCategory(Long categoryId, Pageable pageable) {
        Page<Product> products = productRepository.findByCategoryId(categoryId, pageable);
        return products.map(this::convertToDTO);
    }

    // Price filtering
    public Page<ProductDTO> getProductsByPrice(BigDecimal price, Pageable pageable) {
        Page<Product> products = productRepository.findByPrice(price, pageable);
        return products.map(this::convertToDTO);
    }

    // Format filtering
    public Page<ProductDTO> getProductsByFormat(ProductFormat format, Pageable pageable) {
        Page<Product> products = productRepository.findByFormat(format, pageable);
        return products.map(this::convertToDTO);
    }

    // Recent products (for home page)
    public List<ProductDTO> getRecentProducts(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<Product> products = productRepository.findRecentProducts(pageable);
        return products.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    /**
     * Create product (for admin)
     */
    public ProductDTO createProduct(ProductDTO productDTO) {
        Product product = new Product();

        // Basic fields
        product.setTitle(productDTO.getTitle());
        product.setDescription(productDTO.getDescription());
        product.setPrice(productDTO.getPrice());
        product.setFormat(productDTO.getFormat());

        // Enum management
        if (productDTO.getStatus() != null) {
            product.setStatus(ProductStatus.valueOf(productDTO.getStatus()));
        } else {
            product.setStatus(ProductStatus.AVAILABLE);
        }

        if (productDTO.getState() != null) {
            product.setState(ProductState.valueOf(productDTO.getState()));
        }

        // Relations -Recovery from restitories
        if (productDTO.getArtist() != null && productDTO.getArtist().getId() != null) {
            Artist artist = artistRepository.findById(productDTO.getArtist().getId())
                    .orElseThrow(
                            () -> new RuntimeException("Artist not found with id: " + productDTO.getArtist().getId()));
            product.setArtist(artist);
        }

        if (productDTO.getCategory() != null && productDTO.getCategory().getId() != null) {
            Category category = categoryRepository.findById(productDTO.getCategory().getId())
                    .orElseThrow(() -> new RuntimeException(
                            "Category not found with id: " + productDTO.getCategory().getId()));
            product.setCategory(category);
        }

        if (productDTO.getAlbum() != null && productDTO.getAlbum().getId() != null) {
            Album album = albumRepository.findById(productDTO.getAlbum().getId())
                    .orElseThrow(
                            () -> new RuntimeException("Album not found with id: " + productDTO.getAlbum().getId()));
            product.setAlbum(album);
        }

        Product savedProduct = productRepository.save(product);
        return convertToDTO(savedProduct);
    }

    // Update product
    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        // Update inputs
        existingProduct.setTitle(productDTO.getTitle());
        existingProduct.setDescription(productDTO.getDescription());
        existingProduct.setPrice(productDTO.getPrice());
        existingProduct.setFormat(productDTO.getFormat());

        Product updatedProduct = productRepository.save(existingProduct);
        return convertToDTO(updatedProduct);
    }

    // Delete product
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    // ENTITY Conversion → DTO (Optimized version)
    public ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setTitle(product.getTitle());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setFormat(product.getFormat());
        dto.setStatus(product.getStatus() != null ? product.getStatus().toString() : null);
        dto.setState(product.getState() != null ? product.getState().toString() : null);
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());

        // Realationships
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

        // Images (optimized version -without the Bytes, just metadata + urls)
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            List<ImageSummaryDTO> imageSummaries = product.getImages().stream()
                    .map(this::convertImageToSummaryDTO)
                    .collect(Collectors.toList());
            dto.setImages(imageSummaries);
        }

        return dto;
    }

    // Conversion images entity → imagedto (for specific use with complete bytes)
    private ImageDTO convertImageToDTO(com.vinylclub.catalog.entity.Images imageEntity) {
        ImageDTO imageDTO = new ImageDTO();
        imageDTO.setId(imageEntity.getId());
        imageDTO.setImage(imageEntity.getImage()); // Les données binaires complètes
        imageDTO.setProductId(imageEntity.getProduct().getId());
        return imageDTO;
    }

    // New method: Conversion Images Entity → ImagesumMarydto (for productdto
    // optimized)
    private ImageSummaryDTO convertImageToSummaryDTO(com.vinylclub.catalog.entity.Images imageEntity) {
        ImageSummaryDTO summaryDTO = new ImageSummaryDTO();
        summaryDTO.setId(imageEntity.getId());
        summaryDTO.setProductId(imageEntity.getProduct().getId());
        return summaryDTO;
    }

    // DTO conversion → Entity (for creation/update)
    private Product convertToEntity(ProductDTO dto) {
        Product product = new Product();
        product.setTitle(dto.getTitle());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setFormat(dto.getFormat());

        // Relations must be managed separately
        // (recovery from restitories)

        return product;
    }
}