import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ethers } from 'ethers';

// Declare window ethereum type
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (params?: any) => void) => void;
      removeListener: (event: string, callback: (params?: any) => void) => void;
    };
  }
}

// Define types for our context
interface WalletContextData {
  isConnected: boolean;
  address: string | null;
  balance: string;
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.providers.JsonRpcSigner | null;
  isConnecting: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

// Create context with default values
export const WalletContext = createContext<WalletContextData>({
  isConnected: false,
  address: null,
  balance: '0',
  provider: null,
  signer: null,
  isConnecting: false,
  error: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
});


type WalletProviderProps = {
  children: React.ReactNode;
};

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState('0');
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize provider
  useEffect(() => {
    if (window.ethereum) {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(web3Provider);
    }
  }, []);

  // Handle account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
          updateBalance(accounts[0]);
        } else {
          disconnectWallet();
        }
      };

      const handleDisconnect = () => {
        disconnectWallet();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('disconnect', handleDisconnect);

      return () => {
        window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum?.removeListener('disconnect', handleDisconnect);
      };
    }
  }, [provider]);

  const updateBalance = async (walletAddress: string) => {
    if (provider) {
      try {
        const balance = await provider.getBalance(walletAddress);
        setBalance(ethers.utils.formatEther(balance));
      } catch (err) {
        console.error('Error fetching balance:', err);
        setError('Failed to fetch balance');
      }
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('Please install MetaMask!');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        const walletAddress = accounts[0];
        setAddress(walletAddress);
        setIsConnected(true);
        
        if (provider) {
          const signer = provider.getSigner();
          setSigner(signer);
          await updateBalance(walletAddress);
        }
      }
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setBalance('0');
    setSigner(null);
    setIsConnected(false);
    setError(null);
  };

  const contextValue = {
    isConnected,
    address,
    balance,
    provider,
    signer,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
  } as const;

  

  return React.createElement(
    WalletContext.Provider,
    { value: contextValue },
    children
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

