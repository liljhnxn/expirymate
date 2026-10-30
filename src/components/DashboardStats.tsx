"use client";

import { Layers, CheckCircle2, AlertOctagon } from "lucide-react";

interface DashboardStatsProps {
  totalCount: number;
  activeCount: number;
  expiredCount: number;
  isLoading?: boolean;
}

export function DashboardStats({
  totalCount,
  activeCount,
  expiredCount,
  isLoading = false,
}: DashboardStatsProps) {
  const stats = [
    {
      label: "Total Saved Items",
      value: totalCount,
      icon: Layers,
      color: "text-purple-soft",
      bg: "bg-purple-muted/10 border-purple-muted/20",
      accent: "from-purple-muted/20 to-transparent",
    },
    {
      label: "Active Items",
      value: activeCount,
      icon: CheckCircle2,
      color: "text-green-soft",
      bg: "bg-green-accent/10 border-green-accent/20",
      accent: "from-green-accent/20 to-transparent",
    },
    {
      label: "Expired Items",
      value: expiredCount,
      icon: AlertOctagon,
      color: "text-rose-400",
      bg: "bg-rose-500/10 border-rose-500/20",
      accent: "from-rose-500/20 to-transparent",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="relative overflow-hidden rounded-2xl bg-charcoal-900/90 border border-charcoal-800 p-5 transition-all duration-300 hover:border-charcoal-700 hover:shadow-lg hover:shadow-black/40 group"
          >
            {/* Subtle gradient corner glow */}
            <div
              className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${stat.accent} rounded-bl-full pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity`}
            />

            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 tracking-wide uppercase">
                {stat.label}
              </span>
              <div className={`p-2 rounded-xl border ${stat.bg} ${stat.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3">
              {isLoading ? (
                <div className="h-9 w-16 bg-charcoal-800 rounded-lg animate-pulse" />
              ) : (
                <p className="text-3xl font-bold font-mono tracking-tight text-white">
                  {stat.value}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

