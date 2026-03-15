"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { KnowledgeTooltip } from "@/components/knowledge";
import type { AshtakootData } from "@/types/muhurta.types";

interface AshtakootChartProps {
  data: AshtakootData;
  className?: string;
}

// The 8 Koots in canonical order with their max scores and knowledge term keys
const KOOT_CONFIG: { key: string; label: string; term: string; max: number }[] = [
  { key: "varna", label: "Varna", term: "koota_varna", max: 1 },
  { key: "vashya", label: "Vashya", term: "koota_vashya", max: 2 },
  { key: "tara", label: "Tara", term: "koota_tara", max: 3 },
  { key: "yoni", label: "Yoni", term: "koota_yoni", max: 4 },
  { key: "graha_maitri", label: "Graha Maitri", term: "koota_graha_maitri", max: 5 },
  { key: "gana", label: "Gana", term: "koota_gana", max: 6 },
  { key: "bhakoot", label: "Bhakoot", term: "koota_bhakoot", max: 7 },
  { key: "nadi", label: "Nadi", term: "koota_nadi", max: 8 },
];

function getBarColor(obtained: number, max: number): string {
  if (obtained === max) return "bg-emerald-500";
  if (obtained === 0) return "bg-red-400";
  return "bg-amber-400";
}

export default function AshtakootChart({ data, className }: AshtakootChartProps) {
  const totalPct = data.max > 0 ? Math.round((data.total / data.max) * 100) : 0;

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gold-dark">
          <KnowledgeTooltip term="ashtakoot_system" unstyled>Ashtakoot Gun Milan</KnowledgeTooltip>
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-gold-primary/20 to-transparent" />
      </div>

      {/* 8 Koot Bars */}
      <div className="space-y-2">
        {KOOT_CONFIG.map((koot) => {
          const entry = data.koots?.[koot.key];
          const obtained = entry?.obtained ?? 0;
          const max = entry?.max ?? koot.max;
          const pct = max > 0 ? (obtained / max) * 100 : 0;

          return (
            <div key={koot.key} className="flex items-center gap-3">
              {/* Label with tooltip */}
              <div className="w-28 shrink-0">
                <KnowledgeTooltip term={koot.term}>
                  <span className="text-[12px] font-medium text-ink/75">{koot.label}</span>
                </KnowledgeTooltip>
              </div>

              {/* Bar */}
              <div className="flex-1 h-5 bg-parchment/80 rounded-full overflow-hidden border border-antique/50">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    getBarColor(obtained, max),
                  )}
                  style={{ width: `${Math.max(pct, 4)}%` }}
                />
              </div>

              {/* Score */}
              <span className="w-12 text-right text-[12px] font-bold font-serif text-ink tabular-nums shrink-0">
                {obtained}/{max}
              </span>
            </div>
          );
        })}
      </div>

      {/* Total Row */}
      <div className="pt-2 border-t border-antique/40">
        <div className="flex items-center gap-3">
          <div className="w-28 shrink-0">
            <span className="text-[13px] font-bold text-ink">Total</span>
          </div>

          <div className="flex-1 h-6 bg-parchment/80 rounded-full overflow-hidden border border-gold-primary/30">
            <div
              className="h-full rounded-full bg-gradient-to-r from-gold-primary to-gold-dark transition-all duration-700"
              style={{ width: `${Math.max(totalPct, 3)}%` }}
            />
          </div>

          <span className="w-24 text-right text-[14px] font-bold font-serif text-gold-dark tabular-nums shrink-0">
            {data.total} / {data.max} ({totalPct}%)
          </span>
        </div>
      </div>

      {/* Nadi Dosha Flag */}
      {data.nadi_dosha && (
        <div
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg border mt-2",
            data.nadi_dosha_cancelled
              ? "bg-emerald-50/70 border-emerald-200/60"
              : "bg-red-50/70 border-red-200/60",
          )}
        >
          <span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide border",
              data.nadi_dosha_cancelled
                ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                : "bg-red-100 text-red-700 border-red-300",
            )}
          >
            <KnowledgeTooltip term="nadi_dosha_match" unstyled>
              {data.nadi_dosha_cancelled ? "Nadi Dosha Cancelled" : "Nadi Dosha"}
            </KnowledgeTooltip>
          </span>
          <span
            className={cn(
              "text-[11px]",
              data.nadi_dosha_cancelled ? "text-emerald-600" : "text-red-600",
            )}
          >
            {data.nadi_dosha_cancelled
              ? "Nadi dosha is present but exceptions apply, cancelling its effect."
              : "Nadi dosha detected. This is considered a serious compatibility concern."}
          </span>
        </div>
      )}
    </div>
  );
}
