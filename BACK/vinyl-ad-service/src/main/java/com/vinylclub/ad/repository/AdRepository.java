package com.vinylclub.ad.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vinylclub.ad.entity.Ad;

@Repository
public interface AdRepository extends JpaRepository<Ad, Long> {
    
    // rechercher tous les produits avec pagination
    Page<Ad>> findAllAds(Pageable pageable);

    // rechercher un produit par son id
    Optional<Ad> findAdById(@Param("id") Long id);
}
