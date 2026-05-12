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
}

// ─── Icon mapping: each section type gets a UNIQUE, semantic icon ───
const TYPE_ICONS: Record<string, LucideIcon> = {
  overview: LayoutList,     // List/overview view
  definition: BookText,     // Text/definition document
  etymology: Languages,     // Language/translation
  mechanics: Cog,           // Settings/mechanics
  concepts: Lightbulb,      // Ideas/concepts
  quiz: CircleHelp,         // Questions/quiz
  recap: RotateCcw,         // Review/recap
  flashcards: Layers,       // Stack of cards
  practice: Trophy,         // Achievement/practice
  continue: ArrowRight,     // Next/continue
};

// ─── Group labels with order ───
const GROUP_ORDER = ["Start", "Learn", "Practice", "Finish"];
const GROUP_LABELS: Record<string, string> = {
  Start: "Start",
  Learn: "Core Content",
  Practice: "Practice",
  Finish: "Wrap Up",
};

export default function LessonSidebar({
  sections,
  activeSection,
  completedSections,
  onNavigate,
  progress,
  className = "",
}: LessonSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavigate = (id: string) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  // Group sections — normalize group names to Title Case to prevent casing mismatches
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
    const Icon = TYPE_ICONS[section.type || ""] || ChevronRight;

    return (
      <button
        key={section.id}
        onClick={() => handleNavigate(section.id)}
        className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left text-[13px] transition-all duration-150 relative ${
          isActive
            ? "bg-amber-50 text-amber-900 font-semibold shadow-sm border-l-2 border-l-amber-500"
            : isCompleted
            ? "text-gray-800 hover:bg-gray-50"
            : "text-gray-800 hover:bg-gray-50 hover:text-gray-900"
        }`}
        aria-current={isActive ? "true" : undefined}
      >
        {/* Icon with completion badge */}
        <span className="relative shrink-0">
          <span
            className={`w-6 h-6 rounded-md flex items-center justify-center ${
              isActive
                ? "bg-amber-500 text-white"
                : isCompleted
                ? "bg-green-100 text-green-600"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
          </span>
          {/* Completion checkmark badge */}
          {isCompleted && !isActive && (
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center border border-white">
              <CheckCircle2 className="w-2 h-2 text-white" />
            </span>
          )}
        </span>

        {/* Label */}
        <span className="truncate flex-1">{section.label}</span>

        {/* Active indicator dot */}
        {isActive && (
          <motion.div
            layoutId="sidebar-active"
            className="w-1.5 h-1.5 rounded-full bg-amber-500"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
      </button>
    );
  };

  const sidebarContent = (
    <div className="space-y-3" role="navigation" aria-label="Lesson sections">
      {GROUP_ORDER.filter((g) => grouped[g]?.length > 0).map((group) => (
        <div key={group}>
          <p className="text-[10px] font-bold text-gray-700 uppercase tracking-wider px-2.5 mb-1">
            {GROUP_LABELS[group]}
          </p>
          <div className="space-y-0.5">
            {grouped[group].map(renderItem)}
          </div>
        </div>
      ))}
      {/* Ungrouped sections (fallback) */}
      {(grouped[undefined as unknown as string] || []).map(renderItem)}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className={`hidden lg:block ${className}`}>
        <div className="max-h-[calc(100vh-2rem)] overflow-y-auto no-scrollbar space-y-3 pr-1 pb-4">
          {/* Progress card */}
          <div className="bg-white rounded-xl border border-gray-200/70 p-3.5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">
                Progress
              </span>
              <span className="text-xs font-bold text-amber-600">{progress}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Sections nav */}
          <div className="bg-white rounded-xl border border-gray-200/70 p-3 shadow-sm">
            {sidebarContent}
          </div>
        </div>
      </div>

      {/* Mobile floating nav */}
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
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
                onClick={() => setMobileOpen(false)}
              />
              <motion.div
                initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed bottom-0 left-0 right-0 z-[61] bg-white rounded-t-3xl shadow-2xl max-h-[75vh] overflow-y-auto"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                      Lesson Sections
                    </h3>
                    <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Close navigation">
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="text-xs font-bold text-amber-700">{progress}%</span>
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
