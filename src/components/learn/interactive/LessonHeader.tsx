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
  Sparkles,
} from "lucide-react";
import { learningTokens } from "@/design-tokens";

/* ─── Types ─── */
export interface LessonHeaderProps {
  title: string;
  /** Sanskrit/Hindi title in Devanagari script */
  titleDevanagari?: string;
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
export function sanitizeTitle(text: string | undefined): string {
  if (!text) return "";
  return text
    .replace(/ṣ/g, "sh")
    .replace(/Ṣ/g, "Sh")
    .replace(/ś/g, "sh")
    .replace(/Ś/g, "Sh")
    .replace(/ṅ/g, "n")
    .replace(/ā/g, "a")
    .replace(/Ā/g, "A")
    .replace(/ī/g, "i")
    .replace(/Ī/g, "I")
    .replace(/ū/g, "u")
    .replace(/Ū/g, "U")
    .replace(/ṛ/g, "ri")
    .replace(/Ṛ/g, "Ri")
    .replace(/ṇ/g, "n")
    .replace(/ñ/g, "ny")
    .replace(/ṭ/g, "t")
    .replace(/Ṭ/g, "T")
    .replace(/ḍ/g, "d")
    .replace(/Ḍ/g, "D")
    .replace(/ṁ/g, "m")
    .replace(/ḥ/g, "h");
}

/* ─── Component ─── */
export default function LessonHeader({
  title,
  titleDevanagari,
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
  const cleanTitle = useMemo(() => sanitizeTitle(title), [title]);
  const cleanChapterTitle = useMemo(() => sanitizeTitle(chapterTitle), [chapterTitle]);

  return (
    <motion.div
      id="hero"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="py-2 px-1"
    >
      {/* Top Breadcrumb and Status Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5 pb-2.5 border-b border-[#E7D6B8]/30">
        {/* Path Breadcrumbs */}
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-sm font-semibold text-[#4A3020]">
          <span className="flex items-center gap-1 font-bold">
            Module {moduleNumber}
          </span>
          <span className="text-[#E7D6B8]">/</span>
          {chapterNumber > 0 && (
            <>
              <span className="font-semibold text-[#5C3D26]">
                Chapter {chapterNumber}
              </span>
              <span className="text-[#E7D6B8]">/</span>
            </>
          )}
          <span className="flex items-center gap-1 bg-[#FFE0B2]/60 text-[#795548] px-3 py-0.5 rounded-md font-bold tracking-wide text-xs">
            Lesson {lessonNumber}
          </span>
          {chapterTitle && (
            <>
              <span className="text-[#E7D6B8] hidden sm:inline">|</span>
              <span className="text-[#5C3D26] font-semibold hidden sm:inline max-w-[550px] truncate" title={cleanChapterTitle}>
                {cleanChapterTitle}
              </span>
            </>
          )}
        </div>

        {/* Completion Badges */}
        <div className="flex items-center gap-2">
          {isCompleted && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B5E20] bg-[#E8F5E9] px-3 py-1 rounded-full border border-[#C8E6C9]">
              <CheckCircle2 className="w-4 h-4" /> Completed
            </span>
          )}
          {isLocked && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5C3D26] bg-[#FFF3E0] px-3 py-1 rounded-full border border-[#FFE0B2]">
              <Lock className="w-4 h-4" /> Locked
            </span>
          )}
        </div>
      </div>

      {/* Main Title Section */}
      <div className="space-y-1">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#1A0A05] leading-tight tracking-tight">
          {cleanTitle}
        </h1>
        {titleDevanagari && (
          <p className="text-base sm:text-lg lg:text-xl text-[#8B5A2B] font-semibold mt-0.5 tracking-wide font-devanagari">
            {titleDevanagari}
          </p>
        )}
      </div>

      {/* Bottom Metadata & Stats Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-2.5 border-t border-[#E7D6B8]/30">
        <div className="flex flex-wrap items-center gap-3">
          {/* Minutes Badge */}
          <span className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-[#4A3020] bg-[#FFF3E0]/60 px-3 py-1 rounded-md border border-[#FFE0B2]/40">
            <Clock className="w-4 h-4 text-[#E65100]" /> {minutes} min read
          </span>
          {/* Concepts Badge */}
          <span className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-[#4A3020] bg-[#FFF3E0]/60 px-3 py-1 rounded-md border border-[#FFE0B2]/40">
            <Lightbulb className="w-4 h-4 text-[#E65100]" /> {conceptCount} Concepts
          </span>
          {/* Quiz Badge */}
          <span className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-[#4A3020] bg-[#FFF3E0]/60 px-3 py-1 rounded-md border border-[#FFE0B2]/40">
            <BrainCircuit className="w-4 h-4 text-[#E65100]" /> {quizCount} Quiz Qs
          </span>
        </div>

        {/* Previous attempt — compact row */}
        {bestScore > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-1.5 text-xs sm:text-[13px] text-[#5C3D26] font-bold bg-[#FEFAEA] px-3 py-1 rounded-md border border-[#E7D6B8]/50"
          >
            <Sparkles className="w-4 h-4 text-[#C9A24D]" />
            <span>Best Score: <strong className="text-[#2D2419]">{bestScore}%</strong></span>
            <span className="text-[#E7D6B8]">·</span>
            <span className="font-semibold">{attemptsCount} attempt{attemptsCount !== 1 ? "s" : ""}</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
