"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Star, Shield, Zap, TrendingDown, Anchor } from 'lucide-react';

export interface DetailedPlanetInfo {
    planet: string;
    sign: string;
    degree: string;
    nakshatra: string;
    pada: number;
    nakshatraLord: string;
    house: number;
    isRetro?: boolean;
    dignity?: 'Exalted' | 'Debilitated' | 'Moolatrikona' | 'Own Sign' | 'Friend' | 'Neutral' | 'Enemy';
    isCombust?: boolean;
    shadbala?: number; // In Rupas
    avastha?: string; // e.g., Jagrat
    karaka?: string; // e.g., Atmakaraka
}

interface PlanetaryAnalyticsProps {
    planets: DetailedPlanetInfo[];
}

export default function PlanetaryAnalytics({ planets }: PlanetaryAnalyticsProps) {
    return (
        <div className="bg-[#FFFFFF]/60 border border-header-border/30 rounded-3xl overflow-hidden shadow-xl backdrop-blur-md group">
            <div className="p-6 border-b border-header-border/20 flex items-center justify-between bg-gradient-to-r from-header-border/10 to-transparent">
                <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-header-border" />
                    <h3 className="text-sm font-bold text-ink uppercase tracking-[0.2em] font-serif">Planetary State Mastery</h3>
                </div>
                <div className="bg-header-border/10 text-header-border text-[9px] px-3 py-1 rounded-full border border-header-border/30 font-black uppercase tracking-widest">
                    Live Computation
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-ink/5 border-b border-header-border/20">
                            <th className="p-4 px-6 text-[9px] font-black uppercase tracking-widest text-body/70">Graha</th>
                            <th className="p-4 px-6 text-[9px] font-black uppercase tracking-widest text-body/70">Longitude</th>
                            <th className="p-4 px-6 text-[9px] font-black uppercase tracking-widest text-body/70">Sign (Rashi)</th>
                            <th className="p-4 px-6 text-[9px] font-black uppercase tracking-widest text-body/70">Nakshatra</th>
                            <th className="p-4 px-6 text-[9px] font-black uppercase tracking-widest text-body/70">Shadbala</th>
                            <th className="p-4 px-6 text-[9px] font-black uppercase tracking-widest text-body/70">Avastha</th>
                            <th className="p-4 px-6 text-[9px] font-black uppercase tracking-widest text-body/70">Dignity</th>
                            <th className="p-4 px-6 text-[9px] font-black uppercase tracking-widest text-body/70">Karaka</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-header-border/10">
                        {planets.map((planet) => (
                            <tr key={planet.planet} className="hover:bg-ink/5 transition-colors group/row">
                                <td className="p-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-2 h-2 rounded-full",
                                            planet.isRetro ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "bg-header-border"
                                        )} />
                                        <span className="font-serif font-extrabold text-ink text-lg tracking-tight">{planet.planet}</span>
                                        {planet.isRetro && <TrendingDown className="w-3 h-3 text-red-500 animate-pulse" />}
                                    </div>
                                </td>
                                <td className="p-4 px-6">
                                    <span className="font-mono text-xs text-ink font-bold bg-ink/5 px-2 py-1 rounded border border-ink/10">{planet.degree}</span>
                                </td>
                                <td className="p-4 px-6">
                                    <div className="flex flex-col">
                                        <span className="text-ink font-serif font-bold">{planet.sign}</span>
                                        <span className="text-[9px] text-ink/50 uppercase font-black">House {planet.house}</span>
                                    </div>
                                </td>
                                <td className="p-4 px-6">
                                    <div className="flex flex-col">
                                        <span className="text-ink font-serif font-bold">{planet.nakshatra} - {planet.pada}</span>
                                        <span className="text-[9px] text-copper-dark uppercase font-black tracking-widest">Lord: {planet.nakshatraLord}</span>
                                    </div>
                                </td>

                                {/* Shadbala Cell */}
                                <td className="p-4 px-6">
                                    <div className="flex flex-col gap-1 w-24">
                                        <div className="flex justify-between items-end">
                                            <span className="text-xs font-bold text-ink">{planet.shadbala || 0}</span>
                                            <span className="text-[8px] text-bronze uppercase">Rupas</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-ink/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-header-border to-bronze rounded-full"
                                                style={{ width: `${Math.min(((planet.shadbala || 0) / 8) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </td>

                                {/* Avastha Cell */}
                                <td className="p-4 px-6">
                                    <span className="text-xs font-serif font-medium text-ink italic">{planet.avastha || "—"}</span>
                                </td>

                                <td className="p-4 px-6">
                                    <DignityBadge dignity={planet.dignity} />
                                </td>

                                {/* Karaka Cell */}
                                <td className="p-4 px-6">
                                    {planet.karaka ? (
                                        <span className="bg-ink text-softwhite text-[9px] font-black px-2 py-0.5 rounded border border-header-border/50 uppercase tracking-widest shadow-sm">
                                            {planet.karaka}
                                        </span>
                                    ) : (
                                        <span className="text-ink/20 text-[8px] font-black uppercase tracking-tighter">—</span>
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

function DignityBadge({ dignity }: { dignity?: DetailedPlanetInfo['dignity'] }) {
    if (!dignity) return <span className="text-ink/20 text-[8px] font-black uppercase tracking-tighter">—</span>;

    const styles: Record<string, string> = {
        'Exalted': 'bg-green-500/10 text-green-700 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.1)]',
        'Debilitated': 'bg-red-500/10 text-red-600 border-red-500/30',
        'Moolatrikona': 'bg-active-glow/20 text-[#A06D00] border-active-glow/50',
        'Own Sign': 'bg-blue-500/10 text-blue-700 border-blue-500/30',
        'Friend': 'bg-ink/5 text-ink/70 border-ink/10',
        'Neutral': 'bg-ink/5 text-ink/40 border-ink/10',
        'Enemy': 'bg-slate-500/10 text-slate-600 border-slate-500/20'
    };

    return (
        <div className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest",
            styles[dignity] || styles['Neutral']
        )}>
            {dignity === 'Exalted' && <Zap className="w-2 h-2" />}
            {dignity === 'Debilitated' && <Anchor className="w-2 h-2" />}
            {dignity}
        </div>
    );
}
