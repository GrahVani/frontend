"use client";

import { useState } from "react";
import { Search, MapPin, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import ParchmentInput from "@/components/ui/ParchmentInput";
import type { MuhurtaFiltersState, MuhurtaCategory } from "@/types/muhurta.types";

interface MuhurtaFiltersProps {
    category: MuhurtaCategory;
    onSearch: (filters: MuhurtaFiltersState) => void;
    loading?: boolean;
}

function getDefaultStartDate(): string {
    return new Date().toISOString().slice(0, 10);
}

function getDefaultEndDate(): string {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().slice(0, 10);
}

function getDayCount(start: string, end: string): number {
    const s = new Date(start);
    const e = new Date(end);
    return Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

export default function MuhurtaFilters({ category, onSearch, loading }: MuhurtaFiltersProps) {
    const [startDate, setStartDate] = useState(getDefaultStartDate);
    const [endDate, setEndDate] = useState(getDefaultEndDate);
    const [location, setLocation] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!startDate || !endDate) {
            setError("Both start and end dates are required.");
            return;
        }

        if (new Date(endDate) < new Date(startDate)) {
            setError("End date must be after start date.");
            return;
        }

        const days = getDayCount(startDate, endDate);
        if (days > 30) {
            setError("Maximum search range is 30 days. Please narrow your date range.");
            return;
        }

        onSearch({ startDate, endDate, location, category });
    };

    const dayCount = startDate && endDate && new Date(endDate) >= new Date(startDate)
        ? getDayCount(startDate, endDate)
        : 0;

    return (
        <form onSubmit={handleSubmit} className="bg-softwhite border border-antique rounded-xl p-5">
            <fieldset className="border-0 p-0 m-0">
                <legend className="text-xs font-bold text-header-border tracking-widest font-serif uppercase mb-4">
                    Search Parameters
                </legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <ParchmentInput
                    label="Start Date"
                    type="date"
                    value={startDate}
                    onChange={(e) => { setStartDate(e.target.value); setError(null); }}
                    required
                />
                <ParchmentInput
                    label="End Date"
                    type="date"
                    value={endDate}
                    onChange={(e) => { setEndDate(e.target.value); setError(null); }}
                    required
                />
                <ParchmentInput
                    label="Location"
                    type="text"
                    placeholder="City or coordinates"
                    icon={<MapPin className="w-4 h-4" />}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
            </div>

            {error && (
                <div className="flex items-center gap-2 text-xs text-status-error mb-3" role="alert">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <div className="flex items-center justify-between">
                {dayCount > 0 && (
                    <span className="text-xs text-muted-refined">
                        Searching {dayCount} day{dayCount !== 1 ? 's' : ''}
                    </span>
                )}
                <div className="ml-auto">
                    <Button type="submit" icon={Search} loading={loading}>
                        Find Auspicious Dates
                    </Button>
                </div>
            </div>
            </fieldset>
        </form>
    );
}
