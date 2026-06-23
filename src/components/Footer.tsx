'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-bg-primary border-t border-border-primary px-8 py-12 md:py-16 flex flex-col md:flex-row gap-10 justify-between select-none z-30">
      <div className="flex flex-col gap-6 max-w-sm">
        <div className="flex flex-col gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <img
              src="/ChadWallet/logo/dark.png"
              alt="ChadWallet Logo"
              className="h-7 w-auto object-contain"
            />
          </Link>
          <div className="text-xl text-gray-400 font-medium tracking-tight mt-1">
            Where chads print alpha.
          </div>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          Disclaimer: Meme coins and DeFi tokens are highly volatile financial assets. Trade at your own risk. ChadWallet is not liable for any losses incurred. Be a Chad, trade smart.
        </p>
        <div className="text-xs text-gray-600">
          © {new Date().getFullYear()} ChadWallet Labs Inc. All rights reserved.
        </div>
      </div>

      <div className="flex flex-wrap gap-x-16 gap-y-8">
        <div className="flex flex-col gap-3.5 min-w-[120px]">
          <div className="text-accent-indigo font-display font-bold text-xs tracking-wider uppercase">
            Product
          </div>
          <Link href="/trade" className="text-sm text-gray-400 hover:text-white transition-colors duration-150">
            Swap Tokens
          </Link>
          <Link href="/trade" className="text-sm text-gray-400 hover:text-white transition-colors duration-150">
            Trending List
          </Link>
          <a
            href="https://apps.apple.com/us/app/chadwallet/id6757367474"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-400 hover:text-white transition-colors duration-150"
          >
            iOS App
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=xyz.chadwallet.www"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-400 hover:text-white transition-colors duration-150"
          >
            Android App
          </a>
        </div>

        <div className="flex flex-col gap-3.5 min-w-[120px]">
          <div className="text-accent-indigo font-display font-bold text-xs tracking-wider uppercase">
            Community
          </div>
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-400 hover:text-white transition-colors duration-150"
          >
            Twitter / X
          </a>
          <a
            href="https://discord.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-400 hover:text-white transition-colors duration-150"
          >
            Discord
          </a>
          <a
            href="https://telegram.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-400 hover:text-white transition-colors duration-150"
          >
            Telegram
          </a>
        </div>

        <div className="flex flex-col gap-3.5 min-w-[120px]">
          <div className="text-accent-indigo font-display font-bold text-xs tracking-wider uppercase">
            Legal
          </div>
          <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-150">
            Terms of Service
          </a>
          <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-150">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}
