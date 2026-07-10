"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BookOpenCheck, Compass, HeartHandshake, MessageSquareQuote, RotateCcw, Scale, ShieldCheck, TriangleAlert } from "lucide-react";

type ScenarioKey = "unfamiliar" | "existingDevotion" | "unasked";
type PanelKey = "adhikara" | "descriptive" | "framing" | "nonOverride";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";

const PANELS: Record<PanelKey, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  adhikara: {
    label: "Adhikara",
    title: "Authority stops at reporting",
    body: "The astrologer may report a technique-based indication. Worship advice, conversion pressure, and pastoral guidance belong outside the reading.",
    icon: <Scale size={16} />,
    color: BLUE,
  },
  descriptive: {
    label: "Descriptive",
    title: "Not a remedy prescription",
    body: "Ishta-devata is a descriptive finding. It is not like a devotional remedy with a secular substitute.",
    icon: <BookOpenCheck size={16} />,
    color: GOLD,
  },
  framing: {
    label: "Frame",
    title: "Name the tradition",
    body: "Use bounded language: in the Vedic astrological tradition, this chart is read as pointing toward this deity.",
    icon: <MessageSquareQuote size={16} />,
    color: PURPLE,
  },
  nonOverride: {
    label: "Non-override",
    title: "Existing devotion remains intact",
    body: "The finding never corrects, replaces, or outranks the client background or living devotion.",
    icon: <HeartHandshake size={16} />,
    color: GREEN,
  },
};

const SCENARIOS: Record<ScenarioKey, { label: string; prompt: string; good: string; avoid: string; accent: string }> = {
  unfamiliar: {
    label: "Unfamiliar client",
    prompt: "A client outside the Vedic tradition asks whether the chart says anything about spiritual inclination.",
    good: "In the Vedic astrological tradition, this chart is read as pointing toward Ganesha for this devotional register. It is offered for reflection, not as a belief you must adopt.",
    avoid: "Your true deity is Ganesha, so this is what you should believe.",
    accent: BLUE,
  },
  existingDevotion: {
    label: "Existing devotion",
    prompt: "A client already has a lifelong devotion to Krishna, while the chart technique indicates Lakshmi.",
    good: "This does not touch your devotion to Krishna. This specific technique also points toward Lakshmi; some people hold that as additional information, and some set it aside.",
    avoid: "Your chart shows Lakshmi, so your Krishna devotion is not the correct one.",
    accent: GREEN,
  },
  unasked: {
    label: "Unasked consultation",
    prompt: "A career-focused consultation has no spiritual or devotional question from the client.",
    good: "Do not volunteer the deity finding unless the client opens that topic. Restraint about whether to offer is part of respect.",
    avoid: "Before we discuss career, I need to tell you your deity indication.",
    accent: VERMILION,
  },
};

const PANEL_ORDER: PanelKey[] = ["adhikara", "descriptive", "framing", "nonOverride"];

