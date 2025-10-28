-- ============================================
-- WMS Database Creation Script
-- ============================================

-- Drop database if exists
DROP DATABASE IF EXISTS wms_db;

-- Create database
CREATE DATABASE wms_db
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

COMMENT ON DATABASE wms_db IS 'Warehouse Management System Database';

-- Connect to the database
\c wms_db;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search
CREATE EXTENSION IF NOT EXISTS "btree_gist"; -- For advanced indexing

COMMENT ON EXTENSION "uuid-ossp" IS 'UUID generation functions';
COMMENT ON EXTENSION "pg_trgm" IS 'Trigram matching for text search';
COMMENT ON EXTENSION "btree_gist" IS 'Advanced indexing support';
