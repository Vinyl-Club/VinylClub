FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY target/vinyl-discovery-service-0.0.1-SNAPSHOT.jar app.jar

# Port Eureka standard
EXPOSE 8761

ENTRYPOINT ["java", "-jar", "app.jar"]