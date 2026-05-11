package com.vinylclub.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
// import jakarta.validation.constraints.Max;
// import jakarta.validation.constraints.Min;

public class CreateUserRequest {
    @NotBlank(message = "Email obligatoire.")
    @Email(message = "Email invalide")
    @Size(max = 200, message = "200 caractères maximum")
    private String email;

    @NotBlank(message = "Mot de passe obligatoire.")
    @Size(min = 12, max = 72, message = "12 caractères minimum")
    private String password;

    @NotBlank(message = "Le nom est obligatoire")
    private String firstName;
    @NotBlank(message = "Le prénom est obligatoire")
    private String lastName;
    private String phone;
    @NotBlank(message = "La ville est obligatoire")
    @Size(max = 70, message = "70 caractères maximun")
    private String city;

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

    public String getCity() {return city;}
    public void setCity(String city ) { this.city = city; }
}