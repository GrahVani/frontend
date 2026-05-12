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
import Lesson8Interactive from "@/components/learn/module3/Lesson8Interactive";
import Lesson9Interactive from "@/components/learn/module3/Lesson9Interactive";
import Lesson10Interactive from "@/components/learn/module3/Lesson10Interactive";
import Lesson11Interactive from "@/components/learn/module3/Lesson11Interactive";
import Lesson12Interactive from "@/components/learn/module4/Lesson12Interactive";
import Lesson13Interactive from "@/components/learn/module4/Lesson13Interactive";
import Lesson14Interactive from "@/components/learn/module4/Lesson14Interactive";
import Lesson15Interactive from "@/components/learn/module4/Lesson15Interactive";
import Lesson16Interactive from "@/components/learn/module5/Lesson16Interactive";
import Lesson17Interactive from "@/components/learn/module5/Lesson17Interactive";
import Lesson18Interactive from "@/components/learn/module5/Lesson18Interactive";
import Lesson19Interactive from "@/components/learn/module6/Lesson19Interactive";
import Lesson20Interactive from "@/components/learn/module6/Lesson20Interactive";
import Lesson21Interactive from "@/components/learn/module6/Lesson21Interactive";
import Lesson22Interactive from "@/components/learn/module6/Lesson22Interactive";
import Lesson23Interactive from "@/components/learn/module7/Lesson23Interactive";
import Lesson24Interactive from "@/components/learn/module7/Lesson24Interactive";
import Lesson25Interactive from "@/components/learn/module7/Lesson25Interactive";
import Lesson26Interactive from "@/components/learn/module7/Lesson26Interactive";
import Lesson27Interactive from "@/components/learn/module8/Lesson27Interactive";
import Lesson28Interactive from "@/components/learn/module8/Lesson28Interactive";
import Lesson29Interactive from "@/components/learn/module8/Lesson29Interactive";
import Lesson30Interactive from "@/components/learn/module9/Lesson30Interactive";
import Lesson31Interactive from "@/components/learn/module9/Lesson31Interactive";
import Lesson32Interactive from "@/components/learn/module9/Lesson32Interactive";
import Lesson33Interactive from "@/components/learn/module9/Lesson33Interactive";
import Lesson34Interactive from "@/components/learn/module10/Lesson34Interactive";
import Lesson35Interactive from "@/components/learn/module10/Lesson35Interactive";
import Lesson36Interactive from "@/components/learn/module10/Lesson36Interactive";
import Lesson37Interactive from "@/components/learn/module11/Lesson37Interactive";
import Lesson38Interactive from "@/components/learn/module11/Lesson38Interactive";
import Lesson39Interactive from "@/components/learn/module11/Lesson39Interactive";
import Lesson40Interactive from "@/components/learn/module12/Lesson40Interactive";
import Lesson41Interactive from "@/components/learn/module12/Lesson41Interactive";
import Lesson42Interactive from "@/components/learn/module12/Lesson42Interactive";
import Lesson43Interactive from "@/components/learn/module13/Lesson43Interactive";
import Lesson44Interactive from "@/components/learn/module13/Lesson44Interactive";
import Lesson45Interactive from "@/components/learn/module13/Lesson45Interactive";

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

  // Emergency fallback: if title contains Panchang at any sequence, route to Lesson6
  if (lesson.title.toLowerCase().includes("panchang")) {
    return <Lesson6Interactive lesson={lesson} lessonProgress={lessonProgress} />;
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
  const isLesson3 = lesson.sequenceOrder === 3 && lesson.title.includes("12 Bhavas");
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
  const isLesson6 = Number(lesson.sequenceOrder) === 2 && lesson.title.toLowerCase().includes("panchang");
  if (isLesson6) {
    return <Lesson6Interactive lesson={lesson} lessonProgress={lessonProgress} />;
  }

  // ─── Module 2: Lesson 3 (Drishti) Interactive Experience ───
  const isLesson7 = lesson.sequenceOrder === 3 && lesson.title.includes("Drishti");
  if (isLesson7) {
    return <Lesson7Interactive lesson={lesson} lessonProgress={lessonProgress} />;
  }

  // ─── Module 3: Lesson 1 (Core Yogas) Interactive Experience ───
  const isLesson8 = lesson.sequenceOrder === 1 && lesson.title.includes("Yoga");
  if (isLesson8) {
    return <Lesson8Interactive lesson={lesson} lessonProgress={lessonProgress} />;
  }

  // ─── Module 3: Lesson 2 (Planetary Dignity & Avasthas) ───
  const isLesson9 = lesson.sequenceOrder === 2 && lesson.title.includes("Dignity");
  if (isLesson9) {
    return <Lesson9Interactive lesson={lesson} lessonProgress={lessonProgress} />;
  }

  // ─── Module 3: Lesson 3 (Bhavat Bhavam) ───
  const isLesson10 = lesson.sequenceOrder === 3 && lesson.title.includes("Bhavat");
  if (isLesson10) {
    return <Lesson10Interactive lesson={lesson} lessonProgress={lessonProgress} />;
  }

  // ─── Module 3: Lesson 4 (Trinity of Execution) ───
  const isLesson11 = lesson.sequenceOrder === 4 && lesson.title.includes("Trinity");
  if (isLesson11) {
    return <Lesson11Interactive lesson={lesson} lessonProgress={lessonProgress} />;
  }

  // ─── Module 4: Lesson 1 (Vimshottari Dasha) ───
  const isLesson12 = lesson.sequenceOrder === 1 && lesson.title.includes("Vimshottari");
  if (isLesson12) {
    return <Lesson12Interactive lesson={lesson} lessonProgress={lessonProgress} />;
  }

  // ─── Module 4: Lesson 2 (Gochara) ───
  const isLesson13 = lesson.sequenceOrder === 2 && lesson.title.includes("Gochara");
  if (isLesson13) {
    return <Lesson13Interactive lesson={lesson} lessonProgress={lessonProgress} />;
  }

  // ─── Module 4: Lesson 3 (Double Transit Theory) ───
  const isLesson14 = lesson.sequenceOrder === 3 && lesson.title.includes("Double");
  if (isLesson14) {
    return <Lesson14Interactive lesson={lesson} lessonProgress={lessonProgress} />;
  }

  // ─── Module 4: Lesson 4 (Dasha + Gochara Synthesis) ───
  const isLesson15 = lesson.sequenceOrder === 4 && lesson.title.includes("Synthesis");
  if (isLesson15) {
    return <Lesson15Interactive lesson={lesson} lessonProgress={lessonProgress} />;
  }

  // ─── Module 5: Lesson 1 (Varga Chakras) ───
  const isLesson16 = lesson.sequenceOrder === 1 && lesson.title.includes("Varga");
  if (isLesson16) {
    return <Lesson16Interactive lesson={lesson} lessonProgress={lessonProgress} />;
  }

  // ─── Module 5: Lesson 2 (Ashtakavarga) ───
  const isLesson17 = lesson.sequenceOrder === 2 && lesson.title.includes("Ashtakavarga");
  if (isLesson17) {
    return <Lesson17Interactive lesson={lesson} lessonProgress={lessonProgress} />;
  }

  // ─── Module 5: Lesson 3 (Shadbala) ───
  const isLesson18 = lesson.sequenceOrder === 3 && lesson.title.includes("Shadbala");
  if (isLesson18) {
    return <Lesson18Interactive lesson={lesson} lessonProgress={lessonProgress} />;
  }

  // ─── Module 6: Lesson 1 (Jaimini Sutras) ───
  const isLesson19 = lesson.sequenceOrder === 1 && lesson.title.includes("Jaimini");
  if (isLesson19) {
    return <Lesson19Interactive lesson={lesson} lessonProgress={lessonProgress} />;
  }

  // ─── Module 6: Lesson 2 (Krishnamurti Paddhati / KP System) ───
  const isLesson20 = lesson.sequenceOrder === 2 && lesson.title.includes("Krishnamurti");
  if (isLesson20) {
    return <Lesson20Interactive lesson={lesson} lessonProgress={lessonProgress} />;
  }

  // ─── Module 6: Lesson 3 (Tajik System / Varshaphala) ───
  const isLesson21 = lesson.sequenceOrder === 3 && lesson.title.includes("Varshaphala");
  if (isLesson21) {
    return <Lesson21Interactive lesson={lesson} lessonProgress={lessonProgress} />;
  }

  // ─── Module 6: Lesson 4 (Prashna Shastra / Horary) ───
  const isLesson22 = lesson.sequenceOrder === 4 && lesson.title.includes("Prashna");
  if (isLesson22) {
    return <Lesson22Interactive lesson={lesson} lessonProgress={lessonProgress} />;
  }

  // ─── Module 7: Lesson 1 (Muhurtha) ───
  const isLesson23 = lesson.sequenceOrder === 1 && lesson.title.includes("Muhurtha");
  if (isLesson23) {
    return <Lesson23Interactive lesson={lesson} lessonProgress={lessonProgress} />;
  }

  // ─── Module 7: Lesson 2 (Nama Nakshatra) ───
  const isLesson24 = lesson.sequenceOrder === 2 && lesson.title.includes("Nama");
  if (isLesson24) {
    return <Lesson24Interactive lesson={lesson} lessonProgress={lessonProgress} />;
  }

  // ─── Module 7: Lesson 3 (Synastry & Koota Milan) ───
  const isLesson25 = lesson.sequenceOrder === 3 && lesson.title.includes("Synastry");
  if (isLesson25) {
    return <Lesson25Interactive lesson={lesson} lessonProgress={lessonProgress} />;
  }

  // ─── Module 7: Lesson 4 (Astro-Remediation) ───
  const isLesson26 = lesson.sequenceOrder === 4 && lesson.title.includes("Remediation");
  if (isLesson26) {
    return <Lesson26Interactive lesson={lesson} lessonProgress={lessonProgress} />;
  }

  // ─── Module 8: Lesson 1 (Varsha Pravesh) ───
  const isLesson27 = lesson.sequenceOrder === 1 && lesson.title.includes("Varsha");
  if (isLesson27) {
    return <Lesson27Interactive lesson={lesson} lessonProgress={lessonProgress} />;
  }

  // ─── Module 8: Lesson 2 (Pancha Vargiya Bala) ───
  const isLesson28 = lesson.sequenceOrder === 2 && lesson.title.includes("Pancha");
  if (isLesson28) {
    return <Lesson28Interactive lesson={lesson} lessonProgress={lessonProgress} />;
  }

  // ─── Module 8: Lesson 3 (Tajik Yogas) ───
  const isLesson29 = lesson.sequenceOrder === 3 && lesson.title.includes("Yogas");
  if (isLesson29) {
    return <Lesson29Interactive lesson={lesson} lessonProgress={lessonProgress} />;
  }

  // ─── Module 9: Lesson 1 (Ratna Vidya) ───
  const isLesson30 = lesson.sequenceOrder === 1 && lesson.title.includes("Ratna");
  if (isLesson30) {
    return <Lesson30Interactive lesson={lesson} lessonProgress={lessonProgress} />;
  }

  // ─── Module 9: Lesson 2 (Mantra Shastra) ───
  const isLesson31 = lesson.sequenceOrder === 2 && lesson.title.includes("Mantra");
  if (isLesson31) {
    return <Lesson31Interactive lesson={lesson} lessonProgress={lessonProgress} />;
  }

  // ─── Module 9: Lesson 3 (Dana & Seva) ───
  const isLesson32 = lesson.sequenceOrder === 3 && lesson.title.includes("Dana");
  if (isLesson32) {
    return <Lesson32Interactive lesson={lesson} lessonProgress={lessonProgress} />;
  }

  // ─── Module 9: Lesson 4 (Yantra & Modern Anchors) ───
  const isLesson33 = lesson.sequenceOrder === 4 && lesson.title.includes("Yantra");
  if (isLesson33) {
    return <Lesson33Interactive lesson={lesson} lessonProgress={lessonProgress} />;
  }

  // ─── Module 10: Lesson 1 (Ayanamsa Variations) ───
  const isLesson34 = lesson.sequenceOrder === 1 && lesson.title.includes("Variations");
  if (isLesson34) {
    return <Lesson34Interactive lesson={lesson} lessonProgress={lessonProgress} />;
  }

  // ─── Module 10: Lesson 2 (Bridging Vedic & Western) ───
  const isLesson35 = lesson.sequenceOrder === 2 && lesson.title.includes("Bridging");
  if (isLesson35) {
    return <Lesson35Interactive lesson={lesson} lessonProgress={lessonProgress} />;
  }

  // ─── Module 10: Lesson 3 (The Master Dashboard) ───
  const isLesson36 = lesson.sequenceOrder === 3 && lesson.title.includes("Dashboard");
  if (isLesson36) {
    return <Lesson36Interactive lesson={lesson} lessonProgress={lessonProgress} />;
  }

  // ─── Module 11: Lesson 1 (Ashtottari Dasha) ───
  const isLesson37 = lesson.sequenceOrder === 1 && lesson.title.includes("Ashtottari");
  if (isLesson37) {
    return <Lesson37Interactive lesson={lesson} lessonProgress={lessonProgress} />;
  }

  // ─── Module 11: Lesson 2 (Yogini Dasha) ───
  const isLesson38 = lesson.sequenceOrder === 2 && lesson.title.includes("Yogini");
  if (isLesson38) {
    return <Lesson38Interactive lesson={lesson} lessonProgress={lessonProgress} />;
  }

  // ─── Module 11: Lesson 3 (Kalachakra Dasha) ───
  const isLesson39 = lesson.sequenceOrder === 3 && lesson.title.includes("Kalachakra");
  if (isLesson39) {
    return <Lesson39Interactive lesson={lesson} lessonProgress={lessonProgress} />;
  }

  // ─── Module 12: Lesson 1 (Baladi Avasthas) ───
  const isLesson40 = lesson.sequenceOrder === 1 && lesson.title.includes("Baladi");
  if (isLesson40) {
    return <Lesson40Interactive lesson={lesson} lessonProgress={lessonProgress} />;
  }

  // ─── Module 12: Lesson 2 (Lajjitadi Avasthas) ───
  const isLesson41 = lesson.sequenceOrder === 2 && lesson.title.includes("Lajjitadi");
  if (isLesson41) {
    return <Lesson41Interactive lesson={lesson} lessonProgress={lessonProgress} />;
  }

  // ─── Module 12: Lesson 3 (Neecha Bhanga) ───
  const isLesson42 = lesson.sequenceOrder === 3 && lesson.title.includes("Neecha Bhanga");
  if (isLesson42) {
    return <Lesson42Interactive lesson={lesson} lessonProgress={lessonProgress} />;
  }

  // ─── Module 13: Lesson 1 (Bhavat Bhavam) ───
  const isLesson43 = lesson.sequenceOrder === 1 && lesson.title.includes("Bhavat Bhavam");
  if (isLesson43) {
    return <Lesson43Interactive lesson={lesson} lessonProgress={lessonProgress} />;
  }

  // ─── Module 13: Lesson 2 (Dispositor Theory) ───
  const isLesson44 = lesson.sequenceOrder === 2 && lesson.title.includes("Dispositor");
  if (isLesson44) {
    return <Lesson44Interactive lesson={lesson} lessonProgress={lessonProgress} />;
  }

  // ─── Module 13: Lesson 3 (Karako Bhava Nashaya) ───
  const isLesson45 = lesson.sequenceOrder === 3 && lesson.title.includes("Karako Bhava");
  if (isLesson45) {
    return <Lesson45Interactive lesson={lesson} lessonProgress={lessonProgress} />;
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
        <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
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
      <div ref={overviewRef} className="mb-6 scroll-mt-32">
        <div className="flex items-center gap-2 mb-4">
          <ScrollText className="w-5 h-5 text-amber-600" />
          <h2 className="text-xl font-bold text-gray-900">Lesson Overview</h2>
        </div>
        <div className="bg-white border border-amber-200/80 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-semibold text-amber-600 uppercase tracking-wide">Introduction</span>
          </div>
          <p className="text-gray-700 leading-relaxed text-lg">{content.intro}</p>

          {/* Lesson roadmap */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {hasSections && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center border border-amber-200">
                <Layers className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                <div className="text-lg font-bold text-gray-900">{content.sections?.length}</div>
                <div className="text-[10px] text-amber-600">Sections</div>
              </div>
            )}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center border border-amber-200">
              <Lightbulb className="w-5 h-5 text-amber-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-gray-900">{content.concepts.length}</div>
              <div className="text-[10px] text-amber-600">Key Concepts</div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center border border-amber-200">
              <BrainCircuit className="w-5 h-5 text-amber-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-gray-900">{content.quiz.length}</div>
              <div className="text-[10px] text-amber-600">Questions</div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center border border-amber-200">
              <Target className="w-5 h-5 text-amber-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-gray-900">{content.quiz.filter(q => q.type === 'case_study').length}</div>
              <div className="text-[10px] text-amber-600">Case Studies</div>
            </div>
          </div>

          {/* Progress summary if data exists */}
          {lessonProgress && (
            <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center border border-amber-200">
                <Target className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                <div className="text-lg font-bold text-gray-900">{lessonProgress.score}%</div>
                <div className="text-[10px] text-amber-600">Current Score</div>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center border border-amber-200">
                <BrainCircuit className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                <div className="text-lg font-bold text-gray-900">{lessonProgress.attemptsCount}</div>
                <div className="text-[10px] text-amber-600">Attempts</div>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center border border-amber-200">
                <CheckCircle2 className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                <div className="text-lg font-bold text-gray-900">{lessonProgress.bestScore}%</div>
                <div className="text-[10px] text-amber-600">Best Score</div>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center border border-amber-200">
                <Layers className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                <div className="text-lg font-bold text-gray-900">{lessonProgress.sectionProgressPercentage}%</div>
                <div className="text-[10px] text-amber-600">Section Progress</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sections */}
      {hasSections && (
        <div ref={sectionsRef} className="mb-6 scroll-mt-32">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-amber-600" />
            <h2 className="text-xl font-bold text-gray-900">Detailed Sections</h2>
            <span className="ml-auto text-sm text-gray-500 font-medium">
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
      <div ref={conceptsRef} className="mb-6 scroll-mt-32">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-amber-600" />
          <h2 className="text-xl font-bold text-gray-900">Key Concepts</h2>
          <span className="ml-auto text-sm text-gray-500 font-medium">
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
                <div className="mb-6 bg-white rounded-2xl border border-amber-200/60 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Eye className="w-4 h-4 text-amber-600" />
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Visual Reference</h3>
                    <span className="ml-auto text-xs text-amber-600 font-medium">
                      {sharedDiagrams.length} diagram{sharedDiagrams.length > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="space-y-6">
                    {sharedDiagrams.map(([dt, concepts]) => (
                      <div key={dt}>
                        <p className="text-xs text-gray-500 mb-2 font-medium">
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
      <div ref={quizRef} className="mb-6 scroll-mt-32">
        <div className="flex items-center gap-2 mb-4">
          <BrainCircuit className="w-5 h-5 text-amber-600" />
          <h2 className="text-xl font-bold text-gray-900">Test Your Knowledge</h2>
          <span className="ml-auto text-sm text-gray-500 font-medium">
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
            <p className="text-lg font-bold text-gray-900">Continue your learning journey</p>
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
