# ChadWallet Frontend Implementation

This repository contains the front-end implementation for ChadWallet, built with Next.js, Tailwind CSS, and Privy.

## Implementation Status

Below is a transparent breakdown of what has been built versus the original technical requirements.

### ✅ What is Done (Fully Implemented)

1. **ChadWallet Branding & Assets:** 
   - A modern, high-fidelity landing page (`fomo.family`-style) has been built.
   - Provided brand assets (app screenshots, logos, videos) are integrated.
   - iOS App Store and Android Google Play download links are active in the hero section.
2. **Sign-in with Apple/Google via Privy:** 
   - `@privy-io/react-auth` is fully integrated.
   - The "Connect & Start Swapping" buttons correctly trigger the Privy social login modal.
3. **Solana Support:** 
   - The UI is tailored for Solana (SOL, WIF, BONK, etc.).
   - `@solana/web3.js` is installed and ready for mainnet transaction integration.
4. **Rotating Token Banners:** 
   - Dual-rotating marquees (top and bottom) are implemented in the main layout.
   - Tapping a token seamlessly routes the user to the Trading UI for that specific token.
   - **Real Data:** The banner is hooked up to the **Jupiter Price API v2** to pull live, real-time Solana token prices.
5. **Trading UI (Bonus Task):** 
   - The complete `/trade` dashboard layout is built.
   - **Left:** Trending Tokens sidebar.
   - **Middle:** Price Chart and Live Trades/Holders feed.
   - **Right:** Buy/Sell Swap execution panel and a live Portfolio Tracker.

### 🚧 What is Missing / Sandboxed (Environment Configurations)

To ensure this repository runs out-of-the-box without deployment friction, several backend services are currently running in **Sandbox / Mock mode**. 

Before going to production, the following environment variables must be configured in a `.env.local` file:

1. **Supabase Database (Mocked):**
   - The app attempts to connect to Supabase for the live trade feed.
   - Because `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are not set, the client safely falls back to a hardcoded `MOCK_FEED` array. The UI will look completely functional, but the data is static.
2. **Privy Authentication (Sandbox Mode):**
   - The `NEXT_PUBLIC_PRIVY_APP_ID` environment variable is not set.
   - The app currently falls back to a sandbox App ID. This allows the Apple/Google modals to open for testing, but it is not connected to your production Privy dashboard.
3. **Live Trading Execution (Simulated):**
   - While the UI for swapping and tracking portfolios is fully built, actual mainnet transaction signing (via Jupiter routing) is currently simulated in React state (`portfolio` state). Real on-chain execution requires wiring up the signed Privy embedded wallet.

## Getting Started Locally

Because the app gracefully handles missing environment variables, you can run it immediately without any setup:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the live preview.
