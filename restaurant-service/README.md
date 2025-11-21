# Restaurant Service

A Spring Boot microservice for managing restaurant data with REST API endpoints, PostgreSQL database, and Eureka service discovery.

## Overview

This microservice provides CRUD operations for restaurant management using Spring Data REST, which automatically exposes RESTful endpoints without requiring explicit controller implementation.

## Features

- ✅ **Spring Data REST**: Automatic REST API generation
- ✅ **Spring Data JPA**: Database operations with JPA
- ✅ **PostgreSQL**: Relational database for data persistence
- ✅ **Eureka Discovery Client**: Service registration and discovery
- ✅ **Lombok**: Reduces boilerplate code
- ✅ **Sample Data**: Pre-loaded restaurant data for testing

## Restaurant Entity

The `Restaurant` entity includes the following fields:

| Field | Type | Description |
|-------|------|-------------|
| id | Long | Primary key (auto-generated) |
| name | String | Restaurant name |
| address | String | Restaurant address |
| cuisine | String | Type of cuisine |
| rating | Double | Restaurant rating (0.0 - 5.0) |
| latitude | Double | Geographic latitude |
| longitude | Double | Geographic longitude |

## Prerequisites

Before running this service, ensure you have:

- Java 21 or higher
- Maven 3.6+
- PostgreSQL 12+ installed and running
- Eureka Server running on port 8761

## Database Setup

### 1. Install PostgreSQL

If you don't have PostgreSQL installed, download and install it from [postgresql.org](https://www.postgresql.org/download/).

### 2. Create Database

Open PostgreSQL command line or pgAdmin and create the database:

```sql
CREATE DATABASE restaurantsdb;
```

### 3. Configure Credentials

The default configuration uses:
- **Username**: `postgres`
- **Password**: `postgres`
- **Database**: `restaurantsdb`
- **Port**: `5432`

To change these, edit `application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/restaurantsdb
    username: your_username
    password: your_password
```

### 4. Verify Connection

Test your PostgreSQL connection:

```bash
psql -U postgres -d restaurantsdb
```

## Configuration

### application.yml

```yaml
server:
  port: 8081

spring:
  application:
    name: restaurant-service
  datasource:
    url: jdbc:postgresql://localhost:5432/restaurantsdb
    username: postgres
    password: postgres
  jpa:
    hibernate:
      ddl-auto: update
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
    show-sql: true

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka
```

### Key Configuration Details

- **Port**: 8081
- **Service Name**: restaurant-service
- **Hibernate DDL Auto**: `update` (creates/updates tables automatically)
- **Show SQL**: `true` (logs SQL queries for debugging)

## How to Run

### Step 1: Start PostgreSQL

Ensure PostgreSQL is running:

```powershell
# Check PostgreSQL status (Windows)
Get-Service postgresql*

# If not running, start it
Start-Service postgresql-x64-15  # Adjust version number
```

### Step 2: Start Eureka Server

```powershell
cd ..\eureka-server
.\mvnw.cmd spring-boot:run
```

Wait for Eureka to start on port 8761.

### Step 3: Start Restaurant Service

#### Using Maven Wrapper (Recommended)

**On Windows:**
```powershell
.\mvnw.cmd spring-boot:run
```

**On Unix/Linux/Mac:**
```bash
./mvnw spring-boot:run
```

#### Using Maven (if installed globally)

```bash
mvn spring-boot:run
```

#### Building and Running the JAR

1. Build the project:
   ```bash
   mvn clean package
   ```

2. Run the JAR file:
   ```bash
   java -jar target/restaurant-service-0.0.1-SNAPSHOT.jar
   ```

### Step 4: Verify Service is Running

Check the service health:
```bash
curl http://localhost:8081/actuator/health
```

Verify registration with Eureka:
```
http://localhost:8761
```

You should see `RESTAURANT-SERVICE` listed.

## API Endpoints

Spring Data REST automatically exposes the following endpoints:

### Base URL

