"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  CheckCircle2,
  HeartPulse,
  Info,
  Lock,
  RotateCcw,
  Scale,
  Stethoscope,
  XCircle,
} from "lucide-react";

type HouseKey = 8 | 12;
type SaturnDignity = "debilitated" | "mixed" | "strong";
type VenusDignity = "enemy" | "mixed" | "strong";
type ResponseKey = "alarm" | "compute" | "correct";

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

const HOUSES: Record<
  HouseKey,
  {
    label: string;
    name: string;
    color: string;
    icon: ReactNode;
    register: string;
    significations: string[];
    inversion: string;
  }
> = {
  8: {
    label: "8th house",
    name: "Randhra / Āyu",
    color: VERMILION,
    icon: <Stethoscope size={18} />,
    register: "Longevity, transformation, deep or hidden processes",
    significations: [
      "Longevity as a theme",
      "Transformation and sudden change",
      "Hidden or chronic conditions",
      "Deep-seated psychological or physical processes",
    ],
    inversion:
      "A well-dignified 8th lord tends toward resilience through transformation and deep vitality reserves, not simply 'more of whatever the 8th signifies'.",
  },
  12: {
    label: "12th house",
    name: "Vyaya",
    color: PURPLE,
    icon: <HeartPulse size={18} />,
    register: "Loss, dissolution, hospitalisation, confinement",
    significations: [
      "Loss and expenditure",
      "Hospitalisation and institutional care",
      "Confinement and isolation",
      "Spiritual dissolution",
    ],
    inversion:
      "A well-dignified 12th lord tends toward favourable outcomes from any hospitalisation or confinement that does occur, not toward more frequent loss.",
  },
};

const DUSTHANAS = [
  {
    house: 6,
    name: "Ripu / Śatru",
    color: BLUE,
    theme: "Disease, enemies, debt, daily struggle",
    inversion: "Strong lord improves recovery and capacity to overcome obstacles.",
  },
  {
    house: 8,
    name: "Randhra / Āyu",
    color: VERMILION,
    theme: "Longevity, transformation, hidden processes",
    inversion: "Strong lord tends toward resilience through transformation.",
  },
  {
    house: 12,
    name: "Vyaya",
    color: PURPLE,
    theme: "Loss, hospitalisation, dissolution",
    inversion: "Strong lord tends toward favourable resolution of confinement or loss.",
  },
];

const RESPONSES: Record<
  ResponseKey,
  { label: string; feedback: string; correct: boolean }
> = {
  alarm: {
    label: "Yes — the 8th house is the death house, so affliction there is alarming.",
    feedback:
      "This conflates longevity signification with death prediction. The 8th is never read as a 'you will die young' indicator.",
    correct: false,
  },
  compute: {
    label: "I can estimate your lifespan from the 8th-house strength, but I won't share the exact figure yet.",
    feedback:
      "Longevity computation is Chapter 3's dedicated arithmetic, with Chapter 7's ethical scaffolding. It is never improvised from house strength.",
    correct: false,
  },
  correct: {
    label: "No — the 8th relates to longevity as a theme, not a death prediction. I won't speculate about lifespan from a single house.",
    feedback:
      "Correct. This corrects the misconception, names the signification/computation distinction, and attends to the client's worry without overreaching.",
    correct: true,
  },
};

const MISTAKES = [
  {
    label: "Treating the 8th as 'the death house'",
    wrong: "Any 8th-house affliction is read as a death-adjacent signal.",
    right:
      "The 8th signifies longevity as a theme alongside transformation and hidden processes — read at constitutional-tendency level, never as a death indicator.",
  },
  {
    label: "Computing implicit longevity from house strength",
    wrong: "8th-house/lord strength is used to estimate how long a client will live.",
    right:
      "Longevity computation requires Chapter 3's full arithmetic and Chapter 7's ethical scaffolding — never improvised from house strength.",
  },
  {
    label: "Skipping neecha-bhaṅga on a debilitated dusthāna lord",
    wrong: "A debilitated 8th or 12th lord is read as straightforwardly weak.",
    right:
      "Always check cancellation conditions first; Saturn in Aries with Mars in a kendra has neecha-bhaṅga, softening the reading.",
  },
];

const RESTRAINTS = [
  {
    key: "death",
    label: "No death-related claim",
    note: "I will not treat the 8th or 12th as a death indicator.",
  },
  {
    key: "compute",
    label: "No improvised longevity computation",
    note: "I will not estimate lifespan from house strength alone.",
  },
  {
    key: "timing",
    label: "No hospitalisation-timing claim",
    note: "I will not name when a hospitalisation may occur.",
  },
];

