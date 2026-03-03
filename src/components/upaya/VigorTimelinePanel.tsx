"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PlanetStrength {
    strength_percentage: number;
    is_weak: boolean;
}

interface DashaTimelineEntry {
    planet: string;
    status: string;
    duration_years?: number;
}

interface DashaDetails {
    current_maha_dasha: {
        planet: string;
        start_date: string;
        end_date: string;
    };
    dasha_timeline: DashaTimelineEntry[];
}

interface VigorTimelinePanelProps {
    strengthAnalysis: Record<string, PlanetStrength>;
    dashaDetails: DashaDetails;
}

export default function VigorTimelinePanel({ strengthAnalysis, dashaDetails }: VigorTimelinePanelProps) {
    if (!strengthAnalysis || !dashaDetails) return null;

    // Shadbala Planets for Gauges
    const displayPlanets = [
        { key: 'Sun', name: 'Sun', color: 'text-amber-400', stroke: '#F59E0B' },
        { key: 'Jupiter', name: 'Jup', color: 'text-orange-300', stroke: '#FDBA74' },
        { key: 'Mars', name: 'Mar', color: 'text-rose-400', stroke: '#FB7185' },
        { key: 'Saturn', name: 'Sat', color: 'text-red-500', stroke: '#EF4444' }
    ];

    // Dasha Calculation
    const currentMaha = dashaDetails.current_maha_dasha;
    const startDate = new Date(currentMaha.start_date);
    const endDate = new Date(currentMaha.end_date);
    const now = new Date();

    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsed = now.getTime() - startDate.getTime();
    const progress = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);

    const nextDasha = dashaDetails.dasha_timeline.find((d: DashaTimelineEntry) => d.status === 'future' && d.planet !== dashaDetails.current_maha_dasha.planet);

    return (
        <div className={cn("p-6 h-full rounded-3xl backdrop-blur-md", "bg-[rgba(254,250,234,0.6)] border border-antique")}>
            <h3 className="text-sm font-semibold mb-8 flex items-center gap-2 text-ink">
                <span className="w-4 h-4 rounded-full flex items-center justify-center border bg-indigo-500/10 border-indigo-500/30">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                </span>
                Planetary Vigor & Temporal Cycles
            </h3>

            {/* Shadbala Strengths Grid */}
            <div className="grid grid-cols-2 gap-6 mb-12">
                {displayPlanets.map((p) => {
                    const stats = strengthAnalysis[p.key];
                    if (!stats) return null;
                    const percentage = stats.strength_percentage;
                    const label = stats.is_weak ? (percentage < 30 ? 'Weakest' : 'Weak') : 'Strong';

                    return (
                        <div key={p.key} className="border border-antique rounded-2xl p-4 flex items-center gap-4 group bg-white/40">
                            <div className="relative w-14 h-14 flex-shrink-0">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="28" cy="28" r="24"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="transparent"
                                        className="text-ink/10"
                                    />
                                    <motion.circle
                                        cx="28" cy="28" r="24"
                                        stroke={p.stroke}
                                        strokeWidth="4"
                                        fill="transparent"
                                        strokeDasharray={150.8}
                                        initial={{ strokeDashoffset: 150.8 }}
                                        animate={{ strokeDashoffset: 150.8 - (150.8 * percentage) / 100 }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        strokeLinecap="round"
                                        className="drop-shadow-sm"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center font-bold text-[10px] text-ink">
                                    {p.name}
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-ink">{p.name}: {percentage.toFixed(1)}%</p>
                                <p className={cn("text-[10px] mt-0.5 font-bold uppercase tracking-wider",
                                    label === 'Strong' ? "text-emerald-600" : "text-amber-600"
                                )}>({label})</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Dasha Timeline */}
            <div className="space-y-6">
                <div className="flex justify-between items-end">
                    <div className="flex-1">
                        <p className="text-[10px] uppercase tracking-widest font-black mb-1 text-ink">Current Mahadasha</p>
                        <h4 className="text-lg font-bold mb-1 text-ink">{currentMaha.planet} Dasha</h4>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] uppercase tracking-widest font-black mb-1 text-ink">Ends On</p>
                        <p className="text-sm font-semibold text-ink">{new Date(currentMaha.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                </div>

                <div className="relative h-2 rounded-full overflow-hidden bg-black/10">
                    <motion.div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-indigo-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                    />
                    {/* The Knob */}
                    <motion.div
                        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-indigo-600 shadow-sm z-10 -ml-2"
                        initial={{ left: 0 }}
                        animate={{ left: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                    />
                </div>

                <div className="flex justify-between items-center bg-white/50 border border-antique rounded-2xl p-4 mt-8">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center border text-indigo-600 bg-indigo-600/10 border-indigo-600/20">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest font-black text-ink">Next Cycle</p>
                            <p className="text-xs font-semibold text-ink">{nextDasha?.planet || 'Future'} Dasha</p>
                        </div>
                    </div>
                    <div className="px-3 py-1 rounded-full border bg-indigo-600/10 border-indigo-600/20">
                        <p className="text-[10px] font-bold text-indigo-600">{nextDasha ? `(${nextDasha.duration_years} Years)` : 'TBD'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
