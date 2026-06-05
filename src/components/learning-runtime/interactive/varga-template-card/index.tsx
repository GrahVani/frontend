"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, BookOpenCheck, GitCompare, Layers, RotateCcw, Workflow } from "lucide-react";
import { useLessonSlug } from "../rashi-attribute-wheel";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";

type VargaKey = "d1" | "d9" | "d10";

const D1_LESSON_SLUG = "d1-rashi-the-macroscopic-chart-revisited";

const RASHI_SEQUENCE = [
  "Mesha",
  "Vrishabha",
  "Mithuna",
  "Karka",
  "Simha",
  "Kanya",
  "Tula",
  "Vrishchika",
  "Dhanu",
  "Makara",
  "Kumbha",
  "Mina",
];

const VARGAS: Record<VargaKey, {
  label: string;
  name: string;
  meaning: string;
  size: string;
  computation: string;
  jurisdiction: string;
  cross: string;
  error: string;
  example: string;
  color: string;
}> = {
  d1: {
    label: "D1",
    name: "Rashi",
    meaning: "the birth chart, the macroscopic whole",
    size: "No subdivision; the 30 degree rashi itself",
    computation: "Planetary longitude directly gives sign placement.",
    jurisdiction: "whole life, body, baseline chart, and reference for every varga",
    cross: "Every varga is read with the D1; the D1 sets the main promise.",
    error: "Forgetting D1 is itself one of the sixteen vargas.",
    example: "D1 shows the broad career promise before D10 magnifies career.",
    color: BLUE,
  },
  d9: {
    label: "D9",
    name: "Navamsha",
    meaning: "ninth-part division",
    size: "3 deg 20 min per part",
    computation: "Each sign is cut into nine parts; the chapter teaches the mapping rule.",
    jurisdiction: "marriage, spouse, dharma, and deeper planetary strength",
    cross: "Read with D1 promise; D9 confirms, qualifies, or deepens it.",
    error: "Reading D9 as a second unrelated horoscope.",
    example: "Strong D1 planet but weak D9 planet: surface promise lacks depth.",
    color: GREEN,
  },
  d10: {
    label: "D10",
    name: "Dashamsha",
    meaning: "tenth-part division",
    size: "3 deg per part",
    computation: "Each sign is cut into ten parts; odd/even construction is taught in the D10 chapter.",
    jurisdiction: "career, profession, status, and public work",
    cross: "Read with D1 10th house, 10th lord, and career significators.",
    error: "Pronouncing career from D10 alone without D1 confirmation.",
    example: "D10 exalted but D1 weak: career potential sits on a shaky base.",
    color: GOLD,
  },
};

const ATTRIBUTES = [
  { title: "Name + meaning", key: "meaning", question: "What is it called, and what does the word mean?" },
  { title: "Subdivision size", key: "size", question: "How finely does it cut each sign?" },
  { title: "Computation rule", key: "computation", question: "How is a planet's varga position derived?" },
  { title: "Jurisdiction", key: "jurisdiction", question: "What life-domain does it govern?" },
  { title: "Reading workflow", key: "workflow", question: "How is it actually read?" },
  { title: "Cross-references", key: "cross", question: "How does it pair with D1 and other vargas?" },
  { title: "Common errors", key: "error", question: "What do practitioners get wrong?" },
  { title: "Worked example", key: "example", question: "How does the template apply in practice?" },
] as const;

const WORKFLOW = [
  { label: "Varga-Lagna", detail: "Sets the frame and houses for the domain." },
  { label: "Planets", detail: "Read sign, house, and dignity inside the varga." },
  { label: "Relevant lord", detail: "Judge the Lagna lord and key domain-house lord." },
  { label: "D1 cross-check", detail: "Confirm or qualify the birth-chart promise." },
];

