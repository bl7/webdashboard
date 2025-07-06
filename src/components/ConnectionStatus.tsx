import React from 'react';
import { usePrintBridgeContext } from '../context/PrintBridgeContext';
import { usePrinter } from '../context/PrinterContext';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';

export const ConnectionStatus: React.FC = () => {
  const { 
    isConnected: printBridgeConnected, 
    loading: printBridgeLoading,
    error: printBridgeError,
    osType
  } = usePrintBridgeContext();

  const {
    isConnected: printerConnected,
    loading: printerLoading,
    error: printerError,
  } = usePrinter();

  const getConnectionInfo = () => {
    if (osType === 'mac') {
      return {
        isConnected: printerConnected,
        loading: printerLoading,
        error: printerError
      };
    } else if (osType === 'windows') {
      return {
        isConnected: printBridgeConnected,
        loading: printBridgeLoading,
        error: printBridgeError
      };
    } else {
      return {
        isConnected: printerConnected,
        loading: printerLoading,
        error: printerError
      };
    }
  };

  const connectionInfo = getConnectionInfo();

  if (connectionInfo.loading) {
    return (
      <div className="flex items-center gap-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
        <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
        <span className="text-sm text-blue-800">Connecting to printer...</span>
      </div>
    );
  }

  if (connectionInfo.isConnected) {
    return (
      <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
        <Wifi className="h-4 w-4 text-green-600" />
        <span className="text-sm text-green-800">Printer connected successfully</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
      <WifiOff className="h-4 w-4 text-red-600" />
      <div className="flex flex-col">
        <span className="text-sm text-red-800">Printer disconnected</span>
        {connectionInfo.error && (
          <span className="text-xs text-red-600 mt-1">{connectionInfo.error}</span>
        )}
      </div>
    </div>
  );
}; 