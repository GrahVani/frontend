"use client";

import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { KnowledgeTooltip } from "@/components/knowledge";
import type { MatchResult } from "@/types/matchmaking.types";

const DOSHA_TERM_MAP: Record<string, string> = {
    'Manglik Dosha': 'manglik_dosha',
    'Naadi Dosha': 'naadi_dosha',
    'Bhakoot Dosha': 'bhakoot_dosha',
};

interface DoshaComparisonViewProps {
    result: MatchResult;
    className?: string;
}

interface DoshaRow {
    name: string;
    brideStatus: boolean;
    groomStatus: boolean;
    cancelled: boolean;
    severity: "high" | "medium" | "low";
}

export default function DoshaComparisonView({ result, className }: DoshaComparisonViewProps) {
    const doshas: DoshaRow[] = [
        {
            name: "Manglik Dosha",
            brideStatus: result.manglikStatus.bride,
            groomStatus: result.manglikStatus.groom,
            cancelled: result.manglikStatus.cancelled,
            severity: "high",
        },
        {
            name: "Naadi Dosha",
            brideStatus: result.naadiDosha,
            groomStatus: result.naadiDosha,
            cancelled: false,
            severity: "high",
        },
        {
            name: "Bhakoot Dosha",
            brideStatus: result.bhakootDosha,
            groomStatus: result.bhakootDosha,
            cancelled: false,
            severity: "medium",
        },
    ];

    return (
        <div className={cn("prem-card p-5", className)}>
            <h3 className="text-[12px] font-bold text-gold-dark tracking-widest font-serif uppercase mb-4">
                Dosha Comparison
            </h3>

            <div className="overflow-x-auto">
                <table className="w-full" role="table">
                    <thead>
                        <tr className="border-b border-gold-primary/15">
                            <th className="text-left text-[12px] font-serif font-semibold text-ink py-2 pr-4">Dosha</th>
                            <th className="text-center text-[12px] font-serif font-semibold text-ink py-2 px-4">{result.bride.name}</th>
                            <th className="text-center text-[12px] font-serif font-semibold text-ink py-2 px-4">{result.groom.name}</th>
                            <th className="text-center text-[12px] font-serif font-semibold text-ink py-2 pl-4">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {doshas.map((dosha) => (
                            <tr key={dosha.name} className="border-b border-gold-primary/20">
                                <td className="py-3 pr-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[14px] font-serif text-ink">
                                            {DOSHA_TERM_MAP[dosha.name]
                                                ? <KnowledgeTooltip term={DOSHA_TERM_MAP[dosha.name]}>{dosha.name}</KnowledgeTooltip>
                                                : dosha.name}
                                        </span>
                                        {dosha.severity === "high" && (
                                            <span className="text-[10px] font-medium text-status-error bg-status-error/10 px-1.5 py-0.5 rounded">Critical</span>
                                        )}
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-center">
                                    {dosha.brideStatus ? (
                                        <XCircle className="w-5 h-5 text-status-error mx-auto" />
                                    ) : (
                                        <CheckCircle className="w-5 h-5 text-status-success mx-auto" />
                                    )}
                                </td>
                                <td className="py-3 px-4 text-center">
                                    {dosha.groomStatus ? (
                                        <XCircle className="w-5 h-5 text-status-error mx-auto" />
                                    ) : (
                                        <CheckCircle className="w-5 h-5 text-status-success mx-auto" />
                                    )}
                                </td>
                                <td className="py-3 pl-4 text-center">
                                    {!dosha.brideStatus && !dosha.groomStatus ? (
                                        <span className="text-[12px] font-medium text-status-success">Clear</span>
                                    ) : dosha.cancelled ? (
                                        <span className="text-[12px] font-medium text-gold-dark">Cancelled</span>
                                    ) : (
                                        <span className="text-[12px] font-medium text-status-error">Present</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
