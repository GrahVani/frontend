"use client";

import { useState } from "react";
import { Car } from "lucide-react";
import MuhurtaFilters from "@/components/muhurta/MuhurtaFilters";
import MuhurtaResultCard from "@/components/muhurta/MuhurtaResult";
import EmptyState from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { useCategoryMuhurta } from "@/hooks/queries/useMuhurta";
import type { MuhurtaFiltersState } from "@/types/muhurta.types";

export default function VehicleMuhurtaPage() {
    const [filters, setFilters] = useState<MuhurtaFiltersState | null>(null);

    const { data: results, isLoading } = useCategoryMuhurta(
        "vehicle",
        filters?.startDate,
        filters?.endDate,
    );

    const handleSearch = (f: MuhurtaFiltersState) => {
        setFilters(f);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="bg-header-gradient rounded-xl p-6 border border-header-border/30">
                <div className="flex items-center gap-2 mb-1">
                    <Car className="w-5 h-5 text-active-glow" />
                    <h1 className="font-serif text-2xl font-bold text-softwhite">Vehicle Purchase Muhurta</h1>
                </div>
                <p className="text-softwhite/80 font-serif italic text-sm max-w-2xl">
                    Find auspicious dates for purchasing a new vehicle or taking delivery of one.
                </p>
            </div>

            <MuhurtaFilters category="vehicle" onSearch={handleSearch} loading={isLoading} />

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : results && results.length > 0 ? (
                <div>
                    <h2 className="text-xs font-bold text-header-border tracking-widest font-serif uppercase mb-4">
                        {results.length} Auspicious Date{results.length !== 1 ? "s" : ""} Found
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {results.map((result) => (
                            <MuhurtaResultCard key={result.id} result={result} />
                        ))}
                    </div>
                </div>
            ) : filters ? (
                <EmptyState
                    icon={Car}
                    title="No auspicious dates found"
                    description="Try expanding your date range to find suitable vehicle purchase dates."
                />
            ) : (
                <EmptyState
                    icon={Car}
                    title="Search for vehicle dates"
                    description="Enter a date range and location above to find auspicious dates for purchasing a vehicle."
                />
            )}
        </div>
    );
}
