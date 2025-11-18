package com.vinylclub.catalog.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.vinylclub.catalog.entity.Artist;

@Repository
public interface ArtistRepository extends JpaRepository<Artist, Long> {
    
    Optional<Artist> findByNameIgnoreCase(String name);
    
    @Query("SELECT a FROM Artist a WHERE LOWER(a.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Artist> searchByName(@Param("query") String query);
}