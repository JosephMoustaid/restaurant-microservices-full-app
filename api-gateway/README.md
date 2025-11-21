# API Gateway

This is a Spring Cloud Gateway that serves as the single entry point for all microservices in the restaurant application. It provides routing, load balancing, and service discovery integration with Eureka.

## Overview

The API Gateway acts as a reverse proxy that routes requests to appropriate microservices. It uses Spring Cloud Gateway with Eureka Discovery to dynamically route traffic to registered services.

## Features

- ✅ **Service Discovery**: Automatically discovers and routes to services registered with Eureka
- ✅ **Load Balancing**: Built-in client-side load balancing using Spring Cloud LoadBalancer
- ✅ **Dynamic Routing**: Routes configured to forward requests to appropriate microservices
- ✅ **Global CORS**: Configured to allow cross-origin requests from all origins
- ✅ **Actuator**: Health check and monitoring endpoints enabled

## Configuration

The gateway runs on port **8888** and connects to the Eureka Server at `http://localhost:8761/eureka`.

### Configured Routes

| Route ID | Path Pattern | Target Service | Description |
|----------|--------------|----------------|-------------|
| restaurant-service | `/restaurants/**` | `lb://restaurant-service` | Restaurant management endpoints |
| reservation-service | `/reservations/**` | `lb://reservation-service` | Reservation management endpoints |
| places-service | `/places/**` | `lb://places-service` | Places/location management endpoints |

### CORS Configuration

Global CORS is enabled with the following settings:
- **Allowed Origins**: `*` (all origins)
- **Allowed Methods**: GET, POST, PUT, DELETE, PATCH, OPTIONS
- **Allowed Headers**: `*` (all headers)
- **Allow Credentials**: false
- **Max Age**: 3600 seconds

## Prerequisites

- Java 21 or higher
- Maven 3.6+
- Eureka Server running on port 8761

## How to Run

### Step 1: Start Eureka Server

Before starting the API Gateway, make sure the Eureka Server is running:

```powershell
cd ..\eureka-server
.\mvnw.cmd spring-boot:run
```

Wait until Eureka Server is fully started and accessible at `http://localhost:8761`.

### Step 2: Start the API Gateway

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
   java -jar target/api-gateway-0.0.1-SNAPSHOT.jar
   ```

### Step 3: Start Backend Services

Start the microservices that you want to access through the gateway:

```powershell
# Restaurant Service
cd ..\restaurant-service
.\mvnw.cmd spring-boot:run

# Reservation Service
cd ..\reservation-service
.\mvnw.cmd spring-boot:run

# Places Service
cd ..\places-service
.\mvnw.cmd spring-boot:run
```

## Testing the Gateway

Once the gateway and services are running, you can access them through the gateway:

### Example Requests

```bash
# Access restaurant service through gateway
curl http://localhost:8888/restaurants

# Access reservation service through gateway
curl http://localhost:8888/reservations

# Access places service through gateway
curl http://localhost:8888/places
```

### Using Discovery Locator

The gateway also has discovery locator enabled, which allows you to access any registered service using the pattern:

```
http://localhost:8888/{service-name}/**
```

For example:
```bash
curl http://localhost:8888/restaurant-service/api/restaurants
```

## Monitoring and Health Checks

### Gateway Status

Check if the gateway is running:
```
http://localhost:8888/actuator/health
```

### View All Routes

To see all configured routes (if exposed via actuator):
```
http://localhost:8888/actuator/gateway/routes
```

### Eureka Dashboard

View all registered services including the gateway:
```
http://localhost:8761
```

You should see `API-GATEWAY` listed among the registered services.

## Architecture

```
┌─────────────┐
│   Clients   │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│    API Gateway      │
│   (Port: 8888)      │
└──────┬──────────────┘
       │
       ├──────────────┐
       │              │
       ▼              ▼
┌─────────────┐  ┌──────────────┐
│   Eureka    │  │  Service     │
│   Server    │  │  Discovery   │
│ (Port 8761) │  │              │
└─────────────┘  └──────┬───────┘
                        │
       ┌────────────────┼────────────────┐
       ▼                ▼                ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Restaurant   │ │ Reservation  │ │   Places     │
│   Service    │ │   Service    │ │   Service    │
└──────────────┘ └──────────────┘ └──────────────┘
```

## Project Structure

```
api-gateway/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/restaurant/api_gateway/
│   │   │       ├── ApiGatewayApplication.java
│   │   │       └── config/
│   │   │           └── CorsConfig.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── application.yml
│   └── test/
│       └── java/
│           └── com/restaurant/api_gateway/
│               └── ApiGatewayApplicationTests.java
├── pom.xml
└── README.md
```

## Key Dependencies

- **Spring Boot Starter WebFlux**: Reactive web framework for Gateway
- **Spring Cloud Gateway**: Gateway implementation
- **Spring Cloud Netflix Eureka Client**: Service discovery client
- **Spring Boot Starter Actuator**: Monitoring and management

## Configuration Details

### Load Balancing

The gateway uses Spring Cloud LoadBalancer for client-side load balancing. The `lb://` prefix in URIs indicates that the service name should be resolved via service discovery and load balanced.

### Route Predicates

Routes use predicates to match incoming requests:
- **Path Predicate**: Matches requests based on the request path pattern

### Discovery Locator

When enabled, the discovery locator allows automatic route creation for all services registered with Eureka. This provides a fallback routing mechanism.

## Troubleshooting

### Gateway Cannot Connect to Eureka

**Issue**: Gateway logs show connection errors to Eureka Server.

**Solution**: 
- Ensure Eureka Server is running on port 8761
- Check the `eureka.client.service-url.defaultZone` configuration
- Verify network connectivity

### Service Not Found (404)

**Issue**: Requests to gateway return 404.

**Solution**:
- Verify the target service is registered with Eureka (check Eureka Dashboard)
- Ensure the route path matches your request
- Check that the service name in the route configuration matches the registered service name

### CORS Errors

**Issue**: Browser shows CORS policy errors.

**Solution**:
- The gateway is configured with global CORS allowing all origins
- If issues persist, check browser developer console for specific error messages
- Verify the `CorsConfig` class is being loaded

### Port Already in Use

**Issue**: Port 8888 is already in use.

**Solution**: Change the port in `application.yml`:
```yaml
server:
  port: 8889  # or any other available port
```

## Environment Variables

You can override configuration using environment variables:

```bash
# Change gateway port
export SERVER_PORT=9000

# Change Eureka server URL
export EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka
```

## Production Considerations

### Security

For production environments, consider:
- Restricting CORS to specific origins
- Adding authentication/authorization (Spring Security)
- Enabling HTTPS/TLS
- Implementing rate limiting

### High Availability

- Deploy multiple gateway instances behind a load balancer
- Configure Eureka with multiple instances for redundancy
- Use proper health checks and circuit breakers

### Monitoring

- Enable detailed actuator endpoints
- Integrate with monitoring tools (Prometheus, Grafana)
- Set up logging aggregation
- Configure distributed tracing (Spring Cloud Sleuth + Zipkin)

## Additional Resources

- [Spring Cloud Gateway Documentation](https://spring.io/projects/spring-cloud-gateway)
- [Spring Cloud Netflix Documentation](https://spring.io/projects/spring-cloud-netflix)
- [Spring Cloud LoadBalancer](https://spring.io/guides/gs/spring-cloud-loadbalancer)
- [Eureka Wiki](https://github.com/Netflix/eureka/wiki)

## License

This project is part of the restaurant microservices architecture.

