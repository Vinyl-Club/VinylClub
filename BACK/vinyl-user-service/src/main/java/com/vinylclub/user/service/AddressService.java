package com.vinylclub.user.service;
import com.vinylclub.user.repository.AddressRepository;
import com.vinylclub.user.entity.Address;  
import com.vinylclub.user.dto.AddressDTO;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class AddressService {
    @Autowired
    private AddressRepository addressRepository;
    
    public Optional<Address> findByCity(String city) {
        return addressRepository.findByCity(city);
    }
    
    public Optional<Address> findByZipCode(String zipCode) {
        return addressRepository.findByZipCode(zipCode); // Correction
    }
    
    public Optional<Address> findByCountry(String country) {
        return addressRepository.findByCountry(country);
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
        
        // Mettre à jour les champs de l'adresse existante
        existingAddress.setStreet(addressDetails.getStreet());
        existingAddress.setCity(addressDetails.getCity());
        existingAddress.setZipCode(addressDetails.getZipCode());
        existingAddress.setCountry(addressDetails.getCountry());
        
        // Sauvegarder l'adresse existante avec les modifications
        return addressRepository.save(existingAddress);
    }
    
    public AddressDTO getAddressById(Long id) {
        Address address = addressRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Address not found with id: " + id));
        
        // Convertir l'entité en DTO
        return new AddressDTO(
            address.getId(),
            address.getCity(),
            address.getZipCode(),
            address.getCountry()
        );
    }
}