"use client";
import { useState, useMemo } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Clock, Calculator, AlertTriangle, ChevronRight, RotateCcw, Terminal, ArrowRightLeft, Sparkles, BadgeCheck } from "lucide-react";

const GOLD = "#C28220";
const INDIGO = "#4A6FA5";
const VERMILION = "#A23A1E";
const JADE = "#2F8C5A";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function isLeap(y: number) { return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0); }
function dayOfYear(y: number, m: number, d: number) {
  let doy = d;
  for (let i = 0; i < m - 1; i++) { doy += MONTH_DAYS[i]; if (i === 1 && isLeap(y)) doy += 1; }
  return doy;
}
function toDMS(decimalDeg: number): string {
  const d = Math.floor(decimalDeg);
  const mFull = (decimalDeg - d) * 60;
  const m = Math.floor(mFull);
  const s = Math.round((mFull - m) * 60);
  return `${d}°${m.toString().padStart(2, "0")}′${s.toString().padStart(2, "0")}″`;
}
function computeLahiri(year: number, month: number, day: number) {
  const yearsElapsed = year - 285;
  const doy = dayOfYear(year, month, day);
  const fractionOfYear = doy / 365.25;
  const yearsFromAlignment = yearsElapsed + fractionOfYear - 0.219;
  const arcSeconds = yearsFromAlignment * 50.2388;
  return arcSeconds / 3600;
}

const COMPARISON_TABLE = [
  { year: 1985, lahiri: "23°37′00″", krishnamurti: "23°31′00″", diff: "6′" },
  { year: 2000, lahiri: "23°51′00″", krishnamurti: "23°45′00″", diff: "6′" },
  { year: 2026, lahiri: "24°19′01″", krishnamurti: "24°13′01″", diff: "6′" },
  { year: 2050, lahiri: "24°39′00″", krishnamurti: "24°33′00″", diff: "6′" },
];

const MILESTONES = [
  { year: 1908, label: "Born", detail: "K.S. Krishnamurti born in Tamil Nadu" },
  { year: 1963, label: "KP Reader I", detail: "Publishes foundational KP Reader series" },
  { year: 1972, label: "Died", detail: "Passes; KP lineage continues through students" },
];

const ARIES_NAKSHATRAS = [
  { name: "Aśvinī", start: 0, end: 13 + 20 / 60, lord: "Ketu" },
  { name: "Bharaṇī", start: 13 + 20 / 60, end: 26 + 40 / 60, lord: "Venus" },
  { name: "Kṛttikā", start: 26 + 40 / 60, end: 30, lord: "Sun" },
];

function nakshatraAt(deg: number) {
  for (const n of ARIES_NAKSHATRAS) {
    if (deg >= n.start && deg < n.end) return n;
  }
  return ARIES_NAKSHATRAS[ARIES_NAKSHATRAS.length - 1];
}

