"use client";

import { ExpiryRecord } from "@/types";
import { getCountdown, formatExpiryDate } from "@/utils/countdown";
import { Trash2, Calendar, ShieldCheck, AlertCircle, Clock } from "lucide-react";
import { useState } from "react";

interface RecordCardProps {
  record: ExpiryRecord;
  onDelete: (id: bigint) => Promise<void>;
  isDeleting?: boolean;
}

export function RecordCard({ record, onDelete, isDeleting = false }: RecordCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const countdown = getCountdown(record.expiryDate);

  // Status badge styling
  const badgeStyles = {
    safe: {
      bg: "bg-green-accent/10 border-green-accent/30 text-green-soft",
      dot: "bg-green-accent",
      border: "border-charcoal-800 hover:border-green-accent/30",
    },
    warning: {
      bg: "bg-amber-500/10 border-amber-500/30 text-amber-400",
      dot: "bg-amber-400",
      border: "border-charcoal-800 hover:border-amber-500/30",
    },
    expired: {
      bg: "bg-rose-500/10 border-rose-500/30 text-rose-400",
      dot: "bg-rose-500",
      border: "border-charcoal-800 hover:border-rose-500/30",
    },
  }[countdown.category];

  const handleDelete = async () => {
    try {
      await onDelete(record.id);
      setShowConfirm(false);
    } catch {
      // Handled in parent
    }
  };

  return (
    <div
      className={`relative flex flex-col justify-between rounded-2xl bg-charcoal-900/90 border p-5 transition-all duration-200 hover:shadow-xl hover:shadow-black/50 ${badgeStyles.border}`}
    >
      <div>
        {/* Top bar: Status badge & ID */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${badgeStyles.bg}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${badgeStyles.dot}`} />
            {countdown.formattedText}
          </span>

          <span className="text-[11px] font-mono text-slate-500">
            #{record.id.toString()}
          </span>
        </div>

        {/* Item Title */}
        <h3 className="text-lg font-semibold text-white tracking-tight break-words">
          {record.name}
        </h3>

        {/* Dates meta */}
        <div className="mt-4 space-y-1.5 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>
              Expires:{" "}
              <strong className="text-slate-200 font-mono">
                {formatExpiryDate(record.expiryDate)}
              </strong>
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>Saved on {formatExpiryDate(record.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Bottom bar: Action button */}
      <div className="mt-5 pt-3.5 border-t border-charcoal-800/80 flex items-center justify-between">
        <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-purple-soft/70" />
          On-chain
        </span>

        {showConfirm ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowConfirm(false)}
              disabled={isDeleting}
              className="px-2.5 py-1 text-xs rounded-lg text-slate-400 hover:text-white hover:bg-charcoal-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 transition-colors"
            >
              {isDeleting ? (
                <div className="w-3 h-3 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                "Confirm"
              )}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirm(true)}
            disabled={isDeleting}
            title="Delete this record from your active list"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

