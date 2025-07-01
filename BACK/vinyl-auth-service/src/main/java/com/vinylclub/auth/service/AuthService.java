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

    private final String userServiceBaseUrl = "http://VINYL-USER-SERVICE/api/users";

    /**
     *User authentication
     */
    public LoginResponse login(LoginRequest loginRequest) {
        // 1. Recover the user from user-service
        UserDTO user = getUserByEmail(loginRequest.getEmail());
        
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        // 2. Check the password
        if (!validatePassword(loginRequest.getEmail(), loginRequest.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // 3. Generate tokens
        String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail());
        String refreshToken = jwtService.generateRefreshToken(user.getId(), user.getEmail());

        // 4. Turn the answer
        return new LoginResponse(
            accessToken,
            refreshToken,
            jwtService.getAccessTokenExpirationInSeconds(),
            user
        );
    }

    /**
     *Renewal of tokens
     */
    public LoginResponse refreshTokens(String refreshToken) {
        try {
            // Extract information from the refresh token
            Long userId = jwtService.getUserIdFromToken(refreshToken);
            String email = jwtService.getEmailFromToken(refreshToken);

            // Recover user information
            UserDTO user = getUserById(userId);
            
            if (user == null || !user.getEmail().equals(email)) {
                throw new RuntimeException("Invalid refresh token");
            }

            // Generate new tokens
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
     *Recover user from the token
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
     *Recover user by email from user-service
     */
    private UserDTO getUserByEmail(String email) {
    try {
        String url = userServiceBaseUrl + "/email/" + email;
        System.out.println("Calling URL: " + url); // Log to check the URL called
        ResponseEntity<UserDTO> response = restTemplate.getForEntity(url, UserDTO.class);
        System.out.println("Response: " + response.getBody()); // Log to check the answer received
        return response.getBody();
    } catch (Exception e) {
        System.out.println("Error fetching user: " + e.getMessage()); // Log to check the errors
        return null;
    }
}

    /**
     *Recover User by ID from Uservice
     */
    private UserDTO getUserById(Long userId) {
        try {
            String url = userServiceBaseUrl + "/" + userId;
            ResponseEntity<UserDTO> response = restTemplate.getForEntity(url, UserDTO.class);
            return response.getBody();
        } catch (Exception e) {
            System.out.println("❌ Error fetching user by ID: " + e.getMessage());
            return null;
        }
    }

    /**
     *Validate the password via user-service
     */
    private boolean validatePassword(String email, String password) {
        try {
            // Create the validation request
            ValidatePasswordRequest request = new ValidatePasswordRequest(email, password);
            
            String url = userServiceBaseUrl + "/validate-password";
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
            System.out.println("❌ Error validating password: " + e.getMessage());
            return false;
        }
    }

    /**
     *DTO for validation of the password
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