export function IshtaDevataRespectFramingLab() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("unfamiliar");
  const [panelKey, setPanelKey] = useState<PanelKey>("adhikara");
  const [traditionBounded, setTraditionBounded] = useState(true);
  const [descriptiveOnly, setDescriptiveOnly] = useState(true);
  const [protectExisting, setProtectExisting] = useState(true);
  const [offerOnlyWhenRelevant, setOfferOnlyWhenRelevant] = useState(true);

  const scenario = SCENARIOS[scenarioKey];
  const panel = PANELS[panelKey];

  const status = useMemo(() => {
    if (!traditionBounded) return { label: "truth-claim risk", color: VERMILION };
    if (!descriptiveOnly) return { label: "remedy confusion", color: GOLD };
    if (!protectExisting) return { label: "override risk", color: VERMILION };
    if (!offerOnlyWhenRelevant) return { label: "unsolicited finding", color: GOLD };
    return { label: "respectful framing ready", color: GREEN };
  }, [descriptiveOnly, offerOnlyWhenRelevant, protectExisting, traditionBounded]);

  const guidance = useMemo(() => {
    if (!traditionBounded) return "Repair the sentence by naming the tradition and technique before naming the deity indication.";
    if (!descriptiveOnly) return "Do not convert the finding into a prescription. It reports a chart indication; it does not command practice.";
    if (!protectExisting) return "Add the non-override clause before the finding. Existing devotion remains fully respected.";
    if (!offerOnlyWhenRelevant) return "Ask whether the topic is welcome, or omit it when the consultation has no devotional opening.";
    return scenario.good;
  }, [descriptiveOnly, offerOnlyWhenRelevant, protectExisting, scenario.good, traditionBounded]);

  return (
    <div data-interactive="ishta-devata-respect-framing-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Ishta-devata ethics lab</p>
            <h2 style={{ margin: "0.22rem 0 0", color: BLUE, fontSize: "1.28rem", fontWeight: 600 }}>
              Practice respectful religious-cultural framing before saying the finding
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 920 }}>
              Choose a client context, inspect the boundary map, and keep the statement descriptive, tradition-bounded, non-overriding, and relevant.
            </p>
          </div>
          <span style={{ border: `1px solid ${status.color}`, color: status.color, borderRadius: 999, padding: "0.42rem 0.68rem", fontSize: "0.78rem", fontWeight: 600, background: "color-mix(in srgb, currentColor 8%, transparent)", whiteSpace: "nowrap" }}>
            {status.label}
          </span>
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 0.95fr) minmax(280px, 0.65fr)", gap: "1rem" }}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Client context</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.55rem", marginTop: "0.8rem" }}>
            {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => (
              <button key={key} type="button" onClick={() => setScenarioKey(key)} style={choiceStyle(scenarioKey === key, SCENARIOS[key].accent)} aria-pressed={scenarioKey === key}>
                {SCENARIOS[key].label}
              </button>
            ))}
          </div>

          <div style={{ marginTop: "0.9rem", border: `1px solid ${scenario.accent}`, borderRadius: 8, padding: "0.85rem", background: "rgba(255,255,255,0.34)" }}>
            <p style={{ margin: 0, color: scenario.accent, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Prompt</p>
            <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{scenario.prompt}</p>
          </div>

          <BoundaryMap active={panelKey} onSelect={setPanelKey} />
          <p style={{ margin: "0.8rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{panel.body}</p>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Guardrail toggles</p>
          <div style={{ display: "grid", gap: "0.62rem", marginTop: "0.8rem" }}>
            <ToggleRow checked={traditionBounded} onChange={setTraditionBounded} label="Tradition-bounded language" icon={<Compass size={16} />} />
            <ToggleRow checked={descriptiveOnly} onChange={setDescriptiveOnly} label="Descriptive, not prescriptive" icon={<BookOpenCheck size={16} />} />
            <ToggleRow checked={protectExisting} onChange={setProtectExisting} label="Do not override devotion" icon={<ShieldCheck size={16} />} />
            <ToggleRow checked={offerOnlyWhenRelevant} onChange={setOfferOnlyWhenRelevant} label="Offer only when relevant" icon={<HeartHandshake size={16} />} />
          </div>
          <button
            type="button"
            onClick={() => {
              setScenarioKey("unfamiliar");
              setPanelKey("adhikara");
              setTraditionBounded(true);
              setDescriptiveOnly(true);
              setProtectExisting(true);
              setOfferOnlyWhenRelevant(true);
            }}
            style={{ ...softButtonStyle, marginTop: "0.9rem" }}
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
        <ScriptCard title="Say it this way" body={guidance} color={status.color === GREEN ? GREEN : GOLD} icon={<MessageSquareQuote size={18} />} />
        <ScriptCard title="Avoid this failure" body={scenario.avoid} color={VERMILION} icon={<TriangleAlert size={18} />} />
      </section>

      <section style={{ ...cardStyle, borderColor: panel.color }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          <span style={{ color: panel.color, marginTop: "0.1rem" }}>{panel.icon}</span>
          <div>
            <p style={eyebrowStyle}>{panel.label}</p>
            <h3 style={{ margin: "0.24rem 0 0", color: INK_PRIMARY, fontSize: "1rem", fontWeight: 600 }}>{panel.title}</h3>
          </div>
        </div>
      </section>
    </div>
  );
}

function BoundaryMap({ active, onSelect }: { active: PanelKey; onSelect: (key: PanelKey) => void }) {
  return (
    <svg viewBox="0 0 640 210" role="img" aria-label="Religious cultural respect boundary map" style={{ width: "100%", height: "auto", marginTop: "0.9rem" }}>
      <rect x="8" y="8" width="624" height="194" rx="8" fill="rgba(255,255,255,0.35)" stroke={HAIRLINE} />
      <line x1="88" y1="104" x2="552" y2="104" stroke={HAIRLINE} strokeWidth="2" />
      {PANEL_ORDER.map((key, index) => {
        const x = 88 + index * 154;
        const item = PANELS[key];
        const selected = active === key;
        return (
          <g key={key} onClick={() => onSelect(key)} style={{ cursor: "pointer" }}>
            <circle cx={x} cy="104" r={selected ? 31 : 25} fill={selected ? item.color : SURFACE} stroke={item.color} strokeWidth="2" />
            <text x={x} y="108" textAnchor="middle" fontSize="10" fontWeight="600" fill={selected ? "white" : item.color}>{item.label}</text>
            <text x={x} y="154" textAnchor="middle" fontSize="10" fill={selected ? item.color : INK_MUTED}>{index + 1}</text>
          </g>
        );
      })}
      <text x="320" y="46" textAnchor="middle" fontSize="12" fill={INK_SECONDARY}>Report chart indication</text>
      <text x="320" y="188" textAnchor="middle" fontSize="12" fill={INK_MUTED}>Do not instruct belief, worship, conversion, or replacement</text>
    </svg>
  );
}

function ToggleRow({ checked, onChange, label, icon }: { checked: boolean; onChange: (checked: boolean) => void; label: string; icon: ReactNode }) {
  return (
    <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", border: `1px solid ${checked ? GREEN : HAIRLINE}`, borderRadius: 8, padding: "0.62rem 0.7rem", color: checked ? INK_PRIMARY : INK_MUTED, cursor: "pointer" }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", fontSize: "0.9rem" }}>{icon}{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} aria-label={label} />
    </label>
  );
}

function ScriptCard({ title, body, color, icon }: { title: string; body: string; color: string; icon: ReactNode }) {
  return (
    <article style={{ ...cardStyle, borderColor: color }}>
      <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", color }}>
        {icon}
        <p style={{ margin: 0, fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{title}</p>
      </div>
      <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{body}</p>
    </article>
  );
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  boxShadow: "var(--gl-shadow-soft)",
  padding: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontSize: "0.72rem",
  fontWeight: 600,
};

const buttonReset: CSSProperties = {
  appearance: "none",
  cursor: "pointer",
  font: "inherit",
  textAlign: "left",
};

function choiceStyle(active: boolean, color: string): CSSProperties {
  return {
    ...buttonReset,
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? "color-mix(in srgb, currentColor 7%, transparent)" : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.65rem 0.72rem",
    fontSize: "0.86rem",
    fontWeight: 600,
  };
}

const softButtonStyle: CSSProperties = {
  ...buttonReset,
  display: "inline-flex",
  alignItems: "center",
  gap: "0.45rem",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: "transparent",
  color: INK_SECONDARY,
  padding: "0.55rem 0.72rem",
  fontSize: "0.86rem",
  fontWeight: 600,
};
