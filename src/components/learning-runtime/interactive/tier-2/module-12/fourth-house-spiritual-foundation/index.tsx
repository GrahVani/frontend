"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  ArrowRight,
  BookOpen,
  Car,
  Heart,
  Home,
  Info,
  Layers,
  Moon,
  RotateCcw,
  ShieldCheck,
  TreePine,
} from "lucide-react";

type Strength = "strong" | "mixed" | "weak";
type Occupant = "sun-own" | "saturn" | "ketu" | "none";
type Domain = "spiritual" | "mother" | "property" | "education" | "vehicles";

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

const DOMAINS: Record<
  Domain,
  { label: string; icon: ReactNode; karakas: string[]; note: string }
> = {
  spiritual: {
    label: "Spiritual path",
    icon: <Heart size={16} />,
    karakas: ["Moon"],
    note: "For any spiritual-path question, the 4th's relevant kāraka is always the Moon — the significator of manas, the mind.",
  },
  mother: {
    label: "Mother / home comfort",
    icon: <Home size={16} />,
    karakas: ["Moon"],
    note: "The Moon is the primary kāraka for mother and emotional security.",
  },
  property: {
    label: "Property / land",
    icon: <TreePine size={16} />,
    karakas: ["Mars", "Saturn"],
    note: "Land and property questions turn to Mars and Saturn rather than the Moon.",
  },
  education: {
    label: "Education",
    icon: <BookOpen size={16} />,
    karakas: ["Mercury"],
    note: "Middle-range education points to Mercury.",
  },
  vehicles: {
    label: "Vehicles",
    icon: <Car size={16} />,
    karakas: ["Venus"],
    note: "Vehicles point to Venus.",
  },
};

const STRENGTHS: Record<
  Strength,
  { label: string; color: string; houseReading: string; moonReading: string }
> = {
  strong: {
    label: "Strong",
    color: GREEN,
    houseReading: "The 4th house and lord are well-placed — the foundation stage offers easier starting conditions.",
    moonReading: "The Moon is well-supported — the mind tends toward steadiness as a starting condition.",
  },
  mixed: {
    label: "Mixed",
    color: GOLD,
    houseReading: "The 4th house and lord are ordinary — the foundation is usable but not exceptionally resourced.",
    moonReading: "The Moon is unremarkable — the mind is neither a separate source of strength nor a separate obstacle.",
  },
  weak: {
    label: "Weak / afflicted",
    color: VERMILION,
    houseReading: "The 4th house and lord are strained — the foundation-stage work is itself likely to be part of the path.",
    moonReading: "The Moon is afflicted or weak — settling the mind is likely to be an active, ongoing part of the path.",
  },
};

const OCCUPANTS: Record<
  Occupant,
  { label: string; color: string; note: string }
> = {
  "sun-own": {
    label: "Sun in own sign / own house",
    color: GOLD,
    note: "A clean lord-in-own-house signal — Chart S1's pattern for a settled foundation.",
  },
  saturn: {
    label: "Saturn in the 4th",
    color: VERMILION,
    note: "A sobering presence: the home base feels heavier, more serious, or more constrained.",
  },
  ketu: {
    label: "Ketu in the 4th",
    color: PURPLE,
    note: "Detachment from home and origin; the native may feel inwardly unmoored early on.",
  },
  none: {
    label: "No dominant occupant",
    color: INK_MUTED,
    note: "Read primarily from sign, lord, aspects, and the relevant kāraka.",
  },
};

const MISTAKES = [
  {
    label: "Strong 4th as proof of spiritual depth",
    wrong: "A strong 4th house means the native is spiritually advanced.",
    right:
      "A strong 4th offers easier starting conditions. It is not a ceiling, a measure of attainment, or a guarantee.",
  },
  {
    label: "Difficult 4th as no capacity",
    wrong: "An afflicted 4th means the native lacks spiritual foundation.",
    right:
      "A difficult 4th means the foundation-stage work — settling mind, home, origin — is itself a genuine part of the path.",
  },
  {
    label: "Reading every kāraka for a spiritual question",
    wrong: "For spiritual path, weigh Mars, Mercury, and Venus alongside the Moon.",
    right:
      "Let the question pick the kāraka. Spiritual-path questions consistently pick the Moon; leave land, education, and vehicles kārakas out of this reading.",
  },
  {
    label: "Assuming house-and-lord always match the kāraka",
    wrong: "A strong 4th house means the Moon must also be strong, or vice versa.",
    right:
      "Check the 4th house-and-lord signal and the Moon's own condition as two independent facts. Chart S1 itself separates them.",
  },
];

