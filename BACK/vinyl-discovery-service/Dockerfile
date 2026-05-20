# ---- Stage 1 : Build Maven ----
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copie du pom.xml en premier (optimise le cache Docker)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copie du code source
COPY src ./src

# Build sans les tests
RUN mvn package -DskipTests -B

# ---- Stage 2 : Image finale légère ----
FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=build /app/target/vinyl-discovery-service-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8761

ENTRYPOINT ["java", "-jar", "app.jar"]