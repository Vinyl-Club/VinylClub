package com.vinylclub.catalog.service;

import com.vinylclub.catalog.dto.ProductDTO;
import com.vinylclub.catalog.dto.AlbumDTO;
import com.vinylclub.catalog.dto.ArtistDTO;
import com.vinylclub.catalog.dto.CategoryDTO;
import com.vinylclub.catalog.dto.ImageDTO;
import com.vinylclub.catalog.dto.ImageSummaryDTO;

import com.vinylclub.catalog.entity.Product;
import com.vinylclub.catalog.entity.Album;
import com.vinylclub.catalog.entity.Artist;
import com.vinylclub.catalog.entity.Category;
import com.vinylclub.catalog.entity.ProductState;
import com.vinylclub.catalog.entity.ProductStatus;
import com.vinylclub.catalog.entity.ProductFormat;

import com.vinylclub.catalog.repository.ProductRepository;
import com.vinylclub.catalog.repository.AlbumRepository;
import com.vinylclub.catalog.repository.ArtistRepository;
import com.vinylclub.catalog.repository.CategoryRepository;
import com.vinylclub.catalog.repository.ImageRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CreateProductTest {
    
    @Mock
    private ProductRepository productRepository;
    @Mock
    private AlbumRepository albumRepository;
    @Mock
    private ArtistRepository artistRepository;
    @Mock
    private CategoryRepository categoryRepository;
    @Mock
    private ImageRepository imageRepository;

    @InjectMocks
    private ProductService productService;

     //testing create
    @Test
    public void createProduct_shouldReturnProductDTO_whenProductIsCreated() {

        ProductDTO dto = new ProductDTO();
        dto.setId(1L);
        dto.setTitle("New Album");
        dto.setDescription("Brand new album description");
        dto.setPrice(new BigDecimal("34.99")); 
        dto.setStatus("AVAILABLE");
        dto.setState("TRES_BON_ETAT");
        dto.setFormat("T33");

        Artist artist = new Artist();
        artist.setId(1L);
        artist.setName("New Artist");

        Category category = new Category();
        category.setId(1L);
        category.setName("Rock");

        Album album = new Album();
        album.setId(1L);
        album.setName("New Album");

        dto.setArtist(new ArtistDTO(1L, null, null));
        dto.setCategory(new CategoryDTO(1L, null));
        dto.setAlbum(new AlbumDTO(1L, null));

        when(artistRepository.findById(1L)).thenReturn(Optional.of(artist));
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(albumRepository.findById(1L)).thenReturn(Optional.of(album));

        Product savedProduct = new Product();
        savedProduct.setId(1L);
        savedProduct.setTitle("New Album");
        savedProduct.setDescription("Brand new album description");
        savedProduct.setPrice(new BigDecimal("34.99"));
        savedProduct.setStatus(ProductStatus.AVAILABLE);
        savedProduct.setState(ProductState.TRES_BON_ETAT);
        savedProduct.setFormat(ProductFormat.T33);
        savedProduct.setArtist(artist);
        savedProduct.setCategory(category);
        savedProduct.setAlbum(album);

        when(productRepository.save(any(Product.class))).thenReturn(savedProduct);  

        ProductDTO result = productService.createProduct(dto);
        assertEquals(1L, result.getId());
        assertEquals("New Album", result.getTitle());
        assertEquals("Brand new album description", result.getDescription());
        assertEquals(new BigDecimal("34.99"), result.getPrice());
        assertEquals("AVAILABLE", result.getStatus());
        assertEquals("TRES_BON_ETAT", result.getState());
        assertEquals("T33", result.getFormat());

        verify(productRepository, times(1)).save(any(Product.class));
        
    }
}
