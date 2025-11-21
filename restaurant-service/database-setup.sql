-- PostgreSQL Database Setup Script for Restaurant Service
-- Run this script to create the database and table

-- Step 1: Create database (run this as postgres superuser)
-- Note: Disconnect from restaurantsdb if already connected
CREATE DATABASE restaurantsdb
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Step 2: Connect to the database
\c restaurantsdb

-- Step 3: Create restaurants table (optional - Hibernate will create it)
CREATE TABLE IF NOT EXISTS restaurants (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    cuisine VARCHAR(255) NOT NULL,
    rating DOUBLE PRECISION NOT NULL CHECK (rating >= 0 AND rating <= 5),
    latitude DOUBLE PRECISION NOT NULL CHECK (latitude >= -90 AND latitude <= 90),
    longitude DOUBLE PRECISION NOT NULL CHECK (longitude >= -180 AND longitude <= 180)
);

-- Step 4: Insert sample data
INSERT INTO restaurants (name, address, cuisine, rating, latitude, longitude) VALUES
('The Italian Corner', '123 Main St, New York, NY 10001', 'Italian', 4.5, 40.7128, -74.0060),
('Sushi Palace', '456 Park Ave, New York, NY 10022', 'Japanese', 4.8, 40.7614, -73.9776),
('Taco Fiesta', '789 Broadway, New York, NY 10003', 'Mexican', 4.2, 40.7308, -73.9973),
('Le Petit Bistro', '321 5th Ave, New York, NY 10016', 'French', 4.7, 40.7451, -73.9826),
('Dragon Wok', '654 Madison Ave, New York, NY 10065', 'Chinese', 4.3, 40.7644, -73.9665),
('Curry House', '987 Lexington Ave, New York, NY 10021', 'Indian', 4.6, 40.7689, -73.9658),
('The Steakhouse', '147 7th Ave, New York, NY 10011', 'American', 4.9, 40.7394, -74.0021),
('Mediterranean Delight', '258 3rd Ave, New York, NY 10010', 'Mediterranean', 4.4, 40.7348, -73.9840),
('Bangkok Street Food', '369 Amsterdam Ave, New York, NY 10024', 'Thai', 4.5, 40.7870, -73.9754),
('Pizzeria Romana', '741 Columbus Ave, New York, NY 10025', 'Italian', 4.6, 40.7921, -73.9665),
('The Burger Joint', '852 6th Ave, New York, NY 10001', 'American', 4.1, 40.7484, -73.9857),
('Pho Vietnam', '963 1st Ave, New York, NY 10022', 'Vietnamese', 4.4, 40.7549, -73.9677),
('Greek Taverna', '159 2nd Ave, New York, NY 10003', 'Greek', 4.5, 40.7269, -73.9866),
('BBQ Smokehouse', '753 10th Ave, New York, NY 10019', 'BBQ', 4.7, 40.7649, -73.9944),
('Vegetarian Garden', '951 Broadway, New York, NY 10010', 'Vegetarian', 4.3, 40.7411, -73.9897)
ON CONFLICT DO NOTHING;

-- Step 5: Verify data was inserted
SELECT COUNT(*) as total_restaurants FROM restaurants;

-- Step 6: Display all restaurants
SELECT id, name, cuisine, rating FROM restaurants ORDER BY rating DESC;

-- Step 7: Create indexes for better performance (optional)
CREATE INDEX IF NOT EXISTS idx_restaurants_cuisine ON restaurants(cuisine);
CREATE INDEX IF NOT EXISTS idx_restaurants_rating ON restaurants(rating);
CREATE INDEX IF NOT EXISTS idx_restaurants_location ON restaurants(latitude, longitude);

-- Verify setup
\dt
\d restaurants

