-- Create the usersdb database
*/
);
    role VARCHAR(50) NOT NULL
    longitude DOUBLE PRECISION,
    latitude DOUBLE PRECISION,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    id BIGSERIAL PRIMARY KEY,
CREATE TABLE users (
/*
-- But you can manually create it if needed:
-- The table will be auto-created by Hibernate with ddl-auto: update

\c usersdb;
-- Connect to the database

CREATE DATABASE usersdb;

