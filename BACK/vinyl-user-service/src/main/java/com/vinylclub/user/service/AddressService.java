package com.vinylclub.user.service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.vinylclub.user.repository.AddressRepository;
import com.vinylclub.user.entity.Address;
import com.vinylclub.user.dto.AddressDTO;
import com.vinylclub.user.dto.UserDTO;

/**
 * Service class for managing Address entities.
 * Provides methods for CRUD operations and DTO conversion.
 */
@Service
public class AddressService {
    @Autowired
    private AddressRepository addressRepository;

    /**
     * Retrieves all addresses and converts them to DTOs.
     * @return List of AddressDTO
     */
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

    /**
     * Retrieves an address by its ID and converts it to DTO.
     * @param id Address ID
     * @return AddressDTO
     */
    public AddressDTO getAddressById(Long id) {
        Address address = addressRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Address not found with id: " + id));
        return convertToDTO(address);
    }

    /**
     * Saves a new address entity.
     * @param address Address entity to save
     * @return Saved Address entity
     */
    public Address saveAddress(Address address) {
        return addressRepository.save(address);
    }

    /**
     * Deletes an address by its ID.
     * @param id Address ID
     */
    public void deleteAddress(Long id) {
        addressRepository.deleteById(id);
    }

    /**
     * Updates an existing address with new details.
     * @param id Address ID
     * @param addressDetails New address details
     * @return Updated Address entity
     */
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

    /**
     * Converts an Address entity to AddressDTO.
     * @param address Address entity
     * @return AddressDTO
     */
    private AddressDTO convertToDTO(Address address) {
        UserDTO userDTO = null;
        if (address.getUser() != null) {
            userDTO = new UserDTO(
                address.getUser().getId(),
                address.getUser().getEmail(),
                address.getUser().getFirstName(),
                address.getUser().getLastName(),
                address.getUser().getPhone(),
                address.getUser().getRole(),
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

    public List<AddressDTO> getAddressesByUserId(Long userId) {
        Optional<Address> addressOpt = addressRepository.findByUserId(userId);
        
        return addressOpt
            .map(address -> List.of(address))  // Convert to the list if present
            .orElse(Collections.emptyList())   // Empty list if absent
            .stream()
            .map(this::convertToDTO)
            .toList();
    }

    public Optional<String> getMainCityByUserId(Long userId) {
        return addressRepository.findFirstByUser_Id(userId)
                .map(Address::getCity)
                .filter(city -> city != null && !city.isBlank());
    }
}