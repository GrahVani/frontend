"use client";

import React, { useState } from "react";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from "@/design-tokens/typography";
import CompatibilityForm from "@/components/muhurta/compatibility/CompatibilityForm";
import CompatibilityResult from "@/components/muhurta/compatibility/CompatibilityResult";
import { useCompatibility } from "@/hooks/queries/useMuhurta";
import { Skeleton } from "@/components/ui/Skeleton";
import type { CompatibilityParams } from "@/types/muhurta.types";

export default function CompatibilityPage() {
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
          <Users className="w-6 h-6 text-gold-dark" />
          Compatibility Check
        </h1>
        <p className="text-ink/60 text-sm mt-1">
          Analyze horoscope compatibility using Ashtakoot or Dasha Porutham systems
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
    </div>
  );
}
