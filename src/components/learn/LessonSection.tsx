"use client";

import React, { useState } from "react";
import {
  BookOpen, Languages, Cog, Code, Lightbulb, ChevronDown, ChevronUp,
  Sparkles, Terminal, Binary, GitBranch, Zap, Compass, HelpCircle
} from "lucide-react";
import DynamicDiagram from "./DynamicDiagram";
import TTSButton from "./interactive/TTSButton";
import ForwardReferenceBanner, { type ForwardReference } from "./interactive/ForwardReferenceBanner";
import AnticipatedQuestions, { type AnticipatedQuestion } from "./interactive/AnticipatedQuestions";

export interface Section {
  id: number;
  type: string;
  title: string;
  content: string;
  diagramType?: string;
  forwardReference?: ForwardReference;
  practicalUsage?: string;
  anticipatedQuestions?: AnticipatedQuestion[];
}

interface LessonSectionProps {
  section: Section;
  index: number;
}

const SECTION_STYLES: Record<string, {
  icon: React.ElementType;
  bg: string;
  border: string;
  leftBorder: string;
  titleColor: string;
  badge: string;
  badgeColor: string;
  iconBg: string;
  iconColor: string;
}> = {
  definition: {
    icon: BookOpen,
    bg: "bg-white",
    border: "border-amber-200/60",
    leftBorder: "border-l-blue-500",
    titleColor: "text-amber-900",
    badge: "DEFINITION",
    badgeColor: "bg-blue-50 text-blue-700",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-700",
  },
  etymology: {
    icon: Languages,
    bg: "bg-white",
    border: "border-amber-200/60",
    leftBorder: "border-l-purple-500",
    titleColor: "text-amber-900",
    badge: "ETYMOLOGY",
    badgeColor: "bg-purple-50 text-purple-700",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-700",
  },
  mechanics: {
    icon: Cog,
    bg: "bg-white",
    border: "border-amber-200/60",
    leftBorder: "border-l-amber-500",
    titleColor: "text-amber-900",
    badge: "MECHANICS",
    badgeColor: "bg-amber-50 text-amber-700",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-700",
  },
  software_logic: {
    icon: Code,
    bg: "bg-white",
    border: "border-amber-200/60",
    leftBorder: "border-l-slate-500",
    titleColor: "text-amber-900",
    badge: "SOFTWARE LOGIC",
    badgeColor: "bg-slate-100 text-slate-700",
    iconBg: "bg-slate-200",
    iconColor: "text-slate-700",
  },
  content: {
    icon: Sparkles,
    bg: "bg-white",
    border: "border-amber-200/60",
    leftBorder: "border-l-emerald-500",
    titleColor: "text-amber-900",
    badge: "CONCEPT",
    badgeColor: "bg-emerald-50 text-emerald-700",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-700",
  },
  practical_application: {
    icon: Compass,
    bg: "bg-white",
    border: "border-amber-200/60",
    leftBorder: "border-l-cyan-500",
    titleColor: "text-amber-900",
    badge: "PRACTICAL USE",
    badgeColor: "bg-cyan-50 text-cyan-700",
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-700",
  },
  context_builder: {
    icon: HelpCircle,
    bg: "bg-white",
    border: "border-amber-200/60",
    leftBorder: "border-l-violet-500",
    titleColor: "text-amber-900",
    badge: "WHY THIS MATTERS",
    badgeColor: "bg-violet-50 text-violet-700",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-700",
  },
  important_note: {
    icon: Lightbulb,
    bg: "bg-white",
    border: "border-amber-200/60",
    leftBorder: "border-l-amber-500",
    titleColor: "text-amber-900",
    badge: "IMPORTANT NOTE",
    badgeColor: "bg-amber-50 text-amber-700",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-700",
  },
  algorithm: {
    icon: Terminal,
    bg: "bg-white",
    border: "border-indigo-200/60",
    leftBorder: "border-l-indigo-500",
    titleColor: "text-indigo-900",
    badge: "ALGORITHM",
    badgeColor: "bg-indigo-50 text-indigo-700",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-700",
  },
  logic_gate: {
    icon: Binary,
    bg: "bg-white",
    border: "border-violet-200/60",
    leftBorder: "border-l-violet-500",
    titleColor: "text-violet-900",
    badge: "LOGIC GATE",
    badgeColor: "bg-violet-50 text-violet-700",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-700",
  },
  case_debug: {
    icon: Code,
    bg: "bg-white",
    border: "border-slate-200/60",
    leftBorder: "border-l-slate-500",
    titleColor: "text-slate-900",
    badge: "DEBUG CASE",
    badgeColor: "bg-slate-100 text-slate-700",
    iconBg: "bg-slate-200",
    iconColor: "text-slate-700",
  },
  synthesis: {
    icon: GitBranch,
    bg: "bg-white",
    border: "border-amber-200/60",
    leftBorder: "border-l-amber-500",
    titleColor: "text-amber-900",
    badge: "SYNTHESIS",
    badgeColor: "bg-amber-50 text-amber-700",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-700",
  },
  exception_handler: {
    icon: Zap,
    bg: "bg-white",
    border: "border-teal-200/60",
    leftBorder: "border-l-teal-500",
    titleColor: "text-teal-900",
    badge: "EXCEPTION",
    badgeColor: "bg-teal-50 text-teal-700",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-700",
  },
  chain_trace: {
    icon: GitBranch,
    bg: "bg-white",
    border: "border-cyan-200/60",
    leftBorder: "border-l-cyan-500",
    titleColor: "text-cyan-900",
    badge: "CHAIN TRACE",
    badgeColor: "bg-cyan-50 text-cyan-700",
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-700",
  },
};

