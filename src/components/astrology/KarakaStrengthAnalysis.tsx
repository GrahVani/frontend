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
        <div className={cn("w-full space-y-6", className)}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Ayanamsa"
                    value={calculationMethod.ayanamsa || 'Standard'}
                    icon={<Shield className="w-4 h-4" />}
                    color="amber"
                />
                <StatCard
                    title="House System"
                    value={calculationMethod.house_system || 'Whole Sign'}
                    icon={<Activity className="w-4 h-4" />}
                    color="rose"
                />
                <StatCard
                    title="Highest Degree"
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

            <div className="bg-surface-warm border border-border-warm rounded-xl overflow-hidden shadow-sm">
                <div className="bg-border-warm px-4 py-2 border-b border-border-warm">
                    <h3 className={TYPOGRAPHY.sectionTitle}>Karaka Strength Analysis</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-parchment/30">
                                <th className={cn(TYPOGRAPHY.tableHeader, "px-4 py-3 border-b border-border-warm/30")}>Planet</th>
                                <th className={cn(TYPOGRAPHY.tableHeader, "px-4 py-3 border-b border-border-warm/30")}>Abbr</th>
                                <th className={cn(TYPOGRAPHY.tableHeader, "px-4 py-3 border-b border-border-warm/30")}>Chara Karaka</th>
                                <th className={cn(TYPOGRAPHY.tableHeader, "px-4 py-3 border-b border-border-warm/30")}>Sign/House</th>
                                <th className={cn(TYPOGRAPHY.tableHeader, "px-4 py-3 border-b border-border-warm/30 text-right")}>Degrees</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {karakas.map((k: KarakaEntry, idx: number) => (
                                <tr key={k.planet} className={cn(
                                    "hover:bg-parchment/50 transition-colors border-b border-border-warm/20 last:border-0",
                                    idx % 2 === 1 ? "bg-antique/5" : "bg-transparent",
                                    k.is_highest_degree && "bg-amber-50/30"
                                )}>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col">
                                            <span className={cn(TYPOGRAPHY.value, "mb-0.5")}>{k.planet}</span>
                                            <span className={cn(TYPOGRAPHY.subValue, "font-mono")}>{k.dms_in_sign}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 font-mono text-[11px] font-bold text-rose-600">
                                        {k.karaka_abbr}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col">
                                            <span className={cn(TYPOGRAPHY.value, "text-emerald-700 mb-0.5")}>{k.karaka_full}</span>
                                            <span className={cn(TYPOGRAPHY.subValue, "italic")}>{k.karaka_desc}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-primary">
                                        <span className={TYPOGRAPHY.value}>S{k.sign_index}</span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
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
            "p-4 rounded-2xl border flex items-center gap-4",
            color === 'amber' ? "bg-amber-50/50 border-amber-100" :
                color === 'rose' ? "bg-rose-50/50 border-rose-100" :
                    "bg-copper-50/50 border-copper-100"
        )}>
            <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm",
                color === 'amber' ? "bg-amber-100 text-amber-600" :
                    color === 'rose' ? "bg-rose-100 text-rose-600" :
                        "bg-copper-100 text-copper-600"
            )}>
                {icon}
            </div>
            <div>
                <p className={cn(TYPOGRAPHY.label, "mb-0")}>{title}</p>
                <p className={TYPOGRAPHY.value}>{value}</p>
            </div>
        </div>
    );
}

