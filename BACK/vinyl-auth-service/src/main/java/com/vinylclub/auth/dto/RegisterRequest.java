package com.vinylclub.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public class RegisterRequest {

    @NotBlank(message = "Email obligatoire.")
    @Email(message = "Email invalide")
    private String email;

    @NotBlank(message = "Mot de passe obligatoire.")
    @Size(min = 12, max = 72, message = "12 caractères minimum")
    @Pattern(
        regexp = ".*[A-Z].*",
        message = "Vous devez avoir au moins une majuscule"
    )
    @Pattern(
        regexp = ".*[a-z].*",
        message = "Vous devez avoir au moins une minuscule"
    )
    @Pattern(
        regexp = ".*\\d.*",
        message = "Vous devez avoir au moins un chiffre"
    )
    @Pattern(
        regexp = ".*[^A-Za-z\\d].*",
        message = "Vous devez avoir au moins un caractère spécial"
    )
    private String password;

    @NotBlank(message = "Le nom est obligatoire")
    private String firstName;
    @NotBlank(message = "Le prénom est obligatoire")
    private String lastName;
    private String phone;

    public RegisterRequest() {}

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
}
