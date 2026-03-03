"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { Calendar } from "@/components/ui/Calendar";

interface ParchmentDatePickerProps {
    date?: string; // YYYY-MM-DD
    setDate: (date: string | undefined) => void;
    label?: string;
    placeholder?: string;
    className?: string;
    required?: boolean;
}

export default function ParchmentDatePicker({
    date,
    setDate,
    label,
    placeholder = "Select Date",
    className,
    required
}: ParchmentDatePickerProps) {
    const [open, setOpen] = React.useState(false);

    // Convert string to Date for the Calendar component
    // Append T00:00:00 to prevent UTC interpretation when just YYYY-MM-DD
    const selectedDate = date ? new Date(date + 'T00:00:00') : undefined;

    const handleSelect = (newDate: Date | undefined) => {
        if (newDate) {
            // Format to YYYY-MM-DD manually to avoid TZ shifts
            const yyyy = newDate.getFullYear();
            const mm = String(newDate.getMonth() + 1).padStart(2, '0');
            const dd = String(newDate.getDate()).padStart(2, '0');
            setDate(`${yyyy}-${mm}-${dd}`);
            setOpen(false); // Auto-close on selection
        } else {
            setDate(undefined);
        }
    };

    return (
        <div className={cn("flex flex-col gap-1", className)}>
            {label && (
                <label className="block text-[11px] font-bold font-serif text-muted-refined uppercase tracking-widest pl-1">
                    {label}
                </label>
            )}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        aria-label={label || placeholder}
                        aria-required={required || undefined}
                        aria-haspopup="dialog"
                        aria-expanded={open}
                        className={cn(
                            "w-full bg-transparent border-b border-gold-primary/50 px-2 py-2 font-serif text-ink-deep focus:outline-none focus:border-gold-dark transition-colors flex items-center justify-between group hover:border-gold-dark text-left",
                            !date && "text-gold-burnished"
                        )}
                    >
                        {selectedDate ? format(selectedDate, "PPP") : <span className="opacity-80">{placeholder}</span>}
                        <CalendarIcon className="w-4 h-4 text-gold-dark group-hover:text-gold-burnished transition-colors" />
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleSelect}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
