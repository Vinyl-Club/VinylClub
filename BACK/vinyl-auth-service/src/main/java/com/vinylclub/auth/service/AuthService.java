package com.vinylclub.auth.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.client.RestTemplate;

import com.vinylclub.auth.dto.LoginRequest;
import com.vinylclub.auth.dto.LoginResponse;
import com.vinylclub.auth.dto.UserDTO;

@Service
// @CrossOrigin(origins = {"http://localhost:8090"})
public class AuthService {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${user.service.url:http://localhost:8090/api/users}")
    private String userServiceUrl;

    /**
     * Authentification utilisateur
     */
    public LoginResponse login(LoginRequest loginRequest) {
        // 1. Récupérer l'utilisateur depuis user-service
        UserDTO user = getUserByEmail(loginRequest.getEmail());
        
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        // 2. Vérifier le mot de passe
        if (!validatePassword(loginRequest.getEmail(), loginRequest.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // 3. Générer les tokens
        String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail());
        String refreshToken = jwtService.generateRefreshToken(user.getId(), user.getEmail());

        // 4. Retourner la réponse
        return new LoginResponse(
            accessToken,
            refreshToken,
            jwtService.getAccessTokenExpirationInSeconds(),
            user
        );
    }

    /**
     * Renouvellement des tokens
     */
    public LoginResponse refreshTokens(String refreshToken) {
        try {
            // Extraire les infos du refresh token
            Long userId = jwtService.getUserIdFromToken(refreshToken);
            String email = jwtService.getEmailFromToken(refreshToken);

            // Récupérer les infos utilisateur
            UserDTO user = getUserById(userId);
            
            if (user == null || !user.getEmail().equals(email)) {
                throw new RuntimeException("Invalid refresh token");
            }

            // Générer nouveaux tokens
            String newAccessToken = jwtService.generateAccessToken(userId, email);
            String newRefreshToken = jwtService.generateRefreshToken(userId, email);

            return new LoginResponse(
                newAccessToken,
                newRefreshToken,
                jwtService.getAccessTokenExpirationInSeconds(),
                user
            );
        } catch (Exception e) {
            throw new RuntimeException("Invalid refresh token");
        }
    }

    /**
     * Récupérer utilisateur depuis le token
     */
    public UserDTO getUserFromToken(String token) {
        try {
            Long userId = jwtService.getUserIdFromToken(token);
            return getUserById(userId);
        } catch (Exception e) {
            throw new RuntimeException("Invalid token");
        }
    }

    /**
     * Récupérer utilisateur par email depuis user-service
     */
    private UserDTO getUserByEmail(String email) {
        try {
            String url = userServiceUrl + "/email/" + email;
            ResponseEntity<UserDTO> response = restTemplate.getForEntity(url, UserDTO.class);
            return response.getBody();
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Récupérer utilisateur par ID depuis user-service
     */
    private UserDTO getUserById(Long userId) {
        try {
            String url = userServiceUrl + "/" + userId;
            ResponseEntity<UserDTO> response = restTemplate.getForEntity(url, UserDTO.class);
            return response.getBody();
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Valider le mot de passe via user-service
     */
    private boolean validatePassword(String email, String password) {
        try {
            // Créer la requête de validation
            ValidatePasswordRequest request = new ValidatePasswordRequest(email, password);
            
            String url = userServiceUrl + "/validate-password";
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");
            
            HttpEntity<ValidatePasswordRequest> entity = new HttpEntity<>(request, headers);
            ResponseEntity<Boolean> response = restTemplate.exchange(
                url, 
                HttpMethod.POST, 
                entity, 
                Boolean.class
            );
            
            return Boolean.TRUE.equals(response.getBody());
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * DTO pour validation du mot de passe
     */
    private static class ValidatePasswordRequest {
        private String email;
        private String password;

        public ValidatePasswordRequest(String email, String password) {
            this.email = email;
            this.password = password;
        }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}
