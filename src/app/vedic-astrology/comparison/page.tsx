"use client";

import React, { useState } from 'react';
import { GitCompare, Heart, AlertTriangle, Users, Check, X } from 'lucide-react';
import { useVedicClient } from '@/context/VedicClientContext';
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from "@/design-tokens/typography";

// Mock Compatibility Data
const GUNAS = [
    { name: "Varna", max: 1, obtained: 1, desc: "Work/Ego Compatibility" },
    { name: "Vashya", max: 2, obtained: 1.5, desc: "Dominance/Control" },
    { name: "Tara", max: 3, obtained: 3, desc: "Destiny/Health" },
    { name: "Graha Maitri", max: 5, obtained: 0.5, desc: "Mental Friendship" },
    { name: "Gana", max: 6, obtained: 6, desc: "Temperament" },
    { name: "Bhakoot", max: 7, obtained: 0, desc: "Family Welfare (Zero: Dosha)" },
    { name: "Nadi", max: 8, obtained: 8, desc: "Genetic Health" },
];

const TOTAL_SCORE = GUNAS.reduce((acc, g) => acc + g.obtained, 0);

export default function VedicComparisonPage() {
    const { clientDetails } = useVedicClient();
    const [partnerName, setPartnerName] = useState("Priya Sharma"); // Mock Partner

    if (!clientDetails) return null;

    return (
        <div className="space-y-6 animate-in fade-in duration-700 pb-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className={cn(TYPOGRAPHY.sectionTitle, "text-3xl !mb-1 flex items-center gap-3")}>
                        <Heart className="w-8 h-8 text-rose-500 fill-rose-500/20" />
                        Vedic Compatibility
                    </h1>
                    <p className={cn(TYPOGRAPHY.label, "tracking-wide")}>Ashtakoota Guna Milan & Dosha Analysis.</p>
                </div>
            </div>

            {/* Profiles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                {/* Connector */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block">
                    <div className="w-12 h-12 bg-white rounded-full border-4 border-surface-warm shadow-lg flex items-center justify-center">
                        <GitCompare className="w-6 h-6 text-header-border" />
                    </div>
                </div>

                {/* Boy / Client */}
                <div className="bg-softwhite border border-header-border/30 rounded-3xl p-6 text-center shadow-sm">
                    <div className="w-16 h-16 mx-auto bg-ink/5 rounded-full flex items-center justify-center mb-3">
                        <Users className="w-8 h-8 text-ink" />
                    </div>
                    <h2 className={cn(TYPOGRAPHY.profileName, "text-xl !mb-0")}>{clientDetails.name}</h2>
                    <p className={cn(TYPOGRAPHY.label, "!text-[10px] tracking-widest !mb-4 uppercase")}>Primary Chart</p>
                    <div className="flex justify-center gap-2 text-sm">
                        <span className="px-2 py-1 bg-ink/5 rounded">Ashlesha (2)</span>
                        <span className="px-2 py-1 bg-ink/5 rounded">Cancer</span>
                    </div>
                </div>

                {/* Girl / Partner */}
                <div className="bg-softwhite border border-dashed border-header-border/40 rounded-3xl p-6 text-center hover:bg-header-border/5 transition-colors cursor-pointer group relative">
                    <div className="absolute top-4 right-4 text-header-border opacity-50 text-xs font-bold uppercase tracking-widest group-hover:opacity-100">Change</div>
                    <div className="w-16 h-16 mx-auto bg-rose-500/10 rounded-full flex items-center justify-center mb-3">
                        <Heart className="w-8 h-8 text-rose-500" />
                    </div>
                    <h2 className={cn(TYPOGRAPHY.profileName, "text-xl !mb-0")}>{partnerName}</h2>
                    <p className={cn(TYPOGRAPHY.label, "!text-[10px] tracking-widest !mb-4 uppercase")}>Partner Chart</p>
                    <div className="flex justify-center gap-2 text-sm">
                        <span className="px-2 py-1 bg-rose-500/5 rounded text-rose-800">Magha (1)</span>
                        <span className="px-2 py-1 bg-rose-500/5 rounded text-rose-800">Leo</span>
                    </div>
                </div>
            </div>

            {/* ASHTAKOOTA TABLE */}
            <div className="bg-softwhite border border-header-border/20 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 bg-header-border/10 flex justify-between items-center">
                    <h3 className={cn(TYPOGRAPHY.label, "!mb-0 !font-bold")}>Ashtakoota Scorecard</h3>
                    <div className="px-4 py-1.5 bg-white rounded-lg shadow-sm border border-header-border/20">
                        <span className={cn(TYPOGRAPHY.label, "!text-[10px] tracking-widest !mb-0 mr-2 uppercase")}>Total Score</span>
                        <span className={cn(TYPOGRAPHY.sectionTitle, "text-lg !mb-0", TOTAL_SCORE > 18 ? "text-green-600" : "text-red-600")}>
                            {TOTAL_SCORE} / 36
                        </span>
                    </div>
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-ink/5 text-body/70 font-black uppercase text-[10px] tracking-widest">
                        <tr>
                            <th className="px-6 py-3">Koota (Area)</th>
                            <th className="px-6 py-3">Description</th>
                            <th className="px-6 py-3 text-right">Max Points</th>
                            <th className="px-6 py-3 text-right">Obtained</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-header-border/10">
                        {GUNAS.map((guna, i) => (
                            <tr key={i} className={cn("hover:bg-ink/5 transition-colors", guna.obtained === 0 && "bg-red-50")}>
                                <td className={cn(TYPOGRAPHY.value, "px-6 py-3 !text-sm")}>{guna.name}</td>
                                <td className={cn(TYPOGRAPHY.subValue, "px-6 py-3 !text-xs")}>
                                    {guna.desc}
                                    {guna.obtained === 0 && <span className={cn(TYPOGRAPHY.label, "!text-[10px] !mb-0 !font-black text-red-600 bg-red-100 px-1 py-0.5 rounded border border-red-200 ml-2")}>DOSHA</span>}
                                </td>
                                <td className={cn(TYPOGRAPHY.subValue, "px-6 py-3 text-right font-mono")}>{guna.max}</td>
                                <td className={cn(TYPOGRAPHY.value, "px-6 py-3 text-right !font-bold")}>{guna.obtained}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MANGAL DOSHA CHECK */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-green-500/30 bg-green-500/5 rounded-xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-700">
                        <Check className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className={cn(TYPOGRAPHY.sectionTitle, "text-green-900 !mb-0")}>Boy: Non-Manglik</h4>
                        <p className={cn(TYPOGRAPHY.subValue, "text-green-800 !mt-0")}>Mars is in 3rd House (Safe).</p>
                    </div>
                </div>

                <div className="border border-red-500/30 bg-red-500/5 rounded-xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-700">
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className={cn(TYPOGRAPHY.sectionTitle, "text-red-900 !mb-0")}>Girl: High Manglik</h4>
                        <p className={cn(TYPOGRAPHY.subValue, "text-red-800 !mt-0")}>Mars in 7th House caused Bhakoot Dosha.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
