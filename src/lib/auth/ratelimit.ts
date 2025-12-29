/**
 * Rate Limiting for Authentication Endpoints
 *
 * In-memory rate limiting to prevent brute force attacks on login/register.
 * For production at scale, consider using Redis-based rate limiting (Upstash).
 *
 * Security: Prevents brute force password attacks and registration spam
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory store for rate limit attempts
// Key: identifier (email or IP address)
// Value: { count, resetAt }
const attempts = new Map<string, RateLimitRecord>();

// Cleanup old entries every 15 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of attempts.entries()) {
    if (now > record.resetAt) {
      attempts.delete(key);
    }
  }
}, 15 * 60 * 1000);

/**
 * Check if a request should be rate limited
 *
 * @param identifier - Unique identifier (email, IP address, or user ID)
 * @param limit - Maximum number of attempts allowed (default: 5)
 * @param windowMs - Time window in milliseconds (default: 15 minutes)
 * @returns true if request is allowed, false if rate limited
 *
 * @example
 * ```typescript
 * const allowed = checkRateLimit('user@example.com', 5, 15 * 60 * 1000);
 * if (!allowed) {
 *   throw new Error('Too many attempts. Please try again in 15 minutes.');
 * }
 * ```
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 5,
  windowMs: number = 15 * 60 * 1000 // 15 minutes default
): boolean {
  const now = Date.now();
  const record = attempts.get(identifier);

  // No previous attempts or window expired - allow and start new window
  if (!record || now > record.resetAt) {
    attempts.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return true;
  }

  // Within window - check if limit exceeded
  if (record.count >= limit) {
    return false; // Rate limited
  }

  // Increment count and allow
  record.count++;
  return true;
}

/**
 * Get remaining attempts for an identifier
 * Useful for showing user feedback
 *
 * @param identifier - Unique identifier
 * @param limit - Maximum attempts allowed
 * @returns Object with remaining attempts and reset time
 */
export function getRateLimitStatus(
  identifier: string,
  limit: number = 5
): {
  remaining: number;
  resetAt: Date | null;
  isLimited: boolean;
} {
  const record = attempts.get(identifier);
  const now = Date.now();

  if (!record || now > record.resetAt) {
    return {
      remaining: limit,
      resetAt: null,
      isLimited: false,
    };
  }

  const remaining = Math.max(0, limit - record.count);

  return {
    remaining,
    resetAt: new Date(record.resetAt),
    isLimited: remaining === 0,
  };
}

/**
 * Reset rate limit for an identifier
 * Use after successful login or for manual override
 *
 * @param identifier - Unique identifier to reset
 */
export function resetRateLimit(identifier: string): void {
  attempts.delete(identifier);
}

/**
 * Get time until rate limit reset
 *
 * @param identifier - Unique identifier
 * @returns Milliseconds until reset, or null if not rate limited
 */
export function getResetTime(identifier: string): number | null {
  const record = attempts.get(identifier);
  const now = Date.now();

  if (!record || now > record.resetAt) {
    return null;
  }

  return record.resetAt - now;
}
