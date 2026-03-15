"use client";

import React, { useState } from "react";
import { AlertTriangle, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from "@/design-tokens/typography";
import TraditionSelector from "@/components/muhurta/TraditionSelector";
import InauspiciousPeriods from "@/components/muhurta/InauspiciousPeriods";
import TimeQualityTimeline from "@/components/muhurta/TimeQualityTimeline";
import { useInauspiciousWindows, useTimeQuality } from "@/hooks/queries/useMuhurta";
import { useTraditionStore } from "@/store/useTraditionStore";
import { Skeleton } from "@/components/ui/Skeleton";
import type { TraditionCode } from "@/types/muhurta.types";

export default function InauspiciousPage() {
    const storeTradition = useTraditionStore((s) => s.tradition);
    const today = new Date().toISOString().slice(0, 10);
    const [date, setDate] = useState(today);
    const [tradition, setTradition] = useState<TraditionCode>(storeTradition);

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const inauspicious = useInauspiciousWindows({ date, tradition });
    const timeQuality = useTimeQuality({ date, time: currentTime, tradition });

    return (
        <div className="space-y-6 pb-12">
            <div>
                <h1 className={cn(TYPOGRAPHY.pageTitle, "flex items-center gap-3")}>
                    <AlertTriangle className="w-6 h-6 text-gold-dark" />
                    Inauspicious Times
                </h1>
                <p className={cn("text-ink/60 text-sm", "mt-1")}>
                    Check Rahu Kaal, Yamaganda, Gulika Kaal, and other inauspicious windows for any date
                </p>
            </div>

            {/* Controls */}
            <div className="prem-card p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-widest text-ink/50 mb-1.5">
                            Select Date
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-softwhite border border-antique rounded-lg px-3 py-2.5 text-sm text-ink focus:border-gold-primary focus:outline-none"
                        />
                    </div>
                    <TraditionSelector value={tradition} onChange={setTradition} />
                </div>
            </div>

            {/* Time Quality Timeline */}
            {timeQuality.isLoading && (
                <div className="prem-card p-5">
                    <Skeleton className="h-16 w-full" />
                </div>
            )}
            {timeQuality.data && (
                <TimeQualityTimeline
                    timeQuality={timeQuality.data.time_quality}
                    sunrise={timeQuality.data.sunrise}
                    sunset={timeQuality.data.sunset}
                />
            )}

            {/* Inauspicious Windows */}
            {inauspicious.isLoading && (
                <div className="prem-card p-6 space-y-3">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-3/5" />
                </div>
            )}
            {inauspicious.isError && (
                <div className="prem-card p-6 text-center">
                    <p className="text-status-error font-medium">Failed to load inauspicious windows</p>
                    <p className="text-ink/60 text-sm mt-1">{inauspicious.error?.message}</p>
                </div>
            )}
            {inauspicious.data && (
                <InauspiciousPeriods data={inauspicious.data} />
            )}
        </div>
    );
}
