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
public class FilterProductTest {

    @Mock
    private ProductRepository productRepository;
    @Mock
    private AlbumRepository albumRepository;
    @Mock
    private ArtistRepository artistRepository;
    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private ProductService productService;

   @Test
    public void searchProducts_shouldReturnProductDto_whenProductfindByArtistOrAlbum() {
        // GIVEN
        String query = "maribou";
        Pageable pageable = PageRequest.of(0, 12);

        Product product1 = new Product();
        product1.setId(1L);
        product1.setTitle("Hallucinating Love - Maribou State");
        product1.setDescription("desc 1");
        product1.setPrice(new BigDecimal("20.00"));
        product1.setStatus(ProductStatus.AVAILABLE);
        product1.setState(ProductState.TRES_BON_ETAT);
        product1.setFormat(ProductFormat.T33);

        Product product2 = new Product();
        product2.setId(2L);
        product2.setTitle("Another Album");
        product2.setDescription("desc 2");
        product2.setPrice(new BigDecimal("25.00"));
        product2.setStatus(ProductStatus.AVAILABLE);
        product2.setState(ProductState.BON_ETAT);
        product2.setFormat(ProductFormat.T45);

        Page<Product> productPage = new PageImpl<>(List.of(product1, product2), pageable, 2);

        when(productRepository.searchByAlbumOrArtist(query, pageable)).thenReturn(productPage);

        // WHEN
        Page<ProductDTO> result = productService.searchProducts(query, pageable);

        // THEN
        assertNotNull(result);
        assertEquals(2, result.getTotalElements());
        assertEquals(2, result.getContent().size());

        ProductDTO dto1 = result.getContent().get(0);
        assertEquals(1L, dto1.getId());
        assertEquals("Hallucinating Love - Maribou State", dto1.getTitle());
        assertEquals(new BigDecimal("20.00"), dto1.getPrice());
        assertEquals("AVAILABLE", dto1.getStatus());
        assertEquals("TRES_BON_ETAT", dto1.getState());
        assertEquals("T33", dto1.getFormat());

        ProductDTO dto2 = result.getContent().get(1);
        assertEquals(2L, dto2.getId());
        assertEquals("Another Album", dto2.getTitle());
        assertEquals(new BigDecimal("25.00"), dto2.getPrice());
        assertEquals("AVAILABLE", dto2.getStatus());
        assertEquals("BON_ETAT", dto2.getState());
        assertEquals("T45", dto2.getFormat());

        verify(productRepository, times(1)).searchByAlbumOrArtist(query, pageable);
        verifyNoMoreInteractions(productRepository);
    }

    @Test
    public void getProductsByCategory_shouldReturnPagedProductDTOs() {
        // GIVEN
        Long categoryId = 1L;
        Pageable pageable = PageRequest.of(0, 12);

        Product product1 = new Product();
        product1.setId(1L);
        product1.setTitle("Album One");
        product1.setStatus(ProductStatus.AVAILABLE);
        product1.setState(ProductState.TRES_BON_ETAT);
        product1.setFormat(ProductFormat.T33);

        Product product2 = new Product();
        product2.setId(2L);
        product2.setTitle("Album Two");
        product2.setStatus(ProductStatus.AVAILABLE);
        product2.setState(ProductState.BON_ETAT);
        product2.setFormat(ProductFormat.T45);

        Page<Product> pageResult = new PageImpl<>(List.of(product1, product2), pageable, 2);

        when(productRepository.findByCategoryId(categoryId, pageable)).thenReturn(pageResult);

        // WHEN
        Page<ProductDTO> result = productService.getProductsByCategory(categoryId, pageable);

        // THEN
        assertNotNull(result);
        assertEquals(2, result.getTotalElements());
        assertEquals(2, result.getContent().size());

        ProductDTO dto1 = result.getContent().get(0);
        assertEquals(1L, dto1.getId());
        assertEquals("Album One", dto1.getTitle());
        assertEquals("AVAILABLE", dto1.getStatus());
        assertEquals("TRES_BON_ETAT", dto1.getState());
        assertEquals("T33", dto1.getFormat()); // puisque ton DTO format est String

        verify(productRepository, times(1)).findByCategoryId(categoryId, pageable);
    }

