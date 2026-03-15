"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { KnowledgeTooltip } from "@/components/knowledge";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Star,
  AlertTriangle,
  BookOpen,
  CheckCircle,
  Info,
} from "lucide-react";
import type {
  MuhuratResult,
  MuhuratGrade,
  TimeQualityData,
  ChoghadiyaQuality,
  GowriQuality,
  BothQuality,
} from "@/types/muhurta.types";
import { ScoreBreakdownChart } from "./ScoreBreakdownChart";

// ─── Grade Styling ──────────────────────────────────────

const GRADE_STYLES: Record<MuhuratGrade, string> = {
  Sarvottama:
    "bg-gradient-to-r from-gold-primary/20 to-gold-soft/20 text-gold-dark border-gold-primary/30",
  Uttama: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Madhyama: "bg-blue-50 text-blue-700 border-blue-200",
  Samanya: "bg-amber-50 text-amber-700 border-amber-200",
  Adhama: "bg-orange-50 text-orange-700 border-orange-200",
  Tyajya: "bg-red-50 text-red-700 border-red-200",
};

// ─── Helpers ──────────────────────────────────────────

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/** Extract the primary time quality info for display. */
function getTimeQualitySummary(tq: TimeQualityData): {
  name: string;
  isAuspicious: boolean;
  system: string;
} {
  if (tq.system === "BOTH") {
    const both = tq as BothQuality;
    // Show both systems, prefer choghadiya name
    return {
      name: both.choghadiya.active_segment,
      isAuspicious: both.both_auspicious,
      system: "Choghadiya + Gowri",
    };
  }
  if (tq.system === "GOWRI_PANCHANGAM") {
    const gowri = tq as GowriQuality;
    return {
      name: gowri.active_segment,
      isAuspicious: gowri.is_auspicious,
      system: "Gowri Panchangam",
    };
  }
  // Default: Choghadiya
  const chog = tq as ChoghadiyaQuality;
  return {
    name: chog.active_segment,
    isAuspicious: chog.is_auspicious,
    system: "Choghadiya",
  };
}

// ─── Component ──────────────────────────────────────────

interface MuhuratResultCardProps {
  result: MuhuratResult;
  className?: string;
}

