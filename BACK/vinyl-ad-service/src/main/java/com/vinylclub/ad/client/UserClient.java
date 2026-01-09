package com.vinylclub.ad.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import com.vinylclub.ad.client.dto.UserSummaryDTO;
import com.vinylclub.ad.client.dto.AddressAdDTO;

@FeignClient(name = "vinyl-user-service")
public interface UserClient {

    @GetMapping("/api/users/{id}")
    UserSummaryDTO getUserById(@PathVariable("id") Long id);

    @GetMapping("/api/addresses/{id}")
    AddressAdDTO getAddressById(@PathVariable("id") Long id);

    @GetMapping("/api/addresses/users/{userId}")
    java.util.List<AddressAdDTO> getAddressesByUserId(@PathVariable("userId") Long userId);

    /*/ gestion d'erreur si user n'existe pas
     */
}
