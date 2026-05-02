"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Info, AlertCircle, ShieldCheck, MapPin, Zap, Gem, Hand, Home } from 'lucide-react';
import { KnowledgeTooltip } from '@/components/knowledge';

// ============================================================================
// Planet-to-Gemstone Color Map (matches app PLANET_THEMES aesthetic)
// ============================================================================
const PLANET_GEM_COLORS: Record<string, { bg: string; border: string; text: string; dot: string }> = {
    'Sun': { bg: '#FEF3E2', border: '#F59E0B', text: '#92400E', dot: '#F59E0B' },
    'Moon': { bg: '#F0F4FF', border: '#93A8D0', text: '#334155', dot: '#93A8D0' },
    'Mars': { bg: '#FEF2F2', border: '#EF4444', text: '#991B1B', dot: '#EF4444' },
    'Mercury': { bg: '#ECFDF5', border: '#10B981', text: '#065F46', dot: '#10B981' },
    'Jupiter': { bg: '#FFFBEB', border: '#D4A24C', text: '#78350F', dot: '#D4A24C' },
    'Venus': { bg: '#FDF4FF', border: '#C084FC', text: '#6B21A8', dot: '#C084FC' },
    'Saturn': { bg: '#F1F5F9', border: '#475569', text: '#1E293B', dot: '#475569' },
    'Rahu': { bg: '#F5F3FF', border: '#7C3AED', text: '#4C1D95', dot: '#7C3AED' },
    'Ketu': { bg: '#FFF7ED', border: '#F97316', text: '#7C2D12', dot: '#F97316' },
};

interface GemstoneData {
    planet: string;
    analysis: {
        nature: string;
        logic: string;
    };
    gem_data: {
        stone: string;
        metal: string;
        finger: string;
    };
    position: {
        sign: string;
        house: number;
        is_retro?: boolean;
        is_combust?: boolean;
    };
    rulerships: number[];
    dasha_status: {
        is_active: boolean;
        period?: string;
    };
}

interface GemstoneAnalysisCardProps {
    gemstone: GemstoneData;
    isRecommended: boolean;
    priority?: number;
}

export default function GemstoneAnalysisCard({ gemstone, isRecommended, priority }: GemstoneAnalysisCardProps) {
    const { planet, analysis, gem_data, position, rulerships, dasha_status } = gemstone;
    const colors = PLANET_GEM_COLORS[planet] || PLANET_GEM_COLORS['Sun'];

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={cn(
                "group relative border rounded-2xl transition-all duration-300 overflow-hidden flex flex-col",
                isRecommended
                    ? "bg-white border-amber-200/60 hover:border-amber-300 shadow-sm hover:shadow-md"
                    : "bg-white border-red-200/60 hover:border-red-300 shadow-sm hover:shadow-md"
            )}
        >
            {/* ── Header ── */}
            <div className={cn(
                "px-4 py-3 flex items-center justify-between border-b",
                isRecommended ? "bg-amber-50/30 border-amber-200/60" : "bg-red-50/30 border-red-100/40"
            )}>
                <div className="flex items-center gap-2.5 min-w-0">
                    {/* Gem dot */}
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                        style={{ backgroundColor: colors.bg, border: `1.5px solid ${colors.border}` }}>
                        <Gem className="w-4 h-4" style={{ color: colors.dot }} />
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="font-bold text-[16px] leading-tight text-amber-900">
                                {gem_data.stone}
                            </h3>
                            {priority && (
                                <span className="inline-flex items-center justify-center w-5 h-5 text-[11px] font-black rounded-full bg-amber-500 text-white shadow-sm shrink-0 ml-1">
                                    P{priority}
                                </span>
                            )}
                        </div>
                        <p className="text-[12px] font-semibold tracking-wide mt-0.2"
                            style={{ color: colors.text }}>
                            For {planet}
                        </p>
                    </div>
                </div>

                {/* Nature Badge */}
                <div className={cn(
                    "px-2 py-0.5 rounded-lg text-[11px] font-bold tracking-wide flex items-center gap-1 shrink-0 border",
                    analysis.nature === 'Benefic'
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : analysis.nature === 'Neutral'
                            ? "bg-amber-50 border-amber-200 text-amber-700"
                            : "bg-red-50 border-red-200 text-red-700"
                )}>
                    {analysis.nature === 'Benefic'
                        ? <ShieldCheck className="w-2.5 h-2.5" />
                        : <AlertCircle className="w-2.5 h-2.5" />}
                    {analysis.nature}
                </div>
            </div>

            {/* ── Body ── */}
            <div className="px-4 py-3 space-y-3 flex-1 flex flex-col">

                {/* Astrological Rationale */}
                <div className={cn(
                    "p-2.5 rounded-xl border",
                    isRecommended
                        ? "bg-amber-50/30 border-amber-200/60"
                        : "bg-red-50/20 border-red-100/30"
                )}>
                    <div className="flex items-center gap-1.5 mb-1.5">
                        <Info className={cn("w-3 h-3 shrink-0",
                            isRecommended ? "text-amber-700" : "text-red-400"
                        )} />
                        <span className="text-[11px] font-bold tracking-wide text-amber-700/55">
                            Rationale
                        </span>
                    </div>
                    <p className="text-[11px] leading-relaxed font-medium pl-4.5 text-body">
                        {analysis.logic}
                    </p>
                </div>

                {/* Metal & Finger + Placement */}
                <div className="grid grid-cols-2 gap-2 mt-auto">
                    <div className="p-2 rounded-xl bg-white border border-amber-200/60">
                        <div className="flex items-center gap-1 mb-1">
                            <Hand className="w-2.5 h-2.5 text-amber-500" />
                            <p className="text-[11px] font-bold tracking-wide text-amber-700/55">
                                Metal & finger
                            </p>
                        </div>
                        <p className="text-[13px] font-semibold text-amber-900">
                            {gem_data.metal} — {gem_data.finger}
                        </p>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-amber-200/60">
                        <div className="flex items-center gap-1 mb-1">
                            <Home className="w-2.5 h-2.5 text-amber-500" />
                            <p className="text-[11px] font-bold tracking-wide text-amber-700/55">
                                Placement
                            </p>
                        </div>
                        <p className="text-[13px] font-semibold text-amber-900">
                            {position.sign} in {position.house}{getOrdinal(position.house)}
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Footer: Badges ── */}
            {(rulerships.length > 0 || dasha_status.is_active) && (
                <div className={cn(
                    "px-4 py-2 flex flex-wrap items-center gap-1.5 border-t",
                    isRecommended ? "bg-amber-50/20 border-amber-200/60" : "bg-red-50/10 border-red-100/30"
                )}>
                    {rulerships.length > 0 && (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-sky-50 rounded-lg border border-sky-100/60">
                            <MapPin className="w-2.5 h-2.5 text-sky-500" />
                            <span className="text-[11px] font-bold text-sky-700">
                                H-{rulerships.join(', ')}
                            </span>
                        </div>
                    )}
                    {dasha_status.is_active && (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 rounded-lg border border-amber-100/60">
                            <Zap className="w-2.5 h-2.5 text-amber-500" />
                            <span className="text-[11px] font-bold text-amber-700">
                                {dasha_status.period}
                            </span>
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
}

// ============================================================================
// Helpers
// ============================================================================
function getOrdinal(n: number): string {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
}
