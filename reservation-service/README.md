# Reservation Service

A Spring Boot microservice for managing restaurant reservations with REST API endpoints, PostgreSQL database, OpenFeign for inter-service communication, and Eureka service discovery.

## Overview

This microservice provides functionality to create and manage restaurant reservations. It communicates with the Restaurant Service using OpenFeign to verify restaurant availability before creating reservations.

## Features

- ✅ **Spring Web**: RESTful API endpoints
- ✅ **Spring Data JPA**: Database operations with JPA
- ✅ **PostgreSQL**: Relational database for data persistence
- ✅ **OpenFeign**: Declarative REST client for inter-service communication
- ✅ **Eureka Discovery Client**: Service registration and discovery
- ✅ **Lombok**: Reduces boilerplate code
- ✅ **Restaurant Validation**: Validates restaurant exists before creating reservation
- ✅ **Sample Data**: Pre-loaded reservation data for testing

## Reservation Entity

The `Reservation` entity includes the following fields:

| Field | Type | Description |
|-------|------|-------------|
| id | Long | Primary key (auto-generated) |
| restaurantId | Long | ID of the restaurant from restaurant-service |
| customerName | String | Name of the customer making the reservation |
| reservationTime | LocalDateTime | Date and time of the reservation |

## Prerequisites

Before running this service, ensure you have:

- Java 21 or higher
- Maven 3.6+
- PostgreSQL 12+ installed and running
- Eureka Server running on port 8761
- Restaurant Service running on port 8081

## Database Setup

### 1. Install PostgreSQL

If you don't have PostgreSQL installed, download and install it from [postgresql.org](https://www.postgresql.org/download/).

### 2. Create Database

Open PostgreSQL command line or pgAdmin and create the database:

```sql
CREATE DATABASE reservationsdb;
```

### 3. Configure Credentials

The default configuration uses:
- **Username**: `postgres`
- **Password**: `postgres`
- **Database**: `reservationsdb`
- **Port**: `5432`

To change these, edit `application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/reservationsdb
    username: your_username
    password: your_password
```

### 4. Verify Connection

Test your PostgreSQL connection:

```bash
psql -U postgres -d reservationsdb
```

## Configuration

### application.yml

```yaml
server:
  port: 8082

spring:
  application:
    name: reservation-service
  datasource:
    url: jdbc:postgresql://localhost:5432/reservationsdb
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

- **Port**: 8082
- **Service Name**: reservation-service
- **Hibernate DDL Auto**: `update` (creates/updates tables automatically)
- **Show SQL**: `true` (logs SQL queries for debugging)
- **Feign Clients**: Enabled for inter-service communication

## How to Run

### Step 1: Start PostgreSQL

Ensure PostgreSQL is running:

```powershell
# Check PostgreSQL status (Windows)
Get-Service postgresql*

# If not running, start it
Start-Service postgresql-x64-15  # Adjust version number
```

### Step 2: Start Required Services

Start services in this order:

```powershell
# Terminal 1: Eureka Server (Port 8761)
cd ..\eureka-server
.\mvnw.cmd spring-boot:run

# Terminal 2: Restaurant Service (Port 8081)
cd ..\restaurant-service
.\mvnw.cmd spring-boot:run

# Wait for both services to fully start
```

### Step 3: Start Reservation Service

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
   java -jar target/reservation-service-0.0.1-SNAPSHOT.jar
   ```

### Step 4: Verify Service is Running

Check the service health:
```bash
curl http://localhost:8082/actuator/health
```

Verify registration with Eureka:
```
http://localhost:8761
```

You should see `RESERVATION-SERVICE` listed.

## API Endpoints

### Base URL

```
http://localhost:8082/reservations
```

### Available Endpoints

#### 1. Create Reservation

```bash
POST /reservations
Content-Type: application/json

{
  "restaurantId": 1,
  "customerName": "John Doe",
  "reservationTime": "2025-11-25T19:00:00"
}
```

**Example using curl:**
```bash
curl -X POST http://localhost:8082/reservations ^
  -H "Content-Type: application/json" ^
  -d "{\"restaurantId\":1,\"customerName\":\"John Doe\",\"reservationTime\":\"2025-11-25T19:00:00\"}"
```

