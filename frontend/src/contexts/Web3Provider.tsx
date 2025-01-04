import React from 'react';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';

import { Chain, zksyncSepoliaTestnet } from "wagmi/chains";

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
      [zksyncSepoliaTestnet.id]: http(zksyncSepoliaTestnet.rpcUrls.default.http[0])
    }
  })
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider debugMode>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};