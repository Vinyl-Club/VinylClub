package com.vinylclub.auth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.client.RestTemplate;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

   @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        System.out.println("🔧 SECURITY CONFIG LOADED!"); // ← Log de debug
        System.out.println("🔒 Configuring security filter chain...");
        System.out.println("🔐 Password Encoder: " + passwordEncoder().getClass().getSimpleName());
        System.out.println("🌐 RestTemplate bean created: " + restTemplate().getClass().getSimpleName());
        System.out.println("🚀 Security filter chain configured successfully!");

        // Configuration de la sécurité HTTP
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/login", "/register", "/refresh", "/validate", "/logout", "/me", "/health").permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );
        
        return http.build();
    }
}

