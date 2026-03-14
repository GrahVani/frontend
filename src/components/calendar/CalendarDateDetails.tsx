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
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gold-primary/15 to-gold-primary/5 border border-gold-primary/20 flex items-center justify-center">
                        <CalendarIcon className="w-4 h-4 text-gold-dark" />
                    </div>
                    <div>
                        <h2 className={cn(TYPOGRAPHY.sectionTitle)}>Date Details</h2>
                        <p className="text-[10px] text-primary font-medium">Daily Panchang</p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 text-primary/70 text-[10px] font-medium uppercase tracking-wider px-2 py-1 rounded-lg bg-surface-base/50 border border-gold-primary/60">
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
                        className="flex-1 flex flex-col items-center justify-center py-12"
                    >
                        <Loader2 className="w-8 h-8 text-gold-primary animate-spin mb-3" />
                        <p className="text-primary/60 font-serif text-[13px] italic">Consulting the stars...</p>
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        key={dateStr}
                        className="flex-1 space-y-4 overflow-y-auto pr-1 custom-scrollbar"
                    >
                        {/* Title Section - Clean styling */}
                        <div className="bg-white border border-gold-primary/60 rounded-xl p-4">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-gold-primary/10 border border-gold-primary/60 flex flex-col items-center justify-center shrink-0">
                                    <span className="font-serif text-[10px] text-gold-dark uppercase tracking-wider font-semibold">
                                        {new Date(dateStr).toLocaleDateString('en-IN', { month: 'short' })}
                                    </span>
                                    <span className="font-serif text-[22px] font-bold text-primary leading-none">
                                        {new Date(dateStr).getDate()}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-serif text-[16px] font-bold text-primary leading-tight">
                                        {formattedDate}
                                    </h3>
                                    <p className="text-primary font-serif italic text-[13px] mt-1 truncate">
                                        {panchang?.panchanga?.tithi ? safeString(panchang.panchanga.tithi) : 'Vedic Panchang'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Panchanga Attributes - Clean white cards */}
                        <div className="grid grid-cols-2 gap-2">
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

                        {/* Sun Times - Clean white cards */}
                        <div className="grid grid-cols-2 gap-2">
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

                        {/* Festivals - Clean white cards */}
                        <div className="pt-1">
                            <h4 className="text-[13px] font-bold text-primary flex items-center gap-2 mb-3 pb-2 border-b border-gold-primary/60">
                                <Star className="w-4 h-4 text-gold-primary" />
                                Festivals & Events
                            </h4>
                            
                            {festivals.length > 0 ? (
                                <div className="space-y-2">
                                    {festivals.map(festival => (
                                        <div key={festival.id} className="bg-white border border-gold-primary/60 rounded-xl p-3 relative">
                                            {festival.is_government_holiday && (
                                                <div className="absolute top-0 left-0 w-1 h-full bg-red-400 rounded-l-xl" />
                                            )}
                                            <div className={cn("flex gap-2 items-start justify-between", festival.is_government_holiday && "pl-2")}>
                                                <h5 className="font-serif font-bold text-primary text-[14px] leading-tight">
                                                    {festival.name}
                                                </h5>
                                                {festival.is_government_holiday && (
                                                    <span className="text-[9px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 border border-red-100">
                                                        Holiday
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[12px] text-primary/90 leading-relaxed line-clamp-2 mt-1 font-medium">
                                                {festival.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white border border-gold-primary/60 rounded-xl p-6 text-center">
                                    <Star className="w-6 h-6 text-gold-primary/30 mx-auto mb-2" />
                                    <p className="text-[12px] text-primary/50">No festivals on this date</p>
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
        <div className="flex items-center gap-3 p-3 bg-white border border-gold-primary/60 rounded-xl">
            <div className="w-9 h-9 rounded-lg bg-surface-base/50 flex items-center justify-center shrink-0">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <span className="text-[10px] text-primary/90 uppercase tracking-wider font-bold block">
                    {label}
                </span>
                <span className="text-[13px] font-serif font-bold text-primary truncate block">
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
        <div className="bg-white border border-gold-primary/60 rounded-xl p-3 text-center flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-surface-base/50 flex items-center justify-center mb-2">
                {icon}
            </div>
            <div className="text-[10px] text-primary/90 uppercase tracking-wider font-bold">{label}</div>
            <div className="font-serif text-[15px] text-primary font-bold mt-0.5">
                {displayValue()}
            </div>
        </div>
    );
}
