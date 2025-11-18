package com.vinylclub.catalog.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vinylclub.catalog.entity.Album;

@Repository
public interface AlbumRepository extends JpaRepository<Album, Long> {
    
    Optional<Album> findByNameIgnoreCase(String name);
}