"use client";

import { CHALDEAN_CATEGORIES, RAW_CALCULATOR_CATEGORIES, RAW_CALCULATORS } from "@/lib/numerology-constants";
import CategoryOverviewCard from "@/components/numerology/CategoryOverviewCard";
import { Calculator, Sparkles, ArrowRight, Cpu, Zap } from "lucide-react";
import Link from "next/link";

const totalServiceEndpoints = CHALDEAN_CATEGORIES.reduce((sum, c) => sum + c.count, 0);

export default function ChaldeanOverviewPage() {
    return (
        <div className="space-y-10">
            {/* ═══════════════════════════════════════════════════════════ */}
            {/* Hero Header */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <div className="relative prem-card overflow-hidden">
                {/* Decorative glow */}
                <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(201,162,77,0.4) 0%, transparent 70%)' }} />

                <div className="relative p-6 md:p-8">
                    <h1 className="text-[24px] md:text-[28px] font-bold font-serif text-primary leading-tight">
                        Chaldean Numerology
                    </h1>
                    <p className="text-[14px] text-amber-800/60 mt-2 max-w-2xl">
                        The most ancient and accurate numerological system. Unlock the hidden vibrations in names, numbers,
                        dates, and relationships through {totalServiceEndpoints} AI-powered analyses and {RAW_CALCULATORS.length} pure mathematical calculators.
                    </p>

                    {/* Stats row */}
                    <div className="flex flex-wrap gap-4 mt-5">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(201,162,77,0.08)', border: '1px solid rgba(201,162,77,0.15)' }}>
                            <Sparkles className="w-4 h-4 text-amber-600" />
                            <div>
                                <p className="text-[18px] font-bold font-serif text-gold-dark">{totalServiceEndpoints}</p>
                                <p className="text-[9px] font-bold uppercase tracking-wider text-amber-600">AI Analyses</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(100,116,139,0.06)', border: '1px solid rgba(100,116,139,0.12)' }}>
                            <Cpu className="w-4 h-4 text-slate-500" />
                            <div>
                                <p className="text-[18px] font-bold font-serif text-slate-700">{RAW_CALCULATORS.length}</p>
                                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Raw Calculators</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.12)' }}>
                            <Zap className="w-4 h-4 text-emerald-500" />
                            <div>
                                <p className="text-[18px] font-bold font-serif text-emerald-700">{CHALDEAN_CATEGORIES.length}</p>
                                <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600">Departments</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* SECTION 1: AI-Powered Analyses */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <section>
                {/* Section header with gold accent bar */}
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-1 h-8 rounded-full bg-gradient-to-b from-active-glow to-gold-primary" />
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-600" />
                        <h2 className="text-[18px] font-bold font-serif text-primary">AI-Powered Analyses</h2>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-200">
                        {totalServiceEndpoints} endpoints
                    </span>
                </div>
                <p className="text-[13px] text-amber-800/50 mb-4 ml-4">
                    Full-featured analyses with Quick Scores, AI-generated narratives, personalized recommendations, and lucky element mapping.
                </p>

                {/* Category grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {CHALDEAN_CATEGORIES.map((category) => (
                        <CategoryOverviewCard key={category.key} category={category} />
                    ))}
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* SECTION 2: Raw Calculators */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <section>
                {/* Section header with slate accent bar */}
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-1 h-8 rounded-full bg-gradient-to-b from-slate-400 to-slate-600" />
                    <div className="flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-slate-600" />
                        <h2 className="text-[18px] font-bold font-serif text-primary">Raw Calculators</h2>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                        {RAW_CALCULATORS.length} calculators
                    </span>
                </div>
                <p className="text-[13px] text-amber-800/50 mb-4 ml-4">
                    Pure mathematical Chaldean computations. Instant, deterministic results with no AI processing. Ideal for astrologers who want raw data.
                </p>

                {/* Department grid — show top categories as preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {RAW_CALCULATOR_CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        return (
                            <Link
                                key={cat.key}
                                href={`/numerology/chaldean/raw-calculators?dept=${cat.key}`}
                                className="group p-4 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(241,245,249,0.8) 0%, rgba(226,232,240,0.5) 100%)',
                                    border: '1px solid rgba(148,163,184,0.20)',
                                }}
                            >
                                <div className="flex items-center gap-2.5 mb-2">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                                        <Icon className="w-4 h-4 text-slate-600" />
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-semibold text-slate-800 group-hover:text-slate-900 leading-tight">{cat.name}</p>
                                        <p className="text-[10px] font-medium text-slate-500">{cat.slugs.length} calculators</p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* View All CTA */}
                <div className="mt-4 flex justify-center">
                    <Link
                        href="/numerology/chaldean/raw-calculators"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                        style={{
                            background: 'rgba(241,245,249,0.8)',
                            border: '1px solid rgba(148,163,184,0.25)',
                        }}
                    >
                        <Calculator className="w-4 h-4" />
                        <span>Explore All {RAW_CALCULATORS.length} Raw Calculators</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
