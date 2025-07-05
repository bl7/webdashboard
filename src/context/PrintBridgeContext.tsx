"use client"

import React, { createContext, useContext, ReactNode } from 'react';
import { usePrintBridge } from '../hooks/usePrintBridge';

interface PrintBridgePrinter {
  name: string;
  systemName: string;
  driverName: string;
  state: string;
  location: string;
  isDefault: boolean;
}

interface PrintBridgeContextType {
  isConnected: boolean;
  printers: PrintBridgePrinter[];
  defaultPrinter: PrintBridgePrinter | null;
  lastPrintResult: any;
  loading: boolean;
  error: string | null;
  osType: 'mac' | 'windows' | 'other';
  sendPrintJob: (base64Image: string, printerName?: string) => boolean;
  connect: () => void;
  disconnect: () => void;
  reconnect: () => void;
}

const PrintBridgeContext = createContext<PrintBridgeContextType | undefined>(undefined);

export const PrintBridgeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const printBridge = usePrintBridge();

  return (
    <PrintBridgeContext.Provider value={printBridge}>
      {children}
    </PrintBridgeContext.Provider>
  );
};

export const usePrintBridgeContext = () => {
  const context = useContext(PrintBridgeContext);
  if (context === undefined) {
    throw new Error('usePrintBridgeContext must be used within a PrintBridgeProvider');
  }
  return context;
}; 