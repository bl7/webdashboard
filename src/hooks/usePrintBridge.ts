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

const PRINTBRIDGE_DASHBOARD = "http://localhost:5000"
const PRINTBRIDGE_WS_WINDOWS = "ws://localhost:8080/ws"
const PRINTBRIDGE_WS_MAC = "ws://localhost:8080"

async function requestLoopbackAccess() {
  if (typeof window === "undefined" || window.location.protocol !== "https:") {
    return
  }

  try {
    await fetch(`${PRINTBRIDGE_DASHBOARD}/api/printers`, {
      mode: "no-cors",
      cache: "no-store",
      // Chrome Local Network Access: required so an HTTPS site may talk to loopback.
      targetAddressSpace: "loopback",
    } as RequestInit)
  } catch {
    // Permission denied or PrintBridge not running — WebSocket connect will surface the error.
  }
}

export const usePrintBridge = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [printers, setPrinters] = useState<PrintBridgePrinter[]>([]);
  const [defaultPrinter, setDefaultPrinter] = useState<PrintBridgePrinter | null>(null);
  const [lastPrintResult, setLastPrintResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [osType, setOsType] = useState<'mac' | 'windows' | 'other'>('other');
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()
  const retryTimeoutsRef = useRef<NodeJS.Timeout[]>([])
  const everConnectedRef = useRef(false)
  const connectGenRef = useRef(0)

  // Detect OS on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const platform = window.navigator.platform.toLowerCase();
      if (platform.includes('mac')) {
        setOsType('mac');
      } else if (platform.includes('win')) {
        setOsType('windows');
      } else {
        setOsType('other');
      }
      console.log('🖥️ OS detected:', osType);
    }
  }, []);

  const getWebSocketUrl = () => {
    // Dashboard UI is :5000. Print jobs go over WebSocket on :8080.
    if (osType === "mac") {
      return PRINTBRIDGE_WS_MAC
    }
    return PRINTBRIDGE_WS_WINDOWS
  }

  const connect = () => {
    const gen = ++connectGenRef.current
    try {
      setLoading(true)
      setError(null)

      // Fire in parallel. Do not await: Chrome needs the WebSocket to open
      // on the same user-gesture stack as Test Connection.
      void requestLoopbackAccess()

      if (wsRef.current) {
        wsRef.current.close()
      }

      const wsUrl = getWebSocketUrl()
      console.log(`🔌 Connecting to ${osType} endpoint: ${wsUrl}`)

      const ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onopen = () => {
        if (gen !== connectGenRef.current) return
        console.log(`✅ Connected to ${osType} server at ${wsUrl}`);
        everConnectedRef.current = true
        setIsConnected(true);
        setError(null);
        setLoading(false);
      };

        ws.onmessage = (event) => {
          try {
            const data: PrintBridgeMessage = JSON.parse(event.data);
            console.log(`📨 Received from ${osType} server:`, data);

            if (data.type === 'connection' || data.type === 'status') {
              // Handle both PrintBridge and legacy server responses
              let printerNames: string[] = [];
              
              if (data.printers && Array.isArray(data.printers)) {
                // PrintBridge format: array of printer names
                printerNames = data.printers;
              } else if (data.status && typeof data.status === 'object' && 'printers' in data.status) {
                // Legacy format: nested printers object
                const statusPrinters = (data.status as any).printers;
                if (Array.isArray(statusPrinters)) {
                  printerNames = statusPrinters.map((p: any) => p.name || p);
                }
              }

              // Convert printer names to PrintBridgePrinter objects
              const printerObjects: PrintBridgePrinter[] = printerNames.map((name, index) => ({
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
              
              console.log(`🖨️ Printers discovered on ${osType}:`, printerObjects);
            }

            if (data.success !== undefined) {
              setLastPrintResult(data);
              console.log(`🖨️ Print job result on ${osType}:`, data);
            }

            if (data.type === 'error') {
              setError(data.message || `${osType} server error`);
            }
          } catch (error) {
            console.error(`❌ Error parsing ${osType} server message:`, error);
          }
        };

        ws.onclose = () => {
          if (gen !== connectGenRef.current) return
          console.log(`🔌 Disconnected from ${osType} server`);
          setIsConnected(false);
          setPrinters([]);
          setDefaultPrinter(null);
          setLoading(false);

          if (everConnectedRef.current) {
            reconnectTimeoutRef.current = setTimeout(connect, 3000);
          }
        };

        ws.onerror = (error) => {
          if (gen !== connectGenRef.current) return
          console.error(`❌ ${osType} WebSocket error:`, error);
          setIsConnected(false);
          setError(`Failed to connect to ${osType} server`);
          setLoading(false);
        };
    } catch (error) {
      console.error(`❌ ${osType} connection error:`, error);
      setIsConnected(false);
      setError(`Failed to connect to ${osType} server`);
      setLoading(false);
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    retryTimeoutsRef.current.forEach(clearTimeout)
    retryTimeoutsRef.current = []
    if (wsRef.current) {
      wsRef.current.close();
    }
  };

  const sendPrintJob = (base64Image: string, printerName?: string, labelWidthMm: number = 56, labelHeightMm: number = 31) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log(`🖨️ Sending print job to ${osType} server...`);
      
      // Remove data URL prefix if present for legacy/mac, but keep full data URL for Windows
      const cleanImageData = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
      
      if (osType === 'windows') {
        // Send JSON with label dimensions, full data URL, and selected printer
        const payload = {
          labelWidth: labelWidthMm, // in mm
          labelHeight: labelHeightMm, // in mm
          image: base64Image, // full data URL
          selectedPrinter: printerName || undefined
        };
        wsRef.current.send(JSON.stringify(payload));
      } else {
        // Legacy format: send JSON with printer info and base64 only
        const printJob = {
          type: 'print',
          images: [cleanImageData],
          selectedPrinter: printerName
        };
        wsRef.current.send(JSON.stringify(printJob));
      }
      
      return true;
    } else {
      console.error(`❌ ${osType} WebSocket not connected`);
      setError(`${osType} server not connected`);
      return false;
    }
  };

  const reconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    retryTimeoutsRef.current.forEach(clearTimeout)
    retryTimeoutsRef.current = []
    // Keep this on the click stack so Chrome can show the local-network permission prompt.
    connect();
    // Chrome 147+ often fails the first localhost WebSocket if the user takes a
    // few seconds to allow local-network access. Retry after the prompt.
    retryTimeoutsRef.current.push(
      setTimeout(() => {
        if (wsRef.current?.readyState !== WebSocket.OPEN) connect()
      }, 2500),
      setTimeout(() => {
        if (wsRef.current?.readyState !== WebSocket.OPEN) connect()
      }, 6000)
    )
  };

  useEffect(() => {
    // Only connect after OS is detected
    if (osType !== 'other') {
      connect();
    }
    return () => disconnect();
  }, [osType]);

  return {
    isConnected,
    printers,
    defaultPrinter,
    lastPrintResult,
    loading,
    error,
    osType,
    sendPrintJob,
    connect,
    disconnect,
    reconnect
  };
};
