import React, { createContext, useContext } from 'react';
import { useDataSync } from '../../hooks/useDataSync';

const DataSyncContext = createContext(null);

export const useDataSyncContext = () => {
  const context = useContext(DataSyncContext);
  if (!context) {
    throw new Error('useDataSyncContext must be used within a DataSyncProvider');
  }
  return context;
};

export const DataSyncProvider = ({ 
  children, 
  enableAutoSync = true,
  syncInterval = 30 * 60 * 1000, // 30 minutes
  showNotifications = false,
  ...options 
}) => {
  const dataSyncHook = useDataSync({
    enableAutoSync,
    syncInterval,
    onSyncComplete: (result) => {
      console.log('🎉 Data sync completed successfully:', result);
      if (showNotifications && result.stats) {
        const totalItems = Object.values(result.stats).reduce((sum, count) => sum + count, 0);
        console.log(`📊 Synced ${totalItems} items from database to static files`);
      }
    },
    onSyncError: (error, willRetry) => {
      console.error('💥 Data sync failed:', error.message);
      if (showNotifications) {
        console.log(willRetry ? 'Will retry sync...' : 'Max retries reached');
      }
    },
    ...options
  });

  return (
    <DataSyncContext.Provider value={dataSyncHook}>
      {children}
    </DataSyncContext.Provider>
  );
};

export default DataSyncProvider;
