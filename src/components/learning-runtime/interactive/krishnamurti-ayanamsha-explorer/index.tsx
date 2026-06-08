"use client";

import { useState } from "react";
import { Clock, Calculator, AlertTriangle, ChevronRight, RotateCcw } from "lucide-react";

const GOLD = "#C28220";
const INDIGO = "#4A6FA5";
const VERMILION = "#A23A1E";
const JADE = "#2F8C5A";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";

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
  const degrees = arcSeconds / 3600;
  return degrees;
}

/* ─── Pre-computed precise values ─── */
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

/* ─── Nakṣatra data for Aries strip ─── */
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

  // The slider sets the Lahiri SIDEREAL position in Aries. Krishnamurti ayanāṁśa is
  // ~6′ LESS than Lahiri, so the Krishnamurti sidereal position is ~6′ GREATER.
  const lahiriSidereal = boundaryDeg;
  const krishnamurtiSidereal = boundaryDeg + (6 / 60);
  const lahiriNak = nakshatraAt(lahiriSidereal >= 30 ? lahiriSidereal - 30 : lahiriSidereal);
  const krishnamurtiNak = nakshatraAt(krishnamurtiSidereal >= 30 ? krishnamurtiSidereal - 30 : krishnamurtiSidereal);
  const boundaryDiffers = lahiriNak.name !== krishnamurtiNak.name;

  return (
    <div style={{ maxWidth: "960px", margin: "0 auto", fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
      {/* Tab bar */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
        {[
          { key: "context" as const, label: "Context & Comparison", icon: <Clock size={14} /> },
          { key: "calculator" as const, label: "Calculator", icon: <Calculator size={14} /> },
          { key: "boundary" as const, label: "Boundary Case", icon: <AlertTriangle size={14} /> },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "8px 16px", borderRadius: "999px", border: "none",
              cursor: "pointer", fontSize: "13px", fontWeight: 600,
              letterSpacing: "0.04em", transition: "all 180ms ease",
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
        <div>
          {/* Timeline */}
          <div style={{ background: `${INDIGO}06`, borderRadius: "16px", padding: "24px", border: `1px solid ${INDIGO}18`, marginBottom: "20px" }}>
            <h4 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "20px", fontWeight: 600, color: INDIGO, marginBottom: "18px" }}>
              K.S. Krishnamurti (1908 – 1972)
            </h4>
            <svg viewBox="0 0 640 100" style={{ width: "100%", height: "auto", display: "block" }}>
              <line x1="40" y1="55" x2="600" y2="55" stroke={`${INDIGO}40`} strokeWidth="2" />
              {MILESTONES.map((m, i) => {
                const x = 80 + i * 260;
                const isPeak = m.year === 1963;
                return (
                  <g key={m.year}>
                    <circle cx={x} cy="55" r={isPeak ? 7 : 5} fill={isPeak ? GOLD : INDIGO} stroke="#FFF" strokeWidth="2" />
                    <text x={x} y="35" textAnchor="middle" fontSize="12" fill={isPeak ? GOLD : INDIGO} fontWeight={700}>{m.year}</text>
                    <text x={x} y="80" textAnchor="middle" fontSize="10" fill="#5A4A32" fontWeight={600}>{m.label}</text>
                    <text x={x} y="94" textAnchor="middle" fontSize="9" fill="#8A7A60">{m.detail}</text>
                    {isPeak && <text x={x} y="20" textAnchor="middle" fontSize="10" fill={GOLD} fontWeight={700}>★ KP Reader I</text>}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Two-column: spec + 1-249 */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px", marginBottom: "16px" }}>
            <div style={{ background: `${INDIGO}06`, borderRadius: "14px", padding: "18px", border: `1px solid ${INDIGO}20` }}>
              <h5 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "16px", fontWeight: 600, color: INDIGO, marginBottom: "10px" }}>The Krishnamurti Specification</h5>
              <ul style={{ padding: 0, margin: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  "Shares Spica (Citrā) reference with Lahiri",
                  "Differing specific positioning + precession refinements",
                  "Result: ~6 arc-minutes LESS than Lahiri",
                  "Simplified formula: Krishnamurti ≈ Lahiri − 6′",
                ].map((p, i) => (
                  <li key={i} style={{ fontSize: "12px", color: INK_PRIMARY, lineHeight: 1.5, paddingLeft: "14px", position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, top: "5px", width: "5px", height: "5px", borderRadius: "50%", background: INDIGO }} />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ background: `${GOLD}06`, borderRadius: "14px", padding: "18px", border: `1px solid ${GOLD}20` }}>
              <h5 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "16px", fontWeight: 600, color: GOLD, marginBottom: "10px" }}>KP Horary 1-249 System</h5>
              <p style={{ fontSize: "12px", color: INK_PRIMARY, lineHeight: 1.6, margin: 0 }}>
                The 249 sub-lord regions are defined against the <strong>Krishnamurti ayanāṁśa</strong>. Each nakṣatra (27) is divided into 9 sub-lords = 243, plus 6 transitional regions = <strong>249 total</strong>. Using Lahiri instead of Krishnamurti for KP horary calculations introduces systematic sub-lord misassignment.
              </p>
            </div>
          </div>

          {/* Comparison table */}
          <div style={{ maxWidth: "480px", margin: "0 auto" }}>
            <h5 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "16px", fontWeight: 600, color: INK_PRIMARY, marginBottom: "12px", textAlign: "center" }}>
              Lahiri vs Krishnamurti
            </h5>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              {COMPARISON_TABLE.map((r) => (
                <div key={r.year} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 14px", borderRadius: "8px", background: r.year === 2026 ? `${GOLD}08` : "transparent", border: r.year === 2026 ? `1px solid ${GOLD}20` : "1px solid transparent" }}>
                  <span style={{ fontSize: "12px", color: INK_PRIMARY, fontWeight: 500, width: "50px" }}>{r.year}</span>
                  <span style={{ fontSize: "12px", color: GOLD, fontWeight: 700, fontFamily: "monospace", width: "90px", textAlign: "center" }}>{r.lahiri}</span>
                  <span style={{ fontSize: "12px", color: INDIGO, fontWeight: 700, fontFamily: "monospace", width: "90px", textAlign: "center" }}>{r.krishnamurti}</span>
                  <span style={{ fontSize: "11px", color: VERMILION, fontWeight: 700, width: "40px", textAlign: "right" }}>{r.diff}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          TAB 2 — Calculator
         ═══════════════════════════════════════════════════════════ */}
      {tab === "calculator" && (
        <div>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <h4 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "20px", fontWeight: 600, color: INK_PRIMARY, marginBottom: "4px" }}>
              Krishnamurti Ayanāṁśa Calculator
            </h4>
            <p style={{ fontSize: "12px", color: INK_MUTED, margin: 0 }}>
              Step 1: Compute Lahiri · Step 2: Subtract 6 arc-minutes
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "center", marginBottom: "24px", flexWrap: "wrap" }}>
            <select value={year} onChange={(e) => setYear(e.target.value)} style={{ padding: "10px 14px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.3)", background: "rgba(252,245,224,0.5)", color: "var(--gl-ink-primary)", fontSize: "15px", fontFamily: "var(--font-sans), sans-serif", outline: "none" }}>
              {Array.from({ length: 150 }, (_, i) => 1900 + i).map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
            <select value={month} onChange={(e) => setMonth(e.target.value)} style={{ padding: "10px 14px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.3)", background: "rgba(252,245,224,0.5)", color: "var(--gl-ink-primary)", fontSize: "15px", fontFamily: "var(--font-sans), sans-serif", outline: "none" }}>
              {MONTH_NAMES.map((name, i) => <option key={i + 1} value={i + 1}>{name}</option>)}
            </select>
            <input type="number" min={1} max={31} value={day} onChange={(e) => setDay(e.target.value)} style={{ padding: "10px 14px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.3)", background: "rgba(252,245,224,0.5)", color: "var(--gl-ink-primary)", fontSize: "15px", fontFamily: "var(--font-sans), sans-serif", width: "70px", textAlign: "center", outline: "none" }} />
            <button onClick={handleCalc} style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "10px 20px", borderRadius: "10px", border: "none", background: INDIGO, color: "#FFF", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
              <ChevronRight size={15} /> Calculate
            </button>
            <button onClick={() => { setYear("2026"); setMonth("6"); setDay("15"); setResult(null); }} style={{ padding: "10px", borderRadius: "10px", border: "1px solid rgba(74,111,165,0.25)", background: "transparent", color: INDIGO, cursor: "pointer" }} title="Reset">
              <RotateCcw size={15} />
            </button>
          </div>

          {result && (
            <div style={{ maxWidth: "640px", margin: "0 auto" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "16px" }}>
                <div style={{ background: `${GOLD}08`, borderRadius: "10px", padding: "16px", textAlign: "center", border: `1px solid ${GOLD}20` }}>
                  <p style={{ fontSize: "10px", color: INK_MUTED, marginBottom: "4px" }}>Lahiri</p>
                  <p style={{ fontSize: "20px", fontWeight: 700, color: GOLD, fontFamily: "monospace" }}>{toDMS(result.lahiriDeg)}</p>
                </div>
                <div style={{ background: `${INDIGO}08`, borderRadius: "10px", padding: "16px", textAlign: "center", border: `1px solid ${INDIGO}20` }}>
                  <p style={{ fontSize: "10px", color: INK_MUTED, marginBottom: "4px" }}>Krishnamurti</p>
                  <p style={{ fontSize: "20px", fontWeight: 700, color: INDIGO, fontFamily: "monospace" }}>{toDMS(result.krishnamurtiDeg)}</p>
                </div>
                <div style={{ background: `${VERMILION}08`, borderRadius: "10px", padding: "16px", textAlign: "center", border: `1px solid ${VERMILION}20` }}>
                  <p style={{ fontSize: "10px", color: INK_MUTED, marginBottom: "4px" }}>Difference</p>
                  <p style={{ fontSize: "20px", fontWeight: 700, color: VERMILION, fontFamily: "monospace" }}>~6′</p>
                </div>
              </div>

              <div style={{ background: `${INDIGO}06`, borderRadius: "14px", padding: "18px", border: `1px solid ${INDIGO}15` }}>
                <h5 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "16px", fontWeight: 600, color: INDIGO, marginBottom: "10px" }}>Simplified formula</h5>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "24px", height: "24px", borderRadius: "999px", background: GOLD, color: "#FFF", fontSize: "11px", fontWeight: 700 }}>1</span>
                    <p style={{ fontSize: "13px", color: INK_PRIMARY, margin: 0 }}>Compute Lahiri: <code style={{ color: GOLD, fontWeight: 700 }}>{toDMS(result.lahiriDeg)}</code></p>
                  </div>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "24px", height: "24px", borderRadius: "999px", background: INDIGO, color: "#FFF", fontSize: "11px", fontWeight: 700 }}>2</span>
                    <p style={{ fontSize: "13px", color: INK_PRIMARY, margin: 0 }}>Subtract 6 arc-minutes: <code style={{ color: INDIGO, fontWeight: 700 }}>{toDMS(result.krishnamurtiDeg)}</code></p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          TAB 3 — Boundary Case Visualiser
         ═══════════════════════════════════════════════════════════ */}
      {tab === "boundary" && (
        <div>
          <div style={{ textAlign: "center", marginBottom: "18px" }}>
            <h4 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "20px", fontWeight: 600, color: INK_PRIMARY, marginBottom: "4px" }}>
              Nakṣatra Boundary Visualiser
            </h4>
            <p style={{ fontSize: "12px", color: INK_MUTED, margin: 0 }}>
              Drag to set a planet's Lahiri sidereal position in Aries; Krishnamurti places the same planet ~6′ further along
            </p>
          </div>

          {/* Slider */}
          <div style={{ maxWidth: "600px", margin: "0 auto 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ fontSize: "11px", color: INK_MUTED }}>0° Aries</span>
              <span style={{ fontSize: "13px", fontWeight: 700, color: INK_PRIMARY }}>Lahiri sidereal: {boundaryDeg.toFixed(2)}° Aries</span>
              <span style={{ fontSize: "11px", color: INK_MUTED }}>30° Aries</span>
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
          <div style={{ maxWidth: "600px", margin: "0 auto 20px", position: "relative", height: "80px", background: `${GOLD}06`, borderRadius: "12px", border: `1px solid ${GOLD}15`, overflow: "hidden" }}>
            {/* Nakṣatra zones */}
            <div style={{ position: "absolute", left: "0%", width: `${(13 + 20 / 60) / 30 * 100}%`, height: "100%", background: `${JADE}10`, borderRight: `1px solid ${JADE}25` }}>
              <p style={{ position: "absolute", top: "8px", left: "8px", fontSize: "11px", fontWeight: 700, color: JADE, margin: 0 }}>Aśvinī</p>
              <p style={{ position: "absolute", bottom: "8px", left: "8px", fontSize: "10px", color: INK_MUTED, margin: 0 }}>0° – 13°20′</p>
            </div>
            <div style={{ position: "absolute", left: `${(13 + 20 / 60) / 30 * 100}%`, width: `${(13 + 20 / 60) / 30 * 100}%`, height: "100%", background: `${INDIGO}08`, borderRight: `1px solid ${INDIGO}20` }}>
              <p style={{ position: "absolute", top: "8px", left: "8px", fontSize: "11px", fontWeight: 700, color: INDIGO, margin: 0 }}>Bharaṇī</p>
              <p style={{ position: "absolute", bottom: "8px", left: "8px", fontSize: "10px", color: INK_MUTED, margin: 0 }}>13°20′ – 26°40′</p>
            </div>
            <div style={{ position: "absolute", left: `${(26 + 40 / 60) / 30 * 100}%`, width: `${(3 + 20 / 60) / 30 * 100}%`, height: "100%", background: `${VERMILION}06` }}>
              <p style={{ position: "absolute", top: "8px", left: "8px", fontSize: "11px", fontWeight: 700, color: VERMILION, margin: 0 }}>Kṛttikā</p>
              <p style={{ position: "absolute", bottom: "8px", left: "8px", fontSize: "10px", color: INK_MUTED, margin: 0 }}>26°40′ – 30°</p>
            </div>

            {/* Lahiri marker */}
            <div style={{ position: "absolute", left: `${Math.min(Math.max((lahiriSidereal < 0 ? lahiriSidereal + 30 : lahiriSidereal) / 30 * 100, 0), 100)}%`, top: "0", transform: "translateX(-50%)", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
              <div style={{ width: "3px", height: "100%", background: GOLD, opacity: 0.7 }} />
              <div style={{ position: "absolute", top: "2px", background: GOLD, color: "#FFF", fontSize: "9px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", whiteSpace: "nowrap" }}>Lahiri</div>
            </div>

            {/* Krishnamurti marker */}
            <div style={{ position: "absolute", left: `${Math.min(Math.max((krishnamurtiSidereal < 0 ? krishnamurtiSidereal + 30 : krishnamurtiSidereal) / 30 * 100, 0), 100)}%`, top: "0", transform: "translateX(-50%)", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
              <div style={{ width: "3px", height: "100%", background: INDIGO, opacity: 0.7 }} />
              <div style={{ position: "absolute", bottom: "2px", background: INDIGO, color: "#FFF", fontSize: "9px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", whiteSpace: "nowrap" }}>Krishnamurti</div>
            </div>
          </div>

          {/* Result cards */}
          <div style={{ maxWidth: "600px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
            <div style={{ background: `${GOLD}08`, borderRadius: "12px", padding: "16px", border: `1px solid ${GOLD}20`, textAlign: "center" }}>
              <p style={{ fontSize: "10px", color: INK_MUTED, marginBottom: "4px" }}>Lahiri sidereal</p>
              <p style={{ fontSize: "16px", fontWeight: 700, color: GOLD, fontFamily: "monospace" }}>{toDMS(lahiriSidereal < 0 ? lahiriSidereal + 30 : lahiriSidereal)} Aries</p>
              <p style={{ fontSize: "12px", color: JADE, fontWeight: 600, marginTop: "4px" }}>{lahiriNak.name} · Lord: {lahiriNak.lord}</p>
            </div>
            <div style={{ background: `${INDIGO}08`, borderRadius: "12px", padding: "16px", border: `1px solid ${INDIGO}20`, textAlign: "center" }}>
              <p style={{ fontSize: "10px", color: INK_MUTED, marginBottom: "4px" }}>Krishnamurti sidereal</p>
              <p style={{ fontSize: "16px", fontWeight: 700, color: INDIGO, fontFamily: "monospace" }}>{toDMS(krishnamurtiSidereal < 0 ? krishnamurtiSidereal + 30 : krishnamurtiSidereal)} Aries</p>
              <p style={{ fontSize: "12px", color: JADE, fontWeight: 600, marginTop: "4px" }}>{krishnamurtiNak.name} · Lord: {krishnamurtiNak.lord}</p>
            </div>
          </div>

          {boundaryDiffers && (
            <div style={{ maxWidth: "600px", margin: "16px auto 0", padding: "12px 16px", borderRadius: "10px", background: `${VERMILION}08`, border: `1px solid ${VERMILION}25`, textAlign: "center" }}>
              <p style={{ fontSize: "13px", color: VERMILION, fontWeight: 700, margin: 0 }}>
                ⚠ Different nakṣatras! Lahiri → {lahiriNak.name} ({lahiriNak.lord}) · Krishnamurti → {krishnamurtiNak.name} ({krishnamurtiNak.lord})
              </p>
            </div>
          )}

          {!boundaryDiffers && (
            <div style={{ maxWidth: "600px", margin: "16px auto 0", padding: "12px 16px", borderRadius: "10px", background: `${JADE}08`, border: `1px solid ${JADE}25`, textAlign: "center" }}>
              <p style={{ fontSize: "13px", color: JADE, fontWeight: 700, margin: 0 }}>
                ✓ Same nakṣatra: {lahiriNak.name} ({lahiriNak.lord}) — the 6′ difference does not cross a boundary here
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
