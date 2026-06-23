'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { ArrowRight, Flame, Users, Bell, Zap, Apple, Play, Heart, X, Star, RotateCcw } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const SHOWCASE_CARDS = [
  {
    id: 1,
    title: '1. App Launch Screen',
    desc: 'Clean, modern, and immediate entry into the world of Solana trading.',
    image: '/ChadWallet/app store/launch.png',
    color: 'accent-indigo',
    shadowColor: 'rgba(99, 102, 241, 0.25)'
  },
  {
    id: 2,
    title: '2. Token Discoveries',
    desc: 'Access real-time feeds of new trending meme coins and pump.fun tokens.',
    image: '/ChadWallet/app store/discover.png',
    color: 'accent-purple',
    shadowColor: 'rgba(168, 85, 247, 0.25)'
  },
  {
    id: 3,
    title: '3. Follow KOL Profiles',
    desc: 'Spy on top performing chads and replicate their winning portfolios.',
    image: '/ChadWallet/app store/kol.png',
    color: 'accent-pink',
    shadowColor: 'rgba(236, 72, 153, 0.25)'
  },
  {
    id: 4,
    title: '4. Quick Deposits',
    desc: 'Fund your secure Privy-custodied wallet in seconds via direct Solana transfer.',
    image: '/ChadWallet/app store/deposit.png',
    color: 'accent-emerald',
    shadowColor: 'rgba(16, 185, 129, 0.25)'
  },
  {
    id: 5,
    title: '5. Deep Search',
    desc: 'Search any token mint address, ticker name, or profile handles instantly.',
    image: '/ChadWallet/app store/search.png',
    color: 'accent-indigo',
    shadowColor: 'rgba(99, 102, 241, 0.25)'
  },
  {
    id: 6,
    title: '6. Portfolio Performance',
    desc: 'Track active holdings, percentage gains, and detailed historical logs.',
    image: '/ChadWallet/app store/portfolio.png',
    color: 'accent-purple',
    shadowColor: 'rgba(168, 85, 247, 0.25)'
  },
  {
    id: 7,
    title: '7. Token Performance',
    desc: 'Analyze price curves, transaction volume, and holder metrics before buying.',
    image: '/ChadWallet/app store/token.png',
    color: 'accent-pink',
    shadowColor: 'rgba(236, 72, 153, 0.25)'
  }
];

