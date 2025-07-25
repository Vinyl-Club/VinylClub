package com.vinylclub.catalog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.vinylclub.catalog")
@EntityScan("com.vinylclub.catalog.entity")
@EnableJpaRepositories("com.vinylclub.catalog.repository")
@EnableFeignClients("com.vinylclub.catalog.client")
public class CatalogServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(CatalogServiceApplication.class, args);
    }
}