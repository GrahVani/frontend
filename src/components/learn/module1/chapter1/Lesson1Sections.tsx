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

const fade = { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-40px" as `${number}px` }, transition: { duration: 0.45 } };
function fmt(t: string) { return t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>').replace(/`([^`]+)`/g, '<code class="text-amber-700 bg-amber-50 px-1 rounded text-xs">$1</code>'); }

// ─── Reusable Atoms ───────────────────────────────────────────
type CalloutVariant = "insight" | "remember" | "pro-tip" | "key-takeaway" | "common-mistake" | "fun-fact";

const CALLOUT_CONFIG: Record<CalloutVariant, { icon: LucideIcon; label: string; border: string; bg: string; iconBg: string; iconColor: string; titleColor: string }> = {
  "insight":        { icon: Lightbulb, label: "Key Insight",     border: "border-l-amber-500",   bg: "bg-amber-50/70",   iconBg: "bg-amber-100", iconColor: "text-amber-700",  titleColor: "text-amber-800" },
  "remember":       { icon: Brain,     label: "Remember This",  border: "border-l-indigo-500",  bg: "bg-indigo-50/70",  iconBg: "bg-indigo-100", iconColor: "text-indigo-700", titleColor: "text-indigo-800" },
  "pro-tip":        { icon: Rocket,    label: "Pro Tip",        border: "border-l-emerald-500", bg: "bg-emerald-50/70", iconBg: "bg-emerald-100", iconColor: "text-emerald-700", titleColor: "text-emerald-800" },
  "key-takeaway":   { icon: Star,      label: "Key Takeaway",   border: "border-l-violet-500",  bg: "bg-violet-50/70",  iconBg: "bg-violet-100", iconColor: "text-violet-700", titleColor: "text-violet-800" },
  "common-mistake": { icon: Shield,    label: "Common Mistake", border: "border-l-red-500",     bg: "bg-red-50/70",     iconBg: "bg-red-100",    iconColor: "text-red-600",    titleColor: "text-red-800" },
  "fun-fact":       { icon: Sparkles,  label: "Did You Know?",  border: "border-l-cyan-500",    bg: "bg-cyan-50/70",    iconBg: "bg-cyan-100",   iconColor: "text-cyan-700",   titleColor: "text-cyan-800" },
};

export function InsightCallout({ variant, title, children }: { variant: CalloutVariant; title?: string; children: React.ReactNode }) {
  const c = CALLOUT_CONFIG[variant];
  const Icon = c.icon;
  return (
    <motion.div {...fade} className={`rounded-xl border border-gray-200/60 border-l-4 ${c.border} ${c.bg} p-4`}>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${c.iconBg}`}><Icon className={`w-4 h-4 ${c.iconColor}`} /></div>
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${c.titleColor}`}>{title || c.label}</p>
          <div className="text-sm text-gray-700 leading-relaxed">{children}</div>
        </div>
      </div>
    </motion.div>
  );
}

function SectionDivider() {
  return <div className="flex items-center gap-3 py-2"><div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent" /><Sparkles className="w-3 h-3 text-amber-300" /><div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent" /></div>;
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
    { label: "Vedāṅga", color: "bg-amber-100 text-amber-700 border-amber-200" },
    { label: "Jyotiṣa", color: "bg-orange-100 text-orange-700 border-orange-200" },
    { label: "Vedānta", color: "bg-blue-100 text-blue-700 border-blue-200" },
    { label: "Veda", color: "bg-violet-100 text-violet-700 border-violet-200" },
  ].filter((t) => hookText.includes(t.label) || hookText.includes(t.label.replace(/ṣ/g, "s").replace(/ṅ/g, "n")));

  return (
    <motion.div {...fade} className="relative overflow-hidden rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-6 sm:p-8">
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      {/* Badge */}
      <div className="flex items-center gap-2 mb-5">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-200/60">
          <Eye className="w-3.5 h-3.5 text-amber-600" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Opening Question</span>
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
            className="flex items-start gap-3 p-4 bg-white/70 rounded-xl border border-amber-200/40 backdrop-blur-sm"
          >
            <div className="w-7 h-7 rounded-full bg-amber-200/60 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xs font-bold text-amber-800">{i + 1}</span>
            </div>
            <p className="text-amber-900 leading-relaxed text-[15px] sm:text-base font-medium" dangerouslySetInnerHTML={{ __html: fmt(q) }} />
          </motion.div>
        ))}
      </div>

      {/* Reveal Answer Button */}
      {!revealed && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setRevealed(true)}
          className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-600 text-white font-semibold text-sm hover:bg-amber-700 transition-colors shadow-md shadow-amber-600/20"
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
                <div className="flex-1 h-px bg-amber-200/60" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">The Answer</span>
                <div className="flex-1 h-px bg-amber-200/60" />
              </div>
              {answers.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12 }}
                  className="flex items-start gap-3 p-4 bg-white/60 rounded-xl border border-amber-100/60"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                    {String.fromCharCode(65 + i)}
                  </div>
                  <p className="text-amber-900 leading-relaxed text-sm" dangerouslySetInnerHTML={{ __html: fmt(a) }} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom accent */}
      <div className="mt-5 flex items-center gap-2 text-amber-500">
        <div className="flex-1 h-px bg-amber-200/60" />
        <span className="text-xs font-medium italic">{revealed ? "Onward we go..." : "Let's find out..."}</span>
        <div className="flex-1 h-px bg-amber-200/60" />
      </div>
    </motion.div>
  );
}

