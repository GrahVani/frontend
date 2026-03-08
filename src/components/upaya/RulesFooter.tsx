"use client";

import React from 'react';
import { Sun, Hand, Calendar } from 'lucide-react';
import { cn } from "@/lib/utils";
import styles from './RemedialShared.module.css';

export default function RulesFooter() {
    return (
        <div className={cn(
            "w-full max-w-6xl mx-auto py-4 px-8 mt-12 shadow-sm flex items-center justify-center gap-12",
            styles.glassPanel
        )}>
            {/* Rule 1 */}
            <div className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all border bg-white/60 border-gold-primary/20 text-ink">
                    <Sun className="w-4 h-4 group-hover:text-amber-600 transition-colors" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-tighter transition-colors text-ink">
                    RULE 1: <span className="font-bold ml-1 text-ink">Perform during daylight (Sunrise-Sunset).</span>
                </span>
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-divider" />

            {/* Rule 2 */}
            <div className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all border bg-white/60 border-gold-primary/20 text-ink">
                    <Hand className="w-4 h-4 group-hover:text-blue-600 transition-colors" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-tighter transition-colors text-ink">
                    RULE 2: <span className="font-bold ml-1 text-ink">One new remedy per day.</span>
                </span>
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-divider" />

            {/* Rule 3 */}
            <div className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all border bg-white/60 border-gold-primary/20 text-ink">
                    <Calendar className="w-4 h-4 group-hover:text-purple-600 transition-colors" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-tighter transition-colors text-ink">
                    RULE 3: <span className="font-bold ml-1 text-ink">Respect 43-day continuity.</span>
                </span>
            </div>
        </div>
    );
}
