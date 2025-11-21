# Restaurant Service - Complete Testing Guide

## Pre-Flight Checklist

Before testing, ensure:
- [ ] PostgreSQL is installed and running
- [ ] Database `restaurantsdb` has been created
- [ ] Eureka Server is running on port 8761
- [ ] Restaurant Service is running on port 8081

## Setup Verification

### 1. Check PostgreSQL
```powershell
# Windows - Check if PostgreSQL service is running
Get-Service postgresql*

# If not running, start it
Start-Service postgresql-x64-15  # Adjust version number

# Connect to PostgreSQL
psql -U postgres
```

### 2. Create Database
```sql
-- In psql console
CREATE DATABASE restaurantsdb;
\c restaurantsdb
\q
```

### 3. Start Services in Order
```powershell
# Terminal 1: Eureka Server
cd ..\eureka-server
.\mvnw.cmd spring-boot:run

# Terminal 2: Restaurant Service (wait for Eureka to start)
cd ..\restaurant-service
.\mvnw.cmd spring-boot:run
```

## Verify Service Started Successfully

### Check Console Output
Look for these success messages:
```
✅ "Tomcat started on port(s): 8081"
✅ "Sample restaurant data loaded successfully!"
✅ "DiscoveryClient_RESTAURANT-SERVICE registered successfully"
```

### Health Check
```bash
curl http://localhost:8081/actuator/health
```

Expected Response:
```json
{
  "status": "UP"
}
```

### Check Eureka Registration
Open browser: http://localhost:8761

Look for: **RESTAURANT-SERVICE** in the "Instances currently registered with Eureka" section.

## API Testing

### Test 1: Get All Restaurants (GET)

**Request:**
```bash
curl http://localhost:8081/restaurants
```

**Expected Response:**
- Status: `200 OK`
- Should return 15 restaurants with embedded structure
- Contains pagination information (`page`, `size`, `totalElements`, `totalPages`)

**Verify:**
- [ ] Status code is 200
- [ ] Response contains `_embedded.restaurants` array
- [ ] Array has 15 restaurants
- [ ] Each restaurant has: id, name, address, cuisine, rating, latitude, longitude

---

### Test 2: Get Single Restaurant (GET)

**Request:**
```bash
curl http://localhost:8081/restaurants/1
```

**Expected Response:**
```json
{
  "name": "The Italian Corner",
  "address": "123 Main St, New York, NY 10001",
  "cuisine": "Italian",
  "rating": 4.5,
  "latitude": 40.7128,
  "longitude": -74.006,
  "_links": {
    "self": {
      "href": "http://localhost:8081/restaurants/1"
    },
    "restaurant": {
      "href": "http://localhost:8081/restaurants/1"
    }
  }
}
```

**Verify:**
- [ ] Status code is 200
- [ ] Response contains all restaurant fields
- [ ] Contains HATEOAS links

---

### Test 3: Create New Restaurant (POST)

**Request:**
```bash
curl -X POST http://localhost:8081/restaurants ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test Restaurant\",\"address\":\"789 Test St, New York, NY 10001\",\"cuisine\":\"Test Cuisine\",\"rating\":4.5,\"latitude\":40.7128,\"longitude\":-74.0060}"
```

**For PowerShell:**
```powershell
$body = @{
    name = "Test Restaurant"
    address = "789 Test St, New York, NY 10001"
    cuisine = "Test Cuisine"
    rating = 4.5
    latitude = 40.7128
    longitude = -74.0060
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8081/restaurants" -Method POST -Body $body -ContentType "application/json"
```

**Expected Response:**
- Status: `201 Created`
- Location header with new resource URL
- Response body with created restaurant including generated ID

**Verify:**
- [ ] Status code is 201
- [ ] Response contains new ID (should be 16)
- [ ] All fields match the input
- [ ] Location header present

**Verify in Database:**
```bash
curl http://localhost:8081/restaurants/16
```

---

### Test 4: Update Restaurant (PUT)

