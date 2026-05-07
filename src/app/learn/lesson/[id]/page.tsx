"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, BookOpen, GraduationCap, Sparkles,
  Layers, BrainCircuit, Target, ChevronRight,
  ScrollText, Lightbulb, CheckCircle2, Eye, Lock, Play
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { learnApi, type Lesson, type LessonProgressData } from "@/lib/api";
import ConceptCard from "@/components/learn/ConceptCard";
import DynamicDiagram from "@/components/learn/DynamicDiagram";
import InteractiveQuiz from "@/components/learn/InteractiveQuiz";
import LessonSection, { type Section } from "@/components/learn/LessonSection";
import Lesson1Interactive from "@/components/learn/module1/Lesson1Interactive";
import Lesson2Interactive from "@/components/learn/module1/Lesson2Interactive";
import Lesson3Interactive from "@/components/learn/module1/Lesson3Interactive";
import Lesson4Interactive from "@/components/learn/module1/Lesson4Interactive";
import Lesson5Interactive from "@/components/learn/module2/Lesson5Interactive";
import Lesson6Interactive from "@/components/learn/module2/Lesson6Interactive";
import Lesson7Interactive from "@/components/learn/module2/Lesson7Interactive";

interface ConceptMedia {
  type: string;
  diagramType?: string;
  caption?: string;
}

interface Concept {
  id: number;
  title: string;
  description: string;
  icon?: string;
  keyTakeaway?: string;
  proTip?: string;
  commonMistake?: string;
  media?: ConceptMedia;
}

type QuizQuestion =
  | { questionId: number; type: "multiple_choice"; question: string; options: Record<string, string>; correctAnswer: string; explanation: string; whyWrong?: Record<string, string>; conceptRef?: number; memoryAid?: string; hint?: string; difficulty?: string }
  | { questionId: number; type: "true_false"; question: string; correctAnswer: "true" | "false"; explanation: string; conceptRef?: number; memoryAid?: string; hint?: string; difficulty?: string }
  | { questionId: number; type: "matching"; question: string; pairs: { left: string; right: string }[]; conceptRef?: number; memoryAid?: string; difficulty?: string }
  | { questionId: number; type: "fill_blank"; question: string; correctAnswer: string; acceptableAnswers?: string[]; explanation: string; conceptRef?: number; memoryAid?: string; hint?: string; difficulty?: string }
  | { questionId: number; type: "case_study"; question: string; scenario: string; subQuestions: { questionId: number; question: string; options: Record<string, string>; correctAnswer: string; explanation: string; whyWrong?: Record<string, string> }[]; conceptRef?: number; memoryAid?: string; difficulty?: string };

interface LessonContent {
  intro: string;
  sections?: Section[];
  concepts: Concept[];
  quiz: QuizQuestion[];
}

type TabType = "overview" | "sections" | "concepts" | "quiz";

