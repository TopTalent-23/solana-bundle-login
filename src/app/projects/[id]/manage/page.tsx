'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Download,
  Upload,
  RefreshCw,
  Copy,
  Check,
  Info,
  Settings,
  ChevronDown,
  ChevronUp,
  Activity,
  DollarSign,
  Users,
  AlertCircle,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  BarChart3,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Tooltip } from '@/components/ui/Tooltip';
import { useUIStore } from '@/store';
import { formatCurrency, formatTokenAmount } from '@/utils/format';

interface SubWallet {
  id: string;
  address: string;
  solBalance: number;
  tokenBalance: number;
  isSelected: boolean;
  lastActivity?: string;
}

interface OrderHistory {
  id: string;
  date: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  wallet: string;
  status: 'completed' | 'pending' | 'failed';
}

export default function BundlerManagePage() {
  const params = useParams();
  const { addToast } = useUIStore();
  
  // States
  const [subWallets, setSubWallets] = useState<SubWallet[]>([]);
  const [selectedWallets, setSelectedWallets] = useState<string[]>([]);
  const [orderHistory, setOrderHistory] = useState<OrderHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'manage' | 'trade' | 'history'>('manage');
  
  // Trade states
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [tradeAmount, setTradeAmount] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  
  // Distribution states
  const [distributionAmount, setDistributionAmount] = useState('');
  const [distributionMode, setDistributionMode] = useState<'equal' | 'proportional'>('equal');
  
  // Token info
  const [tokenInfo, setTokenInfo] = useState({
    name: 'MEME Token',
    symbol: 'MEME',
    price: 157.18,
    priceChange24h: 2.52,
    totalBalance: 0,
    totalValue: 0,
    marketCap: 157182,
    volume24h: 59000,
  });

  // Load wallet data
  useEffect(() => {
    loadWalletData();
  }, [params.id]);

  const loadWalletData = async () => {
    try {
      setIsLoading(true);
      // Simulated data - replace with actual API call
      const mockWallets: SubWallet[] = Array.from({ length: 10 }, (_, i) => ({
        id: `wallet-${i}`,
        address: `${Math.random().toString(36).substring(2, 6)}...${Math.random().toString(36).substring(2, 6)}`,
        solBalance: Math.random() * 2,
        tokenBalance: Math.random() * 1000,
        isSelected: false,
        lastActivity: '2 mins ago',
      }));
      
      setSubWallets(mockWallets);
      
      // Calculate totals
      const totalTokens = mockWallets.reduce((sum, w) => sum + w.tokenBalance, 0);
      setTokenInfo(prev => ({
        ...prev,
        totalBalance: totalTokens,
        totalValue: totalTokens * prev.price,
      }));
      
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load wallet data:', error);
      setIsLoading(false);
    }
  };

  const handleSelectWallet = (walletId: string) => {
    setSelectedWallets(prev => 
      prev.includes(walletId) 
        ? prev.filter(id => id !== walletId)
        : [...prev, walletId]
    );
  };

  const handleSelectAll = () => {
    if (selectedWallets.length === subWallets.length) {
      setSelectedWallets([]);
    } else {
      setSelectedWallets(subWallets.map(w => w.id));
    }
  };

  const handleDistribute = async () => {
    if (!distributionAmount || selectedWallets.length === 0) {
      addToast({
        type: 'error',
        title: 'Invalid Input',
        description: 'Please enter amount and select wallets',
      });
      return;
    }

    try {
      // API call to distribute funds
      addToast({
        type: 'success',
        title: 'Distribution Started',
        description: `Distributing ${distributionAmount} SOL to ${selectedWallets.length} wallets`,
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Distribution Failed',
        description: 'Failed to distribute funds',
      });
    }
  };

  const handleTrade = async () => {
    if (!tradeAmount || selectedWallets.length === 0) {
      addToast({
        type: 'error',
        title: 'Invalid Input',
        description: 'Please enter amount and select wallets',
      });
      return;
    }

    try {
      // API call to execute trade
      addToast({
        type: 'success',
        title: `${tradeType === 'buy' ? 'Buy' : 'Sell'} Order Placed`,
        description: `${tradeType === 'buy' ? 'Buying' : 'Selling'} ${tradeAmount} tokens across ${selectedWallets.length} wallets`,
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Trade Failed',
        description: 'Failed to execute trade',
      });
    }
  };

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    addToast({
      type: 'success',
      title: 'Copied',
      description: 'Address copied to clipboard',
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{tokenInfo.name} Bundle Manager</h1>
            <p className="text-muted-foreground mt-1">
              Manage your token distribution across {subWallets.length} wallets
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              icon={<RefreshCw className="w-4 h-4" />}
              onClick={loadWalletData}
            >
              Refresh
            </Button>
            <Button
              variant="outline"
              icon={<Settings className="w-4 h-4" />}
            >
              Settings
            </Button>
          </div>
        </div>

        {/* Token Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Token Price</p>
                <p className="text-2xl font-bold">${tokenInfo.price.toFixed(2)}</p>
                <div className={`flex items-center gap-1 text-sm ${tokenInfo.priceChange24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {tokenInfo.priceChange24h > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {Math.abs(tokenInfo.priceChange24h)}%
                </div>
              </div>
              <Activity className="w-8 h-8 text-primary opacity-20" />
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Balance</p>
                <p className="text-2xl font-bold">{formatTokenAmount(tokenInfo.totalBalance)}</p>
                <p className="text-sm text-muted-foreground">${formatCurrency(tokenInfo.totalValue)}</p>
              </div>
              <Wallet className="w-8 h-8 text-primary opacity-20" />
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Market Cap</p>
                <p className="text-2xl font-bold">${formatCurrency(tokenInfo.marketCap)}</p>
                <p className="text-sm text-muted-foreground">Rank #182</p>
              </div>
              <BarChart3 className="w-8 h-8 text-primary opacity-20" />
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">24h Volume</p>
                <p className="text-2xl font-bold">${formatCurrency(tokenInfo.volume24h)}</p>
                <p className="text-sm text-muted-foreground">243 trades</p>
              </div>
              <PieChart className="w-8 h-8 text-primary opacity-20" />
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Wallet List */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Sub Wallets</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAll}
                >
                  {selectedWallets.length === subWallets.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : (
                  subWallets.map((wallet) => (
                    <motion.div
                      key={wallet.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedWallets.includes(wallet.id)
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleSelectWallet(wallet.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedWallets.includes(wallet.id)}
                            onChange={() => {}}
                            className="rounded border-border"
                          />
                          <span className="font-mono text-sm">{wallet.address}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyAddress(wallet.address);
                            }}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">SOL</p>
                          <p className="font-medium">{wallet.solBalance.toFixed(4)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Tokens</p>
                          <p className="font-medium">{wallet.tokenBalance.toFixed(2)}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Selected</span>
                  <span className="font-medium">{selectedWallets.length} wallets</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Actions & Chart */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chart Placeholder */}
            <Card>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Chart integration coming soon</p>
                </div>
              </div>
            </Card>

            {/* Action Tabs */}
            <Card>
              <div className="flex border-b border-border mb-6">
                <button
                  className={`px-4 py-2 font-medium transition-colors ${
                    activeTab === 'manage'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setActiveTab('manage')}
                >
                  Manage Funds
                </button>
                <button
                  className={`px-4 py-2 font-medium transition-colors ${
                    activeTab === 'trade'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setActiveTab('trade')}
                >
                  Buy / Sell
                </button>
                <button
                  className={`px-4 py-2 font-medium transition-colors ${
                    activeTab === 'history'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setActiveTab('history')}
                >
                  Order History
                </button>
              </div>

              {/* Manage Funds Tab */}
              {activeTab === 'manage' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-4">Distribute SOL to Wallets</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Amount per Wallet (SOL)
                        </label>
                        <Input
                          type="number"
                          value={distributionAmount}
                          onChange={(e) => setDistributionAmount(e.target.value)}
                          placeholder="0.1"
                          step="0.01"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Distribution Mode
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <Button
                            variant={distributionMode === 'equal' ? 'primary' : 'outline'}
                            onClick={() => setDistributionMode('equal')}
                          >
                            Equal Amount
                          </Button>
                          <Button
                            variant={distributionMode === 'proportional' ? 'primary' : 'outline'}
                            onClick={() => setDistributionMode('proportional')}
                          >
                            Proportional
                          </Button>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          className="flex-1"
                          onClick={handleDistribute}
                          disabled={selectedWallets.length === 0}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Distribute to {selectedWallets.length} Wallets
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1"
                          disabled={selectedWallets.length === 0}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Withdraw All
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-primary/10 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium mb-1">Distribution Tips</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Equal distribution helps maintain consistent buying power</li>
                          <li>• Proportional distribution based on current token holdings</li>
                          <li>• Keep some SOL for gas fees in each wallet</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Trade Tab */}
              {activeTab === 'trade' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant={tradeType === 'buy' ? 'primary' : 'outline'}
                      onClick={() => setTradeType('buy')}
                      className="justify-center"
                    >
                      Buy
                    </Button>
                    <Button
                      variant={tradeType === 'sell' ? 'primary' : 'outline'}
                      onClick={() => setTradeType('sell')}
                      className="justify-center"
                    >
                      Sell
                    </Button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Amount per Wallet ({tradeType === 'buy' ? 'SOL' : 'Tokens'})
                    </label>
                    <Input
                      type="number"
                      value={tradeAmount}
                      onChange={(e) => setTradeAmount(e.target.value)}
                      placeholder={tradeType === 'buy' ? '0.1' : '100'}
                      step={tradeType === 'buy' ? '0.01' : '1'}
                    />
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Selected Wallets</span>
                      <span>{selectedWallets.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total {tradeType === 'buy' ? 'SOL' : 'Tokens'}</span>
                      <span>{(parseFloat(tradeAmount || '0') * selectedWallets.length).toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Est. Price Impact</span>
                      <span className="text-yellow-500">~0.5%</span>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className={`w-full ${tradeType === 'buy' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                    onClick={handleTrade}
                    disabled={selectedWallets.length === 0 || !tradeAmount}
                  >
                    {tradeType === 'buy' ? <ArrowUpRight className="w-5 h-5 mr-2" /> : <ArrowDownRight className="w-5 h-5 mr-2" />}
                    {tradeType === 'buy' ? 'Buy' : 'Sell'} with {selectedWallets.length} Wallets
                  </Button>

                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-yellow-500 mb-1">Trading Notice</p>
                        <p className="text-muted-foreground">
                          Trades will be executed with slight delays between wallets to avoid detection. 
                          Each wallet will trade the specified amount independently.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Order History Tab */}
              {activeTab === 'history' && (
                <div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 px-3">Date</th>
                          <th className="text-left py-2 px-3">Type</th>
                          <th className="text-left py-2 px-3">Amount</th>
                          <th className="text-left py-2 px-3">Price</th>
                          <th className="text-left py-2 px-3">Wallet</th>
                          <th className="text-left py-2 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border">
                          <td className="py-3 px-3 text-muted-foreground" colSpan={6}>
                            <div className="text-center">
                              <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                              <p>No order history yet</p>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 