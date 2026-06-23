'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { Wallet, LogOut, ArrowRight, User } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const { login, logout, ready, authenticated, user } = usePrivy();

  const getShortAddress = (address?: string) => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  // Get Solana wallet address if available
  const solanaWallet = user?.linkedAccounts?.find(
    (account) => account.type === 'wallet' && (account as any).chainType === 'solana'
  ) as { address?: string } | undefined;
  // Fallback to generic address if none found
  const walletAddress = solanaWallet?.address || user?.wallet?.address;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-border-primary px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <img
            src="/ChadWallet/logo/dark.png"
            alt="ChadWallet Logo"
            className="h-8 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
          />
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors duration-200 ${
              pathname === '/' ? 'text-white font-bold' : 'text-gray-400 hover:text-white'
            }`}
          >
            Home
          </Link>
          <Link
            href="/trade"
            className={`text-sm font-medium transition-colors duration-200 ${
              pathname.startsWith('/trade') ? 'text-white font-bold' : 'text-gray-400 hover:text-white'
            }`}
          >
            Trade
          </Link>
          <a
            href="https://apps.apple.com/us/app/chadwallet/id6757367474"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200"
          >
            iOS App
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=xyz.chadwallet.www"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200"
          >
            Android App
          </a>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {/* Start Trading button */}
        {pathname !== '/trade' && (
          <Link
            href="/trade"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-accent-indigo bg-accent-indigo/10 border border-accent-indigo/20 px-4 py-2.5 rounded-xl hover:bg-accent-indigo/20 hover:border-accent-indigo/35 transition-all duration-200"
          >
            Start Trading <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}

        {/* Privy Session handler */}
        {!ready ? (
          <div className="h-10 w-28 bg-white/5 rounded-xl animate-pulse" />
        ) : authenticated ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl text-sm font-medium text-white max-w-[160px] md:max-w-none">
              <User className="w-4 h-4 text-accent-indigo shrink-0" />
              <span className="truncate">
                {user?.email?.address || getShortAddress(walletAddress)}
              </span>
            </div>
            
            <button
              onClick={() => logout()}
              aria-label="Logout"
              className="p-2 bg-white/5 border border-white/10 hover:bg-accent-rose/10 hover:border-accent-rose/30 hover:text-accent-rose rounded-xl transition-all duration-200 text-gray-400"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => login()}
            className="flex items-center gap-2 bg-gradient-to-r from-accent-indigo to-accent-purple text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-accent-indigo/15 hover:shadow-lg hover:shadow-accent-indigo/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <Wallet className="w-4 h-4" />
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
}
