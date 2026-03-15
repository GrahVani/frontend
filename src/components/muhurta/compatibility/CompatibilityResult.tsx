"use client";

import React from "react";
import { cn } from "@/lib/utils";
import AshtakootChart from "./AshtakootChart";
import DashaPoruthamChart from "./DashaPoruthamChart";
import { BookOpen, AlertTriangle, Check } from "lucide-react";
import type { CompatibilityData, AshtakootData } from "@/types/muhurta.types";

interface CompatibilityResultProps {
  data: CompatibilityData;
  className?: string;
}

// ─── Verdict Styling ──────────────────────────────────────

function getVerdictStyle(verdict: string): { bg: string; text: string; icon: React.ReactNode } {
  const v = verdict.toUpperCase();
  if (v.includes("EXCELLENT") || v.includes("VERY GOOD")) {
    return {
      bg: "bg-emerald-50/80 border-emerald-200/60",
      text: "text-emerald-700",
      icon: <Check className="w-5 h-5 text-emerald-500" />,
    };
  }
  if (v.includes("GOOD") || v.includes("AVERAGE")) {
    return {
      bg: "bg-amber-50/80 border-amber-200/60",
      text: "text-amber-700",
      icon: <Check className="w-5 h-5 text-amber-500" />,
    };
  }
  // BLOCKED, POOR, NOT RECOMMENDED
  return {
    bg: "bg-red-50/80 border-red-200/60",
    text: "text-red-700",
    icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
  };
}

// ─── Resolve AshtakootData (may be nested or direct) ──────

function resolveAshtakoot(raw: CompatibilityData["ashtakoot"]): AshtakootData | null {
  if (!raw) return null;
  // Direct shape: has `system === "ASHTAKOOT"`
  if ("system" in raw && raw.system === "ASHTAKOOT") {
    return raw as AshtakootData;
  }
  // Nested shape: { ashtakoot: AshtakootData }
  if ("ashtakoot" in raw && raw.ashtakoot && typeof raw.ashtakoot === "object" && "system" in raw.ashtakoot) {
    return raw.ashtakoot as AshtakootData;
  }
  return null;
}

// ─── Component ──────────────────────────────────────────

export default function CompatibilityResult({ data, className }: CompatibilityResultProps) {
  const verdictStyle = getVerdictStyle(data.verdict);
  const ashtakootData = resolveAshtakoot(data.ashtakoot);
  const poruthamData = data.porutham ?? null;
  const hasBoth = !!ashtakootData && !!poruthamData;

  // Manglik / Chevvai
  const dosham = data.manglik ?? data.chevvai_dosham ?? null;

  return (
    <div className={cn("prem-card border", className)}>
      {/* ── Verdict Banner ── */}
      <div
        className={cn(
          "flex items-center gap-3 px-5 py-4 border-b border-gold-primary/12 rounded-t-xl",
          verdictStyle.bg,
        )}
      >
        {verdictStyle.icon}
        <div>
          <h3 className={cn("text-[16px] font-bold font-serif", verdictStyle.text)}>
            {data.verdict}
          </h3>
          {data.tradition_display && (
            <p className="text-[11px] text-ink/45 mt-0.5">
              {data.tradition_display}
              {data.matching_system ? ` - ${data.matching_system}` : ""}
            </p>
          )}
        </div>
        {data.muhurat_score !== undefined && (
          <div className="ml-auto text-right shrink-0">
            <span className={cn("text-[20px] font-bold font-serif tabular-nums", verdictStyle.text)}>
              {data.muhurat_score}
            </span>
            <span className="text-[11px] text-ink/35 block">score</span>
          </div>
        )}
      </div>

      {/* ── Chart Section ── */}
      <div className="p-5">
        {hasBoth ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <AshtakootChart data={ashtakootData!} />
            <DashaPoruthamChart data={poruthamData!} />
          </div>
        ) : ashtakootData ? (
          <AshtakootChart data={ashtakootData} />
        ) : poruthamData ? (
          <DashaPoruthamChart data={poruthamData} />
        ) : (
          <p className="text-ink/50 text-sm text-center py-4">
            No detailed chart data available for this tradition.
          </p>
        )}
      </div>

      {/* ── Dosham Status ── */}
      {dosham && (
        <div className="px-5 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gold-dark">
              {data.chevvai_dosham ? "Chevvai Dosham" : "Manglik Status"}
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-gold-primary/20 to-transparent" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <DoshamPill label="Person 1" active={dosham.person1} />
            <DoshamPill label="Person 2" active={dosham.person2} />
            <div
              className={cn(
                "flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-[12px] font-semibold",
                dosham.cancelled
                  ? "bg-emerald-50/70 border-emerald-200/60 text-emerald-700"
                  : dosham.person1 || dosham.person2
                    ? "bg-red-50/70 border-red-200/60 text-red-600"
                    : "bg-parchment/50 border-antique/40 text-ink/50",
              )}
            >
              {dosham.cancelled ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Cancelled
                </>
              ) : dosham.person1 || dosham.person2 ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Active
                </>
              ) : (
                "No Dosha"
              )}
            </div>
          </div>
          {dosham.note && (
            <p className="text-[11px] text-ink/50 mt-2 italic">{dosham.note}</p>
          )}
        </div>
      )}

      {/* ── Yoni Animals ── */}
      {data.yoni_animals && data.yoni_animals.length >= 2 && (
        <div className="px-5 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gold-dark">
              Yoni Animals
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-gold-primary/20 to-transparent" />
          </div>
          <p className="text-[13px] font-serif font-semibold text-ink">
            {data.yoni_animals[0]} &mdash; {data.yoni_animals[1]}
          </p>
        </div>
      )}

      {/* ── Gana Match ── */}
      {data.gana_match && (
        <div className="px-5 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gold-dark">
              Gana Match
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-gold-primary/20 to-transparent" />
          </div>
          <p className="text-[13px] font-serif font-semibold text-ink">
            {data.gana_match}
          </p>
        </div>
      )}

      {/* ── Classical Reference ── */}
      {data.primary_reference && (
        <div className="px-5 pb-5 pt-1">
          <div className="flex items-start gap-2 bg-parchment/50 rounded-lg px-3 py-2.5 border border-gold-primary/10">
            <BookOpen className="w-4 h-4 text-gold-dark mt-0.5 shrink-0" />
            <span className="text-[12px] text-ink/60 leading-relaxed italic font-serif">
              {data.primary_reference}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-Components ──────────────────────────────────────

function DoshamPill({ label, active }: { label: string; active: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg border text-[12px]",
        active
          ? "bg-red-50/70 border-red-200/60"
          : "bg-parchment/50 border-antique/40",
      )}
    >
      <span className="font-medium text-ink/60">{label}</span>
      <span
        className={cn(
          "font-bold ml-auto",
          active ? "text-red-600" : "text-emerald-600",
        )}
      >
        {active ? "Present" : "Absent"}
      </span>
    </div>
  );
}
