"use client";

import React from "react";
import { Sparkles, HelpCircle, BookOpen, Lightbulb, Compass } from "lucide-react";

interface TutorQuickActionsProps {
  onSelectAction: (promptText: string) => void;
  disabled?: boolean;
  activeSectionTitle?: string;
  activeComponentType?: string;
}

export function TutorQuickActions({
  onSelectAction,
  disabled = false,
  activeSectionTitle,
  activeComponentType,
}: TutorQuickActionsProps) {
  const actions = [
    ...(activeComponentType
      ? [
          {
            label: `Explain ${activeComponentType}`,
            prompt: `Can you break down the active interactive diagram (${activeComponentType}) and explain how its controls connect to astrological calculation rules?`,
            icon: <HelpCircle className="w-3 h-3 text-amber-300" />,
            badge: "Diagram",
          },
        ]
      : []),
    ...(activeSectionTitle
      ? [
          {
            label: `Summarize Section`,
            prompt: `Can you give me a crisp 3-bullet summary and key takeaway for our active topic: "${activeSectionTitle}"?`,
            icon: <BookOpen className="w-3 h-3 text-amber-300" />,
          },
        ]
      : []),
    {
      label: "Give me an analogy",
      prompt: "Can you explain this Vedic astrological rule using a simple, relatable everyday analogy?",
      icon: <Lightbulb className="w-3 h-3 text-amber-300" />,
    },
    {
      label: "Test my grasp",
      prompt: "Give me a quick 1-question practice challenge based on what we just discussed to check my understanding.",
      icon: <Sparkles className="w-3 h-3 text-amber-300" />,
    },
    {
      label: "Why is this important?",
      prompt: "Why is this principle critical when interpreting horoscopes in real life?",
      icon: <Compass className="w-3 h-3 text-amber-300" />,
    },
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto py-1.5 px-1 scrollbar-thin scrollbar-thumb-amber-500/20 scrollbar-track-transparent">
      {actions.map((action, idx) => (
        <button
          key={idx}
          onClick={() => !disabled && onSelectAction(action.prompt)}
          disabled={disabled}
          type="button"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1C1611] border border-amber-500/20 hover:border-amber-400/50 text-[11px] font-medium text-stone-200 hover:text-amber-200 hover:bg-[#282018] transition-all shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {action.icon}
          <span>{action.label}</span>
          {action.badge && (
            <span className="px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] uppercase tracking-wider font-semibold">
              {action.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
