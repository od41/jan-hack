import React from 'react';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SIWEProvider, SIWEConfig, ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { SiweMessage } from 'siwe';

import { BASE_BACKEND_URL } from './AppProvider';

import { Chain } from "wagmi/chains";

export const lensTestnet: Chain = {
  id: 37111,
  name: "Lens Network Sepolia Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Lens",
    symbol: "GRASS",
  },
  rpcUrls: {
    default: { http: ["https://rpc.testnet.lens.dev"] },
  },
  blockExplorers: {
    default: { name: "Lens Explorer", url: "https://block-explorer.testnet.lens.dev" }
  },
  testnet: false,
};

const config = createConfig(
  getDefaultConfig({
    appName: 'FitFi Demo',
    walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID!,
    chains: [lensTestnet],
    transports: {
      [lensTestnet.id]: http(lensTestnet.rpcUrls.default.http[0])
    }
  })
);

const queryClient = new QueryClient();

const siweConfig: SIWEConfig = {
  getNonce: async () => fetch(`${BASE_BACKEND_URL}/api/users/nonce`).then((res) => res.text()),

  createMessage: ({ nonce, address, chainId }) => new SiweMessage({
    version: '1',
    domain: window.location.host,
    uri: window.location.origin,
    address,
    chainId,
    nonce,
    statement: 'Sign in to FitFi.',
  }).prepareMessage(),
  
  verifyMessage: async ({ message, signature }) => fetch(`${BASE_BACKEND_URL}/api/users/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, signature }),
  }).then((res) => res.ok),
  
  getSession: async () => fetch(`${BASE_BACKEND_URL}/api/users/session`).then((res) => res.ok ? res.json() : null),

  signOut: async () => fetch(`${BASE_BACKEND_URL}/api/users/logout`).then((res) => res.ok),
  
};

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <SIWEProvider {...siweConfig}>
          <ConnectKitProvider debugMode>{children}</ConnectKitProvider>
        </SIWEProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};