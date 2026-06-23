'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { TickerToken } from '../TickerBanner';
import { Settings, RefreshCw, AlertTriangle, ArrowDownUp, CheckCircle, Wallet } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SwapPanelProps {
  selectedToken: TickerToken;
  portfolio: Record<string, number>;
  onUpdatePortfolio: (tokenSymbol: string, amountChange: number, solChange: number) => void;
}

// Token decimal configuration on Solana
const TOKEN_DECIMALS: Record<string, number> = {
  SOL: 9,
  USDC: 6,
  WIF: 9,
  BONK: 5,
  POPCAT: 9,
  JUP: 6,
  PYTH: 6,
  MEW: 9,
  JTO: 9,
  BOME: 6
};

export default function SwapPanel({ selectedToken, portfolio, onUpdatePortfolio }: SwapPanelProps) {
  const { login, authenticated, ready } = usePrivy();
  const [tab, setTab] = useState<'buy' | 'sell'>('buy');
  const [payAmount, setPayAmount] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5);
  const [showSettings, setShowSettings] = useState(false);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [priceImpact, setPriceImpact] = useState<number | null>(null);
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapSuccess, setSwapSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const quoteTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Determine decimal points for input
  const payDecimals = tab === 'buy' ? 9 : (TOKEN_DECIMALS[selectedToken.symbol] || 9);
  const receiveDecimals = tab === 'buy' ? (TOKEN_DECIMALS[selectedToken.symbol] || 9) : 9;

  // Clear inputs on token swap
  useEffect(() => {
    setPayAmount('');
    setReceiveAmount('');
    setPriceImpact(null);
    setErrorMessage(null);
  }, [selectedToken.mint, tab]);

  // Fetch Jupiter Quote API dynamically
  const fetchQuote = async (amountStr: string) => {
    if (!amountStr || isNaN(parseFloat(amountStr)) || parseFloat(amountStr) <= 0) {
      setReceiveAmount('');
      setPriceImpact(null);
      return;
    }

    setLoadingQuote(true);
    setErrorMessage(null);
    
    try {
      const inputMint = tab === 'buy' ? 'So11111111111111111111111111111111111111112' : selectedToken.mint;
      const outputMint = tab === 'buy' ? selectedToken.mint : 'So11111111111111111111111111111111111111112';
      
      const parsedAmount = parseFloat(amountStr);
      const inputDecimals = tab === 'buy' ? 9 : (TOKEN_DECIMALS[selectedToken.symbol] || 9);
      
      // Calculate amount in raw lamports/fractional units
      const rawAmount = Math.floor(parsedAmount * Math.pow(10, inputDecimals));
      const slippageBps = Math.floor(slippage * 100);

      const res = await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${rawAmount}&slippageBps=${slippageBps}`
      );
      
      if (!res.ok) {
        throw new Error('Quote fetch failed');
      }

      const quote = await res.json();
      
      if (quote.outAmount) {
        const outDecimals = tab === 'buy' ? (TOKEN_DECIMALS[selectedToken.symbol] || 9) : 9;
        const outAmt = parseFloat(quote.outAmount) / Math.pow(10, outDecimals);
        setReceiveAmount(outAmt.toFixed(outDecimals > 6 ? 6 : outDecimals));
        
        if (quote.priceImpactPct) {
          setPriceImpact(parseFloat(quote.priceImpactPct));
        }
      }
    } catch (err) {
      // Fallback calculation using current ticker price if Jupiter fetch fails
      const parsedAmount = parseFloat(amountStr);
      let calculatedOutput = 0;
      if (tab === 'buy') {
        // Buy: SOL -> Token
        // Estimate token amount (we assume SOL price is ~$145 vs Token price)
        const solPrice = 145.00;
        const totalUSD = parsedAmount * solPrice;
        calculatedOutput = totalUSD / selectedToken.price;
      } else {
        // Sell: Token -> SOL
        const totalUSD = parsedAmount * selectedToken.price;
        calculatedOutput = totalUSD / 145.00;
      }
      setReceiveAmount(calculatedOutput.toFixed(6));
      setPriceImpact(0.12); // Simulated minimal impact
    } finally {
      setLoadingQuote(false);
    }
  };

  const handlePayAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      setPayAmount(val);
      
      if (quoteTimeoutRef.current) clearTimeout(quoteTimeoutRef.current);
      quoteTimeoutRef.current = setTimeout(() => {
        fetchQuote(val);
      }, 500);
    }
  };

  const handleHalf = () => {
    const currentBalance = tab === 'buy' ? portfolio['SOL'] : (portfolio[selectedToken.symbol] || 0);
    const amount = (currentBalance * 0.5).toFixed(4);
    setPayAmount(amount);
    fetchQuote(amount);
  };

  const handleMax = () => {
    const currentBalance = tab === 'buy' ? portfolio['SOL'] : (portfolio[selectedToken.symbol] || 0);
    // Keep a buffer for SOL gas fees
    const buffer = tab === 'buy' ? 0.01 : 0;
    const amount = Math.max(0, currentBalance - buffer).toFixed(4);
    setPayAmount(amount);
    fetchQuote(amount);
  };

  const executeSwap = async () => {
    if (!authenticated) {
      login();
      return;
    }

    const numericPay = parseFloat(payAmount);
    if (isNaN(numericPay) || numericPay <= 0) {
      setErrorMessage('Input a valid amount.');
      return;
    }

    const currentBalance = tab === 'buy' ? portfolio['SOL'] : (portfolio[selectedToken.symbol] || 0);
    if (numericPay > currentBalance) {
      setErrorMessage(`Insufficient ${tab === 'buy' ? 'SOL' : selectedToken.symbol} balance.`);
      return;
    }

    setIsSwapping(true);
    setErrorMessage(null);

    // Simulate blockchain latency (2s)
    setTimeout(() => {
      setIsSwapping(false);
      setSwapSuccess(true);
      
      // Update local wallet position
      const numericReceive = parseFloat(receiveAmount);
      if (tab === 'buy') {
        // Buy: -SOL, +Token
        onUpdatePortfolio(selectedToken.symbol, numericReceive, -numericPay);
      } else {
        // Sell: -Token, +SOL
        onUpdatePortfolio(selectedToken.symbol, -numericPay, numericReceive);
      }

      // Sparkly sound-free visual congratulations
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });

      // Hide success notification in 4 seconds
      setTimeout(() => {
        setSwapSuccess(false);
        setPayAmount('');
        setReceiveAmount('');
      }, 4000);
    }, 2000);
  };

  const currentPayBalance = tab === 'buy' ? portfolio['SOL'] : (portfolio[selectedToken.symbol] || 0);

  return (
    <div className="w-full bg-bg-secondary border border-border-primary rounded-2xl p-5 flex flex-col gap-4 relative">
      {/* Swap Card Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 p-0.5 bg-bg-primary rounded-xl border border-border-primary">
          <button
            onClick={() => setTab('buy')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
              tab === 'buy'
                ? 'bg-accent-emerald text-black shadow-sm shadow-accent-emerald/10'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Buy
          </button>
          
          <button
            onClick={() => setTab('sell')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
              tab === 'sell'
                ? 'bg-accent-rose text-white shadow-sm shadow-accent-rose/10'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sell
          </button>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowSettings(!showSettings)}
            aria-label="Settings"
            className={`p-2 rounded-xl border transition-colors ${
              showSettings 
                ? 'bg-accent-indigo/10 border-accent-indigo/30 text-accent-indigo' 
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Slippage Settings Dropdown */}
          {showSettings && (
            <div className="absolute right-0 mt-2.5 w-48 glass-panel border border-border-primary rounded-xl p-3 z-50 shadow-xl">
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2">
                Max Slippage
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[0.1, 0.5, 1.0, 3.0].map((val) => (
                  <button
                    key={val}
                    onClick={() => {
                      setSlippage(val);
                      setShowSettings(false);
                    }}
                    className={`py-1 rounded-lg text-[10px] font-mono font-bold transition-all border ${
                      slippage === val
                        ? 'bg-accent-indigo border-accent-indigo text-white'
                        : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    {val}%
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pay Panel */}
      <div className="bg-bg-primary/60 border border-border-primary rounded-xl p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-gray-400 select-none">
          <span className="font-bold">You Pay</span>
          <span className="font-mono">
            Balance: {currentPayBalance.toLocaleString(undefined, { maximumFractionDigits: 4 })}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <input
            type="text"
            placeholder="0.00"
            value={payAmount}
            onChange={handlePayAmountChange}
            className="flex-1 bg-transparent text-xl font-bold font-mono text-white placeholder-gray-600 focus:outline-none min-w-0"
          />
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleHalf}
              className="text-[9px] font-bold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-1 rounded-lg border border-white/5"
            >
              50%
            </button>
            <button
              onClick={handleMax}
              className="text-[9px] font-bold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-1 rounded-lg border border-white/5"
            >
              MAX
            </button>
            <span className="text-sm font-display font-black text-white px-1">
              {tab === 'buy' ? 'SOL' : selectedToken.symbol}
            </span>
          </div>
        </div>
      </div>

      {/* Direction Flip Icon */}
      <div className="flex justify-center -my-2 relative z-10 select-none">
        <div className="bg-bg-tertiary border border-border-primary rounded-xl p-2.5 text-gray-400 hover:text-white transition-colors cursor-pointer shadow-lg shadow-black/40">
          <ArrowDownUp className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Receive Panel */}
      <div className="bg-bg-primary/60 border border-border-primary rounded-xl p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-gray-400 select-none">
          <span className="font-bold">You Receive (Estimate)</span>
          <span className="font-mono">
            Balance: {(tab === 'buy' ? (portfolio[selectedToken.symbol] || 0) : portfolio['SOL']).toLocaleString(undefined, { maximumFractionDigits: 4 })}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <input
            type="text"
            placeholder="0.00"
            value={receiveAmount}
            readOnly
            className="flex-1 bg-transparent text-xl font-bold font-mono text-white/80 placeholder-gray-600 focus:outline-none min-w-0"
          />
          <div className="flex items-center gap-1">
            {loadingQuote && <RefreshCw className="w-3.5 h-3.5 animate-spin text-accent-indigo mr-1" />}
            <span className="text-sm font-display font-black text-white">
              {tab === 'buy' ? selectedToken.symbol : 'SOL'}
            </span>
          </div>
        </div>
      </div>

      {/* Quote Details */}
      {receiveAmount && (
        <div className="flex flex-col gap-1.5 p-3.5 bg-bg-primary/30 border border-border-primary rounded-xl text-xs font-mono select-none">
          <div className="flex justify-between">
            <span className="text-gray-500 font-bold">Exchange Rate</span>
            <span className="text-gray-300 font-semibold">
              1 SOL = {(145.00 / selectedToken.price).toLocaleString(undefined, { maximumFractionDigits: 2 })} {selectedToken.symbol}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500 font-bold">Price Impact</span>
            <span className={`font-semibold ${
              priceImpact && priceImpact > 2 ? 'text-accent-rose' : 'text-accent-emerald'
            }`}>
              {priceImpact !== null ? `${(priceImpact * 100).toFixed(2)}%` : '<0.01%'}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500 font-bold">Network Fee</span>
            <span className="text-accent-emerald font-extrabold uppercase">Free (Gasless)</span>
          </div>
        </div>
      )}

      {/* Success Banner */}
      {swapSuccess && (
        <div className="bg-accent-emerald/10 border border-accent-emerald/20 p-3 rounded-xl flex items-center gap-2.5 text-xs text-white">
          <CheckCircle className="w-4 h-4 text-accent-emerald shrink-0" />
          <div>
            <div className="font-bold">Swap Completed Successfully!</div>
            <div className="text-[10px] text-gray-400 mt-0.5 font-mono">
              Balances updated in sandbox account.
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-accent-rose/10 border border-accent-rose/25 p-3 rounded-xl flex items-center gap-2.5 text-xs text-accent-rose font-mono">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Action Action Button */}
      {!ready ? (
        <div className="w-full h-12 bg-white/5 rounded-xl animate-pulse" />
      ) : !authenticated ? (
        <button
          onClick={() => login()}
          className="w-full py-3.5 bg-gradient-to-r from-accent-indigo to-accent-purple text-white font-bold rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md shadow-accent-indigo/15 flex items-center justify-center gap-2"
        >
          <Wallet className="w-4 h-4" />
          Connect Wallet to Trade
        </button>
      ) : (
        <button
          onClick={executeSwap}
          disabled={isSwapping || !payAmount}
          className={`w-full py-3.5 font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 ${
            isSwapping 
              ? 'bg-bg-tertiary text-gray-500 cursor-not-allowed' 
              : !payAmount 
                ? 'bg-white/5 border border-white/5 text-gray-500 cursor-not-allowed shadow-none'
                : tab === 'buy'
                  ? 'bg-accent-emerald text-black shadow-accent-emerald/10 hover:scale-[1.01] active:scale-[0.99]'
                  : 'bg-accent-rose text-white shadow-accent-rose/10 hover:scale-[1.01] active:scale-[0.99]'
          }`}
        >
          {isSwapping && <RefreshCw className="w-4 h-4 animate-spin" />}
          {isSwapping 
            ? 'Submitting transaction...' 
            : !payAmount 
              ? 'Input swap amount' 
              : tab === 'buy' 
                ? `Swap SOL to ${selectedToken.symbol}` 
                : `Swap ${selectedToken.symbol} to SOL`}
        </button>
      )}
    </div>
  );
}
