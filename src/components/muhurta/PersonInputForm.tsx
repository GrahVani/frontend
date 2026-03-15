"use client";

import React from "react";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
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

export default function PersonInputForm({
  label,
  value,
  onChange,
  className,
}: PersonInputFormProps) {
  const update = (field: keyof PersonInput, raw: string) => {
    const numericFields: (keyof PersonInput)[] = ["latitude", "longitude"];
    const val = numericFields.includes(field) ? (raw === "" ? undefined : Number(raw)) : raw;
    onChange({ ...value, [field]: val });
  };

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

      {/* Row 2: Latitude + Longitude + Timezone (3 columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
    </fieldset>
  );
}
