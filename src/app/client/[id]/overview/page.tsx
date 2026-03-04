"use client";

import React from 'react';
import NorthIndianChart from "@/components/astrology/NorthIndianChart";
import {
    Calendar,
    Clock,
    MapPin,
    FileText,
    TrendingUp,
    Sparkles,
    Zap,
    History,
    Edit3,
    ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import GoldenButton from "@/components/GoldenButton";
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerStore } from '@/store/useAstrologerStore';

export default function ClientOverviewPage() {
    const { clientDetails, isClientSet } = useVedicClient();
    const { ayanamsa, chartStyle, recentClientIds } = useAstrologerStore();
    const settings = { ayanamsa, chartStyle, recentClientIds };

    // Fallback Mock Data if no client is set in context
    const displayClient = clientDetails || {
        name: 'Ananya Sharma',
        dateOfBirth: '1992-08-15',
        timeOfBirth: '14:30',
        placeOfBirth: { city: 'New Delhi, India' },
        rashi: 'Leo'
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Top Workspace Header (Brief Summary) */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-softwhite/5 border border-header-border/20 p-6 rounded-3xl backdrop-blur-md">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-header-border to-ink flex items-center justify-center text-white shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-white/10">
                        <span className="text-3xl font-serif font-bold">{displayClient.name.charAt(0)}</span>
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-serif text-white font-bold tracking-tight">{displayClient.name}</h1>
                            <span className="bg-active-glow/10 text-active-glow text-[10px] px-2 py-0.5 rounded-full border border-active-glow/30 font-bold uppercase tracking-widest">Active</span>
                        </div>
                        <p className="text-header-border text-xs font-serif italic mt-1">Astrological profile for {displayClient.name}</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/60 hover:text-active-glow transition-all">
                        <Edit3 className="w-5 h-5" />
                    </button>
                    <Link href={`/vedic-astrology`} className="px-6 py-3 bg-active-glow text-ink rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Full Analysis
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LEFT: Client Meta Info */}
                <div className="lg:col-span-4 space-y-8">

                    {/* AVATAR DATA CARD */}
                    <div className="bg-ink-deep/60 border border-header-border/30 rounded-3xl p-6 relative overflow-hidden group shadow-2xl">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-header-border/10 rounded-full blur-2xl group-hover:bg-active-glow/20 transition-all" />

                        <h2 className="text-[10px] font-bold tracking-widest uppercase text-active-glow mb-6 border-b border-header-border/20 pb-2">
                            Birth Coordinates
                        </h2>

                        <div className="space-y-6">
                            <BirthDatum icon={Calendar} label="Incarnation Date" value={displayClient.dateOfBirth} />
                            <BirthDatum icon={Clock} label="Precise Time" value={`${displayClient.timeOfBirth} (Local Time)`} />
                            <BirthDatum icon={MapPin} label="Geography" value={displayClient.placeOfBirth.city} subValue="28.6139° N, 77.2090° E" />
                        </div>
                    </div>

                    {/* COSMIC SIGNATURES */}
                    <div className="grid grid-cols-2 gap-4">
                        <SignatureCard label="Ascendant" value="Cancer" />
                        <SignatureCard label="Moon Rashi" value={displayClient.rashi || "Leo"} highlight />
                        <SignatureCard label="Nakshatra" value="Magha" />
                        <SignatureCard label="Sun Sign" value="Leo" />
                    </div>
                </div>

                {/* RIGHT: Analytical Insights */}
                <div className="lg:col-span-8 space-y-8">

                    {/* MAIN LIFE TIMELINE (Vimshottari Overview) */}
                    <div className="bg-gradient-to-br from-ink-deep to-brown-dark border border-header-border/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                            <TrendingUp className="w-32 h-32 text-active-glow" />
                        </div>

                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-serif text-white font-bold tracking-tight">Vimshottari Lifecycle</h2>
                                <p className="text-[10px] text-header-border uppercase tracking-widest font-bold mt-1">Current Major Influence</p>
                            </div>
                            <div className="bg-sky-700/20 border border-sky-700/50 px-4 py-2 rounded-2xl">
                                <span className="text-sky-400 font-bold text-sm font-serif">Saturn Mahadasha</span>
                            </div>
                        </div>

                        {/* Interactive Timeline Visualization */}
                        <div className="space-y-6">
                            <div className="relative h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <div className="absolute top-0 left-0 h-full w-[60%] bg-gradient-to-r from-header-border to-mahogany shadow-[0_0_15px_rgba(208,140,96,0.3)]" />
                                <div className="absolute top-0 left-[60%] h-full w-[40%] bg-white/5" />
                                <div className="absolute top-0 bottom-0 left-[45%] w-1 bg-white cursor-pointer group shadow-[0_0_10px_white]">
                                    <div className="absolute -top-1 -left-1.5 w-4 h-4 rounded-full bg-white border border-header-border scale-0 group-hover:scale-100 transition-transform" />
                                </div>
                            </div>

                            <div className="flex justify-between items-start text-center">
                                <TimelineMark label="Past" value="Jupiter" year="2016" />
                                <TimelineMark label="Present" value="Saturn" year="2026" active />
                                <TimelineMark label="Future" value="Mercury" year="2032" />
                            </div>
                        </div>
                    </div>

                    {/* ACTION GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <ActionCard
                            title="Analytical Charts"
                            desc="Dive into D1, D9 and Divisional mappings."
                            href="/vedic-astrology"
                            icon={Sparkles}
                        />
                        <ActionCard
                            title="Dasha Predictor"
                            desc="Timeline analysis for career and luck."
                            href={`/client/${displayClient.name}/dashas`}
                            icon={TrendingUp}
                        />
                        <ActionCard
                            title="Report Lab"
                            desc="Generate professional synthesis PDFs."
                            href={`/client/${displayClient.name}/reports`}
                            icon={FileText}
                        />
                    </div>

                    {/* ASTROLOGER'S PRIVATE NOTES */}
                    <div className="bg-softwhite/5 border border-header-border/20 rounded-3xl p-8 backdrop-blur-md relative">
                        <div className="flex items-center gap-3 mb-4">
                            <History className="w-5 h-5 text-active-glow" />
                            <h3 className="text-sm font-bold text-active-glow uppercase tracking-widest font-serif">Consultant Summary</h3>
                        </div>
                        <p className="font-serif italic text-white/50 leading-relaxed text-lg font-light">
                            "Subject shows high spiritual aptitude due to Ketu in the 5th house. The current Saturn major period is forcing a restructuring of professional identity. Recommend focusing on grounding practices until Magha nakshatra stabilizes in late 2026..."
                        </p>
                        <button className="absolute top-8 right-8 text-header-border hover:text-active-glow transition-colors">
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

function BirthDatum({ icon: Icon, label, value, subValue }: { icon: React.ElementType, label: string, value: string, subValue?: string }) {
    return (
        <div className="flex gap-4 group">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-header-border group-hover:text-active-glow group-hover:border-active-glow/30 transition-all shadow-lg">
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <p className="text-[10px] font-bold tracking-widest uppercase text-white/60">{label}</p>
                <p className="font-serif text-lg font-bold text-white/90">{value}</p>
                {subValue && <p className="text-[10px] text-header-border font-serif italic">{subValue}</p>}
            </div>
        </div>
    );
}

function SignatureCard({ label, value, highlight = false }: { label: string, value: string, highlight?: boolean }) {
    return (
        <div className={`p-4 rounded-2xl border transition-all ${highlight ? 'bg-active-glow/10 border-active-glow/40 shadow-[0_0_20px_rgba(255,210,125,0.1)]' : 'bg-white/5 border-white/10'}`}>
            <p className="text-[9px] uppercase tracking-widest text-white/60 mb-1 font-bold">{label}</p>
            <p className={`font-serif text-lg font-extrabold ${highlight ? 'text-active-glow' : 'text-white/80'}`}>{value}</p>
        </div>
    );
}

function TimelineMark({ label, value, year, active = false }: { label: string, value: string, year: string, active?: boolean }) {
    return (
        <div className={`space-y-1 ${active ? 'opacity-100 scale-110' : 'opacity-40'}`}>
            <p className="text-[8px] font-black tracking-tighter uppercase text-header-border">{label}</p>
            <p className="text-xs font-serif font-bold text-white">{value}</p>
            <p className="text-[9px] text-white/60 font-bold">{year}</p>
        </div>
    );
}

function ActionCard({ title, desc, href, icon: Icon }: { title: string, desc: string, href: string, icon: React.ElementType }) {
    return (
        <Link href={href} className="flex flex-col p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-active-glow/40 hover:bg-active-glow/5 transition-all group shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-header-border/10 border border-header-border/20 flex items-center justify-center text-header-border mb-4 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-serif font-bold text-white mb-2">{title}</h4>
            <p className="text-[11px] text-white/60 leading-relaxed font-light">{desc}</p>
        </Link>
    );
}
