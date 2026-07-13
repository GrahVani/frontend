"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  Eye,
  Network,
  RefreshCw,
  Route,
  ScanSearch,
  ShieldCheck,
  SlidersHorizontal,
  Sun,
  Users,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ThreadKey = "saturn" | "sun" | "lowTier";
type LayerKey = "theme" | "risk" | "statement";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const VERMILION = "var(--gl-vermilion-accent)";

const THREADS: Record<
  ThreadKey,
  {
    label: string;
    subtitle: string;
    graha: string;
    theme: string;
    risk: string;
    statement: string;
    color: string;
    icon: ReactNode;
  }
> = {
  saturn: {
    label: "Saturn / Aquarius",
    subtitle: "Three generations, three distinct roles",
    graha: "Discipline, structure, endurance, karma",
    theme: "Dev carries a double anchor, Ansh channels Saturn through the 5th house, and Chandra holds Aquarius as Lagna.",
    risk: "This clears the apophenia check because the pattern is Lagna-level and structurally specific.",
    statement: "A Saturnine structural thread runs through the family, without implying transmission.",
    color: GREEN,
    icon: <ShieldCheck size={16} />,
  },
  sun: {
    label: "Sun / Aries",
    subtitle: "Direct father-son same-graha resonance",
    graha: "King, soul, father, authority",
    theme: "Dev and Ansh both carry the Sun exalted in Aries, making the father-significator parallel direct.",
    risk: "This clears the apophenia check because it is same graha, same sign, same dignity.",
    statement: "A father-significator resonance appears in both charts, without inheritance language.",
    color: ACCENT,
    icon: <Sun size={16} />,
  },
  lowTier: {
    label: "Lower-tier rows",
    subtitle: "Inventory rows, not theme anchors",
    graha: "Shadow-graha and broad same-sign matches",
    theme: "These rows stay visible in the sweep, but the lesson does not build thematic claims from them.",
    risk: "High apophenia risk: a wide sweep across twelve signs will catch some matches by chance.",
    statement: "Record the row honestly, then stop before turning it into a family meaning.",
    color: VERMILION,
    icon: <Eye size={16} />,
  },
};

