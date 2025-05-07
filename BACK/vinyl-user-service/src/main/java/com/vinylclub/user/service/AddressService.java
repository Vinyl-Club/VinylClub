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
        return addressRepository.addressRepository(zipCode);
    }

    public Optional<Address> findByCountry(String country) {
        return addressRepository.findByCountry(country);
    }
    public AddressDTO saveAddress(AddressDTO addressDTO) {
        Address address = new Address();
        address.setCity(addressDTO.getCity());
        address.setZipCode(addressDTO.getZipCode());
        address.setCountry(addressDTO.getCountry());
        Address savedAddress = addressRepository.save(address);
        return new AddressDTO(savedAddress.getId(), savedAddress.getCity(), savedAddress.getZipCode(), savedAddress.getCountry());
    }

    public void deleteAddress(Long id) {
        addressRepository.deleteById(id);
    }

    public AddressDTO updateAddress(Long id, AddressDTO addressDTO) {
        Address address = addressRepository.findById(id).orElseThrow(() -> new RuntimeException("Address not found"));
        
        address.setCity(addressDTO.getCity());
        address.setZipCode(addressDTO.getZipCode());
        address.setCountry(addressDTO.getCountry());
        addressRepository.save(address);
        return addressDTO;
    }



        public AddressDTO getAddressById(Long id) {
            // Implement the logic to retrieve the address by ID
            // For example, return a mock AddressDTO for now
            return new AddressDTO(id, "City", "zip", "Country");
        }
    }
