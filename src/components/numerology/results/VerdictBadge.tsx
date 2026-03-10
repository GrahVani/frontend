"use client";

import { cn } from "@/lib/utils";
import type { Verdict } from "@/types/numerology.types";

const VERDICT_STYLES: Record<Verdict, string> = {
    HIGHLY_FAVORABLE: "bg-amber-100 text-amber-800 border-amber-300",
    FAVORABLE: "bg-emerald-100 text-emerald-800 border-emerald-300",
    NEUTRAL: "bg-yellow-100 text-yellow-800 border-yellow-300",
    UNFAVORABLE: "bg-red-100 text-red-800 border-red-300",
};

const VERDICT_LABELS: Record<Verdict, string> = {
    HIGHLY_FAVORABLE: "Highly Favorable",
    FAVORABLE: "Favorable",
    NEUTRAL: "Neutral",
    UNFAVORABLE: "Unfavorable",
};

interface VerdictBadgeProps {
    verdict: Verdict;
    className?: string;
}

export default function VerdictBadge({ verdict, className }: VerdictBadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border",
                VERDICT_STYLES[verdict],
                className,
            )}
        >
            {VERDICT_LABELS[verdict]}
        </span>
    );
}
