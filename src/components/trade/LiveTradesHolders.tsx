'use client';

import React, { useState, useEffect } from 'react';
import { TickerToken } from '../TickerBanner';
import { RefreshCw, Users, DollarSign } from 'lucide-react';

interface LiveTradesHoldersProps {
  selectedToken: TickerToken;
}

interface TradeItem {
  signature: string;
  address: string;
  side: 'buy' | 'sell';
  amountToken: number;
  amountUSD: number;
  time: string;
}

interface HolderItem {
  address: string;
  label?: string;
  balance: number;
  percentage: number;
}

const MOCK_HOLDERS: Record<string, HolderItem[]> = {
  default: [
    { address: 'Raydium Liquidity Pool (AMM)', label: 'Liquidity Pool', balance: 45000000, percentage: 45.00 },
    { address: '5Q52fGjZSTptwE5Y5hN4xX8b8d4k3m', label: 'Deployer Wallet', balance: 8500000, percentage: 8.50 },
    { address: 'AnsemSlayer.sol', label: 'Top Trader', balance: 3200000, percentage: 3.20 },
    { address: 'GigaChad_SOL.sol', label: 'Top Trader', balance: 2100000, percentage: 2.10 },
    { address: '8xT2p9yYFvS3kZ5jH4bXn6w7u1m8qC', balance: 1400000, percentage: 1.40 },
    { address: '3vK5n7w8u1m8qC4bXz9yYFvS3kZ5jH', balance: 950000, percentage: 0.95 },
  ]
};

const INITIAL_TRADES: TradeItem[] = [
  { signature: '5x1', address: 'AnsemSlayer.sol', side: 'buy', amountToken: 12500, amountUSD: 26750, time: 'Just now' },
  { signature: '5x2', address: 'GigaChad_SOL.sol', side: 'buy', amountToken: 8400, amountUSD: 17976, time: '1m ago' },
  { signature: '5x3', address: '4bXz...9yT2', side: 'sell', amountToken: 4200, amountUSD: 8988, time: '2m ago' },
  { signature: '5x4', address: '8xT2...1m8q', side: 'buy', amountToken: 1500, amountUSD: 3210, time: '3m ago' },
  { signature: '5x5', address: '3vK5...z5jH', side: 'sell', amountToken: 9500, amountUSD: 20330, time: '5m ago' }
];