```
http://localhost:8081/restaurants
```

### Available Endpoints

#### 1. Get All Restaurants

```bash
GET http://localhost:8081/restaurants
```

**Example using curl:**
```bash
curl http://localhost:8081/restaurants
```

#### 2. Get Restaurant by ID

```bash
GET http://localhost:8081/restaurants/{id}
```

**Example:**
```bash
curl http://localhost:8081/restaurants/1
```

#### 3. Create New Restaurant

```bash
POST http://localhost:8081/restaurants
Content-Type: application/json

{
  "name": "New Restaurant",
  "address": "123 Main St",
  "cuisine": "Italian",
  "rating": 4.5,
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

**Example using curl:**
```bash
curl -X POST http://localhost:8081/restaurants ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"New Restaurant\",\"address\":\"123 Main St\",\"cuisine\":\"Italian\",\"rating\":4.5,\"latitude\":40.7128,\"longitude\":-74.0060}"
```

#### 4. Update Restaurant

```bash
PUT http://localhost:8081/restaurants/{id}
Content-Type: application/json

{
  "name": "Updated Restaurant",
  "address": "456 Park Ave",
  "cuisine": "French",
  "rating": 4.8,
  "latitude": 40.7614,
  "longitude": -73.9776
}
```

**Example using curl:**
```bash
curl -X PUT http://localhost:8081/restaurants/1 ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Updated Restaurant\",\"address\":\"456 Park Ave\",\"cuisine\":\"French\",\"rating\":4.8,\"latitude\":40.7614,\"longitude\":-73.9776}"
```

#### 5. Patch Restaurant (Partial Update)

```bash
PATCH http://localhost:8081/restaurants/{id}
Content-Type: application/json

{
  "rating": 4.9
}
```

#### 6. Delete Restaurant

```bash
DELETE http://localhost:8081/restaurants/{id}
```

**Example using curl:**
```bash
curl -X DELETE http://localhost:8081/restaurants/1
```

### Pagination and Sorting

Spring Data REST supports pagination and sorting:

```bash
# Get page 0 with 5 items
GET http://localhost:8081/restaurants?page=0&size=5

# Sort by rating descending
GET http://localhost:8081/restaurants?sort=rating,desc

# Sort by name ascending
GET http://localhost:8081/restaurants?sort=name,asc

# Combine pagination and sorting
GET http://localhost:8081/restaurants?page=0&size=10&sort=rating,desc
```

## Sample Data

The service includes 15 pre-loaded restaurants with various cuisines:

1. The Italian Corner (Italian)
2. Sushi Palace (Japanese)
3. Taco Fiesta (Mexican)
4. Le Petit Bistro (French)
5. Dragon Wok (Chinese)
6. Curry House (Indian)
7. The Steakhouse (American)
8. Mediterranean Delight (Mediterranean)
9. Bangkok Street Food (Thai)
10. Pizzeria Romana (Italian)
11. The Burger Joint (American)
12. Pho Vietnam (Vietnamese)
13. Greek Taverna (Greek)
14. BBQ Smokehouse (BBQ)
15. Vegetarian Garden (Vegetarian)

## Access Through API Gateway

If the API Gateway is running on port 8888:

```bash
# Access via gateway
curl http://localhost:8888/restaurants

