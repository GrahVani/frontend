"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  BadgeCheck,
  CircleHelp,
  GitCompare,
  Grid3X3,
  LockKeyhole,
  RotateCcw,
  ShieldAlert,
  Split,
} from "lucide-react";

type HouseKey = "second" | "seventh" | "eleventh";
type SubLordKey = "saturn" | "mercury" | "ketu";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";

const HOUSES: Record<HouseKey, { label: string; sign: string; chain: string[]; note: string }> = {
  second: {
    label: "2nd house",
    sign: "Virgo",
    chain: ["Mercury", "Moon"],
    note: "Mercury occupies and owns Virgo; Mercury's star-lord is Moon.",
  },
  seventh: {
    label: "7th house",
    sign: "Aquarius",
    chain: ["Saturn"],
    note: "Aquarius is unoccupied and owned by Saturn; Saturn is the direct 7th-house significator.",
  },
  eleventh: {
    label: "11th house",
    sign: "Gemini",
    chain: ["Venus", "Mars", "Mercury", "Moon"],
    note: "Venus occupies Gemini, Mercury owns it, and their star-lords add Mars and Moon.",
  },
};

const SUB_LORDS: Record<SubLordKey, { label: string; inSet: boolean; verdict: string; note: string }> = {
  saturn: {
    label: "Saturn",
    inSet: true,
    verdict: "KP YES",
    note: "Chart MD1's real 7th-cusp sub-lord. Saturn qualifies through direct ownership of the 7th house.",
  },
  mercury: {
    label: "Mercury",
    inSet: true,
    verdict: "KP YES",
    note: "A nearby hypothetical boundary case. Mercury qualifies through the 2nd and 11th houses.",
  },
  ketu: {
    label: "Ketu",
    inSet: false,
    verdict: "KP NO",
    note: "A hypothetical non-significator used to show the gate is decisive, not decorative.",
  },
};

const COMBINED_SET = ["Mercury", "Moon", "Saturn", "Venus", "Mars"];

