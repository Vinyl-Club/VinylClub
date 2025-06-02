package com.vinylclub.user.repository;

import org.springframework.stereotype.Repository;
import com.vinylclub.user.entity.Address;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


@Repository
public interface AddressRepository extends org.springframework.data.jpa.repository.JpaRepository<Address, Long> {
    @Query("SELECT a FROM Address a WHERE a.city = :city")
    Optional<Address> findByCity(@Param("city") String city);

    @Query("SELECT a FROM Address a WHERE a.zipCode = :zipCode")
    Optional<Address> findByZipCode(@Param("zipCode") String zipCode);

    @Query("SELECT a FROM Address a WHERE a.country = :country")
    Optional<Address> findByCountry(@Param("country") String country);

    @Query("SELECT a FROM Address a WHERE a.street = :street")
    Optional<Address> findByStreet(@Param("street") String street);

    @Query("SELECT a FROM Address a WHERE a.user.id = :userId")
    Optional<Address> findByUserId(@Param("userId") Long userId);
    
}