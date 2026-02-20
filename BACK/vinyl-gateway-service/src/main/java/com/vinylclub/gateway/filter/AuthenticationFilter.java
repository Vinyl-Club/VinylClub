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
 *
 * IMPORTANT:
 * - Clients can NEVER set X-User-Id / X-User-Role themselves
 * - Only the gateway is allowed to inject these headers
 */
@Component
public class AuthenticationFilter implements GlobalFilter, Ordered {

    /**
     * WebClient used to call auth-service (/auth/validate).
     * LoadBalanced => resolves "vinyl-auth-service" via Eureka.
     */
    private final WebClient webClient;

    /**
     * Centralized security rules loaded from application.properties.
     * Replaces hardcoded "if soup".
     */
    private final SecurityRules securityRules;

    public AuthenticationFilter(@LoadBalanced WebClient.Builder builder, SecurityRules securityRules) {
        this.webClient = builder.baseUrl("http://vinyl-auth-service").build();
        this.securityRules = securityRules;
    }

    /**
     * Filter priority.
     * Negative value => executed very early in the gateway chain.
     */
    @Override
    public int getOrder() {
        return -100;
    }

    /**
     * Main gateway filter logic.
     *
     * Flow:
     * 1) Check if route is PUBLIC
     * 2) If protected => require Authorization header
     * 3) Validate token with auth-service
     * 4) Enforce ADMIN role if required
     * 5) Inject trusted headers for downstream services
     */
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        String path = exchange.getRequest().getURI().getPath();
        HttpMethod method = exchange.getRequest().getMethod();

        // 1) Public routes => bypass JWT validation completely
        if (securityRules.match(path, method) == SecurityRules.Access.PUBLIC) {
            return chain.filter(exchange);
        }

        // 2) Protected routes => require Authorization: Bearer <token>
        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return unauthorized(exchange);
        }

        // 3) Validate token with auth-service
        return webClient.get()
            .uri("/auth/validate")
            .header(HttpHeaders.AUTHORIZATION, authHeader)
            .retrieve()
            // Token invalid or expired
            .onStatus(
                status -> status == HttpStatus.UNAUTHORIZED || status == HttpStatus.FORBIDDEN,
                resp -> Mono.error(new InvalidTokenException())
            )
            // Auth-service down or internal error
            .onStatus(
                HttpStatusCode::is5xxServerError,
                resp -> Mono.error(new AuthServiceDownException())
            )
            .bodyToMono(JsonNode.class)
            .flatMap(json -> {

                // Extract trusted identity from auth-service response
                String userId = extractUserId(json);
                String role = extractRole(json);

                // No userId => invalid token
                if (userId == null || userId.isBlank()) {
                    return unauthorized(exchange);
                }

                // 4) Role-based access control (ADMIN routes)
                SecurityRules.Access access = securityRules.match(path, method);

                if (access == SecurityRules.Access.ADMIN) {
                    if (role == null || !role.equalsIgnoreCase("ADMIN")) {
                        return forbidden(exchange);
                    }
                }

                // 5) Inject headers for downstream services (overwrite any client values)
                ServerWebExchange mutated = exchange.mutate()
                    .request(r -> r.headers(h -> {
                        // Remove any spoofed headers from client
                        h.remove("X-User-Id");
                        h.remove("X-User-Role");

                        // Inject trusted values from auth-service
                        h.add("X-User-Id", userId);

                        if (role != null && !role.isBlank()) {
                            h.add("X-User-Role", role);
                        }
                    }))
                    .build();

                return chain.filter(mutated);
            })
            // Token invalid
            .onErrorResume(InvalidTokenException.class, e -> unauthorized(exchange))
            // Auth-service unavailable
            .onErrorResume(AuthServiceDownException.class, e -> serviceUnavailable(exchange))
            // Network / connection error
            .onErrorResume(WebClientRequestException.class, e -> serviceUnavailable(exchange));
    }

    /**
     * Extract userId from auth-service response.
     * Supports legacy format (id) and current format (userId).
     */
    private String extractUserId(JsonNode json) {
        if (json == null) return null;
        if (json.hasNonNull("id")) return json.get("id").asText();       // legacy
        if (json.hasNonNull("userId")) return json.get("userId").asText();
        return null;
    }

    /**
     * Extract user role from auth-service response.
     */
    private String extractRole(JsonNode json) {
        if (json == null) return null;
        if (json.hasNonNull("role")) return json.get("role").asText();
        return null;
    }

    /**
     * 401 Unauthorized:
     * - Missing token
     * - Invalid token
     * - Expired token
     */
    private Mono<Void> unauthorized(ServerWebExchange exchange) {
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        return exchange.getResponse().setComplete();
    }

    /**
     * 403 Forbidden:
     * - Valid token
     * - Insufficient privileges (e.g. USER accessing ADMIN route)
     */
    private Mono<Void> forbidden(ServerWebExchange exchange) {
        exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
        return exchange.getResponse().setComplete();
    }

    /**
     * 503 Service Unavailable:
     * - auth-service down
     * - network failure
     */
    private Mono<Void> serviceUnavailable(ServerWebExchange exchange) {
        exchange.getResponse().setStatusCode(HttpStatus.SERVICE_UNAVAILABLE);
        return exchange.getResponse().setComplete();
    }

    // Internal marker exceptions for flow control
    static class InvalidTokenException extends RuntimeException {}
    static class AuthServiceDownException extends RuntimeException {}
}
