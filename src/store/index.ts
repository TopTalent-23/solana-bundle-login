import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  WalletState, 
  ToastMessage, 
  UserSettings, 
  Bundle, 
  Transaction,
  Token,
  LiquidityPosition 
} from '@/types';

// Wallet Store
interface WalletStore extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => void;
  updateBalance: () => Promise<void>;
  addTransaction: (transaction: Transaction) => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
  connected: false,
  tokens: [],
  transactions: [],
  
  connect: async () => {
    // Mock wallet connection
    set({
      connected: true,
      address: '7xKXtg2CW87d9...TxKQa3mz',
      balance: '10.5',
      tokens: [
        {
          address: 'So11111111111111111111111111111111111111112',
          symbol: 'SOL',
          name: 'Solana',
          decimals: 9,
          logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
          balance: '10.5',
          price: 40,
          value: 420,
        },
        {
          address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          symbol: 'USDC',
          name: 'USD Coin',
          decimals: 6,
          logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
          balance: '500',
          price: 1,
          value: 500,
        },
        {
          address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
          symbol: 'BONK',
          name: 'Bonk',
          decimals: 5,
          logoURI: 'https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I',
          balance: '10000',
          price: 0.000015,
          value: 0.15,
        }
      ]
    });
  },
  
  disconnect: () => {
    set({
      connected: false,
      address: undefined,
      balance: undefined,
      tokens: [],
      transactions: [],
    });
  },
  
  updateBalance: async () => {
    // Mock balance update
    console.log('Updating balance...');
  },
  
  addTransaction: (transaction) => {
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    }));
  },
}));

// UI Store
interface UIStore {
  toasts: ToastMessage[];
  showTutorial: boolean;
  sidebarOpen: boolean;
  helpOpen: boolean;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  toggleSidebar: () => void;
  toggleHelp: () => void;
  setShowTutorial: (show: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  toasts: [],
  showTutorial: true, // Show tutorial for first-time users
  sidebarOpen: false,
  helpOpen: false,
  
  addToast: (toast) => {
    const id = Date.now().toString();
    const newToast = { ...toast, id };
    
    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));
    
    // Auto-remove after duration
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, toast.duration || 5000);
  },
  
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
  
  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },
  
  toggleHelp: () => {
    set((state) => ({ helpOpen: !state.helpOpen }));
  },
  
  setShowTutorial: (show) => {
    set({ showTutorial: show });
  },
}));

// Settings Store (Persisted)
interface SettingsStore {
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: {
        slippage: 0.5,
        deadline: 30,
        expertMode: false,
        darkMode: false,
        notifications: true,
        sounds: true,
      },
      
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },
    }),
    {
      name: 'bundler-settings',
    }
  )
);

// Bundle Store
interface BundleStore {
  bundles: Bundle[];
  currentBundle: Bundle | null;
  templates: any[]; // BundleTemplate[]
  createBundle: (bundle: Omit<Bundle, 'id' | 'createdAt' | 'status'>) => void;
  updateBundle: (id: string, updates: Partial<Bundle>) => void;
  removeBundle: (id: string) => void;
  setCurrentBundle: (bundle: Bundle | null) => void;
}

export const useBundleStore = create<BundleStore>((set) => ({
  bundles: [],
  currentBundle: null,
  templates: [
    {
      id: 'safe-token',
      name: 'Safe Token Purchase',
      description: 'Buy tokens with built-in protection',
      icon: '🛡️',
      category: 'defi',
      savings: '$5-10',
      included: ['Price protection', 'Anti-bot shield'],
      recommended: true,
    },
    {
      id: 'liquidity-safe',
      name: 'Add Liquidity Safely',
      description: 'Provide liquidity without getting sniped',
      icon: '💧',
      category: 'defi',
      savings: '$10-20',
      included: ['Pool creation', 'First position'],
    },
    {
      id: 'multi-swap',
      name: 'Multi-Swap',
      description: 'Swap multiple tokens in one go',
      icon: '🔄',
      category: 'defi',
      savings: '$3-5 per swap',
      included: ['Up to 5 swaps'],
    },
  ],
  
  createBundle: (bundleData) => {
    const bundle: Bundle = {
      ...bundleData,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date(),
    };
    
    set((state) => ({
      bundles: [...state.bundles, bundle],
      currentBundle: bundle,
    }));
  },
  
  updateBundle: (id, updates) => {
    set((state) => ({
      bundles: state.bundles.map((b) =>
        b.id === id ? { ...b, ...updates } : b
      ),
      currentBundle:
        state.currentBundle?.id === id
          ? { ...state.currentBundle, ...updates }
          : state.currentBundle,
    }));
  },
  
  removeBundle: (id) => {
    set((state) => ({
      bundles: state.bundles.filter((b) => b.id !== id),
      currentBundle: state.currentBundle?.id === id ? null : state.currentBundle,
    }));
  },
  
  setCurrentBundle: (bundle) => {
    set({ currentBundle: bundle });
  },
}));

// Liquidity Store
interface LiquidityStore {
  positions: LiquidityPosition[];
  addPosition: (position: LiquidityPosition) => void;
  removePosition: (id: string) => void;
  updatePosition: (id: string, updates: Partial<LiquidityPosition>) => void;
}

export const useLiquidityStore = create<LiquidityStore>((set) => ({
  positions: [
    {
      id: '1',
      pool: {
        id: 'sol-usdc',
        tokenA: {
          address: 'So11111111111111111111111111111111111111112',
          symbol: 'SOL',
          name: 'Solana',
          decimals: 9,
          logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
        },
        tokenB: {
          address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          symbol: 'USDC',
          name: 'USD Coin',
          decimals: 6,
          logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
        },
        tvl: '1250000',
        apy: 24.5,
        volume24h: '350000',
        fees24h: '875',
        userShare: 0.02,
        userValue: '250',
      },
      shares: '0.02',
      value: '250',
      earnings: '1.64',
      createdAt: new Date('2024-01-01'),
    },
  ],
  
  addPosition: (position) => {
    set((state) => ({
      positions: [...state.positions, position],
    }));
  },
  
  removePosition: (id) => {
    set((state) => ({
      positions: state.positions.filter((p) => p.id !== id),
    }));
  },
  
  updatePosition: (id, updates) => {
    set((state) => ({
      positions: state.positions.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    }));
  },
})); 