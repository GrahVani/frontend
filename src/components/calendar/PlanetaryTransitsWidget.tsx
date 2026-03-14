"use client";

import { usePlanetaryTransitsData } from "@/hooks/queries/useCalendar";
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from "@/design-tokens/typography";
import { Orbit, ArrowRight, Calendar, Sparkles } from "lucide-react";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { motion } from "framer-motion";

interface PlanetaryTransitsWidgetProps {
    year: number;
    className?: string;
}

const planetColors: Record<string, string> = {
    "Sun": "from-orange-500/20 to-amber-500/10 text-orange-600",
    "Moon": "from-gray-300/30 to-gray-400/10 text-gray-600",
    "Mars": "from-red-500/20 to-orange-500/10 text-red-600",
    "Mercury": "from-green-500/20 to-emerald-500/10 text-green-600",
    "Jupiter": "from-yellow-500/20 to-amber-500/10 text-yellow-700",
    "Venus": "from-pink-500/20 to-rose-500/10 text-pink-600",
    "Saturn": "from-blue-500/20 to-indigo-500/10 text-blue-600",
    "Rahu": "from-purple-500/20 to-violet-500/10 text-purple-600",
    "Ketu": "from-teal-500/20 to-cyan-500/10 text-teal-600",
};

const planetSymbols: Record<string, string> = {
    "Sun": "☉",
    "Moon": "☽",
    "Mars": "♂",
    "Mercury": "☿",
    "Jupiter": "♃",
    "Venus": "♀",
    "Saturn": "♄",
    "Rahu": "☊",
    "Ketu": "☋",
};

export default function PlanetaryTransitsWidget({ year, className }: PlanetaryTransitsWidgetProps) {
    const { data, isLoading } = usePlanetaryTransitsData(year);

    if (isLoading) return <SkeletonCard className={className} />;
    
    // Handle nested data structure
    const transitData = data?.data || data;
    const transits = transitData?.transits || [];
    const transitYear = transitData?.year || year;
    
    if (transits.length === 0) return null;
    
    // Get upcoming transits
    const today = new Date();
    const upcomingTransits = transits
        .filter((t: any) => new Date(t.date) >= today)
        .slice(0, 5);

    return (
        <div className={cn("prem-card p-4", className)}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/15 to-purple-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                        <Orbit className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className={cn(TYPOGRAPHY.sectionTitle)}>Planetary Transits</h3>
                        <p className="text-[11px] text-primary font-medium">Gochar ({transitYear})</p>
                    </div>
                </div>
                <Sparkles className="w-4 h-4 text-gold-primary/60" />
            </div>

            <div className="space-y-2.5">
                {upcomingTransits.map((transit: any, index: number) => {
                    const planetName = String(transit.planet_name_en || transit.planet || '');
                    const transitDate = String(transit.date || '');
                    const toSign = String(transit.to_rashi || transit.to_sign || '');
                    const fromSign = String(transit.from_rashi || transit.from_sign || '');
                    const timeLocal = transit.time_local;
                    const isRetrograde = transit.is_retrograde;
                    
                    return (
                        <motion.div
                            key={`transit-${planetName}-${transitDate}-${index}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.08 }}
                            className="p-3 rounded-xl bg-surface-base/40 border border-surface-border/40 hover:border-gold-primary/30 transition-all"
                        >
                            <div className="flex items-center gap-3">
                                {/* Planet Symbol */}
                                <div className={cn(
                                    "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center text-lg font-serif shrink-0",
                                    planetColors[planetName] || "from-gold-primary/20 to-gold-primary/10 text-gold-dark"
                                )}>
                                    {planetSymbols[planetName] || planetName.charAt(0)}
                                </div>

                                {/* Transit Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[13px] font-medium text-primary">{planetName}</span>
                                        {isRetrograde && (
                                            <span className="text-[10px] px-1.5 py-0.5 bg-red-500/10 text-red-600 rounded">R</span>
                                        )}
                                        <span className="text-[11px] text-primary">→</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[14px] font-serif font-bold text-gold-dark">
                                            {toSign}
                                        </span>
                                        <ArrowRight className="w-3 h-3 text-primary" />
                                        <span className="text-[12px] text-primary">from {fromSign}</span>
                                    </div>
                                </div>

                                {/* Date */}
                                <div className="text-right shrink-0">
                                    <div className="flex items-center gap-1 text-[11px] text-primary">
                                        <Calendar className="w-3 h-3" />
                                        {transitDate ? new Date(transitDate).toLocaleDateString("en-IN", {
                                            month: "short",
                                            day: "numeric"
                                        }) : ''}
                                    </div>
                                    {timeLocal && (
                                        <p className="text-[10px] text-primary mt-0.5">{String(timeLocal)}</p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {upcomingTransits.length === 0 && (
                <div className="text-center py-4">
                    <p className="text-[12px] text-primary">No upcoming major transits</p>
                </div>
            )}

            <div className="mt-3 pt-3 border-t border-surface-border/30 text-center">
                <p className="text-[11px] text-primary">
                    Total {transits.length} planetary movements in {year}
                </p>
            </div>
        </div>
    );
}
