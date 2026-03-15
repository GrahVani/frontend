"use client";

import React, { useState } from "react";
import { CalendarCheck, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from "@/design-tokens/typography";
import TraditionSelector from "@/components/muhurta/TraditionSelector";
import EventTypeSelector from "@/components/muhurta/EventTypeSelector";
import PersonInputForm from "@/components/muhurta/PersonInputForm";
import DateVerdictCard from "@/components/muhurta/DateVerdictCard";
import MuhuratResultCard from "@/components/muhurta/MuhuratResultCard";
import { useEvaluateDate } from "@/hooks/queries/useMuhurta";
import { useTraditionStore } from "@/store/useTraditionStore";
import { Skeleton } from "@/components/ui/Skeleton";
import type { EvaluateDateParams, EventTypeCode, TraditionCode, PersonInput } from "@/types/muhurta.types";

export default function CheckDatePage() {
    const storeTradition = useTraditionStore((s) => s.tradition);
    const [eventType, setEventType] = useState<EventTypeCode | "">("");
    const [tradition, setTradition] = useState<TraditionCode>(storeTradition);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("10:00");
    const [person, setPerson] = useState<Partial<PersonInput>>({
        latitude: 28.6139, longitude: 77.2090, timezone: "Asia/Kolkata",
    });
    const [searchParams, setSearchParams] = useState<EvaluateDateParams | null>(null);
    const [formError, setFormError] = useState("");

    const { data, isLoading, isError, error } = useEvaluateDate(searchParams);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFormError("");
        if (!eventType) { setFormError("Please select an event type"); return; }
        if (!date) { setFormError("Please select a date"); return; }
        if (!person.birth_date || !person.birth_time) {
            setFormError("Please enter birth date and time");
            return;
        }

        setSearchParams({
            event_type: eventType,
            tradition,
            date,
            time: time || undefined,
            latitude: person.latitude,
            longitude: person.longitude,
            timezone: person.timezone,
            persons: [{
                birth_date: person.birth_date,
                birth_time: person.birth_time,
                latitude: person.latitude ?? 28.6139,
                longitude: person.longitude ?? 77.2090,
                timezone: person.timezone ?? "Asia/Kolkata",
            }],
        });
    }

    return (
        <div className="space-y-6 pb-12">
            <div>
                <h1 className={cn(TYPOGRAPHY.pageTitle, "flex items-center gap-3")}>
                    <CalendarCheck className="w-6 h-6 text-gold-dark" />
                    Check a Specific Date
                </h1>
                <p className="text-ink/60 text-sm mt-1">
                    Evaluate whether a particular date is auspicious for your ceremony
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="prem-card p-6 space-y-5" style={{ borderTop: "3px solid var(--gold-primary)" }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <EventTypeSelector value={eventType} onChange={(v: EventTypeCode) => setEventType(v)} />
                    <TraditionSelector value={tradition} onChange={setTradition} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-widest text-ink/50 mb-1.5">
                            Date to Check
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-softwhite border border-antique rounded-lg px-3 py-2.5 text-sm text-ink focus:border-gold-primary focus:outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-widest text-ink/50 mb-1.5">
                            Time (Optional)
                        </label>
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full bg-softwhite border border-antique rounded-lg px-3 py-2.5 text-sm text-ink focus:border-gold-primary focus:outline-none"
                        />
                    </div>
                </div>

                <PersonInputForm label="Your Birth Details" value={person} onChange={setPerson} />

                {formError && (
                    <p className="text-status-error text-sm font-medium">{formError}</p>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className={cn(
                        "w-full py-3 rounded-xl font-semibold text-sm transition-all",
                        "bg-gradient-to-r from-gold-dark to-amber-700 text-white shadow-md",
                        "hover:from-amber-600 hover:to-amber-800",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "flex items-center justify-center gap-2",
                    )}
                >
                    {isLoading ? (
                        <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                    ) : (
                        <Search className="w-4 h-4" />
                    )}
                    {isLoading ? "Evaluating..." : "Check This Date"}
                </button>
            </form>

            {/* Results */}
            {isLoading && (
                <div className="prem-card p-6 space-y-3">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-4 w-3/5" />
                    <Skeleton className="h-4 w-full" />
                </div>
            )}

            {isError && (
                <div className="prem-card p-6 text-center">
                    <p className="text-status-error font-medium">Evaluation failed</p>
                    <p className="text-ink/60 text-sm mt-1">{error?.message}</p>
                </div>
            )}

            {data && !isLoading && (
                <div className="space-y-6">
                    {data.date_verdict && (
                        <DateVerdictCard verdict={data.date_verdict} />
                    )}
                    {data.muhurats.length > 0 && (
                        <div className="space-y-4">
                            <h2 className={cn(TYPOGRAPHY.sectionTitle, "mt-4")}>
                                Muhurat Windows on This Date
                            </h2>
                            {data.muhurats.map((result) => (
                                <MuhuratResultCard key={`${result.date}-${result.window_start}`} result={result} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
