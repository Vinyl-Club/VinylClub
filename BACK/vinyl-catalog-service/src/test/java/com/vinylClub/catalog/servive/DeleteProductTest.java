package com.vinylclub.catalog.service;

import com.vinylclub.catalog.entity.Product;
import com.vinylclub.catalog.entity.Album;
import com.vinylclub.catalog.entity.Artist;
import com.vinylclub.catalog.entity.Category;
import com.vinylclub.catalog.entity.ProductState;
import com.vinylclub.catalog.entity.ProductStatus;
import com.vinylclub.catalog.entity.ProductFormat;

import com.vinylclub.catalog.dto.ProductDTO;
import com.vinylclub.catalog.dto.AlbumDTO;
import com.vinylclub.catalog.dto.ArtistDTO;
import com.vinylclub.catalog.dto.CategoryDTO;
import com.vinylclub.catalog.dto.ImageDTO;
import com.vinylclub.catalog.dto.ImageSummaryDTO;

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

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;
import java.math.BigDecimal;

@ExtendWith(MockitoExtension.class)
public class DeleteProductTest {

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
    public void deleteProduct_ShouldDeleteProduct_whenProductExists() {
        Long id = 1L;

        Product product = new Product();
        product.setId(id);
        product.setTitle("Album to be deleted");
        product.setDescription("Album to be deleted description");
        product.setPrice(new BigDecimal("25.99"));
        product.setStatus(ProductStatus.AVAILABLE);
        product.setState(ProductState.TRES_BON_ETAT);
        product.setFormat(ProductFormat.T33);

        when(productRepository.findById(id)).thenReturn(Optional.of(product));

        productService.deleteProduct(id);

        verify(productRepository, times(1)).findById(id);
        verify(productRepository, times(1)).deleteById(id);
    }

    @Test
    public void deleteProduct_ShouldDeleteProduct_whenProductNotFound() {
        Long id = 2L;

        when(productRepository.findById(id)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            productService.deleteProduct(id);
        });

        assertEquals("Product not found with id: " + id, exception.getMessage());

        verify(productRepository, times(1)).findById(id);
        verify(productRepository, times(0)).deleteById(id);
    }
}
