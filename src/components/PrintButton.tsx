import React, { useState } from 'react';
import { usePrintBridgeContext } from '../context/PrintBridgeContext';
import { usePrinter } from '../context/PrinterContext';

type LabelHeight = "31mm" | "40mm" | "80mm";

export const PrintButton: React.FC = () => {
  const { 
    isConnected: printBridgeConnected, 
    printers: printBridgePrinters, 
    defaultPrinter: printBridgeDefaultPrinter, 
    sendPrintJob, 
    loading: printBridgeLoading, 
    error: printBridgeError,
    osType
  } = usePrintBridgeContext();

  const {
    isConnected: printerConnected,
    printers: availablePrinters,
    defaultPrinter: legacyDefaultPrinter,
    print: legacyPrint,
    loading: printerLoading,
    error: printerError,
  } = usePrinter();

  const [selectedPrinter, setSelectedPrinter] = useState<string>('');
  const [labelHeight, setLabelHeight] = useState<LabelHeight>("31mm");
  const [printStatus, setPrintStatus] = useState<string>('');

  const getConnectionInfo = () => {
    if (osType === 'mac') {
      return {
        isConnected: printerConnected,
        printers: availablePrinters,
        defaultPrinter: legacyDefaultPrinter,
        loading: printerLoading,
        error: printerError,
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
        sendPrint: sendPrintJob
      };
    } else {
      return {
        isConnected: printerConnected,
        printers: availablePrinters,
        defaultPrinter: legacyDefaultPrinter,
        loading: printerLoading,
        error: printerError,
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
    ctx.fillText('Printer: ' + (selectedPrinter || connectionInfo.defaultPrinter?.name || 'Default'), width / 2, 260);
    ctx.fillText('Label Size: ' + labelHeight, width / 2, 290);
    
    // Footer
    ctx.font = '12px Arial, sans-serif';
    ctx.fillText('Generated: ' + new Date().toLocaleString(), width / 2, height - 30);
    
    return canvas.toDataURL('image/png');
  };

  const handlePrint = async () => {
    if (!connectionInfo.isConnected) {
      setPrintStatus('❌ Printer not connected');
      return;
    }

    // Use selected printer or default printer
    const printerToUse = selectedPrinter || connectionInfo.defaultPrinter?.name;
    
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

  // Auto-select default printer if available and no printer is selected
  React.useEffect(() => {
    if (connectionInfo.defaultPrinter && !selectedPrinter) {
      setSelectedPrinter(connectionInfo.defaultPrinter.name);
    }
  }, [connectionInfo.defaultPrinter, selectedPrinter]);

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="text-sm">
        <span className="font-medium">Status:</span> {connectionInfo.isConnected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>
      
      {connectionInfo.error && (
        <div className="text-sm text-red-600">
          <span className="font-medium">Error:</span> {connectionInfo.error}
        </div>
      )}
      
      <div className="text-sm">
        <span className="font-medium">Available Printers:</span> {connectionInfo.printers.length}
      </div>
      
      {connectionInfo.printers.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Printer:</label>
          <select
            value={selectedPrinter}
            onChange={(e) => setSelectedPrinter(e.target.value)}
            className="w-full p-2 border rounded text-sm"
          >
            <option value="">Select a printer...</option>
            {connectionInfo.printers.map((printer) => (
              <option key={printer.name} value={printer.name}>
                {printer.name} {printer.isDefault ? '(Default)' : ''}
              </option>
            ))}
          </select>
        </div>
      )}
      
      <div className="text-sm">
        <span className="font-medium">Default Printer:</span> {connectionInfo.defaultPrinter?.name || 'None'}
      </div>

      {/* Label Height Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Label Height:</label>
        <select
          value={labelHeight}
          onChange={(e) => setLabelHeight(e.target.value as LabelHeight)}
          className="w-full p-2 border rounded text-sm"
        >
          <option value="31mm">31mm (Small)</option>
          <option value="40mm">40mm (Medium)</option>
          <option value="80mm">80mm (Large)</option>
        </select>
        <div className="text-xs text-gray-500">
          56mm width x {labelHeight} height
        </div>
      </div>
      
      {/* Test Label Preview */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Test Label Preview:</label>
        <div className="flex justify-center">
          <div className="border-2 border-purple-300 rounded-lg p-2 bg-white">
            <img 
              src={createTestLabel()} 
              alt="Test Label Preview" 
              className="object-contain"
              style={{ 
                width: labelHeight === "31mm" ? '96px' : labelHeight === "40mm" ? '124px' : '248px',
                height: labelHeight === "31mm" ? '54px' : labelHeight === "40mm" ? '70px' : '140px'
              }}
            />
          </div>
        </div>
        <div className="text-xs text-gray-500 text-center">
          56mm x {labelHeight} test label
        </div>
      </div>
      
      {printStatus && (
        <div className="text-sm p-2 bg-gray-100 rounded">
          {printStatus}
        </div>
      )}
      
      <button 
        onClick={handlePrint}
        disabled={!connectionInfo.isConnected || connectionInfo.loading || !selectedPrinter}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {connectionInfo.loading ? 'Connecting...' : 'Print Test Label'}
      </button>
    </div>
  );
}; 