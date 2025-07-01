# Runtime stage
FROM eclipse-temurin:21-jdk

WORKDIR /app

# Copy the jar from the build course
COPY target/vinyl-favorites-service-1.0.0-SNAPSHOT.jar app.jar

# Expose the port
EXPOSE 8084

# Order to start the application
ENTRYPOINT ["java", "-jar", "app.jar"]