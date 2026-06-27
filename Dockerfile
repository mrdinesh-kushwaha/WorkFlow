# ===== Stage 1: Build Frontend =====
# FROM node:18-alpine AS frontend-build
# WORKDIR /app/frontend
# COPY frontend/package.json ./
# RUN npm install --legacy-peer-deps
# COPY frontend/ ./
# ENV REACT_APP_API_URL=""
# RUN npm run build

# ===== Stage 2: Build Backend =====
FROM maven:3.9-eclipse-temurin-17 AS backend-build
WORKDIR /app/backend

COPY backend/pom.xml ./
RUN mvn dependency:go-offline -q

COPY backend/src ./src

# Copy built frontend into Spring Boot static resources
# COPY --from=frontend-build /app/frontend/build ./src/main/resources/static

RUN mvn package -DskipTests -q

# ===== Stage 3: Runtime =====
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY --from=backend-build /app/backend/target/taskmanager-backend-1.0.0.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-jar", "/app/app.jar"]