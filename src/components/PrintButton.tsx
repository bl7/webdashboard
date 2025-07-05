import { usePrintBridgeContext } from '../context/PrintBridgeContext';
import { useState } from 'react';

export const PrintButton: React.FC = () => {
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

  const handlePrint = async () => {
    if (!isConnected) {
      console.error('❌ PrintBridge not connected');
      return;
    }

    // Use selected printer or default printer
    const printerToUse = selectedPrinter || defaultPrinter?.name;
    
    if (!printerToUse) {
      console.error('❌ No printer selected');
      return;
    }

    // For testing, create a simple test image
    const testImageData = testImage || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    
    if (sendPrintJob(testImageData, printerToUse)) {
      console.log('✅ Print job sent successfully to', printerToUse);
    } else {
      console.error('❌ Failed to send print job');
    }
  };

  const handleReconnect = () => {
    reconnect();
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="text-sm">
        <span className="font-medium">Status:</span> {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>
      
      {error && (
        <div className="text-sm text-red-600">
          <span className="font-medium">Error:</span> {error}
        </div>
      )}
      
      <div className="text-sm">
        <span className="font-medium">Available Printers:</span> {printers.length}
      </div>
      
      {printers.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Printer:</label>
          <select
            value={selectedPrinter}
            onChange={(e) => setSelectedPrinter(e.target.value)}
            className="w-full p-2 border rounded text-sm"
          >
            <option value="">Use Default Printer</option>
            {printers.map((printer) => (
              <option key={printer.name} value={printer.name}>
                {printer.name} {printer.isDefault ? '(Default)' : ''}
              </option>
            ))}
          </select>
        </div>
      )}
      
      <div className="text-sm">
        <span className="font-medium">Default Printer:</span> {defaultPrinter?.name || 'None'}
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Test Image (Base64):</label>
        <textarea
          value={testImage}
          onChange={(e) => setTestImage(e.target.value)}
          placeholder="Enter base64 image data or leave empty for test image"
          className="w-full p-2 border rounded text-xs h-20"
        />
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={handlePrint}
          disabled={!isConnected || loading}
          className="print-button"
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
    </div>
  );
}; 