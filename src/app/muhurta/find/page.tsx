"use client";

import React, { useState } from "react";
import { Search, Clock, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { KnowledgeTooltip } from "@/components/knowledge";
import { TYPOGRAPHY } from "@/design-tokens/typography";
import MuhuratSearchForm from "@/components/muhurta/MuhuratSearchForm";
import MuhuratResultCard from "@/components/muhurta/MuhuratResultCard";
import RejectionSummary from "@/components/muhurta/RejectionSummary";
import { useFindMuhurats } from "@/hooks/queries/useMuhurta";
import { Skeleton } from "@/components/ui/Skeleton";
import type { FindMuhuratParams } from "@/types/muhurta.types";

export default function FindMuhuratPage() {
    const [searchParams, setSearchParams] = useState<FindMuhuratParams | null>(null);
    const { data, isLoading, isError, error } = useFindMuhurats(searchParams);

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div>
                <h1 className={cn(TYPOGRAPHY.pageTitle, "flex items-center gap-3")}>
                    <Search className="w-6 h-6 text-gold-dark" />
                    Find Auspicious <KnowledgeTooltip term="muhurta" unstyled>Muhurat</KnowledgeTooltip>
                </h1>
                <p className="text-ink/60 text-sm mt-1">
                    Search for the best auspicious date-time windows for any ceremony
                </p>
            </div>

            {/* Search Form */}
            <MuhuratSearchForm
                onSearch={setSearchParams}
                isLoading={isLoading}
            />

            {/* Results */}
            {isLoading && (
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="prem-card p-6 space-y-3">
                            <Skeleton className="h-6 w-2/5" />
                            <Skeleton className="h-4 w-3/5" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-4/5" />
                        </div>
                    ))}
                </div>
            )}

            {isError && (
                <div className="prem-card p-6 text-center">
                    <p className="text-status-error font-medium">Search failed</p>
                    <p className="text-ink/60 text-sm mt-1">{error?.message || "An unexpected error occurred"}</p>
                </div>
            )}

            {data && !isLoading && (
                <div className="space-y-6">
                    {/* Search Metadata */}
                    <div className="flex flex-wrap items-center gap-4 text-[11px] font-medium text-ink/50 uppercase tracking-wider">
                        <span className="flex items-center gap-1.5">
                            <BarChart3 className="w-3.5 h-3.5" />
                            {data.total_muhurats} muhurat{data.total_muhurats !== 1 ? "s" : ""} found
                        </span>
                        <span className="text-gold-primary/30">|</span>
                        <span>{data.search_info.days_scanned} days scanned</span>
                        <span className="text-gold-primary/30">|</span>
                        <span>{data.search_info.candidates_evaluated} candidates evaluated</span>
                        <span className="text-gold-primary/30">|</span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {(data.search_info.computation_time_ms / 1000).toFixed(1)}s
                        </span>
                        <span className="text-gold-primary/30">|</span>
                        <span>{data.tradition_display}</span>
                    </div>

                    {/* Result Cards */}
                    {data.muhurats.length > 0 ? (
                        <div className="space-y-4">
                            {data.muhurats.map((result) => (
                                <MuhuratResultCard key={`${result.date}-${result.window_start}`} result={result} />
                            ))}
                        </div>
                    ) : (
                        <div className="prem-card p-8 text-center">
                            <p className="text-ink font-semibold text-lg">No auspicious muhurats found</p>
                            <p className="text-ink/60 text-sm mt-2">
                                Try expanding the date range or choosing a different tradition.
                            </p>
                        </div>
                    )}

                    {/* Rejection Summary */}
                    {data.rejection_summary && (
                        <RejectionSummary summary={data.rejection_summary} />
                    )}
                </div>
            )}
        </div>
    );
}
