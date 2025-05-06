package com.vinylclub.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.vinylclub.user.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.query.QueryByExampleExecutor;

@Repository

public interface UserRepository extends JpaRepository<User, Long>, QueryByExampleExecutor<User> {
    
    Optional<User> findByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE u.email = :email")
    Optional<User> findUserByEmail(@Param("email") String email);
    
    @Query("SELECT u FROM User u WHERE u.firstName = :firstName")
    Optional<User> findUserByFirstName(@Param("firstName") String firstName);
    
    @Query("SELECT u FROM User u WHERE u.lastName = :lastName")
    Optional<User> findUserByLastName(@Param("lastName") String lastName);
    
}
