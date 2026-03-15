"use client";

import { cn } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { KnowledgeTooltip } from "@/components/knowledge";
import {
  useTodayPanchang,
  useTodayInauspicious,
  useCurrentTimeQuality,
} from "@/hooks/queries/useMuhurta";
import { useTraditionStore } from "@/store/useTraditionStore";
import type { TimeQualityData, BothQuality } from "@/types/muhurta.types";

// ─── Props ──────────────────────────────────────────────────

interface DailyPanchangWidgetProps {
  className?: string;
}

// ─── Nature Badge Helper ────────────────────────────────────

function NatureBadge({ nature }: { nature: string }) {
  const normalized = nature.toLowerCase();
  const isAuspicious =
    normalized.includes("auspicious") ||
    normalized.includes("benefic") ||
    normalized.includes("good") ||
    normalized.includes("shubh");
  const isInauspicious =
    normalized.includes("inauspicious") ||
    normalized.includes("malefic") ||
    normalized.includes("bad") ||
    normalized.includes("ashubh");

  if (isAuspicious) return <Badge variant="success" size="sm">Auspicious</Badge>;
  if (isInauspicious) return <Badge variant="error" size="sm">Inauspicious</Badge>;
  return <Badge variant="default" size="sm">{nature}</Badge>;
}

// ─── Active Segment Extraction ──────────────────────────────

function getActiveSegment(tq: TimeQualityData): { name: string; isAuspicious: boolean; system: string } {
  if (tq.system === "BOTH") {
    const both = tq as BothQuality;
    return {
      name: both.choghadiya.active_segment,
      isAuspicious: both.both_auspicious,
      system: "Choghadiya + Gowri",
    };
  }
  return {
    name: tq.active_segment,
    isAuspicious: tq.is_auspicious,
    system: tq.system === "CHOGHADIYA" ? "Choghadiya" : "Gowri Panchangam",
  };
}

// ─── Skeleton State ─────────────────────────────────────────

function WidgetSkeleton() {
  return (
    <div className="space-y-4" aria-hidden="true">
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        ))}
      </div>
      <Skeleton className="h-px w-full" />
      <div className="flex gap-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-28" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-24" />
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────

