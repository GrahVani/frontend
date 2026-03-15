"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { KnowledgeTooltip } from "@/components/knowledge";
import { Check, X, AlertTriangle } from "lucide-react";
import type { DashaPoruthamData } from "@/types/muhurta.types";

interface DashaPoruthamChartProps {
  data: DashaPoruthamData;
  className?: string;
}

// Canonical order of 10 Poruthams
const PORUTHAM_CONFIG: { key: string; label: string; term?: string }[] = [
  { key: "dina", label: "Dina", term: "dina_porutham" },
  { key: "gana", label: "Gana", term: "koota_gana" },
  { key: "mahendram", label: "Mahendram", term: "mahendram_porutham" },
  { key: "stree_deergham", label: "Stree Deergham", term: "stree_deergham_porutham" },
  { key: "yoni", label: "Yoni", term: "koota_yoni" },
  { key: "rashi", label: "Rashi", term: "rashi_porutham" },
  { key: "rasiyathipathi", label: "Rasiyathipathi", term: "rasiyathipathi_porutham" },
  { key: "rajju", label: "Rajju", term: "rajju_porutham" },
  { key: "vedhai", label: "Vedhai", term: "vedhai_porutham" },
  { key: "vasya", label: "Vasya", term: "vasya_porutham" },
];

export default function DashaPoruthamChart({ data, className }: DashaPoruthamChartProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gold-dark">
          <KnowledgeTooltip term="dasha_porutham" unstyled>Dasha Porutham</KnowledgeTooltip>
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-gold-primary/20 to-transparent" />
      </div>

      {/* Mandatory Warning Banner */}
      {!data.mandatory_passed && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg bg-red-50/80 border border-red-200/60">
          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
          <span className="text-[12px] font-semibold text-red-700">
            Mandatory porutham(s) failed — Marriage not recommended
          </span>
        </div>
      )}

      {/* Porutham Rows */}
      <div className="border border-antique/40 rounded-lg overflow-hidden">
        {PORUTHAM_CONFIG.map((p, idx) => {
          const factor = data.poruthams?.[p.key];
          if (!factor) return null;

          const isMandatory = factor.mandatory;
          const isLast = idx === PORUTHAM_CONFIG.length - 1;

          return (
            <div
              key={p.key}
              className={cn(
                "flex items-center justify-between px-4 py-2.5 transition-colors",
                !isLast && "border-b border-antique/25",
                isMandatory && "bg-amber-50/50",
              )}
            >
              {/* Left: Name + mandatory badge */}
              <div className="flex items-center gap-2.5">
                <span className="text-[13px] font-medium text-ink">
                  {p.term ? (
                    <KnowledgeTooltip term={p.term} unstyled>{p.label}</KnowledgeTooltip>
                  ) : (
                    p.label
                  )}
                </span>
                {isMandatory && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-200/60">
                    Mandatory
                  </span>
                )}
              </div>

              {/* Right: Pass/Fail icon */}
              {factor.pass ? (
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-[11px] font-semibold text-emerald-600">Pass</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <X className="w-4 h-4 text-red-400" />
                  <span className="text-[11px] font-semibold text-red-500">Fail</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Total Row */}
      <div className="flex items-center justify-between pt-2 border-t border-antique/40">
        <span className="text-[13px] font-bold text-ink">Total Passed</span>
        <span className="text-[14px] font-bold font-serif text-gold-dark tabular-nums">
          {data.total_passed} / {data.total_poruthams}
        </span>
      </div>
    </div>
  );
}
