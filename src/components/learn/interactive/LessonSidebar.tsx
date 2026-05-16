"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutList,
  BookText,
  Languages,
  Cog,
  CircleHelp,
  Lightbulb,
  Layers,
  RotateCcw,
  Trophy,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Menu,
  X,
  Rocket,
  GraduationCap,
  Dumbbell,
  Flag,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export interface SidebarSection {
  id: string;
  label: string;
  type?: string;
  group?: string;
}

interface LessonSidebarProps {
  sections: SidebarSection[];
  activeSection: string;
  completedSections: Set<string>;
  onNavigate: (sectionId: string) => void;
  progress: number;
  className?: string;
  showProgress?: boolean;
}

/* ─── Color tokens per section type ─── */
const TYPE_STYLES: Record<
  string,
  { icon: LucideIcon; color: string; bg: string; border: string; ring: string; activeBg: string }
> = {
  overview:   { icon: LayoutList,  color: "text-sky-600",     bg: "bg-sky-50",     border: "border-sky-200",     ring: "stroke-sky-500",     activeBg: "bg-sky-500" },
  definition: { icon: BookText,    color: "text-indigo-600",  bg: "bg-indigo-50",  border: "border-indigo-200",  ring: "stroke-indigo-500",  activeBg: "bg-indigo-500" },
  etymology:  { icon: Languages,   color: "text-violet-600",  bg: "bg-violet-50",  border: "border-violet-200",  ring: "stroke-violet-500",  activeBg: "bg-violet-500" },
  mechanics:  { icon: Cog,         color: "text-amber-600",   bg: "bg-amber-50",   border: "border-amber-200",   ring: "stroke-amber-500",   activeBg: "bg-amber-500" },
  concepts:   { icon: Lightbulb,   color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", ring: "stroke-emerald-500", activeBg: "bg-emerald-500" },
  quiz:       { icon: CircleHelp,  color: "text-rose-600",    bg: "bg-rose-50",    border: "border-rose-200",    ring: "stroke-rose-500",    activeBg: "bg-rose-500" },
  recap:      { icon: RotateCcw,   color: "text-cyan-600",    bg: "bg-cyan-50",    border: "border-cyan-200",    ring: "stroke-cyan-500",    activeBg: "bg-cyan-500" },
  flashcards: { icon: Layers,      color: "text-purple-600",  bg: "bg-purple-50",  border: "border-purple-200",  ring: "stroke-purple-500",  activeBg: "bg-purple-500" },
  practice:   { icon: Trophy,      color: "text-orange-600",  bg: "bg-orange-50",  border: "border-orange-200",  ring: "stroke-orange-500",  activeBg: "bg-orange-500" },
  continue:   { icon: ArrowRight,  color: "text-teal-600",    bg: "bg-teal-50",    border: "border-teal-200",    ring: "stroke-teal-500",    activeBg: "bg-teal-500" },
};

/* ─── Group metadata ─── */
const GROUP_META: Record<string, { label: string; icon: LucideIcon; accent: string; bg: string }> = {
  Start:    { label: "Orientation",   icon: Rocket,          accent: "text-sky-600",     bg: "bg-sky-50" },
  Learn:    { label: "Core Knowledge", icon: GraduationCap,  accent: "text-amber-700",   bg: "bg-amber-50" },
  Practice: { label: "Practice",       icon: Dumbbell,       accent: "text-emerald-600", bg: "bg-emerald-50" },
  Finish:   { label: "Wrap Up",        icon: Flag,           accent: "text-violet-600",  bg: "bg-violet-50" },
};

const GROUP_ORDER = ["Start", "Learn", "Practice", "Finish"];

/* ─── Motivational message based on progress ─── */
function getMotivation(progress: number): string {
  if (progress === 0)   return "Every expert was once a beginner. Let's begin!";
  if (progress < 25)    return "Great start! The journey of a thousand miles…";
  if (progress < 50)    return "You're building momentum. Keep going!";
  if (progress < 75)    return "More than halfway! You're doing amazing.";
  if (progress < 100)   return "Almost there! Final push to mastery.";
  return "Lesson complete! You've unlocked new wisdom.";
}

/* ─── Circular Progress Ring ─── */
function ProgressRing({
  progress,
  size = 72,
  stroke = 6,
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
          className="stroke-gray-100"
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
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          </motion.div>
        ) : (
          <>
            <span className="text-lg font-extrabold text-gray-800 leading-none">{progress}</span>
            <span className="text-[9px] font-bold text-gray-400 leading-none mt-0.5">%</span>
          </>
        )}
      </div>
    </div>
  );
}

