"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, Brain, ArrowRight, RefreshCw, Award } from "lucide-react";

interface RecommendationItem {
  id: string;
  concept: string;
  category: "WEAK_CONCEPT_REVIEW" | "NEXT_STEP" | "STRENGTH_MASTERY";
  title: string;
  reason: string;
  suggestedPrompt: string;
  lessonSlug?: string;
}

interface TutorRecommendationsProps {
  lessonSlug?: string;
  onSelectRecommendation: (promptText: string) => void;
}

export function TutorRecommendations({ lessonSlug, onSelectRecommendation }: TutorRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecommendations = async () => {
    if (typeof window === "undefined" || !window.location || !window.location.origin || window.location.origin === "null") {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const baseUrl = window.location.origin;
      const path = lessonSlug
        ? `/api/v1/tutor/recommendations?lessonSlug=${encodeURIComponent(lessonSlug)}`
        : `/api/v1/tutor/recommendations`;
      const url = path.startsWith("http") ? path : `${baseUrl}${path}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.recommendations)) {
          setRecommendations(data.recommendations);
        }
      }
    } catch (err) {
      console.error("Failed to fetch tutor recommendations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [lessonSlug]);

  if (loading && recommendations.length === 0) {
    return (
      <div className="p-3 rounded-xl bg-[#1C1611]/80 border border-amber-500/20 animate-pulse text-stone-400 text-xs flex items-center gap-2">
        <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
        <span>Analyzing your learning profile for personalized concepts...</span>
      </div>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <div className="space-y-2 mt-1">
      <div className="flex items-center justify-between text-xs font-semibold text-amber-300">
        <span className="flex items-center gap-1.5">
          <Brain className="w-3.5 h-3.5 text-amber-400" />
          Recommended Review &amp; Mastery Topics
        </span>
        <button
          onClick={fetchRecommendations}
          className="text-[10px] text-stone-400 hover:text-amber-200 transition-colors cursor-pointer flex items-center gap-1"
          title="Refresh recommendations"
        >
          <RefreshCw className="w-2.5 h-2.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {recommendations.map((rec) => {
          const isWeak = rec.category === "WEAK_CONCEPT_REVIEW";
          const isMastery = rec.category === "STRENGTH_MASTERY";
          return (
            <div
              key={rec.id}
              onClick={() => onSelectRecommendation(rec.suggestedPrompt)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer group flex flex-col justify-between ${
                isWeak
                  ? "bg-gradient-to-r from-red-950/30 to-[#1E1711] border-red-500/30 hover:border-red-400/60"
                  : isMastery
                  ? "bg-gradient-to-r from-emerald-950/30 to-[#1E1711] border-emerald-500/30 hover:border-emerald-400/60"
                  : "bg-[#1A1510] border-amber-500/25 hover:border-amber-400/60 hover:bg-[#221B14]"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span
                  className={`text-xs font-serif font-medium ${
                    isWeak ? "text-red-300" : isMastery ? "text-emerald-300" : "text-amber-200"
                  }`}
                >
                  {isWeak ? "📌 " : isMastery ? "🏆 " : "✦ "}
                  {rec.title}
                </span>
                <span
                  className={`text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded ${
                    isWeak
                      ? "bg-red-500/20 text-red-300"
                      : isMastery
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-amber-500/20 text-amber-300"
                  }`}
                >
                  {isWeak ? "Review" : isMastery ? "Mastery" : "Next Step"}
                </span>
              </div>
              <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed mb-2">
                {rec.reason}
              </p>
              <div className="flex items-center justify-between text-[11px] text-amber-300/90 font-medium group-hover:text-amber-200">
                <span className="truncate pr-2">💬 &ldquo;{rec.suggestedPrompt}&rdquo;</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
