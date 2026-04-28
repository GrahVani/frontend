"use client";

import React, { useEffect, useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/Popover";
import { useKnowledgeTerm } from "@/hooks/queries/useKnowledge";
import { useKnowledgeBatchContext } from "./KnowledgeBatchProvider";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

interface KnowledgeTooltipProps {
    /** The termKey to look up (e.g., "tithi", "sub_lord", "koota_nadi") */
    term: string;
    /** The visible text/element that triggers the popover */
    children: React.ReactNode;
    /** Additional CSS classes for the trigger wrapper */
    className?: string;
    /** Override the default trigger styling (dotted gold underline) */
    unstyled?: boolean;
    /** Popover alignment relative to trigger */
    align?: "start" | "center" | "end";
    /** Popover preferred side */
    side?: "top" | "bottom" | "left" | "right";
}

/**
 * Interactive knowledge tooltip that reveals educational content on click.
 *
 * Renders children with a gold ⓘ badge indicating clickability.
 * On click, opens a premium parchment-styled popover with the full knowledge entry:
 * title, Sanskrit, summary, description, howToRead, examples, and related terms.
 *
 * Supports two data-fetching modes:
 * 1. Inside <KnowledgeBatchProvider>: reads from pre-fetched batch (zero extra requests)
 * 2. Standalone: fetches individually via static embedded data (no API call)
 *
 * @example
 *   <KnowledgeTooltip term="tithi">Tithi</KnowledgeTooltip>
 *   <KnowledgeTooltip term="sub_lord">Sub Lord (SL)</KnowledgeTooltip>
 */
export function KnowledgeTooltip({
    term,
    children,
    className,
    unstyled = false,
    align = "start",
    side = "bottom",
}: KnowledgeTooltipProps) {
    const batchCtx = useKnowledgeBatchContext();
    const [isOpen, setIsOpen] = useState(false);

    // Register with batch provider on mount (if available)
    useEffect(() => {
        batchCtx?.register(term);
    }, [term, batchCtx]);

    // Static lookup — always resolve (data is embedded, no API call)
    const individualQuery = useKnowledgeTerm(
        !batchCtx ? term : undefined
    );

    // Resolve the entry from batch context or individual query
    const entry = batchCtx
        ? batchCtx.getEntry(term)
        : individualQuery.data;

    const isLoading = batchCtx
        ? batchCtx.isLoading
        : individualQuery.isLoading;

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <span
                    className={cn(
                        "cursor-help inline-flex flex-wrap items-center gap-1 transition-all duration-200 group/kt",
                        !unstyled && [
                            "border-b-2 border-dotted border-gold-dark",
                            "hover:border-gold-primary hover:text-gold-dark",
                        ],
                        className
                    )}
                    role="button"
                    tabIndex={0}
                    aria-label={`Learn about ${term.replace(/_/g, ' ')}`}
                >
                    {children}
                    <span
                        className={cn(
                            "inline-flex items-center justify-center shrink-0",
                            "w-[18px] h-[18px] rounded-full",
                            "bg-white border border-gold-dark",
                            "text-gold-dark text-[11px] font-black leading-none",
                            "shadow-[0_1px_3px_rgba(156,122,47,0.4)]",
                            "group-hover/kt:bg-gold-soft/20 group-hover/kt:border-gold-primary",
                            "group-hover/kt:shadow-[0_1px_6px_rgba(201,162,77,0.5)]",
                            "transition-all duration-200",
                        )}
                        aria-hidden="true"
                    >
                        i
                    </span>
                </span>
            </PopoverTrigger>

            <PopoverContent
                align={align}
                side={side}
                sideOffset={8}
                className={cn(
                    "w-[calc(100vw-32px)] sm:w-[420px] max-h-[520px] overflow-y-auto p-0",
                    "bg-softwhite border-2 border-gold-dark/30",
                    "rounded-xl",
                    "shadow-[0_8px_40px_rgba(62,42,31,0.25),0_2px_8px_rgba(62,42,31,0.12)]",
                )}
            >
                {isLoading && <TooltipSkeleton />}
                {!isLoading && !entry && <TooltipEmpty term={term} />}
                {!isLoading && entry && <TooltipContent entry={entry} />}
            </PopoverContent>
        </Popover>
    );
}

// ─── Sub-Components ──────────────────────────────────────

function TooltipSkeleton() {
    return (
        <div className="p-5 space-y-3">
            <Skeleton className="h-6 w-3/5" />
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-px w-full bg-gold-primary/20" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
        </div>
    );
}

function TooltipEmpty({ term }: { term: string }) {
    return (
        <div className="p-6 text-center">
            <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-gold-primary/10 flex items-center justify-center">
                <span className="text-gold-primary text-lg">?</span>
            </div>
            <p className="text-ink text-sm font-medium">No knowledge entry found</p>
            <p className="font-mono text-xs mt-1.5 text-gold-dark px-3 py-1 bg-parchment/60 rounded inline-block">
                {term}
            </p>
        </div>
    );
}

