"use client"

import { useState, useEffect, useRef } from 'react';

interface PrintBridgeMessage {
  type?: string;
  status?: string;
  message?: string;
  printers?: string[];
  defaultPrinter?: string;
  success?: boolean;
  printerName?: string;
  errorMessage?: string;
}

interface PrintBridgePrinter {
  name: string;
  systemName: string;
  driverName: string;
  state: string;
  location: string;
  isDefault: boolean;
}

export const usePrintBridge = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [printers, setPrinters] = useState<PrintBridgePrinter[]>([]);
  const [defaultPrinter, setDefaultPrinter] = useState<PrintBridgePrinter | null>(null);
  const [lastPrintResult, setLastPrintResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = () => {
    try {
      setLoading(true);
      setError(null);
      
      // Close existing connection if any
      if (wsRef.current) {
        wsRef.current.close();
      }

      const ws = new WebSocket('ws://localhost:8080/ws');
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('✅ Connected to PrintBridge server');
        setIsConnected(true);
        setError(null);
        setLoading(false);
      };

      ws.onmessage = (event) => {
        try {
          const data: PrintBridgeMessage = JSON.parse(event.data);
          console.log('📨 Received from PrintBridge:', data);

          if (data.type === 'connection') {
            // Convert printer names to PrintBridgePrinter objects
            const printerObjects: PrintBridgePrinter[] = (data.printers || []).map((name, index) => ({
              name,
              systemName: name,
              driverName: name,
              state: 'Ready',
              location: 'Local',
              isDefault: index === 0 // First printer is default
            }));
            
            setPrinters(printerObjects);
            
            if (data.defaultPrinter) {
              const defaultPrinterObj = printerObjects.find(p => p.name === data.defaultPrinter) || printerObjects[0];
              setDefaultPrinter(defaultPrinterObj || null);
            } else if (printerObjects.length > 0) {
              setDefaultPrinter(printerObjects[0]);
            }
            
            console.log('🖨️ Printers discovered:', printerObjects);
          }

          if (data.success !== undefined) {
            setLastPrintResult(data);
            console.log('🖨️ Print job result:', data);
          }

          if (data.type === 'error') {
            setError(data.message || 'PrintBridge error');
          }
        } catch (error) {
          console.error('❌ Error parsing PrintBridge message:', error);
        }
      };

      ws.onclose = () => {
        console.log('🔌 Disconnected from PrintBridge');
        setIsConnected(false);
        setPrinters([]);
        setDefaultPrinter(null);
        setLoading(false);
        
        // Auto-reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      };

      ws.onerror = (error) => {
        console.error('❌ PrintBridge WebSocket error:', error);
        setIsConnected(false);
        setError('Failed to connect to PrintBridge server');
        setLoading(false);
      };
    } catch (error) {
      console.error('❌ PrintBridge connection error:', error);
      setIsConnected(false);
      setError('Failed to connect to PrintBridge server');
      setLoading(false);
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
    }
  };

  const sendPrintJob = (base64Image: string, printerName?: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log('🖨️ Sending print job to PrintBridge...');
      
      // Remove data URL prefix if present
      const cleanImageData = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
      
      // Send the base64 image data directly
      wsRef.current.send(cleanImageData);
      return true;
    } else {
      console.error('❌ PrintBridge WebSocket not connected');
      setError('PrintBridge not connected');
      return false;
    }
  };

  const reconnect = () => {
    disconnect();
    setTimeout(connect, 1000);
  };

  useEffect(() => {
    connect();
    return () => disconnect();
  }, []);

  return {
    isConnected,
    printers,
    defaultPrinter,
    lastPrintResult,
    loading,
    error,
    sendPrintJob,
    connect,
    disconnect,
    reconnect
  };
}; 