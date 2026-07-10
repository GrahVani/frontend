"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BookOpen,
  Eye,
  Info,
  RotateCcw,
  Scale,
  ShieldCheck,
} from "lucide-react";

type Register = "crisis" | "occult" | "research";
type Occupant = "jupiter" | "saturn" | "mars" | "rahu" | "ketu" | "none";
type Dignity = "strong" | "mixed" | "weak";
type PresetKey = "chart-s1" | "example-2" | "occult-sample";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const SHADOW = "var(--gl-shadow-soft)";

const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";

const REGISTERS: Record<
  Register,
  {
    label: string;
    color: string;
    icon: ReactNode;
    description: string;
    typicalPlanets: string;
    discipline: string;
  }
> = {
  crisis: {
    label: "Crisis-catalysed awakening",
    color: VERMILION,
    icon: <AlertTriangle size={16} />,
    description:
      "Spiritual opening that arrives through loss, illness, upheaval, or confrontation with mortality rather than steady cultivation.",
    typicalPlanets: "Saturn, Mars",
    discipline:
      "Name the real difficulty first; only then offer the transformation framing.",
  },
  occult: {
    label: "Occult / tantric aptitude",
    color: PURPLE,
    icon: <Eye size={16} />,
    description:
      "Genuine interest and capacity for esoteric, ritual-technical, or hidden-knowledge practice.",
    typicalPlanets: "Rahu, Ketu",
    discipline:
      "Read this as a distinct register, not as crisis or scholarly research.",
  },
  research: {
    label: "Research-oriented depth",
    color: BLUE,
    icon: <BookOpen size={16} />,
    description:
      "A scholarly, investigative relationship to spiritual material, philosophy, or systematic practice-research.",
    typicalPlanets: "Jupiter, Mercury",
    discipline:
      "Let the occupant's nature colour the 8th toward wisdom or inquiry without forcing all strong 8ths into this register.",
  },
};

const OCCUPANTS: Record<
  Occupant,
  {
    label: string;
    color: string;
    defaultRegister: Register;
    note: string;
    nature: string;
  }
> = {
  jupiter: {
    label: "Jupiter in 8th",
    color: BLUE,
    defaultRegister: "research",
    note: "Chart S1's pattern: lord in own house leans toward research and wisdom.",
    nature: "wisdom, teaching, counsel, expansion",
  },
  saturn: {
    label: "Saturn in 8th",
    color: PURPLE,
    defaultRegister: "crisis",
    note: "A hard-edged crisis signal; real difficulty and slow hidden processes.",
    nature: "endings, discipline, fear, structure",
  },
  mars: {
    label: "Mars in 8th",
    color: VERMILION,
    defaultRegister: "crisis",
    note: "Intensified upheaval; the crisis-catalysed register is likely.",
    nature: "conflict, action, force, competition",
  },
  rahu: {
    label: "Rahu in 8th",
    color: PURPLE,
    defaultRegister: "occult",
    note: "Unconventional, disruptive, technical-occult appetite.",
    nature: "foreign, disruptive, ambitious, experimental",
  },
  ketu: {
    label: "Ketu in 8th",
    color: PURPLE,
    defaultRegister: "occult",
    note: "Detachment and esoteric orientation; occult or research edge.",
    nature: "detachment, focus, esoteric skill",
  },
  none: {
    label: "No dominant occupant",
    color: INK_MUTED,
    defaultRegister: "research",
    note: "Read primarily from sign, lord, aspects, and the selected register.",
    nature: "house and lord signal only",
  },
};

const DIGNITIES: Record<
  Dignity,
  { label: string; color: string; note: string }
> = {
  strong: {
    label: "Strong / own sign",
    color: GREEN,
    note: "The 8th is well-resourced; transformation has support.",
  },
  mixed: {
    label: "Mixed / ordinary",
    color: GOLD,
    note: "Read proportionately; neither overclaim nor catastrophise.",
  },
  weak: {
    label: "Weak / afflicted",
    color: VERMILION,
    note: "Real difficulty is present; name it before offering the transformation frame.",
  },
};

