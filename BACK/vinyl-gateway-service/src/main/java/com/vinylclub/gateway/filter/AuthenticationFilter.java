package com.vinylclub.gateway.filter;

import java.util.List;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;

import com.fasterxml.jackson.databind.JsonNode;

import reactor.core.publisher.Mono;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.web.reactive.function.client.WebClientRequestException;

@Component
public class AuthenticationFilter implements GlobalFilter, Ordered {

    // private static final List<String> PUBLIC_PREFIXES = List.of("/auth/", "/actuator/");

    private final WebClient webClient;

    public AuthenticationFilter(@LoadBalanced WebClient.Builder builder) {
        this.webClient = builder.baseUrl("http://vinyl-auth-service").build();
    }

    @Override
    public int getOrder() {
        return -100;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();

        // Bypass public endpoints + CORS preflight
        if (isPublic(exchange)) {
            return chain.filter(exchange);
        }

        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return unauthorized(exchange);
        }

        return webClient.get()
                .uri("/auth/validate")
                .header(HttpHeaders.AUTHORIZATION, authHeader)
                .retrieve()
                .onStatus(status -> status.value() == 400 || status.value() == 401,
                        resp -> Mono.error(new InvalidTokenException()))
                .onStatus(HttpStatusCode::is5xxServerError,
                        resp -> Mono.error(new AuthServiceDownException()))
                .bodyToMono(JsonNode.class)
                .flatMap(json -> {
                    String userId = extractUserId(json);
                    if (userId == null || userId.isBlank()) {
                        return unauthorized(exchange);
                    }

                    ServerWebExchange mutated = exchange.mutate()
                            .request(r -> r.headers(h -> {
                                h.remove("X-User-Id");
                                h.add("X-User-Id", userId);
                            }))
                            .build();

                    return chain.filter(mutated);
                })
                .onErrorResume(InvalidTokenException.class, e -> unauthorized(exchange))
                .onErrorResume(AuthServiceDownException.class, e -> serviceUnavailable(exchange))
                .onErrorResume(WebClientRequestException.class, e -> serviceUnavailable(exchange));
    }

    private boolean isPublic(ServerWebExchange exchange) {
        String path = exchange.getRequest().getURI().getPath();
        HttpMethod method = exchange.getRequest().getMethod();

        // Toujours public
        if (path.startsWith("/auth/") || path.startsWith("/actuator/")) return true;
        if (method == HttpMethod.OPTIONS) return true; // CORS

        // Catalogue / annonces visibles sans login (GET uniquement)
        if (method == HttpMethod.GET) {
            if (path.equals("/api/ad") || path.startsWith("/api/ad/")) return true;
            if (path.equals("/api/products") || path.startsWith("/api/products/")) return true;
            if (path.equals("/api/albums") || path.startsWith("/api/albums/")) return true;
            if (path.equals("/api/artists") || path.startsWith("/api/artists/")) return true;
            if (path.equals("/api/category") || path.startsWith("/api/category/")) return true;
            if (path.equals("/api/images") || path.startsWith("/api/images/")) return true;

            // recherche / filtres si c’est du GET
            // if (path.startsWith("/api/search/")) return true; // si tu as ça
            // if (path.startsWith("/api/price/")) return true;
            // if (path.startsWith("/api/format/")) return true;
            // if (path.startsWith("/api/state/")) return true;
            // if (path.startsWith("/api/search/")) return true;
        }

        return false;
    }


    private String extractUserId(JsonNode json) {
        if (json == null) return null;
        if (json.hasNonNull("id")) return json.get("id").asText();
        if (json.hasNonNull("userId")) return json.get("userId").asText();
        return null;
    }

    private Mono<Void> unauthorized(ServerWebExchange exchange) {
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        return exchange.getResponse().setComplete();
    }

    private Mono<Void> serviceUnavailable(ServerWebExchange exchange) {
        exchange.getResponse().setStatusCode(HttpStatus.SERVICE_UNAVAILABLE);
        return exchange.getResponse().setComplete();
    }

    static class InvalidTokenException extends RuntimeException {}
    static class AuthServiceDownException extends RuntimeException {}
}
