package com.vinylclub.at;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication 
public class AtServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(AtServiceApplication.class, args);
        // This is a simple print statement to indicate that the application has started.

        System.out.println("Hello, At Service active!");

    }
}
