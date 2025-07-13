'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  ChevronDown,
  Copy,
  ExternalLink,
  LogOut,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useWalletStore } from '@/store';
import { shortenAddress, formatCurrency, getExplorerUrl } from '@/utils/format';

export const WalletButton: React.FC = () => {
  const { connected, address, balance, connect, disconnect } = useWalletStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleConnect = async () => {
    if (!connected) {
      await connect();
    } else {
      setShowDropdown(!showDropdown);
    }
  };

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <Button
        variant={connected ? 'outline' : 'primary'}
        onClick={handleConnect}
        className="min-w-[160px]"
      >
        {connected ? (
          <>
            <Wallet className="w-4 h-4" />
            {shortenAddress(address!)}
            <ChevronDown className="w-4 h-4 ml-1" />
          </>
        ) : (
          <>
            <Wallet className="w-4 h-4" />
            Connect Wallet
          </>
        )}
      </Button>

      <AnimatePresence>
        {showDropdown && connected && (
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
                  <span className="text-sm font-medium">{balance} SOL</span>
                </div>
                <div className="text-2xl font-bold">
                  {formatCurrency((parseFloat(balance || '0') * 40).toString())}
                </div>
              </div>

              <div className="p-2">
                <button
                  onClick={handleCopy}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Copy className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Copy Address</span>
                  </div>
                  {copied && (
                    <CheckCircle className="w-4 h-4 text-success" />
                  )}
                </button>

                <a
                  href={getExplorerUrl(address!)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">View on Explorer</span>
                  </div>
                </a>

                <button
                  onClick={handleDisconnect}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-error"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Disconnect</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}; 