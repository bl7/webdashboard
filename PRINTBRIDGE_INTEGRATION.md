# PrintBridge WebSocket Integration

This document describes the integrated WebSocket connection between your Next.js application and the PrintBridge server for Windows printing functionality.

## Overview

The PrintBridge integration has been **fully integrated** with your existing printer system. Both systems now work together seamlessly:

- **PrintBridge System**: Provides the WebSocket connection to `ws://localhost:8080/ws`
- **Existing Printer System**: Uses the PrintBridge connection for all printing operations
- **Unified Status Bar**: Shows both connection statuses in the top status bar

## Architecture

```
Next.js App (Browser) ←→ PrintBridge WebSocket ←→ PrintBridge Server ←→ Windows Printers
                                    ↓
                            Existing Printer System
                                    ↓
                            All Print Operations
```

## Integration Details

### 1. **Unified Connection**
- **Single WebSocket**: Only one connection to `ws://localhost:8080/ws`
- **Shared State**: Both systems use the same printer discovery and connection status
- **No Conflicts**: Eliminates duplicate connections and conflicts

### 2. **Updated Components**

#### **PrinterContext** (`src/context/PrinterContext.tsx`)
- Now uses `usePrintBridge` hook internally
- Maintains the same API for existing code
- All print operations go through PrintBridge

#### **PrinterStatusBar** (`src/components/PrinterStatusBar.tsx`)
- Shows both PrintBridge and legacy printer status
- Displays printer counts for both systems
- Shows connection errors if any

#### **Dashboard Layout** (`src/app/dashboard/layout.tsx`)
- PrintBridge provider wraps Printer provider
- Ensures proper context hierarchy

### 3. **Backward Compatibility**
- All existing code continues to work unchanged
- `usePrinter()` hook works exactly as before
- Print operations use the same API
- No breaking changes to existing functionality

## Components

### 1. usePrintBridge Hook (`src/hooks/usePrintBridge.ts`)

The core WebSocket connection manager used by both systems.

**Features:**
- Auto-connect on mount
- Auto-reconnect every 3 seconds if disconnected
- Real-time printer discovery
- Print job status updates
- Error handling and logging

### 2. PrintBridgeContext (`src/context/PrintBridgeContext.tsx`)

Provides WebSocket functionality for the test page and advanced features.

### 3. PrinterContext (`src/context/PrinterContext.tsx`)

**UPDATED**: Now uses PrintBridge internally while maintaining the same API.

### 4. PrinterStatusBar (`src/components/PrinterStatusBar.tsx`)

**UPDATED**: Shows both connection statuses:
- PrintBridge connection (WiFi icon)
- Legacy printer system status (Server icon)
- Printer counts for both systems
- Error messages if connections fail

### 5. PrintBridgeIntegration Component (`src/components/PrintBridgeIntegration.tsx`)

Advanced testing and debugging component for the dedicated test page.

### 6. Test Page (`src/app/dashboard/printbridge-test/page.tsx`)

Dedicated test page for advanced PrintBridge features and debugging.

## How It Works

### 1. **Connection Flow**
```
App Loads → PrintBridgeProvider → usePrintBridge → WebSocket Connection → PrintBridge Server
                ↓
        PrinterProvider → Uses PrintBridge Data → Available to All Components
```

### 2. **Print Flow**
```
Component → usePrinter().print() → PrintBridge.sendPrintJob() → WebSocket → PrintBridge Server → Printer
```

### 3. **Status Display**
```
PrinterStatusBar → Shows Both Statuses:
├── PrintBridge: Connected/Disconnected (WiFi icon)
└── Legacy System: Ready/Unavailable (Server icon)
```

## Setup Instructions

### 1. Start PrintBridge Server

Make sure your PrintBridge server is running on `localhost:8080`:

```bash
# Navigate to your PrintBridge server directory
cd PrintBridgeTrayApp
dotnet run
```

### 2. Check Status Bar

1. Navigate to your Next.js application dashboard
2. Look at the top status bar
3. You should see both connection statuses:
   - **PrintBridge**: Shows connection status and printer count
   - **Legacy System**: Shows system readiness

### 3. Test Printing

1. Go to the "Print Label" page
2. Select a printer from the dropdown
3. Add items to print queue
4. Click "Print Labels"
5. All print jobs now go through PrintBridge

### 4. Advanced Testing

1. Go to "PrintBridge Test" in the sidebar
2. Use the advanced testing interface
3. Test specific PrintBridge features

## Benefits of Integration

✅ **Single Connection**: Only one WebSocket connection to manage  
✅ **No Conflicts**: Eliminates duplicate connections  
✅ **Unified Status**: Both systems show status in one place  
✅ **Backward Compatible**: All existing code works unchanged  
✅ **Enhanced Features**: Access to advanced PrintBridge features  
✅ **Better Error Handling**: Comprehensive error reporting  
✅ **Real-time Updates**: Live connection and printer status  

## Troubleshooting

### Connection Issues

1. **Check PrintBridge Server**
   - Ensure PrintBridge server is running on `localhost:8080`
   - Check server logs for errors
   - Verify firewall settings

2. **Status Bar Indicators**
   - **PrintBridge Disconnected**: WebSocket connection failed
   - **Printer System Unavailable**: Legacy system not ready
   - **Error Messages**: Check the specific error shown

3. **Browser Console**
   - Open browser developer tools (F12)
   - Check for WebSocket connection errors
   - Look for console logs with connection status

### Printer Issues

1. **No Printers Detected**
   - Ensure PrintBridge server has access to system printers
   - Check PrintBridge server logs
   - Restart PrintBridge server

2. **Print Job Fails**
   - Verify printer is online and ready
   - Check printer driver compatibility
   - Review PrintBridge server logs

## API Reference

### usePrinter Hook (Updated)

```typescript
interface PrinterContextType {
  isConnected: boolean          // PrintBridge connection status
  loading: boolean             // PrintBridge loading state
  error: string | null         // PrintBridge error messages
  printers: Printer[]          // PrintBridge discovered printers
  defaultPrinter: Printer | null
  selectedPrinter: Printer | null
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  reconnect: () => Promise<void>
  print: (imageData: string, printer?: Printer) => Promise<void>
  selectPrinter: (printer: Printer | null) => void
}
```

### usePrintBridge Hook

```typescript
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

## Migration Notes

### What Changed
- **PrinterContext**: Now uses PrintBridge internally
- **PrinterStatusBar**: Shows both connection statuses
- **Dashboard Layout**: Includes PrintBridge provider
- **Main Layout**: Removed PrintBridge provider (moved to dashboard)

### What Stayed the Same
- **All existing code**: No changes needed
- **usePrinter() API**: Same interface
- **Print operations**: Same function calls
- **Component behavior**: Same user experience

## Future Enhancements

1. **Enhanced Status Monitoring**: Real-time printer status from PrintBridge
2. **Advanced Print Options**: PrintBridge-specific features
3. **Batch Operations**: Improved batch printing capabilities
4. **Error Recovery**: Enhanced error recovery mechanisms
5. **Performance Optimization**: Optimized print job handling

## Support

For issues with the integrated PrintBridge system:

1. Check the status bar for connection indicators
2. Review browser console for error messages
3. Test the connection using the test page
4. Verify PrintBridge server is running
5. Check printer availability and status

The integration is now complete and both systems work together seamlessly! 🎉 