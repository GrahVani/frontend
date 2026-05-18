"use client";

import React, { useEffect, useState, useCallback, useMemo, lazy, Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, BookOpen, GraduationCap, BrainCircuit,
  Lightbulb, CheckCircle2, Lock, Play, Clock, FileQuestion,
  ChevronRight, Trophy, BarChart3, ScrollText, Monitor,
  Layers, GitBranch, Globe, Sparkles
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { learnApi, type Lesson, type LessonProgressData } from "@/lib/api";
import MarkdownContent from "@/components/learn/MarkdownContent";
import InteractiveQuiz from "@/components/learn/InteractiveQuiz";
import GenericLessonSidebar from "@/components/learn/GenericLessonSidebar";
import LessonMetadataBar from "@/components/learn/LessonMetadataBar";

// ─── Interactive Lesson Components (lazy-loaded) ───
const INTERACTIVE_MAP: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  "m1-ch1-l1": lazy(() => import("@/components/learn/module1/chapter1/Lesson1Interactive")),
};

function getInteractiveKey(lesson: Lesson): string | null {
  const key = `m${lesson.module}-ch${lesson.chapter}-l${lesson.sequenceOrder}`;
  return INTERACTIVE_MAP[key] ? key : null;
}

type TabType = "content" | "concepts" | "quiz";

interface Concept {
  id: number;
  title: string;
  description: string;
  icon?: string;
}

/** Extract sections from bodyMarkdown for sidebar navigation */
function extractSectionsFromMarkdown(md: string | undefined): Array<{ id: string; label: string; type: string; group: string }> {
  if (!md) return [];
  const sections: Array<{ id: string; label: string; type: string; group: string }> = [];
  const regex = /^#\s+§(\d+(?:\.\d+)?)\s+(.+)$/gm;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(md)) !== null) {
    const num = match[1];
    const title = match[2].trim();
    const id = `sec-${num.replace(".", "-")}`;

    // Map section numbers to groups and types
    let group = "Learn";
    let type = "definition";

    if (num === "1") { group = "Start"; type = "definition"; }
    else if (num === "2") { group = "Start"; type = "overview"; }
    else if (num === "3") { group = "Start"; type = "overview"; }
    else if (num.startsWith("4")) { group = "Learn"; type = "mechanics"; }
    else if (num === "5") { group = "Learn"; type = "definition"; }
    else if (num === "6") { group = "Learn"; type = "mechanics"; }
    else if (num === "7") { group = "Learn"; type = "concepts"; }
    else if (num === "8") { group = "Practice"; type = "quiz"; }
    else if (num === "9") { group = "Practice"; type = "recap"; }
    else if (num === "10") { group = "Practice"; type = "practice"; }
    else if (num === "11") { group = "Finish"; type = "recap"; }
    else if (num === "12") { group = "Finish"; type = "overview"; }

    sections.push({ id, label: title, type, group });
  }

  return sections;
}

