"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { learnApi } from "@/lib/api";
import {
  Trophy, Star, RotateCcw, Flame, Zap, CheckCircle2,
  XCircle, BookOpen, Target, ChevronRight, Sparkles,
  Monitor, ArrowRight, Lock, Unlock
} from "lucide-react";

// ============================================================
// UNIFIED TYPES — handles both Format A (main bank) & Format B (supplemental)
// ============================================================

interface QuizOption {
  text: string;
  isCorrect: boolean;
  explanation: string;
}

interface NormalizedQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  bloomLabel: string;
  feature: string;
  usageContext?: string;
  softwareTool?: string;
}

// Raw formats as they appear in the database
interface RawFormatA {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanationCorrect: string;
  explanationsWrong: Record<string, string>;
  difficulty: string;
  tags?: string[];
  grahavaniFeature?: string;
  conceptLadder?: number;
}

interface RawFormatB {
  id: string;
  type?: string;
  question: string;
  options: QuizOption[];
  difficulty: string;
  conceptTag?: string;
  conceptTags?: string[];
  bloomTaxonomyLevel?: string | number;
  grahavaniPlatformIntegration?: {
    relatedFeature?: string;
    usageContext?: string;
    softwareTool?: string;
  };
}

type RawQuestion = RawFormatA | RawFormatB;

// ============================================================
// NORMALIZATION — converts either DB format into unified shape
// ============================================================

const BLOOM_LABELS: Record<number, string> = {
  1: "Remember",
  2: "Understand",
  3: "Apply",
  4: "Analyze",
  5: "Evaluate",
  6: "Create",
};

function normalizeQuestions(raw: RawQuestion[]): NormalizedQuestion[] {
  return raw.map((q, qIdx) => {
    const opts = q.options;

    // --- Detect Format B: options are objects with {text, isCorrect, explanation} ---
    if (opts.length > 0 && typeof opts[0] === "object" && opts[0] !== null && "text" in opts[0]) {
      const b = q as RawFormatB;
      const tags = b.conceptTags
        ? b.conceptTags
        : b.conceptTag
        ? [b.conceptTag]
        : [];
      const bloomLabel =
        typeof b.bloomTaxonomyLevel === "string"
          ? b.bloomTaxonomyLevel
          : BLOOM_LABELS[b.bloomTaxonomyLevel as number] || "Understand";
      return {
        id: b.id || `q-${qIdx}`,
        question: b.question,
        options: b.options as QuizOption[],
        difficulty: (b.difficulty?.toLowerCase() as any) || "medium",
        tags,
        bloomLabel,
        feature: b.grahavaniPlatformIntegration?.relatedFeature || "",
        usageContext: b.grahavaniPlatformIntegration?.usageContext,
        softwareTool: b.grahavaniPlatformIntegration?.softwareTool,
      };
    }

    // --- Format A: options are strings, explanations live elsewhere ---
    const a = q as RawFormatA;
    const correctIdx = a.correctAnswerIndex ?? 0;
    const wrongMap = a.explanationsWrong || {};

    const normalizedOptions: QuizOption[] = (a.options as string[]).map((text, idx) => {
      const isCorrect = idx === correctIdx;
      let explanation = "";
      if (isCorrect) {
        explanation = a.explanationCorrect || "This is the correct answer.";
      } else {
        // explanationsWrong may be keyed by letter ("A","B","C","D") or by index
        const letter = String.fromCharCode(65 + idx);
        explanation = wrongMap[letter] || wrongMap[String(idx)] || wrongMap[text] || "This option is incorrect.";
      }
      return { text, isCorrect, explanation };
    });

    const bloomLabel = BLOOM_LABELS[a.conceptLadder ?? 1] || "Remember";

    return {
      id: a.id || `q-${qIdx}`,
      question: a.question,
      options: normalizedOptions,
      difficulty: (a.difficulty?.toLowerCase() as any) || "medium",
      tags: a.tags || [],
      bloomLabel,
      feature: a.grahavaniFeature || "",
    };
  });
}

// ============================================================
// COMPONENT PROPS
// ============================================================

interface EnhancedQuizProps {
  questions: RawQuestion[];
  lessonId: string;
  moduleId?: string;
  onComplete?: (result: QuizResult) => void;
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  pointsEarned: number;
  streakBonus: number;
  speedBonus: number;
  bestStreak: number;
}

// ============================================================
// UI CONFIG
// ============================================================

