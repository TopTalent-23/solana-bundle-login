'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Droplets,
  RefreshCw,
  Settings2,
  ArrowRight,
  Info,
  Check,
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  DollarSign,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Tooltip } from '@/components/ui/Tooltip';
import { useBundleStore, useWalletStore, useUIStore } from '@/store';
import { formatCurrency, formatTokenAmount } from '@/utils/format';

type BundleStep = 'select-template' | 'configure' | 'review' | 'execute';

const bundleTemplates = [
  {
    id: 'safe-token',
    name: 'Safe Token Purchase',
    description: 'Buy tokens with built-in protection',
    icon: Shield,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    features: ['Price protection', 'Anti-bot shield', 'Automatic slippage'],
    savings: '$5-10',
    recommended: true,
  },
  {
    id: 'liquidity-safe',
    name: 'Add Liquidity Safely',
    description: 'Provide liquidity without getting sniped',
    icon: Droplets,
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
    features: ['Pool creation', 'First position', 'MEV protection'],
    savings: '$10-20',
  },
  {
    id: 'multi-swap',
    name: 'Multi-Swap',
    description: 'Swap multiple tokens in one go',
    icon: RefreshCw,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    features: ['Up to 5 swaps', 'Optimized routing', 'Gas savings'],
    savings: '$3-5 per swap',
  },
  {
    id: 'custom',
    name: 'Custom Bundle',
    description: 'Build your own transaction combo',
    icon: Settings2,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    features: ['Full control', 'Advanced settings', 'Expert mode'],
    savings: 'Varies',
  },
];

const protectionLevels = [
  { value: 'basic', label: 'Basic', description: 'Standard protection', cost: '$0.05' },
  { value: 'standard', label: 'Standard', description: 'Recommended for most users', cost: '$0.10', recommended: true },
  { value: 'maximum', label: 'Maximum', description: 'Best protection available', cost: '$0.20' },
];