export default function DailyPanchangWidget({ className }: DailyPanchangWidgetProps) {
  const tradition = useTraditionStore((s) => s.tradition);

  const panchangQuery = useTodayPanchang();
  const inauspiciousQuery = useTodayInauspicious(tradition);
  const timeQualityQuery = useCurrentTimeQuality(tradition);

  const isLoading = panchangQuery.isLoading || inauspiciousQuery.isLoading || timeQualityQuery.isLoading;
  const hasError = panchangQuery.isError || inauspiciousQuery.isError || timeQualityQuery.isError;

  const panchang = panchangQuery.data?.panchang;
  const vara = panchangQuery.data?.vara;
  const inauspicious = inauspiciousQuery.data;
  const timeQuality = timeQualityQuery.data?.time_quality;

  return (
    <div className={cn("prem-card p-5", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[16px] font-serif font-bold text-ink">
          Today&apos;s Panchang
        </h3>
        {vara && (
          <span className="text-[12px] text-gold-dark font-medium">{vara}</span>
        )}
      </div>

      {/* Loading */}
      {isLoading && <WidgetSkeleton />}

      {/* Error */}
      {!isLoading && hasError && (
        <p className="text-[13px] text-status-error/70 py-4 text-center">
          Unable to load panchang data. Please try again later.
        </p>
      )}

      {/* Loaded Content */}
      {!isLoading && !hasError && panchang && (
        <div className="space-y-4">
          {/* Panchang Row */}
          <div className="grid grid-cols-5 gap-2">
            {/* Tithi */}
            <div className="bg-surface-warm/40 rounded-lg p-2.5">
              <span className="text-[10px] text-ink/40 uppercase tracking-wider block mb-0.5">
                <KnowledgeTooltip term="muhurta_tithi">Tithi</KnowledgeTooltip>
              </span>
              <span className="text-[13px] font-serif font-bold text-ink block leading-tight">
                {panchang.tithi}
              </span>
              {panchang.tithi_group && (
                <NatureBadge nature={panchang.tithi_group} />
              )}
            </div>

            {/* Nakshatra */}
            <div className="bg-surface-warm/40 rounded-lg p-2.5">
              <span className="text-[10px] text-ink/40 uppercase tracking-wider block mb-0.5">
                <KnowledgeTooltip term="muhurta_nakshatra">Nakshatra</KnowledgeTooltip>
              </span>
              <span className="text-[13px] font-serif font-bold text-ink block leading-tight">
                {panchang.nakshatra}
              </span>
              {panchang.nakshatra_category && (
                <NatureBadge nature={panchang.nakshatra_category} />
              )}
            </div>

            {/* Yoga */}
            <div className="bg-surface-warm/40 rounded-lg p-2.5">
              <span className="text-[10px] text-ink/40 uppercase tracking-wider block mb-0.5">
                <KnowledgeTooltip term="muhurta_yoga_day">Yoga</KnowledgeTooltip>
              </span>
              <span className="text-[13px] font-serif font-bold text-ink block leading-tight">
                {panchang.yoga}
              </span>
              {panchang.yoga_nature && (
                <NatureBadge nature={panchang.yoga_nature} />
              )}
            </div>

            {/* Karana */}
            <div className="bg-surface-warm/40 rounded-lg p-2.5">
              <span className="text-[10px] text-ink/40 uppercase tracking-wider block mb-0.5">
                <KnowledgeTooltip term="muhurta_karana">Karana</KnowledgeTooltip>
              </span>
              <span className="text-[13px] font-serif font-bold text-ink block leading-tight">
                {panchang.karana}
              </span>
              {panchang.karana_nature && (
                <NatureBadge nature={panchang.karana_nature} />
              )}
            </div>

            {/* Vara (Day) */}
            <div className="bg-surface-warm/40 rounded-lg p-2.5">
              <span className="text-[10px] text-ink/40 uppercase tracking-wider block mb-0.5">
                <KnowledgeTooltip term="muhurta_vara">Vara</KnowledgeTooltip>
              </span>
              <span className="text-[13px] font-serif font-bold text-ink block leading-tight">
                {vara || panchang.paksha}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gold-primary/20 to-transparent" />

          {/* Time Quality Indicator */}
          {timeQuality && (() => {
            const seg = getActiveSegment(timeQuality);
            return (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-ink/40 uppercase tracking-wider">
                    Current {seg.system}
                  </span>
                  <span className="text-[14px] font-serif font-bold text-ink">{seg.name}</span>
                </div>
                <Badge variant={seg.isAuspicious ? "success" : "error"} size="sm">
                  {seg.isAuspicious ? "Auspicious" : "Inauspicious"}
                </Badge>
              </div>
            );
          })()}

          {/* Rahu Kaal + Sunrise/Sunset */}
          {inauspicious && (
            <div className="flex items-center gap-4 flex-wrap">
              {/* Next Rahu Kaal */}
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-3.5 h-3.5 text-status-error/60"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span className="text-[11px] text-ink/40 uppercase tracking-wider">Rahu Kaal</span>
                <span className="text-[13px] font-medium text-ink tabular-nums">
                  {inauspicious.inauspicious_periods.rahu_kaal.start_time}
                  {" — "}
                  {inauspicious.inauspicious_periods.rahu_kaal.end_time}
                </span>
              </div>

              <div className="h-4 w-px bg-gold-primary/15" />

              {/* Sunrise */}
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-gold-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 18a5 5 0 0 0-10 0" />
                  <line x1="12" y1="9" x2="12" y2="2" />
                  <line x1="4.22" y1="10.22" x2="5.64" y2="11.64" />
                  <line x1="1" y1="18" x2="3" y2="18" />
                  <line x1="21" y1="18" x2="23" y2="18" />
                  <line x1="18.36" y1="11.64" x2="19.78" y2="10.22" />
                </svg>
                <span className="text-[13px] font-medium text-ink tabular-nums">
                  {inauspicious.sun_timings.sunrise}
                </span>
              </div>

              {/* Sunset */}
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-gold-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 18a5 5 0 0 0-10 0" />
                  <line x1="12" y1="2" x2="12" y2="9" />
                  <line x1="4.22" y1="10.22" x2="5.64" y2="11.64" />
                  <line x1="1" y1="18" x2="3" y2="18" />
                  <line x1="21" y1="18" x2="23" y2="18" />
                  <line x1="18.36" y1="11.64" x2="19.78" y2="10.22" />
                </svg>
                <span className="text-[13px] font-medium text-ink tabular-nums">
                  {inauspicious.sun_timings.sunset}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