**Response:**
- Status: `201 Created`
- Body: Created reservation with generated ID

**Notes:**
- Validates that the restaurant exists by calling restaurant-service via Feign
- Returns `400 Bad Request` if restaurant doesn't exist

#### 2. Get All Reservations

```bash
GET /reservations
```

**Example using curl:**
```bash
curl http://localhost:8082/reservations
```

**Response:**
- Status: `200 OK`
- Body: Array of all reservations

#### 3. Get Reservation by ID

```bash
GET /reservations/{id}
```

**Example using curl:**
```bash
curl http://localhost:8082/reservations/1
```

**Response:**
- Status: `200 OK` if found
- Status: `404 Not Found` if not found
- Body: Reservation details

## OpenFeign Integration

### RestaurantClient

The service uses OpenFeign to communicate with the Restaurant Service:

```java
@FeignClient(name = "restaurant-service")
public interface RestaurantClient {
    @GetMapping("/restaurants/{id}")
    Object getRestaurant(@PathVariable("id") Long id);
}
```

**How it works:**
1. Feign client uses service name `restaurant-service` (not URL)
2. Eureka resolves the service name to actual instance(s)
3. Load balancing is handled automatically
4. Circuit breaking can be added with Resilience4j

## Sample Data

The service includes 10 pre-loaded reservations:

1. John Smith - Restaurant 1 - Nov 22, 2025 19:00
2. Jane Doe - Restaurant 1 - Nov 22, 2025 20:00
3. Bob Johnson - Restaurant 2 - Nov 23, 2025 18:30
4. Alice Williams - Restaurant 3 - Nov 23, 2025 19:00
5. Charlie Brown - Restaurant 4 - Nov 24, 2025 18:00
6. Diana Prince - Restaurant 5 - Nov 24, 2025 20:00
7. Edward Norton - Restaurant 6 - Nov 25, 2025 19:30
8. Fiona Green - Restaurant 7 - Nov 25, 2025 18:00
9. George Miller - Restaurant 8 - Nov 26, 2025 19:00
10. Hannah White - Restaurant 9 - Nov 26, 2025 20:00

## Access Through API Gateway

If the API Gateway is running on port 8888:

```bash
# Access via gateway
curl http://localhost:8888/reservations

# Direct access
curl http://localhost:8082/reservations
```

## Project Structure

```
reservation-service/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/restaurant/reservation_service/
│   │   │       ├── ReservationServiceApplication.java (@EnableFeignClients)
│   │   │       ├── client/
│   │   │       │   └── RestaurantClient.java
│   │   │       ├── config/
│   │   │       │   └── DataLoader.java
│   │   │       ├── controller/
│   │   │       │   └── ReservationController.java
│   │   │       ├── dto/
│   │   │       │   └── RestaurantDTO.java
│   │   │       ├── entity/
│   │   │       │   └── Reservation.java
│   │   │       └── repository/
│   │   │           └── ReservationRepository.java
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── application.yml
│   │       └── data.sql
│   └── test/
│       └── java/
│           └── com/restaurant/reservation_service/
│               └── ReservationServiceApplicationTests.java
├── pom.xml
└── README.md
```

## Dependencies

Key dependencies used in this service:

- **Spring Boot Starter Web**: REST API support
- **Spring Boot Starter Data JPA**: JPA support
- **Spring Cloud Netflix Eureka Client**: Service discovery
- **Spring Cloud OpenFeign**: Declarative REST client
- **PostgreSQL Driver**: PostgreSQL database connectivity
- **Lombok**: Code generation for entities

## Database Schema

The `reservations` table is created automatically with the following schema:

```sql
CREATE TABLE reservations (
    id BIGSERIAL PRIMARY KEY,
    restaurant_id BIGINT NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    reservation_time TIMESTAMP NOT NULL
);
```

## Testing Examples

### Create a Reservation

```bash
curl -X POST http://localhost:8082/reservations ^
  -H "Content-Type: application/json" ^
  -d "{\"restaurantId\":1,\"customerName\":\"Test User\",\"reservationTime\":\"2025-12-01T19:00:00\"}"
```

