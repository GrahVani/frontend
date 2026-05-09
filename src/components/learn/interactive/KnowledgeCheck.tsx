"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, HelpCircle, ChevronRight } from "lucide-react";

interface KnowledgeCheckQuestion {
  id: string | number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface KnowledgeCheckProps {
  questions: KnowledgeCheckQuestion[];
  title?: string;
  className?: string;
}

/**
 * Lightweight inline quiz component for "Check Your Understanding" moments.
 * Simpler than the full InteractiveQuiz — no scoring/submission, just learning.
 */
export default function KnowledgeCheck({
  questions,
  title = "Quick Knowledge Check",
  className = "",
}: KnowledgeCheckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());

  const question = questions[currentIndex];
  if (!question) return null;

  const isCorrect = selectedOption === question.correctIndex;

  const handleSelect = (idx: number) => {
    if (revealed) return;
    setSelectedOption(idx);
    setRevealed(true);
    if (idx === question.correctIndex) {
      setAnsweredCorrectly((prev) => new Set(prev).add(currentIndex));
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setRevealed(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className={`rounded-2xl border-2 border-dashed border-amber-300 bg-white shadow-sm p-5 sm:p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-amber-600" />
          <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wide">
            {title}
          </h3>
        </div>
        {questions.length > 1 && (
          <span className="text-xs font-medium text-amber-600">
            {currentIndex + 1} / {questions.length}
          </span>
        )}
      </div>

      {/* Progress dots */}
      {questions.length > 1 && (
        <div className="flex items-center gap-1.5 mb-4">
          {questions.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                idx < currentIndex
                  ? answeredCorrectly.has(idx)
                    ? "bg-emerald-400"
                    : "bg-red-300"
                  : idx === currentIndex
                  ? "bg-amber-400"
                  : "bg-amber-100"
              }`}
            />
          ))}
        </div>
      )}

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          <p className="text-base font-semibold text-gray-900 mb-4 leading-relaxed">
            {question.question}
          </p>

          {/* Options */}
          <div className="space-y-2.5">
            {question.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectOption = idx === question.correctIndex;
              const showCorrect = revealed && isCorrectOption;
              const showWrong = revealed && isSelected && !isCorrectOption;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={revealed}
                  className={`w-full text-left p-3.5 rounded-xl border-2 transition-all duration-300 ${
                    showCorrect
                      ? "bg-emerald-50 border-emerald-400 text-emerald-900"
                      : showWrong
                      ? "bg-red-50 border-red-300 text-red-900"
                      : isSelected
                      ? "bg-amber-100 border-amber-400"
                      : "bg-white border-amber-100 hover:border-amber-300 hover:bg-amber-50/50"
                  } ${revealed ? "cursor-default" : "cursor-pointer"}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        showCorrect
                          ? "bg-emerald-500 text-white"
                          : showWrong
                          ? "bg-red-400 text-white"
                          : isSelected
                          ? "bg-amber-500 text-white"
                          : "bg-amber-100 text-amber-600"
                      }`}
                    >
                      {showCorrect ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : showWrong ? (
                        <XCircle className="w-4 h-4" />
                      ) : (
                        String.fromCharCode(65 + idx)
                      )}
                    </span>
                    <span className="text-sm font-medium">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div
                  className={`mt-4 p-4 rounded-xl border border-gray-200/60 border-l-4 ${
                    isCorrect
                      ? "border-l-emerald-400 bg-gray-50"
                      : "border-l-amber-400 bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p
                        className={`text-xs font-bold uppercase tracking-wide mb-1 ${
                          isCorrect ? "text-emerald-700" : "text-amber-700"
                        }`}
                      >
                        {isCorrect ? "Correct!" : "Not quite — here's why:"}
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {question.explanation}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Next button */}
                {currentIndex < questions.length - 1 && (
                  <button
                    onClick={handleNext}
                    className="mt-3 flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-amber-700 bg-white border border-amber-200 hover:bg-amber-50 rounded-xl transition-colors ml-auto shadow-sm"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
