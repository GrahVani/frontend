"use client";

import { useState, useMemo } from "react";
import { CheckCircle2, Clock, Scale, Info } from "lucide-react";
import { IAST } from "../../chrome/typography";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const PURPLE = "#8b5cf6";
const GREEN = "#2F7D55";
const AMBER = "#f59e0b";
const RED = "#A8412B";
const SLATE_BLUE = "#3b82f6";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

interface HouseAxisDetail {
  id: string;
  label: string;
  rahuHouse: number;
  ketuHouse: number;
  title: string;
  rahuFocus: string;
  ketuFocus: string;
  synthesis: string;
}

const AXIS_DETAILS: HouseAxisDetail[] = [
  { id: "1-7", label: "1–7", rahuHouse: 1, ketuHouse: 7, title: "Identity vs. Relationship Polarity",
    rahuFocus: "Obsessive self-focus, personal projection, restructuring identity. Grasping for independent self-will — the ahaṅkāra asserts itself.",
    ketuFocus: "Dissolving partnership attachments, letting go of dependency on marriage/legal agreements, experiencing partner distance — vairāgya through the Other.",
    synthesis: "Realignment of self-reliance vs. cooperative sharing. Dissolving relational codependency to build a mature, independent identity." },
  { id: "2-8", label: "2–8", rahuHouse: 2, ketuHouse: 8, title: "Personal Wealth vs. Shared Assets Polarity",
    rahuFocus: "Heavy urge to accumulate assets, manage bank balances, command speech. Grasping for material security — artha without surrender.",
    ketuFocus: "Detaching from joint resources, spouse's finances, secret occult investigations. Experiencing inheritance delays — randhra as release.",
    synthesis: "Shifting focus from shared legacy assets and secrets toward structuring self-made resource buffers and direct values." },
  { id: "3-9", label: "3–9", rahuHouse: 3, ketuHouse: 9, title: "Self-effort vs. Grace Polarity",
    rahuFocus: "Obsessive daily work, communication, skills, writing, intense self-efforts. Relying entirely on own hands — parākrama.",
    ketuFocus: "Dissolving rigid dogmatic beliefs, detaching from religious institutions, distance from gurus and fathers — bhāgya through letting go.",
    synthesis: "Learning to balance self-made efforts and logical skills with mature, structured surrender to dharma and spiritual laws." },
  { id: "4-10", label: "4–10", rahuHouse: 4, ketuHouse: 10, title: "Home vs. Professional Status Polarity",
    rahuFocus: "Urge for domestic peace, property acquisitions, home baseline comfort. Emotional nesting focus — sukha-sthāna grasping.",
    ketuFocus: "Releasing ambition, detaching from public reputation pressures, dissolving corporate status obsession — karma-sthāna release.",
    synthesis: "Stabilizing home boundaries and emotional foundations by consciously letting go of external status anxieties." },
  { id: "5-11", label: "5–11", rahuHouse: 5, ketuHouse: 11, title: "Creative Intellect vs. Social Gains Polarity",
    rahuFocus: "Obsessive focus on personal projects, children, spiritual chants (mantra), speculative intellect. Putra-bhāva grasping.",
    ketuFocus: "Detaching from massive social clubs, dissolving dependencies on networking gains, pruning superficial friendships — lābha released.",
    synthesis: "Realignment toward deep individual creativity, study, and child development, leaving behind social recognition loops." },
  { id: "6-12", label: "6–12", rahuHouse: 6, ketuHouse: 12, title: "Daily Service vs. Spiritual Liberation Polarity",
    rahuFocus: "Urge to resolve health issues, clean daily routines, fight debts, handle service tasks. Managing enemies/conflict — roga-śatrū.",
    ketuFocus: "Dissolving active expenditures, detaching from dreams, releasing fear of isolation. Spiritual surrender — vyaya as mokṣa.",
    synthesis: "Sustaining regular daily health routines and pragmatic service while surrendering the ego's control through meditation and rest." }
];

const PLANET_RULED_HOUSES: Record<string, { houses: number[]; description: string }> = {
  Sun: { houses: [5], description: "rules 5H (Leo)" },
  Moon: { houses: [4], description: "rules 4H (Cancer)" },
  Mars: { houses: [1, 8], description: "rules 1H (Aries) & 8H (Scorpio)" },
  Mercury: { houses: [3, 6], description: "rules 3H (Gemini) & 6H (Virgo)" },
  Jupiter: { houses: [9, 12], description: "rules 9H (Sagittarius) & 12H (Pisces)" },
  Venus: { houses: [2, 7], description: "rules 2H (Taurus) & 7H (Libra)" },
  Saturn: { houses: [10, 11], description: "rules 10H (Capricorn) & 11H (Aquarius)" },
  Rahu: { houses: [], description: "transit node (directly activates axis)" },
  Ketu: { houses: [], description: "transit node (directly activates axis)" }
};

