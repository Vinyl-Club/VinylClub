FROM eclipse-temurin:21-jdk

WORKDIR /app

# Copier le fichier JAR (remplacez par le nom exact de votre JAR)
COPY target/vinyl-user-service-0.0.1-SNAPSHOT.jar app.jar

# Exposer le port sur lequel le service s'exécute
EXPOSE 8082

# Commande pour démarrer l'application
ENTRYPOINT ["java", "-jar", "app.jar"]