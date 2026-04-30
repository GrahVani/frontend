"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { cn } from "@/lib/utils";
import { KnowledgeTooltip } from '@/components/knowledge';

interface MantraInfo {
    sanskrit: string;
    transliteration: string;
    meaning: string;
}

interface DashaMantra {
    type: string;
    planet: string;
    mantra: MantraInfo;
    priority: string;
    daily_count: number;
    remaining_years: number;
}

interface DashaMantraPanelProps {
    mantras: DashaMantra[];
}

const Waveform = ({ color = "amber" }: { color?: "amber" | "indigo" }) => (
    <div className="flex items-center gap-0.5 h-6 opacity-30 group-hover:opacity-60 transition-opacity">
        {[2, 4, 3, 5, 4, 6, 4, 7, 3, 5, 4, 2].map((h, i) => (
            <motion.div
                key={i}
                animate={{ height: [h * 2, h * 4, h * 2] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                className={cn("w-0.5 rounded-full", color === "amber" ? "bg-amber-500" : "bg-indigo-500")}
            />
        ))}
    </div>
);

const DashaMantraPanel: React.FC<DashaMantraPanelProps> = ({ mantras }) => {
    return (
        <div className="space-y-2">
            {mantras.map((mantra, idx) => {
                const isMahadasha = mantra.type.includes('Maha');
                const isActive = idx === 0;

                return (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={cn(
                            "group relative overflow-hidden rounded-xl border p-3 transition-all duration-300",
                            isActive
                                ? "bg-amber-500/5 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.05)]"
                                : "bg-white/40 border-amber-200/60 hover:bg-white/60"
                        )}
                    >
                        <div className="flex items-start gap-3">
                            <button className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm border shrink-0 mt-1",
                                isActive
                                    ? "bg-amber-500 text-white border-amber-600"
                                    : "bg-white text-amber-600 border-amber-300/60"
                            )} aria-label={`Play ${mantra.planet} ${mantra.type} mantra`}>
                                <Play className={cn("w-4 h-4", isActive ? "fill-current" : "")} />
                            </button>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <h4 className="text-[15px] font-semibold text-amber-900 tracking-tight">
                                        {mantra.planet}
                                    </h4>
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100/60 text-amber-700 border border-amber-200/50">
                                        {mantra.type}
                                    </span>
                                    <span className={cn(
                                        "text-[9px] font-bold px-1.5 py-0.5 rounded",
                                        isMahadasha
                                            ? "bg-amber-500/10 text-amber-700 border border-amber-300/30"
                                            : "bg-indigo-500/10 text-indigo-600 border border-indigo-200/30"
                                    )}>
                                        {mantra.priority}
                                    </span>
                                </div>

                                {/* Sanskrit */}
                                <p className="text-[16px] font-serif text-amber-900 tracking-tight leading-snug" title={mantra.mantra.sanskrit}>
                                    {mantra.mantra.sanskrit}
                                </p>

                                {/* Transliteration */}
                                <p className="text-[11px] text-amber-700/60 font-medium italic mt-0.5">
                                    {mantra.mantra.transliteration}
                                </p>

                                {/* Meaning */}
                                <p className="text-[10px] text-amber-700/40 mt-0.5">
                                    {mantra.mantra.meaning}
                                </p>

                                {/* Stats Row */}
                                <div className="flex items-center gap-3 mt-1.5">
                                    <span className="text-[11px] font-semibold text-amber-900/50">
                                        Goal: <span className="text-amber-800/80">{mantra.daily_count}/day</span>
                                    </span>
                                    <span className="text-[10px] text-amber-700/30">|</span>
                                    <span className="text-[11px] font-semibold text-amber-900/50">
                                        Remaining: <span className="text-amber-800/80">{mantra.remaining_years} yrs</span>
                                    </span>
                                </div>

                                {!isMahadasha && (
                                    <p className="text-[10px] text-amber-600 mt-1 font-medium tracking-wide italic">
                                        *Best during <KnowledgeTooltip term="rahu_kaal">Rahu Kaal</KnowledgeTooltip>*
                                    </p>
                                )}
                            </div>

                            <div className="hidden sm:block shrink-0 mt-2">
                                <Waveform color={isMahadasha ? "amber" : "indigo"} />
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default DashaMantraPanel;
