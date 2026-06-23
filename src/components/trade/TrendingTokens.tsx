'use client';

import React, { useState, useEffect } from 'react';
import { Search, Flame, TrendingUp, DollarSign } from 'lucide-react';
import { TickerToken } from '../TickerBanner';

// Pre-defined set of tokens with their details
const BASE_TOKENS: TickerToken[] = [
  {
    symbol: 'SOL',
    name: 'Solana',
    mint: 'So11111111111111111111111111111111111111112',
    price: 145.23,
    change24h: 4.82,
    logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
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

interface TrendingTokensProps {
  selectedToken: TickerToken;
  onSelectToken: (token: TickerToken) => void;
}

export default function TrendingTokens({ selectedToken, onSelectToken }: TrendingTokensProps) {
  const [tokens, setTokens] = useState<TickerToken[]>(BASE_TOKENS);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'trending' | 'gainers' | 'volume'>('trending');

  useEffect(() => {
    async function fetchPrices() {
      try {
        const mints = BASE_TOKENS.map(t => t.mint).join(',');
        const res = await fetch(`https://api.jup.ag/price/v2?ids=${mints}`);
        if (!res.ok) throw new Error('Price fetch failed');
        const json = await res.json();
        
        if (json.data) {
          setTokens(prev =>
            prev.map(token => {
              const dataObj = json.data[token.mint];
              if (dataObj && dataObj.price) {
                // Keep simulated changes around original values for premium feel
                const simulatedChange = token.change24h + (Math.random() - 0.5) * 0.2;
                const newPrice = parseFloat(dataObj.price);
                
                // If active token is updated, update the selected token in parent page
                const updatedToken = {
                  ...token,
                  price: newPrice,
                  change24h: parseFloat(simulatedChange.toFixed(2))
                };
                if (token.mint === selectedToken.mint && selectedToken.price !== newPrice) {
                  onSelectToken(updatedToken);
                }
                return updatedToken;
              }
              return token;
            })
          );
        }
      } catch (err) {
        console.warn('Network issue: fetching trending prices failed, using fallbacks');
      }
    }

    fetchPrices();
    const interval = setInterval(fetchPrices, 20000);
    return () => clearInterval(interval);
  }, [selectedToken.mint]);

  // Filters and sorts tokens
  const filteredTokens = tokens
    .filter(token => 
      token.symbol.toLowerCase().includes(search.toLowerCase()) ||
      token.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (activeTab === 'gainers') {
        return b.change24h - a.change24h;
      }
      if (activeTab === 'volume') {
        // Mock volume sorting using prices
        return (b.price * 1000) - (a.price * 1000);
      }
      // Trending: default order or absolute change value
      return Math.abs(b.change24h) - Math.abs(a.change24h);
    });

  return (
    <div className="w-full flex flex-col h-full bg-bg-secondary border border-border-primary rounded-2xl overflow-hidden">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-border-primary flex flex-col gap-3">
        <h3 className="text-white font-display font-bold text-base flex items-center gap-2">
          <Flame className="w-4 h-4 text-accent-indigo" /> Discover Tokens
        </h3>
        
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search symbol or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-bg-primary border border-border-primary pl-9 pr-4 py-2 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent-indigo/50 transition-all font-sans"
          />
        </div>

        {/* Sorting Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-bg-primary p-1 rounded-xl border border-border-primary">
          <button
            onClick={() => setActiveTab('trending')}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'trending'
                ? 'bg-bg-tertiary text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" /> Trend
          </button>
          
          <button
            onClick={() => setActiveTab('gainers')}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'gainers'
                ? 'bg-bg-tertiary text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" /> Gainers
          </button>
          
          <button
            onClick={() => setActiveTab('volume')}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'volume'
                ? 'bg-bg-tertiary text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" /> Vol
          </button>
        </div>
      </div>

      {/* Token List */}
      <div className="flex-1 overflow-y-auto divide-y divide-white/5">
        {filteredTokens.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-500 font-medium">
            No tokens matching "{search}"
          </div>
        ) : (
          filteredTokens.map((token) => {
            const isSelected = token.mint === selectedToken.mint;
            const isPositive = token.change24h >= 0;
            const formattedPrice = token.price < 0.001 
              ? `$${token.price.toFixed(8)}`
              : `$${token.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;

            return (
              <div
                key={token.mint}
                onClick={() => onSelectToken(token)}
                className={`p-3.5 flex items-center justify-between cursor-pointer transition-all duration-150 border-l-[3px] ${
                  isSelected 
                    ? 'bg-accent-indigo/5 border-l-accent-indigo' 
                    : 'border-l-transparent hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={token.logo}
                    alt={token.symbol}
                    className="w-8 h-8 rounded-full bg-bg-tertiary object-cover shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png';
                    }}
                  />
                  <div className="min-w-0">
                    <div className="font-display font-bold text-sm text-white flex items-center gap-1.5">
                      {token.symbol}
                      {token.change24h > 15 && (
                        <span className="text-[10px] bg-accent-rose/10 text-accent-rose px-1 rounded font-black font-mono">
                          HOT
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-500 truncate max-w-[100px] font-medium leading-none mt-0.5">
                      {token.name}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono text-sm text-white font-bold leading-none">
                    {formattedPrice}
                  </div>
                  <div className={`font-mono text-[11px] font-bold mt-1 ${isPositive ? 'text-accent-emerald' : 'text-accent-rose'}`}>
                    {isPositive ? '+' : ''}{token.change24h}%
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
