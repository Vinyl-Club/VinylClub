package com.vinylclub.ad;

import com.vinylclub.ad.client.ProductClient;
import com.vinylclub.ad.client.UserClient;
import com.vinylclub.ad.client.dto.ProductCreatedDTO;
import com.vinylclub.ad.client.dto.ProductSummaryDTO;
import com.vinylclub.ad.client.dto.UserSummaryDTO;
import com.vinylclub.ad.dto.AdDTO;
import com.vinylclub.ad.dto.AdDetailsDTO;
import com.vinylclub.ad.entity.Ad;
import com.vinylclub.ad.client.request.CreateProductRequestDTO;
import com.vinylclub.ad.repository.AdRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.eq;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Testcontainers
@ActiveProfiles("test")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
class AdControllerIT {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:17-alpine")
            .withDatabaseName("ad_test")
            .withUsername("test")
            .withPassword("test");

    @DynamicPropertySource
    static void registerProps(DynamicPropertyRegistry r) {
        r.add("spring.datasource.url", postgres::getJdbcUrl);
        r.add("spring.datasource.username", postgres::getUsername);
        r.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired MockMvc mockMvc;
    @Autowired JdbcTemplate jdbcTemplate;
    @Autowired AdRepository adRepository;

    // Feign clients mockés (pas d'appel réseau)
    @MockBean ProductClient productClient;
    @MockBean UserClient userClient;

    @BeforeEach
    void setup() {
        adRepository.deleteAll();
    }

    @Test
    void post_api_ad_shouldCreateAd_andPersistInDb() throws Exception {
        // GIVEN: catalog-service retourne un ID produit créé
        ProductCreatedDTO created = new ProductCreatedDTO();
        created.setId(123L);

        when(productClient.createProduct(any(CreateProductRequestDTO.class)))
                .thenReturn(created);

        long userId = 7L;

        // Body attendu: { "product": { ... } }
        // ⚠️ Adapte si CreateProductRequestDTO a des champs @NotNull (ex: artistId, categoryId, etc.)
        String json = """
            {
              "product": {
                "title": "Thriller"
              }
            }
            """;

        // WHEN
        mockMvc.perform(post("/api/ad")
                        .contentType(APPLICATION_JSON)
                        .header("X-User-Id", String.valueOf(userId))
                        .content(json))
                // THEN
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(APPLICATION_JSON))
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.productId").value(123))
                .andExpect(jsonPath("$.userId").value(7));

        // AND: insertion en DB
        assertThat(adRepository.count()).isEqualTo(1);

        var saved = adRepository.findAll().get(0);
        assertThat(saved.getUserId()).isEqualTo(userId);
        assertThat(saved.getProductId()).isEqualTo(123L);

        // AND: vérifie l'appel Feign
        verify(productClient, times(1)).createProduct(any(CreateProductRequestDTO.class));
        verifyNoMoreInteractions(productClient);
    }

    @Test
    void post_api_ad_shouldFail_whenCatalogReturnsNullId_andNotPersist() throws Exception {
        // GIVEN: catalog-service retourne un productId null => ExternalServiceException dans ton code
        ProductCreatedDTO created = new ProductCreatedDTO();
        created.setId(null);

        when(productClient.createProduct(any(CreateProductRequestDTO.class)))
                .thenReturn(created);

        String json = """
            {
              "product": {
                "title": "Thriller"
              }
            }
            """;

        // WHEN
        mockMvc.perform(post("/api/ad")
                        .contentType(APPLICATION_JSON)
                        .header("X-User-Id", "7")
                        .content(json))
                // THEN :
                // Sans @ControllerAdvice (non fourni), une exception remonte souvent en 500.
                // Si tu as un handler qui mappe ExternalServiceException en 502/503/400, adapte ici.
                .andExpect(status().is5xxServerError());

        // AND: rien n'est persisté
        assertThat(adRepository.count()).isEqualTo(0);

        // AND: Feign a été appelé
        verify(productClient, times(1)).createProduct(any(CreateProductRequestDTO.class));
    }
    @Test
    void put_api_ad_shouldUpdateProduct_whenOwner() throws Exception {

        // GIVEN
        Ad ad = new Ad();
        ad.setUserId(7L);
        ad.setProductId(100L);
        ad = adRepository.save(ad);

        ProductSummaryDTO updatedProduct = new ProductSummaryDTO();
        updatedProduct.setId(100L);
        updatedProduct.setTitle("Updated title");

        when(productClient.updateProduct(eq(100L), any(CreateProductRequestDTO.class)))
                .thenReturn(updatedProduct);

        UserSummaryDTO user = new UserSummaryDTO();
        user.setId(7L);

        when(userClient.getUserById(7L)).thenReturn(user);
        when(userClient.getAddressesByUserId(7L)).thenReturn(java.util.List.of());

        String json = """
            {
            "title": "Updated title"
            }
            """;

        mockMvc.perform(
                put("/api/ad/" + ad.getId())
                    .header("X-User-Id", "7")
                    .contentType(APPLICATION_JSON)
                    .content(json)
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(ad.getId()))
        .andExpect(jsonPath("$.product.id").value(100))
        .andExpect(jsonPath("$.user.id").value(7));

        verify(productClient).updateProduct(eq(100L), any(CreateProductRequestDTO.class));
    }

    @Test
    void put_api_ad_shouldForbiden_whenNotOwner() throws Exception {
        Ad ad = new com.vinylclub.ad.entity.Ad();
        ad.setUserId(7L);
        ad.setProductId(100L);
        ad = adRepository.save(ad);

        String json = """
            {
                "title": "Updated title"
            }
            """;
        
        mockMvc.perform(
            put("/api/ad/{id}", ad.getId())
                .header("X-User-Id", "999")
                .contentType(APPLICATION_JSON)
                .content(json)
        )    
            .andExpect(status().isForbidden());

        verifyNoInteractions(productClient);
        verifyNoInteractions(userClient);
    }
}
