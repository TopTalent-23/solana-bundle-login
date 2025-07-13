'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  TrendingUp,
  DollarSign,
  ArrowDownUp,
  CheckCircle2,
  Package,
  AlertCircle,
  Copy,
  ExternalLink,
  Zap,
  Rocket,
  ChevronDown,
  Filter,
  ArrowUpDown,
  Check,
  X,
  TrendingDown,
  BarChart3,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Tooltip } from '@/components/ui/Tooltip';
import { formatCurrency, formatTokenAmount, shortenAddress } from '@/utils/format';
import { useUIStore } from '@/store';

interface ManagedWallet {
  id: string;
  address: string;
  tokenBalance: string;
  tokenSymbol: string;
  solBalance: string;
  totalValue: number;
  createdAt: string;
  lastAction: string;
}

// Generate deterministic mock wallets to avoid hydration issues
const mockWallets: ManagedWallet[] = [
  '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZQs6KvtqA2',
  '9mZYQq4H8g5yPRRqadeca5k7B6JvQPLjKZGbNxgHbMUV',
  '3nxMaAHqJ4zKxFgKfXHDqzVBRhYJBKvKvdENEZvqNkhz',
  'FnQm7NpZQZLJhN8z3mQXkifzATGpRSqe8BPw2hfzNKqV',
  'BYvjKsPWeKtGmETNdvqDc1CqQxJXpWfQZKqMjfLnWRYE',
  'HXtBm8XZDnMR9eYaJ8cyxvQJD9TUnderground21hfW',
  'E5rk3nmgZBFU9Qwv3dBauLJmyN6cXqdVjqJcVkDTTwcG',
  'Aqk7GY8RmfSPqRNwmZJNkYtg5KfBkFxKnoVEZoxNZ2tD',
  'Dfu84QB7B6pgHoNvbTFwCYJhCsnKGb6dNeodomHLrJZY',
  'Cv9mGFZKaAg9XNMthbSkEfY5dqGHVdotoLNZRXXmQvz8',
  'GYu93rnfFRjLmETNdkl8cyxvQKLmJD9TXJjnbhSkEfY5',
  'H8z4KlmFRjnmETNdvqDc1CqGb6dNeodomHLrJZYQxJXp',
  'J2x8LlmETNdvqDc1CqQxJXpWfQZKqHJFnWRBPw2hfzNK',
  'K9y7NlmFRjnmETNdvqDc1CqQxJXpWfQdomHLrJZKqMjf',
  'L1w6MlmFRjnmETNdvqDc1CqQxJXpWfQZNeodomHLrJZY',
  'M3v5OlmFRjnmETNdvqDc1CqQxJXpWfQZKqMjfLnWRJZY',
  'N5u4PlmFRjnmETNdvqDc1CqQxJXpWfQZKqMjfLnWRYJZ',
  'P7t3QlmFRjnmETNdvqDc1CqQxJXpWfQZKqMjfLnWRYEJ',
  'Q9s2RlmFRjnmETNdvqDc1CqQxJXpWfQZKqMjfLnWRYEJ',
  'R1r9SlmFRjnmETNdvqDc1CqQxJXpWfQZKqMjfLnWRYEZ',
  'S3q8TlmFRjnmETNdvqDc1CqQxJXpWfQZKqMjfLnWRYEQ',
  'T5p7UlmFRjnmETNdvqDc1CqQxJXpWfQZKqMjfLnWRYEP',
  'U7o6VlmFRjnmETNdvqDc1CqQxJXpWfQZKqMjfLnWRYEO',
  'V9n5WlmFRjnmETNdvqDc1CqQxJXpWfQZKqMjfLnWRYEN',
].map((address, index) => {
  const tokenBalance = 50000 + index * 2500; // Deterministic values
  const currentPrice = 0.00065;
  const currentValue = tokenBalance * currentPrice;
  const solBalance = (0.1 + index * 0.02).toFixed(3); // Deterministic SOL balance
  
  return {
    id: (index + 1).toString(),
    address,
    tokenBalance: tokenBalance.toString(),
    tokenSymbol: 'BOOST',
    solBalance,
    totalValue: currentValue + parseFloat(solBalance) * 40,
    createdAt: '5 minutes ago',
    lastAction: 'Initial Buy',
  };
});

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

