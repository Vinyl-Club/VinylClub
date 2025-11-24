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

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProductDerviceTest {

    @Mock
    private ProductRepository productRepository;
    private AlbumRepository albumRepository;
    private ArtistRepository artistRepository;
    private CategoryRepository categoryRepository;
    private ImageRepository imageRepository;

    @InjectMocks
    private ProductService productService;

    //tester getAllProducts et 
    @Test
    public void getAllProducts_shouldReturnPagedProductDTOs() {
        // Given
        Product product1 = new Product();
        product1.setId(1l);
        product1.setTitle("Album One");
        product1.setDescription("First album description");
        product1.setPrice(new BigDecimal("19.99"));
        product1.setStatus(ProductStatus.AVAILABLE);
        product1.setState(ProductState.NEW);
        product1.setFormat(ProductFormat.T33);
        
        Product product2 = new Product();
        product2.setId(2l);
        product2.setTitle("Album Two");
        product2.setDescription("Second album description");
        product2.setPrice(new BigDecimal("24.99"));
        product2.setStatus(ProductStatus.AVAILABLE);
        product2.setState(ProductState.NEW);
        product2.setFormat(ProductFormat.T45);

        Pageable pageable = PageRequest.of(0, 10);
        Page<Product> productPage = new PageImpl<>(List.of(product1, product2), pageable, 2);

        When(productRepository.findByStatus(productStatus.AVAILABLE,pageable)).thenReturn(productPage);

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
        assertEquals("NEW", dto1.getState());
        assertEquals("T33", dto1.getFormat());
        
        assertEquals(2l, dto2.getId());
        assertEquals("Album Two", dto2.getTitle());
        assertEquals("Second album description", dto2.getDescription());
        assertEquals(new BigDecimal("24.99"), dto2.getPrice());
        assertEquals("AVAILABLE", dto2.getStatus());
        assertEquals("NEW", dto2.getState());
        assertEquals("T45", dto2.getFormat());
    
        verify(productRepository, times(1)).findByStatus(ProductStatus.AVAILABLE, pageable);
    }

    //getProductById
    @Test
    public void getProductById_shouldReturnProductDTO_whenProductExists() {
        
    }
    //tester create/update/delete si existant
    //tester les filtres/recherches
}
