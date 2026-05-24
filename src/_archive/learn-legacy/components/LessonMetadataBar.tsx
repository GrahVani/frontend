"use client";

import React from "react";
import { Clock, BookOpen, BarChart3, Layers, GitBranch, Globe } from "lucide-react";

interface LessonMetadataBarProps {
  lessonType?: string;
  bloomLevels?: string[];
  streams?: string[];
  streamNeutrality?: boolean;
  targetMinutesReading?: number;
  targetMinutesTotal?: number;
  mcqCount?: number;
  className?: string;
}

const BLOOM_COLOR: Record<string, string> = {
  Remember: "bg-slate-100 text-slate-600 border-slate-200",
  Understand: "bg-blue-100 text-blue-600 border-blue-200",
  Apply: "bg-emerald-100 text-emerald-600 border-emerald-200",
  Analyze: "bg-amber-100 text-amber-600 border-amber-200",
  Evaluate: "bg-rose-100 text-rose-600 border-rose-200",
  Create: "bg-purple-100 text-purple-600 border-purple-200",
};

const STREAM_COLOR: Record<string, string> = {
  parashari: "bg-amber-100 text-amber-700 border-amber-200",
  jaimini: "bg-indigo-100 text-indigo-700 border-indigo-200",
  kp: "bg-sky-100 text-sky-700 border-sky-200",
  "lal-kitab": "bg-rose-100 text-rose-700 border-rose-200",
};

const LESSON_TYPE_LABEL: Record<string, string> = {
  conceptual: "Conceptual",
  "prose-essay": "Prose Essay",
  "conceptual + calculative": "Conceptual + Calculative",
  calculative: "Calculative",
};

const LESSON_TYPE_ICON: Record<string, React.ReactNode> = {
  conceptual: <BookOpen className="w-3 h-3" />,
  "prose-essay": <BookOpen className="w-3 h-3" />,
  "conceptual + calculative": <Layers className="w-3 h-3" />,
  calculative: <BarChart3 className="w-3 h-3" />,
};

export default function LessonMetadataBar({
  lessonType,
  bloomLevels,
  streams,
  streamNeutrality,
  targetMinutesReading,
  targetMinutesTotal,
  mcqCount,
  className = "",
}: LessonMetadataBarProps) {
  const hasAnyData =
    lessonType ||
    (bloomLevels && bloomLevels.length > 0) ||
    (streams && streams.length > 0) ||
    targetMinutesReading ||
    targetMinutesTotal ||
    mcqCount;

  if (!hasAnyData) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {/* Lesson Type Badge */}
      {lessonType && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 border border-violet-200 text-xs font-semibold">
          {LESSON_TYPE_ICON[lessonType.toLowerCase()] || <BookOpen className="w-3 h-3" />}
          {LESSON_TYPE_LABEL[lessonType.toLowerCase()] || lessonType}
        </span>
      )}

      {/* Bloom Levels */}
      {bloomLevels?.map((bl) => (
        <span
          key={bl}
          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
            BLOOM_COLOR[bl] || "bg-gray-100 text-gray-600 border-gray-200"
          }`}
        >
          {bl}
        </span>
      ))}

      {/* Stream Badges */}
      {streamNeutrality ? (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider">
          <Globe className="w-3 h-3" />
          All Streams
        </span>
      ) : (
        streams?.map((s) => (
          <span
            key={s}
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
              STREAM_COLOR[s.toLowerCase()] || "bg-gray-100 text-gray-600 border-gray-200"
            }`}
          >
            {s}
          </span>
        ))
      )}

      {/* Reading Time */}
      {targetMinutesReading && (
        <span className="inline-flex items-center gap-1 text-xs text-gray-500">
          <Clock className="w-3.5 h-3.5" />
          {targetMinutesReading} min read
        </span>
      )}

      {/* Total Time */}
      {targetMinutesTotal && targetMinutesTotal !== targetMinutesReading && (
        <span className="inline-flex items-center gap-1 text-xs text-gray-500">
          <GitBranch className="w-3.5 h-3.5" />
          {targetMinutesTotal} min total
        </span>
      )}

      {/* MCQ Count */}
      {mcqCount ? (
        <span className="inline-flex items-center gap-1 text-xs text-gray-500">
          <BarChart3 className="w-3.5 h-3.5" />
          {mcqCount} questions
        </span>
      ) : null}
    </div>
  );
}
