-- Migration 004: Dashboard Features
-- Created: 2024-12-28
-- Description: Add tables for customer favorites, search history, and profile views tracking

-- ==================================================
-- CUSTOMER FAVORITES
-- ==================================================
-- Allows customers to save favorite installers for quick access
CREATE TABLE customer_favorites (
  id SERIAL PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  installer_profile_id UUID NOT NULL REFERENCES installer_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(customer_id, installer_profile_id)
);

-- Indexes for efficient queries
CREATE INDEX idx_customer_favorites_customer ON customer_favorites(customer_id);
CREATE INDEX idx_customer_favorites_installer ON customer_favorites(installer_profile_id);
CREATE INDEX idx_customer_favorites_created_at ON customer_favorites(created_at DESC);

-- ==================================================
-- CUSTOMER SEARCH HISTORY
-- ==================================================
-- Tracks customer search queries for "recent searches" feature
CREATE TABLE customer_search_history (
  id SERIAL PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  search_query VARCHAR(255),
  service_category_id INTEGER REFERENCES service_categories(id) ON DELETE SET NULL,
  city_id INTEGER REFERENCES cities(id) ON DELETE SET NULL,
  region_id INTEGER REFERENCES regions(id) ON DELETE SET NULL,
  results_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for efficient queries
CREATE INDEX idx_customer_search_history_customer ON customer_search_history(customer_id);
CREATE INDEX idx_customer_search_history_created_at ON customer_search_history(created_at DESC);

-- ==================================================
-- INSTALLER PROFILE VIEWS
-- ==================================================
-- Tracks profile views for analytics (supports both authenticated and anonymous views)
CREATE TABLE installer_profile_views (
  id SERIAL PRIMARY KEY,
  installer_profile_id UUID NOT NULL REFERENCES installer_profiles(id) ON DELETE CASCADE,
  viewer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  view_source VARCHAR(50) DEFAULT 'direct',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for efficient queries and analytics
CREATE INDEX idx_installer_profile_views_installer ON installer_profile_views(installer_profile_id);
CREATE INDEX idx_installer_profile_views_viewer ON installer_profile_views(viewer_id);
CREATE INDEX idx_installer_profile_views_created_at ON installer_profile_views(created_at DESC);

-- ==================================================
-- MIGRATION NOTES
-- ==================================================
-- 1. customer_favorites uses UNIQUE constraint to prevent duplicate favorites
-- 2. customer_search_history uses ON DELETE SET NULL for location references
--    to preserve search history even if locations are removed
-- 3. installer_profile_views supports anonymous views (viewer_id can be NULL)
-- 4. All tables use created_at DESC indexes for "recent" queries
-- 5. view_source tracks how users discovered the installer profile:
--    - 'direct': Direct link or bookmark
--    - 'search': From search results
--    - 'category': From category browse
--    - 'referral': From external link or recommendation
