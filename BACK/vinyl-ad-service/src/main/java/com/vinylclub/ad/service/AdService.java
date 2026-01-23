package com.vinylclub.ad.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.function.Supplier;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vinylclub.ad.client.ProductClient;
import com.vinylclub.ad.client.UserClient;
import com.vinylclub.ad.client.dto.AddressAdDTO;
import com.vinylclub.ad.client.dto.ProductCreatedDTO;
import com.vinylclub.ad.client.dto.ProductSummaryDTO;
import com.vinylclub.ad.client.dto.UserSummaryDTO;
import com.vinylclub.ad.dto.AdDTO;
import com.vinylclub.ad.dto.AdDetailsDTO;
import com.vinylclub.ad.dto.AdListDTO;
import com.vinylclub.ad.dto.CreateAdRequestDTO;
import com.vinylclub.ad.client.request.CreateProductRequestDTO;

import com.vinylclub.ad.entity.Ad;
import com.vinylclub.ad.exception.ExternalServiceException;
import com.vinylclub.ad.exception.ResourceNotFoundException;
import com.vinylclub.ad.repository.AdRepository;

import feign.FeignException;
import feign.RetryableException;

@Service
@Transactional
public class AdService {

    private final AdRepository adRepository;
    private final ProductClient productClient;
    private final UserClient userClient;

    // Constructeur (sans Lombok) : injection propre et testable
    public AdService(AdRepository adRepository, UserClient userClient, ProductClient productClient) {
        this.adRepository = adRepository;
        this.userClient = userClient;
        this.productClient = productClient;
    }

    // --- Helpers simples pour centraliser la gestion d'erreurs Feign ---

    private <T> T callExternal(String serviceName, Supplier<T> call) {
        try {
            return call.get();

        } catch (FeignException.NotFound e) {
            throw new ResourceNotFoundException(serviceName + " : ressource introuvable");

        } catch (RetryableException e) {
            throw new ExternalServiceException(serviceName + " indisponible (timeout/réseau)", e);

        } catch (FeignException e) {
            throw new ExternalServiceException(serviceName + " erreur (status " + e.status() + ")", e);
        }
    }

    private <T> T callExternalOrNull(Supplier<T> call) {
        try {
            return call.get();
        } catch (Exception e) {
            return null; // mode tolérant
        }
    }

    // Retrieve all ads with pagination
    public Page<AdListDTO> getAllAds(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Ad> adsPage = adRepository.findAll(pageable);

        // Une liste vide n'est pas une erreur -> on renvoie une page vide
        if (adsPage.isEmpty()) {
            return Page.empty(pageable);
        }

        return adsPage.map(ad -> {

            // Home = tolérant : si un microservice est indisponible, on dégrade la card
            ProductSummaryDTO product = callExternalOrNull(
                    () -> productClient.getProductById(ad.getProductId()));

            // Ici on n'utilise pas vraiment "user" pour la home, mais on garde la logique
            // si besoin plus tard
            UserSummaryDTO user = callExternalOrNull(
                    () -> userClient.getUserById(ad.getUserId()));

            String title = (product != null) ? product.getTitle() : "[Produit indisponible]";
            String artistName = (product != null && product.getArtist() != null) ? product.getArtist().getName() : null;
            String categoryName = (product != null && product.getCategory() != null) ? product.getCategory().getName()
                    : null;
            BigDecimal price = (product != null) ? product.getPrice() : null;

            String city = null;
            List<AddressAdDTO> addresses = callExternalOrNull(
                    () -> userClient.getAddressesByUserId(ad.getUserId()));
            if (addresses != null && !addresses.isEmpty()) {
                city = addresses.get(0).getCity();
            }

            String imageUrl = null;
            if (product != null && product.getImages() != null && !product.getImages().isEmpty()) {
                imageUrl = "/api/images/" + product.getImages().get(0).getId();
            }

            return new AdListDTO(
                    ad.getId(),
                    title,
                    artistName,
                    categoryName,
                    price,
                    city,
                    imageUrl);
        });
    }

