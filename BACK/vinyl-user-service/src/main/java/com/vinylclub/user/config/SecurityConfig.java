package com.vinylclub.user.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration // Marks this class as a source of bean definitions
@EnableWebSecurity // Enables Spring Security’s web security support
public class SecurityConfig {

    // 👉 This Bean allows you to hardage passwords with Bcrypt
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    
    @Bean // Declares a bean to be managed by the Spring container
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Disables CSRF protection (not recommended for production unless you have a good reason)
            .csrf(csrf -> csrf.disable())
            // Allows all HTTP requests without authentication
            .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
        // Builds and returns the SecurityFilterChain instance
        return http.build();
    }
}
