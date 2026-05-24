"use client";

import React from "react";
import { Clock } from "lucide-react";

interface ReadingTimeProps {
  /** The text content to calculate reading time from */
  text: string;
  /** Words per minute (default: 200) */
  wpm?: number;
  className?: string;
}

/**
 * Displays estimated reading time based on word count.
 */
export default function ReadingTime({ text, wpm = 200, className = "" }: ReadingTimeProps) {
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / wpm));

  return (
    <div
      className={`inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 ${className}`}
    >
      <Clock className="w-3.5 h-3.5" />
      <span>{minutes} min read</span>
      <span className="text-amber-300">·</span>
      <span className="text-amber-400">{wordCount.toLocaleString()} words</span>
    </div>
  );
}
