"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, AlertTriangle, Lightbulb, BookOpen, Eye, Quote,
  Sparkles, Brain, Rocket, Star, Shield, Zap, CheckCircle2,
  Clock, GitCompare, ScrollText, Tag, ArrowRight, Layers, Circle,
  type LucideIcon,
} from "lucide-react";
import type {
  ParsedPrerequisite,
  ParsedVedanga,
  ParsedMetaphor,
  ParsedComparison,
  ParsedSloka,
  ParsedWorkedExample,
  ParsedMistake,
  ParsedCitations,
} from "@/lib/lesson-parser";
import { learningTokens, resolveTextColor } from "@/design-tokens";

const fade = { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-40px" as `${number}px` }, transition: { duration: 0.45 } };

/**
 * InlineMarkdown — renders inline markdown (*italic*, **bold**, `code`) as React elements.
 * Handles nesting: **bold *italic* text** works correctly.
 * Replaces the old `fmt()` HTML-string approach for safety + nesting support.
 */
function InlineMarkdown({ text, className = "" }: { text: string; className?: string }) {
  return <span className={className}>{renderMarkdownNodes(text)}</span>;
}

function renderMarkdownNodes(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const pattern = /(\*\*[\s\S]*?\*\*|\*[\s\S]*?\*|`[\s\S]*?`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    const start = match.index;
    const full = match[1];

    if (start > lastIndex) {
      nodes.push(<span key={key++}>{text.slice(lastIndex, start)}</span>);
    }

    if (full.startsWith("**") && full.endsWith("**") && full.length >= 4) {
      const inner = full.slice(2, -2);
      nodes.push(
        <strong key={key++} className="font-bold text-black">
          {renderMarkdownNodes(inner)}
        </strong>
      );
    } else if (full.startsWith("`") && full.endsWith("`") && full.length >= 2) {
      nodes.push(
        <code key={key++} className="text-[#1565C0] bg-[#E3F2FD] px-1 py-0.5 rounded border border-[#BBDEFB]/60 text-[11px] font-mono">
          {full.slice(1, -1)}
        </code>
      );
    } else if (full.startsWith("*") && full.endsWith("*") && full.length >= 2 && !full.startsWith("**")) {
      const inner = full.slice(1, -1);
      nodes.push(
        <span key={key++} className="text-black font-medium">
          {renderMarkdownNodes(inner)}
        </span>
      );
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(<span key={key++}>{text.slice(lastIndex)}</span>);
  }
  if (nodes.length === 0) {
    nodes.push(<span key={key++}>{text}</span>);
  }
  return nodes;
}

/** HTML-string version for chaining with additional regex replacements (e.g. Sanskrit badges). */
function renderMarkdownToHtml(text: string): string {
  return text
    .replace(/\*\*([\s\S]*?)\*\*/g, '<strong class="font-bold text-black">$1</strong>')
    .replace(/`([^`]+)`/g, '<span class="font-medium text-black">$1</span>')
    .replace(/(?<!\*)\*(?!\*)([^*]+)\*(?!\*)/g, '<span class="font-medium text-black">$1</span>');
}

// ─── Reusable Atoms ───────────────────────────────────────────
type CalloutVariant = "insight" | "remember" | "pro-tip" | "key-takeaway" | "common-mistake" | "fun-fact";

const CALLOUT_CONFIG: Record<CalloutVariant, { icon: LucideIcon; label: string; border: string; bg: string; iconBg: string; iconColor: string; titleColor: string }> = {
  "insight": { icon: Lightbulb, label: "Key Insight", border: "border-l-[#C9A24D]", bg: "bg-[#FFF3E0]/70", iconBg: "bg-[#FFE0B2]", iconColor: "text-[#EF6C00]", titleColor: "text-[#795548]" },
  "remember": { icon: Brain, label: "Remember This", border: "border-l-[#1565C0]", bg: "bg-[#E3F2FD]/70", iconBg: "bg-[#BBDEFB]", iconColor: "text-[#1976D2]", titleColor: "text-[#1565C0]" },
  "pro-tip": { icon: Rocket, label: "Pro Tip", border: "border-l-[#2D6A4F]", bg: "bg-[#E8F5E9]/70", iconBg: "bg-[#A2CBA5]/50", iconColor: "text-[#2E7D32]", titleColor: "text-[#1E4620]" },
  "key-takeaway": { icon: Star, label: "Key Takeaway", border: "border-l-violet-600", bg: "bg-violet-50/70", iconBg: "bg-violet-100", iconColor: "text-violet-700", titleColor: "text-violet-800" },
  "common-mistake": { icon: Shield, label: "Common Mistake", border: "border-l-[#9B2C2C]", bg: "bg-[#FFEBEE]/70", iconBg: "bg-[#FFCDD2]/60", iconColor: "text-[#D32F2F]", titleColor: "text-[#C62828]" },
  "fun-fact": { icon: Sparkles, label: "Did You Know?", border: "border-l-cyan-600", bg: "bg-cyan-50/70", iconBg: "bg-cyan-100", iconColor: "text-cyan-700", titleColor: "text-cyan-800" },
};

export function InsightCallout({ variant, title, children }: { variant: CalloutVariant; title?: string; children: React.ReactNode }) {
  const c = CALLOUT_CONFIG[variant];
  const Icon = c.icon;
  return (
    <motion.div {...fade} className={`rounded-xl border border-[#E7D6B8]/50 border-l-4 ${c.border} ${c.bg} p-4`}>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${c.iconBg}`}><Icon className={`w-4 h-4 ${c.iconColor}`} /></div>
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${c.titleColor}`}>{title || c.label}</p>
          <div className="text-sm text-black leading-relaxed">{children}</div>
        </div>
      </div>
    </motion.div>
  );
}

function SectionDivider() {
  return <div className="flex items-center gap-3 py-2"><div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#E7D6B8]/80 to-transparent" /><Sparkles className="w-3 h-3 text-[#C9A24D]/60" /><div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#E7D6B8]/80 to-transparent" /></div>;
}

// ─── §1 Hook — Opening Question (Interactive) ────────────────
export function HookSection({ hookText }: { hookText: string }) {
  const [revealed, setRevealed] = React.useState(false);

  // Split into question sentences (ending with ?) and answer sentences
  const sentences = hookText.split(/(?<=[.!?])\s+/).filter(Boolean);
  const questions = sentences.filter((s) => s.trim().endsWith("?"));
  const answers = sentences.filter((s) => !s.trim().endsWith("?"));

  // Extract key terms for badge pills
  const terms = [
    { label: "Vedanga", color: "bg-[#FFF3E0] text-[#795548] border-[#FFE0B2]" },
    { label: "Jyotisha", color: "bg-[#FFF3E0] text-[#795548] border-[#FFE0B2]" },
    { label: "Vedanta", color: "bg-[#E3F2FD] text-[#1565C0] border-[#BBDEFB]" },
    { label: "Veda", color: "bg-violet-50 text-violet-700 border-violet-200" },
  ].filter((t) => hookText.includes(t.label) || hookText.includes(t.label.replace(/sh/g, "s").replace(/ng/g, "n")));

  return (
    <motion.div {...fade} className="relative overflow-hidden rounded-2xl border border-[#E7D6B8] bg-white shadow-sm p-6 sm:p-8">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A24D]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      {/* Badge */}
      <div className="flex items-center gap-2 mb-5">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF3E0] border border-[#FFE0B2]">
          <Eye className="w-3.5 h-3.5 text-[#EF6C00]" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-black">Opening Question</span>
        </span>
        {terms.map((t) => (
          <span key={t.label} className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${t.color}`}>
            {t.label}
          </span>
        ))}
      </div>

      {/* Question — prominent */}
      <div className="relative space-y-3">
        {questions.map((q, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            className="flex items-start gap-3 p-4 bg-white rounded-xl border border-[#E65100]/60 shadow-sm"
          >
            <div className="w-7 h-7 rounded-full bg-[#FAEFD8] flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xs font-bold text-black">{i + 1}</span>
            </div>
            <p className="text-black leading-relaxed text-[15px] sm:text-base font-bold"><InlineMarkdown text={q} /></p>
          </motion.div>
        ))}
      </div>

      {/* Reveal Answer Button */}
      {!revealed && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setRevealed(true)}
          className={learningTokens.components.buttons.primary + " mt-5 w-full"}
        >
          <Lightbulb className="w-4 h-4" />
          Reveal the Answer
        </motion.button>
      )}

      {/* Answer — animated in */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden"
          >
            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-px bg-[#E7D6B8]" />
                <span className="text-xs font-bold uppercase tracking-wider text-black bg-[#FFF3E0] px-2 py-0.5 rounded-full">The Answer</span>
                <div className="flex-1 h-px bg-[#E7D6B8]" />
              </div>
              {answers.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12 }}
                  className="flex items-start gap-3 p-4 bg-white rounded-xl border border-[#E65100]/60 shadow-sm"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-black flex items-center justify-center shrink-0 text-xs font-bold">
                    {String.fromCharCode(65 + i)}
                  </div>
                  <p className="text-sm font-semibold text-black leading-relaxed"><InlineMarkdown text={a} /></p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom accent */}
      <div className="mt-5 flex items-center gap-2 text-black">
        <div className="flex-1 h-px bg-[#E7D6B8]" />
        <span className="text-xs font-medium">{revealed ? "Onward we go..." : "Let's find out..."}</span>
        <div className="flex-1 h-px bg-[#E7D6B8]" />
      </div>
    </motion.div>
  );
}

