'use client';

import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { Token } from '@/types';

export function useWalletBalance() {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<string>('0');
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!publicKey || !connection) {
        setBalance('0');
        setTokens([]);
        return;
      }

      setLoading(true);
      try {
        // Fetch SOL balance
        const bal = await connection.getBalance(publicKey);
        const solBalance = bal / LAMPORTS_PER_SOL;
        setBalance(solBalance.toFixed(4));

        // Set SOL token info
        const solToken: Token = {
          address: 'So11111111111111111111111111111111111111112',
          symbol: 'SOL',
          name: 'Solana',
          decimals: 9,
          logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
          balance: solBalance.toFixed(4),
          price: 95, // Approximate SOL price
          value: solBalance * 95,
        };

        // TODO: Fetch other SPL tokens using getParsedTokenAccountsByOwner
        // For now, just return SOL
        setTokens([solToken]);
      } catch (error) {
        console.error('Failed to fetch balance:', error);
        setBalance('0');
        setTokens([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
    // Refresh every 30 seconds
    const interval = setInterval(fetchBalance, 30000);
    return () => clearInterval(interval);
  }, [publicKey, connection]);

  return {
    connected,
    address: publicKey?.toBase58(),
    balance,
    tokens,
    loading,
    publicKey,
  };
} 