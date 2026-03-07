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
        <div className="flex items-center gap-2 bg-gold-primary/10 border border-gold-primary/30 rounded-lg px-3 py-1.5">
            <div className="w-2 h-2 rounded-full bg-gold-primary animate-pulse" />
            <span className="text-sm font-medium text-gold-dark">Current time: {timeStr}</span>
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
            <div className="bg-header-gradient rounded-xl p-6 border border-header-border/30">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-5 h-5 text-active-glow" />
                            <h1 className="font-serif text-2xl font-bold text-softwhite">Today&apos;s Muhurta</h1>
                        </div>
                        <p className="text-softwhite/80 font-serif italic text-sm">{dateStr}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {muhurta && (
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-1.5 text-xs font-medium text-softwhite/70 hover:text-softwhite transition-colors"
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
                <div className="bg-status-error/10 border border-status-error/30 rounded-xl p-6 text-center" role="alert">
                    <AlertTriangle className="w-8 h-8 text-status-error mx-auto mb-2" />
                    <p className="text-sm text-ink font-serif">Failed to load muhurta data. Please try again.</p>
                </div>
            ) : muhurta ? (
                <>
                    {/* Auspicious Windows */}
                    <div>
                        <h2 className="text-xs font-bold text-header-border tracking-widest font-serif uppercase mb-4 flex items-center gap-2">
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
                        <h2 className="text-xs font-bold text-header-border tracking-widest font-serif uppercase mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" /> Inauspicious Periods
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <MuhurtaTimeSlot window={muhurta.rahuKaal} />
                            <MuhurtaTimeSlot window={muhurta.gulikaKaal} />
                            <MuhurtaTimeSlot window={muhurta.yamagandam} />
                        </div>
                    </div>

                    {/* Sun/Moon Summary */}
                    <div className="bg-softwhite border border-antique rounded-xl p-5">
                        <h2 className="text-xs font-bold text-header-border tracking-widest font-serif uppercase mb-4">
                            Solar & Lunar Positions
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="flex items-center gap-2">
                                <Sun className="w-5 h-5 text-gold-primary" />
                                <div>
                                    <span className="text-xs text-muted-refined block">Sunrise</span>
                                    <span className="text-sm font-serif font-semibold text-ink">{muhurta.sunrise || '-'}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Sun className="w-5 h-5 text-gold-dark" />
                                <div>
                                    <span className="text-xs text-muted-refined block">Sunset</span>
                                    <span className="text-sm font-serif font-semibold text-ink">{muhurta.sunset || '-'}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Moon className="w-5 h-5 text-gold-primary" />
                                <div>
                                    <span className="text-xs text-muted-refined block">Abhijit Start</span>
                                    <span className="text-sm font-serif font-semibold text-ink">{muhurta.abhijitMuhurta.startTime}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Moon className="w-5 h-5 text-gold-dark" />
                                <div>
                                    <span className="text-xs text-muted-refined block">Abhijit End</span>
                                    <span className="text-sm font-serif font-semibold text-ink">{muhurta.abhijitMuhurta.endTime}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
}
