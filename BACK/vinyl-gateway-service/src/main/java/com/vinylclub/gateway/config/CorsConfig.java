package com.vinylclub.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfig {
    /**
     * Configuration CORS pour autoriser les requêtes cross-origin.
     * 
     * @return CorsWebFilter configuré
     */
    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        
        // Autoriser votre frontend
        corsConfig.addAllowedOrigin("http://localhost:8085");
        corsConfig.addAllowedOrigin("http://127.0.0.1:8085");
        
        // Toutes les méthodes
        corsConfig.addAllowedMethod("*");
        
        // Tous les headers
        corsConfig.addAllowedHeader("*");
        
        // Credentials
        corsConfig.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);
        
        return new CorsWebFilter(source);
    }
}