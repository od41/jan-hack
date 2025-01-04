// src/hooks/useWallet.ts
import { useState, useCallback } from 'react';
import type { WalletState } from '../types/wallet.types';

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: null,
  });

  const connectWallet = useCallback(async () => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [accounts[0], 'latest'],
        });

        setWallet({
          isConnected: true,
          address: accounts[0],
          balance,
        });

        return true;
      } else {
        alert('Please install MetaMask or another web3 wallet to continue.');
        return false;
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      return false;
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setWallet({
      isConnected: false,
      address: null,
      balance: null,
    });
  }, []);

  return {
    wallet,
    connectWallet,
    disconnectWallet,
  };
};