-- Migration 006: Fix Incomplete Profiles
-- Description: Marks profiles as completed if they have services AND service areas
-- Reason: Bug in wizard didn't set profile_completed = TRUE when users finished the wizard
-- Date: 2024-12-28

-- Set profile_completed = TRUE for all profiles that have:
-- 1. At least one service in installer_services
-- 2. At least one city in installer_service_areas
-- These criteria indicate the wizard was completed but the flag wasn't set

UPDATE installer_profiles ip
SET
  profile_completed = TRUE,
  updated_at = NOW()
WHERE
  profile_completed = FALSE
  AND EXISTS (
    SELECT 1
    FROM installer_services
    WHERE installer_profile_id = ip.id
  )
  AND EXISTS (
    SELECT 1
    FROM installer_service_areas
    WHERE installer_profile_id = ip.id
  );

-- Show results
SELECT
  COUNT(*) as profiles_fixed,
  'Profiles marked as completed' as description
FROM installer_profiles
WHERE profile_completed = TRUE;