export default function LessonPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [lessonProgress, setLessonProgress] = useState<LessonProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());

  const overviewRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);
  const conceptsRef = useRef<HTMLDivElement>(null);
  const quizRef = useRef<HTMLDivElement>(null);

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
          if (res.success) {
            setLessonProgress(res.data);
            if (res.data.sectionsViewed?.length > 0) {
              setCompletedSections(new Set(res.data.sectionsViewed));
            }
          }
        })
      );
    }

    Promise.all(promises)
      .catch((err: Error) => console.error("Failed to fetch lesson:", err))
      .finally(() => setLoading(false));
  }, [id, user]);

  const scrollToRef = (ref: React.RefObject<HTMLDivElement | null>, tab: TabType) => {
    setActiveTab(tab);
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const markSectionComplete = useCallback((sectionId: number) => {
    setCompletedSections(prev => {
      if (prev.has(sectionId)) return prev;
      const next = new Set(prev).add(sectionId);
      // Persist to backend if user is logged in
      if (user) {
        learnApi.trackSectionView(id as string, user.id, sectionId).catch((err: Error) => {
          console.error("Failed to track section view:", err);
        });
      }
      return next;
    });
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
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  // ─── Lesson 1 Interactive Experience ───
  const isLesson1 = lesson.sequenceOrder === 1 && lesson.title.includes("Celestial Geometry");
  if (isLesson1) {
    return <Lesson1Interactive lesson={lesson} lessonProgress={lessonProgress} />;
  }

  // ─── Lesson 2 Interactive Experience ───
  const isLesson2 = lesson.sequenceOrder === 2 && lesson.title.includes("Navagraha");
  if (isLesson2) {
    return <Lesson2Interactive lesson={lesson} lessonProgress={lessonProgress} />;
  }

  // ─── Lesson 3 Interactive Experience ───
  const isLesson3 = lesson.sequenceOrder === 3 && lesson.title.includes("Bhava");
  if (isLesson3) {
    return <Lesson3Interactive lesson={lesson} lessonProgress={lessonProgress} />;
  }

  // ─── Lesson 4 Interactive Experience ───
  const isLesson4 = lesson.sequenceOrder === 4 && lesson.title.includes("Nakshatra");
  if (isLesson4) {
    return <Lesson4Interactive lesson={lesson} lessonProgress={lessonProgress} />;
  }

  // ─── Module 2: Lesson 1 (Ayanamsa) Interactive Experience ───
  const isLesson5 = lesson.sequenceOrder === 1 && lesson.title.includes("Ayanamsa");
  if (isLesson5) {
    return <Lesson5Interactive lesson={lesson} lessonProgress={lessonProgress} />;
  }

  // ─── Module 2: Lesson 2 (Panchang) Interactive Experience ───
  const isLesson6 = lesson.sequenceOrder === 2 && lesson.title.includes("Panchang");
  if (isLesson6) {
    return <Lesson6Interactive lesson={lesson} lessonProgress={lessonProgress} />;
  }

  // ─── Module 2: Lesson 3 (Drishti) Interactive Experience ───
  const isLesson7 = lesson.sequenceOrder === 3 && lesson.title.includes("Drishti");
  if (isLesson7) {
    return <Lesson7Interactive lesson={lesson} lessonProgress={lessonProgress} />;
  }

  const content = lesson.contentJson as unknown as LessonContent;
  const hasSections = content.sections && content.sections.length > 0;
  const sectionProgress = hasSections ? Math.round((completedSections.size / content.sections!.length) * 100) : 0;

  const tabs: { id: TabType; label: string; icon: React.ElementType; ref: React.RefObject<HTMLDivElement | null> }[] = [
    { id: "overview", label: "Overview", icon: ScrollText, ref: overviewRef },
    ...(hasSections ? [{ id: "sections" as TabType, label: `Sections (${content.sections?.length})`, icon: Layers, ref: sectionsRef }] : []),
    { id: "concepts", label: `Concepts (${content.concepts.length})`, icon: Lightbulb, ref: conceptsRef },
    { id: "quiz", label: `Practice (${content.quiz.length})`, icon: BrainCircuit, ref: quizRef },
  ];

  const isLocked = lessonProgress?.status === "locked";
  const isCompleted = lessonProgress?.status === "completed";

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      {/* Header */}
      <div className="mb-6">
        <Link href="/learn" className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-800 text-sm mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Learning Path
        </Link>
        <div className="flex items-center gap-2 mb-2">
          <GraduationCap className="w-5 h-5 text-amber-500" />
          <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Lesson {lesson.sequenceOrder}</span>
          {isCompleted && (
            <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Completed
            </span>
          )}
          {isLocked && (
            <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Locked
            </span>
          )}
        </div>
        <h1 className="text-3xl font-bold text-amber-900">{lesson.title}</h1>
        {hasSections && (
          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1 h-2 bg-amber-100 rounded-full overflow-hidden max-w-[200px]">
              <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${sectionProgress}%` }} />
            </div>
            <span className="text-xs text-amber-600 font-medium">
              {completedSections.size}/{content.sections?.length} sections viewed
            </span>
            {lessonProgress && lessonProgress.bestScore > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                Best: {lessonProgress.bestScore}%
              </span>
            )}
          </div>
        )}
      </div>

      {/* Sub-Header Navigation */}
      <div className="sticky top-20 z-30 mb-8">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-amber-200/60 shadow-sm p-2">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => scrollToRef(tab.ref, tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-amber-600 text-white shadow-md"
                      : "text-amber-700 hover:bg-amber-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.id === "sections" && completedSections.size > 0 && (
                    <span className="ml-1 w-5 h-5 rounded-full bg-green-500 text-white text-[10px] flex items-center justify-center">
                      {completedSections.size}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Overview Section */}
      <div ref={overviewRef} className="mb-10 scroll-mt-32">
        <div className="flex items-center gap-2 mb-4">
          <ScrollText className="w-5 h-5 text-amber-600" />
          <h2 className="text-xl font-bold text-amber-900">Lesson Overview</h2>
        </div>
        <div className="bg-gradient-to-br from-amber-900 via-amber-800 to-orange-900 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-amber-300" />
            <span className="text-sm font-semibold text-amber-300 uppercase tracking-wide">Introduction</span>
          </div>
          <p className="text-amber-100 leading-relaxed text-lg">{content.intro}</p>

          {/* Lesson roadmap */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {hasSections && (
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <Layers className="w-5 h-5 text-amber-300 mx-auto mb-1" />
                <div className="text-lg font-bold">{content.sections?.length}</div>
                <div className="text-[10px] text-amber-300">Sections</div>
              </div>
            )}
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <Lightbulb className="w-5 h-5 text-amber-300 mx-auto mb-1" />
              <div className="text-lg font-bold">{content.concepts.length}</div>
              <div className="text-[10px] text-amber-300">Key Concepts</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <BrainCircuit className="w-5 h-5 text-amber-300 mx-auto mb-1" />
              <div className="text-lg font-bold">{content.quiz.length}</div>
              <div className="text-[10px] text-amber-300">Questions</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <Target className="w-5 h-5 text-amber-300 mx-auto mb-1" />
              <div className="text-lg font-bold">{content.quiz.filter(q => q.type === 'case_study').length}</div>
              <div className="text-[10px] text-amber-300">Case Studies</div>
            </div>
          </div>

          {/* Progress summary if data exists */}
          {lessonProgress && (
            <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <Target className="w-5 h-5 text-amber-300 mx-auto mb-1" />
                <div className="text-lg font-bold">{lessonProgress.score}%</div>
                <div className="text-[10px] text-amber-300">Current Score</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <BrainCircuit className="w-5 h-5 text-amber-300 mx-auto mb-1" />
                <div className="text-lg font-bold">{lessonProgress.attemptsCount}</div>
                <div className="text-[10px] text-amber-300">Attempts</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <CheckCircle2 className="w-5 h-5 text-amber-300 mx-auto mb-1" />
                <div className="text-lg font-bold">{lessonProgress.bestScore}%</div>
                <div className="text-[10px] text-amber-300">Best Score</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <Layers className="w-5 h-5 text-amber-300 mx-auto mb-1" />
                <div className="text-lg font-bold">{lessonProgress.sectionProgressPercentage}%</div>
                <div className="text-[10px] text-amber-300">Section Progress</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sections */}
      {hasSections && (
        <div ref={sectionsRef} className="mb-10 scroll-mt-32">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-amber-600" />
            <h2 className="text-xl font-bold text-amber-900">Detailed Sections</h2>
            <span className="ml-auto text-sm text-amber-500 font-medium">
              {content.sections?.length} parts
            </span>
          </div>
          <div className="space-y-4">
            {content.sections?.map((section, idx) => (
              <div
                key={section.id}
                onClick={() => markSectionComplete(section.id)}
                className="relative"
              >
                <LessonSection section={section} index={idx} />
                {completedSections.has(section.id) && (
                  <div className="absolute top-4 right-12">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Concepts */}
      <div ref={conceptsRef} className="mb-10 scroll-mt-32">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-amber-600" />
          <h2 className="text-xl font-bold text-amber-900">Key Concepts</h2>
          <span className="ml-auto text-sm text-amber-500 font-medium">
            {content.concepts.length} concepts
          </span>
        </div>

        {/* Compute diagram grouping once */}
        {(() => {
          const sectionDiagramTypes = new Set(
            (content.sections || []).map((s) => s.diagramType).filter(Boolean)
          );

          const conceptGroups = new Map<string, Concept[]>();
          content.concepts.forEach((c) => {
            const dt = c.media?.diagramType;
            if (!dt) return;
            if (!conceptGroups.has(dt)) conceptGroups.set(dt, []);
            conceptGroups.get(dt)!.push(c);
          });

          const sharedDiagrams = Array.from(conceptGroups.entries()).filter(
            ([dt, concepts]) => concepts.length > 1 && !sectionDiagramTypes.has(dt) && dt !== "concept-illustration"
          );

          const sharedDiagramTypes = new Set(sharedDiagrams.map(([dt]) => dt));

          return (
            <>
              {/* Visual Reference */}
              {sharedDiagrams.length > 0 && (
                <div className="mb-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200/60 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Eye className="w-4 h-4 text-amber-600" />
                    <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wide">Visual Reference</h3>
                    <span className="ml-auto text-xs text-amber-500 font-medium">
                      {sharedDiagrams.length} diagram{sharedDiagrams.length > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="space-y-6">
                    {sharedDiagrams.map(([dt, concepts]) => (
                      <div key={dt}>
                        <p className="text-xs text-amber-600 mb-2 font-medium">
                          Applies to:{" "}
                          {concepts.map((c) => c.title).join(", ")}
                        </p>
                        <DynamicDiagram diagramType={dt} title={concepts[0]?.title} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Concept Cards */}
              <div className="space-y-4">
                {content.concepts.map((concept, idx) => {
                  const dt = concept.media?.diagramType;
                  const showDiagram = !!dt && dt !== "concept-illustration" && !sectionDiagramTypes.has(dt) && (conceptGroups.get(dt)?.length ?? 0) <= 1;
                  const showReference = !!dt && sharedDiagramTypes.has(dt);
                  return (
                    <ConceptCard
                      key={concept.id}
                      concept={concept}
                      index={idx}
                      showDiagram={showDiagram}
                      showReference={showReference}
                    />
                  );
                })}
              </div>
            </>
          );
        })()}
      </div>

      {/* Quiz */}
      <div ref={quizRef} className="mb-10 scroll-mt-32">
        <div className="flex items-center gap-2 mb-4">
          <BrainCircuit className="w-5 h-5 text-amber-600" />
          <h2 className="text-xl font-bold text-amber-900">Test Your Knowledge</h2>
          <span className="ml-auto text-sm text-amber-500 font-medium">
            {content.quiz.length} questions
          </span>
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
        ) : (
          <InteractiveQuiz
            quiz={content.quiz}
            concepts={content.concepts}
            lessonId={id as string}
          />
        )}
      </div>

      {/* Next Lesson Navigation */}
      <div className="mt-12 p-6 bg-white rounded-2xl border border-amber-200/60 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-amber-600 mb-1">Ready for more?</p>
            <p className="text-lg font-bold text-amber-900">Continue your learning journey</p>
          </div>
          <Link
            href="/learn"
            className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors"
          >
            Back to Learning Path
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
