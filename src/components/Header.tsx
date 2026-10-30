"use client";

import { Clock, ShieldCheck } from "lucide-react";
import { ConnectWalletButton } from "./ConnectWalletButton";

export function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-charcoal-950/80 border-b border-charcoal-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-muted/30 to-green-muted/20 border border-purple-muted/30 flex items-center justify-center shadow-inner">
            <Clock className="w-5 h-5 text-purple-soft" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg sm:text-xl tracking-tight text-white font-mono">
                Expiry<span className="text-purple-soft">Mate</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-charcoal-800 border border-charcoal-700 text-slate-400">
                Web3
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              Never miss an expiry date.
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          <ConnectWalletButton />
        </div>
      </div>
    </header>
  );
}

