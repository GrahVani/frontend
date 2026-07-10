"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, BookOpen, Check, X, ArrowRight, Star, Info, ChevronDown
} from "lucide-react";
import {
  TARAS, NAKSHATRA_NAMES, KUTAS, DRILL_SCENARIOS, computeTara, Tara
} from "./data";

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GOLD_LIGHT = "#F4C77B";
const INDIGO = "#4F6FA8";
const JADE = "#3A8C5A";
const VERMILION = "#A23A1E";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";

const QUALITY_STYLES = {
  favourable:   { bg: "rgba(58, 140, 90, 0.12)",  fill: "#3A8C5A30", stroke: "#3A8C5A",  text: "#2A6B42", badge: "#3A8C5A", label: "Favourable" },
  unfavourable: { bg: "rgba(162, 58, 30, 0.10)",  fill: "#A23A1E20", stroke: "#A23A1E",  text: "#7A2E16", badge: "#A23A1E", label: "Unfavourable" },
  mixed:        { bg: "rgba(156, 122, 47, 0.12)",  fill: "#9C7A2F20", stroke: GOLD,       text: GOLD_DEEP, badge: GOLD,      label: "Mixed" },
};

type Tab = "wheel" | "drill";

export function TaraBalAWheel() {
  const [tab, setTab] = useState<Tab>("wheel");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "20px 22px 22px" }} data-interactive="tara-bala-wheel">
      <div role="tablist" aria-label="Tara Bala modes" style={{ display: "flex", gap: "10px", marginBottom: "24px", flexWrap: "wrap" }}>
        <TabButton active={tab === "wheel"} onClick={() => setTab("wheel")} label="Tāra Bala & Aṣṭa-Kūṭa" sublabel="Interactive Wheel + 8-Kūṭa Table" icon={<Star size={14} />} />
        <TabButton active={tab === "drill"} onClick={() => setTab("drill")} label="Knowledge Drill" sublabel="3 evaluation scenarios" icon={<BookOpen size={14} />} />
      </div>
      {tab === "wheel" ? <WheelView reducedMotion={reducedMotion} /> : <DrillView reducedMotion={reducedMotion} />}
    </div>
  );
}

