"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Baby, CircleDot, Coins, Heart, HeartPulse, Lightbulb, Orbit, RotateCcw, Sparkles, TriangleAlert, Waves } from "lucide-react";

type SignificationKey = "progeny" | "purvaPunya" | "intellect" | "creativity" | "romance" | "speculation";
type ReadingStep = "lord" | "occupants" | "aspects" | "references";

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

const SIGNIFICATIONS: Record<
  SignificationKey,
  { label: string; short: string; devanagari: string; color: string; icon: ReactNode; santanaWeight: "core" | "context" | "other"; note: string }
> = {
  progeny: {
    label: "Progeny",
    short: "Saṁtāna",
    devanagari: "पुत्र",
    color: GREEN,
    icon: <Baby size={18} />,
    santanaWeight: "core",
    note: "Children, their promise, wellbeing, and the relationship with them. This is the load-bearing sense when reading for santana.",
  },
  purvaPunya: {
    label: "Pūrva-puṇya",
    short: "Merit",
    devanagari: "पूर्वपुण्य",
    color: GOLD,
    icon: <Sparkles size={18} />,
    santanaWeight: "context",
    note: "Past merit, of which children are classically the fruit. Keeps the 5th grounded in a wider karmic frame.",
  },
  intellect: {
    label: "Intellect",
    short: "Buddhi",
    devanagari: "बुद्धि",
    color: BLUE,
    icon: <Lightbulb size={18} />,
    santanaWeight: "other",
    note: "Discernment, judgment, and applied wisdom. A strong 5th may show here as much as in progeny.",
  },
  creativity: {
    label: "Creativity",
    short: "Sṛjana",
    devanagari: "सृजन",
    color: PURPLE,
    icon: <Waves size={18} />,
    santanaWeight: "other",
    note: "Artistic and procreative creativity. One of the channels through which the 5th house expresses.",
  },
  romance: {
    label: "Romance",
    short: "Rati",
    devanagari: "रति",
    color: VERMILION,
    icon: <Heart size={18} />,
    santanaWeight: "other",
    note: "Romantic life and emotional play. Part of the 5th's wider register, not to be confused with the 7th.",
  },
  speculation: {
    label: "Speculation",
    short: "Dyūta",
    devanagari: "द्यूत",
    color: GOLD,
    icon: <Coins size={18} />,
    santanaWeight: "other",
    note: "Risk, games, and the gambler's house. A stressed 5th can warn against unwise speculation.",
  },
};

const READING_STEPS: Record<ReadingStep, { label: string; title: string; body: string; color: string }> = {
  lord: {
    label: "Lord",
    title: "Start with the 5th lord condition",
    body: "Dignity, house placement, combustion, and strength give the single best signature of a sound putra-bhāva.",
    color: GOLD,
  },
  occupants: {
    label: "Occupants",
    title: "Note who sits in the 5th",
    body: "Jupiter and benefics support progeny; afflicted malefics stress or delay. Read each occupant's dignity and role.",
    color: BLUE,
  },
  aspects: {
    label: "Aspects",
    title: "Weigh influences on the 5th and its lord",
    body: "Jupiter's aspect is especially favourable for santana. Malefic aspects without benefic relief add pressure.",
    color: PURPLE,
  },
  references: {
    label: "References",
    title: "Confirm from Moon and Jupiter",
    body: "Read the 5th from Lagna, the 5th from Moon, and the 5th from Jupiter before settling on confidence.",
    color: GREEN,
  },
};

