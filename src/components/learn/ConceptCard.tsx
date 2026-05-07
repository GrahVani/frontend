"use client";

import React, { useState } from "react";
import {
  Orbit, Moon, Calculator, ArrowUp, ArrowDown, Table, TrendingUp,
  Sparkles, ChevronDown, ChevronUp, Lightbulb, AlertTriangle,
  Compass, Sun, Flame, Triangle, EyeOff, Eye, Swords, GitBranch,
  Briefcase, Clock, Crown, Coins, MessageCircle, Grid, Clipboard,
  Heart, Gem, BookOpen, Layers, Glasses
} from "lucide-react";
import DynamicDiagram from "./DynamicDiagram";

const ICON_MAP: Record<string, React.ElementType> = {
  Orbit, Moon, Calculator, ArrowUp, ArrowDown, Table, TrendingUp,
  Compass, Sun, Flame, Triangle, EyeOff, Eye, Swords, GitBranch,
  Briefcase, Clock, Crown, Coins, MessageCircle, Grid, Clipboard,
  Heart, Gem, BookOpen, Layers, Glasses, Sparkles,
};

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

interface ConceptCardProps {
  concept: Concept;
  index: number;
  showDiagram?: boolean;
  showReference?: boolean;
}

/** Format concept description: parse markdown bold/italic and convert `* text` bullets to proper list items */
function formatConceptText(text: string): string {
  // Split by `* ` bullet markers and handle inline formatting
  const parts = text.split(/(?:^|\s)\*\s+/);
  if (parts.length > 1) {
    // First part is intro text (before any bullets), rest are bullet items
    const intro = parts[0].trim();
    const bullets = parts.slice(1).map(b => b.trim()).filter(Boolean);
    const introHtml = intro ? `<p>${formatInline(intro)}</p>` : '';
    const listHtml = bullets.length > 0
      ? `<ul style="list-style:disc;padding-left:1.25rem;margin-top:0.5rem">${bullets.map(b => `<li style="margin-bottom:0.25rem">${formatInline(b)}</li>`).join('')}</ul>`
      : '';
    return introHtml + listHtml;
  }
  return formatInline(text);
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*\*([^*]+)\*\*\*/g, '<strong>$1</strong>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

export default function ConceptCard({ concept, index, showDiagram = true, showReference = false }: ConceptCardProps) {
  const [expanded, setExpanded] = useState(false);
  const Icon = ICON_MAP[concept.icon || ""] || Sparkles;

  return (
    <div className="bg-white rounded-2xl border border-amber-200/60 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center shrink-0 border border-amber-200/50">
            <Icon className="w-6 h-6 text-amber-700" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                Concept {index + 1}
              </span>
            </div>
            <h3 className="text-lg font-bold text-amber-900">{concept.title}</h3>
          </div>
        </div>

        {/* Description */}
        <div className={`mt-4 text-amber-800 leading-relaxed ${expanded ? "" : "line-clamp-3"}`}
          dangerouslySetInnerHTML={{ __html: formatConceptText(concept.description) }}
        />

        {/* Expand/Collapse */}
        {concept.description.length > 150 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 text-sm font-medium text-amber-600 hover:text-amber-800 flex items-center gap-1 transition-colors"
          >
            {expanded ? (
              <>Show less <ChevronUp className="w-4 h-4" /></>
            ) : (
              <>Read more <ChevronDown className="w-4 h-4" /></>
            )}
          </button>
        )}

        {/* Key Takeaway */}
        {concept.keyTakeaway && (
          <div className="mt-4 p-3 bg-amber-50/80 rounded-xl border border-amber-100 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wide">Key Takeaway</span>
              <p className="text-sm text-amber-800 font-medium mt-0.5">{concept.keyTakeaway}</p>
            </div>
          </div>
        )}

        {/* Pro Tip */}
        {concept.proTip && (
          <div className="mt-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-green-700 uppercase tracking-wide">Pro Tip</span>
              <p className="text-sm text-green-900 mt-0.5">{concept.proTip}</p>
            </div>
          </div>
        )}

        {/* Common Mistake */}
        {concept.commonMistake && (
          <div className="mt-3 p-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-red-600 uppercase tracking-wide">Common Mistake</span>
              <p className="text-sm text-red-900 mt-0.5">{concept.commonMistake}</p>
            </div>
          </div>
        )}

        {/* Interactive Diagram — only if this concept uniquely owns it */}
        {showDiagram && concept.media?.type === "diagram" && concept.media.diagramType && (
          <div className="mt-5">
            <DynamicDiagram
              diagramType={concept.media.diagramType}
              title={concept.title}
              subtitle={concept.media.caption}
            />
          </div>
        )}

        {/* Diagram reference badge — shown when diagram is rendered in Visual Reference */}
        {showReference && !showDiagram && concept.media?.type === "diagram" && concept.media.diagramType && (
          <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
            <span>📊</span>
            <span>Explained in the visual reference above</span>
          </div>
        )}
      </div>
    </div>
  );
}
