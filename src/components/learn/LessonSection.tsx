"use client";

import React, { useState } from "react";
import {
  BookOpen, Languages, Cog, Code, Lightbulb, ChevronDown, ChevronUp,
  Sparkles, Terminal, Binary, GitBranch, Eye, Zap
} from "lucide-react";

interface Section {
  id: number;
  type: string;
  title: string;
  content: string;
}

interface LessonSectionProps {
  section: Section;
  index: number;
}

const SECTION_STYLES: Record<string, {
  icon: React.ElementType;
  bg: string;
  border: string;
  titleColor: string;
  badge: string;
  badgeColor: string;
}> = {
  definition: {
    icon: BookOpen,
    bg: "bg-gradient-to-br from-blue-50 to-indigo-50",
    border: "border-blue-200",
    titleColor: "text-blue-900",
    badge: "DEFINITION",
    badgeColor: "bg-blue-100 text-blue-700",
  },
  etymology: {
    icon: Languages,
    bg: "bg-gradient-to-br from-purple-50 to-fuchsia-50",
    border: "border-purple-200",
    titleColor: "text-purple-900",
    badge: "ETYMOLOGY",
    badgeColor: "bg-purple-100 text-purple-700",
  },
  mechanics: {
    icon: Cog,
    bg: "bg-gradient-to-br from-amber-50 to-orange-50",
    border: "border-amber-200",
    titleColor: "text-amber-900",
    badge: "MECHANICS",
    badgeColor: "bg-amber-100 text-amber-700",
  },
  software_logic: {
    icon: Code,
    bg: "bg-gradient-to-br from-slate-50 to-gray-50",
    border: "border-slate-200",
    titleColor: "text-slate-900",
    badge: "SOFTWARE LOGIC",
    badgeColor: "bg-slate-200 text-slate-700",
  },
  content: {
    icon: Sparkles,
    bg: "bg-gradient-to-br from-emerald-50 to-teal-50",
    border: "border-emerald-200",
    titleColor: "text-emerald-900",
    badge: "CONCEPT",
    badgeColor: "bg-emerald-100 text-emerald-700",
  },
};

function formatContent(content: string): React.ReactNode {
  const lines = content.split("\\n").filter(l => l.trim());
  const elements: React.ReactNode[] = [];
  let inList = false;
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="space-y-2 my-3 ml-4">
          {listItems.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            </li>
          ))}
        </ul>
      );
      listItems = [];
      inList = false;
    }
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
      inList = true;
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
    <div className={`rounded-2xl border ${style.border} ${style.bg} overflow-hidden transition-all duration-300 hover:shadow-md`}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 flex items-start gap-4 text-left"
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${style.badgeColor.replace("text-", "bg-").replace("100", "200")}`}>
          <Icon className={`w-5 h-5 ${style.titleColor}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${style.badgeColor}`}>
              {style.badge}
            </span>
            <span className="text-xs text-gray-400">Section {index + 1}</span>
          </div>
          <h3 className={`text-base font-bold ${style.titleColor}`}>{section.title}</h3>
        </div>
        <div className="shrink-0 mt-1">
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>

      {/* Content */}
      {expanded && (
        <div className="px-5 pb-5 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="prose prose-amber max-w-none">
            {formatContent(section.content)}
          </div>

          {/* Interactive footer per section type */}
          {section.type === "software_logic" && (
            <div className="mt-4 p-3 bg-slate-800 rounded-xl">
              <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-wider mb-2">
                <Binary className="w-3 h-3" />
                Execution Flow
              </div>
              <div className="flex items-center gap-2 text-xs text-green-400 font-mono">
                <GitBranch className="w-3 h-3" />
                <span>IF condition_met THEN execute_prediction()</span>
              </div>
            </div>
          )}

          {section.type === "etymology" && (
            <div className="mt-4 p-3 bg-purple-100/50 rounded-xl border border-purple-200">
              <div className="flex items-center gap-2 text-[10px] text-purple-600 uppercase tracking-wider mb-1">
                <Languages className="w-3 h-3" />
                Sanskrit Root
              </div>
              <p className="text-sm text-purple-900 font-medium">
                Understanding the original Sanskrit deepens your intuitive grasp of this concept.
              </p>
            </div>
          )}

          {section.type === "mechanics" && (
            <div className="mt-4 p-3 bg-amber-100/50 rounded-xl border border-amber-200">
              <div className="flex items-center gap-2 text-[10px] text-amber-700 uppercase tracking-wider mb-1">
                <Zap className="w-3 h-3" />
                Pro Insight
              </div>
              <p className="text-sm text-amber-900 font-medium">
                This is the engine room. Master this section and your predictions become precise.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
