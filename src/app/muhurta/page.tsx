"use client";

import { Clock, Sun, Moon, AlertTriangle, Sparkles, Copy, Check } from "lucide-react";
import { useState } from "react";
import MuhurtaTimeSlot from "@/components/muhurta/MuhurtaTimeSlot";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { useTodayMuhurta } from "@/hooks/queries/useMuhurta";

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

export default function MuhurtaPage() {
    const { data: muhurta, isLoading, error } = useTodayMuhurta();
    const [copied, setCopied] = useState(false);

    const today = new Date();
    const dateStr = today.toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const handleCopy = () => {
        if (!muhurta) return;
        const text = [
            `Muhurta for ${dateStr}`,
            ``,
            `Abhijit Muhurta: ${muhurta.abhijitMuhurta.startTime} - ${muhurta.abhijitMuhurta.endTime}`,
            `Brahma Muhurta: ${muhurta.brahmaMuhurta.startTime} - ${muhurta.brahmaMuhurta.endTime}`,
            ``,
            `Rahu Kaal: ${muhurta.rahuKaal.startTime} - ${muhurta.rahuKaal.endTime}`,
            `Gulika Kaal: ${muhurta.gulikaKaal.startTime} - ${muhurta.gulikaKaal.endTime}`,
            `Yamagandam: ${muhurta.yamagandam.startTime} - ${muhurta.yamagandam.endTime}`,
            muhurta.sunrise ? `\nSunrise: ${muhurta.sunrise}` : '',
            muhurta.sunset ? `Sunset: ${muhurta.sunset}` : '',
        ].filter(Boolean).join('\n');

        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="prem-card glass-shimmer relative overflow-hidden p-5">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                             style={{
                                 background: 'linear-gradient(135deg, rgba(201,162,77,0.18) 0%, rgba(139,90,43,0.10) 100%)',
                                 border: '1px solid rgba(201,162,77,0.25)',
                                 boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(139,90,43,0.08)',
                             }}>
                            <Clock className="w-5 h-5 text-gold-dark" />
                        </div>
                        <div>
                            <h1 className="text-[18px] font-serif font-bold text-ink leading-tight">Today&apos;s Muhurta</h1>
                            <p className="text-[13px] text-ink/50 font-medium mt-0.5">{dateStr}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {muhurta && (
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-1.5 text-[12px] font-medium text-ink/45 hover:text-gold-dark transition-colors"
                                title="Copy today's muhurta timings"
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {copied ? 'Copied' : 'Copy'}
                            </button>
                        )}
                        <CurrentTimeIndicator />
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            ) : error ? (
                <div className="rounded-xl p-6 text-center" role="alert"
                     style={{
                         background: 'rgba(220,38,38,0.06)',
                         border: '1px solid rgba(220,38,38,0.18)',
                     }}>
                    <AlertTriangle className="w-8 h-8 text-status-error mx-auto mb-2" />
                    <p className="text-[13px] text-ink font-serif font-medium">Failed to load muhurta data. Please try again.</p>
                </div>
            ) : muhurta ? (
                <>
                    {/* Auspicious Windows */}
                    <div>
                        <h2 className="text-[11px] font-bold text-gold-dark tracking-widest font-serif uppercase mb-4 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> Auspicious Windows
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <MuhurtaTimeSlot window={muhurta.abhijitMuhurta} />
                            <MuhurtaTimeSlot window={muhurta.brahmaMuhurta} />
                            {muhurta.generalWindows.map((w, i) => (
                                <MuhurtaTimeSlot key={i} window={w} />
                            ))}
                        </div>
                    </div>

                    {/* Inauspicious Periods */}
                    <div>
                        <h2 className="text-[11px] font-bold text-gold-dark tracking-widest font-serif uppercase mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" /> Inauspicious Periods
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <MuhurtaTimeSlot window={muhurta.rahuKaal} />
                            <MuhurtaTimeSlot window={muhurta.gulikaKaal} />
                            <MuhurtaTimeSlot window={muhurta.yamagandam} />
                        </div>
                    </div>

                    {/* Sun/Moon Summary */}
                    <div className="prem-card p-5">
                        <h2 className="text-[11px] font-bold text-gold-dark tracking-widest font-serif uppercase mb-4">
                            Solar & Lunar Positions
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="flex items-center gap-2">
                                <Sun className="w-5 h-5 text-gold-primary" />
                                <div>
                                    <span className="text-[11px] text-ink/45 block font-medium">Sunrise</span>
                                    <span className="text-[14px] font-serif font-semibold text-ink">{muhurta.sunrise || '-'}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Sun className="w-5 h-5 text-gold-dark" />
                                <div>
                                    <span className="text-[11px] text-ink/45 block font-medium">Sunset</span>
                                    <span className="text-[14px] font-serif font-semibold text-ink">{muhurta.sunset || '-'}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Moon className="w-5 h-5 text-gold-primary" />
                                <div>
                                    <span className="text-[11px] text-ink/45 block font-medium">Abhijit Start</span>
                                    <span className="text-[14px] font-serif font-semibold text-ink">{muhurta.abhijitMuhurta.startTime}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Moon className="w-5 h-5 text-gold-dark" />
                                <div>
                                    <span className="text-[11px] text-ink/45 block font-medium">Abhijit End</span>
                                    <span className="text-[14px] font-serif font-semibold text-ink">{muhurta.abhijitMuhurta.endTime}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
}
