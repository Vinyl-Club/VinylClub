package com.vinylclub.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class GatewayApplication {
	public static void main(String[] args) {
		System.setProperty("server.port", "8090");
		SpringApplication.run(GatewayApplication.class, args);
	}

}