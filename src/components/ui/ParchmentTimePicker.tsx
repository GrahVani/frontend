"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { motion, AnimatePresence } from "framer-motion";

interface ParchmentTimePickerProps {
    value?: string; // HH:mm:ss (24h format)
    onChange: (time: string | undefined) => void;
    label?: string;
    placeholder?: string;
    className?: string;
    required?: boolean;
}

const ITEM_HEIGHT = 36;
const VISIBLE_ITEMS = 5;

// Wheel column component for hours, minutes, or seconds
function WheelColumn({
    values,
    selectedValue,
    onSelect,
    label,
}: {
    values: number[];
    selectedValue: number;
    onSelect: (val: number) => void;
    label: string;
}) {
    const scrollRef = React.useRef<HTMLDivElement>(null);

    // Initial positioning and external updates
    React.useEffect(() => {
        if (scrollRef.current) {
            const targetScroll = selectedValue * ITEM_HEIGHT;
            // Immediate scroll on mount, smooth on updates
            scrollRef.current.scrollTo({
                top: targetScroll,
                behavior: scrollRef.current.scrollTop === 0 ? "auto" : "smooth",
            });
        }
    }, [selectedValue]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        // Logic to update state when scrolling stops naturally (native snap)
        // We use a debounce to detect the final resting position
        const timer = (target as unknown as { _scrollTimer: ReturnType<typeof setTimeout> })._scrollTimer;
        if (timer) clearTimeout(timer);

        (target as unknown as { _scrollTimer: ReturnType<typeof setTimeout> })._scrollTimer = setTimeout(() => {
            const scrollTop = target.scrollTop;
            const index = Math.round(scrollTop / ITEM_HEIGHT);
            const clampedIndex = Math.max(0, Math.min(values.length - 1, index));

            if (clampedIndex !== selectedValue) {
                onSelect(clampedIndex);
            }
        }, 150);
    };

    return (
        <div className="flex flex-col items-center select-none">
            <span className="text-[10px] text-ink/45 font-black uppercase mb-3 tracking-[0.2em] opacity-80 font-serif">
                {label}
            </span>
            <div className="relative h-[216px] w-14 group">
                {/* Selection highlight bar - Enhanced with glow */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-10 bg-gradient-to-r from-gold-primary/10 via-gold-primary/25 to-gold-primary/10 border-y border-gold-primary/30 pointer-events-none z-10 rounded-sm shadow-[0_0_15px_rgba(208,140,96,0.1)]" />

                {/* Depth/Curvature Goggles */}
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-parchment-light via-parchment-light/90 to-transparent pointer-events-none z-20" />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-parchment-light via-parchment-light/90 to-transparent pointer-events-none z-20" />

                {/* Outer shadow for "rolling inward" effect */}
                <div className="absolute inset-0 border-x border-gold-primary/5 pointer-events-none z-30" />

                {/* Scrollable wheel */}
                <div
                    ref={scrollRef}
                    className="h-full overflow-y-auto no-scrollbar scroll-smooth snap-y snap-mandatory overscroll-contain"
                    onScroll={handleScroll}
                >
                    {/* Padding for centering first/last items */}
                    <div className="h-[90px]" />

                    {values.map((val, idx) => {
                        const isSelected = idx === selectedValue;
                        return (
                            <button
                                key={val}
                                type="button"
                                onClick={() => onSelect(idx)}
                                aria-label={`${label} ${val.toString().padStart(2, "0")}`}
                                aria-selected={isSelected}
                                className={cn(
                                    "w-full flex items-center justify-center font-serif transition-colors duration-200 h-[36px] snap-center",
                                    isSelected
                                        ? "text-ink font-black text-[18px] scale-105"
                                        : "text-gold-dark/40 text-[14px] hover:text-gold-dark/70"
                                )}
                            >
                                {val.toString().padStart(2, "0")}
                            </button>
                        );
                    })}

                    <div className="h-[90px]" />
                </div>
            </div>
        </div>
    );
}

export default function ParchmentTimePicker({
    value,
    onChange,
    label,
    placeholder = "Select Time",
    className,
    required,
}: ParchmentTimePickerProps) {
    const [open, setOpen] = React.useState(false);

    // Parse HH:mm:ss (24h) - be tolerant of ISO artifacts
    const parsedTime = React.useMemo(() => {
        if (!value) return { h: 12, m: 0, s: 0 };
        const cleanValue = value.split(".")[0].split("+")[0].split("Z")[0];
        const parts = cleanValue.split(":").map(Number);
        return {
            h: parts[0] || 0,
            m: parts[1] || 0,
            s: parts[2] || 0,
        };
    }, [value]);

    const handleTimeChange = (type: "hour" | "minute" | "second", newVal: number) => {
        let { h, m, s } = parsedTime;

        if (type === "hour") h = newVal;
        else if (type === "minute") m = newVal;
        else if (type === "second") s = newVal;

        const formatted = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
        onChange(formatted);
    };

    const getDisplayTime = () => {
        if (!value) return null;
        const { h, m, s } = parsedTime;
        return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    const setNow = () => {
        const now = new Date();
        const formatted = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
        onChange(formatted);
    };

    // Generate options
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const minutes = Array.from({ length: 60 }, (_, i) => i);
    const seconds = Array.from({ length: 60 }, (_, i) => i);

    return (
        <div className={cn("flex flex-col gap-1", className)}>
            {label && (
                <label className="block text-[11px] font-bold font-serif text-ink/45 uppercase tracking-widest pl-1">
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
                            "w-full bg-transparent border border-gold-primary/30 rounded-xl px-3 py-2 font-serif text-ink-deep focus:outline-none focus:border-gold-dark transition-colors flex items-center justify-between group hover:border-gold-dark text-left",
                            !value && "text-gold-burnished"
                        )}
                    >
                        <span>{getDisplayTime() || placeholder}</span>
                        <Clock className="w-4 h-4 text-gold-dark group-hover:text-gold-burnished transition-colors" />
                    </button>
                </PopoverTrigger>
                <AnimatePresence>
                    {open && (
                        <PopoverContent 
                            className="p-0 border-gold-primary/20 shadow-2xl relative overflow-hidden" 
                            align="start" 
                            side="top"
                            sideOffset={8}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className="p-4 bg-surface-modal"
                            >
                                {/* Wheel picker columns */}
                                <div className="flex gap-2 sm:gap-4 justify-center items-start">
                                    <WheelColumn
                                        values={hours}
                                        selectedValue={parsedTime.h}
                                        onSelect={(val) => handleTimeChange("hour", val)}
                                        label="Hour"
                                    />
                                    <div className="flex items-center justify-center text-gold-dark font-bold text-[20px] pt-8">
                                        :
                                    </div>
                                    <WheelColumn
                                        values={minutes}
                                        selectedValue={parsedTime.m}
                                        onSelect={(val) => handleTimeChange("minute", val)}
                                        label="Min"
                                    />
                                    <div className="flex items-center justify-center text-gold-dark font-bold text-[20px] pt-8">
                                        :
                                    </div>
                                    <WheelColumn
                                        values={seconds}
                                        selectedValue={parsedTime.s}
                                        onSelect={(val) => handleTimeChange("second", val)}
                                        label="Sec"
                                    />
                                </div>

                                {/* Quick actions */}
                                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gold-primary/10">
                                    <button
                                        type="button"
                                        onClick={setNow}
                                        className="text-[12px] font-bold uppercase tracking-wider text-gold-dark hover:text-mahogany transition-colors px-3 py-1.5 rounded hover:bg-gold-primary/10"
                                    >
                                        Now
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setOpen(false)}
                                        className="text-[12px] font-bold uppercase tracking-wider bg-gold-primary text-white px-5 py-1.5 rounded-lg hover:bg-gold-dark transition-all shadow-sm hover:shadow-md"
                                    >
                                        Done
                                    </button>
                                </div>
                            </motion.div>
                        </PopoverContent>
                    )}
                </AnimatePresence>
            </Popover>
        </div>
    );
}
