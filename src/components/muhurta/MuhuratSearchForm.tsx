"use client";

import React, { useState, useCallback } from "react";
import { Search, MapPin, Calendar, Sparkles, AlertCircle, Loader2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { KnowledgeTooltip } from "@/components/knowledge";
import TraditionSelector from "./TraditionSelector";
import EventTypeSelector from "./EventTypeSelector";
import PersonInputForm from "./PersonInputForm";
import { useTraditionStore } from "@/store/useTraditionStore";
// useEventTypes is consumed by EventTypeSelector internally
import type {
  FindMuhuratParams,
  PersonInput,
  EventTypeCode,
  TraditionCode,
} from "@/types/muhurta.types";

// ─── Constants ───────────────────────────────────────────

const DUAL_PERSON_EVENTS: EventTypeCode[] = ["VIVAH", "SAGAI"];

const DEFAULT_PERSON: Partial<PersonInput> = {
  birth_date: "",
  birth_time: "",
  latitude: 28.6139,
  longitude: 77.209,
  timezone: "Asia/Kolkata",
};

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function getTwoMonthsLater(): string {
  const d = new Date();
  d.setMonth(d.getMonth() + 2);
  return d.toISOString().slice(0, 10);
}

// ─── Validation ──────────────────────────────────────────

interface FormErrors {
  eventType?: string;
  fromDate?: string;
  toDate?: string;
  dateRange?: string;
  persons?: string;
}

function validateForm(state: {
  eventType: EventTypeCode | "";
  fromDate: string;
  toDate: string;
  persons: Partial<PersonInput>[];
}): FormErrors {
  const errors: FormErrors = {};

  if (!state.eventType) {
    errors.eventType = "Please select an event type.";
  }

  if (!state.fromDate) {
    errors.fromDate = "Start date is required.";
  }

  if (!state.toDate) {
    errors.toDate = "End date is required.";
  }

  if (state.fromDate && state.toDate && new Date(state.toDate) <= new Date(state.fromDate)) {
    errors.dateRange = "End date must be after the start date.";
  }

  const hasValidPerson = state.persons.some(
    (p) => p.birth_date && p.birth_time
  );
  if (!hasValidPerson) {
    errors.persons = "At least one person's birth date and time are required.";
  }

  return errors;
}

// ─── Shared styles ───────────────────────────────────────

const inputClasses =
  "w-full bg-softwhite border border-antique rounded-lg px-3 py-2 text-sm text-ink focus:border-gold-primary focus:outline-none transition-colors duration-200";

const labelClasses =
  "block text-[11px] font-bold font-serif text-ink/55 uppercase tracking-widest mb-1";

const sectionHeadingClasses =
  "flex items-center gap-2 text-[12px] font-bold font-serif text-gold-dark uppercase tracking-widest mb-3";

// ─── Component ───────────────────────────────────────────

interface MuhuratSearchFormProps {
  onSearch: (params: FindMuhuratParams) => void;
  isLoading?: boolean;
  initialEventType?: EventTypeCode;
}

export default function MuhuratSearchForm({
  onSearch,
  isLoading = false,
  initialEventType,
}: MuhuratSearchFormProps) {
  // External state
  const storeTradition = useTraditionStore((s) => s.tradition);

  // Form state
  const [eventType, setEventType] = useState<EventTypeCode | "">(initialEventType ?? "");
  const [tradition, setTradition] = useState<TraditionCode>(storeTradition);
  const [fromDate, setFromDate] = useState(getToday);
  const [toDate, setToDate] = useState(getTwoMonthsLater);
  const [latitude, setLatitude] = useState(28.6139);
  const [longitude, setLongitude] = useState(77.209);
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [persons, setPersons] = useState<Partial<PersonInput>[]>([{ ...DEFAULT_PERSON }]);
  const [maxResults, setMaxResults] = useState(10);
  const [includeInterpretation, setIncludeInterpretation] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  // Determine if event needs two persons
  const needsTwoPersons = DUAL_PERSON_EVENTS.includes(eventType as EventTypeCode);

  // When event type changes, adjust persons array
  const handleEventTypeChange = useCallback(
    (code: EventTypeCode | "") => {
      setEventType(code);
      if (submitted) setErrors({});

      if (DUAL_PERSON_EVENTS.includes(code as EventTypeCode)) {
        setPersons((prev) =>
          prev.length >= 2 ? prev : [...prev, { ...DEFAULT_PERSON }]
        );
      } else {
        setPersons((prev) => [prev[0] ?? { ...DEFAULT_PERSON }]);
      }
    },
    [submitted]
  );

  // Update a specific person
  const handlePersonChange = useCallback(
    (index: number, updated: Partial<PersonInput>) => {
      setPersons((prev) => {
        const next = [...prev];
        next[index] = updated;
        return next;
      });
      if (submitted) setErrors({});
    },
    [submitted]
  );

  // Submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const formErrors = validateForm({ eventType, fromDate, toDate, persons });
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});

    // Build valid PersonInput[] — only include persons with required fields
    const validPersons: PersonInput[] = persons
      .filter((p) => p.birth_date && p.birth_time)
      .map((p) => ({
        birth_date: p.birth_date!,
        birth_time: p.birth_time!,
        latitude: p.latitude ?? latitude,
        longitude: p.longitude ?? longitude,
        timezone: p.timezone ?? timezone,
      }));

    const params: FindMuhuratParams = {
      event_type: eventType as EventTypeCode,
      tradition,
      from_date: fromDate,
      to_date: toDate,
      latitude,
      longitude,
      timezone,
      persons: validPersons,
      max_results: maxResults,
      include_interpretation: includeInterpretation,
    };

    onSearch(params);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="prem-card border-t-2 border-t-gold-primary p-6"
    >
      {/* ─── Row 1: Event Type + Tradition ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div>
          <EventTypeSelector
            value={eventType}
            onChange={handleEventTypeChange}
          />
          {errors.eventType && (
            <span role="alert" className="block text-[11px] text-red-600 mt-1">
              {errors.eventType}
            </span>
          )}
        </div>
        <div>
          <TraditionSelector value={tradition} onChange={setTradition} />
        </div>
      </div>

      {/* ─── Row 2: Date Range ─── */}
      <div className="mb-5">
        <div className={sectionHeadingClasses}>
          <Calendar className="w-3.5 h-3.5" />
          <span>Date Range</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>
              From Date <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                if (submitted) setErrors({});
              }}
              required
              className={cn(inputClasses, errors.fromDate && "border-red-400")}
            />
            {errors.fromDate && (
              <span role="alert" className="block text-[11px] text-red-600 mt-1">
                {errors.fromDate}
              </span>
            )}
          </div>
          <div>
            <label className={labelClasses}>
              To Date <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                if (submitted) setErrors({});
              }}
              required
              className={cn(inputClasses, errors.toDate && "border-red-400")}
            />
            {errors.toDate && (
              <span role="alert" className="block text-[11px] text-red-600 mt-1">
                {errors.toDate}
              </span>
            )}
          </div>
        </div>
        {errors.dateRange && (
          <div className="flex items-center gap-1.5 mt-2" role="alert">
            <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span className="text-[11px] text-red-600">{errors.dateRange}</span>
          </div>
        )}
      </div>

      {/* ─── Row 3: Location ─── */}
      <div className="mb-5">
        <div className={sectionHeadingClasses}>
          <MapPin className="w-3.5 h-3.5" />
          <span>Location</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClasses}>Latitude</label>
            <input
              type="number"
              step="any"
              value={latitude}
              onChange={(e) => setLatitude(Number(e.target.value))}
              placeholder="28.6139"
              className={inputClasses}
            />
          </div>
          <div>
            <label className={labelClasses}>Longitude</label>
            <input
              type="number"
              step="any"
              value={longitude}
              onChange={(e) => setLongitude(Number(e.target.value))}
              placeholder="77.2090"
              className={inputClasses}
            />
          </div>
          <div>
            <label className={labelClasses}>Timezone</label>
            <input
              type="text"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              placeholder="Asia/Kolkata"
              className={inputClasses}
            />
          </div>
        </div>
      </div>

      {/* ─── Person(s) Section ─── */}
      <div className="mb-5">
        <div className={sectionHeadingClasses}>
          <Users className="w-3.5 h-3.5" />
          <span>Birth Details</span>
        </div>

        <div className={cn("space-y-4", needsTwoPersons && "space-y-5")}>
          <PersonInputForm
            label={needsTwoPersons ? "Person 1" : "Your Birth Details"}
            value={persons[0] ?? DEFAULT_PERSON}
            onChange={(p) => handlePersonChange(0, p)}
            className="bg-softwhite/50 rounded-xl p-4 border border-antique/50"
          />

          {needsTwoPersons && (
            <PersonInputForm
              label="Person 2"
              value={persons[1] ?? DEFAULT_PERSON}
              onChange={(p) => handlePersonChange(1, p)}
              className="bg-softwhite/50 rounded-xl p-4 border border-antique/50"
            />
          )}
        </div>

        {errors.persons && (
          <div className="flex items-center gap-1.5 mt-2" role="alert">
            <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span className="text-[11px] text-red-600">{errors.persons}</span>
          </div>
        )}
      </div>

      {/* ─── Options Row ─── */}
      <div className="mb-6">
        <div className={sectionHeadingClasses}>
          <Sparkles className="w-3.5 h-3.5" />
          <span>Options</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          {/* Max Results slider */}
          <div>
            <label className={labelClasses}>
              Max Results: <span className="text-gold-dark font-bold">{maxResults}</span>
            </label>
            <input
              type="range"
              min={1}
              max={50}
              value={maxResults}
              onChange={(e) => setMaxResults(Number(e.target.value))}
              className="w-full h-2 bg-antique/40 rounded-full appearance-none cursor-pointer accent-gold-primary"
            />
            <div className="flex justify-between text-[10px] text-ink/35 mt-1">
              <span>1</span>
              <span>25</span>
              <span>50</span>
            </div>
          </div>

          {/* AI Interpretation checkbox */}
          <div className="flex items-center gap-3 pb-1">
            <label className="relative flex items-center gap-2.5 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={includeInterpretation}
                onChange={(e) => setIncludeInterpretation(e.target.checked)}
                className="peer sr-only"
              />
              <div
                className={cn(
                  "w-5 h-5 rounded-md border-2 border-antique flex items-center justify-center transition-all duration-200",
                  "peer-checked:bg-gold-primary peer-checked:border-gold-dark",
                  "peer-focus-visible:ring-2 peer-focus-visible:ring-gold-primary peer-focus-visible:ring-offset-1"
                )}
              >
                {includeInterpretation && (
                  <svg className="w-3 h-3 text-ink" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <div>
                <span className="text-sm font-serif text-ink font-medium">
                  Include <KnowledgeTooltip term="muhurta_ai_interpretation" unstyled>AI Interpretation</KnowledgeTooltip>
                </span>
                <span className="block text-[11px] text-ink/40">
                  Gemini-powered insights for each muhurat
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* ─── Submit Button ─── */}
      <button
        type="submit"
        disabled={isLoading}
        aria-busy={isLoading || undefined}
        className={cn(
          "w-full flex items-center justify-center gap-2.5",
          "bg-gradient-to-b from-gold-soft via-gold-primary to-gold-dark",
          "text-ink font-serif font-bold text-[15px] tracking-wide",
          "border border-gold-dark rounded-xl py-3 px-6",
          "hover:from-[#F0D88A] hover:via-[#D4A85D] hover:to-[#A6843A]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary focus-visible:ring-offset-2",
          "transition-all duration-200 cursor-pointer",
          "disabled:opacity-60 disabled:cursor-not-allowed"
        )}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Search className="w-5 h-5" />
        )}
        {isLoading ? "Searching..." : "Find Auspicious Dates"}
      </button>
    </form>
  );
}
