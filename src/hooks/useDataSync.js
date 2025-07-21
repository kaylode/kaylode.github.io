import { useEffect, useState, useCallback } from 'react';

/**
 * Hook to automatically sync database data to static files
 * This ensures the app has the latest data from the cloud database as static fallbacks
 */
export const useDataSync = (options = {}) => {
  const {
    enableAutoSync = true,
    syncInterval = 30 * 60 * 1000, // 30 minutes default
    onSyncComplete = null,
    onSyncError = null,
    maxRetries = 3
  } = options;

  const [syncStatus, setSyncStatus] = useState({
    isLoading: false,
    lastSync: null,
    error: null,
    stats: null,
    retryCount: 0
  });

  // Check if we should sync
  const shouldSync = useCallback(() => {
    if (!enableAutoSync) return false;
    
    const lastSync = syncStatus.lastSync;
    if (!lastSync) return true;
    
    const timeSinceLastSync = Date.now() - new Date(lastSync.syncTime).getTime();
    return timeSinceLastSync > syncInterval;
  }, [enableAutoSync, syncStatus.lastSync, syncInterval]);

  // Get current sync status
  const getSyncStatus = useCallback(async () => {
    // Only run on client-side
    if (typeof window === 'undefined') return null;
    
    try {
      const response = await fetch('/api/sync/database-to-static');
      const data = await response.json();
      return data.lastSync;
    } catch (error) {
      console.log('Could not retrieve sync status:', error.message);
      return null;
    }
  }, []);

  // Perform the sync
  const performSync = useCallback(async (force = false) => {
    // Only run on client-side
    if (typeof window === 'undefined') return;
    
    if (syncStatus.isLoading) return;
    
    if (!force && !shouldSync()) {
      console.log('⏭️ Skipping sync - too recent or disabled');
      return;
    }

    setSyncStatus(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null 
    }));

    try {
      console.log('🔄 Starting database sync...');
      
      const response = await fetch('/api/sync/database-to-static', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();

      if (response.ok || response.status === 207) {
        console.log('✅ Sync completed:', result);
        
        setSyncStatus(prev => ({
          ...prev,
          isLoading: false,
          lastSync: {
            syncTime: result.timestamp,
            success: response.ok,
            stats: result.stats,
            errors: result.errors || []
          },
          stats: result.stats,
          error: null,
          retryCount: 0
        }));

        if (onSyncComplete) {
          onSyncComplete(result);
        }
      } else {
        throw new Error(result.error || 'Sync failed');
      }

    } catch (error) {
      console.log('❌ Sync failed:', error.message);
      
      const newRetryCount = syncStatus.retryCount + 1;
      const shouldRetry = newRetryCount < maxRetries;

      setSyncStatus(prev => ({
        ...prev,
        isLoading: false,
        error: error.message,
        retryCount: newRetryCount
      }));

      if (onSyncError) {
        onSyncError(error, shouldRetry);
      }

      // Auto-retry with exponential backoff
      if (shouldRetry) {
        const retryDelay = Math.pow(2, newRetryCount) * 1000; // 2s, 4s, 8s...
        console.log(`🔄 Retrying sync in ${retryDelay}ms (attempt ${newRetryCount + 1}/${maxRetries})`);
        
        setTimeout(() => {
          performSync(force);
        }, retryDelay);
      }
    }
  }, [syncStatus.isLoading, syncStatus.retryCount, shouldSync, maxRetries, onSyncComplete, onSyncError]);

  // Initialize and setup auto-sync
  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;
    if (!enableAutoSync) return;

    let mounted = true;
    let intervalId;

    // Initial setup
    const initialize = async () => {
      if (!mounted) return;

      // Get current sync status
      const lastSync = await getSyncStatus();
      if (!mounted) return;

      setSyncStatus(prev => ({
        ...prev,
        lastSync
      }));

      // Perform initial sync if needed
      if (!lastSync || shouldSync()) {
        await performSync();
      }

      // Setup interval for periodic syncing
      if (mounted && syncInterval > 0) {
        intervalId = setInterval(() => {
          if (shouldSync()) {
            performSync();
          }
        }, Math.min(syncInterval, 5 * 60 * 1000)); // Max 5 minute intervals
      }
    };

    initialize();

    return () => {
      mounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [enableAutoSync, syncInterval, getSyncStatus, performSync, shouldSync]);

  // Handle visibility change (sync when tab becomes visible)
  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;
    if (!enableAutoSync) return;

    const handleVisibilityChange = () => {
      if (!document.hidden && shouldSync()) {
        console.log('🔄 Tab became visible, checking if sync needed...');
        performSync();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enableAutoSync, shouldSync, performSync]);

  return {
    syncStatus,
    performSync: (force = false) => performSync(force),
    isLoading: syncStatus.isLoading,
    lastSync: syncStatus.lastSync,
    error: syncStatus.error,
    stats: syncStatus.stats
  };
};

export default useDataSync;