    @Test
    public void getProductsByPrice_shouldReturnPagedProductDTOs() {
        // GIVEN
        BigDecimal price = new BigDecimal("19.99");
        Pageable pageable = PageRequest.of(0, 12);

        Product product3 = new Product();
        product3.setId(1L);
        product3.setTitle("Album One");
        product3.setPrice(new BigDecimal("19.99"));
        product3.setStatus(ProductStatus.AVAILABLE);
        product3.setState(ProductState.TRES_BON_ETAT);
        product3.setFormat(ProductFormat.T33);

        Product product4 = new Product();
        product4.setId(2L);
        product4.setTitle("Album Two");
        product4.setPrice(new BigDecimal("19.99"));
        product4.setStatus(ProductStatus.AVAILABLE);
        product4.setState(ProductState.BON_ETAT);
        product4.setFormat(ProductFormat.T45);

        Page<Product> pageResult = new PageImpl<>(List.of(product3, product4), pageable, 2);

        when(productRepository.findByPrice(price, pageable)).thenReturn(pageResult);

        // WHEN
        Page<ProductDTO> result = productService.getProductsByPrice(price, pageable);

        // THEN
        assertNotNull(result);
        assertEquals(2, result.getTotalElements());
        assertEquals(2, result.getContent().size());

        ProductDTO dto1 = result.getContent().get(0);
        assertEquals(1L, dto1.getId());
        assertEquals("Album One", dto1.getTitle());
        assertEquals(new BigDecimal("19.99"), dto1.getPrice());
        assertEquals("AVAILABLE", dto1.getStatus());
        assertEquals("TRES_BON_ETAT", dto1.getState());
        assertEquals("T33", dto1.getFormat()); // puisque ton DTO format est String

        verify(productRepository, times(1)).findByPrice(price, pageable);
    }

    @Test
    public void getProductsByFormat_shouldReturnPagedProductDTOs() {
        // GIVEN
        ProductFormat format = ProductFormat.T45;
        Pageable pageable = PageRequest.of(0, 12);

        Product product3 = new Product();
        product3.setId(1L);
        product3.setTitle("Album One");
        product3.setStatus(ProductStatus.AVAILABLE);
        product3.setState(ProductState.TRES_BON_ETAT);
        product3.setFormat(ProductFormat.T45);

        Product product4 = new Product();
        product4.setId(2L);
        product4.setTitle("Album Two");
        product4.setStatus(ProductStatus.AVAILABLE);
        product4.setState(ProductState.BON_ETAT);
        product4.setFormat(ProductFormat.T45);
        
        Page<Product> pageResult = new PageImpl<>(List.of(product3, product4), pageable, 2);

        when(productRepository.findByFormat(format, pageable)).thenReturn(pageResult);

        // WHEN
        Page<ProductDTO> result = productService.getProductsByFormat(format, pageable);

        // THEN
        assertNotNull(result);
        assertEquals(2, result.getTotalElements());
        assertEquals(2, result.getContent().size());

        ProductDTO dto1 = result.getContent().get(0);
        assertEquals(1L, dto1.getId());
        assertEquals("Album One", dto1.getTitle());
        assertEquals("AVAILABLE", dto1.getStatus());
        assertEquals("TRES_BON_ETAT", dto1.getState());
        assertEquals("T45", dto1.getFormat()); // puisque ton DTO format est String

        verify(productRepository, times(1)).findByFormat(format, pageable);
    } 

    @Test
    public void getProductsByState_shouldReturnPagedProductDTOs() {
        // GIVEN
        ProductState state = ProductState.BON_ETAT;
        Pageable pageable = PageRequest.of(0, 12);

        Product product3 = new Product();
        product3.setId(1L);
        product3.setTitle("Album One");
        product3.setStatus(ProductStatus.AVAILABLE);
        product3.setState(ProductState.BON_ETAT);
        product3.setFormat(ProductFormat.T45);

        Product product4 = new Product();
        product4.setId(2L);
        product4.setTitle("Album Two");
        product4.setStatus(ProductStatus.AVAILABLE);
        product4.setState(ProductState.BON_ETAT);
        product4.setFormat(ProductFormat.T33);
        
        Page<Product> pageResult = new PageImpl<>(List.of(product3, product4), pageable, 2);

        when(productRepository.findByState(state, pageable)).thenReturn(pageResult);

        // WHEN
        Page<ProductDTO> result = productService.getProductsByState(state, pageable);

        // THEN
        assertNotNull(result);
        assertEquals(2, result.getTotalElements());
        assertEquals(2, result.getContent().size());

        ProductDTO dto1 = result.getContent().get(0);
        assertEquals(1L, dto1.getId());
        assertEquals("Album One", dto1.getTitle());
        assertEquals("AVAILABLE", dto1.getStatus());
        assertEquals("BON_ETAT", dto1.getState());
        assertEquals("T45", dto1.getFormat()); // puisque ton DTO format est String

        verify(productRepository, times(1)).findByState(state, pageable);
    } 
}