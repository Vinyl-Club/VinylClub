package com.vinylclub.catalog.repository;

import com.vinylclub.catalog.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Méthode renommée pour correspondre au champ title
    Product findByTitle(String title);
    
    // Méthodes additionnelles utiles
    List<Product> findByTitleContainingIgnoreCase(String titlePart);
    List<Product> findByUserId(Long userId);
    List<Product> findByCategoryId(Long categoryId);
    List<Product> findByArtistId(Long artistId);
    List<Product> findByPriceBetween(Double minPrice, Double maxPrice);
}