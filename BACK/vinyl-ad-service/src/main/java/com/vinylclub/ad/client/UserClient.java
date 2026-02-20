package com.vinylclub.ad.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import com.vinylclub.ad.client.dto.UserSummaryDTO;
import com.vinylclub.ad.client.dto.AddressAdDTO;

/**
 *Feign client to vinyl-user-service.
 *Used to retrieve user information and addresses from ad-service.
 */
@FeignClient(name = "vinyl-user-service")
public interface UserClient {

    @GetMapping("/api/users/public/{id}")
    UserSummaryDTO getUserById(@PathVariable("id") Long id);

    // @GetMapping("/api/addresses/{id}")
    // AddressAdDTO getAddressById(@PathVariable("id") Long id);

    @GetMapping("/api/addresses/users/{userId}")
    java.util.List<AddressAdDTO> getAddressesByUserId(@PathVariable("userId") Long userId);

    @GetMapping("/api/addresses/public/users/{userId}/city")
    String getMainCityByUserId(@PathVariable("userId") Long userId);

}
