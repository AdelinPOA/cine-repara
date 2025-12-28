-- Migration 005: Remove hourly rate fields
-- Created: 2024-12-28
-- Description: Remove hourly_rate_min and hourly_rate_max from installer_profiles
--              Pricing is now handled through direct client negotiation

-- Drop the view first (it depends on the columns)
DROP VIEW IF EXISTS installer_summary;

-- Remove hourly rate columns
ALTER TABLE installer_profiles
  DROP COLUMN IF EXISTS hourly_rate_min,
  DROP COLUMN IF EXISTS hourly_rate_max;

-- Recreate the view without hourly rate columns
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
