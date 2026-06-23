'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import TrendingTokens from '@/components/trade/TrendingTokens';
import PriceChart from '@/components/trade/PriceChart';
import LiveTradesHolders from '@/components/trade/LiveTradesHolders';
import SwapPanel from '@/components/trade/SwapPanel';
import PositionTracker from '@/components/trade/PositionTracker';
import { TickerToken } from '@/components/TickerBanner';

const DEFAULT_TOKENS: TickerToken[] = [
  {
    symbol: 'SOL',
    name: 'Solana',
    mint: 'So11111111111111111111111111111111111111112',
    price: 145.23,
    change24h: 4.82,
    logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    price: 1.00,
    change24h: 0.00,
    logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png'
  },
  {
    symbol: 'WIF',
    name: 'dogwifhat',
    mint: 'EKpQGSJtjMFqKZ9KQGWjh69dDB895UPBN1t4aj1AksWv',
    price: 2.14,
    change24h: 12.45,
    logo: 'https://assets.coingecko.com/coins/images/33566/large/dogwifhat.jpg'
  },
  {
    symbol: 'POPCAT',
    name: 'Popcat',
    mint: '7GCih62J8Z7Fbc64BHjov20qc7yrcLyZc2a6ry8Cwpump',
    price: 0.89,
    change24h: 18.23,
    logo: 'https://assets.coingecko.com/coins/images/34099/large/popcat.png'
  },
  {
    symbol: 'BONK',
    name: 'Bonk',
    mint: 'DezXAZ8z7PnrnRJjz3wJaR6WUx4mR6PL8zKBX25Niicp',
    price: 0.00002145,
    change24h: -3.12,
    logo: 'https://assets.coingecko.com/coins/images/28600/large/bonk.jpg'
  },
  {
    symbol: 'JUP',
    name: 'Jupiter',
    mint: 'JUPyiZJj1q7eHXt1fJcSEgyA7e1LsV6GArrhkc71T1X',
    price: 0.92,
    change24h: 2.15,
    logo: 'https://assets.coingecko.com/coins/images/34188/large/jup.png'
  },
  {
    symbol: 'PYTH',
    name: 'Pyth Network',
    mint: 'HZ128tWnNm2g2rJDxbRSTVJE468u1bKmgUPxS1YYagwo',
    price: 0.345,
    change24h: -1.45,
    logo: 'https://assets.coingecko.com/coins/images/31924/large/pyth.jpeg'
  },
  {
    symbol: 'MEW',
    name: 'cat in a dogs world',
    mint: 'MEW1gQWJ3nEXg2qgXqaaXwh5ONphUczg65WYJ9AKXv',
    price: 0.0054,
    change24h: 8.91,
    logo: 'https://assets.coingecko.com/coins/images/36398/large/MEW_COIN.jpg'
  },
  {
    symbol: 'JTO',
    name: 'Jito',
    mint: 'jtojtome526A4vY2N4wro6LY9S51J64yJtbn9LFR2a6',
    price: 2.45,
    change24h: 5.12,
    logo: 'https://assets.coingecko.com/coins/images/33455/large/jto.png'
  },
  {
    symbol: 'BOME',
    name: 'BOOK OF MEME',
    mint: 'ukhhY55a16gsf4NqL7tB5A1a6vU2cZp7gq2g1g1g1g1',
    price: 0.0084,
    change24h: -4.85,
    logo: 'https://assets.coingecko.com/coins/images/36109/large/bome.jpg'
  }
];

function TradingDashboardContent() {
  const searchParams = useSearchParams();
  const tokenMint = searchParams?.get('token');
  
  const [selectedToken, setSelectedToken] = useState<TickerToken>(DEFAULT_TOKENS[1]); // default to WIF initially for hype
  
  // Sandbox ledger state with preset assets to trade immediately
  const [portfolio, setPortfolio] = useState<Record<string, number>>({
    SOL: 24.85,
    USDC: 1500.00,
    WIF: 100.00,
    POPCAT: 45.00,
    BONK: 0,
    JUP: 0,
    PYTH: 0,
    MEW: 0,
    JTO: 0,
    BOME: 0
  });

  // Automatically update active token if requested by URL search parameters
  useEffect(() => {
    if (tokenMint) {
      const match = DEFAULT_TOKENS.find(t => t.mint === tokenMint);
      if (match) {
        setSelectedToken(match);
      }
    }
  }, [tokenMint]);

  const handleUpdatePortfolio = (tokenSymbol: string, amountChange: number, solChange: number) => {
    setPortfolio(prev => ({
      ...prev,
      SOL: parseFloat(Math.max(0, prev.SOL + solChange).toFixed(4)),
      [tokenSymbol]: parseFloat(Math.max(0, (prev[tokenSymbol] || 0) + amountChange).toFixed(4))
    }));
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6 items-start z-10">
      {/* Left Column - Discover Sidebar */}
      <div className="lg:col-span-1 h-[780px] lg:sticky lg:top-28">
        <TrendingTokens
          selectedToken={selectedToken}
          onSelectToken={setSelectedToken}
        />
      </div>

      {/* Middle Column - Charting Engine & Live Transactions */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <PriceChart selectedToken={selectedToken} />
        <LiveTradesHolders selectedToken={selectedToken} />
      </div>

      {/* Right Column - Swap Execution & Portfolios */}
      <div className="lg:col-span-1 flex flex-col gap-6 lg:sticky lg:top-28">
        <SwapPanel
          selectedToken={selectedToken}
          portfolio={portfolio}
          onUpdatePortfolio={handleUpdatePortfolio}
        />
        <PositionTracker
          portfolio={portfolio}
          tokensList={DEFAULT_TOKENS}
        />
      </div>
    </div>
  );
}

export default function TradePage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-accent-indigo border-t-transparent animate-spin" />
          <span className="text-xs text-gray-500 font-mono tracking-widest uppercase">
            Syncing trading interface...
          </span>
        </div>
      }
    >
      <TradingDashboardContent />
    </Suspense>
  );
}
