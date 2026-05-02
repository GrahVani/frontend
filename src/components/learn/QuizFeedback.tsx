"use client";

import React from "react";
import { CheckCircle2, XCircle, Lightbulb, BookOpen, ArrowRight, RotateCcw } from "lucide-react";

interface QuizFeedbackProps {
  isCorrect: boolean;
  selectedOption: string;
  correctAnswer: string;
  explanation: string;
  whyWrong?: Record<string, string>;
  memoryAid?: string;
  conceptRef?: number;
  conceptTitle?: string;
  onContinue: () => void;
  onRetry?: () => void;
  continueLabel?: string;
}

export default function QuizFeedback({
  isCorrect,
  selectedOption,
  correctAnswer,
  explanation,
  whyWrong,
  memoryAid,
  conceptRef,
  conceptTitle,
  onContinue,
  onRetry,
  continueLabel,
}: QuizFeedbackProps) {
  return (
    <div className={`rounded-2xl border-2 p-6 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ${
      isCorrect
        ? "bg-green-50/80 border-green-200"
        : "bg-red-50/80 border-red-200"
    }`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          isCorrect ? "bg-green-500" : "bg-red-500"
        }`}>
          {isCorrect ? (
            <CheckCircle2 className="w-6 h-6 text-white" />
          ) : (
            <XCircle className="w-6 h-6 text-white" />
          )}
        </div>
        <div>
          <h3 className={`text-lg font-bold ${isCorrect ? "text-green-800" : "text-red-800"}`}>
            {isCorrect ? "Exactly right! 🌟" : "Not quite — let's learn why!"}
          </h3>
          <p className={`text-sm ${isCorrect ? "text-green-600" : "text-red-600"}`}>
            {isCorrect
              ? "You nailed it. Here's the deeper reasoning:"
              : `The correct answer was ${correctAnswer}. Here's what you need to know:`}
          </p>
        </div>
      </div>

      {/* Main Explanation */}
      <div className={`p-4 rounded-xl mb-4 ${
        isCorrect ? "bg-green-100/60" : "bg-red-100/60"
      }`}>
        <div className="flex items-start gap-2">
          <BookOpen className={`w-5 h-5 shrink-0 mt-0.5 ${isCorrect ? "text-green-600" : "text-red-600"}`} />
          <div>
            <span className={`text-xs font-bold uppercase tracking-wide ${isCorrect ? "text-green-600" : "text-red-600"}`}>
              {isCorrect ? "Why this is correct" : "The correct answer"}
            </span>
            <p className="text-sm text-amber-900 leading-relaxed mt-1">{explanation}</p>
          </div>
        </div>
      </div>

      {/* Why the wrong answer was wrong (only show if user got it wrong) */}
      {!isCorrect && whyWrong && whyWrong[selectedOption] && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 mb-4">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wide">
                Why your answer ({selectedOption}) was incorrect
              </span>
              <p className="text-sm text-amber-900 leading-relaxed mt-1">
                {whyWrong[selectedOption]}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Memory Aid */}
      {memoryAid && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 mb-4">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-5 h-5 shrink-0 mt-0.5 text-purple-500" />
            <div>
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wide">Remember This</span>
              <p className="text-sm text-purple-900 leading-relaxed mt-1 font-medium">{memoryAid}</p>
            </div>
          </div>
        </div>
      )}

      {/* Concept Reference */}
      {conceptRef && conceptTitle && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-amber-100/50 rounded-lg w-fit">
          <BookOpen className="w-4 h-4 text-amber-600" />
          <span className="text-xs text-amber-700 font-medium">
            Related: Concept {conceptRef} — {conceptTitle}
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        {!isCorrect && onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-800 font-semibold rounded-xl transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
        )}
        <button
          onClick={onContinue}
          className={`flex items-center gap-2 px-5 py-2.5 font-semibold rounded-xl transition-colors ${
            isCorrect
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
        >
          {continueLabel || "Continue"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
