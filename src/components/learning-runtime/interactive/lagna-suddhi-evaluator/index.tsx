"use client";

import React, { useState, useMemo } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  BookOpen,
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
  Compass,
  HelpCircle,
  BarChart3,
  Grid3X3,
} from "lucide-react";
import { Devanagari, IAST } from "../../chrome/typography";
import { fontFamilies } from "@/design-tokens/grahvani-learning";
import {
  RASHI_DB,
  EVENT_TYPES,
  SCENARIOS,
  MODALITY_META,
  VERDICT_META,
  RELATION_META,
  DIGNITY_META,
  FOUR_PILLARS,
  INTEGRATION_STEPS,
  ISSUE_LABELS,
  evaluateCriterion1,
  evaluateCriterion2,
  evaluateCriterion3,
  aggregateLagnaSuddhi,
  signRelation,
  getRashi,
  isUpachaya,
  type RashiData,
  type EventTypeKey,
  type Modality,
  type Dignity,
  type Verdict,
  type SignRelation,
  type IssueKey,
  type ScenarioVerdict,
} from "./data";

/* ── Design Tokens ──────────────────────────────────────── */
const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
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
    case "wedding":        return <Heart size={size} />;
    case "griha-pravesha":  return <Home size={size} />;
    case "business-launch": return <Briefcase size={size} />;
    case "travel":          return <Plane size={size} />;
    case "education":       return <GraduationCap size={size} />;
    case "foundation-stone": return <Target size={size} />;
    case "surgery":         return <Scissors size={size} />;
    default:               return <Circle size={size} />;
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
  fontSize: 12,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  color: INK_MUTED,
};
const headingMd: CSSProperties = {
  fontFamily: fontFamilies.literarySerif,
  fontSize: 18,
  fontWeight: 600,
  color: INK_PRIMARY,
};
const bodySm: CSSProperties = {
  fontFamily: fontFamilies.literarySerif,
  fontSize: 15,
  lineHeight: 1.55,
  color: INK_SECONDARY,
};

/* ════════════════════════════════════════════════════════════
   TAB 1 — 12-Sign Lagna-Rāśi Affinity Wheel
   ════════════════════════════════════════════════════════════ */

