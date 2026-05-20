FROM maven:eclipse-temurin:21-jdk AS build

WORKDIR /app

COPY --from=build /target/vinyl-discovery-service-0.0.1-SNAPSHOT.jar app.jar

# Port Eureka standard
EXPOSE 8761

ENTRYPOINT ["java", "-jar", "app.jar"]