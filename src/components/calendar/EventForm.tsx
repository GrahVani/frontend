"use client";

import { useState } from "react";
import { Calendar, Clock } from "lucide-react";
import ParchmentInput from "@/components/ui/ParchmentInput";
import Button from "@/components/ui/Button";
import type { PersonalEvent } from "@/types/calendar.types";

interface EventFormProps {
    onSubmit: (event: Omit<PersonalEvent, "id">) => void;
    loading?: boolean;
    onCancel?: () => void;
}

const CATEGORIES: { value: PersonalEvent["category"]; label: string }[] = [
    { value: "consultation", label: "Consultation" },
    { value: "follow_up", label: "Follow-Up" },
    { value: "muhurta", label: "Muhurta" },
    { value: "personal", label: "Personal" },
    { value: "other", label: "Other" },
];

export default function EventForm({ onSubmit, loading, onCancel }: EventFormProps) {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState<PersonalEvent["category"]>("personal");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            title,
            date,
            time: time || undefined,
            description: description || undefined,
            category,
        });
        setTitle("");
        setDate("");
        setTime("");
        setDescription("");
        setCategory("personal");
    };

    return (
        <form onSubmit={handleSubmit} className="bg-softwhite border border-antique rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-header-border tracking-widest font-serif uppercase">
                New Event
            </h3>
            <ParchmentInput
                label="Title"
                type="text"
                placeholder="Event title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <div className="grid grid-cols-2 gap-4">
                <ParchmentInput
                    label="Date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
                <ParchmentInput
                    label="Time (optional)"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                />
            </div>
            <div>
                <label className="block text-xs font-bold font-serif text-gold-dark uppercase tracking-widest mb-1">
                    Category
                </label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as PersonalEvent["category"])}
                    className="w-full py-2 px-2 bg-transparent border-b-2 border-gold-primary/40 text-ink font-serif focus:outline-none focus:border-gold-dark transition-colors rounded-none"
                >
                    {CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                </select>
            </div>
            <ParchmentInput
                label="Description (optional)"
                type="text"
                placeholder="Brief description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex items-center gap-3 justify-end">
                {onCancel && (
                    <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                )}
                <Button type="submit" loading={loading}>Add Event</Button>
            </div>
        </form>
    );
}