export default function LessonPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [lessonProgress, setLessonProgress] = useState<LessonProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("content");
  const [activeSection, setActiveSection] = useState("sec-1");
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());

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

  // Scroll spy: track which section is in view
  useEffect(() => {
    if (activeTab !== "content") return;

    const sectionIds = extractSectionsFromMarkdown(lesson?.bodyMarkdown).map((s) => s.id);
    if (sectionIds.length === 0) return;

    const observers: IntersectionObserver[] = [];
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
          setCompletedSections((prev) => new Set([...prev, entry.target.id]));
        }
      }
    };

    // Small delay to let DOM render
    const timer = setTimeout(() => {
      sectionIds.forEach((secId) => {
        const el = document.getElementById(secId);
        if (el) {
          const observer = new IntersectionObserver(handleIntersect, {
            rootMargin: "-20% 0px -60% 0px",
            threshold: 0,
          });
          observer.observe(el);
          observers.push(observer);
        }
      });
    }, 500);

    return () => {
      clearTimeout(timer);
      observers.forEach((o) => o.disconnect());
    };
  }, [lesson?.bodyMarkdown, activeTab]);

  const scrollTo = useCallback((sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const sidebarSections = useMemo(() => {
    if (!lesson?.bodyMarkdown) return [];
    return extractSectionsFromMarkdown(lesson.bodyMarkdown);
  }, [lesson?.bodyMarkdown]);

  const progress = useMemo(() => {
    if (sidebarSections.length === 0) return 0;
    return Math.round((completedSections.size / sidebarSections.length) * 100);
  }, [completedSections, sidebarSections]);

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

  // ─── Check for interactive lesson override ───
  const interactiveKey = getInteractiveKey(lesson);
  if (interactiveKey) {
    const InteractiveComponent = INTERACTIVE_MAP[interactiveKey];
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="w-full pb-6">
          <Suspense fallback={
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
            </div>
          }>
            <InteractiveComponent lesson={lesson} lessonProgress={lessonProgress} />
          </Suspense>
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

  // Wrap markdown sections with IDs for scroll spy
  const wrapMarkdownWithSectionIds = (md: string): string => {
    if (!md) return "";
    // Replace each # §N heading with a heading that has an id
    return md.replace(
      /^#\s+§(\d+(?:\.\d+)?)\s+(.+)$/gm,
      (_match, num, title) => {
        const id = `sec-${num.replace(".", "-")}`;
        return `<div id="${id}" class="scroll-mt-32"></div>\n# §${num} ${title}`;
      }
    );
  };

  const wrappedPreMd = wrapMarkdownWithSectionIds(preInteractiveMd);
  const wrappedPostMd = wrapMarkdownWithSectionIds(postInteractiveMd);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* ═══════════════ HEADER ═══════════════ */}
      <div className="bg-white border-b border-amber-200/60">
        <div className="max-w-[1400px] mx-auto py-6">
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

              {/* English Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                {lesson.title}
              </h1>

              {/* Devanagari Title */}
              {lesson.titleDevanagari && (
                <p className="text-lg md:text-xl text-amber-700 font-medium mt-1 leading-tight">
                  {lesson.titleDevanagari}
                </p>
              )}

              {/* Subtitle */}
              {lesson.subtitle && (
                <p className="text-sm text-gray-500 mt-2 italic">
                  {lesson.subtitle}
                </p>
              )}

              {/* Enhanced Metadata Bar */}
              <div className="mt-3">
                <LessonMetadataBar
                  lessonType={lesson.lessonType}
                  bloomLevels={lesson.bloomLevels}
                  streams={lesson.streams}
                  streamNeutrality={lesson.streamNeutrality}
                  targetMinutesReading={lesson.targetMinutesReading}
                  targetMinutesTotal={lesson.targetMinutesTotal}
                  mcqCount={lesson.mcqCount || mcqCount}
                />
              </div>

              {/* Legacy Meta stats (kept for compatibility) */}
              <div className="flex items-center gap-4 mt-3 flex-wrap">
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {targetMinutes} min read
                </span>
                {mcqCount > 0 && (
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <FileQuestion className="w-4 h-4" /> {mcqCount} questions
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
        <div className="max-w-[1400px] mx-auto">
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
      <div className="max-w-[1400px] mx-auto py-8 pb-20">
        {/* ── Content Tab ── */}
        {activeTab === "content" && (
          <div className="flex gap-6">
            {/* Left Sidebar */}
            {sidebarSections.length > 0 && (
              <GenericLessonSidebar
                sections={sidebarSections}
                activeSection={activeSection}
                completedSections={completedSections}
                onNavigate={scrollTo}
                progress={progress}
                className="w-64 shrink-0 sticky top-20 self-start h-fit"
              />
            )}

            {/* Main reading column */}
            <div className="flex-1 min-w-0">
              {/* Prerequisites */}
              {lesson.prerequisites && lesson.prerequisites.length > 0 && (
                <div className="mb-6 bg-emerald-50/60 border border-emerald-200/60 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <GitBranch className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-wide">Prerequisites</h3>
                  </div>
                  <p className="text-xs text-emerald-700 mb-2">Complete these lessons before starting:</p>
                  <div className="flex flex-wrap gap-2">
                    {lesson.prerequisites.map((prereq, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-700 font-medium"
                      >
                        {prereq}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Learning outcomes */}
              {lesson.learningOutcomes && lesson.learningOutcomes.length > 0 && (
                <div className="mb-8 bg-amber-50/60 border border-amber-200/60 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    What You&apos;ll Learn
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {lesson.learningOutcomes.map((outcome: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-amber-50/50 hover:border-amber-200/50 transition-colors"
                      >
                        <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="text-sm text-gray-700 leading-relaxed">{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Main markdown content */}
              <article className="bg-white rounded-2xl border border-amber-200/60 shadow-sm p-6 md:p-8">
                {/* Pre-§7 content */}
                <MarkdownContent
                  content={wrappedPreMd}
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
                {wrappedPostMd && (
                  <MarkdownContent
                    content={wrappedPostMd}
                    className="lesson-markdown"
                  />
                )}
              </article>

              {/* Postrequisites / Next Lesson */}
              {lesson.postrequisites && lesson.postrequisites.length > 0 && (
                <div className="mt-6 p-6 bg-white rounded-2xl border-2 border-amber-200/60 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-amber-600 mb-1 font-medium">🎉 Lesson Complete!</p>
                      <p className="text-xl font-bold text-gray-900">Continue Your Journey</p>
                      <p className="text-sm text-gray-500 mt-1">Next lessons in this path:</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {lesson.postrequisites.map((postreq, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 font-medium"
                          >
                            {postreq}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Link
                      href="/learn"
                      className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors shadow-md shadow-amber-600/20 shrink-0"
                    >
                      Continue Learning
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <aside className="w-72 shrink-0 space-y-4 hidden xl:block">
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

              {/* Primary Sources */}
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

              {/* Modern Sources */}
              {lesson.modernSources && lesson.modernSources.length > 0 && (
                <div className="bg-white rounded-xl border border-sky-200/60 p-4 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                    Modern Sources
                  </h3>
                  <ul className="space-y-1.5">
                    {lesson.modernSources.map((src: {ref: string; note?: string}, idx: number) => (
                      <li key={idx} className="text-xs text-gray-600">
                        <span className="font-medium text-gray-800">{src.ref}</span>
                        {src.note && <span className="text-gray-400"> — {src.note}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Stream Info */}
              {lesson.streams && lesson.streams.length > 0 && (
                <div className="bg-white rounded-xl border border-amber-200/60 p-4 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-600" />
                    Astrological Streams
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {lesson.streamNeutrality ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        All Streams
                      </span>
                    ) : (
                      lesson.streams.map((stream) => (
                        <span
                          key={stream}
                          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200"
                        >
                          {stream}
                        </span>
                      ))
                    )}
                  </div>
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
              <InteractiveQuiz
                quiz={quiz}
                concepts={concepts}
                lessonId={id as string}
              />
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
