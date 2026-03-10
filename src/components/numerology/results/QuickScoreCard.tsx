"use client";

import { cn } from "@/lib/utils";
import type { QuickScore } from "@/types/numerology.types";
import VerdictBadge from "./VerdictBadge";
import { Star } from "lucide-react";

interface QuickScoreCardProps {
    score: QuickScore;
    className?: string;
}

export default function QuickScoreCard({ score, className }: QuickScoreCardProps) {
    const percentage = (score.overall_rating / 10) * 100;
    const circumference = 2 * Math.PI * 40; // radius = 40
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className={cn("prem-card p-5 flex items-center gap-6", className)}>
            {/* Circular score ring */}
            <div className="relative w-24 h-24 shrink-0">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                    {/* Background ring */}
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(201,162,77,0.15)" strokeWidth="6" />
                    {/* Score ring */}
                    <circle
                        cx="50" cy="50" r="40" fill="none"
                        stroke="var(--gold-primary)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[22px] font-bold font-serif text-gold-dark">{score.overall_rating}</span>
                    <span className="text-[10px] font-medium text-amber-800/60">/10</span>
                </div>
            </div>

            {/* Rating details */}
            <div className="space-y-2">
                <p className="text-[16px] font-semibold text-primary">{score.rating_label}</p>

                {/* Stars */}
                <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }, (_, i) => (
                        <Star
                            key={i}
                            className={cn(
                                "w-4 h-4",
                                i < score.stars ? "fill-amber-400 text-amber-400" : "text-amber-200"
                            )}
                        />
                    ))}
                </div>

                <VerdictBadge verdict={score.verdict} />
            </div>
        </div>
    );
}
