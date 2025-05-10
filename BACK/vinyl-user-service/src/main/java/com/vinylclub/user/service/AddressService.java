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
        return addressRepository.findAll().stream().map(this::convertToDTO).toList();
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
        UserDTO userDTO = new UserDTO(
            address.getUser().getId(),
            address.getUser().getEmail(),
            address.getUser().getFirstName(),
            address.getUser().getLastName(),
            address.getUser().getPhone(),
            address.getUser().getUpdatedAt()
        );

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
