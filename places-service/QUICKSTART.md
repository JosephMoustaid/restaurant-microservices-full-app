# Places Service Quick Start

## Prerequisites Check

- [ ] Java 21+ installed
- [ ] Eureka Server running on port 8761
- [ ] **Google Places API Key obtained**

## Quick Setup (5 minutes)

### 1. Get Google Places API Key

1. Go to: https://console.cloud.google.com/
2. Create/Select a project
3. Enable **Places API**
4. Create API Key under Credentials
5. Copy the API key

### 2. Set API Key

**Windows PowerShell:**
```powershell
$env:GOOGLE_PLACES_API_KEY="your_actual_api_key_here"
```

**Unix/Linux/Mac:**
```bash
export GOOGLE_PLACES_API_KEY="your_actual_api_key_here"
```

### 3. Start Required Services

```powershell
# Terminal 1: Eureka Server
cd ..\eureka-server
.\mvnw.cmd spring-boot:run

# Terminal 2: Places Service (after Eureka starts)
cd ..\places-service
.\mvnw.cmd spring-boot:run
```

### 4. Verify Service is Running

```bash
# Check Eureka Dashboard
Open: http://localhost:8761

# Check service health
curl http://localhost:8083/actuator/health
```

## Quick Test

### Test Search (Restaurants in NYC)
```bash
curl "http://localhost:8083/places/search?query=restaurant&location=40.7128,-74.0060"
```

### Test Search (Pizza Places)
```bash
curl "http://localhost:8083/places/search?query=pizza&location=40.7128,-74.0060&radius=5000"
```

### Test Search (Cafes)
```bash
curl "http://localhost:8083/places/search?query=cafe&location=40.7128,-74.0060"
```

## Expected Response

```json
{
  "results": [
    {
      "name": "Example Restaurant",
      "rating": 4.5,
      "latitude": 40.7128,
      "longitude": -74.0060,
      "types": ["restaurant", "food"],
      "userRatingsTotal": 1234
    }
  ],
  "status": "OK"
}
```

## Common Issues

### Issue: "REQUEST_DENIED" error

**Solution**:
1. Verify API key is set:
   ```bash
   echo $GOOGLE_PLACES_API_KEY
   ```
2. Enable Places API in Google Cloud Console
3. Enable billing (required by Google)

### Issue: Empty results

**Solution**:
- Check location format: `lat,lng` (e.g., `40.7128,-74.0060`)
- Increase radius parameter
- Try different query or location

### Issue: Port 8083 already in use

**Solution**: Change port in application.yml:
```yaml
server:
  port: 8084
```

### Issue: Service not in Eureka

**Solution**:
1. Ensure Eureka is running on 8761
2. Wait 30 seconds for registration
3. Check console logs for errors

## Test Locations

Here are some coordinates for testing:

| City | Coordinates |
|------|-------------|
| New York | `40.7128,-74.0060` |
| Los Angeles | `34.0522,-118.2437` |
| Chicago | `41.8781,-87.6298` |
| San Francisco | `37.7749,-122.4194` |
| Miami | `25.7617,-80.1918` |

## API Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| query | String | No | - | Search term (e.g., "restaurant") |
| location | String | No | - | "latitude,longitude" |
| radius | Integer | No | 5000 | Search radius in meters |

## Access via API Gateway

If API Gateway is running on port 8888:

```bash
curl "http://localhost:8888/places/search?query=restaurant&location=40.7128,-74.0060"
```

## Service Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/places/search` | Search nearby places |

## Verification Checklist

- [ ] Google Places API key obtained
- [ ] API key set as environment variable
- [ ] Places API enabled in Google Cloud
- [ ] Billing enabled in Google Cloud
- [ ] Eureka Server running (8761)
- [ ] Places Service running (8083)
- [ ] Service registered in Eureka
- [ ] Search returns results
- [ ] Can access via API Gateway

## Next Steps

After successful testing:
1. ✅ Set up API key restrictions
2. ✅ Monitor API usage and costs
3. ✅ Implement caching for popular searches
4. ✅ Add error handling
5. ✅ Configure rate limiting
6. ✅ Set up monitoring and logging

## Important Notes

⚠️ **Google Places API Costs:**
- Nearby Search: ~$0.032 per request
- Monitor usage at: https://console.cloud.google.com/
- Set up billing alerts to avoid surprises

✅ **Free Tier:**
- $200 credit per month
- ~6,250 requests per month free

🔒 **Security:**
- Never commit API keys to version control
- Use environment variables
- Restrict API key to specific IPs/domains in production

