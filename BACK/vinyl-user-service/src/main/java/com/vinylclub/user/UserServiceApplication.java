package com.vinylclub.user;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication 
public class UserServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
        // This is a simple print statement to indicate that the application has started.

        System.out.println("Hello, User Service active!");

    }
}
