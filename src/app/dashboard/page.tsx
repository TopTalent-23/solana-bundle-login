'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Package,
  Droplets,
  Send,
  TrendingUp,
  Shield,
  Sparkles,
  AlertCircle,
  Rocket,
  Zap,
  Users,
  Coins,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Tooltip } from '@/components/ui/Tooltip';
import Logo from '@/components/Logo';
import { useUIStore, useLiquidityStore, useAuthStore } from '@/store';
import { formatCurrency, formatTokenAmount, formatRelativeTime } from '@/utils/format';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const { showTutorial, setShowTutorial } = useUIStore();
  const { positions } = useLiquidityStore();
  const transactions: any[] = []; // Mock transactions for now

  // Mock data for demonstration
  const totalBalance = 1250.50;
  const totalLiquidityValue = positions.reduce((sum, pos) => sum + parseFloat(pos.value), 0);

  useEffect(() => {
    if (showTutorial && isAuthenticated) {
      // Show tutorial for first-time users
      // This would trigger a tutorial overlay
    }
  }, [showTutorial, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <p className="text-muted-foreground">
              Loading authentication...
            </p>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        {showTutorial && (
          <motion.div
            {...fadeInUp}
            className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 relative overflow-hidden"
          >
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.firstName}! 👋</h2>
              <p className="text-muted-foreground mb-4">
                Let's start with the basics. Would you like a quick tour?
              </p>
              <div className="flex gap-3">
                <Button variant="primary" size="sm">
                  Take a Tour
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowTutorial(false)}>
                  Skip for Now
                </Button>
              </div>
            </div>
            <div className="absolute right-0 top-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16" />
            <div className="absolute right-20 bottom-0 w-24 h-24 bg-secondary/20 rounded-full -mb-12" />
          </motion.div>
        )}

        {/* Active Launch Banner - Show if user has launched tokens */}
        <motion.div {...fadeInUp} className="mb-6">
          <Card className="bg-boost-gradient">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Active Launch: BOOST Token</h3>
                  <p className="text-white/80 text-sm">24 wallets holding • +550% ROI</p>
                </div>
              </div>
              <Link href="/manage-wallets">
                <Button variant="secondary" size="sm" className="bg-white text-primary-500 hover:bg-white/90">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Wallets
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>

        {/* Portfolio Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
            <Card>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Balance</span>
                <Tooltip content="Combined value of all your tokens" />
              </div>
              <p className="text-3xl font-bold">{formatCurrency(totalBalance)}</p>
              <p className="text-sm text-success mt-2">+5.2% today</p>
            </Card>
          </motion.div>

          <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
            <Card>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">SOL Balance</span>
                <Tooltip content="Your Solana balance" />
              </div>
              <p className="text-3xl font-bold">10.5 SOL</p>
              <p className="text-sm text-muted-foreground mt-2">
                ≈ {formatCurrency('420')}
              </p>
            </Card>
          </motion.div>

          <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
            <Card>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Liquidity Positions</span>
                <Tooltip content="Value locked in liquidity pools" />
              </div>
              <p className="text-3xl font-bold">{formatCurrency(totalLiquidityValue)}</p>
              <p className="text-sm text-muted-foreground mt-2">{positions.length} active pools</p>
            </Card>
          </motion.div>

          <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
            <Card>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Fees Saved</span>
                <Tooltip content="Estimated fees saved using bundles" />
              </div>
              <p className="text-3xl font-bold text-success">{formatCurrency(42.5)}</p>
              <p className="text-sm text-muted-foreground mt-2">This month</p>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div {...fadeInUp} transition={{ delay: 0.5 }}>
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/liquidity">
              <Card hover className="h-full boost-border-gradient">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-boost-gradient rounded-xl flex items-center justify-center flex-shrink-0">
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 flex items-center gap-2">
                      Create Liquidity & Bundle
                      <Zap className="w-4 h-4 text-secondary-400" />
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Launch your token with liquidity and secure first buys
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground ml-auto flex-shrink-0" />
                </div>
              </Card>
            </Link>

            <Link href="/token">
              <Card hover className="h-full boost-border-gradient">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-boost-gradient rounded-xl flex items-center justify-center flex-shrink-0">
                    <Coins className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 flex items-center gap-2">
                      Create Token & Bundle
                      <Zap className="w-4 h-4 text-secondary-400" />
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Deploy on PumpFun or LaunchLab with bundled buys
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground ml-auto flex-shrink-0" />
                </div>
              </Card>
            </Link>

            <Link href="/bundle">
              <Card hover className="h-full">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Bundle Transactions</h4>
                    <p className="text-sm text-muted-foreground">
                      Execute multiple transactions atomically
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground ml-auto flex-shrink-0" />
                </div>
              </Card>
            </Link>

            <Link href="/wallet">
              <Card hover className="h-full">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Send className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Send Tokens</h4>
                    <p className="text-sm text-muted-foreground">
                      Transfer tokens to another wallet
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground ml-auto flex-shrink-0" />
                </div>
              </Card>
            </Link>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div {...fadeInUp} transition={{ delay: 0.6 }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Recent Activity</h3>
            <Link href="/activity">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <Card>
            {transactions.length > 0 ? (
              <div className="space-y-4">
                {transactions.slice(0, 5).map((tx, index) => (
                  <div key={tx.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        tx.status === 'completed' ? 'bg-success/10' : 
                        tx.status === 'failed' ? 'bg-error/10' :
                        'bg-warning/10'
                      }`}>
                        {tx.type === 'swap' ? <TrendingUp className="w-5 h-5" /> :
                         tx.type === 'liquidity' ? <Droplets className="w-5 h-5" /> :
                         tx.type === 'bundle' ? <Package className="w-5 h-5" /> :
                         <Send className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-medium capitalize">{tx.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatRelativeTime(tx.timestamp)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-medium">
                        {tx.amount ? formatCurrency(tx.amount) : '-'}
                      </p>
                      <p className={`text-sm ${
                        tx.status === 'completed' ? 'text-success' :
                        tx.status === 'failed' ? 'text-error' :
                        'text-warning'
                      }`}>
                        {tx.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No transactions yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Create your first bundle to get started
                </p>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Tips & Updates */}
        <motion.div {...fadeInUp} transition={{ delay: 0.7 }}>
          <h3 className="text-xl font-semibold mb-4">Tips & Updates</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-primary/5 border-primary/20">
              <div className="flex gap-3">
                <Shield className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Security Tip</h4>
                  <p className="text-sm text-muted-foreground">
                    Always verify transaction details before signing. Enable 2FA for extra security.
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-secondary/5 border-secondary/20">
              <div className="flex gap-3">
                <TrendingUp className="w-8 h-8 text-secondary flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Market Update</h4>
                  <p className="text-sm text-muted-foreground">
                    SOL is up 5.2% today. Great time to provide liquidity!
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
} 