export default function LiveTradesHolders({ selectedToken }: LiveTradesHoldersProps) {
  const [activeTab, setActiveTab] = useState<'trades' | 'holders'>('trades');
  const [trades, setTrades] = useState<TradeItem[]>(INITIAL_TRADES);

  // Auto-generate live simulated trades to make dashboard feel alive
  useEffect(() => {
    // Generate initial set of trades based on current token price
    const generateInitialTrades = () => {
      return Array.from({ length: 8 }).map((_, idx) => {
        const side: 'buy' | 'sell' = Math.random() > 0.4 ? 'buy' : 'sell';
        const amountToken = Math.floor(Math.random() * 8000) + 100;
        const amountUSD = amountToken * selectedToken.price;
        const mins = idx + 1;
        const randomAddr = Math.random().toString(36).substring(2, 6).toUpperCase();
        
        return {
          signature: Math.random().toString(36).substring(2, 10),
          address: `${randomAddr}...${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
          side,
          amountToken,
          amountUSD,
          time: `${mins}m ago`
        };
      });
    };

    setTrades(generateInitialTrades());

    const interval = setInterval(() => {
      const side: 'buy' | 'sell' = Math.random() > 0.45 ? 'buy' : 'sell';
      // Vary transaction sizes
      const sizeMultiplier = Math.random() > 0.95 ? 15 : (Math.random() > 0.8 ? 5 : 1);
      const amountToken = (Math.floor(Math.random() * 4500) + 50) * sizeMultiplier;
      const amountUSD = amountToken * selectedToken.price;
      const randomAddr = Math.random().toString(36).substring(2, 6).toUpperCase();
      
      const newTrade: TradeItem = {
        signature: Math.random().toString(36).substring(2, 10),
        address: Math.random() > 0.8 
          ? (Math.random() > 0.5 ? 'AnsemSlayer.sol' : 'GigaChad_SOL.sol')
          : `${randomAddr}...${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        side,
        amountToken,
        amountUSD,
        time: 'Just now'
      };

      setTrades(prev => {
        const updated = [newTrade, ...prev.map(t => {
          if (t.time === 'Just now') return { ...t, time: '1m ago' };
          if (t.time.includes('m ago')) {
            const mins = parseInt(t.time) + 1;
            return { ...t, time: `${mins}m ago` };
          }
          return t;
        })];
        return updated.slice(0, 15); // keep max 15
      });
    }, 4000); // add trade every 4s

    return () => clearInterval(interval);
  }, [selectedToken.mint]);

  const holdersList = MOCK_HOLDERS[selectedToken.symbol] || MOCK_HOLDERS.default;

  return (
    <div className="w-full bg-bg-secondary border border-border-primary rounded-2xl overflow-hidden flex flex-col h-[350px]">
      {/* Tabs Header */}
      <div className="flex items-center justify-between px-4 border-b border-border-primary shrink-0 bg-bg-secondary/45">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('trades')}
            className={`py-3.5 px-1.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 relative ${
              activeTab === 'trades'
                ? 'border-accent-indigo text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Live Trades
          </button>
          
          <button
            onClick={() => setActiveTab('holders')}
            className={`py-3.5 px-1.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 relative ${
              activeTab === 'holders'
                ? 'border-accent-indigo text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Top Holders
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold uppercase select-none">
          <RefreshCw className="w-3 h-3 animate-spin text-accent-indigo" /> Live update
        </div>
      </div>

      {/* Tab Body */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {activeTab === 'trades' ? (
          /* Live Trades Tab */
          <div className="w-full text-left">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/5 text-gray-500 font-bold tracking-wider sticky top-0 bg-bg-secondary py-2 select-none">
                  <th className="py-2.5 px-4 font-normal">Time</th>
                  <th className="py-2.5 px-4 font-normal">Trader</th>
                  <th className="py-2.5 px-4 font-normal text-right">Type</th>
                  <th className="py-2.5 px-4 font-normal text-right">Amount</th>
                  <th className="py-2.5 px-4 font-normal text-right">Value (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {trades.map((trade) => {
                  const isBuy = trade.side === 'buy';
                  return (
                    <tr
                      key={trade.signature}
                      className="hover:bg-white/5 transition-colors duration-100 font-mono"
                    >
                      <td className="py-2 px-4 text-gray-500 font-medium">{trade.time}</td>
                      <td className="py-2 px-4 font-sans font-bold text-gray-300">
                        {trade.address}
                      </td>
                      <td className="py-2 px-4 text-right">
                        <span className={`px-1.5 py-0.5 rounded font-black text-[10px] uppercase font-mono ${
                          isBuy ? 'bg-accent-emerald/10 text-accent-emerald' : 'bg-accent-rose/10 text-accent-rose'
                        }`}>
                          {trade.side}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-right text-white font-semibold">
                        {trade.amountToken.toLocaleString(undefined, { maximumFractionDigits: 2 })} {selectedToken.symbol}
                      </td>
                      <td className="py-2 px-4 text-right text-gray-300 font-semibold">
                        ${trade.amountUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Top Holders Tab */
          <div className="p-4 flex flex-col gap-3">
            {holdersList.map((holder, idx) => (
              <div key={idx} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 font-bold">#{idx + 1}</span>
                    <span className="text-gray-300 font-medium truncate max-w-[150px] sm:max-w-none">
                      {holder.address}
                    </span>
                    {holder.label && (
                      <span className="text-[10px] bg-accent-indigo/10 text-accent-indigo border border-accent-indigo/20 px-1.5 py-0.5 rounded font-bold uppercase font-sans">
                        {holder.label}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-white font-bold">{holder.percentage.toFixed(2)}%</span>
                  </div>
                </div>
                {/* Horizontal percent bar */}
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent-indigo to-accent-purple rounded-full"
                    style={{ width: `${holder.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
