import React, { useState } from 'react';
import { usePrintBridgeContext } from '../context/PrintBridgeContext';
import { ConnectionStatus } from './ConnectionStatus';

export const PrintBridgeIntegration: React.FC = () => {
  const { 
    isConnected, 
    printers, 
    defaultPrinter, 
    sendPrintJob, 
    loading, 
    error,
    reconnect 
  } = usePrintBridgeContext();
  
  const [selectedPrinter, setSelectedPrinter] = useState<string>('');
  const [testImage, setTestImage] = useState<string>('');
  const [printStatus, setPrintStatus] = useState<string>('');

  const handlePrint = async () => {
    if (!isConnected) {
      setPrintStatus('❌ PrintBridge not connected');
      return;
    }

    const printerToUse = selectedPrinter || defaultPrinter?.name;
    
    if (!printerToUse) {
      setPrintStatus('❌ No printer selected');
      return;
    }

    setPrintStatus('🖨️ Sending print job...');

    // For testing, create a simple test image
    const testImageData = testImage || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    
    if (sendPrintJob(testImageData, printerToUse)) {
      setPrintStatus(`✅ Print job sent to ${printerToUse}`);
      setTimeout(() => setPrintStatus(''), 3000);
    } else {
      setPrintStatus('❌ Failed to send print job');
    }
  };

  const handleReconnect = () => {
    setPrintStatus('🔄 Reconnecting...');
    reconnect();
    setTimeout(() => setPrintStatus(''), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold tracking-tight">PrintBridge Integration</h2>
        <div className="text-sm text-gray-500">
          WebSocket: ws://localhost:8080/ws
        </div>
      </div>

      {/* Connection Status */}
      <div className="mb-6">
        <ConnectionStatus />
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-red-800 text-sm">
            <strong>Connection Error:</strong> {error}
          </div>
        </div>
      )}

      {/* Printer Selection */}
      {isConnected && printers.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-3">Available Printers</h3>
          <div className="space-y-2">
            <label className="text-sm font-medium text-blue-800">
              Select Printer:
            </label>
            <select
              value={selectedPrinter}
              onChange={(e) => setSelectedPrinter(e.target.value)}
              className="w-full p-2 border border-blue-300 rounded text-sm bg-white"
            >
              <option value="">Use Default Printer ({defaultPrinter?.name})</option>
              {printers.map((printer) => (
                <option key={printer.name} value={printer.name}>
                  {printer.name} {printer.isDefault ? '(Default)' : ''}
                </option>
              ))}
            </select>
            <div className="text-xs text-blue-600">
              {printers.length} printer(s) detected
            </div>
          </div>
        </div>
      )}

      {/* Test Image Input */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Test Print Configuration</h3>
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Test Image (Base64):
          </label>
          <textarea
            value={testImage}
            onChange={(e) => setTestImage(e.target.value)}
            placeholder="Enter base64 image data or leave empty for test image"
            className="w-full p-3 border rounded-lg text-xs h-24 resize-none"
          />
          <div className="text-xs text-gray-500">
            Leave empty to use a simple test image
          </div>
        </div>
      </div>

      {/* Print Status */}
      {printStatus && (
        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="text-sm">{printStatus}</div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button 
          onClick={handlePrint}
          disabled={!isConnected || loading}
          className="print-button flex-1"
        >
          {loading ? 'Connecting...' : 'Print Test Label'}
        </button>
        
        {!isConnected && (
          <button 
            onClick={handleReconnect}
            className="print-button bg-gray-600 hover:bg-gray-700"
          >
            Reconnect
          </button>
        )}
      </div>

      {/* Debug Information */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-sm mb-2">Debug Information</h4>
        <div className="text-xs space-y-1 text-gray-600">
          <div>Connection Status: {isConnected ? 'Connected' : 'Disconnected'}</div>
          <div>Loading: {loading ? 'Yes' : 'No'}</div>
          <div>Available Printers: {printers.length}</div>
          <div>Default Printer: {defaultPrinter?.name || 'None'}</div>
          <div>Selected Printer: {selectedPrinter || 'Default'}</div>
        </div>
      </div>
    </div>
  );
}; 