# Boost Legends Bundler Bot

A production-ready Solana bundler UI with real wallet connection support for mainnet transactions.

## 🔥 Features

- ✅ **Real Solana Wallet Connection** (Phantom, Solflare)
- ✅ **Mainnet Ready** - Configured for production use
- ✅ **Token Creation & Bundling** - Launch on PumpFun or LaunchLab
- ✅ **Liquidity Management** - Bundle liquidity with initial purchases
- ✅ **Multi-Wallet Management** - Create and manage multiple wallets
- ✅ **Beautiful Dark UI** - Three unique themes

## ⚡ Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure RPC (Important for Production):**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_RPC_ENDPOINT=https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY
   ```
   See [WALLET_SETUP.md](./WALLET_SETUP.md) for detailed configuration.

3. **Run the development server:**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔗 Wallet Connection

This app uses **real Solana wallet connections on Mainnet**. Make sure you have:
- Phantom or Solflare wallet browser extension installed
- SOL in your wallet for transaction fees
- A proper RPC endpoint configured for production use

**Note**: This is NOT a demo - all transactions are real and will cost real SOL.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
