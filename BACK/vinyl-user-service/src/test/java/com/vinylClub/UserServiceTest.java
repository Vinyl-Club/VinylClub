package com.vinylclub.user.service;

import com.vinylclub.user.entity.User;
import com.vinylclub.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.sql.Timestamp;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
public class UserServiceTest {
    
    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    public void testCreateUser_shouldHashPassword_andSaveUser() {
        // Arrange (préparation des données de test)
        User user = new User();
        user.setEmail("floflo@test");
        user.setPassword("flo123");
        user.setPhone("0613121516");
        user.setAuthId("auth124");
        user.setFirstName("flo");
        user.setLastName("user");

        String hashedPassword = "$2a$10$hashedExample";

        // On simule l'encodage du mot de passe
        when(passwordEncoder.encode("flo123")).thenReturn(hashedPassword);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        User result = userService.createUser(user);

        // Assert
        assertEquals("flo", result.getFirstName());
        assertEquals("user", result.getLastName());
        assertEquals("floflo@test", result.getEmail());
        assertEquals("0613121516", result.getPhone());
        assertEquals("auth124", result.getAuthId());
        assertEquals(hashedPassword, result.getPassword());
        assertNotNull(result.getCreatedAt());
        assertNotNull(result.getUpdatedAt());

        // On vérifie que le repository a bien été appelé
        verify(userRepository, times(1)).save(any(User.class));
        verify(passwordEncoder, times(1)).encode("flo123");
    }
}
