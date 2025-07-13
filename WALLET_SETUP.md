# Solana Wallet Connection Setup Guide

## 🚀 Production Mainnet Configuration

This application is configured to use **Solana Mainnet** for real transactions. Follow these steps to ensure optimal performance and security.

### 1. RPC Endpoint Configuration

The default public RPC endpoint has rate limits and may be slow. For production use, you should use a premium RPC provider.

#### Recommended RPC Providers:
- **Helius**: https://www.helius.dev/ (Free tier available)
- **QuickNode**: https://www.quicknode.com/
- **Alchemy**: https://www.alchemy.com/
- **GetBlock**: https://getblock.io/

#### Setup Instructions:

1. Create a `.env.local` file in the root directory:
```bash
touch .env.local
```

2. Add your RPC endpoint:
```env
NEXT_PUBLIC_RPC_ENDPOINT=https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY
```

3. Restart your development server for changes to take effect.

### 2. Supported Wallets

Currently configured wallets:
- **Phantom** (Recommended)
- **Solflare**

To add more wallets, edit `src/providers/AppWalletProvider.tsx`:
```typescript
import { 
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
  // Add more wallet adapters here
} from '@solana/wallet-adapter-wallets';

const wallets = useMemo(
  () => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter({ network }),
    new TorusWalletAdapter(),
    new LedgerWalletAdapter(),
    // Add more wallets here
  ],
  [network]
);
```

### 3. Network Configuration

The app is configured for **Mainnet-Beta**. To switch networks (not recommended for production):

In `src/providers/AppWalletProvider.tsx`:
```typescript
// For Mainnet (current)
const network = WalletAdapterNetwork.Mainnet;

// For Devnet (testing only)
// const network = WalletAdapterNetwork.Devnet;

// For Testnet
// const network = WalletAdapterNetwork.Testnet;
```

### 4. Security Best Practices

1. **Never expose private keys** in your code
2. **Use environment variables** for sensitive configuration
3. **Implement proper error handling** for failed transactions
4. **Add transaction confirmation** before executing
5. **Use versioned transactions** for better reliability

### 5. Testing Your Connection

1. Install a supported wallet browser extension
2. Create or import a wallet
3. Ensure you have SOL for transaction fees
4. Click "Connect Wallet" in the app
5. Select your wallet from the modal
6. Approve the connection request

### 6. Common Issues

**Issue**: "Failed to fetch balance"
- **Solution**: Check your RPC endpoint configuration

**Issue**: Wallet not connecting
- **Solution**: Ensure wallet extension is installed and unlocked

**Issue**: Transactions failing
- **Solution**: Check SOL balance for fees, verify RPC endpoint

### 7. Price Feed Integration (Optional)

To show real-time SOL prices, you can integrate a price API:

1. Get an API key from CoinGecko or similar service
2. Update `src/hooks/useWalletBalance.ts` to fetch real prices:

```typescript
const fetchSolPrice = async () => {
  const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
  const data = await response.json();
  return data.solana.usd;
};
```

### 8. Production Checklist

- [ ] Configure custom RPC endpoint
- [ ] Test wallet connections on mainnet
- [ ] Implement proper error handling
- [ ] Add transaction confirmations
- [ ] Set up monitoring for RPC usage
- [ ] Test with multiple wallets
- [ ] Verify all features work with real wallets
- [ ] Add user guidance for wallet setup

### Need Help?

- Solana Docs: https://docs.solana.com/
- Wallet Adapter Docs: https://github.com/solana-labs/wallet-adapter
- Discord Support: https://discord.gg/solana 