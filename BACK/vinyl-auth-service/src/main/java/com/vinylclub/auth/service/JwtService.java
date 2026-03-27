package com.vinylclub.auth.service;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.access-token-expiration:3600000}")
    private Long accessTokenExpiration;

    @Value("${jwt.refresh-token-expiration:604800000}")
    private Long refreshTokenExpiration;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Generate an access token
     */
    public String generateAccessToken(Long userId, String email, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("role", role);
        claims.put("type", "access");

        return createToken(claims, String.valueOf(userId), accessTokenExpiration);
    }

    /**
     * Generate a refresh token
     */
    public String generateRefreshToken(Long userId, String email) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("type", "refresh");

        return createToken(claims, String.valueOf(userId), refreshTokenExpiration);
    }

    /**
     * Create a JWT token
     */
    private String createToken(Map<String, Object> claims, String subject, Long expiration) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String getRoleFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        Object role = claims.get("role");
        return role != null ? role.toString() : null;
    }

    /**
     * Extract userId from token
     */
    public Long getUserIdFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        return Long.valueOf(claims.get("userId").toString());
    }

    /**
     * Optional: extract subject
     */
    public String getSubjectFromToken(String token) {
        return getClaimsFromToken(token).getSubject();
    }

    /**
     * Extract token type
     */
    public String getTokenType(String token) {
        Claims claims = getClaimsFromToken(token);
        return claims.get("type").toString();
    }

    /**
     * Extract all token claims
     */
    private Claims getClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Checks if token has expired
     */
    public Boolean isTokenExpired(String token) {
        try {
            Date expiration = getClaimsFromToken(token).getExpiration();
            return expiration.before(new Date());
        } catch (Exception e) {
            return true;
        }
    }

    /**
     * Validate generic token
     */
    public Boolean validateToken(String token) {
        try {
            getClaimsFromToken(token);
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Validates that it is an access token
     */
    public Boolean validateAccessToken(String token) {
        try {
            String tokenType = getTokenType(token);
            return "access".equals(tokenType) && !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Validates that it is a refresh token
     */
    public Boolean validateRefreshToken(String token) {
        try {
            String tokenType = getTokenType(token);
            return "refresh".equals(tokenType) && !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Return expiration time in seconds
     */
    public Long getAccessTokenExpirationInSeconds() {
        return accessTokenExpiration / 1000;
    }
}