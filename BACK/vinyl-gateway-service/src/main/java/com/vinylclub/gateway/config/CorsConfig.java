package com.vinylclub.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfig {
    /**
     *Configuration cors to allow cross-origin requests.
     * 
     * @return corswebfilter configured
     */
    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        
        // Allow your front
        corsConfig.addAllowedOrigin("http://localhost:8085");
        corsConfig.addAllowedOrigin("http://127.0.0.1:8085");
        
        // All methods
        corsConfig.addAllowedMethod("*");
        
        // All headers
        corsConfig.addAllowedHeader("*");
        
        // Credentials
        corsConfig.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);
        
        return new CorsWebFilter(source);
    }
}