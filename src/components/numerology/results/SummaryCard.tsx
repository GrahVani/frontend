"use client";

import { cn } from "@/lib/utils";
import type { AnalysisSummary } from "@/types/numerology.types";
import { Lightbulb, MessageCircle, ArrowRight } from "lucide-react";

interface SummaryCardProps {
    summary: AnalysisSummary;
    className?: string;
}

export default function SummaryCard({ summary, className }: SummaryCardProps) {
    return (
        <div className={cn("prem-card p-5 space-y-4", className)}>
            {/* One-liner */}
            <p className="text-[16px] font-serif font-semibold text-primary leading-relaxed">
                &ldquo;{summary.one_liner}&rdquo;
            </p>

            {/* Key insight */}
            <div className="flex items-start gap-3">
                <Lightbulb className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700 mb-1">Key Insight</p>
                    <p className="text-[14px] text-primary leading-relaxed">{summary.key_insight}</p>
                </div>
            </div>

            {/* Recommendation */}
            <div className="flex items-start gap-3">
                <ArrowRight className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 mb-1">Recommendation</p>
                    <p className="text-[14px] text-primary leading-relaxed">{summary.recommendation}</p>
                </div>
            </div>
        </div>
    );
}