export function KpCuspalYesNoAugmentationLab() {
  const [house, setHouse] = useState<HouseKey>("seventh");
  const [subLord, setSubLord] = useState<SubLordKey>("saturn");
  const [useCombinedSet, setUseCombinedSet] = useState(true);
  const [respectBoundary, setRespectBoundary] = useState(true);
  const [holdDivergence, setHoldDivergence] = useState(true);
  const [noAveraging, setNoAveraging] = useState(true);

  const selectedHouse = HOUSES[house];
  const selectedSubLord = SUB_LORDS[subLord];

  const status = useMemo(() => {
    if (!useCombinedSet) return { label: "house-set too narrow", icon: <ShieldAlert size={18} /> };
    if (!respectBoundary) return { label: "sub-lord boundary ignored", icon: <ShieldAlert size={18} /> };
    if (!holdDivergence) return { label: "divergence collapsed", icon: <ShieldAlert size={18} /> };
    if (!noAveraging) return { label: "averaging error", icon: <ShieldAlert size={18} /> };
    return { label: "KP layer held cleanly", icon: <BadgeCheck size={18} /> };
  }, [holdDivergence, noAveraging, respectBoundary, useCombinedSet]);

  const synthesisLine = useMemo(() => {
    if (!useCombinedSet) return "Repair the scope: marriage is tested against the combined 2/7/11 significator set, not the 7th house alone.";
    if (!respectBoundary) return "Repair the computation: Chart MD1's 7th cusp is Saturn sub-lord, close to Mercury but still on Saturn's side.";
    if (!holdDivergence) return "Repair the synthesis: KP YES does not erase the Parashara weak-to-moderate anchor.";
    if (!noAveraging) return "Repair the logic: KP YES and Parashara strain do not cancel into a neutral midpoint.";
    return `KP reads the 7th cusp as ${selectedSubLord.verdict}: ${selectedSubLord.label} ${selectedSubLord.inSet ? "is" : "is not"} in the 2/7/11 set. This is divergence by mechanism, not an error to resolve.`;
  }, [holdDivergence, noAveraging, respectBoundary, selectedSubLord, useCombinedSet]);

  return (
    <div data-interactive="kp-cuspal-yes-no-augmentation-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>KP cuspal yes/no augmentation</p>
            <h2 style={headingStyle}>Test the Chart MD1 7th cusp against the 2/7/11 marriage set</h2>
            <p style={bodyStyle}>
              Build the KP significator set, test the 7th-cusp sub-lord, and hold the clean KP YES beside the Parashara anchor without cancelling either one.
            </p>
          </div>
          <span style={statusPillStyle}>
            {status.icon}
            {status.label}
          </span>
        </div>
      </section>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>7th cusp chain</p>
          <CuspDiagram subLord={subLord} />
          <div style={buttonGridStyle}>
            {(Object.keys(SUB_LORDS) as SubLordKey[]).map((key) => (
              <button key={key} type="button" onClick={() => setSubLord(key)} style={choiceStyle(subLord === key)} aria-pressed={subLord === key}>
                {SUB_LORDS[key].label}
              </button>
            ))}
          </div>
          <p style={{ ...smallTextStyle, marginTop: "0.72rem" }}>{selectedSubLord.note}</p>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Marriage house set</p>
          <div style={houseButtonGridStyle}>
            {(Object.keys(HOUSES) as HouseKey[]).map((key) => (
              <button key={key} type="button" onClick={() => setHouse(key)} style={choiceStyle(house === key)} aria-pressed={house === key}>
                {HOUSES[key].label}
              </button>
            ))}
          </div>
          <div style={factPanelStyle}>
            <p style={panelTitleStyle}>{selectedHouse.label}: {selectedHouse.sign}</p>
            <p style={smallTextStyle}>Significators: {selectedHouse.chain.join(", ")}</p>
            <p style={{ ...smallTextStyle, marginTop: "0.5rem" }}>{selectedHouse.note}</p>
          </div>
        </div>
      </section>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Combined set verdict</p>
          <SetDiagram active={selectedSubLord.label} inSet={selectedSubLord.inSet} />
          <p style={{ ...smallTextStyle, marginTop: "0.72rem" }}>Combined 2/7/11 set: {COMBINED_SET.join(", ")}.</p>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Divergence guardrails</p>
          <div style={{ display: "grid", gap: "0.62rem", marginTop: "0.85rem" }}>
            <ToggleRow checked={useCombinedSet} onChange={setUseCombinedSet} label="Use combined 2/7/11 set" icon={<Grid3X3 size={16} />} />
            <ToggleRow checked={respectBoundary} onChange={setRespectBoundary} label="Respect Saturn sub-lord boundary" icon={<LockKeyhole size={16} />} />
            <ToggleRow checked={holdDivergence} onChange={setHoldDivergence} label="Hold KP and Parashara distinctly" icon={<Split size={16} />} />
            <ToggleRow checked={noAveraging} onChange={setNoAveraging} label="Do not average or cancel" icon={<CircleHelp size={16} />} />
          </div>
          <button
            type="button"
            onClick={() => {
              setHouse("seventh");
              setSubLord("saturn");
              setUseCombinedSet(true);
              setRespectBoundary(true);
              setHoldDivergence(true);
              setNoAveraging(true);
            }}
            style={{ ...softButtonStyle, marginTop: "0.9rem" }}
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          <GitCompare size={20} color={ACCENT} style={{ flex: "0 0 auto", marginTop: "0.14rem" }} />
          <div>
            <p style={eyebrowStyle}>Cross-stream holding statement</p>
            <p style={{ ...bodyStyle, marginTop: "0.32rem" }}>{synthesisLine}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function CuspDiagram({ subLord }: { subLord: SubLordKey }) {
  const items = [
    { label: "KP Lagna", value: "Leo 12 deg 24" },
    { label: "7th cusp", value: "Aquarius 12 deg 24" },
    { label: "Star-lord", value: "Rahu" },
    { label: "Sub-lord", value: SUB_LORDS[subLord].label },
  ];

  return (
    <svg viewBox="0 0 680 170" role="img" aria-label="KP 7th cusp chain from Lagna to sub-lord" style={{ width: "100%", height: "auto", marginTop: "0.85rem" }}>
      <rect x="8" y="8" width="664" height="154" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      {items.map((item, index) => {
        const x = 92 + index * 164;
        const active = index === 3;
        return (
          <g key={item.label}>
            {index > 0 ? <path d={`M ${x - 104} 82 L ${x - 74} 82`} stroke={HAIRLINE} strokeWidth="2" strokeDasharray="5 7" /> : null}
            <rect x={x - 58} y="52" width="116" height="60" rx="8" fill={SURFACE} stroke={active ? ACCENT : HAIRLINE} strokeWidth={active ? 2 : 1} />
            <text x={x} y="77" textAnchor="middle" fontSize="11" fill={INK_PRIMARY}>{item.label}</text>
            <text x={x} y="96" textAnchor="middle" fontSize="10" fill={INK_SECONDARY}>{item.value}</text>
          </g>
        );
      })}
    </svg>
  );
}

function SetDiagram({ active, inSet }: { active: string; inSet: boolean }) {
  const display = inSet ? active : "Ketu";

  return (
    <svg viewBox="0 0 680 150" role="img" aria-label="Combined 2 7 11 significator set" style={{ width: "100%", height: "auto", marginTop: "0.85rem" }}>
      <rect x="8" y="8" width="664" height="134" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      {COMBINED_SET.map((name, index) => {
        const x = 78 + index * 118;
        const selected = name === active;
        return (
          <g key={name}>
            <circle cx={x} cy="72" r="34" fill={SURFACE} stroke={selected ? ACCENT : HAIRLINE} strokeWidth={selected ? 2 : 1} />
            <text x={x} y="76" textAnchor="middle" fontSize="11" fill={INK_PRIMARY}>{name}</text>
          </g>
        );
      })}
      {!inSet ? (
        <g>
          <rect x="574" y="47" width="70" height="50" rx="8" fill={SURFACE} stroke={ACCENT} strokeWidth="2" />
          <text x="609" y="77" textAnchor="middle" fontSize="11" fill={INK_PRIMARY}>{display}</text>
        </g>
      ) : null}
    </svg>
  );
}

function ToggleRow({ checked, onChange, label, icon }: { checked: boolean; onChange: (checked: boolean) => void; label: string; icon: ReactNode }) {
  return (
    <label style={toggleStyle(checked)}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", fontSize: "0.88rem" }}>{icon}{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} aria-label={label} />
    </label>
  );
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  boxShadow: "var(--gl-shadow-soft)",
  padding: "1rem",
};

const twoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 0.72fr)",
  gap: "1rem",
};

const buttonGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "0.52rem",
  marginTop: "0.85rem",
};

const houseButtonGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "0.52rem",
  marginTop: "0.85rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontSize: "0.72rem",
  fontWeight: 500,
};

const headingStyle: CSSProperties = {
  margin: "0.22rem 0 0",
  color: INK_PRIMARY,
  fontSize: "1.25rem",
  fontWeight: 500,
};

const bodyStyle: CSSProperties = {
  margin: "0.45rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.58,
  maxWidth: 940,
};

const smallTextStyle: CSSProperties = {
  margin: "0.22rem 0 0",
  color: INK_SECONDARY,
  fontSize: "0.86rem",
  lineHeight: 1.48,
};

const panelTitleStyle: CSSProperties = {
  margin: 0,
  color: INK_PRIMARY,
  fontSize: "0.98rem",
  fontWeight: 500,
};

const factPanelStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "0.9rem",
  marginTop: "0.85rem",
};

const statusPillStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 999,
  color: INK_PRIMARY,
  display: "inline-flex",
  alignItems: "center",
  gap: "0.38rem",
  padding: "0.42rem 0.68rem",
  fontSize: "0.78rem",
  fontWeight: 500,
  background: SURFACE,
  whiteSpace: "nowrap",
};

const buttonReset: CSSProperties = {
  appearance: "none",
  cursor: "pointer",
  font: "inherit",
};

function choiceStyle(active: boolean): CSSProperties {
  return {
    ...buttonReset,
    border: `1px solid ${active ? ACCENT : HAIRLINE}`,
    borderRadius: 8,
    background: active ? "color-mix(in srgb, var(--gl-gold-accent) 8%, transparent)" : "transparent",
    color: active ? INK_PRIMARY : INK_SECONDARY,
    minHeight: 42,
    padding: "0.55rem 0.62rem",
    fontSize: "0.84rem",
    fontWeight: 500,
    textAlign: "center",
  };
}

function toggleStyle(checked: boolean): CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "0.75rem",
    border: `1px solid ${checked ? ACCENT : HAIRLINE}`,
    borderRadius: 8,
    padding: "0.62rem 0.7rem",
    color: checked ? INK_PRIMARY : INK_MUTED,
    cursor: "pointer",
    background: checked ? "color-mix(in srgb, var(--gl-gold-accent) 8%, transparent)" : "transparent",
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
  fontWeight: 500,
};
