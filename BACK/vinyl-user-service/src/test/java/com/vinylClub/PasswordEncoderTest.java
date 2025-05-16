package com.vinylclub;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;

public class PasswordEncoderTest {

    @Test
    public void testPasswordMatching() {
         // Create a BCryptPasswordEncoder instance (used to hash passwords)
        PasswordEncoder encoder = new BCryptPasswordEncoder();

        String rawPassword = "123456"; // Raw password to test
        String hashedPassword = encoder.encode(rawPassword); // Encode (hash) the raw password

        // The encoder should correctly match the original password with its hash
        assertTrue(encoder.matches("123456", hashedPassword));
        // This should fail because the password doesn't match the hash
        assertFalse(encoder.matches("wrongpassword", hashedPassword));
    }
}