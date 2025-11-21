@echo off
echo ============================================
echo Testing Restaurant Microservices
echo ============================================
echo.

echo Testing Eureka Server...
curl -s http://localhost:8761/eureka/apps > nul
if %errorlevel% == 0 (
    echo [OK] Eureka Server is running
) else (
    echo [ERROR] Eureka Server is not responding
)

echo.
echo Testing API Gateway...
curl -s http://localhost:8888/actuator/health > nul
if %errorlevel% == 0 (
    echo [OK] API Gateway is running
) else (
    echo [ERROR] API Gateway is not responding
)

echo.
echo Testing Restaurant Service...
curl -s http://localhost:8081/restaurants > nul
if %errorlevel% == 0 (
    echo [OK] Restaurant Service is running
) else (
    echo [ERROR] Restaurant Service is not responding
)

echo.
echo Testing Reservation Service...
curl -s http://localhost:8082/reservations > nul
if %errorlevel% == 0 (
    echo [OK] Reservation Service is running
) else (
    echo [ERROR] Reservation Service is not responding
)

echo.
echo Testing Places Service...
curl -s http://localhost:8083/places/search?location=40.7128,-74.0060 > nul
if %errorlevel% == 0 (
    echo [OK] Places Service is running
) else (
    echo [ERROR] Places Service is not responding
)

echo.
echo ============================================
echo Testing API Gateway Routing...
echo ============================================

echo.
echo Testing Restaurant Service via Gateway...
curl -s http://localhost:8888/restaurants > nul
if %errorlevel% == 0 (
    echo [OK] Restaurant routing through Gateway works
) else (
    echo [ERROR] Restaurant routing through Gateway failed
)

echo.
echo Testing Reservation Service via Gateway...
curl -s http://localhost:8888/reservations > nul
if %errorlevel% == 0 (
    echo [OK] Reservation routing through Gateway works
) else (
    echo [ERROR] Reservation routing through Gateway failed
)

echo.
echo Testing Places Service via Gateway...
curl -s "http://localhost:8888/places/search?location=40.7128,-74.0060" > nul
if %errorlevel% == 0 (
    echo [OK] Places routing through Gateway works
) else (
    echo [ERROR] Places routing through Gateway failed
)

echo.
echo ============================================
echo Verification Complete!
echo ============================================
echo.
echo For detailed testing, import the Postman collection:
echo restaurant-microservices-collection.json
echo.
pause
