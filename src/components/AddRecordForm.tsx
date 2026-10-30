"use client";

import { useState } from "react";
import { PlusCircle, Calendar as CalendarIcon, Sparkles, AlertCircle, CheckCircle } from "lucide-react";

interface AddRecordFormProps {
  onAdd: (name: string, expiryTimestamp: bigint) => Promise<void>;
  isSubmitting?: boolean;
}

export function AddRecordForm({ onAdd, isSubmitting = false }: AddRecordFormProps) {
  const [name, setName] = useState("");
  const [expiryDateStr, setExpiryDateStr] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Set min date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Please provide an item name.");
      return;
    }

    if (!expiryDateStr) {
      setError("Please choose a valid expiration date.");
      return;
    }

    // Set expiration timestamp to the end of the selected day (23:59:59 UTC) or local time
    const selectedDate = new Date(`${expiryDateStr}T23:59:59`);
    const expiryTimestamp = Math.floor(selectedDate.getTime() / 1000);
    const nowTimestamp = Math.floor(Date.now() / 1000);

    if (expiryTimestamp <= nowTimestamp) {
      setError("Expiry date must be in the future.");
      return;
    }

    try {
      await onAdd(trimmedName, BigInt(expiryTimestamp));
      setName("");
      setExpiryDateStr("");
      setSuccess(`"${trimmedName}" submitted to Botchain! Awaiting block confirmation...`);
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to record expiry date.";
      // Clean up common RPC rejection messages
      if (message.includes("User rejected")) {
        setError("Transaction was cancelled in wallet.");
      } else {
        setError(message.slice(0, 160));
      }
    }
  };

  return (
    <div className="rounded-2xl bg-charcoal-900/90 border border-charcoal-800 p-5 sm:p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-muted/10 border border-purple-muted/20 text-purple-soft">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Add New Expiry Record</h3>
            <p className="text-xs text-slate-400">Save an item to Botchain blockchain</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Item Name */}
          <div className="space-y-1.5">
            <label htmlFor="itemName" className="block text-xs font-medium text-slate-300">
              Item Name
            </label>
            <input
              id="itemName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Passport, Domain Renewal, Gym..."
              maxLength={80}
              disabled={isSubmitting}
              className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-800/80 border border-charcoal-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-muted/50 focus:border-purple-muted transition-colors disabled:opacity-50"
            />
          </div>

          {/* Expiry Date */}
          <div className="space-y-1.5">
            <label htmlFor="expiryDate" className="block text-xs font-medium text-slate-300">
              Expiry Date
            </label>
            <div className="relative">
              <input
                id="expiryDate"
                type="date"
                min={minDateStr}
                value={expiryDateStr}
                onChange={(e) => setExpiryDateStr(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-800/80 border border-charcoal-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-muted/50 focus:border-purple-muted transition-colors disabled:opacity-50 [color-scheme:dark]"
              />
            </div>
          </div>
        </div>

        {/* Status / feedback messages */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-green-accent/10 border border-green-accent/20 text-green-soft text-xs animate-fadeIn">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Submit button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting || !name.trim() || !expiryDateStr}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-muted to-purple-accent hover:from-purple-accent hover:to-purple-muted shadow-md shadow-purple-muted/20 border border-purple-muted/40 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Confirming on-chain...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-purple-200" />
                <span>Save Record</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

