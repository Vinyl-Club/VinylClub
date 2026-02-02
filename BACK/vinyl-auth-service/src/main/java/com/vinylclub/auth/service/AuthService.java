package com.vinylclub.auth.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.client.RestTemplate;

import com.vinylclub.auth.dto.LoginRequest;
import com.vinylclub.auth.dto.LoginResponse;
import com.vinylclub.auth.dto.UserDTO;
import com.vinylclub.auth.dto.RegisterRequest;


@Service
// @CrossOrigin(origins = {"http://localhost:8090"})
public class AuthService {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private RestTemplate restTemplate;

    private final String userServiceBaseUrl = "http://vinyl-user-service/api/users";

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
        String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail(), user.getRole());
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
            String newAccessToken = jwtService.generateAccessToken(userId, email, user.getRole());
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
            System.out.println("1: " + url);

            HttpHeaders headers = new HttpHeaders();
            headers.set("X-User-Id", String.valueOf(userId)); // <-- IMPORTANT

            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<UserDTO> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                UserDTO.class
            );

            System.out.println("2");
            return response.getBody();
        } catch (Exception e) {
            System.out.println("❌ Error fetching user by ID: " + e.getMessage());
            return null;
        }
    }

    public LoginResponse register(RegisterRequest req) {

        // 1) (Optionnel mais conseillé) vérifier si email existe déjà
        UserDTO existing = getUserByEmail(req.getEmail());
        if (existing != null) {
            throw new RuntimeException("Email already used");
        }

        // 2) appeler user-service pour créer l’utilisateur
        UserCreatedResponse created = createUserInUserService(req);
        if (created == null || created.getId() == null) {
            throw new RuntimeException("User creation failed");
        }

        // 3) générer tokens
        String accessToken = jwtService.generateAccessToken(created.getId(), created.getEmail(), created.getRole());
        String refreshToken = jwtService.generateRefreshToken(created.getId(), created.getEmail());

        // 4) retourner comme login
        UserDTO user = new UserDTO();
        user.setId(created.getId());
        user.setEmail(created.getEmail());
        user.setFirstName(created.getFirstName());
        user.setLastName(created.getLastName());
        user.setRole(created.getRole());
        user.setCreatedAt(created.getCreatedAt()); // si tu l’as

        return new LoginResponse(
            accessToken,
            refreshToken,
            jwtService.getAccessTokenExpirationInSeconds(),
            user
        );
    }

    private UserCreatedResponse createUserInUserService(RegisterRequest req) {
        try {
            String url = userServiceBaseUrl; // "http://vinyl-user-service/api/users"

            // Le user-service attend un User (entité). On lui envoie le minimum.
            CreateUserBody body = new CreateUserBody();
            body.setEmail(req.getEmail());
            body.setPassword(req.getPassword());
            body.setFirstName(req.getFirstName());
            body.setLastName(req.getLastName());
            body.setPhone(req.getPhone());

            ResponseEntity<UserCreatedResponse> response =
                    restTemplate.postForEntity(url, body, UserCreatedResponse.class);

            return response.getBody();
        } catch (Exception e) {
            System.out.println("❌ Error creating user: " + e.getMessage());
            return null;
        }
    }

    private static class CreateUserBody {
        private String email;
        private String password;
        private String firstName;
        private String lastName;
        private String phone;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
    }

    private static class UserCreatedResponse {
        private Long id;
        private String email;
        private String firstName;
        private String lastName;
        private String role;
        private java.sql.Timestamp createdAt;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public java.sql.Timestamp getCreatedAt() { return createdAt; }
        public void setCreatedAt(java.sql.Timestamp createdAt) { this.createdAt = createdAt; }
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