**Request:**
```bash
curl -X PUT http://localhost:8081/restaurants/1 ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Updated Italian Corner\",\"address\":\"123 Main St, New York, NY 10001\",\"cuisine\":\"Italian\",\"rating\":4.8,\"latitude\":40.7128,\"longitude\":-74.0060}"
```

**Expected Response:**
- Status: `200 OK` or `204 No Content`
- Updated restaurant data

**Verify:**
```bash
curl http://localhost:8081/restaurants/1
```

**Check:**
- [ ] Name changed to "Updated Italian Corner"
- [ ] Rating changed to 4.8

---

### Test 5: Partial Update (PATCH)

**Request:**
```bash
curl -X PATCH http://localhost:8081/restaurants/1 ^
  -H "Content-Type: application/json" ^
  -d "{\"rating\":5.0}"
```

**Expected Response:**
- Status: `200 OK` or `204 No Content`

**Verify:**
```bash
curl http://localhost:8081/restaurants/1
```

**Check:**
- [ ] Only rating changed to 5.0
- [ ] Other fields remain unchanged

---

### Test 6: Delete Restaurant (DELETE)

**Request:**
```bash
curl -X DELETE http://localhost:8081/restaurants/16
```

**Expected Response:**
- Status: `204 No Content`

**Verify Deletion:**
```bash
curl http://localhost:8081/restaurants/16
```

**Expected:**
- Status: `404 Not Found`

---

### Test 7: Pagination

**Request:**
```bash
curl "http://localhost:8081/restaurants?page=0&size=5"
```

**Expected Response:**
- Status: `200 OK`
- `_embedded.restaurants` array with 5 items
- `page.size`: 5
- `page.totalElements`: 15 (or current count)
- `page.totalPages`: 3
- `page.number`: 0

**Verify:**
- [ ] Only 5 restaurants returned
- [ ] Pagination metadata present
- [ ] Links for navigation (next, last)

**Test Page 2:**
```bash
curl "http://localhost:8081/restaurants?page=1&size=5"
```

**Verify:**
- [ ] Different 5 restaurants
- [ ] `page.number`: 1

---

### Test 8: Sorting

**Sort by Rating (Descending):**
```bash
curl "http://localhost:8081/restaurants?sort=rating,desc"
```

**Verify:**
- [ ] First restaurant has highest rating (4.9 - The Steakhouse)
- [ ] Restaurants ordered by rating descending

**Sort by Name (Ascending):**
```bash
curl "http://localhost:8081/restaurants?sort=name,asc"
```

**Verify:**
- [ ] Restaurants ordered alphabetically by name

---

### Test 9: Combined Pagination and Sorting

**Request:**
```bash
curl "http://localhost:8081/restaurants?page=0&size=3&sort=rating,desc"
```

**Expected:**
- Top 3 restaurants by rating
- The Steakhouse (4.9)
- Sushi Palace (4.8)
- Le Petit Bistro (4.7)

**Verify:**
- [ ] Only 3 restaurants
- [ ] Sorted by rating descending
- [ ] Pagination info shows size=3

---

### Test 10: Access via API Gateway

**Prerequisites:**
- API Gateway running on port 8888

**Request:**
```bash
curl http://localhost:8888/restaurants
```

**Expected:**
- Same response as direct access
- Routed through API Gateway

**Verify:**
- [ ] Response matches direct access
- [ ] CORS headers present (if configured)

---

## Error Cases Testing

### Test 11: Get Non-Existent Restaurant
```bash
curl http://localhost:8081/restaurants/999
```

**Expected:**
- Status: `404 Not Found`

---

### Test 12: Create with Invalid Data
```bash
curl -X POST http://localhost:8081/restaurants ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test\"}"
```

**Expected:**
- Status: `400 Bad Request` or `500 Internal Server Error`
- Error message about missing required fields

---

### Test 13: Update Non-Existent Restaurant
```bash
curl -X PUT http://localhost:8081/restaurants/999 ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test\",\"address\":\"Test\",\"cuisine\":\"Test\",\"rating\":4.5,\"latitude\":40.7,\"longitude\":-74.0}"
```