// Predefined selling strategies
const sellingStrategies = [
  { name: 'Take Profits', description: 'Sell 50% from all wallets', percentage: 50 },
  { name: 'Partial Exit', description: 'Sell 75% to secure gains', percentage: 75 },
  { name: 'Full Exit', description: 'Sell 100% from selected', percentage: 100 },
  { name: 'DCA Out', description: 'Sell 25% incrementally', percentage: 25 },
];

export default function ManageWalletsPage() {
  const { addToast } = useUIStore();
  const [selectedWallets, setSelectedWallets] = useState<Set<string>>(new Set());
  const [sellPercentage, setSellPercentage] = useState(50);
  const [sortBy, setSortBy] = useState<'value' | 'balance'>('value');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showStrategyHelper, setShowStrategyHelper] = useState(false);

  const toggleWalletSelection = (walletId: string) => {
    const newSelection = new Set(selectedWallets);
    if (newSelection.has(walletId)) {
      newSelection.delete(walletId);
    } else {
      newSelection.add(walletId);
    }
    setSelectedWallets(newSelection);
  };

  const selectAllWallets = () => {
    const allIds = displayWallets.map(w => w.id);
    setSelectedWallets(new Set(allIds));
  };

  const deselectAllWallets = () => {
    setSelectedWallets(new Set());
  };

  const selectHalfWallets = () => {
    const half = Math.ceil(displayWallets.length / 2);
    const halfWalletIds = displayWallets.slice(0, half).map(w => w.id);
    setSelectedWallets(new Set(halfWalletIds));
  };

  const handleSell = () => {
    if (selectedWallets.size === 0) {
      addToast({
        type: 'error',
        title: 'No Wallets Selected',
        description: 'Please select at least one wallet to sell from',
      });
      return;
    }

    addToast({
      type: 'success',
      title: 'Sell Orders Placed',
      description: `Selling ${sellPercentage}% from ${selectedWallets.size} wallet(s)`,
    });
  };

  const copyAllAddresses = () => {
    const addresses = Array.from(selectedWallets)
      .map(id => mockWallets.find(w => w.id === id)?.address)
      .filter(Boolean)
      .join('\n');
    
    navigator.clipboard.writeText(addresses);
    addToast({
      type: 'success',
      title: 'Addresses Copied',
      description: `Copied ${selectedWallets.size} wallet addresses`,
    });
  };

  const totalValue = mockWallets.reduce((sum, wallet) => sum + wallet.totalValue, 0);
  const selectedValue = Array.from(selectedWallets).reduce((sum, id) => {
    const wallet = mockWallets.find(w => w.id === id);
    return sum + (wallet?.totalValue || 0);
  }, 0);

  // Sort wallets
  let displayWallets = [...mockWallets];
  
  displayWallets.sort((a, b) => {
    let compareValue = 0;
    switch (sortBy) {
      case 'value':
        compareValue = a.totalValue - b.totalValue;
        break;
      case 'balance':
        compareValue = parseFloat(a.tokenBalance) - parseFloat(b.tokenBalance);
        break;
    }
    return sortOrder === 'asc' ? compareValue : -compareValue;
  });

  const estimatedProceeds = selectedValue * (sellPercentage / 100);

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Compact Header */}
        <motion.div {...fadeInUp} className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Wallet className="w-8 h-8 text-primary-500" />
            <h1 className="text-2xl font-bold">Manage Your Launch Wallets</h1>
          </div>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Control your token distribution across all wallets. Select wallets and choose your selling strategy.
          </p>
        </motion.div>

        {/* Compact Launch Summary */}
        <motion.div {...fadeInUp} transition={{ delay: 0.05 }} className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-primary-600 to-secondary-500 p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10">
              {/* Top section with token info */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                    <Rocket className="w-6 h-6 text-white drop-shadow-lg" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white drop-shadow">BOOST Token Launch</h3>
                    <p className="text-xs text-white/90 drop-shadow">Launched 5 minutes ago • Pool: BOOST/SOL</p>
                  </div>
                </div>
              </div>
              
              {/* Bottom section with stats */}
              <div className="grid grid-cols-3 gap-4 text-white">
                <div className="text-center">
                  <p className="text-xl font-bold drop-shadow">24</p>
                  <p className="text-xs text-white/90 drop-shadow">Wallets</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold drop-shadow">10 SOL</p>
                  <p className="text-xs text-white/90 drop-shadow">Initial Liquidity</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold drop-shadow">{formatCurrency(totalValue)}</p>
                  <p className="text-xs text-white/90 drop-shadow">Total Value</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Compact Quick Stats */}
        <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="bg-boost-subtle p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Selected Wallets</p>
                <p className="text-lg font-bold">{selectedWallets.size} / {displayWallets.length}</p>
                <div className="w-full bg-boost-subtle h-1 rounded-full mt-1">
                  <div 
                    className="bg-primary-500 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${(selectedWallets.size / displayWallets.length) * 100}%` }}
                  />
                </div>
              </div>
              <Wallet className="w-6 h-6 text-primary-500 opacity-50" />
            </div>
          </Card>
          
          <Card className="bg-boost-subtle p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Selected Value</p>
                <p className="text-lg font-bold">{formatCurrency(selectedValue)}</p>
              </div>
              <DollarSign className="w-6 h-6 text-secondary-400 opacity-50" />
            </div>
          </Card>
          
          <Card className="bg-boost-subtle p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Est. Proceeds</p>
                <p className="text-lg font-bold">{formatCurrency(estimatedProceeds)}</p>
              </div>
              <TrendingUp className="w-6 h-6 text-green-500 opacity-50" />
            </div>
          </Card>
          
          <Card className="bg-boost-subtle p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Sell Amount</p>
                <p className="text-lg font-bold">{sellPercentage}%</p>
              </div>
              <BarChart3 className="w-6 h-6 text-primary-500 opacity-50" />
            </div>
          </Card>
        </motion.div>

        {/* Selling Strategy Section */}
        <motion.div {...fadeInUp} transition={{ delay: 0.15 }}>
          <Card className="boost-border-gradient">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Zap className="w-5 h-5 text-secondary-400" />
                Quick Sell Strategy
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowStrategyHelper(!showStrategyHelper)}
              >
                Strategy Guide
                <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${
                  showStrategyHelper ? 'rotate-180' : ''
                }`} />
              </Button>
            </div>

            {showStrategyHelper && (
              <div className="mb-4 p-4 bg-boost-subtle rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-primary-500" />
                  Selling Strategy Tips
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <strong>Take Profits (50%):</strong> Secure initial investment while keeping upside</li>
                  <li>• <strong>Partial Exit (75%):</strong> Lock in most gains, keep small moon bag</li>
                  <li>• <strong>DCA Out (25%):</strong> Gradual exit to avoid price impact</li>
                  <li>• <strong>Full Exit (100%):</strong> Complete position closure</li>
                </ul>
              </div>
            )}

            <div className="space-y-4">
              {/* Strategy Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {sellingStrategies.map((strategy) => (
                  <Button
                    key={strategy.name}
                    variant={sellPercentage === strategy.percentage ? 'primary' : 'outline'}
                    onClick={() => setSellPercentage(strategy.percentage)}
                    className="flex flex-col items-center p-4 h-auto"
                  >
                    <span className="font-semibold">{strategy.name}</span>
                    <span className="text-xs opacity-80 mt-1">{strategy.description}</span>
                  </Button>
                ))}
              </div>

              {/* Custom Percentage Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Custom Sell Amount</label>
                  <span className="text-sm text-muted-foreground">{sellPercentage}%</span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={sellPercentage}
                    onChange={(e) => setSellPercentage(parseInt(e.target.value))}
                    className="w-full h-2 bg-boost-subtle rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #843dff 0%, #843dff ${sellPercentage}%, #1e0033 ${sellPercentage}%, #1e0033 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>1%</span>
                    <span>25%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Table Controls */}
        <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
          <Card className="p-4 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={selectAllWallets}
                  disabled={selectedWallets.size === displayWallets.length}
                >
                  <Check className="w-4 h-4 mr-1" />
                  All ({displayWallets.length})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={selectHalfWallets}
                >
                  Half ({Math.ceil(displayWallets.length / 2)})
                </Button>
                <div className="h-6 w-px bg-border mx-2" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={deselectAllWallets}
                  disabled={selectedWallets.size === 0}
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
                {selectedWallets.size > 0 && (
                  <>
                    <div className="h-6 w-px bg-border mx-2" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyAllAddresses}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy ({selectedWallets.size})
                    </Button>
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-background border border-border rounded-lg px-3 py-1 text-sm"
                >
                  <option value="value">Total Value</option>
                  <option value="balance">Token Balance</option>
                </select>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  <ArrowUpDown className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Wallets Table */}
        <motion.div {...fadeInUp} transition={{ delay: 0.25 }}>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-boost-subtle border-b border-border">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={selectedWallets.size === displayWallets.length && displayWallets.length > 0}
                        onChange={() => {
                          if (selectedWallets.size === displayWallets.length) {
                            deselectAllWallets();
                          } else {
                            selectAllWallets();
                          }
                        }}
                        className="rounded border-muted-foreground"
                      />
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Wallet</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Token Balance</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">SOL Balance</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Total Value</th>
                    <th className="text-center p-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayWallets.map((wallet, index) => (
                    <tr
                      key={wallet.id}
                      className={`border-b border-border hover:bg-muted/50 transition-colors ${
                        selectedWallets.has(wallet.id) ? 'bg-primary-500/10' : ''
                      }`}
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedWallets.has(wallet.id)}
                          onChange={() => toggleWalletSelection(wallet.id)}
                          className="rounded border-muted-foreground"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </div>
                          <span className="font-mono text-sm">{shortenAddress(wallet.address)}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right font-medium">
                        {formatTokenAmount(wallet.tokenBalance)} {wallet.tokenSymbol}
                      </td>
                      <td className="p-4 text-right">
                        {wallet.solBalance} SOL
                      </td>
                      <td className="p-4 text-right font-medium">
                        {formatCurrency(wallet.totalValue)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center">
                          <Tooltip content="View on Explorer">
                            <button 
                              className="text-muted-foreground hover:text-foreground p-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`https://solscan.io/account/${wallet.address}`, '_blank');
                              }}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {/* Execute Sell Section - Always Visible */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky bottom-4"
        >
          <Card className="relative bg-boost-dark/95 backdrop-blur p-4 overflow-hidden">
            {/* Animated gradient border */}
            <div className="absolute inset-0 rounded-lg p-[2px] bg-gradient-to-r from-primary-500 via-secondary-400 to-primary-500 animate-gradient">
              <div className="bg-boost-dark/95 rounded-lg h-full w-full" />
            </div>
            
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-primary-500 to-transparent opacity-60 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-secondary-400 to-transparent opacity-60 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-primary-500 to-transparent opacity-60 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-secondary-400 to-transparent opacity-60 rounded-br-lg" />
            
            {/* Glow effect - only when wallets selected */}
            {selectedWallets.size > 0 && (
              <div className="absolute inset-0 rounded-lg bg-primary-500/20 blur-xl animate-pulse" />
            )}
            
            <div className="relative z-10 flex items-center justify-between flex-wrap gap-3">
              <div className="relative">
                {selectedWallets.size > 0 && (
                  <div className="absolute -left-2 -top-1 w-1 h-8 bg-gradient-to-b from-primary-500 to-secondary-400 rounded-full animate-pulse" />
                )}
                <h3 className="text-base font-semibold">Ready to Execute</h3>
                <p className="text-xs text-muted-foreground">
                  {selectedWallets.size > 0 
                    ? `Selling ${sellPercentage}% from ${selectedWallets.size} of ${displayWallets.length} wallets`
                    : 'Select wallets to start selling'
                  }
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right relative">
                  {selectedWallets.size > 0 && (
                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-8 h-1 bg-gradient-to-r from-primary-500 to-secondary-400 rounded-full animate-pulse" />
                  )}
                  <p className="text-xs text-muted-foreground">Estimated Proceeds</p>
                  <p className={`text-lg font-bold ${selectedWallets.size > 0 ? 'text-secondary-400' : ''}`}>
                    {formatCurrency(estimatedProceeds)}
                  </p>
                </div>
                
                <Button 
                  size="md" 
                  onClick={handleSell}
                  disabled={selectedWallets.size === 0}
                  className={`min-w-[130px] ${selectedWallets.size > 0 ? 'boost-glow' : ''}`}
                >
                  <Package className="w-4 h-4 mr-2" />
                  Execute Sell
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: #843dff;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(132, 61, 255, 0.5);
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #843dff;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(132, 61, 255, 0.5);
          border: none;
        }
      `}</style>
    </DashboardLayout>
  );
} 