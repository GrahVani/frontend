"use client";

import React from "react";
import Link from "next/link";
import { Clock, Search, CalendarCheck, Heart, Sparkles, AlertTriangle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { KnowledgeTooltip } from "@/components/knowledge";
import { TYPOGRAPHY } from "@/design-tokens/typography";
import DailyPanchangWidget from "@/components/muhurta/DailyPanchangWidget";
import TimeQualityTimeline from "@/components/muhurta/TimeQualityTimeline";
import InauspiciousPeriods from "@/components/muhurta/InauspiciousPeriods";
import { useCurrentTimeQuality, useTodayInauspicious } from "@/hooks/queries/useMuhurta";
import { useTraditionStore } from "@/store/useTraditionStore";
import { Skeleton } from "@/components/ui/Skeleton";

function CurrentTimeIndicator() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });

    return (
        <div className="flex items-center gap-2 rounded-lg px-3 py-1.5"
             style={{
                 background: 'rgba(201,162,77,0.10)',
                 border: '1px solid rgba(201,162,77,0.25)',
             }}>
            <div className="w-2 h-2 rounded-full bg-gold-primary animate-pulse" />
            <span className="text-[13px] font-medium text-gold-dark">Current time: {timeStr}</span>
        </div>
    );
}

const QUICK_LINKS = [
    { href: "/muhurta/find", icon: Search, label: "Find Muhurat", desc: "Search for auspicious dates" },
    { href: "/muhurta/check", icon: CalendarCheck, label: "Check Date", desc: "Evaluate a specific date" },
    { href: "/muhurta/marriage", icon: Heart, label: "Marriage", desc: "Compatibility + wedding dates" },
    { href: "/muhurta/ceremonies", icon: Sparkles, label: "Ceremonies", desc: "All 11 ceremony types" },
    { href: "/muhurta/inauspicious", icon: AlertTriangle, label: "Inauspicious Times", desc: "Rahu Kaal & more" },
];

export default function MuhurtaDashboardPage() {
    const tradition = useTraditionStore((s) => s.tradition);
    const timeQuality = useCurrentTimeQuality(tradition);
    const inauspicious = useTodayInauspicious(tradition);

    const today = new Date();
    const dateStr = today.toLocaleDateString("en-IN", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
    });

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className={cn(TYPOGRAPHY.pageTitle, "flex items-center gap-3")}>
                        <Clock className="w-6 h-6 text-gold-dark" />
                        <KnowledgeTooltip term="muhurta" unstyled>Muhurat</KnowledgeTooltip> Dashboard
                    </h1>
                    <p className="text-ink/60 text-sm mt-1 font-serif">{dateStr}</p>
                </div>
                <CurrentTimeIndicator />
            </div>

            {/* Today's Panchang Widget */}
            <DailyPanchangWidget />

            {/* Time Quality Timeline */}
            {timeQuality.isLoading && (
                <div className="prem-card p-5">
                    <Skeleton className="h-20 w-full" />
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
                </div>
            )}
            {inauspicious.data && (
                <InauspiciousPeriods data={inauspicious.data} />
            )}

            {/* Quick Links */}
            <div>
                <h2 className={cn(TYPOGRAPHY.sectionTitle, "mb-3")}>Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {QUICK_LINKS.map(({ href, icon: Icon, label, desc }) => (
                        <Link
                            key={href}
                            href={href}
                            className="prem-card p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all group flex items-center gap-3"
                        >
                            <div className="w-9 h-9 rounded-full bg-gold-primary/10 flex items-center justify-center text-gold-dark shrink-0 group-hover:bg-gold-primary/20 transition-colors">
                                <Icon className="w-4.5 h-4.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-ink text-[13px] group-hover:text-gold-dark transition-colors">
                                    {label}
                                </p>
                                <p className="text-ink/50 text-[11px]">{desc}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-ink/20 group-hover:text-gold-dark transition-colors shrink-0" />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
