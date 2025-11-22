# PostgreSQL Database Setup Script for Restaurant Microservices
# This script creates all required databases for the microservices project

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "PostgreSQL Database Setup for Restaurant Microservices" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$PGHOST = "localhost"
$PGPORT = "5432"
$PGUSER = "postgres"
$PGPASSWORD = "postgres"

# Set environment variables for PostgreSQL
$env:PGPASSWORD = $PGPASSWORD

Write-Host "Checking PostgreSQL connection..." -ForegroundColor Yellow
$checkConnection = & psql -h $PGHOST -p $PGPORT -U $PGUSER -d postgres -c "SELECT version();" 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Cannot connect to PostgreSQL!" -ForegroundColor Red
    Write-Host "Please ensure:" -ForegroundColor Red
    Write-Host "1. PostgreSQL is installed and running" -ForegroundColor Red
    Write-Host "2. Username and password are correct (default: postgres/postgres)" -ForegroundColor Red
    Write-Host "3. PostgreSQL is listening on localhost:5432" -ForegroundColor Red
    exit 1
}

Write-Host "[OK] PostgreSQL connection successful!" -ForegroundColor Green
Write-Host ""

# Function to create database
function Create-Database {
    param (
        [string]$dbName,
        [string]$serviceName
    )

    Write-Host "Creating database: $dbName for $serviceName..." -ForegroundColor Yellow

    # Check if database exists
    $dbExists = & psql -h $PGHOST -p $PGPORT -U $PGUSER -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$dbName'" 2>&1

    if ($dbExists -eq "1") {
        Write-Host "  -> Database '$dbName' already exists. Skipping creation." -ForegroundColor Cyan
    } else {
        $createDb = & psql -h $PGHOST -p $PGPORT -U $PGUSER -d postgres -c "CREATE DATABASE $dbName WITH OWNER = postgres ENCODING = 'UTF8';" 2>&1

        if ($LASTEXITCODE -eq 0) {
            Write-Host "  [OK] Database '$dbName' created successfully!" -ForegroundColor Green
        } else {
            Write-Host "  [ERROR] Failed to create database '$dbName'" -ForegroundColor Red
            Write-Host "  Error: $createDb" -ForegroundColor Red
        }
    }
}

# Create databases for each service
Write-Host "Step 1: Creating databases..." -ForegroundColor Cyan
Write-Host ""

Create-Database -dbName "restaurantsdb" -serviceName "Restaurant Service"
Create-Database -dbName "reservationsdb" -serviceName "Reservation Service"

Write-Host ""
Write-Host "Step 2: Running initialization scripts..." -ForegroundColor Cyan
Write-Host ""

# Execute restaurant service setup
Write-Host "Initializing Restaurant Service database..." -ForegroundColor Yellow
if (Test-Path ".\restaurant-service\database-setup.sql") {
    & psql -h $PGHOST -p $PGPORT -U $PGUSER -d postgres -f ".\restaurant-service\database-setup.sql" 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  [OK] Restaurant Service database initialized!" -ForegroundColor Green
    } else {
        Write-Host "  [WARN] Some SQL statements may have failed (this is normal if tables already exist)" -ForegroundColor Yellow
    }
} else {
    Write-Host "  [WARN] database-setup.sql not found for restaurant-service" -ForegroundColor Yellow
}

# Execute reservation service setup
Write-Host "Initializing Reservation Service database..." -ForegroundColor Yellow
if (Test-Path ".\reservation-service\database-setup.sql") {
    & psql -h $PGHOST -p $PGPORT -U $PGUSER -d postgres -f ".\reservation-service\database-setup.sql" 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  [OK] Reservation Service database initialized!" -ForegroundColor Green
    } else {
        Write-Host "  [WARN] Some SQL statements may have failed (this is normal if tables already exist)" -ForegroundColor Yellow
    }
} else {
    Write-Host "  [WARN] database-setup.sql not found for reservation-service" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Step 3: Verifying databases..." -ForegroundColor Cyan
Write-Host ""

# Verify databases
Write-Host "Listing all databases:" -ForegroundColor Yellow
& psql -h $PGHOST -p $PGPORT -U $PGUSER -d postgres -c "\l" | Select-String -Pattern "restaurantsdb|reservationsdb"

Write-Host ""
Write-Host "Checking Restaurant Service tables..." -ForegroundColor Yellow
$restaurantCount = & psql -h $PGHOST -p $PGPORT -U $PGUSER -d restaurantsdb -tAc "SELECT COUNT(*) FROM restaurants;" 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  [OK] Found $restaurantCount restaurants in restaurantsdb" -ForegroundColor Green
} else {
    Write-Host "  [INFO] Tables will be created automatically when the service starts" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Checking Reservation Service tables..." -ForegroundColor Yellow
$reservationCount = & psql -h $PGHOST -p $PGPORT -U $PGUSER -d reservationsdb -tAc "SELECT COUNT(*) FROM reservations;" 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  [OK] Found $reservationCount reservations in reservationsdb" -ForegroundColor Green
} else {
    Write-Host "  [INFO] Tables will be created automatically when the service starts" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "[SUCCESS] Database setup completed successfully!" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can now start the microservices:" -ForegroundColor Yellow
Write-Host "  1. Run: .\start-all-services.bat" -ForegroundColor White
Write-Host "  or start services individually with Maven" -ForegroundColor White
Write-Host ""
Write-Host "Database Connection Info:" -ForegroundColor Cyan
Write-Host "  Host: $PGHOST" -ForegroundColor White
Write-Host "  Port: $PGPORT" -ForegroundColor White
Write-Host "  Username: $PGUSER" -ForegroundColor White
Write-Host "  Password: $PGPASSWORD" -ForegroundColor White
Write-Host "  Databases: restaurantsdb, reservationsdb" -ForegroundColor White
Write-Host ""

