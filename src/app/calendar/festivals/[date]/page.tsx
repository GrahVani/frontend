"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Calendar as CalendarIcon, Sun, Moon, Star, MapPin } from "lucide-react";
import { panchangApi } from "@/lib/api/panchang";
import { festivalApi } from "@/lib/api/festival";
import type { PanchangDay, Festival } from "@/types/calendar.types";
import { motion } from "framer-motion";

export default function DateDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const dateStr = params.date as string;
    
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
                    // Use Delhi defaults or user preferences if available
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

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-gold-primary/30 border-t-gold-primary rounded-full animate-spin mb-4" />
                <p className="text-ink/60 font-serif text-[14px]">Consulting the stars...</p>
            </div>
        );
    }

    const formattedDate = new Date(dateStr).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
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
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            {/* Header / Breadcrumb */}
            <div className="flex items-center justify-between mb-6">
                <button 
                    onClick={() => router.back()} 
                    className="flex items-center text-ink/70 hover:text-gold-dark transition-colors text-[14px] font-medium"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back to Calendar
                </button>
                <div className="flex items-center gap-2 text-ink/50 text-[12px]">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Calculated for New Delhi, India</span>
                </div>
            </div>

            {/* Date Title Card */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-header-gradient rounded-xl p-8 border border-gold-primary/20 relative overflow-hidden"
            >
                {/* Decorative background circle */}
                <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-gold-primary/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="relative z-10 flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gold-primary/20 border border-gold-primary/30 flex items-center justify-center shrink-0 shadow-inner">
                        <span className="font-serif text-[28px] font-bold text-gold-dark">
                            {new Date(dateStr).getDate()}
                        </span>
                    </div>
                    <div>
                        <h1 className="font-serif text-[28px] font-bold text-softwhite leading-tight">
                            {safeString(formattedDate)}
                        </h1>
                        <p className="text-gold-light font-serif italic text-[16px] mt-1">
                            {panchang?.panchanga?.tithi 
                                ? safeString(panchang.panchanga.tithi)
                                : 'Detailed Panchang View'}
                        </p>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Panchanga Details */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-[18px] font-serif font-bold text-ink flex items-center gap-2 border-b border-gold-primary/20 pb-2">
                        <Sun className="w-5 h-5 text-gold-dark" />
                        Vedic Panchanga
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <PanchangAttribute label="Tithi (Lunar Day)" value={panchang?.panchanga?.tithi} />
                        <PanchangAttribute label="Nakshatra (Constellation)" value={panchang?.panchanga?.nakshatra} />
                        <PanchangAttribute label="Yoga" value={panchang?.panchanga?.yoga} />
                        <PanchangAttribute label="Karana" value={panchang?.panchanga?.karana} />
                        <PanchangAttribute label="Vara (Weekday)" value={panchang?.panchanga?.vara || new Date(dateStr).toLocaleDateString('en', { weekday: 'long' })} />
                        <PanchangAttribute label="Ayanamsa" value={panchang?.ayanamsa || "Lahiri"} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                        <div className="prem-card p-5 bg-surface-warm/30 border-none shadow-none text-center">
                            <Sun className="w-6 h-6 text-gold-dark mx-auto mb-2 opacity-80" />
                            <div className="text-[12px] text-ink/60 mb-1 uppercase tracking-wider font-semibold">Sunrise</div>
                            <div className="font-serif text-[18px] text-ink font-bold">
                                {safeString(panchang?.times?.sunrise) || '--:--'}
                            </div>
                        </div>
                        <div className="prem-card p-5 bg-surface-warm/30 border-none shadow-none text-center">
                            <Moon className="w-6 h-6 text-gold-dark mx-auto mb-2 opacity-80" />
                            <div className="text-[12px] text-ink/60 mb-1 uppercase tracking-wider font-semibold">Sunset</div>
                            <div className="font-serif text-[18px] text-ink font-bold">
                                {safeString(panchang?.times?.sunset) || '--:--'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Festivals & Events */}
                <div className="space-y-6">
                    <h2 className="text-[18px] font-serif font-bold text-ink flex items-center gap-2 border-b border-gold-primary/20 pb-2">
                        <Star className="w-5 h-5 text-gold-dark" />
                        Festivals & Events
                    </h2>

                    {festivals.length > 0 ? (
                        <div className="space-y-4">
                            {festivals.map(festival => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={festival.id} 
                                    className="prem-card p-4 relative overflow-hidden group"
                                >
                                    {festival.is_government_holiday && (
                                        <div className="absolute top-0 left-0 w-1 h-full bg-red-500 rounded-l-xl" />
                                    )}
                                    <div className="pl-2">
                                        <div className="flex gap-2 items-start justify-between">
                                            <h3 className="font-serif font-bold text-ink text-[16px] leading-tight">
                                                {festival.name}
                                            </h3>
                                            <span className="text-[10px] bg-gold-primary/10 text-gold-dark px-2 py-0.5 rounded font-medium border border-gold-primary/20 shrink-0">
                                                {festival.category}
                                            </span>
                                        </div>
                                        {festival.name_hi && (
                                            <div className="text-[12px] font-medium text-ink/60 mb-2">{festival.name_hi}</div>
                                        )}
                                        <p className="text-[13px] text-ink/80 leading-relaxed mt-1">
                                            {festival.description}
                                        </p>
                                        
                                        {festival.is_government_holiday && (
                                            <div className="mt-3 inline-block px-2 py-1 bg-red-50 text-red-700 text-[11px] rounded font-semibold border border-red-100">
                                                ★ Government Holiday
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-surface-warm/40 border border-gold-primary/10 rounded-xl p-6 text-center">
                            <CalendarIcon className="w-8 h-8 text-ink/30 mx-auto mb-3" />
                            <p className="text-[14px] text-ink/60 font-medium">No major festivals or events observed on this date.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function PanchangAttribute({ label, value }: { label: string, value: any }) {
    const displayValue = (): string => {
        if (value === null || value === undefined) return '-';
        if (typeof value === 'string' || typeof value === 'number') return String(value);
        if (typeof value === 'object') {
            return String(value.name || value.time || JSON.stringify(value));
        }
        return String(value);
    };
    
    return (
        <div className="prem-card p-4 bg-surface-base">
            <span className="text-[11px] text-ink/50 uppercase tracking-widest font-semibold block mb-1">
                {label}
            </span>
            <span className="text-[15px] font-serif font-bold text-ink truncate block">
                {displayValue()}
            </span>
        </div>
    );
}
