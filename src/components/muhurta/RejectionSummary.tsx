"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { RejectionSummary as RejectionSummaryType } from "@/types/muhurta.types";

// ─── Props ──────────────────────────────────────────────────

interface RejectionSummaryProps {
  summary: RejectionSummaryType;
  className?: string;
}

// ─── Helpers ────────────────────────────────────────────────

function formatReasonLabel(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ─── Main Component ─────────────────────────────────────────

export default function RejectionSummary({ summary, className }: RejectionSummaryProps) {
  const [isOpen, setIsOpen] = useState(false);

  const macroEntries = Object.entries(summary.macro_period);
  const dayEntries = Object.entries(summary.day_level);
  const hasMacro = macroEntries.length > 0;
  const hasDay = dayEntries.length > 0;

  if (!hasMacro && !hasDay) return null;

  const totalRejected = [
    ...macroEntries.map(([, v]) => v),
    ...dayEntries.map(([, v]) => v),
  ].reduce((sum, n) => sum + n, 0);

  return (
    <div className={cn("rounded-xl border border-status-warning/30 overflow-hidden", className)}>
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "flex items-center justify-between w-full px-5 py-3.5 text-left transition-colors",
          "bg-status-warning/8 hover:bg-status-warning/12",
        )}
      >
        <div className="flex items-center gap-2.5">
          <svg
            className="w-4.5 h-4.5 text-status-warning shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span className="text-[14px] font-serif font-bold text-ink">
            Why were dates rejected?
          </span>
          <span className="text-[12px] text-ink/45 font-medium">
            ({totalRejected} exclusion{totalRejected !== 1 ? "s" : ""})
          </span>
        </div>

        <svg
          className={cn(
            "w-5 h-5 text-ink/40 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Collapsible content */}
      {isOpen && (
        <div className="px-5 py-4 space-y-4 bg-softwhite animate-in slide-in-from-top-1 duration-200">
          {/* Macro Period Rejections */}
          {hasMacro && (
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-gold-dark mb-2.5">
                Large-Scale Blocks
              </h4>
              <div className="space-y-2">
                {macroEntries.map(([reason, count]) => (
                  <div
                    key={reason}
                    className={cn(
                      "flex items-center justify-between",
                      "px-4 py-3 rounded-lg",
                      "bg-status-warning/8 border border-status-warning/20",
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <svg
                        className="w-4 h-4 text-status-warning shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <span className="text-[13px] font-medium text-ink">
                        {formatReasonLabel(reason)}
                      </span>
                    </div>
                    <span className="text-[14px] font-serif font-bold text-status-warning tabular-nums">
                      {count} day{count !== 1 ? "s" : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Day-Level Rejections */}
          {hasDay && (
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-gold-dark mb-2.5">
                Day-Level Rejections
              </h4>
              <div className="rounded-lg border border-antique overflow-hidden">
                {/* Table header */}
                <div className="flex items-center bg-parchment/50 px-4 py-2">
                  <span className="flex-1 text-[11px] font-bold uppercase tracking-wider text-ink/50">
                    Reason
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-ink/50 w-20 text-right">
                    Count
                  </span>
                </div>

                {/* Table rows */}
                {dayEntries.map(([reason, count], i) => (
                  <div
                    key={reason}
                    className={cn(
                      "flex items-center px-4 py-2.5",
                      i < dayEntries.length - 1 && "border-b border-antique/40",
                    )}
                  >
                    <span className="flex-1 text-[13px] text-ink font-medium">
                      {formatReasonLabel(reason)}
                    </span>
                    <span className="text-[13px] font-serif font-bold text-ink/70 w-20 text-right tabular-nums">
                      {count}
                    </span>
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