// ─── §2 Prerequisites — Interactive Checklist ────────────────
export function PrereqSection({ prerequisites }: { prerequisites: ParsedPrerequisite[] }) {
  return (
    <motion.div {...fade} className="bg-white rounded-2xl border border-[#E7D6B8] shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center border border-emerald-200/50">
            <BookOpen className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <h2 className="text-base font-bold text-black">What You Should Know First</h2>
            <p className="text-xs text-black mt-0.5">Quick background checklist</p>
          </div>
        </div>
      </div>

      {/* Checklist Items */}
      <div className="px-5 pb-5 space-y-2.5">
        <p className="text-sm text-black mb-2 font-medium">This is the first lesson — no prerequisites within Grahvani. From outside:</p>
        {prerequisites.map((p, i) => {
          return (
            <div
              key={i}
              className="w-full flex items-start gap-3 p-4 rounded-xl border border-[#E7D6B8] bg-white"
            >
              <div className="flex-1">
                <p className="text-[15px] sm:text-base font-bold text-black">
                  {p.title}
                </p>
                {p.detail && <p className="text-sm font-medium text-black mt-1.5 leading-relaxed">{p.detail}</p>}
              </div>
            </div>
          );
        })}

        <InsightCallout variant="pro-tip" title="No Stress!">
          <span>You do <strong>not</strong> need any Sanskrit grammar, computational skills, or familiarity with classical Indian texts to start.</span>
        </InsightCallout>
      </div>
    </motion.div>
  );
}

