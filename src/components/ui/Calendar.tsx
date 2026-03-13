"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: CalendarProps) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn("p-3 bg-surface-warm-light font-serif border border-gold-primary/10 rounded-md shadow-inner relative overflow-hidden", className)}
            captionLayout="dropdown"
            classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 relative z-10",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center mb-4", // Added mb-4 for spacing
                caption_label: "hidden", // Hide reference text as we use dropdowns
                caption_dropdowns: "flex justify-center gap-2 items-center px-8", // Container for dropdowns
                dropdown: "bg-white/80 border border-gold-primary/20 text-ink-deep font-serif text-[14px] px-2 py-1 rounded-md cursor-pointer outline-none focus:border-gold-primary hover:bg-gold-primary/5 transition-colors min-w-[80px]",
                dropdown_month: "font-medium capitalize", 
                dropdown_year: "font-medium",
                dropdown_icon: "hidden", // Hide default check icon/chevron inside select if any (usually native select don't have this, but RDPC might add custom UI)
                nav: "space-x-1 flex items-center",
                nav_button: cn(
                    "h-8 w-8 bg-transparent p-0 opacity-60 hover:opacity-100 transition-all duration-200 text-mahogany hover:bg-gold-primary/12 hover:scale-110 active:scale-95 rounded-full border border-transparent hover:border-gold-primary/20 flex items-center justify-center"
                ),
                button_previous: "absolute left-2 top-0", // Adjusted for v9
                button_next: "absolute right-2 top-0", // Adjusted for v9
                table: "w-full border-collapse space-y-1",
                weekdays: "flex w-full mb-2 justify-between",
                weekday: "text-mahogany/70 w-9 font-serif font-medium text-[0.8rem] uppercase tracking-wider text-center",
                week: "flex w-full mt-2 justify-between",
                day: "h-9 w-9 text-center text-[14px] p-0 relative focus-within:relative focus-within:z-20",
                day_button: cn(
                    "h-9 w-9 p-0 font-sans font-medium aria-selected:opacity-100 hover:bg-gold-primary/15 rounded-full transition-all text-ink-deep inline-flex items-center justify-center"
                ),
                day_selected:
                    "bg-gold-primary text-white hover:bg-copper-dark font-bold shadow-md rounded-full",
                day_today: "bg-bg-hover text-gold-dark border border-gold-primary font-bold",
                day_outside: "text-gold-dark/30 opacity-50",
                day_disabled: "text-gold-dark/30 opacity-50",
                day_range_middle:
                    "aria-selected:bg-gold-primary/10 aria-selected:text-ink-deep",
                day_hidden: "invisible",
                // v9 mappings
                selected: "!bg-gold-primary !text-white hover:!bg-copper-dark font-bold shadow-md",
                chevron: "fill-current w-4 h-4",
                ...classNames,
            }}
            components={{
                Chevron: ({ orientation, ...props }) => {
                    switch (orientation) {
                        case "left":
                            return <ChevronLeft className="h-4 w-4" {...props} />;
                        case "right":
                            return <ChevronRight className="h-4 w-4" {...props} />;
                        case "up":
                            // Assuming reuse or different icon if needed, but usually just navigation is left/right for months
                            return <ChevronLeft className="h-4 w-4 rotate-90" {...props} />;
                        case "down":
                            return <ChevronRight className="h-4 w-4 rotate-90" {...props} />;
                        default:
                            return <ChevronRight className="h-4 w-4" {...props} />;
                    }
                },
            }}
            {...props}
        />
    );
}
Calendar.displayName = "Calendar";

export { Calendar };
