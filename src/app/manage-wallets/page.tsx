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
            <h1 className="text-2xl font-bold">{tokenInfo.symbol}</h1>
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
              <span className="text-sm">SOL: ${tokenInfo.price.toFixed(2)}</span>
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
                  <Copy className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground" 
                    onClick={() => copyAddress(activeWallet.address)} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm">{activeWallet.address}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">SOL</span>
                      <p className="font-medium">{hideBalances ? '••••' : activeWallet.solBalance}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Value</span>
                      <p className="font-medium">{hideBalances ? '••••' : '0'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Balances */}
            <div className="grid grid-cols-2 gap-2">
              <Card className="bg-muted/50">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Balance</p>
                  <p className="font-medium">{hideBalances ? '••••' : tokenInfo.tokenBalance.toFixed(4)}</p>
                </div>
              </Card>
              <Card className="bg-muted/50">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">To</p>
                  <p className="font-medium">{hideBalances ? '••••' : tokenInfo.tokenBalance.toFixed(4)}</p>
                </div>
              </Card>
            </div>

            {/* Trade Controls */}
            <Card>
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  Price <span className="text-foreground">{hideBalances ? '••••' : `$${tokenInfo.price.toFixed(2)}`}</span> per 
                  <br />Slippage Tolerance <span className="text-foreground">1%</span>
                </div>
                
                <div className="space-y-2">
                  <Button size="sm" className="w-full bg-yellow-600 hover:bg-yellow-700 text-white">
                    SWAP
                  </Button>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={handleBuy}
                    >
                      BUY
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={handleSell}
                    >
                      SELL
                    </Button>
                    <div className="relative">
                      <Input 
                        type="number"
                        placeholder="Amount"
                        className="h-8 pr-12 text-sm"
                        value={buyAmount}
                        onChange={(e) => setBuyAmount(e.target.value)}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                        SOL
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    size="sm" 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={selectedWallets.size === 0}
                  >
                    Execute
                  </Button>
                </div>
              </div>
            </Card>

            {/* Bundler Wallet Management */}
            <Card>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Bundler Wallet Management</h3>
                  <RefreshCw className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground" 
                    onClick={loadWalletData} />
                </div>
                
                <div className="text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground">Token Total Balance:</span>
                    <span>{hideBalances ? '••••' : tokenInfo.tokenBalance.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Amount:</span>
                    <span>{hideBalances ? '••••' : tokenInfo.solBalance.toFixed(4)} SOL</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Plus className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Set & Amount
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Execute
                  </Button>
                </div>

                <div className="space-y-1 max-h-64 overflow-y-auto">
                  <div className="flex items-center justify-between py-1 text-xs text-muted-foreground border-b border-border">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedWallets.size === subWallets.length}
                        onChange={handleSelectAll}
                        className="rounded"
                      />
                      <span>No</span>
                      <span>Wallet</span>
                    </div>
                    <div className="flex gap-4">
                      <span>Token</span>
                      <span>Amount</span>
                      <span className="w-12 text-right">SOL</span>
                    </div>
                  </div>
                  
                  {subWallets.map((wallet, index) => (
                    <div
                      key={wallet.id}
                      className={`flex items-center justify-between py-2 text-sm cursor-pointer hover:bg-muted/50 ${
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
                        />
                        <span className="text-muted-foreground">{index + 1}</span>
                        <span className="font-mono text-xs">{wallet.address}</span>
                        <Copy className="w-3 h-3 text-muted-foreground hover:text-foreground" 
                          onClick={(e) => {
                            e.stopPropagation();
                            copyAddress(wallet.address);
                          }} />
                      </div>
                      <div className="flex gap-4 items-center">
                        <span className="text-orange-500">{hideBalances ? '••' : wallet.tokenBalance.toFixed(4)}</span>
                        <span className="text-orange-500 w-12 text-right">
                          {hideBalances ? '••' : (wallet.tokenValue || 0).toFixed(2)}
                        </span>
                        <span className="w-12 text-right">{hideBalances ? '••' : wallet.solBalance.toFixed(4)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Right Panel */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {/* Chart Area */}
            {showChart && (
              <Card className="h-96 bg-muted/30">
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">TradingView Chart</p>
                    <p className="text-sm">Chart integration coming soon</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Wallet Cards Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Wallet Addresses</h3>
                <Button variant="ghost" size="sm">
                  Add external address...
                </Button>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {[
                  { name: 'tdfY_lM0n', sol: 0.0, add: true },
                  { name: 'Aruft_StMy', sol: 0.0, add: false },
                  { name: '8vRB...PKjQ', sol: 0.0, max: true },
                  { name: '6o5o...kvwE', sol: 0.0, max: true },
                  { name: 'FuRV...WTc', sol: 0.0, max: true },
                  { name: 'F8Hc...v4D6', sol: 0.0, max: true },
                  { name: '73Es...DTuA', sol: 0.0, max: true },
                  { name: '57ro...qnP', sol: 0.0, max: true },
                  { name: '5kyp...Jqm', sol: 0.0, max: true },
                  { name: 'S4Ac...ZpR', sol: 0.0, max: true },
                  { name: 'r4c7...jXcX', sol: 0.0, max: true },
                  { name: '8y5M...PUM', sol: 0.0, max: true },
                  { name: 'kzty...MmS', sol: 0.0, max: true },
                  { name: 'AR07...chLB', sol: 0.0, max: true },
                  { name: '8W8T...S0ua', sol: 0.0, max: true },
                  { name: '3tmG...x0MJ', sol: 0.0, max: true },
                ].map((wallet, index) => (
                  <Card key={index} className="p-3 hover:border-primary/50 transition-colors cursor-pointer">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{wallet.name}</span>
                        <ExternalLink className="w-3 h-3 text-muted-foreground" />
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {wallet.add && <span className="text-green-500">Add +</span>}
                          {!wallet.add && !wallet.max && '-'}
                          {wallet.max && '-'}
                        </span>
                        <span>{hideBalances ? '••' : wallet.sol.toFixed(1)}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        0 | MAX: 0
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Order History */}
            <Card>
              <div className="space-y-3">
                <h3 className="font-semibold">Order History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-xs text-muted-foreground">
                        <th className="text-left py-2">Date</th>
                        <th className="text-left py-2">Tx Type</th>
                        <th className="text-left py-2">Total USD</th>
                        <th className="text-left py-2">Token Amount</th>
                        <th className="text-left py-2">SOL Amount</th>
                        <th className="text-left py-2">Price</th>
                        <th className="text-left py-2">Maker</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-8 text-center text-muted-foreground" colSpan={7}>
                          <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p>No order history</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 