const FLOW_STEPS = [
  {
    id: 0,
    title: '1. Secure Privy Onboarding',
    desc: 'Sign up with Google or Apple in 5 seconds. Privy generates your self-custodial key using advanced Multi-Party Computation (MPC).',
    image: '/ChadWallet/flow/launch-4.png',
    icon: Zap
  },
  {
    id: 1,
    title: '2. Spot Trending Gems',
    desc: 'Monitor trading frequencies, price curves, and hot momentum listings live on the meme dashboard.',
    image: '/ChadWallet/flow/memecoin-4.png',
    icon: Flame
  },
  {
    id: 2,
    title: '3. Track Smart Money',
    desc: 'Follow public wallets of high-tier traders. Review allocations, exact entry points, and active theses.',
    image: '/ChadWallet/flow/kol-4.png',
    icon: Users
  },
  {
    id: 3,
    title: '4. High-Speed Swapping',
    desc: 'Swap Solana assets inside the wallet. Backed by Jupiter routing to get you zero-slippage execution.',
    image: '/ChadWallet/flow/buy-sell-4.png',
    icon: Zap
  },
  {
    id: 4,
    title: '5. Real-Time Portfolio PnL',
    desc: 'Get immediate visual logs on holding assets, percentage change, and transaction histories.',
    image: '/ChadWallet/flow/portfolio-4.png',
    icon: Bell
  },
  {
    id: 5,
    title: '6. Reinvest & Re-swipe',
    desc: 'Recycle wins into hot tokens or replicate next-gen trader profile actions in one tap.',
    image: '/ChadWallet/flow/relaunch-4.png',
    icon: RotateCcw
  }
];
const FLOW_SLIDER_CARDS = [
  {
    id: 1,
    title: '1. Secure Wallet Launch',
    desc: 'Self-custodial onboarding using Privy MPC. No seed phrase complexes.',
    image: '/ChadWallet/flow/launch-4.png'
  },
  {
    id: 2,
    title: '2. Spot Meme Gems',
    desc: 'Review volume pumps, hot momentum charts, and live coin transactions.',
    image: '/ChadWallet/flow/memecoin-4.png'
  },
  {
    id: 3,
    title: '3. Follow Smart Traders',
    desc: 'Trace KOL wallet activities, portfolios, and historical PnL logs.',
    image: '/ChadWallet/flow/kol-4.png'
  },
  {
    id: 4,
    title: '4. Instant Solana Swaps',
    desc: 'Trade with millisecond latency using optimized Jupiter routing.',
    image: '/ChadWallet/flow/buy-sell-4.png'
  },
  {
    id: 5,
    title: '5. Detailed Portfolio Logs',
    desc: 'Analyze active positions, weight distributions, and aggregate returns.',
    image: '/ChadWallet/flow/portfolio-4.png'
  },
  {
    id: 6,
    title: '6. Recopy & Scale Up',
    desc: 'Instantly recycle your winnings and scale up your copy-trading actions.',
    image: '/ChadWallet/flow/relaunch-4.png'
  }
];
const MOCK_FEED = [
  {
    user: 'DegenChad_69',
    action: 'bought',
    amount: '18.4 SOL',
    token: '$WIF',
    thesis: 'Breakout above $2.10 resistance. Easy 2x from here.',
    time: '2m ago',
    avatar: '🔋'
  },
  {
    user: 'SolanaWhale',
    action: 'bought',
    amount: '120.0 SOL',
    token: '$POPCAT',
    thesis: 'Accumulating at support level. Volume is ticking up.',
    time: '5m ago',
    avatar: '🐳'
  },
  {
    user: 'Bonk_Billionaire',
    action: 'sold',
    amount: '35.0 SOL',
    token: '$BONK',
    thesis: 'Taking profits. Rotating into low-caps.',
    time: '12m ago',
    avatar: '🐕'
  }
];

const MOCK_LEADERBOARD = [
  { rank: 1, name: 'AnsemSlayer', pnl: '+4,821.4%', volume: '$2.4M', avatar: '👑' },
  { rank: 2, name: 'GigaChad_SOL', pnl: '+3,114.8%', volume: '$1.8M', avatar: '💪' },
  { rank: 3, name: 'MemeLord', pnl: '+2,489.1%', volume: '$950K', avatar: '🐸' },
  { rank: 4, name: 'PumpDotFun_Enjoyer', pnl: '+1,902.5%', volume: '$1.2M', avatar: '💊' }
];

