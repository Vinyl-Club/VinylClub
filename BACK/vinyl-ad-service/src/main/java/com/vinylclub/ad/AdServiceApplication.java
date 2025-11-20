package com.vinylclub.ad;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication 
public class AdServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(AdServiceApplication.class, args);
        // This is a simple print statement to indicate that the application has started.

        System.out.println("Hello, Ad Service active!");

    }
}
