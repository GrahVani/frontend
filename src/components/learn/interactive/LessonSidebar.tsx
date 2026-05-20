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
import { learningTokens } from "@/design-tokens";

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

/* ─── Color tokens per section type with high contrast ─── */
const TYPE_STYLES: Record<
  string,
  { icon: LucideIcon; color: string; bg: string; border: string; ring: string; activeBg: string }
> = {
  overview: { icon: LayoutList, color: "text-[#1565C0]", bg: "bg-[#E3F2FD]", border: "border-[#BBDEFB]", ring: "stroke-[#1565C0]", activeBg: "bg-[#1565C0]" },
  definition: { icon: BookText, color: "text-[#1A237E]", bg: "bg-[#E8EAF6]", border: "border-[#C5CAE9]", ring: "stroke-[#1A237E]", activeBg: "bg-[#1A237E]" },
  etymology: { icon: Languages, color: "text-[#4A148C]", bg: "bg-[#F3E5F5]", border: "border-[#E1BEE7]", ring: "stroke-[#4A148C]", activeBg: "bg-[#4A148C]" },
  mechanics: { icon: Cog, color: "text-[#E65100]", bg: "bg-[#FFF3E0]", border: "border-[#FFE0B2]", ring: "stroke-[#E65100]", activeBg: "bg-[#E65100]" },
  concepts: { icon: Lightbulb, color: "text-[#1B5E20]", bg: "bg-[#E8F5E9]", border: "border-[#C8E6C9]", ring: "stroke-[#1B5E20]", activeBg: "bg-[#1B5E20]" },
  quiz: { icon: CircleHelp, color: "text-[#880E4F]", bg: "bg-[#FCE4EC]", border: "border-[#F8BBD0]", ring: "stroke-[#880E4F]", activeBg: "bg-[#880E4F]" },
  recap: { icon: RotateCcw, color: "text-[#006064]", bg: "bg-[#E0F7FA]", border: "border-[#B2EBF2]", ring: "stroke-[#006064]", activeBg: "bg-[#006064]" },
  flashcards: { icon: Layers, color: "text-[#4A148C]", bg: "bg-[#F3E5F5]", border: "border-[#E1BEE7]", ring: "stroke-[#4A148C]", activeBg: "bg-[#4A148C]" },
  practice: { icon: Trophy, color: "text-[#E65100]", bg: "bg-[#FFF3E0]", border: "border-[#FFE0B2]", ring: "stroke-[#E65100]", activeBg: "bg-[#E65100]" },
  continue: { icon: ArrowRight, color: "text-[#004D40]", bg: "bg-[#E0F2F1]", border: "border-[#B2DFDB]", ring: "stroke-[#004D40]", activeBg: "bg-[#004D40]" },
};

/* ─── Group metadata ─── */
const GROUP_META: Record<string, { label: string; icon: LucideIcon; accent: string; bg: string }> = {
  Start: { label: "Orientation", icon: Rocket, accent: "text-[#1565C0]", bg: "bg-[#E3F2FD]" },
  Learn: { label: "Core Knowledge", icon: GraduationCap, accent: "text-[#795548]", bg: "bg-[#FFF3E0]" },
  Practice: { label: "Practice", icon: Dumbbell, accent: "text-[#2E7D32]", bg: "bg-[#E8F5E9]" },
  Finish: { label: "Wrap Up", icon: Flag, accent: "text-[#5E35B1]", bg: "bg-[#EDE7F6]" },
};

const GROUP_ORDER = ["Start", "Learn", "Practice", "Finish"];

/* ─── Motivational message based on progress ─── */
function getMotivation(progress: number): string {
  if (progress === 0) return "Every expert was once a beginner. Let's begin!";
  if (progress < 25) return "Great start! The journey of a thousand miles…";
  if (progress < 50) return "You're building momentum. Keep going!";
  if (progress < 75) return "More than halfway! You're doing amazing.";
  if (progress < 100) return "Almost there! Final push to mastery.";
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
          className="stroke-[#E7D6B8]/30"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={isComplete ? "stroke-[#2E7D32]" : "stroke-[#C9A24D]"}
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
            <CheckCircle2 className="w-6 h-6 text-[#2E7D32]" />
          </motion.div>
        ) : (
          <>
            <span className="text-lg font-extrabold text-[#2D2419] leading-none">{progress}</span>
            <span className="text-[9px] font-bold text-[#5C3D26] leading-none mt-0.5">%</span>
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
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-[14px] transition-colors duration-200 relative group ${isActive
            ? `${styles.bg} ${styles.color} font-bold shadow-sm ring-1 ${styles.border}`
            : isCompleted
              ? "text-black hover:bg-[#FAEFD8]/40"
              : "text-black hover:bg-[#FAEFD8]/40"
          }`}
        aria-current={isActive ? "true" : undefined}
      >
        {/* Icon container */}
        <span className="relative shrink-0">
          <span
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 ${isActive
                ? `${styles.activeBg} text-white shadow-md`
                : isCompleted
                  ? `${styles.bg} ${styles.color} ring-1 ${styles.border}`
                  : "bg-[#FAEFD8]/60 text-black group-hover:bg-white group-hover:ring-1 group-hover:ring-[#E7D6B8]"
              }`}
          >
            <Icon className="w-3.5 h-3.5" />
          </span>
          {/* Completed checkmark */}
          {isCompleted && !isActive && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#2E7D32] rounded-full flex items-center justify-center border-2 border-white shadow-sm"
            >
              <CheckCircle2 className="w-2.5 h-2.5 text-white" />
            </motion.span>
          )}
        </span>

        {/* Label */}
        <span className="flex-1 font-semibold leading-snug">{section.label}</span>

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
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                </motion.span>
              )}
              {!groupCompleted && groupProgress > 0 && (
                <span className="ml-auto text-[9px] font-bold text-[#5C3D26]">
                  {groupProgress}%
                </span>
              )}
              {/* Decorative line */}
              <div className="flex-1 h-px bg-[#E7D6B8]/40 ml-2" />
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
    <div className="bg-white rounded-2xl border border-[#E7D6B8] p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <ProgressRing progress={progress} size={68} stroke={5.5} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-black uppercase tracking-widest">
              Your Progress
            </span>
          </div>
          <p className="text-[12px] text-black leading-snug font-medium">
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
          <div className="bg-white rounded-2xl border border-[#E7D6B8] p-4 shadow-sm">
            {sidebarContent}
          </div>
        </div>
      </div>

      {/* ─── Mobile floating nav ─── */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#C9A24D] border border-[#9C7A2F] text-[#1A0A05] shadow-lg shadow-[#C9A24D]/30 flex items-center justify-center hover:bg-[#D4AD5A] transition-colors"
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
                    <h3 className="text-sm font-bold text-[#2D2419] uppercase tracking-wide">
                      Lesson Sections
                    </h3>
                    <button
                      onClick={() => setMobileOpen(false)}
                      className="p-1.5 rounded-lg hover:bg-[#FAEFD8]/40 transition-colors"
                      aria-label="Close navigation"
                    >
                      <X className="w-5 h-5 text-[#5C3D26]" />
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
