"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTraditions } from "@/hooks/queries/useMuhurta";
import { useTraditionStore } from "@/store/useTraditionStore";
import type { TraditionCode, TraditionInfo } from "@/types/muhurta.types";

// Hardcoded fallback while the API hasn't responded yet
const FALLBACK_TRADITIONS: { code: TraditionCode; display: string }[] = [
  { code: "NORTH_INDIAN", display: "North Indian" },
  { code: "SOUTH_INDIAN_TAMIL", display: "South Indian (Tamil)" },
  { code: "SOUTH_INDIAN_KERALA", display: "South Indian (Kerala)" },
  { code: "SOUTH_INDIAN_TELUGU", display: "South Indian (Telugu)" },
  { code: "SOUTH_INDIAN_KANNADA", display: "South Indian (Kannada)" },
  { code: "UNIVERSAL", display: "Universal" },
];

interface TraditionSelectorProps {
  /** Controlled value — omit to bind to global useTraditionStore */
  value?: TraditionCode;
  /** Controlled onChange — omit to bind to global useTraditionStore */
  onChange?: (tradition: TraditionCode) => void;
  className?: string;
  label?: string;
}

export default function TraditionSelector({
  value,
  onChange,
  className,
  label = "Tradition",
}: TraditionSelectorProps) {
  const { data } = useTraditions();
  const store = useTraditionStore();

  // Resolve controlled vs. store-backed
  const selectedValue = value ?? store.tradition;
  const handleChange = onChange ?? store.setTradition;

  const traditions: TraditionInfo[] | undefined = data?.traditions;

  // Build option list — live data if available, fallback otherwise
  const options = traditions
    ? traditions.map((t) => ({ value: t.code, label: t.display }))
    : FALLBACK_TRADITIONS.map((t) => ({ value: t.code, label: t.display }));

  // Info line below the select
  const activeTradition = traditions?.find((t) => t.code === selectedValue);

  const selectId = React.useId();

  return (
    <div className={cn("relative group", className)}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-[12px] font-bold font-serif text-gold-dark uppercase tracking-widest mb-1"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <select
          id={selectId}
          value={selectedValue}
          onChange={(e) => handleChange(e.target.value as TraditionCode)}
          className={cn(
            "w-full appearance-none bg-transparent",
            "border border-gold-primary/30 rounded-xl",
            "text-ink font-serif text-[16px] tracking-wide",
            "focus:outline-none focus:border-gold-dark",
            "focus-visible:ring-2 focus-visible:ring-gold-primary focus-visible:ring-offset-1",
            "transition-colors duration-300",
            "py-2 ps-3 pe-8 cursor-pointer",
          )}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <ChevronDown className="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-dark pointer-events-none" />
      </div>

      {activeTradition && (
        <p className="text-sm text-ink/50 font-sans mt-1.5 leading-snug">
          Based on {activeTradition.display} &bull; {activeTradition.primary_reference}
        </p>
      )}
    </div>
  );
}
