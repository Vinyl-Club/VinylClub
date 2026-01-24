package com.vinylclub.ad.exception;

/**
 *Exception thrown when a call to another microservice fails
 *(timeout, service down, error 5xx/4xx, etc.).
 *Handled by GlobalExceptionHandler -> 503.
 */
public class ExternalServiceException extends RuntimeException {
    public ExternalServiceException(String message) {
        super(message);
    }

    public ExternalServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}
