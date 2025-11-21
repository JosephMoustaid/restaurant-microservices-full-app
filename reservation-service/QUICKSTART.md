# Reservation Service Quick Start

## Prerequisites Check

- [ ] Java 21+ installed
- [ ] PostgreSQL installed and running
- [ ] Eureka Server running on port 8761
- [ ] Restaurant Service running on port 8081

## Quick Setup (5 minutes)

### 1. Setup PostgreSQL Database

Open PostgreSQL command line (psql) or pgAdmin and run:

```sql
-- Create database
CREATE DATABASE reservationsdb;

-- Connect to database
\c reservationsdb

-- Verify connection
SELECT current_database();
```

### 2. Start Required Services (in order)

```powershell
# Terminal 1: Eureka Server
cd ..\eureka-server
.\mvnw.cmd spring-boot:run

# Terminal 2: Restaurant Service (wait for Eureka to start)
cd ..\restaurant-service
.\mvnw.cmd spring-boot:run

# Terminal 3: Reservation Service (wait for Restaurant Service to start)
cd ..\reservation-service
.\mvnw.cmd spring-boot:run
```

### 3. Verify Services are Running

```bash
# Check Eureka Dashboard
Open: http://localhost:8761

# Check Restaurant Service
curl http://localhost:8081/restaurants

# Check Reservation Service
curl http://localhost:8082/reservations
```

## Quick Test

### Create a Reservation
```bash
curl -X POST http://localhost:8082/reservations ^
  -H "Content-Type: application/json" ^
  -d "{\"restaurantId\":1,\"customerName\":\"John Doe\",\"reservationTime\":\"2025-11-25T19:00:00\"}"
```

### Get All Reservations
```bash
curl http://localhost:8082/reservations
```

### Get Specific Reservation
```bash
curl http://localhost:8082/reservations/1
```

## Test OpenFeign Communication

### Test with Valid Restaurant ID
```bash
curl -X POST http://localhost:8082/reservations ^
  -H "Content-Type: application/json" ^
  -d "{\"restaurantId\":1,\"customerName\":\"Test User\",\"reservationTime\":\"2025-12-01T19:00:00\"}"
```

Expected: `201 Created` with reservation details

### Test with Invalid Restaurant ID
```bash
curl -X POST http://localhost:8082/reservations ^
  -H "Content-Type: application/json" ^
  -d "{\"restaurantId\":999,\"customerName\":\"Test User\",\"reservationTime\":\"2025-12-01T19:00:00\"}"
```

Expected: `400 Bad Request` (restaurant doesn't exist)

## Common Issues

### Issue: "Connection refused" to PostgreSQL

**Solution**:
```bash
# Check if PostgreSQL is running (Windows)
Get-Service postgresql*

# Start PostgreSQL if not running
Start-Service postgresql-x64-15
```

### Issue: "Database reservationsdb does not exist"

**Solution**:
```sql
-- Run in psql
CREATE DATABASE reservationsdb;
```

### Issue: Feign client cannot reach restaurant-service

**Solution**:
1. Check restaurant-service is running:
   ```bash
   curl http://localhost:8081/restaurants
   ```
2. Check both services are in Eureka Dashboard
3. Wait 30 seconds for service discovery to complete

### Issue: Port 8082 already in use

**Solution**: Change port in application.yml:
```yaml
server:
  port: 8083
```

## Access via API Gateway

If API Gateway is running on port 8888:

```bash
# Create reservation via gateway
curl -X POST http://localhost:8888/reservations ^
  -H "Content-Type: application/json" ^
  -d "{\"restaurantId\":1,\"customerName\":\"Gateway Test\",\"reservationTime\":\"2025-12-01T19:00:00\"}"

# Get all reservations via gateway
curl http://localhost:8888/reservations
```

## Service Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/reservations` | Create new reservation |
| GET | `/reservations` | Get all reservations |
| GET | `/reservations/{id}` | Get reservation by ID |

## Service Dependencies

```
Reservation Service (8082)
    ↓
    ├─→ Eureka Server (8761)
    └─→ Restaurant Service (8081) [via Feign]
```

## Verification Checklist

- [ ] PostgreSQL running
- [ ] Database `reservationsdb` created
- [ ] Eureka Server running (8761)
- [ ] Restaurant Service running (8081)
- [ ] Reservation Service running (8082)
- [ ] All services registered in Eureka
- [ ] Can create reservations
- [ ] Can retrieve reservations
- [ ] Feign client validates restaurants

## Next Steps

After successful testing:
1. ✅ Test inter-service communication
2. ✅ Add more business logic
3. ✅ Implement validation rules
4. ✅ Add error handling
5. ✅ Set up monitoring
6. ✅ Configure circuit breakers

