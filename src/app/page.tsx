"use client";

import { Header } from "@/components/Header";
import { PrivacyNotice } from "@/components/PrivacyNotice";
import { DashboardStats } from "@/components/DashboardStats";
import { AddRecordForm } from "@/components/AddRecordForm";
import { RecordList } from "@/components/RecordList";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/config/contract";
import { ExpiryRecord } from "@/types";
import { getCountdown } from "@/utils/countdown";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useState, useEffect, useMemo } from "react";
import {
  Clock,
  ShieldCheck,
  CalendarClock,
  Sparkles,
  ExternalLink,
  Layers,
  AlertCircle,
  RotateCw,
  CheckCircle2,
  Globe,
} from "lucide-react";

export default function Home() {
  const { address, isConnected } = useAccount();

  // Tick state to force countdown recalculation every 30 seconds
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Track pending transaction hashes
  const [pendingTxHash, setPendingTxHash] = useState<`0x${string}` | undefined>(undefined);
  const [lastConfirmedTx, setLastConfirmedTx] = useState<`0x${string}` | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<bigint | null>(null);

  // Wagmi contract read: getMyRecords
  const {
    data: rawRecords,
    isLoading: isRecordsLoading,
    isRefetching,
    refetch,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getMyRecords",
    account: address,
    query: {
      enabled:
        isConnected &&
        !!address &&
        CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000",
      refetchInterval: 5000,
    },
  });

  // Wagmi contract write
  const { writeContractAsync, isPending: isWritePending } = useWriteContract();

  // Wait for transaction confirmation
  const { isLoading: isTxWaiting, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({
    hash: pendingTxHash,
  });

  // Refetch records when transaction confirms
  useEffect(() => {
    if (isTxSuccess && pendingTxHash) {
      setLastConfirmedTx(pendingTxHash);
      setPendingTxHash(undefined);
      setDeletingId(null);
      refetch();
      const t = setTimeout(() => setLastConfirmedTx(undefined), 6000);
      return () => clearTimeout(t);
    }
  }, [isTxSuccess, pendingTxHash, refetch]);

  // Convert raw contract data to typed array with dual tuple/object normalization
  const records: ExpiryRecord[] = useMemo(() => {
    if (!rawRecords || !Array.isArray(rawRecords)) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (rawRecords as any[])
      .map((rec): ExpiryRecord => {
        const id = typeof rec.id !== "undefined" ? BigInt(rec.id) : BigInt(rec[0]);
        const name = typeof rec.name !== "undefined" ? String(rec.name) : String(rec[1]);
        const expiryDate =
          typeof rec.expiryDate !== "undefined" ? BigInt(rec.expiryDate) : BigInt(rec[2]);
        const owner = (typeof rec.owner !== "undefined" ? rec.owner : rec[3]) as `0x${string}`;
        const createdAt =
          typeof rec.createdAt !== "undefined" ? BigInt(rec.createdAt) : BigInt(rec[4]);
        const isDeleted =
          typeof rec.isDeleted !== "undefined" ? Boolean(rec.isDeleted) : Boolean(rec[5]);

        return {
          id,
          name,
          expiryDate,
          owner,
          createdAt,
          isDeleted,
        };
      })
      .filter((r) => !r.isDeleted);
  }, [rawRecords]);

  // Compute dashboard metrics
  const { activeCount, expiredCount } = useMemo(() => {
    let active = 0;
    let expired = 0;
    records.forEach((rec) => {
      const countdown = getCountdown(rec.expiryDate);
      if (countdown.isExpired) {
        expired++;
      } else {
        active++;
      }
    });
    return { activeCount: active, expiredCount: expired };
  }, [records]);

  // Add Record Handler
  const handleAddRecord = async (name: string, expiryTimestamp: bigint) => {
    if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
      throw new Error("Smart contract address not configured yet.");
    }

    const tx = await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "addRecord",
      args: [name, expiryTimestamp],
    });

    setPendingTxHash(tx);
  };

  // Delete Record Handler
  const handleDeleteRecord = async (id: bigint) => {
    if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
      throw new Error("Smart contract address not configured yet.");
    }

    setDeletingId(id);
    try {
      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "deleteRecord",
        args: [id],
      });

      setPendingTxHash(tx);
    } catch (err) {
      setDeletingId(null);
      throw err;
    }
  };

  const isContractConfigured =
    CONTRACT_ADDRESS && CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000";

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Header />

      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 flex-1">
        {/* Banner: Smart contract configuration notice if missing */}
        {!isContractConfigured && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs sm:text-sm text-amber-300 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
            <div>
              <p className="font-semibold">Contract Not Yet Configured</p>
              <p className="mt-1 text-slate-300">
                Configure <code className="bg-charcoal-900 px-1.5 py-0.5 rounded font-mono">NEXT_PUBLIC_CONTRACT_ADDRESS</code> in <code className="bg-charcoal-900 px-1.5 py-0.5 rounded font-mono">.env.local</code>.
              </p>
            </div>
          </div>
        )}

        {/* Live Transaction Status Notifications */}
        {pendingTxHash && (
          <div className="rounded-2xl border border-purple-muted/40 bg-purple-muted/10 p-4 text-xs sm:text-sm text-purple-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg shadow-purple-muted/10 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-purple-soft border-t-transparent rounded-full animate-spin shrink-0" />
              <div>
                <p className="font-semibold text-white">
                  {isTxWaiting ? "Transaction Mined — Awaiting Confirmation..." : "Transaction Broadcast to BOT Chain..."}
                </p>
                <p className="text-slate-400 text-xs mt-0.5 font-mono">
                  Tx: {pendingTxHash.slice(0, 10)}...{pendingTxHash.slice(-8)}
                </p>
              </div>
            </div>
            <a
              href={`https://scan.botchain.ai/tx/${pendingTxHash}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-slate-300 hover:text-white border border-charcoal-700 text-xs shrink-0 transition-colors"
            >
              View on BOT Chain Explorer <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {lastConfirmedTx && (
          <div className="rounded-2xl border border-green-accent/30 bg-green-accent/10 p-4 text-xs sm:text-sm text-green-soft flex items-center justify-between gap-3 shadow-lg animate-fadeIn">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-accent shrink-0" />
              <div>
                <p className="font-semibold text-white">Transaction Confirmed on BOT Chain!</p>
                <p className="text-slate-300 text-xs mt-0.5">
                  Your record has been securely confirmed on the blockchain and updated on your dashboard.
                </p>
              </div>
            </div>
            <a
              href={`https://scan.botchain.ai/tx/${lastConfirmedTx}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-slate-300 hover:text-white border border-charcoal-700 text-xs shrink-0 transition-colors"
            >
              Receipt on Explorer <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Privacy Notice Banner */}
        <PrivacyNotice />

        {!isConnected ? (
          /* Disconnected Welcome / Hero View */
          <div className="rounded-3xl border border-charcoal-800 bg-gradient-to-b from-charcoal-900/90 to-charcoal-950 p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-muted/10 blur-3xl rounded-full pointer-events-none" />

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-muted/10 border border-purple-muted/30 text-purple-soft text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              Web3 Expiration Tracker
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-2xl mx-auto leading-tight">
              Never miss an expiry date.
            </h1>

            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Save important items and expiry dates directly on BOT Chain. Monitor real-time
              countdowns for passports, licences, warranties, and subscriptions with absolute ownership.
            </p>

            <div className="pt-2">
              <div className="inline-block">
                <p className="text-xs text-slate-500 mb-3">Connect your wallet to get started</p>
                <div className="flex justify-center">
                  <div className="p-1 rounded-2xl bg-charcoal-800/80 border border-charcoal-700">
                    <p className="text-xs text-slate-400 px-4 py-2">
                      Use the <span className="text-purple-soft font-semibold">Connect Wallet</span>{" "}
                      button in the top header
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-charcoal-800/80 max-w-3xl mx-auto text-left">
              <div className="p-4 rounded-xl bg-charcoal-900/60 border border-charcoal-800">
                <div className="w-8 h-8 rounded-lg bg-purple-muted/20 text-purple-soft flex items-center justify-center mb-3">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-semibold text-white">Non-Custodial</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Only you have the cryptographic authority to manage and delete your records.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-charcoal-900/60 border border-charcoal-800">
                <div className="w-8 h-8 rounded-lg bg-green-accent/20 text-green-soft flex items-center justify-center mb-3">
                  <CalendarClock className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-semibold text-white">Live Countdowns</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Instant visual indicators for active, expiring soon, and expired items.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-charcoal-900/60 border border-charcoal-800">
                <div className="w-8 h-8 rounded-lg bg-purple-muted/20 text-purple-soft flex items-center justify-center mb-3">
                  <Layers className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-semibold text-white">BOT Chain (677)</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Ultra-fast, low-gas blockchain records stored transparently and permanently.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Connected State: Dashboard + Add Form + Records */
          <div className="space-y-8 animate-fadeIn">
            {/* Dashboard Stats */}
            <section className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                  Dashboard Overview
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => refetch()}
                    disabled={isRefetching}
                    title="Refresh on-chain records"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-charcoal-900 border border-charcoal-800 text-slate-400 hover:text-white hover:bg-charcoal-800 transition-colors"
                  >
                    <RotateCw
                      className={`w-3.5 h-3.5 ${isRefetching ? "animate-spin text-purple-soft" : ""}`}
                    />
                    <span>{isRefetching ? "Syncing..." : "Refresh"}</span>
                  </button>
                </div>
              </div>
              <DashboardStats
                totalCount={records.length}
                activeCount={activeCount}
                expiredCount={expiredCount}
                isLoading={isRecordsLoading}
              />
            </section>

            {/* Add Record Section */}
            <section>
              <AddRecordForm
                onAdd={handleAddRecord}
                isSubmitting={isWritePending || isTxWaiting}
              />
            </section>

            {/* Records List Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-white">Your Saved Records</h2>
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-charcoal-800 text-slate-400 border border-charcoal-700">
                    {records.length}
                  </span>
                </div>
              </div>

              <RecordList
                records={records}
                onDelete={handleDeleteRecord}
                deletingId={deletingId}
                isLoading={isRecordsLoading}
              />
            </section>
          </div>
        )}
      </main>

      {/* Footer / BOT Chain Ecosystem Section */}
      <footer className="border-t border-charcoal-800 py-8 bg-charcoal-950/90 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-muted/30 to-green-muted/20 border border-purple-muted/30 flex items-center justify-center">
              <Clock className="w-4 h-4 text-purple-soft" />
            </div>
            <div>
              <p className="font-semibold text-slate-200 text-sm">ExpiryMate</p>
              <p className="text-slate-500 text-xs">Never miss an expiry date.</p>
            </div>
          </div>

          {/* BOT Chain Ecosystem Links & Verification */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-charcoal-900 border border-charcoal-800 text-xs">
              <span className="w-2 h-2 rounded-full bg-green-accent animate-pulse" />
              <span className="font-medium text-slate-300">BOT Chain (Chain ID: 677)</span>
            </div>

            <a
              href="https://botchain.ai"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-purple-soft hover:text-white transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>BOT Chain Website</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>

            <a
              href="https://scan.botchain.ai"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-green-soft hover:text-white transition-colors"
            >
              <span>BOT Chain Explorer</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>

            <a
              href={`https://scan.botchain.ai/address/${CONTRACT_ADDRESS}#code`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-slate-400 hover:text-white transition-colors bg-charcoal-900/60 px-2.5 py-1 rounded-lg border border-charcoal-800"
            >
              <span>Contract: {CONTRACT_ADDRESS.slice(0, 6)}...{CONTRACT_ADDRESS.slice(-4)}</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
