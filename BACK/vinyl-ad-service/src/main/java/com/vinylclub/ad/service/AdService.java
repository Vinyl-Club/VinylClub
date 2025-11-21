package com.vinylclub.ad.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vinylclub.ad.entity.Ad;
import com.vinylclub.ad.repository.AdRepository;
import com.vinylclub.ad.dto.AdDTO;
import com.vinylclub.ad.dto.AdDetailsDTO;
import com.vinylclub.ad.dto.AdListDTO;
import com.vinylclub.ad.client.ProductClient;
import com.vinylclub.ad.client.UserClient;
import com.vinylclub.ad.client.dto.ProductSummaryDTO;
import com.vinylclub.ad.client.dto.UserSummaryDTO;


@Service
@Transactional
public class AdService {

    @Autowired
    private AdRepository adRepository;

    @Autowired
    private ProductClient productClient;

    @Autowired
    private UserClient userClient;

    //besoin de creer une methode pour tous les produits avec pagination
    public Page<AdListDTO> getAllAds(int page, int size) {
    Pageable pageable = PageRequest.of(page, size);
    Page<Ad> adsPage = adRepository.findAllAds(pageable);
    if (adsPage.isEmpty()) {
        throw new RuntimeException("Aucune annonces disponible.");
    }
    return adsPage.map(ad -> {
        ProductSummaryDTO product = productClient.getProductById(ad.getProductId());
        UserSummaryDTO user = userClient.getUserById(ad.getUserId());

        // Ici on extrait juste ce dont la home a besoin
        String title = product.getTitle();
        String artistName = product.getArtist().getName();
        String categoryName = product.getCategory().getName();
        BigDecimal price = product.getPrice();
        String city = user.getAddress().getCity();
        String country = user.getAddress().getCountry();

        String imageUrl = null;
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            imageUrl = "/api/images/" + product.getImages().get(0).getId();
        }
        
        // On fabrique le DTO "card"
        return new AdListDTO(
            ad.getId(),
            title,
            artistName,
            categoryName,
            price,
            city,
            country,
            imageUrl
        );
    });
}


    //besoin de creer une methode pour un produit par son id
    public AdDetailsDTO getAdById(Long id) {
        Ad ad = adRepository.findAdById(id)
            .orElseThrow(()  -> new RuntimeException("Annonce non trouvée."));
        ProductSummaryDTO product = productClient.getProductById(ad.getProductId());
        UserSummaryDTO user = userClient.getUserById(ad.getUserId());
        
        AdDetailsDTO dto =  new AdDetailsDTO();
        dto.setId(ad.getId());
        dto.setUser(user);
        dto.setProduct(product);

        return dto;
    }
}
