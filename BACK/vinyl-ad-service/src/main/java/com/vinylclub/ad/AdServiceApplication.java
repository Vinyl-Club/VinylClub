package com.vinylclub.ad;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication(scanBasePackages = "com.vinylclub.ad")
@EntityScan("com.vinylclub.ad.entity")
@EnableJpaRepositories("com.vinylclub.ad.repository")
@EnableFeignClients("com.vinylclub.ad.client")
public class AdServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(AdServiceApplication.class, args);
        // This is a simple print statement to indicate that the application has
        // started.

        System.out.println("Hello, Ad Service active!");

    }
}
