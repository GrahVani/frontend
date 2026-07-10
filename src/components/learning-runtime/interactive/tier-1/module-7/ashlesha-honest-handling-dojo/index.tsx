"use client";

import { AlertCircle, CheckCircle2, MessageSquareText, ShieldCheck, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { IAST } from '@/components/learning-runtime/interactive/../chrome/typography';

type ScenarioKey = "frightened" | "gandamula" | "compatibility";

const DOCTRINE = [
  { label: "Fear story", value: "curse / manipulation verdict", tone: "#A23A1E" },
  { label: "Classical correction", value: "sharp, deep, Nāga-guided", tone: "#8A6424" },
  { label: "Practitioner language", value: "intensity + gifts + agency", tone: "#2F7D4B" },
];

const SCENARIOS: Record<ScenarioKey, {
  label: string;
  prompt: string;
  fear: string;
  doctrine: string;
  speech: string;
  avoid: string;
}> = {
  frightened: {
    label: "Frightened client",
    prompt: "\"I read that my Aśleṣā Moon makes me manipulative and cursed. Is that true?\"",
    fear: "The folk table turns a symbol into a character verdict.",
    doctrine: "Aśleṣā is sharp and deep, with Nāga symbolism and real insight gifts.",
    speech: "No. That curse framing is not the classical doctrine. This is an intense and capable Moon, read with the whole chart.",
    avoid: "Do not repeat curse-language, even as a warning.",
  },
  gandamula: {
    label: "Gaṇḍa-mūla concern",
    prompt: "\"My Moon is near the Cancer-Leo junction. Should I be worried?\"",
    fear: "The junction is mistaken for danger or doom.",
    doctrine: "Gaṇḍa-mūla marks a sensitive transition point that receives care.",
    speech: "This calls for calm attention, not alarm. Śānti is care for a tender threshold, not proof something is wrong.",
    avoid: "Do not frame ritual as averting catastrophe.",
  },
  compatibility: {
    label: "Compatibility table",
    prompt: "\"An online match table says Aśleṣā ruins the relationship.\"",
    fear: "One stigmatised nakṣatra is allowed to overrule the whole chart.",
    doctrine: "Compatibility requires multiple factors and tradition-specific weighting.",
    speech: "A single Aśleṣā label cannot decide a match. We judge the whole chart and refuse fear-based shortcuts.",
    avoid: "Do not let one factor carry a relationship verdict.",
  },
};

const RESPONSE_STEPS = [
  "Correct fear-language.",
  "Name the doctrine.",
  "Lead with gifts.",
  "Place caution inside whole-chart judgment.",
];

function HandlingLaneDiagram({
  scenario,
  onSelect,
}: {
  scenario: ScenarioKey;
  onSelect: (key: ScenarioKey) => void;
}) {
  const active = SCENARIOS[scenario];
  const scenarioKeys = Object.keys(SCENARIOS) as ScenarioKey[];

  return (
    <div className="rounded-2xl p-4" style={{ background: "#FFFDF7", border: "1px solid var(--gl-gold-hairline)" }}>
      <div className="rounded-xl p-4" style={{ background: "#FFF8E8", border: "1px solid var(--gl-gold-hairline)" }}>
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--gl-ink-muted)" }}>Choose the client situation</p>
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          {scenarioKeys.map((key) => {
            const item = SCENARIOS[key];
            const isActive = key === scenario;
            return (
              <button
                type="button"
                key={key}
                onClick={() => onSelect(key)}
                className="rounded-xl p-3 text-left transition"
                style={{
                  background: isActive ? "#FFFFFF" : "rgba(255,255,255,0.55)",
                  border: isActive ? "2px solid var(--gl-gold-accent)" : "1px solid var(--gl-gold-hairline)",
                }}
              >
                <span className="text-sm font-semibold" style={{ color: "var(--gl-ink-primary)" }}>{item.label}</span>
                <span className="mt-1 block text-xs leading-relaxed" style={{ color: "var(--gl-ink-secondary)" }}>{item.prompt}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="overflow-hidden rounded-xl p-3" style={{ background: "linear-gradient(135deg, #FFFFFF, #FFF8E8)", border: "1px solid var(--gl-gold-hairline)" }}>
          <svg viewBox="0 0 900 520" role="img" aria-label="Aśleṣā honest handling lane from fear story to doctrine to practitioner language" className="w-full h-auto">
            <defs>
              <marker id="ashlesha-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" fill="#C9A24D" />
              </marker>
            </defs>

            <rect x="42" y="54" width="240" height="330" rx="26" fill="#FFF6F0" stroke="rgba(162,58,30,0.35)" />
            <rect x="330" y="54" width="240" height="330" rx="26" fill="#FFF8E8" stroke="#E0C988" />
            <rect x="618" y="54" width="240" height="330" rx="26" fill="#F2FBF5" stroke="rgba(47,125,75,0.32)" />

            {DOCTRINE.map((lane, index) => {
              const x = 76 + index * 288;
              return (
                <g key={lane.label}>
                  <circle cx={x + 86} cy="112" r="36" fill="#FFFFFF" stroke={lane.tone} strokeWidth="3" />
                  <text x={x + 86} y="120" textAnchor="middle" fontSize="22" fontWeight="700" fill={lane.tone}>{index + 1}</text>
                  <text x={x + 86} y="172" textAnchor="middle" fontSize="16" fontWeight="700" fill={lane.tone}>{lane.label}</text>
                  <foreignObject x={x - 12} y="194" width="196" height="76">
                    <div className="flex h-full items-center justify-center text-center text-lg font-semibold leading-tight" style={{ color: "#3D2A1D" }}>
                      {lane.value}
                    </div>
                  </foreignObject>
                </g>
              );
            })}

            <path d="M 282 214 C 304 214, 308 214, 330 214" fill="none" stroke="#C9A24D" strokeWidth="3" markerEnd="url(#ashlesha-arrow)" />
            <path d="M 570 214 C 592 214, 596 214, 618 214" fill="none" stroke="#C9A24D" strokeWidth="3" markerEnd="url(#ashlesha-arrow)" />

            <foreignObject x="74" y="296" width="176" height="78">
              <div className="text-center text-sm leading-snug" style={{ color: "#6C5530" }}>{active.fear}</div>
            </foreignObject>
            <foreignObject x="362" y="296" width="176" height="78">
              <div className="text-center text-sm leading-snug" style={{ color: "#6C5530" }}>{active.doctrine}</div>
            </foreignObject>
            <foreignObject x="650" y="286" width="176" height="94">
              <div className="text-center text-sm leading-snug" style={{ color: "#28593A" }}>{active.speech}</div>
            </foreignObject>

            <rect x="246" y="424" width="408" height="48" rx="24" fill="#FFFFFF" stroke="#E0C988" />
            <text x="450" y="454" textAnchor="middle" fontSize="17" fontWeight="700" fill="#8A6424">turn fear into precise, non-harming language</text>
          </svg>
        </div>

        <div className="rounded-xl p-4" style={{ background: "#FFFFFF", border: "1px solid var(--gl-gold-hairline)" }}>
          <div className="flex items-start gap-3">
            <div className="rounded-full p-3" style={{ background: "#F0F7FF" }}>
              <MessageSquareText size={24} color="#365D8D" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#365D8D" }}>Client says</p>
              <p className="mt-1 text-base italic leading-relaxed" style={{ color: "var(--gl-ink-primary)" }}>{active.prompt}</p>
            </div>
          </div>

          <div className="mt-4 rounded-xl p-3" style={{ background: "#F2FBF5", border: "1px solid rgba(47, 125, 75, 0.28)" }}>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: "#2F7D4B" }}>
              <CheckCircle2 size={16} /> say this
            </p>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--gl-ink-secondary)" }}>{active.speech}</p>
          </div>
          <div className="mt-3 rounded-xl p-3" style={{ background: "#FFF6F0", border: "1px solid rgba(162, 58, 30, 0.26)" }}>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: "#A23A1E" }}>
              <AlertCircle size={16} /> avoid
            </p>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--gl-ink-secondary)" }}>{active.avoid}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AshleshaHonestHandlingDojo() {
  const [scenario, setScenario] = useState<ScenarioKey>("frightened");

  const responseLines = useMemo(() => RESPONSE_STEPS, []);

  return (
    <div className="rounded-2xl p-5 md:p-6" style={{ background: "var(--gl-card-surface-solid)", border: "1px solid var(--gl-gold-hairline)" }}>
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: "var(--gl-gold-accent)" }}>
            Module 7 Honest Handling
          </p>
          <h3 className="mt-2 text-2xl font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
            <IAST>Aśleṣā</IAST> stigma-to-language lane
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed" style={{ color: "var(--gl-ink-secondary)" }}>
            Move from folk fear, to classical doctrine, to the sentence a responsible practitioner can actually say.
          </p>
        </div>
      </div>

      <div className="mt-5">
        <HandlingLaneDiagram scenario={scenario} onSelect={setScenario} />
      </div>

      <div className="mt-5">
        <div className="rounded-xl p-4" style={{ background: "#FFFFFF", border: "1px solid var(--gl-gold-hairline)" }}>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--gl-gold-accent)" }}>
            <ShieldCheck size={16} /> response order
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {responseLines.map((line, index) => (
              <div key={line} className="flex gap-3 rounded-lg p-3" style={{ background: "#FFFDF7", border: "1px solid var(--gl-gold-hairline)" }}>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold" style={{ background: "#F0DFA8", color: "#5F4216" }}>
                  {index + 1}
                </span>
                <span className="text-sm leading-snug" style={{ color: "var(--gl-ink-secondary)" }}>{line}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-3 rounded-xl p-4" style={{ background: "#F2FBF5", border: "1px solid rgba(47, 125, 75, 0.28)" }}>
        <Sparkles size={20} color="#2F7D4B" />
        <p className="text-sm leading-relaxed" style={{ color: "var(--gl-ink-secondary)" }}>
          Final rule: acknowledge intensity without catastrophising; a shadow is material for practice, not a verdict on character.
        </p>
      </div>
    </div>
  );
}
