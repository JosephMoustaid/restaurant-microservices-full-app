# PostgreSQL Database Setup Guide

## Error: "FATAL: database does not exist"

If you're seeing this error, it means the PostgreSQL databases haven't been created yet. Follow one of the methods below to create them.

---

## Prerequisites

1. **PostgreSQL installed and running**
   - Download from: https://www.postgresql.org/download/
   - Default port: 5432

2. **Default credentials** (or update scripts with your credentials)
   - Username: `postgres`
   - Password: `postgres`

3. **Verify PostgreSQL is running**
   ```powershell
   # Check if PostgreSQL service is running
   Get-Service -Name postgresql*
   
   # Or test connection
   psql -U postgres -c "SELECT version();"
   ```

---

## Method 1: Automated Setup (Recommended) 🚀

### Option A: PowerShell Script (Full Featured)

```powershell
# Run the automated setup script
.\setup-databases.ps1
```

This script will:
- ✅ Check PostgreSQL connection
- ✅ Create `restaurantsdb` database
- ✅ Create `reservationsdb` database
- ✅ Run initialization scripts
- ✅ Insert sample data
- ✅ Verify setup

### Option B: Batch File (Simple)

```cmd
# Run the simple batch setup
.\setup-databases.bat
```

---

## Method 2: Manual Setup via Command Line

### Using psql Command Line

```powershell
# Create restaurantsdb
psql -U postgres -c "CREATE DATABASE restaurantsdb WITH OWNER = postgres ENCODING = 'UTF8';"

# Create reservationsdb
psql -U postgres -c "CREATE DATABASE reservationsdb WITH OWNER = postgres ENCODING = 'UTF8';"

# Verify databases were created
psql -U postgres -c "\l" | Select-String -Pattern "restaurantsdb|reservationsdb"
```

### Using SQL File

```powershell
# Execute the SQL file
psql -U postgres -f create-databases.sql
```

---

## Method 3: Manual Setup via pgAdmin (GUI)

1. **Open pgAdmin 4**

2. **Connect to PostgreSQL Server**
   - Right-click on "Servers" → "PostgreSQL"
   - Enter password: `postgres`

3. **Create restaurantsdb**
   - Right-click on "Databases" → "Create" → "Database"
   - Database name: `restaurantsdb`
   - Owner: `postgres`
   - Encoding: `UTF8`
   - Click "Save"

4. **Create reservationsdb**
   - Repeat the process for `reservationsdb`

5. **Verify**
   - You should see both databases in the database list

---

## Method 4: Using Database Setup SQL Scripts

Each service has its own comprehensive setup script with sample data:

### Restaurant Service

```powershell
# Execute the full setup script
psql -U postgres -f .\restaurant-service\database-setup.sql
```

This will:
- Create `restaurantsdb` database
- Create `restaurants` table
- Insert 15 sample restaurants

### Reservation Service

```powershell
# Execute the full setup script
psql -U postgres -f .\reservation-service\database-setup.sql
```

This will:
- Create `reservationsdb` database
- Create `reservations` table
- Insert 10 sample reservations

---

## Verifying the Setup

### Check Databases Exist

```powershell
# List all databases
psql -U postgres -c "\l"

# Or check specifically
psql -U postgres -c "SELECT datname FROM pg_database WHERE datname IN ('restaurantsdb', 'reservationsdb');"
```

### Check Tables and Data

```powershell
# Check restaurants
psql -U postgres -d restaurantsdb -c "SELECT COUNT(*) as restaurant_count FROM restaurants;"
psql -U postgres -d restaurantsdb -c "SELECT * FROM restaurants LIMIT 3;"

# Check reservations
psql -U postgres -d reservationsdb -c "SELECT COUNT(*) as reservation_count FROM reservations;"
psql -U postgres -d reservationsdb -c "SELECT * FROM reservations LIMIT 3;"
```

---

## Database Configuration

