import { Address, createPublicClient, http, type Abi } from 'viem';
import { lensTestnet } from '../contexts/Web3Provider';
import FitFiABI from './FitFi.abi.json';
import contractAddresses from './contract-addresses.json';
import type { FitFiConfig } from './FitFi';

// Create a viem public client
export const publicClient = createPublicClient({
  chain: lensTestnet,
  transport: http()
});

// Get contract config
export function getFitFiContract(network: string = 'lensTestnet'): FitFiConfig {
  const address = contractAddresses[network].FitFi as Address;
  return {
    address,
    abi: FitFiABI as unknown as Abi, // Type assertion needed due to ABI format
  };
}