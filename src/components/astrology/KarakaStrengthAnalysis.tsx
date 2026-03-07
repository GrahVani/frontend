"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { Shield, Activity, Target, Zap } from 'lucide-react';

interface KarakaEntry {
    planet: string;
    karaka_abbr: string;
    karaka_full: string;
    karaka_desc: string;
    sign_index: number;
    degrees_in_sign: number;
    dms_in_sign: string;
    is_highest_degree: boolean;
}

interface KarakaData {
    karakas: KarakaEntry[];
    calculation_method?: {
        ayanamsa?: string;
        house_system?: string;
    };
}

interface KarakaStrengthAnalysisProps {
    data: KarakaData;
    className?: string;
}

export default function KarakaStrengthAnalysis({ data, className }: KarakaStrengthAnalysisProps) {
    if (!data || !data.karakas) return null;

    const karakas = data.karakas || [];
    const calculationMethod = data.calculation_method || {};
    const atmakaraka = karakas.find((k: KarakaEntry) => k.karaka_abbr === 'AK');

    return (
        <div className={cn("flex flex-col xl:flex-row gap-6 w-full items-start", className)}>
            <div className="flex flex-col gap-4 w-full xl:w-72 shrink-0 order-1 xl:order-2">
                <StatCard
                    title="Ayanamsa"
                    value={calculationMethod.ayanamsa || 'Standard'}
                    icon={<Shield className="w-4 h-4" />}
                    color="amber"
                />
                <StatCard
                    title="House system"
                    value={calculationMethod.house_system || 'Whole sign'}
                    icon={<Activity className="w-4 h-4" />}
                    color="rose"
                />
                <StatCard
                    title="Highest degree"
                    value={karakas.find((k: KarakaEntry) => k.is_highest_degree)?.degrees_in_sign?.toFixed(2) || '0.00'}
                    icon={<Zap className="w-4 h-4" />}
                    color="copper"
                />
                <StatCard
                    title="Atmakaraka"
                    value={atmakaraka?.planet || 'N/A'}
                    icon={<Target className="w-4 h-4" />}
                    color="amber"
                />
            </div>

            <div className="bg-surface-warm border border-border-warm rounded-xl overflow-hidden shadow-sm w-full xl:flex-1 order-2 xl:order-1">
                <div className="bg-border-warm px-4 py-2 border-b border-border-warm">
                    <h3 className={TYPOGRAPHY.sectionTitle}>Karaka strength analysis</h3>
                </div>
                <div className="w-full">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-parchment/30">
                                <th className={cn(TYPOGRAPHY.tableHeader, "px-4 py-1.5 border-b border-border-warm/30")}>Planet</th>
                                <th className={cn(TYPOGRAPHY.tableHeader, "px-4 py-1.5 border-b border-border-warm/30")}>Abbr</th>
                                <th className={cn(TYPOGRAPHY.tableHeader, "px-4 py-1.5 border-b border-border-warm/30")}>Chara karaka</th>
                                <th className={cn(TYPOGRAPHY.tableHeader, "px-4 py-1.5 border-b border-border-warm/30")}>Sign/house</th>
                                <th className={cn(TYPOGRAPHY.tableHeader, "px-4 py-1.5 border-b border-border-warm/30 text-right")}>Degrees</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {karakas.map((k: KarakaEntry, idx: number) => (
                                <tr key={k.planet} className={cn(
                                    "hover:bg-parchment/50 transition-colors border-b border-border-warm/20 last:border-0",
                                    idx % 2 === 1 ? "bg-antique/5" : "bg-transparent",
                                    k.is_highest_degree && "bg-amber-50/30"
                                )}>
                                    <td className="px-4 py-1.5">
                                        <div className="flex flex-col">
                                            <span className={cn(TYPOGRAPHY.value, "mb-0")}>{k.planet}</span>
                                            <span className={cn(TYPOGRAPHY.subValue, "font-mono")}>{k.dms_in_sign}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-1.5 font-mono text-[11px] font-bold text-rose-600">
                                        {k.karaka_abbr}
                                    </td>
                                    <td className="px-4 py-1.5">
                                        <div className="flex flex-col">
                                            <span className={cn(TYPOGRAPHY.value, "text-emerald-700 mb-0")}>{k.karaka_full}</span>
                                            <span className={cn(TYPOGRAPHY.subValue, "italic")}>{k.karaka_desc}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-1.5 text-primary">
                                        <span className={TYPOGRAPHY.value}>S{k.sign_index}</span>
                                    </td>
                                    <td className="px-4 py-1.5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <div className="w-24 h-1.5 bg-antique/20 rounded-full overflow-hidden hidden sm:block">
                                                <div
                                                    className="h-full bg-gold-primary rounded-full"
                                                    style={{ width: `${(k.degrees_in_sign / 30) * 100}%` }}
                                                />
                                            </div>
                                            <span className={cn(TYPOGRAPHY.value, "font-mono w-10 text-right")}>
                                                {k.degrees_in_sign.toFixed(2)}Â°
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode; color: 'amber' | 'rose' | 'copper' }) {
    return (
        <div className={cn(
            "p-3.5 sm:p-5 rounded-[24px] flex items-center gap-4 transition-all w-full",
            color === 'amber' ? "bg-[#F5ECD2]" :
                color === 'rose' ? "bg-[#F5E2E2]" :
                    "bg-[#DECFC4] border border-[#3E342B]" // copper border
        )}>
            <div className={cn(
                "w-11 h-11 shrink-0 rounded-[16px] flex items-center justify-center shadow-sm",
                color === 'amber' ? "bg-[#FDF4D4] text-[#D87100]" :
                    color === 'rose' ? "bg-[#FFEAF0] text-[#E30A40]" :
                        "bg-[#EBE2D8] text-[#3E342B]" // copper icon
            )}>
                {icon}
            </div>
            <div className="flex flex-col justify-center">
                <p className="text-[13px] font-bold text-[#3E342B]/80 mb-0 leading-tight">{title}</p>
                <p className="text-[16px] font-bold text-[#3E342B] leading-tight mt-0.5">{value}</p>
            </div>
        </div>
    );
}

