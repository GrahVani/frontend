"use client";

import React, { useState, useMemo } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  Compass,
  CheckCircle2,
  ChevronRight,
  Circle,
  Layers,
  ListChecks,
  Scale,
  Sparkles,
  Sun,
  Star,
  ArrowRight,
  XCircle,
  FileText,
  Target,
  Eye,
  Zap,
  Shield,
  Award,
  Heart,
  Plane,
  Scissors,
  GraduationCap,
  Briefcase,
  Home,
  Users,
  HelpCircle,
  BarChart3,
  Grid3X3,
  Moon,
  Clock,
  RotateCcw,
} from "lucide-react";
import { Devanagari, IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import { fontFamilies } from "@/design-tokens/grahvani-learning";
import { NAKSHATRAS } from '@/components/learning-runtime/interactive/nakshatra-data';
import {
  TARA_DB,
  RASHI_DB,
  EVENT_TYPES,
  SCENARIOS,
  ISSUE_LABELS,
  getTaraPosition,
  getTaraDetail,
  evaluateCandraBala,
  evaluateHouseBala,
  isUpachaya,
  type EventTypeKey,
  type IssueKey,
  type ScenarioVerdict,
  type TaraDetail,
  type RashiData,
} from "./data";

/* ── Design Tokens ──────────────────────────────────────── */
const INK_PRIMARY = "#2B2017";
const INK_SECONDARY = "#4F3B2B";
const INK_MUTED = "#6F5843";
const HAIRLINE = "rgba(156, 116, 48, 0.5)";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const GOLD = "#B88421";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const VERMILION = "#A23A1E";
const TEAL = "#2E7D7B";

function wash(color: string, alphaHex = "12") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232,199,114,0.12)";
}

/* ── Event-type Icons ─────────────────────────────────────── */
function getEventIcon(key: EventTypeKey, size = 18) {
  switch (key) {
    case "wedding":         return <Heart size={size} />;
    case "griha-pravesha":   return <Home size={size} />;
    case "business-launch":  return <Briefcase size={size} />;
    case "travel":           return <Plane size={size} />;
    case "education":        return <GraduationCap size={size} />;
    case "surgery":          return <Scissors size={size} />;
    default:                return <Circle size={size} />;
  }
}

/* ── Shared Styles ────────────────────────────────────────── */
const cardBase: CSSProperties = {
  background: SURFACE,
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 12,
  padding: 20,
};
const labelSm: CSSProperties = {
  fontFamily: fontFamilies.literarySerif,
  fontSize: 13,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  color: INK_SECONDARY,
  fontWeight: 700,
};
const headingMd: CSSProperties = {
  fontFamily: fontFamilies.literarySerif,
  fontSize: 18,
  fontWeight: 600,
  color: INK_PRIMARY,
};
const bodySm: CSSProperties = {
  fontFamily: fontFamilies.literarySerif,
  fontSize: 16,
  lineHeight: 1.55,
  color: INK_SECONDARY,
};

/* ════════════════════════════════════════════════════════════
   TAB 1 — Tārā-Bala Wheel & Selector
   ════════════════════════════════════════════════════════════ */

