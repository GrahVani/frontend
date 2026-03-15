"use client";

import { cn } from "@/lib/utils";
import { KnowledgeTooltip } from "@/components/knowledge";
import type { DateVerdict } from "@/types/muhurta.types";

// ─── Props ──────────────────────────────────────────────────

interface DateVerdictCardProps {
  verdict: DateVerdict;
  className?: string;
}

// ─── Main Component ─────────────────────────────────────────

export default function DateVerdictCard({ verdict, className }: DateVerdictCardProps) {
  const { is_suitable, date_display, event, summary, reasons, recommendation } = verdict;

  return (
    <div className={cn("prem-card overflow-hidden", className)}>
      {/* Verdict Banner */}
      <div
        className={cn(
          "flex flex-col items-center justify-center py-8 px-6",
          is_suitable
            ? "bg-status-success/8"
            : "bg-status-error/6",
        )}
      >
        {/* Icon */}
        {is_suitable ? (
          <svg
            className="w-16 h-16 text-status-success mb-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        ) : (
          <svg
            className="w-16 h-16 text-status-error mb-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        )}

        {/* Verdict text */}
        <h2
          className={cn(
            "text-[24px] font-serif font-bold tracking-wide",
            is_suitable ? "text-status-success" : "text-status-error",
          )}
        >
          <KnowledgeTooltip term="muhurta" unstyled>
            {is_suitable ? "Suitable" : "Not Suitable"}
          </KnowledgeTooltip>
        </h2>
      </div>

      {/* Content body */}
      <div className="px-6 py-5 space-y-5">
        {/* Date + Event */}
        <div className="text-center">
          <h3 className="text-[22px] font-serif font-bold text-ink">{date_display}</h3>
          <p className="text-[14px] text-gold-dark font-medium mt-1">{event}</p>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gold-primary/25 to-transparent" />

        {/* Summary */}
        <p className="text-[14px] text-ink/80 leading-relaxed">{summary}</p>

        {/* Reasons */}
        {reasons.length > 0 && (
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-gold-dark mb-2">
              Reasons
            </h4>
            <ul className="space-y-1.5">
              {reasons.map((reason, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span
                    className={cn(
                      "mt-1.5 w-2 h-2 rounded-full shrink-0",
                      is_suitable ? "bg-status-success/50" : "bg-status-error/50",
                    )}
                  />
                  <span className="text-[13px] text-ink/70 leading-relaxed">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendation */}
        {recommendation && (
          <>
            <div className="h-px bg-gradient-to-r from-transparent via-gold-primary/25 to-transparent" />

            <div className="flex gap-3 p-4 rounded-lg bg-gold-primary/6 border border-gold-primary/15">
              <svg
                className="w-5 h-5 text-gold-dark shrink-0 mt-0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18h6" />
                <path d="M10 22h4" />
                <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
              </svg>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-gold-dark block mb-1">
                  Recommendation
                </span>
                <p className="text-[13px] text-ink/80 leading-relaxed">{recommendation}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
