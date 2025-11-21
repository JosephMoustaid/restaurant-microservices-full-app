-- PostgreSQL Database Setup Script for Reservation Service
-- Run this script to create the database and table

-- Step 1: Create database (run this as postgres superuser)
CREATE DATABASE reservationsdb
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Step 2: Connect to the database
\c reservationsdb

-- Step 3: Create reservations table (optional - Hibernate will create it)
CREATE TABLE IF NOT EXISTS reservations (
    id BIGSERIAL PRIMARY KEY,
    restaurant_id BIGINT NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    reservation_time TIMESTAMP NOT NULL
);

-- Step 4: Insert sample data
INSERT INTO reservations (restaurant_id, customer_name, reservation_time) VALUES
(1, 'John Smith', '2025-11-22 19:00:00'),
(1, 'Jane Doe', '2025-11-22 20:00:00'),
(2, 'Bob Johnson', '2025-11-23 18:30:00'),
(3, 'Alice Williams', '2025-11-23 19:00:00'),
(4, 'Charlie Brown', '2025-11-24 18:00:00'),
(5, 'Diana Prince', '2025-11-24 20:00:00'),
(6, 'Edward Norton', '2025-11-25 19:30:00'),
(7, 'Fiona Green', '2025-11-25 18:00:00'),
(8, 'George Miller', '2025-11-26 19:00:00'),
(9, 'Hannah White', '2025-11-26 20:00:00')
ON CONFLICT DO NOTHING;

-- Step 5: Verify data was inserted
SELECT COUNT(*) as total_reservations FROM reservations;

-- Step 6: Display all reservations
SELECT id, restaurant_id, customer_name, reservation_time FROM reservations ORDER BY reservation_time;

-- Step 7: Create indexes for better performance (optional)
CREATE INDEX IF NOT EXISTS idx_reservations_restaurant ON reservations(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_reservations_time ON reservations(reservation_time);
CREATE INDEX IF NOT EXISTS idx_reservations_customer ON reservations(customer_name);

-- Step 8: Query reservations by restaurant
SELECT customer_name, reservation_time
FROM reservations
WHERE restaurant_id = 1
ORDER BY reservation_time;

-- Verify setup
\dt
\d reservations

