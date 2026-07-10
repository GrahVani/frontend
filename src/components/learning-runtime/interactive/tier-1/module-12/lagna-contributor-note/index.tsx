"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, ShieldCheck, Sparkles, Users, Anchor, Info } from "lucide-react";
import { IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import { RASHIS, getRashiByNumber } from '@/components/learning-runtime/interactive/rashi-data';

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const GREEN = "#2F7D55";
const RED = "#A8412B";
const AMBER = "#f59e0b";
const BLUE = "#3b82f6";
const PURPLE = "#8b5cf6";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

type TabKey = "anchoring" | "pervasiveness" | "eighth";
type HouseCategory = "kendra" | "trikona" | "dusthana" | "upachaya" | "neutral";

interface Contributor {
  key: string;
  label: string;
  iast: string;
  glyph: string;
  role: string;
  kind: "planet" | "lagna";
}

const CONTRIBUTORS: Contributor[] = [
  { key: "sun", label: "Sun", iast: "Sūrya", glyph: "☉", role: "Soul / vitality", kind: "planet" },
  { key: "moon", label: "Moon", iast: "Candra", glyph: "☽", role: "Mind / nurture", kind: "planet" },
  { key: "mars", label: "Mars", iast: "Maṅgala", glyph: "♂", role: "Courage / drive", kind: "planet" },
  { key: "mercury", label: "Mercury", iast: "Budha", glyph: "☿", role: "Intellect / speech", kind: "planet" },
  { key: "jupiter", label: "Jupiter", iast: "Guru", glyph: "♃", role: "Wisdom / fortune", kind: "planet" },
  { key: "venus", label: "Venus", iast: "Śukra", glyph: "♀", role: "Pleasure / wealth", kind: "planet" },
  { key: "saturn", label: "Saturn", iast: "Śani", glyph: "♄", role: "Work / endurance", kind: "planet" },
  { key: "lagna", label: "Lagna", iast: "Lagna", glyph: "Lg", role: "Chart frame / ascendant", kind: "lagna" },
];

const HOUSE_CATEGORIES: Record<number, { type: HouseCategory; label: string }> = {
  1: { type: "kendra", label: "Kendra" },
  4: { type: "kendra", label: "Kendra" },
  7: { type: "kendra", label: "Kendra" },
  10: { type: "kendra", label: "Kendra" },
  5: { type: "trikona", label: "Trikona" },
  9: { type: "trikona", label: "Trikona" },
  6: { type: "dusthana", label: "Dusthana" },
  8: { type: "dusthana", label: "Dusthana" },
  12: { type: "dusthana", label: "Dusthana" },
  3: { type: "upachaya", label: "Upachaya" },
  11: { type: "upachaya", label: "Upachaya" },
};

function categoryColor(type: HouseCategory) {
  switch (type) {
    case "kendra": return BLUE;
    case "trikona": return GREEN;
    case "dusthana": return RED;
    case "upachaya": return AMBER;
    default: return INK_MUTED;
  }
}

function categoryBg(type: HouseCategory) {
  switch (type) {
    case "kendra": return `${BLUE}12`;
    case "trikona": return `${GREEN}12`;
    case "dusthana": return `${RED}12`;
    case "upachaya": return `${AMBER}12`;
    default: return "rgba(156,122,47,0.06)";
  }
}

export function LagnaContributorNote() {
  const [lagnaSignNum, setLagnaSignNum] = useState<number>(1);
  const [lagnaStrength, setLagnaStrength] = useState<number>(50);
  const [activeTab, setActiveTab] = useState<TabKey>("anchoring");

  const lagnaRashi = useMemo(() => getRashiByNumber(lagnaSignNum)!, [lagnaSignNum]);

  const getSignForHouse = (houseNum: number) => ((lagnaSignNum - 1 + houseNum - 1) % 12) + 1;
  const getHouseForSign = (signNum: number) => ((signNum - lagnaSignNum + 12) % 12) + 1;

  const circlePoints = useMemo(() => {
    const points = [];
    const cx = 140, cy = 140, r = 95;
    for (let i = 0; i < 12; i++) {
      const angleDeg = i * 30 - 90;
      const angleRad = (angleDeg * Math.PI) / 180;
      points.push({ x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad), angleDeg, rashiNum: i + 1 });
    }
    return points;
  }, []);

  const houseMap = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const houseNum = i + 1;
      const signNum = getSignForHouse(houseNum);
      const rashi = getRashiByNumber(signNum)!;
      const category = HOUSE_CATEGORIES[houseNum] || { type: "neutral" as HouseCategory, label: "—" };
      return { houseNum, signNum, rashi, category };
    });
  }, [lagnaSignNum]);

  const strengthFeedback = useMemo(() => {
    const drain = Math.round((1 - lagnaStrength / 100) * 40);
    const boost = Math.round((lagnaStrength - 70) * 0.6);
    if (lagnaStrength < 30) {
      return {
        label: "Weak / Afflicted Frame",
        short: "Frame drains results",
        desc: `With Lagna in ${lagnaRashi.nameEnglish}, the chart-frame is structurally low. Planetary BAVs and transits lose roughly ${drain}% of their manifesting power because the ascendant cannot anchor the result firmly.`,
        color: RED,
        vitality: lagnaStrength,
      };
    } else if (lagnaStrength < 70) {
      return {
        label: "Medium / Supported Frame",
        short: "Frame holds steady",
        desc: `Lagna in ${lagnaRashi.nameEnglish} gives standard support. Planetary energies manifest near their calculated values; the frame neither dramatizes nor undermines the houses it anchors.`,
        color: AMBER,
        vitality: lagnaStrength,
      };
    } else {
      return {
        label: "Strong / Luminous Frame",
        short: "Frame amplifies results",
        desc: `Lagna in ${lagnaRashi.nameEnglish} is robust. It stabilizes weaker transits and gives good ones roughly ${boost}% extra carrying capacity across every house.`,
        color: GREEN,
        vitality: lagnaStrength,
      };
    }
  }, [lagnaStrength, lagnaRashi]);

  const kendraHouses = useMemo(() => houseMap.filter(h => h.category.type === "kendra"), [houseMap]);
  const trikonaHouses = useMemo(() => houseMap.filter(h => h.category.type === "trikona"), [houseMap]);

  const handleReset = () => {
    setLagnaSignNum(1);
    setLagnaStrength(50);
    setActiveTab("anchoring");
  };

  const vitalityWidth = `${lagnaStrength}%`;

  return (
    <div data-interactive="lagna-contributor-note" style={{ padding: "14px", borderRadius: "14px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", boxShadow: "0 8px 32px rgba(72, 48, 16, 0.05)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "10px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
            Why the Lagna is the Eighth Contributor
          </h3>
          <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
            The Ascendant is not a planet — yet it anchors every house and donates bindus on par with the seven grahas in <IAST>Aṣṭakavarga</IAST>.
          </p>
        </div>
        <button
          onClick={handleReset}
          style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", border: "1px solid rgba(156,122,47,0.15)", borderRadius: "8px", background: "transparent", color: INK_SECONDARY, fontSize: "11px", fontWeight: 750, cursor: "pointer", transition: "all 0.2s" }}
        >
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      {/* Controls */}
      <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "10px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase" }}>Lagna Sign</span>
          <select
            value={lagnaSignNum}
            onChange={(e) => setLagnaSignNum(Number(e.target.value))}
            style={{ border: "1px solid rgba(156,122,47,0.25)", borderRadius: "5px", background: "#ffffff", color: INK_PRIMARY, padding: "4px 6px", fontSize: "11px", fontWeight: 700, minWidth: "150px", cursor: "pointer" }}
          >
            {RASHIS.map(r => (
              <option key={r.number} value={r.number}>
                {r.nameEnglish} ({r.number}) — {r.nameIAST}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", flex: "1 1 240px" }}>
          <span style={{ fontSize: "10px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase", whiteSpace: "nowrap" }}>Lagna Strength</span>
          <input
            type="range"
            min="0"
            max="100"
            value={lagnaStrength}
            onChange={(e) => setLagnaStrength(Number(e.target.value))}
            style={{ flex: 1, accentColor: strengthFeedback.color, cursor: "pointer" }}
          />
          <span style={{ fontSize: "10px", fontWeight: 800, color: strengthFeedback.color, minWidth: "60px", textAlign: "right" }}>
            {lagnaStrength}%
          </span>
        </div>
      </div>

      {/* Main two-column layout */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "stretch" }}>

        {/* Left — dynamic wheel */}
        <div style={{ flex: "1 1 280px", minWidth: "260px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ background: "#ffffff", padding: "12px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h4 style={{ margin: "0 0 8px 0", fontSize: "10px", fontWeight: 800, color: INK_MUTED, textTransform: "uppercase", alignSelf: "flex-start" }}>
              Lagna anchors the 12 houses
            </h4>
            <div style={{ position: "relative", width: "260px", height: "260px" }}>
              <svg width="260" height="260" viewBox="0 0 300 300" style={{ overflow: "visible" }}>
                <circle cx="150" cy="150" r="130" fill="none" stroke="rgba(156,122,47,0.15)" strokeWidth="2" />
                <circle cx="150" cy="150" r="65" fill="none" stroke="rgba(156,122,47,0.1)" strokeWidth="1" />

                {/* Sector division lines */}
                {RASHIS.map((_, i) => {
                  const angleDeg = i * 30 - 105;
                  const angleRad = (angleDeg * Math.PI) / 180;
                  const lx = 150 + 130 * Math.cos(angleRad);
                  const ly = 150 + 130 * Math.sin(angleRad);
                  return <line key={`line-${i}`} x1="150" y1="150" x2={lx} y2={ly} stroke="rgba(156,122,47,0.08)" strokeWidth="1.2" />;
                })}

                {/* Rashi slices */}
                {RASHIS.map((r, i) => {
                  const num = r.number;
                  const isLagna = num === lagnaSignNum;
                  const houseNum = getHouseForSign(num);
                  const category = HOUSE_CATEGORIES[houseNum] || { type: "neutral" as HouseCategory, label: "—" };

                  const fill = isLagna
                    ? `color-mix(in srgb, ${GOLD_DEEP} 12%, transparent)`
                    : categoryBg(category.type);
                  const stroke = isLagna ? GOLD_DEEP : "rgba(156,122,47,0.12)";

                  const startAngle = i * 30 - 105;
                  const endAngle = i * 30 - 75;
                  const so = { x: 150 + 130 * Math.cos((startAngle * Math.PI) / 180), y: 150 + 130 * Math.sin((startAngle * Math.PI) / 180) };
                  const eo = { x: 150 + 130 * Math.cos((endAngle * Math.PI) / 180), y: 150 + 130 * Math.sin((endAngle * Math.PI) / 180) };
                  const si = { x: 150 + 65 * Math.cos((startAngle * Math.PI) / 180), y: 150 + 65 * Math.sin((startAngle * Math.PI) / 180) };
                  const ei = { x: 150 + 65 * Math.cos((endAngle * Math.PI) / 180), y: 150 + 65 * Math.sin((endAngle * Math.PI) / 180) };

                  const pathData = [
                    `M ${si.x} ${si.y}`,
                    `L ${so.x} ${so.y}`,
                    `A 130 130 0 0 1 ${eo.x} ${eo.y}`,
                    `L ${ei.x} ${ei.y}`,
                    `A 65 65 0 0 0 ${si.x} ${si.y}`,
                    "Z"
                  ].join(" ");

                  return (
                    <path
                      key={`lpath-${num}`}
                      d={pathData}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={isLagna ? "2.5" : "0.5"}
                      style={{ cursor: "pointer", transition: "all 0.15s" }}
                      onClick={() => setLagnaSignNum(num)}
                    />
                  );
                })}

                {/* Central rays */}
                {circlePoints.map(p => {
                  const angleDeg = p.angleDeg;
                  const angleRad = (angleDeg * Math.PI) / 180;
                  const ptInner = { x: 150 + 65 * Math.cos(angleRad), y: 150 + 65 * Math.sin(angleRad) };
                  return (
                    <line
                      key={`ray-${p.rashiNum}`}
                      x1="150"
                      y1="150"
                      x2={ptInner.x}
                      y2={ptInner.y}
                      stroke={p.rashiNum === lagnaSignNum ? GOLD_DEEP : "rgba(156,122,47,0.08)"}
                      strokeWidth={p.rashiNum === lagnaSignNum ? "2" : "0.5"}
                      strokeDasharray={p.rashiNum === lagnaSignNum ? "none" : "2,2"}
                    />
                  );
                })}

                {/* Labels */}
                {circlePoints.map(p => {
                  const r = RASHIS[p.rashiNum - 1];
                  const angleDeg = p.angleDeg;
                  const angleRad = (angleDeg * Math.PI) / 180;
                  const ptEng = { x: 150 + 115 * Math.cos(angleRad), y: 150 + 115 * Math.sin(angleRad) };
                  const ptHouse = { x: 150 + 80 * Math.cos(angleRad), y: 150 + 80 * Math.sin(angleRad) };
                  const isLagna = p.rashiNum === lagnaSignNum;
                  const houseNum = getHouseForSign(p.rashiNum);

                  return (
                    <g key={`llabel-${p.rashiNum}`}>
                      <text
                        x={ptEng.x}
                        y={ptEng.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ fontSize: "8px", fontWeight: 700, fill: INK_PRIMARY }}
                      >
                        {r.nameEnglish}
                      </text>

                      <g style={{ cursor: "pointer" }} onClick={() => setLagnaSignNum(p.rashiNum)}>
                        <circle
                          cx={ptHouse.x}
                          cy={ptHouse.y}
                          r={isLagna ? "13" : "10"}
                          fill={isLagna ? GOLD_DEEP : "rgba(156,122,47,0.04)"}
                          stroke={isLagna ? "#ffffff" : "rgba(156,122,47,0.12)"}
                          strokeWidth="1"
                        />
                        <text
                          x={ptHouse.x}
                          y={ptHouse.y + 0.5}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          style={{ fontSize: isLagna ? "9px" : "8px", fontWeight: 800, fill: isLagna ? "#ffffff" : INK_SECONDARY }}
                        >
                          {isLagna ? "Lg" : `${houseNum}H`}
                        </text>
                      </g>
                    </g>
                  );
                })}

                {/* Central Circle */}
                <circle cx="150" cy="150" r="28" fill="#ffffff" stroke={GOLD} strokeWidth="1.5" />
                <text x="150" y="146" textAnchor="middle" style={{ fontSize: "7px", fontWeight: 800, fill: INK_MUTED }}>ASC</text>
                <text x="150" y="160" textAnchor="middle" style={{ fontSize: "14px", fontWeight: 950, fill: GOLD_DEEP }}>Lg</text>
              </svg>
            </div>
          </div>

          {/* House map mini-card */}
          <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <div style={{ fontSize: "9px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase" }}>House-to-sign map</div>
              <div style={{ display: "flex", gap: "6px", fontSize: "8px" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "2px" }}><span style={{ width: "6px", height: "6px", borderRadius: "50%", background: BLUE }} />Kendra</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "2px" }}><span style={{ width: "6px", height: "6px", borderRadius: "50%", background: GREEN }} />Trikona</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "2px" }}><span style={{ width: "6px", height: "6px", borderRadius: "50%", background: RED }} />Dusthana</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "2px" }}><span style={{ width: "6px", height: "6px", borderRadius: "50%", background: AMBER }} />Upachaya</span>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "4px" }}>
              {houseMap.map(h => (
                <div
                  key={h.houseNum}
                  style={{
                    background: categoryBg(h.category.type),
                    border: `1px solid ${categoryColor(h.category.type)}40`,
                    borderRadius: "5px",
                    padding: "4px 3px",
                    textAlign: "center",
                    transition: "all 0.2s"
                  }}
                >
                  <div style={{ fontSize: "8px", fontWeight: 800, color: categoryColor(h.category.type) }}>{h.houseNum}H</div>
                  <div style={{ fontSize: "9px", fontWeight: 700, color: INK_PRIMARY, whiteSpace: "nowrap" }}>{h.rashi.nameEnglish}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — dynamic education */}
        <div style={{ flex: "1 1 280px", minWidth: "260px", display: "flex", flexDirection: "column", gap: "8px" }}>

          {/* Selected lagna badge */}
          <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", gap: "10px", alignItems: "center" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: `${GOLD_DEEP}15`, border: `1.5px solid ${GOLD_DEEP}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 900, color: GOLD_DEEP }}>
              Lg
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "12px", fontWeight: 800, color: INK_PRIMARY }}>
                Lagna in <IAST>{lagnaRashi.nameIAST}</IAST> ({lagnaRashi.nameEnglish})
              </div>
              <div style={{ fontSize: "10px", color: INK_SECONDARY, display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <span>Lord: <strong style={{ color: GOLD_DEEP }}>{lagnaRashi.lord}</strong></span>
                <span>Element: <strong style={{ color: GOLD_DEEP }}>{lagnaRashi.element}</strong></span>
                <span>Modality: <strong style={{ color: GOLD_DEEP }}>{lagnaRashi.modality}</strong></span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid rgba(0,0,0,0.08)", paddingBottom: "2px" }}>
            {(["anchoring", "pervasiveness", "eighth"] as TabKey[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: "7px 4px",
                  border: "none",
                  borderBottom: activeTab === tab ? `2px solid ${GOLD_DEEP}` : "none",
                  background: "transparent",
                  fontSize: "10.5px",
                  fontWeight: activeTab === tab ? 800 : 600,
                  color: activeTab === tab ? GOLD_DEEP : INK_SECONDARY,
                  cursor: "pointer",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px"
                }}
              >
                {tab === "anchoring" && <Anchor size={12} />}
                {tab === "pervasiveness" && <Sparkles size={12} />}
                {tab === "eighth" && <Users size={12} />}
                {tab === "anchoring" ? "Anchoring" : tab === "pervasiveness" ? "Pervasiveness" : "8th Contributor"}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div style={{ flex: 1, minHeight: "120px" }}>
            <AnimatePresence mode="wait">
              {activeTab === "anchoring" && (
                <motion.div
                  key="anchoring"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: "flex", flexDirection: "column", gap: "8px" }}
                >
                  <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)" }}>
                    <h4 style={{ margin: "0 0 5px 0", fontSize: "11px", fontWeight: 800, color: GOLD_DEEP, display: "flex", alignItems: "center", gap: "5px" }}>
                      <Anchor size={13} /> Frame anchored at <IAST>{lagnaRashi.nameIAST}</IAST>
                    </h4>
                    <p style={{ margin: 0, fontSize: "11px", lineHeight: "1.45", color: INK_SECONDARY }}>
                      With Lagna in <strong>{lagnaRashi.nameEnglish}</strong>, the 1st house is <IAST>{lagnaRashi.nameIAST}</IAST>, the 2nd is <IAST>{getRashiByNumber(getSignForHouse(2))?.nameIAST}</IAST>, the 4th is <IAST>{getRashiByNumber(getSignForHouse(4))?.nameIAST}</IAST>, and so on. Every house is counted <em>from the Lagna</em>.
                    </p>
                  </div>

                  <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)" }}>
                    <div style={{ fontSize: "9px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase", marginBottom: "6px" }}>Key anchors for this Lagna</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                      <div style={{ display: "flex", gap: "8px", fontSize: "10.5px" }}>
                        <span style={{ color: BLUE, fontWeight: 800, minWidth: "70px" }}>Kendras</span>
                        <span style={{ color: INK_SECONDARY }}>
                          {kendraHouses.map(h => `${h.houseNum}H → ${h.rashi.nameEnglish}`).join("; ")}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: "8px", fontSize: "10.5px" }}>
                        <span style={{ color: GREEN, fontWeight: 800, minWidth: "70px" }}>Trikonas</span>
                        <span style={{ color: INK_SECONDARY }}>
                          {trikonaHouses.map(h => `${h.houseNum}H → ${h.rashi.nameEnglish}`).join("; ")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ background: "rgba(74,124,155,0.06)", border: "1px solid rgba(74,124,155,0.15)", borderRadius: "8px", padding: "8px", display: "flex", gap: "6px", alignItems: "flex-start" }}>
                    <Info size={13} color={BLUE} style={{ flexShrink: 0, marginTop: "2px" }} />
                    <p style={{ margin: 0, fontSize: "10px", lineHeight: "1.45", color: INK_SECONDARY }}>
                      Move the <strong>Lagna Sign</strong> control: the wheel rotates so that 1H always stays on the chosen sign. That is the anchoring principle — the frame is fixed to the Ascendant, not to Aries.
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === "pervasiveness" && (
                <motion.div
                  key="pervasiveness"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: "flex", flexDirection: "column", gap: "8px" }}
                >
                  <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)" }}>
                    <h4 style={{ margin: "0 0 5px 0", fontSize: "11px", fontWeight: 800, color: GOLD_DEEP, display: "flex", alignItems: "center", gap: "5px" }}>
                      <Sparkles size={13} /> Whole-chart vitality
                    </h4>
                    <p style={{ margin: 0, fontSize: "11px", lineHeight: "1.45", color: INK_SECONDARY }}>
                      Because the Lagna conditions the physical manifestation of every house, its strength raises or lowers the entire chart. A strong <IAST>{lagnaRashi.nameIAST}</IAST> Lagna supports all twelve houses simultaneously.
                    </p>
                  </div>

                  {/* Vitality meter */}
                  <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                      <span style={{ fontSize: "10px", fontWeight: 800, color: INK_PRIMARY }}>Frame Vitality Index</span>
                      <span style={{ fontSize: "10px", fontWeight: 800, color: strengthFeedback.color }}>{strengthFeedback.label}</span>
                    </div>
                    <div style={{ height: "8px", borderRadius: "4px", background: "rgba(0,0,0,0.06)", overflow: "hidden" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: vitalityWidth }}
                        transition={{ duration: 0.4 }}
                        style={{ height: "100%", background: strengthFeedback.color }}
                      />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: INK_MUTED, marginTop: "4px" }}>
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* Strength sentence */}
                  <div style={{ background: `${strengthFeedback.color}10`, border: `1px solid ${strengthFeedback.color}40`, borderRadius: "8px", padding: "10px", display: "flex", gap: "8px", alignItems: "flex-start" }}>
                    <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: strengthFeedback.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ color: "#ffffff", fontSize: "11px", fontWeight: 900 }}>{lagnaStrength}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: "10.5px", lineHeight: "1.45", color: INK_SECONDARY }}>
                      {strengthFeedback.desc}
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === "eighth" && (
                <motion.div
                  key="eighth"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: "flex", flexDirection: "column", gap: "8px" }}
                >
                  <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)" }}>
                    <h4 style={{ margin: "0 0 5px 0", fontSize: "11px", fontWeight: 800, color: GOLD_DEEP, display: "flex", alignItems: "center", gap: "5px" }}>
                      <Users size={13} /> Seven planets + Lagna = 8 contributors
                    </h4>
                    <p style={{ margin: 0, fontSize: "11px", lineHeight: "1.45", color: INK_SECONDARY }}>
                      In <IAST>Aṣṭakavarga</IAST>, the Lagna is not merely a reference point. It owns a fixed contribution table and donates bindus to houses counted from itself — exactly as the seven grahas do from their own signs.
                    </p>
                  </div>

                  {/* Contributors grid */}
                  <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)" }}>
                    <div style={{ fontSize: "9px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase", marginBottom: "6px" }}>Contributor roster</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "5px" }}>
                      {CONTRIBUTORS.map(c => {
                        const isLagna = c.kind === "lagna";
                        return (
                          <div
                            key={c.key}
                            style={{
                              background: isLagna ? `${GOLD_DEEP}15` : "rgba(156,122,47,0.05)",
                              border: `1.2px solid ${isLagna ? GOLD_DEEP : "rgba(156,122,47,0.15)"}`,
                              borderRadius: "6px",
                              padding: "5px",
                              textAlign: "center"
                            }}
                          >
                            <div style={{ fontSize: "13px", color: isLagna ? GOLD_DEEP : INK_PRIMARY }}>{c.glyph}</div>
                            <div style={{ fontSize: "9px", fontWeight: 800, color: isLagna ? GOLD_DEEP : INK_PRIMARY }}>{c.label}</div>
                            <div style={{ fontSize: "8px", color: INK_MUTED }}>{c.role}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ background: "rgba(156,122,47,0.06)", border: "1px solid rgba(156,122,47,0.15)", borderRadius: "8px", padding: "8px", display: "flex", gap: "6px", alignItems: "flex-start" }}>
                    <ShieldCheck size={14} color={GOLD_DEEP} style={{ flexShrink: 0, marginTop: "1px" }} />
                    <p style={{ margin: 0, fontSize: "10px", lineHeight: "1.45", color: INK_SECONDARY }}>
                      <strong>Self-referential architecture:</strong> The Lagna defines the house map (frame) and then contributes bindus to that same map. This is why dropping it from a BAV calculation is a serious omission.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Source footer */}
      <div style={{ background: SURFACE_MANUSCRIPT, border: "1px solid rgba(156,122,47,0.12)", borderRadius: "8px", padding: "8px", fontSize: "9px", color: INK_MUTED, lineHeight: "1.4" }}>
        <strong>Source:</strong> <IAST>Bṛhat Pārāśara Horā Śāstra</IAST> (Aṣṭakavarga adhyāya). The Lagna's inclusion as the eighth contributor formalizes its whole-chart anchoring: it counts all houses from itself and donates bindus relative to itself in every BAV.
      </div>
    </div>
  );
}
