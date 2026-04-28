import React from 'react';
import { KpFortunaResponse } from '@/types/kp.types';
import { cn } from '@/lib/utils';
import { Calculator, ArrowRight } from 'lucide-react';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { KnowledgeTooltip } from '@/components/knowledge';

interface KpFortunaViewPropsNew {
    data: KpFortunaResponse;
}

export const KpFortunaView: React.FC<KpFortunaViewPropsNew> = ({ data }) => {
    const { fortunaData } = data;

    if (!fortunaData) return <div className="p-8 text-center text-amber-900">Fortuna Data Unavailable</div>;

    const { calculation, fortunaHouse } = fortunaData;

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in zoom-in duration-700">

            <div className="bg-white border border-amber-200/60 rounded-2xl shadow-sm overflow-hidden">
                <div className="bg-amber-50/60 p-4 border-b border-amber-200/50 flex items-center justify-between">
                    <h3 className={cn(TYPOGRAPHY.value, "text-[18px] text-ink flex items-center gap-2")}>
                        <Calculator className="w-5 h-5 text-amber-700" />
                        Mathematical derivation (<KnowledgeTooltip term="kp_fortuna">Pars Fortuna</KnowledgeTooltip>)
                    </h3>
                    <span className={cn(TYPOGRAPHY.label, "text-[10px] opacity-70")}>Formula: ascendant + moon - sun</span>
                </div>

                <table className="w-full text-[14px] text-left font-sans text-ink">
                    <thead className="bg-amber-50/60 backdrop-blur-sm border-b border-amber-200/50 tracking-wide sticky top-0 z-10">
                        <tr>
                            <th className={cn(TYPOGRAPHY.tableHeader, "px-3 py-1.5 w-1/4")}>Component</th>
                            <th className={cn(TYPOGRAPHY.tableHeader, "px-3 py-1.5 w-1/4")}>Longitude (deg)</th>
                            <th className={cn(TYPOGRAPHY.tableHeader, "px-3 py-1.5 w-1/4")}>Sign</th>
                            <th className={cn(TYPOGRAPHY.tableHeader, "px-3 py-1.5 w-1/4")}>House</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-200/40">
                        {(Array.isArray(calculation) ? calculation : Object.values(calculation || {})).map((r: any, idx) => {
                            const row = r as { component: string; dms: string; longitude: number; sign: string; house: number }; return (
                                <tr key={row.component} className={cn(
                                    "transition-colors",
                                    row.component === 'Pars Fortuna' ? "bg-amber-100 font-bold text-amber-800" : "hover:bg-amber-50 bg-white"
                                )}>
                                    <td className="px-3 py-1.5 flex items-center gap-2">
                                        {row.component === 'Pars Fortuna' && <span className="text-[20px] text-amber-800/80">⊗</span>}
                                        <span className={cn(TYPOGRAPHY.value, row.component === 'Pars Fortuna' && "!text-amber-800 font-bold")}>{row.component}</span>
                                    </td>
                                    <td className="px-3 py-1.5 whitespace-nowrap">
                                        <span className={cn(TYPOGRAPHY.value, "font-mono text-[12px]")}>{row.dms}</span>
                                        <span className={cn(TYPOGRAPHY.subValue, "text-[10px] ml-1")}>({row.longitude.toFixed(2)}°)</span>
                                    </td>
                                    <td className="px-3 py-1.5 whitespace-nowrap">
                                        <span className={TYPOGRAPHY.value}>{row.sign}</span>
                                    </td>
                                    <td className="px-3 py-1.5">
                                        <span className={TYPOGRAPHY.value}>{row.house}</span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Analysis Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-200/60 shadow-sm">
                    <h4 className={cn(TYPOGRAPHY.value, "text-emerald-800 mb-2 flex items-center gap-2")}>
                        <ArrowRight className="w-4 h-4 text-emerald-600" />
                        <KnowledgeTooltip term="kp_fortuna" unstyled>Fortuna</KnowledgeTooltip> placement
                    </h4>
                    {fortunaHouse ? (
                        <>
                            <p className={cn(TYPOGRAPHY.subValue, "text-emerald-900 leading-relaxed font-sans")}>
                                <KnowledgeTooltip term="kp_fortuna">Fortuna</KnowledgeTooltip> is located in <strong className="font-bold text-ink">{fortunaHouse.sign}</strong>
                                in the <strong className="font-bold text-ink">House {fortunaHouse.houseNumber}</strong>.
                            </p>
                            <p className={cn(TYPOGRAPHY.label, "text-[10px] text-emerald-700/70 mt-3 font-mono")}>
                                Cusp Longitude: {fortunaHouse.cuspLongitude}
                            </p>
                        </>
                    ) : (
                        <p className="text-[14px] text-ink">Placement details unavailable</p>
                    )}
                </div>

                <div className="p-6 rounded-2xl bg-white border border-amber-200/60 shadow-sm">
                    <h4 className={cn(TYPOGRAPHY.value, "text-ink mb-3")}>Interpretation key</h4>
                    <ul className={cn(TYPOGRAPHY.subValue, "text-[14px] space-y-2 list-disc pl-5")}>
                        <li><strong className="text-ink">Formula</strong>: Used for Day Birth. (Night Birth reverses Sun/Moon).</li>
                        <li><strong className="text-ink">House</strong>: The area of life where material prosperity is most easily accessible.</li>
                        <li><strong className="text-ink">Sign</strong>: The manner in which you achieve success.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
