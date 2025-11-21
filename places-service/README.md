# Places Service

A Spring Boot reactive microservice that integrates with Google Places API to search for nearby places. Built with Spring WebFlux, WebClient, and Eureka service discovery.

## Overview

This microservice provides a reactive API to search for places using Google Places API. It uses Spring WebFlux for non-blocking, asynchronous operations and WebClient for external API calls.

## Features

- ✅ **Spring WebFlux**: Reactive, non-blocking web framework
- ✅ **WebClient**: Reactive HTTP client for Google Places API
- ✅ **Eureka Discovery Client**: Service registration and discovery
- ✅ **Lombok**: Reduces boilerplate code
- ✅ **Google Places Integration**: Real-time place search
- ✅ **Reactive Programming**: Non-blocking, scalable architecture
- ✅ **Simplified Response**: Clean, filtered place information

## Prerequisites

Before running this service, ensure you have:

- Java 21 or higher
- Maven 3.6+
- Eureka Server running on port 8761
- **Google Places API Key** (required for functionality)

## Google Places API Setup

### 1. Get API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Places API** for your project
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy your API key

### 2. Configure API Key

Set your API key in one of these ways:

**Option A: Environment Variable (Recommended)**
```bash
export GOOGLE_PLACES_API_KEY=your_actual_api_key_here
```

**Option B: application.yml**
```yaml
google:
  places:
    api-key: your_actual_api_key_here
```

**Option C: Command Line**
```bash
java -jar places-service.jar --google.places.api-key=your_actual_api_key_here
```

### 3. Restrict API Key (Production)

For security, restrict your API key to:
- Application restrictions: HTTP referrers or IP addresses
- API restrictions: Places API only

## Configuration

### application.yml

```yaml
server:
  port: 8083

spring:
  application:
    name: places-service

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka

google:
  places:
    api-key: ${GOOGLE_PLACES_API_KEY:YOUR_API_KEY_HERE}
    base-url: https://maps.googleapis.com/maps/api/place/nearbysearch/json
```

### Key Configuration Details

- **Port**: 8083
- **Service Name**: places-service
- **Reactive**: Uses WebFlux (non-blocking)
- **Google API**: Places API Nearby Search endpoint

## How to Run

### Step 1: Set API Key

```bash
# Windows PowerShell
$env:GOOGLE_PLACES_API_KEY="your_actual_api_key_here"

# Unix/Linux/Mac
export GOOGLE_PLACES_API_KEY="your_actual_api_key_here"
```

### Step 2: Start Eureka Server

```powershell
cd ..\eureka-server
.\mvnw.cmd spring-boot:run
```

### Step 3: Start Places Service

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
   java -jar target/places-service-0.0.1-SNAPSHOT.jar
   ```

### Step 4: Verify Service is Running

Check the service:
```bash
curl http://localhost:8083/actuator/health
```

Verify registration with Eureka:
```
http://localhost:8761
```

You should see `PLACES-SERVICE` listed.

## API Endpoints

### Base URL

```
http://localhost:8083/places
```

### Search Places

```
GET /places/search?query=...&location=...&radius=...
```

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| query | String | No | - | Search keyword (e.g., "restaurant", "pizza") |
| location | String | No | - | Latitude,Longitude (e.g., "40.7128,-74.0060") |
| radius | Integer | No | 5000 | Search radius in meters (max 50000) |

#### Example Requests

**1. Search restaurants near New York City:**
```bash
curl "http://localhost:8083/places/search?query=restaurant&location=40.7128,-74.0060&radius=5000"
```

**2. Search pizza places:**
```bash
curl "http://localhost:8083/places/search?query=pizza&location=40.7128,-74.0060"
```

**3. Search with custom radius (10km):**
```bash
curl "http://localhost:8083/places/search?query=cafe&location=40.7128,-74.0060&radius=10000"
```

**4. Search Italian restaurants:**
```bash
curl "http://localhost:8083/places/search?query=italian%20restaurant&location=40.7128,-74.0060"
```

#### Response Format

```json
{
  "results": [
    {
      "name": "Restaurant Name",
      "rating": 4.5,
      "latitude": 40.7128,
      "longitude": -74.0060,
      "types": ["restaurant", "food", "point_of_interest"],
      "userRatingsTotal": 1234
    }
  ],
  "status": "OK"
}
```

#### Response Fields

**PlaceItem:**
- `name` (String): Name of the place
- `rating` (Double): Average rating (0-5)
- `latitude` (Double): Geographic latitude
- `longitude` (Double): Geographic longitude
- `types` (String[]): Array of place types
- `userRatingsTotal` (Integer): Total number of user ratings

**PlaceResponse:**
- `results` (List<PlaceItem>): List of places found
- `status` (String): API response status (OK, ZERO_RESULTS, ERROR)

#### Status Codes

- `200 OK`: Request successful
- `400 Bad Request`: Invalid parameters
- `500 Internal Server Error`: Google API error or service error

## Access Through API Gateway

If the API Gateway is running on port 8888:

```bash
# Search via gateway
curl "http://localhost:8888/places/search?query=restaurant&location=40.7128,-74.0060"

