# Runtime stage
FROM eclipse-temurin:21-jdk

WORKDIR /app

# Copier le JAR depuis le stage de build
COPY target/vinyl-favorites-service-1.0.0-SNAPSHOT.jar app.jar

# Exposer le port
EXPOSE 8084

# Commande pour démarrer l'application
ENTRYPOINT ["java", "-jar", "app.jar"]