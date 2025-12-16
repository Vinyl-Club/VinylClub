package com.vinylclub.catalog.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.vinylclub.catalog.entity.Album;

@Repository
public interface AlbumRepository extends JpaRepository<Album, Long> {
    
    Optional<Album> findByNameIgnoreCase(String name);

    @Query("SELECT al FROM Album al WHERE LOWER(al.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Album> searchByName(@Param("query") String query);
}