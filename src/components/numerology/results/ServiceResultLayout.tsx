"use client";

import { cn } from "@/lib/utils";
import type { ChaldeanServiceResponse, QuickScore, AnalysisSummary, Verdict } from "@/types/numerology.types";
import { Sparkles, ChevronDown, Gem } from "lucide-react";
import React from "react";
import DetailedAnalysisAccordion from "./DetailedAnalysisAccordion";

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

const VERDICT_STYLES: Record<string, string> = {
    HIGHLY_FAVORABLE: "bg-amber-100 text-amber-800 border-amber-300",
    FAVORABLE: "bg-emerald-100 text-emerald-800 border-emerald-300",
    NEUTRAL: "bg-yellow-100 text-yellow-800 border-yellow-300",
    UNFAVORABLE: "bg-red-100 text-red-800 border-red-300",
};
const VERDICT_LABELS: Record<string, string> = {
    HIGHLY_FAVORABLE: "Highly Favorable",
    FAVORABLE: "Favorable",
    NEUTRAL: "Neutral",
    UNFAVORABLE: "Unfavorable",
};

function InlineVerdict({ verdict }: { verdict: Verdict }) {
    const style = VERDICT_STYLES[verdict];
    if (!style) return null;
    return (
        <span className={cn("px-1.5 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-wider border", style)}>
            {VERDICT_LABELS[verdict] || verdict}
        </span>
    );
}

function isLazySummary(summary: unknown): boolean {
    if (!summary || typeof summary !== 'object') return true;
    const s = summary as Record<string, unknown>;
    const oneLiner = s.one_liner as string | null | undefined;
    const keyInsight = s.key_insight as string | null | undefined;
    if (!oneLiner && !keyInsight) return true;
    const combined = `${oneLiner || ''} ${keyInsight || ''}`.toLowerCase();
    return /see detailed|review the full|see the report/.test(combined);
}

function extractReading(narrative: unknown): string | null {
    if (typeof narrative === 'string' && narrative.length > 0) return narrative;
    if (typeof narrative === 'object' && narrative !== null) {
        const obj = narrative as Record<string, unknown>;
        if (obj.available) return (obj.personalized_reading as string) || null;
    }
    return null;
}

function hasRecContent(recs: unknown): boolean {
    if (Array.isArray(recs)) return recs.length > 0;
    if (!recs || typeof recs !== 'object') return false;
    const r = recs as Record<string, unknown>;
    return Boolean(
        (r.action_items as unknown[] | undefined)?.length ||
        (r.lucky_elements && typeof r.lucky_elements === 'object' && Object.keys(r.lucky_elements as object).length > 0) ||
        (r.warnings as unknown[] | undefined)?.length ||
        r.primary_action
    );
}

function Divider() {
    return <hr className="border-gold-primary/10 my-2" />;
}

// ═══════════════════════════════════════════════════════════════════════════════
// HERO STRIP — Score + Summary, no card wrapper, maximum density
// ═══════════════════════════════════════════════════════════════════════════════