function formatContent(content: string): React.ReactNode {
  const lines = content.split("\n").filter(l => l.trim());
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    const validItems = listItems.filter(item => item.trim());
    if (validItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="space-y-2 my-3 ml-4">
          {validItems.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            </li>
          ))}
        </ul>
      );
    }
    listItems = [];
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Code-like blocks (indented or containing algorithm keywords)
    if (trimmed.startsWith("* **") && (trimmed.includes("Algorithm") || trimmed.includes("Logic") || trimmed.includes("IF") || trimmed.includes("THEN"))) {
      flushList();
      elements.push(
        <div key={`algo-${idx}`} className="my-3 p-3 bg-slate-900 rounded-lg font-mono text-xs text-green-400 overflow-x-auto">
          <div className="flex items-center gap-2 mb-2 text-slate-400 text-[10px] uppercase tracking-wider">
            <Terminal className="w-3 h-3" />
            Algorithm
          </div>
          <div dangerouslySetInnerHTML={{ __html: formatInline(trimmed).replace(/\*\*/g, "").replace(/\*/g, "› ") }} />
        </div>
      );
      return;
    }

    // Bullet points
    if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      listItems.push(trimmed.substring(2));
      return;
    }

    flushList();

    // Sub-headers within content
    if (trimmed.startsWith("**") && trimmed.endsWith("**") && trimmed.length < 80) {
      elements.push(
        <h4 key={`h4-${idx}`} className="text-sm font-bold text-amber-800 mt-4 mb-2">
          {trimmed.replace(/\*\*/g, "")}
        </h4>
      );
      return;
    }

    // Empty separator
    if (trimmed === "***") {
      elements.push(<hr key={`sep-${idx}`} className="my-4 border-amber-100" />);
      return;
    }

    // Regular paragraph
    if (trimmed) {
      elements.push(
        <p key={`p-${idx}`} className="text-sm text-gray-700 leading-relaxed my-2"
          dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }} />
      );
    }
  });

  flushList();
  return elements;
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*\*([^*]+)\*\*\*/g, '<strong class="text-amber-800">$1</strong>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-amber-900">$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em class="text-amber-700">$1</em>');
}

export default function LessonSection({ section, index }: LessonSectionProps) {
  const [expanded, setExpanded] = useState(true);
  const style = SECTION_STYLES[section.type] || SECTION_STYLES.content;
  const Icon = style.icon;

  return (
    <div className={`rounded-2xl border border-l-4 ${style.border} ${style.leftBorder} ${style.bg} overflow-hidden transition-all duration-300 hover:shadow-md`}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 flex items-start gap-4 text-left"
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${style.iconBg}`}>
          <Icon className={`w-5 h-5 ${style.iconColor}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${style.badgeColor}`}>
              {style.badge}
            </span>
            <span className="text-xs text-gray-500">Section {index + 1}</span>
          </div>
          <h3 className="text-base font-bold text-amber-900">{section.title}</h3>
        </div>
        <div className="shrink-0 mt-1">
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </div>
      </button>

      {/* Content */}
      {expanded && (
        <div className="px-5 pb-5 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* TTS & Header Actions */}
          <div className="flex items-center justify-between mb-3">
            <TTSButton text={`${section.title}. ${section.content}`} size="sm" />
          </div>

          <div className="prose prose-amber max-w-none">
            {formatContent(section.content)}
          </div>

          {/* Forward Reference Banner */}
          {section.forwardReference && (
            <ForwardReferenceBanner
              reference={section.forwardReference}
              className="mt-4"
            />
          )}

          {/* Practical Usage */}
          {section.practicalUsage && (
            <div className="mt-4 p-3.5 bg-cyan-50/60 rounded-xl border border-cyan-200">
              <div className="flex items-center gap-2 text-[10px] text-cyan-700 uppercase tracking-wider mb-1">
                <Compass className="w-3 h-3" />
                Practical Application
              </div>
              <p className="text-sm text-cyan-900 font-medium leading-relaxed">
                {section.practicalUsage}
              </p>
            </div>
          )}

          {/* Anticipated Questions */}
          {section.anticipatedQuestions && section.anticipatedQuestions.length > 0 && (
            <div className="mt-4">
              <AnticipatedQuestions
                questions={section.anticipatedQuestions}
                title="Clarifying Notes"
              />
            </div>
          )}

          {/* Interactive Diagram */}
          {section.diagramType && (
            <DynamicDiagram
              diagramType={section.diagramType}
              title={section.title}
            />
          )}

          {/* Interactive footer per section type */}
          {section.type === "software_logic" && (
            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 border-l-4 border-l-slate-500">
              <div className="flex items-center gap-2 text-[10px] text-slate-600 uppercase tracking-wider mb-2">
                <Binary className="w-3 h-3" />
                Execution Flow
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700 font-mono">
                <GitBranch className="w-3 h-3" />
                <span>IF condition_met THEN execute_prediction()</span>
              </div>
            </div>
          )}

          {section.type === "etymology" && (
            <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-200 border-l-4 border-l-purple-500">
              <div className="flex items-center gap-2 text-[10px] text-purple-700 uppercase tracking-wider mb-1">
                <Languages className="w-3 h-3" />
                Sanskrit Root
              </div>
              <p className="text-sm text-gray-800 font-medium">
                Understanding the original Sanskrit deepens your intuitive grasp of this concept.
              </p>
            </div>
          )}

          {section.type === "mechanics" && (
            <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-200 border-l-4 border-l-amber-500">
              <div className="flex items-center gap-2 text-[10px] text-amber-700 uppercase tracking-wider mb-1">
                <Zap className="w-3 h-3" />
                Pro Insight
              </div>
              <p className="text-sm text-gray-800 font-medium">
                This is the engine room. Master this section and your predictions become precise.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
