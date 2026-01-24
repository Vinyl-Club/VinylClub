package com.vinylclub.ad.exception;

/**
 *Exception thrown when an expected resource does not exist.
 *Ex: announcement not found in base, resource 404 on external service side, etc.
 *Handled by GlobalExceptionHandler -> 404.
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