function HeroStrip({ score, summary }: { score?: QuickScore; summary?: AnalysisSummary }) {
    if (!score && !summary) return null;

    const rating = score ? Math.min(10, Math.max(0, score.overall_rating)) : 0;
    const circumference = 2 * Math.PI * 20;
    const percentage = (rating / 10) * 100;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex items-start gap-3">
            {score ? (
                <div className="relative w-12 h-12 shrink-0">
                    <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                        <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(201,162,77,0.10)" strokeWidth="3.5" />
                        <circle cx="24" cy="24" r="20" fill="none" stroke="var(--gold-primary)" strokeWidth="3.5" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="transition-all duration-700" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-[14px] font-bold font-serif text-gold-dark leading-none">{rating}</span>
                        <span className="text-[6px] font-medium text-amber-800/40">/10</span>
                    </div>
                </div>
            ) : null}

            <div className="flex-1 min-w-0 space-y-0.5">
                {score ? (
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[13px] font-semibold text-primary">{score.rating_label}</span>
                        <span className="text-[11px] font-bold text-amber-500">{score.stars.toFixed(1)}★</span>
                        <InlineVerdict verdict={score.verdict} />
                    </div>
                ) : null}
                {summary?.one_liner ? (
                    <p className="text-[11px] font-serif italic text-primary/60 leading-snug">&ldquo;{summary.one_liner}&rdquo;</p>
                ) : null}
                {summary?.key_insight ? (
                    <p className="text-[10px] text-primary/70 leading-snug">{summary.key_insight}</p>
                ) : null}
                {summary?.recommendation ? (
                    <p className="text-[10px] text-emerald-800/60 leading-snug">{summary.recommendation}</p>
                ) : null}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// AI NARRATIVE — Inline collapsible toggle, no card
// ═══════════════════════════════════════════════════════════════════════════════

function NarrativePanel({ reading }: { reading: string }) {
    const [expanded, setExpanded] = React.useState(false);
    return (
        <div>
            <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1.5 text-[10px] font-semibold text-amber-700 hover:text-amber-600 transition-colors">
                <Sparkles className="w-3 h-3" />
                <span>AI Reading</span>
                <ChevronDown className={cn("w-3 h-3 transition-transform", expanded && "rotate-180")} />
            </button>
            {expanded ? <p className="text-[11px] text-primary/70 leading-relaxed mt-1.5 pl-[18px] whitespace-pre-line">{reading}</p> : null}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// RECOMMENDATIONS — Inline, handles array + object formats
// ═══════════════════════════════════════════════════════════════════════════════

function renderLuckyValue(value: unknown): React.ReactNode {
    if (Array.isArray(value) && value.length > 0 && value.every(v => typeof v === 'string'))
        return <span className="text-[10px] text-primary">{(value as string[]).join(', ')}</span>;
    if (Array.isArray(value) && value.length > 0 && value.every(v => typeof v === 'number'))
        return <span className="text-[11px] font-bold text-gold-dark tabular-nums">{(value as number[]).join(', ')}</span>;
    if (typeof value === 'string') return <span className="text-[10px] font-semibold text-amber-800">{value}</span>;
    if (typeof value === 'number') return <span className="text-[11px] font-bold text-gold-dark">{value}</span>;
    return <span className="text-[10px] text-primary/50">{JSON.stringify(value)}</span>;
}

function InlineRecommendations({ recommendations }: { recommendations: unknown }) {
    // Array format (packages / unique)
    if (Array.isArray(recommendations)) {
        return (
            <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                    <span className="w-0.5 h-3 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600" />
                    <span className="text-[10px] font-bold text-primary/60">Recommendations</span>
                </div>
                <div className="space-y-0.5">
                    {(recommendations as Array<Record<string, unknown>>).map((item, i) => {
                        const category = item.category as string | undefined;
                        const body = (item.recommendation || item.action || '') as string;
                        const priority = item.priority as string | undefined;
                        const pColor = !priority ? "" : priority.toLowerCase() === 'high' ? "text-red-600" : priority.toLowerCase() === 'medium' ? "text-amber-700" : "text-emerald-700";
                        return (
                            <div key={i} className="flex items-start gap-1.5 text-[10px]">
                                <span className="font-bold text-amber-700/50 tabular-nums shrink-0">{i + 1}.</span>
                                <span className="flex-1 text-primary/70">
                                    {category ? <span className="font-semibold text-primary capitalize">{category}: </span> : null}
                                    {body}
                                </span>
                                {priority ? <span className={cn("text-[7px] font-bold uppercase shrink-0", pColor)}>{priority}</span> : null}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // Object format (standard service)
    const recs = recommendations as Record<string, unknown>;
    const actionItems = recs.action_items as unknown[] | undefined;
    const luckyElements = recs.lucky_elements as Record<string, unknown> | undefined;
    const warnings = recs.warnings as unknown[] | undefined;
    const primaryAction = recs.primary_action as string | undefined;

    return (
        <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
                <span className="w-0.5 h-3 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600" />
                <span className="text-[10px] font-bold text-primary/60">Recommendations</span>
            </div>

            {primaryAction ? (
                <p className="text-[11px] text-emerald-800 font-medium pl-2.5 border-l-2 border-emerald-400">{primaryAction}</p>
            ) : null}

            {actionItems && actionItems.length > 0 ? (
                <div className="space-y-0.5">
                    {actionItems.map((item, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-[10px]">
                            <span className="font-bold text-amber-700/50 tabular-nums shrink-0">{i + 1}.</span>
                            <span className="text-primary/70">{typeof item === 'string' ? item : JSON.stringify(item)}</span>
                        </div>
                    ))}
                </div>
            ) : null}

            {luckyElements && Object.keys(luckyElements).length > 0 ? (
                <div className="pt-1 border-t border-gold-primary/8">
                    <div className="flex items-center gap-1 mb-1">
                        <Gem className="w-2.5 h-2.5 text-amber-600" />
                        <span className="text-[8px] font-bold uppercase tracking-wider text-amber-700/40">Lucky</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-1">
                        {Object.entries(luckyElements).map(([key, value]) => (
                            <div key={key} className="min-w-0">
                                <span className="text-[8px] font-bold uppercase tracking-wider text-amber-700/40 block">{key.replace(/_/g, ' ')}</span>
                                {renderLuckyValue(value)}
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}

            {warnings && warnings.length > 0 ? (
                <div className="pt-1 border-t border-red-200/20 space-y-0.5">
                    {warnings.map((w, i) => (
                        <p key={i} className="text-[10px] text-red-600">{typeof w === 'string' ? w : JSON.stringify(w)}</p>
                    ))}
                </div>
            ) : null}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// METADATA
// ═══════════════════════════════════════════════════════════════════════════════

function MetadataRow({ metadata }: { metadata: Record<string, unknown> }) {
    return (
        <div className="flex flex-wrap items-center gap-3 text-[9px] text-primary/25 font-medium">
            {metadata.calculation_method ? <span>{metadata.calculation_method as string}</span> : null}
            {metadata.processing_time_ms != null ? <span>{metadata.processing_time_ms as number}ms</span> : null}
            {metadata.cached ? <span>Cached</span> : null}
            {metadata.api_version ? <span>v{metadata.api_version as string}</span> : null}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN — Single prem-card, HR dividers between sections
// ═══════════════════════════════════════════════════════════════════════════════

const UTILITY_KEYS = new Set([
    'input', 'metadata', 'package_type', 'success',
    'service', 'service_version', 'service_type',
    'cached', 'calculatedAt', 'results', 'scores',
]);

interface ServiceResultLayoutProps {
    response: ChaldeanServiceResponse;
    className?: string;
}

export default function ServiceResultLayout({ response, className }: ServiceResultLayoutProps) {
    const data = response.data as Record<string, unknown>;
    const isStandardShape = data.results && typeof data.results === 'object' && !Array.isArray(data.results);

    if (isStandardShape) {
        const results = data.results as Record<string, unknown>;
        const metadata = data.metadata as Record<string, unknown> | undefined;

        // Pre-check all sections to avoid empty dividers
        const score = results.quick_score as QuickScore | undefined;
        const rawSummary = results.summary;
        const summary = rawSummary && !isLazySummary(rawSummary) ? (rawSummary as AnalysisSummary) : undefined;
        const hasHero = Boolean(score) || Boolean(summary);
        const reading = extractReading(results.ai_narrative);
        const hasAnalysis = results.detailed_analysis && typeof results.detailed_analysis === 'object' && Object.keys(results.detailed_analysis as object).length > 0;
        const hasRecs = hasRecContent(results.recommendations);

        // Build sections array — dividers only render between sections
        const sections: React.ReactNode[] = [];
        if (hasHero) sections.push(<HeroStrip key="h" score={score} summary={summary} />);
        if (reading) sections.push(<NarrativePanel key="n" reading={reading} />);
        if (hasAnalysis) sections.push(<DetailedAnalysisAccordion key="a" analysis={results.detailed_analysis as Record<string, unknown>} />);
        if (hasRecs) sections.push(<InlineRecommendations key="r" recommendations={results.recommendations} />);
        if (metadata) sections.push(<MetadataRow key="m" metadata={metadata} />);

        if (sections.length === 0) return null;

        return (
            <div className={cn("prem-card px-4 py-3 animate-in fade-in duration-300", className)}>
                {sections.map((section, i) => (
                    <React.Fragment key={i}>
                        {i > 0 ? <Divider /> : null}
                        {section}
                    </React.Fragment>
                ))}
            </div>
        );
    }

    // Flat package / unique response
    const metadata = data.metadata as Record<string, unknown> | undefined;
    const sections: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
        if (!UTILITY_KEYS.has(key) && value !== null && value !== undefined && value !== '') {
            sections[key] = value;
        }
    }

    const parts: React.ReactNode[] = [];
    if (data.package_type) {
        parts.push(
            <span key="badge" className="inline-flex px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-200">
                {String(data.package_type)} Package
            </span>
        );
    }
    if (Object.keys(sections).length > 0) {
        parts.push(<DetailedAnalysisAccordion key="a" analysis={sections} />);
    }
    if (metadata) {
        parts.push(<MetadataRow key="m" metadata={metadata} />);
    }

    if (parts.length === 0) return null;

    return (
        <div className={cn("prem-card px-4 py-3 animate-in fade-in duration-300", className)}>
            {parts.map((part, i) => (
                <React.Fragment key={i}>
                    {i > 0 ? <Divider /> : null}
                    {part}
                </React.Fragment>
            ))}
        </div>
    );
}
