'use client';

import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { Token } from '@/types';

// Helius API types
interface HeliusTokenBalance {
  mint: string;
  amount: number;
  decimals: number;
  tokenAccount: string;
  owner: string;
}

interface HeliusAssetsByOwner {
  nativeBalance: {
    lamports: number;
    price_per_sol: number;
    total_price: number;
  };
  tokens: Array<{
    mint: string;
    amount: number;
    decimals: number;
    token_info: {
      symbol: string;
      name: string;
      price_info?: {
        price_per_token: number;
        total_price: number;
      };
    };
  }>;
}

export function useWalletBalance() {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<string>('0');
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(false);

  // Extract Helius API key from RPC endpoint URL
  // This enables enhanced token metadata and balance fetching
  const getHeliusApiKey = () => {
    const endpoint = process.env.NEXT_PUBLIC_RPC_ENDPOINT || '';
    const match = endpoint.match(/api-key=([a-zA-Z0-9-]+)/);
    return match ? match[1] : null;
  };

  useEffect(() => {
    const fetchBalance = async () => {
      if (!publicKey || !connection) {
        setBalance('0');
        setTokens([]);
        return;
      }

      setLoading(true);
      const heliusApiKey = getHeliusApiKey();
      
      try {
        // Fetch SOL balance
        const bal = await connection.getBalance(publicKey);
        const solBalance = bal / LAMPORTS_PER_SOL;
        setBalance(solBalance.toFixed(4));

        // Fetch real-time SOL price
        let solPrice = 95; // Default fallback price
        try {
          const priceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
          if (priceResponse.ok) {
            const priceData = await priceResponse.json();
            solPrice = priceData.solana?.usd || solPrice;
          }
        } catch (priceError) {
          console.warn('Failed to fetch SOL price, using fallback:', priceError);
        }

        // If we have Helius API key, fetch enhanced data
        if (heliusApiKey) {
          try {
            // Fetch token balances with metadata using Helius API
            const response = await fetch(`https://api.helius.xyz/v0/addresses/${publicKey.toBase58()}/balances?api-key=${heliusApiKey}`);
            
            if (response.ok) {
              const data = await response.json();
              const tokenList: Token[] = [];

              // Add SOL as the first token
              tokenList.push({
                address: 'So11111111111111111111111111111111111111112',
                symbol: 'SOL',
                name: 'Solana',
                decimals: 9,
                logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
                balance: solBalance.toFixed(4),
                price: solPrice,
                value: solBalance * solPrice,
              });

              // Process SPL tokens
              if (data.tokens && Array.isArray(data.tokens)) {
                for (const token of data.tokens) {
                  if (token.amount > 0 && token.tokenAccount) {
                    try {
                      // Fetch token metadata
                      const metadataResponse = await fetch(
                        `https://api.helius.xyz/v0/tokens/metadata?api-key=${heliusApiKey}`,
                        {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ mintAccounts: [token.mint] }),
                        }
                      );

                      if (metadataResponse.ok) {
                        const metadata = await metadataResponse.json();
                        const tokenMetadata = metadata[0];
                        
                        if (tokenMetadata) {
                          const tokenBalance = token.amount / Math.pow(10, token.decimals);
                          tokenList.push({
                            address: token.mint,
                            symbol: tokenMetadata.symbol || 'Unknown',
                            name: tokenMetadata.name || 'Unknown Token',
                            decimals: token.decimals,
                            logoURI: tokenMetadata.logoURI || '',
                            balance: tokenBalance.toFixed(4),
                            price: 0, // Price would need separate API call
                            value: 0,
                          });
                        }
                      }
                    } catch (err) {
                      console.error('Error fetching token metadata:', err);
                    }
                  }
                }
              }

              setTokens(tokenList);
              return;
            }
          } catch (error) {
            console.error('Helius API error, falling back to basic balance:', error);
          }
        }

        // Fallback: Just show SOL balance
        const solToken: Token = {
          address: 'So11111111111111111111111111111111111111112',
          symbol: 'SOL',
          name: 'Solana',
          decimals: 9,
          logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
          balance: solBalance.toFixed(4),
          price: solPrice,
          value: solBalance * solPrice,
        };

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