export function KrishnamurtiAyanamshaExplorer() {
  const [tab, setTab] = useState<"context" | "calculator" | "boundary">("context");
  const [year, setYear] = useState<string>("2026");
  const [month, setMonth] = useState<string>("6");
  const [day, setDay] = useState<string>("15");
  const [result, setResult] = useState<{ lahiriDeg: number; krishnamurtiDeg: number } | null>(null);
  const [boundaryDeg, setBoundaryDeg] = useState<number>(13.27);

  const handleCalc = () => {
    const y = parseInt(year, 10);
    const m = parseInt(month, 10);
    const d = parseInt(day, 10);
    if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return;
    const lahiriDeg = computeLahiri(y, m, d);
    const krishnamurtiDeg = lahiriDeg - (6 / 60); // 6 arc-minutes less
    setResult({ lahiriDeg, krishnamurtiDeg });
  };

  const lahiriSidereal = boundaryDeg;
  const krishnamurtiSidereal = boundaryDeg + (6 / 60);
  const lahiriNak = nakshatraAt(lahiriSidereal >= 30 ? lahiriSidereal - 30 : lahiriSidereal);
  const krishnamurtiNak = nakshatraAt(krishnamurtiSidereal >= 30 ? krishnamurtiSidereal - 30 : krishnamurtiSidereal);
  const boundaryDiffers = lahiriNak.name !== krishnamurtiNak.name;


  return (
    <div data-interactive="krishnamurti-ayanamsha-explorer" style={{ maxWidth: "960px", margin: "0 auto", color: INK_PRIMARY, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
      {/* Top Banner and Tabs */}
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1.25rem", marginBottom: "1rem", boxShadow: "0 4px 20px -2px rgba(74, 111, 165, 0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: INDIGO, fontWeight: 900, background: `${INDIGO}15`, padding: "2px 8px", borderRadius: "4px" }}>Ayanāṁśa Explorer</span>
              <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: GOLD, fontWeight: 900, background: `${GOLD}15`, padding: "2px 8px", borderRadius: "4px" }}>Stream Spec</span>
            </div>
            <h2 style={{ margin: "0.4rem 0 0.2rem", color: INDIGO, fontSize: "1.45rem", fontFamily: "var(--font-cormorant), serif", fontWeight: 700 }}>
              Krishnamurti Ayanāṁśa Explorer
            </h2>
            <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "13px", lineHeight: 1.55 }}>
              Examine the historical alignment epoch (285 CE) and trace the constant 6 arc-minute (0.1°) mathematical offset between Lahiri and Krishnamurti conventions.
            </p>
          </div>
            <button
              type="button"
              onClick={() => {
                setTab("context");
                setYear("2026");
                setMonth("6");
                setDay("15");
                setResult(null);
                setBoundaryDeg(13.27);
              }}
              style={buttonStyle(false, INDIGO)}
            >
              <RotateCcw size={14} />
              Reset
            </button>
        </div>
      </section>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        {[
          { key: "context" as const, label: "Context & Historical Comparison", icon: <Clock size={14} /> },
          { key: "calculator" as const, label: "Calculative Conversion", icon: <Calculator size={14} /> },
          { key: "boundary" as const, label: "Aśvinī-Bharaṇī Boundary Case", icon: <AlertTriangle size={14} /> },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "8px 16px", borderRadius: "999px", border: "none",
              cursor: "pointer", fontSize: "13px", fontWeight: 700,
              transition: "all 180ms ease",
              background: tab === t.key ? INDIGO : `${INDIGO}12`,
              color: tab === t.key ? "#FFF" : INDIGO,
            }}
          >
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════
          TAB 1 — Context & Comparison
         ═══════════════════════════════════════════════════════════ */}
      {tab === "context" && (
        <div style={{ display: "grid", gap: "1.25rem" }}>
          {/* Timeline */}
          <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1.25rem" }}>
            <h4 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1.25rem", fontWeight: 700, color: INDIGO, margin: "0 0 1rem" }}>
              Lineage Milestones: K.S. Krishnamurti (1908 – 1972)
            </h4>
            <div style={{ overflowX: "auto" }}>
              <svg viewBox="0 0 640 100" style={{ width: "100%", height: "auto", minWidth: "500px", display: "block" }}>
                <line x1="40" y1="55" x2="600" y2="55" stroke={`${INDIGO}33`} strokeWidth="2" />
                {MILESTONES.map((m, i) => {
                  const x = 80 + i * 240;
                  const isPeak = m.year === 1963;
                  return (
                    <g key={m.year}>
                      <circle cx={x} cy="55" r={isPeak ? 8 : 5} fill={isPeak ? GOLD : INDIGO} stroke="#FFF" strokeWidth="2" />
                      <text x={x} y="35" textAnchor="middle" fontSize="11" fill={isPeak ? GOLD : INDIGO} fontWeight={800} fontFamily="monospace">{m.year}</text>
                      <text x={x} y="74" textAnchor="middle" fontSize="11" fill={INK_PRIMARY} fontWeight={700}>{m.label}</text>
                      <text x={x} y="88" textAnchor="middle" fontSize="10" fill={INK_MUTED} fontWeight={500}>{m.detail}</text>
                      {isPeak && <text x={x} y="20" textAnchor="middle" fontSize="10" fill={GOLD} fontWeight={900}>★ Foundational Texts</text>}
                    </g>
                  );
                })}
              </svg>
            </div>
          </section>

          {/* Two-column: spec + 1-249 */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
            <div style={{ border: `1px solid ${INDIGO}33`, background: `${INDIGO}06`, borderRadius: 12, padding: "1.25rem" }}>
              <h5 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1.1rem", fontWeight: 700, color: INDIGO, margin: "0 0 0.8rem" }}>The Krishnamurti Convention Specs</h5>
              <ul style={{ padding: 0, margin: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  "Uses Spica (Citrā) alignment star similarly to Lahiri's baseline.",
                  "Applies refined solar orbit and precession rate calculations.",
                  "Outputs a constant shift of 6 arc-minutes (0.1°) less than Lahiri.",
                  "Operational rule: Krishnamurti Ayanāṁśa = Lahiri Ayanāṁśa − 0.1°.",
                ].map((p, i) => (
                  <li key={i} style={{ fontSize: "12.5px", color: INK_SECONDARY, lineHeight: 1.5, paddingLeft: "14px", position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, top: "6px", width: "5px", height: "5px", borderRadius: "50%", background: INDIGO }} />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ border: `1px solid ${GOLD}33`, background: `${GOLD}06`, borderRadius: 12, padding: "1.25rem" }}>
              <h5 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1.1rem", fontWeight: 700, color: GOLD, margin: "0 0 0.8rem" }}>KP Horary 1-249 Sub-Lord System</h5>
              <p style={{ fontSize: "12.5px", color: INK_SECONDARY, lineHeight: 1.6, margin: 0 }}>
                The 249 sub-lord coordinates are mathematically defined using the <strong>Krishnamurti ayanāṁśa</strong>. The 27 nakṣatras are divided into 9 Vimshottari fractional sub-lord sectors, with 6 transitional boundaries adjusted to fit the 1-249 table. Substituting Lahiri ayanāṁśa will lead to boundary errors.
              </p>
            </div>
          </div>

          {/* Comparison table */}
          <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1.25rem", maxWidth: "540px", margin: "0 auto", width: "100%" }}>
            <h5 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1.15rem", fontWeight: 700, color: INK_PRIMARY, marginBottom: "1rem", textAlign: "center" }}>
              Epoch Drift Comparison (Lahiri vs Krishnamurti)
            </h5>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 12px", borderBottom: `2px solid ${HAIRLINE}`, fontWeight: 900, fontSize: "11px", color: INK_MUTED, textTransform: "uppercase" }}>
                <span style={{ width: "60px" }}>Year</span>
                <span style={{ width: "110px", textAlign: "center" }}>Lahiri Value</span>
                <span style={{ width: "110px", textAlign: "center" }}>KP Value</span>
                <span style={{ width: "60px", textAlign: "right" }}>Offset</span>
              </div>
              {COMPARISON_TABLE.map((r) => (
                <div
                  key={r.year}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    background: r.year === 2026 ? `${INDIGO}0D` : "transparent",
                    border: `1px solid ${r.year === 2026 ? INDIGO : "transparent"}33`
                  }}
                >
                  <span style={{ fontSize: "12.5px", color: INK_PRIMARY, fontWeight: 700, width: "60px" }}>{r.year} CE</span>
                  <span style={{ fontSize: "12.5px", color: GOLD, fontWeight: 800, fontFamily: "monospace", width: "110px", textAlign: "center" }}>{r.lahiri}</span>
                  <span style={{ fontSize: "12.5px", color: INDIGO, fontWeight: 800, fontFamily: "monospace", width: "110px", textAlign: "center" }}>{r.krishnamurti}</span>
                  <span style={{ fontSize: "12px", color: VERMILION, fontWeight: 800, width: "60px", textAlign: "right" }}>-{r.diff}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          TAB 2 — Calculator
         ═══════════════════════════════════════════════════════════ */}
      {tab === "calculator" && (
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1.25rem", maxWidth: "680px", margin: "0 auto", width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
            <h4 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1.35rem", fontWeight: 700, color: INDIGO, margin: "0 0 0.25rem" }}>
              Krishnamurti Ayanāṁśa Converter
            </h4>
            <p style={{ fontSize: "12px", color: INK_MUTED, margin: 0 }}>
              Calculates high-precision values for any date by applying the 285 CE epoch precession model.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem", flexWrap: "wrap", background: "rgba(74, 111, 165, 0.04)", padding: "1rem", borderRadius: "8px", border: `1px solid ${INDIGO}18` }}>
            <label style={labelStyleInline}>
              Year:
              <select value={year} onChange={(e) => { setYear(e.target.value); setResult(null); }} style={selectStyle}>
                {Array.from({ length: 150 }, (_, i) => 1900 + i).map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </label>
            <label style={labelStyleInline}>
              Month:
              <select value={month} onChange={(e) => { setMonth(e.target.value); setResult(null); }} style={selectStyle}>
                {MONTH_NAMES.map((name, i) => <option key={i + 1} value={i + 1}>{name}</option>)}
              </select>
            </label>
            <label style={labelStyleInline}>
              Day:
              <input type="number" min={1} max={31} value={day} onChange={(e) => { setDay(e.target.value); setResult(null); }} style={numInputStyle} />
            </label>
            <button onClick={handleCalc} style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "10px 18px", borderRadius: "6px", border: "none", background: INDIGO, color: "#FFF", fontSize: "13px", fontWeight: 700, cursor: "pointer", transition: "background 150ms ease" }}>
              <ChevronRight size={15} /> Compute
            </button>
          </div>

          {result ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                <div style={{ background: `${GOLD}06`, borderRadius: "8px", padding: "12px", textAlign: "center", border: `1px solid ${GOLD}20` }}>
                  <p style={{ fontSize: "10px", color: INK_MUTED, textTransform: "uppercase", fontWeight: 700, margin: "0 0 4px" }}>Lahiri (Standard)</p>
                  <p style={{ fontSize: "18px", fontWeight: 800, color: GOLD, fontFamily: "monospace", margin: 0 }}>{toDMS(result.lahiriDeg)}</p>
                </div>
                <div style={{ background: `${INDIGO}06`, borderRadius: "8px", padding: "12px", textAlign: "center", border: `1px solid ${INDIGO}20` }}>
                  <p style={{ fontSize: "10px", color: INK_MUTED, textTransform: "uppercase", fontWeight: 700, margin: "0 0 4px" }}>Krishnamurti (KP)</p>
                  <p style={{ fontSize: "18px", fontWeight: 800, color: INDIGO, fontFamily: "monospace", margin: 0 }}>{toDMS(result.krishnamurtiDeg)}</p>
                </div>
                <div style={{ background: `${VERMILION}06`, borderRadius: "8px", padding: "12px", textAlign: "center", border: `1px solid ${VERMILION}20` }}>
                  <p style={{ fontSize: "10px", color: INK_MUTED, textTransform: "uppercase", fontWeight: 700, margin: "0 0 4px" }}>Exact Offset</p>
                  <p style={{ fontSize: "18px", fontWeight: 800, color: VERMILION, fontFamily: "monospace", margin: 0 }}>0°06′00″</p>
                </div>
              </div>

              <div style={{ background: "rgba(252,245,224,0.3)", borderRadius: "8px", padding: "1rem", border: `1px solid ${HAIRLINE}` }}>
                <h5 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "15px", fontWeight: 700, color: INDIGO, margin: "0 0 8px" }}>Calculative Progression</h5>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "22px", height: "22px", borderRadius: "50%", background: GOLD, color: "#FFF", fontSize: "11px", fontWeight: 800 }}>1</span>
                    <p style={{ fontSize: "12.5px", color: INK_PRIMARY, margin: 0 }}>Lahiri Baseline: <code style={{ color: GOLD, fontWeight: 800 }}>{toDMS(result.lahiriDeg)}</code></p>
                  </div>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "22px", height: "22px", borderRadius: "50%", background: INDIGO, color: "#FFF", fontSize: "11px", fontWeight: 800 }}>2</span>
                    <p style={{ fontSize: "12.5px", color: INK_PRIMARY, margin: 0 }}>Apply Krishnamurti correction (-0.1°): <code style={{ color: INDIGO, fontWeight: 800 }}>{toDMS(result.krishnamurtiDeg)}</code></p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "2rem", border: `1px dashed ${HAIRLINE}`, borderRadius: "8px", color: INK_MUTED, fontSize: "13px" }}>
              Input parameters and click Compute above to generate epoch coordinates.
            </div>
          )}
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          TAB 3 — Boundary Case Visualiser
         ═══════════════════════════════════════════════════════════ */}
      {tab === "boundary" && (
        <div style={{ display: "grid", gap: "1.25rem" }}>
          <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1.25rem" }}>
            <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
              <h4 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1.35rem", fontWeight: 700, color: INK_PRIMARY, margin: "0 0 0.25rem" }}>
                Aśvinī-Bharaṇī Boundary Crossing
              </h4>
              <p style={{ fontSize: "12px", color: INK_MUTED, margin: 0 }}>
                Adjust the slider to verify how the 6′ (0.1°) offset triggers a change in the Vimshottari daśā lord assignment.
              </p>
            </div>

            {/* Slider */}
            <div style={{ maxWidth: "600px", margin: "0 auto 1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "12px", fontWeight: 700 }}>
                <span style={{ color: INK_MUTED }}>0° Aries</span>
                <span style={{ color: INDIGO }}>Lahiri Coordinate: {boundaryDeg.toFixed(2)}° Aries</span>
                <span style={{ color: INK_MUTED }}>30° Aries</span>
              </div>
              <input
                type="range"
                min={0}
                max={30}
                step={0.01}
                value={boundaryDeg}
                onChange={(e) => setBoundaryDeg(parseFloat(e.target.value))}
                style={{ width: "100%", accentColor: INDIGO, cursor: "pointer" }}
              />
            </div>

            {/* Nakṣatra strip */}
            <div style={{ maxWidth: "600px", margin: "0 auto 1.5rem", position: "relative", height: "80px", background: `${GOLD}06`, borderRadius: "8px", border: `1px solid ${GOLD}20`, overflow: "hidden" }}>
              {/* Nakṣatra zones */}
              <div style={{ position: "absolute", left: "0%", width: `${(13 + 20 / 60) / 30 * 100}%`, height: "100%", background: `${JADE}10`, borderRight: `1.5px solid ${JADE}33` }}>
                <p style={{ position: "absolute", top: "8px", left: "8px", fontSize: "11px", fontWeight: 800, color: JADE, margin: 0 }}>Aśvinī (Ketu)</p>
                <p style={{ position: "absolute", bottom: "8px", left: "8px", fontSize: "10px", color: INK_MUTED, margin: 0 }}>0° – 13°20′</p>
              </div>
              <div style={{ position: "absolute", left: `${(13 + 20 / 60) / 30 * 100}%`, width: `${(13 + 20 / 60) / 30 * 100}%`, height: "100%", background: `${INDIGO}08`, borderRight: `1.5px solid ${INDIGO}33` }}>
                <p style={{ position: "absolute", top: "8px", left: "8px", fontSize: "11px", fontWeight: 800, color: INDIGO, margin: 0 }}>Bharaṇī (Venus)</p>
                <p style={{ position: "absolute", bottom: "8px", left: "8px", fontSize: "10px", color: INK_MUTED, margin: 0 }}>13°20′ – 26°40′</p>
              </div>
              <div style={{ position: "absolute", left: `${(26 + 40 / 60) / 30 * 100}%`, width: `${(3 + 20 / 60) / 30 * 100}%`, height: "100%", background: `${VERMILION}06` }}>
                <p style={{ position: "absolute", top: "8px", left: "8px", fontSize: "11px", fontWeight: 800, color: VERMILION, margin: 0 }}>Kṛttikā (Sun)</p>
                <p style={{ position: "absolute", bottom: "8px", left: "8px", fontSize: "10px", color: INK_MUTED, margin: 0 }}>26°40′ – 30°</p>
              </div>

              {/* Lahiri marker */}
              <div style={{ position: "absolute", left: `${Math.min(Math.max((lahiriSidereal < 0 ? lahiriSidereal + 30 : lahiriSidereal) / 30 * 100, 0), 100)}%`, top: "0", transform: "translateX(-50%)", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                <div style={{ width: "3px", height: "100%", background: GOLD, opacity: 0.8 }} />
                <div style={{ position: "absolute", top: "4px", background: GOLD, color: "#FFF", fontSize: "9px", fontWeight: 800, padding: "2px 6px", borderRadius: "3px", whiteSpace: "nowrap" }}>Lahiri</div>
              </div>

              {/* Krishnamurti marker */}
              <div style={{ position: "absolute", left: `${Math.min(Math.max((krishnamurtiSidereal < 0 ? krishnamurtiSidereal + 30 : krishnamurtiSidereal) / 30 * 100, 0), 100)}%`, top: "0", transform: "translateX(-50%)", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                <div style={{ width: "3px", height: "100%", background: INDIGO, opacity: 0.8 }} />
                <div style={{ position: "absolute", bottom: "4px", background: INDIGO, color: "#FFF", fontSize: "9px", fontWeight: 800, padding: "2px 6px", borderRadius: "3px", whiteSpace: "nowrap" }}>Krishnamurti</div>
              </div>
            </div>

            {/* Result cards */}
            <div style={{ maxWidth: "600px", margin: "0 auto 1.25rem", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
              <div style={{ background: `${GOLD}06`, borderRadius: "10px", padding: "12px", border: `1.5px solid ${GOLD}22`, textAlign: "center" }}>
                <span style={{ fontSize: "10px", color: INK_MUTED, textTransform: "uppercase", fontWeight: 700 }}>Lahiri Sidereal Cusp</span>
                <p style={{ fontSize: "15px", fontWeight: 800, color: GOLD, fontFamily: "monospace", margin: "4px 0" }}>{toDMS(lahiriSidereal < 0 ? lahiriSidereal + 30 : lahiriSidereal)} Aries</p>
                <span style={{ fontSize: "12px", color: INK_PRIMARY, fontWeight: 700 }}>Nakṣatra: {lahiriNak.name} ({lahiriNak.lord})</span>
              </div>
              <div style={{ background: `${INDIGO}06`, borderRadius: "10px", padding: "12px", border: `1.5px solid ${INDIGO}22`, textAlign: "center" }}>
                <span style={{ fontSize: "10px", color: INK_MUTED, textTransform: "uppercase", fontWeight: 700 }}>Krishnamurti Sidereal Cusp</span>
                <p style={{ fontSize: "15px", fontWeight: 800, color: INDIGO, fontFamily: "monospace", margin: "4px 0" }}>{toDMS(krishnamurtiSidereal < 0 ? krishnamurtiSidereal + 30 : krishnamurtiSidereal)} Aries</p>
                <span style={{ fontSize: "12px", color: INK_PRIMARY, fontWeight: 700 }}>Nakṣatra: {krishnamurtiNak.name} ({krishnamurtiNak.lord})</span>
              </div>
            </div>

            {/* Alarms / Confirmations */}
            {boundaryDiffers ? (
              <div style={{ maxWidth: "600px", margin: "0 auto", padding: "12px 16px", borderRadius: "8px", background: `${VERMILION}08`, border: `1.5px solid ${VERMILION}33`, display: "flex", gap: "10px", alignItems: "center", justifyContent: "center" }}>
                <AlertTriangle size={18} style={{ color: VERMILION, flexShrink: 0 }} />
                <p style={{ fontSize: "12.5px", color: VERMILION, fontWeight: 800, margin: 0 }}>
                  <strong>DAŚĀ SHIFT DETECTED!</strong> Lahiri: {lahiriNak.name} ({lahiriNak.lord}) · KP: {krishnamurtiNak.name} ({krishnamurtiNak.lord}). The 6′ shift alters the initial Vimshottari daśā lord assignment!
                </p>
              </div>
            ) : (
              <div style={{ maxWidth: "600px", margin: "0 auto", padding: "12px 16px", borderRadius: "8px", background: `${JADE}08`, border: `1.5px solid ${JADE}33`, display: "flex", gap: "10px", alignItems: "center", justifyContent: "center" }}>
                <BadgeCheck size={18} style={{ color: JADE, flexShrink: 0 }} />
                <p style={{ fontSize: "12.5px", color: JADE, fontWeight: 800, margin: 0 }}>
                  <strong>COORDINATE CONSISTENT:</strong> Planet falls in {lahiriNak.name} ({lahiriNak.lord}) under both systems. The offset is inside safe boundaries.
                </p>
              </div>
            )}
          </section>
        </div>
      )}

    </div>
  );
}

const selectStyle: CSSProperties = {
  padding: "8px 12px",
  borderRadius: "6px",
  border: `1px solid ${HAIRLINE}`,
  background: "#FFF",
  color: INK_PRIMARY,
  fontSize: "14px",
  outline: "none"
};

const numInputStyle: CSSProperties = {
  padding: "8px 12px",
  borderRadius: "6px",
  border: `1px solid ${HAIRLINE}`,
  background: "#FFF",
  color: INK_PRIMARY,
  fontSize: "14px",
  width: "60px",
  textAlign: "center",
  outline: "none"
};

const labelStyleInline: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  fontSize: "12px",
  fontWeight: 700,
  color: INK_SECONDARY
};

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    border: `1.5px solid ${active ? color : HAIRLINE}`,
    borderRadius: "6px",
    background: active ? color : "transparent",
    color: active ? "#FFF" : INK_SECONDARY,
    padding: "0.45rem 0.85rem",
    fontWeight: 700,
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 150ms ease",
    outline: "none"
  };
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1.25rem", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 900, fontSize: "13px", borderBottom: `1px solid ${HAIRLINE}55`, paddingBottom: "0.4rem", marginBottom: "0.8rem" }}>
        {icon}
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>{children}</div>
    </section>
  );
}

const eyebrowStyle: CSSProperties = {
  margin: 0,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 900,
};