export function FamilyPatternThemeWorkbench() {
  const [thread, setThread] = useState<ThreadKey>("saturn");
  const [layer, setLayer] = useState<LayerKey>("theme");
  const [highTierOnly, setHighTierOnly] = useState(true);
  const [rolesDistinct, setRolesDistinct] = useState(true);
  const [apopheniaChecked, setApopheniaChecked] = useState(true);
  const [noCausation, setNoCausation] = useState(true);
  const [noTraitAdded, setNoTraitAdded] = useState(true);

  const active = THREADS[thread];
  const ready = highTierOnly && rolesDistinct && apopheniaChecked && noCausation && noTraitAdded && thread !== "lowTier";

  const feedback = useMemo(() => {
    if (thread === "lowTier") return "This row belongs in the inventory, but the lesson warns against turning lower-tier or shadow-graha matches into family-theme narratives.";
    if (!highTierOnly) return "Repair: thematic interpretation is restricted to the top-tier Saturn/Aquarius and Sun/Aries threads.";
    if (!rolesDistinct) return "Repair: the Saturn thread must keep Dev, Ansh, and Chandra in their distinct structural roles.";
    if (!apopheniaChecked) return "Repair: a wide sweep across twelve signs creates expected coincidences. Clear the apophenia bar before interpreting.";
    if (!noCausation) return "Repair: resonance is not transmission. Avoid inherited, passed down, or causal language.";
    if (!noTraitAdded) return "Repair: do not add a specific trait such as old-soul qualities unless the chart work established it.";
    return "Theme statement is disciplined: mechanically high-tier, classically anchored, role-specific, and free of causal or unearned trait claims.";
  }, [apopheniaChecked, highTierOnly, noCausation, noTraitAdded, rolesDistinct, thread]);

  return (
    <div data-interactive="family-pattern-theme-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Family pattern analysis</p>
            <h2 style={headingStyle}>Add the theme layer only after the pattern clears both guardrails</h2>
            <p style={bodyStyle}>
              Compare the Saturn/Aquarius and Sun/Aries threads, then test each statement against apophenia risk and the resonance-not-causation boundary.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setThread("saturn");
              setLayer("theme");
              setHighTierOnly(true);
              setRolesDistinct(true);
              setApopheniaChecked(true);
              setNoCausation(true);
              setNoTraitAdded(true);
            }}
            style={softButtonStyle}
          >
            <RefreshCw size={16} />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 600px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "0.8rem", flexWrap: "wrap", alignItems: "center" }}>
            <p style={eyebrowStyle}>Thematic annotation layer</p>
            <div style={segmentedStyle}>
              <LayerButton layer={layer} target="theme" onSelect={setLayer} label="Theme" />
              <LayerButton layer={layer} target="risk" onSelect={setLayer} label="Risk" />
              <LayerButton layer={layer} target="statement" onSelect={setLayer} label="Statement" />
            </div>
          </div>
          <ThemeDiagram thread={thread} layer={layer} ready={ready} />
        </section>

        <section style={{ ...cardStyle, flex: "1 1 320px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: active.color }}>
            {active.icon}
            <p style={eyebrowStyle}>{active.label}</p>
          </div>
          <h3 style={panelTitleStyle}>{active.subtitle}</h3>
          <p style={bodyStyle}>{layer === "theme" ? active.theme : layer === "risk" ? active.risk : active.statement}</p>
          <div style={{ ...noticeStyle(active.color), marginTop: "1rem" }}>
            <SlidersHorizontal size={18} />
            <span>{active.graha}</span>
          </div>
        </section>
      </div>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Thread selector</p>
          <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.85rem" }}>
            {(Object.keys(THREADS) as ThreadKey[]).map((key) => (
              <button key={key} type="button" onClick={() => setThread(key)} aria-pressed={thread === key} style={choiceButtonStyle(thread === key, THREADS[key].color)}>
                <span style={{ color: THREADS[key].color }}>{THREADS[key].icon}</span>
                <span>
                  <span style={{ display: "block", fontWeight: 500 }}>{THREADS[key].label}</span>
                  <span style={smallTextStyle}>{THREADS[key].subtitle}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Guardrail checks</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.8rem" }}>
            <ToggleRow checked={highTierOnly} onChange={setHighTierOnly} label="Use high-tier threads only" body="Theme is limited to Saturn/Aquarius and Sun/Aries." icon={<Network size={16} />} />
            <ToggleRow checked={rolesDistinct} onChange={setRolesDistinct} label="Keep roles distinct" body="Dev, Ansh, and Chandra do not express Aquarius in the same way." icon={<Route size={16} />} />
            <ToggleRow checked={apopheniaChecked} onChange={setApopheniaChecked} label="Check apophenia risk" body="Many comparisons across twelve signs make coincidences expected." icon={<ScanSearch size={16} />} />
            <ToggleRow checked={noCausation} onChange={setNoCausation} label="Avoid causation language" body="Say resonance, not inherited or passed down." icon={<ShieldCheck size={16} />} />
            <ToggleRow checked={noTraitAdded} onChange={setNoTraitAdded} label="Do not add unearned traits" body="Avoid vivid claims that the chart work did not establish." icon={<Eye size={16} />} />
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          {ready ? <BadgeCheck size={22} color={GREEN} /> : <AlertTriangle size={22} color={VERMILION} />}
          <div>
            <p style={eyebrowStyle}>Statement check</p>
            <h3 style={{ ...panelTitleStyle, color: ready ? GREEN : VERMILION }}>{ready ? "The theme statement stays within the evidence" : "The theme needs a boundary repair"}</h3>
            <p style={bodyStyle}>{feedback}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FamilyPatternThemeWorkbench;

function ThemeDiagram({ thread, layer, ready }: { thread: ThreadKey; layer: LayerKey; ready: boolean }) {
  const active = THREADS[thread];
  const saturnActive = thread === "saturn";
  const sunActive = thread === "sun";
  const lowActive = thread === "lowTier";

  return (
    <svg viewBox="0 0 820 460" role="img" aria-label="Family pattern thematic annotation diagram" style={{ width: "100%", minHeight: 360, marginTop: "0.85rem" }}>
      <rect x="10" y="10" width="800" height="440" rx="8" fill={SURFACE} stroke={HAIRLINE} />

      <PersonNode x={410} y={80} label="Dev" body="Lagna+Saturn Aq; Sun Aries" color={ACCENT} active={saturnActive || sunActive} />
      <PersonNode x={190} y={236} label="Ansh" body="Saturn H5 Aq; Sun Aries" color={BLUE} active={saturnActive || sunActive} />
      <PersonNode x={630} y={236} label="Chandra" body="Aquarius Lagna" color={GREEN} active={saturnActive} />

      <path d="M 360 118 L 238 198" fill="none" stroke={sunActive ? ACCENT : saturnActive ? GREEN : HAIRLINE} strokeWidth={sunActive || saturnActive ? 3 : 1.7} strokeDasharray={sunActive ? "0" : "7 7"} />
      <path d="M 460 118 L 582 198" fill="none" stroke={saturnActive ? GREEN : HAIRLINE} strokeWidth={saturnActive ? 3 : 1.7} />
      <path d="M 254 236 L 566 236" fill="none" stroke={lowActive ? VERMILION : HAIRLINE} strokeWidth={lowActive ? 3 : 1.7} strokeDasharray="6 7" />

      <AnnotationPanel thread={thread} layer={layer} activeColor={active.color} />

      <rect x="248" y="394" width="324" height="38" rx="8" fill={ready ? "#E8F5E9" : "#F9E8E3"} stroke={ready ? GREEN : VERMILION} strokeWidth="1.4" />
      <text x="410" y="418" textAnchor="middle" fill={ready ? GREEN : VERMILION} fontSize="12" fontWeight="500">
        {ready ? "Symbolic resonance, not causal transmission" : "Check tier, chance, and claim strength"}
      </text>
    </svg>
  );
}

function AnnotationPanel({ thread, layer, activeColor }: { thread: ThreadKey; layer: LayerKey; activeColor: string }) {
  const copy = getLayerCopy(thread, layer);

  return (
    <g>
      <rect x="122" y="316" width="576" height="58" rx="8" fill={softFill(activeColor)} stroke={activeColor} strokeWidth="1.5" />
      <text x="410" y="338" textAnchor="middle" fill={activeColor} fontSize="12" fontWeight="500">{copy.title}</text>
      <text x="410" y="358" textAnchor="middle" fill={INK_SECONDARY} fontSize="10.5">{copy.body}</text>
    </g>
  );
}

function getLayerCopy(thread: ThreadKey, layer: LayerKey) {
  if (thread === "lowTier") {
    if (layer === "risk") return { title: "High apophenia risk", body: "A broad sweep catches weak and shadow rows; more matches does not mean more meaning." };
    if (layer === "statement") return { title: "Do not feature as family theme", body: "Record the row honestly, then stop before turning it into a story." };
    return { title: "Inventory only", body: "Lower-tier rows remain visible, but they are not thematic anchors in this lesson." };
  }
  if (thread === "sun") {
    if (layer === "risk") return { title: "Low apophenia risk", body: "Same graha, same sign, same exalted dignity, adjacent generations." };
    if (layer === "statement") return { title: "Disciplined statement", body: "A father-significator resonance appears in both charts, without inheritance language." };
    return { title: "Sun signification", body: "Authority, fatherhood, soul, and leadership applied to a direct Dev-Ansh parallel." };
  }
  if (layer === "risk") return { title: "Low apophenia risk", body: "Lagna-level Aquarius across Dev and Chandra, with Ansh's Saturn adding a domain-specific link." };
  if (layer === "statement") return { title: "Disciplined statement", body: "A Saturnine structural thread runs through the family; the charts do not prove transmission." };
  return { title: "Saturn signification", body: "Discipline, structure, endurance, and karma expressed through distinct chart roles." };
}

function PersonNode({ x, y, label, body, color, active }: { x: number; y: number; label: string; body: string; color: string; active: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r="62" fill={active ? softFill(color) : SURFACE} stroke={active ? color : HAIRLINE} strokeWidth={active ? 2.4 : 1.2} />
      <Users x={x - 10} y={y - 38} size={20} color={active ? color : INK_MUTED} />
      <text x={x} y={y + 2} textAnchor="middle" fill={active ? color : INK_PRIMARY} fontSize="15" fontWeight="500">{label}</text>
      <text x={x} y={y + 24} textAnchor="middle" fill={INK_MUTED} fontSize="10">{body}</text>
    </g>
  );
}

function LayerButton({ layer, target, onSelect, label }: { layer: LayerKey; target: LayerKey; onSelect: (layer: LayerKey) => void; label: string }) {
  const active = layer === target;
  return (
    <button type="button" aria-pressed={active} onClick={() => onSelect(target)} style={viewButtonStyle(active)}>
      {label}
    </button>
  );
}

function ToggleRow({ checked, onChange, label, body, icon }: { checked: boolean; onChange: (checked: boolean) => void; label: string; body: string; icon: ReactNode }) {
  return (
    <label style={toggleStyle(checked)}>
      <span style={{ color: checked ? ACCENT : INK_MUTED }}>{icon}</span>
      <span>
        <span style={{ display: "block", fontWeight: 500 }}>{label}</span>
        <span style={smallTextStyle}>{body}</span>
      </span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} aria-label={label} />
    </label>
  );
}

function softFill(color: string) {
  if (color === GREEN) return "#E8F5E9";
  if (color === BLUE) return "#EAF1F8";
  if (color === VERMILION) return "#F9E8E3";
  return "#F7F0E1";
}

const cardStyle: CSSProperties = {
  background: SURFACE,
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "1rem",
  boxShadow: "0 10px 26px rgba(90, 62, 18, 0.07)",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: ACCENT,
  textTransform: "uppercase",
  letterSpacing: 0,
  fontSize: "0.78rem",
  fontWeight: 500,
};

const headingStyle: CSSProperties = {
  margin: "0.35rem 0 0",
  color: INK_PRIMARY,
  fontSize: "clamp(1.35rem, 2vw, 1.85rem)",
  lineHeight: 1.2,
  fontWeight: 500,
};

const panelTitleStyle: CSSProperties = {
  margin: "0.45rem 0 0",
  color: INK_PRIMARY,
  fontSize: "1.05rem",
  lineHeight: 1.25,
  fontWeight: 500,
};

const bodyStyle: CSSProperties = {
  margin: "0.55rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.55,
  fontSize: "0.95rem",
};

const smallTextStyle: CSSProperties = {
  display: "block",
  marginTop: 3,
  color: INK_MUTED,
  fontSize: "0.8rem",
  lineHeight: 1.35,
};

const softButtonStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  background: "#FFFFFF",
  color: INK_PRIMARY,
  borderRadius: 8,
  padding: "0.6rem 0.85rem",
  display: "inline-flex",
  gap: "0.45rem",
  alignItems: "center",
  cursor: "pointer",
  fontWeight: 500,
};

const segmentedStyle: CSSProperties = {
  display: "inline-flex",
  gap: 4,
  padding: 4,
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: "#FFFFFF",
};

function viewButtonStyle(active: boolean): CSSProperties {
  return {
    border: `1px solid ${active ? ACCENT : "transparent"}`,
    background: active ? "#F7F0E1" : "transparent",
    color: active ? INK_PRIMARY : INK_SECONDARY,
    borderRadius: 7,
    padding: "0.45rem 0.7rem",
    cursor: "pointer",
    fontWeight: 500,
  };
}

const twoColumnStyle: CSSProperties = {
  display: "grid",
  gap: "1rem",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
};

function choiceButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    width: "100%",
    textAlign: "left",
    display: "grid",
    gridTemplateColumns: "22px 1fr",
    gap: "0.65rem",
    alignItems: "start",
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? softFill(color) : "#FFFFFF",
    color: INK_PRIMARY,
    borderRadius: 8,
    padding: "0.72rem",
    cursor: "pointer",
  };
}

function toggleStyle(checked: boolean): CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "22px 1fr auto",
    gap: "0.65rem",
    alignItems: "start",
    border: `1px solid ${checked ? ACCENT : HAIRLINE}`,
    background: checked ? "#F7F0E1" : "#FFFFFF",
    borderRadius: 8,
    padding: "0.7rem",
    color: INK_PRIMARY,
  };
}

function noticeStyle(color: string): CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "22px 1fr",
    gap: "0.55rem",
    alignItems: "start",
    border: `1px solid ${color}`,
    background: softFill(color),
    borderRadius: 8,
    padding: "0.75rem",
    color,
    lineHeight: 1.45,
    fontSize: "0.9rem",
  };
}