export function FourthHouseSpiritualFoundation() {
  const [domain, setDomain] = useState<Domain>("spiritual");
  const [foundation, setFoundation] = useState<Strength>("strong");
  const [moon, setMoon] = useState<Strength>("mixed");
  const [occupant, setOccupant] = useState<Occupant>("sun-own");
  const [showSloka, setShowSloka] = useState(false);
  const [openMistakes, setOpenMistakes] = useState<Record<number, boolean>>({});

  const synthesis = useMemo(() => {
    const housePart = STRENGTHS[foundation].houseReading;
    const moonPart = STRENGTHS[moon].moonReading;
    const occupantPart = OCCUPANTS[occupant].note;

    let closing = "";
    if (foundation === "strong" && moon !== "weak") {
      closing =
        "The foundation stage is the most supported part of the picture. This gives steadier starting conditions; it does not, by itself, measure how far the native will travel.";
    } else if (foundation === "weak" || moon === "weak") {
      closing =
        "The foundation stage is where the work is likely to happen. That is not a deficiency — it is a different, and equally real, starting condition for the path.";
    } else {
      closing =
        "Read these two signals as independent facts, then state the shape plainly without pronouncing a destined outcome.";
    }

    return { housePart, moonPart, occupantPart, closing };
  }, [foundation, moon, occupant]);

  const applyPreset = (preset: "chart-s1" | "example-2") => {
    if (preset === "chart-s1") {
      setFoundation("strong");
      setMoon("mixed");
      setOccupant("sun-own");
    } else {
      setFoundation("weak");
      setMoon("weak");
      setOccupant("saturn");
    }
  };

  const toggleMistake = (index: number) =>
    setOpenMistakes((prev) => ({ ...prev, [index]: !prev[index] }));

  return (
    <div data-interactive="fourth-house-spiritual-foundation" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={panelStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>4th house — moksa foundation stage</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Spiritual foundation and heart-base
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 860, fontWeight: 400 }}>
              Read the 4th as precondition, not measurement. The Moon is the spiritual-path kāraka, checked separately from the house-and-lord signal.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setDomain("spiritual");
              setFoundation("strong");
              setMoon("mixed");
              setOccupant("sun-own");
              setShowSloka(false);
              setOpenMistakes({});
            }}
            style={buttonStyle(false)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(300px, 1fr) minmax(300px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <section style={panelStyle}>
          <p style={eyebrowStyle}>Foundation in the trikona arc</p>
          <FoundationSvg />
          <div style={{ marginTop: "0.75rem", display: "grid", gap: "0.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <span style={{ width: 12, height: 12, borderRadius: "50%", background: GOLD }} />
              <span style={{ color: INK_SECONDARY, fontSize: "0.88rem" }}>4th — foundation / Sukha</span>
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
          <Panel title="Let the question pick the karaka" icon={<Layers size={18} />} color={BLUE}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
              The 4th holds several kārakas. The question in front of you decides which one matters.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.5rem", marginTop: "0.7rem" }}>
              {(Object.entries(DOMAINS) as [Domain, typeof DOMAINS.spiritual][]).map(([key, d]) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={domain === key}
                  onClick={() => setDomain(key)}
                  style={domainChipStyle(domain === key, BLUE)}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>{d.icon}{d.label}</span>
                </button>
              ))}
            </div>
            <div style={{ marginTop: "0.7rem", padding: "0.6rem", borderRadius: 8, background: `${BLUE}10`, border: `1px solid ${BLUE}55` }}>
              <p style={{ margin: 0, color: INK_PRIMARY, fontWeight: 500, fontSize: "0.9rem" }}>
                Relevant kāraka{DOMAINS[domain].karakas.length > 1 ? "s" : ""}: {DOMAINS[domain].karakas.join(" / ")}
              </p>
              <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
                {DOMAINS[domain].note}
              </p>
            </div>
          </Panel>

          <Panel title="Settled foundation vs. foundation as the work" icon={<Home size={18} />} color={GOLD}>
            <div style={{ display: "grid", gap: "0.45rem" }}>
              <div style={{ padding: "0.6rem", borderRadius: 8, background: `${GREEN}10`, border: `1px solid ${GREEN}55` }}>
                <span style={{ color: GREEN, fontWeight: 500 }}>Strong 4th</span>
                <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, fontSize: "0.86rem", lineHeight: 1.5 }}>
                  Easier starting conditions — a settled heart from which deeper work can begin.
                </p>
              </div>
              <div style={{ padding: "0.6rem", borderRadius: 8, background: `${VERMILION}10`, border: `1px solid ${VERMILION}55` }}>
                <span style={{ color: VERMILION, fontWeight: 500 }}>Difficult 4th</span>
                <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, fontSize: "0.86rem", lineHeight: 1.5 }}>
                  The foundation-stage work itself — settling mind, home, origin — is a genuine, active part of the path.
                </p>
              </div>
            </div>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(300px, 1fr) minmax(300px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <section style={panelStyle}>
          <p style={eyebrowStyle}>Foundation-state builder</p>
          <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.1rem", fontWeight: 600 }}>
            Separate the house-and-lord signal from the Moon
          </h3>

          <div style={{ display: "grid", gap: "0.9rem" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                <span style={{ fontWeight: 500 }}>4th house and lord</span>
                <span style={{ color: INK_MUTED, fontSize: "0.82rem" }}>{STRENGTHS[foundation].label}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.4rem" }}>
                {(["strong", "mixed", "weak"] as Strength[]).map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={foundation === value}
                    onClick={() => setFoundation(value)}
                    style={strengthChipStyle(foundation === value, STRENGTHS[value].color, value)}
                  >
                    {STRENGTHS[value].label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontWeight: 500 }}>
                  <Moon size={16} aria-hidden="true" />
                  Moon (spiritual-path karaka)
                </span>
                <span style={{ color: INK_MUTED, fontSize: "0.82rem" }}>{STRENGTHS[moon].label}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.4rem" }}>
                {(["strong", "mixed", "weak"] as Strength[]).map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={moon === value}
                    onClick={() => setMoon(value)}
                    style={strengthChipStyle(moon === value, STRENGTHS[value].color, value)}
                  >
                    {STRENGTHS[value].label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                <span style={{ fontWeight: 500 }}>Notable occupant of the 4th</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.4rem" }}>
                {(Object.entries(OCCUPANTS) as [Occupant, typeof OCCUPANTS["sun-own"]][]).map(([key, occ]) => (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={occupant === key}
                    onClick={() => setOccupant(key)}
                    style={occupantChipStyle(occupant === key, occ.color)}
                  >
                    {occ.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: "1rem", padding: "0.85rem", borderRadius: 8, background: `${GOLD}12`, border: `1px solid ${GOLD}55` }}>
            <p style={{ margin: 0, color: INK_PRIMARY, lineHeight: 1.6, fontWeight: 500 }}>{synthesis.housePart}</p>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.6, fontWeight: 400 }}>{synthesis.moonPart}</p>
            <p style={{ margin: "0.45rem 0 0", color: INK_MUTED, fontSize: "0.86rem", lineHeight: 1.5 }}>{synthesis.occupantPart}</p>
            <p style={{ margin: "0.6rem 0 0", color: INK_PRIMARY, lineHeight: 1.55, fontWeight: 500 }}>{synthesis.closing}</p>
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Lesson presets" icon={<ShieldCheck size={18} />} color={GREEN}>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <button type="button" onClick={() => applyPreset("chart-s1")} style={presetButtonStyle(GOLD)}>
                <span style={{ fontWeight: 500 }}>Chart S1</span>
                <span style={{ fontSize: "0.8rem", color: INK_SECONDARY }}>Sun in own house; Moon neutral in Pisces</span>
              </button>
              <button type="button" onClick={() => applyPreset("example-2")} style={presetButtonStyle(VERMILION)}>
                <span style={{ fontWeight: 500 }}>Example 2</span>
                <span style={{ fontSize: "0.8rem", color: INK_SECONDARY }}>Saturn in 4th; lord in 8th; Moon afflicted</span>
              </button>
            </div>
          </Panel>

          <Panel title="How to state it" icon={<ArrowRight size={18} />} color={PURPLE}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6, fontWeight: 400 }}>
              Name the 4th house-and-lord signal, then name the Moon&apos;s own condition as a separate fact. Finally, say what kind of starting condition this produces — easier, ordinary, or front-loaded — without calling it a destined outcome.
            </p>
          </Panel>
        </section>
      </div>

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
              hrdaya-sthanam sama-vrttim manasas ca candra-gatam |<br />
              sthiram va calam va sadhanasya mulam eva tat ||
            </p>
            <p style={{ margin: "0.6rem 0 0", color: INK_PRIMARY }}>
              &quot;The seat of the heart, the mind&apos;s settled state, governed by the Moon — whether steady or restless, this alone is the root of any practice.&quot;
            </p>
            <p style={{ margin: "0.5rem 0 0", fontSize: "0.85rem", color: INK_MUTED }}>
              Composite paraphrase of the 4th house&apos;s spiritual-foundation role.
            </p>
          </div>
        )}
      </section>

      <section style={panelStyle}>
        <p style={eyebrowStyle}>Common mistakes</p>
        <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.1rem", fontWeight: 600 }}>Hold the foundation-stage discipline</h3>
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
    </div>
  );
}

