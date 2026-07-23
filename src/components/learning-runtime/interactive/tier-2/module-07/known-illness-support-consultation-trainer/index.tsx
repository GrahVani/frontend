"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCopy,
  HeartHandshake,
  Lock,
  MessageSquareQuote,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { fontFamilies } from "@/design-tokens/grahvani-learning/typography";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-secondary, #5A4E2E)";
const INK_MUTED = "var(--gl-ink-muted, #8A7E5E)";
const GOLD = ink.goldAccent;
const SAFE = "#2F7D55";
const CAUTION = ink.vermilionAccent;

type TabKey = "scenario" | "build" | "silent" | "check";

const TABS: { key: TabKey; label: string }[] = [
  { key: "scenario", label: "Scenario compass" },
  { key: "build", label: "Build the response" },
  { key: "silent", label: "Silent confidence" },
  { key: "check", label: "Mistake check" },
];

const ALLOWED = [
  {
    title: "Acknowledge the already-shared finding",
    body: "Reference the Saturn/11th-house correspondence established in the prior, diagnosis-triggered consultation.",
  },
  {
    title: "Silent confidence-modulation",
    body: "Privately held daśā-timing awareness shapes how warmly and steadily the practitioner shows up, without any disclosure.",
  },
  {
    title: "Ordinary human validation",
    body: "Name the frustration as real and tiring. Genuine presence does not require every sentence to be chart-grounded.",
  },
];

const PROHIBITED = [
  {
    title: "New chart claims",
    body: "Any fresh astrological observation requires the same diagnosis-first precondition as the original contextualisation.",
  },
  {
    title: "Prognosis or timeline",
    body: "Forecasting when the condition will ease up is the same prohibited forecasting this module has warned against.",
  },
  {
    title: "Medical-sounding reassurance",
    body: "Phrases like 'I'm sure it'll get better' borrow unearned medical authority from the warmth of the moment.",
  },
];

const RESPONSE_SEGMENTS = [
  {
    id: "remember",
    text: "I remember we talked about your chart's Saturn placement — the one that speaks to exactly this kind of long-haul, steady-management thing, not a crisis, just a real and ongoing presence.",
    correct: true,
  },
  {
    id: "validation",
    text: "That sounds genuinely tiring to carry, even when it's medically stable, and it's completely fair to want to talk about it, chart or no chart.",
    correct: true,
  },
  {
    id: "decline",
    text: "I'm not going to pretend I know when it'll ease up — nobody's chart tells them that reliably, mine included.",
    correct: true,
  },
  {
    id: "close",
    text: "I'm glad you brought it here.",
    correct: true,
  },
  {
    id: "new-claim",
    text: "I also notice Mars is active in your 6th house right now, which suggests the inflammation may spike soon.",
    correct: false,
    reason: "New chart claim without a diagnosis-first precondition.",
  },
  {
    id: "prognosis",
    text: "This should ease up once Jupiter reaches your 11th house next year.",
    correct: false,
    reason: "Prognosis and timeline are prohibited.",
  },
  {
    id: "reassurance",
    text: "I'm sure it'll get better soon.",
    correct: false,
    reason: "Medical-sounding reassurance beyond astrological competence.",
  },
];

const MODEL_RESPONSE = RESPONSE_SEGMENTS.filter((s) => s.correct)
  .map((s) => s.text)
  .join(" ");

const MISTAKE_STATEMENTS = [
  {
    id: "ref-shared",
    text: "Reference the already-shared Saturn/11th finding briefly.",
    correct: true,
    reason: "Continuity and remembered care are allowed.",
  },
  {
    id: "fresh-claim",
    text: "Offer a fresh chart observation about the client's ankle.",
    correct: false,
    reason: "New chart claims require the diagnosis-first precondition.",
  },
  {
    id: "get-better",
    text: "Say 'I'm sure it'll get better' to comfort the client.",
    correct: false,
    reason: "Medical-sounding reassurance is prohibited.",
  },
  {
    id: "warm-tone",
    text: "Use privately held daśā-timing awareness to warm your tone.",
    correct: true,
    reason: "Silent confidence-modulation is allowed.",
  },
  {
    id: "explain-tone",
    text: "Tell the client why your tone is warmer because of daśā analysis.",
    correct: false,
    reason: "Disclosure means the client learns the specific astrological finding.",
  },
  {
    id: "human-validation",
    text: "Offer ordinary human validation about the frustration.",
    correct: true,
    reason: "Genuine human presence does not require chart grounding.",
  },
];

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : color;
}

