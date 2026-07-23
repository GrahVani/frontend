"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Compass,
  MapPinned,
  Network,
  RotateCcw,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type SkillKey = "cascade" | "texture" | "cusp" | "cross" | "conditional";
type StopKey = "clock" | "cusps" | "formula" | "ranking" | "conditionals" | "ashtottari";
type VerifyKey = "gap" | "genuine" | "inconsistency";
type PluralismChoice = "favourite" | "all" | "every" | null;
type MistakeKey = "checklist" | "unreliable" | "meta";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const AMBER = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";
const TEAL = "#2E7D7A";
const GOLD_TINT = "#FFF8E8";
const GREEN_TINT = "#EAF4EE";
const BLUE_TINT = "#EAF0F8";
const VERMILION_TINT = "#FDEBE6";
const PURPLE_TINT = "#F1EEFA";
const TEAL_TINT = "#EAF6F5";
const MUTED_TINT = "#F4EFE4";

const SKILLS: Record<SkillKey, { label: string; chapter: string; icon: ReactNode; color: string; body: string; kavyaUse: string }> = {
  cascade: {
    label: "Cascade fluency",
    chapter: "Chapter 1",
    icon: <Compass size={18} aria-hidden="true" />,
    color: BLUE,
    body: "Move from mahādaśā to the sub-period level the question actually warrants, without stopping too coarse or chasing precision the birth data cannot support.",
    kavyaUse: "Needed to know which antardaśās in Kavya's Moon mahādaśā were even in play for the marriage question.",
  },
  texture: {
    label: "Relationship-texture reading",
    chapter: "Chapter 2",
    icon: <Scale size={18} aria-hidden="true" />,
    color: GREEN,
    body: "Read the friendly, neutral, or hostile relationship between a period's lord and the mahādaśā it sits inside; texture qualifies a period without determining its outcome.",
    kavyaUse: "Qualified each antardaśā's flavour (Mitra, Sama, Shatru) without turning texture alone into a prediction.",
  },
  cusp: {
    label: "Cusp-interplay awareness",
    chapter: "Chapter 3",
    icon: <MapPinned size={18} aria-hidden="true" />,
    color: AMBER,
    body: "Check whether a period's lord aspects, occupies, or owns the house relevant to the question — three different relationships worth checking separately.",
    kavyaUse: "Identified which lords reached the 7th cusp and which did not.",
  },
  cross: {
    label: "Cross-system corroboration",
    chapter: "Chapter 4",
    icon: <Network size={18} aria-hidden="true" />,
    color: PURPLE,
    body: "Run a second, architecturally independent daśā system alongside the first and honestly report convergence or divergence.",
    kavyaUse: "Brought in Cara and Sthira Jaimini daśās as independent voices on the marriage question.",
  },
  conditional: {
    label: "Conditional-daśā selection",
    chapter: "Chapter 5",
    icon: <ShieldCheck size={18} aria-hidden="true" />,
    color: TEAL,
    body: "Know when a further classical system might apply, and hold that knowledge at exactly the depth the evidence supports.",
    kavyaUse: "Checked Aṣṭottarī's disputed trigger and Yoginī's condition-free starting period without inventing exact age-timelines.",
  },
};

const SKILL_ORDER: SkillKey[] = ["cascade", "texture", "cusp", "cross", "conditional"];

const STOPS: Record<StopKey, { label: string; releasedText: string }> = {
  clock: {
    label: "Refuse clock-time precision the birth data cannot support",
    releasedText: "Warning: pretending a daśā predicts a single moment borrows precision from a different technique.",
  },
  cusps: {
    label: "Refuse fabricated Placidus / KP cuspal data the chart design does not carry",
    releasedText: "Warning: inventing cuspal precision produces false structural matches.",
  },
  formula: {
    label: "Refuse an antar-rāśi formula the source does not supply",
    releasedText: "Warning: filling a missing formula with an unverified rule exceeds honest reach.",
  },
  ranking: {
    label: "Refuse to force an undecidable Chāra Kāraka ranking",
    releasedText: "Warning: forcing a tie past the point the data supports corrupts every role downstream.",
  },
  conditionals: {
    label: "Refuse to compute five conditional daśās beyond recognition depth",
    releasedText: "Warning: computing systems whose precise rules are not verified invents false authority.",
  },
  ashtottari: {
    label: "Refuse to resolve Aṣṭottarī's genuinely disputed trigger to one answer",
    releasedText: "Warning: choosing one disputed reading silently hides genuine textual variance.",
  },
};

