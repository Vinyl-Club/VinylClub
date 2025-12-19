package com.vinylclub.ad.service;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vinylclub.ad.client.ProductClient;
import com.vinylclub.ad.client.UserClient;
import com.vinylclub.ad.client.dto.ProductSummaryDTO;
import com.vinylclub.ad.client.dto.UserSummaryDTO;
import com.vinylclub.ad.dto.AdDetailsDTO;
import com.vinylclub.ad.dto.AdListDTO;
import com.vinylclub.ad.entity.Ad;
import com.vinylclub.ad.repository.AdRepository;
import com.vinylclub.ad.exception.ResourceNotFound

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

    public AdService(UserClient userClient) {
        this.userClient = userClient;
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
    public verifyUserExists(Long userId) {
        try {
            UserSummaryDTO user = userClient.getUserById(userId);

            if(user == null || user.getId() == null){
                throw new ExternalServiceException("Le service utilisateur renvoit une réponse invalide");
            }
        } catch (FeignException.NotFound e) {
            throw new ResourceNotFound("L'utilisateur n'a pas été trouvé: " + userId);
        } catch (FeignException e) {
            throw new ExternalServiceException("Le service utilisateur est indisponible ou à échoué: " + e.getMessage(), e);
        }
    }

    //Création d'une annonce
    public CreateAdRequestDTO createdAdd(CreateAdRequestDTO createAdRequestDTO) {
        CreateProductRequestDTO createProductRequestDTO = new CreateAdRequestDTO();

        createProductRequestDTO.setUserId(CreateAdRequestDTO.getUserId());
            
        
    }
}
