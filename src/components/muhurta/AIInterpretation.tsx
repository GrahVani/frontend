"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Sparkles, ChevronDown, ChevronUp, Globe } from "lucide-react";
import { useInterpretation } from "@/hooks/queries/useMuhurta";
import type { InterpretLanguage } from "@/types/muhurta.types";

interface AIInterpretationProps {
  muhuratData: Record<string, unknown>;
  eventType: string;
  tradition?: string;
  className?: string;
}

const LANGUAGES: { value: InterpretLanguage; label: string }[] = [
  { value: "english", label: "English" },
  { value: "hindi", label: "Hindi" },
  { value: "hinglish", label: "Hinglish" },
  { value: "tamil", label: "Tamil" },
  { value: "telugu", label: "Telugu" },
  { value: "kannada", label: "Kannada" },
  { value: "malayalam", label: "Malayalam" },
];

export default function AIInterpretation({
  muhuratData,
  eventType,
  tradition,
  className,
}: AIInterpretationProps) {
  const [expanded, setExpanded] = useState(false);
  const [language, setLanguage] = useState<InterpretLanguage>("english");
  const [requested, setRequested] = useState(false);

  // Only fire the query after the user clicks
  const queryParams = requested
    ? { muhurat_data: muhuratData, event_type: eventType, tradition, language }
    : null;

  const { data: interpretation, isLoading, isError, error } = useInterpretation(queryParams);

  const handleExpand = () => {
    if (!expanded) {
      setExpanded(true);
      setRequested(true);
    } else {
      setExpanded(false);
    }
  };

  const handleLanguageChange = (lang: InterpretLanguage) => {
    setLanguage(lang);
    // Re-fetch with new language
    setRequested(true);
  };

  return (
    <div
      className={cn(
        "border border-gold-primary/25 rounded-xl overflow-hidden transition-all duration-300",
        expanded && "shadow-[0_2px_12px_rgba(201,162,77,0.12)]",
        className,
      )}
    >
      {/* Toggle Button */}
      <button
        type="button"
        onClick={handleExpand}
        className={cn(
          "w-full flex items-center gap-2.5 px-4 py-3 transition-colors duration-200",
          expanded
            ? "bg-gradient-to-r from-gold-primary/10 to-transparent"
            : "hover:bg-gold-primary/5",
        )}
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold-primary to-gold-dark flex items-center justify-center shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-[13px] font-semibold text-gold-dark tracking-wide flex-1 text-left">
          {expanded ? "AI Interpretation" : "Get AI Interpretation"}
        </span>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gold-dark" />
        ) : (
          <ChevronDown className="w-4 h-4 text-ink/40" />
        )}
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-gold-primary/15 animate-in slide-in-from-top-1 duration-200">
          {/* Language Selector */}
          <div className="px-4 py-3 flex items-center gap-3 bg-parchment/30">
            <Globe className="w-4 h-4 text-gold-dark shrink-0" />
            <label className="text-[11px] font-bold text-ink/50 uppercase tracking-wider shrink-0">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value as InterpretLanguage)}
              className={cn(
                "appearance-none bg-transparent border border-gold-primary/30 rounded-lg",
                "text-ink font-serif text-[13px] py-1.5 px-2.5 pr-7 cursor-pointer",
                "focus:outline-none focus:border-gold-dark transition-colors",
              )}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* Result Area */}
          <div className="px-4 py-4">
            {isLoading && (
              <div className="space-y-3 animate-pulse">
                <div className="h-4 bg-parchment rounded-lg w-full" />
                <div className="h-4 bg-parchment rounded-lg w-5/6" />
                <div className="h-4 bg-parchment rounded-lg w-4/6" />
                <div className="h-4 bg-parchment rounded-lg w-full" />
                <div className="h-4 bg-parchment rounded-lg w-3/5" />
              </div>
            )}

            {isError && (
              <div className="text-center py-4">
                <p className="text-status-error text-[13px] font-medium">Interpretation failed</p>
                <p className="text-ink/50 text-[11px] mt-1">
                  {error?.message || "Unable to generate interpretation"}
                </p>
              </div>
            )}

            {!isLoading && !isError && interpretation && (
              <div
                className={cn(
                  "bg-parchment/40 border border-gold-primary/10 rounded-lg px-4 py-3.5",
                )}
              >
                <p className="text-[13px] text-ink/80 font-serif leading-[1.8] whitespace-pre-line">
                  {interpretation}
                </p>
              </div>
            )}

            {!isLoading && !isError && !interpretation && requested && (
              <p className="text-ink/40 text-[12px] text-center py-3">
                No interpretation available.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
