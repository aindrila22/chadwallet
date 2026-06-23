import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TickerBanner from "@/components/TickerBanner";

export const metadata: Metadata = {
  title: "ChadWallet | Trade Meme Coins & DeFi on Solana",
  description: "The ultimate social-first meme coin wallet and trading terminal on Solana. Swaps, live charts, trending lists, and social trades powered by Privy and Jupiter.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-bg-primary text-foreground flex flex-col font-sans selection:bg-accent-indigo/35 selection:text-white">
        <Providers>
          {/* Top Ticker Banner rotating left */}
          <TickerBanner direction="left" />
          
          <Header />
          
          <main className="flex-1 w-full flex flex-col relative">
            {/* Background glowing gradients */}
            <div className="absolute top-[20%] left-[10%] w-[45%] h-[45%] rounded-full bg-accent-indigo/10 blur-[120px] pointer-events-none -z-10 animate-glow-pulse" />
            <div className="absolute bottom-[20%] right-[10%] w-[45%] h-[45%] rounded-full bg-accent-pink/5 blur-[120px] pointer-events-none -z-10 animate-glow-pulse" />
            
            {children}
          </main>
          
          <Footer />
          
          {/* Bottom Ticker Banner rotating right */}
          <TickerBanner direction="right" />
        </Providers>
      </body>
    </html>
  );
}
