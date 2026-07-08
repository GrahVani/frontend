"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  CircleDot,
  Info,
  Moon,
  RotateCcw,
  Scale,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

type StageKey = 4 | 8 | 12;
type Register = "saturn" | "ketu" | "blended" | "neither";
type Occupant = "saturn" | "ketu" | "both" | "none";
type KarakaPlacement = "in-12th" | "in-9th" | "elsewhere";
type PresetKey = "chart-s1" | "example-2";

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

const STAGES: Record<
  StageKey,
  { label: string; stage: string; color: string; chartS1: { sign: string; lord: string; occupant: string; note: string } }
> = {
  4: {
    label: "Foundation",
    stage: "Sukha",
    color: GOLD,
    chartS1: { sign: "Leo", lord: "Sun", occupant: "Sun", note: "Lord in own house" },
  },
  8: {
    label: "Transformation",
    stage: "Āyu",
    color: VERMILION,
    chartS1: { sign: "Sagittarius", lord: "Jupiter", occupant: "Jupiter", note: "Lord in own house; aspects 4 and 12" },
  },
  12: {
    label: "Release",
    stage: "Vyaya / Mokṣa",
    color: PURPLE,
    chartS1: { sign: "Aries", lord: "Mars", occupant: "Ketu", note: "Mokṣa-kāraka in the house of release" },
  },
};

const REGISTERS: Record<
  Register,
  { label: string; color: string; icon: ReactNode; description: string; discipline: string }
> = {
  saturn: {
    label: "Saturn-emphasised ascetic",
    color: PURPLE,
    icon: <Scale size={16} />,
    description:
      "Renunciation arrived at through discipline, restriction, and hard-won letting-go — the effortful, structured register.",
    discipline:
      "Read the ascetic register without assuming all 12th-house emphasis is mystic.",
  },
  ketu: {
    label: "Ketu-emphasised mystic",
    color: BLUE,
    icon: <Moon size={16} />,
    description:
      "A natural, almost involuntary pull toward detachment and inward release — the less effortful, native-draw register.",
    discipline:
      "Read the mystic register without claiming an automatic dignity-strength for Ketu.",
  },
  blended: {
    label: "Blended Saturn + Ketu",
    color: GREEN,
    icon: <Sparkles size={16} />,
    description:
      "Both registers present; release happens through discipline and natural detachment together, in some proportion.",
    discipline:
      "State the blend proportionately; neither register is more spiritual than the other.",
  },
  neither: {
    label: "Neither register emphasised",
    color: INK_MUTED,
    icon: <CircleDot size={16} />,
    description:
      "Read the 12th by its lord, sign, and aspects; the Saturn-Ketu pairing is not the whole story.",
    discipline:
      "Do not force a register when the chart does not show it.",
  },
};

const OCCUPANTS: Record<
  Occupant,
  { label: string; color: string; defaultRegister: Register; note: string }
> = {
  saturn: {
    label: "Saturn in 12th",
    color: PURPLE,
    defaultRegister: "saturn",
    note: "Ascetic register: renunciation through restriction and discipline.",
  },
  ketu: {
    label: "Ketu in 12th",
    color: BLUE,
    defaultRegister: "ketu",
    note: "Thematic resonance: release-kāraka in the release-house. Not a dignity claim.",
  },
  both: {
    label: "Saturn + Ketu in 12th",
    color: GREEN,
    defaultRegister: "blended",
    note: "Both registers strongly present; read the blend.",
  },
  none: {
    label: "No dominant occupant",
    color: INK_MUTED,
    defaultRegister: "neither",
    note: "Read sign, lord, aspects, and any kāraka placement separately.",
  },
};

const KARAKA_PLACEMENTS: Record<
  KarakaPlacement,
  { label: string; color: string; note: string }
> = {
  "in-12th": {
    label: "Ketu occupies the 12th",
    color: BLUE,
    note: "Thematic resonance with the release house — role and position aligned.",
  },
  "in-9th": {
    label: "Ketu is in the 9th (dharma)",
    color: GOLD,
    note: "A separate fact about dharma; it does not transfer release-signification to the 9th or act on the 12th.",
  },
  elsewhere: {
    label: "Ketu elsewhere",
    color: INK_MUTED,
    note: "Read Ketu's actual house on its own terms; keep it distinct from the 12th's occupant.",
  },
};

