"use client";

import React from "react";
import ParchmentInput from "@/components/ui/ParchmentInput";
import FormFieldGroup from "./FormFieldGroup";
import ClientAutoFill from "./ClientAutoFill";

interface TwoPersonFormProps {
    onSubmit: (data: {
        person1_name: string;
        person1_birth_date: string;
        person2_name: string;
        person2_birth_date: string;
    }) => void;
    isPending: boolean;
    label?: string;
    person1Label?: string;
    person2Label?: string;
}

export default function TwoPersonForm({
    onSubmit, isPending, label,
    person1Label = "Person 1", person2Label = "Person 2",
}: TwoPersonFormProps) {
    const [p1Name, setP1Name] = React.useState("");
    const [p1Date, setP1Date] = React.useState("");
    const [p2Name, setP2Name] = React.useState("");
    const [p2Date, setP2Date] = React.useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!p1Name.trim() || !p1Date || !p2Name.trim() || !p2Date) return;
        onSubmit({
            person1_name: p1Name.trim(),
            person1_birth_date: p1Date,
            person2_name: p2Name.trim(),
            person2_birth_date: p2Date,
        });
    };

    const handleAutoFill = (data: { full_name: string; birth_date: string }) => {
        setP1Name(data.full_name);
        setP1Date(data.birth_date);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <ClientAutoFill onFill={handleAutoFill} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FormFieldGroup label={person1Label}>
                    <ParchmentInput
                        label="Full Name"
                        value={p1Name}
                        onChange={(e) => setP1Name(e.target.value)}
                        placeholder={`${person1Label} name`}
                        required
                    />
                    <ParchmentInput
                        label="Birth Date"
                        type="date"
                        value={p1Date}
                        onChange={(e) => setP1Date(e.target.value)}
                        required
                    />
                </FormFieldGroup>

                <FormFieldGroup label={person2Label}>
                    <ParchmentInput
                        label="Full Name"
                        value={p2Name}
                        onChange={(e) => setP2Name(e.target.value)}
                        placeholder={`${person2Label} name`}
                        required
                    />
                    <ParchmentInput
                        label="Birth Date"
                        type="date"
                        value={p2Date}
                        onChange={(e) => setP2Date(e.target.value)}
                        required
                    />
                </FormFieldGroup>
            </div>

            <button
                type="submit"
                disabled={isPending || !p1Name.trim() || !p1Date || !p2Name.trim() || !p2Date}
                className="px-5 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[14px] font-medium"
            >
                {isPending ? "Calculating..." : label || "Analyze Compatibility"}
            </button>
        </form>
    );
}