const DIFFICULTY_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  easy: { label: "Easy", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: "🌱" },
  medium: { label: "Medium", color: "bg-amber-100 text-amber-700 border-amber-200", icon: "🔥" },
  hard: { label: "Hard", color: "bg-rose-100 text-rose-700 border-rose-200", icon: "⚡" },
};

const BLOOM_COLORS: Record<string, string> = {
  Remember: "bg-gray-100 text-gray-700",
  Understand: "bg-blue-100 text-blue-700",
  Apply: "bg-green-100 text-green-700",
  Analyze: "bg-purple-100 text-purple-700",
  Evaluate: "bg-orange-100 text-orange-700",
  Create: "bg-red-100 text-red-700",
};

// ============================================================
// COMPONENT
// ============================================================

export default function EnhancedQuiz({ questions, lessonId, moduleId, onComplete }: EnhancedQuizProps) {
  const { user } = useAuth();

  const normalized = React.useMemo(() => normalizeQuestions(questions), [questions]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanations, setShowExplanations] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [result, setResult] = useState<QuizResult | null>(null);

  const pointsPopupRef = useRef<HTMLDivElement>(null);

  const currentQuestion = normalized[currentIndex];
  const isLastQuestion = currentIndex === normalized.length - 1;

  useEffect(() => {
    setQuestionStartTime(Date.now());
    setSelectedOption(null);
    setShowExplanations(false);
    setIsCorrect(false);
  }, [currentIndex]);

  // ---- SCORING ----
  const calculatePoints = useCallback((correct: boolean, timeMs: number, currentStreak: number): number => {
    if (!correct) return 0;
    let pts = 10;
    if (currentStreak >= 3) pts += 5;
    if (currentStreak >= 5) pts += 5;
    if (currentStreak >= 10) pts += 10;
    if (timeMs < 30000) pts += 5;
    else if (timeMs < 60000) pts += 2;
    return pts;
  }, []);

  const showPointsPopup = useCallback((text: string, type: "success" | "info") => {
    const popup = pointsPopupRef.current;
    if (!popup) return;
    popup.textContent = text;
    popup.className = `points-popup ${type} show`;
    setTimeout(() => popup.classList.remove("show"), 2500);
  }, []);

  const handleSelectOption = useCallback((index: number) => {
    if (showExplanations || finished) return;

    const timeSpent = Date.now() - questionStartTime;
    const correct = currentQuestion.options[index].isCorrect;

    setSelectedOption(index);
    setIsCorrect(correct);
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: index }));

    if (correct) {
      const newStreak = streak + 1;
      const pts = calculatePoints(true, timeSpent, newStreak);
      setStreak(newStreak);
      setScore(s => s + 1);
      setPoints(p => p + pts);
      if (newStreak > bestStreak) setBestStreak(newStreak);
      showPointsPopup(`+${pts} points!`, "success");
    } else {
      setStreak(0);
      showPointsPopup("Review the explanation to learn!", "info");
    }

    setShowExplanations(true);
  }, [showExplanations, finished, currentQuestion, questionStartTime, streak, bestStreak, calculatePoints, showPointsPopup]);

  const handleContinue = useCallback(() => {
    if (isLastQuestion) {
      setFinished(true);
      const finalResult: QuizResult = {
        score: Math.round((score / normalized.length) * 100),
        totalQuestions: normalized.length,
        correctAnswers: score,
        pointsEarned: points,
        streakBonus: bestStreak >= 3 ? bestStreak * 2 : 0,
        speedBonus: 0,
        bestStreak,
      };
      setResult(finalResult);
      onComplete?.(finalResult);

      if (user) {
        const answersArray = Object.entries(answers).map(([qid, ans]) => ({
          questionId: qid,
          selectedOptionIndex: ans,
          timeSpentSeconds: 0,
        }));
        learnApi.submitLesson(lessonId, user.id, answersArray as any)
          .catch((err: Error) => console.error("Submit failed:", err));
      }
    } else {
      setCurrentIndex(i => i + 1);
    }
  }, [isLastQuestion, score, normalized.length, points, bestStreak, onComplete, user, lessonId, answers]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setScore(0);
    setPoints(0);
    setStreak(0);
    setBestStreak(0);
    setFinished(false);
    setSelectedOption(null);
    setShowExplanations(false);
    setIsCorrect(false);
    setAnswers({});
    setResult(null);
  }, []);

  if (!currentQuestion) {
    return <div className="p-6 text-amber-700">No questions available.</div>;
  }

  // ---- RENDER: COMPLETION SCREEN ----
  if (finished && result) {
    const percentage = result.score;
    const isPerfect = percentage === 100;
    const isMastery = percentage >= 90;
    const isPass = percentage >= 70;

    return (
      <div className="bg-white rounded-2xl border border-amber-200/60 p-8 text-center animate-in fade-in zoom-in-95 duration-500">
        {isPerfect && (
          <div className="mb-4">
            <Sparkles className="w-12 h-12 text-amber-500 mx-auto animate-bounce" />
          </div>
        )}

        <div className={`text-5xl font-bold mb-2 ${
          isPerfect ? "text-amber-600" : isMastery ? "text-green-600" : isPass ? "text-amber-600" : "text-red-500"
        }`}>
          {percentage}%
        </div>

        <p className="text-amber-700 mb-2">
          You got <span className="font-bold">{result.correctAnswers}</span> out of <span className="font-bold">{result.totalQuestions}</span> correct!
        </p>

        {isPerfect ? (
          <p className="text-amber-600 font-medium mb-2">🏆 Perfect score! You&apos;ve mastered these concepts!</p>
        ) : isMastery ? (
          <p className="text-green-600 font-medium mb-2">🌟 Excellent! You have a strong grasp of these concepts.</p>
        ) : isPass ? (
          <p className="text-amber-600 font-medium mb-2">👍 Good job! Keep practicing to reach mastery.</p>
        ) : (
          <p className="text-red-500 font-medium mb-2">📚 Review the explanations and try again. You&apos;ll get there!</p>
        )}

        {isPass && (
          <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-green-50 rounded-xl border border-green-200">
            <Unlock className="w-5 h-5 text-green-600" />
            <span className="text-green-700 font-medium text-sm">Next lesson unlocked!</span>
          </div>
        )}

        <div className="flex justify-center gap-4 mb-6">
          <div className="px-4 py-2 bg-amber-50 rounded-xl border border-amber-100">
            <div className="flex items-center gap-1.5 text-amber-700">
              <Target className="w-4 h-4" />
              <span className="text-sm font-bold">{result.correctAnswers}/{result.totalQuestions}</span>
            </div>
            <div className="text-xs text-amber-500">Correct</div>
          </div>
          <div className="px-4 py-2 bg-purple-50 rounded-xl border border-purple-100">
            <div className="flex items-center gap-1.5 text-purple-700">
              <Star className="w-4 h-4" />
              <span className="text-sm font-bold">{result.pointsEarned} XP</span>
            </div>
            <div className="text-xs text-purple-500">Earned</div>
          </div>
          <div className="px-4 py-2 bg-orange-50 rounded-xl border border-orange-100">
            <div className="flex items-center gap-1.5 text-orange-700">
              <Flame className="w-4 h-4" />
              <span className="text-sm font-bold">{result.bestStreak}</span>
            </div>
            <div className="text-xs text-orange-500">Best Streak</div>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 px-6 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-800 font-semibold rounded-xl transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Retry Quiz
          </button>
        </div>
      </div>
    );
  }

  // ---- RENDER: MAIN QUIZ ----
  const diffConfig = DIFFICULTY_CONFIG[currentQuestion.difficulty] || DIFFICULTY_CONFIG.medium;
  const bloomClass = BLOOM_COLORS[currentQuestion.bloomLabel] || BLOOM_COLORS.Understand;

  return (
    <div className="relative">
      {/* Points Popup */}
      <div ref={pointsPopupRef} className="points-popup success">
        +10 points!
      </div>

      {/* Gamification HUD */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-lg border border-amber-100">
            <Star className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-bold text-amber-700">{points} XP</span>
          </div>
          {streak >= 3 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 rounded-lg border border-orange-100 animate-pulse">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-bold text-orange-700">{streak} streak!</span>
            </div>
          )}
        </div>
        <div className="text-sm text-amber-600 font-medium">
          {currentIndex + 1} / {normalized.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-amber-100 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
          style={{ width: `${((currentIndex) / normalized.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl border border-amber-200/60 p-6 shadow-sm">
        {/* Question Meta */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <Trophy className="w-5 h-5 text-amber-600" />
          <h2 className="text-lg font-bold text-amber-900">Knowledge Check</h2>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${diffConfig.color}`}>
            {diffConfig.icon} {diffConfig.label}
          </span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${bloomClass}`}>
            {currentQuestion.bloomLabel}
          </span>
        </div>

        {/* Platform Integration Tag */}
        {currentQuestion.feature && (
          <div className="flex items-center gap-2 mb-4 p-2 bg-blue-50/50 rounded-lg border border-blue-100">
            <Monitor className="w-4 h-4 text-blue-500 shrink-0" />
            <span className="text-xs text-blue-700">
              <span className="font-semibold">Grahvani Feature:</span> {currentQuestion.feature}
              {currentQuestion.softwareTool && (
                <span className="ml-1 text-blue-500">({currentQuestion.softwareTool})</span>
              )}
            </span>
          </div>
        )}

        {/* Question Text */}
        <p className="text-lg font-medium text-amber-900 mb-6 leading-relaxed">
          {currentQuestion.question}
        </p>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const showCorrect = showExplanations && option.isCorrect;
            const showWrong = showExplanations && isSelected && !option.isCorrect;
            const isRevealedWrong = showExplanations && !option.isCorrect && !isSelected;

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={showExplanations}
                className={`w-full text-left rounded-xl border-2 transition-all duration-300 ${
                  showCorrect
                    ? "bg-green-50 border-green-400 shadow-sm"
                    : showWrong
                    ? "bg-red-50 border-red-400 shadow-sm"
                    : isRevealedWrong
                    ? "bg-gray-50 border-gray-200 opacity-70"
                    : isSelected
                    ? "bg-amber-100 border-amber-400"
                    : "bg-amber-50/30 border-amber-100 hover:bg-amber-50 hover:border-amber-300"
                } ${showExplanations ? "cursor-default" : "cursor-pointer hover:scale-[1.01]"}`}
              >
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all mt-0.5 ${
                      showCorrect
                        ? "bg-green-500 text-white"
                        : showWrong
                        ? "bg-red-500 text-white"
                        : isRevealedWrong
                        ? "bg-gray-300 text-gray-600"
                        : isSelected
                        ? "bg-amber-500 text-white"
                        : "bg-amber-200 text-amber-700"
                    }`}>
                      {showCorrect ? <CheckCircle2 className="w-5 h-5" /> :
                       showWrong ? <XCircle className="w-5 h-5" /> :
                       isRevealedWrong ? <XCircle className="w-4 h-4" /> :
                       String.fromCharCode(65 + idx)}
                    </span>
                    <div className="flex-1">
                      <span className={`text-base font-medium ${
                        showCorrect ? "text-green-900" :
                        showWrong ? "text-red-900" :
                        isRevealedWrong ? "text-gray-500" :
                        "text-amber-900"
                      }`}>
                        {option.text}
                      </span>

                      {/* Option Study Explanation */}
                      {showExplanations && (
                        <div className={`mt-3 p-3 rounded-lg text-sm leading-relaxed border-l-4 ${
                          option.isCorrect
                            ? "bg-green-100/50 border-green-400 text-green-800"
                            : isSelected
                            ? "bg-red-100/50 border-red-400 text-red-800"
                            : "bg-gray-100/50 border-gray-300 text-gray-600"
                        }`}>
                          <strong className={`block mb-1 ${
                            option.isCorrect ? "text-green-700" :
                            isSelected ? "text-red-700" :
                            "text-gray-500"
                          }`}>
                            {option.isCorrect ? "✓ CORRECT" : isSelected ? "✗ YOU SELECTED THIS" : "✗ INCORRECT"}
                          </strong>
                          {option.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Concept Tags */}
        {showExplanations && currentQuestion.tags.length > 0 && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <BookOpen className="w-4 h-4 text-amber-400" />
            {currentQuestion.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-1 bg-amber-50 text-amber-600 rounded-md border border-amber-100">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Continue Button */}
        {showExplanations && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleContinue}
              className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLastQuestion ? (
                <>See Results <Trophy className="w-4 h-4" /></>
              ) : (
                <>Next Question <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .points-popup {
          position: fixed;
          top: 100px;
          right: 20px;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: bold;
          font-size: 1.1rem;
          transform: translateX(400px);
          transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          z-index: 1000;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .points-popup.success {
          background: #2ecc71;
          color: #fff;
        }
        .points-popup.info {
          background: #3498db;
          color: #fff;
        }
        .points-popup.show {
          transform: translateX(0);
        }
      `}</style>
    </div>
  );
}
