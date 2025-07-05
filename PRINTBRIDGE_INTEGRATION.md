# PrintBridge WebSocket Integration

This document describes the WebSocket integration between your Next.js application and the PrintBridge server for Windows printing functionality.

## Overview

The PrintBridge integration provides a WebSocket connection to your local PrintBridge server running on `localhost:8080`, enabling real-time printer discovery and label printing capabilities.

## Architecture

```
Next.js App (Browser) ←→ WebSocket ←→ PrintBridge Server ←→ Windows Printers
```

## Components

### 1. usePrintBridge Hook (`src/hooks/usePrintBridge.ts`)

A React hook that manages the WebSocket connection to the PrintBridge server.

**Features:**
- Auto-connect on mount
- Auto-reconnect every 3 seconds if disconnected
- Real-time printer discovery
- Print job status updates
- Error handling and logging

**Usage:**
```typescript
const { 
  isConnected, 
  printers, 
  defaultPrinter, 
  sendPrintJob, 
  loading, 
  error 
} = usePrintBridge();
```

### 2. PrintBridgeContext (`src/context/PrintBridgeContext.tsx`)

React context provider that wraps the application and provides WebSocket functionality throughout the app.

### 3. PrintBridgeIntegration Component (`src/components/PrintBridgeIntegration.tsx`)

A comprehensive UI component that combines:
- Connection status display
- Printer selection
- Test print functionality
- Error handling
- Debug information

### 4. Test Page (`src/app/dashboard/printbridge-test/page.tsx`)

A dedicated test page accessible via the sidebar navigation for testing the PrintBridge integration.

## Setup Instructions

### 1. Start PrintBridge Server

Make sure your PrintBridge server is running on `localhost:8080`:

```bash
# Navigate to your PrintBridge server directory
cd PrintBridgeTrayApp
dotnet run
```

### 2. Access the Test Page

1. Navigate to your Next.js application
2. Go to the dashboard
3. Click on "PrintBridge Test" in the sidebar
4. Check the connection status

### 3. Test the Integration

1. **Check Connection**: The status should show "Connected" when the WebSocket connection is established
2. **Select Printer**: Choose a printer from the dropdown or use the default
3. **Test Print**: Click "Print Test Label" to send a test image

## WebSocket Protocol

### Connection
- **URL**: `ws://localhost:8080/ws`
- **Auto-reconnect**: Every 3 seconds if disconnected

### Message Format

**From PrintBridge Server:**
```json
{
  "type": "connection",
  "printers": ["Printer1", "Printer2"],
  "defaultPrinter": "Printer1"
}
```

**To PrintBridge Server:**
```typescript
// Send base64 image data directly
ws.send(base64ImageData);
```

## Integration with Existing Printer System

The PrintBridge integration works alongside your existing `PrinterContext` system:

- **PrintBridge**: For Windows-specific printing via PrintBridge server
- **PrinterContext**: For general printer management and fallback

## Troubleshooting

### Connection Issues

1. **Check PrintBridge Server**
   - Ensure PrintBridge server is running on `localhost:8080`
   - Check server logs for errors
   - Verify firewall settings

2. **Browser Console**
   - Open browser developer tools (F12)
   - Check for WebSocket connection errors
   - Look for console logs with connection status

3. **Network Issues**
   - Verify localhost is accessible
   - Check if port 8080 is blocked
   - Try accessing `http://localhost:8080` directly

### Printer Issues

1. **No Printers Detected**
   - Ensure PrintBridge server has access to system printers
   - Check PrintBridge server logs
   - Restart PrintBridge server

2. **Print Job Fails**
   - Verify printer is online and ready
   - Check printer driver compatibility
   - Review PrintBridge server logs

### Debug Information

The test page includes a debug section showing:
- Connection status
- Loading state
- Available printers count
- Default printer
- Selected printer

## API Reference

### usePrintBridge Hook

```typescript
interface PrintBridgePrinter {
  name: string;
  systemName: string;
  driverName: string;
  state: string;
  location: string;
  isDefault: boolean;
}

interface UsePrintBridgeReturn {
  isConnected: boolean;
  printers: PrintBridgePrinter[];
  defaultPrinter: PrintBridgePrinter | null;
  lastPrintResult: any;
  loading: boolean;
  error: string | null;
  sendPrintJob: (base64Image: string, printerName?: string) => boolean;
  connect: () => void;
  disconnect: () => void;
  reconnect: () => void;
}
```

### sendPrintJob Function

```typescript
sendPrintJob(base64Image: string, printerName?: string): boolean
```

- **base64Image**: Base64 encoded image data (with or without data URL prefix)
- **printerName**: Optional printer name (uses default if not specified)
- **Returns**: `true` if job sent successfully, `false` otherwise

## Security Considerations

- WebSocket connection is local only (`localhost:8080`)
- No authentication required for local connections
- Print jobs are sent as base64 data
- Error messages are logged for debugging

## Performance Notes

- Auto-reconnect interval: 3 seconds
- WebSocket connection is established on app load
- Print jobs are sent synchronously
- Connection status is updated in real-time

## Future Enhancements

1. **Authentication**: Add authentication for remote PrintBridge servers
2. **Queue Management**: Implement print job queuing
3. **Status Monitoring**: Real-time printer status monitoring
4. **Batch Printing**: Support for batch print operations
5. **Error Recovery**: Enhanced error recovery mechanisms

## Support

For issues with the PrintBridge integration:

1. Check the browser console for error messages
2. Review PrintBridge server logs
3. Test the connection using the test page
4. Verify printer availability and status 