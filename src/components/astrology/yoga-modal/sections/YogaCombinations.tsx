'use client';

import React, { memo } from 'react';
import { Layers, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { KnowledgeTooltip } from '@/components/knowledge';
import type { NormalizedCombination } from '@/types/yoga.types';

interface YogaCombinationsProps {
    data: NormalizedCombination[];
}

export const YogaCombinations = memo(function YogaCombinations({ data }: YogaCombinationsProps) {
    if (data.length === 0) return null;

    return (
        <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm p-5">
            <h3 className="font-serif font-bold text-amber-900 mb-4 flex items-center gap-2 text-[14px] uppercase tracking-wider">
                <Layers className="w-4 h-4 text-amber-500" /> <KnowledgeTooltip term="yoga_system">Yoga</KnowledgeTooltip> Combinations
            </h3>

            <div className="space-y-3">
                {data.map((combo, i) => (
                    <div
                        key={i}
                        className={cn(
                            'rounded-xl border p-4 transition-colors',
                            combo.present
                                ? 'bg-white border-emerald-100 hover:border-emerald-200'
                                : 'bg-zinc-50 border-zinc-200 opacity-60'
                        )}
                    >
                        {/* Top Row: Type + Status */}
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                {combo.present ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                ) : (
                                    <XCircle className="w-3.5 h-3.5 text-zinc-400" />
                                )}
                                <span className="text-[12px] font-bold text-amber-900 capitalize">
                                    {combo.type.replace(/_/g, ' ')}
                                </span>
                            </div>
                            {combo.strengthScore !== undefined && (
                                <span className="text-[10px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                                    {combo.strengthScore} pts
                                </span>
                            )}
                        </div>

                        {/* Detail Chips */}
                        <div className="flex flex-wrap gap-1.5 mb-2">
                            {combo.sign && (
                                <span className="px-2 py-0.5 bg-amber-50/60 text-amber-900 border border-amber-200/60 rounded text-[9px] font-bold">
                                    {combo.sign}
                                </span>
                            )}
                            {combo.house !== undefined && (
                                <span className="px-2 py-0.5 bg-amber-50/60 text-amber-900 border border-amber-200/60 rounded text-[9px] font-bold">
                                    House {combo.house}
                                </span>
                            )}
                            {combo.houseCategory && (
                                <span className="px-2 py-0.5 bg-amber-50/60 text-amber-900 border border-amber-200/60 rounded text-[9px] font-bold capitalize">
                                    {combo.houseCategory}
                                </span>
                            )}
                            {combo.orbDegrees !== undefined && (
                                <span className="px-2 py-0.5 bg-amber-50/60 text-amber-900 border border-amber-200/60 rounded text-[9px] font-bold">
                                    Orb: {combo.orbDegrees}Â°
                                </span>
                            )}
                            {combo.overallStrength && (
                                <span className={cn(
                                    "px-2 py-0.5 rounded text-[9px] font-bold capitalize border",
                                    combo.overallStrength === 'very_good' || combo.overallStrength === 'excellent'
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                        : combo.overallStrength === 'good'
                                            ? "bg-amber-50 text-amber-700 border-amber-200/60"
                                            : "bg-zinc-100 text-zinc-600 border-zinc-200"
                                )}>
                                    {combo.overallStrength.replace(/_/g, ' ')}
                                </span>
                            )}
                            {combo.nakshatraNumber !== undefined && (
                                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded text-[9px] font-bold">
                                    <KnowledgeTooltip term="nakshatra" unstyled>Nakshatra</KnowledgeTooltip> #{combo.nakshatraNumber}
                                </span>
                            )}
                        </div>

                        {/* Effects */}
                        {combo.effects.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {combo.effects.map(effect => (
                                    <span
                                        key={effect}
                                        className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full text-[9px] font-medium capitalize"
                                    >
                                        {effect.replace(/_/g, ' ')}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
});