function Tab1Wheel() {
  const [selectedSign, setSelectedSign] = useState<number | null>(null);
  const [eventFilter, setEventFilter] = useState<EventTypeKey | null>(null);
  const [showRulers, setShowRulers] = useState(false);

  const filteredFavoured = useMemo(() => {
    if (!eventFilter) return new Set<number>();
    const evt = EVENT_TYPES.find(e => e.key === eventFilter);
    return evt ? new Set(evt.favouredSignNumbers) : new Set<number>();
  }, [eventFilter]);

  const cx = 200, cy = 200, R = 170, r = 80;
  const selected = selectedSign ? RASHI_DB.find(rs => rs.number === selectedSign) : null;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
      {/* SVG Mandala */}
      <div style={{ ...cardBase, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <p style={labelSm}>12-Sign Lagna-Rāśi Mandala</p>
        <svg viewBox="0 0 400 400" width="100%" style={{ maxWidth: 380, marginTop: 8 }}>
          {RASHI_DB.map((rashi, i) => {
            const startAngle = (i * 30 - 90) * Math.PI / 180;
            const endAngle = ((i + 1) * 30 - 90) * Math.PI / 180;
            const midAngle = ((i + 0.5) * 30 - 90) * Math.PI / 180;

            const x1o = cx + R * Math.cos(startAngle);
            const y1o = cy + R * Math.sin(startAngle);
            const x2o = cx + R * Math.cos(endAngle);
            const y2o = cy + R * Math.sin(endAngle);
            const x1i = cx + r * Math.cos(startAngle);
            const y1i = cy + r * Math.sin(startAngle);
            const x2i = cx + r * Math.cos(endAngle);
            const y2i = cy + r * Math.sin(endAngle);

            const isSelected = selectedSign === rashi.number;
            const isFavoured = eventFilter ? filteredFavoured.has(rashi.number) : true;
            const modColor = MODALITY_META[rashi.modality].color;

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
              <g key={rashi.number} onClick={() => setSelectedSign(rashi.number)} style={{ cursor: "pointer" }}>
                <path
                  d={d}
                  fill={isSelected ? `${modColor}40` : isFavoured ? `${modColor}20` : `${modColor}08`}
                  stroke={isSelected ? modColor : `${modColor}60`}
                  strokeWidth={isSelected ? 2.5 : 1}
                  style={{ transition: "all 0.25s ease" }}
                />
                <text
                  x={lx} y={ly - (showRulers ? 5 : 0)}
                  textAnchor="middle" dominantBaseline="central"
                  fill={isFavoured ? modColor : INK_MUTED}
                  style={{ fontSize: 13, fontFamily: fontFamilies.literarySerif, fontWeight: isSelected ? 700 : 600 }}
                >
                  {rashi.english}
                </text>
                {showRulers && (
                  <text
                    x={lx} y={ly + 14}
                    textAnchor="middle" dominantBaseline="central"
                    fill={INK_SECONDARY}
                    style={{ fontSize: 11, fontFamily: fontFamilies.literarySerif, fontStyle: "italic" }}
                  >
                    {rashi.ruler}
                  </text>
                )}
                {eventFilter && isFavoured && (
                  <circle cx={lx} cy={ly + (showRulers ? 22 : 16)} r={3} fill={GREEN} opacity={0.8}>
                    <animate attributeName="r" values="3;4.5;3" dur="1.8s" repeatCount="indefinite" />
                  </circle>
                )}
              </g>
            );
          })}
          {/* Center label */}
          <circle cx={cx} cy={cy} r={r - 4} fill={SURFACE} stroke={HAIRLINE} strokeWidth={1} />
          {selected ? (
            <>
              <text x={cx} y={cy - 18} textAnchor="middle" fill={MODALITY_META[selected.modality].color}
                style={{ fontSize: 26, fontFamily: fontFamilies.display }}>
                {selected.devanagari}
              </text>
              <text x={cx} y={cy + 8} textAnchor="middle" fill={INK_PRIMARY}
                style={{ fontSize: 15, fontFamily: fontFamilies.literarySerif, fontWeight: 700 }}>
                {selected.name}
              </text>
              <text x={cx} y={cy + 26} textAnchor="middle" fill={INK_MUTED}
                style={{ fontSize: 12, fontFamily: fontFamilies.literarySerif }}>
                {MODALITY_META[selected.modality].label}
              </text>
            </>
          ) : (
            <>
              <text x={cx} y={cy - 6} textAnchor="middle" fill={INK_MUTED}
                style={{ fontSize: 14, fontFamily: fontFamilies.literarySerif }}>
                Select a sign
              </text>
              <text x={cx} y={cy + 12} textAnchor="middle" fill={INK_MUTED}
                style={{ fontSize: 12, fontFamily: fontFamilies.literarySerif }}>
                to explore
              </text>
            </>
          )}
        </svg>
        {/* Modality Legend */}
        <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap", justifyContent: "center" }}>
          {(Object.entries(MODALITY_META) as [Modality, typeof MODALITY_META[Modality]][]).map(([k, v]) => (
            <span key={k} style={{ ...labelSm, display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: v.color, display: "inline-block" }} />
              {v.label}
            </span>
          ))}
        </div>
        {/* Show rulers toggle */}
        <label style={{ ...labelSm, display: "flex", alignItems: "center", gap: 6, marginTop: 8, cursor: "pointer" }}>
          <input type="checkbox" checked={showRulers} onChange={() => setShowRulers(!showRulers)} />
          Show Planetary Rulers
        </label>
      </div>

      {/* Sidebar — Details + Event Filter */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Event Type Filter */}
        <div style={cardBase}>
          <p style={{ ...labelSm, marginBottom: 10 }}>Event-Type Affinity Filter (§4.5)</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {EVENT_TYPES.map(evt => {
              const active = eventFilter === evt.key;
              return (
                <button
                  key={evt.key}
                  onClick={() => setEventFilter(active ? null : evt.key)}
                  style={{
                    ...bodySm,
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "6px 10px", borderRadius: 8,
                    border: `1px solid ${active ? GOLD : HAIRLINE}`,
                    background: active ? wash(GOLD, "18") : "transparent",
                    cursor: "pointer", textAlign: "left" as const,
                    transition: "all 0.2s",
                  }}
                >
                  {getEventIcon(evt.key, 14)}
                  <span style={{ fontSize: 13 }}>{evt.label}</span>
                </button>
              );
            })}
          </div>
          {eventFilter && (
            <p style={{ ...bodySm, marginTop: 10, fontSize: 13, fontStyle: "italic" }}>
              {EVENT_TYPES.find(e => e.key === eventFilter)?.grounding}
            </p>
          )}
        </div>

        {/* Selected sign detail */}
        {selected && (
          <div style={cardBase}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <Devanagari size="lg" surface="cream">{selected.devanagari}</Devanagari>
              <div>
                <p style={headingMd}>{selected.name} / {selected.english}</p>
                <p style={{ ...labelSm, color: MODALITY_META[selected.modality].color }}>
                  {MODALITY_META[selected.modality].label} · {selected.ruler} ({selected.rulerDevanagari})
                </p>
              </div>
            </div>
            <p style={bodySm}>{selected.character}</p>
            <div style={{ marginTop: 12 }}>
              <p style={{ ...labelSm, marginBottom: 6 }}>Favoured For:</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {selected.favouredFor.length > 0 ? selected.favouredFor.map(ek => (
                  <span key={ek} style={{
                    ...labelSm, padding: "3px 10px", borderRadius: 20,
                    background: wash(GREEN, "18"), color: GREEN, fontSize: 11,
                  }}>
                    {EVENT_TYPES.find(e => e.key === ek)?.label}
                  </span>
                )) : (
                  <span style={{ ...bodySm, fontStyle: "italic", fontSize: 13 }}>
                    Not on primary-favoured list for any event type
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   TAB 2 — 3-Criterion Lagna-Śuddhi Evaluator
   ════════════════════════════════════════════════════════════ */

function Tab2Evaluator() {
  const [lagnaSign, setLagnaSign] = useState(2); // Vṛṣabha default
  const [eventType, setEventType] = useState<EventTypeKey>("wedding");
  const [dignity, setDignity] = useState<Dignity>("own");
  const [lordHouse, setLordHouse] = useState(1);
  const [maleficHouses, setMaleficHouses] = useState<number[]>([]);

  const c1 = useMemo(() => evaluateCriterion1(lagnaSign, eventType), [lagnaSign, eventType]);
  const c2 = useMemo(() => evaluateCriterion2(dignity, lordHouse), [dignity, lordHouse]);
  const c3 = useMemo(() => evaluateCriterion3(maleficHouses), [maleficHouses]);
  const aggregate = useMemo(() => aggregateLagnaSuddhi(c1, c2, c3), [c1, c2, c3]);

  const toggleMalefic = (h: number) => {
    setMaleficHouses(prev => prev.includes(h) ? prev.filter(x => x !== h) : [...prev, h]);
  };

  const rashi = getRashi(lagnaSign);
  const aggMeta = VERDICT_META[aggregate];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Controls */}
      <div style={{ ...cardBase, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Lagna Sign */}
        <div>
          <label style={labelSm}>Muhūrta Lagna Sign</label>
          <select
            value={lagnaSign}
            onChange={e => setLagnaSign(Number(e.target.value))}
            style={{
              width: "100%", marginTop: 4, padding: "8px 10px", borderRadius: 8,
              border: `1px solid ${HAIRLINE}`, background: SURFACE,
              fontFamily: fontFamilies.literarySerif, fontSize: 15, color: INK_PRIMARY,
            }}
          >
            {RASHI_DB.map(r => (
              <option key={r.number} value={r.number}>{r.name} / {r.english}</option>
            ))}
          </select>
        </div>

        {/* Event Type */}
        <div>
          <label style={labelSm}>Event Type</label>
          <select
            value={eventType}
            onChange={e => setEventType(e.target.value as EventTypeKey)}
            style={{
              width: "100%", marginTop: 4, padding: "8px 10px", borderRadius: 8,
              border: `1px solid ${HAIRLINE}`, background: SURFACE,
              fontFamily: fontFamilies.literarySerif, fontSize: 15, color: INK_PRIMARY,
            }}
          >
            {EVENT_TYPES.map(et => (
              <option key={et.key} value={et.key}>{et.label}</option>
            ))}
          </select>
        </div>

        {/* Lord Dignity */}
        <div>
          <label style={labelSm}>Lagna-Lord Dignity</label>
          <select
            value={dignity}
            onChange={e => setDignity(e.target.value as Dignity)}
            style={{
              width: "100%", marginTop: 4, padding: "8px 10px", borderRadius: 8,
              border: `1px solid ${HAIRLINE}`, background: SURFACE,
              fontFamily: fontFamilies.literarySerif, fontSize: 15, color: INK_PRIMARY,
            }}
          >
            {(Object.entries(DIGNITY_META) as [Dignity, typeof DIGNITY_META[Dignity]][]).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>

        {/* Lord House */}
        <div>
          <label style={labelSm}>Lagna-Lord House Placement</label>
          <select
            value={lordHouse}
            onChange={e => setLordHouse(Number(e.target.value))}
            style={{
              width: "100%", marginTop: 4, padding: "8px 10px", borderRadius: 8,
              border: `1px solid ${HAIRLINE}`, background: SURFACE,
              fontFamily: fontFamilies.literarySerif, fontSize: 15, color: INK_PRIMARY,
            }}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
              <option key={h} value={h}>House {h}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Malefic Positions */}
      <div style={cardBase}>
        <p style={{ ...labelSm, marginBottom: 8 }}>Malefic Positions (toggle houses with malefics — Mars, Saturn, Rāhu, Ketu)</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 4 }}>
          {Array.from({ length: 12 }, (_, i) => i + 1).map(h => {
            const active = maleficHouses.includes(h);
            const upachaya = isUpachaya(h);
            return (
              <button
                key={h}
                onClick={() => toggleMalefic(h)}
                style={{
                  padding: "8px 0", borderRadius: 8, fontSize: 13, fontWeight: 600,
                  fontFamily: fontFamilies.literarySerif,
                  border: `1.5px solid ${active ? (upachaya ? GREEN : VERMILION) : HAIRLINE}`,
                  background: active ? wash(upachaya ? GREEN : VERMILION, "20") : "transparent",
                  color: active ? (upachaya ? GREEN : VERMILION) : INK_MUTED,
                  cursor: "pointer", transition: "all 0.2s",
                  position: "relative" as const,
                }}
                title={upachaya ? `House ${h} (Upachaya — §4.6 exception)` : `House ${h}`}
              >
                {h}
                {upachaya && <span style={{ position: "absolute" as const, top: 1, right: 3, fontSize: 8, color: GREEN }}>U</span>}
              </button>
            );
          })}
        </div>
        <p style={{ ...bodySm, fontSize: 12, marginTop: 6, fontStyle: "italic" }}>
          Houses marked <span style={{ color: GREEN, fontWeight: 600 }}>U</span> = Upachaya (3, 6, 10, 11) — malefics here are <strong>favourable</strong> per §4.6 exception.
        </p>
      </div>

      {/* Results */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {[c1, c2, c3].map(cr => {
          const meta = VERDICT_META[cr.verdict];
          return (
            <div key={cr.criterion} style={{ ...cardBase, borderLeft: `4px solid ${meta.color}` }}>
              <p style={{ ...labelSm, marginBottom: 4 }}>Criterion {cr.criterion}</p>
              <p style={{ ...headingMd, fontSize: 16, color: meta.color }}>{cr.label}</p>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                padding: "3px 10px", borderRadius: 20, marginTop: 6,
                background: wash(meta.color, "18"), color: meta.color,
                fontFamily: fontFamilies.literarySerif, fontSize: 13, fontWeight: 600,
              }}>
                {meta.emoji} {meta.label}
              </div>
              <p style={{ ...bodySm, fontSize: 13, marginTop: 8 }}>{cr.explanation}</p>
            </div>
          );
        })}
      </div>

      {/* Aggregate Gauge */}
      <div style={{ ...cardBase, textAlign: "center" as const }}>
        <p style={labelSm}>Aggregate Lagna-Śuddhi Assessment</p>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, marginTop: 12 }}>
          {/* SVG Gauge */}
          <svg viewBox="0 0 200 120" width={200}>
            <defs>
              <linearGradient id="lsGauge" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={VERMILION} />
                <stop offset="33%" stopColor="#C06030" />
                <stop offset="66%" stopColor={BLUE} />
                <stop offset="100%" stopColor={GREEN} />
              </linearGradient>
            </defs>
            {/* Background arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none" stroke="#E8D8C4" strokeWidth={14} strokeLinecap="round"
            />
            {/* Filled arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none" stroke="url(#lsGauge)" strokeWidth={14} strokeLinecap="round"
              strokeDasharray="251.3"
              strokeDashoffset={251.3 * (1 - ({ strong: 1, moderate: 0.66, weak: 0.33, poor: 0.1 }[aggregate]))}
              style={{ transition: "stroke-dashoffset 0.6s ease" }}
            />
            {/* Needle */}
            {(() => {
              const frac = { strong: 1, moderate: 0.66, weak: 0.33, poor: 0.1 }[aggregate];
              const angle = Math.PI - frac * Math.PI;
              const nx = 100 + 60 * Math.cos(angle);
              const ny = 100 - 60 * Math.sin(angle);
              return <line x1={100} y1={100} x2={nx} y2={ny} stroke={aggMeta.color} strokeWidth={3} strokeLinecap="round" />;
            })()}
            <circle cx={100} cy={100} r={5} fill={aggMeta.color} />
            <text x={100} y={118} textAnchor="middle" fill={aggMeta.color}
              style={{ fontSize: 16, fontFamily: fontFamilies.literarySerif, fontWeight: 700 }}>
              {aggMeta.label}
            </text>
          </svg>
          <div style={{ textAlign: "left" as const }}>
            <Devanagari size="md" surface="cream">लग्न-शुद्धि</Devanagari>
            <p style={{ ...bodySm, marginTop: 4 }}>
              {rashi?.name}/{rashi?.english} lagna for {EVENT_TYPES.find(e => e.key === eventType)?.label}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   TAB 3 — Synergy & Scenario Screener
   ════════════════════════════════════════════════════════════ */

function Tab3Synergy() {
  const [muhurtaSign, setMuhurtaSign] = useState(7); // Tulā default
  const [natalSign1, setNatalSign1] = useState(1);   // Meṣa
  const [natalSign2, setNatalSign2] = useState(2);   // Vṛṣabha
  const [showActor2, setShowActor2] = useState(false);
  const [openScenario, setOpenScenario] = useState<number | null>(null);
  const [userIssue, setUserIssue] = useState<Record<number, IssueKey>>({});
  const [userVerdict, setUserVerdict] = useState<Record<number, ScenarioVerdict>>({});
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  const rel1 = useMemo(() => signRelation(muhurtaSign, natalSign1), [muhurtaSign, natalSign1]);
  const rel2 = useMemo(() => signRelation(muhurtaSign, natalSign2), [muhurtaSign, natalSign2]);
  const relMeta1 = RELATION_META[rel1];
  const relMeta2 = RELATION_META[rel2];
  const mRashi = getRashi(muhurtaSign);
  const nRashi1 = getRashi(natalSign1);
  const nRashi2 = getRashi(natalSign2);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Synergy Calculator */}
      <div style={cardBase}>
        <p style={{ ...headingMd, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <Users size={20} /> Multi-Actor Lagna-Synergy Calculator (§4.4)
        </p>
        <div style={{ display: "grid", gridTemplateColumns: showActor2 ? "1fr 1fr 1fr" : "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div>
            <label style={labelSm}>Muhūrta Lagna</label>
            <select value={muhurtaSign} onChange={e => setMuhurtaSign(Number(e.target.value))}
              style={{
                width: "100%", marginTop: 4, padding: "8px 10px", borderRadius: 8,
                border: `1px solid ${HAIRLINE}`, background: SURFACE,
                fontFamily: fontFamilies.literarySerif, fontSize: 15, color: INK_PRIMARY,
              }}>
              {RASHI_DB.map(r => <option key={r.number} value={r.number}>{r.name} / {r.english}</option>)}
            </select>
          </div>
          <div>
            <label style={labelSm}>Actor 1 Natal Lagna</label>
            <select value={natalSign1} onChange={e => setNatalSign1(Number(e.target.value))}
              style={{
                width: "100%", marginTop: 4, padding: "8px 10px", borderRadius: 8,
                border: `1px solid ${HAIRLINE}`, background: SURFACE,
                fontFamily: fontFamilies.literarySerif, fontSize: 15, color: INK_PRIMARY,
              }}>
              {RASHI_DB.map(r => <option key={r.number} value={r.number}>{r.name} / {r.english}</option>)}
            </select>
          </div>
          {showActor2 && (
            <div>
              <label style={labelSm}>Actor 2 Natal Lagna</label>
              <select value={natalSign2} onChange={e => setNatalSign2(Number(e.target.value))}
                style={{
                  width: "100%", marginTop: 4, padding: "8px 10px", borderRadius: 8,
                  border: `1px solid ${HAIRLINE}`, background: SURFACE,
                  fontFamily: fontFamilies.literarySerif, fontSize: 15, color: INK_PRIMARY,
                }}>
                {RASHI_DB.map(r => <option key={r.number} value={r.number}>{r.name} / {r.english}</option>)}
              </select>
            </div>
          )}
        </div>
        <label style={{ ...labelSm, display: "flex", alignItems: "center", gap: 6, cursor: "pointer", marginBottom: 12 }}>
          <input type="checkbox" checked={showActor2} onChange={() => setShowActor2(!showActor2)} />
          Multi-Actor Event (Wedding — Bride + Groom)
        </label>

        {/* Results */}
        <div style={{ display: "grid", gridTemplateColumns: showActor2 ? "1fr 1fr" : "1fr", gap: 12 }}>
          {/* Actor 1 */}
          <div style={{
            padding: 16, borderRadius: 10,
            border: `2px solid ${relMeta1.color}`,
            background: wash(relMeta1.color, "12"),
          }}>
            <p style={{ ...labelSm, color: relMeta1.color }}>Actor 1: {nRashi1?.name} → {mRashi?.name}</p>
            <p style={{ ...headingMd, color: relMeta1.color, marginTop: 4 }}>{relMeta1.label}</p>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              padding: "3px 10px", borderRadius: 20, marginTop: 6,
              background: wash(relMeta1.color, "20"),
              fontFamily: fontFamilies.literarySerif, fontSize: 12, fontWeight: 600,
              color: relMeta1.color,
              textTransform: "uppercase" as const, letterSpacing: "0.06em",
            }}>
              {relMeta1.quality === "favourable" ? <CheckCircle2 size={12} /> : relMeta1.quality === "challenging" ? <AlertTriangle size={12} /> : <Circle size={12} />}
              {relMeta1.quality}
            </div>
            <p style={{ ...bodySm, fontSize: 13, marginTop: 8 }}>{relMeta1.description}</p>
          </div>

          {/* Actor 2 */}
          {showActor2 && (
            <div style={{
              padding: 16, borderRadius: 10,
              border: `2px solid ${relMeta2.color}`,
              background: wash(relMeta2.color, "12"),
            }}>
              <p style={{ ...labelSm, color: relMeta2.color }}>Actor 2: {nRashi2?.name} → {mRashi?.name}</p>
              <p style={{ ...headingMd, color: relMeta2.color, marginTop: 4 }}>{relMeta2.label}</p>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                padding: "3px 10px", borderRadius: 20, marginTop: 6,
                background: wash(relMeta2.color, "20"),
                fontFamily: fontFamilies.literarySerif, fontSize: 12, fontWeight: 600,
                color: relMeta2.color,
                textTransform: "uppercase" as const, letterSpacing: "0.06em",
              }}>
                {relMeta2.quality === "favourable" ? <CheckCircle2 size={12} /> : relMeta2.quality === "challenging" ? <AlertTriangle size={12} /> : <Circle size={12} />}
                {relMeta2.quality}
              </div>
              <p style={{ ...bodySm, fontSize: 13, marginTop: 8 }}>{relMeta2.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Scenario Screener */}
      <div style={cardBase}>
        <p style={{ ...headingMd, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <FileText size={20} /> Diagnostic Scenario Screener (§6 + §8)
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {SCENARIOS.map(sc => {
            const isOpen = openScenario === sc.id;
            const isRevealed = revealed.has(sc.id);
            return (
              <div key={sc.id} style={{
                border: `1px solid ${isOpen ? GOLD : HAIRLINE}`,
                borderRadius: 10, overflow: "hidden",
                background: isOpen ? wash(GOLD, "08") : "transparent",
                transition: "all 0.25s",
              }}>
                <button
                  onClick={() => setOpenScenario(isOpen ? null : sc.id)}
                  style={{
                    width: "100%", padding: "12px 16px", border: "none",
                    background: "transparent", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 10,
                    textAlign: "left" as const,
                  }}
                >
                  <span style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: wash(GOLD, "20"), color: GOLD,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: fontFamilies.literarySerif, fontSize: 14, fontWeight: 700,
                    flexShrink: 0,
                  }}>{sc.id}</span>
                  <span style={{ ...headingMd, fontSize: 15, flex: 1 }}>{sc.title}</span>
                  <ChevronRight size={16} style={{ transform: isOpen ? "rotate(90deg)" : "none", transition: "0.2s", color: INK_MUTED }} />
                </button>
                {isOpen && (
                  <div style={{ padding: "0 16px 16px" }}>
                    <p style={{ ...bodySm, marginBottom: 8 }}>{sc.situation}</p>
                    <div style={{ ...cardBase, background: SURFACE_2, padding: 12, marginBottom: 10 }}>
                      <p style={{ ...bodySm, fontSize: 13 }}>{sc.details}</p>
                    </div>
                    {/* Client quote */}
                    <div style={{
                      padding: "10px 14px", borderRadius: 8,
                      background: wash(BLUE, "10"), borderLeft: `3px solid ${BLUE}`,
                      marginBottom: 12,
                    }}>
                      <p style={{ ...bodySm, fontSize: 13, fontStyle: "italic", color: BLUE }}>
                        💬 Client: "{sc.clientQuote}"
                      </p>
                    </div>
                    {/* User diagnosis */}
                    {!isRevealed && (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                        <div>
                          <p style={{ ...labelSm, marginBottom: 4 }}>What issue applies?</p>
                          <select
                            value={userIssue[sc.id] || ""}
                            onChange={e => setUserIssue({ ...userIssue, [sc.id]: e.target.value as IssueKey })}
                            style={{
                              width: "100%", padding: "6px 8px", borderRadius: 6,
                              border: `1px solid ${HAIRLINE}`, background: SURFACE,
                              fontFamily: fontFamilies.literarySerif, fontSize: 13, color: INK_PRIMARY,
                            }}
                          >
                            <option value="">— Select —</option>
                            {Object.entries(ISSUE_LABELS).map(([k, v]) => (
                              <option key={k} value={k}>{v}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <p style={{ ...labelSm, marginBottom: 4 }}>Your verdict?</p>
                          <select
                            value={userVerdict[sc.id] || ""}
                            onChange={e => setUserVerdict({ ...userVerdict, [sc.id]: e.target.value as ScenarioVerdict })}
                            style={{
                              width: "100%", padding: "6px 8px", borderRadius: 6,
                              border: `1px solid ${HAIRLINE}`, background: SURFACE,
                              fontFamily: fontFamilies.literarySerif, fontSize: 13, color: INK_PRIMARY,
                            }}
                          >
                            <option value="">— Select —</option>
                            <option value="favourable">Favourable</option>
                            <option value="avoid">Avoid</option>
                            <option value="exception-applies">Exception Applies</option>
                            <option value="mixed">Mixed</option>
                            <option value="needs-adjustment">Needs Adjustment</option>
                          </select>
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => setRevealed(prev => new Set(prev).add(sc.id))}
                      style={{
                        padding: "8px 18px", borderRadius: 8, border: "none",
                        background: isRevealed ? wash(GREEN, "15") : wash(GOLD, "20"),
                        color: isRevealed ? GREEN : GOLD,
                        fontFamily: fontFamilies.literarySerif, fontSize: 14, fontWeight: 600,
                        cursor: "pointer", transition: "all 0.2s",
                      }}
                    >
                      {isRevealed ? "✓ Answer Revealed" : "Reveal Correct Answer"}
                    </button>
                    {isRevealed && (
                      <div style={{ marginTop: 12, padding: 14, borderRadius: 8, background: wash(GREEN, "08"), border: `1px solid ${wash(GREEN, "30")}` }}>
                        <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
                          <span style={{ ...labelSm, color: GREEN }}>
                            Issue: <strong>{ISSUE_LABELS[sc.expectedIssue]}</strong>
                          </span>
                          <span style={{ ...labelSm, color: GREEN }}>
                            Verdict: <strong style={{ textTransform: "capitalize" as const }}>{sc.expectedVerdict}</strong>
                          </span>
                        </div>
                        <p style={{ ...bodySm, fontSize: 13 }}>{sc.explanation}</p>
                        {/* Score feedback */}
                        {userIssue[sc.id] && userVerdict[sc.id] && (
                          <div style={{ marginTop: 8, display: "flex", gap: 12 }}>
                            <span style={{
                              ...labelSm, padding: "2px 8px", borderRadius: 12,
                              background: userIssue[sc.id] === sc.expectedIssue ? wash(GREEN, "20") : wash(VERMILION, "20"),
                              color: userIssue[sc.id] === sc.expectedIssue ? GREEN : VERMILION,
                            }}>
                              Issue: {userIssue[sc.id] === sc.expectedIssue ? "✓ Correct" : "✗ Review §8"}
                            </span>
                            <span style={{
                              ...labelSm, padding: "2px 8px", borderRadius: 12,
                              background: userVerdict[sc.id] === sc.expectedVerdict ? wash(GREEN, "20") : wash(VERMILION, "20"),
                              color: userVerdict[sc.id] === sc.expectedVerdict ? GREEN : VERMILION,
                            }}>
                              Verdict: {userVerdict[sc.id] === sc.expectedVerdict ? "✓ Correct" : "✗ Review §6"}
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
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   TAB 4 — Four-Pillar Capstone Integration Roadmap
   ════════════════════════════════════════════════════════════ */

function Tab4Capstone() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Four Pillars */}
      <div style={cardBase}>
        <p style={{ ...headingMd, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <Layers size={20} /> MC Chapter 24-Vicinity Four-Fold Capstone (§4.7)
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {FOUR_PILLARS.map(p => {
            const statusColor = p.status === "this-lesson" ? GOLD : p.status === "operational" ? GREEN : BLUE;
            const statusLabel = p.status === "this-lesson" ? "THIS LESSON ✦" : p.status === "operational" ? "OPERATIONAL ✓" : "PARTIALLY OPERATIONAL";
            return (
              <div key={p.number} style={{
                ...cardBase,
                borderLeft: `4px solid ${statusColor}`,
                background: p.status === "this-lesson" ? wash(GOLD, "08") : SURFACE,
                position: "relative" as const,
              }}>
                <div style={{
                  position: "absolute" as const, top: 8, right: 10,
                  ...labelSm, fontSize: 9, color: statusColor, fontWeight: 700,
                  padding: "2px 8px", borderRadius: 10, background: wash(statusColor, "15"),
                }}>
                  {statusLabel}
                </div>
                <p style={{ ...labelSm, color: statusColor }}>Pillar {p.number}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "4px 0" }}>
                  <Devanagari size="sm" surface="cream">{p.devanagari}</Devanagari>
                </div>
                <IAST size="sm" surface="cream">{p.iast}</IAST>
                <p style={{ ...headingMd, fontSize: 15, marginTop: 4 }}>{p.name}</p>
                <p style={{ ...bodySm, fontSize: 12, marginTop: 6 }}>{p.description}</p>
                <p style={{ ...labelSm, fontSize: 10, marginTop: 6, color: statusColor }}>{p.lessons}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Integration Pipeline */}
      <div style={cardBase}>
        <p style={{ ...headingMd, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <ListChecks size={20} /> Two-Step Canonical Operational Method
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {INTEGRATION_STEPS.map((step, i) => (
            <div key={step.step} style={{ display: "flex", gap: 14, position: "relative" as const }}>
              {/* Vertical connector */}
              {i < INTEGRATION_STEPS.length - 1 && (
                <div style={{
                  position: "absolute" as const, left: 15, top: 32, bottom: -8,
                  width: 2, background: `linear-gradient(to bottom, ${GOLD}40, ${GOLD}10)`,
                }} />
              )}
              {/* Step circle */}
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: step.step <= 1 ? wash(VERMILION, "20") : wash(GOLD, "15"),
                color: step.step <= 1 ? VERMILION : GOLD,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: fontFamilies.literarySerif, fontSize: 14, fontWeight: 700,
                flexShrink: 0, border: `2px solid ${step.step <= 1 ? VERMILION : GOLD}30`,
              }}>
                {step.step}
              </div>
              {/* Content */}
              <div style={{ paddingBottom: 16, flex: 1 }}>
                <p style={{ ...headingMd, fontSize: 15 }}>{step.label}</p>
                <p style={{ ...bodySm, fontSize: 13 }}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Classical Śloka Card */}
      <div style={{
        ...cardBase,
        background: "linear-gradient(135deg, #FFF9F0 0%, #F5EDD8 100%)",
        border: `2px solid ${GOLD}30`,
        textAlign: "center" as const,
      }}>
        <p style={{ ...labelSm, color: GOLD, marginBottom: 12 }}>
          Muhūrta-Cintāmaṇi 16.1 (per standard-edition paraphrase) — Lagna-Śuddhi Foundational Verse
        </p>
        <Devanagari size="lg" surface="cream" asElement="p" style={{ marginBottom: 8 }}>
          मुहूर्तलग्नभावानां कर्तृजन्मलग्नयोग्यता।{"\n"}
          विचार्या व्यवहारेऽस्मिन्सर्वसिद्धिप्रसिद्धये॥
        </Devanagari>
        <IAST size="md" surface="cream" asElement="p" style={{ marginBottom: 10 }}>
          muhūrta-lagna-bhāvānāṁ kartṛ-janma-lagna-yogyatā |{"\n"}
          vicāryā vyavahāre &apos;smin sarva-siddhi-prasiddhaye || 16.1 ||
        </IAST>
        <p style={{
          fontFamily: fontFamilies.literarySerif, fontSize: 16, lineHeight: 1.6,
          color: INK_PRIMARY, maxWidth: 520, margin: "0 auto",
        }}>
          "The fitness (<em>yogyatā</em>) of the muhūrta-chart's lagna and bhāvas
          in relation to the actor's natal lagna must be analysed in this practical-undertaking,
          for the accomplishment of all success."
        </p>
        <p style={{ ...labelSm, marginTop: 12, fontStyle: "italic" }}>
          Foundation for the lagna-śuddhi pillar of the MC Chapter 24-vicinity four-fold capstone
        </p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MAIN EXPORT — Tabbed Container
   ════════════════════════════════════════════════════════════ */

const TABS = [
  { key: "wheel",     label: "Lagna-Rāśi Wheel",        icon: Compass },
  { key: "evaluator", label: "3-Criterion Evaluator",    icon: BarChart3 },
  { key: "synergy",   label: "Synergy & Scenarios",      icon: Users },
  { key: "capstone",  label: "Four-Pillar Capstone",     icon: Layers },
] as const;

type TabKey = typeof TABS[number]["key"];

export function LagnaSuddhiEvaluator() {
  const [activeTab, setActiveTab] = useState<TabKey>("wheel");

  return (
    <section style={{ fontFamily: fontFamilies.literarySerif }}>
      {/* Tab bar */}
      <div style={{
        display: "flex", gap: 4, marginBottom: 20, flexWrap: "wrap",
        borderBottom: `2px solid ${HAIRLINE}`, paddingBottom: 2,
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
                background: active ? wash(GOLD, "18") : "transparent",
                color: active ? GOLD : INK_MUTED,
                fontFamily: fontFamilies.literarySerif,
                fontSize: 14, fontWeight: active ? 700 : 500,
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

      {/* Tab content */}
      {activeTab === "wheel"     && <Tab1Wheel />}
      {activeTab === "evaluator" && <Tab2Evaluator />}
      {activeTab === "synergy"   && <Tab3Synergy />}
      {activeTab === "capstone"  && <Tab4Capstone />}
    </section>
  );
}