export function KnownIllnessSupportConsultationTrainer() {
  const [tab, setTab] = useState<TabKey>("scenario");

  function reset() {
    setTab("scenario");
  }

  return (
    <div
      data-interactive="known-illness-support-consultation-trainer"
      className="w-full min-w-0"
      style={{
        background: SURFACE,
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 16,
        padding: 20,
        color: INK_PRIMARY,
        boxSizing: "border-box",
        overflow: "hidden",
        fontFamily: fontFamilies.body,
      }}
    >
      <header className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="m-0 text-xs uppercase" style={{ color: GOLD, letterSpacing: "0.08em", fontWeight: 600 }}>
            Known-illness support
          </p>
          <h2
            className="mt-1 text-xl sm:text-2xl"
            style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
          >
            Supporting a client through a known illness
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            Practise the consultation skills that surround contextualisation: what to offer, what to withhold, and how
            to keep warmth from slipping into prohibited reassurance.
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 self-start rounded-lg px-3 py-2 text-sm"
          style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY, fontWeight: 500 }}
        >
          <RotateCcw size={15} aria-hidden="true" />
          Restart
        </button>
      </header>

      <nav className="mb-5 flex flex-wrap gap-2" aria-label="Known-illness support sections">
        {TABS.map((t) => (
          <TabButton key={t.key} active={tab === t.key} onClick={() => setTab(t.key)}>
            {t.label}
          </TabButton>
        ))}
      </nav>

      {tab === "scenario" && <ScenarioTab />}
      {tab === "build" && <BuildTab />}
      {tab === "silent" && <SilentTab />}
      {tab === "check" && <CheckTab />}
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className="rounded-lg px-3 py-2 text-sm"
      style={{
        border: `1px solid ${active ? GOLD : HAIRLINE}`,
        background: active ? GOLD : "transparent",
        color: active ? "#1A1408" : INK_SECONDARY,
        fontWeight: 500,
      }}
    >
      {children}
    </button>
  );
}

