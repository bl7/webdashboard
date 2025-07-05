"use client"

import React from 'react';
import { PrintBridgeIntegration } from '@/components/PrintBridgeIntegration';

export default function PrintBridgeTestPage() {
  return (
    <div className="space-y-10 py-8 px-2 md:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            PrintBridge WebSocket Test
          </h1>
          <p className="text-gray-600">
            Test the WebSocket connection to your PrintBridge server and send print jobs.
          </p>
        </div>

        <PrintBridgeIntegration />

        <div className="mt-8 bg-white rounded-xl shadow-lg border p-6">
          <h2 className="text-xl font-bold mb-4">Setup Instructions</h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">1. Start PrintBridge Server</h3>
              <p className="text-gray-600">
                Make sure your PrintBridge server is running on localhost:8080
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">2. Check Connection</h3>
              <p className="text-gray-600">
                The status indicator should show "Connected" when the WebSocket connection is established.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">3. Select Printer</h3>
              <p className="text-gray-600">
                Choose a printer from the dropdown list or use the default printer.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">4. Test Print</h3>
              <p className="text-gray-600">
                Click "Print Test Label" to send a test image to the selected printer.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg border p-6">
          <h2 className="text-xl font-bold mb-4">Troubleshooting</h2>
          <div className="space-y-3 text-sm">
            <div>
              <strong>Connection Failed:</strong>
              <ul className="list-disc list-inside ml-4 mt-1 text-gray-600">
                <li>Check if PrintBridge server is running on localhost:8080</li>
                <li>Verify firewall settings</li>
                <li>Check browser console for error messages</li>
              </ul>
            </div>
            
            <div>
              <strong>No Printers Detected:</strong>
              <ul className="list-disc list-inside ml-4 mt-1 text-gray-600">
                <li>Ensure PrintBridge server has access to system printers</li>
                <li>Check PrintBridge server logs</li>
                <li>Restart PrintBridge server</li>
              </ul>
            </div>
            
            <div>
              <strong>Print Job Fails:</strong>
              <ul className="list-disc list-inside ml-4 mt-1 text-gray-600">
                <li>Verify printer is online and ready</li>
                <li>Check printer driver compatibility</li>
                <li>Review PrintBridge server logs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 