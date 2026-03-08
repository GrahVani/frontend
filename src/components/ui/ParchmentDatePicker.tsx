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
    variant?: 'default' | 'inline';
}

export default function ParchmentDatePicker({
    date,
    setDate,
    label,
    placeholder = "Select Date",
    className,
    required,
    variant = 'default'
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

    const isInline = variant === 'inline';

    return (
        <div className={cn(!isInline && "flex flex-col gap-1", isInline && "flex items-center gap-1.5", className)}>
            {label && (
                <label className={cn(
                    "font-serif uppercase tracking-widest pl-1",
                    isInline ? "text-[10px] sm:text-[11px] pr-1.5 border-r border-gold-primary/20 leading-none text-ink font-bold" : "block text-[11px] font-bold text-ink/45"
                )}>
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
                            "bg-transparent border border-gold-primary/30 rounded-xl px-3 py-1 font-serif text-ink-deep focus:outline-none focus:border-gold-dark focus-visible:ring-2 focus-visible:ring-gold-primary focus-visible:ring-offset-1 transition-colors flex items-center justify-between group hover:border-gold-dark text-left whitespace-nowrap",
                            !isInline && "w-full py-2",
                            isInline && "min-w-[80px] text-[12px] h-7",
                            !date && "text-gold-burnished"
                        )}
                    >
                        <span className="truncate mr-2">
                            {selectedDate ? format(selectedDate, isInline ? "dd/MM/yyyy" : "PPP") : <span className="opacity-80">{placeholder}</span>}
                        </span>
                        <CalendarIcon className={cn("text-gold-dark group-hover:text-gold-burnished transition-colors", isInline ? "w-3 h-3" : "w-4 h-4")} />
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align={isInline ? "end" : "start"}>
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