function ScenarioTab() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.1–4.2</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          Scenario compass
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          The client has early-stage osteoarthritis in the ankle, is in ongoing physical therapy, and says the condition
          has been a &ldquo;low hum of frustration.&rdquo; The doctor says it is stable. This is a request for presence
          and perspective, not new information.
        </p>

        <div className="mt-4 overflow-x-auto rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
          <svg viewBox="0 0 540 300" className="h-auto w-full min-w-[420px]" role="img" aria-label="Consultation compass">
            {/* Central node */}
            <circle cx="270" cy="145" r="50" fill={wash(GOLD, "18")} stroke={GOLD} strokeWidth="2" />
            <text x="270" y="140" textAnchor="middle" fill={INK_PRIMARY} fontSize="14" fontWeight="700" style={{ fontFamily: fontFamilies.body }}>
              Known illness
            </text>
            <text x="270" y="160" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="500" style={{ fontFamily: fontFamilies.body }}>
              support moment
            </text>

            {/* Allowed rays */}
            {[
              { x: 80, y: 60, label: "Shared finding", sub: "Saturn/11th" },
              { x: 60, y: 210, label: "Silent tone", sub: "daśā held privately" },
              { x: 270, y: 30, label: "Human validation", sub: "frustration is real" },
            ].map((node, idx) => {
              const lineEndX = node.x < 270 ? node.x + 66 : node.x > 270 ? node.x - 66 : node.x;
              const lineEndY = node.y < 145 ? node.y + 26 : node.y > 145 ? node.y - 26 : node.y;
              return (
              <g key={`allowed-${idx}`} role="button" tabIndex={0} onClick={() => setSelected(`allowed-${idx}`)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setSelected(`allowed-${idx}`); }} style={{ cursor: "pointer" }}>
                <line x1={270 + (lineEndX - 270) * 0.5} y1={145 + (lineEndY - 145) * 0.5} x2={lineEndX} y2={lineEndY} stroke={SAFE} strokeWidth="2.4" />
                <rect x={node.x - 66} y={node.y - 26} width="132" height="52" rx="10" fill={wash(SAFE, "14")} stroke={selected === `allowed-${idx}` ? SAFE : HAIRLINE} strokeWidth={selected === `allowed-${idx}` ? 2 : 1} />
                <text x={node.x} y={node.y - 5} textAnchor="middle" fill={SAFE} fontSize="12" fontWeight="700" style={{ fontFamily: fontFamilies.body }}>{node.label}</text>
                <text x={node.x} y={node.y + 14} textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="500" style={{ fontFamily: fontFamilies.body }}>{node.sub}</text>
              </g>
              );
            })}

            {/* Prohibited rays */}
            {[
              { x: 460, y: 60, label: "New claims", sub: "requires diagnosis" },
              { x: 480, y: 210, label: "Prognosis", sub: "no timeline" },
              { x: 270, y: 250, label: "Reassurance", sub: "medical-sounding" },
            ].map((node, idx) => {
              const lineEndX = node.x < 270 ? node.x + 66 : node.x > 270 ? node.x - 66 : node.x;
              const lineEndY = node.y < 145 ? node.y + 26 : node.y > 145 ? node.y - 26 : node.y;
              return (
              <g key={`prohibited-${idx}`} role="button" tabIndex={0} onClick={() => setSelected(`prohibited-${idx}`)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setSelected(`prohibited-${idx}`); }} style={{ cursor: "pointer" }}>
                <line x1={270 + (lineEndX - 270) * 0.5} y1={145 + (lineEndY - 145) * 0.5} x2={lineEndX} y2={lineEndY} stroke={CAUTION} strokeWidth="2.4" />
                <rect x={node.x - 66} y={node.y - 26} width="132" height="52" rx="10" fill={wash(CAUTION, "12")} stroke={selected === `prohibited-${idx}` ? CAUTION : HAIRLINE} strokeWidth={selected === `prohibited-${idx}` ? 2 : 1} />
                <text x={node.x} y={node.y - 5} textAnchor="middle" fill={CAUTION} fontSize="12" fontWeight="700" style={{ fontFamily: fontFamilies.body }}>{node.label}</text>
                <text x={node.x} y={node.y + 14} textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="500" style={{ fontFamily: fontFamilies.body }}>{node.sub}</text>
              </g>
              );
            })}
          </svg>
        </div>

        {selected && (
          <div className="mt-3 rounded-lg p-3" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
            {selected.startsWith("allowed") ? (
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} style={{ color: SAFE, flexShrink: 0 }} aria-hidden="true" />
                <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>{ALLOWED[Number(selected.split("-")[1])].body}</p>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <XCircle size={16} style={{ color: CAUTION, flexShrink: 0 }} aria-hidden="true" />
                <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>{PROHIBITED[Number(selected.split("-")[1])].body}</p>
              </div>
            )}
          </div>
        )}
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <HeartHandshake size={18} style={{ color: GOLD }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>What this moment asks for</p>
        </div>
        <ul className="m-0 mt-2 list-disc space-y-2 pl-5 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          <li>Not new chart-based information.</li>
          <li>Not emergency routing.</li>
          <li>Presence, perspective, and honest limits.</li>
        </ul>
      </aside>
    </div>
  );
}