**Expected:**
- Status: `404 Not Found`

---

## Database Verification

### Check Data in PostgreSQL

```sql
-- Connect to database
psql -U postgres -d restaurantsdb

-- View all restaurants
SELECT id, name, cuisine, rating FROM restaurants ORDER BY id;

-- Count total restaurants
SELECT COUNT(*) FROM restaurants;

-- Get restaurants by cuisine
SELECT name, rating FROM restaurants WHERE cuisine = 'Italian';

-- Get top rated restaurants
SELECT name, rating FROM restaurants ORDER BY rating DESC LIMIT 5;

-- Exit
\q
```

---

## Performance Testing

### Load Test with Multiple Requests

**Windows PowerShell:**
```powershell
# Run 10 concurrent requests
1..10 | ForEach-Object -Parallel {
    Invoke-RestMethod -Uri "http://localhost:8081/restaurants"
}
```

**Verify:**
- All requests succeed with 200 OK
- Response time is reasonable (<500ms)

---

## Integration Testing Checklist

- [ ] Service starts without errors
- [ ] Database connection successful
- [ ] Tables created automatically
- [ ] Sample data loaded (15 restaurants)
- [ ] Registered with Eureka
- [ ] All CRUD operations work
- [ ] Pagination works correctly
- [ ] Sorting works correctly
- [ ] Error handling works (404, 400)
- [ ] Accessible via API Gateway
- [ ] Health check responds
- [ ] PostgreSQL data persists after restart

---

## Postman Testing

### Import Collection
1. Open Postman
2. Import `postman-collection.json`
3. Collection includes 10 pre-configured requests

### Run Collection
1. Click "Runner" in Postman
2. Select "Restaurant Service API" collection
3. Click "Run Restaurant Service API"
4. View results

**Expected:**
- All requests pass (except DELETE which may fail on re-run)
- All status codes match expected values

---

## Troubleshooting Guide

### Service Won't Start

**Check:**
1. PostgreSQL is running: `Get-Service postgresql*`
2. Database exists: `psql -U postgres -l`
3. Port 8081 is available: `netstat -an | findstr 8081`
4. Eureka Server is running

### Can't Connect to Database

**Check:**
1. PostgreSQL credentials in `application.yml`
2. Database name is correct
3. PostgreSQL is accepting connections
4. Firewall settings

### No Data in Database

**Check:**
1. Console logs for "Sample restaurant data loaded"
2. Manually query database: `SELECT COUNT(*) FROM restaurants;`
3. Check if DataLoader ran successfully

### 404 on All Requests

**Check:**
1. Service is actually running
2. Using correct port (8081)
3. Path is correct (`/restaurants` not `/restaurant`)
4. Spring Data REST is configured correctly

---

## Success Criteria

✅ All 13 tests pass
✅ Service registered in Eureka
✅ Database has 15+ restaurants
✅ CRUD operations work correctly
✅ Pagination and sorting work
✅ Accessible via API Gateway
✅ No errors in console logs
✅ Health check returns UP status

---

## Clean Up (After Testing)

### Stop Services
Press `Ctrl+C` in each terminal running services

### Clean Database (Optional)
```sql
-- Connect to PostgreSQL
psql -U postgres

-- Drop database
DROP DATABASE restaurantsdb;

-- Recreate if needed
CREATE DATABASE restaurantsdb;
```

---

## Next Steps

After successful testing:
1. ✅ Configure additional services (reservation-service, places-service)
2. ✅ Set up authentication/authorization
3. ✅ Add custom queries to repository
4. ✅ Implement business logic layer
5. ✅ Add comprehensive error handling
6. ✅ Set up monitoring and logging
7. ✅ Deploy to production environment

---

## Testing Completed! 🎉

All tests passing means:
- Restaurant Service is fully functional
- Database integration works
- Service discovery works
- REST API is properly exposed
- Ready for integration with other services

