# 🚀 Quick Start Checklist

## Prerequisites Setup

### 1. Install PostgreSQL
- [ ] Download from https://www.postgresql.org/download/
- [ ] Install and start PostgreSQL service
- [ ] Note default port (5432) and credentials

### 2. Create Databases
```sql
-- Connect as postgres user
psql -U postgres

-- Create databases
CREATE DATABASE restaurantsdb;
CREATE DATABASE reservationsdb;

-- Exit
\q
```

### 3. Verify Java 17
```bash
java -version
# Should show Java 17.x.x
```

## Quick Start (5 minutes)

### Step 1: Start All Services
```bash
# From project root directory
start-all-services.bat
```
**Wait 2-3 minutes for all services to fully start**

### Step 2: Verify Everything Works
```bash
# Run verification script
verify-services.bat
```
**Should show all services as [OK]**

### Step 3: Check Eureka Dashboard
- Open browser: http://localhost:8761
- Verify 4 services are registered:
  - API-GATEWAY
  - RESTAURANT-SERVICE  
  - RESERVATION-SERVICE
  - PLACES-SERVICE

### Step 4: Test with Postman
1. Import `restaurant-microservices-collection.json`
2. Run "Eureka Server" → "Check Eureka Dashboard"
3. Run "Restaurant Service (via Gateway)" → "Get All Restaurants via Gateway"
4. Should return 15 sample restaurants

## 🧪 Quick API Tests

### Test Restaurant Service
```bash
curl http://localhost:8888/restaurants
```

### Test Reservation Service  
```bash
curl http://localhost:8888/reservations
```

### Test Places Service
```bash
curl "http://localhost:8888/places/search?location=40.7128,-74.0060&radius=5000"
```

### Create a Restaurant
```bash
curl -X POST http://localhost:8888/restaurants \
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

### Create a Reservation
```bash
curl -X POST http://localhost:8888/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "restaurantId": 1,
    "customerName": "John Doe", 
    "reservationTime": "2025-11-25T19:30:00"
  }'
```

## 🔍 Service Health Checks

### Individual Service Health
- Eureka: http://localhost:8761
- Gateway: http://localhost:8888/actuator/health  
- Restaurant: http://localhost:8081/restaurants
- Reservation: http://localhost:8082/reservations
- Places: http://localhost:8083/places/search?location=40.7128,-74.0060

### Service Ports
- Eureka Server: 8761
- API Gateway: 8888  
- Restaurant Service: 8081
- Reservation Service: 8082
- Places Service: 8083

## ⚠️ Troubleshooting Quick Fixes

### Service Won't Start
1. Check if port is available: `netstat -ano | findstr :8081`
2. Kill conflicting process
3. Restart service

### Database Connection Error
1. Verify PostgreSQL is running
2. Check databases exist: `psql -U postgres -l`
3. Verify credentials in application.yml

### Service Not Registering with Eureka
1. Ensure Eureka started first
2. Wait 30-60 seconds for registration
3. Check service logs for errors

### Places API Not Working
1. Verify Google Places API key in places-service/application.yml
2. Check API key has Places API enabled
3. Verify API quotas

## 📁 Important Files

### Configuration
- `*/src/main/resources/application.yml` - Service configuration
- `PROJECT-SUMMARY.md` - Complete project overview
- `README.md` - Detailed documentation

### Testing
- `restaurant-microservices-collection.json` - Postman collection
- `verify-services.bat` - Health check script
- `start-all-services.bat` - Startup automation

### Sample Data  
- `restaurant-service/src/main/resources/data.sql` - 15 sample restaurants

## ✅ Success Indicators

✅ All services show "BUILD SUCCESS" when compiling
✅ Eureka dashboard shows 4 registered services  
✅ `verify-services.bat` shows all [OK] status
✅ Restaurant endpoint returns JSON with 15 restaurants
✅ Postman tests pass successfully

## 🎯 You're Ready When:
- [ ] All 5 services are running
- [ ] Eureka shows 4 registered services
- [ ] API Gateway routes work correctly  
- [ ] Sample restaurants are accessible
- [ ] Postman collection imports successfully

**Total setup time: ~5-10 minutes** 🚀