The microservices are configured to connect with these settings:

### Restaurant Service (Port 8081)
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/restaurantsdb
    username: postgres
    password: postgres
```

### Reservation Service (Port 8082)
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/reservationsdb
    username: postgres
    password: postgres
```

---

## Troubleshooting

### Issue: "psql: command not found"

**Solution:** Add PostgreSQL to your PATH

```powershell
# Find PostgreSQL installation
$pgPath = "C:\Program Files\PostgreSQL\<version>\bin"

# Add to PATH temporarily
$env:Path += ";$pgPath"

# Or add permanently via System Environment Variables
```

Common PostgreSQL paths:
- `C:\Program Files\PostgreSQL\16\bin`
- `C:\Program Files\PostgreSQL\15\bin`
- `C:\Program Files\PostgreSQL\14\bin`

### Issue: "password authentication failed"

**Solution:** Update password in scripts or reset PostgreSQL password

```powershell
# If you know the correct password, update these files:
# - setup-databases.ps1 (line: $PGPASSWORD = "your_password")
# - setup-databases.bat (line: set PGPASSWORD=your_password)
# - application.yml in each service
```

### Issue: "connection refused"

**Solution:** Ensure PostgreSQL service is running

```powershell
# Check service status
Get-Service -Name postgresql*

# Start service if stopped
Start-Service -Name postgresql*

# Or use pgAdmin to start the server
```

### Issue: Database already exists

**Solution:** This is normal! The databases won't be recreated. Just verify they exist:

```powershell
psql -U postgres -c "\l" | Select-String -Pattern "restaurantsdb|reservationsdb"
```

### Issue: Tables are empty

**Solution:** Tables will be created automatically by Hibernate when you start the services. Sample data will be loaded via `data.sql` files.

Alternatively, run the full setup scripts:
```powershell
psql -U postgres -f .\restaurant-service\database-setup.sql
psql -U postgres -f .\reservation-service\database-setup.sql
```

---

## Quick Start After Database Setup

Once databases are created:

```powershell
# Start all services
.\start-all-services.bat

# Or start individually
cd eureka-server
mvn spring-boot:run

# In new terminal
cd api-gateway
mvn spring-boot:run

# In new terminal
cd restaurant-service
mvn spring-boot:run

# And so on...
```

---

## Database Schema

### restaurants table
| Column    | Type              | Description                    |
|-----------|-------------------|--------------------------------|
| id        | BIGSERIAL         | Primary key (auto-increment)   |
| name      | VARCHAR(255)      | Restaurant name                |
| address   | VARCHAR(255)      | Street address                 |
| cuisine   | VARCHAR(255)      | Type of cuisine                |
| rating    | DOUBLE PRECISION  | Rating (0-5)                   |
| latitude  | DOUBLE PRECISION  | GPS latitude (-90 to 90)       |
| longitude | DOUBLE PRECISION  | GPS longitude (-180 to 180)    |

### reservations table
| Column           | Type         | Description                    |
|------------------|--------------|--------------------------------|
| id               | BIGSERIAL    | Primary key (auto-increment)   |
| restaurant_id    | BIGINT       | Reference to restaurant        |
| customer_name    | VARCHAR(255) | Customer name                  |
| reservation_time | TIMESTAMP    | Date and time of reservation   |

---

## Additional Resources

- **PostgreSQL Documentation:** https://www.postgresql.org/docs/
- **pgAdmin Documentation:** https://www.pgadmin.org/docs/
- **Spring Boot Database Configuration:** https://docs.spring.io/spring-boot/docs/current/reference/html/data.html

---

## Summary

**Recommended approach:**
1. Run `.\setup-databases.ps1` (PowerShell) or `.\setup-databases.bat` (Command Prompt)
2. Wait for confirmation messages
3. Start the microservices with `.\start-all-services.bat`

The databases will be created with all necessary tables and sample data! 🎉

