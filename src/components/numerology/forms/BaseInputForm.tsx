"use client";

import React from "react";
import ParchmentInput from "@/components/ui/ParchmentInput";
import ClientAutoFill from "./ClientAutoFill";

interface BaseInputFormProps {
    onSubmit: (data: { full_name: string; birth_date: string }) => void;
    isPending: boolean;
    /** Label prefix for accessibility — e.g. "Career Path" */
    label?: string;
}

export default function BaseInputForm({ onSubmit, isPending, label }: BaseInputFormProps) {
    const [fullName, setFullName] = React.useState("");
    const [birthDate, setBirthDate] = React.useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullName.trim() || !birthDate) return;
        onSubmit({ full_name: fullName.trim(), birth_date: birthDate });
    };

    const handleAutoFill = (data: { full_name: string; birth_date: string }) => {
        setFullName(data.full_name);
        setBirthDate(data.birth_date);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between">
                <ClientAutoFill onFill={handleAutoFill} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ParchmentInput
                    label="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter full name"
                    required
                    aria-label={label ? `${label} — Full Name` : undefined}
                />
                <ParchmentInput
                    label="Birth Date"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    required
                    aria-label={label ? `${label} — Birth Date` : undefined}
                />
            </div>
            <button
                type="submit"
                disabled={isPending || !fullName.trim() || !birthDate}
                className="px-5 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[14px] font-medium"
            >
                {isPending ? "Calculating..." : "Analyze"}
            </button>
        </form>
    );
}
