package com.vinylclub.catalog.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vinylclub.catalog.entity.Album;

@Repository
public interface AlbumRepository extends JpaRepository<Album, Long> {
    Album findByName(String name);
    boolean existsByName(String name);
    Album findById(long id);
}

