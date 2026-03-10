"use client";

import React, { useEffect, useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/Popover";
import { useKnowledgeTerm } from "@/hooks/queries/useKnowledge";
import { useKnowledgeBatchContext } from "./KnowledgeBatchProvider";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import type { KnowledgeEntry } from "@/types/knowledge.types";

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
 * Renders children with a subtle dotted gold underline (indicating clickability).
 * On click, opens a Radix Popover with the full knowledge entry:
 * title, Sanskrit, summary, description, howToRead, examples, and related terms.
 *
 * Supports two data-fetching modes:
 * 1. Inside <KnowledgeBatchProvider>: reads from pre-fetched batch (zero extra requests)
 * 2. Standalone: fetches individually on first open (lazy-loaded)
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

    // Individual fetch — only enabled when no batch provider AND popover is open
    const individualQuery = useKnowledgeTerm(
        !batchCtx && isOpen ? term : undefined
    );

    // Resolve the entry from batch context or individual query
    const entry: KnowledgeEntry | undefined | null = batchCtx
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
                        !unstyled && [
                            "cursor-help",
                            "border-b border-dotted border-gold-primary/40",
                            "hover:border-gold-primary/70 hover:text-gold-primary",
                            "transition-colors duration-200",
                        ],
                        className
                    )}
                    role="button"
                    tabIndex={0}
                    aria-label={`Learn about ${term.replace(/_/g, ' ')}`}
                >
                    {children}
                </span>
            </PopoverTrigger>

            <PopoverContent
                align={align}
                side={side}
                sideOffset={6}
                className={cn(
                    "w-[380px] max-h-[480px] overflow-y-auto p-0",
                    "border-gold-primary/15 shadow-[0_8px_32px_rgba(42,24,16,0.18)]",
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
        <div className="p-4 space-y-3">
            <Skeleton className="h-5 w-3/5" />
            <Skeleton className="h-3 w-2/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
        </div>
    );
}

function TooltipEmpty({ term }: { term: string }) {
    return (
        <div className="p-4 text-center text-text-muted text-sm">
            <p>No knowledge entry found for</p>
            <p className="font-mono text-xs mt-1 text-gold-primary/60">{term}</p>
        </div>
    );
}

function TooltipContent({ entry }: { entry: KnowledgeEntry }) {
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    const toggle = (section: string) =>
        setExpandedSection(prev => (prev === section ? null : section));

    return (
        <div className="divide-y divide-gold-primary/8">
            {/* Header */}
            <div className="px-4 pt-4 pb-3">
                <h4 className="font-semibold text-ink text-[15px] leading-tight">
                    {entry.title}
                </h4>
                {entry.sanskrit && (
                    <p className="text-gold-primary/70 text-xs mt-0.5 font-medium">
                        {entry.sanskrit}
                    </p>
                )}
                <p className="text-text-body text-[13px] mt-2 leading-relaxed">
                    {entry.summary}
                </p>
            </div>

            {/* Expandable Sections */}
            <div className="px-4 py-2">
                <ExpandableSection
                    label="Full Description"
                    isOpen={expandedSection === "description"}
                    onToggle={() => toggle("description")}
                >
                    <p className="text-text-body text-[12.5px] leading-relaxed whitespace-pre-line">
                        {entry.description}
                    </p>
                </ExpandableSection>

                {entry.howToRead && (
                    <ExpandableSection
                        label="How to Read"
                        isOpen={expandedSection === "howToRead"}
                        onToggle={() => toggle("howToRead")}
                    >
                        <p className="text-text-body text-[12.5px] leading-relaxed whitespace-pre-line">
                            {entry.howToRead}
                        </p>
                    </ExpandableSection>
                )}

                {entry.significance && (
                    <ExpandableSection
                        label="Significance"
                        isOpen={expandedSection === "significance"}
                        onToggle={() => toggle("significance")}
                    >
                        <p className="text-text-body text-[12.5px] leading-relaxed whitespace-pre-line">
                            {entry.significance}
                        </p>
                    </ExpandableSection>
                )}

                {entry.examples.length > 0 && (
                    <ExpandableSection
                        label={`Examples (${entry.examples.length})`}
                        isOpen={expandedSection === "examples"}
                        onToggle={() => toggle("examples")}
                    >
                        <div className="space-y-2">
                            {entry.examples.map((ex, i) => (
                                <div key={i} className="bg-parchment/40 rounded-lg p-2.5">
                                    <p className="text-ink text-[12px] font-medium">{ex.title}</p>
                                    <p className="text-text-body text-[12px] mt-1 leading-relaxed">
                                        {ex.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </ExpandableSection>
                )}
            </div>

            {/* Related Terms */}
            {entry.relatedTerms.length > 0 && (
                <div className="px-4 py-2.5">
                    <p className="text-text-muted text-[11px] uppercase tracking-wider font-medium mb-1.5">
                        Related
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {entry.relatedTerms.map((rt) => (
                            <span
                                key={rt}
                                className="inline-block text-[11px] px-2 py-0.5 rounded-full bg-gold-primary/8 text-gold-primary/80 border border-gold-primary/12"
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

// ─── Expandable Section ──────────────────────────────────

function ExpandableSection({
    label,
    isOpen,
    onToggle,
    children,
}: {
    label: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="py-1.5">
            <button
                type="button"
                onClick={onToggle}
                className={cn(
                    "flex items-center justify-between w-full text-left",
                    "text-[12px] font-medium py-1 rounded",
                    "hover:text-gold-primary transition-colors",
                    isOpen ? "text-gold-primary" : "text-text-muted",
                )}
            >
                <span>{label}</span>
                <svg
                    className={cn(
                        "w-3.5 h-3.5 transition-transform duration-200",
                        isOpen && "rotate-180",
                    )}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && (
                <div className="pt-1.5 pb-1 animate-in slide-in-from-top-1 duration-200">
                    {children}
                </div>
            )}
        </div>
    );
}
