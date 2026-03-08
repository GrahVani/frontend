"use client";

import React, { useState } from 'react';
import { GitCompare, Heart, AlertTriangle, Users, Check, X } from 'lucide-react';
import { useVedicClient } from '@/context/VedicClientContext';
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from "@/design-tokens/typography";
import DataGrid, { type DataGridColumn } from '@/components/ui/DataGrid';

interface GunaEntry {
    name: string;
    max: number;
    obtained: number;
    desc: string;
    [key: string]: unknown;
}

// Mock Compatibility Data
const GUNAS: GunaEntry[] = [
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
                    <h1 className={cn(TYPOGRAPHY.sectionTitle, "text-[30px] !mb-1 flex items-center gap-3")}>
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
                        <GitCompare className="w-6 h-6 text-gold-dark" />
                    </div>
                </div>

                {/* Boy / Client */}
                <div className="prem-card rounded-3xl p-6 text-center">
                    <div className="w-16 h-16 mx-auto bg-ink/5 rounded-full flex items-center justify-center mb-3">
                        <Users className="w-8 h-8 text-ink" />
                    </div>
                    <h2 className={cn(TYPOGRAPHY.profileName, "text-[20px] !mb-0")}>{clientDetails.name}</h2>
                    <p className={cn(TYPOGRAPHY.label, "!text-[10px] tracking-widest !mb-4 uppercase")}>Primary Chart</p>
                    <div className="flex justify-center gap-2 text-[14px]">
                        <span className="px-2 py-1 bg-ink/5 rounded">Ashlesha (2)</span>
                        <span className="px-2 py-1 bg-ink/5 rounded">Cancer</span>
                    </div>
                </div>

                {/* Girl / Partner */}
                <div className="prem-card border border-dashed border-gold-primary/30 rounded-3xl p-6 text-center hover:bg-gold-primary/5 transition-colors cursor-pointer group relative">
                    <div className="absolute top-4 right-4 text-gold-dark opacity-50 text-[12px] font-bold uppercase tracking-widest group-hover:opacity-100">Change</div>
                    <div className="w-16 h-16 mx-auto bg-rose-500/10 rounded-full flex items-center justify-center mb-3">
                        <Heart className="w-8 h-8 text-rose-500" />
                    </div>
                    <h2 className={cn(TYPOGRAPHY.profileName, "text-[20px] !mb-0")}>{partnerName}</h2>
                    <p className={cn(TYPOGRAPHY.label, "!text-[10px] tracking-widest !mb-4 uppercase")}>Partner Chart</p>
                    <div className="flex justify-center gap-2 text-[14px]">
                        <span className="px-2 py-1 bg-rose-500/5 rounded text-rose-800">Magha (1)</span>
                        <span className="px-2 py-1 bg-rose-500/5 rounded text-rose-800">Leo</span>
                    </div>
                </div>
            </div>

            {/* ASHTAKOOTA TABLE */}
            <div className="prem-card rounded-2xl overflow-hidden">
                <div className="p-4 bg-gold-primary/10 flex justify-between items-center">
                    <h3 className={cn(TYPOGRAPHY.label, "!mb-0 !font-bold")}>Ashtakoota Scorecard</h3>
                    <div className="px-4 py-1.5 bg-white rounded-lg shadow-sm border border-gold-primary/15">
                        <span className={cn(TYPOGRAPHY.label, "!text-[10px] tracking-widest !mb-0 mr-2 uppercase")}>Total Score</span>
                        <span className={cn(TYPOGRAPHY.sectionTitle, "text-[18px] !mb-0", TOTAL_SCORE > 18 ? "text-green-600" : "text-red-600")}>
                            {TOTAL_SCORE} / 36
                        </span>
                    </div>
                </div>
                <DataGrid<GunaEntry>
                    columns={[
                        {
                            key: 'name',
                            header: 'Koota (Area)',
                            cellClassName: cn(TYPOGRAPHY.value, "!text-[14px]"),
                        },
                        {
                            key: 'desc',
                            header: 'Description',
                            render: (row) => (
                                <span className={cn(TYPOGRAPHY.subValue, "!text-[12px]")}>
                                    {row.desc}
                                    {row.obtained === 0 && <span className={cn(TYPOGRAPHY.label, "!text-[10px] !mb-0 !font-black text-red-600 bg-red-100 px-1 py-0.5 rounded border border-red-200 ml-2")}>DOSHA</span>}
                                </span>
                            ),
                        },
                        {
                            key: 'max',
                            header: 'Max Points',
                            align: 'right',
                            cellClassName: cn(TYPOGRAPHY.subValue, "font-mono"),
                        },
                        {
                            key: 'obtained',
                            header: 'Obtained',
                            align: 'right',
                            cellClassName: cn(TYPOGRAPHY.value, "!font-bold"),
                        },
                    ]}
                    data={GUNAS}
                    rowKey={(row) => row.name}
                    cellPadding="px-6 py-3"
                    rowClassName={(row) => row.obtained === 0 ? 'bg-red-50' : ''}
                    ariaLabel="Ashtakoota Guna Milan scorecard"
                    scrollShadows={true}
                />
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
