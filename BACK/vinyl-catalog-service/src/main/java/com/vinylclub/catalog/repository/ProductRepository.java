package com.vinylclub.catalog.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.vinylclub.catalog.entity.Product;
import com.vinylclub.catalog.entity.ProductStatus;
import com.vinylclub.catalog.entity.ProductFormat;



@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Research by title or artist (for the search bar)

    @Query("""
    SELECT p
    FROM Product p
    JOIN p.album al
    JOIN p.artist a
    WHERE LOWER(al.name) LIKE LOWER(CONCAT('%', :query, '%'))
       OR LOWER(a.name)  LIKE LOWER(CONCAT('%', :query, '%'))
    """)
    Page<Product> searchByAlbumOrArtist(@Param("query") String query, Pageable pageable);

    // Category filtering
    @Query("SELECT p FROM Product p WHERE p.category.id = :categoryId")
    Page<Product> findByCategoryId(@Param("categoryId") Long categoryId, Pageable pageable);

    // Filtering by artistS
    @Query("SELECT p FROM Product p WHERE p.artist.id = :artistId")
    Page<Product> findByArtistId(@Param("artistId") Long artistId, Pageable pageable);

    // Filtering by albums
    @Query("SELECT p FROM Product p WHERE p.album.id = :albumId")
    Page<Product> findByAlbumId(@Param("albumId") Long albumId, Pageable pageable);

    // Products available only
    Page<Product> findByStatus(ProductStatus status, Pageable pageable);

    // Recent products (for home page)
    @Query("SELECT p FROM Product p WHERE p.status = 'AVAILABLE' ORDER BY p.createdAt DESC")
    List<Product> findRecentProducts(Pageable pageable);

    // Products by genre/category (for recommendations)
    @Query("SELECT p FROM Product p WHERE p.category.name = :categoryName AND p.status = 'AVAILABLE'")
    List<Product> findByCategoryName(@Param("categoryName") String categoryName, Pageable pageable);

    // filter by format
    Page<Product> findByFormat(ProductFormat format, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.price = :price ORDER BY p.price ASC")
    Page<Product> findByPrice(@Param("price") BigDecimal price, Pageable pageable);

}