const HIT_GUIDE = [
  { point: "Natal Moon", symbol: "☽", color: SLATE_BLUE, effect: "Turbulent mental/emotional period; nodes on the mind." },
  { point: "Natal Sun", symbol: "☉", color: AMBER, effect: "Ego-restructuring; authority and identity reconsidered." },
  { point: "Natal Lagna", symbol: "Lg", color: GOLD_DEEP, effect: "Identity transformation; body and lifestyle shift." },
  { point: "Daśā-lord", symbol: "D", color: RED, effect: "Major event-trigger for the running promise." },
];

const WORKED_EXAMPLES = [
  { label: "4–10 axis", text: "Home↔career tension — e.g. relocation for work. Read both poles together." },
  { label: "Hit on the Moon", text: "Nodal axis on natal Moon → turbulent mental period; handle gently." },
  { label: "Daśā-lord trigger", text: "Axis crossing running daśā-lord → strong timing signature for that lord's matters." },
];

export function NodalAxisHouseReader() {
  const [activeAxisId, setActiveAxisId] = useState<string>("4-10");

  const [moonPlacement, setMoonPlacement] = useState<"none" | "rahu" | "ketu">("none");
  const [sunPlacement, setSunPlacement] = useState<"none" | "rahu" | "ketu">("none");
  const [lagnaPlacement, setLagnaPlacement] = useState<"none" | "rahu" | "ketu">("none");
  const [dashaPlacement, setDashaPlacement] = useState<"none" | "rahu" | "ketu">("none");

  const [runningDashaLord, setRunningDashaLord] = useState<string>("Saturn");

  const activeAxis = useMemo(() => AXIS_DETAILS.find(a => a.id === activeAxisId) || AXIS_DETAILS[3], [activeAxisId]);

  const dashaMatching = useMemo(() => {
    if (runningDashaLord === "Rahu" || runningDashaLord === "Ketu") return true;
    const ruled = PLANET_RULED_HOUSES[runningDashaLord]?.houses || [];
    return ruled.includes(activeAxis.rahuHouse) || ruled.includes(activeAxis.ketuHouse);
  }, [runningDashaLord, activeAxis]);

  const isMoonHit = moonPlacement !== "none";
  const isSunHit = sunPlacement !== "none";
  const isLagnaHit = lagnaPlacement !== "none";
  const isDashaHit = dashaPlacement !== "none";
  const anyHit = isMoonHit || isSunHit || isLagnaHit || isDashaHit;

  const leftOccupants = useMemo(() => {
    const list = [];
    if (moonPlacement === "rahu") list.push({ glyph: "☽", name: "Moon", color: SLATE_BLUE });
    if (sunPlacement === "rahu") list.push({ glyph: "☉", name: "Sun", color: AMBER });
    if (lagnaPlacement === "rahu") list.push({ glyph: "Lg", name: "Lagna", color: GOLD_DEEP });
    if (dashaPlacement === "rahu") list.push({ glyph: runningDashaLord[0], name: "Dasha", color: RED });
    return list;
  }, [moonPlacement, sunPlacement, lagnaPlacement, dashaPlacement, runningDashaLord]);

  const rightOccupants = useMemo(() => {
    const list = [];
    if (moonPlacement === "ketu") list.push({ glyph: "☽", name: "Moon", color: SLATE_BLUE });
    if (sunPlacement === "ketu") list.push({ glyph: "☉", name: "Sun", color: AMBER });
    if (lagnaPlacement === "ketu") list.push({ glyph: "Lg", name: "Lagna", color: GOLD_DEEP });
    if (dashaPlacement === "ketu") list.push({ glyph: runningDashaLord[0], name: "Dasha", color: RED });
    return list;
  }, [moonPlacement, sunPlacement, lagnaPlacement, dashaPlacement, runningDashaLord]);

  const scaleAngle = useMemo(() => {
    const rahuWeight = 2 + leftOccupants.length * 1.5;
    const ketuWeight = 0.5 + rightOccupants.length * 1.5;
    const diff = rahuWeight - ketuWeight;
    return Math.max(-25, Math.min(25, -5 - diff * 7));
  }, [leftOccupants, rightOccupants]);

  const scaleCoords = useMemo(() => {
    const cx = 120;
    const cy = 45;
    const d = 70;
    const rad = (scaleAngle * Math.PI) / 180;
    return {
      leftX: cx - d * Math.cos(rad),
      leftY: cy - d * Math.sin(rad),
      rightX: cx + d * Math.cos(rad),
      rightY: cy + d * Math.sin(rad)
    };
  }, [scaleAngle]);

  return (
    <div data-interactive="nodal-axis-house-reader" style={{ padding: "16px", borderRadius: "14px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", boxShadow: "0 8px 32px rgba(72, 48, 16, 0.05)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "10px" }}>

      {/* Header */}
      <div>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
          <IAST>Rāhu-Ketu</IAST> Axis on Natal Houses — Dragon Scale Model
        </h3>
        <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
          The nodal axis activates two opposite houses for ~18 months. Rāhu grasps in one; Ketu releases in the other. Always read both.
        </p>
      </div>

      {/* Axis selector */}
      <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", gap: "8px" }}>
        <span style={{ fontSize: "10px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase" }}>1. Select transit nodal axis</span>
        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
          {AXIS_DETAILS.map(axis => (
            <button key={axis.id} onClick={() => setActiveAxisId(axis.id)} style={{
              padding: "5px 8px", borderRadius: "5px", border: activeAxisId === axis.id ? `1.5px solid ${GOLD_DEEP}` : "1px solid rgba(156,122,47,0.15)",
              background: activeAxisId === axis.id ? "rgba(156,122,47,0.08)" : "#ffffff", fontWeight: activeAxisId === axis.id ? 800 : 600,
              fontSize: "10px", cursor: "pointer", color: activeAxisId === axis.id ? GOLD_DEEP : INK_SECONDARY, textAlign: "center"
            }}>
              <div>{axis.label}</div>
              <div style={{ fontSize: "8px", opacity: 0.8 }}>H{axis.rahuHouse}-H{axis.ketuHouse}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main two-column layout */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "stretch" }}>

        {/* Left — scale + educational panels */}
        <div style={{ flex: "1 1 280px", minWidth: "260px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {/* Scale card */}
          <div style={{ background: "#ffffff", padding: "12px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h4 style={{ margin: "0 0 10px 0", fontSize: "10px", fontWeight: 800, color: INK_MUTED, textTransform: "uppercase", display: "flex", alignItems: "center", gap: "4px" }}>
              <Scale size={13} color={GOLD} /> Dragon Scale Model (DSM)
            </h4>
            <div style={{ position: "relative", width: "240px", height: "150px" }}>
              <svg width="240" height="150" viewBox="0 0 240 150" style={{ overflow: "visible" }}>
                <line x1="120" y1="130" x2="120" y2="45" stroke={INK_SECONDARY} strokeWidth="3.5" />
                <line x1="85" y1="130" x2="155" y2="130" stroke={INK_SECONDARY} strokeWidth="4.5" strokeLinecap="round" />
                <circle cx="120" cy="45" r="4.5" fill={INK_SECONDARY} />
                <line x1={scaleCoords.leftX} y1={scaleCoords.leftY} x2={scaleCoords.rightX} y2={scaleCoords.rightY} stroke={GOLD_DEEP} strokeWidth="3" strokeLinecap="round" style={{ transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)" }} />
                <ScalePan side="left" x={scaleCoords.leftX} y={scaleCoords.leftY} node="rahu" house={activeAxis.rahuHouse} occupants={leftOccupants} />
                <ScalePan side="right" x={scaleCoords.rightX} y={scaleCoords.rightY} node="ketu" house={activeAxis.ketuHouse} occupants={rightOccupants} />
              </svg>
            </div>
          </div>

          {/* Reading the scale */}
          <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <div style={{ fontSize: "9px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase", marginBottom: "6px" }}>Reading the scale</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <div style={{ display: "flex", gap: "6px", fontSize: "10px" }}>
                <span style={{ fontWeight: 900, color: PURPLE, minWidth: "60px" }}>☊ Rāhu</span>
                <span style={{ color: INK_SECONDARY }}>Heavy side — grasping, obsession, amplification in H{activeAxis.rahuHouse}.</span>
              </div>
              <div style={{ display: "flex", gap: "6px", fontSize: "10px" }}>
                <span style={{ fontWeight: 900, color: AMBER, minWidth: "60px" }}>☋ Ketu</span>
                <span style={{ color: INK_SECONDARY }}>Light side — release, detachment, depletion in H{activeAxis.ketuHouse}.</span>
              </div>
              <div style={{ display: "flex", gap: "6px", fontSize: "10px" }}>
                <span style={{ fontWeight: 900, color: INK_PRIMARY, minWidth: "60px" }}>Hits</span>
                <span style={{ color: INK_SECONDARY }}>Adding Moon/Sun/Lagna/daśā-lord tips the scale and intensifies the axis.</span>
              </div>
            </div>
          </div>

          {/* Sensitive-point guide */}
          <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <div style={{ fontSize: "9px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase", marginBottom: "6px" }}>Sensitive-point hits</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {HIT_GUIDE.map(h => (
                <div key={h.point} style={{ display: "flex", gap: "6px", alignItems: "flex-start", fontSize: "10px" }}>
                  <span style={{ fontSize: "11px", color: h.color, flexShrink: 0 }}>{h.symbol}</span>
                  <span style={{ fontWeight: 800, color: INK_PRIMARY, minWidth: "75px" }}>{h.point}</span>
                  <span style={{ color: INK_SECONDARY }}>{h.effect}</span>
                </div>
              ))}
            </div>
          </div>

          {/* All six axes */}
          <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <div style={{ fontSize: "9px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase", marginBottom: "6px" }}>Six house-pair axes</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              {AXIS_DETAILS.map(axis => (
                <button
                  key={axis.id}
                  type="button"
                  onClick={() => setActiveAxisId(axis.id)}
                  style={{
                    textAlign: "left",
                    padding: "4px 6px",
                    borderRadius: "4px",
                    border: "none",
                    background: activeAxisId === axis.id ? `${GOLD}12` : "rgba(156,122,47,0.04)",
                    cursor: "pointer",
                    fontSize: "9.5px",
                    color: activeAxisId === axis.id ? GOLD_DEEP : INK_SECONDARY,
                    fontWeight: activeAxisId === axis.id ? 800 : 600,
                  }}
                >
                  <strong>H{axis.rahuHouse}–H{axis.ketuHouse}</strong> — {axis.title.replace(" Polarity", "")}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right — placement controls + synthesis */}
        <div style={{ flex: "1 1 300px", minWidth: "280px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {/* Placement controls */}
          <div style={{ background: "#ffffff", padding: "12px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontSize: "10px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase" }}>2. Place sensitive conjunctions</span>
            <PlacementRow label="Natal Moon" symbol="☽" color={SLATE_BLUE} value={moonPlacement} onChange={setMoonPlacement} axis={activeAxis} />
            <PlacementRow label="Natal Sun" symbol="☉" color={AMBER} value={sunPlacement} onChange={setSunPlacement} axis={activeAxis} />
            <PlacementRow label="Natal Lagna" symbol="Lg" color={GOLD_DEEP} value={lagnaPlacement} onChange={setLagnaPlacement} axis={activeAxis} />
            <PlacementRow label={`Daśā-lord (${runningDashaLord})`} symbol="D" color={RED} value={dashaPlacement} onChange={setDashaPlacement} axis={activeAxis} note={PLANET_RULED_HOUSES[runningDashaLord]?.description} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed rgba(156,122,47,0.15)", paddingTop: "6px" }}>
              <span style={{ fontSize: "10px", color: INK_SECONDARY }}>Running Daśā-lord</span>
              <select value={runningDashaLord} onChange={e => setRunningDashaLord(e.target.value)} style={{ padding: "4px 6px", fontSize: "10.5px", borderRadius: "4px", border: "1px solid rgba(156,122,47,0.25)", background: "#ffffff", fontWeight: 700, color: INK_PRIMARY }}>
                {Object.keys(PLANET_RULED_HOUSES).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* Synthesis */}
          <div style={{ background: "rgba(156,122,47,0.03)", border: "1.2px solid rgba(156,122,47,0.15)", borderRadius: "10px", padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <h4 style={{ margin: 0, fontSize: "13px", fontWeight: 800, color: GOLD_DEEP }}>{activeAxis.title}</h4>
            <p style={{ margin: 0, fontSize: "11px", lineHeight: "1.45", color: INK_SECONDARY }}>{activeAxis.synthesis}</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", borderTop: "1px solid rgba(156,122,47,0.1)", paddingTop: "10px" }}>
              <div>
                <strong style={{ fontSize: "9px", color: PURPLE, textTransform: "uppercase" }}>☊ Rāhu (H{activeAxis.rahuHouse})</strong>
                <p style={{ margin: "3px 0 0 0", fontSize: "10px", lineHeight: "1.4", color: INK_SECONDARY }}>{activeAxis.rahuFocus}</p>
              </div>
              <div>
                <strong style={{ fontSize: "9px", color: AMBER, textTransform: "uppercase" }}>☋ Ketu (H{activeAxis.ketuHouse})</strong>
                <p style={{ margin: "3px 0 0 0", fontSize: "10px", lineHeight: "1.4", color: INK_SECONDARY }}>{activeAxis.ketuFocus}</p>
              </div>
            </div>

            {anyHit && (
              <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginTop: "4px", borderTop: "1px solid rgba(156,122,47,0.1)", paddingTop: "10px" }}>
                <strong style={{ fontSize: "10px", color: INK_PRIMARY }}>Active conjunction impacts</strong>
                {isMoonHit && <HitBox type="Moon" node={moonPlacement} house={moonPlacement === "rahu" ? activeAxis.rahuHouse : activeAxis.ketuHouse} text={moonPlacement === "rahu" ? "Intense, obsessive emotional desire." : "Emotional detachment and letting go."} color={SLATE_BLUE} />}
                {isSunHit && <HitBox type="Sun" node={sunPlacement} house={sunPlacement === "rahu" ? activeAxis.rahuHouse : activeAxis.ketuHouse} text={sunPlacement === "rahu" ? "Ego amplification and driven focus." : "Ego dissolution and restructuring."} color={AMBER} />}
                {isLagnaHit && <HitBox type="Lagna" node={lagnaPlacement} house={lagnaPlacement === "rahu" ? activeAxis.rahuHouse : activeAxis.ketuHouse} text={lagnaPlacement === "rahu" ? "Physical and identity transformation." : "Inward identity shift and surrender."} color={GOLD_DEEP} />}
                {isDashaHit && <HitBox type={`Daśā-lord (${runningDashaLord})`} node={dashaPlacement} house={dashaPlacement === "rahu" ? activeAxis.rahuHouse : activeAxis.ketuHouse} text={dashaPlacement === "rahu" ? "Concrete event timing activated." : "Concrete release event activated."} color={RED} />}
              </div>
            )}

            <div style={{ marginTop: "4px" }}>
              {dashaMatching ? (
                <div style={{ background: `${GREEN}08`, border: `1px solid ${GREEN}50`, padding: "8px", borderRadius: "6px", display: "flex", gap: "6px", color: GREEN, fontSize: "10px" }}>
                  <CheckCircle2 size={14} color={GREEN} />
                  <span><strong>Two-Yes Timing Active:</strong> Transit axis + running Vimśottari Daśā support the same theme. High event probability.</span>
                </div>
              ) : (
                <div style={{ background: "rgba(156,122,47,0.04)", border: "1px solid rgba(156,122,47,0.12)", padding: "8px", borderRadius: "6px", display: "flex", gap: "6px", color: INK_SECONDARY, fontSize: "10px" }}>
                  <Clock size={14} color={INK_MUTED} />
                  <span><strong>Background Shift:</strong> Psychological-level transit. Concrete changes delayed — Daśā lord does not trigger this house-pair.</span>
                </div>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "9px", color: INK_MUTED, fontStyle: "italic" }}>
              <Info size={11} color={INK_MUTED} />
              Always read both houses of the axis. Confirm with daśā before predicting events. Themes are tendencies, not verdicts.
            </div>
          </div>

          {/* Worked examples */}
          <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <div style={{ fontSize: "9px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase", marginBottom: "5px" }}>Worked examples</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {WORKED_EXAMPLES.map(ex => (
                <div key={ex.label} style={{ display: "flex", gap: "6px", fontSize: "10px", padding: "4px 6px", borderRadius: "4px", background: "rgba(156,122,47,0.04)" }}>
                  <span style={{ fontWeight: 900, color: GOLD_DEEP, minWidth: "100px" }}>{ex.label}</span>
                  <span style={{ color: INK_SECONDARY }}>{ex.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Source footer */}
          <div style={{ background: SURFACE_MANUSCRIPT, border: "1px solid rgba(156,122,47,0.12)", borderRadius: "8px", padding: "8px", fontSize: "9px", color: INK_MUTED, lineHeight: "1.4" }}>
            <strong>Source:</strong> Classical gochara (nodal transits). <IAST>Bṛhat Pārāśara Horā Śāstra</IAST> — the nodes activate opposite bhāvas simultaneously. Special force on natal Moon (mind), Sun (ego), Lagna (body), and daśā-lord (timing trigger).
          </div>
        </div>
      </div>
    </div>
  );
}

function ScalePan({ side, x, y, node, house, occupants }: {
  side: "left" | "right";
  x: number;
  y: number;
  node: "rahu" | "ketu";
  house: number;
  occupants: { glyph: string; name: string; color: string }[];
}) {
  const color = node === "rahu" ? PURPLE : AMBER;
  return (
    <g style={{ transition: "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)" }}>
      <line x1={x} y1={y} x2={x - 16} y2={y + 28} stroke={color} strokeWidth="1" opacity="0.6" />
      <line x1={x} y1={y} x2={x + 16} y2={y + 28} stroke={color} strokeWidth="1" opacity="0.6" />
      <path d={`M ${x - 20} ${y + 28} Q ${x} ${y + 38} ${x + 20} ${y + 28} Z`} fill={`${color}14`} stroke={color} strokeWidth="1.5" />
      <circle cx={x} cy={y + 36} r="7" fill={color} stroke="#ffffff" strokeWidth="1" />
      <text x={x} y={y + 36.5} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "8px", fill: "#ffffff", fontWeight: 900 }}>{node === "rahu" ? "☊" : "☋"}</text>
      <text x={x} y={y + 49} textAnchor="middle" style={{ fontSize: "8.5px", fill: color, fontWeight: 800 }}>{node === "rahu" ? "Rāhu" : "Ketu"} (H{house})</text>
      {occupants.map((occ, idx) => {
        const total = occupants.length;
        const spacing = 11;
        const startX = x - ((total - 1) * spacing) / 2;
        const occX = startX + idx * spacing;
        const occY = y + 18;
        return (
          <g key={occ.name}>
            <circle cx={occX} cy={occY} r="5.5" fill={occ.color} stroke="#ffffff" strokeWidth="0.75" />
            <text x={occX} y={occY} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "7px", fill: "#ffffff", fontWeight: 900, fontFamily: "Arial, sans-serif" }}>{occ.glyph}</text>
          </g>
        );
      })}
    </g>
  );
}

function PlacementRow({ label, symbol, color, value, onChange, axis, note }: {
  label: string;
  symbol: string;
  color: string;
  value: "none" | "rahu" | "ketu";
  onChange: (v: "none" | "rahu" | "ketu") => void;
  axis: HouseAxisDetail;
  note?: string;
}) {
  const options = [
    { value: "none", label: "None" },
    { value: "rahu", label: `H${axis.rahuHouse} (Rāhu)` },
    { value: "ketu", label: `H${axis.ketuHouse} (Ketu)` },
  ];
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: "11px", fontWeight: 600, display: "flex", flexDirection: "column" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span style={{ color, fontWeight: 900 }}>{symbol}</span> {label}:
        </span>
        {note && <span style={{ fontSize: "8.5px", color: INK_MUTED, marginLeft: "12px" }}>{note}</span>}
      </span>
      <div style={{ display: "flex", gap: "2px" }}>
        {options.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value as "none" | "rahu" | "ketu")}
            style={{
              padding: "4px 6px",
              fontSize: "9.5px",
              fontWeight: 700,
              borderRadius: "4px",
              border: value === opt.value ? `1.5px solid ${GOLD}` : "1px solid rgba(156,122,47,0.15)",
              background: value === opt.value ? "rgba(156,122,47,0.08)" : "#ffffff",
              color: value === opt.value ? GOLD_DEEP : INK_SECONDARY,
              cursor: "pointer"
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function HitBox({ type, node, house, text, color }: {
  type: string;
  node: "rahu" | "ketu";
  house: number;
  text: string;
  color: string;
}) {
  return (
    <div style={{ background: `${color}08`, borderLeft: `3px solid ${color}`, padding: "5px 7px", borderRadius: "4px", fontSize: "10px", color: INK_SECONDARY, lineHeight: "1.35" }}>
      <strong style={{ color }}>{type} conjunct {node === "rahu" ? "Rāhu" : "Ketu"} (H{house})</strong> — {text}
    </div>
  );
}
