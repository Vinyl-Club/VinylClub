package com.vinylclub.user.service;

import com.vinylclub.user.dto.CreateUserRequest;
import com.vinylclub.user.entity.Address;
import com.vinylclub.user.entity.User;
import com.vinylclub.user.repository.AddressRepository;
import com.vinylclub.user.repository.UserRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private AddressRepository addressRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    public void testCreateUser_shouldHashPassword_andSaveUser() {
        CreateUserRequest request = new CreateUserRequest();
        request.setEmail("floflo@test");
        request.setPassword("flo123456789!");
        request.setPhone("0613121516");
        request.setFirstName("flo");
        request.setLastName("user");
        request.setCity("Paris");

        String hashedPassword = "$2a$10$hashedExample";

        when(passwordEncoder.encode("flo123456789!"))
                .thenReturn(hashedPassword);

        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> {
                    User saved = invocation.getArgument(0);
                    saved.setId(1L);
                    return saved;
                });

        User result = userService.createUser(request);

        assertEquals("flo", result.getFirstName());
        assertEquals("user", result.getLastName());
        assertEquals("floflo@test", result.getEmail());
        assertEquals("0613121516", result.getPhone());
        assertEquals(hashedPassword, result.getPassword());
        assertNotNull(result.getCreatedAt());
        assertNotNull(result.getUpdatedAt());

        verify(userRepository, times(1)).save(any(User.class));
        verify(passwordEncoder, times(1)).encode("flo123456789!");

        verify(addressRepository, times(1)).save(argThat(address ->
                "Paris".equals(address.getCity())
                        && address.getUser() != null
                        && address.getUser().getId().equals(1L)
        ));
    }
}