@echo off
echo Starting Restaurant Microservices...
echo.
echo WARNING: Make sure PostgreSQL is running before starting services!
echo.
echo Databases required:
echo - restaurantsdb
echo - reservationsdb
echo - usersdb
echo.
pause

REM Change to project root directory
cd /d "%~dp0"

echo.
echo ============================================
echo 1. Starting Eureka Server (Port 8761)...
echo ============================================
start cmd /k "cd eureka-server && title Eureka-Server && .\mvnw.cmd spring-boot:run"
echo Waiting 45 seconds for Eureka Server to start...
timeout /t 45 /nobreak

echo.
echo ============================================
echo 2. Starting Restaurant Service (Port 8081)...
echo ============================================
start cmd /k "cd restaurant-service && title Restaurant-Service && .\mvnw.cmd spring-boot:run"
echo Waiting 30 seconds for Restaurant Service to register...
timeout /t 30 /nobreak

echo.
echo ============================================
echo 3. Starting Reservation Service (Port 8082)...
echo ============================================
start cmd /k "cd reservation-service && title Reservation-Service && .\mvnw.cmd spring-boot:run"
echo Waiting 30 seconds for Reservation Service to register...
timeout /t 30 /nobreak

echo.
echo ============================================
echo 4. Starting Places Service (Port 8083)...
echo ============================================
start cmd /k "cd places-service && title Places-Service && .\mvnw.cmd spring-boot:run"
echo Waiting 30 seconds for Places Service to register...
timeout /t 30 /nobreak

echo.
echo ============================================
echo 5. Starting User Service (Port 8084)...
echo ============================================
start cmd /k "cd user-service && title User-Service && .\mvnw.cmd spring-boot:run"
echo Waiting 30 seconds for Places Service to register...
timeout /t 30 /nobreak


echo.
echo ============================================
echo 6. Starting API Gateway (Port 8888)...
echo ============================================
start cmd /k "cd api-gateway && title API-Gateway && .\mvnw.cmd spring-boot:run"

echo.
echo ============================================
echo All services are starting up!
echo ============================================
echo.
echo Please wait 2-3 minutes for all services to be fully ready.
echo.
echo You can verify the services are running by visiting:
echo - Eureka Dashboard: http://localhost:8761
echo - API Gateway Health: http://localhost:8888/actuator/health
echo.
echo Import the Postman collection 'restaurant-microservices-collection.json'
echo to test all the APIs.
echo.
pause
