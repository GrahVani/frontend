"use client";

import { cn } from "@/lib/utils";
import type { KootaScore } from "@/types/matchmaking.types";
import { KnowledgeTooltip } from "@/components/knowledge";

/** Map koota display names → knowledge termKeys */
const KOOTA_TERM_MAP: Record<string, string> = {
    'Varna': 'koota_varna',
    'Vashya': 'koota_vashya',
    'Tara': 'koota_tara',
    'Yoni': 'koota_yoni',
    'Graha Maitri': 'koota_graha_maitri',
    'Gana': 'koota_gana',
    'Bhakoot': 'koota_bhakoot',
    'Nadi': 'koota_nadi',
    'Naadikoota': 'koota_nadi',
};

interface GunaChartProps {
    kootas: KootaScore[];
    totalScore: number;
    className?: string;
}

function getScoreColor(obtained: number, max: number): string {
    const ratio = obtained / max;
    if (ratio >= 0.75) return "bg-status-success";
    if (ratio >= 0.5) return "bg-gold-primary";
    if (ratio >= 0.25) return "bg-status-warning";
    return "bg-status-error";
}

function getScoreBgColor(obtained: number, max: number): string {
    const ratio = obtained / max;
    if (ratio >= 0.75) return "bg-status-success/10";
    if (ratio >= 0.5) return "bg-gold-primary/10";
    if (ratio >= 0.25) return "bg-status-warning/10";
    return "bg-status-error/10";
}

export default function GunaChart({ kootas, totalScore, className }: GunaChartProps) {
    return (
        <div className={cn("prem-card p-5", className)}>
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-[12px] font-bold text-gold-dark tracking-widest font-serif uppercase">
                    <KnowledgeTooltip term="koota_system">Ashta Koota</KnowledgeTooltip> Score
                </h3>
                <div className="flex items-center gap-2">
                    <span className="text-[24px] font-serif font-bold text-ink">{totalScore}</span>
                    <span className="text-[14px] text-ink/45">/ 36</span>
                </div>
            </div>

            <div className="space-y-3">
                {kootas.map((koota) => (
                    <div key={koota.name}>
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[14px] font-serif font-medium text-ink">
                                {KOOTA_TERM_MAP[koota.name]
                                    ? <KnowledgeTooltip term={KOOTA_TERM_MAP[koota.name]}>{koota.name}</KnowledgeTooltip>
                                    : koota.name}
                            </span>
                            <span className="text-[12px] font-medium text-ink/45">
                                {koota.obtainedScore} / {koota.maxScore}
                            </span>
                        </div>
                        <div className="h-2.5 bg-surface-warm rounded-full overflow-hidden">
                            <div
                                className={cn("h-full rounded-full transition-all", getScoreColor(koota.obtainedScore, koota.maxScore))}
                                style={{ width: `${(koota.obtainedScore / koota.maxScore) * 100}%` }}
                            />
                        </div>
                        <p className="text-[12px] text-ink/45 mt-0.5">{koota.description}</p>
                    </div>
                ))}
            </div>

            {/* Overall Score Summary */}
            <div className={cn(
                "mt-5 pt-4 border-t border-gold-primary/15 rounded-lg p-3",
                getScoreBgColor(totalScore, 36)
            )}>
                <div className="flex items-center justify-between">
                    <span className="text-[14px] font-serif font-bold text-ink">Overall Compatibility</span>
                    <span className="text-[14px] font-bold text-ink">{Math.round((totalScore / 36) * 100)}%</span>
                </div>
                <div className="h-3 bg-surface-warm rounded-full overflow-hidden mt-2">
                    <div
                        className={cn("h-full rounded-full", getScoreColor(totalScore, 36))}
                        style={{ width: `${(totalScore / 36) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