// ─── §2 Prerequisites — Interactive Checklist ────────────────
export function PrereqSection({ prerequisites }: { prerequisites: ParsedPrerequisite[] }) {
  const [checked, setChecked] = React.useState<Set<number>>(new Set());
  const allChecked = checked.size === prerequisites.length && prerequisites.length > 0;

  const toggle = (i: number) => {
    const next = new Set(checked);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    setChecked(next);
  };

  return (
    <motion.div {...fade} className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center border border-emerald-200/50">
              <BookOpen className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-800">What You Should Know First</h2>
              <p className="text-xs text-gray-400 mt-0.5">Quick background checklist</p>
            </div>
          </div>
          {allChecked ? (
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Ready
            </span>
          ) : (
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
              {checked.size}/{prerequisites.length} checked
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-500"
              initial={{ width: 0 }}
              animate={{ width: `${prerequisites.length ? (checked.size / prerequisites.length) * 100 : 0}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      </div>

      {/* Checklist Items */}
      <div className="px-5 pb-5 space-y-2.5">
        <p className="text-sm text-gray-500 mb-2">This is the first lesson — no prerequisites within Grahvani. From outside:</p>
        {prerequisites.map((p, i) => {
          const isChecked = checked.has(i);
          return (
            <motion.button
              key={i}
              onClick={() => toggle(i)}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                isChecked
                  ? "bg-emerald-50/70 border-emerald-200/60"
                  : "bg-gray-50/50 border-gray-100 hover:border-emerald-200/60 hover:bg-emerald-50/30"
              }`}
            >
              <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border transition-colors ${
                isChecked ? "bg-emerald-500 border-emerald-500" : "bg-white border-gray-300"
              }`}>
                {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-semibold transition-colors ${isChecked ? "text-emerald-900 line-through opacity-70" : "text-gray-800"}`}>
                  {p.title}
                </p>
                {p.detail && <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{p.detail}</p>}
              </div>
            </motion.button>
          );
        })}

        <AnimatePresence>
          {allChecked && (
            <motion.div
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: 10, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-2 p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <Rocket className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-emerald-800">You&apos;re all set!</p>
                  <p className="text-xs text-emerald-600">No prior knowledge needed — let&apos;s begin.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <InsightCallout variant="pro-tip" title="No Stress!">
          <span>You do <strong>not</strong> need any Sanskrit grammar, computational skills, or familiarity with classical Indian texts to start.</span>
        </InsightCallout>
      </div>
    </motion.div>
  );
}

