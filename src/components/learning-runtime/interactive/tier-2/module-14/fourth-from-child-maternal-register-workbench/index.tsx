"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  ArrowRightLeft,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Moon,
  RotateCcw,
  User,
  Venus,
} from "lucide-react";
import { workbenchDiagramLayoutStyle, workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type StepKey = 1 | 2 | 3 | 4 | 5;
type StatementKey = "clean" | "manufacture" | "overstate";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const VERMILION = "var(--gl-vermilion-accent)";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";
const GOLD = "#B88421";

const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
const SIGN_SHORT = ["Ar", "Ta", "Ge", "Ca", "Le", "Vi", "Li", "Sc", "Sg", "Cp", "Aq", "Pi"];
const SIGN_COLORS = [
  "#A23A1E", GOLD, GREEN, BLUE, "#A23A1E", GOLD,
  GREEN, BLUE, "#A23A1E", GOLD, GREEN, BLUE,
];

const CHANDRA_LAGNA = 10; // Aquarius
const FOURTH_HOUSE = 1; // Taurus

const STEPS = [
  { key: 1, title: "Count the 4th house", color: BLUE },
  { key: 2, title: "Identify the occupant", color: GOLD },
  { key: 3, title: "Intra-chart convergence", color: PURPLE },
  { key: 4, title: "Cross-reference Bhavna", color: GREEN },
  { key: 5, title: "Honest statement", color: ACCENT },
];

export function FourthFromChildMaternalRegisterWorkbench() {
  const [step, setStep] = useState<StepKey>(1);
  const [countIndex, setCountIndex] = useState(0);
  const [moonKarakaToggle, setMoonKarakaToggle] = useState(false);
  const [venusConvergenceToggle, setVenusConvergenceToggle] = useState(false);
  const [crossComparison, setCrossComparison] = useState<"same" | "different" | null>(null);
  const [statement, setStatement] = useState<StatementKey | null>(null);

  const reset = () => {
    setStep(1);
    setCountIndex(0);
    setMoonKarakaToggle(false);
    setVenusConvergenceToggle(false);
    setCrossComparison(null);
    setStatement(null);
  };

  const canAdvance = () => {
    if (step === 1) return countIndex === 3;
    if (step === 2) return true;
    if (step === 3) return moonKarakaToggle && !venusConvergenceToggle;
    if (step === 4) return crossComparison === "different";
    if (step === 5) return statement === "clean";
    return true;
  };

  const advance = () => {
    if (step < 5) setStep((s) => ((s + 1) as StepKey));
  };

  const back = () => {
    if (step > 1) setStep((s) => ((s - 1) as StepKey));
  };

  const stepMeta = STEPS[step - 1];

  return (
    <section
      className="rounded-lg border"
      style={{
        borderColor: HAIRLINE,
        background: "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(247,244,238,0.85) 100%)",
      }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b" style={{ borderColor: HAIRLINE }}>
        <div className="flex items-center gap-2 text-sm" style={{ color: INK_MUTED }}>
          <GraduationCap size={16} style={{ color: ACCENT }} />
          <span style={{ fontWeight: 600 }}>Lesson 14.3.3</span>
          <span>•</span>
          <span>The 4th-from-Child as Maternal Register</span>
        </div>
        <h3 className="mt-2 text-xl" style={{ color: INK_PRIMARY, fontWeight: 700 }}>
          Maternal register workbench
        </h3>
        <p className="mt-1 text-sm" style={{ color: INK_SECONDARY }}>
          Compute the child&apos;s own 4th house, read its occupant, and report what is actually there — including genuine simplicity.
        </p>
      </div>

      {/* Stepper */}
      <div className="px-5 py-4">
        <div className="flex flex-wrap items-center gap-2">
          {STEPS.map((s) => {
            const active = s.key === step;
            const completed = s.key < step;
            return (
              <button
                key={s.key}
                onClick={() => setStep(s.key as StepKey)}
                className="flex items-center gap-2 rounded px-3 py-1.5 text-xs transition-colors"
                style={{
                  background: active ? `${s.color}15` : completed ? `${s.color}10` : SURFACE,
                  border: `1px solid ${active ? s.color : HAIRLINE}`,
                  color: active ? s.color : completed ? INK_PRIMARY : INK_SECONDARY,
                  fontWeight: 600,
                }}
              >
                <span
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px]"
                  style={{
                    background: active || completed ? s.color : HAIRLINE,
                    color: "#fff",
                    fontWeight: 700,
                  }}
                >
                  {completed ? "✓" : s.key}
                </span>
                {s.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Body */}
      <div className="px-5 pb-6">
        {step === 1 && (
          <StepOneCount
            countIndex={countIndex}
            setCountIndex={setCountIndex}
          />
        )}
        {step === 2 && (
          <StepTwoOccupant />
        )}
        {step === 3 && (
          <StepThreeIntraChart
            moonKarakaToggle={moonKarakaToggle}
            setMoonKarakaToggle={setMoonKarakaToggle}
            venusConvergenceToggle={venusConvergenceToggle}
            setVenusConvergenceToggle={setVenusConvergenceToggle}
          />
        )}
        {step === 4 && (
          <StepFourCrossReference
            crossComparison={crossComparison}
            setCrossComparison={setCrossComparison}
          />
        )}
        {step === 5 && (
          <StepFiveStatement
            statement={statement}
            setStatement={setStatement}
          />
        )}
      </div>

      {/* Footer controls */}
      <div
        className="flex items-center justify-between border-t px-5 py-4"
        style={{ borderColor: HAIRLINE }}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={back}
            disabled={step === 1}
            className="flex items-center gap-1 rounded px-3 py-2 text-sm transition-colors disabled:opacity-40"
            style={{ background: SURFACE, color: INK_PRIMARY, fontWeight: 600, border: `1px solid ${HAIRLINE}` }}
          >
            <ChevronLeft size={16} />
            Back
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-1 rounded px-3 py-2 text-sm transition-colors"
            style={{ background: SURFACE, color: INK_SECONDARY, fontWeight: 600, border: `1px solid ${HAIRLINE}` }}
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
        {step < 5 ? (
          <button
            onClick={advance}
            disabled={!canAdvance()}
            className="flex items-center gap-1 rounded px-4 py-2 text-sm text-white transition-colors disabled:opacity-50"
            style={{ background: stepMeta.color, fontWeight: 600 }}
          >
            Next
            <ChevronRight size={16} />
          </button>
        ) : (
          <div className="flex items-center gap-2 rounded px-4 py-2 text-sm" style={{ background: `${GREEN}15`, color: GREEN, border: `1px solid ${GREEN}`, fontWeight: 600 }}>
            <BadgeCheck size={16} />
            Workbench complete
          </div>
        )}
      </div>
    </section>
  );
}

function StepOneCount({ countIndex, setCountIndex }: { countIndex: number; setCountIndex: (n: number) => void }) {
  const positions = [10, 11, 0, 1].slice(0, countIndex + 1);

  return (
    <div style={workbenchDiagramLayoutStyle as CSSProperties}>
      <div
        className="rounded-lg border p-4"
        style={{ background: SURFACE, borderColor: HAIRLINE }}
      >
        <div className="mb-3 text-sm" style={{ color: INK_SECONDARY, fontWeight: 600 }}>
          Count 4 signs from Chandra&apos;s Lagna
        </div>
        <ZodiacStepWheel
          lagnaIndex={CHANDRA_LAGNA}
          highlighted={positions}
          targetIndex={FOURTH_HOUSE}
        />
        <div className="mt-3 flex items-center justify-between text-sm" style={{ color: INK_MUTED }}>
          <span>Lagna: {SIGNS[CHANDRA_LAGNA]}</span>
          <span>Step: {countIndex}/3</span>
        </div>
      </div>

      <div className="space-y-3">
        <div
          className="rounded-lg border p-4"
          style={{ background: SURFACE, borderColor: HAIRLINE }}
        >
          <div className="text-sm" style={{ color: INK_PRIMARY, fontWeight: 700 }}>
            Count forward one sign at a time
          </div>
          <p className="mt-1 text-sm" style={{ color: INK_SECONDARY }}>
            Start at Aquarius (1). Click &quot;Next sign&quot; until you land on the 4th house.
          </p>
          <button
            onClick={() => setCountIndex(Math.min(countIndex + 1, 3))}
            disabled={countIndex >= 3}
            className="mt-3 flex items-center gap-1 rounded px-3 py-2 text-sm text-white transition-colors disabled:opacity-50"
            style={{ background: BLUE, fontWeight: 600 }}
          >
            <ChevronRight size={16} />
            {countIndex === 0 ? "Start at Lagna" : "Next sign"}
          </button>
          {countIndex === 3 && (
            <div className="mt-3 flex items-start gap-2 rounded p-3 text-sm" style={{ background: `${BLUE}10`, color: BLUE, border: `1px solid ${BLUE}` }}>
              <BadgeCheck size={16} className="mt-0.5 shrink-0" />
              <span>
                4th house = <strong>Taurus</strong>. Aquarius(1) → Pisces(2) → Aries(3) → Taurus(4).
              </span>
            </div>
          )}
        </div>

        <div
          className="rounded-lg border p-4"
          style={{ background: SURFACE, borderColor: HAIRLINE }}
        >
          <div className="text-sm" style={{ color: INK_PRIMARY, fontWeight: 700 }}>
            Why the 4th?
          </div>
          <p className="mt-1 text-sm" style={{ color: INK_SECONDARY }}>
            The 4th house is the classical seat of the mother. Reading it from the child&apos;s own Lagna gives the child&apos;s own maternal register.
          </p>
        </div>
      </div>
    </div>
  );
}

function StepTwoOccupant() {
  return (
    <div style={workbenchDiagramLayoutStyle as CSSProperties}>
      <div
        className="rounded-lg border p-4"
        style={{ background: SURFACE, borderColor: HAIRLINE }}
      >
        <div className="mb-3 text-sm" style={{ color: INK_SECONDARY, fontWeight: 600 }}>
          Chandra&apos;s 4th house: Taurus
        </div>
        <HouseOccupantCard />
      </div>

      <div className="space-y-3">
        <div
          className="rounded-lg border p-4"
          style={{ background: SURFACE, borderColor: HAIRLINE }}
        >
          <div className="text-sm" style={{ color: INK_PRIMARY, fontWeight: 700 }}>
            Occupant: Venus in Taurus
          </div>
          <p className="mt-1 text-sm" style={{ color: INK_SECONDARY }}>
            Venus rules Taurus, so this is an <strong style={{ color: GOLD }}>own-sign</strong> placement — dignified and uncomplicated.
          </p>
        </div>

        <MiniFact
          icon={<Venus size={18} style={{ color: GOLD }} />}
          label="Venus"
          value="Own sign in Taurus"
          description="No debilitation, no affliction, no cancellation question."
          tone="good"
        />
      </div>
    </div>
  );
}

function StepThreeIntraChart({
  moonKarakaToggle,
  setMoonKarakaToggle,
  venusConvergenceToggle,
  setVenusConvergenceToggle,
}: {
  moonKarakaToggle: boolean;
  setMoonKarakaToggle: (v: boolean) => void;
  venusConvergenceToggle: boolean;
  setVenusConvergenceToggle: (v: boolean) => void;
}) {
  return (
    <div style={workbenchTwoColumnStyle as CSSProperties}>
      <div
        className="rounded-lg border p-4"
        style={{ background: SURFACE, borderColor: HAIRLINE }}
      >
        <div className="text-sm" style={{ color: INK_PRIMARY, fontWeight: 700 }}>
          Is there an intra-chart karaka-bhava convergence?
        </div>
        <p className="mt-1 text-sm" style={{ color: INK_SECONDARY }}>
          A karaka-bhava convergence happens when a house&apos;s natural significator occupies that same house in the same chart. The 4th house signifies mother; the natural mother-kāraka is the Moon.
        </p>
        <div className="mt-4 space-y-3">
          <ToggleChip
            active={moonKarakaToggle}
            onClick={() => setMoonKarakaToggle(!moonKarakaToggle)}
            label="The Moon is the natural mother-kāraka"
            color={GREEN}
          />
          <ToggleChip
            active={venusConvergenceToggle}
            onClick={() => setVenusConvergenceToggle(!venusConvergenceToggle)}
            label="Venus in the 4th creates an intra-chart convergence"
            color={VERMILION}
          />
        </div>
        {venusConvergenceToggle && (
          <div className="mt-4 flex items-start gap-2 rounded p-3 text-sm" style={{ background: `${VERMILION}10`, color: VERMILION, border: `1px solid ${VERMILION}` }}>
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            <span>
              Not quite. Venus is not the mother-kāraka; the Moon is. The occupant is dignified, but there is no intra-chart karaka-bhava convergence here.
            </span>
          </div>
        )}
        {moonKarakaToggle && !venusConvergenceToggle && (
          <div className="mt-4 flex items-start gap-2 rounded p-3 text-sm" style={{ background: `${GREEN}10`, color: GREEN, border: `1px solid ${GREEN}` }}>
            <BadgeCheck size={16} className="mt-0.5 shrink-0" />
            <span>
              Correct. Note the absence explicitly: no intra-chart convergence because Venus is not the mother-kāraka.
            </span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <MiniFact
          icon={<Moon size={18} style={{ color: GREEN }} />}
          label="Mother-kāraka"
          value="Moon"
          description="The Moon signifies mother, nurture, and emotional home."
          tone="good"
        />
        <MiniFact
          icon={<Venus size={18} style={{ color: GOLD }} />}
          label="Occupant of Chandra's 4th"
          value="Venus"
          description="Venus is the occupant, not the mother-kāraka."
          tone="neutral"
        />
      </div>
    </div>
  );
}

function StepFourCrossReference({
  crossComparison,
  setCrossComparison,
}: {
  crossComparison: "same" | "different" | null;
  setCrossComparison: (v: "same" | "different") => void;
}) {
  return (
    <div style={workbenchDiagramLayoutStyle as CSSProperties}>
      <div
        className="rounded-lg border p-4"
        style={{ background: SURFACE, borderColor: HAIRLINE }}
      >
        <div className="mb-3 text-sm" style={{ color: INK_SECONDARY, fontWeight: 600 }}>
          Cross-chart comparison
        </div>
        <CrossChartDiagram />
      </div>

      <div className="space-y-3">
        <div
          className="rounded-lg border p-4"
          style={{ background: SURFACE, borderColor: HAIRLINE }}
        >
          <div className="text-sm" style={{ color: INK_PRIMARY, fontWeight: 700 }}>
            Bhavna&apos;s Moon in Taurus
          </div>
          <p className="mt-1 text-sm" style={{ color: INK_SECONDARY }}>
            Bhavna&apos;s own Moon — the natural mother-kāraka — occupies Taurus, where it is <strong style={{ color: GREEN }}>exalted</strong>. Taurus is exactly Chandra&apos;s 4th-house sign.
          </p>
        </div>

        <MiniFact
          icon={<Moon size={18} style={{ color: GREEN }} />}
          label="Bhavna's Moon"
          value="Exalted in Taurus"
          description="Strongest possible classical dignity for the mother-kāraka."
          tone="good"
        />

        <div
          className="rounded-lg border p-4"
          style={{ background: SURFACE, borderColor: HAIRLINE }}
        >
          <div className="text-sm" style={{ color: INK_PRIMARY, fontWeight: 700 }}>
            Same mechanism as Lesson 14.3.2?
          </div>
          <div className="mt-3 flex flex-col gap-2">
            <ToggleChip
              active={crossComparison === "same"}
              onClick={() => setCrossComparison("same")}
              label="Same mechanism"
              color={VERMILION}
            />
            <ToggleChip
              active={crossComparison === "different"}
              onClick={() => setCrossComparison("different")}
              label="Different mechanism"
              color={GREEN}
            />
          </div>
          {crossComparison === "same" && (
            <div className="mt-3 flex items-start gap-2 rounded p-3 text-sm" style={{ background: `${VERMILION}10`, color: VERMILION, border: `1px solid ${VERMILION}` }}>
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              <span>
                Lesson 14.3.2 showed an intra-chart convergence: the same chart&apos;s significator in the same chart&apos;s house. Here the mother-kāraka is in a different chart — this is cross-chart.
              </span>
            </div>
          )}
          {crossComparison === "different" && (
            <div className="mt-3 flex items-start gap-2 rounded p-3 text-sm" style={{ background: `${GREEN}10`, color: GREEN, border: `1px solid ${GREEN}` }}>
              <BadgeCheck size={16} className="mt-0.5 shrink-0" />
              <span>
                Correct. Intra-chart and cross-chart convergence are structurally different and must be named separately.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StepFiveStatement({
  statement,
  setStatement,
}: {
  statement: StatementKey | null;
  setStatement: (v: StatementKey) => void;
}) {
  const options: { key: StatementKey; label: string; verdict: "correct" | "wrong"; note: string }[] = [
    {
      key: "clean",
      label: "Clean, dignified maternal register with a strong cross-chart contact — no artificial complexity added.",
      verdict: "correct",
      note: "This reports exactly what is present and exactly what is absent.",
    },
    {
      key: "manufacture",
      label: "The finding seems too easy; I should search for a hidden affliction to be thorough.",
      verdict: "wrong",
      note: "Thoroughness means checking honestly, not requiring complexity to be found.",
    },
    {
      key: "overstate",
      label: "Bhavna's exalted Moon proves an idealised, conflict-free mother-child relationship.",
      verdict: "wrong",
      note: "One strong finding does not stand in for the complete picture.",
    },
  ];

  return (
    <div style={workbenchTwoColumnStyle as CSSProperties}>
      <div
        className="rounded-lg border p-4"
        style={{ background: SURFACE, borderColor: HAIRLINE }}
      >
        <div className="text-sm" style={{ color: INK_PRIMARY, fontWeight: 700 }}>
          Choose the honestly-scoped statement
        </div>
        <p className="mt-1 text-sm" style={{ color: INK_SECONDARY }}>
          Select the conclusion that reports the finding at the right confidence level.
        </p>
        <div className="mt-4 space-y-3">
          {options.map((opt) => {
            const selected = statement === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => setStatement(opt.key)}
                className="w-full rounded-lg border p-3 text-left text-sm transition-colors"
                style={{
                  background: selected ? (opt.verdict === "correct" ? `${GREEN}10` : `${VERMILION}10`) : SURFACE,
                  borderColor: selected ? (opt.verdict === "correct" ? GREEN : VERMILION) : HAIRLINE,
                  color: INK_PRIMARY,
                }}
              >
                <div className="flex items-start gap-2">
                  <span
                    className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs"
                    style={{
                      background: selected ? (opt.verdict === "correct" ? GREEN : VERMILION) : HAIRLINE,
                      color: "#fff",
                      fontWeight: 700,
                    }}
                  >
                    {selected ? (opt.verdict === "correct" ? "✓" : "×") : "○"}
                  </span>
                  <span style={{ fontWeight: 500 }}>{opt.label}</span>
                </div>
                {selected && (
                  <div
                    className="mt-2 rounded p-2 text-xs"
                    style={{
                      background: opt.verdict === "correct" ? `${GREEN}15` : `${VERMILION}15`,
                      color: opt.verdict === "correct" ? GREEN : VERMILION,
                    }}
                  >
                    {opt.note}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <div
          className="rounded-lg border p-4"
          style={{ background: SURFACE, borderColor: HAIRLINE }}
        >
          <div className="text-sm" style={{ color: INK_PRIMARY, fontWeight: 700 }}>
            Final maternal-register finding
          </div>
          <ul className="mt-2 space-y-2 text-sm" style={{ color: INK_SECONDARY }}>
            <li className="flex items-start gap-2">
              <span style={{ color: BLUE }}>•</span>
              <span>Chandra&apos;s 4th house is <strong>Taurus</strong>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: GOLD }}>•</span>
              <span><strong>Own-sign Venus</strong> occupies it — dignified.</span>
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: PURPLE }}>•</span>
              <span>No intra-chart karaka-bhava convergence (Venus is not the mother-kāraka).</span>
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: GREEN }}>•</span>
              <span>Cross-chart: Bhavna&apos;s exalted Moon in Taurus.</span>
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: ACCENT }}>•</span>
              <span>One of four findings this chapter assembles.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function ZodiacStepWheel({
  lagnaIndex,
  highlighted,
  targetIndex,
}: {
  lagnaIndex: number;
  highlighted: number[];
  targetIndex: number;
}) {
  const radius = 90;
  const center = 110;
  const stepLabels = ["Lagna", "2nd", "3rd", "4th"];

  return (
    <svg viewBox="0 0 220 220" className="mx-auto h-auto w-full max-w-[260px]">
      <circle cx={center} cy={center} r={radius} fill="none" stroke={HAIRLINE} strokeWidth={1.5} />
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x1 = center + radius * 0.72 * Math.cos(angle);
        const y1 = center + radius * 0.72 * Math.sin(angle);
        const x2 = center + radius * Math.cos(angle);
        const y2 = center + radius * Math.sin(angle);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={HAIRLINE} strokeWidth={1} />;
      })}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const isLagna = i === lagnaIndex;
        const isHighlighted = highlighted.includes(i);
        const isTarget = i === targetIndex;
        const isMarked = isLagna || isHighlighted || isTarget;
        const labelRadius = isMarked ? radius * 0.45 : radius * 0.55;
        const x = center + labelRadius * Math.cos(angle);
        const y = center + labelRadius * Math.sin(angle);
        const cx = center + radius * 0.45 * Math.cos(angle);
        const cy = center + radius * 0.45 * Math.sin(angle);
        return (
          <g key={i}>
            {isMarked && (
              <circle
                cx={cx}
                cy={cy}
                r={14}
                fill={isLagna ? BLUE : isTarget ? GREEN : `${SIGN_COLORS[i]}20`}
                stroke={isLagna ? BLUE : isTarget ? GREEN : SIGN_COLORS[i]}
                strokeWidth={isLagna || isTarget ? 2 : 1}
              />
            )}
            <text
              x={x}
              y={y + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={11}
              fontWeight={600}
              fill={isLagna || isTarget ? "#fff" : INK_PRIMARY}
            >
              {SIGN_SHORT[i]}
            </text>
          </g>
        );
      })}
      {highlighted.map((idx, i) => {
        const angle = (idx * 30 - 90) * (Math.PI / 180);
        const x = center + (radius + 22) * Math.cos(angle);
        const y = center + (radius + 22) * Math.sin(angle);
        return (
          <text
            key={`label-${idx}`}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={9}
            fontWeight={600}
            fill={idx === targetIndex ? GREEN : INK_SECONDARY}
          >
            {stepLabels[i] || ""}
          </text>
        );
      })}
    </svg>
  );
}

function HouseOccupantCard() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border p-5" style={{ background: SURFACE, borderColor: HAIRLINE }}>
      <div className="text-center">
        <div className="text-xs uppercase tracking-wide" style={{ color: INK_MUTED, fontWeight: 700 }}>
          4th house
        </div>
        <div className="mt-1 text-2xl" style={{ color: GREEN, fontWeight: 700 }}>
          Taurus
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ background: `${GOLD}15`, border: `2px solid ${GOLD}` }}>
          <Venus size={24} style={{ color: GOLD }} />
        </div>
        <div>
          <div className="text-sm" style={{ color: INK_PRIMARY, fontWeight: 600 }}>
            Venus
          </div>
          <div className="text-xs" style={{ color: INK_SECONDARY }}>
            Own sign • dignified
          </div>
        </div>
      </div>
      <div className="text-center text-xs" style={{ color: INK_MUTED }}>
        No debilitation • no affliction • no cancellation needed
      </div>
    </div>
  );
}