export default function MuhuratResultCard({ result, className }: MuhuratResultCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isTopRank = result.rank === 1;
  const tqSummary = getTimeQualitySummary(result.time_quality);

  return (
    <div
      className={cn(
        "prem-card border transition-all duration-300",
        isTopRank && [
          "border-gold-primary/40",
          "shadow-[0_0_20px_rgba(201,162,77,0.12),0_0_40px_rgba(201,162,77,0.06)]",
        ],
        "hover:shadow-md hover:-translate-y-px",
        className,
      )}
    >
      {/* ── Header Section ── always visible */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between gap-4">
          {/* Left: Rank + Date */}
          <div className="flex items-start gap-3.5">
            {/* Rank Badge */}
            <div
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center shrink-0",
                "border-2 font-bold text-[14px] font-serif",
                isTopRank
                  ? "bg-gradient-to-br from-gold-primary to-gold-dark text-white border-gold-dark shadow-[0_2px_8px_rgba(201,162,77,0.35)]"
                  : "bg-parchment text-gold-dark border-gold-primary/30",
              )}
            >
              {result.rank}
            </div>

            {/* Date + Day */}
            <div>
              <h3 className="text-[18px] font-serif font-bold text-ink leading-tight">
                {result.date_display}
              </h3>
              <p className="text-[13px] text-ink/45 mt-0.5">{result.day}</p>
            </div>
          </div>

          {/* Right: Score + Grade */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Score */}
            <div className="flex items-center gap-1.5 bg-surface-warm/50 px-3 py-1.5 rounded-lg">
              <Star className="w-4 h-4 text-gold-primary" />
              <span className="text-[16px] font-bold font-serif text-ink tabular-nums">
                {result.score}
              </span>
              <span className="text-[12px] text-ink/35 font-medium">/100</span>
            </div>

            {/* Grade Badge */}
            <span
              className={cn(
                "inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide border",
                GRADE_STYLES[result.grade],
              )}
            >
              <KnowledgeTooltip term={`${result.grade.toLowerCase()}_grade`} unstyled>
                {result.grade}
              </KnowledgeTooltip>
            </span>
          </div>
        </div>
      </div>

      {/* ── Time Section ── */}
      <div className="px-5 pb-3">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Time Window */}
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-gold-dark" />
            <span className="text-[14px] font-medium text-ink">
              {result.window_start} — {result.window_end}
            </span>
            <span className="text-[12px] text-ink/35 ml-1">
              ({formatDuration(result.duration_minutes)})
            </span>
          </div>

          {/* Time Display */}
          {result.time_display && (
            <span className="text-[12px] text-ink/50 italic">
              {result.time_display}
            </span>
          )}

          {/* Lagna */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-ink/40 uppercase tracking-wide font-semibold">
              <KnowledgeTooltip term="lagna">Lagna</KnowledgeTooltip>
            </span>
            <span className="text-[13px] font-serif font-semibold text-ink">
              {result.lagna}
            </span>
          </div>
        </div>
      </div>

      {/* ── Panchang Row ── */}
      <div className="px-5 pb-3">
        <div className="grid grid-cols-4 gap-2">
          <PanchangCell
            term="tithi"
            label="Tithi"
            value={result.panchang.tithi}
            subtitle={result.panchang.paksha}
          />
          <PanchangCell
            term="nakshatra"
            label="Nakshatra"
            value={result.panchang.nakshatra}
            subtitle={result.panchang.nakshatra_category}
          />
          <PanchangCell
            term="panchanga_yoga"
            label="Yoga"
            value={result.panchang.yoga}
            subtitle={result.panchang.yoga_nature}
          />
          <PanchangCell
            term="karana"
            label="Karana"
            value={result.panchang.karana}
            subtitle={result.panchang.karana_nature}
          />
        </div>
      </div>

      {/* ── Time Quality Badge ── */}
      <div className="px-5 pb-4">
        <div
          className={cn(
            "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border",
            tqSummary.isAuspicious
              ? "bg-emerald-50/70 border-emerald-200/60 text-emerald-700"
              : "bg-red-50/70 border-red-200/60 text-red-700",
          )}
        >
          {tqSummary.isAuspicious ? (
            <CheckCircle className="w-3.5 h-3.5" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5" />
          )}
          <span className="text-[12px] font-semibold">{tqSummary.name}</span>
          <span className="text-[10px] opacity-60">
            (<KnowledgeTooltip
              term={tqSummary.system.includes("Gowri") ? "gowri_panchangam" : "choghadiya"}
              unstyled
            >
              {tqSummary.system}
            </KnowledgeTooltip>)
          </span>
        </div>
      </div>

      {/* ── Expand/Collapse Toggle ── */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className={cn(
          "w-full flex items-center justify-center gap-1.5 py-2.5",
          "border-t border-gold-primary/12",
          "text-[12px] font-semibold tracking-wide transition-colors duration-200",
          expanded
            ? "text-gold-dark bg-gold-primary/5"
            : "text-ink/40 hover:text-gold-dark hover:bg-gold-primary/3",
        )}
      >
        {expanded ? (
          <>
            <ChevronUp className="w-4 h-4" />
            Hide Details
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4" />
            View Details
          </>
        )}
      </button>

      {/* ── Expandable Details Section ── */}
      {expanded && (
        <div className="border-t border-gold-primary/12 animate-in slide-in-from-top-1 duration-200">
          {/* Score Breakdown */}
          <div className="p-5 pb-4">
            <ScoreBreakdownChart breakdown={result.score_breakdown} />
          </div>

          {/* Reasoning */}
          {result.reasoning.length > 0 && (
            <div className="px-5 pb-4">
              <DetailSectionHeader label="Reasoning" />
              <div className="space-y-1.5 mt-2">
                {result.reasoning.map((reason, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-status-success mt-0.5 shrink-0" />
                    <span className="text-[12px] text-ink/70 leading-relaxed">{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {result.warnings.length > 0 && (
            <div className="px-5 pb-4">
              <DetailSectionHeader label="Warnings" />
              <div className="space-y-1.5 mt-2">
                {result.warnings.map((warning, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
                    <span className="text-[12px] text-ink/70 leading-relaxed">{warning}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Classical References */}
          {result.classical_references.length > 0 && (
            <div className="px-5 pb-4">
              <DetailSectionHeader label="Classical References" knowledgeTerm="muhurta_classical_references" />
              <div className="space-y-1.5 mt-2">
                {result.classical_references.map((ref, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-gold-dark mt-0.5 shrink-0" />
                    <span className="text-[12px] text-ink/60 leading-relaxed italic font-serif">
                      {ref}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tradition Notes */}
          {result.tradition_notes.length > 0 && (
            <div className="px-5 pb-5">
              <DetailSectionHeader label="Tradition Notes" />
              <div className="space-y-1.5 mt-2">
                {result.tradition_notes.map((note, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 bg-parchment/50 rounded-lg px-3 py-2 border border-gold-primary/10"
                  >
                    <Info className="w-3.5 h-3.5 text-gold-dark mt-0.5 shrink-0" />
                    <span className="text-[12px] text-ink/65 leading-relaxed">{note}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Panchang Cell Sub-Component ──────────────────────────

function PanchangCell({
  term,
  label,
  value,
  subtitle,
}: {
  term: string;
  label: string;
  value: string;
  subtitle?: string;
}) {
  return (
    <div className="bg-surface-warm/40 rounded-lg p-2.5">
      <span className="text-[11px] text-ink/40 block mb-0.5">
        <KnowledgeTooltip term={term}>{label}</KnowledgeTooltip>
      </span>
      <span className="text-[13px] font-serif font-semibold text-ink block leading-tight">
        {value}
      </span>
      {subtitle && (
        <span className="text-[10px] text-ink/35 block mt-0.5">{subtitle}</span>
      )}
    </div>
  );
}

// ─── Detail Section Header ──────────────────────────────

function DetailSectionHeader({ label, knowledgeTerm }: { label: string; knowledgeTerm?: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gold-dark">
        {knowledgeTerm ? (
          <KnowledgeTooltip term={knowledgeTerm} unstyled>{label}</KnowledgeTooltip>
        ) : (
          label
        )}
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-gold-primary/20 to-transparent" />
    </div>
  );
}
