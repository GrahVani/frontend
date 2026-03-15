"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { KnowledgeTooltip } from "@/components/knowledge";
import { CheckCircle, XCircle } from "lucide-react";
import type { ScoreBreakdown } from "@/types/muhurta.types";

// ─── Layer Configuration ──────────────────────────────────

interface BarLayer {
  key: keyof ScoreBreakdown;
  label: string;
  knowledgeTerm: string | null;
  max: number;
  color: string;       // bar fill
  trackColor: string;  // unfilled track
  type: "bar";
}

interface GateLayer {
  key: keyof ScoreBreakdown;
  label: string;
  knowledgeTerm: string | null;
  type: "gate";
}

type ScoringLayer = BarLayer | GateLayer;

const SCORING_LAYERS: ScoringLayer[] = [
  {
    key: "panchang_shuddhi",
    label: "Panchang Shuddhi",
    knowledgeTerm: "panchang_shuddhi",
    max: 25,
    color: "bg-blue-500",
    trackColor: "bg-blue-100",
    type: "bar",
  },
  {
    key: "personalization",
    label: "Personalization",
    knowledgeTerm: "tara_bala",
    max: 20,
    color: "bg-purple-500",
    trackColor: "bg-purple-100",
    type: "bar",
  },
  {
    key: "lagna_shuddhi",
    label: "Lagna Shuddhi",
    knowledgeTerm: "lagna_shuddhi",
    max: 15,
    color: "bg-teal-500",
    trackColor: "bg-teal-100",
    type: "bar",
  },
  {
    key: "compatibility",
    label: "Compatibility",
    knowledgeTerm: "ashtakoot_system",
    max: 15,
    color: "bg-pink-500",
    trackColor: "bg-pink-100",
    type: "bar",
  },
  {
    key: "auspicious_bonus",
    label: "Auspicious Bonus",
    knowledgeTerm: "amrit_kaal",
    max: 10,
    color: "bg-gold-primary",
    trackColor: "bg-gold-primary/15",
    type: "bar",
  },
  {
    key: "yoga_matrix",
    label: "Yoga Matrix",
    knowledgeTerm: "yoga_panchanga",
    max: 15,
    color: "bg-emerald-500",
    trackColor: "bg-emerald-100",
    type: "bar",
  },
  {
    key: "time_window_penalties",
    label: "Time Penalties",
    knowledgeTerm: "rahu_kaal",
    max: 15,
    color: "bg-red-500",
    trackColor: "bg-red-100",
    type: "bar",
  },
  {
    key: "mahadosha",
    label: "Mahadosha Gate",
    knowledgeTerm: "mahadosha_gate",
    type: "gate",
  },
];

// ─── Component ──────────────────────────────────────────

interface ScoreBreakdownChartProps {
  breakdown: ScoreBreakdown;
  className?: string;
}

export function ScoreBreakdownChart({ breakdown, className }: ScoreBreakdownChartProps) {
  return (
    <div className={cn("space-y-2.5", className)}>
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gold-dark">
          Score Breakdown
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-gold-primary/20 to-transparent" />
      </div>

      {/* Scoring Layers */}
      {SCORING_LAYERS.map((layer) => {
        if (layer.type === "gate") {
          return <GateRow key={layer.key} layer={layer} breakdown={breakdown} />;
        }
        return <BarRow key={layer.key} layer={layer} breakdown={breakdown} />;
      })}

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold-primary/25 to-transparent my-1" />

      {/* Total Score */}
      <div className="flex items-center gap-3">
        <div className="w-[120px] shrink-0">
          <span className="text-[12px] font-bold text-ink tracking-wide">
            Total
          </span>
        </div>
        <div className="flex-1 relative h-5 rounded-full bg-parchment overflow-hidden border border-gold-primary/20">
          <div
            className={cn(
              "absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out",
              "bg-gradient-to-r from-gold-dark via-gold-primary to-gold-soft",
            )}
            style={{ width: `${Math.min(Math.max(breakdown.total, 0), 100)}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[11px] font-bold text-ink drop-shadow-[0_0_2px_rgba(255,255,255,0.8)]">
              {breakdown.total} / 100
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Bar Row ──────────────────────────────────────────

function BarRow({ layer, breakdown }: { layer: BarLayer; breakdown: ScoreBreakdown }) {
  const rawValue = breakdown[layer.key];
  const value = typeof rawValue === "number" ? rawValue : 0;
  const isNegative = layer.key === "time_window_penalties";
  const absValue = Math.abs(value);
  const pct = layer.max > 0 ? Math.min((absValue / layer.max) * 100, 100) : 0;

  const label = layer.knowledgeTerm ? (
    <KnowledgeTooltip term={layer.knowledgeTerm}>
      <span>{layer.label}</span>
    </KnowledgeTooltip>
  ) : (
    <span>{layer.label}</span>
  );

  return (
    <div className="flex items-center gap-3 group/bar">
      {/* Label */}
      <div className="w-[120px] shrink-0">
        <span className="text-[11px] font-medium text-ink/70 leading-tight">
          {label}
        </span>
      </div>

      {/* Track + Bar */}
      <div className="flex-1 relative">
        <div className={cn("h-3 rounded-full overflow-hidden", layer.trackColor)}>
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500 ease-out",
              layer.color,
              "group-hover/bar:brightness-110",
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Value */}
      <div className="w-[52px] shrink-0 text-right">
        <span
          className={cn(
            "text-[11px] font-semibold tabular-nums",
            isNegative && value < 0
              ? "text-red-600"
              : value === 0
                ? "text-ink/30"
                : "text-ink/70",
          )}
        >
          {isNegative && value < 0 ? `${value}` : value}
          <span className="text-ink/30"> / {isNegative ? `-${layer.max}` : layer.max}</span>
        </span>
      </div>
    </div>
  );
}

// ─── Gate Row ──────────────────────────────────────────

function GateRow({ layer, breakdown }: { layer: GateLayer; breakdown: ScoreBreakdown }) {
  const rawValue = breakdown[layer.key];
  const value = typeof rawValue === "string" ? rawValue : String(rawValue);
  const passed = value === "PASS";

  const label = layer.knowledgeTerm ? (
    <KnowledgeTooltip term={layer.knowledgeTerm}>
      <span>{layer.label}</span>
    </KnowledgeTooltip>
  ) : (
    <span>{layer.label}</span>
  );

  return (
    <div className="flex items-center gap-3">
      {/* Label */}
      <div className="w-[120px] shrink-0">
        <span className="text-[11px] font-medium text-ink/70 leading-tight">
          {label}
        </span>
      </div>

      {/* Gate badge */}
      <div className="flex-1 flex items-center">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide border",
            passed
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-red-50 text-red-700 border-red-200",
          )}
        >
          {passed ? (
            <CheckCircle className="w-3.5 h-3.5" />
          ) : (
            <XCircle className="w-3.5 h-3.5" />
          )}
          {passed ? "PASS" : "FAIL"}
        </span>
      </div>

      {/* Spacer for alignment */}
      <div className="w-[52px] shrink-0" />
    </div>
  );
}
