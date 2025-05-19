FROM eclipse-temurin:21-jdk

WORKDIR /app

# Copy the JAR file (replace with the exact name of your JAR)
COPY target/vinyl-user-service-0.0.1-SNAPSHOT.jar app.jar

# Expose the port on which the service runs
EXPOSE 8082

# Command to start the application
ENTRYPOINT ["java", "-jar", "app.jar"]

ENV SPRING_PROFILES_ACTIVE=docker

