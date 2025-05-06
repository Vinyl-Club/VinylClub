package com.vinylclub.user.service;


import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import com.vinylclub.user.entity.User;
import com.vinylclub.user.repository.UserRepository;
import com.vinylclub.user.dto.UserDTO;
import java.sql.Timestamp;

public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<UserDTO> getAllUsers() {
        // Implementation for retrieving all users
        return userRepository.findAll().stream().map(user -> {
            UserDTO userDTO = new UserDTO();
            userDTO.setId(user.getId());
            userDTO.setFirstName(user.getFirstName());
            userDTO.setLastName(user.getLastName());
            userDTO.setEmail(user.getEmail());
            userDTO.setPhone(user.getPhone());
            return userDTO;
        }).toList(); // Convert List<User> to List<UserDTO>
    }
    
   
    public UserDTO getUserById(Long id) {
        // Implement the logic to retrieve a user by ID
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setFirstName(user.getFirstName());
        userDTO.setLastName(user.getLastName());
        userDTO.setEmail(user.getEmail());
        userDTO.setPhone(user.getPhone());
        return userDTO;
    }

    public User createUser(User user) {
        // Implement the logic to create a new user
        user.setFirstName(user.getFirstName()); // Set the first name
        user.setLastName(user.getLastName()); // Set the last name
        user.setEmail(user.getEmail()); // Set the email
        user.setPhone(user.getPhone()); // Set the phone number
        user.setAuthId(user.getAuthId()); // Set the auth ID
        user.setPassword(user.getPassword()); // Set the password
        user.setCreatedAt(new Timestamp(System.currentTimeMillis())); // Set the created timestamp
        user.setUpdatedAt(new Timestamp(System.currentTimeMillis())); // Set the updated timestamp

        userRepository.save(user); // Save the user to the database
        return user; // Return the created user

    }



    public UserDTO updateUser(Long id, UserDTO userDTO) {
        // Implement the logic to update an existing user
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setEmail(userDTO.getEmail());
        user.setPhone(userDTO.getPhone());
        user.setUpdatedAt(new Timestamp(System.currentTimeMillis())); // Set the updated timestamp
        // For example:
        return new UserDTO(); // Replace with actual implementation
    }

    public void deleteUser(Long id) {
        // Implement the logic to delete a user by ID
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user); // Delete the user from the database
        System.out.println("User deleted successfully"); // Log a success message
}
}
