package com.vinylclub.auth.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, List<String>>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, List<String>> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error -> {
            errors.computeIfAbsent(error.getField(), k -> new ArrayList<>())
                .add(error.getDefaultMessage());
        });

        return ResponseEntity.badRequest().body(errors);
    }

    // Petit bonus : Ajoute ceci pour gérer les erreurs renvoyées par AuthService (comme l'email déjà pris)
    @ExceptionHandler(org.springframework.web.server.ResponseStatusException.class)
    public ResponseEntity<String> handleResponseStatusException(org.springframework.web.server.ResponseStatusException ex) {
        return new ResponseEntity<>(ex.getReason(), ex.getStatusCode());
    }
}