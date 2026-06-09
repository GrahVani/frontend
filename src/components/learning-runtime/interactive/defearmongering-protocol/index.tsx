"use client";

/**
 * De-Fearmongering Protocol -- Lesson 14.6.6 Interactive
 *
 * Eight-step protocol walker for any doṣa.
 * Doṣa selector + step cards + reframe exercise + ethics panel.
 */

import { useState } from "react";
import { IAST } from "../../chrome/typography";
import { DOSHAS, PROTOCOL_STEPS, REFRAMES } from "./data";
import type { DoshaProfile } from "./data";
import {
  CheckCircle2,
  AlertTriangle,
  Shield,
  BookOpen,
  RotateCcw,
  Eye,
  Heart,
  Ban,
  Coins,
  Scale,
} from "lucide-react";

/* --- Design tokens --- */

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const INK_PRIMARY = "var(--gl-ink-primary, #1A1408)";
const INK_SECONDARY = "var(--gl-ink-secondary, #5A4E2E)";
const INK_MUTED = "var(--gl-ink-muted, #8A7E5E)";
const GOLD_ACCENT = "var(--gl-gold-accent, #9C7A2F)";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const AMBER = "#C8841E";
const BLUE = "#3B82F6";

/* --- Step icon map --- */

const STEP_ICONS = [BookOpen, CheckCircle2, Eye, Heart, Shield, Ban, Coins, Scale];

/* --- Status colour map --- */

function statusColor(status: DoshaProfile["classicalStatus"]) {
  if (status === "classical") return GREEN;
  if (status === "contested") return VERMILION;
  return AMBER;
}

function statusLabel(status: DoshaProfile["classicalStatus"]) {
  if (status === "classical") return "Classical";
  if (status === "contested") return "Contested / non-classical";
  return "Interpretive convention";
}

/* --- 8-step ladder SVG --- */