function TooltipContent({ entry }: { entry: { title: string; sanskrit?: string | null; summary: string; description: string; howToRead?: string | null; significance?: string | null; examples: { title: string; content: string }[]; relatedTerms: string[] } }) {
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    const toggle = (section: string) =>
        setExpandedSection(prev => (prev === section ? null : section));

    const sectionCount = [
        true, // description is always present
        !!entry.howToRead,
        !!entry.significance,
        entry.examples.length > 0,
    ].filter(Boolean).length;

    return (
        <div>
            {/* ── Header Band ── ornate gradient top bar */}
            <div className="bg-gradient-to-r from-bronze-dark via-bronze to-bronze-dark px-5 pt-4 pb-3 rounded-t-xl relative overflow-hidden">
                {/* Decorative corner ornament */}
                <div className="absolute top-0 right-0 w-16 h-16 opacity-10">
                    <svg viewBox="0 0 64 64" fill="none">
                        <path d="M64 0 L64 64 L0 64 Q32 32 64 0Z" fill="currentColor" className="text-gold-soft" />
                    </svg>
                </div>

                <h4 className="font-semibold text-[16px] leading-tight text-white/95 tracking-wide">
                    {entry.title}
                </h4>
                {entry.sanskrit && (
                    <p className="text-active-glow/80 text-[12px] mt-1 font-serif font-medium italic tracking-wide">
                        {entry.sanskrit}
                    </p>
                )}
            </div>

            {/* ── Summary ── always visible, prominent */}
            <div className="px-5 py-4 bg-parchment/50 border-b border-gold-primary/15">
                <p className="text-ink text-[13.5px] leading-relaxed font-medium">
                    {entry.summary}
                </p>
            </div>

            {/* ── Expandable Sections ── */}
            <div className="px-5 py-3">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gold-dark">
                        Deep Dive
                    </span>
                    <span className="text-[10px] text-ink/40">
                        {sectionCount} {sectionCount === 1 ? 'section' : 'sections'}
                    </span>
                    <div className="flex-1 h-px bg-gradient-to-r from-gold-primary/20 to-transparent" />
                </div>

                <ExpandableSection
                    label="Full Description"
                    icon="scroll"
                    isOpen={expandedSection === "description"}
                    onToggle={() => toggle("description")}
                >
                    <p className="text-ink/90 text-[13px] leading-[1.7] whitespace-pre-line">
                        {entry.description}
                    </p>
                </ExpandableSection>

                {entry.howToRead && (
                    <ExpandableSection
                        label="How to Read / Interpret"
                        icon="eye"
                        isOpen={expandedSection === "howToRead"}
                        onToggle={() => toggle("howToRead")}
                    >
                        <p className="text-ink/90 text-[13px] leading-[1.7] whitespace-pre-line">
                            {entry.howToRead}
                        </p>
                    </ExpandableSection>
                )}

                {entry.significance && (
                    <ExpandableSection
                        label="Scriptural Significance"
                        icon="star"
                        isOpen={expandedSection === "significance"}
                        onToggle={() => toggle("significance")}
                    >
                        <p className="text-ink/90 text-[13px] leading-[1.7] whitespace-pre-line">
                            {entry.significance}
                        </p>
                    </ExpandableSection>
                )}

                {entry.examples.length > 0 && (
                    <ExpandableSection
                        label={`Practical Examples (${entry.examples.length})`}
                        icon="bulb"
                        isOpen={expandedSection === "examples"}
                        onToggle={() => toggle("examples")}
                    >
                        <div className="space-y-2.5">
                            {entry.examples.map((ex, i) => (
                                <div key={i} className="bg-parchment/60 rounded-lg p-3 border border-gold-primary/10">
                                    <p className="text-ink text-[12.5px] font-semibold flex items-center gap-1.5">
                                        <span className="text-gold-dark text-[10px]">{i + 1}.</span>
                                        {ex.title}
                                    </p>
                                    <p className="text-ink/80 text-[12.5px] mt-1.5 leading-relaxed">
                                        {ex.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </ExpandableSection>
                )}
            </div>

            {/* ── Related Terms ── */}
            {entry.relatedTerms.length > 0 && (
                <div className="px-5 py-3 bg-parchment/30 border-t border-gold-primary/12 rounded-b-xl">
                    <p className="text-gold-dark text-[10px] uppercase tracking-[0.15em] font-bold mb-2">
                        Related Concepts
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {entry.relatedTerms.map((rt) => (
                            <span
                                key={rt}
                                className={cn(
                                    "inline-block text-[11px] px-2.5 py-1 rounded-full font-medium",
                                    "bg-gold-primary/12 text-gold-dark border border-gold-primary/20",
                                    "hover:bg-gold-primary/20 transition-colors cursor-default",
                                )}
                            >
                                {rt.replace(/_/g, ' ')}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Section Icons ──────────────────────────────────────

const SECTION_ICONS: Record<string, React.ReactNode> = {
    scroll: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
            <path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" />
        </svg>
    ),
    eye: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    ),
    star: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    ),
    bulb: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18h6" /><path d="M10 22h4" />
            <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
        </svg>
    ),
};

// ─── Expandable Section ──────────────────────────────────

function ExpandableSection({
    label,
    icon,
    isOpen,
    onToggle,
    children,
}: {
    label: string;
    icon: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="py-1">
            <button
                type="button"
                onClick={onToggle}
                className={cn(
                    "flex items-center gap-2 w-full text-left",
                    "text-[13px] font-semibold py-2 px-2.5 rounded-lg",
                    "transition-all duration-200",
                    isOpen
                        ? "text-gold-dark bg-gold-primary/8"
                        : "text-ink/70 hover:text-gold-dark hover:bg-gold-primary/5",
                )}
            >
                <span className={cn(
                    "transition-colors duration-200",
                    isOpen ? "text-gold-primary" : "text-ink/40",
                )}>
                    {SECTION_ICONS[icon]}
                </span>
                <span className="flex-1">{label}</span>
                <svg
                    className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        isOpen && "rotate-180",
                    )}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && (
                <div className="px-2.5 pt-2 pb-2.5 animate-in slide-in-from-top-1 duration-200">
                    {children}
                </div>
            )}
        </div>
    );
}