export function SantanaFifthHouseSignificationsCompass() {
  const [active, setActive] = useState<Record<SignificationKey, boolean>>({
    progeny: true,
    purvaPunya: true,
    intellect: false,
    creativity: false,
    romance: false,
    speculation: false,
  });
  const [santanaLens, setSantanaLens] = useState(true);
  const [readingStep, setReadingStep] = useState<ReadingStep>("lord");
  const [moonReference, setMoonReference] = useState(true);
  const [jupiterReference, setJupiterReference] = useState(true);
  const [nonFatalistic, setNonFatalistic] = useState(true);
  const [medicalRoute, setMedicalRoute] = useState(true);
  const [distressPause, setDistressPause] = useState(true);

  const activeKeys = (Object.keys(active) as SignificationKey[]).filter((key) => active[key]);
  const hasCore = active.progeny;
  const hasContext = active.purvaPunya;
  const hasOnlyCore = hasCore && activeKeys.length === 1;
  const overNarrowed = hasOnlyCore;
  const readWhole = hasCore && hasContext;

  const readingComplete = readingStep === "references";
  const referencesChecked = moonReference && jupiterReference;
  const careFrame = nonFatalistic && medicalRoute && distressPause;

  const verdict = useMemo(() => {
    if (!careFrame) return { label: "care frame needs repair", color: VERMILION };
    if (overNarrowed) return { label: "5th house over-narrowed", color: GOLD };
    if (!readingComplete) return { label: "reading still in progress", color: BLUE };
    if (!referencesChecked) return { label: "cross-references incomplete", color: GOLD };
    if (readWhole) return { label: "whole 5th read for santana", color: GREEN };
    return { label: "santana signal located", color: GREEN };
  }, [careFrame, overNarrowed, readingComplete, referencesChecked, readWhole]);

  const statement = useMemo(() => {
    if (!nonFatalistic) return "Repair the frame: the 5th gives indications, never a childlessness decree.";
    if (!medicalRoute) return "Route fertility, pregnancy, and child-health concerns to a medical specialist.";
    if (!distressPause) return "Pause the technical reading when grief or distress is visible.";
    if (overNarrowed) return "Read the 5th whole first, then locate the santana signal through the 5th, Jupiter, references, and later D7.";
    if (!readingComplete) return `Current focus: ${READING_STEPS[readingStep].title.toLowerCase()}. Walk through all four steps before forming confidence.`;
    if (!referencesChecked) return "Confirm the picture from the Moon and from Jupiter before calling it a santana indication.";
    if (readWhole) return "The 5th is read whole: progeny is held with pūrva-puṇya, and the santana signal is located through lord, occupants, aspects, and cross-references.";
    return "The santana signal is located, but remember the 5th also rules intelligence, creativity, romance, and speculation.";
  }, [distressPause, medicalRoute, nonFatalistic, overNarrowed, readWhole, readingComplete, readingStep, referencesChecked]);

  function toggleSignification(key: SignificationKey) {
    setActive((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function reset() {
    setActive({ progeny: true, purvaPunya: true, intellect: false, creativity: false, romance: false, speculation: false });
    setSantanaLens(true);
    setReadingStep("lord");
    setMoonReference(true);
    setJupiterReference(true);
    setNonFatalistic(true);
    setMedicalRoute(true);
    setDistressPause(true);
  }

  return (
    <div data-interactive="santana-fifth-house-significations-compass" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>5th house significations compass</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.28rem", fontWeight: 600 }}>Read the whole putra-bhāva, then locate santana</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 930 }}>
              Toggle the 5th house&apos;s faces to see how progeny sits with pūrva-puṇya, intellect, creativity, romance, and speculation. Use the santana lens to keep the children register in focus without over-narrowing the house.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, PURPLE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Significations mandala</p>
              <h3 style={{ margin: "0.15rem 0 0", color: verdict.color, fontSize: "1.12rem", fontWeight: 600 }}>{verdict.label}</h3>
            </div>
            <button type="button" aria-pressed={santanaLens} onClick={() => setSantanaLens((value) => !value)} style={buttonStyle(santanaLens, GREEN)}>
              <Sparkles size={15} aria-hidden="true" />
              {santanaLens ? "Santana lens on" : "Santana lens off"}
            </button>
          </div>
          <SignificationsSvg active={active} santanaLens={santanaLens} />
          <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.92rem" }}>{statement}</p>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Toggle significations</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.75rem" }}>
            {(Object.keys(SIGNIFICATIONS) as SignificationKey[]).map((key) => {
              const sig = SIGNIFICATIONS[key];
              const isActive = active[key];
              const dimmed = santanaLens && sig.santanaWeight === "other";
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => toggleSignification(key)}
                  style={significationToggleStyle(isActive, sig.color, dimmed)}
                >
                  <span style={{ color: sig.color, opacity: dimmed && !isActive ? 0.6 : 1 }}>{sig.icon}</span>
                  <span style={{ flex: 1 }}>
                    <span style={{ display: "block", fontWeight: 600, color: dimmed && !isActive ? INK_MUTED : INK_PRIMARY }}>
                      {sig.label} <span style={{ color: INK_MUTED, fontWeight: 500, fontSize: "0.85rem" }}>({sig.short})</span>
                    </span>
                    <span style={{ fontSize: "0.86rem", lineHeight: 1.4, color: INK_SECONDARY }}>{sig.note}</span>
                  </span>
                  <span style={{ color: sig.color, fontSize: "0.78rem", fontWeight: 600 }}>{sig.devanagari}</span>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Reading workflow</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.75rem" }}>
          {(Object.keys(READING_STEPS) as ReadingStep[]).map((step) => (
            <button key={step} type="button" aria-pressed={readingStep === step} onClick={() => setReadingStep(step)} style={buttonStyle(readingStep === step, READING_STEPS[step].color)}>
              {step === "lord" ? <Orbit size={16} /> : step === "occupants" ? <CircleDot size={16} /> : step === "aspects" ? <Sparkles size={16} /> : <Baby size={16} />}
              {READING_STEPS[step].label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "0.8rem", border: `1px solid ${READING_STEPS[readingStep].color}55`, borderRadius: 8, background: `${READING_STEPS[readingStep].color}10`, padding: "0.85rem" }}>
          <h3 style={{ margin: 0, color: READING_STEPS[readingStep].color, fontSize: "1.05rem", fontWeight: 600 }}>{READING_STEPS[readingStep].title}</h3>
          <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.92rem" }}>{READING_STEPS[readingStep].body}</p>
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Cross-reference checks</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.75rem" }}>
            <Toggle active={moonReference} color={moonReference ? GREEN : GOLD} icon={<CircleDot size={18} />} title="5th from Moon" body={moonReference ? "Confirm the picture from the Moon." : "Moon reference skipped."} onClick={() => setMoonReference((value) => !value)} />
            <Toggle active={jupiterReference} color={jupiterReference ? GREEN : GOLD} icon={<Sparkles size={18} />} title="5th from Jupiter" body={jupiterReference ? "Include the saṁtāna-kāraka's reference." : "Jupiter reference skipped."} onClick={() => setJupiterReference((value) => !value)} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Care frame</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.75rem" }}>
            <Toggle active={nonFatalistic} color={nonFatalistic ? GREEN : VERMILION} icon={<TriangleAlert size={18} />} title="Indication, not decree" body={nonFatalistic ? "No childlessness foreclosure." : "Forbidden foreclosure claim active."} onClick={() => setNonFatalistic((value) => !value)} />
            <Toggle active={medicalRoute} color={medicalRoute ? GREEN : VERMILION} icon={<HeartPulse size={18} />} title="Medical routing intact" body={medicalRoute ? "Clinical concerns go to specialists." : "Chart replacing medical care."} onClick={() => setMedicalRoute((value) => !value)} />
            <Toggle active={distressPause} color={distressPause ? GREEN : PURPLE} icon={<Heart size={18} />} title="Pause for visible distress" body={distressPause ? "Care before technique." : "Continuing through distress."} onClick={() => setDistressPause((value) => !value)} />
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: `${verdict.color}66`, background: `${verdict.color}10` }}>
        <p style={eyebrowStyle}>Practice reminder</p>
        <h3 style={{ margin: "0.15rem 0 0", color: verdict.color, fontSize: "1.12rem", fontWeight: 600 }}>{verdict.label}</h3>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{statement}</p>
      </section>
    </div>
  );
}

function SignificationsSvg({ active, santanaLens }: { active: Record<SignificationKey, boolean>; santanaLens: boolean }) {
  const centerX = 250;
  const centerY = 250;
  const radius = 145;
  const nodeRadius = 42;

  const nodes = useMemo(() => {
    const keys = Object.keys(SIGNIFICATIONS) as SignificationKey[];
    return keys.map((key, index) => {
      const angle = (index * 60 - 90) * (Math.PI / 180);
      return {
        key,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        ...SIGNIFICATIONS[key],
      };
    });
  }, []);

  const activeCount = activeKeysCount(active);
  const readWhole = active.progeny && active.purvaPunya;
  const fillColor = !active.progeny ? VERMILION : santanaLens && activeCount > 2 && !active.purvaPunya ? GOLD : readWhole ? GREEN : GOLD;

  return (
    <svg viewBox="0 0 500 500" role="img" aria-label="Fifth house significations compass" style={{ width: "100%", minHeight: 300, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="464" height="464" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <circle cx={centerX} cy={centerY} r="78" fill={`${PURPLE}18`} stroke={PURPLE} strokeWidth="2.5" />
      <text x={centerX} y={centerY - 8} textAnchor="middle" fill={PURPLE} fontSize="15" fontWeight="600">5th House</text>
      <text x={centerX} y={centerY + 14} textAnchor="middle" fill={INK_MUTED} fontSize="12">Putra-bhāva</text>

      {nodes.map((node) => {
        const isActive = active[node.key];
        const dimmed = santanaLens && node.santanaWeight === "other";
        const stroke = isActive ? node.color : dimmed ? `${node.color}44` : HAIRLINE;
        const fill = isActive ? `${node.color}18` : dimmed ? `${node.color}08` : SURFACE;
        const textFill = isActive ? node.color : dimmed ? INK_MUTED : INK_SECONDARY;
        return (
          <g key={node.key}>
            <line x1={centerX} y1={centerY} x2={node.x} y2={node.y} stroke={isActive ? stroke : HAIRLINE} strokeWidth={isActive ? 2.5 : 1.5} opacity={isActive ? 0.7 : 0.35} />
            <circle cx={node.x} cy={node.y} r={nodeRadius} fill={fill} stroke={stroke} strokeWidth={isActive ? 3 : 1.5} />
            <text x={node.x} y={node.y - 6} textAnchor="middle" fill={textFill} fontSize="11" fontWeight="600">{node.label}</text>
            <text x={node.x} y={node.y + 10} textAnchor="middle" fill={INK_MUTED} fontSize="9">{node.short}</text>
            {isActive && node.santanaWeight === "core" ? (
              <circle cx={node.x + 28} cy={node.y - 28} r="7" fill={GREEN} />
            ) : null}
            {isActive && node.santanaWeight === "context" ? (
              <circle cx={node.x + 28} cy={node.y - 28} r="7" fill={GOLD} />
            ) : null}
          </g>
        );
      })}

      <g transform="translate(250 410)">
        <rect x="-115" y="0" width="230" height="54" rx="8" fill={`${fillColor}16`} stroke={fillColor} />
        <text x="0" y="20" textAnchor="middle" fill={fillColor} fontSize="12" fontWeight="600">{active.progeny ? "Santana signal visible" : "Progeny not selected"}</text>
        <text x="0" y="40" textAnchor="middle" fill={INK_SECONDARY} fontSize="11">{active.purvaPunya ? "Held with pūrva-puṇya" : "Pūrva-puṇya context missing"}</text>
      </g>
    </svg>
  );
}

function activeKeysCount(active: Record<SignificationKey, boolean>): number {
  return (Object.keys(active) as SignificationKey[]).filter((key) => active[key]).length;
}

function Toggle({ active, color, icon, title, body, onClick }: { active: boolean; color: string; icon: ReactNode; title: string; body: string; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} style={toggleStyle(active, color)}>
      <span style={{ color }}>{icon}</span>
      <span>
        <span style={{ display: "block", fontWeight: 600 }}>{title}</span>
        <span>{body}</span>
      </span>
    </button>
  );
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  boxShadow: "var(--gl-shadow-soft)",
};

const responsiveTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))",
  gap: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontSize: "0.75rem",
  fontWeight: 600,
};

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}16` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.58rem 0.75rem",
    minHeight: 38,
    display: "inline-flex",
    gap: "0.45rem",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function significationToggleStyle(active: boolean, color: string, dimmed: boolean): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}10` : "transparent",
    color: INK_PRIMARY,
    padding: "0.75rem",
    display: "flex",
    gap: "0.7rem",
    alignItems: "start",
    textAlign: "left",
    cursor: "pointer",
    fontWeight: 400,
    opacity: dimmed && !active ? 0.75 : 1,
  };
}

function toggleStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}12` : "transparent",
    color: INK_PRIMARY,
    padding: "0.75rem",
    display: "flex",
    gap: "0.7rem",
    alignItems: "start",
    textAlign: "left",
    cursor: "pointer",
    fontWeight: 400,
  };
}