function FoundationSvg() {
  return (
    <svg viewBox="0 0 340 220" role="img" aria-label="The 4th house as the foundation stage beneath the 8th and 12th" style={{ width: "100%", maxHeight: 260, display: "block" }}>
      <defs>
        <linearGradient id="foundationGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={`${GOLD}33`} />
          <stop offset="100%" stopColor={`${GOLD}10`} />
        </linearGradient>
      </defs>

      {/* Foundation platform */}
      <rect x={50} y={150} width={240} height={50} rx={6} fill="url(#foundationGrad)" stroke={GOLD} strokeWidth="2" />
      <text x={170} y={182} textAnchor="middle" fill={GOLD} fontSize="15" fontWeight="600">4th house — Foundation / Sukha</text>

      {/* Left pillar to 8th */}
      <line x1={110} y1={150} x2={110} y2={80} stroke={VERMILION} strokeWidth="2" strokeDasharray="4 3" />
      <circle cx={110} cy={70} r={22} fill={`${VERMILION}18`} stroke={VERMILION} strokeWidth="2" />
      <text x={110} y={76} textAnchor="middle" fill={VERMILION} fontSize="14" fontWeight="600">8</text>
      <text x={110} y={45} textAnchor="middle" fill={INK_SECONDARY} fontSize="11" fontWeight="500">transformation</text>

      {/* Right pillar to 12th */}
      <line x1={230} y1={150} x2={230} y2={80} stroke={PURPLE} strokeWidth="2" strokeDasharray="4 3" />
      <circle cx={230} cy={70} r={22} fill={`${PURPLE}18`} stroke={PURPLE} strokeWidth="2" />
      <text x={230} y={76} textAnchor="middle" fill={PURPLE} fontSize="14" fontWeight="600">12</text>
      <text x={230} y={45} textAnchor="middle" fill={INK_SECONDARY} fontSize="11" fontWeight="500">release</text>

      {/* Moon / manas marker */}
      <circle cx={170} cy={120} r={16} fill={`${BLUE}18`} stroke={BLUE} strokeWidth="2" />
      <text x={170} y={125} textAnchor="middle" fill={BLUE} fontSize="12" fontWeight="600">Moon</text>
      <text x={170} y={145} textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="400">manas</text>

      <text x={170} y={25} textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="500">The liberation arc rests on the 4th</text>
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

function buttonStyle(active: boolean): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? BLUE : HAIRLINE}`,
    borderRadius: 8,
    background: active ? BLUE : "transparent",
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

function domainChipStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "grid",
    gap: "0.15rem",
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}14` : SURFACE,
    color: active ? color : INK_SECONDARY,
    padding: "0.55rem",
    fontWeight: 500,
    cursor: "pointer",
  };
}

function strengthChipStyle(active: boolean, color: string, value: Strength): CSSProperties {
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