# Direct access
curl "http://localhost:8083/places/search?query=restaurant&location=40.7128,-74.0060"
```

## Project Structure

```
places-service/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/restaurant/places_service/
│   │   │       ├── PlacesServiceApplication.java (@EnableDiscoveryClient)
│   │   │       ├── config/
│   │   │       │   └── WebClientConfig.java
│   │   │       ├── controller/
│   │   │       │   └── PlacesController.java
│   │   │       ├── dto/
│   │   │       │   ├── GooglePlacesResponse.java
│   │   │       │   ├── PlaceItem.java
│   │   │       │   └── PlaceResponse.java
│   │   │       └── service/
│   │   │           └── PlacesService.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── application.yml
│   └── test/
│       └── java/
│           └── com/restaurant/places_service/
│               └── PlacesServiceApplicationTests.java
├── pom.xml
└── README.md
```

## Dependencies

Key dependencies used in this service:

- **Spring Boot Starter WebFlux**: Reactive web support
- **Spring Cloud Netflix Eureka Client**: Service discovery
- **Lombok**: Code generation
- **Project Reactor**: Reactive streams implementation

## Architecture

```
┌─────────────────────────────────────────┐
│      Places Microservice                │
│          (Port 8083)                    │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  PlacesController (WebFlux)     │   │
│  │  GET /places/search             │   │
│  └─────────────────────────────────┘   │
│              ↓                          │
│  ┌─────────────────────────────────┐   │
│  │  PlacesService                  │   │
│  │  (Business Logic)               │   │
│  └─────────────────────────────────┘   │
│              ↓                          │
│  ┌─────────────────────────────────┐   │
│  │  WebClient (Reactive)           │   │
│  │  HTTP Client                    │   │
│  └─────────────────────────────────┘   │
│              ↓                          │
│      [External API Call]                │
│              ↓                          │
└──────────────┼──────────────────────────┘
               ↓
    ┌──────────────────────────┐
    │  Google Places API       │
    │  (maps.googleapis.com)   │
    └──────────────────────────┘
               ↓
    ┌──────────────────────────┐
    │  Eureka Server           │
    │  (Port 8761)             │
    └──────────────────────────┘
```

## Reactive Flow

```
Client Request
    ↓
PlacesController (reactive)
    ↓
PlacesService
    ↓
WebClient.get() → Google Places API
    ↓
Mono<GooglePlacesResponse>
    ↓
Transform to Mono<PlaceResponse>
    ↓
Return to Client (non-blocking)
```

## Testing Examples

### Test with curl

```bash
# Basic search
curl "http://localhost:8083/places/search?query=restaurant&location=40.7128,-74.0060"

# Search with specific radius
curl "http://localhost:8083/places/search?query=pizza&location=40.7128,-74.0060&radius=2000"

# Search cafes
curl "http://localhost:8083/places/search?query=cafe&location=40.7128,-74.0060"

# Search bars
curl "http://localhost:8083/places/search?query=bar&location=40.7128,-74.0060&radius=3000"
```

### Test with PowerShell

```powershell
# Basic search
Invoke-RestMethod -Uri "http://localhost:8083/places/search?query=restaurant&location=40.7128,-74.0060"

