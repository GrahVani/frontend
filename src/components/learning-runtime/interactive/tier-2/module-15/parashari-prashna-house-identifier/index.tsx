"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  BriefcaseBusiness,
  Calculator,
  Gem,
  GitCompare,
  Handshake,
  MapPinned,
  RefreshCw,
  Scale,
  ShieldCheck,
  Swords,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type MatterKey = "marriage" | "career" | "litigation" | "lost";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const GOLD = "#B88421";
const VERMILION = "var(--gl-vermilion-accent)";
const PURPLE = "#6B5AA8";

const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
const SHORT_SIGNS = ["Ar", "Ta", "Ge", "Cn", "Le", "Vi", "Li", "Sc", "Sg", "Cp", "Aq", "Pi"];

const MATTERS: Record<MatterKey, {
  label: string;
  house: number;
  support: string;
  negate: string;
  karaka: string;
  karakaNote: string;
  color: string;
  icon: ReactNode;
}> = {
  marriage: {
    label: "Marriage",
    house: 7,
    support: "2 / 7 / 11",
    negate: "1 / 6 / 10",
    karaka: "Venus",
    karakaNote: "Jupiter may be added for a female querent's husband.",
    color: GREEN,
    icon: <Handshake size={16} />,
  },
  career: {
    label: "Service / career",
    house: 10,
    support: "6 / 10 / 11",
    negate: "5 / 9 / 12",
    karaka: "Saturn",
    karakaNote: "Sun may be added for government or authority-linked work.",
    color: BLUE,
    icon: <BriefcaseBusiness size={16} />,
  },
  litigation: {
    label: "Litigation",
    house: 6,
    support: "1 / 6 / 11",
    negate: "5 / 8 / 12",
    karaka: "Mars",
    karakaNote: "Saturn may be weighed for prolonged or delayed disputes.",
    color: VERMILION,
    icon: <Swords size={16} />,
  },
  lost: {
    label: "Lost object",
    house: 2,
    support: "2 / 11",
    negate: "6 / 8 / 12",
    karaka: "No dedicated karaka",
    karakaNote: "Do not invent a substitute; weigh the remaining four lines honestly.",
    color: GOLD,
    icon: <MapPinned size={16} />,
  },
};

