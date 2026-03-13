"use client";

import { useEffect, useState } from "react";
import { Calendar as CalendarIcon, Sun, Moon, Star, MapPin, Loader2 } from "lucide-react";
import { panchangApi } from "@/lib/api/panchang";
import { festivalApi } from "@/lib/api/festival";
import type { Festival } from "@/types/calendar.types";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from "@/design-tokens/typography";

interface CalendarDateDetailsProps {
    dateStr: string;
    className?: string;
}

export default function CalendarDateDetails({ dateStr, className }: CalendarDateDetailsProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [panchang, setPanchang] = useState<any>(null);
    const [festivals, setFestivals] = useState<Festival[]>([]);

    useEffect(() => {
        if (!dateStr) return;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch Panchang for this specific date
                const panchangRes = await panchangApi.getPanchang({
                    birthDate: dateStr,
                    birthTime: "06:00:00"
                });
                if (panchangRes.success) {
                    setPanchang(panchangRes.data);
                }

                // Fetch Festivals for this specific date
                const festivalRes = await festivalApi.getFestivalsByDate({ 
                    date: dateStr,
                    latitude: 28.6139,
                    longitude: 77.2090,
                    timezone: "Asia/Kolkata" 
                });
                
                if (festivalRes.success && festivalRes.data && festivalRes.data.festivals) {
                    setFestivals(festivalRes.data.festivals);
                }
            } catch (error) {
                console.error("Failed to load details for date:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [dateStr]);

    const formattedDate = new Date(dateStr).toLocaleDateString('en-IN', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    const safeString = (val: any): string => {
        if (!val) return '';
        if (typeof val === 'string') return val;
        if (typeof val === 'object' && val !== null) {
            return String(val.name || val.time || JSON.stringify(val));
        }
        return String(val);
    };

    return (
        <div className={cn("flex flex-col h-full", className)}>
            <div className="flex items-center justify-between mb-3 px-1">
                <h2 className={cn(TYPOGRAPHY.sectionTitle, "text-[15px] text-primary")}>Date Details</h2>
                <div className="flex items-center gap-1.5 text-primary text-[10px] font-medium uppercase tracking-wider">
                    <MapPin className="w-3 h-3" />
                    <span>New Delhi</span>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key="loading"
                        className="flex-1 flex flex-col items-center justify-center py-12 prem-card border-none bg-surface-base/30"
                    >
                        <Loader2 className="w-8 h-8 text-gold-primary animate-spin mb-3" />
                        <p className="text-primary font-serif text-[13px] italic">Consulting the stars...</p>
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        key={dateStr}
                        className="flex-1 space-y-4 overflow-y-auto pr-1 custom-scrollbar"
                    >
                        {/* Title Section - Light Elegant Theme */}
                        <div className="prem-card p-4 border-gold-primary/30 bg-surface-base relative overflow-hidden shadow-sm group hover:shadow-md transition-all duration-300">
                            {/* Accent background element */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gold-primary/5 rounded-full -mr-10 -mt-10 blur-xl group-hover:bg-gold-primary/10 transition-colors" />
                            
                            <div className="relative z-10 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gold-primary/10 border border-gold-primary/20 flex items-center justify-center shrink-0 shadow-inner">
                                    <span className="font-serif text-[22px] font-bold text-primary">
                                        {new Date(dateStr).getDate()}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-serif text-[16px] font-bold text-primary leading-tight">
                                        {formattedDate}
                                    </h3>
                                    <p className="text-primary font-serif italic text-[13px] mt-0.5">
                                        {panchang?.panchanga?.tithi ? safeString(panchang.panchanga.tithi) : 'Vedic Panchang'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Panchanga Attributes */}
                        <div className="grid grid-cols-1 gap-2">
                            <AttributeItem 
                                icon={<Sun className="w-4 h-4 text-gold-dark" />}
                                label="Tithi" 
                                value={panchang?.panchanga?.tithi} 
                            />
                            <AttributeItem 
                                icon={<Star className="w-4 h-4 text-amber-500" />}
                                label="Nakshatra" 
                                value={panchang?.panchanga?.nakshatra} 
                            />
                            <AttributeItem 
                                icon={<MapPin className="w-4 h-4 text-indigo-500" />}
                                label="Yoga" 
                                value={panchang?.panchanga?.yoga} 
                            />
                            <AttributeItem 
                                icon={<Moon className="w-4 h-4 text-slate-500" />}
                                label="Karana" 
                                value={panchang?.panchanga?.karana} 
                            />
                        </div>

                        {/* Sun Times */}
                        <div className="grid grid-cols-2 gap-2.5">
                            <TimeWidget 
                                label="Sunrise" 
                                value={panchang?.times?.sunrise} 
                                icon={<Sun className="w-4 h-4 text-gold-dark" />} 
                            />
                            <TimeWidget 
                                label="Sunset" 
                                value={panchang?.times?.sunset} 
                                icon={<Moon className="w-4 h-4 text-slate-500" />} 
                            />
                        </div>

                        {/* Festivals */}
                        <div className="pt-1">
                            <h4 className="text-[14px] font-serif font-bold text-primary flex items-center gap-2 mb-2 border-b border-primary pb-1">
                                <Star className="w-4 h-4 text-gold-primary" />
                                Festivals & Events
                            </h4>
                            
                            {festivals.length > 0 ? (
                                <div className="space-y-3">
                                    {festivals.map(festival => (
                                        <div key={festival.id} className="prem-card p-2.5 border-none bg-surface-base/40 relative overflow-hidden">
                                            {festival.is_government_holiday && (
                                                <div className="absolute top-0 left-0 w-1 h-full bg-red-500/60" />
                                            )}
                                            <div className="flex gap-2 items-start justify-between">
                                                <h5 className="font-serif font-bold text-primary text-[13px] leading-tight">
                                                    {festival.name}
                                                </h5>
                                                {festival.is_government_holiday && (
                                                    <span className="text-[8px] bg-red-500/10 text-red-600 px-1.5 py-0.5 rounded font-black uppercase tracking-wider shrink-0">
                                                        Holiday
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[12px] text-primary leading-normal line-clamp-3">
                                                {festival.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-surface-base/20 border border-primary/5 rounded-xl p-6 text-center italic">
                                    <p className="text-[12px] text-primary font-medium font-serif">Quiet celestial alignment</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function AttributeItem({ label, value, icon }: { label: string, value: any, icon: React.ReactNode }) {
    const displayValue = (): string => {
        if (!value) return '-';
        if (typeof value === 'string' || typeof value === 'number') return String(value);
        if (typeof value === 'object') return String(value.name || value.time || '-');
        return String(value);
    };
    
    return (
        <div className="flex items-center gap-2.5 p-2 prem-card border-none bg-surface-base/30 group hover:bg-surface-base/50 transition-colors">
            <div className="w-7 h-7 rounded-lg bg-surface-modal flex items-center justify-center shrink-0 shadow-sm border border-primary/5">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <span className="text-[10px] text-primary uppercase tracking-widest font-bold block mb-0.5">
                    {label}
                </span>
                <span className="text-[13px] font-serif font-bold text-primary truncate block leading-tight">
                    {displayValue()}
                </span>
            </div>
        </div>
    );
}

function TimeWidget({ label, value, icon }: { label: string, value: any, icon: React.ReactNode }) {
    const displayValue = (): string => {
        if (!value) return '--:--';
        if (typeof value === 'string') return value;
        if (typeof value === 'object') return value.time || value.name || String(value);
        return String(value);
    };

    return (
        <div className="prem-card p-2 border-none bg-surface-base/30 text-center flex flex-col items-center">
            <div className="mb-1">{icon}</div>
            <div className="text-[8px] text-primary mb-0.5 uppercase tracking-wider font-bold">{label}</div>
            <div className="font-serif text-[13px] text-primary font-bold">
                {displayValue()}
            </div>
        </div>
    );
}
