"use client";

import { CheckCircle, AlertTriangle, Clock, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import type { MuhurtaResult as MuhurtaResultType, MuhurtaQuality } from "@/types/muhurta.types";

const QUALITY_BADGE: Record<MuhurtaQuality, { variant: "success" | "default" | "warning" | "error"; label: string }> = {
    excellent: { variant: "success", label: "Excellent" },
    good: { variant: "default", label: "Good" },
    average: { variant: "warning", label: "Average" },
    avoid: { variant: "error", label: "Avoid" },
};

interface MuhurtaResultCardProps {
    result: MuhurtaResultType;
    className?: string;
}

export default function MuhurtaResultCard({ result, className }: MuhurtaResultCardProps) {
    const badge = QUALITY_BADGE[result.quality];

    return (
        <div className={cn("bg-softwhite border border-antique rounded-xl p-5 hover:shadow-md transition-shadow", className)}>
            <div className="flex items-start justify-between mb-3">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-serif font-bold text-ink">{result.date}</h3>
                        <Badge variant={badge.variant} size="sm">{badge.label}</Badge>
                    </div>
                    <p className="text-sm text-muted-refined">{result.dayOfWeek}</p>
                </div>
                <div className="flex items-center gap-1.5 bg-parchment/50 px-3 py-1.5 rounded-lg">
                    <Star className="w-4 h-4 text-gold-primary" />
                    <span className="text-sm font-bold font-serif text-ink">{result.score}/100</span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="bg-parchment/40 rounded-lg p-2">
                    <span className="text-xs text-muted-refined block">Tithi</span>
                    <span className="text-sm font-serif font-semibold text-ink">{result.tithi}</span>
                </div>
                <div className="bg-parchment/40 rounded-lg p-2">
                    <span className="text-xs text-muted-refined block">Nakshatra</span>
                    <span className="text-sm font-serif font-semibold text-ink">{result.nakshatra}</span>
                </div>
                <div className="bg-parchment/40 rounded-lg p-2">
                    <span className="text-xs text-muted-refined block">Yoga</span>
                    <span className="text-sm font-serif font-semibold text-ink">{result.yoga}</span>
                </div>
            </div>

            <div className="flex items-center gap-1.5 mb-3">
                <Clock className="w-3.5 h-3.5 text-gold-dark" />
                <span className="text-sm text-ink font-medium">Best window: {result.bestTimeWindow}</span>
            </div>

            {result.reasons.length > 0 && (
                <div className="space-y-1">
                    {result.reasons.map((reason, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5 text-status-success mt-0.5 shrink-0" />
                            <span className="text-xs text-muted-refined">{reason}</span>
                        </div>
                    ))}
                </div>
            )}

            {result.warnings && result.warnings.length > 0 && (
                <div className="mt-2 space-y-1">
                    {result.warnings.map((warning, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-status-warning mt-0.5 shrink-0" />
                            <span className="text-xs text-muted-refined">{warning}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
