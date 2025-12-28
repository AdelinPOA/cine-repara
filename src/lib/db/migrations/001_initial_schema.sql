-- Cine Repara Database Schema
-- PostgreSQL Database Migration

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Users table (both customers and installers)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('customer', 'installer')),
  phone VARCHAR(20),
  avatar_url TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Service categories (hierarchical: specialized + general)
CREATE TABLE service_categories (
  id SERIAL PRIMARY KEY,
  name_ro VARCHAR(100) NOT NULL,
  name_en VARCHAR(100),
  slug VARCHAR(100) UNIQUE NOT NULL,
  icon VARCHAR(50),
  parent_id INTEGER REFERENCES service_categories(id),
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Romanian administrative regions (județe)
CREATE TABLE regions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(2) UNIQUE NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('county', 'municipality')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Romanian cities
CREATE TABLE cities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  region_id INTEGER REFERENCES regions(id) ON DELETE CASCADE,
  postal_code VARCHAR(10),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  population INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(name, region_id)
);

-- Installer profiles (extended info for installers only)
CREATE TABLE installer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  business_name VARCHAR(255),
  bio TEXT,
  years_experience INTEGER,
  hourly_rate_min DECIMAL(10, 2),
  hourly_rate_max DECIMAL(10, 2),
  is_verified BOOLEAN DEFAULT FALSE,
  is_available BOOLEAN DEFAULT TRUE,
  profile_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Installer service categories (many-to-many)
CREATE TABLE installer_services (
  id SERIAL PRIMARY KEY,
  installer_profile_id UUID REFERENCES installer_profiles(id) ON DELETE CASCADE,
  service_category_id INTEGER REFERENCES service_categories(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(installer_profile_id, service_category_id)
);

-- Installer service areas (many-to-many with cities)
CREATE TABLE installer_service_areas (
  id SERIAL PRIMARY KEY,
  installer_profile_id UUID REFERENCES installer_profiles(id) ON DELETE CASCADE,
  city_id INTEGER REFERENCES cities(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(installer_profile_id, city_id)
);

-- Reviews and ratings
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  installer_profile_id UUID REFERENCES installer_profiles(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  service_category_id INTEGER REFERENCES service_categories(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  work_completed_at DATE,
  is_verified BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CHECK (rating BETWEEN 1 AND 5)
);

-- Review images (optional photos of completed work)
CREATE TABLE review_images (
  id SERIAL PRIMARY KEY,
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption VARCHAR(255),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Installer portfolio images
CREATE TABLE portfolio_images (
  id SERIAL PRIMARY KEY,
  installer_profile_id UUID REFERENCES installer_profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  title VARCHAR(255),
  description TEXT,
  service_category_id INTEGER REFERENCES service_categories(id),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Certifications and licenses
CREATE TABLE installer_certifications (
  id SERIAL PRIMARY KEY,
  installer_profile_id UUID REFERENCES installer_profiles(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  issuing_authority VARCHAR(255),
  issue_date DATE,
  expiry_date DATE,
  certificate_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- NEXTAUTH TABLES
-- =====================================================

-- Email verification tokens
CREATE TABLE verification_tokens (
  identifier VARCHAR(255) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires TIMESTAMP NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- Sessions (for NextAuth.js)
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMP NOT NULL
);

-- Accounts (for NextAuth.js - future OAuth support)
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  provider_account_id VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type VARCHAR(255),
  scope VARCHAR(255),
  id_token TEXT,
  session_state VARCHAR(255),
  UNIQUE(provider, provider_account_id)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- User lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Installer search and filtering
CREATE INDEX idx_installer_profiles_is_available ON installer_profiles(is_available);
CREATE INDEX idx_installer_profiles_is_verified ON installer_profiles(is_verified);
CREATE INDEX idx_installer_profiles_user_id ON installer_profiles(user_id);

-- Service category lookups
CREATE INDEX idx_service_categories_slug ON service_categories(slug);
CREATE INDEX idx_service_categories_parent_id ON service_categories(parent_id);
CREATE INDEX idx_service_categories_is_active ON service_categories(is_active);

-- Location-based search
CREATE INDEX idx_cities_region_id ON cities(region_id);
CREATE INDEX idx_cities_name ON cities(name);
CREATE INDEX idx_installer_service_areas_city ON installer_service_areas(city_id);
CREATE INDEX idx_installer_service_areas_installer ON installer_service_areas(installer_profile_id);

-- Service associations
CREATE INDEX idx_installer_services_installer ON installer_services(installer_profile_id);
CREATE INDEX idx_installer_services_category ON installer_services(service_category_id);

-- Review queries
CREATE INDEX idx_reviews_installer ON reviews(installer_profile_id);
CREATE INDEX idx_reviews_customer ON reviews(customer_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);

-- Session management
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(session_token);
CREATE INDEX idx_sessions_expires ON sessions(expires);

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- Installer summary with aggregated ratings
CREATE VIEW installer_summary AS
SELECT
  ip.id,
  ip.user_id,
  u.name,
  u.email,
  u.phone,
  u.avatar_url,
  ip.business_name,
  ip.bio,
  ip.years_experience,
  ip.hourly_rate_min,
  ip.hourly_rate_max,
  ip.is_verified,
  ip.is_available,
  ip.profile_completed,
  COALESCE(COUNT(DISTINCT r.id), 0) as review_count,
  COALESCE(AVG(r.rating), 0) as average_rating,
  COALESCE(COUNT(DISTINCT isa.city_id), 0) as service_area_count,
  COALESCE(COUNT(DISTINCT ins.service_category_id), 0) as service_count,
  ip.created_at,
  ip.updated_at
FROM installer_profiles ip
JOIN users u ON ip.user_id = u.id
LEFT JOIN reviews r ON ip.id = r.installer_profile_id
LEFT JOIN installer_service_areas isa ON ip.id = isa.installer_profile_id
LEFT JOIN installer_services ins ON ip.id = ins.installer_profile_id
GROUP BY ip.id, u.name, u.email, u.phone, u.avatar_url;

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for users table
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for installer_profiles table
CREATE TRIGGER update_installer_profiles_updated_at BEFORE UPDATE ON installer_profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for reviews table
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- CONSTRAINTS AND VALIDATION
-- =====================================================

-- Note: Role validation is handled at the application level
-- CHECK constraints with subqueries are not supported in PostgreSQL
-- Foreign keys ensure referential integrity
-- Application logic ensures role constraints are enforced
