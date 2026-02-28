package com.vinylclub.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public class LoginRequest {
    @NotBlank(message = "Email obligatoire.")
    @Email(message = "Email invalide.")
    @Size(max = 200, message = "200 caractères maximum.")
    private String email;
    
    @NotBlank(message = "Mot de passe obligatoire.")
    @Size(min = 12, max = 72 , message = "72 caractères maximum.")
    private String password;
    
    public LoginRequest() {}
    
    public LoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }
    
    // Getters and setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
