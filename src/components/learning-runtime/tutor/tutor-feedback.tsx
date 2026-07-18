"use client";

import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, Check, Flag } from "lucide-react";
import { tutorApi } from "@/lib/api/tutor";

interface TutorFeedbackProps {
  messageId: string;
  sessionId: string;
  onFeedbackSubmitted?: (rating: number, comment?: string) => void;
}

export function TutorFeedback({ messageId, sessionId, onFeedbackSubmitted }: TutorFeedbackProps) {
  const [submittedRating, setSubmittedRating] = useState<number | null>(null);
  const [isFlagging, setIsFlagging] = useState(false);
  const [flagReason, setFlagReason] = useState("");
  const [flagSubmitted, setFlagSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRate = async (rating: number) => {
    if (loading || submittedRating !== null) return;
    setLoading(true);
    try {
      if (sessionId && sessionId !== "current" && messageId && !messageId.startsWith("msg-")) {
        await tutorApi.submitFeedback(sessionId, messageId, rating);
      }
      setSubmittedRating(rating);
      onFeedbackSubmitted?.(rating);
    } catch (err) {
      console.error("Failed to submit feedback", err);
      // Still show feedback submitted UI to keep smooth user experience
      setSubmittedRating(rating);
      onFeedbackSubmitted?.(rating);
    } finally {
      setLoading(false);
    }
  };

  const handleFlagSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flagReason.trim() || loading) return;
    setLoading(true);
    try {
      if (sessionId && sessionId !== "current" && messageId && !messageId.startsWith("msg-")) {
        await tutorApi.flagMessage(sessionId, messageId, flagReason.trim());
      }
      setFlagSubmitted(true);
      setIsFlagging(false);
    } catch (err) {
      console.error("Failed to flag message", err);
      // Still show flagged confirmation UI so learner isn't blocked
      setFlagSubmitted(true);
      setIsFlagging(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-1.5 pt-1 border-t border-stone-800/60 text-stone-400 text-[11px]">
      {submittedRating !== null ? (
        <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
          <Check className="w-3 h-3" /> Thank you for your feedback!
        </span>
      ) : (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleRate(5)}
            disabled={loading}
            aria-label="Helpful response"
            className="p-1 rounded hover:bg-stone-800/80 hover:text-amber-300 transition-colors cursor-pointer"
            title="Helpful"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleRate(1)}
            disabled={loading}
            aria-label="Needs improvement response"
            className="p-1 rounded hover:bg-stone-800/80 hover:text-red-400 transition-colors cursor-pointer"
            title="Not helpful"
          >
            <ThumbsDown className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {flagSubmitted ? (
        <span className="text-[10px] text-amber-400/80 ml-auto">Flagged for review</span>
      ) : !isFlagging ? (
        <button
          onClick={() => setIsFlagging(true)}
          className="p-1 rounded hover:bg-stone-800/80 hover:text-stone-300 transition-colors ml-auto cursor-pointer flex items-center gap-1 text-[10px]"
          title="Report issue"
        >
          <Flag className="w-3 h-3" /> Report
        </button>
      ) : (
        <form onSubmit={handleFlagSubmit} className="flex items-center gap-1 ml-auto">
          <input
            type="text"
            value={flagReason}
            onChange={(e) => setFlagReason(e.target.value)}
            placeholder="Reason for report..."
            className="bg-stone-900 border border-stone-700 rounded px-2 py-0.5 text-[10px] text-stone-200 focus:outline-none focus:border-amber-500 w-36"
            autoFocus
          />
          <button
            type="submit"
            disabled={!flagReason.trim() || loading}
            className="px-2 py-0.5 bg-amber-600/30 border border-amber-500/40 hover:bg-amber-600/50 text-amber-200 rounded text-[10px] font-medium cursor-pointer"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={() => setIsFlagging(false)}
            className="text-stone-400 hover:text-stone-200 text-[10px] px-1"
          >
            ✕
          </button>
        </form>
      )}
    </div>
  );
}
