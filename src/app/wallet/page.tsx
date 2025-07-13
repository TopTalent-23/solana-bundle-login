'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  ArrowDownToLine,
  QrCode,
  Copy,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Tooltip } from '@/components/ui/Tooltip';
import { useWalletStore } from '@/store';
import { formatCurrency, formatTokenAmount, formatPercentage, shortenAddress } from '@/utils/format';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function WalletPage() {
  const { address, tokens, balance } = useWalletStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  const totalBalance = tokens.reduce((sum, token) => sum + (token.value || 0), 0);

  const filteredTokens = tokens.filter(token =>
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Wallet Overview */}
        <motion.div {...fadeInUp}>
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold mb-2">{formatCurrency(totalBalance)}</h2>
                <p className="text-muted-foreground">Total Portfolio Value</p>
                <div className="flex items-center gap-2 mt-3">
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {shortenAddress(address!, 6)}
                  </code>
                  <button
                    onClick={handleCopyAddress}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {copied ? (
                      <CheckCircle className="w-4 h-4 text-success" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button icon={<Send className="w-4 h-4" />}>
                  Send
                </Button>
                <Button variant="outline" icon={<ArrowDownToLine className="w-4 h-4" />}>
                  Receive
                </Button>
                <Button variant="outline" icon={<QrCode className="w-4 h-4" />}>
                  QR Code
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="grid gap-4 md:grid-cols-3"
          {...fadeInUp}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">24h Change</p>
                <p className="text-2xl font-bold text-success">+5.24%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-success opacity-20" />
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Assets</p>
                <p className="text-2xl font-bold">{tokens.length}</p>
              </div>
              <div className="flex -space-x-2">
                {tokens.slice(0, 3).map((token, i) => (
                  <img
                    key={token.address}
                    src={token.logoURI}
                    alt={token.symbol}
                    className="w-8 h-8 rounded-full border-2 border-card"
                    style={{ zIndex: 3 - i }}
                  />
                ))}
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">SOL Balance</p>
                <p className="text-2xl font-bold">{formatTokenAmount(balance || '0')}</p>
              </div>
              <img
                src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
                alt="SOL"
                className="w-8 h-8 rounded-full"
              />
            </div>
          </Card>
        </motion.div>

        {/* Token List */}
        <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Your Tokens</h3>
            <div className="flex items-center gap-3">
              <Input
                placeholder="Search tokens..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
                className="w-64"
              />
              <Button variant="outline" icon={<Filter className="w-4 h-4" />} />
            </div>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Token</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Balance</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Price</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Value</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">24h</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTokens.map((token, index) => {
                    const change24h = Math.random() * 20 - 10; // Mock data
                    const isPositive = change24h > 0;
                    
                    return (
                      <motion.tr
                        key={token.address}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={token.logoURI}
                              alt={token.symbol}
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <p className="font-medium">{token.symbol}</p>
                              <p className="text-sm text-muted-foreground">{token.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="text-right py-4 px-4">
                          <p className="font-medium">{formatTokenAmount(token.balance || '0')}</p>
                        </td>
                        <td className="text-right py-4 px-4">
                          <p className="font-medium">{formatCurrency(token.price || 0)}</p>
                        </td>
                        <td className="text-right py-4 px-4">
                          <p className="font-medium">{formatCurrency(token.value || 0)}</p>
                        </td>
                        <td className="text-right py-4 px-4">
                          <div className={`flex items-center justify-end gap-1 ${
                            isPositive ? 'text-success' : 'text-error'
                          }`}>
                            {isPositive ? (
                              <TrendingUp className="w-4 h-4" />
                            ) : (
                              <TrendingDown className="w-4 h-4" />
                            )}
                            <span className="font-medium">
                              {formatPercentage(Math.abs(change24h))}
                            </span>
                          </div>
                        </td>
                        <td className="text-right py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button size="sm" variant="ghost">
                              Send
                            </Button>
                            <Button size="sm" variant="ghost">
                              Swap
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <Card hover className="text-center">
              <Send className="w-12 h-12 text-primary mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Send Tokens</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Transfer tokens to another wallet
              </p>
              <Button variant="outline" className="w-full">Send</Button>
            </Card>
            
            <Card hover className="text-center">
              <ArrowDownToLine className="w-12 h-12 text-secondary mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Receive Tokens</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Get your wallet address & QR code
              </p>
              <Button variant="outline" className="w-full">Receive</Button>
            </Card>
            
            <Card hover className="text-center">
              <TrendingUp className="w-12 h-12 text-accent mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Buy SOL</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Add funds to your wallet
              </p>
              <Button variant="outline" className="w-full">Buy</Button>
            </Card>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
} 