const MISTAKES = [
  {
    label: "Treating the 12th as an interchangeable third mokṣa house",
    wrong: "Read the 12th exactly like the 4th or 8th.",
    right:
      "The 12th's own primary name is mokṣa; it is the trine's purest expression, not merely its third member.",
  },
  {
    label: "Assuming Saturn and Ketu in the 12th mean the same thing",
    wrong: "A 12th-house kāraka is present, so the reading is the same regardless of which one.",
    right:
      "Saturn marks the ascetic, discipline-led register; Ketu marks the mystic, natural-pull register. Tell them apart.",
  },
  {
    label: "Treating Ketu-in-12th as an automatic dignity-strength claim",
    wrong: "Ketu in its own signified house is like an exalted or own-sign placement.",
    right:
      "This curriculum reads it as genuine thematic resonance, not a verified dignity-strength claim — Ketu takes no dignity in any sign.",
  },
  {
    label: "Transferring a kāraka's signification to wherever it is placed",
    wrong: "Ketu in the 9th still acts on the 12th's release matters.",
    right:
      "Keep a house's own occupant and its natural kāraka's separate placement distinct; read each on its own terms.",
  },
];

const PRESETS: Record<
  PresetKey,
  {
    label: string;
    occupant: Occupant;
    register: Register;
    karakaPlacement: KarakaPlacement;
    note: string;
    color: string;
  }
> = {
  "chart-s1": {
    label: "Chart S1",
    occupant: "ketu",
    register: "ketu",
    karakaPlacement: "in-12th",
    note: "Ketu in Aries 12th; mystic release register; closes the three-house arc.",
    color: BLUE,
  },
  "example-2": {
    label: "Example 2",
    occupant: "saturn",
    register: "saturn",
    karakaPlacement: "in-9th",
    note: "Saturn in 12th; Ketu in 9th; ascetic register, no signification transfer.",
    color: PURPLE,
  },
};

