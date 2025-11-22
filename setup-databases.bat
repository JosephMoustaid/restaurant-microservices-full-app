@echo off
REM PostgreSQL Database Setup Script for Restaurant Microservices
REM This script creates all required databases

echo ==================================================
echo PostgreSQL Database Setup for Restaurant Microservices
echo ==================================================
echo.

REM Configuration
set PGHOST=localhost
set PGPORT=5432
set PGUSER=postgres
set PGPASSWORD=postgres

echo Creating databases...
echo.

echo Creating restaurantsdb...
psql -h %PGHOST% -p %PGPORT% -U %PGUSER% -d postgres -c "CREATE DATABASE restaurantsdb WITH OWNER = postgres ENCODING = 'UTF8';"
if %ERRORLEVEL% EQU 0 (
    echo [OK] restaurantsdb created successfully!
) else (
    echo [INFO] restaurantsdb may already exist
)

echo.
echo Creating reservationsdb...
psql -h %PGHOST% -p %PGPORT% -U %PGUSER% -d postgres -c "CREATE DATABASE reservationsdb WITH OWNER = postgres ENCODING = 'UTF8';"
if %ERRORLEVEL% EQU 0 (
    echo [OK] reservationsdb created successfully!
) else (
    echo [INFO] reservationsdb may already exist
)

echo.
echo ==================================================
echo Database setup completed!
echo ==================================================
echo.
echo You can now start the microservices with: start-all-services.bat
echo.
pause

