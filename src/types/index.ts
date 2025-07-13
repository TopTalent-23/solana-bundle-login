// Transaction Types
export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  balance?: string;
  price?: number;
  value?: number;
}

export interface Transaction {
  id: string;
  type: 'swap' | 'liquidity' | 'transfer' | 'bundle';
  status: TransactionStatus;
  timestamp: Date;
  from: string;
  to?: string;
  tokens?: Token[];
  amount?: string;
  fee?: string;
  signature?: string;
  error?: string;
  details?: string;
}

export interface Bundle {
  id: string;
  name: string;
  description: string;
  transactions: BundleTransaction[];
  estimatedFee: string;
  estimatedSavings: string;
  protectionLevel: 'basic' | 'standard' | 'maximum';
  status: TransactionStatus;
  createdAt: Date;
}

export interface BundleTransaction {
  id: string;
  type: 'swap' | 'liquidity_add' | 'liquidity_remove' | 'transfer';
  instruction: string;
  params: Record<string, any>;
  estimatedGas?: string;
}

// Bundle Templates
export interface BundleTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'defi' | 'nft' | 'gaming' | 'custom';
  savings: string;
  included: string[];
  recommended?: boolean;
}

// Liquidity Types
export interface LiquidityPool {
  id: string;
  tokenA: Token;
  tokenB: Token;
  tvl: string;
  apy: number;
  volume24h: string;
  fees24h: string;
  userShare?: number;
  userValue?: string;
}

export interface LiquidityPosition {
  id: string;
  pool: LiquidityPool;
  shares: string;
  value: string;
  earnings: string;
  createdAt: Date;
}

// Wallet Types
export interface WalletState {
  connected: boolean;
  address?: string;
  balance?: string;
  tokens: Token[];
  transactions: Transaction[];
}

// UI Types
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  steps: TutorialStep[];
  category: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
}

export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  target?: string; // CSS selector for highlighting
  action?: string; // Button text for action
}

// Form Types
export interface SwapFormData {
  fromToken: Token | null;
  toToken: Token | null;
  amount: string;
  slippage: number;
  deadline: number; // minutes
}

export interface LiquidityFormData {
  tokenA: Token | null;
  tokenB: Token | null;
  amountA: string;
  amountB: string;
  balanced: boolean;
}

// Settings Types
export interface UserSettings {
  slippage: number;
  deadline: number;
  expertMode: boolean;
  darkMode: boolean;
  notifications: boolean;
  sounds: boolean;
} 