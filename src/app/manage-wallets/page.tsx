'use client';

import React, { useState, useEffect } from 'react';
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
  ArrowRight,
  PieChart,
  BarChart3,
  Eye,
  EyeOff,
  ExternalLink,
  Plus,
  Minus,
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
  tokenValue?: number;
}

interface OrderHistory {
  id: string;
  date: string;
  txType: string;
  totalUsd: number;
  tokenAmount: number;
  solAmount: number;
  price: number;
  maker: string;
}

export default function ManageWalletsPage() {
  const { addToast } = useUIStore();
  
  // States
  const [subWallets, setSubWallets] = useState<SubWallet[]>([]);
  const [selectedWallets, setSelectedWallets] = useState<Set<string>>(new Set());
  const [orderHistory, setOrderHistory] = useState<OrderHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showChart, setShowChart] = useState(true);
  const [hideBalances, setHideBalances] = useState(false);
  
  // Trade states
  const [buyAmount, setBuyAmount] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  
  // Token info
  const [tokenInfo, setTokenInfo] = useState({
    name: 'MEME',
    symbol: 'MEME', 
    price: 157.18,
    priceChange24h: 2.52,
    totalBalance: 0,
    totalValue: 0,
    marketCap: 157182,
    volume24h: 59000,
    solBalance: 0,
    tokenBalance: 0,
  });

  // Active wallet
  const [activeWallet, setActiveWallet] = useState({
    address: '83t9xPzz...4jcxkV78',
    solBalance: 0.06,
    tokenBalance: 0,
  });

  // Load wallet data
  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      setIsLoading(true);
      // Simulated data - replace with actual API call
      const mockWallets: SubWallet[] = [
        { id: '1', address: '83t9...kV78', solBalance: 0.0, tokenBalance: 0.0002, isSelected: false, tokenValue: 0.03 },
        { id: '2', address: 'tGfz...kv8e', solBalance: 0.0, tokenBalance: 0.0001, isSelected: false, tokenValue: 0.02 },
        { id: '3', address: 'Afu6...StMy', solBalance: 0.0, tokenBalance: 0.0008, isSelected: false, tokenValue: 0.13 },
        { id: '4', address: '6RWb...Dv2x', solBalance: 0.0, tokenBalance: 0.0001, isSelected: false, tokenValue: 0.02 },
        { id: '5', address: '3BMC...sMJh', solBalance: 0.0, tokenBalance: 0.0001, isSelected: false, tokenValue: 0.02 },
        { id: '6', address: '8o5z...AwAE', solBalance: 0.0599, tokenBalance: 0, isSelected: false, tokenValue: 0 },
        { id: '7', address: 'FaRV...WTc', solBalance: 0.0616, tokenBalance: 0, isSelected: false, tokenValue: 0 },
        { id: '8', address: 'F8Hc...v4D6', solBalance: 0.0595, tokenBalance: 0, isSelected: false, tokenValue: 0 },
      ];
      
      setSubWallets(mockWallets);
      
      // Calculate totals
      const totalTokens = mockWallets.reduce((sum, w) => sum + w.tokenBalance, 0);
      const totalSol = mockWallets.reduce((sum, w) => sum + w.solBalance, 0);
      setTokenInfo(prev => ({
        ...prev,
        totalBalance: totalTokens,
        totalValue: totalTokens * prev.price,
        solBalance: totalSol,
        tokenBalance: totalTokens,
      }));
      
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load wallet data:', error);
      setIsLoading(false);
    }
  };

  const handleSelectWallet = (walletId: string) => {
    const newSelected = new Set(selectedWallets);
    if (newSelected.has(walletId)) {
      newSelected.delete(walletId);
    } else {
      newSelected.add(walletId);
    }
    setSelectedWallets(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedWallets.size === subWallets.length) {
      setSelectedWallets(new Set());
    } else {
      setSelectedWallets(new Set(subWallets.map(w => w.id)));
    }
  };

  const handleBuy = async () => {
    if (!buyAmount || selectedWallets.size === 0) {
      addToast({
        type: 'error',
        title: 'Invalid Input',
        description: 'Please enter amount and select wallets',
      });
      return;
    }

    addToast({
      type: 'success',
      title: 'Buy Order Placed',
      description: `Buying with ${selectedWallets.size} wallets`,
    });
  };

  const handleSell = async () => {
    if (!sellAmount || selectedWallets.size === 0) {
      addToast({
        type: 'error',
        title: 'Invalid Input',
        description: 'Please enter amount and select wallets',
      });
      return;
    }

    addToast({
      type: 'success',
      title: 'Sell Order Placed',
      description: `Selling with ${selectedWallets.size} wallets`,
    });
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
      <div className="bg-background min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Bundle Manager</h1>
            <div className="px-3 py-1 bg-muted rounded-lg">
              <span className="text-sm font-medium">{tokenInfo.symbol}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setHideBalances(!hideBalances)}
            >
              {hideBalances ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span className="ml-2">{hideBalances ? 'Show' : 'Hide'} Balances</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowChart(!showChart)}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="ml-2">{showChart ? 'Hide' : 'Show'} Chart</span>
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={loadWalletData}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-lg">
              <span className="text-sm">Price: ${tokenInfo.price.toFixed(2)}</span>
              <span className={`text-sm ${tokenInfo.priceChange24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {tokenInfo.priceChange24h > 0 ? '+' : ''}{tokenInfo.priceChange24h}%
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)]">
          {/* Left Panel */}
          <div className="w-full lg:w-96 border-r border-border p-4 space-y-4 overflow-y-auto">
            {/* Active Wallet */}
            <Card className="bg-muted/50">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Active Wallet</span>
                  <Tooltip content="Copy address">
                    <Copy className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" 
                      onClick={() => copyAddress(activeWallet.address)} />
                  </Tooltip>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm">{activeWallet.address}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">SOL Balance</span>
                      <p className="font-medium">{hideBalances ? '••••' : activeWallet.solBalance}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">USD Value</span>
                      <p className="font-medium">{hideBalances ? '••••' : '$0.00'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Improved Trade Box */}
            <Card className="bg-muted/30 border-muted">
              <div className="space-y-3">
                {/* Swap Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Quick Trade</h3>
                    <div className="text-xs text-muted-foreground">
                      Slippage: <span className="text-foreground">1%</span>
                    </div>
                  </div>
                  
                  {/* From/To Display - More Compact */}
                  <div className="space-y-1">
                    <div className="bg-background/50 rounded-lg p-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>From</span>
                        <span>Balance: {hideBalances ? '••••' : '0.06'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <Input 
                          type="number"
                          placeholder="0.0"
                          className="bg-transparent border-0 text-base font-medium p-0 h-auto focus:ring-0 w-24"
                          value={buyAmount}
                          onChange={(e) => setBuyAmount(e.target.value)}
                        />
                        <span className="text-sm font-medium">SOL</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-center py-1">
                      <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                        <ArrowDownRight className="w-3 h-3" />
                      </div>
                    </div>
                    
                    <div className="bg-background/50 rounded-lg p-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>To (Estimated)</span>
                        <span>Balance: {hideBalances ? '••••' : tokenInfo.tokenBalance.toFixed(4)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-base font-medium text-muted-foreground">
                          {buyAmount ? (parseFloat(buyAmount) * tokenInfo.price * 1000).toFixed(2) : '0.0'}
                        </span>
                        <span className="text-sm font-medium">{tokenInfo.symbol}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Swap Button */}
                  <Button 
                    size="sm" 
                    className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-medium h-8"
                  >
                    Swap
                  </Button>
                </div>
                
                {/* Quick Buy/Sell */}
                <div className="border-t border-border pt-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      size="sm" 
                      className="bg-green-600/20 hover:bg-green-600/30 text-green-600 border border-green-600/50 h-8 text-xs"
                      onClick={handleBuy}
                    >
                      Buy
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-red-600/20 hover:bg-red-600/30 text-red-600 border border-red-600/50 h-8 text-xs"
                      onClick={handleSell}
                    >
                      Sell
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Bundler Wallet Management - Increased Height */}
            <Card className="flex-1 flex flex-col min-h-0">
              <div className="flex flex-col h-full space-y-3">
                <div className="flex items-center justify-between flex-shrink-0">
                  <div>
                    <h3 className="font-semibold">Sub-Wallet Manager</h3>
                    <p className="text-xs text-muted-foreground">Control your bundle distribution</p>
                  </div>
                  <Tooltip content="Refresh wallet data">
                    <RefreshCw className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" 
                      onClick={loadWalletData} />
                  </Tooltip>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-2 text-sm flex-shrink-0">
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground">Total Token Balance:</span>
                    <span className="font-medium">{hideBalances ? '••••' : tokenInfo.tokenBalance.toFixed(4)} {tokenInfo.symbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total SOL Balance:</span>
                    <span className="font-medium">{hideBalances ? '••••' : tokenInfo.solBalance.toFixed(4)} SOL</span>
                  </div>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <Tooltip content="Add new sub-wallet">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Plus className="w-3 h-3 mr-1" />
                      Add
                    </Button>
                  </Tooltip>
                  <Tooltip content="Set amount for selected wallets">
                    <Button size="sm" variant="outline" className="flex-1">
                      Set Amount
                    </Button>
                  </Tooltip>
                  <Tooltip content="Execute action on selected wallets">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                      disabled={selectedWallets.size === 0}
                    >
                      Execute
                    </Button>
                  </Tooltip>
                </div>

                <div className="flex-1 overflow-y-auto border rounded-lg min-h-0">
                  <div className="sticky top-0 z-10">
                    <div className="flex items-center justify-between py-2 px-3 text-xs text-muted-foreground border-b border-border bg-muted/30">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedWallets.size === subWallets.length}
                          onChange={handleSelectAll}
                          className="rounded"
                        />
                        <span>#</span>
                        <span>Address</span>
                      </div>
                      <div className="flex gap-4">
                        <span className="w-16 text-right">Tokens</span>
                        <span className="w-16 text-right">Value</span>
                        <span className="w-16 text-right">SOL</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-border">
                    {subWallets.map((wallet, index) => (
                      <div
                        key={wallet.id}
                        className={`flex items-center justify-between py-2 px-3 text-sm cursor-pointer hover:bg-muted/50 transition-colors ${
                          selectedWallets.has(wallet.id) ? 'bg-primary/10' : ''
                        }`}
                        onClick={() => handleSelectWallet(wallet.id)}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedWallets.has(wallet.id)}
                            onChange={() => {}}
                            className="rounded"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <span className="text-muted-foreground w-4">{index + 1}</span>
                          <span className="font-mono text-xs">{wallet.address}</span>
                          <Tooltip content="Copy address">
                            <Copy className="w-3 h-3 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity" 
                              onClick={(e) => {
                                e.stopPropagation();
                                copyAddress(wallet.address);
                              }} />
                          </Tooltip>
                        </div>
                        <div className="flex gap-4 items-center">
                          <span className="text-orange-500 w-16 text-right">{hideBalances ? '••' : wallet.tokenBalance.toFixed(4)}</span>
                          <span className="text-orange-500 w-16 text-right">
                            ${hideBalances ? '••' : (wallet.tokenValue || 0).toFixed(2)}
                          </span>
                          <span className="w-16 text-right">{hideBalances ? '••' : wallet.solBalance.toFixed(4)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {selectedWallets.size > 0 && (
                  <div className="text-xs text-muted-foreground text-center flex-shrink-0">
                    {selectedWallets.size} wallet{selectedWallets.size > 1 ? 's' : ''} selected
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right Panel */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {/* Chart Area - Reduced Height */}
            {showChart && (
              <Card className="h-64 bg-muted/30">
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-base font-medium">TradingView Chart</p>
                    <p className="text-xs">Chart integration coming soon</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Wallet Overview Cards */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">External Wallets</h3>
                  <p className="text-xs text-muted-foreground">Track additional addresses holding your token</p>
                </div>
                <Tooltip content="Add wallet to track">
                  <Button variant="ghost" size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Address
                  </Button>
                </Tooltip>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {[
                  { name: 'tdfY_lM0n', tokens: 234.5, change: '+12%', isPositive: true },
                  { name: 'Aruft_StMy', tokens: 189.2, change: '-5%', isPositive: false },
                  { name: '8vRB...PKjQ', tokens: 456.7, change: '+8%', isPositive: true },
                  { name: '6o5o...kvwE', tokens: 123.4, change: '0%', isPositive: null },
                  { name: 'FuRV...WTc', tokens: 345.6, change: '+15%', isPositive: true },
                  { name: 'F8Hc...v4D6', tokens: 234.5, change: '-3%', isPositive: false },
                  { name: '73Es...DTuA', tokens: 567.8, change: '+22%', isPositive: true },
                  { name: '57ro...qnP', tokens: 89.1, change: '-8%', isPositive: false },
                ].map((wallet, index) => (
                  <Card key={index} className="p-3 hover:border-primary/50 transition-all cursor-pointer group">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-mono">{wallet.name}</span>
                        <Tooltip content="View on explorer">
                          <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Tooltip>
                      </div>
                      <div>
                        <p className="text-lg font-semibold">{hideBalances ? '•••' : wallet.tokens.toFixed(1)}</p>
                        <p className="text-xs text-muted-foreground">{tokenInfo.symbol}</p>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">24h Change</span>
                        <span className={
                          wallet.isPositive === true ? 'text-green-500' : 
                          wallet.isPositive === false ? 'text-red-500' : 
                          'text-muted-foreground'
                        }>
                          {wallet.change}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <Button variant="ghost" size="sm">
                  View All External Wallets
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>

            {/* Recent Activity */}
            <Card>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Recent Activity</h3>
                    <p className="text-xs text-muted-foreground">Latest transactions across all wallets</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {/* Empty state */}
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                      <Activity className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <h4 className="font-medium mb-1">No Recent Activity</h4>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                      Your transaction history will appear here once you start trading
                    </p>
                    <Button variant="outline" size="sm" className="mt-4">
                      Make Your First Trade
                    </Button>
                  </div>
                  
                  {/* Sample transaction items (uncomment when there's data)
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                          <ArrowUpRight className="w-4 h-4 text-green-500" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Buy Order</p>
                          <p className="text-xs text-muted-foreground">2 minutes ago</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">+1,234.5 MEME</p>
                        <p className="text-xs text-muted-foreground">0.5 SOL</p>
                      </div>
                    </div>
                  </div>
                  */}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 