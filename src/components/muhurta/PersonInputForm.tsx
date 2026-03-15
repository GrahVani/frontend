"use client";

import React, { useState, useCallback } from "react";
import { User, MapPin, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocationAutocomplete } from "@/hooks/useLocationAutocomplete";
import type { LocationSuggestion } from "@/types/client";
import type { PersonInput } from "@/types/muhurta.types";

interface PersonInputFormProps {
  label: string;
  value: Partial<PersonInput>;
  onChange: (p: Partial<PersonInput>) => void;
  className?: string;
}

const inputClasses =
  "w-full bg-softwhite border border-antique rounded-lg px-3 py-2 text-sm text-ink focus:border-gold-primary focus:outline-none transition-colors duration-200";

const labelClasses =
  "block text-[11px] font-bold font-serif text-ink/55 uppercase tracking-widest mb-1";

/** Build a rich display string from LocationSuggestion fields for disambiguation */
export function formatLocationDisplay(s: LocationSuggestion): { primary: string; secondary: string } {
  // Show the FULL formatted string — it includes district, pincode, state when available
  // This is far better than extracting pieces, because OpenCage already builds a good address
  const primary = s.formatted;

  // Second line: coordinates for final disambiguation (two places can have same name + state)
  const coords = `${s.latitude.toFixed(4)}°N, ${s.longitude.toFixed(4)}°E`;

  // If state/country not already in formatted, append them
  const extras: string[] = [];
  if (s.state && !s.formatted.includes(s.state)) extras.push(s.state);
  if (s.country && !s.formatted.includes(s.country)) extras.push(s.country);
  const extraStr = extras.length > 0 ? ` — ${extras.join(", ")}` : "";

  const secondary = `${coords}${extraStr}${s.timezone ? ` · ${s.timezone}` : ""}`;

  return { primary, secondary };
}

export default function PersonInputForm({
  label,
  value,
  onChange,
  className,
}: PersonInputFormProps) {
  const [showManual, setShowManual] = useState(false);
  const location = useLocationAutocomplete();

  const update = (field: keyof PersonInput, raw: string) => {
    const numericFields: (keyof PersonInput)[] = ["latitude", "longitude"];
    const val = numericFields.includes(field) ? (raw === "" ? undefined : Number(raw)) : raw;
    onChange({ ...value, [field]: val });
  };

  const onLocationSelect = useCallback((suggestion: LocationSuggestion) => {
    location.handleSelect(suggestion);
    onChange({
      ...value,
      latitude: suggestion.latitude,
      longitude: suggestion.longitude,
      timezone: suggestion.timezone || "Asia/Kolkata",
    });
  }, [location, onChange, value]);

  const onLocationKeyDown = useCallback((e: React.KeyboardEvent) => {
    const selected = location.handleKeyDown(e);
    if (selected) {
      onLocationSelect(selected);
    }
  }, [location, onLocationSelect]);

  const hasCoordinates = value.latitude !== undefined && value.longitude !== undefined;
  const locationSummary = hasCoordinates
    ? `${Number(value.latitude).toFixed(4)}°, ${Number(value.longitude).toFixed(4)}° · ${value.timezone || "Asia/Kolkata"}`
    : null;

  return (
    <fieldset className={cn("border-0 p-0 m-0", className)}>
      {/* Section heading */}
      <legend className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-full bg-gold-primary/15 flex items-center justify-center">
          <User className="w-3.5 h-3.5 text-gold-dark" />
        </div>
        <span className="text-[13px] font-bold font-serif text-gold-dark uppercase tracking-widest">
          {label}
        </span>
      </legend>

      {/* Row 1: Date + Time (2 columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div>
          <label className={labelClasses}>
            Birth Date <span className="text-red-400">*</span>
          </label>
          <input
            type="date"
            value={value.birth_date ?? ""}
            onChange={(e) => update("birth_date", e.target.value)}
            required
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses}>
            Birth Time <span className="text-red-400">*</span>
          </label>
          <input
            type="time"
            value={value.birth_time ?? ""}
            onChange={(e) => update("birth_time", e.target.value)}
            required
            className={inputClasses}
          />
        </div>
      </div>

      {/* Row 2: Location search (autocomplete) */}
      <div className="mb-3 relative">
        <label className={labelClasses}>
          <MapPin className="w-3 h-3 inline-block mr-1 -mt-0.5" />
          Birth Place
        </label>
        <div className="relative">
          <input
            type="text"
            value={location.query}
            onChange={(e) => location.handleInputChange(e.target.value)}
            onKeyDown={onLocationKeyDown}
            onBlur={location.handleBlur}
            onFocus={location.handleFocus}
            placeholder="Type city name (e.g., Delhi, Mumbai, Chennai)..."
            className={cn(inputClasses, "pr-8")}
            role="combobox"
            aria-expanded={location.isOpen}
            aria-autocomplete="list"
          />
          {location.isLoading && (
            <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-primary animate-spin" />
          )}
        </div>

        {/* Autocomplete dropdown */}
        {location.isOpen && location.suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-softwhite border border-antique rounded-lg shadow-lg overflow-hidden">
            {location.suggestions.map((suggestion, idx) => (
              <button
                key={`${suggestion.formatted}-${idx}`}
                type="button"
                className={cn(
                  "w-full text-left px-3 py-2 text-sm transition-colors",
                  idx === location.activeIndex
                    ? "bg-gold-primary/10 text-gold-dark"
                    : "text-ink hover:bg-parchment/50"
                )}
                onMouseDown={() => onLocationSelect(suggestion)}
              >
                {(() => {
                  const display = formatLocationDisplay(suggestion);
                  return (
                    <div>
                      <span className="font-semibold text-ink">{display.primary}</span>
                      <span className="block text-[11px] text-ink/50 mt-0.5">{display.secondary}</span>
                    </div>
                  );
                })()}
              </button>
            ))}
          </div>
        )}

        {/* Coordinates summary after selection */}
        {locationSummary && (
          <p className="text-[11px] text-gold-dark/70 mt-1 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {locationSummary}
          </p>
        )}
      </div>

      {/* Manual coordinates toggle */}
      <button
        type="button"
        onClick={() => setShowManual(!showManual)}
        className="flex items-center gap-1.5 text-[11px] font-medium text-ink/40 hover:text-gold-dark transition-colors mb-2"
      >
        {showManual ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        {showManual ? "Hide" : "Enter"} coordinates manually
      </button>

      {/* Row 3: Manual Lat + Lng + Timezone (collapsible) */}
      {showManual && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in slide-in-from-top-1 duration-200">
          <div>
            <label className={labelClasses}>Latitude</label>
            <input
              type="number"
              step="any"
              value={value.latitude ?? 28.6139}
              onChange={(e) => update("latitude", e.target.value)}
              placeholder="28.6139"
              className={inputClasses}
            />
          </div>
          <div>
            <label className={labelClasses}>Longitude</label>
            <input
              type="number"
              step="any"
              value={value.longitude ?? 77.209}
              onChange={(e) => update("longitude", e.target.value)}
              placeholder="77.2090"
              className={inputClasses}
            />
          </div>
          <div>
            <label className={labelClasses}>Timezone</label>
            <input
              type="text"
              value={value.timezone ?? "Asia/Kolkata"}
              onChange={(e) => update("timezone", e.target.value)}
              placeholder="Asia/Kolkata"
              className={inputClasses}
            />
          </div>
        </div>
      )}
    </fieldset>
  );
}