# Direct access
curl http://localhost:8081/restaurants
```

## Project Structure

```
restaurant-service/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/restaurant/restaurant_service/
│   │   │       ├── RestaurantServiceApplication.java
│   │   │       ├── entity/
│   │   │       │   └── Restaurant.java
│   │   │       └── repository/
│   │   │           └── RestaurantRepository.java
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── application.yml
│   │       └── data.sql
│   └── test/
│       └── java/
│           └── com/restaurant/restaurant_service/
│               └── RestaurantServiceApplicationTests.java
├── pom.xml
└── README.md
```

## Dependencies

Key dependencies used in this service:

- **Spring Boot Starter Data JPA**: JPA support
- **Spring Boot Starter Data REST**: REST API generation
- **Spring Boot Starter Web MVC**: Web framework
- **Spring Cloud Netflix Eureka Client**: Service discovery
- **PostgreSQL Driver**: PostgreSQL database connectivity
- **Lombok**: Code generation for entities

## Database Schema

The `restaurants` table is created automatically with the following schema:

```sql
CREATE TABLE restaurants (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    cuisine VARCHAR(255) NOT NULL,
    rating DOUBLE PRECISION NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL
);
```

## Troubleshooting

### Database Connection Issues

**Problem**: Service fails to connect to PostgreSQL.

**Solutions**:
1. Verify PostgreSQL is running:
   ```bash
   Get-Service postgresql*
   ```
2. Check database exists:
   ```sql
   \l  # List all databases in psql
   ```
3. Verify credentials in `application.yml`
4. Check PostgreSQL is listening on port 5432:
   ```bash
   netstat -an | findstr 5432
   ```

### Port Already in Use

**Problem**: Port 8081 is already in use.

**Solution**: Change the port in `application.yml`:
```yaml
server:
  port: 8082  # or any available port
```

### Sample Data Not Loading

**Problem**: `data.sql` is not being executed.

**Solution**: The data.sql file requires specific configuration. Add to `application.yml`:
```yaml
spring:
  sql:
    init:
      mode: always
```

Or manually insert data using psql or pgAdmin.

### Eureka Registration Failed

**Problem**: Service not showing in Eureka Dashboard.

**Solutions**:
1. Ensure Eureka Server is running on port 8761
2. Check `eureka.client.service-url.defaultZone` in configuration
3. Verify network connectivity
4. Wait 30 seconds for registration to complete

### Hibernate Errors

**Problem**: Table creation or SQL errors.

**Solutions**:
1. Check PostgreSQL dialect is correct
2. Verify `spring.jpa.hibernate.ddl-auto` is set to `update`
3. Check PostgreSQL user has CREATE TABLE permissions
4. Review SQL logs (show-sql: true)

## Testing with Postman or Insomnia

### Import Sample Requests

Create a collection with these requests:

1. **Get All**: `GET http://localhost:8081/restaurants`
2. **Get By ID**: `GET http://localhost:8081/restaurants/1`
3. **Create**: `POST http://localhost:8081/restaurants` with JSON body
4. **Update**: `PUT http://localhost:8081/restaurants/1` with JSON body
5. **Delete**: `DELETE http://localhost:8081/restaurants/1`

## Monitoring and Health Checks

### Health Check

```bash
curl http://localhost:8081/actuator/health
```

### Database Status

Check if tables are created:
```sql
\dt  # List tables in psql
SELECT * FROM restaurants;  # View data
```

## Production Considerations

### Security

For production:
- Use environment variables for database credentials
- Enable Spring Security
- Configure HTTPS/TLS
- Implement authentication and authorization
- Use connection pooling (HikariCP is default)

### Performance

- Add database indexes for frequently queried fields
- Configure proper connection pool settings
- Enable caching where appropriate
- Monitor query performance

### High Availability

- Deploy multiple instances
- Use a managed PostgreSQL service
- Configure proper health checks
- Implement circuit breakers

## Environment Variables

Override configuration using environment variables:

```bash
# Database configuration
export SPRING_DATASOURCE_URL=jdbc:postgresql://prod-server:5432/restaurantsdb
export SPRING_DATASOURCE_USERNAME=prod_user
export SPRING_DATASOURCE_PASSWORD=secure_password

# Server port
export SERVER_PORT=8081

# Eureka server
export EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka
```

## Additional Resources

- [Spring Data REST Documentation](https://spring.io/projects/spring-data-rest)
- [Spring Data JPA Documentation](https://spring.io/projects/spring-data-jpa)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Spring Cloud Netflix Documentation](https://spring.io/projects/spring-cloud-netflix)
- [Lombok Documentation](https://projectlombok.org/)

## License

This project is part of the restaurant microservices architecture.

