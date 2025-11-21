# Eureka Server

This is a Spring Boot Eureka Server for service discovery in the restaurant microservices architecture.

## Overview

Eureka Server acts as a service registry where all microservices register themselves and discover other services. It provides dynamic service discovery, allowing services to find and communicate with each other without hardcoding hostnames and ports.

## Configuration

The server is configured to run on port **8761** and is set up as a standalone Eureka Server that does not register itself with other Eureka instances.

### Key Configuration Settings

- **Port**: 8761
- **Application Name**: service-discovery
- **Register with Eureka**: false (standalone mode)
- **Fetch Registry**: false (standalone mode)

## Prerequisites

- Java 21 or higher
- Maven 3.6+

## How to Run

### Using Maven Wrapper (Recommended)

#### On Windows:
```powershell
.\mvnw.cmd spring-boot:run
```

#### On Unix/Linux/Mac:
```bash
./mvnw spring-boot:run
```

### Using Maven (if installed globally)

```bash
mvn spring-boot:run
```

### Building and Running the JAR

1. Build the project:
   ```bash
   mvn clean package
   ```

2. Run the JAR file:
   ```bash
   java -jar target/eureka-server-0.0.1-SNAPSHOT.jar
   ```

## Accessing the Eureka Dashboard

Once the server is running, you can access the Eureka Dashboard at:

```
http://localhost:8761
```

The dashboard displays:
- Registered services and their instances
- System status
- Instance information
- General information about the Eureka Server

## Registering Services

Other microservices can register with this Eureka Server by:

1. Adding the Eureka Client dependency to their `pom.xml`:
   ```xml
   <dependency>
       <groupId>org.springframework.cloud</groupId>
       <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
   </dependency>
   ```

2. Configuring their `application.yml`:
   ```yaml
   eureka:
     client:
       service-url:
         defaultZone: http://localhost:8761/eureka/
   ```

3. Adding `@EnableDiscoveryClient` annotation to their main application class (optional in newer versions).

## Project Structure

```
eureka-server/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/restaurant/eureka_server/
│   │   │       └── EurekaServerApplication.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── application.yml
│   └── test/
│       └── java/
│           └── com/restaurant/eureka_server/
│               └── EurekaServerApplicationTests.java
├── pom.xml
└── README.md
```

## Dependencies

Key dependencies used in this project:

- **Spring Boot Starter Actuator**: Monitoring and management endpoints
- **Spring Cloud Netflix Eureka Server**: Eureka Server implementation
- **Spring Cloud**: Cloud-native application features

## Troubleshooting

### Port Already in Use

If port 8761 is already in use, you can change it in `application.yml`:

```yaml
server:
  port: 8762  # or any other available port
```

### Connection Issues

Make sure no firewall is blocking port 8761 and that the server has started successfully by checking the console logs for:

```
Tomcat started on port(s): 8761 (http)
```

## Health Check

The Actuator endpoints provide health check functionality:

```
http://localhost:8761/actuator/health
```

## Additional Resources

- [Spring Cloud Netflix Eureka Documentation](https://spring.io/projects/spring-cloud-netflix)
- [Eureka Wiki](https://github.com/Netflix/eureka/wiki)
- [Spring Cloud Documentation](https://spring.io/projects/spring-cloud)

