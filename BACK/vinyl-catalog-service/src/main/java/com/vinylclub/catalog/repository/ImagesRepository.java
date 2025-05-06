package com.vinylclub.catalog.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vinylclub.catalog.entity.Images;

@Repository
public interface ImagesRepository extends JpaRepository<Images, Long> {
    // Utilisez le chemin complet vers l'ID du produit
    List<Images> findByProduct_Id(Long productId);
    
    // Modifiez cette méthode aussi
    boolean existsByProduct_Id(Long productId);
}