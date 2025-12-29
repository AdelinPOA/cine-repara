-- Migration 007: Mark Existing Users as Email Verified
-- Description: Sets email_verified = TRUE for all existing users created before email verification was enforced
-- Reason: Email verification was enabled as a security improvement, but existing users should not be locked out
-- Date: 2024-12-29

-- Mark all existing users as verified
-- This is a one-time migration to prevent locking out existing users
UPDATE users
SET
  email_verified = TRUE,
  updated_at = NOW()
WHERE
  email_verified = FALSE
  AND created_at < NOW();

-- Show results
SELECT
  COUNT(*) FILTER (WHERE email_verified = TRUE) as verified_users,
  COUNT(*) FILTER (WHERE email_verified = FALSE) as unverified_users
FROM users;