export function VargaTemplateCard() {
  const slug = useLessonSlug();
  const isD1Lesson = slug === D1_LESSON_SLUG;
  const defaultVargaKey: VargaKey = isD1Lesson ? "d1" : "d9";
  const [vargaKey, setVargaKey] = useState<VargaKey>(defaultVargaKey);
  const [activeAttribute, setActiveAttribute] = useState(0);
  const [d1Overlay, setD1Overlay] = useState(true);
  const [longitude, setLongitude] = useState(137);
  const [birthNudge, setBirthNudge] = useState(2);

  const varga = VARGAS[vargaKey];
  const attribute = ATTRIBUTES[activeAttribute];
  const mappedRashiIndex = Math.floor(longitude / 30) % 12;
  const mappedRashi = RASHI_SEQUENCE[mappedRashiIndex];
  const mappedDegree = longitude % 30;
  const cuspCrossed = birthNudge >= 4;
  const attributeValue = attribute.key === "workflow"
    ? "Read the varga-Lagna, then planets by sign/house/dignity, then the relevant lord, always alongside D1."
    : varga[attribute.key];

  const verdict = useMemo(() => {
    if (!d1Overlay) {
      return "Incomplete workflow: the varga is being read in isolation. Attribute 6 requires the D1 cross-reference.";
    }
    if (activeAttribute <= 3) {
      return "You are filling the factual half of the template: what the varga is and what domain it owns.";
    }
    return "You are in the usage half of the template: how to read, cross-check, avoid errors, and apply an example.";
  }, [activeAttribute, d1Overlay]);

  return (
    <div data-interactive="varga-template-card" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Per-varga template</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              {isD1Lesson ? "D1 as the macroscopic varga" : "Eight slots, one workflow, sixteen applications"}
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 850 }}>
              {isD1Lesson
                ? "Fill the eight-attribute template for D1: no subdivision, direct longitude-to-rashi mapping, and the reference chart for every other varga."
                : "Select a varga, step through the eight attributes, and practise the Lagna to planets to lord workflow with the D1 beside it."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setVargaKey(defaultVargaKey);
              setActiveAttribute(0);
              setD1Overlay(true);
              setLongitude(137);
              setBirthNudge(2);
            }}
            style={buttonStyle(false, BLUE)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(340px, 1.05fr) minmax(320px, 0.95fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Template card</p>
              <h3 style={{ margin: "0.15rem 0 0", color: varga.color, fontSize: "1.2rem" }}>
                {varga.label} {varga.name}
              </h3>
            </div>
            <strong style={{ color: activeAttribute <= 3 ? BLUE : GREEN }}>{activeAttribute <= 3 ? "Facts" : "Use"}</strong>
          </div>

          <TemplateSvg activeAttribute={activeAttribute} color={varga.color} d1Overlay={d1Overlay} />

          <div style={{ border: `1px solid ${varga.color}55`, borderRadius: 8, background: `${varga.color}10`, padding: "1rem" }}>
            <p style={eyebrowStyle}>Attribute {activeAttribute + 1}</p>
            <h4 style={{ margin: "0.2rem 0", color: varga.color, fontSize: "1.05rem" }}>{attribute.title}</h4>
            <p style={{ margin: "0 0 0.55rem", color: INK_MUTED, lineHeight: 1.45 }}>{attribute.question}</p>
            <strong style={{ color: INK_PRIMARY, lineHeight: 1.45 }}>{attributeValue}</strong>
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          {isD1Lesson ? (
            <D1MappingPanel
              longitude={longitude}
              mappedRashi={mappedRashi}
              mappedDegree={mappedDegree}
              birthNudge={birthNudge}
              cuspCrossed={cuspCrossed}
              onLongitudeChange={setLongitude}
              onBirthNudgeChange={setBirthNudge}
            />
          ) : (
            <Panel title="Select varga" icon={<BookOpenCheck size={18} />} color={BLUE}>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {(Object.keys(VARGAS) as VargaKey[]).map((key) => (
                  <button key={key} type="button" onClick={() => setVargaKey(key)} style={buttonStyle(vargaKey === key, VARGAS[key].color)}>
                    {VARGAS[key].label}
                  </button>
                ))}
              </div>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{varga.name}: {varga.jurisdiction}.</p>
            </Panel>
          )}

          <Panel title="Eight attributes" icon={<Layers size={18} />} color={GOLD}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "0.45rem" }}>
              {ATTRIBUTES.map((item, index) => (
                <button key={item.title} type="button" onClick={() => setActiveAttribute(index)} style={attributeButtonStyle(activeAttribute === index, index <= 3 ? BLUE : GREEN)}>
                  {index + 1}. {item.title}
                </button>
              ))}
            </div>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", alignItems: "start" }}>
        <Panel title="Reading workflow" icon={<Workflow size={18} />} color={GREEN}>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            {WORKFLOW.map((step, index) => (
              <div key={step.label} style={{ display: "grid", gridTemplateColumns: "28px 1fr", gap: "0.55rem", alignItems: "start" }}>
                <span style={{ width: 24, height: 24, borderRadius: 999, display: "grid", placeItems: "center", border: `1px solid ${index === 3 && !d1Overlay ? VERMILION : GREEN}`, background: index === 3 && !d1Overlay ? `${VERMILION}18` : `${GREEN}18`, color: index === 3 && !d1Overlay ? VERMILION : GREEN, fontWeight: 800, fontSize: 12 }}>{index + 1}</span>
                <span>
                  <strong style={{ display: "block", color: INK_PRIMARY }}>{step.label}</strong>
                  <span style={{ color: INK_MUTED, lineHeight: 1.35 }}>{step.detail}</span>
                </span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="D1 overlay" icon={<GitCompare size={18} />} color={d1Overlay ? GREEN : VERMILION}>
          <button type="button" aria-pressed={d1Overlay} onClick={() => setD1Overlay((value) => !value)} style={buttonStyle(d1Overlay, d1Overlay ? GREEN : VERMILION)}>
            {isD1Lesson ? (d1Overlay ? "D1 as reference" : "Reference hidden") : (d1Overlay ? "D1 included" : "Varga alone")}
          </button>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
            {isD1Lesson
              ? d1Overlay ? "Correct: all later vargas derive from and return to this base chart." : "Risk: the base chart is being forgotten while studying divisions."
              : d1Overlay ? "Correct: the varga confirms or qualifies the D1." : "Risk: the varga is being treated as an isolated chart."}
          </p>
        </Panel>

        <section style={{ border: `1px solid ${d1Overlay ? GOLD : VERMILION}66`, borderRadius: 8, background: `${d1Overlay ? GOLD : VERMILION}12`, padding: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: d1Overlay ? GOLD : VERMILION, fontWeight: 800, fontSize: "1.02rem", lineHeight: 1.25 }}>
            <BadgeCheck size={18} />
            Template verdict
          </div>
          <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{verdict}</p>
        </section>
      </div>
    </div>
  );
}

function D1MappingPanel({
  longitude,
  mappedRashi,
  mappedDegree,
  birthNudge,
  cuspCrossed,
  onLongitudeChange,
  onBirthNudgeChange,
}: {
  longitude: number;
  mappedRashi: string;
  mappedDegree: number;
  birthNudge: number;
  cuspCrossed: boolean;
  onLongitudeChange: (value: number) => void;
  onBirthNudgeChange: (value: number) => void;
}) {
  return (
    <Panel title="D1 direct mapping" icon={<BookOpenCheck size={18} />} color={BLUE}>
      <label style={{ display: "grid", gap: "0.45rem", color: INK_SECONDARY, fontWeight: 700 }}>
        Sidereal longitude: {longitude} deg
        <input
          type="range"
          min={0}
          max={359}
          value={longitude}
          onChange={(event) => onLongitudeChange(Number(event.target.value))}
          style={{ width: "100%", accentColor: BLUE }}
        />
      </label>
      <div style={{ border: `1px solid ${BLUE}44`, borderRadius: 8, background: `${BLUE}10`, padding: "0.85rem" }}>
        <p style={eyebrowStyle}>Longitude to rashi</p>
        <strong style={{ display: "block", marginTop: "0.25rem", color: BLUE }}>
          {longitude} deg {"->"} {mappedDegree} deg {mappedRashi}
        </strong>
        <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.45 }}>
          D1 has no subdivision: the 30 degree sign itself is the chart field.
        </p>
      </div>
      <label style={{ display: "grid", gap: "0.45rem", color: INK_SECONDARY, fontWeight: 700 }}>
        Birth-time nudge near Lagna cusp: {birthNudge} min
        <input
          type="range"
          min={0}
          max={8}
          value={birthNudge}
          onChange={(event) => onBirthNudgeChange(Number(event.target.value))}
          style={{ width: "100%", accentColor: cuspCrossed ? VERMILION : GREEN }}
        />
      </label>
      <div style={{ border: `1px solid ${cuspCrossed ? VERMILION : GREEN}55`, borderRadius: 8, background: `${cuspCrossed ? VERMILION : GREEN}10`, padding: "0.85rem" }}>
        <strong style={{ color: cuspCrossed ? VERMILION : GREEN }}>
          {cuspCrossed ? "Cusp crossed: all varga Lagnas must be rechecked." : "Same D1 Lagna: derived vargas stay anchored."}
        </strong>
      </div>
    </Panel>
  );
}

