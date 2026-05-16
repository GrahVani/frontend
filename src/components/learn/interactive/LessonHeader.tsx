"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Lock,
  Clock,
  Lightbulb,
  BrainCircuit,
  BookOpen,
  GraduationCap,
  Target,
} from "lucide-react";

/* ─── Types ─── */
export interface LessonHeaderProps {
  title: string;
  lessonNumber: number;
  moduleNumber: number;
  chapterNumber: number;
  chapterTitle?: string;
  isCompleted?: boolean;
  isLocked?: boolean;
  allText: string;
  conceptCount: number;
  quizCount: number;
  bestScore?: number;
  attemptsCount?: number;
  progress?: number;
}

/* ─── Helpers ─── */
function getWordCount(text: string) {
  return text.split(/\s+/).filter(Boolean).length;
}
function getReadingMinutes(text: string, wpm = 200) {
  return Math.max(1, Math.ceil(getWordCount(text) / wpm));
}

/* ─── Circular Progress Ring ─── */
function ProgressRing({
  progress,
  size = 48,
  stroke = 4,
}: {
  progress: number;
  size?: number;
  stroke?: number;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress / 100);
  const isComplete = progress >= 100;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="stroke-gray-200"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={isComplete ? "stroke-emerald-500" : "stroke-amber-500"}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {isComplete ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        ) : (
          <>
            <span className="text-[11px] font-extrabold text-gray-700 leading-none">{progress}</span>
            <span className="text-[7px] font-bold text-gray-400 leading-none">%</span>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Component ─── */
export default function LessonHeader({
  title,
  lessonNumber,
  moduleNumber,
  chapterNumber,
  chapterTitle,
  isCompleted = false,
  isLocked = false,
  allText,
  conceptCount,
  quizCount,
  bestScore = 0,
  attemptsCount = 0,
  progress = 0,
}: LessonHeaderProps) {
  const minutes = useMemo(() => getReadingMinutes(allText), [allText]);

  return (
    <motion.div
      id="hero"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="py-2"
    >
      <div className="flex items-center gap-3">
        {/* Left content */}
        <div className="flex-1 min-w-0">
          {/* Breadcrumbs + meta */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
            <div className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 uppercase tracking-wide">
              <GraduationCap className="w-3 h-3" />
              Lesson {lessonNumber}
            </div>
            <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600">
              <BookOpen className="w-3 h-3" />
              Module {String(moduleNumber).padStart(2, "0")}
              {chapterNumber > 0 && (
                <>
                  <span className="text-amber-300">·</span>
                  Ch.{chapterNumber}
                </>
              )}
              {chapterTitle && <span className="text-amber-400">— {chapterTitle}</span>}
            </div>

            <div className="hidden sm:flex items-center gap-2 text-[10px] text-gray-400">
              <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" /> {minutes} min</span>
              <span>·</span>
              <span className="flex items-center gap-0.5"><Lightbulb className="w-3 h-3" /> {conceptCount}</span>
              <span>·</span>
              <span className="flex items-center gap-0.5"><BrainCircuit className="w-3 h-3" /> {quizCount}</span>
            </div>

            <div className="flex-1" />

            {isCompleted && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200/60">
                <CheckCircle2 className="w-3 h-3" /> Completed
              </span>
            )}
            {isLocked && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full border border-gray-200/60">
                <Lock className="w-3 h-3" /> Locked
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-amber-950 leading-snug tracking-tight">
            {title}
          </h1>
        </div>


      </div>

      {/* Previous attempt — compact row */}
      {bestScore > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-1.5 flex items-center gap-2 text-[10px] text-gray-500"
        >
          <span className="font-medium">Best: {bestScore}%</span>
          <span className="text-gray-300">·</span>
          <span>{attemptsCount} attempt{attemptsCount !== 1 ? "s" : ""}</span>
        </motion.div>
      )}
    </motion.div>
  );
}
