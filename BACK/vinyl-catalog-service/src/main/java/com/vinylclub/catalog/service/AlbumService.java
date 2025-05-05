package com.vinylclub.catalog.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.vinylclub.catalog.entity.Album;

public interface AlbumService {
    List<Album> getAllAlbums();
    Optional<Album> getAlbumById(Long id);
    List<Album> createAlbums(ArrayList<Album> albums);
    Album updateAlbum(Long id, Album albumDetails);
    void deleteAlbum(Long id);
}