export function ParashariPrashnaHouseIdentifier() {
  const [matterKey, setMatterKey] = useState<MatterKey>("litigation");
  const [lagna, setLagna] = useState(4);
  const [fromHouse, setFromHouse] = useState(6);
  const [countHouse, setCountHouse] = useState(6);
  const [reuseHouseSets, setReuseHouseSets] = useState(true);
  const [wholeSignOnly, setWholeSignOnly] = useState(true);
  const [honestKaraka, setHonestKaraka] = useState(true);
  const [nativeBhavat, setNativeBhavat] = useState(true);

  const matter = MATTERS[matterKey];
  const matterSignIndex = wrapIndex(lagna + matter.house - 1);
  const matterSign = SIGNS[matterSignIndex];
  const bhavatResult = wrapHouse(fromHouse + countHouse - 1);
  const ready = reuseHouseSets && wholeSignOnly && honestKaraka && nativeBhavat;

  const feedback = useMemo(() => {
    if (!reuseHouseSets) return "Repair: reuse the module's established matter house-sets. Signification is chart-independent.";
    if (!wholeSignOnly) return "Repair: Parashari needs the matter-house whole sign, not a KP-style cuspal sub-lord degree.";
    if (!honestKaraka) return "Repair: lost-object questions have no dedicated karaka here. Report the blank line honestly.";
    if (!nativeBhavat) return "Repair: bhavat-bhavam is native Parashari house-from-house reasoning, later reused inside KP.";
    return `${matter.label} is located as house ${matter.house}, falling in ${matterSign} from the selected lagna.`;
  }, [honestKaraka, matter.house, matter.label, matterSign, nativeBhavat, reuseHouseSets, wholeSignOnly]);

  return (
    <div data-interactive="parashari-prashna-house-identifier" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Parashari question-house lookup</p>
            <h2 style={headingStyle}>Reuse the house-set, then add the karaka line honestly</h2>
            <p style={bodyStyle}>
              Select a matter type, locate its whole-sign house from the prashna lagna, and keep “no karaka” as a valid result when doctrine gives none.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setMatterKey("litigation");
              setLagna(4);
              setFromHouse(6);
              setCountHouse(6);
              setReuseHouseSets(true);
              setWholeSignOnly(true);
              setHonestKaraka(true);
              setNativeBhavat(true);
            }}
            style={softButtonStyle}
          >
            <RefreshCw size={16} />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 620px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "0.8rem", flexWrap: "wrap", alignItems: "center" }}>
            <p style={eyebrowStyle}>Whole-sign locator</p>
            <div style={segmentedStyle}>
              {SIGNS.map((sign, index) => (
                <button key={sign} type="button" onClick={() => setLagna(index)} aria-pressed={lagna === index} style={miniButtonStyle(lagna === index)}>
                  {SHORT_SIGNS[index]}
                </button>
              ))}
            </div>
          </div>
          <HouseWheel lagna={lagna} matterHouse={matter.house} color={matter.color} />
        </section>

        <section style={{ ...cardStyle, flex: "1 1 320px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: matter.color }}>
            {matter.icon}
            <p style={eyebrowStyle}>{matter.label}</p>
          </div>
          <h3 style={panelTitleStyle}>House {matter.house}: {matterSign}</h3>
          <p style={bodyStyle}>Support {matter.support}; negate {matter.negate}. The house-set transfers across streams; the reading mechanics change.</p>
          <div style={{ ...noticeStyle(matter.color), marginTop: "1rem" }}>
            <GitCompare size={18} />
            <span>KP may read a cuspal sub-lord; Parashari reads the whole-sign house through five evidence lines.</span>
          </div>
        </section>
      </div>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Matter selector</p>
          <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.85rem" }}>
            {(Object.keys(MATTERS) as MatterKey[]).map((key) => (
              <button key={key} type="button" onClick={() => setMatterKey(key)} aria-pressed={matterKey === key} style={choiceButtonStyle(matterKey === key, MATTERS[key].color)}>
                <span style={{ color: MATTERS[key].color }}>{MATTERS[key].icon}</span>
                <span>
                  <span style={{ display: "block", fontWeight: 500 }}>{MATTERS[key].label}</span>
                  <span style={smallTextStyle}>House {MATTERS[key].house}; support {MATTERS[key].support}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Karaka line</p>
          <div style={{ ...karakaCardStyle(matter.color), marginTop: "0.85rem" }}>
            <Gem size={20} />
            <div>
              <p style={{ ...panelTitleStyle, color: matter.color }}>{matter.karaka}</p>
              <p style={smallTextStyle}>{matter.karakaNote}</p>
            </div>
          </div>
          <div style={{ ...noticeStyle(matterKey === "lost" ? GOLD : GREEN), marginTop: "0.85rem" }}>
            <ShieldCheck size={18} />
            <span>{matterKey === "lost" ? "This blank line is a finding, not a failure." : "Karaka condition becomes the fourth line of the five-line judgement."}</span>
          </div>
        </div>
      </section>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Bhavat-bhavam calculator</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem", marginTop: "0.85rem" }}>
            <NumberSelect label="From house" value={fromHouse} onChange={setFromHouse} />
            <NumberSelect label="Count house" value={countHouse} onChange={setCountHouse} />
          </div>
          <div style={{ ...noticeStyle(PURPLE), marginTop: "0.85rem" }}>
            <Calculator size={18} />
            <span>The {countHouse}th from the {fromHouse}th is house {bhavatResult}. Inclusive counting keeps the source house as 1.</span>
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Reading safeguards</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.8rem" }}>
            <ToggleRow checked={reuseHouseSets} onChange={setReuseHouseSets} label="Reuse established house-sets" body="Marriage, career, litigation, and lost-object houses remain chart-independent." icon={<Scale size={16} />} />
            <ToggleRow checked={wholeSignOnly} onChange={setWholeSignOnly} label="Use whole sign, not cusp degree" body="Parashari precision lives in breadth of evidence, not sub-lord arc seconds." icon={<BadgeCheck size={16} />} />
            <ToggleRow checked={honestKaraka} onChange={setHonestKaraka} label="Do not invent missing karakas" body="Lost-object questions retain an explicit no-karaka state." icon={<ShieldCheck size={16} />} />
            <ToggleRow checked={nativeBhavat} onChange={setNativeBhavat} label="Name bhavat-bhavam lineage correctly" body="It is native Parashari reasoning, borrowed into KP earlier in the module." icon={<GitCompare size={16} />} />
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          {ready ? <BadgeCheck size={22} color={GREEN} /> : <AlertTriangle size={22} color={VERMILION} />}
          <div>
            <p style={eyebrowStyle}>House identification check</p>
            <h3 style={{ ...panelTitleStyle, color: ready ? GREEN : VERMILION }}>{ready ? "Matter-house doctrine applied cleanly" : "Repair the identification discipline"}</h3>
            <p style={bodyStyle}>{feedback}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ParashariPrashnaHouseIdentifier;

function HouseWheel({ lagna, matterHouse, color }: { lagna: number; matterHouse: number; color: string }) {
  const matterIndex = wrapIndex(lagna + matterHouse - 1);
  return (
    <svg viewBox="0 0 820 430" role="img" aria-label="Whole sign house locator for Parashari prashna" style={{ width: "100%", minHeight: 340, marginTop: "0.85rem" }}>
      <rect x="10" y="10" width="800" height="410" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <text x="410" y="44" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="500">Lagna sign sets house 1; count whole signs to the matter house</text>
      {Array.from({ length: 12 }).map((_, index) => {
        const angle = (-90 + index * 30) * (Math.PI / 180);
        const x = 410 + Math.cos(angle) * 142;
        const y = 216 + Math.sin(angle) * 142;
        const house = wrapHouse(index - lagna + 1);
        const isLagna = index === lagna;
        const isMatter = index === matterIndex;
        const stroke = isMatter ? color : isLagna ? ACCENT : HAIRLINE;
        return (
          <g key={SHORT_SIGNS[index]}>
            <circle cx={x} cy={y} r={34} fill={isMatter ? softFill(color) : isLagna ? "#F7F0E1" : "#FFFFFF"} stroke={stroke} strokeWidth={isMatter || isLagna ? 1.8 : 1.1} />
            <text x={x} y={y - 5} textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="500">{SHORT_SIGNS[index]}</text>
            <text x={x} y={y + 12} textAnchor="middle" fill={isMatter ? color : isLagna ? ACCENT : INK_MUTED} fontSize="9.5">{isLagna ? "H1" : `H${house}`}</text>
          </g>
        );
      })}
      <circle cx="410" cy="216" r="76" fill="#FFFFFF" stroke={HAIRLINE} />
      <text x="410" y="207" textAnchor="middle" fill={GOLD} fontSize="12" fontWeight="500">Whole sign</text>
      <text x="410" y="226" textAnchor="middle" fill={INK_MUTED} fontSize="10">no cuspal degree step</text>
      <path d="M410 140 C468 145, 510 178, 532 222" fill="none" stroke={color} strokeWidth="2" strokeDasharray="6 7" />
    </svg>
  );
}

function NumberSelect({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label style={{ display: "grid", gap: "0.35rem" }}>
      <span style={eyebrowStyle}>{label}</span>
      <select value={value} onChange={(event) => onChange(Number(event.target.value))} style={selectStyle}>
        {Array.from({ length: 12 }).map((_, index) => (
          <option key={index + 1} value={index + 1}>House {index + 1}</option>
        ))}
      </select>
    </label>
  );
}

function ToggleRow({ checked, onChange, label, body, icon }: { checked: boolean; onChange: (checked: boolean) => void; label: string; body: string; icon: ReactNode }) {
  return (
    <label style={toggleStyle(checked)}>
      <span style={{ color: checked ? ACCENT : INK_MUTED }}>{icon}</span>
      <span>
        <span style={{ display: "block", color: INK_PRIMARY, fontWeight: 500 }}>{label}</span>
        <span style={smallTextStyle}>{body}</span>
      </span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} style={{ marginLeft: "auto", accentColor: ACCENT }} />
    </label>
  );
}

function wrapIndex(value: number) {
  return ((value % 12) + 12) % 12;
}

function wrapHouse(value: number) {
  return ((value - 1) % 12) + 1;
}

function softFill(color: string) {
  if (color.startsWith("#")) return `${color}18`;
  return "rgba(184, 132, 33, 0.12)";
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  boxShadow: "var(--gl-card-shadow-soft)",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: ACCENT,
  fontSize: "0.76rem",
  fontWeight: 600,
  letterSpacing: 0,
  textTransform: "uppercase",
};

const headingStyle: CSSProperties = {
  margin: "0.25rem 0 0",
  color: INK_PRIMARY,
  fontSize: "1.35rem",
  fontWeight: 600,
  lineHeight: 1.25,
};

const panelTitleStyle: CSSProperties = {
  margin: "0.25rem 0 0",
  color: INK_PRIMARY,
  fontSize: "1.05rem",
  fontWeight: 600,
  lineHeight: 1.3,
};

const bodyStyle: CSSProperties = {
  margin: "0.45rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.55,
  maxWidth: 920,
};

const smallTextStyle: CSSProperties = {
  color: INK_MUTED,
  fontSize: "0.82rem",
  lineHeight: 1.45,
};

const softButtonStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: "#FFFFFF",
  color: INK_SECONDARY,
  padding: "0.55rem 0.8rem",
  display: "inline-flex",
  alignItems: "center",
  gap: "0.45rem",
  cursor: "pointer",
  fontWeight: 500,
};

const segmentedStyle: CSSProperties = {
  display: "flex",
  gap: "0.35rem",
  flexWrap: "wrap",
  alignItems: "center",
};

const selectStyle: CSSProperties = {
  width: "100%",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: "#FFFFFF",
  color: INK_PRIMARY,
  padding: "0.62rem 0.7rem",
};

function miniButtonStyle(active: boolean): CSSProperties {
  return {
    border: `1px solid ${active ? ACCENT : HAIRLINE}`,
    borderRadius: 8,
    background: active ? "#F7F0E1" : "#FFFFFF",
    color: active ? ACCENT : INK_SECONDARY,
    padding: "0.38rem 0.48rem",
    cursor: "pointer",
    fontWeight: 500,
    minWidth: 38,
  };
}

function choiceButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? softFill(color) : "#FFFFFF",
    color: INK_SECONDARY,
    padding: "0.7rem",
    cursor: "pointer",
    display: "flex",
    gap: "0.65rem",
    alignItems: "start",
    textAlign: "left",
  };
}

function toggleStyle(checked: boolean): CSSProperties {
  return {
    border: `1px solid ${checked ? ACCENT : HAIRLINE}`,
    borderRadius: 8,
    background: checked ? "#F7F0E1" : "#FFFFFF",
    padding: "0.7rem",
    display: "flex",
    gap: "0.65rem",
    alignItems: "center",
    cursor: "pointer",
  };
}

function karakaCardStyle(color: string): CSSProperties {
  return {
    border: `1px solid ${color}`,
    borderRadius: 8,
    background: softFill(color),
    color,
    padding: "0.85rem",
    display: "flex",
    gap: "0.65rem",
    alignItems: "start",
  };
}

function noticeStyle(color: string): CSSProperties {
  return {
    border: `1px solid ${color}`,
    borderRadius: 8,
    background: softFill(color),
    color,
    padding: "0.75rem",
    display: "flex",
    alignItems: "start",
    gap: "0.55rem",
    lineHeight: 1.45,
    fontSize: "0.9rem",
  };
}

const twoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "1rem",
};
