
import { useWallet } from '../contexts/WalletContext';

export const WalletConnect = () => {
  const { 
    isConnected, 
    address, 
    balance, 
    isConnecting, 
    error, 
    connectWallet, 
    disconnectWallet 
  } = useWallet();

  return (
    <div className="p-4">
      {error && (
        <div className="text-red-500 mb-4">
          {error}
        </div>
      )}
      
      {!isConnected ? (
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <div className="space-y-2">
          <p className="font-mono">Address: {address}</p>
          <p>Balance: {balance} ETH</p>
          <button
            onClick={disconnectWallet}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};