export function TwelfthHouseSpiritualRelease() {
  const [selectedStage, setSelectedStage] = useState<StageKey>(12);
  const [register, setRegister] = useState<Register>("ketu");
  const [occupant, setOccupant] = useState<Occupant>("ketu");
  const [karakaPlacement, setKarakaPlacement] = useState<KarakaPlacement>("in-12th");
  const [claimDignity, setClaimDignity] = useState(false);
  const [showSloka, setShowSloka] = useState(false);
  const [openMistakes, setOpenMistakes] = useState<Record<number, boolean>>({});

  const handleOccupant = (key: Occupant) => {
    setOccupant(key);
    setRegister(OCCUPANTS[key].defaultRegister);
  };

  const applyPreset = (key: PresetKey) => {
    const p = PRESETS[key];
    setOccupant(p.occupant);
    setRegister(p.register);
    setKarakaPlacement(p.karakaPlacement);
    setClaimDignity(false);
    setSelectedStage(12);
  };

  const reset = () => {
    setSelectedStage(12);
    setOccupant("ketu");
    setRegister("ketu");
    setKarakaPlacement("in-12th");
    setClaimDignity(false);
    setShowSloka(false);
    setOpenMistakes({});
  };

  const toggleMistake = (index: number) =>
    setOpenMistakes((prev) => ({ ...prev, [index]: !prev[index] }));

  const suggestedMismatch = OCCUPANTS[occupant].defaultRegister !== register;

  const synthesis = useMemo(() => {
    const occ = OCCUPANTS[occupant];
    const reg = REGISTERS[register];
    const kar = KARAKA_PLACEMENTS[karakaPlacement];

    let reading = "";
    if (occupant !== "none") {
      reading += `${occ.label}. ${occ.note} `;
    } else {
      reading += "No dominant occupant; read the 12th by its sign, lord, and aspects. ";
    }

    reading += `The release register reads as ${reg.label.toLowerCase()}: ${reg.description} `;

    if (suggestedMismatch) {
      const suggested = REGISTERS[occ.defaultRegister];
      reading += `Note: the occupant more often suggests the ${suggested.label.toLowerCase()} register, so state why the ${reg.label.toLowerCase()} reading is supported. `;
    }

    reading += `${kar.label}. ${kar.note} `;

    if (claimDignity) {
      reading +=
        "Caution: claiming Ketu-in-12th as an automatic dignity-strength overreaches. Ketu takes no dignity in any sign, and this curriculum does not invoke an unverified maxim.";
    } else {
      reading +=
        "No automatic dignity claim is made; the reading stays at honest thematic description.";
    }

    return reading;
  }, [register, occupant, karakaPlacement, claimDignity, suggestedMismatch]);

  return (
    <div data-interactive="twelfth-house-spiritual-release" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={panelStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>12th house — moksa release stage</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.35rem", fontWeight: 600 }}>
              Liberation, dissolution, foreign, final
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 860, fontWeight: 400 }}>
              The 12th closes the mokṣa-trikona arc. Its own name is mokṣa, and its release register splits into Saturn&apos;s ascetic path and Ketu&apos;s mystic pull.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, PURPLE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(300px, 1fr) minmax(300px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <section style={panelStyle}>
          <p style={eyebrowStyle}>Mokṣa trikoṇa arc</p>
          <MokshaArcSvg selectedStage={selectedStage} onSelectStage={setSelectedStage} />
          <div style={{ marginTop: "0.5rem", textAlign: "center" }}>
            <span style={{ color: STAGES[selectedStage].color, fontWeight: 600 }}>
              {selectedStage === 12 ? "Release — the trine's final station" : `${STAGES[selectedStage].label} stage`}
            </span>
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Release register" icon={<Scale size={18} />} color={PURPLE}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
              Saturn and Ketu are not interchangeable. Choose which register the 12th emphasises.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.5rem", marginTop: "0.7rem" }}>
              {(Object.entries(REGISTERS) as [Register, typeof REGISTERS.saturn][]).map(([key, r]) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={register === key}
                  onClick={() => setRegister(key)}
                  style={registerChipStyle(register === key, r.color)}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>{r.icon}{r.label}</span>
                </button>
              ))}
            </div>
            <div style={{ marginTop: "0.7rem", padding: "0.6rem", borderRadius: 8, background: `${REGISTERS[register].color}10`, border: `1px solid ${REGISTERS[register].color}55` }}>
              <p style={{ margin: 0, color: INK_PRIMARY, fontWeight: 500, fontSize: "0.9rem" }}>{REGISTERS[register].label}</p>
              <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>{REGISTERS[register].description}</p>
              <p style={{ margin: "0.35rem 0 0", color: INK_MUTED, fontSize: "0.82rem", lineHeight: 1.5 }}>{REGISTERS[register].discipline}</p>
            </div>
          </Panel>

          <Panel title="12th-house occupant" icon={<ShieldCheck size={18} />} color={BLUE}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
              The occupant suggests a default register, but you can override it. Ketu-in-12th is thematic resonance, not automatic dignity.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.45rem", marginTop: "0.7rem" }}>
              {(Object.entries(OCCUPANTS) as [Occupant, typeof OCCUPANTS.saturn][]).map(([key, o]) => (
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
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(300px, 1fr) minmax(300px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <section style={panelStyle}>
          <p style={eyebrowStyle}>Kāraka placement</p>
          <h3 style={{ margin: "0.15rem 0 0.75rem", color: BLUE, fontSize: "1.1rem", fontWeight: 600 }}>
            Where is Ketu, the release-kāraka?
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.45rem" }}>
            {(Object.entries(KARAKA_PLACEMENTS) as [KarakaPlacement, typeof KARAKA_PLACEMENTS["in-12th"]][]).map(([key, k]) => (
              <button
                key={key}
                type="button"
                aria-pressed={karakaPlacement === key}
                onClick={() => setKarakaPlacement(key)}
                style={karakaChipStyle(karakaPlacement === key, k.color)}
              >
                {k.label}
              </button>
            ))}
          </div>
          <div style={{ marginTop: "0.75rem" }}>
            <KarakaPlacementSvg placement={karakaPlacement} />
          </div>
          <p style={{ margin: "0.6rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.9rem" }}>
            {KARAKA_PLACEMENTS[karakaPlacement].note}
          </p>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Dignity-claim guard" icon={<ShieldCheck size={18} />} color={VERMILION}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
              Ketu occupies the 12th in Chart S1. Is that an automatic strength claim?
            </p>
            <button
              type="button"
              aria-pressed={claimDignity}
              onClick={() => setClaimDignity((v) => !v)}
              style={{ ...toggleButtonStyle(claimDignity, VERMILION), marginTop: "0.7rem" }}
            >
              {claimDignity ? "Yes, claim automatic dignity" : "No, keep it as thematic resonance"}
            </button>
            {claimDignity && (
              <div style={{ marginTop: "0.7rem", padding: "0.7rem", borderRadius: 8, background: `${VERMILION}10`, border: `1px solid ${VERMILION}55` }}>
                <p style={{ margin: 0, color: VERMILION, fontWeight: 500 }}>Discipline warning</p>
                <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
                  Ketu takes no dignity in any sign (T1-05 5.7.5). A kāraka in its own signified house is genuine thematic coincidence, not a verified dignity-strength maxim. Do not invent a maxim to make the reading tidier.
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

      <section style={panelStyle}>
        <p style={eyebrowStyle}>Chapter-closing summary</p>
        <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.1rem", fontWeight: 600 }}>
          Chart S1 across the three mokṣa houses
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.7rem" }}>
          {([4, 8, 12] as StageKey[]).map((h) => {
            const s = STAGES[h];
            return (
              <div key={h} style={{ border: `1px solid ${s.color}55`, borderRadius: 8, background: `${s.color}0D`, padding: "0.85rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: s.color, fontWeight: 600 }}>
                  <CircleDot size={16} />
                  {h}th — {s.label}
                </div>
                <div style={{ marginTop: "0.5rem", display: "grid", gap: "0.25rem", fontSize: "0.86rem", color: INK_SECONDARY }}>
                  <span><span style={{ color: INK_MUTED }}>Sign:</span> {s.chartS1.sign}</span>
                  <span><span style={{ color: INK_MUTED }}>Lord:</span> {s.chartS1.lord}</span>
                  <span><span style={{ color: INK_MUTED }}>Occupant:</span> {s.chartS1.occupant}</span>
                </div>
                <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, fontSize: "0.84rem", lineHeight: 1.5 }}>{s.chartS1.note}</p>
              </div>
            );
          })}
        </div>
        <p style={{ margin: "0.75rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.9rem" }}>
          Three different kinds of evidence, one per stage: a secured foundation, a transformed crossing with a cross-trine aspect bonus, and a release marked by direct kāraka presence. This is the chapter&apos;s honest convergence, not one engineered fact repeated three times.
        </p>
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
                mokṣākhyaṁ dvādaśaṁ sthānaṁ trikoṇasyāntimaṁ padam |<br />
                mandena ketunā vāpi hāni-dvāreṇa mucyate ||
              </p>
              <p style={{ margin: "0.6rem 0 0", color: INK_PRIMARY }}>
                &quot;The twelfth place, named mokṣa itself, is the trine&apos;s final station; through Saturn or through Ketu, release comes by the door of loss.&quot;
              </p>
              <p style={{ margin: "0.5rem 0 0", fontSize: "0.85rem", color: INK_MUTED }}>
                Composite paraphrase of the 12th house&apos;s spiritual-release role.
              </p>
            </div>
          )}
        </section>

        <section style={panelStyle}>
          <p style={eyebrowStyle}>Common mistakes</p>
          <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.1rem", fontWeight: 600 }}>Hold the 12th-house discipline</h3>
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

function MokshaArcSvg({
  selectedStage,
  onSelectStage,
}: {
  selectedStage: StageKey;
  onSelectStage: (s: StageKey) => void;
}) {
  const points: Record<StageKey, { x: number; y: number }> = {
    4: { x: 170, y: 60 },
    8: { x: 170, y: 205 },
    12: { x: 170, y: 350 },
  };

  return (
    <svg viewBox="0 0 340 410" role="img" aria-label="Moksa trikona arc from 4th foundation through 8th transformation to 12th release" style={{ width: "100%", maxHeight: 380, margin: "0.5rem auto 0.8rem", display: "block" }}>
      <defs>
        <marker id="arrowRelease" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill={PURPLE} />
        </marker>
      </defs>

      {/* Connecting flow */}
      <line x1={points[4].x} y1={points[4].y + 30} x2={points[8].x} y2={points[8].y - 38} stroke={GOLD} strokeWidth="2.5" strokeDasharray="5 4" />
      <line x1={points[8].x} y1={points[8].y + 38} x2={points[12].x} y2={points[12].y - 42} stroke={VERMILION} strokeWidth="2.5" strokeDasharray="5 4" markerEnd="url(#arrowRelease)" />

      {([4, 8, 12] as StageKey[]).map((key) => {
        const point = points[key];
        const s = STAGES[key];
        const active = selectedStage === key;
        const isTwelfth = key === 12;
        return (
          <g
            key={key}
            role="button"
            tabIndex={0}
            aria-label={`Select ${key}th house`}
            onClick={() => onSelectStage(key)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onSelectStage(key); }}
            style={{ cursor: "pointer" }}
          >
            <circle
              cx={point.x}
              cy={point.y}
              r={isTwelfth ? (active ? 38 : 34) : active ? 28 : 24}
              fill={active ? s.color : `${s.color}14`}
              stroke={active ? "#fff" : s.color}
              strokeWidth={active ? 4 : 3}
            />
            <text x={point.x} y={point.y + 5} textAnchor="middle" fill={active ? "#fff" : s.color} fontSize={isTwelfth ? 18 : 15} fontWeight="600" style={{ pointerEvents: "none" }}>
              {key}
            </text>
            <text x={point.x} y={point.y + (isTwelfth ? 52 : 42)} textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="500" style={{ pointerEvents: "none" }}>
              {s.label}
            </text>
            {isTwelfth && (
              <text x={point.x} y={point.y + 66} textAnchor="middle" fill={PURPLE} fontSize="11" fontWeight="500" style={{ pointerEvents: "none" }}>
                mokṣa
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function KarakaPlacementSvg({ placement }: { placement: KarakaPlacement }) {
  const p12 = { x: 80, y: 120 };
  const p9 = { x: 260, y: 120 };
  const ketu = placement === "in-12th" ? p12 : placement === "in-9th" ? p9 : { x: 170, y: 50 };

  return (
    <svg viewBox="0 0 340 200" role="img" aria-label="Ketu placement relative to the 12th house" style={{ width: "100%", maxHeight: 200, display: "block" }}>
      <rect x={24} y={24} width={292} height={152} rx={8} fill={`${PURPLE}0A`} stroke={HAIRLINE} />

      {/* 12th house box */}
      <rect x={p12.x - 50} y={p12.y - 40} width={100} height={80} rx={6} fill={`${PURPLE}10`} stroke={PURPLE} strokeWidth="2" />
      <text x={p12.x} y={p12.y - 18} textAnchor="middle" fill={PURPLE} fontSize="13" fontWeight="600">12th house</text>
      <text x={p12.x} y={p12.y + 4} textAnchor="middle" fill={INK_SECONDARY} fontSize="11">Vyaya / Mokṣa</text>

      {/* 9th house box */}
      <rect x={p9.x - 50} y={p9.y - 40} width={100} height={80} rx={6} fill={`${GOLD}10`} stroke={GOLD} strokeWidth="2" />
      <text x={p9.x} y={p9.y - 18} textAnchor="middle" fill={GOLD} fontSize="13" fontWeight="600">9th house</text>
      <text x={p9.x} y={p9.y + 4} textAnchor="middle" fill={INK_SECONDARY} fontSize="11">Dharma</text>

      {/* Ketu marker */}
      <circle cx={ketu.x} cy={ketu.y} r={18} fill={`${BLUE}20`} stroke={BLUE} strokeWidth="3" />
      <text x={ketu.x} y={ketu.y + 4} textAnchor="middle" fill={BLUE} fontSize="12" fontWeight="600">Ke</text>
      <text x={ketu.x} y={ketu.y + 32} textAnchor="middle" fill={INK_MUTED} fontSize="10">
        {placement === "in-12th" ? "thematic resonance" : placement === "in-9th" ? "separate fact" : "read on its own terms"}
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

function karakaChipStyle(active: boolean, color: string): CSSProperties {
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
