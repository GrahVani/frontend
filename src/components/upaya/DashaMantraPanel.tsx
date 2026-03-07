"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Timer } from 'lucide-react';
import { cn } from "@/lib/utils";

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
    <div className="flex items-center gap-0.5 h-5 opacity-30 group-hover:opacity-60 transition-opacity">
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
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-amber-900/60 px-1">Principal Dasha Period Mantras</h3>
            <div className="space-y-2">
                {mantras.slice(0, 2).map((mantra, idx) => {
                    const isMahadasha = mantra.type.toLowerCase().includes('maha');
                    const accentColor = isMahadasha ? "amber" : "indigo";

                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={cn(
                                "group relative overflow-hidden rounded-2xl border p-2.5 transition-all duration-300",
                                isMahadasha
                                    ? "bg-amber-500/5 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.05)]"
                                    : "bg-indigo-500/5 border-indigo-400/20 hover:bg-indigo-500/8"
                            )}
                        >
                            <div className="flex items-start gap-3">
                                {/* Play button */}
                                <button className={cn(
                                    "w-8 h-8 mt-0.5 rounded-full flex-shrink-0 flex items-center justify-center transition-all shadow-sm border",
                                    isMahadasha
                                        ? "bg-amber-500 text-white border-amber-600"
                                        : "bg-white text-indigo-500 border-indigo-200"
                                )}>
                                    <Play className={cn("w-3.5 h-3.5", isMahadasha ? "fill-current" : "")} />
                                </button>

                                {/* Main content */}
                                <div className="flex-1 min-w-0">
                                    {/* Header row: planet name + type badge + remaining years */}
                                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                                        <h4 className="text-sm font-semibold text-ink tracking-tight leading-tight">
                                            {mantra.planet}
                                        </h4>
                                        <span className={cn(
                                            "text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider",
                                            isMahadasha
                                                ? "bg-amber-100 text-amber-700"
                                                : "bg-indigo-100 text-indigo-600"
                                        )}>
                                            {mantra.type}
                                        </span>
                                        {mantra.remaining_years > 0 && (
                                            <span className="flex items-center gap-0.5 text-[10px] font-medium text-slate-400 ml-auto">
                                                <Timer className="w-3 h-3" />
                                                {mantra.remaining_years.toFixed(2)}y left
                                            </span>
                                        )}
                                    </div>

                                    {/* Sanskrit mantra */}
                                    <div className="flex items-baseline gap-2 overflow-hidden">
                                        <p className="text-base font-serif text-ink tracking-tight truncate">
                                            {mantra.mantra.sanskrit}
                                        </p>
                                        <span className="text-[11px] font-medium text-amber-900/40 whitespace-nowrap shrink-0">| ×{mantra.daily_count}</span>
                                    </div>

                                    {/* Transliteration */}
                                    <p className={cn(
                                        "text-[11px] font-medium tracking-wide leading-tight mt-0.5",
                                        isMahadasha ? "text-amber-600/80" : "text-indigo-500/70"
                                    )}>
                                        {mantra.mantra.transliteration}
                                    </p>

                                    {/* Meaning */}
                                    <p className="text-[11px] text-slate-400 leading-tight mt-0.5 italic">
                                        {mantra.mantra.meaning}
                                    </p>
                                </div>

                                {/* Waveform */}
                                <div className="hidden sm:block self-center">
                                    <Waveform color={accentColor} />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default DashaMantraPanel;
