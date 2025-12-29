package com.vinylclub.ad.service;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import feign.RetryableException;

import com.vinylclub.ad.client.ProductClient;
import com.vinylclub.ad.client.UserClient;
import com.vinylclub.ad.dto.CreateAdRequestDTO;
import com.vinylclub.ad.dto.AdDTO;
import com.vinylclub.ad.client.dto.ProductCreatedDTO;
import com.vinylclub.ad.client.dto.ProductSummaryDTO;
import com.vinylclub.ad.client.dto.UserSummaryDTO;
import com.vinylclub.ad.dto.AdDetailsDTO;
import com.vinylclub.ad.dto.AdListDTO;
import com.vinylclub.ad.entity.Ad;
import com.vinylclub.ad.repository.AdRepository;
import com.vinylclub.ad.exception.ResourceNotFoundException;
import com.vinylclub.ad.exception.ExternalServiceException;

import feign.FeignException;

@Service
@Transactional
public class AdService {

    @Autowired
    private AdRepository adRepository;

    @Autowired
    private ProductClient productClient;

    @Autowired
    private UserClient userClient;

    public AdService(UserClient userClient, ProductClient productClient) {
        this.userClient = userClient;
        this.productClient = productClient;
    }

    // Retrieve all ads with pagination
    public Page<AdListDTO> getAllAds(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Ad> adsPage = adRepository.findAll(pageable);

        if (adsPage.isEmpty()) {
            throw new RuntimeException("Aucune annonce disponible.");
        }

        return adsPage.map(ad -> {
            ProductSummaryDTO product = productClient.getProductById(ad.getProductId());
            UserSummaryDTO user = userClient.getUserById(ad.getUserId());

            String title = product.getTitle();
            String artistName = (product.getArtist() != null) ? product.getArtist().getName() : null;
            String categoryName = (product.getCategory() != null) ? product.getCategory().getName() : null;
            BigDecimal price = product.getPrice();

            String city = null;
            if (user.getAddress() != null) {
                city = user.getAddress().getCity();
            }

            String imageUrl = null;
            if (product.getImages() != null && !product.getImages().isEmpty()) {
                imageUrl = "/api/images/" + product.getImages().get(0).getId();
            }

            return new AdListDTO(
                    ad.getId(),
                    title,
                    artistName,
                    categoryName,
                    price,
                    city,
                    imageUrl
            );
        });
    }

    // Retrieve an ad by its id (details)
    public AdDetailsDTO getAdById(Long id) {
        Ad ad = adRepository.findAdById(id)
                .orElseThrow(() -> new RuntimeException("Annonce non trouvée."));

        ProductSummaryDTO product = productClient.getProductById(ad.getProductId());
        UserSummaryDTO user = userClient.getUserById(ad.getUserId());

        AdDetailsDTO dto = new AdDetailsDTO();
        dto.setId(ad.getId());
        dto.setUser(user);
        dto.setProduct(product);

        return dto;
    }

    //vérifier que le user existe
    public void verifyUserExists(Long userId) {
        try {
            UserSummaryDTO user = userClient.getUserById(userId);

            if(user == null || user.getId() == null){
                throw new ExternalServiceException("Le service utilisateur renvoit une réponse invalide");
            }
        } catch (FeignException.NotFound e) {
            throw new ResourceNotFoundException("L'utilisateur n'a pas été trouvé: " + userId);
        } catch (FeignException e) {
            throw new ExternalServiceException("Le service utilisateur est indisponible ou à échoué: " + e.getMessage(), e);
        }
    }

    //Création d'une annonce
        public AdDTO createdAdd(CreateAdRequestDTO request) {
        if (request == null) throw new IllegalArgumentException("Il manque le body");
        if (request.getUserId() == null) throw new IllegalArgumentException("Il manque l'id utilisateur");
        if (request.getProduct() == null) throw new IllegalArgumentException("Il manque le produit");

        // 1) vérifier user
        verifyUserExists(request.getUserId());

        // 2) créer produit (catalog)
        ProductCreatedDTO created;
        try {
            created = productClient.createProduct(request.getProduct());

        } catch (RetryableException e) {
            throw new ExternalServiceException("Service Catalog introuvable (timeout/réseau)", e);

        } catch (FeignException e) {
            throw new ExternalServiceException("Erreur du service Catalog (status " + e.status() + ")", e);
        }

        if (created == null || created.getId() == null) {
            throw new ExternalServiceException("Le service Catalog retourne un productId null");
        }

        Long productId = created.getId();

        // 3) sauvegarder ad (table ads: id, userId, productId)
        Ad ad = new Ad();
        ad.setUserId(request.getUserId());
        ad.setProductId(productId); // ✅ important

        Ad saved = adRepository.save(ad);

        // 4) réponse (on réutilise ton AdDTO)
        return new AdDTO(saved.getId(), productId, request.getUserId());
    }
}
