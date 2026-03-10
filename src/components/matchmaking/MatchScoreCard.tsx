"use client";

import { Star, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import { KnowledgeTooltip } from "@/components/knowledge";
import type { MatchResult } from "@/types/matchmaking.types";

interface MatchScoreCardProps {
    result: MatchResult;
    className?: string;
}

const VERDICT_CONFIG: Record<MatchResult["overallVerdict"], {
    label: string;
    variant: "success" | "default" | "warning" | "error";
    color: string;
}> = {
    excellent: { label: "Excellent Match", variant: "success", color: "text-status-success" },
    good: { label: "Good Match", variant: "default", color: "text-gold-dark" },
    average: { label: "Average Match", variant: "warning", color: "text-status-warning" },
    below_average: { label: "Below Average", variant: "error", color: "text-status-error" },
};

export default function MatchScoreCard({ result, className }: MatchScoreCardProps) {
    const verdict = VERDICT_CONFIG[result.overallVerdict];

    return (
        <div className={cn("prem-card p-5", className)}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-[12px] font-bold text-gold-dark tracking-widest font-serif uppercase">
                    Match Summary
                </h3>
                <Badge variant={verdict.variant}>{verdict.label}</Badge>
            </div>

            {/* Score Circle */}
            <div className="flex items-center gap-6 mb-5">
                <div className="relative w-20 h-20 shrink-0">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="2" className="text-parchment" />
                        <circle
                            cx="18" cy="18" r="16" fill="none" strokeWidth="2.5"
                            strokeDasharray={`${(result.totalScore / 36) * 100} 100`}
                            strokeLinecap="round"
                            className={verdict.color}
                            stroke="currentColor"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[18px] font-serif font-bold text-ink">{result.totalScore}</span>
                    </div>
                </div>
                <div>
                    <p className="text-[14px] text-ink font-serif">
                        <span className="font-semibold">{result.bride.name}</span> &amp; <span className="font-semibold">{result.groom.name}</span>
                    </p>
                    <p className="text-[12px] text-ink/45 mt-0.5">Score: {result.totalScore} out of 36 points</p>
                </div>
            </div>

            {/* Dosha Flags */}
            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                    {result.manglikStatus.bride || result.manglikStatus.groom ? (
                        result.manglikStatus.cancelled ? (
                            <>
                                <CheckCircle className="w-4 h-4 text-status-success" />
                                <span className="text-[14px] text-ink"><KnowledgeTooltip term="manglik_dosha">Manglik Dosha</KnowledgeTooltip> — Cancelled</span>
                            </>
                        ) : (
                            <>
                                <AlertTriangle className="w-4 h-4 text-status-warning" />
                                <span className="text-[14px] text-ink"><KnowledgeTooltip term="manglik_dosha">Manglik Dosha</KnowledgeTooltip> Present</span>
                            </>
                        )
                    ) : (
                        <>
                            <CheckCircle className="w-4 h-4 text-status-success" />
                            <span className="text-[14px] text-ink">No <KnowledgeTooltip term="manglik_dosha">Manglik Dosha</KnowledgeTooltip></span>
                        </>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {result.naadiDosha ? (
                        <>
                            <XCircle className="w-4 h-4 text-status-error" />
                            <span className="text-[14px] text-ink"><KnowledgeTooltip term="naadi_dosha">Naadi Dosha</KnowledgeTooltip> Present</span>
                        </>
                    ) : (
                        <>
                            <CheckCircle className="w-4 h-4 text-status-success" />
                            <span className="text-[14px] text-ink">No <KnowledgeTooltip term="naadi_dosha">Naadi Dosha</KnowledgeTooltip></span>
                        </>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {result.bhakootDosha ? (
                        <>
                            <XCircle className="w-4 h-4 text-status-error" />
                            <span className="text-[14px] text-ink"><KnowledgeTooltip term="bhakoot_dosha">Bhakoot Dosha</KnowledgeTooltip> Present</span>
                        </>
                    ) : (
                        <>
                            <CheckCircle className="w-4 h-4 text-status-success" />
                            <span className="text-[14px] text-ink">No <KnowledgeTooltip term="bhakoot_dosha">Bhakoot Dosha</KnowledgeTooltip></span>
                        </>
                    )}
                </div>
            </div>

            {/* Recommendations */}
            {result.recommendations.length > 0 && (
                <div className="border-t border-gold-primary/15 pt-3">
                    <h4 className="text-[12px] font-bold text-gold-dark tracking-widest font-serif uppercase mb-2">
                        Recommendations
                    </h4>
                    <ul className="space-y-1">
                        {result.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                                <Star className="w-3.5 h-3.5 text-gold-primary mt-0.5 shrink-0" />
                                <span className="text-[12px] text-ink/45">{rec}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
