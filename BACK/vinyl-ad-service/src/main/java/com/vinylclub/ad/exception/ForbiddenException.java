package com.vinylclub.ad.exception;

/**
 *Exception thrown when the user does not have the right to perform the action.
 *Ex: modify /delete an ad that does not belong to it.
 *Handled by GlobalExceptionHandler -> 403.
 */
public class ForbiddenException extends RuntimeException {
    public ForbiddenException(String message) {
        super(message);
    }
}
