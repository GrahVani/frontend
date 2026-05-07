"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Languages, Cog, Sparkles, CheckCircle2,
  BrainCircuit, ChevronRight, Menu, X,
} from "lucide-react";

export interface SidebarSection {
  id: string;
  label: string;
  type?: string;
  icon?: React.ReactNode;
}

interface LessonSidebarProps {
  sections: SidebarSection[];
  activeSection: string;
  completedSections: Set<string>;
  onNavigate: (sectionId: string) => void;
  progress: number;
  className?: string;
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  overview: <BookOpen className="w-3.5 h-3.5" />,
  definition: <BookOpen className="w-3.5 h-3.5" />,
  etymology: <Languages className="w-3.5 h-3.5" />,
  mechanics: <Cog className="w-3.5 h-3.5" />,
  concepts: <Sparkles className="w-3.5 h-3.5" />,
  quiz: <BrainCircuit className="w-3.5 h-3.5" />,
  recap: <CheckCircle2 className="w-3.5 h-3.5" />,
};

/**
 * Sticky lesson sidebar with section navigation, active tracking,
 * and progress dots. Collapses to floating mobile nav.
 */
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

  const sidebarContent = (
    <nav className="space-y-1" role="navigation" aria-label="Lesson sections">
      {sections.map((section) => {
        const isActive = activeSection === section.id;
        const isCompleted = completedSections.has(section.id);
        const icon = section.icon || TYPE_ICONS[section.type || ""] || <ChevronRight className="w-3.5 h-3.5" />;

        return (
          <button
            key={section.id}
            onClick={() => handleNavigate(section.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-sm transition-all duration-200 ${
              isActive
                ? "bg-amber-100 text-amber-900 font-semibold shadow-sm"
                : isCompleted
                ? "text-green-700 hover:bg-green-50"
                : "text-gray-600 hover:bg-amber-50 hover:text-amber-800"
            }`}
            aria-current={isActive ? "true" : undefined}
          >
            {/* Status indicator */}
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                isActive
                  ? "bg-amber-500 text-white"
                  : isCompleted
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                icon
              )}
            </span>
            <span className="truncate flex-1">{section.label}</span>
            {isActive && (
              <motion.div
                layoutId="sidebar-active"
                className="w-1 h-5 rounded-full bg-amber-500"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className={`hidden lg:block ${className}`}>
        <div className="sticky top-32 space-y-4">
          {/* Progress */}
          <div className="bg-white rounded-2xl border border-amber-200/60 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">
                Progress
              </span>
              <span className="text-xs font-bold text-amber-600">{progress}%</span>
            </div>
            <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Sections nav */}
          <div className="bg-white rounded-2xl border border-amber-200/60 p-3 shadow-sm">
            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider px-3 mb-2">
              Sections
            </p>
            {sidebarContent}
          </div>
        </div>
      </div>

      {/* Mobile floating nav */}
      <div className="lg:hidden">
        {/* Floating trigger */}
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-amber-600 text-white shadow-lg shadow-amber-600/30 flex items-center justify-center hover:bg-amber-700 transition-colors"
          aria-label="Open lesson navigation"
        >
          <Menu className="w-6 h-6" />
          {/* Progress ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 56 56">
            <circle
              cx="28"
              cy="28"
              r="25"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeOpacity="0.3"
            />
            <circle
              cx="28"
              cy="28"
              r="25"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeDasharray={`${2 * Math.PI * 25}`}
              strokeDashoffset={`${2 * Math.PI * 25 * (1 - progress / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
        </button>

        {/* Mobile sheet */}
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
                className="fixed bottom-0 left-0 right-0 z-[61] bg-white rounded-t-3xl shadow-2xl max-h-[75vh] overflow-y-auto"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wide">
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

                  {/* Progress */}
                  <div className="flex items-center gap-3 mb-4 p-3 bg-amber-50 rounded-xl">
                    <div className="flex-1 h-2 bg-amber-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
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
