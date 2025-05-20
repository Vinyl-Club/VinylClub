package com.vinylclub.catalog.service;

import java.io.IOException;
import java.sql.Blob;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.vinylclub.catalog.entity.Images;
import com.vinylclub.catalog.entity.Product;
import com.vinylclub.catalog.repository.ImagesRepository;
import com.vinylclub.catalog.repository.ProductRepository;

@Service
public class ImagesService {

    @Autowired
    private ImagesRepository imagesRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private DataSource dataSource;

    public List<Images> getAllImages() {
        return imagesRepository.findAll();
    }

    public Optional<Images> getImageById(Long id) {
        return imagesRepository.findById(id);
    }

    public Images createImage(Images image) {
        return imagesRepository.save(image);
    }

    public List<Images> createImages(List<Images> images) {
        return imagesRepository.saveAll(images);
    }

    @Transactional
    public Images updateImage(Long id, Images imageDetails) {
        Images existingImage = imagesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Image not found with id: " + id));

        if (imageDetails.getImage() != null) {
            existingImage.setImage(imageDetails.getImage());
        }
        if (imageDetails.getProduct() != null) {
            existingImage.setProduct(imageDetails.getProduct());
        }

        return imagesRepository.save(existingImage);
    }

    public void deleteImage(Long id) {
        imagesRepository.deleteById(id);
    }

    public List<Images> findByProductId(Long productId) {
        return imagesRepository.findByProduct_Id(productId);
    }

    public boolean existsByProductId(Long productId) {
        return imagesRepository.existsByProduct_Id(productId);
    }

@Transactional
public Images storeImage(MultipartFile file, Long productId) throws IOException {
    try {
        System.out.println("Démarrage de l'upload d'image pour le produit ID: " + productId);
        
        // Vérifiez que le produit existe
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
        
        // Obtenez les données binaires du fichier
        byte[] imageData = file.getBytes();
        System.out.println("Image convertie en bytes: " + imageData.length + " octets");
        
        // Utilisez la méthode d'insertion directe
        System.out.println("Tentative d'insertion directe...");
        imagesRepository.insertImageDirectly(imageData, productId);
        System.out.println("Insertion réussie");
        
        // Créez un objet retour SANS les données binaires
        Images image = new Images();
        image.setProduct(product);
        // Ne pas définir l'image binaire pour éviter les problèmes de sérialisation
        // image.setImage(imageData);
        
        return image;
    } catch (Exception e) {
        System.err.println("Erreur dans storeImage: " + e.getMessage());
        if (e.getCause() != null) {
            System.err.println("Cause: " + e.getCause().getMessage());
        }
        e.printStackTrace();
        throw e;
    }
}

    @Transactional
    public List<Images> storeMultipleImages(MultipartFile[] files, Long productId) throws IOException, SQLException {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        List<Images> savedImages = new ArrayList<>();

        for (MultipartFile file : files) {
            // Créer un Blob pour chaque fichier
            Blob imageBlob = createBlob(file.getBytes());

            // Créer une nouvelle image
            Images image = new Images();
            image.setProduct(product);
            image.setImage(getBlobAsBytes(imageBlob));

            savedImages.add(imagesRepository.save(image));
        }

        return savedImages;
    }

    private Blob createBlob(byte[] bytes) throws SQLException {
        Connection conn = null;
        try {
            conn = dataSource.getConnection();
            Blob blob = conn.createBlob();
            blob.setBytes(1, bytes);
            return blob;
        } finally {
            if (conn != null && !conn.isClosed()) {
                conn.close();
            }
        }
    }

    // Méthode pour convertir un Blob en byte[] pour l'affichage
    public byte[] getBlobAsBytes(Blob blob) throws SQLException, IOException {
        if (blob == null) {
            return new byte[0];
        }
        
        int blobLength = (int) blob.length();
        return blob.getBytes(1, blobLength);
    }
}