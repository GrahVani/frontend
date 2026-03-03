"use client";

import { useState } from "react";
import { Search, MapPin, Calendar } from "lucide-react";
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
    d.setMonth(d.getMonth() + 3);
    return d.toISOString().slice(0, 10);
}

export default function MuhurtaFilters({ category, onSearch, loading }: MuhurtaFiltersProps) {
    const [startDate, setStartDate] = useState(getDefaultStartDate);
    const [endDate, setEndDate] = useState(getDefaultEndDate);
    const [location, setLocation] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch({ startDate, endDate, location, category });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-softwhite border border-antique rounded-xl p-5">
            <h3 className="text-xs font-bold text-header-border tracking-widest font-serif uppercase mb-4">
                Search Parameters
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <ParchmentInput
                    label="Start Date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                />
                <ParchmentInput
                    label="End Date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
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
            <div className="flex justify-end">
                <Button type="submit" icon={Search} loading={loading}>
                    Find Auspicious Dates
                </Button>
            </div>
        </form>
    );
}