const VERIFY_FACTS: Record<VerifyKey, { label: string; finding: string; falseGeneralisation: string }> = {
  gap: {
    label: "Confirmed gap",
    finding: "T1-10 Chapters 3-4 are unauthored in this module's verified sources.",
    falseGeneralisation: "Wrong move: concluding the whole of T1-10 is unreliable from this one gap.",
  },
  genuine: {
    label: "Verified genuine",
    finding: "T1-10 Chapters 5-7, T1-16, and T1-17 Chapter 6 were found genuinely real by direct verification.",
    falseGeneralisation: "Wrong move: assuming these were reliable without checking, just because the source is classical.",
  },
  inconsistency: {
    label: "Internal inconsistency",
    finding: "Two internal discrepancies were found (overview vs T1-16 source; T1-10 forward-reference not fulfilled in T1-17).",
    falseGeneralisation: "Wrong move: smoothing over the rough edges to protect a polished conclusion.",
  },
};

const PLURALISM_OPTIONS: { id: PluralismChoice; label: string; ok: boolean; feedback: string }[] = [
  { id: "favourite", label: "Pick the one system I trust most and ignore the rest", ok: false, feedback: "This treats abundance as a problem to solve by preference, not complementarity used with discipline." },
  { id: "all", label: "Use every system the actual evidence warrants, and no more", ok: true, feedback: "Correct: doctrinal pluralism means disciplined use of exactly what the chart and sources support." },
  { id: "every", label: "Run all available systems on every question to be thorough", ok: false, feedback: "This mistakes abundance for a compulsory checklist; not every question needs every system." },
];

const OPEN_GAPS = [
  "Verified antar-rāśi formula",
  "Aṣṭottarī / Yoginī birth-balance calculation",
  "Five recognition-level conditionals' precise conditions",
  "Upapada Lagna treatment",
  "Rāśi-dṛṣṭi and argalā specific rule-sets",
  "T1-10's unfulfilled Sthira Daśā cross-reference",
];

const MISTAKES: Record<MistakeKey, { label: string; heldText: string; releasedText: string }> = {
  checklist: {
    label: "The five skills are not a fixed checklist for every chart",
    heldText: "Held: they are deployed as a specific question needs, as Kavya's marriage question required all five.",
    releasedText: "Warning: mechanically running every technique on every question is procedure, not literacy.",
  },
  unreliable: {
    label: "Disclosed limits are not evidence the tradition is unreliable",
    heldText: "Held: honest limits are a sign of disciplined use of a rich tradition.",
    releasedText: "Warning: a high density of disclosure can be misread as a high density of defect.",
  },
  meta: {
    label: "Citation-honesty conduct is part of literacy, not meta-commentary",
    heldText: "Held: checking rather than assuming, in both directions, is a core skill.",
    releasedText: "Warning: separating technical computation from source honesty leaves the bar incomplete.",
  },
};