export default function LandingPage() {
  const { login, authenticated } = usePrivy();
  const [feed, setFeed] = useState(MOCK_FEED);

  // Floating Screenshots State for Hero Background
  const [floatingImages, setFloatingImages] = useState([
    '/ChadWallet/app store/launch.png',
    '/ChadWallet/app store/discover.png',
    '/ChadWallet/app store/kol.png',
    '/ChadWallet/app store/portfolio.png',
    '/ChadWallet/app store/search.png'
  ]);

  // Stepper Walkthrough State
  const [activeFlowStep, setActiveFlowStep] = useState(0);

  // Active Hero Mockup Image State (Visible on the right side)
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  // Auto-scroll ref for flow slider
  const sliderRef = useRef<HTMLDivElement>(null);

  // Interval to change background screenshots haphazardly
  useEffect(() => {
    const availableImages = [
      '/ChadWallet/app store/launch.png',
      '/ChadWallet/app store/discover.png',
      '/ChadWallet/app store/kol.png',
      '/ChadWallet/app store/portfolio.png',
      '/ChadWallet/app store/search.png',
      '/ChadWallet/app store/deposit.png',
      '/ChadWallet/app store/token.png'
    ];

    const interval = setInterval(() => {
      const randomSlot = Math.floor(Math.random() * 5);
      const randomImg = availableImages[Math.floor(Math.random() * availableImages.length)];
      setFloatingImages(prev => {
        const next = [...prev];
        next[randomSlot] = randomImg;
        return next;
      });
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  // Interval to rotate the main mockup screenshot on the right side
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHeroIndex(prev => (prev + 1) % SHOWCASE_CARDS.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll interval for the flow screenshots slider
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const scrollInterval = setInterval(() => {
      if (!slider) return;
      const maxScroll = slider.scrollWidth - slider.clientWidth;
      if (slider.scrollLeft >= maxScroll - 10) {
        slider.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        slider.scrollBy({ left: 320, behavior: 'smooth' });
      }
    }, 3200);

    return () => clearInterval(scrollInterval);
  }, []);

  useEffect(() => {
    async function fetchFeed() {
      const client = supabase;
      if (!client) return;
      try {
        const { data, error } = await client
          .from('trade_feed')
          .select('*, profiles(username, avatar_url)')
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;

        if (data && data.length > 0) {
          setFeed(data.map((item: any) => ({
            user: item.profiles?.username || item.user_id.slice(0, 8),
            action: item.type === 'buy' ? 'bought' : 'sold',
            amount: `${item.usd_value} USD`,
            token: `$${item.token_symbol}`,
            thesis: item.thesis || 'Riding the trend.',
            time: 'Just now',
            avatar: item.profiles?.avatar_url || '🔋'
          })));
        }
      } catch (err) {
        console.warn('Supabase query failed, falling back to mock feed:', err);
      }
    }
    fetchFeed();
  }, []);

  return (
    <div className="flex-1 w-full flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full max-w-7xl px-6 pt-5 pb-24 md:pb-36 flex flex-col lg:flex-row items-center justify-between gap-12 min-h-[640px]">

        {/* Left content column */}
        <div className="flex-1 flex flex-col items-start text-left z-10 max-w-2xl relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-indigo/10 border border-accent-indigo/25 text-accent-indigo text-xs font-bold uppercase tracking-wider mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <Flame className="w-3.5 h-3.5 animate-pulse" /> Social Crypto Trading
          </div>

          <h1 className="font-display font-black text-5xl md:text-7xl tracking-tighter text-white leading-[1.05] mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Where chads <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-indigo via-accent-purple to-accent-pink animate-text-gradient">
              print alpha.
            </span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed mb-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            The ultimate social-first meme coin wallet and trading terminal on Solana. Swap any token in seconds, follow top-performing traders, and copy-trade the legends.
          </p>

          <div className="flex flex-wrap gap-4 w-full sm:w-auto mb-10">
            {authenticated ? (
              <Link
                href="/trade"
                className="btn-premium flex items-center justify-center gap-2 w-full sm:w-auto text-white px-8 py-4 rounded-2xl text-base font-bold group animate-slide-up" style={{ animationDelay: '0.4s' }}
              >
                Enter Trading Terminal
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            ) : (
              <button
                onClick={() => login()}
                className="btn-premium flex items-center justify-center gap-2 w-full sm:w-auto text-white px-8 py-4 rounded-2xl text-base font-bold group animate-slide-up" style={{ animationDelay: '0.4s' }}
              >
                Connect & Start Swapping
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            )}

            <Link
              href="/trade"
              className="flex items-center justify-center gap-2 w-full sm:w-auto bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white px-8 py-4 rounded-2xl text-base font-bold transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.5s' }}
            >
              Browse Terminal
            </Link>
          </div>

          {/* App download link badges */}
          <div className="flex flex-wrap gap-4 items-center animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <a
              href="https://apps.apple.com/us/app/chadwallet/id6757367474"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-black hover:bg-neutral-900 border border-white/10 px-5 py-2.5 rounded-xl transition-all duration-300 hover:scale-[1.03] hover:border-white/20 hover:shadow-lg hover:shadow-white/5"
            >
              <Apple className="w-6 h-6 text-white" />
              <div className="text-left select-none">
                <div className="text-[10px] text-gray-400 font-bold uppercase leading-none">Download on the</div>
                <div className="text-sm text-white font-extrabold leading-tight">App Store</div>
              </div>
            </a>

            <a
              href="https://play.google.com/store/details?id=xyz.chadwallet.www"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-black hover:bg-neutral-900 border border-white/10 px-5 py-2.5 rounded-xl transition-all duration-300 hover:scale-[1.03] hover:border-white/20 hover:shadow-lg hover:shadow-white/5"
            >
              <Play className="w-6 h-6 text-white fill-white" />
              <div className="text-left select-none">
                <div className="text-[10px] text-gray-400 font-bold uppercase leading-none">Get it on</div>
                <div className="text-sm text-white font-extrabold leading-tight">Google Play</div>
              </div>
            </a>
          </div>
        </div>

        {/* Right mockup column: Displays a Tinder card stack with scattered shadow cards around it */}
        <div className="flex-1 w-full lg:w-[480px] flex flex-col items-center justify-center relative z-10 lg:pl-12 animate-slide-up mt-12 lg:mt-0" style={{ animationDelay: '0.6s' }}>

          {/* Container for the scattered satellite cards and center stack */}
          <div className="relative w-[340px] h-[520px] flex items-center justify-center">

            {/* Ambient behind-glow */}
            <div className="absolute -inset-16 bg-gradient-to-r from-accent-indigo/25 via-accent-purple/25 to-accent-pink/25 rounded-full opacity-40 blur-[100px] -z-10 animate-blob" />

            {/* RENDER ALL CARDS IN DYNAMIC SLOTS FOR SMOOTH TRANSITIONS */}
            {SHOWCASE_CARDS.map((card, idx) => {
              // Calculate relative index from activeHeroIndex (0 means active/featured)
              const relativeIndex = (idx - activeHeroIndex + SHOWCASE_CARDS.length) % SHOWCASE_CARDS.length;

              // Base class details
              let cardStyle: React.CSSProperties = {};
              let containerClass = "absolute transition-all duration-700 ease-in-out select-none ";
              let isSatellite = false;
              let satelliteIndex = 0;

              if (relativeIndex === 0) {
                // Card 1: Active (Top Featured Card)
                cardStyle = {
                  transform: 'translate3d(0, 0, 0) rotate(0deg) scale(1)',
                  opacity: 1,
                  zIndex: 30,
                  width: '235px',
                  height: '480px',
                };
                containerClass += "bg-black border-[8px] border-neutral-900 rounded-[42px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.9),0_0_30px_rgba(99,102,241,0.25)] overflow-hidden cursor-default";
              } else if (relativeIndex === 1) {
                // Card 2: Behind (Middle Shadow Card)
                cardStyle = {
                  transform: 'translate3d(6px, 8px, 0) rotate(3deg) scale(0.94)',
                  opacity: 0.75,
                  zIndex: 20,
                  width: '235px',
                  height: '480px',
                };
                containerClass += "bg-black border-[7px] border-neutral-900 rounded-[40px] shadow-[0_15px_35px_rgba(0,0,0,0.9)] overflow-hidden cursor-pointer hover:opacity-90";
              } else if (relativeIndex === 2) {
                // Card 3: Further Behind (Lowest Shadow Card)
                cardStyle = {
                  transform: 'translate3d(12px, 16px, 0) rotate(6deg) scale(0.88)',
                  opacity: 0.45,
                  zIndex: 10,
                  width: '235px',
                  height: '480px',
                };
                containerClass += "bg-black border-[6px] border-neutral-900 rounded-[38px] shadow-[0_10px_25px_rgba(0,0,0,0.9)] overflow-hidden cursor-pointer hover:opacity-75";
              } else {
                // Satellite positions for indices 3, 4, 5, 6
                isSatellite = true;
                satelliteIndex = relativeIndex - 3; // 0, 1, 2, 3

                if (satelliteIndex === 0) {
                  // Satellite 1: Top-Left
                  cardStyle = {
                    transform: 'translate3d(-108px, -45px, 0) rotate(-15deg) scale(0.51)',
                    opacity: 0.35,
                    zIndex: 5,
                    width: '235px',
                    height: '480px',
                  };
                } else if (satelliteIndex === 1) {
                  // Satellite 2: Bottom-Left
                  cardStyle = {
                    transform: 'translate3d(-118px, 75px, 0) rotate(8deg) scale(0.48)',
                    opacity: 0.25,
                    zIndex: 5,
                    width: '235px',
                    height: '480px',
                  };
                } else if (satelliteIndex === 2) {
                  // Satellite 3: Top-Right
                  cardStyle = {
                    transform: 'translate3d(112px, -35px, 0) rotate(12deg) scale(0.49)',
                    opacity: 0.3,
                    zIndex: 5,
                    width: '235px',
                    height: '480px',
                  };
                } else {
                  // Satellite 4: Bottom-Right
                  cardStyle = {
                    transform: 'translate3d(118px, 60px, 0) rotate(-10deg) scale(0.51)',
                    opacity: 0.35,
                    zIndex: 5,
                    width: '235px',
                    height: '480px',
                  };
                }
                containerClass += "bg-black border-[5px] border-neutral-900 rounded-[36px] shadow-[0_12px_24px_rgba(0,0,0,0.8)] overflow-hidden cursor-pointer hover:opacity-90 hover:scale-[1.05] hover:shadow-[0_0_20px_rgba(99,102,241,0.25)] group";
              }

              return (
                <div
                  key={card.id}
                  onClick={() => {
                    if (relativeIndex !== 0) setActiveHeroIndex(idx);
                  }}
                  style={cardStyle}
                  className={containerClass}
                >
                  {/* Dynamic Island and Status Bar only on Top Card */}
                  {relativeIndex === 0 && (
                    <>
                      {/* Dynamic Island Notch */}
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full z-30 flex items-center justify-between px-2">
                        <div className="w-1 h-1 rounded-full bg-[#222]" />
                        <div className="w-1 h-1 rounded-full bg-[#222]" />
                      </div>

                      {/* Status Bar */}
                      <div className="absolute top-0 left-0 right-0 h-8 bg-transparent z-25 flex items-center justify-between px-4 pt-1 text-[8px] text-white font-bold select-none drop-shadow">
                        <span>9:41</span>
                        <div className="flex items-center gap-1">
                          <span>5G</span>
                          <div className="w-3.5 h-1.5 border border-white/80 rounded-[3px]" />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Image Frame */}
                  <div className="w-full h-full bg-neutral-950 overflow-hidden relative p-0.5">
                    <img
                      src={card.image}
                      className={`w-full h-full object-cover rounded-[30px] transition-all duration-700 ${relativeIndex !== 0 ? 'filter brightness-75 contrast-95' : ''
                        }`}
                      alt={card.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none rounded-[30px]" />
                  </div>
                </div>
              );
            })}

          </div>

          {/* ACTIVE SCREEN DETAILS CARD (Explains "what it is" clearly below the stack) */}
          <div className="mt-8 bg-neutral-900/80 border border-white/10 backdrop-blur-md rounded-2xl p-4 w-[280px] shadow-xl text-left transition-all duration-300 relative z-40">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-accent-indigo">
                {SHOWCASE_CARDS[activeHeroIndex].title.split('.')[0]}. App Preview
              </span>
              <span className="text-[10px] text-gray-500 font-bold font-mono">
                {activeHeroIndex + 1} / {SHOWCASE_CARDS.length}
              </span>
            </div>
            <h4 className="text-white font-extrabold text-sm mb-1">
              {SHOWCASE_CARDS[activeHeroIndex].title.split('. ').slice(1).join('. ') || SHOWCASE_CARDS[activeHeroIndex].title}
            </h4>
            <p className="text-gray-400 text-[11px] leading-relaxed mb-3">
              {SHOWCASE_CARDS[activeHeroIndex].desc}
            </p>
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5">
              <div className="flex gap-1">
                {SHOWCASE_CARDS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveHeroIndex(idx)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === activeHeroIndex ? 'bg-accent-indigo w-3.5' : 'bg-white/20'
                      }`}
                  />
                ))}
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setActiveHeroIndex(prev => (prev - 1 + SHOWCASE_CARDS.length) % SHOWCASE_CARDS.length)}
                  className="w-6 h-6 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold transition-all"
                  aria-label="Previous preview"
                >
                  ←
                </button>
                <button
                  onClick={() => setActiveHeroIndex(prev => (prev + 1) % SHOWCASE_CARDS.length)}
                  className="w-6 h-6 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold transition-all"
                  aria-label="Next preview"
                >
                  →
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* App Showcase Gallery Section - Refactored as Flow Slider Full Pic */}
      <section className="w-full border-t border-border-primary py-24 bg-bg-secondary/15 relative overflow-hidden flex flex-col items-center">
        {/* Glow behind */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-accent-purple/5 blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-6 w-full flex flex-col items-center">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-accent-purple text-xs font-bold uppercase tracking-wider mb-4">
              ✨ The Degen Walkthrough Flow
            </div>
            <h2 className="font-display font-black text-4xl md:text-5xl tracking-tighter text-white mb-4">
              Full App Feature Screenshots
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto font-medium">
              Scroll through the high-fidelity client screens tracking smart wallets, discover tokens, and swap Solana.
            </p>
          </div>

          {/* Horizontal Slider Track showing Full Pictures */}
          <div ref={sliderRef} className="flex gap-8 overflow-x-auto pb-12 pt-6 px-4 w-full hide-scrollbar snap-x snap-mandatory scroll-smooth animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {FLOW_SLIDER_CARDS.map((card) => (
              <div key={card.id} className="flex-none w-[340px] md:w-[480px] snap-center flex flex-col gap-4 group">
                <div className="relative aspect-[16/10] w-full rounded-[24px] overflow-hidden bg-neutral-900 border border-white/5 shadow-2xl group-hover:border-accent-indigo/40 group-hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] transition-all duration-500">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-contain p-2"
                  />
                  {/* reflection overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/2 to-white/5 pointer-events-none" />
                </div>
                <div className="px-2 text-center">
                  <h4 className="text-white font-bold text-base md:text-lg mb-1 font-display group-hover:text-accent-indigo transition-colors">{card.title}</h4>
                  <p className="text-gray-400 text-xs md:text-sm leading-relaxed font-medium">
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive App Flowchart Stepper */}
      <section className="w-full border-t border-border-primary py-24 bg-neutral-950/20 relative overflow-hidden flex flex-col items-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-accent-indigo/5 blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-6 w-full flex flex-col items-center">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-indigo/10 border border-accent-indigo/25 text-accent-indigo text-xs font-bold uppercase tracking-wider mb-4">
              🔄 The Degen Lifecycle
            </div>
            <h2 className="font-display font-black text-4xl md:text-5xl tracking-tighter text-white mb-4">
              The ChadWallet Interaction Flow
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto font-medium">
              Click or hover through the steps below to trace exactly how the mobile client handles onboarding, swapping, tracking, and executing Solana trades.
            </p>
          </div>

          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Stepper Steps (Left Column) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {FLOW_STEPS.map((step) => {
                const IconComponent = step.icon;
                const isActive = activeFlowStep === step.id;
                return (
                  <div
                    key={step.id}
                    onClick={() => setActiveFlowStep(step.id)}
                    onMouseEnter={() => setActiveFlowStep(step.id)}
                    className={`p-6 rounded-[24px] border transition-all duration-300 cursor-pointer flex gap-4 items-start ${isActive
                      ? 'bg-white/5 border-accent-indigo/40 shadow-[0_0_30px_rgba(99,102,241,0.1)]'
                      : 'bg-transparent border-transparent hover:bg-white/3'
                      }`}
                  >
                    <div className={`p-3 rounded-xl shrink-0 ${isActive ? 'bg-accent-indigo/15 text-accent-indigo' : 'bg-white/5 text-gray-400'
                      }`}>
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <div className="text-left">
                      <h4 className={`font-display font-bold text-lg mb-1 transition-colors ${isActive ? 'text-white' : 'text-gray-400'
                        }`}>
                        {step.title}
                      </h4>
                      <p className={`text-sm leading-relaxed transition-colors ${isActive ? 'text-gray-300 font-medium' : 'text-gray-400'
                        }`}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Smartphone Display Mockup (Right Column) - Now plays video */}
            <div className="lg:col-span-5 w-full flex justify-center relative">
              {/* Ambient Glow */}
              <div className="absolute -inset-10 bg-gradient-to-r from-accent-indigo/25 to-accent-purple/25 rounded-[60px] opacity-40 blur-[80px] -z-10 animate-blob" />

              <div className="relative w-[300px] h-[600px] bg-black border-[10px] border-neutral-900 rounded-[50px] shadow-2xl overflow-hidden ring-1 ring-white/10">
                {/* Dynamic Island */}
                <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-20 flex items-center justify-between px-3">
                  <div className="w-2 h-2 rounded-full bg-[#111]" />
                  <div className="w-2 h-2 rounded-full bg-[#111]" />
                </div>

                {/* Video Mockup Display */}
                <div className="w-full h-full bg-neutral-950 overflow-hidden relative">
                  <video
                    src="/ChadWallet/video/chadwallet.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover scale-[1.01]"
                  />

                  {/* Status Bar */}
                  <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-black/85 to-transparent z-25 flex items-end justify-between px-6 pb-1 text-[10px] text-white/80 font-bold font-sans">
                    <span>9:41</span>
                    <div className="flex items-center gap-1">
                      <span>5G</span>
                      <div className="w-4 h-2 border border-white/40 rounded-xs" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section - Upgraded UI */}
      <section className="w-full max-w-7xl px-6 py-24 border-t border-border-primary relative overflow-hidden">
        {/* Glow meshes background */}
        <div className="absolute -top-12 left-1/4 w-[350px] h-[350px] rounded-full bg-accent-indigo/5 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-12 right-1/4 w-[350px] h-[350px] rounded-full bg-accent-purple/5 blur-[100px] pointer-events-none" />

        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-emerald/10 border border-accent-emerald/25 text-accent-emerald text-xs font-bold uppercase tracking-wider mb-4 animate-pulse">
            🚀 Elite Core Features
          </div>
          <h2 className="font-display font-black text-4xl md:text-5xl tracking-tighter text-white mb-4">
            Never miss out again.
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto font-medium">
            Discover the only Solana ecosystem client built with social integration and extreme transaction speed.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card 1: Leaderboard */}
          <div className="glass-panel glass-panel-hover p-8 rounded-[36px] flex flex-col gap-6 h-auto lg:h-[480px] min-h-[480px] hover:border-accent-indigo/35 transition-all relative overflow-hidden group shadow-lg">
            {/* Corner blur light */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent-indigo/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-center justify-between">
              <div>
                <div className="text-accent-indigo font-mono text-[11px] font-bold uppercase tracking-wider mb-1">
                  Leaderboard
                </div>
                <h3 className="text-2xl font-black tracking-tight text-white font-display">
                  Top Performing Chads
                </h3>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-accent-indigo/10 border border-accent-indigo/20 flex items-center justify-center text-accent-indigo shadow-inner group-hover:scale-105 transition-transform duration-300">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between pt-2">
              <div className="flex flex-col gap-3">
                {MOCK_LEADERBOARD.map((item) => (
                  <div key={item.rank} className="flex items-center justify-between p-3.5 bg-white/5 rounded-2xl border border-white/5 hover:border-accent-indigo/20 hover:bg-white/8 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 flex items-center justify-center text-xs font-bold font-mono rounded-full ${item.rank === 1 ? 'bg-yellow-500/20 text-yellow-500' :
                        item.rank === 2 ? 'bg-slate-300/20 text-slate-300' :
                          item.rank === 3 ? 'bg-amber-700/20 text-amber-700' : 'bg-white/5 text-gray-400'
                        }`}>
                        {item.rank}
                      </span>
                      <span className="text-lg">{item.avatar}</span>
                      <span className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-accent-emerald text-sm font-extrabold font-mono">{item.pnl}</div>
                      <div className="text-[10px] text-gray-400 font-mono">Vol: {item.volume}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-[10px] text-gray-500 text-center font-bold font-mono uppercase tracking-wider mt-4">
                🔥 Leaderboard positions reset daily
              </div>
            </div>
          </div>

          {/* Card 2: Live Trade Feed */}
          <div className="glass-panel glass-panel-hover p-8 rounded-[36px] flex flex-col gap-6 h-auto lg:h-[480px] min-h-[480px] hover:border-accent-purple/35 transition-all relative overflow-hidden group shadow-lg">
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent-purple/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-center justify-between">
              <div>
                <div className="text-accent-purple font-mono text-[11px] font-bold uppercase tracking-wider mb-1">
                  Feed
                </div>
                <h3 className="text-2xl font-black tracking-tight text-white font-display">
                  Discover Top Trades
                </h3>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center text-accent-purple shadow-inner group-hover:scale-105 transition-transform duration-300">
                <Flame className="w-5 h-5" />
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between pt-2">
              <div className="flex flex-col gap-3.5">
                {feed.map((feed, idx) => (
                  <div key={idx} className="flex flex-col gap-2.5 p-3.5 bg-white/5 rounded-2xl border border-white/5 hover:border-accent-purple/20 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{feed.avatar}</span>
                        <span className="text-xs font-bold text-white">{feed.user}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wide font-mono ${feed.action === 'bought' ? 'bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/20' : 'bg-accent-rose/10 text-accent-rose border border-accent-rose/20'
                          }`}>
                          {feed.action}
                        </span>
                        <span className="text-[9px] text-gray-400 font-mono font-medium">{feed.time}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-200 font-bold font-mono">
                      {feed.action === 'bought' ? 'Acquired' : 'Disposed'} {feed.amount} of {feed.token}
                    </p>
                    <p className="text-[11px] text-gray-400 italic">
                      "{feed.thesis}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: Push Notifications & Zero Complexity */}
          <div className="glass-panel glass-panel-hover p-8 rounded-[36px] flex flex-col gap-6 h-auto lg:h-[480px] min-h-[480px] hover:border-accent-pink/35 transition-all relative overflow-hidden group shadow-lg">
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent-pink/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-center justify-between">
              <div>
                <div className="text-accent-pink font-mono text-[11px] font-bold uppercase tracking-wider mb-1">
                  Security & Speed
                </div>
                <h3 className="text-2xl font-black tracking-tight text-white font-display">
                  Instant Web3 Access
                </h3>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-accent-pink/10 border border-accent-pink/20 flex items-center justify-center text-accent-pink shadow-inner group-hover:scale-105 transition-transform duration-300">
                <Zap className="w-5 h-5" />
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between pt-2">
              <div className="flex flex-col gap-5">
                <div className="flex gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center text-accent-purple shadow-sm">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm mb-0.5">Whale Alerts</h4>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Receive immediate visual push notifications on large transaction blocks moving through Solana DEXes.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-accent-pink/10 border border-accent-pink/20 flex items-center justify-center text-accent-pink shadow-sm">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm mb-0.5">Zero Complexities</h4>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Gasless transaction flows. No complex seed phrases to copy or private keys to expose.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-accent-emerald/10 border border-accent-emerald/20 flex items-center justify-center text-accent-emerald shadow-sm">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm mb-0.5">Privy MPC Client</h4>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Sign in directly with Google or Apple. Privy secures your keys automatically using Multi-Party Computation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/trade"
                  className="flex items-center justify-center gap-1.5 w-full bg-accent-pink/10 border border-accent-pink/20 text-accent-pink font-bold text-xs py-3 rounded-2xl hover:bg-accent-pink/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 shadow-sm"
                >
                  View Live Features <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic CTA Banner */}
      <section className="w-full max-w-5xl px-6 py-16 mb-24 relative z-10">
        <div className="w-full bg-gradient-to-r from-accent-indigo/20 via-accent-purple/20 to-accent-pink/10 border border-white/10 rounded-[32px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-md text-center md:text-left">
            <h2 className="font-display font-black text-3xl text-white mb-3">
              Ready to trade like a chad?
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Create an account in less than 10 seconds. Deposit Solana, pick trending tokens, and start printing alpha.
            </p>
          </div>

          <button
            onClick={() => login()}
            className="btn-premium text-white px-10 py-5 rounded-2xl text-lg shrink-0 font-bold tracking-wide"
          >
            Connect Wallet Now
          </button>
        </div>
      </section>
    </div>
  );
}
