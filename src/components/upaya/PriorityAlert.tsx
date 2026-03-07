"use client";

import React from 'react';
import { Clock } from 'lucide-react';
import { cn } from "@/lib/utils";
import styles from './RemedialShared.module.css';

interface PriorityAlertProps {
    mahadasha?: string;
    antardasha?: string;
}

export default function PriorityAlert({ mahadasha = "Mercury", antardasha = "Saturn" }: PriorityAlertProps) {
    return (
        <div className="relative group max-w-3xl mx-auto w-full">
            {/* Outer Glowing Border - Adjusted for Parchment/Red Theme */}
            <div className="absolute -inset-1 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 bg-gradient-to-r from-red-600 to-orange-600" />

            <div className={cn("relative flex items-center p-1 overflow-hidden", styles.glassPanel)}>
                {/* Left Icon Section */}
                <div className="p-3 rounded-xl m-1 flex items-center justify-center shadow-sm bg-gradient-to-br from-red-100 to-orange-100">
                    <Clock className="w-5 h-5 animate-pulse text-red-600" />
                </div>

                {/* Content Section */}
                <div className="flex-1 px-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="font-black uppercase tracking-tighter text-sm text-red-700">Priority Alert:</span>
                        <div className="h-4 w-px mx-1 bg-antique" />
                        <span className="text-[13px] font-bold tracking-wide text-ink">
                            Current Dasha Influence | <span className="text-red-700">{mahadasha} Mahadasha</span> & <span className="text-orange-700">{antardasha} Antardasha</span>
                        </span>
                    </div>

                    {/* Subtle Right element */}
                    <div className="hidden lg:flex gap-1 pr-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-1 h-1 rounded-full bg-red-300" />
                        ))}
                    </div>
                </div>

                {/* Decorative Slice Effect */}
                <div className="absolute right-0 top-0 bottom-0 w-24 skew-x-[30deg] translate-x-12 bg-gradient-to-l from-red-600/5 to-transparent" />
            </div>
        </div>
    );
}
