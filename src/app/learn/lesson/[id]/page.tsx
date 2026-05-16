"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, BookOpen, GraduationCap, BrainCircuit,
  Lightbulb, CheckCircle2, Lock, Play, Clock, FileQuestion,
  ChevronRight, Trophy, BarChart3, ScrollText, Monitor
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { learnApi, type Lesson, type LessonProgressData } from "@/lib/api";
import MarkdownContent from "@/components/learn/MarkdownContent";
import InteractiveQuiz from "@/components/learn/InteractiveQuiz";

type TabType = "content" | "concepts" | "quiz";

interface Concept {
  id: number;
  title: string;
  description: string;
  icon?: string;
}

export default function LessonPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [lessonProgress, setLessonProgress] = useState<LessonProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("content");

  useEffect(() => {
    const lessonId = id as string;
    const promises: Promise<any>[] = [
      learnApi.getLesson(lessonId).then((res: { success: boolean; data: Lesson }) => {
        if (res.success) setLesson(res.data);
      }),
    ];

    if (user) {
      promises.push(
        learnApi.getLessonProgress(lessonId, user.id).then((res: { success: boolean; data: LessonProgressData }) => {
          if (res.success) setLessonProgress(res.data);
        })
      );
    }

    Promise.all(promises)
      .catch((err: Error) => console.error("Failed to fetch lesson:", err))
      .finally(() => setLoading(false));
  }, [id, user]);



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-amber-700 font-medium">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="text-center">
          <p className="text-red-600 text-lg font-medium">Lesson not found</p>
          <Link href="/learn" className="text-amber-600 hover:text-amber-800 text-sm mt-2 inline-block">
            Back to Learning Path
          </Link>
        </div>
      </div>
    );
  }

  const content = lesson.contentJson;
  const isLocked = lessonProgress?.status === "locked";
  const isCompleted = lessonProgress?.status === "COMPLETED" || lessonProgress?.status === "completed";
  const concepts: Concept[] = content.concepts || [];
  const quiz = content.quiz || [];
  const hasQuiz = quiz.length > 0;

  // Split bodyMarkdown at §7 (interactive component section)
  // §7 contains instructions for using an interactive component — not plain content.
  // When interactiveEnabled is true but no component exists, we render a placeholder card.
  const section7Match = lesson.bodyMarkdown?.match(/(# §7[\s\S]*?)(?=\n# §8|\n# §9|$)/);
  const hasInteractiveSection = !!section7Match && lesson.interactiveEnabled;
  const preInteractiveMd = hasInteractiveSection
    ? lesson.bodyMarkdown?.slice(0, lesson.bodyMarkdown.indexOf(section7Match[0])) || lesson.bodyMarkdown || ""
    : lesson.bodyMarkdown || "";
  const postInteractiveMd = hasInteractiveSection
    ? lesson.bodyMarkdown?.slice(lesson.bodyMarkdown.indexOf(section7Match[0]) + section7Match[0].length) || ""
    : "";

  // Extract metadata for header
  const targetMinutes = lesson.targetMinutesTotal || lesson.targetMinutesReading || 25;
  const mcqCount = quiz.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* ═══════════════ HEADER ═══════════════ */}
      <div className="bg-white border-b border-amber-200/60">
        <div className="max-w-[1100px] mx-auto px-6 py-6">
          {/* Breadcrumb */}
          <Link
            href="/learn"
            className="inline-flex items-center gap-1.5 text-sm text-amber-600 hover:text-amber-800 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Learning Path
          </Link>

          {/* Title row */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                  Lesson {lesson.sequenceOrder}
                </span>
                {isCompleted && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" /> Completed
                  </span>
                )}
                {isLocked && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                    <Lock className="w-3 h-3" /> Locked
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                {lesson.title}
              </h1>

              {/* Meta stats */}
              <div className="flex items-center gap-4 mt-3 flex-wrap">
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {targetMinutes} min read
                </span>
                {mcqCount > 0 && (
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <FileQuestion className="w-4 h-4" /> {mcqCount} questions
                  </span>
                )}
                {lesson.bloomLevels && lesson.bloomLevels.length > 0 && (
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <BarChart3 className="w-4 h-4" /> {lesson.bloomLevels.join(", ")}
                  </span>
                )}
                {lesson.lastUpdated && (
                  <span className="text-sm text-gray-400">
                    Updated {new Date(lesson.lastUpdated).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                  </span>
                )}
                {lessonProgress && lessonProgress.bestScore > 0 && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                    Best Score: {lessonProgress.bestScore}%
                  </span>
                )}
              </div>
            </div>

            {/* CTA */}
            {!isCompleted && !isLocked && (
              <Link
                href="#quiz"
                onClick={() => setActiveTab("quiz")}
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors shrink-0 text-sm"
              >
                <Play className="w-4 h-4" />
                Take Quiz
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════ TABS ═══════════════ */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-amber-200/40">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="flex items-center gap-1 overflow-x-auto">
            <TabButton
              id="content"
              label="Lesson Content"
              icon={ScrollText}
              active={activeTab === "content"}
              onClick={() => setActiveTab("content")}
            />
            <TabButton
              id="concepts"
              label={`Key Concepts (${concepts.length})`}
              icon={Lightbulb}
              active={activeTab === "concepts"}
              onClick={() => setActiveTab("concepts")}
            />
            {hasQuiz && (
              <TabButton
                id="quiz"
                label={`Quiz (${mcqCount})`}
                icon={BrainCircuit}
                active={activeTab === "quiz"}
                onClick={() => setActiveTab("quiz")}
              />
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════ CONTENT AREA ═══════════════ */}
      <div className="max-w-[1100px] mx-auto px-6 py-8 pb-20">
        {/* ── Content Tab ── */}
        {activeTab === "content" && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
            {/* Main reading column */}
            <div>
              {/* Learning outcomes */}
              {lesson.learningOutcomes && lesson.learningOutcomes.length > 0 && (
                <div className="mb-8 bg-amber-50/60 border border-amber-200/60 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    What You&apos;ll Learn
                  </h3>
                  <ul className="space-y-2">
                    {lesson.learningOutcomes.map((outcome: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Main markdown content */}
              <article className="bg-white rounded-2xl border border-amber-200/60 shadow-sm p-6 md:p-8">
                {/* Pre-§7 content */}
                <MarkdownContent
                  content={preInteractiveMd}
                  className="lesson-markdown"
                />

                {/* §7 Interactive placeholder — instructions are not plain content */}
                {hasInteractiveSection && (
                  <div className="my-8 rounded-xl border-2 border-dashed border-amber-300 bg-amber-50/40 p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-600 mb-3">
                      <Monitor className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-amber-800 mb-1">
                      Interactive Component
                    </h3>
                    <p className="text-sm text-amber-700 mb-2">
                      {lesson.interactiveType?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </p>
                    {lesson.interactiveFallback && (
                      <p className="text-xs text-amber-600 max-w-md mx-auto">
                        {lesson.interactiveFallback}
                      </p>
                    )}
                  </div>
                )}

                {/* Post-§7 content */}
                {postInteractiveMd && (
                  <MarkdownContent
                    content={postInteractiveMd}
                    className="lesson-markdown"
                  />
                )}
              </article>
            </div>

            {/* Sidebar */}
            <aside className="space-y-4">
              {/* Progress card */}
              {lessonProgress && (
                <div className="bg-white rounded-xl border border-amber-200/60 p-4 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-800 mb-3">Your Progress</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500">Quiz Score</span>
                        <span className="font-bold text-amber-700">{lessonProgress.bestScore}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full"
                          style={{ width: `${lessonProgress.bestScore}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500">Sections Viewed</span>
                        <span className="font-bold text-amber-700">
                          {lessonProgress.sectionProgressPercentage}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${lessonProgress.sectionProgressPercentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                      <span className="text-gray-500">Attempts</span>
                      <span className="font-bold text-gray-700">{lessonProgress.attemptsCount}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick nav */}
              <div className="bg-white rounded-xl border border-amber-200/60 p-4 shadow-sm">
                <h3 className="text-sm font-bold text-gray-800 mb-3">Quick Navigation</h3>
                <div className="space-y-1">
                  <QuickNavItem label="Lesson Content" active={true} onClick={() => setActiveTab("content")} />
                  <QuickNavItem label={`Key Concepts (${concepts.length})`} active={false} onClick={() => setActiveTab("concepts")} />
                  {hasQuiz && (
                    <QuickNavItem label={`Quiz (${mcqCount})`} active={false} onClick={() => setActiveTab("quiz")} />
                  )}
                </div>
              </div>

              {/* Sources */}
              {lesson.primarySources && lesson.primarySources.length > 0 && (
                <div className="bg-white rounded-xl border border-amber-200/60 p-4 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-800 mb-2">Primary Sources</h3>
                  <ul className="space-y-1.5">
                    {lesson.primarySources.map((src: {ref: string; note?: string}, idx: number) => (
                      <li key={idx} className="text-xs text-gray-600">
                        <span className="font-medium text-gray-800">{src.ref}</span>
                        {src.note && <span className="text-gray-400"> — {src.note}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        )}

        {/* ── Concepts Tab ── */}
        {activeTab === "concepts" && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Lightbulb className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-900">Key Concepts</h2>
              <span className="ml-auto text-sm text-gray-500">{concepts.length} concepts</span>
            </div>
            {concepts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-amber-200/60 p-8 text-center text-gray-500">
                No concepts available for this lesson.
              </div>
            ) : (
              <div className="grid gap-4">
                {concepts.map((concept, idx) => {
                  const isOutcome = idx < (lesson.learningOutcomes?.length || 0);
                  return (
                    <div
                      key={concept.id}
                      className={`bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition-all ${
                        isOutcome
                          ? "border-amber-300/70 bg-gradient-to-r from-amber-50/50 to-white"
                          : "border-gray-200/80"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <span
                          className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                            isOutcome
                              ? "bg-amber-500 text-white shadow-sm shadow-amber-200"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900">{concept.title}</h3>
                            {isOutcome && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200 uppercase tracking-wide">
                                Learning Outcome
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">{concept.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Quiz Tab ── */}
        {activeTab === "quiz" && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <BrainCircuit className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-900">Test Your Knowledge</h2>
            </div>
            {isLocked ? (
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 text-center">
                <Lock className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-700 mb-2">Lesson Locked</h3>
                <p className="text-gray-500 mb-4">Complete the previous lessons to unlock this one.</p>
                <Link
                  href="/learn"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Go to Learning Path
                </Link>
              </div>
            ) : !hasQuiz ? (
              <div className="bg-white rounded-2xl border border-amber-200/60 p-8 text-center text-gray-500">
                No quiz available for this lesson.
              </div>
            ) : (
              <>
                {quiz.length > 0 && (
                  <div className="mb-4 p-3 bg-gray-100 rounded-lg text-xs font-mono overflow-auto max-h-48 border border-gray-300">
                    <div className="font-bold mb-1 text-gray-600">DEBUG — Quiz data format:</div>
                    <pre>{JSON.stringify(quiz[0], null, 2)}</pre>
                  </div>
                )}
                <InteractiveQuiz
                  quiz={quiz}
                  concepts={concepts}
                  lessonId={id as string}
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function TabButton({
  id,
  label,
  icon: Icon,
  active,
  onClick,
}: {
  id: TabType;
  label: string;
  icon: React.ElementType;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${
        active
          ? "border-amber-600 text-amber-700"
          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

function QuickNavItem({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
        active
          ? "bg-amber-50 text-amber-700 font-semibold"
          : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      {label}
      <ChevronRight className={`w-4 h-4 ${active ? "text-amber-500" : "text-gray-300"}`} />
    </button>
  );
}
