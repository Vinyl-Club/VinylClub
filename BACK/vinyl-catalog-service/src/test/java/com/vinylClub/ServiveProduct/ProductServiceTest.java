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
public class ProductServiceTest {

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

    //testing getAllProducts 
    @Test
    public void getAllProducts_shouldReturnPagedProductDTOs() {
        // Given
        Product product1 = new Product();
        product1.setId(1l);
        product1.setTitle("Album One");
        product1.setDescription("First album description");
        product1.setPrice(new BigDecimal("19.99"));
        product1.setStatus(ProductStatus.AVAILABLE);
        product1.setState(ProductState.TRES_BON_ETAT);
        product1.setFormat(ProductFormat.T33);
        
        Product product2 = new Product();
        product2.setId(2l);
        product2.setTitle("Album Two");
        product2.setDescription("Second album description");
        product2.setPrice(new BigDecimal("24.99"));
        product2.setStatus(ProductStatus.AVAILABLE);
        product2.setState(ProductState.TRES_BON_ETAT);
        product2.setFormat(ProductFormat.T45);

        Pageable pageable = PageRequest.of(0, 10);
        Page<Product> productPage = new PageImpl<>(List.of(product1, product2), pageable, 2);

        when(productRepository.findByStatus(ProductStatus.AVAILABLE,pageable)).thenReturn(productPage);

        // When
        Page<ProductDTO> result = productService.getAllProducts(pageable);

        // Then
        assertNotNull(result);
        assertEquals(2, result.getContent().size());
        assertEquals(2, result.getTotalElements());

        ProductDTO dto1 = result.getContent().get(0);
        ProductDTO dto2 = result.getContent().get(1);

        assertEquals(1l, dto1.getId());
        assertEquals("Album One", dto1.getTitle());
        assertEquals("First album description", dto1.getDescription());
        assertEquals(new BigDecimal("19.99"), dto1.getPrice());
        assertEquals("AVAILABLE", dto1.getStatus());
        assertEquals("TRES_BON_ETAT", dto1.getState());
        assertEquals("T33", dto1.getFormat());
        
        assertEquals(2l, dto2.getId());
        assertEquals("Album Two", dto2.getTitle());
        assertEquals("Second album description", dto2.getDescription());
        assertEquals(new BigDecimal("24.99"), dto2.getPrice());
        assertEquals("AVAILABLE", dto2.getStatus());
        assertEquals("TRES_BON_ETAT", dto2.getState());
        assertEquals("T45", dto2.getFormat());
    
        verify(productRepository, times(1)).findByStatus(ProductStatus.AVAILABLE, pageable);
    }

    //getProductById
    @Test
    public void getProductById_shouldReturnProductDTO_whenProductExists() {
        // Given
        Product product = new Product();
        product.setId(1L);
        product.setTitle("Test Album");
        product.setDescription("This is a test album.");
        product.setPrice(new BigDecimal("29.99"));
        product.setStatus(ProductStatus.AVAILABLE);
        product.setState(ProductState.TRES_BON_ETAT);
        product.setFormat(ProductFormat.T45);

        // When
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        ProductDTO result = productService.getProductById(1L);

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Test Album", result.getTitle());
        assertEquals("This is a test album.", result.getDescription());
        assertEquals(new BigDecimal("29.99"), result.getPrice());
        assertEquals("AVAILABLE", result.getStatus());
        assertEquals("TRES_BON_ETAT", result.getState());
        assertEquals("T45", result.getFormat());

        verify(productRepository, times(1)).findById(1L);

    }
    
    //update
    @Test
    public void updateProduct_shouldReturnUpdatedProductDTO_whenProductExists() {
        ProductDto dto = new ProductDTO();
        dto.setTitle("Updated Album");
        dto.setDescription("Updated album description");
        dto.setPrice(new BigDecimal("39.99"));
        dto.setStatus("OUT_OF_STOCK");
        dto.setState("BON_ETAT");
        dto.setFormat("T45");
        
        
    }
    //delete si existant


    //tester les filtres/recherches
}