function CrossChartDiagram() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 rounded-lg border p-3" style={{ background: SURFACE, borderColor: HAIRLINE }}>
        <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: `${BLUE}15`, border: `2px solid ${BLUE}` }}>
          <User size={20} style={{ color: BLUE }} />
        </div>
        <div className="flex-1">
          <div className="text-sm" style={{ color: INK_PRIMARY, fontWeight: 600 }}>Chandra (child)</div>
          <div className="text-xs" style={{ color: INK_SECONDARY }}>4th house = Taurus</div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs" style={{ color: INK_MUTED }}>
        <span>Taurus contact</span>
        <ArrowRightLeft size={14} style={{ color: ACCENT }} />
        <span>Cross-chart</span>
      </div>

      <div className="flex items-center gap-3 rounded-lg border p-3" style={{ background: SURFACE, borderColor: HAIRLINE }}>
        <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: `${GREEN}15`, border: `2px solid ${GREEN}` }}>
          <Moon size={20} style={{ color: GREEN }} />
        </div>
        <div className="flex-1">
          <div className="text-sm" style={{ color: INK_PRIMARY, fontWeight: 600 }}>Bhavna (mother)</div>
          <div className="text-xs" style={{ color: INK_SECONDARY }}>Moon exalted in Taurus • mother-kāraka</div>
        </div>
      </div>
    </div>
  );
}

