package com.vinylclub.catalog.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vinylclub.catalog.dto.UserDTO;
import com.vinylclub.catalog.service.UserIntegrationService;

@RestController
@RequestMapping("/api/integration")
// @CrossOrigin(origins = "*", allowedHeaders = "*")
public class IntegrationController {
    
    private final UserIntegrationService userIntegrationService;
    
    public IntegrationController(UserIntegrationService userIntegrationService) {
        this.userIntegrationService = userIntegrationService;
    }
    
    @GetMapping("/users/{id}")
    public UserDTO getUserDetails(@PathVariable Long id) {
        return userIntegrationService.getUserDetails(id);
    }
}