const MISTAKES = [
  {
    label: "Collapsing the three registers into one",
    wrong: "Every strong 8th house is crisis-driven spirituality.",
    right:
      "Read the actual occupant, lord, and aspects before assigning a register. Jupiter in Chart S1 points to research, not crisis.",
  },
  {
    label: "Rushing to transformation before naming difficulty",
    wrong: "Lead with \"this is your spiritual awakening\" when a client is in crisis.",
    right:
      "Name the real difficulty first, honestly and without minimising, then offer the transformation framing.",
  },
  {
    label: "Reading crisis as fated purpose",
    wrong: "The crisis happened in order to produce spiritual growth.",
    right:
      "Say that crisis and shift sit in the same house-domain as a disclosed pattern, without asserting cosmic purpose.",
  },
  {
    label: "Drifting into longevity or health forecasting",
    wrong: "Extend an 8th-house discussion into a comment on future health or lifespan.",
    right:
      "Redirect away from any span-adjacent claim; the 8th's longevity signification is out of scope.",
  },
];

const CRISIS_STEPS = [
  {
    title: "Name the real difficulty first",
    text: "Acknowledge the crisis explicitly. The chart shows a house-level signal consistent with real difficulty, not a minor one.",
  },
  {
    title: "Offer the transformation framing",
    text: "Only after the difficulty is named, offer that the same house is classically the place where difficulty becomes depth.",
  },
  {
    title: "State correlation, not purpose",
    text: "The crisis and the resulting shift sit in the same house-domain. Do not say the crisis was meant to happen.",
  },
  {
    title: "Redirect longevity or health queries",
    text: "Nothing in the 8th licenses a lifespan or health forecast. Stay within transformation and depth.",
  },
];

const PRESETS: Record<
  PresetKey,
  {
    label: string;
    occupant: Occupant;
    dignity: Dignity;
    register: Register;
    note: string;
    color: string;
  }
> = {
  "chart-s1": {
    label: "Chart S1",
    occupant: "jupiter",
    dignity: "strong",
    register: "research",
    note: "Jupiter in Sagittarius 8th; research/wisdom register with bonus aspects to 4 and 12.",
    color: BLUE,
  },
  "example-2": {
    label: "Example 2",
    occupant: "saturn",
    dignity: "weak",
    register: "crisis",
    note: "Saturn in 8th, difficult dignity, aspected by Mars; client mid-crisis.",
    color: VERMILION,
  },
  "occult-sample": {
    label: "Occult sample",
    occupant: "rahu",
    dignity: "mixed",
    register: "occult",
    note: "Rahu in 8th; unconventional, esoteric-technical register.",
    color: PURPLE,
  },
};