function TabButton({ active, onClick, label, sublabel, icon }: { active: boolean; onClick: () => void; label: string; sublabel: string; icon: React.ReactNode }) {
  return (
    <button type="button" role="tab" aria-selected={active} onClick={onClick} className="gl-clickable gl-focus-ring"
      style={{
        flex: "1 1 260px", padding: "10px 14px",
        background: active ? "linear-gradient(180deg, rgba(255, 248, 230, 0.96) 0%, rgba(252, 240, 210, 0.92) 100%)" : "rgba(255, 251, 240, 0.55)",
        border: active ? `1.5px solid ${GOLD}` : "1.5px solid rgba(156, 122, 47, 0.30)",
        borderRadius: "10px", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: "10px",
      }}
    >
      <span style={{ width: "28px", height: "28px", flexShrink: 0, borderRadius: "50%", background: active ? `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})` : "rgba(156, 122, 47, 0.15)", color: active ? "#1A1408" : GOLD_DEEP, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{icon}</span>
      <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
        <span style={{ fontFamily: "var(--font-sans), system-ui, sans-serif", fontSize: "14px", fontWeight: 700, color: active ? GOLD_DEEP : INK_PRIMARY }}>{label}</span>
        <span style={{ fontFamily: "var(--font-sans), system-ui, sans-serif", fontSize: "12px", color: INK_MUTED, marginTop: "2px" }}>{sublabel}</span>
      </span>
    </button>
  );
}

/* ─── SVG Helpers ─── */
function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg - 90) * Math.PI / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, start: number, end: number) {
  const s = polarToCartesian(cx, cy, r, end);
  const e = polarToCartesian(cx, cy, r, start);
  const large = end - start <= 180 ? "0" : "1";
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 0 ${e.x} ${e.y} L ${cx} ${cy} Z`;
}

/* ─── Data type for computed mapping ─── */
interface TaraMapping {
  tara: Tara;
  nakshatras: { name: string; globalIndex: number }[];
}

/* ─── Wheel View ─── */
function WheelView({ reducedMotion }: { reducedMotion: boolean }) {
  const [janmaIndex, setJanmaIndex] = useState(3); // Rohini default (0-based)
  const [selectedTaraNum, setSelectedTaraNum] = useState<number | null>(null);

  // Compute the full tārā mapping every time janmaIndex changes
  const taraMap: TaraMapping[] = useMemo(() => {
    return TARAS.map(tara => {
      const naks: { name: string; globalIndex: number }[] = [];
      for (let i = 0; i < 27; i++) {
        if (computeTara(janmaIndex, i) === tara.number) {
          naks.push({ name: NAKSHATRA_NAMES[i], globalIndex: i + 1 });
        }
      }
      return { tara, nakshatras: naks };
    });
  }, [janmaIndex]);

  const selectedMapping = selectedTaraNum !== null ? taraMap[selectedTaraNum - 1] : null;
  const selectedQc = selectedMapping ? QUALITY_STYLES[selectedMapping.tara.quality] : null;

  return (
    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>

      {/* ─── Left Column ─── */}
      <div style={{ flex: "0 0 240px", display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* Janma Selector */}
        <div>
          <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: GOLD_DEEP, fontWeight: 700, display: "block", marginBottom: "6px" }}>
            Your Janma-Nakṣatra
          </label>
          <div style={{ position: "relative" }}>
            <select
              value={janmaIndex}
              onChange={(e) => { setJanmaIndex(Number(e.target.value)); setSelectedTaraNum(null); }}
              style={{
                width: "100%", padding: "10px 32px 10px 12px", borderRadius: "8px",
                border: `1.5px solid ${GOLD_LIGHT}`, background: "rgba(255, 251, 240, 0.9)",
                fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 600,
                color: INK_PRIMARY, cursor: "pointer", appearance: "none",
                WebkitAppearance: "none"
              }}
            >
              {NAKSHATRA_NAMES.map((name, i) => (
                <option key={i} value={i}>{i + 1}. {name}</option>
              ))}
            </select>
            <ChevronDown size={16} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: GOLD_DEEP }} />
          </div>
        </div>

        {/* Tārā Summary Strip — 9 compact items showing which nakṣatras are in each */}
        <div>
          <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: INDIGO, fontWeight: 700, marginBottom: "8px" }}>
            9 Tārā Classifications
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px", maxHeight: "280px", overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: `${GOLD_LIGHT} transparent` }}>
            {taraMap.map(({ tara, nakshatras }) => {
              const isSelected = selectedTaraNum === tara.number;
              const qc = QUALITY_STYLES[tara.quality];
              return (
                <button key={tara.number}
                  onClick={() => setSelectedTaraNum(isSelected ? null : tara.number)}
                  style={{
                    textAlign: "left", padding: "7px 10px", borderRadius: "6px",
                    background: isSelected ? qc.bg : "transparent",
                    borderLeft: `3px solid ${isSelected ? qc.stroke : "transparent"}`,
                    cursor: "pointer",
                    transition: reducedMotion ? "none" : "all 0.2s ease",
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", minWidth: 0 }}>
                    <span style={{
                      width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0,
                      background: qc.badge, color: "#FFF", fontSize: "11px", fontWeight: 800,
                      display: "inline-flex", alignItems: "center", justifyContent: "center"
                    }}>
                      {tara.number}
                    </span>
                    <span style={{ fontSize: "13px", fontWeight: isSelected ? 700 : 500, color: isSelected ? qc.text : INK_PRIMARY, fontFamily: "var(--font-sans)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {tara.name}
                    </span>
                  </div>
                  <span style={{ fontSize: "10px", color: INK_MUTED, fontWeight: 600, flexShrink: 0 }}>
                    {nakshatras.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Aṣṭa-Kūṭa Mini-Table */}
        <div>
          <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: INDIGO, fontWeight: 700, marginBottom: "6px" }}>
            Aṣṭa-Kūṭa (36 pts)
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {KUTAS.map(k => (
              <div key={k.number} style={{
                flex: "1 1 100px", padding: "5px 8px", borderRadius: "5px",
                background: "rgba(255, 251, 240, 0.6)", border: "1px solid rgba(156, 122, 47, 0.10)",
                display: "flex", alignItems: "center", justifyContent: "space-between"
              }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: INK_PRIMARY }}>{k.name}</span>
                <span style={{
                  fontSize: "11px", fontWeight: 800, color: "#FFF",
                  background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})`,
                  borderRadius: "8px", padding: "1px 6px"
                }}>{k.maxPoints}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: "11px", color: INK_MUTED, marginTop: "4px" }}>
            ≥ 18 = compatible • ≥ 27 = highly compatible
          </div>
        </div>
      </div>

      {/* ─── Right Column: Wheel + Detail ─── */}
      <div style={{ flex: 1, minWidth: "320px", display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>

        {/* Janma Info Card */}
        <AnimatePresence mode="wait">
          <motion.div key={janmaIndex}
            initial={reducedMotion ? undefined : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              width: "100%", padding: "12px 16px", background: "rgba(255, 251, 240, 0.8)",
              border: `1px solid ${GOLD_LIGHT}`, borderRadius: "10px",
              boxShadow: "0 3px 10px rgba(156, 122, 47, 0.08)",
              display: "flex", alignItems: "center", gap: "12px"
            }}
          >
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>
              <Sparkles size={16} />
            </div>
            <div>
              <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: INK_MUTED, fontWeight: 700 }}>
                Janma-Nakṣatra #{janmaIndex + 1}
              </div>
              <div style={{ fontSize: "17px", fontFamily: "var(--font-cormorant)", color: INK_PRIMARY, fontWeight: 600 }}>
                {NAKSHATRA_NAMES[janmaIndex]} — <span style={{ color: GOLD_DEEP }}>Tārā Map Active</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* The 9-Tārā SVG Wheel */}
        <AnimatePresence mode="wait">
          <motion.div key={`wheel-${janmaIndex}`}
            initial={reducedMotion ? undefined : { opacity: 0, scale: 0.95, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ width: "340px", height: "340px" }}
          >
            <svg viewBox="0 0 360 360" width="100%" height="100%">
              <defs>
                <filter id="tara-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {taraMap.map(({ tara, nakshatras }, i) => {
                const angleSize = 360 / 9;
                const startAngle = i * angleSize;
                const endAngle = (i + 1) * angleSize;
                const midAngle = startAngle + angleSize / 2;
                const isSelected = selectedTaraNum === tara.number;
                const qc = QUALITY_STYLES[tara.quality];

                const namePos = polarToCartesian(180, 180, 95, midAngle);
                const countPos = polarToCartesian(180, 180, 125, midAngle);

                // Show first nakshatra name on outer ring
                const outerPos = polarToCartesian(180, 180, 152, midAngle);
                const firstNak = nakshatras.length > 0 ? nakshatras[0].name : "";
                // Truncate long names
                const nakLabel = firstNak.length > 8 ? firstNak.substring(0, 7) + "…" : firstNak;

                return (
                  <g key={tara.number}
                    onClick={() => setSelectedTaraNum(isSelected ? null : tara.number)}
                    style={{ cursor: "pointer" }}
                  >
                    {/* Wedge */}
                    <path
                      d={describeArc(180, 180, 140, startAngle, endAngle)}
                      fill={isSelected ? qc.fill : tara.quality === "unfavourable" ? "rgba(162, 58, 30, 0.04)" : tara.quality === "favourable" ? "rgba(58, 140, 90, 0.04)" : "rgba(156, 122, 47, 0.04)"}
                      stroke={isSelected ? qc.stroke : "rgba(156, 122, 47, 0.15)"}
                      strokeWidth={isSelected ? "2.5" : "1"}
                      filter={isSelected ? "url(#tara-glow)" : undefined}
                      style={{ transition: "all 0.3s ease" }}
                    />

                    {/* Quality dot */}
                    <circle cx={polarToCartesian(180, 180, 60, midAngle).x} cy={polarToCartesian(180, 180, 60, midAngle).y}
                      r="4" fill={qc.badge} opacity={isSelected ? 1 : 0.4}
                      style={{ transition: "opacity 0.3s ease" }}
                    />

                    {/* Tārā Name */}
                    <text x={namePos.x} y={namePos.y - 6} textAnchor="middle" alignmentBaseline="middle"
                      fill={isSelected ? qc.text : INK_MUTED} fontSize="11" fontWeight="700"
                      fontFamily="var(--font-sans)" letterSpacing="0.02em"
                    >
                      {tara.name}
                    </text>

                    {/* Nakshatra count badge */}
                    <text x={namePos.x} y={namePos.y + 8} textAnchor="middle" alignmentBaseline="middle"
                      fill={isSelected ? qc.text : INK_MUTED} fontSize="9" fontWeight="600"
                      fontFamily="var(--font-sans)" opacity={0.7}
                    >
                      {nakshatras.length} nak.
                    </text>

                    {/* First Nakshatra name on outer ring */}
                    <text x={outerPos.x} y={outerPos.y} textAnchor="middle" alignmentBaseline="middle"
                      fill={isSelected ? qc.text : INK_MUTED} fontSize="8" fontWeight="600"
                      fontFamily="var(--font-sans)" opacity={isSelected ? 1 : 0.5}
                      transform={`rotate(${midAngle}, ${outerPos.x}, ${outerPos.y})`}
                    >
                      {nakLabel}
                    </text>
                  </g>
                );
              })}

              {/* Center Hub */}
              <circle cx="180" cy="180" r="38" fill="rgba(255, 251, 240, 0.95)" stroke={GOLD_LIGHT} strokeWidth="2" />
              <text x="180" y="174" textAnchor="middle" fill={GOLD_DEEP} fontSize="10" fontWeight="700" letterSpacing="0.08em">TĀRA</text>
              <text x="180" y="188" textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight="600">BALA</text>
            </svg>
          </motion.div>
        </AnimatePresence>

        {/* ─── Detail Panel — shows content when a tārā is clicked ─── */}
        <div style={{
          width: "100%", padding: "14px 18px", borderRadius: "10px", minHeight: "120px",
          background: selectedQc ? selectedQc.bg : "rgba(255, 251, 240, 0.5)",
          border: selectedQc ? `1px solid ${selectedQc.stroke}40` : "1px solid rgba(156, 122, 47, 0.12)",
          transition: reducedMotion ? "none" : "all 0.3s ease",
          display: "flex", flexDirection: "column", justifyContent: "center"
        }}>
          {selectedMapping ? (
            <AnimatePresence mode="wait">
              <motion.div key={`${janmaIndex}-${selectedTaraNum}`}
                initial={reducedMotion ? undefined : { opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                {/* Header row */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <span style={{
                    fontSize: "10px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em",
                    padding: "3px 10px", borderRadius: "12px",
                    background: selectedQc!.badge, color: "#FFF"
                  }}>
                    {selectedQc!.label}
                  </span>
                  <span style={{ fontSize: "12px", color: INK_MUTED }}>
                    Position #{selectedMapping.tara.number} from Janma
                  </span>
                </div>

                {/* Name + Sanskrit */}
                <div style={{ fontSize: "20px", fontFamily: "var(--font-cormorant)", fontWeight: 700, color: selectedQc!.text }}>
                  {selectedMapping.tara.name} <span style={{ fontSize: "14px", fontWeight: 500, color: INK_MUTED }}>({selectedMapping.tara.sanskrit})</span>
                </div>

                {/* Description */}
                <div style={{ fontSize: "13px", color: INK_SECONDARY, lineHeight: 1.5 }}>
                  {selectedMapping.tara.description}
                </div>

                {/* Nakṣatras in this Tārā — the KEY dynamic content */}
                <div style={{
                  marginTop: "4px", padding: "10px 12px", borderRadius: "8px",
                  background: "rgba(255, 251, 240, 0.6)", border: `1px solid ${selectedQc!.stroke}20`
                }}>
                  <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: selectedQc!.text, fontWeight: 700, marginBottom: "6px" }}>
                    Nakṣatras falling in {selectedMapping.tara.name} (from {NAKSHATRA_NAMES[janmaIndex]})
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {selectedMapping.nakshatras.map(n => (
                      <span key={n.globalIndex} style={{
                        padding: "4px 10px", borderRadius: "14px", fontSize: "12px", fontWeight: 600,
                        background: selectedQc!.bg, border: `1px solid ${selectedQc!.stroke}40`,
                        color: selectedQc!.text, fontFamily: "var(--font-sans)"
                      }}>
                        {n.globalIndex}. {n.name}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div style={{ textAlign: "center", color: INK_MUTED, fontSize: "13px" }}>
              <Star size={20} style={{ marginBottom: "6px", opacity: 0.4 }} /><br />
              Click a segment on the wheel or a tārā in the left list<br />
              to see which nakṣatras fall in that category
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Drill View ─── */
function DrillView({ reducedMotion }: { reducedMotion: boolean }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const scenario = DRILL_SCENARIOS[index];
  const isLast = index === DRILL_SCENARIOS.length - 1;

  const handleSubmit = () => { if (!selected) return; setSubmitted(true); };
  const handleNext = () => { setSelected(null); setSubmitted(false); if (!isLast) setIndex(i => i + 1); };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 700, color: INDIGO, letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 }}>
          Scenario {index + 1} of {DRILL_SCENARIOS.length}
        </p>
        <div style={{ display: "flex", gap: "4px" }}>
          {DRILL_SCENARIOS.map((_, i) => (
            <span key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: i === index ? INDIGO : "rgba(79, 111, 168, 0.25)", transition: reducedMotion ? "none" : "background 250ms ease" }} />
          ))}
        </div>
      </div>

      <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "20px", fontWeight: 500, color: INK_PRIMARY, lineHeight: 1.4, margin: 0 }}>
        {scenario.question}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {scenario.options.map((opt) => {
          const isSelected = selected === opt.id;
          const showCorrect = submitted && opt.isCorrect;
          const showWrong = submitted && isSelected && !opt.isCorrect;
          return (
            <button key={opt.id} type="button" disabled={submitted}
              onClick={() => !submitted && setSelected(opt.id)}
              className="gl-focus-ring gl-clickable" aria-pressed={isSelected}
              style={{
                width: "100%", textAlign: "left", padding: "12px 14px", borderRadius: "8px",
                background: showCorrect ? "rgba(58, 140, 90, 0.10)" : showWrong ? "rgba(162, 58, 30, 0.10)" : isSelected ? "rgba(79, 111, 168, 0.10)" : "rgba(255, 252, 240, 0.55)",
                border: showCorrect ? "1.5px solid #3A8C5A" : showWrong ? "1.5px solid #A23A1E" : isSelected ? `1.5px solid ${INDIGO}` : "1px solid rgba(156, 122, 47, 0.20)",
                cursor: submitted ? "default" : "pointer", transition: reducedMotion ? "none" : "all 250ms ease",
                display: "flex", alignItems: "flex-start", gap: "10px",
              }}
            >
              <span style={{
                width: "24px", height: "24px", flexShrink: 0, borderRadius: "50%",
                background: showCorrect ? "#3A8C5A" : showWrong ? "#A23A1E" : isSelected ? INDIGO : "rgba(156, 122, 47, 0.15)",
                color: showCorrect || showWrong || isSelected ? "#FFF" : GOLD_DEEP,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 700, marginTop: "2px"
              }}>
                {showCorrect ? <Check size={14} /> : showWrong ? <X size={14} /> : opt.id}
              </span>
              <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "15px", color: INK_PRIMARY, lineHeight: 1.45, fontWeight: isSelected ? 600 : 400 }}>{opt.label}</span>
                {submitted && (
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: "14px", color: opt.isCorrect ? JADE : showWrong ? VERMILION : INK_MUTED, lineHeight: 1.5, marginTop: "4px" }}>
                    {opt.explanation}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "4px" }}>
        {!submitted ? (
          <button type="button" onClick={handleSubmit} disabled={!selected} className="gl-focus-ring gl-clickable"
            style={{
              padding: "10px 18px", borderRadius: "8px",
              background: selected ? `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})` : "rgba(156, 122, 47, 0.15)",
              color: selected ? "#1A1408" : GOLD_DEEP, border: "none",
              fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 700,
              cursor: selected ? "pointer" : "not-allowed", transition: reducedMotion ? "none" : "all 250ms ease"
            }}
          >Check answer</button>
        ) : (
          <button type="button" onClick={handleNext} className="gl-focus-ring gl-clickable"
            style={{
              padding: "10px 18px", borderRadius: "8px",
              background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})`,
              color: "#1A1408", border: "none",
              fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 700,
              cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px"
            }}
          >
            {isLast ? "Finish drill" : "Next scenario"}
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
