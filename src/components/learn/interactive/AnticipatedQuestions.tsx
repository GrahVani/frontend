"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown, MessageCircle } from "lucide-react";

export interface AnticipatedQuestion {
  question: string;
  answer: string;
  noteType?: "important_note" | "wisdom" | "pro_tip";
}

interface AnticipatedQuestionsProps {
  questions: AnticipatedQuestion[];
  className?: string;
  title?: string;
}

const TYPE_STYLES = {
  important_note: {
    border: "border-gray-200/60",
    leftBorder: "border-l-amber-400",
    bg: "bg-white",
    iconColor: "text-amber-600",
    badge: "Important Note",
    badgeClass: "bg-amber-100 text-amber-700",
  },
  wisdom: {
    border: "border-gray-200/60",
    leftBorder: "border-l-indigo-400",
    bg: "bg-white",
    iconColor: "text-indigo-600",
    badge: "Wisdom",
    badgeClass: "bg-indigo-100 text-indigo-700",
  },
  pro_tip: {
    border: "border-gray-200/60",
    leftBorder: "border-l-emerald-400",
    bg: "bg-white",
    iconColor: "text-emerald-600",
    badge: "Pro Tip",
    badgeClass: "bg-emerald-100 text-emerald-700",
  },
};

export default function AnticipatedQuestions({
  questions,
  className = "",
  title = "Questions You Might Have",
}: AnticipatedQuestionsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!questions || questions.length === 0) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <HelpCircle className="w-4 h-4 text-amber-600" />
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
          {title}
        </span>
      </div>

      {questions.map((q, idx) => {
        const style = TYPE_STYLES[q.noteType || "important_note"];
        const isOpen = openIndex === idx;

        return (
          <div
            key={idx}
            className={`rounded-xl border shadow-sm ${style.border} ${style.leftBorder} ${style.bg} overflow-hidden transition-colors`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="w-full flex items-start gap-3 p-3.5 text-left"
            >
              <MessageCircle className={`w-4 h-4 mt-0.5 shrink-0 ${style.iconColor}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-gray-800">
                    {q.question}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${style.badgeClass}`}
                  >
                    {style.badge}
                  </span>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-3.5 pb-3.5 pl-10">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {q.answer}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