# Pretty print JSON
Invoke-RestMethod -Uri "http://localhost:8083/places/search?query=pizza&location=40.7128,-74.0060" | ConvertTo-Json -Depth 10
```

### Example Locations

Here are some coordinates you can use for testing:

- **New York City**: `40.7128,-74.0060`
- **Los Angeles**: `34.0522,-118.2437`
- **Chicago**: `41.8781,-87.6298`
- **San Francisco**: `37.7749,-122.4194`
- **Miami**: `25.7617,-80.1918`
- **Seattle**: `47.6062,-122.3321`

## Troubleshooting

### Port Already in Use

**Problem**: Port 8083 is already in use.

**Solution**: Change the port in `application.yml`:
```yaml
server:
  port: 8084  # or any available port
```

### API Key Issues

**Problem**: Getting "REQUEST_DENIED" or authentication errors.

**Solutions**:
1. Verify API key is set correctly:
   ```bash
   echo $GOOGLE_PLACES_API_KEY
   ```
2. Check API key is enabled for Places API in Google Cloud Console
3. Verify billing is enabled (Google requires it)
4. Check API key restrictions

### Eureka Registration Failed

**Problem**: Service not showing in Eureka Dashboard.

**Solutions**:
1. Ensure Eureka Server is running on port 8761
2. Check `eureka.client.service-url.defaultZone` in configuration
3. Verify network connectivity
4. Wait 30 seconds for registration to complete

### No Results Returned

**Problem**: Empty results array.

**Possible Causes**:
1. No places matching query in the specified radius
2. Invalid location format (must be "lat,lng")
3. Radius too small
4. API quota exceeded

**Solutions**:
- Increase radius parameter
- Try different location
- Check Google Cloud Console for quota limits
- Verify location format is correct

### WebClient Timeout

**Problem**: Requests timeout.

**Solution**: Adjust timeout in WebClientConfig:
```java
@Bean
public WebClient webClient(WebClient.Builder builder) {
    return builder
            .clientConnector(new ReactorClientHttpConnector(
                HttpClient.create()
                    .responseTimeout(Duration.ofSeconds(30))
            ))
            .build();
}
```

## Monitoring and Health Checks

### Health Check

```bash
curl http://localhost:8083/actuator/health
```

### Verify WebFlux is Working

Check if the service responds to requests:
```bash
curl -w "\nTime: %{time_total}s\n" "http://localhost:8083/places/search?query=restaurant&location=40.7128,-74.0060"
```

## Production Considerations

### Security

For production:
- Store API key securely (AWS Secrets Manager, Azure Key Vault)
- Use environment variables, never commit keys
- Enable API key restrictions
- Implement rate limiting
- Add authentication to your endpoints

### Performance

- WebFlux is non-blocking and handles high concurrency well
- Consider caching popular searches
- Monitor Google API quota usage
- Set appropriate timeouts
- Use connection pooling

### Cost Management

- Google Places API is paid (after free tier)
- Monitor usage in Google Cloud Console
- Set up billing alerts
- Consider caching results
- Implement request throttling

### Error Handling

The service handles errors gracefully:
- Returns empty results on API errors
- Logs all errors for debugging
- Returns appropriate HTTP status codes

## Environment Variables

Override configuration using environment variables:

```bash
# API Key (required)
export GOOGLE_PLACES_API_KEY=your_key_here

# Server port
export SERVER_PORT=8083

# Eureka server
export EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka
```

## API Quotas and Limits

Google Places API has the following limits:
- **Free Tier**: $200 credit per month
- **Cost**: ~$0.032 per request (Nearby Search)
- **Rate Limit**: 100 requests per second per project

Monitor your usage at: https://console.cloud.google.com/

## Additional Resources

- [Spring WebFlux Documentation](https://docs.spring.io/spring-framework/docs/current/reference/html/web-reactive.html)
- [WebClient Documentation](https://docs.spring.io/spring-framework/docs/current/reference/html/web-reactive.html#webflux-client)
- [Google Places API Documentation](https://developers.google.com/maps/documentation/places/web-service/overview)
- [Project Reactor Documentation](https://projectreactor.io/docs)
- [Spring Cloud Netflix Documentation](https://spring.io/projects/spring-cloud-netflix)

## License

This project is part of the restaurant microservices architecture.