export function EighthTwelfthHealthRegisters() {
  const [selectedHouse, setSelectedHouse] = useState<HouseKey>(8);
  const [show8thSigs, setShow8thSigs] = useState(true);
  const [show12thSigs, setShow12thSigs] = useState(false);
  const [saturnDignity, setSaturnDignity] = useState<SaturnDignity>("debilitated");
  const [neechabhanga, setNeechabhanga] = useState(true);
  const [venusDignity, setVenusDignity] = useState<VenusDignity>("enemy");
  const [showNeechabhanga, setShowNeechabhanga] = useState(false);
  const [restraintAck, setRestraintAck] = useState<Record<string, boolean>>({
    death: false,
    compute: false,
    timing: false,
  });
  const [selectedResponse, setSelectedResponse] = useState<ResponseKey | null>(null);
  const [showSloka, setShowSloka] = useState(false);
  const [openMistakes, setOpenMistakes] = useState<Record<number, boolean>>({});

  const reset = () => {
    setSelectedHouse(8);
    setShow8thSigs(true);
    setShow12thSigs(false);
    setSaturnDignity("debilitated");
    setNeechabhanga(true);
    setVenusDignity("enemy");
    setShowNeechabhanga(false);
    setRestraintAck({ death: false, compute: false, timing: false });
    setSelectedResponse(null);
    setShowSloka(false);
    setOpenMistakes({});
  };

  const toggleRestraint = (key: string) =>
    setRestraintAck((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleMistake = (index: number) =>
    setOpenMistakes((prev) => ({ ...prev, [index]: !prev[index] }));

  const allRestraintsHeld = Object.values(restraintAck).every(Boolean);

  const chartH1Reading = useMemo(() => {
    const saturn =
      saturnDignity === "debilitated"
        ? neechabhanga
          ? "Saturn is debilitated in Aries, but neecha-bhaṅga is present because Mars occupies a kendra from lagna. Read this as mixed-to-moderate, not alarming."
          : "Saturn is debilitated in Aries with no cancellation. The 8th-lord signal leans weaker, though still only a constitutional tendency."
        : saturnDignity === "mixed"
          ? "Saturn shows a mixed dignity signal; read proportionately without alarm."
          : "Saturn is strong by dignity; the 8th lord tends toward resilience and transformation.";

    const venus =
      venusDignity === "enemy"
        ? "Venus is in Leo, an enemy sign, unafflicted otherwise. The 12th-lord signal leans toward the less-favourable side of the inversion principle — outcomes in that house's domain may be harder-won."
        : venusDignity === "mixed"
          ? "Venus shows a mixed signal; read proportionately."
          : "Venus is strong by dignity; the 12th lord tends toward favourable resolution of loss or hospitalisation.";

    return { saturn, venus };
  }, [saturnDignity, neechabhanga, venusDignity]);

  return (
    <div data-interactive="eighth-twelfth-health-registers" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={panelStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>8th and 12th houses — health-longevity registers</p>
            <h2 style={{ margin: "0.2rem 0 0", color: VERMILION, fontSize: "1.35rem", fontWeight: 600 }}>
              Longevity and hospitalisation registers
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 860, fontWeight: 400 }}>
              Read the 8th and 12th only at the constitutional-tendency level. This lesson teaches signification, not computation, and holds the module&apos;s highest predictive restraint.
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
          <p style={eyebrowStyle}>Click a house node</p>
          <HousePairSvg selectedHouse={selectedHouse} onSelectHouse={setSelectedHouse} />
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title={HOUSES[selectedHouse].label} icon={HOUSES[selectedHouse].icon} color={HOUSES[selectedHouse].color}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
              {HOUSES[selectedHouse].name} — {HOUSES[selectedHouse].register}
            </p>
            <div style={{ marginTop: "0.7rem", padding: "0.6rem", borderRadius: 8, background: `${HOUSES[selectedHouse].color}10`, border: `1px solid ${HOUSES[selectedHouse].color}55` }}>
              <p style={{ margin: 0, color: INK_PRIMARY, fontWeight: 500, fontSize: "0.9rem" }}>Dusthāna-lord inversion</p>
              <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>{HOUSES[selectedHouse].inversion}</p>
            </div>
          </Panel>

          <Panel title="Significations" icon={<Scale size={18} />} color={GOLD}>
            <div style={{ display: "grid", gap: "0.45rem" }}>
              <button
                type="button"
                onClick={() => setShow8thSigs((v) => !v)}
                style={significationButtonStyle(show8thSigs, VERMILION)}
              >
                <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  {show8thSigs ? "−" : "+"} 8th-house register
                </span>
              </button>
              {show8thSigs && (
                <ul style={{ margin: "0.25rem 0 0.5rem", paddingLeft: "1.2rem", color: INK_SECONDARY, fontSize: "0.86rem", lineHeight: 1.55 }}>
                  {HOUSES[8].significations.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              )}
              <button
                type="button"
                onClick={() => setShow12thSigs((v) => !v)}
                style={significationButtonStyle(show12thSigs, PURPLE)}
              >
                <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  {show12thSigs ? "−" : "+"} 12th-house register
                </span>
              </button>
              {show12thSigs && (
                <ul style={{ margin: "0.25rem 0 0", paddingLeft: "1.2rem", color: INK_SECONDARY, fontSize: "0.86rem", lineHeight: 1.55 }}>
                  {HOUSES[12].significations.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              )}
            </div>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(300px, 1fr) minmax(300px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <section style={panelStyle}>
          <p style={eyebrowStyle}>Chart H1 scorecard</p>
          <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.1rem", fontWeight: 600 }}>
            Gemini lagna: build the 8th- and 12th-lord readings
          </h3>

          <div style={{ display: "grid", gap: "0.9rem" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontWeight: 500, color: VERMILION }}>
                  8th lord Saturn in Aries
                </span>
                <span style={{ color: INK_MUTED, fontSize: "0.82rem" }}>{saturnDignity}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.4rem" }}>
                {(["debilitated", "mixed", "strong"] as SaturnDignity[]).map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={saturnDignity === value}
                    onClick={() => setSaturnDignity(value)}
                    style={dignityChipStyle(saturnDignity === value, value === "strong" ? GREEN : value === "mixed" ? GOLD : VERMILION, value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
              {saturnDignity === "debilitated" && (
                <button
                  type="button"
                  aria-pressed={neechabhanga}
                  onClick={() => setNeechabhanga((v) => !v)}
                  style={{ ...toggleButtonStyle(neechabhanga, BLUE), marginTop: "0.55rem" }}
                >
                  {neechabhanga ? "✓ Neecha-bhaṅga present" : "Neecha-bhaṅga absent"}
                </button>
              )}
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontWeight: 500, color: PURPLE }}>
                  12th lord Venus in Leo
                </span>
                <span style={{ color: INK_MUTED, fontSize: "0.82rem" }}>{venusDignity}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.4rem" }}>
                {(["enemy", "mixed", "strong"] as VenusDignity[]).map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={venusDignity === value}
                    onClick={() => setVenusDignity(value)}
                    style={dignityChipStyle(venusDignity === value, value === "strong" ? GREEN : value === "mixed" ? GOLD : VERMILION, value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: "1rem", padding: "0.85rem", borderRadius: 8, background: `${VERMILION}08`, border: `1px solid ${VERMILION}55` }}>
            <p style={{ margin: 0, color: INK_PRIMARY, lineHeight: 1.6, fontWeight: 500 }}>8th-lord reading</p>
            <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>{chartH1Reading.saturn}</p>
          </div>
          <div style={{ marginTop: "0.65rem", padding: "0.85rem", borderRadius: 8, background: `${PURPLE}08`, border: `1px solid ${PURPLE}55` }}>
            <p style={{ margin: 0, color: INK_PRIMARY, lineHeight: 1.6, fontWeight: 500 }}>12th-lord reading</p>
            <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>{chartH1Reading.venus}</p>
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Neecha-bhaṅga check" icon={<Scale size={18} />} color={BLUE}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
              Before reading Saturn&apos;s debilitation in Aries at face value, check whether the cancellation condition is met.
            </p>
            <button
              type="button"
              aria-pressed={showNeechabhanga}
              onClick={() => setShowNeechabhanga((v) => !v)}
              style={{ ...smallChipStyle(showNeechabhanga, BLUE), marginTop: "0.7rem" }}
            >
              {showNeechabhanga ? "Hide condition" : "Show condition"}
            </button>
            {showNeechabhanga && (
              <div style={{ marginTop: "0.7rem", padding: "0.7rem", borderRadius: 8, background: `${BLUE}10`, border: `1px solid ${BLUE}55`, color: INK_SECONDARY, fontSize: "0.86rem", lineHeight: 1.55 }}>
                Neecha-bhaṅga for Saturn in Aries requires Mars (Aries&apos;s dispositor) to occupy a kendra from lagna. In Chart H1, Mars sits in Gemini, the 1st house — a kendra — so the debilitation is classically cancelled. The reading becomes mixed-to-moderate rather than straightforwardly weak.
              </div>
            )}
          </Panel>

          <Panel title="Predictive restraint" icon={<Lock size={18} />} color={VERMILION}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
              Hold all three locks before reading 8th/12th indications in live practice.
            </p>
            <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.7rem" }}>
              {RESTRAINTS.map((r) => {
                const held = restraintAck[r.key];
                return (
                  <button
                    key={r.key}
                    type="button"
                    aria-pressed={held}
                    onClick={() => toggleRestraint(r.key)}
                    style={restraintButtonStyle(held)}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: "0.45rem", fontWeight: 500 }}>
                      {held ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                      {r.label}
                    </span>
                    <span style={{ fontSize: "0.8rem", color: INK_SECONDARY }}>{r.note}</span>
                  </button>
                );
              })}
            </div>
            {allRestraintsHeld && (
              <p style={{ margin: "0.7rem 0 0", color: GREEN, fontWeight: 500 }}>All restraint locks held. The reading stays at signification only.</p>
            )}
          </Panel>
        </section>
      </div>

      <section style={panelStyle}>
        <p style={eyebrowStyle}>Client-response trainer</p>
        <h3 style={{ margin: "0.15rem 0 0.75rem", color: VERMILION, fontSize: "1.1rem", fontWeight: 600 }}>
          &quot;Does the 8th house mean I&apos;ll die young?&quot;
        </h3>
        <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
          Choose the response that best holds the lesson&apos;s discipline.
        </p>
        <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.7rem" }}>
          {(Object.entries(RESPONSES) as [ResponseKey, typeof RESPONSES.correct][]).map(([key, r]) => (
            <button
              key={key}
              type="button"
              aria-pressed={selectedResponse === key}
              onClick={() => setSelectedResponse(key)}
              style={responseButtonStyle(selectedResponse === key, r.correct && selectedResponse === key ? GREEN : VERMILION)}
            >
              {r.label}
            </button>
          ))}
        </div>
        {selectedResponse && (
          <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, background: `${RESPONSES[selectedResponse].correct ? GREEN : VERMILION}10`, border: `1px solid ${RESPONSES[selectedResponse].correct ? GREEN : VERMILION}55` }}>
            <p style={{ margin: 0, color: RESPONSES[selectedResponse].correct ? GREEN : VERMILION, fontWeight: 500 }}>
              {RESPONSES[selectedResponse].correct ? "Disciplined response" : "Overreach detected"}
            </p>
            <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{RESPONSES[selectedResponse].feedback}</p>
          </div>
        )}
      </section>

      <section style={panelStyle}>
        <p style={eyebrowStyle}>Three dusthānas compared</p>
        <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.1rem", fontWeight: 600 }}>
          The same inversion logic applies to all three
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.7rem" }}>
          {DUSTHANAS.map((d) => (
            <div key={d.house} style={{ border: `1px solid ${d.color}55`, borderRadius: 8, background: `${d.color}0D`, padding: "0.85rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: d.color, fontWeight: 600 }}>
                <Scale size={16} />
                {d.house}th — {d.name}
              </div>
              <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, fontSize: "0.86rem", lineHeight: 1.5 }}>{d.theme}</p>
              <p style={{ margin: "0.35rem 0 0", color: INK_MUTED, fontSize: "0.82rem", lineHeight: 1.5 }}>{d.inversion}</p>
            </div>
          ))}
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(300px, 1fr) minmax(300px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
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
                aṣṭame cāyur uktaṁ ca randhraṁ gūḍhaṁ tathaiva ca |<br />
                vyaye tu vyayam ārogyalābhaś ceśabalānugaḥ ||
              </p>
              <p style={{ margin: "0.6rem 0 0", color: INK_PRIMARY }}>
                &quot;In the eighth, longevity is spoken of, and the hidden aperture likewise; in the twelfth, loss — and the gaining of health follows the strength of its lord.&quot;
              </p>
              <p style={{ margin: "0.5rem 0 0", fontSize: "0.85rem", color: INK_MUTED }}>
                Composite paraphrase of the BPHS principle for the 8th and 12th houses.
              </p>
            </div>
          )}
        </section>

        <section style={panelStyle}>
          <p style={eyebrowStyle}>Common mistakes</p>
          <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.1rem", fontWeight: 600 }}>Hold the highest-care discipline</h3>
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
    </div>
  );
}

function HousePairSvg({
  selectedHouse,
  onSelectHouse,
}: {
  selectedHouse: HouseKey;
  onSelectHouse: (h: HouseKey) => void;
}) {
  return (
    <svg viewBox="0 0 340 220" role="img" aria-label="8th and 12th houses as the longevity and hospitalisation registers" style={{ width: "100%", maxHeight: 220, margin: "0.5rem auto 0.8rem", display: "block" }}>
      <defs>
        <marker id="arrowPair" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill={HAIRLINE} />
        </marker>
      </defs>

      {/* Connecting line */}
      <line x1={110} y1={110} x2={230} y2={110} stroke={HAIRLINE} strokeWidth="2" strokeDasharray="5 4" markerEnd="url(#arrowPair)" />
      <text x={170} y={95} textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight="500">dusthāna pair</text>

      {/* 8th node */}
      <g
        role="button"
        tabIndex={0}
        aria-label="Select 8th house"
        onClick={() => onSelectHouse(8)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onSelectHouse(8); }}
        style={{ cursor: "pointer" }}
      >
        <circle cx={110} cy={110} r={selectedHouse === 8 ? 44 : 38} fill={selectedHouse === 8 ? VERMILION : `${VERMILION}14`} stroke={selectedHouse === 8 ? "#fff" : VERMILION} strokeWidth={selectedHouse === 8 ? 4 : 3} />
        <text x={110} y={106} textAnchor="middle" fill={selectedHouse === 8 ? "#fff" : VERMILION} fontSize={18} fontWeight="600" style={{ pointerEvents: "none" }}>8</text>
        <text x={110} y={124} textAnchor="middle" fill={selectedHouse === 8 ? "#fff" : INK_SECONDARY} fontSize={10} fontWeight="500" style={{ pointerEvents: "none" }}>longevity</text>
        <text x={110} y={selectedHouse === 8 ? 168 : 162} textAnchor="middle" fill={VERMILION} fontSize={12} fontWeight="500" style={{ pointerEvents: "none" }}>transformation</text>
      </g>

      {/* 12th node */}
      <g
        role="button"
        tabIndex={0}
        aria-label="Select 12th house"
        onClick={() => onSelectHouse(12)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onSelectHouse(12); }}
        style={{ cursor: "pointer" }}
      >
        <circle cx={230} cy={110} r={selectedHouse === 12 ? 44 : 38} fill={selectedHouse === 12 ? PURPLE : `${PURPLE}14`} stroke={selectedHouse === 12 ? "#fff" : PURPLE} strokeWidth={selectedHouse === 12 ? 4 : 3} />
        <text x={230} y={106} textAnchor="middle" fill={selectedHouse === 12 ? "#fff" : PURPLE} fontSize={18} fontWeight="600" style={{ pointerEvents: "none" }}>12</text>
        <text x={230} y={124} textAnchor="middle" fill={selectedHouse === 12 ? "#fff" : INK_SECONDARY} fontSize={10} fontWeight="500" style={{ pointerEvents: "none" }}>loss</text>
        <text x={230} y={selectedHouse === 12 ? 168 : 162} textAnchor="middle" fill={PURPLE} fontSize={12} fontWeight="500" style={{ pointerEvents: "none" }}>hospitalisation</text>
      </g>
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

function significationButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}10` : SURFACE,
    color: active ? color : INK_SECONDARY,
    padding: "0.55rem",
    fontWeight: 500,
    cursor: "pointer",
  };
}

function dignityChipStyle(active: boolean, color: string, value: string): CSSProperties {
  const alpha = value === "debilitated" || value === "enemy" ? "0D" : value === "mixed" ? "14" : "22";
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : `${color}${alpha}`,
    color: active ? "#fff" : color,
    padding: "0.45rem",
    fontWeight: 500,
    cursor: "pointer",
    textTransform: "capitalize",
  };
}

function toggleButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}14` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.55rem 0.75rem",
    fontWeight: 500,
    cursor: "pointer",
  };
}

function restraintButtonStyle(held: boolean): CSSProperties {
  return {
    display: "grid",
    gap: "0.15rem",
    textAlign: "left",
    border: `1px solid ${held ? GREEN : HAIRLINE}`,
    borderRadius: 8,
    background: held ? `${GREEN}10` : SURFACE,
    color: held ? GREEN : INK_SECONDARY,
    padding: "0.6rem",
    cursor: "pointer",
  };
}

function responseButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}10` : SURFACE,
    color: active ? color : INK_SECONDARY,
    padding: "0.7rem",
    fontWeight: 500,
    cursor: "pointer",
    lineHeight: 1.45,
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
