import { useEffect } from 'react';

/**
 * Component that triggers startup data sync when the app loads
 * This ensures the static data is up-to-date with the database
 */
const StartupSync = () => {
  useEffect(() => {
    // Only run on client-side and in production or when explicitly enabled
    if (typeof window === 'undefined') return;
    
    const shouldRunStartupSync = 
      process.env.NODE_ENV === 'production' || 
      process.env.NEXT_PUBLIC_ENABLE_STARTUP_SYNC === 'true';

    if (!shouldRunStartupSync) {
      console.log('🔇 Startup sync disabled in development');
      return;
    }

    // Delay the sync to not block initial page load
    const timeoutId = setTimeout(async () => {
      try {
        console.log('🚀 Triggering startup data sync...');
        
        const response = await fetch('/api/sync/startup');
        const result = await response.json();
        
        if (response.ok) {
          if (result.syncTriggered) {
            console.log('✅ Startup sync initiated successfully');
          } else if (result.skipped) {
            console.log('⏭️ Startup sync skipped (recent sync found)');
          } else {
            console.log('📴 Startup sync skipped (database unavailable)');
          }
        } else {
          console.warn('⚠️ Startup sync check failed:', result.error);
        }
      } catch (error) {
        console.warn('⚠️ Startup sync error:', error.message);
      }
    }, 2000); // 2 second delay to not interfere with page load

    return () => clearTimeout(timeoutId);
  }, []);

  // This component doesn't render anything
  return null;
};

export default StartupSync;
