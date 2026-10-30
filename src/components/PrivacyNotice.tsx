"use client";

import { ShieldAlert, Info } from "lucide-react";

export function PrivacyNotice() {
  return (
    <div className="rounded-2xl border border-charcoal-700 bg-charcoal-900/60 p-4 sm:p-5 backdrop-blur-sm">
      <div className="flex items-start gap-3.5">
        <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-sm">
          <h4 className="font-semibold text-slate-200 flex items-center gap-2">
            On-Chain Privacy Notice
            <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-charcoal-800 text-slate-400 border border-charcoal-700">
              Public Ledger
            </span>
          </h4>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Data stored on the blockchain is permanently public. Please only store a brief descriptive title
            (e.g., <span className="text-purple-soft font-mono">&quot;Passport&quot;</span>,{" "}
            <span className="text-purple-soft font-mono">&quot;Driver&apos;s Licence&quot;</span>,{" "}
            <span className="text-purple-soft font-mono">&quot;Laptop Warranty&quot;</span>).{" "}
            <strong className="text-slate-300 font-semibold">
              Never enter document ID numbers, personal identity codes, or sensitive confidential information.
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
}

