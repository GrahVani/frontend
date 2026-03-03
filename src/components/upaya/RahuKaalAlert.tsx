"use client";

import React from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';

interface RahuKaalAlertProps {
    isActive?: boolean;
    recommendedAction?: string;
}

export default function RahuKaalAlert({ isActive = true, recommendedAction = "Focus on Saturn Mantra Practice Now" }: RahuKaalAlertProps) {
    if (!isActive) return null;

    return (
        <div className="w-full rounded-2xl px-6 py-3 flex items-center justify-between backdrop-blur-md shadow-sm bg-orange-50/80 border border-orange-400/30">
            <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 text-orange-600">
                    <AlertCircle className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <span className="font-bold uppercase tracking-wider text-[11px] text-orange-700">Rahu Kaal Active.</span>
                    <span className="text-xs text-orange-950">Recommended Action: {recommendedAction}</span>
                </div>
            </div>

            <button className="flex items-center gap-1.5 transition-colors group text-orange-700">
                <span className="text-[11px] font-bold uppercase tracking-widest border-b border-orange-600/50">Practice Now</span>
                <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );
}
