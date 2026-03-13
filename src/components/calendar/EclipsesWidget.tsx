"use client";

import { useEclipses } from "@/hooks/queries/useCalendar";
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from "@/design-tokens/typography";
import { Eclipse, Sun, Moon, Clock, MapPin } from "lucide-react";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { motion } from "framer-motion";

interface EclipsesWidgetProps {
    year: number;
    className?: string;
}

export default function EclipsesWidget({ year, className }: EclipsesWidgetProps) {
    const { data, isLoading } = useEclipses(year);

    if (isLoading) return <SkeletonCard className={className} />;
    
    // Handle the nested data structure
    const eclipseData = data?.data || data;
    const eclipses = eclipseData?.eclipses || [];
    const totalCount = eclipseData?.total_eclipses || eclipses.length;
    
    if (eclipses.length === 0) return null;

    const getEclipseIcon = (type: string) => {
        if (type === "solar") return <Sun className="w-4 h-4 text-orange-500" />;
        return <Moon className="w-4 h-4 text-indigo-500" />;
    };

    const getEclipseBadge = (subtype: string) => {
        if (subtype === "Total") return "bg-orange-500/10 text-orange-600 border-orange-200";
        if (subtype === "Partial") return "bg-amber-500/10 text-amber-600 border-amber-200";
        if (subtype === "Annular") return "bg-red-500/10 text-red-600 border-red-200";
        return "bg-indigo-500/10 text-indigo-600 border-indigo-200";
    };

    return (
        <div className={cn("prem-card p-4", className)}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
                        <Eclipse className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className={cn(TYPOGRAPHY.sectionTitle, "text-[14px]")}>Grahan (Eclipses)</h3>
                        <p className="text-[11px] text-primary">{year} Celestial Events</p>
                    </div>
                </div>
                <span className="text-[11px] font-medium px-2 py-1 bg-gold-primary/10 text-gold-dark rounded-full">
                    {totalCount} Events
                </span>
            </div>

            <div className="space-y-3">
                {eclipses.slice(0, 4).map((eclipse: any, index: number) => {
                    const eclipseDate = String(eclipse.date || '');
                    const eclipseType = String(eclipse.type || '');
                    const eclipseSubtype = String(eclipse.subtype || '');
                    const eclipseName = String(eclipse.name_en || '');
                    const maxEclipseLocal = eclipse.max_eclipse_local;
                    const isVisible = eclipse.local_visibility?.visible;
                    
                    return (
                        <motion.div
                            key={`eclipse-${eclipseDate}-${index}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-3 rounded-xl bg-surface-base/50 border border-surface-border/50 hover:border-gold-primary/30 transition-all group"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-surface-base to-surface-border flex items-center justify-center group-hover:scale-105 transition-transform">
                                        {getEclipseIcon(eclipseType)}
                                    </div>
                                    <div>
                                        <h4 className="text-[13px] font-medium text-primary">{eclipseName}</h4>
                                        <p className="text-[11px] text-primary">
                                            {eclipseDate ? new Date(eclipseDate).toLocaleDateString("en-IN", {
                                                weekday: "short",
                                                month: "short",
                                                day: "numeric"
                                            }) : ''}
                                        </p>
                                    </div>
                                </div>
                                <span className={cn(
                                    "text-[10px] px-2 py-0.5 rounded-full border",
                                    getEclipseBadge(eclipseSubtype)
                                )}>
                                    {eclipseSubtype}
                                </span>
                            </div>

                            {maxEclipseLocal && (
                                <div className="mt-2 flex items-center gap-3 text-[11px] text-primary ml-10">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        Max: {String(maxEclipseLocal).split('T')[1]?.split('+')[0] || maxEclipseLocal}
                                    </span>
                                    {!isVisible && (
                                        <span className="flex items-center gap-1 text-primary">
                                            <MapPin className="w-3 h-3" />
                                            Not visible from location
                                        </span>
                                    )}
                                </div>
                            )}
                            
                            {eclipse.sutak && (
                                <div className="mt-2 ml-10 p-2 rounded bg-red-500/5 border border-red-500/10">
                                    <p className="text-[10px] text-red-600/80">
                                        <span className="font-medium">Sutak:</span> {String(eclipse.sutak.start || '').split('T')[1]?.split('+')[0] || eclipse.sutak.start} - {String(eclipse.sutak.end || '').split('T')[1]?.split('+')[0] || eclipse.sutak.end}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {eclipses.length > 4 && (
                <p className="text-center text-[11px] text-primary mt-3">
                    +{eclipses.length - 4} more eclipses this year
                </p>
            )}
        </div>
    );
}
