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

    //tester getAllProducts et getProductById
    @Test
    public void getAllProducts_shouldReturnPagedProductDTOs() {
        Product product1 = new Product();
        product1.setId(1l);
        product1.setTitle("Album One");
        product1.setDescription("First album description");
        product1.setPrice(new BigDecimal("19.99"));
        product1.setStatus(ProductStatus.AVAILABLE);
        product1.setState(ProductState.NEW);
        product1.setFormat(ProductFormat.T33);
        product1.setArtist(new Artist());
        product1.setCategory(new Category());
        product1.setAlbum(new Album());
        
    

        Product product2 = new Product();
        product2.setId(2l);
        product2.setTitle("Album Two");
        product2.setDescription("Second album description");
        product2.setPrice(new BigDecimal("24.99"));
        product2.setStatus(ProductStatus.AVAILABLE);
        product2.setState(ProductState.NEW);
        product2.setFormat(ProductFormat.T45);
        product2.setArtist(new Artist());
        product2.setCategory(new Category());
        product2.setAlbum(new Album());
        
    }
    //tester create/update/delete si existant
    //tester les filtres/recherches
}
