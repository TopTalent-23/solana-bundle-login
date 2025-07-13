'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useConnection } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Copy, ExternalLink, Check, Power, ChevronDown } from 'lucide-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Button } from '@/components/ui/Button';
import { useUIStore } from '@/store';

export default function WalletConnection() {
  const { publicKey, disconnect, connected, connecting } = useWallet();
  const { connection } = useConnection();
  const { setVisible } = useWalletModal();
  const { addToast } = useUIStore();
  const [copied, setCopied] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toBase58());
      setCopied(true);
      addToast({
        type: 'success',
        title: 'Address copied',
        description: 'Wallet address copied to clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openExplorer = () => {
    if (publicKey) {
      window.open(`https://explorer.solana.com/address/${publicKey.toBase58()}`, '_blank');
    }
  };

  // Fetch wallet balance
  useEffect(() => {
    const getBalance = async () => {
      if (publicKey && connection) {
        try {
          const bal = await connection.getBalance(publicKey);
          setBalance(bal / LAMPORTS_PER_SOL);
        } catch (error) {
          console.error('Failed to get balance:', error);
        }
      }
    };

    getBalance();
    const interval = setInterval(getBalance, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, [publicKey, connection]);

  // Show loading state while connecting
  if (connecting) {
    return (
      <Button variant="outline" disabled>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
        Connecting...
      </Button>
    );
  }

  // Show connected state with dropdown menu
  if (connected && publicKey) {
    return (
      <div className="relative">
        <Button
          variant="outline"
          onClick={() => setShowDropdown(!showDropdown)}
          className="min-w-[160px]"
        >
          <Wallet className="w-4 h-4" />
          {truncateAddress(publicKey.toBase58())}
          <ChevronDown className="w-4 h-4 ml-1" />
        </Button>

        <AnimatePresence>
          {showDropdown && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40"
                onClick={() => setShowDropdown(false)}
              />
              
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-72 bg-card rounded-xl shadow-lg border border-border z-50 overflow-hidden"
              >
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Wallet Balance</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  </div>
                  <div className="text-2xl font-bold">
                    {balance !== null ? `${balance.toFixed(4)} SOL` : 'Loading...'}
                  </div>
                  {balance !== null && (
                    <div className="text-sm text-muted-foreground mt-1">
                      ≈ ${(balance * 95).toFixed(2)} USD
                    </div>
                  )}
                </div>

                <div className="p-2">
                  <button
                    onClick={copyAddress}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                      <span className="text-sm">Copy Address</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={openExplorer}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">View on Explorer</span>
                  </button>
                  
                  <hr className="my-1 border-border" />
                  
                  <button
                    onClick={() => {
                      disconnect();
                      setShowDropdown(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-error"
                  >
                    <Power className="w-4 h-4" />
                    <span className="text-sm">Disconnect</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Show connect button
  return (
    <Button
      variant="primary"
      onClick={() => setVisible(true)}
      className="min-w-[160px]"
    >
      <Wallet className="w-4 h-4" />
      Connect Wallet
    </Button>
  );
} 