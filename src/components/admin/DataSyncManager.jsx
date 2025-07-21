import React, { useState } from 'react';
import { useDataSyncContext } from '../providers/DataSyncProvider';

const DataSyncManager = () => {
  const { syncStatus, performSync, isLoading, lastSync, error, stats } = useDataSyncContext();
  const [showDetails, setShowDetails] = useState(false);

  const formatDuration = (ms) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleString();
  };

  const getSyncStatusColor = () => {
    if (isLoading) return 'text-blue-600';
    if (error) return 'text-red-600';
    if (lastSync?.success) return 'text-green-600';
    return 'text-gray-600';
  };

  const getSyncStatusIcon = () => {
    if (isLoading) return '🔄';
    if (error) return '❌';
    if (lastSync?.success) return '✅';
    return '⏸️';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getSyncStatusIcon()}</span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Database Sync</h3>
            <p className={`text-sm ${getSyncStatusColor()}`}>
              {isLoading ? 'Syncing...' : error ? 'Sync failed' : lastSync?.success ? 'Up to date' : 'Not synced'}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded hover:bg-gray-50"
          >
            {showDetails ? 'Hide' : 'Show'} Details
          </button>
          <button
            onClick={() => performSync(true)}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Syncing...' : 'Sync Now'}
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="text-2xl font-bold text-blue-600">{value}</div>
              <div className="text-xs text-gray-500 capitalize">{key}</div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Information */}
      {showDetails && (
        <div className="mt-4 space-y-3 border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Last Sync:</span>
              <span className="ml-2 text-gray-600">
                {formatTimestamp(lastSync?.syncTime)}
              </span>
            </div>
            
            {lastSync?.duration && (
              <div>
                <span className="font-medium text-gray-700">Duration:</span>
                <span className="ml-2 text-gray-600">
                  {formatDuration(lastSync.duration)}
                </span>
              </div>
            )}
            
            <div>
              <span className="font-medium text-gray-700">Status:</span>
              <span className={`ml-2 ${getSyncStatusColor()}`}>
                {lastSync?.success ? 'Success' : error ? 'Failed' : 'Unknown'}
              </span>
            </div>
            
            <div>
              <span className="font-medium text-gray-700">Retry Count:</span>
              <span className="ml-2 text-gray-600">
                {syncStatus.retryCount || 0}
              </span>
            </div>
          </div>

          {/* Error Messages */}
          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
              <div className="font-medium text-red-800">Error:</div>
              <div className="text-red-700 text-sm mt-1">{error}</div>
            </div>
          )}

          {/* Errors from last sync */}
          {lastSync?.errors && lastSync.errors.length > 0 && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <div className="font-medium text-yellow-800">Sync Warnings:</div>
              <ul className="text-yellow-700 text-sm mt-1 space-y-1">
                {lastSync.errors.map((err, index) => (
                  <li key={index}>• {err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Detailed Stats */}
          {lastSync?.stats && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
              <div className="font-medium text-green-800 mb-2">Sync Results:</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                {Object.entries(lastSync.stats).map(([key, value]) => (
                  <div key={key} className="text-green-700">
                    <span className="capitalize">{key}:</span> <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Help Text */}
      <div className="mt-4 text-xs text-gray-500 bg-gray-50 p-3 rounded">
        <p className="mb-1">
          <strong>Auto-sync:</strong> Automatically syncs database content to static files every 30 minutes when online.
        </p>
        <p>
          <strong>Purpose:</strong> Ensures your app has the latest data as static fallbacks if the cloud database goes offline.
        </p>
      </div>
    </div>
  );
};

export default DataSyncManager;