export function DashaPermutationsLiteracyExplorer() {
  const [activeSkill, setActiveSkill] = useState<SkillKey>("cascade");
  const [stops, setStops] = useState<Record<StopKey, boolean>>({
    clock: true, cusps: true, formula: true, ranking: true, conditionals: true, ashtottari: true,
  });
  const [verified, setVerified] = useState<Record<VerifyKey, boolean>>({ gap: false, genuine: false, inconsistency: false });
  const [pluralism, setPluralism] = useState<PluralismChoice>(null);
  const [namedGaps, setNamedGaps] = useState<boolean[]>(new Array(OPEN_GAPS.length).fill(false));
  const [mistakes, setMistakes] = useState<Record<MistakeKey, boolean>>({
    checklist: true, unreliable: true, meta: true,
  });

  const allStopsHeld = Object.values(stops).every(Boolean);
  const allMistakesHeld = Object.values(mistakes).every(Boolean);
  const allGapsNamed = namedGaps.every(Boolean);

  function reset() {
    setActiveSkill("cascade");
    setStops({ clock: true, cusps: true, formula: true, ranking: true, conditionals: true, ashtottari: true });
    setVerified({ gap: false, genuine: false, inconsistency: false });
    setPluralism(null);
    setNamedGaps(new Array(OPEN_GAPS.length).fill(false));
    setMistakes({ checklist: true, unreliable: true, meta: true });
  }

  function toggleGap(index: number) {
    setNamedGaps((g) => {
      const next = [...g];
      next[index] = !next[index];
      return next;
    });
  }

  return (
    <div data-interactive="dasha-permutations-literacy-explorer" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Module 18 closing essay</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              The daśā-permutations literacy explorer
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Literacy is not a checklist. It is five skills held together, the discipline to stop where the evidence ends, the habit of checking rather than assuming, and the steadiness to leave what is genuinely open named precisely.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 480px" }}>
          <p style={eyebrowStyle}>Five skills, one practitioner</p>
          <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
            Click a skill to see how it was needed for Kavya&apos;s marriage question
          </h3>
          <SkillConstellationSvg active={activeSkill} onSelect={setActiveSkill} />
          <div
            style={{
              marginTop: "0.75rem",
              padding: "0.75rem",
              borderRadius: 8,
              border: `1px solid ${SKILLS[activeSkill].color}`,
              background: tintForColor(SKILLS[activeSkill].color),
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: SKILLS[activeSkill].color, fontWeight: 600 }}>
              {SKILLS[activeSkill].icon} {SKILLS[activeSkill].label} — {SKILLS[activeSkill].chapter}
            </div>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{SKILLS[activeSkill].body}</p>
            <p style={{ margin: "0.45rem 0 0", color: INK_MUTED, lineHeight: 1.55 }}>On Kavya&apos;s question: {SKILLS[activeSkill].kavyaUse}</p>
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 320px" }}>
          <Panel title="Doctrinal pluralism" icon={<Scale size={18} />} color={PURPLE}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
              T1-10 10.7.5 named roughly fourteen daśā systems. Their abundance is complementarity, not confusion — provided a practitioner uses them with discipline.
            </p>
            <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.75rem" }}>
              {PLURALISM_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  aria-pressed={pluralism === opt.id}
                  onClick={() => setPluralism(opt.id)}
                  style={scenarioButtonStyle(pluralism === opt.id, opt.ok ? GREEN : VERMILION)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {pluralism && (
              <div
                style={{
                  marginTop: "0.65rem",
                  padding: "0.55rem 0.75rem",
                  borderRadius: 8,
                  background: PLURALISM_OPTIONS.find((o) => o.id === pluralism)?.ok ? GREEN_TINT : VERMILION_TINT,
                  border: `1px solid ${PLURALISM_OPTIONS.find((o) => o.id === pluralism)?.ok ? GREEN : VERMILION}`,
                  color: PLURALISM_OPTIONS.find((o) => o.id === pluralism)?.ok ? GREEN : VERMILION,
                }}
              >
                {PLURALISM_OPTIONS.find((o) => o.id === pluralism)?.feedback}
              </div>
            )}
          </Panel>
        </section>
      </div>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "1 1 420px" }}>
          <p style={eyebrowStyle}>Knowing when to stop</p>
          <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
            Each refusal below is a positive act of literacy
          </h3>
          <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.75rem" }}>
            {(Object.keys(STOPS) as StopKey[]).map((key) => {
              const held = stops[key];
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={held}
                  onClick={() => setStops((s) => ({ ...s, [key]: !held }))}
                  style={togglePanelStyle(held, held ? GREEN : VERMILION)}
                >
                  {held ? <CheckCircle2 size={18} aria-hidden="true" /> : <AlertTriangle size={18} aria-hidden="true" />}
                  <span>
                    <strong style={{ fontWeight: 600 }}>{STOPS[key].label}</strong>
                    <span style={{ color: held ? INK_SECONDARY : VERMILION }}> — {held ? "Held as literacy." : ` ${STOPS[key].releasedText}`}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <div
            style={{
              marginTop: "0.75rem",
              padding: "0.65rem 0.85rem",
              borderRadius: 8,
              background: allStopsHeld ? GREEN_TINT : VERMILION_TINT,
              border: `1px solid ${allStopsHeld ? GREEN : VERMILION}`,
              color: allStopsHeld ? GREEN : VERMILION,
              fontWeight: 600,
            }}
          >
            {allStopsHeld
              ? "All stop-disciplines held. The practitioner knows where honest reach ends."
              : `${Object.keys(STOPS).length - Object.values(stops).filter(Boolean).length} stop-discipline(s) released. Review the warnings above.`}
          </div>
        </section>

        <section style={{ ...cardStyle, flex: "1 1 420px" }}>
          <p style={eyebrowStyle}>Checking rather than assuming</p>
          <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
            Verify each finding; do not generalise one result across the tradition
          </h3>
          <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.75rem" }}>
            {(Object.keys(VERIFY_FACTS) as VerifyKey[]).map((key) => {
              const on = verified[key];
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setVerified((v) => ({ ...v, [key]: !v[key] }))}
                  style={{
                    textAlign: "left",
                    border: `1px solid ${on ? BLUE : HAIRLINE}`,
                    borderRadius: 8,
                    background: on ? BLUE_TINT : "transparent",
                    color: on ? BLUE : INK_SECONDARY,
                    padding: "0.75rem",
                    cursor: "pointer",
                  }}
                >
                  <strong style={{ fontWeight: 600, display: "block", marginBottom: "0.35rem" }}>{VERIFY_FACTS[key].label}</strong>
                  <span style={{ color: on ? INK_PRIMARY : INK_SECONDARY }}>{VERIFY_FACTS[key].finding}</span>
                  {on && <span style={{ display: "block", marginTop: "0.45rem", color: VERMILION }}>{VERIFY_FACTS[key].falseGeneralisation}</span>}
                </button>
              );
            })}
          </div>
          <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
            Toggle each finding to see the wrong generalisation it guards against. Literacy checks each part directly.
          </p>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>What remains genuinely open</p>
        <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
          Name each gap precisely. Naming the boundary is itself meeting the bar.
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: "0.55rem", marginTop: "0.75rem" }}>
          {OPEN_GAPS.map((gap, idx) => (
            <button
              key={gap}
              type="button"
              aria-pressed={namedGaps[idx]}
              onClick={() => toggleGap(idx)}
              style={{
                textAlign: "left",
                border: `1px solid ${namedGaps[idx] ? GREEN : HAIRLINE}`,
                borderRadius: 8,
                background: namedGaps[idx] ? GREEN_TINT : "transparent",
                color: namedGaps[idx] ? GREEN : INK_SECONDARY,
                padding: "0.55rem 0.75rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {namedGaps[idx] ? <CheckCircle2 size={14} style={{ marginRight: "0.35rem" }} aria-hidden="true" /> : <span style={{ marginRight: "0.35rem", display: "inline-block", width: 14 }} />} {gap}
            </button>
          ))}
        </div>
        <div
          style={{
            marginTop: "0.75rem",
            padding: "0.65rem 0.85rem",
            borderRadius: 8,
            background: allGapsNamed ? GREEN_TINT : GOLD_TINT,
            border: `1px solid ${allGapsNamed ? GREEN : AMBER}`,
            color: allGapsNamed ? GREEN : AMBER,
            fontWeight: 600,
          }}
        >
          {allGapsNamed
            ? "Every open gap is named precisely. The module closes with its boundaries disclosed."
            : `${namedGaps.filter(Boolean).length} of ${OPEN_GAPS.length} gaps named. Continue naming the remaining boundaries.`}
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Hold the discipline</p>
        <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.75rem" }}>
          {(Object.keys(MISTAKES) as MistakeKey[]).map((key) => {
            const held = mistakes[key];
            return (
              <button
                key={key}
                type="button"
                aria-pressed={held}
                onClick={() => setMistakes((m) => ({ ...m, [key]: !held }))}
                style={togglePanelStyle(held, held ? GREEN : VERMILION)}
              >
                {held ? <CheckCircle2 size={18} aria-hidden="true" /> : <AlertTriangle size={18} aria-hidden="true" />}
                <span>
                  <strong style={{ fontWeight: 600 }}>{MISTAKES[key].label}</strong>
                  <span style={{ color: held ? INK_SECONDARY : VERMILION }}> — {held ? MISTAKES[key].heldText : MISTAKES[key].releasedText}</span>
                </span>
              </button>
            );
          })}
        </div>
        <div
          style={{
            marginTop: "0.75rem",
            padding: "0.65rem 0.85rem",
            borderRadius: 8,
            background: allMistakesHeld ? GREEN_TINT : VERMILION_TINT,
            border: `1px solid ${allMistakesHeld ? GREEN : VERMILION}`,
            color: allMistakesHeld ? GREEN : VERMILION,
            fontWeight: 600,
          }}
        >
          {allMistakesHeld
            ? "All discipline commitments are held. The literacy bar is treated as integrated judgment, not a checklist."
            : `${Object.keys(MISTAKES).length - Object.values(mistakes).filter(Boolean).length} discipline commitment(s) released. Review the warnings above.`}
        </div>
      </section>
    </div>
  );
}

function SkillConstellationSvg({ active, onSelect }: { active: SkillKey; onSelect: (k: SkillKey) => void }) {
  const cx = 210;
  const cy = 150;
  const r = 105;
  const labelLines: Record<SkillKey, string[]> = {
    cascade: ["Cascade", "fluency"],
    texture: ["Relationship", "texture"],
    cusp: ["Cusp-interplay", "awareness"],
    cross: ["Cross-system", "corroboration"],
    conditional: ["Conditional", "selection"],
  };

  return (
    <svg viewBox="0 0 420 310" role="img" aria-label="Five skill constellation" style={{ width: "100%", maxHeight: 320, margin: "0.65rem auto 0.25rem", display: "block" }}>
      <circle cx={cx} cy={cy} r={46} fill={GOLD_TINT} stroke={GOLD} strokeWidth="3" />
      <text x={cx} y={cy - 4} textAnchor="middle" fill={GOLD} fontSize="11" fontWeight={600}>Kavya&apos;s</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill={GOLD} fontSize="11" fontWeight={600}>marriage</text>
      <text x={cx} y={cy + 24} textAnchor="middle" fill={GOLD} fontSize="11" fontWeight={600}>question</text>
      {SKILL_ORDER.map((key, i) => {
        const angle = (i * 72 - 90) * (Math.PI / 180);
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        const s = SKILLS[key];
        const isActive = key === active;
        return (
          <g key={key} style={{ cursor: "pointer" }} onClick={() => onSelect(key)}>
            <line x1={cx + 46 * Math.cos(angle)} y1={cy + 46 * Math.sin(angle)} x2={x - (isActive ? 36 : 30) * Math.cos(angle)} y2={y - (isActive ? 36 : 30) * Math.sin(angle)} stroke={isActive ? s.color : HAIRLINE} strokeWidth={isActive ? 3 : 1.5} />
            <circle cx={x} cy={y} r={isActive ? 42 : 38} fill={tintForColor(s.color)} stroke={s.color} strokeWidth={isActive ? 3 : 2} />
            {labelLines[key].map((line, lineIndex) => (
              <text key={line} x={x} y={y - 12 + lineIndex * 12} textAnchor="middle" fill={s.color} fontSize={isActive ? 9.5 : 9} fontWeight={600}>
                {line}
              </text>
            ))}
            <text x={x} y={y + 18} textAnchor="middle" fill={INK_SECONDARY} fontSize={isActive ? 9 : 8.5} fontWeight={600}>{s.chapter}</text>
          </g>
        );
      })}
    </svg>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 600 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.55rem 0.75rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function scenarioButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.55rem 0.75rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function togglePanelStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "24px 1fr",
    gap: "0.65rem",
    alignItems: "start",
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? tintForColor(color) : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.75rem",
    cursor: "pointer",
  };
}

function tintForColor(color: string): string {
  switch (color) {
    case BLUE:
      return BLUE_TINT;
    case GREEN:
      return GREEN_TINT;
    case GOLD:
    case AMBER:
      return GOLD_TINT;
    case VERMILION:
      return VERMILION_TINT;
    case PURPLE:
      return PURPLE_TINT;
    case TEAL:
      return TEAL_TINT;
    default:
      return MUTED_TINT;
  }
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
