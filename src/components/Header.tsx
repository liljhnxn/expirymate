"use client";

import { Clock, ExternalLink } from "lucide-react";
import { ConnectWalletButton } from "./ConnectWalletButton";
import Image from "next/image";

export function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-charcoal-950/85 border-b border-charcoal-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-muted/30 to-green-muted/20 border border-purple-muted/30 flex items-center justify-center shadow-inner shrink-0">
            <Clock className="w-5 h-5 text-purple-soft" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg sm:text-xl tracking-tight text-white font-mono">
                Expiry<span className="text-purple-soft">Mate</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-green-accent/10 border border-green-accent/30 text-green-soft">
                Mainnet
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              Never miss an expiry date.
            </p>
          </div>
        </div>

        {/* Center: BOT Chain Official Links with Logo */}
        <div className="hidden lg:flex items-center gap-2">
          <a
            href="https://botchain.ai"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-charcoal-900 border border-charcoal-800 hover:border-green-accent/40 text-xs font-medium text-slate-300 hover:text-white transition-all group"
          >
            <img
              src="/botchain-logo.png"
              alt="BOT Chain"
              className="w-4 h-4 rounded-md object-contain"
            />
            <span>BOT Chain Website</span>
            <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-slate-300" />
          </a>

          <a
            href="https://scan.botchain.ai"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-charcoal-900 border border-charcoal-800 hover:border-green-accent/40 text-xs font-medium text-slate-300 hover:text-white transition-all group"
          >
            <img
              src="/botchain-logo.png"
              alt="BOT Chain Explorer"
              className="w-4 h-4 rounded-md object-contain"
            />
            <span>BOT Chain Explorer</span>
            <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-slate-300" />
          </a>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          <ConnectWalletButton />
        </div>
      </div>
    </header>
  );
}
