package com.vinylclub.ad.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.time.Instant;
import java.util.Map;
import java.util.List;
import java.util.HashMap;
import java.util.ArrayList;

/**
 * Global exception handler for the API.
 * Allows you to return clean and consistent JSON responses.
 *
 * Common format:
 * -timestamp
 * -status
 * -error
 * -message
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 400: validation errors on @Valid @RequestBody
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, List<String>>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, List<String>> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error -> {
            errors.computeIfAbsent(error.getField(), k -> new ArrayList<>())
                  .add(error.getDefaultMessage());
        });

        return ResponseEntity.badRequest().body(errors);
    }

    /**
     * 404: resource not found (in base or via external service)
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "timestamp", Instant.now().toString(),
                "status", 404,
                "error", "Not Found",
                "message", ex.getMessage()
        ));
    }

    /**
     * 503: external service unavailable or error during an inter-service call
     */
    @ExceptionHandler(ExternalServiceException.class)
    public ResponseEntity<?> handleExternalService(ExternalServiceException ex) {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of(
                "timestamp", Instant.now().toString(),
                "status", 503,
                "error", "Service Unavailable",
                "message", ex.getMessage()
        ));
    }

    /**
     * 403: user authenticated but not authorized (not owner, etc.)
     */
    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<?> handleForbiddenService(ForbiddenException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                "timestamp", Instant.now().toString(),
                "status", 403,
                "error", "Forbidden",
                "message", ex.getMessage()
        ));
    }

    /**
     * 400: invalid request (missing param, incomplete body, etc.)
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleBadRequest(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                "timestamp", Instant.now().toString(),
                "status", 400,
                "error", "Bad Request",
                "message", ex.getMessage()
        ));
    }
}
