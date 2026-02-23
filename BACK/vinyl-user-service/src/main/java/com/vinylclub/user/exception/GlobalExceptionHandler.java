package com.vinylclub.user.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.dao.DataIntegrityViolationException; // L'import manquant
import org.springframework.http.HttpStatus;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleConflict(DataIntegrityViolationException ex) {
        Map<String, String> errors = new HashMap<>();
        // On vérifie si l'erreur concerne l'email (contrainte d'unicité)
        errors.put("email", "Cet email est déjà utilisé.");
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errors);
    }
}