FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn package -DskipTests 

FROM eclipse-temurin:21-jdk
COPY --from=build /target/vinyl-discovery-service-0.0.1-SNAPSHOT.jar app.jar

# Port Eureka standard
EXPOSE 8761

ENTRYPOINT ["java", "-jar", "app.jar"]