function Tab1TaraBala() {
  const [birthNak1, setBirthNak1] = useState(4); // Rohiṇī default
  const [birthNak2, setBirthNak2] = useState(5); // Mṛgaśīrṣā default
  const [muhurtaNak, setMuhurtaNak] = useState(27); // Revatī default
  const [isMultiActor, setIsMultiActor] = useState(false);
  const [mitigationsChecked, setMitigationsChecked] = useState<Record<string, boolean>>({});

  const tPos1 = useMemo(() => getTaraPosition(birthNak1, muhurtaNak), [birthNak1, muhurtaNak]);
  const tPos2 = useMemo(() => getTaraPosition(birthNak2, muhurtaNak), [birthNak2, muhurtaNak]);

  const tDetail1 = useMemo(() => getTaraDetail(tPos1), [tPos1]);
  const tDetail2 = useMemo(() => getTaraDetail(tPos2), [tPos2]);

  const nak1Obj = NAKSHATRAS.find(n => n.num === birthNak1);
  const nak2Obj = NAKSHATRAS.find(n => n.num === birthNak2);
  const mNakObj = NAKSHATRAS.find(n => n.num === muhurtaNak);

  // SVG parameters
  const cx = 150, cy = 150, R = 130, r = 60;

  const handleMitigationChange = (key: string, val: boolean) => {
    setMitigationsChecked(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
      {/* Visual Tārā Wheel */}
      <div style={{ ...cardBase, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <p style={labelSm}>9-Fold Tārā-Bala Mandala</p>
        
        <svg viewBox="0 0 300 300" width="100%" style={{ maxWidth: 280, marginTop: 12 }}>
          {Object.values(TARA_DB).map((t, idx) => {
            const angleStep = 360 / 9;
            const startAngle = (idx * angleStep - 90) * Math.PI / 180;
            const endAngle = ((idx + 1) * angleStep - 90) * Math.PI / 180;
            const midAngle = ((idx + 0.5) * angleStep - 90) * Math.PI / 180;

            const x1o = cx + R * Math.cos(startAngle);
            const y1o = cy + R * Math.sin(startAngle);
            const x2o = cx + R * Math.cos(endAngle);
            const y2o = cy + R * Math.sin(endAngle);
            const x1i = cx + r * Math.cos(startAngle);
            const y1i = cy + r * Math.sin(startAngle);
            const x2i = cx + r * Math.cos(endAngle);
            const y2i = cy + r * Math.sin(endAngle);

            const isSelected = tPos1 === t.position || (isMultiActor && tPos2 === t.position);
            
            const d = [
              `M ${x1i} ${y1i}`,
              `L ${x1o} ${y1o}`,
              `A ${R} ${R} 0 0 1 ${x2o} ${y2o}`,
              `L ${x2i} ${y2i}`,
              `A ${r} ${r} 0 0 0 ${x1i} ${y1i}`,
            ].join(" ");

            const labelR = (R + r) / 2;
            const lx = cx + labelR * Math.cos(midAngle);
            const ly = cy + labelR * Math.sin(midAngle);

            return (
              <g key={t.position}>
                <path
                  d={d}
                  fill={isSelected ? wash(t.color, "42") : wash(t.color, "18")}
                  stroke={isSelected ? t.color : `${t.color}B8`}
                  strokeWidth={isSelected ? 3 : 1.45}
                  style={{ transition: "all 0.25s ease" }}
                />
                <text
                  x={lx} y={ly - 6}
                  textAnchor="middle" dominantBaseline="central"
                  fill={isSelected ? t.color : INK_PRIMARY}
                  style={{ fontSize: 13.5, fontFamily: fontFamilies.literarySerif, fontWeight: isSelected ? 800 : 700 }}
                >
                  {t.name}
                </text>
                <text
                  x={lx} y={ly + 7}
                  textAnchor="middle" dominantBaseline="central"
                  fill={isSelected ? t.color : INK_PRIMARY}
                  style={{ fontSize: 11, fontFamily: fontFamilies.display, fontWeight: 600 }}
                >
                  {t.nameDevanagari}
                </text>
                {isSelected && (
                  <circle cx={lx} cy={ly - 16} r={3.5} fill={t.color} />
                )}
              </g>
            );
          })}
          {/* Center Info Panel */}
          <circle cx={cx} cy={cy} r={r - 4} fill={SURFACE} stroke="rgba(156, 116, 48, 0.72)" strokeWidth={1.8} />
          <text x={cx} y={cy - 16} textAnchor="middle" fill={GOLD}
            style={{ fontSize: 12, fontFamily: fontFamilies.literarySerif, letterSpacing: "0.05em", fontWeight: 800 }}>
            MUHŪRTA NAK.
          </text>
          <text x={cx} y={cy + 4} textAnchor="middle" fill={INK_PRIMARY}
            style={{ fontSize: 17, fontFamily: fontFamilies.literarySerif, fontWeight: 800 }}>
            {mNakObj?.name}
          </text>
          <text x={cx} y={cy + 20} textAnchor="middle" fill={INK_SECONDARY}
            style={{ fontSize: 12, fontFamily: fontFamilies.literarySerif, fontStyle: "italic", fontWeight: 600 }}>
            Lord: {mNakObj?.ruler}
          </text>
        </svg>

        {/* Legend */}
        <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <span style={{ ...labelSm, display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: GREEN, display: "inline-block" }} />
            Favourable
          </span>
          <span style={{ ...labelSm, display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: VERMILION, display: "inline-block" }} />
            Challenging
          </span>
          <span style={{ ...labelSm, display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: GOLD, display: "inline-block" }} />
            Janma (Mixed)
          </span>
        </div>
      </div>

      {/* Control Panel and Results */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Selector Panel */}
        <div style={cardBase}>
          <p style={{ ...labelSm, marginBottom: 10 }}>Tārā-Bala Parameter Selector</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Muhurta Nakshatra */}
            <div>
              <label style={{ ...labelSm, fontSize: 12 }}>Transiting Muhūrta Nakṣatra (Moon Position)</label>
              <select value={muhurtaNak} onChange={e => setMuhurtaNak(Number(e.target.value))}
                style={{
                  width: "100%", marginTop: 4, padding: "8px 10px", borderRadius: 8,
                  border: `1.25px solid ${HAIRLINE}`, background: SURFACE,
                  fontFamily: fontFamilies.literarySerif, fontSize: 15, color: INK_PRIMARY,
                }}>
                {NAKSHATRAS.map(n => (
                  <option key={n.num} value={n.num}>{n.num}. {n.name} ({n.ruler})</option>
                ))}
              </select>
            </div>

            {/* Actor 1 */}
            <div>
              <label style={{ ...labelSm, fontSize: 12 }}>{isMultiActor ? "Bride (Actor 1) Birth Nakṣatra" : "Actor Birth Nakṣatra"}</label>
              <select value={birthNak1} onChange={e => setBirthNak1(Number(e.target.value))}
                style={{
                  width: "100%", marginTop: 4, padding: "8px 10px", borderRadius: 8,
                  border: `1.25px solid ${HAIRLINE}`, background: SURFACE,
                  fontFamily: fontFamilies.literarySerif, fontSize: 15, color: INK_PRIMARY,
                }}>
                {NAKSHATRAS.map(n => (
                  <option key={n.num} value={n.num}>{n.num}. {n.name} ({n.ruler})</option>
                ))}
              </select>
            </div>

            {/* Actor 2 */}
            {isMultiActor && (
              <div>
                <label style={{ ...labelSm, fontSize: 12 }}>Groom (Actor 2) Birth Nakṣatra</label>
                <select value={birthNak2} onChange={e => setBirthNak2(Number(e.target.value))}
                  style={{
                    width: "100%", marginTop: 4, padding: "8px 10px", borderRadius: 8,
                    border: `1.25px solid ${HAIRLINE}`, background: SURFACE,
                    fontFamily: fontFamilies.literarySerif, fontSize: 15, color: INK_PRIMARY,
                  }}>
                  {NAKSHATRAS.map(n => (
                    <option key={n.num} value={n.num}>{n.num}. {n.name} ({n.ruler})</option>
                  ))}
                </select>
              </div>
            )}

            {/* Toggle */}
            <label style={{ ...labelSm, display: "flex", alignItems: "center", gap: 6, cursor: "pointer", marginTop: 4 }}>
              <input type="checkbox" checked={isMultiActor} onChange={() => setIsMultiActor(!isMultiActor)} />
              Multi-Actor Event (Wedding Vivāha)
            </label>
          </div>
        </div>

        {/* Results Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Actor 1 Result */}
          <div style={{
            ...cardBase,
            borderLeft: `4px solid ${tDetail1.color}`,
            background: wash(tDetail1.color, "10"),
          }}>
            <p style={{ ...labelSm, color: tDetail1.color }}>
              {isMultiActor ? "Bride (Actor 1) Verdict" : "Actor Verdict"}
            </p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
              <h4 style={{ ...headingMd, color: tDetail1.color, fontSize: 20, fontWeight: 700 }}>{tPos1} mod 9 = {tDetail1.name} Tārā</h4>
              <span style={{
                ...labelSm, padding: "2px 8px", borderRadius: 10,
                background: wash(tDetail1.color, "15"), color: tDetail1.color, fontWeight: 700,
              }}>
                {tDetail1.quality.toUpperCase()}
              </span>
            </div>
            <p style={{ ...bodySm, fontSize: 15, marginTop: 6 }}>{tDetail1.description}</p>
            
            {tDetail1.quality === "challenging" && (
              <div style={{ marginTop: 10, padding: 10, borderRadius: 8, background: SURFACE_2 }}>
                <p style={{ ...labelSm, fontSize: 10, color: VERMILION }}>⚠️ Required Mitigation:</p>
                <p style={{ ...bodySm, fontSize: 12, color: INK_SECONDARY, fontStyle: "italic", marginTop: 2 }}>
                  {tDetail1.mitigation}
                </p>
                <label style={{ ...labelSm, display: "flex", alignItems: "center", gap: 6, cursor: "pointer", marginTop: 6, textTransform: "none", color: INK_PRIMARY }}>
                  <input
                    type="checkbox"
                    checked={!!mitigationsChecked[`actor1-${tPos1}`]}
                    onChange={e => handleMitigationChange(`actor1-${tPos1}`, e.target.checked)}
                  />
                  Mark mitigation performed (Saṅkalpa / Dāna)
                </label>
              </div>
            )}
          </div>

          {/* Actor 2 Result */}
          {isMultiActor && (
            <div style={{
              ...cardBase,
              borderLeft: `4px solid ${tDetail2.color}`,
              background: wash(tDetail2.color, "10"),
            }}>
              <p style={{ ...labelSm, color: tDetail2.color }}>Groom (Actor 2) Verdict</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                <h4 style={{ ...headingMd, color: tDetail2.color, fontSize: 20, fontWeight: 700 }}>{tPos2} mod 9 = {tDetail2.name} Tārā</h4>
                <span style={{
                  ...labelSm, padding: "2px 8px", borderRadius: 10,
                  background: wash(tDetail2.color, "15"), color: tDetail2.color, fontWeight: 700,
                }}>
                  {tDetail2.quality.toUpperCase()}
                </span>
              </div>
              <p style={{ ...bodySm, fontSize: 15, marginTop: 6 }}>{tDetail2.description}</p>

              {tDetail2.quality === "challenging" && (
                <div style={{ marginTop: 10, padding: 10, borderRadius: 8, background: SURFACE_2 }}>
                  <p style={{ ...labelSm, fontSize: 10, color: VERMILION }}>⚠️ Required Mitigation:</p>
                  <p style={{ ...bodySm, fontSize: 12, color: INK_SECONDARY, fontStyle: "italic", marginTop: 2 }}>
                    {tDetail2.mitigation}
                  </p>
                  <label style={{ ...labelSm, display: "flex", alignItems: "center", gap: 6, cursor: "pointer", marginTop: 6, textTransform: "none", color: INK_PRIMARY }}>
                    <input
                      type="checkbox"
                      checked={!!mitigationsChecked[`actor2-${tPos2}`]}
                      onChange={e => handleMitigationChange(`actor2-${tPos2}`, e.target.checked)}
                    />
                    Mark mitigation performed (Saṅkalpa / Dāna)
                  </label>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   TAB 2 — Candra-Bala & Event House strength
   ════════════════════════════════════════════════════════════ */

function Tab2CandraHouse() {
  const [lagnaSign, setLagnaSign] = useState(10); // Capricorn default
  const [moonSign, setMoonSign] = useState(12); // Pisces default
  const [natalMoon1, setNatalMoon1] = useState(4); // Taurus (Rohiṇī rāśi)
  const [natalMoon2, setNatalMoon2] = useState(3); // Gemini (Mṛgaśīrṣā rāśi)
  const [isWedding, setIsWedding] = useState(true);
  const [eventType, setEventType] = useState<EventTypeKey>("wedding");
  const [maleficsMoon, setMaleficsMoon] = useState(false);

  // House-Bala controllers
  const [maleficHouses, setMaleficHouses] = useState<number[]>([7]); // Mars default in 7th
  const [beneficHouses, setBeneficHouses] = useState<number[]>([2]); // Saturn own-sign in 2nd etc.
  const [combustLords, setCombustLords] = useState<number[]>([]); // combust signs list

  const candraBala = useMemo(() => {
    return evaluateCandraBala(
      lagnaSign,
      moonSign,
      natalMoon1,
      isWedding ? natalMoon2 : null,
      maleficsMoon
    );
  }, [lagnaSign, moonSign, natalMoon1, natalMoon2, isWedding, maleficsMoon]);

  const activeEventType = useMemo(() => {
    return isWedding ? "wedding" : eventType;
  }, [isWedding, eventType]);

  const houseBala = useMemo(() => {
    return evaluateHouseBala(
      activeEventType,
      lagnaSign,
      maleficHouses,
      beneficHouses,
      combustLords
    );
  }, [activeEventType, lagnaSign, maleficHouses, beneficHouses, combustLords]);

  const toggleMalefic = (h: number) => {
    setMaleficHouses(prev => prev.includes(h) ? prev.filter(x => x !== h) : [...prev, h]);
  };
  const toggleBenefic = (h: number) => {
    setBeneficHouses(prev => prev.includes(h) ? prev.filter(x => x !== h) : [...prev, h]);
  };
  const toggleCombustLord = (sign: number) => {
    setCombustLords(prev => prev.includes(sign) ? prev.filter(x => x !== sign) : [...prev, sign]);
  };

  const getRashiName = (num: number) => RASHI_DB.find(r => r.number === num)?.name || "";
  const getRashiRuler = (num: number) => RASHI_DB.find(r => r.number === num)?.ruler || "";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Parameters */}
      <div style={{ ...cardBase, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {/* Lagna & Moon */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div>
            <label style={labelSm}>Muhūrta Lagna Sign</label>
            <select value={lagnaSign} onChange={e => setLagnaSign(Number(e.target.value))}
              style={{
                width: "100%", marginTop: 4, padding: "8px 10px", borderRadius: 8,
                border: `1.25px solid ${HAIRLINE}`, background: SURFACE,
                fontFamily: fontFamilies.literarySerif, fontSize: 15, color: INK_PRIMARY,
              }}>
              {RASHI_DB.map(r => <option key={r.number} value={r.number}>{r.number}. {r.name} ({r.english})</option>)}
            </select>
          </div>
          <div>
            <label style={labelSm}>Muhūrta Moon Sign</label>
            <select value={moonSign} onChange={e => setMoonSign(Number(e.target.value))}
              style={{
                width: "100%", marginTop: 4, padding: "8px 10px", borderRadius: 8,
                border: `1.25px solid ${HAIRLINE}`, background: SURFACE,
                fontFamily: fontFamilies.literarySerif, fontSize: 15, color: INK_PRIMARY,
              }}>
              {RASHI_DB.map(r => <option key={r.number} value={r.number}>{r.number}. {r.name}</option>)}
            </select>
          </div>
        </div>

        {/* Natal Moons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div>
            <label style={labelSm}>{isWedding ? "Bride Natal Moon" : "Actor Natal Moon"}</label>
            <select value={natalMoon1} onChange={e => setNatalMoon1(Number(e.target.value))}
              style={{
                width: "100%", marginTop: 4, padding: "8px 10px", borderRadius: 8,
                border: `1.25px solid ${HAIRLINE}`, background: SURFACE,
                fontFamily: fontFamilies.literarySerif, fontSize: 15, color: INK_PRIMARY,
              }}>
              {RASHI_DB.map(r => <option key={r.number} value={r.number}>{r.name}</option>)}
            </select>
          </div>
          {isWedding && (
            <div>
              <label style={labelSm}>Groom Natal Moon</label>
              <select value={natalMoon2} onChange={e => setNatalMoon2(Number(e.target.value))}
                style={{
                  width: "100%", marginTop: 4, padding: "8px 10px", borderRadius: 8,
                  border: `1.25px solid ${HAIRLINE}`, background: SURFACE,
                  fontFamily: fontFamilies.literarySerif, fontSize: 15, color: INK_PRIMARY,
                }}>
                {RASHI_DB.map(r => <option key={r.number} value={r.number}>{r.name}</option>)}
              </select>
            </div>
          )}
        </div>

        {/* Event Type & Flags */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div>
            <label style={labelSm}>Event Type Context</label>
            <select
              value={isWedding ? "wedding" : eventType}
              onChange={e => {
                const val = e.target.value;
                if (val === "wedding") {
                  setIsWedding(true);
                } else {
                  setIsWedding(false);
                  setEventType(val as EventTypeKey);
                }
              }}
              style={{
                width: "100%", marginTop: 4, padding: "8px 10px", borderRadius: 8,
                border: `1.25px solid ${HAIRLINE}`, background: SURFACE,
                fontFamily: fontFamilies.literarySerif, fontSize: 15, color: INK_PRIMARY,
              }}
            >
              <option value="wedding">Wedding (Multi-Actor)</option>
              <option value="business-launch">Business Launch</option>
              <option value="griha-pravesha">Home Entry (Gṛha-Praveśa)</option>
              <option value="education">Education Ceremony</option>
              <option value="travel">Travel (Yātrā)</option>
              <option value="surgery">Surgery</option>
            </select>
          </div>
          <label style={{ ...labelSm, display: "flex", alignItems: "center", gap: 6, cursor: "pointer", marginTop: 8 }}>
            <input type="checkbox" checked={maleficsMoon} onChange={() => setMaleficsMoon(!maleficsMoon)} />
            Malefics aspecting Muhūrta Moon
          </label>
        </div>
      </div>

      {/* Grid Layout: Candra-Bala & House-Bala side-by-side */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 20, alignItems: "start" }}>
        
        {/* Candra-Bala Diagnostics */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ ...cardBase, borderTop: `4px solid ${BLUE}` }}>
            <h4 style={{ ...headingMd, display: "flex", alignItems: "center", gap: 8 }}>
              <Moon size={20} color={BLUE} /> Candra-Bala Analysis (Pillar 2)
            </h4>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
              {/* Placement */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={bodySm}>Moon House from Lagna:</span>
                <span style={{
                  ...labelSm, padding: "2px 8px", borderRadius: 10,
                  background: wash(candraBala.isPlacementFav ? GREEN : VERMILION, "15"),
                  color: candraBala.isPlacementFav ? GREEN : VERMILION, fontWeight: 700
                }}>
                  House {candraBala.moonHouseFromLagna} ({candraBala.isPlacementFav ? "Favourable" : "Less-Fav"})
                </span>
              </div>
              
              {/* Aspect */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={bodySm}>Aspect Environment:</span>
                <span style={{
                  ...labelSm, padding: "2px 8px", borderRadius: 10,
                  background: wash(candraBala.isAspectFav ? GREEN : VERMILION, "15"),
                  color: candraBala.isAspectFav ? GREEN : VERMILION, fontWeight: 700
                }}>
                  {candraBala.isAspectFav ? "Clean / Benefic" : "Malefic Affliction"}
                </span>
              </div>

              {/* Natal Moon 1 */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={bodySm}>{isWedding ? "Bride Moon-from-Natal-Moon:" : "Actor Moon-from-Natal-Moon:"}</span>
                <span style={{
                  ...labelSm, padding: "2px 8px", borderRadius: 10,
                  background: wash(candraBala.isNatal1Fav ? GREEN : VERMILION, "15"),
                  color: candraBala.isNatal1Fav ? GREEN : VERMILION, fontWeight: 700
                }}>
                  {candraBala.natal1Diff}th House ({candraBala.isNatal1Fav ? "Favourable" : "Trika Challenge"})
                </span>
              </div>

              {/* Natal Moon 2 (Wedding) */}
              {isWedding && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={bodySm}>Groom Moon-from-Natal-Moon:</span>
                  <span style={{
                    ...labelSm, padding: "2px 8px", borderRadius: 10,
                    background: wash(candraBala.isNatal2Fav ? GREEN : VERMILION, "15"),
                    color: candraBala.isNatal2Fav ? GREEN : VERMILION, fontWeight: 700
                  }}>
                    {candraBala.natal2Diff}th House ({candraBala.isNatal2Fav ? "Favourable" : "Trika Challenge"})
                  </span>
                </div>
              )}
            </div>

            {/* Verdict */}
            <div style={{
              marginTop: 14, padding: "10px 14px", borderRadius: 8,
              background: wash(candraBala.verdict === "strong" ? GREEN : candraBala.verdict === "moderate" ? GOLD : VERMILION, "12"),
              textAlign: "center" as const
            }}>
              <p style={{ ...labelSm, color: candraBala.verdict === "strong" ? GREEN : candraBala.verdict === "moderate" ? GOLD : VERMILION }}>
                Candra-Bala Aggregate Verdict
              </p>
              <h3 style={{
                fontFamily: fontFamilies.literarySerif, fontSize: 20, fontWeight: 700,
                color: candraBala.verdict === "strong" ? GREEN : candraBala.verdict === "moderate" ? GOLD : VERMILION,
                textTransform: "capitalize" as const
              }}>
                {candraBala.verdict} Candra-Bala
              </h3>
            </div>
          </div>
        </div>

        {/* House-Bala Evaluator */}
        <div style={{ ...cardBase, borderTop: `4px solid ${GOLD}` }}>
          <h4 style={{ ...headingMd, display: "flex", alignItems: "center", gap: 8 }}>
            <Grid3X3 size={20} color={GOLD} /> Event-Specific House-Bala
          </h4>
          <p style={{ ...bodySm, fontSize: 13, marginTop: 4 }}>
            Toggle house properties to see how placements, combust rulers, and the **Upachaya-malefic exception** affect event houses.
          </p>

          {/* Interactive House Grid */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
            {houseBala.houseResults.map(res => {
              const signName = getRashiName(res.signNumber);
              const signLord = getRashiRuler(res.signNumber);
              
              const isLordCombust = combustLords.includes(res.signNumber);

              let strengthColor = GOLD;
              if (res.strength === "strong") strengthColor = GREEN;
              else if (res.strength === "weak") strengthColor = VERMILION;

              return (
                <div key={res.house} style={{
                  padding: 12, borderRadius: 8, border: `1px solid ${HAIRLINE}`,
                  background: res.strength === "strong" ? wash(GREEN, "04") : res.strength === "weak" ? wash(VERMILION, "04") : SURFACE
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{
                        width: 22, height: 22, borderRadius: "50%",
                        background: res.isUp ? wash(GREEN, "18") : wash(GOLD, "15"),
                        color: res.isUp ? GREEN : GOLD,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 700
                      }}>
                        {res.house}
                      </span>
                      <div>
                        <p style={{ ...headingMd, fontSize: 14 }}>
                          House {res.house} ({signName})
                        </p>
                        <p style={{ ...labelSm, fontSize: 10, color: INK_MUTED, textTransform: "none" }}>
                          Ruler: {signLord}
                        </p>
                      </div>
                    </div>
                    
                    <span style={{
                      ...labelSm, padding: "2px 8px", borderRadius: 10,
                      background: wash(strengthColor, "15"), color: strengthColor, fontWeight: 700
                    }}>
                      {res.strength.toUpperCase()}
                    </span>
                  </div>
                  <p style={{ ...bodySm, fontSize: 12, marginTop: 4, color: INK_SECONDARY }}>{res.rationale}</p>
                  
                  {/* Controls for this specific house */}
                  <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                    <button
                      onClick={() => toggleMalefic(res.house)}
                      style={{
                        padding: "3px 8px", borderRadius: 4, fontSize: 11, border: "none",
                        background: res.hasMalefic ? (res.isUp ? GREEN : VERMILION) : SURFACE_2,
                        color: res.hasMalefic ? "#FFF" : INK_SECONDARY,
                        cursor: "pointer", fontFamily: fontFamilies.literarySerif, fontWeight: 600
                      }}
                    >
                      {res.hasMalefic ? "✓ Malefic Placed" : "+ Place Malefic"}
                    </button>
                    <button
                      onClick={() => toggleBenefic(res.house)}
                      style={{
                        padding: "3px 8px", borderRadius: 4, fontSize: 11, border: "none",
                        background: res.hasBenefic ? GREEN : SURFACE_2,
                        color: res.hasBenefic ? "#FFF" : INK_SECONDARY,
                        cursor: "pointer", fontFamily: fontFamilies.literarySerif, fontWeight: 600
                      }}
                    >
                      {res.hasBenefic ? "✓ Benefic Placed" : "+ Place Benefic"}
                    </button>
                    <button
                      onClick={() => toggleCombustLord(res.signNumber)}
                      style={{
                        padding: "3px 8px", borderRadius: 4, fontSize: 11, border: "none",
                        background: isLordCombust ? VERMILION : SURFACE_2,
                        color: isLordCombust ? "#FFF" : INK_SECONDARY,
                        cursor: "pointer", fontFamily: fontFamilies.literarySerif, fontWeight: 600
                      }}
                    >
                      {isLordCombust ? "⚡ Combust Lord" : "Combust Lord?"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{
            marginTop: 14, padding: 12, borderRadius: 8,
            background: wash(houseBala.aggregate === "favourable" ? GREEN : houseBala.aggregate === "mixed" ? GOLD : VERMILION, "12"),
            textAlign: "center" as const
          }}>
            <p style={{ ...labelSm, color: houseBala.aggregate === "favourable" ? GREEN : houseBala.aggregate === "mixed" ? GOLD : VERMILION }}>
              Aggregate House-Bala
            </p>
            <h3 style={{
              fontFamily: fontFamilies.literarySerif, fontSize: 20, fontWeight: 700,
              color: houseBala.aggregate === "favourable" ? GREEN : houseBala.aggregate === "mixed" ? GOLD : VERMILION,
              textTransform: "capitalize" as const
            }}>
              {houseBala.aggregate} House Strength
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   TAB 3 — Integrated Four-Pillar Capstone Evaluator
   ════════════════════════════════════════════════════════════ */

type PillarVerdict = "strong" | "favourable" | "mixed" | "challenging" | "poor" | "weak";

function Tab3Capstone() {
  const [pancangaDosa, setPancangaDosa] = useState({
    vyatipata: false,
    bhadra: false,
    rikta: false,
  });
  const [cBala, setCBala] = useState<PillarVerdict>("favourable");
  const [tBala, setTBala] = useState<PillarVerdict>("favourable");
  const [lSuddhi, setLSuddhi] = useState<PillarVerdict>("favourable");
  const [hBala, setHBala] = useState<PillarVerdict>("favourable");
  const [decision, setDecision] = useState<"approve" | "refuse" | "defer" | "adjust" | null>(null);

  // Math to integrate pillars
  const integrationResults = useMemo(() => {
    // Step 1: Cancellation check
    const hasCancellation = pancangaDosa.vyatipata || pancangaDosa.bhadra || pancangaDosa.rikta;
    
    // Calculate a numeric score out of 100 based on selections
    let score = 90;
    if (hasCancellation) {
      score = 20;
    } else {
      // Deductions
      if (cBala === "mixed") score -= 15;
      else if (cBala === "challenging" || cBala === "weak") score -= 30;

      if (tBala === "mixed") score -= 15;
      else if (tBala === "challenging" || tBala === "poor") score -= 35;

      if (lSuddhi === "mixed") score -= 15;
      else if (lSuddhi === "challenging" || lSuddhi === "poor" || lSuddhi === "weak") score -= 30;

      if (hBala === "mixed") score -= 10;
      else if (hBala === "challenging" || hBala === "weak") score -= 20;
    }

    if (score < 10) score = 10;

    let verdict: "strong" | "mixed" | "avoid" = "mixed";
    if (score >= 75) verdict = "strong";
    else if (score <= 40 || hasCancellation) verdict = "avoid";

    return {
      score,
      hasCancellation,
      verdict,
    };
  }, [pancangaDosa, cBala, tBala, lSuddhi, hBala]);

  const toggleDosa = (key: keyof typeof pancangaDosa) => {
    setPancangaDosa(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getVerdictLabel = () => {
    if (integrationResults.hasCancellation) return "VOID — Cancellation Active";
    if (integrationResults.verdict === "strong") return "RECOMMENDED — Strong Capstone";
    if (integrationResults.verdict === "avoid") return "AVOID — High Risk Doṣa";
    return "MIXED — Trade-offs Present";
  };

  const getVerdictColor = () => {
    if (integrationResults.hasCancellation || integrationResults.verdict === "avoid") return VERMILION;
    if (integrationResults.verdict === "strong") return GREEN;
    return GOLD;
  };

  // Speedometer Needle calculations
  const angleFrac = integrationResults.score / 100;
  const angle = Math.PI - angleFrac * Math.PI;
  const needleX = 100 + 60 * Math.cos(angle);
  const needleY = 100 - 60 * Math.sin(angle);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 24, alignItems: "start" }}>
      {/* Dashboard Inputs */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Pillar 1: Pancanga Cancellation Checks */}
        <div style={cardBase}>
          <p style={labelSm}>Pillar 1: First-Pass Cancellation doṣas</p>
          <p style={{ ...bodySm, fontSize: 13, color: INK_MUTED, marginBottom: 8 }}>
            Activating any cancellation instantly overrides other pillars and VOIDs the candidate moment.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <button
              onClick={() => toggleDosa("vyatipata")}
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "8px 12px", borderRadius: 8, border: `1.5px solid ${pancangaDosa.vyatipata ? VERMILION : HAIRLINE}`,
                background: pancangaDosa.vyatipata ? wash(VERMILION, "20") : "transparent",
                color: pancangaDosa.vyatipata ? VERMILION : INK_SECONDARY,
                cursor: "pointer", fontFamily: fontFamilies.literarySerif, fontSize: 14, fontWeight: 600,
              }}
            >
              <span>Vyatīpāta / Vaidhṛti Yoga</span>
              <span style={{ fontSize: 11 }}>{pancangaDosa.vyatipata ? "⚠️ Active Doṣa" : "Off"}</span>
            </button>

            <button
              onClick={() => toggleDosa("bhadra")}
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "8px 12px", borderRadius: 8, border: `1.5px solid ${pancangaDosa.bhadra ? VERMILION : HAIRLINE}`,
                background: pancangaDosa.bhadra ? wash(VERMILION, "20") : "transparent",
                color: pancangaDosa.bhadra ? VERMILION : INK_SECONDARY,
                cursor: "pointer", fontFamily: fontFamilies.literarySerif, fontSize: 14, fontWeight: 600,
              }}
            >
              <span>Bhadrā-mukha Karaṇa</span>
              <span style={{ fontSize: 11 }}>{pancangaDosa.bhadra ? "⚠️ Active Doṣa" : "Off"}</span>
            </button>

            <button
              onClick={() => toggleDosa("rikta")}
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "8px 12px", borderRadius: 8, border: `1.5px solid ${pancangaDosa.rikta ? VERMILION : HAIRLINE}`,
                background: pancangaDosa.rikta ? wash(VERMILION, "20") : "transparent",
                color: pancangaDosa.rikta ? VERMILION : INK_SECONDARY,
                cursor: "pointer", fontFamily: fontFamilies.literarySerif, fontSize: 14, fontWeight: 600,
              }}
            >
              <span>Riktā Tithi (without exception)</span>
              <span style={{ fontSize: 11 }}>{pancangaDosa.rikta ? "⚠️ Active Doṣa" : "Off"}</span>
            </button>
          </div>
        </div>

        {/* Pillars 2, 3, 4 Grade Selectors */}
        <div style={cardBase}>
          <p style={{ ...labelSm, marginBottom: 10 }}>Pillars 2–4 & House-Bala Input Grades</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Candra-Bala */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={bodySm}>Pillar 2: Candra-Bala</span>
              <select value={cBala} onChange={e => setCBala(e.target.value as PillarVerdict)}
                style={{
                  padding: "4px 8px", borderRadius: 6, border: `1px solid ${HAIRLINE}`, background: SURFACE,
                  fontFamily: fontFamilies.literarySerif, fontSize: 13, color: INK_PRIMARY
                }}>
                <option value="favourable">Favourable</option>
                <option value="mixed">Mixed</option>
                <option value="challenging">Challenging / Weak</option>
              </select>
            </div>

            {/* Tara-Bala */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={bodySm}>Pillar 3: Tārā-Bala</span>
              <select value={tBala} onChange={e => setTBala(e.target.value as PillarVerdict)}
                style={{
                  padding: "4px 8px", borderRadius: 6, border: `1px solid ${HAIRLINE}`, background: SURFACE,
                  fontFamily: fontFamilies.literarySerif, fontSize: 13, color: INK_PRIMARY
                }}>
                <option value="favourable">Favourable</option>
                <option value="mixed">Mixed</option>
                <option value="challenging">Challenging / Poor</option>
              </select>
            </div>

            {/* Lagna-Suddhi */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={bodySm}>Pillar 4: Lagna-Śuddhi</span>
              <select value={lSuddhi} onChange={e => setLSuddhi(e.target.value as PillarVerdict)}
                style={{
                  padding: "4px 8px", borderRadius: 6, border: `1px solid ${HAIRLINE}`, background: SURFACE,
                  fontFamily: fontFamilies.literarySerif, fontSize: 13, color: INK_PRIMARY
                }}>
                <option value="favourable">Favourable</option>
                <option value="mixed">Mixed</option>
                <option value="challenging">Challenging / Poor</option>
              </select>
            </div>

            {/* House-Bala */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={bodySm}>Event House-Bala</span>
              <select value={hBala} onChange={e => setHBala(e.target.value as PillarVerdict)}
                style={{
                  padding: "4px 8px", borderRadius: 6, border: `1px solid ${HAIRLINE}`, background: SURFACE,
                  fontFamily: fontFamilies.literarySerif, fontSize: 13, color: INK_PRIMARY
                }}>
                <option value="favourable">Favourable</option>
                <option value="mixed">Mixed</option>
                <option value="challenging">Challenging / Weak</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Speedometer Gauge & Decision Console */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ ...cardBase, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <p style={labelSm}>Integrated Capstone Quality Score</p>
          
          <svg viewBox="0 0 200 120" width="100%" style={{ maxWidth: 260, marginTop: 12 }}>
            <defs>
              <linearGradient id="capstoneGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={VERMILION} />
                <stop offset="45%" stopColor={GOLD} />
                <stop offset="100%" stopColor={GREEN} />
              </linearGradient>
            </defs>
            {/* Arch */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none" stroke="rgba(156, 116, 48, 0.35)" strokeWidth={14} strokeLinecap="round"
            />
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none" stroke="url(#capstoneGrad)" strokeWidth={14} strokeLinecap="round"
              strokeDasharray="251.3"
              strokeDashoffset={251.3 * (1 - angleFrac)}
              style={{ transition: "stroke-dashoffset 0.6s ease" }}
            />
            {/* Needle */}
            <line x1={100} y1={100} x2={needleX} y2={needleY} stroke={getVerdictColor()} strokeWidth={3.5} strokeLinecap="round" />
            <circle cx={100} cy={100} r={5} fill={getVerdictColor()} />
            {/* Labels */}
            <text x={100} y={118} textAnchor="middle" fill={getVerdictColor()}
              style={{ fontSize: 14, fontFamily: fontFamilies.literarySerif, fontWeight: 700 }}>
              {getVerdictLabel()}
            </text>
          </svg>

          {/* Core Śloka Line Callout */}
          <div style={{
            marginTop: 14, padding: "10px 14px", borderRadius: 8, background: SURFACE_2,
            width: "100%", textAlign: "center" as const, border: `1px solid ${HAIRLINE}`
          }}>
            <Devanagari size="sm" surface="cream" asElement="p" style={{ fontStyle: "italic", fontSize: 13 }}>
              पञ्चाङ्ग-शुद्धि-चन्द्र-ताराबल-संयुतम् लग्न-शुद्धि-समायुक्तं...
            </Devanagari>
            <p style={{ ...bodySm, fontSize: 11, color: INK_MUTED, marginTop: 2 }}>
              &ldquo;Combined with pañcāṅga-purity, lunar strength, compatibility, and ascendant purity...&rdquo;
            </p>
          </div>
        </div>

        {/* Practitioner Decision Console */}
        <div style={cardBase}>
          <p style={labelSm}>Daivajña Practitioner Decision Console</p>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
            <button
              onClick={() => setDecision("approve")}
              style={{
                padding: "8px 0", borderRadius: 8, border: "none",
                background: decision === "approve" ? GREEN : SURFACE_2,
                color: decision === "approve" ? "#FFF" : INK_SECONDARY,
                cursor: "pointer", fontFamily: fontFamilies.literarySerif, fontWeight: 600,
                fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6
              }}
            >
              <CheckCircle2 size={14} /> Approve Timing
            </button>

            <button
              onClick={() => setDecision("refuse")}
              style={{
                padding: "8px 0", borderRadius: 8, border: "none",
                background: decision === "refuse" ? VERMILION : SURFACE_2,
                color: decision === "refuse" ? "#FFF" : INK_SECONDARY,
                cursor: "pointer", fontFamily: fontFamilies.literarySerif, fontWeight: 600,
                fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6
              }}
            >
              <XCircle size={14} /> Refuse Timing
            </button>

            <button
              onClick={() => setDecision("defer")}
              style={{
                padding: "8px 0", borderRadius: 8, border: "none",
                background: decision === "defer" ? BLUE : SURFACE_2,
                color: decision === "defer" ? "#FFF" : INK_SECONDARY,
                cursor: "pointer", fontFamily: fontFamilies.literarySerif, fontWeight: 600,
                fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6
              }}
            >
              <RotateCcw size={14} /> Defer Analysis
            </button>

            <button
              onClick={() => setDecision("adjust")}
              style={{
                padding: "8px 0", borderRadius: 8, border: "none",
                background: decision === "adjust" ? GOLD : SURFACE_2,
                color: decision === "adjust" ? "#FFF" : INK_SECONDARY,
                cursor: "pointer", fontFamily: fontFamilies.literarySerif, fontWeight: 600,
                fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6
              }}
            >
              <Clock size={14} /> Adjust Sub-window
            </button>
          </div>

          {/* Decision justification box */}
          {decision && (
            <div style={{
              marginTop: 12, padding: 10, borderRadius: 8,
              background: wash(decision === "approve" ? GREEN : decision === "refuse" ? VERMILION : decision === "defer" ? BLUE : GOLD, "10"),
              border: `1.5px solid ${decision === "approve" ? GREEN : decision === "refuse" ? VERMILION : decision === "defer" ? BLUE : GOLD}`
            }}>
              <p style={{ ...labelSm, color: decision === "approve" ? GREEN : decision === "refuse" ? VERMILION : decision === "defer" ? BLUE : GOLD }}>
                Practitioner Decisive Action:
              </p>
              <p style={{ ...bodySm, fontSize: 13, marginTop: 4 }}>
                {decision === "approve" && (
                  integrationResults.verdict === "strong"
                    ? "✓ Safe to recommend! All four pillars and event houses verify clean and supportive."
                    : "⚠️ Warning: You are approving a moment with active trade-offs or weak pillars. Classical rules advise warning the family first."
                )}
                {decision === "refuse" && (
                  integrationResults.hasCancellation
                    ? "✓ Correct decision. Core doṣas (Vyatīpāta/Bhadrā/Riktā) cancel auspiciousness and require complete rescheduling."
                    : "✓ Refused based on severe house afflictions or weak tārā/candra positions."
                )}
                {decision === "defer" && (
                  "Analysis deferred. Seek additional birth charts or verify local longitude/latitude calculation rules."
                )}
                {decision === "adjust" && (
                  "Initiate search for alternative lagna-degrees or adjacent dates to resolve groom's tārā or 7th house malefic."
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   TAB 4 — Case File Dojo (Scenario Screener)
   ════════════════════════════════════════════════════════════ */

function Tab4Dojo() {
  const [openScenario, setOpenScenario] = useState<number | null>(null);
  const [userIssue, setUserIssue] = useState<Record<number, IssueKey>>({});
  const [userVerdict, setUserVerdict] = useState<Record<number, ScenarioVerdict>>({});
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  const handleReveal = (id: number) => {
    setRevealed(prev => {
      const copy = new Set(prev);
      copy.add(id);
      return copy;
    });
  };

  return (
    <div style={cardBase}>
      <p style={{ ...headingMd, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
        <FileText size={20} /> Diagnostic Scenario Dojo (§6 Worked Examples)
      </p>
      <p style={{ ...bodySm, fontSize: 14, color: INK_SECONDARY, marginBottom: 16 }}>
        Select a client dossier from the list, read the chart placements, select the diagnostic issue and verdict, and check your analysis.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {SCENARIOS.map(sc => {
          const isOpen = openScenario === sc.id;
          const isRevealed = revealed.has(sc.id);

          return (
            <div key={sc.id} style={{
              border: `1.5px solid ${isOpen ? GOLD : HAIRLINE}`,
              borderRadius: 10, overflow: "hidden",
              background: isOpen ? wash(GOLD, "05") : "transparent",
              transition: "all 0.2s"
            }}>
              <button
                onClick={() => setOpenScenario(isOpen ? null : sc.id)}
                style={{
                  width: "100%", padding: "14px 18px", border: "none",
                  background: "transparent", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 12,
                  textAlign: "left" as const,
                }}
              >
                <span style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: wash(GOLD, "15"), color: GOLD,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: fontFamilies.literarySerif, fontSize: 14, fontWeight: 700,
                  flexShrink: 0
                }}>{sc.id}</span>
                <span style={{ ...headingMd, fontSize: 16, flex: 1 }}>{sc.title}</span>
                <ChevronRight size={16} style={{
                  transform: isOpen ? "rotate(90deg)" : "none",
                  transition: "0.2s", color: INK_MUTED
                }} />
              </button>

              {isOpen && (
                <div style={{ padding: "0 18px 18px" }}>
                  <p style={bodySm}>{sc.situation}</p>
                  
                  {/* Scenario Details Box */}
                  <div style={{ ...cardBase, background: SURFACE_2, padding: 12, margin: "10px 0" }}>
                    <p style={{ ...bodySm, fontSize: 13, color: INK_SECONDARY }}>
                      <strong>Dossier Chart Placements:</strong> {sc.details}
                    </p>
                  </div>

                  {/* Client Quote */}
                  <div style={{
                    padding: 10, borderRadius: 8, background: wash(BLUE, "08"),
                    borderLeft: `3px solid ${BLUE}`, marginBottom: 14
                  }}>
                    <p style={{ ...bodySm, fontSize: 13, color: BLUE, fontStyle: "italic" }}>
                      💬 Client Quote: &ldquo;{sc.clientQuote}&rdquo;
                    </p>
                  </div>

                  {/* Interactive Selectors */}
                  {!isRevealed && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                      <div>
                        <label style={labelSm}>What is the primary analytical issue?</label>
                        <select
                          value={userIssue[sc.id] || ""}
                          onChange={e => setUserIssue({ ...userIssue, [sc.id]: e.target.value as IssueKey })}
                          style={{
                            width: "100%", marginTop: 4, padding: "6px 8px", borderRadius: 6,
                            border: `1px solid ${HAIRLINE}`, background: SURFACE,
                            fontFamily: fontFamilies.literarySerif, fontSize: 14, color: INK_PRIMARY
                          }}
                        >
                          <option value="">— Select —</option>
                          {Object.entries(ISSUE_LABELS).map(([k, v]) => (
                            <option key={k} value={k}>{v}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={labelSm}>What is the recommended verdict?</label>
                        <select
                          value={userVerdict[sc.id] || ""}
                          onChange={e => setUserVerdict({ ...userVerdict, [sc.id]: e.target.value as ScenarioVerdict })}
                          style={{
                            width: "100%", marginTop: 4, padding: "6px 8px", borderRadius: 6,
                            border: `1px solid ${HAIRLINE}`, background: SURFACE,
                            fontFamily: fontFamilies.literarySerif, fontSize: 14, color: INK_PRIMARY
                          }}
                        >
                          <option value="">— Select —</option>
                          <option value="favourable">Favourable</option>
                          <option value="avoid">Avoid</option>
                          <option value="exception-applies">Exception Applies</option>
                          <option value="mixed">Mixed / Trade-off</option>
                          <option value="needs-adjustment">Needs Adjustment</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    onClick={() => handleReveal(sc.id)}
                    style={{
                      padding: "8px 18px", borderRadius: 8, border: "none",
                      background: isRevealed ? wash(GREEN, "15") : wash(GOLD, "20"),
                      color: isRevealed ? GREEN : GOLD,
                      fontFamily: fontFamilies.literarySerif, fontSize: 14, fontWeight: 600,
                      cursor: "pointer", transition: "all 0.2s"
                    }}
                  >
                    {isRevealed ? "✓ Answer Revealed" : "Check Analytical Verdict"}
                  </button>

                  {/* Correct Answers */}
                  {isRevealed && (
                    <div style={{
                      marginTop: 14, padding: 14, borderRadius: 8,
                      background: wash(GREEN, "06"), border: `1px solid ${wash(GREEN, "30")}`
                    }}>
                      <div style={{ display: "flex", gap: 16, marginBottom: 8, flexWrap: "wrap" }}>
                        <span style={{ ...labelSm, color: GREEN, textTransform: "none" }}>
                          Core Issue: <strong>{ISSUE_LABELS[sc.expectedIssue]}</strong>
                        </span>
                        <span style={{ ...labelSm, color: GREEN, textTransform: "none" }}>
                          Verdict: <strong style={{ textTransform: "capitalize" }}>{sc.expectedVerdict}</strong>
                        </span>
                      </div>
                      
                      <p style={{ ...bodySm, fontSize: 13, color: INK_SECONDARY }}>{sc.explanation}</p>

                      {/* Score checks */}
                      {userIssue[sc.id] && userVerdict[sc.id] && (
                        <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
                          <span style={{
                            ...labelSm, padding: "2px 8px", borderRadius: 12, textTransform: "none",
                            background: userIssue[sc.id] === sc.expectedIssue ? wash(GREEN, "20") : wash(VERMILION, "20"),
                            color: userIssue[sc.id] === sc.expectedIssue ? GREEN : VERMILION
                          }}>
                            Issue ID: {userIssue[sc.id] === sc.expectedIssue ? "✓ Correct" : "✗ Review Text"}
                          </span>
                          <span style={{
                            ...labelSm, padding: "2px 8px", borderRadius: 12, textTransform: "none",
                            background: userVerdict[sc.id] === sc.expectedVerdict ? wash(GREEN, "20") : wash(VERMILION, "20"),
                            color: userVerdict[sc.id] === sc.expectedVerdict ? GREEN : VERMILION
                          }}>
                            Verdict Choice: {userVerdict[sc.id] === sc.expectedVerdict ? "✓ Correct" : "✗ Review Rules"}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MAIN EXPORT — Tabbed Container
   ════════════════════════════════════════════════════════════ */

const TABS = [
  { key: "tara",      label: "Tārā-Bala",        icon: Compass },
  { key: "candra",    label: "Candra & Houses",  icon: BarChart3 },
  { key: "capstone",  label: "Capstone Score",   icon: Layers },
  { key: "dojo",      label: "Case File Dojo",   icon: FileText },
] as const;

type TabKey = typeof TABS[number]["key"];

export function FourPillarIntegrator() {
  const [activeTab, setActiveTab] = useState<TabKey>("tara");

  return (
    <section style={{ fontFamily: fontFamilies.literarySerif }}>
      {/* Header Bar */}
      <div style={{
        display: "flex", gap: 4, marginBottom: 20, flexWrap: "wrap",
        borderBottom: `2px solid ${HAIRLINE}`, paddingBottom: 2
      }}>
        {TABS.map(tab => {
          const active = activeTab === tab.key;
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "10px 18px", border: "none", borderRadius: "8px 8px 0 0",
                background: active ? wash(GOLD, "15") : "transparent",
                color: active ? GOLD : INK_SECONDARY,
                fontFamily: fontFamilies.literarySerif,
                fontSize: 15, fontWeight: active ? 800 : 700,
                cursor: "pointer", transition: "all 0.2s",
                borderBottom: active ? `3px solid ${GOLD}` : "3px solid transparent",
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      {activeTab === "tara"     && <Tab1TaraBala />}
      {activeTab === "candra"   && <Tab2CandraHouse />}
      {activeTab === "capstone" && <Tab3Capstone />}
      {activeTab === "dojo"     && <Tab4Dojo />}
    </section>
  );
}