    // Retrieve an ad by its id (details)
    public AdDetailsDTO getAdById(Long id) {
        Ad ad = adRepository.findAdById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Annonce non trouvée: " + id));

        // Détails = strict : si user/catalog sont indisponibles -> 503
        ProductSummaryDTO product = callExternal("catalog-service",
                () -> productClient.getProductById(ad.getProductId()));

        UserSummaryDTO user = callExternal("user-service",
                () -> userClient.getUserById(ad.getUserId()));

        // Adresse = tolérant : si ça échoue, la ville reste null mais la page détails
        // peut s'afficher
        List<AddressAdDTO> addresses = callExternalOrNull(
                () -> userClient.getAddressesByUserId(ad.getUserId()));
        if (addresses != null && !addresses.isEmpty()) {
            // on met la première adresse dans user.address
            user.setAddress(addresses.get(0));
        }

        AdDetailsDTO dto = new AdDetailsDTO();
        dto.setId(ad.getId());
        dto.setUser(user);
        dto.setProduct(product);

        return dto;
    }

    // check that the user exists
    // public void verifyUserExists(Long userId) {
    //     UserSummaryDTO user = callExternal("user-service",
    //             () -> userClient.getUserById(userId));

    //     if (user == null || user.getId() == null) {
    //         throw new ExternalServiceException("Le service utilisateur renvoit une réponse invalide");
    //     }
    // }

    // Creating an ad
    public AdDTO createdAdd(Long userId, CreateAdRequestDTO request) {
        if (request == null)
            throw new IllegalArgumentException("Il manque le body");
        if (userId == null)
            throw new IllegalArgumentException("Il manque l'id utilisateur");
        if (request.getProduct() == null)
            throw new IllegalArgumentException("Il manque le produit");

        // 1) check user
        // verifyUserExists(request.getUserId());

        // 2) create product (catalog)
        ProductCreatedDTO created = callExternal("catalog-service",
                () -> productClient.createProduct(request.getProduct()));

        if (created == null || created.getId() == null) {
            throw new ExternalServiceException("Le service Catalog retourne un productId null");
        }

        Long productId = created.getId();

        // 3) sauvegarder ad (table ads: id, userId, productId)
        Ad ad = new Ad();
        ad.setUserId(userId);
        ad.setProductId(productId);

        Ad saved = adRepository.save(ad);

        // 4) answer (we reuse your AdDTO)
        return new AdDTO(saved.getId(), productId, request.getUserId());
    }

    // Update the product of an ad
    public AdDetailsDTO updateAdProduct(Long adId, CreateProductRequestDTO productUpdate) {

        if (adId == null)
            throw new IllegalArgumentException("Il manque l'id de l'annonce");
        if (productUpdate == null)
            throw new IllegalArgumentException("Il manque le produit");

        // 1) récupérer l'annonce
        Ad ad = adRepository.findAdById(adId)
                .orElseThrow(() -> new ResourceNotFoundException("Annonce non trouvée: " + adId));

        // 2) update produit dans catalog avec productId
        ProductSummaryDTO updatedProduct = callExternal("catalog-service",
                () -> productClient.updateProduct(ad.getProductId(), productUpdate));

        // 3) récupérer user (détails)
        UserSummaryDTO user = callExternal("user-service",
                () -> userClient.getUserById(ad.getUserId()));

        // 4) récupérer l'adresse (tolérant)
        List<AddressAdDTO> addresses = callExternalOrNull(
                () -> userClient.getAddressesByUserId(ad.getUserId()));
        if (addresses != null && !addresses.isEmpty()) {
            user.setAddress(addresses.get(0));
        }

        // 5) réponse détails
        AdDetailsDTO dto = new AdDetailsDTO();
        dto.setId(ad.getId());
        dto.setUser(user);
        dto.setProduct(updatedProduct);

        return dto;
    }

    // Delete an ad by its id
    public void deleteAdById(Long id) {
        if (id == null)
            throw new IllegalArgumentException("Il manque l'id de l'annonce");

        Ad ad = adRepository.findAdById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Annonce non trouvée: " + id));

        callExternal("catalog-service", () -> productClient.deleteProduct(ad.getProductId()));

        adRepository.delete(ad);
    }

}
