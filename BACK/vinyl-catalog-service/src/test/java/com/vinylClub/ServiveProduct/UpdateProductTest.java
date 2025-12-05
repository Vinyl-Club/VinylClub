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
public class UpdateProductTest {
    
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

    @Test
    public void updateProduct_shouldReturnUpdatedProductDTO_whenProductExists() {
        Product existingProduct = new Product();
        existingProduct.setId(1L);
        existingProduct.setTitle("Old Album");
        existingProduct.setDescription("Old album description");
        existingProduct.setPrice(new BigDecimal("39.99"));
        existingProduct.setStatus(ProductStatus.OUT_OF_STOCK);
        existingProduct.setState(ProductState.BON_ETAT);
        existingProduct.setFormat(ProductFormat.T45);

        ProductDTO updateDTO = new ProductDTO();
        updateDTO.setTitle("Update Album");
        updateDTO.setDescription("Update album description");
        updateDTO.setPrice(new BigDecimal("40.99"));
        updateDTO.setStatus("AVAILABLE");
        updateDTO.setState("TRES_BON_ETAT");
        updateDTO.setFormat("T33");
        
        when(productRepository.findById(1L)).thenReturn(Optional.of(existingProduct));
        when(productRepository.save(any(Product.class)))
            .thenAnswer(invocation -> invocation.getArgument(0));

        ProductDTO result = productService.updateProduct(1L, updateDTO);
        assertEquals(1L, result.getId());
        assertEquals("Update Album", result.getTitle());
        assertEquals("Update album description", result.getDescription());
        assertEquals(new BigDecimal("40.99"), result.getPrice());
        assertEquals("AVAILABLE", result.getStatus());
        assertEquals("TRES_BON_ETAT", result.getState());
        assertEquals("T33", result.getFormat());

        verify(productRepository).findById(1L);
        verify(productRepository).save(any(Product.class));
    }
}
