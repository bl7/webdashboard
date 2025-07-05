import { usePrintBridgeContext } from '../context/PrintBridgeContext';

export const ConnectionStatus: React.FC = () => {
  const { isConnected, printers, loading, error } = usePrintBridgeContext();

  if (loading) {
    return (
      <div className="status disconnected">
        <div>🖨️ PrintBridge: Connecting...</div>
      </div>
    );
  }

  return (
    <div className={`status ${isConnected ? 'connected' : 'disconnected'}`}>
      <div>🖨️ PrintBridge: {isConnected ? 'Connected' : 'Disconnected'}</div>
      {isConnected && (
        <div>🖨️ Available Printers: {printers.length}</div>
      )}
      {error && (
        <div className="text-red-600 text-sm mt-1">Error: {error}</div>
      )}
    </div>
  );
}; 