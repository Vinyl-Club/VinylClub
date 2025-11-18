package com.vinylclub.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;         


@Configuration
@Profile("!docker")
public class RouteConfig {
    // Constants
    public static final String VINYL_SERVICE_URL = "lb://vinyl-service";
    public static final String VINYL_SERVICE_ROUTE = "/vinyl/**";
    public static final String VINYL_SERVICE_PATH = "/vinyl";
   
    public static final String USER_SERVICE_URL = "lb://vinyl-user-service";
    public static final String USER_SERVICE_ROUTE = "/api/users/**";
    public static final String USER_SERVICE_PATH = "/api/users";
    
    public static final String CATALOG_SERVICE_URL = "lb://vinyl-catalog-service";
    public static final String CATALOG_SERVICE_ROUTE = "/api/catalog/**";
    public static final String CATALOG_SERVICE_PATH = "/api/catalog";

    public static final String AUTH_SERVICE_URL = "lb://vinyl-auth-service";
    public static final String AUTH_SERVICE_PATH = "/auth";
    public static final String AUTH_SERVICE_ROUTE = "/auth/**";

    public static final String FAVORITES_PATH = "/api/favorites";
    public static final String FAVORITES_ROUTE = "/api/favorites/**";
    public static final String FAVORITES_SERVICE_URL = "lb://vinyl-favorites-service";

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
            .route("catalog-service", r -> r
                .path(CATALOG_SERVICE_ROUTE)
                .uri(CATALOG_SERVICE_URL))
            .route("user-service", r -> r
                .path(USER_SERVICE_ROUTE)
                .uri(USER_SERVICE_URL))
            .route("vinyl-service", r -> r
                .path(VINYL_SERVICE_ROUTE)
                .uri(VINYL_SERVICE_URL))
            .route("auth-service", r -> r
                .path(AUTH_SERVICE_ROUTE)
                .uri(AUTH_SERVICE_URL))
            .route("favorites-service", r -> r
                .path(FAVORITES_ROUTE)
                .uri(FAVORITES_SERVICE_URL))

            .build();
    }
}