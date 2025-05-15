package com.vinylclub.gateway.config;

public class RouteConfig {
    // Define your routes here
    // For example:
    public static final String VINYL_SERVICE_URL = "http://vinyl-service";
    public static final String VINYL_SERVICE_ROUTE = "/vinyl/**";
    public static final String VINYL_SERVICE_PATH = "/vinyl";
    
    public static final String USER_SERVICE_URL = "http://user-service";
    public static final String USER_SERVICE_ROUTE = "/user/**";
    public static final String USER_SERVICE_PATH = "/user";


    public static final String CATALOG_SERVICE_URL = "http://catalog-service";
    public static final String CATALOG_SERVICE_ROUTE = "/catalog/**";
    public static final String CATALOG_SERVICE_PATH = "/catalog";
}
