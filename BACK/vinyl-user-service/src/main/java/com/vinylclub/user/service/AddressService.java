package com.vinylclub.user.service;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.vinylclub.user.repository.AddressRepository;
import com.vinylclub.user.entity.Address;
import com.vinylclub.user.dto.AddressDTO;
import com.vinylclub.user.dto.UserDTO;

@Service
public class AddressService {
    @Autowired
    private AddressRepository addressRepository;

  public List<AddressDTO> getAllAddress() {
    try {
        List<Address> addresses = addressRepository.findAll();
        System.out.println("Found " + addresses.size() + " addresses");
        
        List<AddressDTO> dtos = new java.util.ArrayList<>();
        for (Address address : addresses) {
            try {
                AddressDTO dto = convertToDTO(address);
                dtos.add(dto);
            } catch (Exception e) {
                System.err.println("Error converting address id " + address.getId() + ": " + e.getMessage());
                e.printStackTrace();
            }
        }
        
        return dtos;
    } catch (Exception e) {
        System.err.println("Error in getAllAddress: " + e.getMessage());
        e.printStackTrace();
        return java.util.Collections.emptyList(); // Return empty list instead of throwing
    }
}

    public AddressDTO getAddressById(Long id) {
        Address address = addressRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Address not found with id: " + id));
        return convertToDTO(address);
    }

    public Address saveAddress(Address address) {
        return addressRepository.save(address);
    }

    public void deleteAddress(Long id) {
        addressRepository.deleteById(id);
    }

    public Address updateAddress(Long id, Address addressDetails) {
        Address existingAddress = addressRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Address not found with id: " + id));

        existingAddress.setStreet(addressDetails.getStreet());
        existingAddress.setCity(addressDetails.getCity());
        existingAddress.setZipCode(addressDetails.getZipCode());
        existingAddress.setCountry(addressDetails.getCountry());
        existingAddress.setUser(addressDetails.getUser());

        return addressRepository.save(existingAddress);
    }

    // Méthode de conversion en DTO
    private AddressDTO convertToDTO(Address address) {
    UserDTO userDTO = null;
    if (address.getUser() != null) {
        userDTO = new UserDTO(
            address.getUser().getId(),
            address.getUser().getEmail(),
            address.getUser().getFirstName(),
            address.getUser().getLastName(),
            address.getUser().getPhone(),
            address.getUser().getUpdatedAt()
        );
    }
    return new AddressDTO(
        address.getId(),
        address.getCity(),
        address.getZipCode(),
        address.getCountry(),
        address.getStreet(),
        userDTO
    );
}
}
