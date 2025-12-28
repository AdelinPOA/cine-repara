'use client';

import { useEffect } from 'react';
import type { ViewSource } from '@/lib/db/schema';

interface ProfileViewTrackerProps {
  installerId: string;
  viewSource?: ViewSource;
}

/**
 * ProfileViewTracker - Client component for tracking installer profile views
 * This component has no UI and runs a side effect to log the view to the API
 * Supports both authenticated and anonymous views
 */
export function ProfileViewTracker({ installerId, viewSource = 'direct' }: ProfileViewTrackerProps) {
  useEffect(() => {
    // Track profile view on component mount
    const trackView = async () => {
      try {
        await fetch(`/api/installers/${installerId}/views`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            view_source: viewSource,
          }),
        });
      } catch (error) {
        // Silent fail - don't block page rendering or show errors to user
        // View tracking is analytics, not critical functionality
        console.debug('Profile view tracking failed:', error);
      }
    };

    trackView();
  }, [installerId, viewSource]);

  // No UI - this component only handles side effects
  return null;
}
