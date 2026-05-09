"use client";

import React, { useState, useCallback, useMemo, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { learnApi } from "@/lib/api";
import QuizProgress from "./QuizProgress";
import QuizFeedback from "./QuizFeedback";
import { Trophy, Star, RotateCcw, Sparkles, Target, BookOpen, CheckCircle2 } from "lucide-react";

// ============================================================
// TYPES
// ============================================================

interface Concept {
  id: number;
  title: string;
  description: string;
  icon?: string;
  keyTakeaway?: string;
}

interface SubQuestion {
  questionId: number;
  question: string;
  options: Record<string, string>;
  correctAnswer: string;
  explanation: string;
  whyWrong?: Record<string, string>;
}

interface MatchingPair {
  left: string;
  right: string;
}

type QuizQuestion =
  | {
      questionId: number;
      type: "multiple_choice";
      question: string;
      options: Record<string, string>;
      correctAnswer: string;
      explanation: string;
      whyWrong?: Record<string, string>;
      conceptRef?: number;
      memoryAid?: string;
      hint?: string;
      difficulty?: string;
    }
  | {
      questionId: number;
      type: "true_false";
      question: string;
      correctAnswer: "true" | "false";
      explanation: string;
      conceptRef?: number;
      memoryAid?: string;
      hint?: string;
      difficulty?: string;
    }
  | {
      questionId: number;
      type: "matching";
      question: string;
      pairs: MatchingPair[];
      conceptRef?: number;
      memoryAid?: string;
      difficulty?: string;
    }
  | {
      questionId: number;
      type: "fill_blank";
      question: string;
      correctAnswer: string;
      acceptableAnswers?: string[];
      explanation: string;
      conceptRef?: number;
      memoryAid?: string;
      hint?: string;
      difficulty?: string;
    }
  | {
      questionId: number;
      type: "case_study";
      question: string;
      scenario: string;
      subQuestions: SubQuestion[];
      conceptRef?: number;
      memoryAid?: string;
      difficulty?: string;
    };

interface InteractiveQuizProps {
  quiz: QuizQuestion[];
  concepts: Concept[];
  lessonId: string;
}

// ============================================================
// HELPERS
// ============================================================

function getTotalPossibleScore(quiz: QuizQuestion[]): number {
  return quiz.reduce((sum, q) => {
    if (q.type === "case_study") return sum + q.subQuestions.length;
    return sum + 1;
  }, 0);
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ============================================================
// COMPONENT
// ============================================================

export default function InteractiveQuiz({ quiz, concepts, lessonId }: InteractiveQuizProps) {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ score: number; correctAnswers: number; totalQuestions: number } | null>(null);

  // Answer tracking (includes time spent per question in ms)
  const [answers, setAnswers] = useState<Record<number, { answer: string; timeSpentMs: number }>>({});
  const questionStartTime = useRef<number>(Date.now());

  // Current question state
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Matching state
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [shuffledLeft, setShuffledLeft] = useState<string[]>([]);
  const [shuffledRight, setShuffledRight] = useState<string[]>([]);

  // Fill blank state
  const [fillInput, setFillInput] = useState("");

  // Case study state
  const [currentSubIndex, setCurrentSubIndex] = useState(0);
  const [caseStudyScore, setCaseStudyScore] = useState(0); // temp score within a case study
  const [caseStudyAnswers, setCaseStudyAnswers] = useState<string[]>([]); // answers for sub-questions

  const currentQuestion = quiz[currentIndex];
  const isLastQuestion = currentIndex === quiz.length - 1;
  const totalPossible = useMemo(() => getTotalPossibleScore(quiz), [quiz]);

  // Initialize state when question changes
  React.useEffect(() => {
    questionStartTime.current = Date.now();
    if (currentQuestion?.type === "matching") {
      const left = shuffleArray(currentQuestion.pairs.map((p) => p.left));
      const right = shuffleArray(currentQuestion.pairs.map((p) => p.right));
      setShuffledLeft(left);
      setShuffledRight(right);
      setMatchedPairs({});
      setSelectedLeft(null);
    }
    if (currentQuestion?.type === "fill_blank") {
      setFillInput("");
    }
    if (currentQuestion?.type === "case_study") {
      setCurrentSubIndex(0);
      setCaseStudyScore(0);
    setCaseStudyAnswers([]);
    }
    setSelectedOption(null);
    setShowFeedback(false);
    setIsCorrect(false);
  }, [currentIndex, currentQuestion]);

  // ---- SCORING ----
  const addCorrect = useCallback(() => {
    setStreak((s) => s + 1);
    setXp((x) => x + 10 + streak * 2);
    setScore((s) => s + 1);
    setIsCorrect(true);
  }, [streak]);

  const addWrong = useCallback(() => {
    setStreak(0);
    setIsCorrect(false);
  }, []);

  // ---- HANDLERS ----
  const handleMultipleChoice = useCallback((option: string) => {
    if (showFeedback || finished || currentQuestion.type !== "multiple_choice") return;
    setSelectedOption(option);
    const timeSpent = Date.now() - questionStartTime.current;
    setAnswers((prev) => ({ ...prev, [currentQuestion.questionId]: { answer: option, timeSpentMs: timeSpent } }));
    if (option === currentQuestion.correctAnswer) addCorrect();
    else addWrong();
    setShowFeedback(true);
  }, [showFeedback, finished, currentQuestion, addCorrect, addWrong]);

  const handleTrueFalse = useCallback((answer: "true" | "false") => {
    if (showFeedback || finished || currentQuestion.type !== "true_false") return;
    setSelectedOption(answer);
    const timeSpent = Date.now() - questionStartTime.current;
    setAnswers((prev) => ({ ...prev, [currentQuestion.questionId]: { answer, timeSpentMs: timeSpent } }));
    if (answer === currentQuestion.correctAnswer) addCorrect();
    else addWrong();
    setShowFeedback(true);
  }, [showFeedback, finished, currentQuestion, addCorrect, addWrong]);

  const handleMatchingSelect = useCallback((side: "left" | "right", value: string) => {
    if (showFeedback || finished || currentQuestion.type !== "matching") return;

    if (side === "left") {
      setSelectedLeft(value);
      return;
    }

    // side === "right" and left is selected
    if (selectedLeft) {
      const newMatched = { ...matchedPairs, [selectedLeft]: value };
      setMatchedPairs(newMatched);
      setSelectedLeft(null);

      // Check if all pairs are matched
      const allMatched = Object.keys(newMatched).length === currentQuestion.pairs.length;
      if (allMatched) {
        // Validate
        let allCorrect = true;
        for (const pair of currentQuestion.pairs) {
          if (newMatched[pair.left] !== pair.right) {
            allCorrect = false;
            break;
          }
        }
        const timeSpent = Date.now() - questionStartTime.current;
        setAnswers((prev) => ({ ...prev, [currentQuestion.questionId]: { answer: JSON.stringify(newMatched), timeSpentMs: timeSpent } }));
        if (allCorrect) addCorrect();
        else addWrong();
        setShowFeedback(true);
      }
    }
  }, [showFeedback, finished, currentQuestion, selectedLeft, matchedPairs, addCorrect, addWrong]);

  const handleFillBlankSubmit = useCallback(() => {
    if (showFeedback || finished || currentQuestion.type !== "fill_blank") return;
    const userAnswer = fillInput.trim().toLowerCase();
    const correct = currentQuestion.correctAnswer.toLowerCase();
    const acceptable = (currentQuestion.acceptableAnswers || []).map((a) => a.toLowerCase());
    const isAnsCorrect = userAnswer === correct || acceptable.includes(userAnswer);

    const timeSpent = Date.now() - questionStartTime.current;
    setAnswers((prev) => ({ ...prev, [currentQuestion.questionId]: { answer: fillInput.trim(), timeSpentMs: timeSpent } }));
    if (isAnsCorrect) addCorrect();
    else addWrong();
    setShowFeedback(true);
  }, [showFeedback, finished, currentQuestion, fillInput, addCorrect, addWrong]);

  const handleCaseStudySubAnswer = useCallback((option: string) => {
    if (showFeedback || finished || currentQuestion.type !== "case_study") return;
    const subQ = currentQuestion.subQuestions[currentSubIndex];
    setSelectedOption(option);
    setCaseStudyAnswers((prev) => [...prev, option]);

    if (option === subQ.correctAnswer) {
      setCaseStudyScore((s) => s + 1);
      setScore((s) => s + 1);
      setXp((x) => x + 10 + streak * 2);
      setStreak((s) => s + 1);
      setIsCorrect(true);
    } else {
      setStreak(0);
      setIsCorrect(false);
    }
    setShowFeedback(true);
  }, [showFeedback, finished, currentQuestion, currentSubIndex, streak]);

  // ---- CONTINUE / NEXT ----
  const handleContinue = useCallback(() => {
    if (currentQuestion.type === "case_study") {
      const subQs = currentQuestion.subQuestions;
      if (currentSubIndex < subQs.length - 1) {
        // Next sub-question
        setCurrentSubIndex((i) => i + 1);
        setSelectedOption(null);
        setShowFeedback(false);
        return;
      }
      // Save case study answers (include current selectedOption to ensure latest answer is captured)
      const finalAnswers = [...caseStudyAnswers];
      if (selectedOption && finalAnswers.length < currentQuestion.subQuestions.length) {
        finalAnswers.push(selectedOption);
      }
      const timeSpent = Date.now() - questionStartTime.current;
      setAnswers((prev) => ({ ...prev, [currentQuestion.questionId]: { answer: JSON.stringify(finalAnswers), timeSpentMs: timeSpent } }));
    }

    if (isLastQuestion) {
      setFinished(true);
      if (user) {
        const answersArray = Object.entries(answers).map(([qid, ans]) => ({
          questionId: parseInt(qid),
          answer: ans.answer,
          timeSpentSeconds: Math.round(ans.timeSpentMs / 1000),
        }));
        learnApi.submitLesson(lessonId, user.id, answersArray)
          .then((res: { success: boolean; data?: { score: number; correctAnswers: number; totalQuestions: number } }) => {
            if (res.success && res.data) {
              setResult(res.data);
              setSubmitted(true);
            }
          })
          .catch((err: Error) => console.error("Submit failed:", err));
      }
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }, [isLastQuestion, user, lessonId, answers, currentQuestion, currentSubIndex]);

  const handleRetry = useCallback(() => {
    setSelectedOption(null);
    setShowFeedback(false);
    if (currentQuestion.type === "matching") {
      setMatchedPairs({});
      setSelectedLeft(null);
    }
    if (currentQuestion.type === "fill_blank") {
      setFillInput("");
    }
    if (currentQuestion.type === "case_study") {
      // Reset case study to first sub-question
      setCurrentSubIndex(0);
      setCaseStudyScore(0);
      setCaseStudyAnswers([]);
    }
    // Remove answer tracking for current
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[currentQuestion.questionId];
      return next;
    });
  }, [currentQuestion]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setIsCorrect(false);
    setAnswers({});
    setStreak(0);
    setXp(0);
    setScore(0);
    setFinished(false);
    setSubmitted(false);
    setResult(null);
    setMatchedPairs({});
    setSelectedLeft(null);
    setFillInput("");
    setCurrentSubIndex(0);
    setCaseStudyScore(0);
  }, []);

  const getConceptTitle = (ref?: number) => {
    if (!ref) return undefined;
    return concepts.find((c) => c.id === ref)?.title;
  };

  // ---- RENDER: COMPLETION SCREEN ----
  if (finished) {
    const percentage = totalPossible > 0 ? Math.round((score / totalPossible) * 100) : 0;
    const isPerfect = percentage === 100;

    return (
      <div className="bg-white rounded-2xl border border-amber-200/60 p-8 text-center animate-in fade-in zoom-in-95 duration-500">
        {isPerfect && (
          <div className="mb-4">
            <Sparkles className="w-12 h-12 text-amber-500 mx-auto animate-bounce" />
          </div>
        )}

        <div className={`text-5xl font-bold mb-2 ${isPerfect ? "text-amber-600" : percentage >= 70 ? "text-green-600" : "text-amber-600"}`}>
          {percentage}%
        </div>

        <p className="text-amber-700 mb-2">
          You got <span className="font-bold">{score}</span> out of <span className="font-bold">{totalPossible}</span> correct!
        </p>

        {isPerfect ? (
          <p className="text-amber-600 font-medium mb-6">🏆 Perfect score! You&apos;ve mastered these concepts!</p>
        ) : percentage >= 70 ? (
          <p className="text-green-600 font-medium mb-6">🌟 Great job! You have a solid grasp of these concepts.</p>
        ) : (
          <p className="text-amber-600 font-medium mb-6">📚 Keep practicing! Review the concepts and try again.</p>
        )}

        <div className="flex justify-center gap-4 mb-6">
          <div className="px-4 py-2 bg-white rounded-xl border border-gray-200/60 shadow-sm">
            <div className="flex items-center gap-1.5 text-amber-700">
              <Target className="w-4 h-4" />
              <span className="text-sm font-bold">{score}/{totalPossible}</span>
            </div>
            <div className="text-xs text-amber-500">Correct</div>
          </div>
          <div className="px-4 py-2 bg-purple-50 rounded-xl border border-purple-100">
            <div className="flex items-center gap-1.5 text-purple-700">
              <Star className="w-4 h-4" />
              <span className="text-sm font-bold">{xp} XP</span>
            </div>
            <div className="text-xs text-purple-500">Earned</div>
          </div>
          <div className="px-4 py-2 bg-green-50 rounded-xl border border-green-100">
            <div className="flex items-center gap-1.5 text-green-700">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-bold">{score}</span>
            </div>
            <div className="text-xs text-green-500">Mastered</div>
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

  // ---- RENDER: QUESTION CONTENT ----
  const renderQuestionContent = () => {
    switch (currentQuestion.type) {
      case "multiple_choice":
        return (
          <div className="space-y-3">
            {Object.entries(currentQuestion.options).map(([key, value]) => {
              const isSelected = selectedOption === key;
              const isCorrectOption = currentQuestion.correctAnswer === key;
              const showCorrect = showFeedback && isCorrectOption;
              const showWrong = showFeedback && isSelected && !isCorrectOption;

              return (
                <button
                  key={key}
                  onClick={() => handleMultipleChoice(key)}
                  disabled={showFeedback}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                    showCorrect
                      ? "bg-green-50 border-green-400 text-green-900 shadow-sm"
                      : showWrong
                      ? "bg-red-50 border-red-400 text-red-900 shadow-sm"
                      : isSelected
                      ? "bg-amber-100 border-amber-400 text-amber-900"
                      : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-800"
                  } ${showFeedback ? "cursor-default" : "cursor-pointer hover:scale-[1.01]"}`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all ${
                      showCorrect ? "bg-green-500 text-white" : showWrong ? "bg-red-500 text-white" : isSelected ? "bg-amber-500 text-white" : "bg-amber-200 text-amber-700"
                    }`}>
                      {showCorrect ? "✓" : showWrong ? "✕" : key}
                    </span>
                    <span className="text-base font-medium">{value}</span>
                  </div>
                </button>
              );
            })}
          </div>
        );

      case "true_false":
        return (
          <div className="flex gap-4">
            {(["true", "false"] as const).map((val) => {
              const isSelected = selectedOption === val;
              const showCorrect = showFeedback && currentQuestion.correctAnswer === val;
              const showWrong = showFeedback && isSelected && currentQuestion.correctAnswer !== val;
              const label = val === "true" ? "True" : "False";

              return (
                <button
                  key={val}
                  onClick={() => handleTrueFalse(val)}
                  disabled={showFeedback}
                  className={`flex-1 p-5 rounded-xl border-2 text-center font-bold text-lg transition-all duration-300 ${
                    showCorrect
                      ? "bg-green-50 border-green-400 text-green-900 shadow-sm"
                      : showWrong
                      ? "bg-red-50 border-red-400 text-red-900 shadow-sm"
                      : isSelected
                      ? "bg-amber-100 border-amber-400 text-amber-900"
                      : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-800"
                  } ${showFeedback ? "cursor-default" : "cursor-pointer hover:scale-[1.02]"}`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      showCorrect ? "bg-green-500 text-white" : showWrong ? "bg-red-500 text-white" : isSelected ? "bg-amber-500 text-white" : "bg-amber-200 text-amber-700"
                    }`}>
                      {showCorrect ? "✓" : showWrong ? "✕" : val === "true" ? "T" : "F"}
                    </span>
                    {label}
                  </div>
                </button>
              );
            })}
          </div>
        );

      case "matching": {
        const allMatched = Object.keys(matchedPairs).length === currentQuestion.pairs.length;
        const unmatchedLeft = shuffledLeft.filter((l) => !matchedPairs[l]);
        const unmatchedRight = shuffledRight.filter((r) => !Object.values(matchedPairs).includes(r));

        return (
          <div className="space-y-6">
            {/* Matched pairs */}
            {Object.keys(matchedPairs).length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700">Matched:</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(matchedPairs).map(([left, right]) => {
                    const isCorrect = currentQuestion.pairs.some((p) => p.left === left && p.right === right);
                    return (
                      <div key={left} className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${
                        isCorrect ? "bg-green-50 border-green-300 text-green-800" : "bg-red-50 border-red-300 text-red-800"
                      }`}>
                        {left} ↔ {right}
                        {isCorrect ? " ✓" : " ✕"}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Unmatched columns */}
            {!allMatched && (
              <div className="grid grid-cols-2 gap-6">
                {/* Left column */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-amber-500 uppercase tracking-wide">Terms</p>
                  {unmatchedLeft.map((item) => (
                    <button
                      key={item}
                      onClick={() => handleMatchingSelect("left", item)}
                      disabled={showFeedback}
                      className={`w-full p-3 rounded-xl border-2 text-left text-sm font-medium transition-all ${
                        selectedLeft === item
                          ? "bg-amber-100 border-amber-500 text-amber-900"
                          : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-800"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                {/* Right column */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-amber-500 uppercase tracking-wide">Definitions</p>
                  {unmatchedRight.map((item) => (
                    <button
                      key={item}
                      onClick={() => handleMatchingSelect("right", item)}
                      disabled={showFeedback || !selectedLeft}
                      className={`w-full p-3 rounded-xl border-2 text-left text-sm transition-all ${
                        !selectedLeft
                          ? "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-800 cursor-pointer"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedLeft && unmatchedRight.length > 0 && (
              <p className="text-sm text-amber-600 text-center">
                Selected: <span className="font-bold">{selectedLeft}</span> — now click its matching definition
              </p>
            )}
          </div>
        );
      }

      case "fill_blank":
        return (
          <div className="space-y-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={fillInput}
                onChange={(e) => setFillInput(e.target.value)}
                disabled={showFeedback}
                placeholder="Type your answer..."
                onKeyDown={(e) => e.key === "Enter" && handleFillBlankSubmit()}
                className={`flex-1 p-4 rounded-xl border-2 text-base font-medium transition-all ${
                  showFeedback
                    ? isCorrect
                      ? "bg-green-50 border-green-400 text-green-900"
                      : "bg-red-50 border-red-400 text-red-900"
                    : "bg-white border-gray-200 focus:border-amber-400 focus:outline-none text-gray-900 placeholder:text-gray-400"
                }`}
              />
              <button
                onClick={handleFillBlankSubmit}
                disabled={showFeedback || !fillInput.trim()}
                className="px-6 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-200 text-white font-semibold rounded-xl transition-colors"
              >
                Check
              </button>
            </div>
            {showFeedback && (
              <div className={`text-sm font-medium ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                {isCorrect ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Correct!
                  </span>
                ) : (
                  <span>The correct answer was: <span className="font-bold">{currentQuestion.correctAnswer}</span></span>
                )}
              </div>
            )}
          </div>
        );

      case "case_study": {
        const subQ = currentQuestion.subQuestions[currentSubIndex];
        return (
          <div className="space-y-5">
            {/* Scenario box */}
            <div className="p-4 bg-white rounded-xl border border-gray-200/60 border-l-4 border-l-indigo-400 shadow-sm">
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-2">Case Study Scenario</p>
              <p className="text-sm text-gray-700 leading-relaxed">{currentQuestion.scenario}</p>
            </div>

            {/* Sub-question progress */}
            <div className="flex items-center gap-2">
              {currentQuestion.subQuestions.map((_, idx) => (
                <div key={idx} className={`h-1.5 flex-1 rounded-full ${
                  idx < currentSubIndex ? "bg-green-400" : idx === currentSubIndex ? "bg-amber-500" : "bg-amber-100"
                }`} />
              ))}
            </div>

            {/* Sub-question */}
            <div>
              <p className="text-sm text-amber-500 font-medium mb-3">
                Question {currentSubIndex + 1} of {currentQuestion.subQuestions.length}
              </p>
              <p className="text-base font-medium text-gray-900 mb-4">{subQ.question}</p>

              <div className="space-y-3">
                {Object.entries(subQ.options).map(([key, value]) => {
                  const isSelected = selectedOption === key;
                  const isCorrectOption = subQ.correctAnswer === key;
                  const showCorrect = showFeedback && isCorrectOption;
                  const showWrong = showFeedback && isSelected && !isCorrectOption;

                  return (
                    <button
                      key={key}
                      onClick={() => handleCaseStudySubAnswer(key)}
                      disabled={showFeedback}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                        showCorrect
                          ? "bg-green-50 border-green-400 text-green-900 shadow-sm"
                          : showWrong
                          ? "bg-red-50 border-red-400 text-red-900 shadow-sm"
                          : isSelected
                          ? "bg-amber-100 border-amber-400 text-amber-900"
                          : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-800"
                      } ${showFeedback ? "cursor-default" : "cursor-pointer hover:scale-[1.01]"}`}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                          showCorrect ? "bg-green-500 text-white" : showWrong ? "bg-red-500 text-white" : isSelected ? "bg-amber-500 text-white" : "bg-amber-200 text-amber-700"
                        }`}>
                          {showCorrect ? "✓" : showWrong ? "✕" : key}
                        </span>
                        <span className="text-sm font-medium">{value}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  // ---- RENDER: FEEDBACK FOR CURRENT QUESTION ----
  const renderFeedback = () => {
    if (!showFeedback) return null;

    if (currentQuestion.type === "case_study") {
      const subQ = currentQuestion.subQuestions[currentSubIndex];
      const isLastSub = currentSubIndex === currentQuestion.subQuestions.length - 1;
      return (
        <QuizFeedback
          isCorrect={isCorrect}
          selectedOption={selectedOption || ""}
          correctAnswer={subQ.correctAnswer}
          explanation={subQ.explanation}
          whyWrong={subQ.whyWrong}
          memoryAid={currentSubIndex === currentQuestion.subQuestions.length - 1 ? currentQuestion.memoryAid : undefined}
          conceptRef={currentQuestion.conceptRef}
          conceptTitle={getConceptTitle(currentQuestion.conceptRef)}
          onContinue={handleContinue}
          onRetry={!isCorrect ? handleRetry : undefined}
          continueLabel={isLastSub ? undefined : "Next Question"}
        />
      );
    }

    // For matching, we need custom explanation
    const explanation = currentQuestion.type === "matching"
      ? isCorrect
        ? "Perfect match! You correctly paired all terms with their definitions."
        : `Some pairs were incorrect. Here are the correct matches:\n${currentQuestion.pairs.map((p) => `• ${p.left} → ${p.right}`).join("\n")}`
      : currentQuestion.type === "fill_blank"
      ? currentQuestion.explanation
      : currentQuestion.explanation;

    return (
      <QuizFeedback
        isCorrect={isCorrect}
        selectedOption={selectedOption || ""}
        correctAnswer={
          currentQuestion.type === "matching"
            ? "See explanation"
            : currentQuestion.type === "fill_blank"
            ? currentQuestion.correctAnswer
            : currentQuestion.correctAnswer
        }
        explanation={explanation}
        whyWrong={currentQuestion.type === "multiple_choice" ? currentQuestion.whyWrong : undefined}
        memoryAid={currentQuestion.memoryAid}
        conceptRef={currentQuestion.conceptRef}
        conceptTitle={getConceptTitle(currentQuestion.conceptRef)}
        onContinue={handleContinue}
        onRetry={!isCorrect && currentQuestion.type !== "matching" ? handleRetry : undefined}
      />
    );
  };

  // ---- RENDER: HINT ----
  const renderHint = () => {
    if (showFeedback) return null;
    const hint = currentQuestion.type === "case_study"
      ? undefined
      : currentQuestion.type === "matching"
      ? undefined
      : currentQuestion.hint;

    if (!hint) return null;

    return (
      <div className="mt-4 p-3 bg-blue-50/60 rounded-xl border border-blue-100">
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Hint:</span> {hint}
          </p>
        </div>
      </div>
    );
  };

  // ---- MAIN RENDER ----
  return (
    <div className="bg-white rounded-2xl border border-amber-200/60 p-6 shadow-sm">
      {/* Progress */}
      <QuizProgress
        current={currentIndex + 1}
        total={quiz.length}
        streak={streak}
        xp={xp}
      />

      {/* Question Card */}
      <div className="mb-2">
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <Trophy className="w-5 h-5 text-amber-600" />
          <h2 className="text-xl font-bold text-gray-900">Knowledge Check</h2>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            currentQuestion.difficulty === "easy"
              ? "bg-green-100 text-green-700"
              : currentQuestion.difficulty === "hard"
              ? "bg-red-100 text-red-700"
              : "bg-amber-100 text-amber-700"
          }`}>
            {currentQuestion.difficulty || "medium"}
          </span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700`}>
            {currentQuestion.type === "multiple_choice" ? "Multiple Choice" :
             currentQuestion.type === "true_false" ? "True / False" :
             currentQuestion.type === "matching" ? "Matching" :
             currentQuestion.type === "fill_blank" ? "Fill in Blank" :
             "Case Study"}
          </span>
        </div>

        <p className="text-lg font-medium text-gray-900 mb-6 leading-relaxed">
          {currentQuestion.question}
        </p>

        {renderQuestionContent()}
      </div>

      {renderHint()}
      {renderFeedback()}
    </div>
  );
}