function TemplateSvg({ activeAttribute, color, d1Overlay }: { activeAttribute: number; color: string; d1Overlay: boolean }) {
  return (
    <svg viewBox="0 0 620 300" role="img" aria-label="Eight attribute per-varga template and reading workflow" style={{ width: "100%", maxHeight: 350, margin: "0.65rem auto 0.9rem", display: "block" }}>
      <rect x="34" y="34" width="552" height="230" rx="8" fill={`${GOLD}08`} stroke={HAIRLINE} />
      <text x="310" y="60" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="800">Per-varga scaffold</text>
      {ATTRIBUTES.map((item, index) => {
        const row = Math.floor(index / 4);
        const col = index % 4;
        const x = 58 + col * 136;
        const y = 84 + row * 70;
        const active = activeAttribute === index;
        const boxColor = index <= 3 ? BLUE : GREEN;
        return (
          <g key={item.title}>
            <rect x={x} y={y} width="116" height="48" rx="8" fill={active ? `${boxColor}24` : "rgba(255,251,241,0.62)"} stroke={active ? boxColor : HAIRLINE} strokeWidth={active ? 3 : 1} />
            <text x={x + 10} y={y + 20} fill={active ? boxColor : INK_PRIMARY} fontSize="12" fontWeight="800">{index + 1}. {shortAttributeTitle(item.title)}</text>
            <text x={x + 10} y={y + 37} fill={INK_MUTED} fontSize="10.5" fontWeight="650">{index <= 3 ? "facts" : "use"}</text>
          </g>
        );
      })}
      <path d="M134 224 H496" stroke={color} strokeWidth="3" strokeLinecap="round" />
      {["Lagna", "Planets", "Lord", "D1"].map((label, index) => {
        const x = 134 + index * 120;
        const warning = label === "D1" && !d1Overlay;
        return (
          <g key={label}>
            <circle cx={x} cy="224" r="17" fill={warning ? VERMILION : color} />
            <text x={x} y="228" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="800">{index + 1}</text>
            <text x={x} y="256" textAnchor="middle" fill={warning ? VERMILION : INK_PRIMARY} fontSize="12" fontWeight="800">{label}</text>
          </g>
        );
      })}
    </svg>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 800, fontSize: "1.02rem", lineHeight: 1.25 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem", display: "grid", gap: "0.7rem" }}>{children}</div>
    </section>
  );
}

function shortAttributeTitle(title: string) {
  return title === "Subdivision size" ? "Part size" : title === "Cross-references" ? "Cross-refs" : title;
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
    padding: "0.52rem 0.68rem",
    fontWeight: 700,
    cursor: "pointer",
  };
}

function attributeButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}18` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.5rem",
    fontWeight: 700,
    cursor: "pointer",
    textAlign: "left",
  };
}

const eyebrowStyle: CSSProperties = {
  margin: 0,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 800,
};
