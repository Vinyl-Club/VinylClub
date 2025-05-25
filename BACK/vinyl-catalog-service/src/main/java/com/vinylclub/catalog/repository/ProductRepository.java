package com.vinylclub.catalog.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.vinylclub.catalog.entity.Product;
import com.vinylclub.catalog.entity.ProductStatus;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Recherche par titre ou artiste (pour la barre de recherche)
    @Query("SELECT p FROM Product p JOIN p.artist a WHERE " +
           "LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(a.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Product> searchByTitleOrArtist(@Param("query") String query, Pageable pageable);
    
    // Filtrage par catégorie
    @Query("SELECT p FROM Product p WHERE p.category.id = :categoryId")
    Page<Product> findByCategoryId(@Param("categoryId") Long categoryId, Pageable pageable);
    
    // Filtrage par artiste
    @Query("SELECT p FROM Product p WHERE p.artist.id = :artistId")
    Page<Product> findByArtistId(@Param("artistId") Long artistId, Pageable pageable);
    
    // Produits disponibles seulement
    Page<Product> findByStatus(ProductStatus status, Pageable pageable);
    
    // Produits avec stock > 0
    @Query("SELECT p FROM Product p WHERE p.quantity > 0")
    Page<Product> findAvailableProducts(Pageable pageable);
    
    // Produits récents (pour page d'accueil)
    @Query("SELECT p FROM Product p WHERE p.status = 'AVAILABLE' ORDER BY p.createdAt DESC")
    List<Product> findRecentProducts(Pageable pageable);
    
    // Produits par genre/catégorie (pour recommendations)
    @Query("SELECT p FROM Product p WHERE p.category.name = :categoryName AND p.status = 'AVAILABLE'")
    List<Product> findByCategoryName(@Param("categoryName") String categoryName, Pageable pageable);
}