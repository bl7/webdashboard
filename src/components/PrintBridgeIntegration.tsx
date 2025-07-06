import React, { useState } from 'react';
import { usePrintBridgeContext } from '../context/PrintBridgeContext';
import { usePrinter } from '../context/PrinterContext';
import { ConnectionStatus } from './ConnectionStatus';
import { Button } from './ui/button';
import Link from 'next/link';

type LabelHeight = "31mm" | "40mm" | "80mm";

function getPrinterName(printer: any) {
  if (!printer) return 'Unknown Printer';
  if (typeof printer.name === 'string') return printer.name;
  if (typeof printer.name === 'object') {
    if (printer.name.displayName) return printer.name.displayName;
    if (printer.name.label) return printer.name.label;
    return JSON.stringify(printer.name);
  }
  return String(printer.name);
}

export const PrintBridgeIntegration: React.FC = () => {
  const { 
    isConnected: printBridgeConnected, 
    printers: printBridgePrinters, 
    defaultPrinter: printBridgeDefaultPrinter, 
    sendPrintJob, 
    loading: printBridgeLoading, 
    error: printBridgeError,
    reconnect: printBridgeReconnect,
    osType
  } = usePrintBridgeContext();

  const {
    isConnected: printerConnected,
    printers: availablePrinters,
    defaultPrinter: legacyDefaultPrinter,
    print: legacyPrint,
    loading: printerLoading,
    error: printerError,
    reconnect: printerReconnect,
  } = usePrinter();
  
  const [selectedPrinterName, setSelectedPrinterName] = useState<string>('');
  const [labelHeight, setLabelHeight] = useState<LabelHeight>("31mm");
  const [printStatus, setPrintStatus] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  // Set mounted state after component mounts
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const getConnectionInfo = () => {
    if (osType === 'mac') {
      return {
        isConnected: printerConnected,
        printers: availablePrinters,
        defaultPrinter: legacyDefaultPrinter,
        loading: printerLoading,
        error: printerError,
        reconnect: printerReconnect,
        sendPrint: (imageData: string, printerName?: string) => {
          if (printerName) {
            const printer = availablePrinters.find(p => p.name === printerName);
            return legacyPrint(imageData, printer);
          }
          return legacyPrint(imageData);
        }
      };
    } else if (osType === 'windows') {
      return {
        isConnected: printBridgeConnected,
        printers: printBridgePrinters,
        defaultPrinter: printBridgeDefaultPrinter,
        loading: printBridgeLoading,
        error: printBridgeError,
        reconnect: printBridgeReconnect,
        sendPrint: sendPrintJob
      };
    } else {
      return {
        isConnected: printerConnected,
        printers: availablePrinters,
        defaultPrinter: legacyDefaultPrinter,
        loading: printerLoading,
        error: printerError,
        reconnect: printerReconnect,
        sendPrint: (imageData: string, printerName?: string) => {
          if (printerName) {
            const printer = availablePrinters.find(p => p.name === printerName);
            return legacyPrint(imageData, printer);
          }
          return legacyPrint(imageData);
        }
      };
    }
  };

  const connectionInfo = getConnectionInfo();

  // Create a simple test label image based on height
  const createTestLabel = (): string => {
    // Check if we're on the client side
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return '';
    }
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size based on label height at 300 DPI
    const width = 661; // 56mm at 300 DPI
    let height: number;
    
    switch (labelHeight) {
      case "31mm":
        height = 366; // 31mm at 300 DPI
        break;
      case "40mm":
        height = 472; // 40mm at 300 DPI
        break;
      case "80mm":
        height = 945; // 80mm at 300 DPI
        break;
      default:
        height = 366;
    }
    
    canvas.width = width;
    canvas.height = height;
    
    if (!ctx) return '';
    
    // White background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    
    // Purple border
    ctx.strokeStyle = '#7c3aed';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, width - 4, height - 4);
    
    // Purple background for header
    ctx.fillStyle = '#7c3aed';
    ctx.fillRect(0, 0, width, 60);
    
    // White text for header
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TEST LABEL', width / 2, 38);
    
    // Black text for main content
    ctx.fillStyle = 'black';
    ctx.font = 'bold 20px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Thank you for choosing', width / 2, 120);
    ctx.fillText('InstaLabel', width / 2, 150);
    
    // Additional info
    ctx.font = '16px Arial, sans-serif';
    ctx.fillText('Printer Test Successful', width / 2, 200);
    ctx.fillText('Connection: ' + (connectionInfo.isConnected ? 'Connected' : 'Disconnected'), width / 2, 230);
    ctx.fillText('Printer: ' + (selectedPrinterName || connectionInfo.defaultPrinter?.name || 'Default'), width / 2, 260);
    ctx.fillText('Label Size: ' + labelHeight, width / 2, 290);
    
    // Footer
    ctx.font = '12px Arial, sans-serif';
    ctx.fillText('Generated: ' + new Date().toLocaleString(), width / 2, height - 30);
    
    return canvas.toDataURL('image/png');
  };

  const handlePrint = async () => {
    // Check if we're on the client side
    if (typeof window === 'undefined') {
      return;
    }
    
    if (!connectionInfo.isConnected) {
      setPrintStatus('❌ Printer not connected');
      return;
    }

    // Use selected printer or default printer
    const printerToUse = selectedPrinterName || connectionInfo.defaultPrinter?.name;
    
    if (!printerToUse) {
      setPrintStatus('❌ No printer selected');
      return;
    }

    setPrintStatus('🖨️ Sending test label...');

    // Create the test label image
    const testImageData = createTestLabel();
    
    try {
      if (osType === 'windows') {
        // Windows: use PrintBridge sendPrintJob
        if (connectionInfo.sendPrint(testImageData, printerToUse)) {
          setPrintStatus(`✅ Test label sent to ${printerToUse}`);
        } else {
          setPrintStatus('❌ Failed to send test label');
        }
      } else {
        // Mac/Other: use legacy print
        await connectionInfo.sendPrint(testImageData, printerToUse);
        setPrintStatus(`✅ Test label sent to ${printerToUse}`);
      }
      setTimeout(() => setPrintStatus(''), 3000);
    } catch (error) {
      setPrintStatus('❌ Failed to send test label');
    }
  };

  const handleReconnect = () => {
    setPrintStatus('🔄 Reconnecting...');
    connectionInfo.reconnect();
    setTimeout(() => setPrintStatus(''), 2000);
  };

  // Auto-select default printer if available and no printer is selected
  React.useEffect(() => {
    const defaultPrinter: any = connectionInfo.defaultPrinter;
    if (defaultPrinter && !selectedPrinterName) {
      if (typeof defaultPrinter.name === 'object' && typeof defaultPrinter.name.name === 'string') {
        setSelectedPrinterName(defaultPrinter.name.name);
      } else if (typeof defaultPrinter.name === 'string') {
        setSelectedPrinterName(defaultPrinter.name);
      }
    }
  }, [connectionInfo.defaultPrinter, selectedPrinterName]);

  // When sending a print job, find the printer object by matching printer.name.name or printer.name to selectedPrinterName
  const getSelectedPrinter = () => {
    return connectionInfo.printers.find((p: any) =>
      (typeof p.name === 'object' && p.name.name === selectedPrinterName) ||
      (typeof p.name === 'string' && p.name === selectedPrinterName)
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-purple-800">Printer Integration</h2>
          <p className="text-sm text-gray-500 mt-1">Test and manage your printer connection</p>
        </div>
      </div>

      {/* Connection Status */}
      <div className="mb-6">
        <ConnectionStatus />
      </div>

      {/* Server Download Notice */}
      {!connectionInfo.isConnected && (
        <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="text-purple-600 mt-0.5">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-purple-800 mb-1">Need the printer server?</h4>
              <p className="text-sm text-purple-700 mb-2">
                If you don't have the printer server installed, you can download it from the Settings page.
              </p>
              <Link 
                href="/dashboard/settings" 
                className="inline-flex items-center px-3 py-1 bg-purple-600 text-white text-sm font-medium rounded hover:bg-purple-700 transition-colors"
              >
                Go to Settings →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {connectionInfo.error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-red-800 text-sm">
            <strong>Connection Error:</strong> {connectionInfo.error}
          </div>
        </div>
      )}

      {/* Printer Selection - Always show if printers are available */}
      {connectionInfo.printers.length > 0 && (
        <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h3 className="font-semibold text-purple-900 mb-3">Available Printers</h3>
          <div className="space-y-2">
            <label className="text-sm font-medium text-purple-800">
              Select Printer:
            </label>
            <select
              value={selectedPrinterName}
              onChange={e => setSelectedPrinterName(e.target.value)}
              className="w-full p-2 border border-purple-300 rounded text-sm bg-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            >
              <option value="">Select a printer...</option>
              {connectionInfo.printers.map((printer: any) => {
                const printerName = typeof printer.name === 'object' && typeof printer.name.name === 'string'
                  ? printer.name.name
                  : typeof printer.name === 'string'
                    ? printer.name
                    : 'Unknown Printer';
                return (
                  <option key={printerName} value={printerName}>
                    {printerName} {printer.isDefault ? '(Default)' : ''}
                  </option>
                );
              })}
            </select>
            <div className="text-xs text-purple-600">
              {connectionInfo.printers.length} printer(s) detected
            </div>
          </div>
        </div>
      )}

      {/* No Printers Available Message */}
      {connectionInfo.printers.length === 0 && connectionInfo.isConnected && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="text-yellow-600 mt-0.5">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-yellow-800 mb-1">No printers detected</h4>
              <p className="text-sm text-yellow-700">
                The server is connected but no printers were found. Make sure your printers are properly connected and the server has access to them.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Label Height Selection */}
      <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <h3 className="font-semibold text-purple-900 mb-3">Label Height</h3>
        <div className="space-y-2">
          <label className="text-sm font-medium text-purple-800">
            Select Label Height:
          </label>
          <select
            value={labelHeight}
            onChange={(e) => setLabelHeight(e.target.value as LabelHeight)}
            className="w-full p-2 border border-purple-300 rounded text-sm bg-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          >
            <option value="31mm">31mm (Small)</option>
            <option value="40mm">40mm (Medium)</option>
            <option value="80mm">80mm (Large)</option>
          </select>
          <div className="text-xs text-purple-600">
            Label will be printed at 56mm width x {labelHeight} height
          </div>
        </div>
      </div>

      {/* Test Label Preview */}
      {mounted ? (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="font-semibold mb-3 text-gray-800">Test Label Preview</h3>
          <div className="flex justify-center">
            <div className="border-2 border-purple-300 rounded-lg p-2 bg-white">
              <img 
                src={createTestLabel()} 
                alt="Test Label Preview" 
                className="object-contain"
                style={{ 
                  width: labelHeight === "31mm" ? '128px' : labelHeight === "40mm" ? '165px' : '330px',
                  height: labelHeight === "31mm" ? '72px' : labelHeight === "40mm" ? '93px' : '186px'
                }}
              />
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2 text-center">
            This test label will be printed at 56mm x {labelHeight}
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="font-semibold mb-3 text-gray-800">Test Label Preview</h3>
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-500">Loading preview...</div>
          </div>
        </div>
      )}

      {/* Print Status */}
      {printStatus && (
        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="text-sm">{printStatus}</div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button 
          onClick={handlePrint}
          disabled={!connectionInfo.isConnected || connectionInfo.loading || !selectedPrinterName}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white disabled:bg-gray-400"
        >
          {connectionInfo.loading ? 'Connecting...' : 'Print Test Label'}
        </Button>
        
        {!connectionInfo.isConnected && (
          <Button 
            onClick={handleReconnect}
            variant="outline"
            className="border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            Reconnect
          </Button>
        )}
      </div>

      {/* Debug Information */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-sm mb-2 text-gray-700">Debug Information</h4>
        <div className="text-xs space-y-1 text-gray-600">
          <div>Connection Status: {connectionInfo.isConnected ? 'Connected' : 'Disconnected'}</div>
          <div>Loading: {connectionInfo.loading ? 'Yes' : 'No'}</div>
          <div>Available Printers: {connectionInfo.printers.length}</div>
          <div>Default Printer: {
            connectionInfo.defaultPrinter
              ? (typeof (connectionInfo.defaultPrinter as any).name === 'object' && typeof (connectionInfo.defaultPrinter as any).name.name === 'string'
                  ? (connectionInfo.defaultPrinter as any).name.name
                  : typeof (connectionInfo.defaultPrinter as any).name === 'string'
                    ? (connectionInfo.defaultPrinter as any).name
                    : 'Unknown Printer')
              : 'None'
          }</div>
          <div>Selected Printer: {selectedPrinterName || 'None'}</div>
          <div>Label Height: {labelHeight}</div>
        </div>
      </div>
    </div>
  );
}; 