// ─── §3 The Six Vedangas — Card Grid ─────────────────────────
export function VedangaTableSection({ vedangaTable }: { vedangaTable: ParsedVedanga[] }) {
  return (
    <motion.div {...fade} className="space-y-4">
      <div className="bg-white rounded-2xl border border-[#E7D6B8] shadow-sm p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-[#FAEFD8] flex items-center justify-center"><BookOpen className="w-4 h-4 text-[#8B5A2B]" /></div>
          <h2 className="text-lg font-bold text-black">The Six Vedangas</h2>
        </div>
        <p className="text-[15px] sm:text-base text-black mb-5 ml-[42px] font-medium leading-relaxed">The Veda required six supporting disciplines &mdash; the Vedangas, &ldquo;limbs of the Veda.&rdquo; They are not part of the Veda; they are supporting infrastructure.</p>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {vedangaTable.map((v) => (
            <div
              key={v.num}
              className={`relative rounded-xl border-l-4 border bg-white p-4 transition-all hover:shadow-md ${v.highlight ? "border-[#C9A24D] bg-[#FFF3E0]/40 ring-1 ring-[#C9A24D]/30" : "border-[#E7D6B8]"}`}
              style={{ borderLeftColor: v.color }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">{v.bodyIcon}</span>
                <div>
                  <span className="font-extrabold text-base" style={{ color: v.color }}>{v.name}</span>
                  {v.highlight && <span className="ml-2 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-[#FFF3E0] text-black border border-[#FFE0B2]">This Lesson</span>}
                </div>
              </div>
              <p className="text-sm text-black mb-1 font-bold">{v.bodyPart}</p>
              <p className="text-sm text-black leading-relaxed font-medium">{v.function}</p>
            </div>
          ))}
        </div>
      </div>

      <InsightCallout variant="insight">
        <span>The original purpose of Jyotisa was <strong>time-keeping for ritual</strong>. Astrology applications — natal charts, prediction — developed from this foundation.</span>
      </InsightCallout>
    </motion.div>
  );
}

// ─── §4 Why "The Eye" — Focused Visual ────────────────────────
export function WhyEyeSection({ bodyMetaphors }: { bodyMetaphors: ParsedMetaphor[] }) {
  const eyeMetaphor = bodyMetaphors.find((m) => m.highlight);
  return (
    <motion.div {...fade} className="space-y-4">
      <div className="bg-white rounded-2xl border border-[#E7D6B8] shadow-sm p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#FAEFD8] flex items-center justify-center"><Eye className="w-4 h-4 text-[#8B5A2B]" /></div>
          <h2 className="text-lg font-bold text-black">Why Jyotisa Is &ldquo;The Eye&rdquo;</h2>
        </div>

        {/* Central Eye Concept */}
        <div className="relative bg-gradient-to-br from-[#FEFAEA] via-[#FAEFD8]/60 to-[#FFF3E0]/30 rounded-2xl border border-[#E7D6B8] p-5 sm:p-6 mb-4 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A24D]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="flex flex-col sm:flex-row items-center gap-4 relative">
            <div className="w-16 h-16 rounded-2xl bg-[#FFF3E0] border-2 border-[#FFE0B2] flex items-center justify-center shrink-0">
              <span className="text-3xl">👁️</span>
            </div>
            <div className="text-center sm:text-left flex-1">
              <h3 className="text-base font-bold text-black mb-1">Jyotisa = The Eye (Caksuh)</h3>
              <p className="text-sm sm:text-[15px] text-black font-normal leading-relaxed">
                The Veda, imagined as a cosmic body, needs an <strong>eye to see time</strong>. Jyotisa provides that sight — determining <em>when</em> rituals must be performed.
              </p>
            </div>
          </div>
        </div>

        {/* Three-point explanation */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex flex-col items-center text-center p-4 rounded-xl bg-[#FEFAEA] border border-[#E7D6B8]">
            <div className="w-10 h-10 rounded-xl bg-[#E3F2FD] flex items-center justify-center mb-2"><Sparkles className="w-5 h-5 text-[#1976D2]" /></div>
            <p className="text-sm font-extrabold text-black mb-1.5">What it sees</p>
            <p className="text-sm text-black font-normal leading-relaxed">Muhurtas, tithis, nakshatras — the right time for every ritual</p>
          </div>
          <div className="flex flex-col items-center text-center p-4 rounded-xl bg-[#FEFAEA] border border-[#E7D6B8]">
            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center mb-2"><Zap className="w-5 h-5 text-violet-600" /></div>
            <p className="text-sm font-extrabold text-black mb-1.5">Why it matters</p>
            <p className="text-sm text-black font-normal leading-relaxed">Without correct timing, rituals lose their efficacy — the body is blind</p>
          </div>
          <div className="flex flex-col items-center text-center p-4 rounded-xl bg-[#FEFAEA] border border-[#E7D6B8]">
            <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] flex items-center justify-center mb-2"><Rocket className="w-5 h-5 text-[#2E7D32]" /></div>
            <p className="text-sm font-extrabold text-black mb-1.5">What grew from it</p>
            <p className="text-sm text-black font-normal leading-relaxed">Natal charts, predictions, and horoscopy all evolved from this timing science</p>
          </div>
        </div>
      </div>

      <InsightCallout variant="key-takeaway" title="The Eye = Temporal Vision">
        <span>Jyotisa is the discipline that lets the tradition <em>see time</em>. Everything else — natal charts, predictions — is application of this temporal-vision discipline.</span>
      </InsightCallout>
    </motion.div>
  );
}

// ─── §5 Vedanga vs Vedanta — Don't Confuse! ──────────────────
export function VsVedantaSection({ comparison }: { comparison: ParsedComparison }) {
  const { vedanga: va, vedanta: vt } = comparison;
  return (
    <motion.div {...fade} className="space-y-4">
      <div className="bg-white rounded-2xl border border-[#E7D6B8] shadow-sm p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-[#FFF3E0] flex items-center justify-center"><Shield className="w-4 h-4 text-[#EF6C00]" /></div>
          <h2 className="text-lg font-bold text-black">Vedanga vs Vedanta</h2>
          <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#FFEBEE] text-[#C62828] border border-[#FFCDD2]">Don&apos;t Confuse!</span>
        </div>
        <p className="text-sm text-black mb-4 ml-[42px] font-normal leading-relaxed">Two Sanskrit words that look almost identical but mean completely different things:</p>

        {/* Comparison cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[va, vt].map((item) => (
            <div key={item.term} className="rounded-xl border-2 p-4" style={{ borderColor: item.color + "40", background: item.color + "08" }}>
              <h3 className="font-extrabold mb-2 text-base" style={{ color: item.color }}>{item.term}</h3>
              <div className="space-y-2 text-sm text-black">
                <div><span className="font-extrabold">Means:</span> <span className="font-normal">{item.meaning}</span></div>
                <div><span className="font-extrabold">What:</span> <span className="font-normal">{item.what}</span></div>
                <div><span className="font-extrabold">Relation:</span> <span className="font-normal">{item.relation}</span></div>
                <div className="pt-2 border-t" style={{ borderColor: item.color + "20" }}><span className="font-extrabold">Example:</span> <span className="font-normal">{item.example}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <InsightCallout variant="common-mistake" title="Critical Distinction">
        <span><strong>Jyotisa is Vedanga, not Vedanta.</strong> A Vedanta scholar is not (by virtue of that scholarship) a Jyotisa scholar, and vice versa.</span>
      </InsightCallout>
    </motion.div>
  );
}

// ─── §6 Non-coverage — Scope Boundary ────────────────────────
export function NonCoverageSection({ items }: { items: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div {...fade} className="bg-white rounded-2xl border border-[#E7D6B8] shadow-sm overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 text-left hover:bg-[#FEFAEA] transition-colors">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FFF3E0] flex items-center justify-center"><AlertTriangle className="w-4 h-4 text-[#EF6C00]" /></div>
          <h2 className="text-lg font-bold text-black">What This Lesson Does NOT Teach</h2>
        </div>
        <ChevronDown className={`w-4 h-4 text-[#C9A24D] transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-[#E7D6B8]/50 pt-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
          {items.map((item, i) => (
            <div key={i} className="flex gap-3 items-start p-3 rounded-xl bg-[#FFF3E0]/30 border border-[#FFE0B2]/60">
              <span className="w-5 h-5 rounded-full bg-[#FFE0B2] flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-black text-xs font-bold">✕</span>
              </span>
              <p className="text-sm sm:text-base text-black leading-relaxed"><InlineMarkdown text={item} /></p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─── §7 Classical Slokas — Authority Anchoring ───────────────
export function SlokasSection({ slokas }: { slokas: ParsedSloka[] }) {
  return (
    <motion.div {...fade} className="space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[#FAEFD8] flex items-center justify-center"><Quote className="w-4 h-4 text-[#8B5A2B]" /></div>
        <h2 className="text-lg font-bold text-black">Classical Slokas</h2>
        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#FFF3E0] text-[#795548] border border-[#FFE0B2]">Source Texts</span>
      </div>
      {slokas.map((s) => (
        <div key={s.id} className="bg-white rounded-2xl border border-[#E7D6B8] shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-[#FEFAEA] to-[#FAEFD8] px-5 py-3 border-b border-[#E7D6B8]">
            <p className="text-xs font-bold text-black uppercase tracking-wide">{s.authority}</p>
          </div>
          <div className="p-5 space-y-4">
            {/* Devanagari — sacred Sanskrit text */}
            {s.devanagari && (
              <div className="bg-gradient-to-br from-[#FEFAEA] to-[#FAEFD8]/40 rounded-xl p-4 border border-[#E7D6B8]/60">
                <p className="text-[10px] font-bold text-[#795548] uppercase mb-2 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded bg-[#FFE0B2] flex items-center justify-center text-[8px] text-[#795548] font-bold">सं</span>
                  Devanagari (देवनागरी)
                </p>
                <p className="text-black text-[17px] sm:text-lg leading-relaxed whitespace-pre-line font-medium" style={{ fontFamily: '"Tiro Devanagari Hindi", serif' }}>
                  {s.devanagari}
                </p>
              </div>
            )}
            {/* IAST Transliteration */}
            <div>
              <p className="text-[10px] font-bold text-[#5C3D26] uppercase mb-1">IAST Transliteration</p>
              <p className="text-black font-medium text-[15px] sm:text-base leading-relaxed whitespace-pre-line">{s.iast}</p>
            </div>
            {/* English Translation */}
            <div className="bg-[#FFF3E0]/30 border border-[#FFE0B2] rounded-xl p-3">
              <p className="text-[10px] font-bold text-[#795548] uppercase mb-1">English{s.source ? ` (${s.source})` : ""}</p>
              <p className="text-[15px] sm:text-base font-medium text-black leading-relaxed"><InlineMarkdown text={s.english} /></p>
            </div>
            {/* Commentary */}
            {s.commentary && (
              <div className="border-t border-[#E7D6B8]/30 pt-3">
                <p className="text-[10px] font-bold text-[#5C3D26] uppercase mb-1">Commentary</p>
                <p className="text-sm sm:text-[15px] font-medium text-black leading-relaxed"><InlineMarkdown text={s.commentary} /></p>
              </div>
            )}
          </div>
        </div>
      ))}
    </motion.div>
  );
}

