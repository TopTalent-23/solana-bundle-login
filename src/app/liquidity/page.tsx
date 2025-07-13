'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Droplets,
  Plus,
  Wallet,
  Info,
  TrendingUp,
  DollarSign,
  Settings,
  AlertCircle,
  Users,
  Copy,
  Shuffle,
  Calculator,
  Rocket,
  Zap,
  Shield,
  Lock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Tooltip } from '@/components/ui/Tooltip';
import { TokenSelector } from '@/components/TokenSelector';
import { useLiquidityStore, useWalletStore, useUIStore } from '@/store';
import { formatCurrency, formatTokenAmount, formatPercentage } from '@/utils/format';
import { Token } from '@/types';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function LiquidityPage() {
  const { positions } = useLiquidityStore();
  const { tokens } = useWalletStore();
  const { addToast } = useUIStore();
  
  // Liquidity State
  const [tokenA, setTokenA] = useState<Token | null>(null);
  const [tokenB, setTokenB] = useState<Token | null>(null);
  const [liquidityAmount, setLiquidityAmount] = useState('');
  
  // Buy Settings State
  const [walletCount, setWalletCount] = useState('10');
  const [totalBuyAmount, setTotalBuyAmount] = useState('');
  const [distributionMode, setDistributionMode] = useState<'equal' | 'random' | 'custom'>('equal');
  const [customAmounts, setCustomAmounts] = useState<string[]>([]);
  const [minBuy, setMinBuy] = useState('0.1');
  const [maxBuy, setMaxBuy] = useState('1');
  
  // Launch State
  const [isProcessing, setIsProcessing] = useState(false);
  const [launchComplete, setLaunchComplete] = useState(false);

  const handleCreatePoolAndBuy = async () => {
    if (!tokenA || !tokenB || !liquidityAmount || !totalBuyAmount) {
      addToast({
        type: 'error',
        title: 'Missing Information',
        description: 'Please fill in all required fields',
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setLaunchComplete(true);
      
      addToast({
        type: 'success',
        title: 'Launch Successful! 🚀',
        description: `Successfully created ${tokenA.symbol}/${tokenB.symbol} pool and distributed buys across ${walletCount} wallets`,
      });
    }, 3000);
  };

  const calculateWalletAmounts = () => {
    const count = parseInt(walletCount) || 10;
    const total = parseFloat(totalBuyAmount) || 0;
    
    if (distributionMode === 'equal') {
      return Array(count).fill((total / count).toFixed(4));
    } else if (distributionMode === 'random') {
      const min = parseFloat(minBuy) || 0.1;
      const max = parseFloat(maxBuy) || 1;
      const amounts = [];
      let remaining = total;
      
      for (let i = 0; i < count - 1; i++) {
        const randomAmount = Math.random() * (max - min) + min;
        const amount = Math.min(randomAmount, remaining);
        amounts.push(amount.toFixed(4));
        remaining -= amount;
      }
      amounts.push(remaining.toFixed(4));
      return amounts;
    }
    
    return customAmounts;
  };

  const walletAmounts = calculateWalletAmounts();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Success State */}
        {launchComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center py-12"
          >
            <div className="mb-8">
              <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Rocket className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Launch Successful! 🎉</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Your token liquidity pool has been created and initial buys have been distributed across {walletCount} wallets.
                You're now ready to manage your launch!
              </p>
            </div>
            
            <div className="grid gap-4 mb-8">
              <Card className="bg-boost-subtle">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Pool Created</span>
                  <span className="font-medium">{tokenA?.symbol}/{tokenB?.symbol}</span>
                </div>
              </Card>
              <Card className="bg-boost-subtle">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Wallets Created</span>
                  <span className="font-medium">{walletCount} wallets</span>
                </div>
              </Card>
              <Card className="bg-boost-subtle">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Investment</span>
                  <span className="font-medium">{totalBuyAmount} SOL</span>
                </div>
              </Card>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/manage-wallets">
                <Button size="lg" className="boost-glow">
                  <Users className="w-5 h-5 mr-2" />
                  Manage Your Wallets
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setLaunchComplete(false);
                  setLiquidityAmount('');
                  setTotalBuyAmount('');
                  setTokenA(null);
                  setTokenB(null);
                }}
              >
                Launch Another Token
              </Button>
            </div>
          </motion.div>
        )}

        {/* Main Content - Hidden when launch is complete */}
        {!launchComplete && (
          <>
            {/* Hero Header */}
            <motion.div {...fadeInUp} className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Rocket className="w-10 h-10 text-primary-500" />
            <h1 className="text-4xl font-bold boost-text-gradient">Create Liquidity & Bundle</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Launch your token like a legend! Create liquidity for your token and secure the first buys in one atomic transaction. 
            Be the first to own your supply before anyone else can snipe or bot your launch.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="boost-border-gradient">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-primary-500 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Anti-MEV Protection</h3>
                <p className="text-sm text-muted-foreground">
                  Bundle your transactions to prevent front-running and sandwich attacks
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="boost-border-gradient">
            <div className="flex items-start gap-3">
              <Zap className="w-6 h-6 text-secondary-400 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Atomic Execution</h3>
                <p className="text-sm text-muted-foreground">
                  Pool creation and token buys happen in the same block, guaranteed
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="boost-border-gradient">
            <div className="flex items-start gap-3">
              <Lock className="w-6 h-6 text-primary-500 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Secure Your Supply</h3>
                <p className="text-sm text-muted-foreground">
                  Be the first to own tokens from your pool at the initial price
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Main Form */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column - Liquidity Settings */}
          <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-500/20 text-primary-500 text-sm font-bold">1</span>
              Create Liquidity Pool
            </h3>
            <Card>
              <div className="space-y-4">
                <TokenSelector
                  tokens={tokens}
                  selectedToken={tokenA}
                  onSelect={setTokenA}
                  label="Base Token (Your Token)"
                />
                
                <TokenSelector
                  tokens={tokens.filter(t => t.address !== tokenA?.address)}
                  selectedToken={tokenB}
                  onSelect={setTokenB}
                  label="Quote Token (Usually SOL or USDC)"
                />
                
                <Input
                  type="number"
                  placeholder="0.00"
                  value={liquidityAmount}
                  onChange={(e) => setLiquidityAmount(e.target.value)}
                  label="Initial Liquidity Amount (SOL)"
                  helperText="Recommended: 5-10 SOL for small pools"
                  rightIcon={
                    <button className="text-primary text-sm font-medium">SUGGEST</button>
                  }
                />
                
                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pool Creation Fee</span>
                    <span className="font-medium">0.3 SOL</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Initial Price</span>
                    <span className="font-medium">$0.0001 per token</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Your LP Share</span>
                    <span className="font-medium">100%</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Right Column - Buy Settings */}
          <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary-400/20 text-secondary-400 text-sm font-bold">2</span>
              Bundle First Buys
            </h3>
            <Card>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Number of Wallets
                    <Tooltip content="We'll create and manage these wallets for you" />
                  </label>
                  <div className="flex gap-2">
                    {['5', '10', '15', '20', '24'].map((count) => (
                      <Button
                        key={count}
                        variant={walletCount === count ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setWalletCount(count)}
                      >
                        {count}
                      </Button>
                    ))}
                    <Input
                      type="number"
                      placeholder="Custom"
                      value={walletCount}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        if (value <= 24) {
                          setWalletCount(e.target.value);
                        }
                      }}
                      className="w-24"
                      max="24"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Maximum 24 wallets per bundle for optimal performance
                  </p>
                </div>
                
                <Input
                  type="number"
                  placeholder="0.00"
                  value={totalBuyAmount}
                  onChange={(e) => setTotalBuyAmount(e.target.value)}
                  label="Total Buy Amount (SOL)"
                  helperText={`Will be distributed across ${walletCount} wallets`}
                  leftIcon={<DollarSign className="w-5 h-5" />}
                />
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Distribution Mode
                    <Tooltip content="How to split the buy amount across wallets" />
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={distributionMode === 'equal' ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setDistributionMode('equal')}
                    >
                      <Calculator className="w-4 h-4" />
                      Equal
                    </Button>
                    <Button
                      variant={distributionMode === 'random' ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setDistributionMode('random')}
                    >
                      <Shuffle className="w-4 h-4" />
                      Random
                    </Button>
                    <Button
                      variant={distributionMode === 'custom' ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setDistributionMode('custom')}
                    >
                      <Settings className="w-4 h-4" />
                      Custom
                    </Button>
                  </div>
                </div>
                
                {distributionMode === 'random' && (
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="number"
                      placeholder="0.1"
                      value={minBuy}
                      onChange={(e) => setMinBuy(e.target.value)}
                      label="Min Buy (SOL)"
                    />
                    <Input
                      type="number"
                      placeholder="1.0"
                      value={maxBuy}
                      onChange={(e) => setMaxBuy(e.target.value)}
                      label="Max Buy (SOL)"
                    />
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Wallet Distribution Preview */}
        {totalBuyAmount && walletCount && (
          <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
            <h3 className="text-xl font-semibold mb-4">Wallet Distribution Preview</h3>
            <Card>
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Showing distribution for {walletCount} wallets
                  </span>
                  <Button variant="ghost" size="sm" icon={<Shuffle className="w-4 h-4" />}>
                    Regenerate
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-48 overflow-y-auto">
                  {walletAmounts.slice(0, parseInt(walletCount)).map((amount, index) => (
                    <div
                      key={index}
                      className="p-2 bg-muted rounded-lg text-center"
                    >
                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                        <Wallet className="w-3 h-3" />
                        Wallet {index + 1}
                      </div>
                      <div className="font-medium text-sm">{amount} SOL</div>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Average per wallet</p>
                    <p className="font-semibold">
                      {(parseFloat(totalBuyAmount) / parseInt(walletCount)).toFixed(4)} SOL
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Est. tokens per wallet</p>
                    <p className="font-semibold">~1,000,000 tokens</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Summary and Action */}
        <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
          <Card className="bg-primary/5 border-primary/20">
            <h3 className="text-lg font-semibold mb-4">Summary & Costs</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium mb-2">Pool Creation</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Initial Liquidity</span>
                    <span>{liquidityAmount || '0'} SOL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pool Creation Fee</span>
                    <span>0.3 SOL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Network Fee</span>
                    <span>~0.01 SOL</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium mb-2">Multi-Wallet Buys</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Buy Amount</span>
                    <span>{totalBuyAmount || '0'} SOL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Wallet Creation</span>
                    <span>{(parseInt(walletCount) * 0.002).toFixed(3)} SOL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service Fee (2%)</span>
                    <span>{(parseFloat(totalBuyAmount || '0') * 0.02).toFixed(3)} SOL</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Cost</p>
                  <p className="text-2xl font-bold">
                    {(
                      parseFloat(liquidityAmount || '0') +
                      parseFloat(totalBuyAmount || '0') +
                      0.3 + // Pool creation fee
                      0.01 + // Network fee
                      (parseInt(walletCount) * 0.002) + // Wallet creation
                      (parseFloat(totalBuyAmount || '0') * 0.02) // Service fee
                    ).toFixed(3)} SOL
                  </p>
                </div>
                <Button
                  size="lg"
                  onClick={handleCreatePoolAndBuy}
                  disabled={!tokenA || !tokenB || !liquidityAmount || !totalBuyAmount || isProcessing}
                  className="min-w-[200px] boost-glow"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing Launch...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-5 h-5 mr-2" />
                      Launch Like a Legend
                    </>
                  )}
                </Button>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="w-4 h-4" />
                <p>
                  You'll need to deposit funds to our secure wallet. Transactions are executed immediately after confirmation.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Educational Tips */}
        <motion.div {...fadeInUp} transition={{ delay: 0.5 }}>
          <h3 className="text-xl font-semibold mb-4">Pro Tips</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-primary/5 border-primary/20">
              <div className="flex gap-3">
                <Users className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Why Multiple Wallets?</h4>
                  <p className="text-sm text-muted-foreground">
                    Distributing buys across wallets prevents single-wallet dominance and creates organic-looking volume.
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-secondary/5 border-secondary/20">
              <div className="flex gap-3">
                <TrendingUp className="w-8 h-8 text-secondary flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Initial Liquidity</h4>
                  <p className="text-sm text-muted-foreground">
                    Start with 5-10 SOL for stability. You can always add more later as volume grows.
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-accent/5 border-accent/20">
              <div className="flex gap-3">
                <Settings className="w-8 h-8 text-accent flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Distribution Strategy</h4>
                  <p className="text-sm text-muted-foreground">
                    Random distribution looks more natural than equal splits for launch buying.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
} 