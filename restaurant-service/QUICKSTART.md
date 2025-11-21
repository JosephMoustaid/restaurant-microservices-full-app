# Restaurant Service Quick Start

## Prerequisites Check

- [ ] Java 21+ installed
- [ ] PostgreSQL installed and running
- [ ] Eureka Server running on port 8761

## Quick Setup (5 minutes)

### 1. Setup PostgreSQL Database

Open PostgreSQL command line (psql) or pgAdmin and run:

```sql
-- Create database
CREATE DATABASE restaurantsdb;

-- Connect to database
\c restaurantsdb

-- Verify connection
SELECT current_database();
```

### 2. Configure Database Credentials

If your PostgreSQL uses different credentials, edit `src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    username: your_username  # Change if needed
    password: your_password  # Change if needed
```

### 3. Start the Service

```powershell
# Windows
.\mvnw.cmd spring-boot:run

# Unix/Linux/Mac
./mvnw spring-boot:run
```

### 4. Verify Service is Running

```bash
# Check health
curl http://localhost:8081/actuator/health

# Get all restaurants
curl http://localhost:8081/restaurants

# Get first restaurant
curl http://localhost:8081/restaurants/1
```

### 5. Check Eureka Registration

Open browser: http://localhost:8761

Look for `RESTAURANT-SERVICE` in the instances list.

## Quick Test

### Get All Restaurants
```bash
curl http://localhost:8081/restaurants
```

### Create New Restaurant
```bash
curl -X POST http://localhost:8081/restaurants ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test Restaurant\",\"address\":\"123 Test St\",\"cuisine\":\"Test Cuisine\",\"rating\":4.5,\"latitude\":40.7128,\"longitude\":-74.0060}"
```

### Update Restaurant
```bash
curl -X PUT http://localhost:8081/restaurants/1 ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Updated Restaurant\",\"address\":\"456 Test Ave\",\"cuisine\":\"Italian\",\"rating\":4.8,\"latitude\":40.7128,\"longitude\":-74.0060}"
```

### Delete Restaurant
```bash
curl -X DELETE http://localhost:8081/restaurants/1
```

## Common Issues

### Issue: "Connection refused" to PostgreSQL

**Solution**:
```bash
# Check if PostgreSQL is running (Windows)
Get-Service postgresql*

# Start PostgreSQL if not running
Start-Service postgresql-x64-15
```

### Issue: "Database restaurantsdb does not exist"

**Solution**:
```sql
-- Run in psql
CREATE DATABASE restaurantsdb;
```

### Issue: Port 8081 already in use

**Solution**: Change port in application.yml:
```yaml
server:
  port: 8082
```

### Issue: Sample data not loaded

**Solution**: Insert data manually or add to application.yml:
```yaml
spring:
  sql:
    init:
      mode: always
```

## Access via API Gateway

If API Gateway is running on port 8888:

```bash
curl http://localhost:8888/restaurants
```

## Next Steps

1. ✅ Service running on http://localhost:8081
2. ✅ Registered with Eureka at http://localhost:8761
3. ✅ Ready to receive requests
4. 📝 Check full README.md for detailed documentation

## Service Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/restaurants` | Get all restaurants |
| GET | `/restaurants/{id}` | Get restaurant by ID |
| POST | `/restaurants` | Create new restaurant |
| PUT | `/restaurants/{id}` | Update restaurant |
| PATCH | `/restaurants/{id}` | Partial update |
| DELETE | `/restaurants/{id}` | Delete restaurant |

## Pagination & Sorting

```bash
# Get page 0, size 5
curl "http://localhost:8081/restaurants?page=0&size=5"

# Sort by rating (descending)
curl "http://localhost:8081/restaurants?sort=rating,desc"

# Combine pagination and sorting
curl "http://localhost:8081/restaurants?page=0&size=10&sort=rating,desc"
```