export default function LessonSidebar({
  sections,
  activeSection,
  completedSections,
  onNavigate,
  progress,
  className = "",
  showProgress = true,
}: LessonSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavigate = (id: string) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  // Normalize group names
  const normalizeGroup = (g: string) => {
    const map: Record<string, string> = {
      start: "Start", learn: "Learn", practice: "Practice", finish: "Finish",
      Start: "Start", Learn: "Learn", Practice: "Practice", Finish: "Finish",
    };
    return map[g] || g;
  };

  const grouped = sections.reduce<Record<string, SidebarSection[]>>((acc, s) => {
    const g = normalizeGroup(s.group || "Learn");
    if (!acc[g]) acc[g] = [];
    acc[g].push(s);
    return acc;
  }, {});

  const renderItem = (section: SidebarSection) => {
    const isActive = activeSection === section.id;
    const isCompleted = completedSections.has(section.id);
    const styles = TYPE_STYLES[section.type || ""] || TYPE_STYLES.overview;
    const Icon = styles.icon;

    return (
      <motion.button
        key={section.id}
        onClick={() => handleNavigate(section.id)}
        whileHover={{ x: 2 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-[13px] transition-colors duration-200 relative group ${
          isActive
            ? `${styles.bg} ${styles.color} font-semibold shadow-sm ring-1 ${styles.border}`
            : isCompleted
            ? "text-gray-700 hover:bg-gray-50/80"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`}
        aria-current={isActive ? "true" : undefined}
      >
        {/* Icon container */}
        <span className="relative shrink-0">
          <span
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 ${
              isActive
                ? `${styles.activeBg} text-white shadow-md`
                : isCompleted
                ? `${styles.bg} ${styles.color} ring-1 ${styles.border}`
                : "bg-gray-100 text-gray-400 group-hover:bg-white group-hover:ring-1 group-hover:ring-gray-200"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
          </span>
          {/* Completed checkmark */}
          {isCompleted && !isActive && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm"
            >
              <CheckCircle2 className="w-2.5 h-2.5 text-white" />
            </motion.span>
          )}
        </span>

        {/* Label */}
        <span className="flex-1 font-medium leading-snug">{section.label}</span>

        {/* Active sparkle */}
        {isActive && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Sparkles className={`w-3.5 h-3.5 ${styles.color}`} />
          </motion.div>
        )}
      </motion.button>
    );
  };

  const sidebarContent = (
    <div className="space-y-5" role="navigation" aria-label="Lesson sections">
      {GROUP_ORDER.filter((g) => grouped[g]?.length > 0).map((group) => {
        const meta = GROUP_META[group];
        const GroupIcon = meta.icon;
        const groupCompleted = grouped[group].every((s) => completedSections.has(s.id));
        const groupProgress = Math.round(
          (grouped[group].filter((s) => completedSections.has(s.id)).length /
            grouped[group].length) *
            100
        );

        return (
          <div key={group}>
            {/* Group header */}
            <div className="flex items-center gap-2 px-3 mb-2">
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center ${meta.bg}`}
              >
                <GroupIcon className={`w-3.5 h-3.5 ${meta.accent}`} />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${meta.accent}`}>
                {meta.label}
              </span>
              {groupCompleted && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                </motion.span>
              )}
              {!groupCompleted && groupProgress > 0 && (
                <span className="ml-auto text-[9px] font-semibold text-gray-400">
                  {groupProgress}%
                </span>
              )}
              {/* Decorative line */}
              <div className="flex-1 h-px bg-gray-100 ml-2" />
            </div>

            {/* Items */}
            <div className="space-y-1">
              {grouped[group].map(renderItem)}
            </div>
          </div>
        );
      })}
      {/* Ungrouped fallback */}
      {(grouped[undefined as unknown as string] || []).map(renderItem)}
    </div>
  );

  const progressCard = (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <ProgressRing progress={progress} size={68} stroke={5.5} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Your Progress
            </span>
          </div>
          <p className="text-[11px] text-gray-500 leading-snug italic">
            {getMotivation(progress)}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ─── Desktop sidebar ─── */}
      <div className={`hidden lg:block ${className}`}>
        <div className="max-h-[calc(100vh-2rem)] overflow-y-auto no-scrollbar space-y-3 pr-1 pb-4">
          {/* Progress card */}
          {showProgress && progressCard}

          {/* Sections nav */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-sm">
            {sidebarContent}
          </div>
        </div>
      </div>

      {/* ─── Mobile floating nav ─── */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-amber-600 text-white shadow-lg shadow-amber-600/30 flex items-center justify-center hover:bg-amber-700 transition-colors"
          aria-label="Open lesson navigation"
        >
          <Menu className="w-6 h-6" />
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="25" fill="none" stroke="white" strokeWidth="2.5" strokeOpacity="0.3" />
            <circle
              cx="28" cy="28" r="25" fill="none" stroke="white" strokeWidth="2.5"
              strokeDasharray={`${2 * Math.PI * 25}`}
              strokeDashoffset={`${2 * Math.PI * 25 * (1 - progress / 100)}`}
              strokeLinecap="round" className="transition-all duration-500"
            />
          </svg>
        </button>

        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
                onClick={() => setMobileOpen(false)}
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed bottom-0 left-0 right-0 z-[61] bg-white rounded-t-3xl shadow-2xl max-h-[80vh] overflow-y-auto"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                      Lesson Sections
                    </h3>
                    <button
                      onClick={() => setMobileOpen(false)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                      aria-label="Close navigation"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  {/* Mobile progress */}
                  <div className="mb-5">
                    {progressCard}
                  </div>

                  {sidebarContent}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