function MiniFact({
  icon,
  label,
  value,
  description,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
  tone: "good" | "neutral" | "warn";
}) {
  const color = tone === "good" ? GREEN : tone === "warn" ? VERMILION : ACCENT;
  return (
    <div className="flex items-start gap-3 rounded-lg border p-3" style={{ background: SURFACE, borderColor: HAIRLINE }}>
      <div className="mt-0.5">{icon}</div>
      <div className="flex-1">
        <div className="text-xs uppercase tracking-wide" style={{ color: INK_MUTED, fontWeight: 700 }}>{label}</div>
        <div className="text-sm" style={{ color, fontWeight: 600 }}>{value}</div>
        <div className="text-xs" style={{ color: INK_SECONDARY }}>{description}</div>
      </div>
    </div>
  );
}

function ToggleChip({
  active,
  onClick,
  label,
  color,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg border p-3 text-left text-sm transition-colors"
      style={{
        background: active ? `${color}10` : SURFACE,
        borderColor: active ? color : HAIRLINE,
        color: INK_PRIMARY,
      }}
    >
      <span
        className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded text-xs"
        style={{
          background: active ? color : HAIRLINE,
          color: "#fff",
          fontWeight: 700,
        }}
      >
        {active ? "✓" : "○"}
      </span>
      <span style={{ fontWeight: 500 }}>{label}</span>
    </button>
  );
}
