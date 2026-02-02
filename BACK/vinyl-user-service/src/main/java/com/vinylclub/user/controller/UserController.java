package com.vinylclub.user.controller;

import com.vinylclub.user.dto.UserDTO;
import com.vinylclub.user.dto.UserPublicDTO;
import com.vinylclub.user.dto.LoginRequest;
import com.vinylclub.user.dto.ValidatePasswordRequest;
import com.vinylclub.user.entity.User;
import com.vinylclub.user.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // (DEV) Tu peux laisser public au début
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // Protection: un user ne peut lire que lui-même
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(
            @RequestHeader("X-User-Id") Long requesterId,
            @PathVariable Long id
    ) {
        if (!id.equals(requesterId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        UserDTO user = userService.getUserById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<UserPublicDTO> getUserPublicById(@PathVariable Long id) {
        UserPublicDTO user = userService.getPublicUserById(id);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
        return ResponseEntity.ok(user);
    }

    /**
     * IMPORTANT : /api/users est utilisé par auth/register
     * => en général cette route doit rester PUBLIC (sinon ton auth-service ne peut pas créer d'user via la gateway)
     */
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User created = userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // Protection: un user ne peut modifier que lui-même
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @RequestHeader("X-User-Id") Long requesterId,
            @PathVariable Long id,
            @RequestBody User user
    ) {
        if (!id.equals(requesterId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        User updated = userService.updateUser(id, user);
        return ResponseEntity.ok(updated);
    }

    // Protection: un user ne peut supprimer que lui-même
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(
            @RequestHeader("X-User-Id") Long requesterId,
            @PathVariable Long id
    ) {
        if (!id.equals(requesterId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<UserDTO> login(@RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(userService.login(loginRequest.getEmail(), loginRequest.getPassword()));
    }

    @PostMapping("/validate-password")
    public ResponseEntity<Boolean> validatePassword(@RequestBody ValidatePasswordRequest request) {
        try {
            boolean isValid = userService.validatePassword(request.getEmail(), request.getPassword());
            return ResponseEntity.ok(isValid);
        } catch (Exception e) {
            return ResponseEntity.ok(false);
        }
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UserDTO> getUserByEmail(@PathVariable String email) {
        try {
            UserDTO user = userService.getUserByEmail(email);
            return (user != null) ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    
}
