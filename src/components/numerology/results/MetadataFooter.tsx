"use client";

import { cn } from "@/lib/utils";
import type { ServiceMetadata } from "@/types/numerology.types";
import { Clock, Database, Cpu } from "lucide-react";

interface MetadataFooterProps {
    metadata: ServiceMetadata;
    className?: string;
}

export default function MetadataFooter({ metadata, className }: MetadataFooterProps) {
    return (
        <div className={cn("flex flex-wrap items-center gap-4 text-[11px] text-amber-800/50 font-medium", className)}>
            {metadata.calculation_method ? (
                <span className="inline-flex items-center gap-1">
                    <Cpu className="w-3 h-3" />
                    {metadata.calculation_method}
                </span>
            ) : null}
            {metadata.processing_time_ms != null ? (
                <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {metadata.processing_time_ms}ms
                </span>
            ) : null}
            {metadata.cached ? (
                <span className="inline-flex items-center gap-1">
                    <Database className="w-3 h-3" />
                    Cached
                </span>
            ) : null}
            {metadata.api_version ? <span>v{metadata.api_version}</span> : null}
        </div>
    );
}
