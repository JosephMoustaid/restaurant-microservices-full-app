# User Service with JWT Authentication

A Spring Boot microservice for user management and authentication using JWT tokens.

## Features

- User registration and login
- JWT token-based authentication
- BCrypt password hashing
- User location management
- Spring Security integration
- Eureka Discovery Client integration
- PostgreSQL database

## Technologies Used

- Spring Boot 4.0.0
- Spring Security
- Spring Data JPA
- JWT (io.jsonwebtoken)
- PostgreSQL
- Lombok
- Eureka Discovery Client

## Prerequisites

- Java 21
- PostgreSQL 12+
- Maven 3.6+
- Eureka Server running on port 8761

## Database Setup

1. Create the PostgreSQL database:

```bash
psql -U postgres
```

```sql
CREATE DATABASE usersdb;
```

Or run the provided SQL file:

```bash
psql -U postgres -f database-setup.sql
```

2. Update `src/main/resources/application.yml` if your PostgreSQL credentials are different.

## Configuration

The service is configured in `application.yml`:

- **Port**: 8084
- **Database**: usersdb (PostgreSQL)
- **Eureka Server**: http://localhost:8761/eureka
- **JWT Secret**: Configured in application.yml
- **JWT Expiration**: 24 hours

## Running the Application

### Option 1: Using Maven

```bash
mvn spring-boot:run
```

### Option 2: Using JAR file

```bash
mvn clean package
java -jar target/user-service-0.0.1-SNAPSHOT.jar
```

## API Endpoints

### Public Endpoints (No Authentication Required)

#### Register a New User

```http
POST http://localhost:8084/auth/register
Content-Type: application/json

{
  "username": "john",
  "email": "john@example.com",
  "password": "password123",
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "john",
  "role": "ROLE_USER"
}
```

#### Login

```http
POST http://localhost:8084/auth/login
Content-Type: application/json

{
  "username": "john",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "john",
  "role": "ROLE_USER"
}
```

### Protected Endpoints (Require JWT Token)

For protected endpoints, include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

#### Get Current User Data

```http
GET http://localhost:8084/users/me
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
  "id": 1,
  "username": "john",
  "email": "john@example.com",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "role": "ROLE_USER"
}
```

#### Update User Location

```http
PUT http://localhost:8084/users/location
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "latitude": 40.7580,
  "longitude": -73.9855
}
```

**Response:**
```json
{
  "id": 1,
  "username": "john",
  "email": "john@example.com",
  "latitude": 40.7580,
  "longitude": -73.9855,
  "role": "ROLE_USER"
}
```

## Default Users

The application creates two default users on startup:

### Admin User
- **Username**: admin
- **Password**: admin123
- **Email**: admin@restaurant.com
- **Role**: ROLE_ADMIN
- **Location**: New York City (40.7128, -74.0060)

### Regular User
- **Username**: user
- **Password**: user123
- **Email**: user@restaurant.com
- **Role**: ROLE_USER
- **Location**: Times Square (40.7580, -73.9855)

## JWT Configuration

The JWT token includes:
- **Subject**: Username
- **Expiration**: 24 hours from issuance
- **Algorithm**: HS256

You can modify the JWT settings in `application.yml`:
```yaml
jwt:
  secret: YourSecretKeyForJWTTokenGenerationMustBeAtLeast256BitsLongForHS256Algorithm
  expiration: 86400000  # 24 hours in milliseconds
```

## Security Configuration

- `/auth/**` endpoints are public (no authentication required)
- All other endpoints require a valid JWT token
- Passwords are hashed using BCrypt
- Sessions are stateless (JWT-based authentication)

## Project Structure

```
user-service/
├── src/
│   ├── main/
│   │   ├── java/com/restaurant/user_service/
│   │   │   ├── config/
│   │   │   │   └── SecurityConfig.java
│   │   │   ├── controller/
│   │   │   │   ├── AuthController.java
│   │   │   │   └── UserController.java
│   │   │   ├── dto/
│   │   │   │   ├── AuthResponse.java
│   │   │   │   ├── LocationUpdateRequest.java
│   │   │   │   ├── LoginRequest.java
│   │   │   │   ├── RegisterRequest.java
│   │   │   │   └── UserResponse.java
│   │   │   ├── entity/
│   │   │   │   └── User.java
│   │   │   ├── repository/
│   │   │   │   └── UserRepository.java
│   │   │   ├── security/
│   │   │   │   ├── CustomUserDetailsService.java
│   │   │   │   ├── JwtAuthenticationFilter.java
│   │   │   │   └── JwtUtil.java
│   │   │   └── UserServiceApplication.java
│   │   └── resources/
│   │       └── application.yml
│   └── test/
├── pom.xml
└── README.md
```

## Testing with Postman

1. **Register a new user** - POST /auth/register
2. **Login** - POST /auth/login (save the returned token)
3. **Get user data** - GET /users/me (use token in Authorization header)
4. **Update location** - PUT /users/location (use token in Authorization header)

## Integration with Other Services

This service registers with Eureka Server and can be discovered by other microservices using the service name `user-service`.

## Troubleshooting

### Database Connection Issues

If you get database connection errors:
1. Ensure PostgreSQL is running
2. Verify the database `usersdb` exists
3. Check username/password in application.yml

### JWT Token Issues

If authentication fails:
1. Ensure the token is included in the Authorization header
2. Check that the token hasn't expired (24-hour validity)
3. Verify the JWT secret matches in application.yml

### Port Already in Use

If port 8084 is already in use, change it in application.yml:
```yaml
server:
  port: 8085  # or any available port
```

## License

This project is part of the Restaurant Microservices system.

