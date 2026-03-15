"use client";

import React from "react";
import Link from "next/link";
import { Clock, Sun, Moon, AlertTriangle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { KnowledgeTooltip } from "@/components/knowledge";
import { useTodayPanchang, useTodayInauspicious, useCurrentTimeQuality } from "@/hooks/queries/useMuhurta";
import { useTraditionStore } from "@/store/useTraditionStore";
import { Skeleton } from "@/components/ui/Skeleton";
import type { TimeQualityData, ChoghadiyaQuality, GowriQuality, BothQuality } from "@/types/muhurta.types";

/* ═══════════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════════ */

function shortTime(t: string | undefined | null): string {
    if (!t) return "-";
    const parts = t.split(":");
    return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : t;
}

/** Extract the primary segment name & auspicious flag from the discriminated union */
function resolveTimeQuality(tq: TimeQualityData): {
    name: string;
    auspicious: boolean;
    system: string;
} {
    switch (tq.system) {
        case "CHOGHADIYA":
            return {
                name: (tq as ChoghadiyaQuality).active_segment,
                auspicious: (tq as ChoghadiyaQuality).is_auspicious,
                system: "Choghadiya",
            };
        case "GOWRI_PANCHANGAM":
            return {
                name: (tq as GowriQuality).active_segment,
                auspicious: (tq as GowriQuality).is_auspicious,
                system: "Gowri",
            };
        case "BOTH": {
            const both = tq as BothQuality;
            // Prefer Choghadiya label, but show combined auspicious status
            return {
                name: both.choghadiya.active_segment,
                auspicious: both.both_auspicious,
                system: "Choghadiya + Gowri",
            };
        }
        default:
            return { name: "-", auspicious: false, system: "" };
    }
}

/* ═══════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

interface MuhuratDashboardWidgetProps {
    className?: string;
}

function MuhuratDashboardWidget({ className }: MuhuratDashboardWidgetProps) {
    const { tradition } = useTraditionStore();

    const panchangQ = useTodayPanchang();
    const inauspiciousQ = useTodayInauspicious(tradition);
    const timeQualityQ = useCurrentTimeQuality(tradition);

    const isLoading = panchangQ.isLoading || inauspiciousQ.isLoading || timeQualityQ.isLoading;
    const isError = panchangQ.isError || inauspiciousQ.isError || timeQualityQ.isError;

    /* ── Loading ── */
    if (isLoading) {
        return (
            <div className={cn("prem-card p-4", className)}>
                <div className="flex items-center justify-between mb-3">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-16" />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                    <Skeleton className="h-12 rounded-lg" />
                    <Skeleton className="h-12 rounded-lg" />
                    <Skeleton className="h-12 rounded-lg" />
                    <Skeleton className="h-12 rounded-lg" />
                </div>
            </div>
        );
    }

    /* ── Error ── */
    if (isError) {
        return (
            <div className={cn("prem-card p-4", className)}>
                <div className="flex items-center gap-2 text-sm text-ink/60">
                    <AlertTriangle className="w-4 h-4 text-gold-dark/60 shrink-0" />
                    <span>Could not load muhurat data</span>
                </div>
            </div>
        );
    }

    /* ── Data ── */
    const panchang = panchangQ.data;
    const inauspicious = inauspiciousQ.data;
    const timeQuality = timeQualityQ.data;

    const panchangItems = panchang
        ? [
              { label: "Tithi", value: panchang.panchang.tithi, term: "tithi" },
              { label: "Nakshatra", value: panchang.panchang.nakshatra, term: "nakshatra" },
              { label: "Yoga", value: panchang.panchang.yoga, term: "yoga" },
              { label: "Vara", value: panchang.vara ?? "-", term: "vara" },
          ]
        : [];

    // Time quality resolution
    const tqResolved = timeQuality?.time_quality
        ? resolveTimeQuality(timeQuality.time_quality)
        : null;

    // Rahu Kaal from inauspicious data
    const rahuKaal = inauspicious?.inauspicious_periods?.rahu_kaal;
    const rahuStart = shortTime(rahuKaal?.start_time);
    const rahuEnd = shortTime(rahuKaal?.end_time);

    // Sun timings
    const sunrise = shortTime(inauspicious?.sun_timings?.sunrise);
    const sunset = shortTime(inauspicious?.sun_timings?.sunset);

    return (
        <div className={cn("prem-card p-4", className)}>
            {/* ── Header ── */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gold-primary" />
                    <h3 className="text-sm font-semibold text-ink tracking-wide">
                        Muhurat
                    </h3>
                </div>
                <Link
                    href="/muhurta"
                    className="flex items-center gap-1 text-[11px] font-medium text-gold-dark hover:text-gold-primary transition-colors"
                >
                    View Full
                    <ArrowRight className="w-3 h-3" />
                </Link>
            </div>

            {/* ── Panchang 2x2 Grid ── */}
            {panchangItems.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-3">
                    {panchangItems.map((item) => (
                        <div
                            key={item.term}
                            className="bg-parchment/40 rounded-lg px-2.5 py-2 border border-gold-primary/8"
                        >
                            <KnowledgeTooltip term={item.term}>
                                <span className="text-[10px] uppercase tracking-[0.1em] text-gold-dark/70 font-semibold">
                                    {item.label}
                                </span>
                            </KnowledgeTooltip>
                            <p className="text-[13px] font-medium text-ink leading-tight mt-0.5 truncate">
                                {item.value}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Time Quality ── */}
            {tqResolved && (
                <div
                    className={cn(
                        "flex items-center justify-between rounded-lg px-2.5 py-2 mb-3 border",
                        tqResolved.auspicious
                            ? "bg-[rgba(91,122,74,0.08)] border-[rgba(91,122,74,0.18)]"
                            : "bg-[rgba(155,74,58,0.08)] border-[rgba(155,74,58,0.18)]"
                    )}
                >
                    <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-[0.1em] text-ink/50 font-semibold">
                            {tqResolved.system}
                        </p>
                        <p className="text-[13px] font-medium text-ink leading-tight truncate">
                            {tqResolved.name}
                        </p>
                    </div>
                    <span
                        className={cn(
                            "shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                            tqResolved.auspicious
                                ? "text-[#4A6741] bg-[rgba(91,122,74,0.18)]"
                                : "text-[#8B3A3A] bg-[rgba(155,74,58,0.18)]"
                        )}
                    >
                        {tqResolved.auspicious ? "Shubha" : "Ashubha"}
                    </span>
                </div>
            )}

            {/* ── Rahu Kaal ── */}
            {rahuKaal && (
                <div className="flex items-center gap-2 rounded-lg px-2.5 py-2 mb-3 bg-[rgba(155,74,58,0.06)] border border-[rgba(155,74,58,0.12)]">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#9B4A3A] shrink-0" />
                    <div className="min-w-0 flex-1">
                        <KnowledgeTooltip term="rahu_kaal">
                            <span className="text-[10px] uppercase tracking-[0.1em] text-[#9B4A3A]/80 font-semibold">
                                Rahu Kaal
                            </span>
                        </KnowledgeTooltip>
                    </div>
                    <span className="text-[12px] font-semibold text-[#8B3A3A] tabular-nums shrink-0">
                        {rahuStart} - {rahuEnd}
                    </span>
                </div>
            )}

            {/* ── Sunrise / Sunset ── */}
            {inauspicious?.sun_timings && (
                <div className="flex items-center justify-between text-[11px] text-ink/60">
                    <span className="flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5 text-[#B8650A]" />
                        <span className="font-medium tabular-nums">{sunrise}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Moon className="w-3.5 h-3.5 text-[#4A6FA5]" />
                        <span className="font-medium tabular-nums">{sunset}</span>
                    </span>
                </div>
            )}
        </div>
    );
}

export default MuhuratDashboardWidget;
