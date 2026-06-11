package com.vinylclub.ad.service;

import java.math.BigDecimal;
import java.text.Normalizer;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Locale;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
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
     * Récupère la liste paginée des annonces du catalogue.
     * Permet également d'appliquer les filtres de recherche
     * (texte, genre, prix, état et format).
     */
    public Page<AdListDTO> getAds(
            int page,
            int size,
            String query,
            String genre,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String state,
            String format
    ) {
        if (!hasFilters(query, genre, minPrice, maxPrice, state, format)) {
            return getAllAds(page, size);
        }

        Pageable pageable = PageRequest.of(page, size);
        List<AdListDTO> filteredAds = adRepository.findAll().stream()
                .map(this::toFilterableAd)
                .filter(filterable -> matchesFilters(
                        filterable,
                        query,
                        genre,
                        minPrice,
                        maxPrice,
                        state,
                        format))
                .map(FilterableAd::item)
                .toList();

        int start = Math.min((int) pageable.getOffset(), filteredAds.size());
        int end = Math.min(start + pageable.getPageSize(), filteredAds.size());

        return new PageImpl<>(
                filteredAds.subList(start, end),
                pageable,
                filteredAds.size());
    }

    /**
     * Récupère l'ensemble des annonces sans filtre.
     * Utilisé pour l'affichage du catalogue lorsque
     * aucun critère de recherche n'est renseigné.
     */
    public Page<AdListDTO> getAllAds(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Ad> adsPage = adRepository.findAll(pageable);

        if (adsPage.isEmpty()) {
            return Page.empty(pageable);
        }

        return adsPage.map(ad -> toFilterableAd(ad).item());
    }

    /**
     * Récupère toutes les annonces publiées par un utilisateur.
     * Utilisé pour l'affichage de l'espace "Mes annonces".
     */
    public List<AdListDTO> getAdsByUserId(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("Il manque l'id utilisateur");
        }

        return adRepository.findAllByUseridOrderByIdDesc(userId).stream()
                .map(ad -> toFilterableAd(ad).item())
                .toList();
    }

    /**
     * Récupère une liste d'annonces à partir d'une liste
     * d'identifiants produits.
     * Utilisé notamment pour l'affichage des favoris.
     */
    public List<AdListDTO> getAdsByProductIds(List<Long> productIds) {
        if (productIds == null || productIds.isEmpty()) {
            return List.of();
        }

        Map<Long, Integer> orderByProductId = IntStream.range(0, productIds.size())
                .boxed()
                .collect(Collectors.toMap(productIds::get, index -> index, (first, ignored) -> first));

        return adRepository.findAllByProductidIn(productIds).stream()
                .map(ad -> toFilterableAd(ad).item())
                .sorted(Comparator.comparingInt(item ->
                        orderByProductId.getOrDefault(item.getProductId(), Integer.MAX_VALUE)))
                .toList();
    }

    /**
     * Construit un DTO d'affichage d'annonce à partir
     * d'une entité Ad en enrichissant les données
     * avec les informations provenant des services
     * Catalog et User.
     */
    private FilterableAd toFilterableAd(Ad ad) {
        // Home/search = tolerant: an external service issue should not break the whole listing.
        ProductSummaryDTO product = external.callExternalOrNull(
                () -> productClient.getProductById(ad.getProductId()));

        String title = (product != null) ? product.getTitle() : "[Produit indisponible]";
        String artistName = (product != null && product.getArtist() != null) ? product.getArtist().getName() : null;
        String categoryName = (product != null && product.getCategory() != null) ? product.getCategory().getName() : null;
        BigDecimal price = (product != null) ? product.getPrice() : null;

        String city = external.callExternalOrNull(() -> userClient.getMainCityByUserId(ad.getUserId()));

        String imageUrl = null;
        if (product != null && product.getImages() != null && !product.getImages().isEmpty()) {
            imageUrl = product.getImages().get(0).getImageUrl();
        }

        AdListDTO item = new AdListDTO(
                ad.getId(),
                ad.getProductId(),
                title,
                artistName,
                categoryName,
                price,
                city,
                imageUrl
        );

        return new FilterableAd(item, product);
    }

    /**
     * Vérifie si au moins un filtre de recherche
     * a été renseigné par l'utilisateur.
     */
    private boolean hasFilters(
            String query,
            String genre,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String state,
            String format
    ) {
        return hasText(query)
                || hasText(genre)
                || minPrice != null
                || maxPrice != null
                || hasText(state)
                || hasText(format);
    }

   /**
     * Vérifie qu'une annonce correspond aux critères
     * de recherche sélectionnés.
     */
    private boolean matchesFilters(
            FilterableAd filterable,
            String query,
            String genre,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String state,
            String format
    ) {
        AdListDTO item = filterable.item();
        ProductSummaryDTO product = filterable.product();

        if (hasText(query) && !matchesSearch(item, query)) {
            return false;
        }

        if (hasText(genre) && !equalsNormalized(item.getCategoryName(), genre)) {
            return false;
        }

        if (minPrice != null && (item.getPrice() == null || item.getPrice().compareTo(minPrice) < 0)) {
            return false;
        }

        if (maxPrice != null && (item.getPrice() == null || item.getPrice().compareTo(maxPrice) > 0)) {
            return false;
        }

        if (hasText(state) && (product == null || !matchesState(product.getState(), state))) {
            return false;
        }

        return !hasText(format) || (product != null && equalsNormalized(product.getFormat(), format));
    }

    /**
     * Recherche un texte dans les informations
     * affichées d'une annonce (titre, artiste,
     * catégorie ou ville).
     */
    private boolean matchesSearch(AdListDTO item, String query) {
        return containsIgnoreCase(item.getTitle(), query)
                || containsIgnoreCase(item.getArtistName(), query)
                || containsIgnoreCase(item.getCategoryName(), query)
                || containsIgnoreCase(item.getCity(), query);
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    private boolean equalsNormalized(String value, String expected) {
        return value != null && expected != null && normalizeText(value).equals(normalizeText(expected));
    }

    private boolean containsIgnoreCase(String value, String query) {
        return value != null
                && query != null
                && normalizeText(value).contains(normalizeText(query));
    }

    private boolean matchesState(String productState, String expectedState) {
        return normalizeState(productState).equals(normalizeState(expectedState));
    }

    private String normalizeState(String value) {
        return normalizeText(value).replace("mauvaise_etat", "mauvais_etat");
    }

    private String normalizeText(String value) {
        String withoutAccents = Normalizer.normalize(value.trim(), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");
        return withoutAccents.toLowerCase(Locale.ROOT);
    }

    private record FilterableAd(AdListDTO item, ProductSummaryDTO product) {}

   /**
     * Récupère le détail complet d'une annonce.
     * Les informations sont enrichies via les services
     * Catalog et User afin d'obtenir les données
     * du produit et du vendeur.
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
     * Crée une nouvelle annonce pour l'utilisateur connecté.
     * Le produit est d'abord créé dans Catalog puis
     * l'association utilisateur/produit est enregistrée
     * dans le service Ads.
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
     * Modifie une annonce existante.
     * Vérifie que l'utilisateur est propriétaire
     * de l'annonce avant de transmettre la mise à jour
     * au service Catalog.
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
     * Supprime une annonce.
     * Vérifie les droits du propriétaire puis
     * supprime le produit associé dans Catalog
     * avant de supprimer l'annonce.
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
