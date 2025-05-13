package com.vinylclub.catalog.service;

import com.vinylclub.catalog.client.UserClient;
import com.vinylclub.catalog.dto.UserDTO;
import org.springframework.stereotype.Service;

@Service
public class UserIntegrationService {
    
    private final UserClient userClient;
    
    public UserIntegrationService(UserClient userClient) {
        this.userClient = userClient;
    }
    
    public UserDTO getUserDetails(Long userId) {
        return userClient.getUserById(userId);
    }
}