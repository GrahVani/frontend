"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    Sun,
    Moon,
    Clock,
    AlertOctagon,
    Calendar,
    Sparkles
} from 'lucide-react';
import { cn } from "@/lib/utils";

interface TimingData {
    hora: {
        is_day: boolean;
        day_lord: string;
        hora_lord: string;
        hora_number: number;
    };
    rahu_kaal: {
        duration_minutes: number;
        recommendation: string;
    };
    tithi: {
        name: string;
        number: number;
        paksha: string;
        is_purnima: boolean;
        is_amavasya: boolean;
        is_ekadashi: boolean;
    };
}

interface MantraTimingCardProps {
    timing: TimingData;
}

const MantraTimingCard: React.FC<MantraTimingCardProps> = ({ timing }) => {
    const { hora, rahu_kaal, tithi } = timing;
    const isRahuKaalActive = rahu_kaal.recommendation.toLowerCase().includes("avoid");

    return (
        <div className="rounded-2xl border border-antique/30 bg-white/30 backdrop-blur-sm overflow-hidden">
            {/* Header strip */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-antique/20 bg-white/20">
                <Clock className="w-3 h-3 text-amber-600" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-900/50">Sacred Timing Analysis</span>
                <Sparkles className="w-2.5 h-2.5 text-amber-400/40 ml-auto" />
            </div>

            {/* 3-col horizontal grid */}
            <div className="grid grid-cols-3 divide-x divide-antique/15">

                {/* Hora */}
                <div className="px-3 py-2">
                    <div className="flex items-center gap-1.5 mb-1">
                        <div className="p-1 rounded bg-orange-50 text-orange-500 border border-orange-100">
                            {hora.is_day ? <Sun className="w-2.5 h-2.5" /> : <Moon className="w-2.5 h-2.5" />}
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-amber-900/40">Current Hora</span>
                        <span className="text-[8px] font-black px-1 py-0.5 rounded bg-orange-50 text-orange-700 border border-orange-200 ml-auto">#{hora.hora_number}</span>
                    </div>
                    <p className="text-[12px] font-bold text-ink leading-none mb-1">{hora.hora_lord} Lord</p>
                    <div className="flex items-center gap-1">
                        <div className="flex-1 h-0.5 bg-black/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(hora.hora_number / 24) * 100}%` }}
                                className="h-full bg-orange-400 rounded-full"
                            />
                        </div>
                        <span className="text-[7px] font-bold text-slate-300 uppercase">Cycle</span>
                    </div>
                </div>

                {/* Rahu Kaal */}
                <div className={cn("px-3 py-2", isRahuKaalActive ? "bg-rose-50/50" : "")}>
                    <div className="flex items-center gap-1.5 mb-1">
                        <div className={cn("p-1 rounded border", isRahuKaalActive ? "bg-rose-100 text-rose-600 border-rose-200" : "bg-slate-50 text-slate-400 border-slate-200")}>
                            <AlertOctagon className="w-2.5 h-2.5" />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-amber-900/40">Rahu Kaal</span>
                        {isRahuKaalActive && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse ml-auto" />}
                    </div>
                    <p className="text-[12px] font-bold text-ink leading-none mb-1">{rahu_kaal.duration_minutes} Min</p>
                    <p className={cn("text-[9px] font-medium leading-tight line-clamp-2", isRahuKaalActive ? "text-rose-600" : "text-slate-500")}>
                        {rahu_kaal.recommendation}
                    </p>
                </div>

                {/* Tithi */}
                <div className="px-3 py-2">
                    <div className="flex items-center gap-1.5 mb-1">
                        <div className="p-1 rounded bg-indigo-50 text-indigo-500 border border-indigo-100">
                            <Calendar className="w-2.5 h-2.5" />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-amber-900/40">Lunar Tithi</span>
                        <span className="text-[8px] font-black px-1 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 ml-auto">{tithi.paksha}</span>
                    </div>
                    <p className="text-[12px] font-bold text-ink leading-none mb-1">{tithi.name}</p>
                    <div className="flex flex-wrap gap-1">
                        {tithi.is_amavasya && <span className="text-[7px] px-1 py-0.5 rounded-full font-black uppercase bg-slate-900 text-slate-100">Amavasya</span>}
                        {tithi.is_purnima && <span className="text-[7px] px-1 py-0.5 rounded-full font-black uppercase bg-amber-500 text-white">Purnima</span>}
                        {tithi.is_ekadashi && <span className="text-[7px] px-1 py-0.5 rounded-full font-black uppercase bg-purple-600 text-white">Ekadashi</span>}
                        {!tithi.is_amavasya && !tithi.is_purnima && !tithi.is_ekadashi && (
                            <span className="text-[9px] text-slate-400 font-medium">Regular day</span>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MantraTimingCard;