function StepLadder({ completed }: { completed: boolean[] }) {
  const w = 520;
  const h = 140;
  const steps = 8;
  const stepW = 52;
  const gap = 8;
  const startX = (w - (steps * stepW + (steps - 1) * gap)) / 2 + stepW / 2;
  const cy = 50;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" style={{ maxHeight: 100 }}>
      {/* Connecting line */}
      <line
        x1={startX}
        y1={cy}
        x2={startX + (steps - 1) * (stepW + gap)}
        y2={cy}
        stroke={HAIRLINE}
        strokeWidth={2}
        strokeDasharray="4 2"
      />

      {PROTOCOL_STEPS.map((step, i) => {
        const x = startX + i * (stepW + gap);
        const done = completed[i];
        const color = done ? GREEN : HAIRLINE;
        return (
          <g key={i}>
            <circle
              cx={x}
              cy={cy}
              r={18}
              fill={done ? `${GREEN}15` : SURFACE}
              stroke={color}
              strokeWidth={done ? 2.5 : 1.5}
            />
            <text
              x={x}
              y={cy + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={11}
              fontWeight={800}
              fill={done ? GREEN : INK_MUTED}
            >
              {step.num}
            </text>
            <text
              x={x}
              y={cy + 32}
              textAnchor="middle"
              fontSize={7}
              fontWeight={600}
              fill={done ? INK_SECONDARY : INK_MUTED}
            >
              {step.short}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* --- Main component --- */

export function DefearmongeringProtocol() {
  const [selectedDosha, setSelectedDosha] = useState<string>("manglik");
  const [completed, setCompleted] = useState<boolean[]>(Array(8).fill(false));
  const [showReframe, setShowReframe] = useState(false);

  const dosha = DOSHAS.find((d) => d.key === selectedDosha)!;
  const reframe = REFRAMES.find((r) => r.doshaKey === selectedDosha)!;
  const allDone = completed.every(Boolean);

  function toggleStep(i: number) {
    setCompleted((prev) => prev.map((v, j) => (j === i ? !v : v)));
  }

  function resetSteps() {
    setCompleted(Array(8).fill(false));
    setShowReframe(false);
  }

  const statusC = statusColor(dosha.classicalStatus);
  const statusL = statusLabel(dosha.classicalStatus);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Shield size={22} style={{ color: GREEN }} />
        <div>
          <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
            De-Fearmongering Protocol
          </h3>
          <p className="text-sm" style={{ color: INK_MUTED }}>
            Eight-step discipline for any doṣa. Pick a doṣa and walk the steps.
          </p>
        </div>
      </div>

      {/* Doṣa selector */}
      <div className="flex flex-wrap gap-2">
        {DOSHAS.map((d) => (
          <button
            key={d.key}
            onClick={() => {
              setSelectedDosha(d.key);
              resetSteps();
            }}
            className="px-3 py-1.5 rounded-md text-xs font-semibold transition-colors"
            style={{
              background: selectedDosha === d.key ? `${statusColor(d.classicalStatus)}12` : "transparent",
              border: `1.5px solid ${selectedDosha === d.key ? statusColor(d.classicalStatus) : HAIRLINE}`,
              color: selectedDosha === d.key ? statusColor(d.classicalStatus) : INK_SECONDARY,
            }}
          >
            <IAST>{d.label}</IAST>
          </button>
        ))}
      </div>

      {/* Selected doṣa header card */}
      <div
        className="rounded-lg p-4 space-y-2"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${statusC}` }}
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>
              <IAST>{dosha.label}</IAST>
            </h4>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: `${statusC}12`, color: statusC }}
            >
              {statusL}
            </span>
          </div>
          <button
            onClick={resetSteps}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold"
            style={{ background: "transparent", border: `1px solid ${HAIRLINE}`, color: INK_MUTED }}
          >
            <RotateCcw size={11} />
            Reset steps
          </button>
        </div>
        <p className="text-xs" style={{ color: INK_SECONDARY }}>{dosha.definition}</p>
        <p className="text-xs" style={{ color: INK_MUTED }}>Sources: {dosha.sources}</p>
      </div>

      {/* Progress ladder */}
      <div className="rounded-lg p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <StepLadder completed={completed} />
        <div className="text-center mt-1">
          <span className="text-xs font-semibold" style={{ color: allDone ? GREEN : INK_MUTED }}>
            {completed.filter(Boolean).length} / 8 steps checked
          </span>
        </div>
      </div>

      {/* 8-step cards */}
      <div className="space-y-2">
        {PROTOCOL_STEPS.map((step, i) => {
          const done = completed[i];
          const Icon = STEP_ICONS[i];
          let content = "";
          let borderColor = done ? GREEN : HAIRLINE;

          switch (i) {
            case 0:
              content = dosha.definition + " Source status: " + dosha.statusNote;
              borderColor = done ? GREEN : statusC;
              break;
            case 1:
              content = dosha.cancellations.join("; ");
              borderColor = done ? GREEN : VERMILION;
              break;
            case 2:
              content = dosha.honestHandling;
              borderColor = done ? GREEN : BLUE;
              break;
            case 3:
              content = `Reframe: "${dosha.reframe}"`;
              borderColor = done ? GREEN : AMBER;
              break;
            case 4:
              content = dosha.remedies;
              borderColor = done ? GREEN : GREEN;
              break;
            case 5:
              content = `Forbidden: ${dosha.catastropheExample}`;
              borderColor = done ? GREEN : VERMILION;
              break;
            case 6:
              content = dosha.fearFeeWarning;
              borderColor = done ? GREEN : VERMILION;
              break;
            case 7:
              content = "Doṣa-reading is the highest-vulnerability moment. Cross-reference Module 24 ethics. Integrity first.";
              borderColor = done ? GREEN : INK_MUTED;
              break;
          }

          return (
            <button
              key={i}
              onClick={() => toggleStep(i)}
              className="w-full text-left rounded-lg p-3.5 flex items-start gap-3 transition-colors"
              style={{
                background: done ? `${GREEN}06` : SURFACE,
                border: `1px solid ${borderColor}`,
                borderLeft: `3px solid ${borderColor}`,
              }}
            >
              <div className="mt-0.5 shrink-0">
                {done ? (
                  <CheckCircle2 size={16} style={{ color: GREEN }} />
                ) : (
                  <Icon size={16} style={{ color: borderColor }} />
                )}
              </div>
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold" style={{ color: done ? GREEN : INK_PRIMARY }}>
                    {step.num}. {step.title}
                  </span>
                  {done && (
                    <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: `${GREEN}12`, color: GREEN }}>
                      Done
                    </span>
                  )}
                </div>
                <div className="text-xs" style={{ color: INK_SECONDARY, lineHeight: 1.5 }}>
                  {content}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* All-done banner */}
      {allDone && (
        <div
          className="rounded-lg p-4 space-y-2"
          style={{ background: `${GREEN}08`, border: `1px solid ${GREEN}`, borderLeft: `4px solid ${GREEN}` }}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} style={{ color: GREEN }} />
            <span className="text-sm font-bold" style={{ color: GREEN }}>Protocol complete</span>
          </div>
          <p className="text-xs" style={{ color: INK_SECONDARY }}>
            All eight steps checked for <IAST>{dosha.label}</IAST>. You have applied the de-fearmongering discipline. Remember: cancellations come before effects, and a doṣa marks a domain needing attention -- never a doom.
          </p>
        </div>
      )}

      {/* Reframe exercise */}
      <div className="rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Heart size={16} style={{ color: AMBER }} />
            <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Reframe Exercise</h4>
          </div>
          <button
            onClick={() => setShowReframe((v) => !v)}
            className="px-2.5 py-1 rounded-md text-xs font-semibold"
            style={{ background: `${AMBER}10`, border: `1px solid ${AMBER}`, color: AMBER }}
          >
            {showReframe ? "Hide reframe" : "Show reframe"}
          </button>
        </div>

        <div className="rounded-md p-3 space-y-1" style={{ background: `${VERMILION}08`, border: `1px solid ${VERMILION}`, borderLeft: `3px solid ${VERMILION}` }}>
          <div className="text-xs font-bold" style={{ color: VERMILION }}>Fatalistic (what NOT to say):</div>
          <div className="text-xs" style={{ color: INK_SECONDARY }}>"{reframe.fatalistic}"</div>
        </div>

        {showReframe && (
          <div className="rounded-md p-3 space-y-1" style={{ background: `${GREEN}08`, border: `1px solid ${GREEN}`, borderLeft: `3px solid ${GREEN}` }}>
            <div className="text-xs font-bold" style={{ color: GREEN }}>Re-prioritised (what TO say):</div>
            <div className="text-xs" style={{ color: INK_SECONDARY }}>"{reframe.rePrioritised}"</div>
          </div>
        )}
      </div>

      {/* Ethics panel */}
      <div className="rounded-lg p-4 space-y-2" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${GREEN}` }}>
        <div className="flex items-center gap-2">
          <Scale size={16} style={{ color: GREEN }} />
          <span className="text-sm font-bold" style={{ color: GREEN }}>Ethics Connection (Module 24)</span>
        </div>
        <p className="text-xs" style={{ color: INK_SECONDARY }}>
          Doṣa readings are the <strong>highest-vulnerability</strong> moment in Jyotiṣa practice. Clients arrive frightened and suggestible.
          This protocol exists to remove the practitioner's power to harm -- by forcing cancellations to the front,
          banning catastrophe prediction, and forbidding fear/fee extraction. Module 24 develops the full ethics framework.
        </p>
      </div>

      {/* Common mistakes */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} style={{ color: AMBER }} />
          <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Common Mistakes</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { title: "Effects before cancellations", text: "Never state doom first, then check cancellations. Step 2 (cancellations) must precede any effect-talk." },
            { title: "Catastrophe prediction", text: "Never predict specific disaster from a doṣa. It is a domain marker, not a sentence." },
            { title: "Fear / fee extraction", text: "Never monetise doṣa fear. Remedies are constructive practice, not transactional fear-relief." },
          ].map((m, i) => (
            <div key={i} className="rounded-lg p-3 space-y-1.5" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `3px solid ${AMBER}` }}>
              <div className="text-xs font-bold" style={{ color: AMBER }}>{m.title}</div>
              <div className="text-xs" style={{ color: INK_SECONDARY }}>{m.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
