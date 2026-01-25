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
import com.vinylclub.auth.dto.RegisterRequest;
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
     *Login -User authentication
     *Post /Auth /Login
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
     * REFRESH TOKEN - Token renewal
     * POST /auth/refresh
     */
    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest refreshRequest) {
        try {
            String refreshToken = refreshRequest.getRefreshToken();
            
            // Validate the refresh token
            if (!jwtService.validateRefreshToken(refreshToken)) {
                return ResponseEntity.badRequest().build();
            }
            
            // Generate new tokens
            LoginResponse response = authService.refreshTokens(refreshToken);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * VALIDATE TOKEN - Validate token
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
                return ResponseEntity.status(401).build();
            }
            
            // Recover user information
            UserDTO user = authService.getUserFromToken(token);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    /**
     *Logout -Disconnection (optional with JWT)
     *Post /Auth /Logout
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader("Authorization") String authHeader) {
        try {
            // With JWT, we can just answer ok
            // The customer will delete the tokens on the frontend side
            // Optional: Blacklister the token
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Register
     * Post /auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@Valid @RequestBody RegisterRequest request) {
        try {
            LoginResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * GET CURRENT USER - Logged in user information
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