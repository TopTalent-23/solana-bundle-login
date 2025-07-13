"use client";

import React, { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";

// Import the default wallet adapter styles
require("@solana/wallet-adapter-react-ui/styles.css");

export default function AppWalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Network configuration - Using Mainnet for production
  const network = WalletAdapterNetwork.Mainnet;
  
  // RPC endpoint - Using custom RPC if provided, otherwise fallback to public RPC
  const endpoint = useMemo(() => {
    // Check for custom RPC endpoint in environment variables
    if (process.env.NEXT_PUBLIC_RPC_ENDPOINT) {
      return process.env.NEXT_PUBLIC_RPC_ENDPOINT;
    }
    
    // Fallback to public RPC (not recommended for production)
    console.warn('Using public RPC endpoint. For better performance, set NEXT_PUBLIC_RPC_ENDPOINT in your .env.local file');
    return clusterApiUrl(network);
  }, [network]);

  // Wallet adapters configuration
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
} 