// ─── §8 Worked Examples — Practice Recognitions ──────────────
export function WorkedExamplesSection({ examples }: { examples: ParsedWorkedExample[] }) {
  return (
    <motion.div {...fade} className="bg-white rounded-2xl border border-[#E7D6B8] shadow-sm p-5 sm:p-6">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-[#E8F5E9] flex items-center justify-center border border-[#A2CBA5]/50"><Zap className="w-4 h-4 text-[#2E7D32]" /></div>
        <h2 className="text-lg font-bold text-black">Worked Recognitions</h2>
        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#1E4620] border border-[#A2CBA5]">Try This</span>
      </div>
      <div className="space-y-3">
        {examples.map((ex, i) => (
          <div key={i} className="rounded-xl border-l-4 border border-[#E7D6B8] bg-[#FEFAEA]/80 p-4" style={{ borderLeftColor: "#C9A24D" }}>
            <div className="flex items-start gap-2.5 mb-2">
              <span className="w-6 h-6 rounded-full bg-[#C9A24D] text-[#1A0A05] flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
              <h3 className="text-[15px] sm:text-base font-bold text-black">{ex.title}</h3>
            </div>
            {ex.scenario && (
              <p className="text-sm text-black mb-2 font-medium ml-[34px]"><InlineMarkdown text={ex.scenario} /></p>
            )}
            {ex.analysis && ex.analysis !== ex.scenario && (
              <p className="text-sm text-black font-medium leading-relaxed ml-[34px]"><InlineMarkdown text={ex.analysis} /></p>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Common Mistakes — Watch Out! ────────────────────────────
export function MistakesSection({ mistakes }: { mistakes: ParsedMistake[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <motion.div {...fade} className="space-y-3">
      <div className="flex items-center gap-2.5 mb-1">
        <div className="w-8 h-8 rounded-lg bg-[#FFEBEE] flex items-center justify-center border border-[#FFCDD2]/50"><Shield className="w-4 h-4 text-[#D32F2F]" /></div>
        <h2 className="text-lg font-bold text-black">Common Mistakes</h2>
        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#FFEBEE] text-[#C62828] border border-[#FFCDD2]">Watch Out</span>
      </div>
      {mistakes.map((m, i) => (
        <div key={i} className="bg-white rounded-xl border border-[#FFCDD2] overflow-hidden shadow-sm">
          <button onClick={() => setOpenIdx(openIdx === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left hover:bg-[#FFEBEE]/20 transition-colors">
            <span className="text-[15px] sm:text-base font-bold text-black flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#D32F2F] shrink-0" />
              <InlineMarkdown text={m.title} />
            </span>
            <ChevronDown className={`w-4 h-4 text-[#C62828] transition-transform duration-300 ${openIdx === i ? "rotate-180" : ""}`} />
          </button>
          {openIdx === i && (
            <div className="px-4 pb-4 border-t border-[#FFCDD2]/30 pt-3 space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="p-2.5 rounded-lg bg-[#FFEBEE]/50 border border-[#FFCDD2]"><p className="text-[10px] font-extrabold text-[#C62828] uppercase mb-0.5">What happens</p><p className="text-sm font-medium text-black leading-relaxed"><InlineMarkdown text={m.what} /></p></div>
              <div className="p-2.5 rounded-lg bg-[#FFF3E0]/50 border border-[#FFE0B2]"><p className="text-[10px] font-extrabold text-[#795548] uppercase mb-0.5">Why it happens</p><p className="text-sm font-medium text-black leading-relaxed"><InlineMarkdown text={m.why} /></p></div>
              <div className="p-2.5 rounded-lg bg-[#E8F5E9] border border-[#A2CBA5]"><p className="text-[10px] font-extrabold text-[#1E4620] uppercase mb-0.5">How to avoid</p><p className="text-sm font-medium text-black leading-relaxed"><InlineMarkdown text={m.fix} /></p></div>
            </div>
          )}
        </div>
      ))}
    </motion.div>
  );
}

// ─── §9 Things to Remember — Interactive Memory Anchors ──────

const MEMORY_CARD_META: { keywords: string[]; icon: LucideIcon; color: string; lightColor: string; borderColor: string; label: string }[] = [
  { keywords: ["Vedangas", "Shiksha", "Kalpa", "Vyakarana", "Nirukta", "Chandas", "six"], icon: Layers, color: "text-[#8B5A2B]", lightColor: "bg-[#FFF3E0]", borderColor: "border-[#FFE0B2]", label: "Framework" },
  { keywords: ["eye", "cakshuh", "caksuh", "blind", "sees"], icon: Eye, color: "text-violet-700", lightColor: "bg-violet-50", borderColor: "border-violet-200", label: "Metaphor" },
  { keywords: ["Vedanta", "culmination", "≠", "not the same"], icon: GitCompare, color: "text-[#C62828]", lightColor: "bg-[#FFEBEE]", borderColor: "border-[#FFCDD2]", label: "Distinction" },
  { keywords: ["ritual", "time-keeping", "Lagadha", "original", "foundation"], icon: Clock, color: "text-[#2E7D32]", lightColor: "bg-[#E8F5E9]", borderColor: "border-[#A2CBA5]", label: "Origin" },
  { keywords: ["Shiksha", "Paniniya", "shloka", "canonical", "source", "verse"], icon: ScrollText, color: "text-[#1565C0]", lightColor: "bg-[#E3F2FD]", borderColor: "border-[#BBDEFB]", label: "Source" },
];

function detectMemoryCardMeta(text: string) {
  const lower = text.toLowerCase();
  for (const meta of MEMORY_CARD_META) {
    if (meta.keywords.some((k) => lower.includes(k.toLowerCase()))) return meta;
  }
  return { icon: Brain, color: "text-indigo-700", lightColor: "bg-indigo-50", borderColor: "border-indigo-200", label: "Memory" };
}

function MemoryCard({ item, index }: { item: string; index: number }) {
  const meta = detectMemoryCardMeta(item);
  const Icon = meta.icon;

  // Extract Sanskrit terms as inline badges
  const formatted = renderMarkdownToHtml(item);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.1 }}
      className="relative rounded-xl border p-3.5 transition-all duration-300 bg-white border-[#E7D6B8] hover:shadow-sm"
    >
      {/* Horizontal layout: Icon | Content */}
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${meta.lightColor}`}>
          <Icon className={`w-4 h-4 ${meta.color}`} />
        </div>
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${meta.lightColor} ${meta.color} ${meta.borderColor}`}>
              {meta.label}
            </span>
          </div>
          <p className="text-[15px] sm:text-base leading-relaxed font-medium text-black" dangerouslySetInnerHTML={{ __html: formatted }} />
        </div>
      </div>

      {/* Decorative left accent bar */}
      <div className={`absolute left-0 top-2.5 bottom-2.5 w-1 rounded-full ${meta.lightColor.replace("bg-", "bg-").replace("50", "300")}`} />
    </motion.div>
  );
}

export function RememberSection({ items }: { items: string[] }) {
  return (
    <motion.div {...fade} className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#E3F2FD] flex items-center justify-center border border-[#BBDEFB]/50"><Brain className="w-4 h-4 text-[#1976D2]" /></div>
          <div>
            <h2 className="text-lg font-bold text-black">Things to Remember</h2>
            <p className="text-sm text-black font-semibold">Click &quot;Got it!&quot; as you memorize each anchor</p>
          </div>
        </div>
        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200">Memory Anchors</span>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((item, i) => (
          <MemoryCard key={i} item={item} index={i} />
        ))}
      </div>
    </motion.div>
  );
}

// ─── §11 Summary — 90-Second Recap (Visual) ─────────────────

export interface RecapInsight {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
  badgeColor?: "amber" | "blue" | "red" | "green" | "violet" | "indigo";
  highlight?: boolean;
}

function RecapInsightCard({ insight, index }: { insight: RecapInsight; index: number }) {
  const Icon = insight.icon;
  const badgeColorMap: Record<string, string> = {
    amber: "bg-[#FFF3E0] text-[#795548] border-[#FFE0B2]",
    blue: "bg-[#E3F2FD] text-[#1565C0] border-[#BBDEFB]",
    red: "bg-[#FFEBEE] text-[#C62828] border-[#FFCDD2]",
    green: "bg-[#E8F5E9] text-[#1E4620] border-[#A2CBA5]",
    violet: "bg-violet-100 text-violet-700 border-violet-200",
    indigo: "bg-indigo-100 text-indigo-700 border-indigo-200",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      className={`relative rounded-xl border p-4 transition-all hover:shadow-md group cursor-default ${insight.highlight
        ? "bg-gradient-to-br from-[#FEFAEA] to-[#FAEFD8]/60 border-[#C9A24D] ring-1 ring-[#C9A24D]/30"
        : "bg-white border-[#E7D6B8] hover:border-[#C9A24D]"
        }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${insight.highlight ? "bg-[#FFF3E0]" : "bg-gray-100 group-hover:bg-[#FAEFD8]"
          }`}>
          <Icon className={`w-4 h-4 ${insight.highlight ? "text-[#EF6C00]" : "text-gray-600 group-hover:text-[#8B5A2B]"}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <h4 className="text-[15px] sm:text-base font-bold text-black">{insight.title}</h4>
            {insight.badge && (
              <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full border ${badgeColorMap[insight.badgeColor || "amber"]}`}>
                {insight.badge}
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-black leading-relaxed">{insight.description}</p>
        </div>
      </div>
    </motion.div>
  );
}

/** Auto-extract insights from plain summary text */
function extractInsightsFromText(paragraphs: string[]): RecapInsight[] {
  const text = paragraphs.join(" ");
  const insights: RecapInsight[] = [];

  if (text.match(/six\s+Vedangas?|Vedangas?|Shiksha.*Kalpa/i)) {
    insights.push({
      icon: Layers,
      title: "Six Vedangas",
      description: "Jyotisha is one of six supporting disciplines — the limbs of the Veda.",
      badge: "Foundation",
      badgeColor: "amber",
    });
  }
  if (text.match(/eye\s+of\s+the\s+Veda|cakshuh|Caksuh|sees\s+time/i)) {
    insights.push({
      icon: Eye,
      title: "Eye of the Veda",
      description: "Jyotisha provides temporal vision — 'vedasya cakshuh' means the tradition sees time.",
      badge: "Core Metaphor",
      badgeColor: "violet",
      highlight: true,
    });
  }
  if (text.match(/ritual[\s-]timing|time.keeping|kala.vidhana|right\s+time/i)) {
    insights.push({
      icon: Clock,
      title: "Ritual Timing",
      description: "Original purpose: determine the correct moment for Vedic rituals to retain efficacy.",
      badge: "Origin",
      badgeColor: "green",
    });
  }
  if (text.match(/Vedanga\s*≠\s*Vedanta|Don.t\s+Confuse|confusion|philosophical\s+culmination/i)) {
    insights.push({
      icon: GitCompare,
      title: "Vedanga ≠ Vedanta",
      description: "Vedanga = 6 supporting tools. Vedanta = philosophical culmination (Upanishadic).",
      badge: "Critical",
      badgeColor: "red",
    });
  }
  if (text.match(/Vedanga\s+Jyotisa|Lagadha|Paniniya\s+Shiksha|canonical\s+shloka/i)) {
    insights.push({
      icon: ScrollText,
      title: "Source Texts",
      description: "Paniniya Shiksha 41-42 & Vedanga Jyotisha (Lagadha) anchor this framework.",
      badge: "Classical",
      badgeColor: "blue",
    });
  }
  if (insights.length === 0) {
    insights.push({
      icon: Sparkles,
      title: "Key Takeaway",
      description: "Review the full summary below to lock in the main ideas from this lesson.",
      badge: "Review",
      badgeColor: "amber",
      highlight: true,
    });
  }
  return insights.slice(0, 6);
}

/** Highlight Sanskrit terms and key phrases */
function formatRecapText(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '<span class="font-bold text-black">$1</span>')
    .replace(/\*([^*]+)\*/g, '<span class="font-medium text-black">$1</span>')
    .replace(/`([^`]+)`/g, '<span class="font-medium text-black">$1</span>')
    .replace(/(Vedanga|Vedanga)\s*≠\s*(Vedanta|Vedanta)/g, '<span class="font-medium text-black">$1 ≠ $2</span>');
}

export function SummarySection({ paragraphs, insights }: { paragraphs: string[]; insights?: RecapInsight[] }) {
  const [showFullText, setShowFullText] = React.useState(false);
  const derivedInsights = insights?.length ? insights : extractInsightsFromText(paragraphs);

  return (
    <motion.div {...fade} className="space-y-4">
      <div className="bg-white rounded-2xl border border-[#E7D6B8] shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FAEFD8] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#8B5A2B]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-black">90-Second Recap</h2>
              <p className="text-sm font-semibold text-black">Key takeaways from this lesson</p>
            </div>
          </div>
          <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#FFF3E0] text-[#795548] border border-[#FFE0B2]">
            Quick Review
          </span>
        </div>

        {/* Visual Insights Grid */}
        <div className="px-5 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {derivedInsights.map((insight, i) => (
              <RecapInsightCard key={i} insight={insight} index={i} />
            ))}
          </div>
        </div>

        {/* Expandable Full Summary */}
        <div className="mt-4 border-t border-[#E7D6B8]/30">
          <button
            onClick={() => setShowFullText(!showFullText)}
            className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-[#8B5A2B] hover:text-[#2D2419] hover:bg-[#FAEFD8]/40 transition-colors"
          >
            {showFullText ? (
              <>Show less <ChevronDown className="w-4 h-4 rotate-180" /></>
            ) : (
              <>Read full summary <ChevronDown className="w-4 h-4" /></>
            )}
          </button>

          <AnimatePresence>
            {showFullText && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-5 sm:px-6 pb-5 space-y-4">
                  {paragraphs.map((p, i) => (
                    <div key={i} className="relative pl-4 border-l-2 border-[#E7D6B8]">
                      <p
                        className="text-[15px] sm:text-base font-medium text-black leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: formatRecapText(p) }}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ─── §12 Citations — Further Reading ─────────────────────────
const CITATION_META: Record<string, { label: string; icon: LucideIcon; color: string; bg: string; border: string; accent: string }> = {
  primary: { label: "Primary Classical Sources", icon: ScrollText, color: "text-[#8B5A2B]", bg: "bg-[#FFF3E0]", border: "border-[#FFE0B2]", accent: "bg-[#C9A24D]" },
  modern: { label: "Modern Translations", icon: BookOpen, color: "text-[#1565C0]", bg: "bg-[#E3F2FD]", border: "border-[#BBDEFB]", accent: "bg-[#1976D2]" },
  further: { label: "Going Deeper (Optional)", icon: Star, color: "text-violet-800", bg: "bg-violet-50", border: "border-violet-200", accent: "bg-violet-400" },
};

export function CitationsSection({ citations }: { citations: ParsedCitations }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div {...fade} className="bg-white rounded-2xl border border-[#E7D6B8] shadow-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-[#FEFAEA]/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FAEFD8] flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-[#8B5A2B]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-black">Citations &amp; Further Reading</h2>
            <p className="text-sm font-semibold text-black">Primary sources, translations &amp; next lessons</p>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-[#C9A24D] transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="px-4 pb-5 border-t border-[#E7D6B8]/40 pt-4 space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Primary / Modern / Further */}
          {(["primary", "modern", "further"] as const).map((key) => {
            const meta = CITATION_META[key];
            const Icon = meta.icon;
            return (
              <div key={key}>
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${meta.bg} ${meta.border} border mb-2.5`}>
                  <Icon className={`w-3.5 h-3.5 ${meta.color}`} />
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${meta.color}`}>{meta.label}</span>
                </div>
                <div className="space-y-2">
                  {citations[key].map((c, i) => (
                    <div
                      key={i}
                      className="relative pl-3 pr-3 py-2.5 rounded-xl bg-[#FEFAEA]/40 border border-[#E7D6B8]/40 hover:bg-[#FEFAEA] hover:border-[#C9A24D]/50 transition-colors"
                    >
                      <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-full ${meta.accent}`} />
                      <p className="text-[15px] sm:text-base font-bold text-black">{c.ref}</p>
                      {c.note && <p className="text-sm font-medium text-black mt-0.5 leading-relaxed">{c.note}</p>}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Cross-references */}
          {citations.crossRefs.length > 0 && (
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FFF3E0] border border-[#FFE0B2] mb-2.5">
                <ArrowRight className="w-3.5 h-3.5 text-[#EF6C00]" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#795548]">Cross-references in this curriculum</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {citations.crossRefs.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-[#FFF3E0]/60 to-[#FEFAEA]/40 border border-[#FFE0B2]/50 hover:shadow-sm transition-shadow"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white border border-[#FFE0B2] flex items-center justify-center shrink-0">
                      <ArrowRight className="w-4 h-4 text-[#EF6C00]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] sm:text-base font-bold text-black">{c.ref.replace(/\*/g, "")}</p>
                      {c.note && <p className="text-sm font-medium text-black mt-0.5 leading-relaxed">{c.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
