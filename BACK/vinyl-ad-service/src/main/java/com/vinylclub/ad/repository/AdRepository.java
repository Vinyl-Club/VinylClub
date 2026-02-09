package com.vinylclub.ad.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vinylclub.ad.entity.Ad;

@Repository
public interface AdRepository extends JpaRepository<Ad, Long> {
    
    // search all products with pagination
    // Page<Ad> findAll(Pageable pageable);

    // search for a product by its id
    Optional<Ad> findAdById(@Param("id") Long id);
}
