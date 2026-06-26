package com.vinylclub.gateway.filter;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientRequestException;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.http.HttpCookie;

import com.fasterxml.jackson.databind.JsonNode;
import com.vinylclub.gateway.security.SecurityRules;

import reactor.core.publisher.Mono;

/**
 * Global authentication & authorization filter for the API Gateway.
 *
 * Responsibilities:
 * - Decide if a route is PUBLIC / AUTH / ADMIN
 * - Validate JWT tokens via auth-service
 * - Enforce role-based access (ADMIN)
 * - Inject trusted headers (X-User-Id, X-User-Role) for downstream services
 */
@Component
public class AuthenticationFilter implements GlobalFilter, Ordered {

    private final WebClient webClient;
    private final SecurityRules securityRules;

    public AuthenticationFilter(@LoadBalanced WebClient.Builder builder, SecurityRules securityRules) {
        this.webClient = builder.baseUrl("http://vinyl-auth-service").build();
        this.securityRules = securityRules;
    }

    @Override
    public int getOrder() {
        return -100;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        String path = exchange.getRequest().getURI().getPath();
        HttpMethod method = exchange.getRequest().getMethod();

        // 1️ Public routes bypass JWT validation
        if (securityRules.match(path, method) == SecurityRules.Access.PUBLIC) {
            return chain.filter(exchange);
        }

        // =====================================================
        // TOKEN EXTRACTION (cookie OR Authorization header)
        // =====================================================

        String token = null;

        // Try cookie first
        HttpCookie authCookie = exchange.getRequest().getCookies().getFirst("auth");
        if (authCookie != null && authCookie.getValue() != null && !authCookie.getValue().isBlank()) {
            token = authCookie.getValue();
        }

        // If no cookie → try Authorization header
        if (token == null) {
            String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
            }
        }

        // If still no token → unauthorized
        if (token == null) {
            return unauthorized(exchange);
        }

        String authHeader = "Bearer " + token;

        // =====================================================
        // VALIDATE TOKEN WITH AUTH SERVICE
        // =====================================================

        return webClient.get()
            .uri("/auth/validate")
            .header(HttpHeaders.AUTHORIZATION, authHeader)
            .retrieve()
            .onStatus(
                status -> status == HttpStatus.UNAUTHORIZED || status == HttpStatus.FORBIDDEN,
                resp -> Mono.error(new InvalidTokenException())
            )
            .onStatus(
                HttpStatusCode::is5xxServerError,
                resp -> Mono.error(new AuthServiceDownException())
            )
            .bodyToMono(JsonNode.class)
            .flatMap(json -> {

                String userId = extractUserId(json);
                String role = extractRole(json);

                if (userId == null || userId.isBlank()) {
                    return unauthorized(exchange);
                }

                SecurityRules.Access access = securityRules.match(path, method);

                if (access == SecurityRules.Access.ADMIN) {
                    if (role == null || !role.equalsIgnoreCase("ADMIN")) {
                        return forbidden(exchange);
                    }
                }

                ServerWebExchange mutated = exchange.mutate()
                    .request(r -> r.headers(h -> {

                        h.remove("X-User-Id");
                        h.remove("X-User-Role");

                        h.add("X-User-Id", userId);

                        if (role != null && !role.isBlank()) {
                            h.add("X-User-Role", role);
                        }
                    }))
                    .build();

                return chain.filter(mutated);
            })
            .onErrorResume(InvalidTokenException.class, e -> unauthorized(exchange))
            .onErrorResume(AuthServiceDownException.class, e -> serviceUnavailable(exchange))
            .onErrorResume(WebClientRequestException.class, e -> serviceUnavailable(exchange));
    }

    private String extractUserId(JsonNode json) {
        if (json == null) return null;
        if (json.hasNonNull("id")) return json.get("id").asText();
        if (json.hasNonNull("userId")) return json.get("userId").asText();
        return null;
    }

    private String extractRole(JsonNode json) {
        if (json == null) return null;
        if (json.hasNonNull("role")) return json.get("role").asText();
        return null;
    }

    private Mono<Void> unauthorized(ServerWebExchange exchange) {
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        return exchange.getResponse().setComplete();
    }

    private Mono<Void> forbidden(ServerWebExchange exchange) {
        exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
        return exchange.getResponse().setComplete();
    }

    private Mono<Void> serviceUnavailable(ServerWebExchange exchange) {
        exchange.getResponse().setStatusCode(HttpStatus.SERVICE_UNAVAILABLE);
        return exchange.getResponse().setComplete();
    }

    static class InvalidTokenException extends RuntimeException {}
    static class AuthServiceDownException extends RuntimeException {}
}