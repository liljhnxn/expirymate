"use client";

import { ExpiryRecord, StatusCategory } from "@/types";
import { getCountdown } from "@/utils/countdown";
import { RecordCard } from "./RecordCard";
import { useState, useMemo } from "react";
import { Search, FolderKanban, AlertCircle } from "lucide-react";

interface RecordListProps {
  records: ExpiryRecord[];
  onDelete: (id: bigint) => Promise<void>;
  deletingId: bigint | null;
  isLoading?: boolean;
}

export function RecordList({
  records,
  onDelete,
  deletingId,
  isLoading = false,
}: RecordListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "warning" | "expired">("all");

  const filteredRecords = useMemo(() => {
    return records
      .filter((record) => {
        if (!searchQuery.trim()) return true;
        return record.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
      })
      .filter((record) => {
        const countdown = getCountdown(record.expiryDate);
        if (activeFilter === "all") return true;
        if (activeFilter === "active") return !countdown.isExpired;
        if (activeFilter === "warning") return countdown.category === "warning";
        if (activeFilter === "expired") return countdown.isExpired;
        return true;
      })
      // Sort: expiring soonest first, then expired at the end
      .sort((a, b) => {
        const aSec = Number(a.expiryDate);
        const bSec = Number(b.expiryDate);
        return aSec - bSec;
      });
  }, [records, searchQuery, activeFilter]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="h-44 rounded-2xl bg-charcoal-900/60 border border-charcoal-800 p-5 animate-pulse"
          >
            <div className="h-5 w-24 bg-charcoal-800 rounded-full mb-4" />
            <div className="h-6 w-3/4 bg-charcoal-800 rounded-lg mb-4" />
            <div className="h-4 w-1/2 bg-charcoal-800 rounded mb-2" />
            <div className="h-4 w-1/3 bg-charcoal-800 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900/40 p-12 text-center">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-charcoal-800 flex items-center justify-center text-slate-500 mb-3">
          <FolderKanban className="w-6 h-6 text-purple-muted" />
        </div>
        <h4 className="text-base font-semibold text-slate-300">No records saved yet</h4>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1">
          Add your first expiry date above to monitor its countdown directly on the blockchain.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls: Search & Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search your records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-charcoal-900/80 border border-charcoal-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-muted/50 focus:border-purple-muted transition-colors"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-charcoal-900/80 border border-charcoal-800 self-start sm:self-auto overflow-x-auto text-xs">
          {(
            [
              { key: "all", label: "All" },
              { key: "active", label: "Active" },
              { key: "warning", label: "Expiring Soon" },
              { key: "expired", label: "Expired" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeFilter === tab.key
                  ? "bg-charcoal-800 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of records */}
      {filteredRecords.length === 0 ? (
        <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900/30 p-8 text-center">
          <p className="text-xs sm:text-sm text-slate-400">
            No items matched your filter or search query.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecords.map((rec) => (
            <RecordCard
              key={rec.id.toString()}
              record={rec}
              onDelete={onDelete}
              isDeleting={deletingId === rec.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

