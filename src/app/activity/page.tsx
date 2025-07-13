'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  Send,
  Droplets,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Download,
  ExternalLink,
  Calendar,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useWalletStore, useUIStore } from '@/store';
import { formatCurrency, formatRelativeTime, getExplorerUrl } from '@/utils/format';
import { TransactionStatus } from '@/types';

const statusConfig = {
  completed: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' },
  failed: { icon: XCircle, color: 'text-error', bg: 'bg-error/10' },
  pending: { icon: Clock, color: 'text-warning', bg: 'bg-warning/10' },
  processing: { icon: Clock, color: 'text-primary', bg: 'bg-primary/10' },
  cancelled: { icon: XCircle, color: 'text-muted-foreground', bg: 'bg-muted' },
};

const typeIcons = {
  swap: TrendingUp,
  liquidity: Droplets,
  bundle: Package,
  transfer: Send,
};

export default function ActivityPage() {
  const { transactions } = useWalletStore();
  const { addToast } = useUIStore();
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');

  // Mock transactions for demo
  const mockTransactions = [
    {
      id: '0',
      type: 'bundle' as const,
      status: 'completed' as TransactionStatus,
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
      from: '7xKXtg2CW87d9...TxKQa3mz',
      amount: '15.318', // Total cost from launch
      fee: '0.318',
      signature: '2Yx9kLm...',
      details: 'BOOST Token Launch Bundle (Pool + 24 Wallets)',
    },
    {
      id: '1',
      type: 'bundle' as const,
      status: 'completed' as TransactionStatus,
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
      from: '7xKXtg2CW87d9...TxKQa3mz',
      amount: '100',
      fee: '0.001',
      signature: '5XkXt...',
      details: 'Safe Token Purchase Bundle',
    },
    {
      id: '2',
      type: 'swap' as const,
      status: 'completed' as TransactionStatus,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      from: '7xKXtg2CW87d9...TxKQa3mz',
      amount: '50',
      fee: '0.0005',
      signature: '4YmZt...',
      details: 'SOL ΓåÆ USDC',
    },
    {
      id: '3',
      type: 'liquidity' as const,
      status: 'processing' as TransactionStatus,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      from: '7xKXtg2CW87d9...TxKQa3mz',
      amount: '200',
      fee: '0.002',
      details: 'Add to SOL/USDC Pool',
    },
    {
      id: '4',
      type: 'transfer' as const,
      status: 'failed' as TransactionStatus,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      from: '7xKXtg2CW87d9...TxKQa3mz',
      to: '8zLYu3DH65e9...QwRb4nx',
      amount: '10',
      fee: '0.0001',
      error: 'Insufficient balance',
      details: 'Send USDC',
    },
  ];

  const allTransactions = [...mockTransactions, ...transactions];

  const filteredTransactions = allTransactions.filter(tx => {
    if (filterType !== 'all' && tx.type !== filterType) return false;
    if (filterStatus !== 'all' && tx.status !== filterStatus) return false;
    
    // Date range filtering
    const now = new Date();
    const txDate = new Date(tx.timestamp);
    switch (dateRange) {
      case 'today':
        return txDate.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return txDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return txDate >= monthAgo;
      default:
        return true;
    }
  });

  const handleExport = () => {
    addToast({
      type: 'success',
      title: 'Export Started',
      description: 'Your transaction history is being prepared for download.',
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Activity</h1>
            <p className="text-muted-foreground">Track all your transactions and bundles</p>
          </div>
          
          <Button
            variant="outline"
            icon={<Download className="w-4 h-4" />}
            onClick={handleExport}
          >
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background"
              >
                <option value="all">All Types</option>
                <option value="bundle">Bundles</option>
                <option value="swap">Swaps</option>
                <option value="liquidity">Liquidity</option>
                <option value="transfer">Transfers</option>
              </select>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Time Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Transaction List */}
        <div className="space-y-4">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((tx, index) => {
              const status = statusConfig[tx.status];
              const TypeIcon = typeIcons[tx.type];
              const StatusIcon = status.icon;
              
              return (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl ${status.bg} flex items-center justify-center flex-shrink-0`}>
                        <TypeIcon className={`w-6 h-6 ${status.color}`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="font-semibold capitalize">{tx.type}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {tx.details || `${tx.type} transaction`}
                            </p>
                            
                            <div className="flex items-center gap-4 mt-3 text-sm">
                              <span className="text-muted-foreground">
                                {formatRelativeTime(tx.timestamp)}
                              </span>
                              {tx.signature && (
                                <a
                                  href={getExplorerUrl(tx.signature)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-primary hover:text-primary/80"
                                >
                                  View
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-semibold">
                              {tx.amount ? formatCurrency(tx.amount) : '-'}
                            </p>
                            <div className={`flex items-center gap-1 text-sm mt-1 ${status.color}`}>
                              <StatusIcon className="w-4 h-4" />
                              <span className="capitalize">{tx.status}</span>
                            </div>
                            {tx.fee && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Fee: {tx.fee} SOL
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {tx.error && (
                          <div className="mt-3 p-3 bg-error/10 rounded-lg">
                            <p className="text-sm text-error">{tx.error}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })
          ) : (
            <Card>
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2">No Transactions Found</h4>
                <p className="text-muted-foreground">
                  {filterType !== 'all' || filterStatus !== 'all' || dateRange !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Your transaction history will appear here'}
                </p>
              </div>
            </Card>
          )}
        </div>

        {/* Summary Stats */}
        <Card className="bg-muted/50">
          <h3 className="font-semibold mb-4">Summary</h3>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Transactions</p>
              <p className="text-2xl font-bold">{filteredTransactions.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <p className="text-2xl font-bold text-success">
                {filteredTransactions.length > 0
                  ? Math.round(
                      (filteredTransactions.filter(tx => tx.status === 'completed').length /
                        filteredTransactions.length) *
                        100
                    )
                  : 0}%
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Volume</p>
              <p className="text-2xl font-bold">
                {formatCurrency(
                  filteredTransactions.reduce((sum, tx) => sum + parseFloat(tx.amount || '0'), 0)
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Fees</p>
              <p className="text-2xl font-bold">
                {filteredTransactions.reduce((sum, tx) => sum + parseFloat(tx.fee || '0'), 0).toFixed(4)} SOL
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
} 
