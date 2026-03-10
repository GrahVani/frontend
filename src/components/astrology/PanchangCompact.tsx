"use client";

import React from 'react';
import { Sun, Moon, Wind, Compass } from 'lucide-react';
import { KnowledgeTooltip } from '@/components/knowledge';

export default function PanchangCompact() {
    // Mock data for UI demonstration
    const data = [
        { label: "Tithi", value: "Shukla Navami", icon: Moon, color: "text-active-glow", termKey: "panchang_tithi" },
        { label: "Nakshatra", value: "Magha", icon: Sun, color: "text-gold-dark", termKey: "panchang_nakshatra" },
        { label: "Yoga", value: "Vyatipata", icon: Wind, color: "text-active-glow", termKey: "panchang_yoga" },
        { label: "Karana", value: "Taitila", icon: Compass, color: "text-gold-dark", termKey: "panchang_karana" }
    ];

    return (
        <div className="bg-ink-deep/40 backdrop-blur-sm border border-gold-primary/20 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-gold-primary/10 px-4 py-2 border-b border-gold-primary/15 flex items-center justify-between">
                <span className="text-[10px] font-bold text-active-glow uppercase tracking-widest font-serif">Daily <KnowledgeTooltip term="panchang_system" unstyled>Panchang</KnowledgeTooltip></span>
                <span className="text-[9px] text-white/60 uppercase tracking-tighter">New Delhi • 11:45 AM</span>
            </div>

            <div className="grid grid-cols-2 gap-px bg-gold-primary/10">
                {data.map((item, i) => (
                    <div key={i} className="bg-ink-deep/60 p-4 flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-white/5 ${item.color}`}>
                            <item.icon className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-[9px] text-white/60 uppercase tracking-wider mb-0.5"><KnowledgeTooltip term={item.termKey} unstyled>{item.label}</KnowledgeTooltip></p>
                            <p className="text-[14px] font-serif text-white font-bold">{item.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-3 bg-ink-deep/80 text-center">
                <button className="text-[10px] font-bold text-gold-dark uppercase tracking-widest hover:text-active-glow transition-colors">
                    View Full Calendar →
                </button>
            </div>
        </div>
    );
}
