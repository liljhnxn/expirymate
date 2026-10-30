"use client";

import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from "wagmi";
import { botchainTestnet } from "@/config/botchain";
import { Wallet, LogOut, AlertTriangle, Check, Copy } from "lucide-react";
import { useState } from "react";

export function ConnectWalletButton() {
  const { address, isConnected, isConnecting } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [copied, setCopied] = useState(false);

  const isWrongNetwork = isConnected && chainId !== botchainTestnet.id;

  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnect = () => {
    const primaryConnector = connectors[0];
    if (primaryConnector) {
      connect({ connector: primaryConnector });
    }
  };

  if (isConnecting || isPending) {
    return (
      <button
        disabled
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-charcoal-800 border border-charcoal-700 text-slate-400 cursor-not-allowed animate-pulse"
      >
        <div className="w-4 h-4 border-2 border-purple-muted border-t-transparent rounded-full animate-spin" />
        Connecting...
      </button>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        {isWrongNetwork ? (
          <button
            onClick={() => switchChain({ chainId: botchainTestnet.id })}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Switch to Botchain
          </button>
        ) : (
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-accent/10 border border-green-accent/20 text-green-soft">
            <span className="w-1.5 h-1.5 rounded-full bg-green-accent animate-pulse" />
            Botchain (968)
          </span>
        )}

        <div className="flex items-center bg-charcoal-850 border border-charcoal-700/80 rounded-xl overflow-hidden shadow-sm">
          <button
            onClick={handleCopy}
            title="Click to copy full address"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono text-slate-300 hover:text-white hover:bg-charcoal-800 transition-colors"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-soft" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
          </button>

          <button
            onClick={() => disconnect()}
            title="Disconnect wallet"
            className="px-2.5 py-2 text-slate-400 hover:text-rose-400 hover:bg-charcoal-800 border-l border-charcoal-700/80 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-muted to-purple-accent hover:from-purple-accent hover:to-purple-muted shadow-lg shadow-purple-muted/20 border border-purple-muted/40 transition-all duration-200 active:scale-[0.98]"
    >
      <Wallet className="w-4 h-4" />
      Connect Wallet
    </button>
  );
}
