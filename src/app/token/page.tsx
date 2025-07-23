'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Coins,
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
  Upload,
  Globe,
  Twitter,
  MessageCircle,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Tooltip } from '@/components/ui/Tooltip';
import { useWalletStore, useUIStore } from '@/store';
import { formatCurrency, formatTokenAmount, formatPercentage } from '@/utils/format';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function TokenPage() {
  const { tokens } = useWalletStore();
  const { addToast } = useUIStore();
  const router = useRouter();
  
  // Token Creation State
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenDescription, setTokenDescription] = useState('');
  const [tokenImageFile, setTokenImageFile] = useState<File | null>(null);
  const [tokenImagePreview, setTokenImagePreview] = useState<string>('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [telegramUrl, setTelegramUrl] = useState('');
  const [platform, setPlatform] = useState<'pumpfun' | 'launchlab'>('pumpfun');
  
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
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  
  // Progress tracking
  const [currentStep, setCurrentStep] = useState(0);
  const [progressStatus, setProgressStatus] = useState({
    solDistribution: { status: 'pending', message: '' },
    metadataUpload: { status: 'pending', message: '' },
    bundlerSending: { status: 'pending', message: '' }
  });

  // Check for ongoing task on mount
  useEffect(() => {
    const savedTaskId = localStorage.getItem('pendingTokenCreation');
    if (savedTaskId) {
      setCurrentTaskId(savedTaskId);
      setIsProcessing(true);
      pollProgress(savedTaskId);
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTokenImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setTokenImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const pollProgress = async (taskId: string) => {
    try {
      const statusResponse = await fetch(`/api/token/status/${taskId}`);
      const status = await statusResponse.json();
      
      // Update progress status
      setProgressStatus(status.progress);
      
      // Update current step based on progress
      if (status.progress.solDistribution.status === 'completed') {
        setCurrentStep(2);
      }
      if (status.progress.metadataUpload.status === 'completed') {
        setCurrentStep(3);
      }
      
      // Check if all steps are completed
      if (status.progress.bundlerSending.status === 'completed') {
        setIsProcessing(false);
        setCurrentStep(0);
        
        // Clear the saved task ID
        localStorage.removeItem('pendingTokenCreation');
        
        // Store the completed task/project ID for the manage page
        if (status.projectId) {
          localStorage.setItem('lastCreatedProject', status.projectId);
        }
        
        addToast({
          type: 'success',
          title: 'Token Created Successfully! 🚀',
          description: 'Redirecting to manage your bundle...',
        });
        
        // Redirect to bundler manage page
        setTimeout(() => {
          router.push(`/projects/${status.projectId || taskId}/manage`);
        }, 1500);
        
      } else if (status.error) {
        throw new Error(status.error);
      } else {
        // Continue polling
        setTimeout(() => pollProgress(taskId), 1000);
      }
    } catch (error) {
      console.error('Progress polling error:', error);
      setIsProcessing(false);
      setCurrentStep(0);
      
      // Clear the saved task ID on error
      localStorage.removeItem('pendingTokenCreation');
      
      addToast({
        type: 'error',
        title: 'Creation Failed',
        description: error instanceof Error ? error.message : 'An error occurred during token creation',
      });
    }
  };

  const handleCreateTokenAndBuy = async () => {
    if (!tokenName || !tokenSymbol || !totalBuyAmount) {
      addToast({
        type: 'error',
        title: 'Missing Information',
        description: 'Please fill in all required fields',
      });
      return;
    }

    setIsProcessing(true);
    setCurrentStep(1);
    
    // Prepare form data
    const formData = new FormData();
    formData.append('tokenName', tokenName);
    formData.append('tokenSymbol', tokenSymbol);
    formData.append('tokenDescription', tokenDescription);
    formData.append('platform', platform);
    formData.append('walletCount', walletCount);
    formData.append('totalBuyAmount', totalBuyAmount);
    formData.append('distributionMode', distributionMode);
    formData.append('minBuy', minBuy);
    formData.append('maxBuy', maxBuy);
    
    if (tokenImageFile) {
      formData.append('tokenImage', tokenImageFile);
    }
    
    if (websiteUrl) formData.append('websiteUrl', websiteUrl);
    if (twitterUrl) formData.append('twitterUrl', twitterUrl);
    if (telegramUrl) formData.append('telegramUrl', telegramUrl);
    
    // Add wallet amounts for custom distribution
    if (distributionMode === 'custom') {
      formData.append('customAmounts', JSON.stringify(customAmounts));
    }
    
    try {
      // Start the create & bundle process
      const response = await fetch('/api/token/create-bundle', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to start token creation');
      }
      
      const { taskId } = await response.json();
      
      // Save task ID to localStorage for persistence
      localStorage.setItem('pendingTokenCreation', taskId);
      setCurrentTaskId(taskId);
      
      // Start polling
      pollProgress(taskId);
      
    } catch (error) {
      setIsProcessing(false);
      setCurrentStep(0);
      
      addToast({
        type: 'error',
        title: 'Failed to Create Token',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    }
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
        const randomAmount = Math.min(
          Math.random() * (max - min) + min,
          remaining - (count - i - 1) * min
        );
        amounts.push(randomAmount.toFixed(4));
        remaining -= randomAmount;
      }
      amounts.push(remaining.toFixed(4));
      return amounts.sort(() => Math.random() - 0.5);
    }
    
    return customAmounts;
  };

  const walletAmounts = calculateWalletAmounts();

  return (
    <DashboardLayout>
      <div className="space-y-8">
            {/* Progress Modal - Show when processing */}
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-card border border-border rounded-xl p-8 max-w-lg w-full shadow-2xl"
                >
                  <h3 className="text-2xl font-bold mb-6 text-center">Creating Your Token</h3>
                  
                  <div className="space-y-6">
                    {/* Step 1: SOL Distribution */}
                    <div className={`flex items-start gap-4 ${currentStep >= 1 ? 'opacity-100' : 'opacity-50'}`}>
                      <div className="relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                          progressStatus.solDistribution.status === 'completed' 
                            ? 'bg-green-500 border-green-500' 
                            : progressStatus.solDistribution.status === 'processing'
                            ? 'bg-primary border-primary animate-pulse'
                            : 'bg-muted border-border'
                        }`}>
                          {progressStatus.solDistribution.status === 'completed' ? (
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          ) : progressStatus.solDistribution.status === 'processing' ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <span className="text-sm font-medium">1</span>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">SOL Distribution</h4>
                        <p className="text-sm text-muted-foreground">
                          {progressStatus.solDistribution.message || 'Distributing SOL to wallets with bubble map avoidance'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Step 2: Metadata Upload */}
                    <div className={`flex items-start gap-4 ${currentStep >= 2 ? 'opacity-100' : 'opacity-50'}`}>
                      <div className="relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                          progressStatus.metadataUpload.status === 'completed' 
                            ? 'bg-green-500 border-green-500' 
                            : progressStatus.metadataUpload.status === 'processing'
                            ? 'bg-primary border-primary animate-pulse'
                            : 'bg-muted border-border'
                        }`}>
                          {progressStatus.metadataUpload.status === 'completed' ? (
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          ) : progressStatus.metadataUpload.status === 'processing' ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <span className="text-sm font-medium">2</span>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">Token Metadata Upload</h4>
                        <p className="text-sm text-muted-foreground">
                          {progressStatus.metadataUpload.message || 'Uploading token metadata to IPFS'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Step 3: Bundler Sending */}
                    <div className={`flex items-start gap-4 ${currentStep >= 3 ? 'opacity-100' : 'opacity-50'}`}>
                      <div className="relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                          progressStatus.bundlerSending.status === 'completed' 
                            ? 'bg-green-500 border-green-500' 
                            : progressStatus.bundlerSending.status === 'processing'
                            ? 'bg-primary border-primary animate-pulse'
                            : 'bg-muted border-border'
                        }`}>
                          {progressStatus.bundlerSending.status === 'completed' ? (
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          ) : progressStatus.bundlerSending.status === 'processing' ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <span className="text-sm font-medium">3</span>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">Sending Bundle</h4>
                        <p className="text-sm text-muted-foreground">
                          {progressStatus.bundlerSending.message || 'Creating token and executing bundle transactions'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      Please wait while we process your request...
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      You can safely refresh this page - your progress will be saved.
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Hero Header */}
            <motion.div {...fadeInUp} className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Coins className="w-10 h-10 text-primary-500" />
            <h1 className="text-4xl font-bold boost-text-gradient">Create Token & Bundle</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Deploy your token on PumpFun or LaunchLab and secure the first buys! These platforms don't require liquidity pools - 
            just create your token and bundle buys across multiple wallets to be the first owner.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="boost-border-gradient">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-primary-500 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">No LP Required</h3>
                <p className="text-sm text-muted-foreground">
                  PumpFun and LaunchLab handle liquidity automatically - just focus on your token launch.
                </p>
              </div>
            </div>
          </Card>

          <Card className="boost-border-gradient">
            <div className="flex items-start gap-3">
              <Zap className="w-6 h-6 text-secondary-400 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Instant Distribution</h3>
                <p className="text-sm text-muted-foreground">
                  Bundle buys across multiple wallets in the same transaction as token creation.
                </p>
              </div>
            </div>
          </Card>

          <Card className="boost-border-gradient">
            <div className="flex items-start gap-3">
              <Lock className="w-6 h-6 text-green-500 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Be First</h3>
                <p className="text-sm text-muted-foreground">
                  Guarantee you're the first to own your token supply before bots can snipe.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Platform Selection */}
        <motion.div {...fadeInUp} transition={{ delay: 0.15 }}>
          <h3 className="text-xl font-semibold mb-4">Select Platform</h3>
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 select-none ${
                  platform === 'pumpfun' 
                    ? 'border-primary-500 bg-gradient-to-br from-primary-500/20 to-primary-500/10 shadow-primary-500/30 shadow-xl ring-2 ring-primary-500/50' 
                    : 'hover:border-primary-300 hover:bg-primary-500/5 hover:shadow-lg hover:shadow-primary-500/20 active:bg-primary-500/10'
                }`}
                onClick={() => setPlatform('pumpfun')}
              >
                <div className="text-center relative">
                  {platform === 'pumpfun' && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 20 }}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-400 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </motion.div>
                  )}
                  <motion.div 
                    className={`w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3 transition-all duration-300 ${
                      platform === 'pumpfun' ? 'scale-110 shadow-lg shadow-purple-500/30' : 'hover:scale-105'
                    }`}
                    animate={platform === 'pumpfun' ? { 
                      boxShadow: [
                        '0 0 20px rgba(168, 85, 247, 0.4)',
                        '0 0 30px rgba(168, 85, 247, 0.6)',
                        '0 0 20px rgba(168, 85, 247, 0.4)'
                      ]
                    } : {}}
                    transition={{ duration: 2, repeat: platform === 'pumpfun' ? Infinity : 0 }}
                  >
                    <Rocket className="w-8 h-8 text-white" />
                  </motion.div>
                  <h4 className={`font-semibold mb-1 transition-colors ${
                    platform === 'pumpfun' ? 'text-primary-300' : ''
                  }`}>PumpFun</h4>
                  <p className="text-sm text-muted-foreground">
                    Popular meme token platform with automatic bonding curve
                  </p>
                  <div className={`mt-3 text-xs font-medium transition-colors ${
                    platform === 'pumpfun' ? 'text-primary-300' : 'text-primary-500'
                  }`}>
                    {platform === 'pumpfun' ? '✓ Selected' : 'Click to select'}
                  </div>
                </div>
              </Card>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 select-none ${
                  platform === 'launchlab' 
                    ? 'border-primary-500 bg-gradient-to-br from-primary-500/20 to-primary-500/10 shadow-primary-500/30 shadow-xl ring-2 ring-primary-500/50' 
                    : 'hover:border-primary-300 hover:bg-primary-500/5 hover:shadow-lg hover:shadow-primary-500/20 active:bg-primary-500/10'
                }`}
                onClick={() => setPlatform('launchlab')}
              >
                <div className="text-center relative">
                  {platform === 'launchlab' && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 20 }}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-400 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </motion.div>
                  )}
                  <motion.div 
                    className={`w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3 transition-all duration-300 ${
                      platform === 'launchlab' ? 'scale-110 shadow-lg shadow-blue-500/30' : 'hover:scale-105'
                    }`}
                    animate={platform === 'launchlab' ? { 
                      boxShadow: [
                        '0 0 20px rgba(59, 130, 246, 0.4)',
                        '0 0 30px rgba(59, 130, 246, 0.6)',
                        '0 0 20px rgba(59, 130, 246, 0.4)'
                      ]
                    } : {}}
                    transition={{ duration: 2, repeat: platform === 'launchlab' ? Infinity : 0 }}
                  >
                    <Zap className="w-8 h-8 text-white" />
                  </motion.div>
                  <h4 className={`font-semibold mb-1 transition-colors ${
                    platform === 'launchlab' ? 'text-primary-300' : ''
                  }`}>LaunchLab</h4>
                  <p className="text-sm text-muted-foreground">
                    Advanced platform with built-in marketing tools
                  </p>
                  <div className={`mt-3 text-xs font-medium transition-colors ${
                    platform === 'launchlab' ? 'text-primary-300' : 'text-primary-500'
                  }`}>
                    {platform === 'launchlab' ? '✓ Selected' : 'Click to select'}
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* Token Details */}
        <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
          <h3 className="text-xl font-semibold mb-4">Token Details</h3>
          <Card>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Token Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                    placeholder="Boost Legends Token"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Token Symbol <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={tokenSymbol}
                    onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
                    placeholder="BOOST"
                    maxLength={10}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={tokenDescription}
                    onChange={(e) => setTokenDescription(e.target.value)}
                    placeholder="Describe your token..."
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    rows={5}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Token Image
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <label
                        htmlFor="token-image-upload"
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        Choose File
                      </label>
                      <input
                        id="token-image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      {tokenImageFile && (
                        <span className="text-sm text-muted-foreground">
                          {tokenImageFile.name}
                        </span>
                      )}
                    </div>
                    
                    {tokenImagePreview && (
                      <div className="mt-3">
                        <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                        <img
                          src={tokenImagePreview}
                          alt="Token preview"
                          className="w-20 h-20 rounded-lg object-cover border border-border"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="mt-6 pt-6 border-t border-border">
              <h4 className="font-medium mb-4">Social Links (Optional)</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Globe className="w-4 h-4 inline mr-1" />
                    Website
                  </label>
                  <Input
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Twitter className="w-4 h-4 inline mr-1" />
                    Twitter
                  </label>
                  <Input
                    value={twitterUrl}
                    onChange={(e) => setTwitterUrl(e.target.value)}
                    placeholder="https://twitter.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <MessageCircle className="w-4 h-4 inline mr-1" />
                    Telegram
                  </label>
                  <Input
                    value={telegramUrl}
                    onChange={(e) => setTelegramUrl(e.target.value)}
                    placeholder="https://t.me/..."
                  />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Buy Settings */}
        <motion.div {...fadeInUp} transition={{ delay: 0.25 }}>
          <h3 className="text-xl font-semibold mb-4">Multi-Wallet Buy Settings</h3>
          <Card>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Number of Wallets
                  <Tooltip content="More wallets = more natural distribution">
                    <Info className="w-4 h-4 inline ml-1 text-muted-foreground" />
                  </Tooltip>
                </label>
                <Input
                  type="number"
                  value={walletCount}
                  onChange={(e) => setWalletCount(e.target.value)}
                  min="1"
                  max="24"
                  placeholder="10"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Maximum 24 wallets for optimal gas efficiency
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Total Buy Amount (SOL) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  value={totalBuyAmount}
                  onChange={(e) => setTotalBuyAmount(e.target.value)}
                  step="0.1"
                  placeholder="5"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This will be distributed across all wallets
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium mb-3">Distribution Mode</label>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant={distributionMode === 'equal' ? 'primary' : 'outline'}
                  onClick={() => setDistributionMode('equal')}
                  className="justify-center"
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Equal Split
                </Button>
                <Button
                  variant={distributionMode === 'random' ? 'primary' : 'outline'}
                  onClick={() => setDistributionMode('random')}
                  className="justify-center"
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  Random
                </Button>
                <Button
                  variant={distributionMode === 'custom' ? 'primary' : 'outline'}
                  onClick={() => setDistributionMode('custom')}
                  className="justify-center"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Custom
                </Button>
              </div>
            </div>
            
            {distributionMode === 'random' && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-3">Random Distribution Settings</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm">Min Buy (SOL)</label>
                    <Input
                      type="number"
                      value={minBuy}
                      onChange={(e) => setMinBuy(e.target.value)}
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="text-sm">Max Buy (SOL)</label>
                    <Input
                      type="number"
                      value={maxBuy}
                      onChange={(e) => setMaxBuy(e.target.value)}
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Preview */}
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
                    <p className="text-sm text-muted-foreground">Platform</p>
                    <p className="font-semibold">{platform === 'pumpfun' ? 'PumpFun' : 'LaunchLab'}</p>
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
                <h4 className="font-medium mb-2">Token Creation</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform</span>
                    <span>{platform === 'pumpfun' ? 'PumpFun' : 'LaunchLab'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Creation Fee</span>
                    <span>{platform === 'pumpfun' ? '0.02' : '0.05'} SOL</span>
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
                      parseFloat(totalBuyAmount || '0') +
                      (platform === 'pumpfun' ? 0.02 : 0.05) + // Platform fee
                      0.01 + // Network fee
                      (parseInt(walletCount) * 0.002) + // Wallet creation
                      (parseFloat(totalBuyAmount || '0') * 0.02) // Service fee
                    ).toFixed(3)} SOL
                  </p>
                </div>
                <Button
                  size="lg"
                  onClick={handleCreateTokenAndBuy}
                  disabled={!tokenName || !tokenSymbol || !totalBuyAmount || isProcessing}
                  className="min-w-[200px] boost-glow"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating Token...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-5 h-5 mr-2" />
                      Create & Bundle
                    </>
                  )}
                </Button>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="w-4 h-4" />
                <p>
                  Token creation and initial buys are executed atomically. You'll be the first owner!
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
} 