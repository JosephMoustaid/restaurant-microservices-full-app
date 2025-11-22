-- Quick Database Creation Script for Restaurant Microservices
-- Copy and paste this into psql or pgAdmin Query Tool

-- Create restaurantsdb
CREATE DATABASE restaurantsdb
    WITH
    OWNER = postgres
    ENCODING = 'UTF8';

-- Create reservationsdb
CREATE DATABASE reservationsdb
    WITH
    OWNER = postgres
    ENCODING = 'UTF8';

-- Verify databases were created
\l restaurantsdb
\l reservationsdb

-- Success message
SELECT 'Databases created successfully!' AS status;

