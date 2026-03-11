"use client";

import { useUpcomingFestivals } from "@/hooks/queries/useCalendar";
import { CalendarClock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function UpcomingFestivalsWidget() {
    const today = new Date().toISOString().split('T')[0];
    const { data: upcoming, isLoading } = useUpcomingFestivals(today);

    if (isLoading) {
        return (
            <div className="prem-card p-5 animate-pulse">
                <div className="h-6 w-1/2 bg-gold-primary/20 rounded mb-4" />
                <div className="space-y-3">
                    <div className="h-12 w-full bg-surface-warm/40 rounded" />
                    <div className="h-12 w-full bg-surface-warm/40 rounded" />
                    <div className="h-12 w-full bg-surface-warm/40 rounded" />
                </div>
            </div>
        );
    }

    if (!upcoming || upcoming.length === 0) {
        return null;
    }

    // Show only the next 4 events
    const displayEvents = upcoming.slice(0, 4);

    return (
        <div className="prem-card p-5 sticky top-24">
            <h3 className="text-[15px] font-serif font-bold text-ink flex items-center gap-2 mb-4 border-b border-gold-primary/20 pb-2">
                <CalendarClock className="w-4 h-4 text-gold-dark" />
                Coming Up Next
            </h3>
            
            <div className="space-y-3">
                {displayEvents.map((festival, i) => (
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={festival.id}
                        className="group relative pl-3"
                    >
                        <div className="absolute left-0 top-1.5 w-1 h-1 rounded-full bg-gold-primary" />
                        <Link href={`/calendar/festivals/${festival.date}`} className="block">
                            <div className="flex justify-between items-start gap-2">
                                <div>
                                    <h4 className="text-[13px] font-serif font-bold text-ink group-hover:text-gold-dark transition-colors leading-tight">
                                        {festival.name}
                                    </h4>
                                    <p className="text-[11px] text-ink/60 mt-0.5">
                                        {new Date(festival.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
                                    </p>
                                </div>
                                <ArrowRight className="w-3 h-3 text-gold-dark/0 group-hover:text-gold-dark/50 transition-colors shrink-0 mt-0.5" />
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