export function EighthHouseSpiritualTransformation() {
  const [register, setRegister] = useState<Register>("research");
  const [occupant, setOccupant] = useState<Occupant>("jupiter");
  const [dignity, setDignity] = useState<Dignity>("strong");
  const [crisisStep, setCrisisStep] = useState(0);
  const [longevityQuery, setLongevityQuery] = useState(false);
  const [showSloka, setShowSloka] = useState(false);
  const [highlightAspects, setHighlightAspects] = useState(false);
  const [openMistakes, setOpenMistakes] = useState<Record<number, boolean>>({});

  const applyPreset = (key: PresetKey) => {
    const p = PRESETS[key];
    setOccupant(p.occupant);
    setDignity(p.dignity);
    setRegister(p.register);
    setCrisisStep(key === "example-2" ? 1 : 0);
    setLongevityQuery(false);
    setHighlightAspects(key === "chart-s1");
  };

  const handleOccupant = (key: Occupant) => {
    setOccupant(key);
    setRegister(OCCUPANTS[key].defaultRegister);
  };

  const reset = () => {
    setOccupant("jupiter");
    setDignity("strong");
    setRegister("research");
    setCrisisStep(0);
    setLongevityQuery(false);
    setShowSloka(false);
    setHighlightAspects(false);
    setOpenMistakes({});
  };

  const toggleMistake = (index: number) =>
    setOpenMistakes((prev) => ({ ...prev, [index]: !prev[index] }));

  const suggestedMismatch = OCCUPANTS[occupant].defaultRegister !== register;

  const synthesis = useMemo(() => {
    const occ = OCCUPANTS[occupant];
    const reg = REGISTERS[register];
    const dig = DIGNITIES[dignity];

    let reading = `${dig.note} `;
    if (occupant !== "none") {
      reading += `${occ.label} introduces ${occ.nature}. `;
    }
    reading += `This leans toward the ${reg.label.toLowerCase()} register: ${reg.description} `;

    if (suggestedMismatch) {
      const suggested = REGISTERS[occ.defaultRegister];
      reading += `Note: ${occ.label} more often suggests the ${suggested.label.toLowerCase()} register, so explain why the ${reg.label.toLowerCase()} reading is supported here. `;
    }

    if (dignity === "weak" || register === "crisis") {
      reading +=
        "In a live crisis, name the difficulty first, then offer the transformation framing as a technical observation, not a comforting platitude. ";
    } else {
      reading +=
        "Avoid collapsing the three registers; this is one genuine possibility among the house's spiritual doors. ";
    }

    reading +=
      "Never pronounce a longevity or health verdict from the 8th.";
    return reading;
  }, [register, occupant, dignity, suggestedMismatch]);

  return (
    <div data-interactive="eighth-house-spiritual-transformation" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={panelStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>8th house — moksa transformation stage</p>
            <h2 style={{ margin: "0.2rem 0 0", color: VERMILION, fontSize: "1.35rem", fontWeight: 600 }}>
              The 8th as hidden, occult, transformation
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 860, fontWeight: 400 }}>
              Read the 8th as the mokṣa-trikona&apos;s crossing: crisis, occult aptitude, and research depth are three distinct doors, not one.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, VERMILION)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(300px, 1fr) minmax(300px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <section style={panelStyle}>
          <p style={eyebrowStyle}>Mokṣa arc</p>
          <TransformationArcSvg selectedRegister={register} onSelectRegister={setRegister} />
          <div style={{ marginTop: "0.75rem", display: "grid", gap: "0.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <span style={{ width: 12, height: 12, borderRadius: "50%", background: GOLD }} />
              <span style={{ color: INK_SECONDARY, fontSize: "0.88rem" }}>4th — foundation</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <span style={{ width: 12, height: 12, borderRadius: "50%", background: VERMILION }} />
              <span style={{ color: INK_SECONDARY, fontSize: "0.88rem" }}>8th — transformation</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <span style={{ width: 12, height: 12, borderRadius: "50%", background: PURPLE }} />
              <span style={{ color: INK_SECONDARY, fontSize: "0.88rem" }}>12th — release</span>
            </div>
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Three registers" icon={<Scale size={18} />} color={VERMILION}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
              A strong 8th does not automatically mean crisis. Choose the register the chart actually supports.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.5rem", marginTop: "0.7rem" }}>
              {(Object.entries(REGISTERS) as [Register, typeof REGISTERS.research][]).map(([key, r]) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={register === key}
                  onClick={() => setRegister(key)}
                  style={registerChipStyle(register === key, r.color)}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>{r.icon}{r.label}</span>
                  <span style={{ fontSize: "0.78rem", opacity: 0.9 }}>Planets: {r.typicalPlanets}</span>
                </button>
              ))}
            </div>
            <div style={{ marginTop: "0.7rem", padding: "0.6rem", borderRadius: 8, background: `${REGISTERS[register].color}10`, border: `1px solid ${REGISTERS[register].color}55` }}>
              <p style={{ margin: 0, color: INK_PRIMARY, fontWeight: 500, fontSize: "0.9rem" }}>
                {REGISTERS[register].label}
              </p>
              <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
                {REGISTERS[register].description}
              </p>
              <p style={{ margin: "0.35rem 0 0", color: INK_MUTED, fontSize: "0.82rem", lineHeight: 1.5 }}>
                {REGISTERS[register].discipline}
              </p>
            </div>
          </Panel>

          <Panel title="Occupant of the 8th" icon={<ShieldCheck size={18} />} color={BLUE}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
              Selecting an occupant suggests a register, but you can override it to read what is actually there.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "0.45rem", marginTop: "0.7rem" }}>
              {(Object.entries(OCCUPANTS) as [Occupant, typeof OCCUPANTS.jupiter][]).map(([key, o]) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={occupant === key}
                  onClick={() => handleOccupant(key)}
                  style={occupantChipStyle(occupant === key, o.color)}
                >
                  {o.label}
                </button>
              ))}
            </div>
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
              {OCCUPANTS[occupant].note}
            </p>
          </Panel>

          <Panel title="House strength" icon={<Scale size={18} />} color={GOLD}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.4rem" }}>
              {(["strong", "mixed", "weak"] as Dignity[]).map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={dignity === value}
                  onClick={() => setDignity(value)}
                  style={dignityChipStyle(dignity === value, DIGNITIES[value].color, value)}
                >
                  {DIGNITIES[value].label}
                </button>
              ))}
            </div>
          </Panel>
        </section>
      </div>

      <section style={{ ...panelStyle, borderColor: `${REGISTERS[register].color}55`, background: `${REGISTERS[register].color}08` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
          <p style={eyebrowStyle}>Live reading</p>
          {suggestedMismatch && (
            <span style={{ color: VERMILION, fontSize: "0.8rem", fontWeight: 500 }}>Register mismatch — state your reasoning</span>
          )}
        </div>
        <h3 style={{ margin: "0.15rem 0 0.6rem", color: REGISTERS[register].color, fontSize: "1.1rem", fontWeight: 600 }}>
          {REGISTERS[register].label}
        </h3>
        <p style={{ margin: 0, color: INK_PRIMARY, lineHeight: 1.6, fontWeight: 400 }}>{synthesis}</p>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(300px, 1fr) minmax(300px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <section style={panelStyle}>
          <p style={eyebrowStyle}>Crisis consultation protocol</p>
          <h3 style={{ margin: "0.15rem 0 0.75rem", color: VERMILION, fontSize: "1.1rem", fontWeight: 600 }}>
            Name difficulty first, then transformation
          </h3>
          <div style={{ display: "grid", gap: "0.55rem" }}>
            {CRISIS_STEPS.map((step, index) => {
              const active = index === crisisStep;
              const completed = index < crisisStep;
              return (
                <div
                  key={index}
                  style={{
                    border: `1px solid ${active ? VERMILION : completed ? `${GREEN}55` : HAIRLINE}`,
                    borderRadius: 8,
                    background: active ? `${VERMILION}0D` : completed ? `${GREEN}0D` : SURFACE,
                    padding: "0.7rem",
                    opacity: completed || active ? 1 : 0.75,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <span
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: active ? VERMILION : completed ? GREEN : INK_MUTED,
                        color: "#fff",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                      }}
                    >
                      {completed ? "✓" : index + 1}
                    </span>
                    <span style={{ color: active ? VERMILION : INK_PRIMARY, fontWeight: 500 }}>{step.title}</span>
                  </div>
                  {active && (
                    <p style={{ margin: "0.45rem 0 0 2rem", color: INK_SECONDARY, fontSize: "0.86rem", lineHeight: 1.55 }}>
                      {step.text}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
            <button
              type="button"
              onClick={() => setCrisisStep((s) => Math.max(0, s - 1))}
              disabled={crisisStep === 0}
              style={{ ...buttonStyle(false, VERMILION), opacity: crisisStep === 0 ? 0.5 : 1 }}
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setCrisisStep((s) => Math.min(CRISIS_STEPS.length, s + 1))}
              disabled={crisisStep === CRISIS_STEPS.length}
              style={buttonStyle(false, VERMILION)}
            >
              {crisisStep === CRISIS_STEPS.length ? "Completed" : "Next step"}
            </button>
          </div>
          {crisisStep === CRISIS_STEPS.length && (
            <p style={{ margin: "0.6rem 0 0", color: GREEN, fontWeight: 500 }}>
              Protocol complete. The reading stayed within transformation and depth, with no purpose-language and no longevity claim.
            </p>
          )}
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Longevity guard" icon={<ShieldCheck size={18} />} color={PURPLE}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
              The 8th&apos;s longevity signification is never a safe basis for a lifespan verdict, especially in a spiritual-path consultation.
            </p>
            <button
              type="button"
              onClick={() => setLongevityQuery(true)}
              style={{ ...smallChipStyle(false, VERMILION), marginTop: "0.7rem" }}
            >
              Try to query a longevity verdict
            </button>
            {longevityQuery && (
              <div style={{ marginTop: "0.7rem", padding: "0.7rem", borderRadius: 8, background: `${VERMILION}10`, border: `1px solid ${VERMILION}55` }}>
                <p style={{ margin: 0, color: VERMILION, fontWeight: 500 }}>The tool declines this query.</p>
                <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
                  Redirect toward what the 8th can honestly say: the register of transformation, the presence of difficulty, and the door to depth. Do not drift into health or life-span forecasting.
                </p>
              </div>
            )}
          </Panel>

          <Panel title="Lesson presets" icon={<ShieldCheck size={18} />} color={GREEN}>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              {(Object.entries(PRESETS) as [PresetKey, typeof PRESETS["chart-s1"]][]).map(([key, p]) => (
                <button key={key} type="button" onClick={() => applyPreset(key)} style={presetButtonStyle(p.color)}>
                  <span style={{ fontWeight: 500 }}>{p.label}</span>
                  <span style={{ fontSize: "0.8rem", color: INK_SECONDARY }}>{p.note}</span>
                </button>
              ))}
            </div>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(300px, 1fr) minmax(300px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <section style={panelStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
            <p style={eyebrowStyle}>Chart S1 bonus finding</p>
            <button
              type="button"
              aria-pressed={highlightAspects}
              onClick={() => setHighlightAspects((v) => !v)}
              style={smallChipStyle(highlightAspects, BLUE)}
            >
              {highlightAspects ? "Hide aspects" : "Highlight Jupiter aspects"}
            </button>
          </div>
          <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.1rem", fontWeight: 600 }}>
            Jupiter in Sagittarius 8th aspects the whole trikona
          </h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
            <thead>
              <tr>
                <th style={thStyle}>House</th>
                <th style={thStyle}>Sign</th>
                <th style={thStyle}>Lord</th>
                <th style={thStyle}>Occupant</th>
                <th style={thStyle}>Note</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                <td style={tdStyle}><span style={{ color: VERMILION, fontWeight: 500 }}>8th</span></td>
                <td style={tdStyle}>Sagittarius</td>
                <td style={tdStyle}>Jupiter</td>
                <td style={tdStyle}>Jupiter</td>
                <td style={{ ...tdStyle, color: INK_SECONDARY }}>Lord in own house</td>
              </tr>
            </tbody>
          </table>
          <div style={{ marginTop: "0.75rem" }}>
            <ChartS1AspectSvg highlight={highlightAspects} />
          </div>
          <p style={{ margin: "0.6rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.9rem" }}>
            Jupiter&apos;s special aspects from the 8th reach the 12th, 2nd, and 4th — meaning the 8th occupant also aspects both other mokṣa-trikona houses. This was a discovered convergence, not engineered backward.
          </p>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <section style={panelStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
              <p style={eyebrowStyle}>Teaching verse</p>
              <button type="button" aria-pressed={showSloka} onClick={() => setShowSloka((v) => !v)} style={smallChipStyle(showSloka, GOLD)}>
                {showSloka ? "Hide verse" : "Show verse"}
              </button>
            </div>
            {showSloka && (
              <div style={{ marginTop: "0.75rem", color: INK_SECONDARY, lineHeight: 1.7, fontWeight: 400 }}>
                <p style={{ margin: 0, fontStyle: "italic" }}>
                  guptaṁ tantraṁ parivartaṁ tridhā sādhana-mārgakam |<br />
                  saṅkaṭa-dvāreṇa guhyena gaveṣaṇena vā bhavet ||
                </p>
                <p style={{ margin: "0.6rem 0 0", color: INK_PRIMARY }}>
                  &quot;The hidden, the tantric, and the transformative — the path of practice takes a threefold form: through the door of crisis, through the secret rite, or through inquiry.&quot;
                </p>
                <p style={{ margin: "0.5rem 0 0", fontSize: "0.85rem", color: INK_MUTED }}>
                  Composite paraphrase of the 8th house&apos;s spiritual-transformation role.
                </p>
              </div>
            )}
          </section>

          <section style={panelStyle}>
            <p style={eyebrowStyle}>Common mistakes</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.1rem", fontWeight: 600 }}>Hold the 8th-house discipline</h3>
            <div style={{ display: "grid", gap: "0.65rem" }}>
              {MISTAKES.map((item, index) => {
                const open = openMistakes[index];
                return (
                  <div key={index} style={{ border: `1px solid ${open ? VERMILION : HAIRLINE}`, borderRadius: 8, background: open ? `${VERMILION}0D` : SURFACE, padding: "0.75rem" }}>
                    <button
                      type="button"
                      onClick={() => toggleMistake(index)}
                      style={{ width: "100%", textAlign: "left", background: "transparent", border: "none", padding: 0, cursor: "pointer", color: INK_PRIMARY, fontWeight: 500 }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Info size={15} aria-hidden="true" style={{ color: open ? VERMILION : INK_MUTED }} />
                        {item.label}
                      </span>
                    </button>
                    {open && (
                      <div style={{ marginTop: "0.6rem", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
                        <p style={{ margin: 0, color: VERMILION }}><span style={{ fontWeight: 500 }}>Overclaim:</span> {item.wrong}</p>
                        <p style={{ margin: "0.35rem 0 0" }}><span style={{ fontWeight: 500, color: GREEN }}>Honest reading:</span> {item.right}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </section>
      </div>
    </div>
  );
}

function TransformationArcSvg({
  selectedRegister,
  onSelectRegister,
}: {
  selectedRegister: Register;
  onSelectRegister: (r: Register) => void;
}) {
  const p4 = { x: 170, y: 55 };
  const p8 = { x: 170, y: 210 };
  const p12 = { x: 170, y: 365 };
  const nodes: Record<Register, { x: number; y: number }> = {
    crisis: { x: 70, y: 210 },
    research: { x: 170, y: 130 },
    occult: { x: 270, y: 210 },
  };

  return (
    <svg viewBox="0 0 340 420" role="img" aria-label="Moksa arc with 8th house transformation stage and three register doors" style={{ width: "100%", maxHeight: 420, margin: "0.5rem auto 0.8rem", display: "block" }}>
      <defs>
        <marker id="arrowGold" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill={GOLD} />
        </marker>
        <marker id="arrowVermilion" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill={VERMILION} />
        </marker>
        <marker id="arrowPurple" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill={PURPLE} />
        </marker>
      </defs>

      {/* Flow arrows */}
      <line x1={p4.x} y1={p4.y + 28} x2={p8.x} y2={p8.y - 48} stroke={GOLD} strokeWidth="2.5" strokeDasharray="5 4" markerEnd="url(#arrowGold)" />
      <line x1={p8.x} y1={p8.y + 48} x2={p12.x} y2={p12.y - 28} stroke={VERMILION} strokeWidth="2.5" strokeDasharray="5 4" markerEnd="url(#arrowVermilion)" />

      {/* 4th node */}
      <circle cx={p4.x} cy={p4.y} r={28} fill={`${GOLD}18`} stroke={GOLD} strokeWidth="3" />
      <text x={p4.x} y={p4.y + 5} textAnchor="middle" fill={GOLD} fontSize="16" fontWeight="600">4</text>
      <text x={p4.x} y={p4.y - 38} textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="500">foundation</text>

      {/* 12th node */}
      <circle cx={p12.x} cy={p12.y} r={28} fill={`${PURPLE}18`} stroke={PURPLE} strokeWidth="3" />
      <text x={p12.x} y={p12.y + 5} textAnchor="middle" fill={PURPLE} fontSize="16" fontWeight="600">12</text>
      <text x={p12.x} y={p12.y + 42} textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="500">release</text>

      {/* 8th node */}
      <circle cx={p8.x} cy={p8.y} r={46} fill={`${VERMILION}18`} stroke={VERMILION} strokeWidth="4" />
      <text x={p8.x} y={p8.y - 6} textAnchor="middle" fill={VERMILION} fontSize="18" fontWeight="600">8</text>
      <text x={p8.x} y={p8.y + 14} textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="500">transformation</text>

      {/* Register nodes */}
      {(Object.entries(nodes) as [Register, { x: number; y: number }][]).map(([key, point]) => {
        const r = REGISTERS[key];
        const active = selectedRegister === key;
        return (
          <g
            key={key}
            role="button"
            tabIndex={0}
            aria-label={`Select ${r.label} register`}
            onClick={() => onSelectRegister(key)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onSelectRegister(key); }}
            style={{ cursor: "pointer" }}
          >
            <line x1={p8.x} y1={p8.y} x2={point.x} y2={point.y} stroke={active ? r.color : `${r.color}44`} strokeWidth={active ? 3 : 2} />
            <circle cx={point.x} cy={point.y} r={active ? 26 : 22} fill={active ? r.color : `${r.color}14`} stroke={active ? "#fff" : r.color} strokeWidth="2.5" />
            <text x={point.x} y={point.y + 4} textAnchor="middle" fill={active ? "#fff" : r.color} fontSize="13" fontWeight="600" style={{ pointerEvents: "none" }}>{key[0].toUpperCase()}</text>
            <text x={point.x} y={point.y + (active ? 38 : 34)} textAnchor="middle" fill={r.color} fontSize="10" fontWeight="500" style={{ pointerEvents: "none" }}>{key}</text>
          </g>
        );
      })}
    </svg>
  );
}

function ChartS1AspectSvg({ highlight }: { highlight: boolean }) {
  const p8 = { x: 170, y: 170 };
  const p4 = { x: 60, y: 60 };
  const p12 = { x: 280, y: 60 };
  const p2 = { x: 170, y: 30 };

  return (
    <svg viewBox="0 0 340 220" role="img" aria-label="Jupiter in the 8th aspects the 4th and 12th moksa trikona houses" style={{ width: "100%", maxHeight: 220, display: "block" }}>
      <rect x={24} y={24} width={292} height={172} rx={8} fill={`${VERMILION}0A`} stroke={HAIRLINE} />

      {/* Aspect lines */}
      <line x1={p8.x} y1={p8.y - 32} x2={p4.x + 22} y2={p4.y + 22} stroke={highlight ? BLUE : `${BLUE}33`} strokeWidth={highlight ? 3 : 2} strokeDasharray="4 3" />
      <line x1={p8.x} y1={p8.y - 32} x2={p12.x - 22} y2={p12.y + 22} stroke={highlight ? BLUE : `${BLUE}33`} strokeWidth={highlight ? 3 : 2} strokeDasharray="4 3" />
      <line x1={p8.x} y1={p8.y - 32} x2={p2.x} y2={p2.y + 14} stroke={highlight ? `${BLUE}55` : `${BLUE}22`} strokeWidth={highlight ? 2.5 : 2} strokeDasharray="4 3" />

      {/* 8th / Jupiter */}
      <circle cx={p8.x} cy={p8.y} r={34} fill={`${BLUE}18`} stroke={BLUE} strokeWidth="3" />
      <text x={p8.x} y={p8.y - 4} textAnchor="middle" fill={BLUE} fontSize="14" fontWeight="600">8th</text>
      <text x={p8.x} y={p8.y + 14} textAnchor="middle" fill={INK_SECONDARY} fontSize="11" fontWeight="500">Jupiter</text>

      {/* 4th */}
      <circle cx={p4.x} cy={p4.y} r={24} fill={`${GOLD}18`} stroke={GOLD} strokeWidth="2.5" />
      <text x={p4.x} y={p4.y + 4} textAnchor="middle" fill={GOLD} fontSize="13" fontWeight="600">4</text>

      {/* 12th */}
      <circle cx={p12.x} cy={p12.y} r={24} fill={`${PURPLE}18`} stroke={PURPLE} strokeWidth="2.5" />
      <text x={p12.x} y={p12.y + 4} textAnchor="middle" fill={PURPLE} fontSize="13" fontWeight="600">12</text>

      {/* 2nd */}
      <circle cx={p2.x} cy={p2.y} r={18} fill={`${BLUE}0D`} stroke={`${BLUE}55`} strokeWidth="2" />
      <text x={p2.x} y={p2.y + 4} textAnchor="middle" fill={BLUE} fontSize="11" fontWeight="500">2</text>

      <text x={170} y={205} textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight="500">
        {highlight ? "Jupiter aspects both mokṣa-trikona houses (4 and 12)" : "Toggle to highlight the bonus aspect finding"}
      </text>
    </svg>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem", boxShadow: SHADOW }}>
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
    fontWeight: 500,
    cursor: "pointer",
  };
}

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.45rem 0.65rem",
    fontWeight: 500,
    cursor: "pointer",
  };
}

function registerChipStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "grid",
    gap: "0.15rem",
    textAlign: "left",
    border: `1px solid ${active ? color : `${color}55`}`,
    borderRadius: 8,
    background: active ? color : `${color}0D`,
    color: active ? "#fff" : color,
    padding: "0.55rem",
    fontWeight: 500,
    cursor: "pointer",
  };
}

function occupantChipStyle(active: boolean, color: string): CSSProperties {
  return {
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}14` : SURFACE,
    color: active ? color : INK_SECONDARY,
    padding: "0.55rem",
    fontWeight: 500,
    cursor: "pointer",
    fontSize: "0.85rem",
  };
}

function dignityChipStyle(active: boolean, color: string, value: Dignity): CSSProperties {
  const alpha = value === "weak" ? "0D" : value === "mixed" ? "14" : "22";
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : `${color}${alpha}`,
    color: active ? "#fff" : color,
    padding: "0.45rem",
    fontWeight: 500,
    cursor: "pointer",
  };
}

function presetButtonStyle(color: string): CSSProperties {
  return {
    display: "grid",
    gap: "0.15rem",
    textAlign: "left",
    border: `1px solid ${color}66`,
    borderRadius: 8,
    background: `${color}10`,
    color,
    padding: "0.65rem",
    cursor: "pointer",
  };
}

const panelStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  boxShadow: SHADOW,
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: INK_MUTED,
  fontSize: "0.76rem",
  fontWeight: 600,
};

const thStyle: CSSProperties = {
  textAlign: "left",
  padding: "0.5rem 0.5rem 0.5rem 0",
  borderBottom: `1px solid ${HAIRLINE}`,
  color: INK_MUTED,
  fontWeight: 600,
  fontSize: "0.8rem",
};

const tdStyle: CSSProperties = {
  padding: "0.55rem 0.5rem 0.55rem 0",
  verticalAlign: "top",
  fontWeight: 400,
};
