package com.vinylclub.user.service;

import java.util.List;
import java.sql.Timestamp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import com.vinylclub.user.entity.User;
import com.vinylclub.user.entity.UserRole;
import com.vinylclub.user.entity.Address;
import com.vinylclub.user.repository.UserRepository;
import com.vinylclub.user.repository.AddressRepository;
import com.vinylclub.user.dto.UserDTO;
import com.vinylclub.user.dto.UserPublicDTO;
import com.vinylclub.user.dto.CreateUserRequest;

@Service
public class UserService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AddressRepository addressRepository;

    public List<UserDTO> getAllUsers() {
        // Implementation for retrieving all users
        return userRepository.findAll().stream().map(user -> {
            return new UserDTO(
            user.getId(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getPhone(),
            user.getRole(),
            user.getUpdatedAt()
            );
        }).toList(); // Convert List<User> to List<UserDTO>
    }
    
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id).orElse(null);
            if (user != null) {
                return convertToDTO(user);
            }
        return null;
    }

    public UserPublicDTO getPublicUserById(Long id) {
        UserDTO user = getUserById(id);
        if (user == null) return null;

        return new UserPublicDTO(
            user.getId(),
            user.getFirstName(),
            user.getLastName()
        );
    }

    // Création d'un user avec sa ville, neccéssaire pour la création d'une annoce, mhétode appeler par auth service 
    @Transactional
    public User createUser(CreateUserRequest request) {
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());

        user.setRole(UserRole.USER);

        Timestamp now = new Timestamp(System.currentTimeMillis());
        user.setCreatedAt(now);
        user.setUpdatedAt(now);

        User savedUser = userRepository.save(user);

        Address address = new Address();
        address.setCity(request.getCity());
        address.setUser(savedUser);

        addressRepository.save(address);

        return savedUser;
    }


    // Update user details

    public User updateUser(Long id, User userDetails) {
        User existingUser = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        existingUser.setFirstName(userDetails.getFirstName());
        existingUser.setLastName(userDetails.getLastName());
        existingUser.setEmail(userDetails.getEmail());
        existingUser.setPhone(userDetails.getPhone());
        if (userDetails.getPassword() != null && !userDetails.getPassword().isBlank()) {
            existingUser.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }
        existingUser.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        
        return userRepository.save(existingUser);
    }
    
    public UserDTO login(String email, String rawPassword) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new RuntimeException("incorrect password");
        }

        return new UserDTO(
            user.getId(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getPhone(),
            user.getRole(),
            user.getUpdatedAt()
        );
    }

    //find user by email
    public UserDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        return new UserDTO(
            user.getId(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getPhone(),
            user.getRole(),
            user.getUpdatedAt()
        );
    }
    
    public void deleteUser(Long id) {
        // Implement the logic to delete a user by ID
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user); // Delete the user from the database
        System.out.println("User deleted successfully"); // Log a success message
    }


    public boolean validatePassword(String email, String rawPassword) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user != null) {
            return passwordEncoder.matches(rawPassword, user.getPassword());
        }
        return false;
    }
    private UserDTO convertToDTO(User user) {
        return new UserDTO(
            user.getId(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getPhone(),
            user.getRole(),
            user.getUpdatedAt()
        );
    }
}
