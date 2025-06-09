package com.vinylclub.auth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vinylclub.auth.dto.LoginRequest;
import com.vinylclub.auth.dto.LoginResponse;
import com.vinylclub.auth.dto.RefreshTokenRequest;
import com.vinylclub.auth.dto.UserDTO;
import com.vinylclub.auth.service.AuthService;
import com.vinylclub.auth.service.JwtService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
// @CrossOrigin(origins = {"http://localhost:8084", "http://localhost:3000"})
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtService jwtService;

    /**
     * LOGIN - Authentification utilisateur
     * POST /auth/login
     */
   @PostMapping("/login")
public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
    System.out.println("========================================");
    System.out.println("🚀 LOGIN REQUEST RECEIVED!");
    System.out.println("📧 Email: " + (loginRequest != null ? loginRequest.getEmail() : "NULL REQUEST"));
    System.out.println("🔑 Password: " + (loginRequest != null && loginRequest.getPassword() != null ? "***PROVIDED***" : "NULL"));
    System.out.println("========================================");
    
    try {
        LoginResponse response = authService.login(loginRequest);
        System.out.println("✅ Login successful for: " + loginRequest.getEmail());
        return ResponseEntity.ok(response);
    } catch (RuntimeException e) {
        System.out.println("❌ Login failed: " + e.getMessage());
        e.printStackTrace();
        return ResponseEntity.badRequest().build();
    }
}

    /**
     * REFRESH TOKEN - Renouvellement du token
     * POST /auth/refresh
     */
    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest refreshRequest) {
        try {
            String refreshToken = refreshRequest.getRefreshToken();
            
            // Valider le refresh token
            if (!jwtService.validateRefreshToken(refreshToken)) {
                return ResponseEntity.badRequest().build();
            }
            
            // Générer nouveaux tokens
            LoginResponse response = authService.refreshTokens(refreshToken);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * VALIDATE TOKEN - Validation du token
     * GET /auth/validate
     */
    @GetMapping("/validate")
    public ResponseEntity<UserDTO> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest().build();
            }
            
            String token = authHeader.substring(7);
            
            if (!jwtService.validateAccessToken(token)) {
                return ResponseEntity.badRequest().build();
            }
            
            // Récupérer les infos utilisateur
            UserDTO user = authService.getUserFromToken(token);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * LOGOUT - Déconnexion (optionnel avec JWT)
     * POST /auth/logout
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader("Authorization") String authHeader) {
        try {
            // Avec JWT, on peut simplement répondre OK
            // Le client supprimera les tokens côté frontend
            // Optionnel : blacklister le token
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * GET CURRENT USER - Informations utilisateur connecté
     * GET /auth/me
     */
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest().build();
            }
            
            String token = authHeader.substring(7);
            
            if (!jwtService.validateAccessToken(token)) {
                return ResponseEntity.badRequest().build();
            }
            
            UserDTO user = authService.getUserFromToken(token);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}