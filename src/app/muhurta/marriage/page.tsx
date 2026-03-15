"use client";

import React, { useState } from "react";
import { Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from "@/design-tokens/typography";
import CompatibilityForm from "@/components/muhurta/compatibility/CompatibilityForm";
import CompatibilityResult from "@/components/muhurta/compatibility/CompatibilityResult";
import { useCompatibility } from "@/hooks/queries/useMuhurta";
import { Skeleton } from "@/components/ui/Skeleton";
import type { CompatibilityParams } from "@/types/muhurta.types";

export default function MarriageMuhurtaPage() {
  const [params, setParams] = useState<CompatibilityParams | null>(null);
  const { data, isLoading, isError, error } = useCompatibility(params);

  const handleSubmit = (p: CompatibilityParams) => {
    setParams(p);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className={cn(TYPOGRAPHY.pageTitle, "flex items-center gap-3")}>
          <Heart className="w-6 h-6 text-gold-dark" />
          Marriage Muhurat
        </h1>
        <p className="text-ink/60 text-sm mt-1">
          Check horoscope compatibility and find auspicious wedding dates
        </p>
      </div>

      {/* Compatibility Form */}
      <CompatibilityForm onSubmit={handleSubmit} isLoading={isLoading} />

      {/* Results */}
      {isLoading && (
        <div className="prem-card p-6 space-y-4">
          <Skeleton className="h-8 w-2/5" />
          <Skeleton className="h-5 w-3/5" />
          <div className="space-y-3 pt-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-5 flex-1" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
          <Skeleton className="h-6 w-full mt-3" />
        </div>
      )}

      {isError && (
        <div className="prem-card p-6 text-center">
          <p className="text-status-error font-medium">Compatibility check failed</p>
          <p className="text-ink/60 text-sm mt-1">
            {error?.message || "An unexpected error occurred. Please try again."}
          </p>
        </div>
      )}

      {data && !isLoading && <CompatibilityResult data={data} />}

      {/* Find Wedding Dates Link */}
      <Link
        href="/muhurta/find?event=VIVAH"
        className={cn(
          "group flex items-center justify-between w-full",
          "prem-card px-5 py-4 border border-gold-primary/20",
          "hover:border-gold-primary/40 hover:shadow-md transition-all duration-300",
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-primary/15 to-gold-soft/15 flex items-center justify-center">
            <Heart className="w-5 h-5 text-gold-dark" />
          </div>
          <div>
            <span className="text-[14px] font-semibold text-ink block">Find Wedding Dates</span>
            <span className="text-[12px] text-ink/45">
              Search for auspicious Vivah muhurat windows
            </span>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-gold-dark group-hover:translate-x-1 transition-transform duration-200" />
      </Link>
    </div>
  );
}