export default function BundlePage() {
  const [currentStep, setCurrentStep] = useState<BundleStep>('select-template');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [protectionLevel, setProtectionLevel] = useState('standard');
  const [tokenAmount, setTokenAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const { tokens } = useWalletStore();
  const { addToast } = useUIStore();
  const { createBundle } = useBundleStore();

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    if (templateId === 'custom') {
      // Navigate to custom builder
      setCurrentStep('configure');
    } else {
      setCurrentStep('configure');
    }
  };

  const handleExecute = async () => {
    setIsExecuting(true);
    
    // Simulate bundle execution
    setTimeout(() => {
      createBundle({
        name: `${selectedTemplate} Bundle`,
        description: 'Transaction bundle',
        transactions: [],
        estimatedFee: '0.001 SOL',
        estimatedSavings: '$5.00',
        protectionLevel: protectionLevel as any,
      });
      
      addToast({
        type: 'success',
        title: 'Bundle Executed!',
        description: 'Your transactions have been bundled and sent successfully.',
      });
      
      setIsExecuting(false);
      setCurrentStep('select-template');
      setSelectedTemplate(null);
      setTokenAmount('');
    }, 3000);
  };

  const steps = [
    { id: 'select-template', label: 'Choose Template' },
    { id: 'configure', label: 'Configure' },
    { id: 'review', label: 'Review' },
    { id: 'execute', label: 'Execute' },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-medium
                      ${index <= currentStepIndex
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                      }
                    `}
                  >
                    {index < currentStepIndex ? <Check className="w-5 h-5" /> : index + 1}
                  </div>
                  <span className={`ml-3 font-medium ${
                    index <= currentStepIndex ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    index < currentStepIndex ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Select Template */}
          {currentStep === 'select-template' && (
            <motion.div
              key="select-template"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">What would you like to do today?</h2>
                <p className="text-muted-foreground">
                  Choose a template to get started, or create a custom bundle for advanced control.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {bundleTemplates.map((template) => (
                  <Card
                    key={template.id}
                    hover
                    onClick={() => handleTemplateSelect(template.id)}
                    className="relative overflow-hidden"
                  >
                    {template.recommended && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                          Recommended
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 ${template.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <template.icon className={`w-7 h-7 ${template.color}`} />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1">{template.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                        
                        <div className="space-y-2 mb-3">
                          {template.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-success" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Saves you:</span>
                          <span className="text-sm font-medium text-success">{template.savings}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Configure */}
          {currentStep === 'configure' && selectedTemplate && (
            <motion.div
              key="configure"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Configure Your Bundle</h2>
                <p className="text-muted-foreground">
                  Set up your transaction parameters. We'll handle the complex stuff.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-6">
                  {/* Token Selection */}
                  <Card>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      Select Token
                      <Tooltip content="Choose the token you want to trade" />
                    </h3>
                    
                    <div className="space-y-3">
                      {tokens.map((token) => (
                        <div
                          key={token.address}
                          onClick={() => setSelectedToken(token)}
                          className={`
                            p-3 rounded-lg border-2 cursor-pointer transition-all
                            ${selectedToken?.address === token.address
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                            }
                          `}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img
                                src={token.logoURI}
                                alt={token.symbol}
                                className="w-8 h-8 rounded-full"
                              />
                              <div>
                                <p className="font-medium">{token.symbol}</p>
                                <p className="text-sm text-muted-foreground">{token.name}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{formatTokenAmount(token.balance || '0')}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatCurrency(token.value || 0)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Amount Input */}
                  <Card>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      Amount
                      <Tooltip content="How much do you want to trade?" />
                    </h3>
                    
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={tokenAmount}
                      onChange={(e) => setTokenAmount(e.target.value)}
                      leftIcon={<DollarSign className="w-5 h-5" />}
                      rightIcon={
                        <button
                          onClick={() => setTokenAmount(selectedToken?.balance || '')}
                          className="text-primary hover:text-primary/80 text-sm font-medium"
                        >
                          MAX
                        </button>
                      }
                    />
                    
                    {tokenAmount && (
                      <p className="text-sm text-muted-foreground mt-2">
                        ≈ {formatCurrency(parseFloat(tokenAmount) * (selectedToken?.price || 0))}
                      </p>
                    )}
                  </Card>
                </div>

                <div>
                  {/* Protection Level */}
                  <Card>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      Protection Level
                      <Tooltip content="Higher protection = better safety from MEV attacks" />
                    </h3>
                    
                    <div className="space-y-3">
                      {protectionLevels.map((level) => (
                        <div
                          key={level.value}
                          onClick={() => setProtectionLevel(level.value)}
                          className={`
                            p-4 rounded-lg border-2 cursor-pointer transition-all
                            ${protectionLevel === level.value
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                            }
                          `}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{level.label}</span>
                              {level.recommended && (
                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                  Recommended
                                </span>
                              )}
                            </div>
                            <span className="text-sm font-medium">{level.cost}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{level.description}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 p-3 bg-warning/10 rounded-lg">
                      <div className="flex gap-2">
                        <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium">Protection Info</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Higher protection levels increase transaction priority and reduce the risk of front-running attacks.
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentStep('select-template')}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
                <Button
                  onClick={() => setCurrentStep('review')}
                  disabled={!selectedToken || !tokenAmount}
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Review */}
          {currentStep === 'review' && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Review Your Bundle</h2>
                <p className="text-muted-foreground">
                  Double-check everything before sending. Once sent, transactions cannot be reversed.
                </p>
              </div>

              <Card className="mb-6">
                <h3 className="font-semibold mb-4">Transaction Summary</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Bundle Type</span>
                    <span className="font-medium">
                      {bundleTemplates.find(t => t.id === selectedTemplate)?.name}
                    </span>
                  </div>
                  
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Token</span>
                    <span className="font-medium">{selectedToken?.symbol}</span>
                  </div>
                  
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-medium">
                      {formatTokenAmount(tokenAmount)} {selectedToken?.symbol}
                    </span>
                  </div>
                  
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Protection Level</span>
                    <span className="font-medium capitalize">{protectionLevel}</span>
                  </div>
                  
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Network Fee</span>
                    <span className="font-medium">~0.001 SOL</span>
                  </div>
                  
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Protection Fee</span>
                    <span className="font-medium">
                      {protectionLevels.find(l => l.value === protectionLevel)?.cost}
                    </span>
                  </div>
                  
                  <div className="flex justify-between py-3 text-success">
                    <span className="font-medium">Estimated Savings</span>
                    <span className="font-medium">~$5.00</span>
                  </div>
                </div>
              </Card>

              <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-warning flex-shrink-0" />
                  <div>
                    <p className="font-medium">Important</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Please review all details carefully. Blockchain transactions are irreversible.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentStep('configure')}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
                <Button
                  onClick={handleExecute}
                  loading={isExecuting}
                  className="min-w-[150px]"
                >
                  {isExecuting ? 'Executing...' : 'Execute Bundle'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
} 