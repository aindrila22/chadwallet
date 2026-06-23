'use client';

import React from 'react';
import { TickerToken } from '../TickerBanner';
import { Wallet, TrendingUp, Info } from 'lucide-react';

interface PositionTrackerProps {
  portfolio: Record<string, number>;
  tokensList: TickerToken[];
}

export default function PositionTracker({ portfolio, tokensList }: PositionTrackerProps) {
  // Compute total USD value of positions
  const getSolPrice = () => 145.23;

  const positions = Object.entries(portfolio)
    .filter(([_, balance]) => balance > 0)
    .map(([symbol, balance]) => {
      let price = 0;
      let logo = '';
      
      if (symbol === 'SOL') {
        price = getSolPrice();
        logo = 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png';
      } else {
        const token = tokensList.find(t => t.symbol === symbol);
        price = token ? token.price : 0;
        logo = token ? token.logo : '';
      }

      const valueUSD = balance * price;
      
      // Simulate an entry price lower than current for visual positive feedback
      const entryPrice = price * 0.92;
      const pnlUSD = balance * (price - entryPrice);
      const pnlPercent = ((price - entryPrice) / entryPrice) * 100;

      return {
        symbol,
        balance,
        price,
        logo,
        valueUSD,
        pnlUSD,
        pnlPercent
      };
    });

  const totalValueUSD = positions.reduce((acc, curr) => acc + curr.valueUSD, 0);

  return (
    <div className="w-full bg-bg-secondary border border-border-primary rounded-2xl p-5 flex flex-col gap-4">
      {/* Position Header */}
      <div className="flex items-center justify-between select-none">
        <h3 className="text-white font-display font-bold text-base flex items-center gap-2">
          <Wallet className="w-4 h-4 text-accent-indigo" /> Your Positions
        </h3>
        <span className="font-mono text-xs text-gray-400 font-bold">
          Total: ${totalValueUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>

      {/* Positions List */}
      <div className="flex flex-col gap-3 max-h-[220px] overflow-y-auto pr-1">
        {positions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center text-xs text-gray-500 gap-1.5 select-none">
            <Info className="w-4.5 h-4.5 text-gray-600" />
            <span>No positions held. Swap SOL to buy meme tokens.</span>
          </div>
        ) : (
          positions.map((pos) => {
            const isPositive = pos.pnlUSD >= 0;
            return (
              <div
                key={pos.symbol}
                className="glass-panel p-3 rounded-xl flex items-center justify-between border border-white/5"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={pos.logo || undefined}
                    alt={pos.symbol}
                    className="w-7 h-7 rounded-full bg-bg-tertiary object-cover border border-white/5"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png';
                    }}
                  />
                  <div>
                    <div className="text-xs font-bold text-white font-display leading-none">{pos.symbol}</div>
                    <div className="font-mono text-[10px] text-gray-500 mt-1">
                      {pos.balance.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono text-xs font-bold text-white">
                    ${pos.valueUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className={`font-mono text-[10px] font-bold mt-1 ${
                    isPositive ? 'text-accent-emerald' : 'text-accent-rose'
                  }`}>
                    {isPositive ? '▲' : '▼'} {pos.pnlPercent.toFixed(1)}% (+${pos.pnlUSD.toFixed(2)})
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
