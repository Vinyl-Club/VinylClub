package com.vinylclub.user.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.*;

import com.vinylclub.user.dto.AddressDTO;
import com.vinylclub.user.entity.Address;
import com.vinylclub.user.service.AddressService;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    @Autowired
    private AddressService addressService;

    @GetMapping
    public List<AddressDTO> getAllAddress() {
        return addressService.getAllAddress();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AddressDTO> getAddressById(
            @RequestHeader("X-User-Id") Long requesterId,
            @PathVariable Long id
    ) {
        AddressDTO address = addressService.getAddressById(id);

        // IMPORTANT : on compare l'owner de l'adresse au requesterId
        if (address.getUser() == null || address.getUser().getId() == null
                || !address.getUser().getId().equals(requesterId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(address);
    }

    @PostMapping
    public ResponseEntity<Address> createAddress(
            @RequestHeader("X-User-Id") Long requesterId,
            @RequestBody Address address
    ) {
        if (address.getUser() == null || address.getUser().getId() == null
                || !address.getUser().getId().equals(requesterId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Address createdAddress = addressService.saveAddress(address);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdAddress);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Address> updateAddress(
            @RequestHeader("X-User-Id") Long requesterId,
            @PathVariable Long id,
            @RequestBody Address address
    ) {
        if (address.getUser() == null || address.getUser().getId() == null
                || !address.getUser().getId().equals(requesterId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Address updatedAddress = addressService.updateAddress(id, address);
        return ResponseEntity.ok(updatedAddress);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(
            @RequestHeader("X-User-Id") Long requesterId,
            @PathVariable Long id
    ) {
        AddressDTO address = addressService.getAddressById(id);

        if (address.getUser() == null || address.getUser().getId() == null
                || !address.getUser().getId().equals(requesterId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        addressService.deleteAddress(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<List<AddressDTO>> getAddressesByUserId(
            @RequestHeader("X-User-Id") Long requesterId,
            @PathVariable Long userId
    ) {
        if (!userId.equals(requesterId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<AddressDTO> addresses = addressService.getAddressesByUserId(userId);
        return ResponseEntity.ok(addresses);
    }

    @GetMapping("/public/users/{userId}/city")
    public ResponseEntity<String> getUserCity(@PathVariable Long userId) {
        return addressService.getMainCityByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

}