// ─── §3 The Six Vedāṅgas — Card Grid ─────────────────────────
export function VedangaTableSection({ vedangaTable }: { vedangaTable: ParsedVedanga[] }) {
  return (
    <motion.div {...fade} className="space-y-4">
      <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center"><BookOpen className="w-4 h-4 text-amber-700" /></div>
          <h2 className="text-lg font-bold text-amber-900">The Six Vedangas</h2>
        </div>
        <p className="text-sm text-gray-600 mb-5 ml-[42px]">The Veda required six supporting disciplines &mdash; the Vedangas, &ldquo;limbs of the Veda.&rdquo; They are not part of the Veda; they are supporting infrastructure.</p>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {vedangaTable.map((v) => (
            <div
              key={v.num}
              className={`relative rounded-xl border-l-4 border bg-white p-4 transition-all hover:shadow-md ${v.highlight ? "border-amber-300 bg-amber-50/40 ring-1 ring-amber-200/50" : "border-gray-200"}`}
              style={{ borderLeftColor: v.color }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">{v.bodyIcon}</span>
                <div>
                  <span className="font-bold text-sm" style={{ color: v.color }}>{v.name}</span>
                  {v.highlight && <span className="ml-2 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">This Lesson</span>}
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-1">{v.bodyPart}</p>
              <p className="text-xs text-gray-700 leading-relaxed">{v.function}</p>
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
      <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center"><Eye className="w-4 h-4 text-amber-700" /></div>
          <h2 className="text-lg font-bold text-amber-900">Why Jyotisa Is &ldquo;The Eye&rdquo;</h2>
        </div>

        {/* Central Eye Concept */}
        <div className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl border border-amber-200 p-5 sm:p-6 mb-4 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="flex flex-col sm:flex-row items-center gap-4 relative">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center shrink-0">
              <span className="text-3xl">👁️</span>
            </div>
            <div className="text-center sm:text-left flex-1">
              <h3 className="text-base font-bold text-amber-900 mb-1">Jyotisa = The Eye (Caksuh)</h3>
              <p className="text-sm text-amber-800 leading-relaxed">
                The Veda, imagined as a cosmic body, needs an <strong>eye to see time</strong>. Jyotisa provides that sight — determining <em>when</em> rituals must be performed.
              </p>
            </div>
          </div>
        </div>

        {/* Three-point explanation */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex flex-col items-center text-center p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-2"><Sparkles className="w-5 h-5 text-blue-600" /></div>
            <p className="text-xs font-bold text-gray-800 mb-1">What it sees</p>
            <p className="text-[11px] text-gray-500 leading-relaxed">Muhurtas, tithis, nakshatras — the right time for every ritual</p>
          </div>
          <div className="flex flex-col items-center text-center p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center mb-2"><Zap className="w-5 h-5 text-violet-600" /></div>
            <p className="text-xs font-bold text-gray-800 mb-1">Why it matters</p>
            <p className="text-[11px] text-gray-500 leading-relaxed">Without correct timing, rituals lose their efficacy — the body is blind</p>
          </div>
          <div className="flex flex-col items-center text-center p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mb-2"><Rocket className="w-5 h-5 text-emerald-600" /></div>
            <p className="text-xs font-bold text-gray-800 mb-1">What grew from it</p>
            <p className="text-[11px] text-gray-500 leading-relaxed">Natal charts, predictions, and horoscopy all evolved from this timing science</p>
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
      <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center"><Shield className="w-4 h-4 text-orange-700" /></div>
          <h2 className="text-lg font-bold text-amber-900">Vedanga vs Vedanta</h2>
          <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">Don&apos;t Confuse!</span>
        </div>
        <p className="text-sm text-gray-600 mb-4 ml-[42px]">Two Sanskrit words that look almost identical but mean completely different things:</p>

        {/* Comparison cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[va, vt].map((item) => (
            <div key={item.term} className="rounded-xl border-2 p-4" style={{ borderColor: item.color + "40", background: item.color + "08" }}>
              <h3 className="font-bold mb-2" style={{ color: item.color }}>{item.term}</h3>
              <div className="space-y-2 text-xs">
                <div><span className="font-bold text-gray-500">Means:</span> <span className="text-gray-700">{item.meaning}</span></div>
                <div><span className="font-bold text-gray-500">What:</span> <span className="text-gray-700">{item.what}</span></div>
                <div><span className="font-bold text-gray-500">Relation:</span> <span className="text-gray-700">{item.relation}</span></div>
                <div className="pt-1 border-t" style={{ borderColor: item.color + "20" }}><span className="font-bold text-gray-500">Example:</span> <span className="text-gray-700">{item.example}</span></div>
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
    <motion.div {...fade} className="bg-white rounded-2xl border border-amber-200/70 shadow-sm overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 text-left hover:bg-amber-50/50 transition-colors">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center"><AlertTriangle className="w-4 h-4 text-amber-600" /></div>
          <h2 className="text-base font-bold text-amber-900">What This Lesson Does NOT Teach</h2>
        </div>
        <ChevronDown className={`w-4 h-4 text-amber-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-amber-100 pt-4 animate-in fade-in slide-in-from-top-2 duration-300">
          {items.map((item, i) => (
            <div key={i} className="flex gap-3 items-start p-3 rounded-xl bg-amber-50/40 border border-amber-100/60">
              <span className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-amber-700 text-xs font-bold">✕</span>
              </span>
              <p className="text-sm text-gray-700 leading-relaxed">{item}</p>
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
        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center"><Quote className="w-4 h-4 text-amber-700" /></div>
        <h2 className="text-lg font-bold text-amber-900">Classical Slokas</h2>
        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">Source Texts</span>
      </div>
      {slokas.map((s) => (
        <div key={s.id} className="bg-white rounded-2xl border border-amber-200/60 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-3 border-b border-amber-100">
            <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">{s.authority}</p>
          </div>
          <div className="p-5 space-y-4">
            <div><p className="text-[10px] font-bold text-gray-400 uppercase mb-1">IAST Transliteration</p><p className="text-gray-700 italic text-sm leading-relaxed whitespace-pre-line">{s.iast}</p></div>
            <div className="bg-amber-50/50 rounded-xl p-3 border border-amber-100"><p className="text-[10px] font-bold text-amber-700 uppercase mb-1">English{s.source ? ` (${s.source})` : ""}</p><p className="text-sm text-gray-800 leading-relaxed">{s.english}</p></div>
            {s.commentary && <div className="border-t border-gray-100 pt-3"><p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Commentary</p><p className="text-xs text-gray-600 leading-relaxed">{s.commentary}</p></div>}
          </div>
        </div>
      ))}
    </motion.div>
  );
}

// ─── §8 Worked Examples — Practice Recognitions ──────────────
export function WorkedExamplesSection({ examples }: { examples: ParsedWorkedExample[] }) {
  return (
    <motion.div {...fade} className="bg-white rounded-2xl border border-amber-200/60 shadow-sm p-5 sm:p-6">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center"><Zap className="w-4 h-4 text-emerald-700" /></div>
        <h2 className="text-lg font-bold text-amber-900">Worked Recognitions</h2>
        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Try This</span>
      </div>
      <div className="space-y-3">
        {examples.map((ex, i) => (
          <div key={i} className="rounded-xl border-l-4 border border-gray-200 bg-gray-50/80 p-4" style={{ borderLeftColor: "#f59e0b" }}>
            <div className="flex items-start gap-2.5 mb-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold shrink-0">{i+1}</span>
              <h3 className="text-sm font-bold text-gray-800">{ex.title}</h3>
            </div>
            <p className="text-xs text-gray-500 mb-2 italic ml-[34px]">{ex.scenario}</p>
            <p className="text-sm text-gray-700 leading-relaxed ml-[34px]">{ex.analysis}</p>
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
        <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center"><Shield className="w-4 h-4 text-red-600" /></div>
        <h2 className="text-lg font-bold text-amber-900">Common Mistakes</h2>
        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">Watch Out</span>
      </div>
      {mistakes.map((m, i) => (
        <div key={i} className="bg-white rounded-xl border border-red-100 overflow-hidden shadow-sm">
          <button onClick={() => setOpenIdx(openIdx === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left hover:bg-red-50/30 transition-colors">
            <span className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              {m.title}
            </span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${openIdx === i ? "rotate-180" : ""}`} />
          </button>
          {openIdx === i && (
            <div className="px-4 pb-4 border-t border-red-50 pt-3 space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="p-2.5 rounded-lg bg-red-50/50 border border-red-100"><p className="text-[10px] font-bold text-red-600 uppercase mb-0.5">What happens</p><p className="text-xs text-gray-700 leading-relaxed">{m.what}</p></div>
              <div className="p-2.5 rounded-lg bg-amber-50/50 border border-amber-100"><p className="text-[10px] font-bold text-amber-600 uppercase mb-0.5">Why it happens</p><p className="text-xs text-gray-700 leading-relaxed">{m.why}</p></div>
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100"><p className="text-[10px] font-bold text-emerald-700 uppercase mb-0.5">How to avoid</p><p className="text-xs text-gray-700 leading-relaxed">{m.fix}</p></div>
            </div>
          )}
        </div>
      ))}
    </motion.div>
  );
}

// ─── §9 Things to Remember — Interactive Memory Anchors ──────

const MEMORY_CARD_META: { keywords: string[]; icon: LucideIcon; color: string; lightColor: string; borderColor: string; label: string }[] = [
  { keywords: ["Vedangas", "Śikṣā", "Kalpa", "Vyākaraṇa", "Nirukta", "Chandas", "six"], icon: Layers, color: "text-amber-700", lightColor: "bg-amber-50", borderColor: "border-amber-200", label: "Framework" },
  { keywords: ["eye", "cakṣuḥ", "caksuh", "blind", "sees"], icon: Eye, color: "text-violet-700", lightColor: "bg-violet-50", borderColor: "border-violet-200", label: "Metaphor" },
  { keywords: ["Vedanta", "culmination", "≠", "not the same"], icon: GitCompare, color: "text-red-700", lightColor: "bg-red-50", borderColor: "border-red-200", label: "Distinction" },
  { keywords: ["ritual", "time-keeping", "Lagadha", "original", "foundation"], icon: Clock, color: "text-emerald-700", lightColor: "bg-emerald-50", borderColor: "border-emerald-200", label: "Origin" },
  { keywords: ["Śikṣā", "Pāṇinīya", "śloka", "canonical", "source", "verse"], icon: ScrollText, color: "text-blue-700", lightColor: "bg-blue-50", borderColor: "border-blue-200", label: "Source" },
];

function detectMemoryCardMeta(text: string) {
  const lower = text.toLowerCase();
  for (const meta of MEMORY_CARD_META) {
    if (meta.keywords.some((k) => lower.includes(k.toLowerCase()))) return meta;
  }
  return { icon: Brain, color: "text-indigo-700", lightColor: "bg-indigo-50", borderColor: "border-indigo-200", label: "Memory" };
}

function MemoryCard({ item, index }: { item: string; index: number }) {
  const [gotIt, setGotIt] = React.useState(false);
  const meta = detectMemoryCardMeta(item);
  const Icon = meta.icon;

  // Extract Sanskrit terms as inline badges
  const formatted = fmt(item)
    .replace(/(Śikṣā|Kalpa|Vyākaraṇa|Nirukta|Chandas|Jyotiṣa|Vedāṅga|Vedānta|Pāṇinīya|Lagadha)/g, '<span class="inline-flex items-center px-1 py-0.5 rounded bg-white/80 border text-[11px] font-semibold mx-0.5">$1</span>')
    .replace(/(cakṣuḥ|caksuh)/g, '<span class="inline-flex items-center px-1 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold mx-0.5">$1</span>');

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.1 }}
      className={`relative rounded-xl border p-3.5 transition-all duration-300 ${
        gotIt
          ? "bg-gradient-to-r from-emerald-50/80 to-green-50/40 border-emerald-300/60"
          : "bg-white border-gray-200 hover:shadow-sm"
      }`}
    >
      {/* Horizontal layout: Icon | Content | Toggle */}
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${gotIt ? "bg-emerald-100" : meta.lightColor}`}>
          {gotIt ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Icon className={`w-4 h-4 ${meta.color}`} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${gotIt ? "bg-emerald-100 text-emerald-700 border-emerald-200" : `${meta.lightColor} ${meta.color} ${meta.borderColor}`}`}>
              {gotIt ? "Memorized" : meta.label}
            </span>
          </div>
          <p className={`text-sm leading-relaxed font-semibold ${gotIt ? "text-emerald-900/80" : "text-gray-800"}`} dangerouslySetInnerHTML={{ __html: formatted }} />
        </div>
        <button
          onClick={() => setGotIt(!gotIt)}
          className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
            gotIt
              ? "bg-emerald-500 text-white shadow-sm shadow-emerald-200 hover:bg-emerald-600"
              : "bg-white text-gray-400 border border-gray-200 hover:border-emerald-300 hover:text-emerald-600"
          }`}
          title={gotIt ? "Forgot" : "Got it!"}
        >
          {gotIt ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
        </button>
      </div>

      {/* Decorative left accent bar */}
      <div className={`absolute left-0 top-2.5 bottom-2.5 w-1 rounded-full transition-colors ${gotIt ? "bg-emerald-400" : meta.lightColor.replace("bg-", "bg-").replace("50", "300")}`} />
    </motion.div>
  );
}

export function RememberSection({ items }: { items: string[] }) {
  return (
    <motion.div {...fade} className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center"><Brain className="w-4 h-4 text-indigo-700" /></div>
          <div>
            <h2 className="text-lg font-bold text-amber-900">Things to Remember</h2>
            <p className="text-xs text-gray-500">Click &quot;Got it!&quot; as you memorize each anchor</p>
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
    amber: "bg-amber-100 text-amber-700 border-amber-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    red: "bg-red-100 text-red-700 border-red-200",
    green: "bg-emerald-100 text-emerald-700 border-emerald-200",
    violet: "bg-violet-100 text-violet-700 border-violet-200",
    indigo: "bg-indigo-100 text-indigo-700 border-indigo-200",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      className={`relative rounded-xl border p-4 transition-all hover:shadow-md group cursor-default ${
        insight.highlight
          ? "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300 ring-1 ring-amber-200/50"
          : "bg-white border-gray-200 hover:border-amber-200"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
          insight.highlight ? "bg-amber-100" : "bg-gray-100 group-hover:bg-amber-50"
        }`}>
          <Icon className={`w-4 h-4 ${insight.highlight ? "text-amber-700" : "text-gray-600 group-hover:text-amber-600"}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <h4 className="text-sm font-bold text-gray-900">{insight.title}</h4>
            {insight.badge && (
              <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full border ${badgeColorMap[insight.badgeColor || "amber"]}`}>
                {insight.badge}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">{insight.description}</p>
        </div>
      </div>
    </motion.div>
  );
}

/** Auto-extract insights from plain summary text */
function extractInsightsFromText(paragraphs: string[]): RecapInsight[] {
  const text = paragraphs.join(" ");
  const insights: RecapInsight[] = [];

  if (text.match(/six\s+Vedangas?|Vedāṅgas?|Śikṣā.*Kalpa/i)) {
    insights.push({
      icon: Layers,
      title: "Six Vedāṅgas",
      description: "Jyotiṣa is one of six supporting disciplines — the limbs of the Veda.",
      badge: "Foundation",
      badgeColor: "amber",
    });
  }
  if (text.match(/eye\s+of\s+the\s+Veda|cakṣuḥ|Caksuh|sees\s+time/i)) {
    insights.push({
      icon: Eye,
      title: "Eye of the Veda",
      description: "Jyotiṣa provides temporal vision — 'vedasya cakṣuḥ' means the tradition sees time.",
      badge: "Core Metaphor",
      badgeColor: "violet",
      highlight: true,
    });
  }
  if (text.match(/ritual[\s-]timing|time.keeping|kāla.vidhāna|right\s+time/i)) {
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
      title: "Vedāṅga ≠ Vedānta",
      description: "Vedāṅga = 6 supporting tools. Vedānta = philosophical culmination (Upaniṣadic).",
      badge: "Critical",
      badgeColor: "red",
    });
  }
  if (text.match(/Vedanga\s+Jyotisa|Lagadha|Pāṇinīya\s+Śikṣā|canonical\s+śloka/i)) {
    insights.push({
      icon: ScrollText,
      title: "Source Texts",
      description: "Pāṇinīya Śikṣā 41-42 & Vedāṅga Jyotiṣa (Lagadha) anchor this framework.",
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
    .replace(/\*\*([^*]+)\*\*/g, '<span class="font-bold text-amber-900">$1</span>')
    .replace(/\*([^*]+)\*/g, '<em class="text-amber-800">$1</em>')
    .replace(/`([^`]+)`/g, '<span class="inline-flex items-center px-1.5 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">$1</span>')
    .replace(/(Vedāṅga|Vedanga)\s*≠\s*(Vedānta|Vedanta)/g, '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold">$1 ≠ $2</span>');
}

export function SummarySection({ paragraphs, insights }: { paragraphs: string[]; insights?: RecapInsight[] }) {
  const [showFullText, setShowFullText] = React.useState(false);
  const derivedInsights = insights?.length ? insights : extractInsightsFromText(paragraphs);

  return (
    <motion.div {...fade} className="space-y-4">
      <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-amber-900">90-Second Recap</h2>
              <p className="text-xs text-gray-500">Key takeaways from this lesson</p>
            </div>
          </div>
          <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
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
        <div className="mt-4 border-t border-amber-100">
          <button
            onClick={() => setShowFullText(!showFullText)}
            className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-amber-700 hover:text-amber-900 hover:bg-amber-50/50 transition-colors"
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
                    <div key={i} className="relative pl-4 border-l-2 border-amber-200">
                      <p
                        className="text-sm text-gray-700 leading-relaxed"
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
  primary:  { label: "Primary Classical Sources", icon: ScrollText, color: "text-amber-800", bg: "bg-amber-50", border: "border-amber-200", accent: "bg-amber-400" },
  modern:   { label: "Modern Translations", icon: BookOpen, color: "text-sky-800", bg: "bg-sky-50", border: "border-sky-200", accent: "bg-sky-400" },
  further:  { label: "Going Deeper (Optional)", icon: Star, color: "text-violet-800", bg: "bg-violet-50", border: "border-violet-200", accent: "bg-violet-400" },
};

export function CitationsSection({ citations }: { citations: ParsedCitations }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div {...fade} className="bg-white rounded-2xl border border-amber-200/60 shadow-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-amber-50/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-amber-700" />
          </div>
          <div>
            <h2 className="text-base font-bold text-amber-900">Citations &amp; Further Reading</h2>
            <p className="text-xs text-gray-500">Primary sources, translations &amp; next lessons</p>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-amber-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="px-4 pb-5 border-t border-amber-100 pt-4 space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
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
                      className="relative pl-3 pr-3 py-2.5 rounded-xl bg-gray-50/60 border border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-colors"
                    >
                      <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-full ${meta.accent}`} />
                      <p className="text-sm font-semibold text-gray-800">{c.ref}</p>
                      {c.note && <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{c.note}</p>}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Cross-references */}
          {citations.crossRefs.length > 0 && (
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-200 mb-2.5">
                <ArrowRight className="w-3.5 h-3.5 text-orange-700" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-orange-700">Cross-references in this curriculum</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {citations.crossRefs.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-orange-50/60 to-amber-50/40 border border-orange-200/50 hover:shadow-sm transition-shadow"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white border border-orange-200 flex items-center justify-center shrink-0">
                      <ArrowRight className="w-4 h-4 text-orange-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-orange-800">{c.ref}</p>
                      {c.note && <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{c.note}</p>}
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