### Get All Reservations

```bash
curl http://localhost:8082/reservations
```

### Get Specific Reservation

```bash
curl http://localhost:8082/reservations/1
```

### Test with Invalid Restaurant ID

```bash
curl -X POST http://localhost:8082/reservations ^
  -H "Content-Type: application/json" ^
  -d "{\"restaurantId\":999,\"customerName\":\"Test User\",\"reservationTime\":\"2025-12-01T19:00:00\"}"
```

Expected: `400 Bad Request` (restaurant doesn't exist)

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
4. Check PostgreSQL is listening on port 5432

### Port Already in Use

**Problem**: Port 8082 is already in use.

**Solution**: Change the port in `application.yml`:
```yaml
server:
  port: 8083  # or any available port
```

### Feign Client Errors

**Problem**: Cannot connect to restaurant-service.

**Solutions**:
1. Ensure restaurant-service is running on port 8081
2. Verify both services are registered with Eureka
3. Check Eureka dashboard: http://localhost:8761
4. Wait 30 seconds for service registration to complete
5. Check restaurant-service is responding:
   ```bash
   curl http://localhost:8081/restaurants/1
   ```

### Eureka Registration Failed

**Problem**: Service not showing in Eureka Dashboard.

**Solutions**:
1. Ensure Eureka Server is running on port 8761
2. Check `eureka.client.service-url.defaultZone` in configuration
3. Verify network connectivity
4. Wait 30 seconds for registration to complete

### Sample Data Not Loading

**Problem**: Sample data not in database.

**Solution**: Check console logs for "Sample reservation data loaded" message.

Manual insertion:
```sql
-- Connect to database
psql -U postgres -d reservationsdb

-- Insert sample data
INSERT INTO reservations (restaurant_id, customer_name, reservation_time) 
VALUES (1, 'Test User', '2025-12-01 19:00:00');
```

## Monitoring and Health Checks

### Health Check

```bash
curl http://localhost:8082/actuator/health
```

### Database Status

Check if tables are created:
```sql
\dt  # List tables in psql
SELECT * FROM reservations;  # View data
```

### Verify Feign Communication

Check if Feign can reach restaurant-service:
```bash
# Should succeed if restaurant-service is running
curl -X POST http://localhost:8082/reservations ^
  -H "Content-Type: application/json" ^
  -d "{\"restaurantId\":1,\"customerName\":\"Test\",\"reservationTime\":\"2025-12-01T19:00:00\"}"
```

## Production Considerations

### Security

For production:
- Use environment variables for database credentials
- Enable Spring Security
- Configure HTTPS/TLS
- Implement authentication and authorization
- Add rate limiting

### Performance

- Add database indexes on frequently queried fields
- Configure proper connection pool settings
- Enable caching where appropriate
- Implement circuit breakers for Feign clients (Resilience4j)

### High Availability

- Deploy multiple instances
- Use a managed PostgreSQL service
- Configure proper health checks
- Implement retry logic for Feign calls

### Feign Resilience

Add Resilience4j for circuit breaking:

```yaml
feign:
  circuitbreaker:
    enabled: true

resilience4j:
  circuitbreaker:
    instances:
      restaurant-service:
        sliding-window-size: 10
        failure-rate-threshold: 50
        wait-duration-in-open-state: 10000
```

## Environment Variables

Override configuration using environment variables:

```bash
# Database configuration
export SPRING_DATASOURCE_URL=jdbc:postgresql://prod-server:5432/reservationsdb
export SPRING_DATASOURCE_USERNAME=prod_user
export SPRING_DATASOURCE_PASSWORD=secure_password

# Server port
export SERVER_PORT=8082

# Eureka server
export EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka
```

## Additional Resources

- [Spring Cloud OpenFeign Documentation](https://spring.io/projects/spring-cloud-openfeign)
- [Spring Data JPA Documentation](https://spring.io/projects/spring-data-jpa)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Spring Cloud Netflix Documentation](https://spring.io/projects/spring-cloud-netflix)
- [Lombok Documentation](https://projectlombok.org/)

## License

This project is part of the restaurant microservices architecture.

