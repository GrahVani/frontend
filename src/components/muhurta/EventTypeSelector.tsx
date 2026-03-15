"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { KnowledgeTooltip } from "@/components/knowledge";
import { useEventTypes } from "@/hooks/queries/useMuhurta";
import type { EventTypeCode, EventTypeInfo } from "@/types/muhurta.types";

// Two-person event codes that require birth details for both parties
const TWO_PERSON_EVENTS: EventTypeCode[] = ["VIVAH", "SAGAI"];

// Hardcoded fallback while the API hasn't responded yet
const FALLBACK_EVENT_TYPES: { code: EventTypeCode; name: string; description: string }[] = [
  { code: "VIVAH", name: "Vivah", description: "Marriage ceremony" },
  { code: "SAGAI", name: "Sagai", description: "Engagement ceremony" },
  { code: "GRIHA_PRAVESH", name: "Griha Pravesh", description: "Housewarming" },
  { code: "BHOOMI_PUJAN", name: "Bhoomi Pujan", description: "Groundbreaking ceremony" },
  { code: "VYAPAAR", name: "Vyapaar", description: "Business launch or venture" },
  { code: "VAHAN", name: "Vahan", description: "Vehicle purchase" },
  { code: "UPANAYANA", name: "Upanayana", description: "Sacred thread ceremony" },
  { code: "NAAMKARAN", name: "Naamkaran", description: "Naming ceremony" },
  { code: "ANNAPRASHAN", name: "Annaprashan", description: "First rice feeding" },
  { code: "VIDYAARAMBH", name: "Vidyaarambh", description: "Commencement of education" },
  { code: "SURGERY", name: "Surgery", description: "Medical surgery" },
  { code: "YATRA", name: "Yatra", description: "Travel or pilgrimage" },
  { code: "PROPERTY", name: "Property", description: "Property purchase or registration" },
];

interface EventTypeSelectorProps {
  value: EventTypeCode | "";
  onChange: (code: EventTypeCode) => void;
  className?: string;
}

export default function EventTypeSelector({
  value,
  onChange,
  className,
}: EventTypeSelectorProps) {
  const { data } = useEventTypes();

  const eventTypes: EventTypeInfo[] | undefined = data?.event_types;

  // Build option list — live data if available, fallback otherwise
  const options = eventTypes
    ? eventTypes.map((et) => ({
        value: et.code,
        label: `${et.name} \u2014 ${et.description}`,
      }))
    : FALLBACK_EVENT_TYPES.map((et) => ({
        value: et.code,
        label: `${et.name} \u2014 ${et.description}`,
      }));

  // Determine if selected event requires two persons
  const isTwoPerson = value
    ? (eventTypes?.find((et) => et.code === value)?.requires_two_persons ??
      TWO_PERSON_EVENTS.includes(value as EventTypeCode))
    : false;

  const selectId = React.useId();

  return (
    <div className={cn("relative group", className)}>
      <label
        htmlFor={selectId}
        className="block text-[12px] font-bold font-serif text-gold-dark uppercase tracking-widest mb-1"
      >
        <KnowledgeTooltip term="muhurta_event_type" unstyled>Event Type</KnowledgeTooltip>
      </label>

      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={(e) => onChange(e.target.value as EventTypeCode)}
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
          <option value="" disabled>
            Select a ceremony...
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <ChevronDown className="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-dark pointer-events-none" />
      </div>

      {isTwoPerson && (
        <p className="text-sm font-sans mt-1.5 leading-snug text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">
          Requires birth details for both persons
        </p>
      )}
    </div>
  );
}
