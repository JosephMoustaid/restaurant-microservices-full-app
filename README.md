# Restaurant Microservices Project

A complete microservices architecture for restaurant management built with Spring Boot, Spring Cloud, and PostgreSQL.

## 📋 Table of Contents
- [Architecture Overview](#architecture-overview)
- [Technologies Used](#technologies-used)
- [Services](#services)
- [Prerequisites](#prerequisites)
- [Setup and Installation](#setup-and-installation)
- [Database Setup](#database-setup)
- [Running the Services](#running-the-services)
- [Testing the APIs](#testing-the-apis)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)

## 🏗️ Architecture Overview

The project consists of 6 microservices:

```
                    ┌─────────────────┐
                    │   API Gateway   │
                    │   Port: 8888    │
                    └─────────────────┘
                            │
            ┌───────────────┼───────────────┬───────────┐
            │               │               │           │
  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
  │ Restaurant  │ │ Reservation │ │   Places    │ │    User     │
  │  Service    │ │   Service   │ │   Service   │ │  Service    │
  │ Port: 8081  │ │ Port: 8082  │ │ Port: 8083  │ │ Port: 8084  │
  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
                            │
                ┌───────────────────────┐
                │   Eureka Server       │
                │   (Discovery)         │
                │   Port: 8761          │
                └───────────────────────┘
```

## 🚀 Technologies Used

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Cloud 2023.0.0**
- **Spring Data JPA**
- **Spring Data REST**
- **Spring WebFlux** (Places Service)
- **Spring Cloud Gateway**
- **Spring Cloud Netflix Eureka**
- **OpenFeign** (Service Communication)
- **Spring Security & JWT** (Authentication)
- **PostgreSQL** (Database)
- **Lombok** (Code Generation)
- **Maven** (Build Tool)

## 🏢 Services

### 1. Eureka Server (Port: 8761)
- **Purpose**: Service discovery and registration
- **Features**: 
  - Centralized service registry
  - Health monitoring of registered services
  - Load balancing support

### 2. API Gateway (Port: 8888)
- **Purpose**: Single entry point for all client requests
- **Features**:
  - Request routing to appropriate microservices
  - Load balancing
  - CORS configuration
  - Service discovery integration

### 3. Restaurant Service (Port: 8081)
- **Purpose**: Manage restaurant data
- **Features**:
  - CRUD operations for restaurants
  - Spring Data REST auto-generated endpoints
  - PostgreSQL persistence
  - Sample data initialization
- **Entity**: Restaurant (id, name, address, cuisine, rating, latitude, longitude)

### 4. Reservation Service (Port: 8082)
- **Purpose**: Handle restaurant reservations
- **Features**:
  - Create, read reservations
  - Restaurant validation via Feign client
  - PostgreSQL persistence
- **Entity**: Reservation (id, restaurantId, customerName, reservationTime)

### 5. Places Service (Port: 8083)
- **Purpose**: Search for places using Google Places API
- **Features**:
  - Reactive programming with WebFlux
  - Google Places API integration
  - Location-based search
  - Query-based search

### 6. User Service (Port: 8084)
- **Purpose**: User authentication and management with JWT
- **Features**:
  - User registration and login
  - JWT token-based authentication
  - BCrypt password hashing
  - User location management
  - Spring Security integration
- **Entity**: User (id, username, email, password, latitude, longitude, role)

## 📋 Prerequisites

Before running this project, ensure you have:

1. **Java 17** or later installed
2. **PostgreSQL** server running
3. **Google Places API Key** (for Places Service)
4. **Maven** (or use the included Maven wrapper)

## ⚙️ Setup and Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd restaurant-microservices
```

### 2. Configure Google Places API Key
Update the Places Service configuration in `places-service/src/main/resources/application.yml`:
```yaml
google:
  places:
    api-key: YOUR_GOOGLE_PLACES_API_KEY_HERE
```

Or set as environment variable:
```bash
export GOOGLE_PLACES_API_KEY=your_actual_api_key
```

## 🗄️ Database Setup

### 1. Install PostgreSQL
Download and install PostgreSQL from [https://www.postgresql.org/download/](https://www.postgresql.org/download/)

### 2. Create Databases
Connect to PostgreSQL as superuser and create the required databases:

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create databases
CREATE DATABASE restaurantsdb;
CREATE DATABASE reservationsdb;
CREATE DATABASE usersdb;

-- Create user (optional)
CREATE USER restaurant_user WITH PASSWORD 'restaurant_pass';
GRANT ALL PRIVILEGES ON DATABASE restaurantsdb TO restaurant_user;
GRANT ALL PRIVILEGES ON DATABASE reservationsdb TO restaurant_user;
GRANT ALL PRIVILEGES ON DATABASE usersdb TO restaurant_user;
```

### 3. Database Configuration
The services are configured to use:
- **Database Host**: localhost:5432
- **Username**: postgres
- **Password**: postgres

Update `application.yml` in each service if your setup differs.

## 🚀 Running the Services

### Important: Start Order
Services must be started in the following order:

1. **Eureka Server** (first)
2. **Restaurant Service** 
3. **Reservation Service**
4. **Places Service**
5. **User Service**
6. **API Gateway** (last)

### Start Each Service

#### 1. Eureka Server
```bash
cd eureka-server
./mvnw.cmd spring-boot:run
# Wait for startup (usually 30-60 seconds)
# Verify at: http://localhost:8761
```

#### 2. Restaurant Service
```bash
cd restaurant-service
./mvnw.cmd spring-boot:run
# Verify registration in Eureka dashboard
```

#### 3. Reservation Service
```bash
cd reservation-service
./mvnw.cmd spring-boot:run
# Verify registration in Eureka dashboard
```

#### 4. Places Service
```bash
cd places-service
./mvnw.cmd spring-boot:run
# Verify registration in Eureka dashboard
```

#### 5. User Service
```bash
cd user-service
./mvnw.cmd spring-boot:run
# Verify registration in Eureka dashboard
```

#### 6. API Gateway
```bash
cd api-gateway
./mvnw.cmd spring-boot:run
# Gateway should discover all services
```

### Verify All Services
Check Eureka dashboard at http://localhost:8761 - you should see all 5 services registered.

## 🧪 Testing the APIs

### Method 1: Import Postman Collection
1. Import `restaurant-microservices-collection.json` into Postman
2. The collection includes:
   - Individual service tests
   - Gateway-routed tests
   - Integration tests
   - Environment variables

### Method 2: Manual Testing with curl

#### Test Eureka Server
```bash
curl http://localhost:8761/eureka/apps
```

#### Test Restaurant Service (Direct)
```bash
# Get all restaurants
curl http://localhost:8081/restaurants

# Get specific restaurant
curl http://localhost:8081/restaurants/1

# Create new restaurant
curl -X POST http://localhost:8081/restaurants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Restaurant",
    "address": "123 Test St",
    "cuisine": "Test",
    "rating": 4.5,
    "latitude": 40.7128,
    "longitude": -74.0060
  }'
```

#### Test Restaurant Service (via Gateway)
```bash
# Get all restaurants via gateway
curl http://localhost:8888/restaurants

# Get specific restaurant via gateway
curl http://localhost:8888/restaurants/1
```

#### Test Reservation Service (Direct)
```bash
# Get all reservations
curl http://localhost:8082/reservations

# Create new reservation
curl -X POST http://localhost:8082/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "restaurantId": 1,
    "customerName": "John Doe",
    "reservationTime": "2025-11-25T19:30:00"
  }'
```

#### Test Places Service (Direct)
```bash
# Search places by location
curl "http://localhost:8083/places/search?location=40.7128,-74.0060&radius=5000"

# Search places by query
curl "http://localhost:8083/places/search?query=restaurant&location=40.7589,-73.9851&radius=3000"
```

#### Test Places Service (via Gateway)
```bash
# Search places via gateway
curl "http://localhost:8888/places/search?query=restaurant&location=40.7128,-74.0060&radius=5000"
```

#### Test User Service (Direct)
```bash
# Register a new user
curl -X POST http://localhost:8084/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "testuser@example.com",
    "password": "password123",
    "latitude": 40.7128,
    "longitude": -74.0060
  }'

# Login (returns JWT token)
curl -X POST http://localhost:8084/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'

# Get current user (requires JWT token)
curl http://localhost:8084/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Update location (requires JWT token)
curl -X PUT http://localhost:8084/users/location \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "latitude": 40.7589,
    "longitude": -73.9851
  }'
```

#### Test User Service (via Gateway)
```bash
# Login via gateway
curl -X POST http://localhost:8888/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'

# Get user via gateway (requires JWT token)
curl http://localhost:8888/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📚 API Documentation

### Restaurant Service Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/restaurants` | Get all restaurants |
| GET | `/restaurants/{id}` | Get restaurant by ID |
| POST | `/restaurants` | Create new restaurant |
| PUT | `/restaurants/{id}` | Update restaurant |
| DELETE | `/restaurants/{id}` | Delete restaurant |

### Reservation Service Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reservations` | Get all reservations |
| GET | `/reservations/{id}` | Get reservation by ID |
| POST | `/reservations` | Create new reservation |

### Places Service Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/places/search` | Search places |

**Query Parameters for Places Search:**
- `query` (optional): Search term (e.g., "restaurant", "coffee")
- `location` (optional): Latitude,longitude (e.g., "40.7128,-74.0060")
- `radius` (optional): Search radius in meters (default: 5000)

### Sample Request Bodies

#### Restaurant
```json
{
  "name": "Amazing Restaurant",
  "address": "123 Main St, New York, NY 10001",
  "cuisine": "Italian",
  "rating": 4.5,
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

#### Reservation
```json
{
  "restaurantId": 1,
  "customerName": "John Doe",
  "reservationTime": "2025-11-25T19:30:00"
}
```

## 🔧 Configuration Details

### Service Ports
- Eureka Server: 8761
- Restaurant Service: 8081
- Reservation Service: 8082
- Places Service: 8083
- API Gateway: 8888

### Database Configuration
- Restaurant Service: `restaurantsdb`
- Reservation Service: `reservationsdb`
- Connection: `jdbc:postgresql://localhost:5432/[database_name]`

### Sample Data
The Restaurant Service includes sample data with 15 restaurants in New York City, automatically inserted on startup.

## ❗ Troubleshooting

### Common Issues

#### 1. Service Not Registering with Eureka
- **Problem**: Service doesn't appear in Eureka dashboard
- **Solution**: 
  - Check Eureka server is running first
  - Verify `spring.application.name` is set
  - Check network connectivity
  - Wait 30-60 seconds for registration

#### 2. Database Connection Issues
- **Problem**: `Connection refused` or authentication errors
- **Solution**:
  - Verify PostgreSQL is running
  - Check database names exist
  - Verify username/password in `application.yml`
  - Test connection manually

#### 3. Google Places API Issues
- **Problem**: Places service returns errors
- **Solution**:
  - Verify API key is valid and has Places API enabled
  - Check API quotas and billing
  - Ensure location parameter format is correct

#### 4. Port Already in Use
- **Problem**: `Port already in use` error
- **Solution**:
  - Kill process using the port: `netstat -ano | findstr :8081`
  - Change port in `application.yml`
  - Restart the service

#### 5. Reservation Service Can't Find Restaurant
- **Problem**: Creating reservation fails with 400 error
- **Solution**:
  - Ensure Restaurant Service is running and registered
  - Check if restaurant ID exists
  - Verify Feign client configuration

### Verification Steps

1. **Check Service Health**:
   ```bash
   curl http://localhost:8081/actuator/health
   curl http://localhost:8082/actuator/health
   curl http://localhost:8083/actuator/health
   curl http://localhost:8888/actuator/health
   ```

2. **Check Service Registration**:
   Visit http://localhost:8761 and verify all services are listed

3. **Check Database Connectivity**:
   ```bash
   psql -h localhost -U postgres -d restaurantsdb -c "SELECT COUNT(*) FROM restaurants;"
   ```

4. **Check API Gateway Routes**:
   ```bash
   curl http://localhost:8888/actuator/gateway/routes
   ```

### Logs Location
- Check console output for each service
- Look for ERROR and WARN messages
- Pay attention to startup sequence

## 📝 Notes

- The system uses Spring Cloud Gateway for API routing
- All services automatically register with Eureka for discovery
- Restaurant service uses Spring Data REST for auto-generated endpoints
- Reservation service validates restaurants exist before creating reservations
- Places service is reactive and uses WebClient for external API calls
- CORS is configured globally in the API Gateway

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for educational purposes and demonstration of microservices architecture patterns.
