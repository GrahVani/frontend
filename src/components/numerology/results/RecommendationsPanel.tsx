"use client";

import { cn } from "@/lib/utils";
import type { Recommendations } from "@/types/numerology.types";
import { CheckCircle, AlertTriangle, Gem } from "lucide-react";

interface RecommendationsPanelProps {
    recommendations: Recommendations;
    className?: string;
}

function renderLuckyValue(key: string, value: unknown): React.ReactNode {
    // Array of strings → individual badges
    if (Array.isArray(value) && value.every(v => typeof v === 'string')) {
        return (
            <div className="flex flex-wrap gap-1.5">
                {(value as string[]).map((item, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-lg text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                        {item}
                    </span>
                ))}
            </div>
        );
    }

    // Array of numbers → number pills
    if (Array.isArray(value) && value.every(v => typeof v === 'number')) {
        return (
            <div className="flex flex-wrap gap-1.5">
                {(value as number[]).map((item, i) => (
                    <span key={i} className="w-7 h-7 rounded-lg flex items-center justify-center text-[12px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        {item}
                    </span>
                ))}
            </div>
        );
    }

    // Single string value
    if (typeof value === 'string') {
        return <span className="text-[13px] font-semibold text-amber-800">{value}</span>;
    }

    // Number
    if (typeof value === 'number') {
        return <span className="text-[14px] font-bold text-gold-dark">{value}</span>;
    }

    // Fallback for other types
    return <span className="text-[13px] text-amber-800">{JSON.stringify(value)}</span>;
}

export default function RecommendationsPanel({ recommendations, className }: RecommendationsPanelProps) {
    const { action_items, lucky_elements, warnings, primary_action } = recommendations;
    const hasContent = action_items?.length || lucky_elements || warnings?.length || primary_action;
    if (!hasContent) return null;

    return (
        <div className={cn("prem-card p-5 space-y-4", className)}>
            <div className="flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600" />
                <h3 className="text-[14px] font-bold text-primary">Recommendations</h3>
            </div>

            {/* Primary action */}
            {primary_action && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <p className="text-[13px] text-emerald-800 font-medium">{primary_action}</p>
                </div>
            )}

            {/* Action items */}
            {action_items && action_items.length > 0 && (
                <ul className="space-y-2">
                    {action_items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-[13px] text-primary">
                            <CheckCircle className="w-3.5 h-3.5 text-gold-primary mt-0.5 shrink-0" />
                            <span>{typeof item === 'string' ? item : JSON.stringify(item)}</span>
                        </li>
                    ))}
                </ul>
            )}

            {/* Lucky elements — smart rendering */}
            {lucky_elements && Object.keys(lucky_elements).length > 0 && (
                <div className="space-y-3 pt-2 border-t border-gold-primary/10">
                    <div className="flex items-center gap-2">
                        <Gem className="w-4 h-4 text-amber-600" />
                        <span className="text-[12px] font-bold uppercase tracking-wider text-amber-700">Lucky Elements</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {Object.entries(lucky_elements).map(([key, value]) => (
                            <div key={key} className="space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700/60 block">{key.replace(/_/g, ' ')}</span>
                                {renderLuckyValue(key, value)}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Warnings */}
            {warnings && warnings.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-red-200/40">
                    {warnings.map((warning, i) => (
                        <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-red-50 border border-red-200">
                            <AlertTriangle className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
                            <span className="text-[12px] text-red-700">{typeof warning === 'string' ? warning : JSON.stringify(warning)}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
