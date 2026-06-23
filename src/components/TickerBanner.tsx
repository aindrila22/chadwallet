'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export interface TickerToken {
  symbol: string;
  name: string;
  mint: string;
  price: number;
  change24h: number;
  logo: string;
}

const INITIAL_TOKENS: TickerToken[] = [
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
    change24h: 0.01,
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
    symbol: 'BONK',
    name: 'Bonk',
    mint: 'DezXAZ8z7PnrnRJjz3wJaR6WUx4mR6PL8zKBX25Niicp',
    price: 0.00002145,
    change24h: -3.12,
    logo: 'https://assets.coingecko.com/coins/images/28600/large/bonk.jpg'
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
  }
];

interface TickerBannerProps {
  direction?: 'left' | 'right';
}

export default function TickerBanner({ direction = 'left' }: TickerBannerProps) {
  const [tokens, setTokens] = useState<TickerToken[]>(INITIAL_TOKENS);
  const router = useRouter();

  useEffect(() => {
    async function fetchPrices() {
      try {
        const mints = INITIAL_TOKENS.map(t => t.mint).join(',');
        // Fetch from Jupiter public Price API (V2)
        const res = await fetch(`https://api.jup.ag/price/v2?ids=${mints}`);
        if (!res.ok) throw new Error('Failed to fetch prices');
        const json = await res.json();
        
        if (json.data) {
          setTokens(prev =>
            prev.map(token => {
              const dataObj = json.data[token.mint];
              if (dataObj && dataObj.price) {
                // Generate a random daily change around current trend for visuals if not returned by price API
                const simulatedChange = token.change24h + (Math.random() - 0.5) * 0.5;
                return {
                  ...token,
                  price: parseFloat(dataObj.price),
                  change24h: parseFloat(simulatedChange.toFixed(2))
                };
              }
              return token;
            })
          );
        }
      } catch (err) {
        console.warn('Network issue: fetching marquee prices failed, using fallbacks');
      }
    }

    fetchPrices();
    const interval = setInterval(fetchPrices, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, []);

  const handleTokenClick = (mint: string) => {
    router.push(`/trade?token=${mint}`);
  };

  const renderTokenItem = (token: TickerToken, idx: number) => {
    const isPositive = token.change24h >= 0;
    // Format price beautifully
    const formattedPrice = token.price < 0.001 
      ? `$${token.price.toFixed(8)}`
      : `$${token.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;

    return (
      <div
        key={`${token.symbol}-${idx}`}
        onClick={() => handleTokenClick(token.mint)}
        className="inline-flex items-center gap-3 px-6 py-1 cursor-pointer hover:bg-white/5 rounded-full transition-colors duration-150 group border border-transparent hover:border-white/10"
      >
        <img
          src={token.logo}
          alt={token.symbol}
          className="w-5 h-5 rounded-full object-cover bg-bg-tertiary"
          onError={(e) => {
            // fallback if logo fails to load
            (e.target as HTMLImageElement).src = 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png';
          }}
        />
        <span className="font-display font-bold text-sm tracking-tight text-white group-hover:text-accent-indigo transition-colors duration-150">
          {token.symbol}
        </span>
        <span className="font-mono text-xs text-gray-400">
          {formattedPrice}
        </span>
        <span className={`font-mono text-xs font-bold ${isPositive ? 'text-accent-emerald' : 'text-accent-rose'}`}>
          {isPositive ? '▲' : '▼'} {Math.abs(token.change24h)}%
        </span>
      </div>
    );
  };

  return (
    <div className="relative w-full glass-panel border-y border-border-primary py-2.5 overflow-hidden select-none z-30">
      {/* Edge gradient overlays for fade-out styling */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-bg-primary to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-bg-primary to-transparent pointer-events-none z-10" />

      <div className="flex w-max whitespace-nowrap gap-4">
        {/* We repeat the marquee elements to ensure seamless infinite scroll */}
        <div className={`flex items-center gap-4 ${direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'}`}>
          {tokens.map((token, i) => renderTokenItem(token, i))}
        </div>
        <div className={`flex items-center gap-4 ${direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'}`}>
          {tokens.map((token, i) => renderTokenItem(token, i + tokens.length))}
        </div>
      </div>
    </div>
  );
}
