'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { Wallet, LogOut, ArrowRight, User, Menu, X } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const { login, logout, ready, authenticated, user } = usePrivy();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const NavLinks = () => (
    <>
      <Link
        href="/"
        onClick={() => setIsMobileMenuOpen(false)}
        className={`text-sm font-medium transition-colors duration-200 ${
          pathname === '/' ? 'text-white font-bold' : 'text-gray-400 hover:text-white'
        }`}
      >
        Home
      </Link>
      <Link
        href="/trade"
        onClick={() => setIsMobileMenuOpen(false)}
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
    </>
  );

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-border-primary px-4 md:px-6 py-4 flex flex-col justify-center bg-bg-primary/90 backdrop-blur-md">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <img
              src="/ChadWallet/logo/dark.png"
              alt="ChadWallet Logo"
              className="h-7 sm:h-8 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <NavLinks />
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Start Trading button - Always visible on desktop, hidden on small mobile but in menu */}
          {pathname !== '/trade' && (
            <Link
              href="/trade"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-accent-indigo bg-accent-indigo/10 border border-accent-indigo/20 px-4 py-2.5 rounded-xl hover:bg-accent-indigo/20 hover:border-accent-indigo/35 transition-all duration-200"
            >
              Start Trading <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}

          {/* Privy Session handler */}
          {!ready ? null : authenticated ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-white max-w-[120px] sm:max-w-[160px]">
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent-indigo shrink-0" />
                <span className="truncate">
                  {user?.email?.address || getShortAddress(walletAddress)}
                </span>
              </div>
              
              <button
                onClick={() => logout()}
                aria-label="Logout"
                className="p-2 hidden sm:flex bg-white/5 border border-white/10 hover:bg-accent-rose/10 hover:border-accent-rose/30 hover:text-accent-rose rounded-xl transition-all duration-200 text-gray-400"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => login()}
              className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-accent-indigo to-accent-purple text-white px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-accent-indigo/15 hover:shadow-lg hover:shadow-accent-indigo/30 transition-all duration-200"
            >
              <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Connect
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-colors ml-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden flex flex-col gap-4 pt-6 pb-2 w-full animate-slide-up">
          <nav className="flex flex-col gap-4">
            <NavLinks />
            
            {pathname !== '/trade' && (
              <Link
                href="/trade"
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex items-center justify-center gap-1.5 text-xs font-bold tracking-wider uppercase text-accent-indigo bg-accent-indigo/10 border border-accent-indigo/20 px-4 py-3 rounded-xl hover:bg-accent-indigo/20 transition-all duration-200 w-full mt-2"
              >
                Start Trading <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
            
            {authenticated && (
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="inline-flex items-center justify-center gap-1.5 text-xs font-bold uppercase text-accent-rose bg-accent-rose/10 border border-accent-rose/20 px-4 py-3 rounded-xl w-full"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
