"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, BookOpen, GraduationCap, Sparkles,
  Layers, BrainCircuit, Target, ChevronRight,
  ScrollText, Lightbulb, CheckCircle2
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { learnApi, type Lesson } from "@/lib/api";
import ConceptCard from "@/components/learn/ConceptCard";
import InteractiveQuiz from "@/components/learn/InteractiveQuiz";
import LessonSection from "@/components/learn/LessonSection";

interface LessonSectionType {
  id: number;
  type: string;
  title: string;
  content: string;
}

interface Concept {
  id: number;
  title: string;
  description: string;
  icon?: string;
  keyTakeaway?: string;
  proTip?: string;
  commonMistake?: string;
}

type QuizQuestion =
  | { questionId: number; type: "multiple_choice"; question: string; options: Record<string, string>; correctAnswer: string; explanation: string; whyWrong?: Record<string, string>; conceptRef?: number; memoryAid?: string; hint?: string; difficulty?: string }
  | { questionId: number; type: "true_false"; question: string; correctAnswer: "true" | "false"; explanation: string; conceptRef?: number; memoryAid?: string; hint?: string; difficulty?: string }
  | { questionId: number; type: "matching"; question: string; pairs: { left: string; right: string }[]; conceptRef?: number; memoryAid?: string; difficulty?: string }
  | { questionId: number; type: "fill_blank"; question: string; correctAnswer: string; acceptableAnswers?: string[]; explanation: string; conceptRef?: number; memoryAid?: string; hint?: string; difficulty?: string }
  | { questionId: number; type: "case_study"; question: string; scenario: string; subQuestions: { questionId: number; question: string; options: Record<string, string>; correctAnswer: string; explanation: string; whyWrong?: Record<string, string> }[]; conceptRef?: number; memoryAid?: string; difficulty?: string };

interface LessonContent {
  intro: string;
  sections?: LessonSectionType[];
  concepts: Concept[];
  quiz: QuizQuestion[];
}

type TabType = "overview" | "sections" | "concepts" | "quiz";

export default function LessonPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());

  const overviewRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);
  const conceptsRef = useRef<HTMLDivElement>(null);
  const quizRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    learnApi.getLesson(id as string)
      .then((res: { success: boolean; data: Lesson }) => {
        if (res.success) setLesson(res.data);
      })
      .catch((err: Error) => console.error("Failed to fetch lesson:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const scrollToRef = (ref: React.RefObject<HTMLDivElement | null>, tab: TabType) => {
    setActiveTab(tab);
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const markSectionComplete = (sectionId: number) => {
    setCompletedSections(prev => new Set(prev).add(sectionId));
  };

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

  const content = lesson.contentJson as unknown as LessonContent;
  const hasSections = content.sections && content.sections.length > 0;
  const sectionProgress = hasSections ? Math.round((completedSections.size / content.sections!.length) * 100) : 0;

  const tabs: { id: TabType; label: string; icon: React.ElementType; ref: React.RefObject<HTMLDivElement | null> }[] = [
    { id: "overview", label: "Overview", icon: ScrollText, ref: overviewRef },
    ...(hasSections ? [{ id: "sections" as TabType, label: `Sections (${content.sections?.length})`, icon: Layers, ref: sectionsRef }] : []),
    { id: "concepts", label: `Concepts (${content.concepts.length})`, icon: Lightbulb, ref: conceptsRef },
    { id: "quiz", label: `Practice (${content.quiz.length})`, icon: BrainCircuit, ref: quizRef },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="mb-6">
        <Link href="/learn" className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-800 text-sm mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Learning Path
        </Link>
        <div className="flex items-center gap-2 mb-2">
          <GraduationCap className="w-5 h-5 text-amber-500" />
          <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Lesson {lesson.sequenceOrder}</span>
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
        <div className="space-y-4">
          {content.concepts.map((concept, idx) => (
            <ConceptCard key={concept.id} concept={concept} index={idx} />
          ))}
        </div>
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
        <InteractiveQuiz
          quiz={content.quiz}
          concepts={content.concepts}
          lessonId={id as string}
        />
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
