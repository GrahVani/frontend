"use client";

import React, { useState } from "react";
import PersonInputForm from "../PersonInputForm";
import TraditionSelector from "../TraditionSelector";
import { useTraditionStore } from "@/store/useTraditionStore";
import { Heart, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PersonInput, TraditionCode, CompatibilityParams } from "@/types/muhurta.types";

interface CompatibilityFormProps {
  onSubmit: (params: CompatibilityParams) => void;
  isLoading?: boolean;
}

const EMPTY_PERSON: Partial<PersonInput> = {
  birth_date: "",
  birth_time: "",
  latitude: 28.6139,
  longitude: 77.209,
  timezone: "Asia/Kolkata",
};

function isPersonValid(p: Partial<PersonInput>): p is PersonInput {
  return !!(p.birth_date && p.birth_time);
}

export default function CompatibilityForm({ onSubmit, isLoading }: CompatibilityFormProps) {
  const [person1, setPerson1] = useState<Partial<PersonInput>>({ ...EMPTY_PERSON });
  const [person2, setPerson2] = useState<Partial<PersonInput>>({ ...EMPTY_PERSON });
  const [tradition, setTradition] = useState<TraditionCode | undefined>(undefined);
  const store = useTraditionStore();

  const resolvedTradition = tradition ?? store.tradition;
  const canSubmit = isPersonValid(person1) && isPersonValid(person2) && !isLoading;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    onSubmit({
      tradition: resolvedTradition,
      person1: {
        birth_date: person1.birth_date!,
        birth_time: person1.birth_time!,
        latitude: person1.latitude ?? 28.6139,
        longitude: person1.longitude ?? 77.209,
        timezone: person1.timezone ?? "Asia/Kolkata",
      },
      person2: {
        birth_date: person2.birth_date!,
        birth_time: person2.birth_time!,
        latitude: person2.latitude ?? 28.6139,
        longitude: person2.longitude ?? 77.209,
        timezone: person2.timezone ?? "Asia/Kolkata",
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="prem-card border-t-2 border-t-gold-primary/40">
      {/* Tradition Selector */}
      <div className="p-5 pb-4">
        <TraditionSelector
          value={resolvedTradition}
          onChange={(t) => setTradition(t)}
        />
      </div>

      {/* Two-Person Grid */}
      <div className="px-5 pb-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PersonInputForm
            label="Person 1"
            value={person1}
            onChange={setPerson1}
          />
          <PersonInputForm
            label="Person 2"
            value={person2}
            onChange={setPerson2}
          />
        </div>
      </div>

      {/* Submit */}
      <div className="px-5 pb-5">
        <button
          type="submit"
          disabled={!canSubmit}
          className={cn(
            "w-full flex items-center justify-center gap-2.5",
            "py-3 px-6 rounded-xl font-semibold text-[14px] tracking-wide",
            "transition-all duration-300",
            canSubmit
              ? "bg-gradient-to-r from-gold-primary to-gold-dark text-white shadow-[0_2px_12px_rgba(201,162,77,0.3)] hover:shadow-[0_4px_20px_rgba(201,162,77,0.45)] hover:-translate-y-px"
              : "bg-parchment text-ink/30 cursor-not-allowed",
          )}
        >
          {isLoading ? (
            <>
              <Search className="w-4.5 h-4.5 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <Heart className="w-4.5 h-4.5" />
              Check Compatibility
            </>
          )}
        </button>
      </div>
    </form>
  );
}
