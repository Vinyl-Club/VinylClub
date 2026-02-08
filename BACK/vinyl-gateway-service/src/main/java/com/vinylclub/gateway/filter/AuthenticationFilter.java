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

        // 1) Public routes => bypass JWT
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
                .onStatus(status -> status == HttpStatus.UNAUTHORIZED || status == HttpStatus.FORBIDDEN,
                        resp -> Mono.error(new InvalidTokenException()))
                .onStatus(HttpStatusCode::is5xxServerError,
                        resp -> Mono.error(new AuthServiceDownException()))
                .bodyToMono(JsonNode.class)
                .flatMap(json -> {
                    String userId = extractUserId(json);
                    String role = extractRole(json);

                    if (userId == null || userId.isBlank()) {
                        return unauthorized(exchange);
                    }

                    // 4) Inject headers for downstream services (overwrite any client values)
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
        // compat ancien format
        if (json.hasNonNull("id")) return json.get("id").asText();
        // nouveau format (auth-service renvoie { userId, role })
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

    private Mono<Void> serviceUnavailable(ServerWebExchange exchange) {
        exchange.getResponse().setStatusCode(HttpStatus.SERVICE_UNAVAILABLE);
        return exchange.getResponse().setComplete();
    }

    static class InvalidTokenException extends RuntimeException {}
    static class AuthServiceDownException extends RuntimeException {}
}
