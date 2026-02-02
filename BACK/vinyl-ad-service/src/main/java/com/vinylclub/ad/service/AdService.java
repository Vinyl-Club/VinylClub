package com.vinylclub.ad.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

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
import com.vinylclub.ad.client.request.CreateProductRequestDTO;
import com.vinylclub.ad.dto.AdDTO;
import com.vinylclub.ad.dto.AdDetailsDTO;
import com.vinylclub.ad.dto.AdListDTO;
import com.vinylclub.ad.dto.CreateAdRequestDTO;
import com.vinylclub.ad.entity.Ad;
import com.vinylclub.ad.exception.ExternalServiceException;
import com.vinylclub.ad.exception.ForbiddenException;
import com.vinylclub.ad.exception.ResourceNotFoundException;
import com.vinylclub.ad.repository.AdRepository;
import com.vinylclub.ad.support.ExternalCallHelper;

@Service
@Transactional
public class AdService {

    private final AdRepository adRepository;
    private final ProductClient productClient;
    private final UserClient userClient;
    private final ExternalCallHelper external;

    public AdService(
            AdRepository adRepository,
            UserClient userClient,
            ProductClient productClient,
            ExternalCallHelper external
    ) {
        this.adRepository = adRepository;
        this.userClient = userClient;
        this.productClient = productClient;
        this.external = external;
    }

    /**
     * Retrieve all ads with pagination
     * @param page
     * @param size
     * @return
     */
    public Page<AdListDTO> getAllAds(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Ad> adsPage = adRepository.findAll(pageable);

        if (adsPage.isEmpty()) {
            return Page.empty(pageable);
        }

        return adsPage.map(ad -> {

            // Home = tolerant
            ProductSummaryDTO product = external.callExternalOrNull(
                    () -> productClient.getProductById(ad.getProductId()));

            UserSummaryDTO user = external.callExternalOrNull(
                    () -> userClient.getUserById(ad.getUserId()));

            String title = (product != null) ? product.getTitle() : "[Produit indisponible]";
            String artistName = (product != null && product.getArtist() != null) ? product.getArtist().getName() : null;
            String categoryName = (product != null && product.getCategory() != null) ? product.getCategory().getName() : null;
            BigDecimal price = (product != null) ? product.getPrice() : null;

            String city = external.callExternalOrNull(() -> userClient.getMainCityByUserId(ad.getUserId()));

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
                    imageUrl
            );
        });
    }

    /**
     * Retrieve an ad by its id (details)
     * @param id
     * @return
     */
    public AdDetailsDTO getAdById(Long id) {
        Ad ad = adRepository.findAdById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Annonce non trouvée: " + id));

        // Details = strict
        ProductSummaryDTO product = external.callExternal("catalog-service",
                () -> productClient.getProductById(ad.getProductId()));

        UserSummaryDTO user = external.callExternal("user-service",
                () -> userClient.getUserById(ad.getUserId()));

        // Address = tolerant
        String city = external.callExternalOrNull(() -> userClient.getMainCityByUserId(ad.getUserId()));
        if (city != null) {
            AddressAdDTO addr = new AddressAdDTO();
            addr.setCity(city);
            user.setAddress(addr);
        }

        AdDetailsDTO dto = new AdDetailsDTO();
        dto.setId(ad.getId());
        dto.setUser(user);
        dto.setProduct(product);

        return dto;
    }

    /**
     * Create ad (for an authenticated user)
     * @param userId
     * @param request
     * @return
     */
    public AdDTO createdAd(Long userId, CreateAdRequestDTO request) {
        if (request == null)
            throw new IllegalArgumentException("Il manque le body");
        if (userId == null)
            throw new IllegalArgumentException("Il manque l'id utilisateur");
        if (request.getProduct() == null)
            throw new IllegalArgumentException("Il manque le produit");

        ProductCreatedDTO created = external.callExternal("catalog-service",
                () -> productClient.createProduct(request.getProduct()));

        if (created == null || created.getId() == null) {
            throw new ExternalServiceException("Le service Catalog retourne un productId null");
        }

        Long productId = created.getId();

        Ad ad = new Ad();
        ad.setUserId(userId);
        ad.setProductId(productId);

        Ad saved = adRepository.save(ad);

        return new AdDTO(saved.getId(), productId, userId);
    }

    /**
     * Update ad (for an authenticated user)
     * @param userId
     * @param adId
     * @param productUpdate
     * @return
     */
    public AdDetailsDTO updateAdProduct(Long userId, Long adId, CreateProductRequestDTO productUpdate) {

        if (userId == null)
            throw new IllegalArgumentException("Il manque l'id utilisateur");
        if (adId == null)
            throw new IllegalArgumentException("Il manque l'id de l'annonce");
        if (productUpdate == null)
            throw new IllegalArgumentException("Il manque le produit");

        Ad ad = adRepository.findAdById(adId)
                .orElseThrow(() -> new ResourceNotFoundException("Annonce non trouvée: " + adId));

        if (!Objects.equals(ad.getUserId(), userId)) {
            throw new ForbiddenException("Vous n'êtes pas autorisé à modifier cette annonce");
        }

        ProductSummaryDTO updatedProduct = external.callExternal("catalog-service",
                () -> productClient.updateProduct(ad.getProductId(), productUpdate));

        UserSummaryDTO user = external.callExternal("user-service",
                () -> userClient.getUserById(ad.getUserId()));

        List<AddressAdDTO> addresses = external.callExternalOrNull(
                () -> userClient.getAddressesByUserId(ad.getUserId()));
        if (addresses != null && !addresses.isEmpty()) {
            user.setAddress(addresses.get(0));
        }

        AdDetailsDTO dto = new AdDetailsDTO();
        dto.setId(ad.getId());
        dto.setUser(user);
        dto.setProduct(updatedProduct);

        return dto;
    }

    /**
     * Delete an ad by its id (for an authenticated user)
     * @param userId
     * @param id
     */
    public void deleteAdById(Long userId, Long id) {
        if (userId == null)
            throw new IllegalArgumentException("Il manque l'id utilisateur");
        if (id == null)
            throw new IllegalArgumentException("Il manque l'id de l'annonce");

        Ad ad = adRepository.findAdById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Annonce non trouvée: " + id));

        if (!Objects.equals(ad.getUserId(), userId)) {
            throw new ForbiddenException("Vous n'êtes pas autorisé à supprimer cette annonce");
        }

        external.callExternalVoid("catalog-service", () -> productClient.deleteProduct(ad.getProductId()));
        adRepository.delete(ad);
    }
}
