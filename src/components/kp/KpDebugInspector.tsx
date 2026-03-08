"use client";

import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

type KpTab = 'planets-cusps' | 'significations' | 'planetary-significators' | 'bhava-details' | 'ruling-planets' | 'horary' | 'interlinks' | 'advanced-ssl' | 'fortuna' | 'nakshatra-nadi' | 'ashtakavarga';

interface KpDebugInspectorProps {
    activeTab: KpTab;
    ayanamsa: string;
    clientId: string;
    processedCharts: Record<string, unknown>;
    queryDataByTab: Record<string, unknown>;
}

const STORAGE_ITEMS = [
    { id: 'D1_kp', label: 'Natal Chart (KP)' },
    { id: 'kp_planets_cusps_kp', label: 'Planets & Cusps' },
    { id: 'kp_significations_kp', label: 'Significations' },
    { id: 'kp_house_significations_kp', label: 'House Table' },
    { id: 'kp_planet_significators_kp', label: 'Planet Matrix' },
    { id: 'kp_bhava_details_kp', label: 'Bhava Details' },
    { id: 'kp_interlinks_kp', label: 'Interlinks' },
    { id: 'kp_interlinks_advanced_kp', label: 'Advanced SSL' },
    { id: 'kp_interlinks_sl_kp', label: 'Interlinks (SL)' },
    { id: 'kp_nakshatra_nadi_kp', label: 'Nakshatra Nadi' },
    { id: 'kp_fortuna_kp', label: 'Pars Fortuna' },
    { id: 'kp_ruling_planets_kp', label: 'Ruling Planets' },
    { id: 'dasha_chara_kp', label: 'Chara Dasha' },
    { id: 'shodasha_varga_signs_kp', label: 'Shodasha Varga' },
] as const;

export default function KpDebugInspector({
    activeTab,
    ayanamsa,
    clientId,
    processedCharts,
    queryDataByTab,
}: KpDebugInspectorProps) {
    return (
        <div className="mt-8 pt-8 border-t border-gold-primary/15">
            <details className="bg-ink rounded-xl overflow-hidden shadow-2xl border border-white/5">
                <summary className="p-4 text-white font-mono text-[12px] cursor-pointer hover:bg-ink/90 transition-colors flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <Star className="w-3 h-3 text-gold-primary" />
                        KP Storage & Debug Inspector
                    </span>
                    <span className="text-[10px] opacity-50 uppercase tracking-widest">Click to Expand</span>
                </summary>
                <div className="p-6 bg-ink space-y-6">
                    {/* Storage Status Grid */}
                    <div>
                        <h4 className="text-[10px] uppercase tracking-[0.2em] text-gold-primary mb-3 font-bold">Database Storage Status</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                            {STORAGE_ITEMS.map((item) => {
                                const isSaved = !!(processedCharts as Record<string, unknown>)[item.id];
                                return (
                                    <div key={item.id} className={cn(
                                        "p-2 rounded border text-[10px] font-mono flex items-center justify-between gap-2",
                                        isSaved
                                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                            : "bg-rose-500/10 border-rose-500/30 text-rose-400 opacity-60"
                                    )}>
                                        <span className="truncate">{item.label}</span>
                                        <span className="flex-shrink-0">{isSaved ? 'SAVED' : 'MISS'}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Raw API Response Viewers */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-[10px] uppercase tracking-[0.2em] text-gold-primary mb-3 font-bold">Active Tab Query State</h4>
                            <div className="bg-black/40 rounded p-3 h-[200px] overflow-auto border border-white/5 scrollbar-thin">
                                <pre className="text-green-500 text-[10px] leading-relaxed">
                                    {JSON.stringify(queryDataByTab[activeTab] ?? null, null, 2)}
                                </pre>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-[10px] uppercase tracking-[0.2em] text-gold-primary mb-3 font-bold">Full Payload Inspector</h4>
                            <div className="bg-black/40 rounded p-3 h-[200px] overflow-auto border border-white/5 scrollbar-thin">
                                <pre className="text-blue-400 text-[10px] leading-relaxed">
                                    {JSON.stringify({
                                        processedKeys: Object.keys(processedCharts).filter(k => k.toLowerCase().includes('kp') || k.startsWith('D1')),
                                        ayanamsa,
                                        clientId,
                                        tab: activeTab,
                                    }, null, 2)}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </details>
        </div>
    );
}