function BuildTab() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [reviewed, setReviewed] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectedSegments = useMemo(
    () => RESPONSE_SEGMENTS.filter((s) => selectedIds.includes(s.id)),
    [selectedIds]
  );

  function toggle(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    setReviewed(false);
  }

  const correctIds = RESPONSE_SEGMENTS.filter((s) => s.correct).map((s) => s.id);
  const isModel = selectedIds.length === correctIds.length && correctIds.every((id) => selectedIds.includes(id));
  const hasIncorrect = selectedSegments.some((s) => !s.correct);

  function copyModel() {
    navigator.clipboard.writeText(MODEL_RESPONSE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§6</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          Build the consultation response
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Select the segments that belong in the model response. Avoid new claims, prognosis, and medical-sounding
          reassurance.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {RESPONSE_SEGMENTS.map((s) => {
            const selected = selectedIds.includes(s.id);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => toggle(s.id)}
                className="rounded-lg p-3 text-left text-sm"
                style={{
                  background: selected ? wash(GOLD, "18") : SURFACE_2,
                  border: `1px solid ${selected ? GOLD : HAIRLINE}`,
                  color: INK_PRIMARY,
                  fontWeight: 500,
                  maxWidth: "100%",
                }}
              >
                {selected && <CheckCircle2 size={14} className="mb-1" style={{ color: GOLD }} aria-hidden="true" />}
                {s.text}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setReviewed(true)}
          className="mt-4 rounded-lg px-4 py-2 text-sm"
          style={{ background: GOLD, color: "#1A1408", fontWeight: 500 }}
        >
          Review my response
        </button>

        {reviewed && (
          <div
            className="mt-4 rounded-lg p-3"
            style={{
              background: isModel ? wash(SAFE, "10") : hasIncorrect ? wash(CAUTION, "10") : wash(GOLD, "10"),
              border: `1px solid ${isModel ? wash(SAFE, "55") : hasIncorrect ? wash(CAUTION, "55") : wash(GOLD, "55")}`,
            }}
          >
            <p className="m-0 text-sm" style={{ color: isModel ? SAFE : hasIncorrect ? CAUTION : GOLD, fontWeight: 500 }}>
              {isModel ? "Model response built" : hasIncorrect ? "Contains prohibited content" : "Incomplete — include all correct segments and remove any incorrect ones"}
            </p>
            {hasIncorrect && (
              <ul className="m-0 mt-2 list-disc space-y-1 pl-5 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
                {selectedSegments.filter((s) => !s.correct).map((s) => (
                  <li key={s.id}>{s.reason}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <MessageSquareQuote size={18} style={{ color: GOLD }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>Model response</p>
        </div>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_PRIMARY, lineHeight: 1.6 }}>{MODEL_RESPONSE}</p>
        <button
          type="button"
          onClick={copyModel}
          className="mt-3 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
          style={{ background: GOLD, color: "#1A1408", fontWeight: 500 }}
        >
          {copied ? <CheckCircle2 size={14} aria-hidden="true" /> : <ClipboardCopy size={14} aria-hidden="true" />}
          {copied ? "Copied" : "Copy model"}
        </button>
      </aside>
    </div>
  );
}

function SilentTab() {
  const [privateKnowledge, setPrivateKnowledge] = useState(false);

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.3 & §6</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          Silent confidence-modulation
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          The practitioner may privately know that no maraka-linked period is active. That knowledge can shape tone, but
          it must never be spoken.
        </p>

        <div className="mt-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm" style={{ color: INK_SECONDARY }}>
            <input
              type="checkbox"
              checked={privateKnowledge}
              onChange={(e) => setPrivateKnowledge(e.target.checked)}
              className="h-4 w-4"
            />
            Practitioner privately knows this is not a maraka-linked period
          </label>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-lg p-3" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              <Lock size={16} style={{ color: INK_MUTED }} aria-hidden="true" />
              <p className="m-0 text-sm" style={{ color: INK_MUTED, fontWeight: 600 }}>Private knowledge</p>
            </div>
            <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              {privateKnowledge
                ? "No maraka-linked period is active; the practitioner can show up with a steadier warmth."
                : "Without this private knowledge, the practitioner remains supportive but more guarded."}
            </p>
          </div>
          <div className="rounded-lg p-3" style={{ background: wash(privateKnowledge ? SAFE : GOLD, "10"), border: `1px solid ${wash(privateKnowledge ? SAFE : GOLD, "55")}` }}>
            <div className="flex items-center gap-2">
              <MessageSquareQuote size={16} style={{ color: privateKnowledge ? SAFE : GOLD }} aria-hidden="true" />
              <p className="m-0 text-sm" style={{ color: privateKnowledge ? SAFE : GOLD, fontWeight: 600 }}>Client experiences</p>
            </div>
            <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              {privateKnowledge
                ? "A warmer, steadier practitioner — with no idea why the tone shifted."
                : "A supportive but more measured presence, with no astrological content disclosed."}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-lg p-3" style={{ background: wash(CAUTION, "10"), border: `1px solid ${wash(CAUTION, "55")}` }}>
          <div className="flex items-start gap-2">
            <AlertTriangle size={16} style={{ color: CAUTION, flexShrink: 0 }} aria-hidden="true" />
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              Even if the client asks why the practitioner seems more confident, the reasoning is never disclosed — per
              Lesson 7.4.3 Category 3 handling.
            </p>
          </div>
        </div>
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>The rule</p>
        <ul className="m-0 mt-2 list-disc space-y-2 pl-5 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          <li>Disclosure means the client learns a specific astrological finding.</li>
          <li>Silent confidence-modulation changes only the practitioner&apos;s tone.</li>
          <li>The &ldquo;why&rdquo; is never available to the client, even indirectly.</li>
        </ul>
      </aside>
    </div>
  );
}

function CheckTab() {
  const [judgments, setJudgments] = useState<Record<string, boolean | null>>({});

  function judge(id: string, value: boolean) {
    setJudgments((prev) => ({ ...prev, [id]: value }));
  }

  return (
    <div className="grid min-w-0 gap-4">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§8</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          Spot the support-consultation mistake
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Decide whether each action reflects correct known-illness support discipline.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {MISTAKE_STATEMENTS.map((s) => {
            const judgment = judgments[s.id];
            const answered = judgment !== undefined && judgment !== null;
            const correct = answered && judgment === s.correct;
            return (
              <div
                key={s.id}
                className="rounded-lg p-3"
                style={{
                  background: answered ? (correct ? wash(SAFE, "10") : wash(CAUTION, "10")) : SURFACE_2,
                  border: `1px solid ${answered ? (correct ? wash(SAFE, "55") : wash(CAUTION, "55")) : HAIRLINE}`,
                }}
              >
                <p className="m-0 text-sm" style={{ color: INK_PRIMARY, lineHeight: 1.55 }}>{s.text}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={answered}
                    onClick={() => judge(s.id, true)}
                    className="rounded-lg px-3 py-1.5 text-sm"
                    style={{
                      background: answered && judgment === true ? (s.correct ? SAFE : CAUTION) : SURFACE,
                      border: `1px solid ${answered && judgment === true ? (s.correct ? SAFE : CAUTION) : HAIRLINE}`,
                      color: answered && judgment === true ? "#fff" : INK_SECONDARY,
                      fontWeight: 500,
                      opacity: answered && judgment !== true ? 0.55 : 1,
                    }}
                  >
                    Correct
                  </button>
                  <button
                    type="button"
                    disabled={answered}
                    onClick={() => judge(s.id, false)}
                    className="rounded-lg px-3 py-1.5 text-sm"
                    style={{
                      background: answered && judgment === false ? (s.correct ? CAUTION : SAFE) : SURFACE,
                      border: `1px solid ${answered && judgment === false ? (s.correct ? CAUTION : SAFE) : HAIRLINE}`,
                      color: answered && judgment === false ? "#fff" : INK_SECONDARY,
                      fontWeight: 500,
                      opacity: answered && judgment !== false ? 0.55 : 1,
                    }}
                  >
                    Mistake
                  </button>
                </div>
                {answered && (
                  <p className="m-0 mt-2 text-sm" style={{ color: correct ? SAFE : CAUTION, lineHeight: 1.55 }}>
                    {correct ? "Right. " : "Not quite. "}{s.reason}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
