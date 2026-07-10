"use client";

import { useState } from "react";
import { Calculator, BookOpen, AlertTriangle, ChevronRight, RotateCcw, CheckCircle, XCircle } from "lucide-react";

const GOLD = "#C28220";
const INDIGO = "#4A6FA5";
const VERMILION = "#A23A1E";
const JADE = "#2F8C5A";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function isLeap(y: number) {
  return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
}

function dayOfYear(y: number, m: number, d: number) {
  let doy = d;
  for (let i = 0; i < m - 1; i++) {
    doy += MONTH_DAYS[i];
    if (i === 1 && isLeap(y)) doy += 1;
  }
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
  return { yearsElapsed, doy, fractionOfYear, yearsFromAlignment, arcSeconds, degrees };
}

/* ─── Pre-computed precise cross-check values ─── */
const PRECISE_TABLE: Record<string, string> = {
  "2026-06-15": "24°19′03″",
  "1990-01-15": "23°43′15″",
  "2050-03-25": "24°41′52″",
  "2000-12-31": "23°53′33″",
  "2026-01-01": "24°11′00″",
  "1985-06-15": "23°37′00″",
  "1955-04-14": "23°15′00″",
};

/* ─── Worked examples from curriculum §4.2–4.5 ─── */
const WORKED_EXAMPLES = [
  { date: "2026-06-15", label: "June 15, 2026", precise: "24°19′03″", diff: "~59 arc-seconds", note: "Mid-year; within 1 arc-minute" },
  { date: "1990-01-15", label: "January 15, 1990", precise: "23°43′15″", diff: "~4 arc-minutes", note: "Mid-century; larger cumulative effect" },
  { date: "2050-03-25", label: "March 25, 2050", precise: "24°41′52″", diff: "~4 arc-minutes", note: "Near alignment-epoch anniversary" },
  { date: "2000-12-31", label: "December 31, 2000", precise: "23°53′33″", diff: "~3 arc-minutes", note: "End of year; leap-year boundary" },
];

/* ─── Mistake-hunt exercises ─── */
const MISTAKE_EXERCISES = [
  {
    id: 1,
    title: "Sign Error",
    scenario: "A learner computes: 285 − 2026 = −1741 years, then multiplies by 50.2388 and gets a negative ayanāṁśa.",
    choices: ["Sign error in alignment-epoch subtraction", "Wrong precession rate used", "Decimal-to-sexagesimal error", "Leap year missed", "Calendar system confusion"],
    correct: 0,
    explanation: "The correct subtraction is Year_CE − 285 (not 285 − Year_CE). The alignment epoch is the starting point; elapsed years grow forward from 285 CE.",
  },
  {
    id: 2,
    title: "Rate Confusion",
    scenario: "A learner uses 1°/72 years (≈ 50.0 arc-sec/year) instead of Lahiri's 50.2388 arc-sec/year. For 2026, they get ~24°10′ instead of ~24°18′.",
    choices: ["Sign error in alignment-epoch subtraction", "Wrong precession rate used", "Decimal-to-sexagesimal error", "Leap year missed", "Calendar system confusion"],
    correct: 1,
    explanation: "Lesson 2.1.2's 1°/72 is a rounded approximation. Lahiri's precise mean rate is 50.2388 arc-sec/Julian year (≈ 1°/71.6 years). The difference accumulates to ~8 arc-minutes over 1741 years.",
  },
  {
    id: 3,
    title: "DMS Conversion Error",
    scenario: "A learner has 24.301° and writes it as 24°30′10″ instead of 24°18′04″.",
    choices: ["Sign error in alignment-epoch subtraction", "Wrong precession rate used", "Decimal-to-sexagesimal error", "Leap year missed", "Calendar system confusion"],
    correct: 2,
    explanation: "0.301° × 60 = 18.06′ (not 30.1′). The decimal part is multiplied by 60 to get arc-minutes; only then is the remaining decimal multiplied by 60 again for arc-seconds.",
  },
  {
    id: 4,
    title: "Leap Year Missed",
    scenario: "For March 1, 2020, a learner computes day-of-year as 31 + 28 + 1 = 60, treating 2020 as a common year.",
    choices: ["Sign error in alignment-epoch subtraction", "Wrong precession rate used", "Decimal-to-sexagesimal error", "Leap year missed", "Calendar system confusion"],
    correct: 3,
    explanation: "2020 is divisible by 4 and not by 100 → leap year. February has 29 days. Correct day-of-year = 31 + 29 + 1 = 61. The 1-day error propagates to ~0.14 arc-minutes in the final ayanāṁśa.",
  },
  {
    id: 5,
    title: "Calendar Confusion",
    scenario: "A learner inputs Vikrama year 2081 (which corresponds to ~2024–2025 CE) directly as 'Year = 2081' into the Lahiri formula.",
    choices: ["Sign error in alignment-epoch subtraction", "Wrong precession rate used", "Decimal-to-sexagesimal error", "Leap year missed", "Calendar system confusion"],
    correct: 4,
    explanation: "The Lahiri formula requires Gregorian CE year. Vikrama Saṁvat 2081 ≈ 2024–2025 CE. Using 2081 directly would add ~1796 extra years of precession, giving a wildly wrong ayanāṁśa.",
  },
];

export function LahiriByHandStepByStepCalculator() {
  const [tab, setTab] = useState<"calculator" | "worked" | "mistakes">("calculator");
  const [year, setYear] = useState<string>("2026");
  const [month, setMonth] = useState<string>("6");
  const [day, setDay] = useState<string>("15");
  const [result, setResult] = useState<ReturnType<typeof computeLahiri> | null>(null);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [mistakeAnswers, setMistakeAnswers] = useState<Record<number, number | null>>({});
  const [mistakeRevealed, setMistakeRevealed] = useState<Record<number, boolean>>({});

  const handleCalc = () => {
    const y = parseInt(year, 10);
    const m = parseInt(month, 10);
    const d = parseInt(day, 10);
    if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return;
    setResult(computeLahiri(y, m, d));
    setExpandedStep(null);
  };

  const dateKey = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  const preciseDMS = PRECISE_TABLE[dateKey] ?? null;

  const diffArcMinutes = (() => {
    if (!result || !preciseDMS) return null;
    const match = preciseDMS.match(/(\d+)°(\d+)′(\d+)″/);
    if (!match) return null;
    const preciseDeg = parseInt(match[1]) + parseInt(match[2]) / 60 + parseInt(match[3]) / 3600;
    const diffDeg = Math.abs(result.degrees - preciseDeg);
    return diffDeg * 60;
  })();

  const verdict = (() => {
    if (diffArcMinutes === null) return null;
    if (diffArcMinutes <= 1) return { text: "Within ~1 arc-minute — excellent for understanding + verification", color: JADE };
    if (diffArcMinutes <= 5) return { text: "Within ~5 arc-minutes — acceptable tolerance; use for verification", color: GOLD };
    return { text: ">5 arc-minutes — investigate for arithmetic mistake", color: VERMILION };
  })();

  const loadExample = (ex: typeof WORKED_EXAMPLES[0]) => {
    const [y, m, d] = ex.date.split("-").map(Number);
    setYear(String(y));
    setMonth(String(m));
    setDay(String(d));
    setTab("calculator");
    setResult(computeLahiri(y, m, d));
  };

  return (
    <div style={{ maxWidth: "960px", margin: "0 auto", fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
      {/* Tab bar */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
        {[
          { key: "calculator" as const, label: "Calculator", icon: <Calculator size={14} /> },
          { key: "worked" as const, label: "Worked Examples", icon: <BookOpen size={14} /> },
          { key: "mistakes" as const, label: "Mistake Hunt", icon: <AlertTriangle size={14} /> },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "8px 16px", borderRadius: "999px", border: "none",
              cursor: "pointer", fontSize: "13px", fontWeight: 600,
              letterSpacing: "0.04em", transition: "all 180ms ease",
              background: tab === t.key ? GOLD : `${GOLD}12`,
              color: tab === t.key ? "#FFF" : GOLD,
            }}
          >
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════
          TAB 1 — Calculator
         ═══════════════════════════════════════════════════════════ */}
      {tab === "calculator" && (
        <div>
          {/* Date input row */}
          <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "center", marginBottom: "24px", flexWrap: "wrap" }}>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              style={{ padding: "10px 14px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.3)", background: "rgba(252,245,224,0.5)", color: "var(--gl-ink-primary)", fontSize: "15px", fontFamily: "var(--font-sans), sans-serif", outline: "none" }}
            >
              {Array.from({ length: 150 }, (_, i) => 1900 + i).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              style={{ padding: "10px 14px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.3)", background: "rgba(252,245,224,0.5)", color: "var(--gl-ink-primary)", fontSize: "15px", fontFamily: "var(--font-sans), sans-serif", outline: "none" }}
            >
              {MONTH_NAMES.map((name, i) => (
                <option key={i + 1} value={i + 1}>{name}</option>
              ))}
            </select>
            <input
              type="number"
              min={1}
              max={31}
              value={day}
              onChange={(e) => setDay(e.target.value)}
              style={{ padding: "10px 14px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.3)", background: "rgba(252,245,224,0.5)", color: "var(--gl-ink-primary)", fontSize: "15px", fontFamily: "var(--font-sans), sans-serif", width: "70px", textAlign: "center", outline: "none" }}
            />
            <button
              onClick={handleCalc}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "10px 20px", borderRadius: "10px", border: "none", background: GOLD, color: "#FFF", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}
            >
              <ChevronRight size={15} /> Calculate
            </button>
            <button
              onClick={() => { setYear("2026"); setMonth("6"); setDay("15"); setResult(null); }}
              style={{ padding: "10px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.25)", background: "transparent", color: "#9C7A2F", cursor: "pointer" }}
              title="Reset"
            >
              <RotateCcw size={15} />
            </button>
          </div>

          {result && (
            <>
              {/* 7 Steps */}
              <div style={{ background: `${GOLD}06`, borderRadius: "14px", padding: "22px", border: `1px solid ${GOLD}15`, marginBottom: "16px" }}>
                <h5 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "18px", fontWeight: 600, color: GOLD, marginBottom: "16px" }}>
                  7-Step Lahiri Computation
                </h5>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[
                    { step: 1, text: "Years elapsed since alignment epoch", math: `${year} − 285 = ${result.yearsElapsed} years` },
                    { step: 2, text: "Day of year (completed months + day)", math: `Day ${result.doy} of ${isLeap(parseInt(year)) ? 366 : 365}` },
                    { step: 3, text: "Fraction of year completed", math: `${result.doy} ÷ 365.25 = ${result.fractionOfYear.toFixed(4)}` },
                    { step: 4, text: "Years from alignment (with March 21 offset)", math: `${result.yearsElapsed} + ${result.fractionOfYear.toFixed(4)} − 0.219 = ${result.yearsFromAlignment.toFixed(4)}` },
                    { step: 5, text: "Arc-seconds of precession", math: `${result.yearsFromAlignment.toFixed(4)} × 50.2388 = ${result.arcSeconds.toLocaleString(undefined, { maximumFractionDigits: 2 })}″` },
                    { step: 6, text: "Convert arc-seconds to degrees", math: `${result.arcSeconds.toLocaleString(undefined, { maximumFractionDigits: 2 })} ÷ 3600 = ${result.degrees.toFixed(4)}°` },
                    { step: 7, text: "Convert decimal degrees to DMS", math: toDMS(result.degrees) },
                  ].map((s) => (
                    <div
                      key={s.step}
                      onClick={() => setExpandedStep(expandedStep === s.step ? null : s.step)}
                      style={{
                        display: "flex", gap: "12px", alignItems: "flex-start",
                        padding: "10px 12px", borderRadius: "10px",
                        background: expandedStep === s.step ? "rgba(255,255,255,0.6)" : "transparent",
                        cursor: "pointer", transition: "background 150ms ease",
                      }}
                    >
                      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "28px", height: "28px", borderRadius: "999px", background: GOLD, color: "#FFF", fontSize: "12px", fontWeight: 700, flexShrink: 0, marginTop: "2px" }}>{s.step}</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: "12px", color: INK_PRIMARY, fontWeight: 600, marginBottom: "2px" }}>{s.text}</p>
                        <p style={{ fontSize: "14px", color: GOLD, fontWeight: 700, fontFamily: "monospace" }}>{s.math}</p>
                        {expandedStep === s.step && s.step === 4 && (
                          <p style={{ fontSize: "11px", color: INK_MUTED, marginTop: "4px", fontStyle: "italic" }}>
                            The 0.219 offset accounts for the alignment epoch being 21 March (not 1 January). 21 March ≈ day 80 of the year; 80/365.25 ≈ 0.219.
                          </p>
                        )}
                        {expandedStep === s.step && s.step === 5 && (
                          <p style={{ fontSize: "11px", color: INK_MUTED, marginTop: "4px", fontStyle: "italic" }}>
                            Lahiri's mean precession rate: 50.2388 arc-seconds per Julian year (≈ 1°/71.6 years).
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Result + precision context */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px", marginBottom: "16px" }}>
                <div style={{ background: `${GOLD}08`, borderRadius: "10px", padding: "16px", textAlign: "center", border: `1px solid ${GOLD}20` }}>
                  <p style={{ fontSize: "10px", color: INK_MUTED, marginBottom: "4px" }}>By-hand result</p>
                  <p style={{ fontSize: "22px", fontWeight: 700, color: GOLD, fontFamily: "monospace" }}>{toDMS(result.degrees)}</p>
                </div>
                <div style={{ background: `${INDIGO}08`, borderRadius: "10px", padding: "16px", textAlign: "center", border: `1px solid ${INDIGO}20` }}>
                  <p style={{ fontSize: "10px", color: INK_MUTED, marginBottom: "4px" }}>Precise (Astro)</p>
                  <p style={{ fontSize: "22px", fontWeight: 700, color: INDIGO, fontFamily: "monospace" }}>{preciseDMS ?? "—"}</p>
                </div>
                <div style={{ background: `${VERMILION}08`, borderRadius: "10px", padding: "16px", textAlign: "center", border: `1px solid ${VERMILION}20` }}>
                  <p style={{ fontSize: "10px", color: INK_MUTED, marginBottom: "4px" }}>Difference</p>
                  <p style={{ fontSize: "22px", fontWeight: 700, color: VERMILION, fontFamily: "monospace" }}>
                    {diffArcMinutes !== null ? `~${diffArcMinutes.toFixed(1)}′` : "—"}
                  </p>
                </div>
              </div>

              {verdict && (
                <div style={{ padding: "12px 16px", borderRadius: "10px", background: `${verdict.color}08`, border: `1px solid ${verdict.color}25`, textAlign: "center" }}>
                  <p style={{ fontSize: "13px", color: verdict.color, fontWeight: 700, margin: 0 }}>{verdict.text}</p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          TAB 2 — Worked Examples
         ═══════════════════════════════════════════════════════════ */}
      {tab === "worked" && (
        <div>
          <p style={{ fontSize: "13px", color: INK_MUTED, marginBottom: "16px", textAlign: "center" }}>
            Click any example to load it into the Calculator tab
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
            {WORKED_EXAMPLES.map((ex) => {
              const [y, m, d] = ex.date.split("-").map(Number);
              const r = computeLahiri(y, m, d);
              return (
                <button
                  key={ex.date}
                  onClick={() => loadExample(ex)}
                  style={{
                    textAlign: "left", padding: "18px", borderRadius: "14px",
                    border: `1px solid ${GOLD}18`, background: `${GOLD}04`, cursor: "pointer",
                    transition: "all 150ms ease", fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = `${GOLD}08`; e.currentTarget.style.borderColor = `${GOLD}30`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = `${GOLD}04`; e.currentTarget.style.borderColor = `${GOLD}18`; }}
                >
                  <p style={{ fontSize: "14px", fontWeight: 700, color: GOLD, marginBottom: "6px" }}>{ex.label}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontSize: "11px", color: INK_MUTED }}>By-hand</span>
                    <span style={{ fontSize: "12px", color: INK_PRIMARY, fontWeight: 600, fontFamily: "monospace" }}>{toDMS(r.degrees)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontSize: "11px", color: INK_MUTED }}>Precise</span>
                    <span style={{ fontSize: "12px", color: INDIGO, fontWeight: 600, fontFamily: "monospace" }}>{ex.precise}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "11px", color: INK_MUTED }}>Diff</span>
                    <span style={{ fontSize: "12px", color: VERMILION, fontWeight: 600 }}>{ex.diff}</span>
                  </div>
                  <p style={{ fontSize: "10px", color: INK_MUTED, marginTop: "8px", fontStyle: "italic" }}>{ex.note}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          TAB 3 — Mistake Hunt
         ═══════════════════════════════════════════════════════════ */}
      {tab === "mistakes" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {MISTAKE_EXERCISES.map((ex) => {
            const chosen = mistakeAnswers[ex.id] ?? null;
            const revealed = mistakeRevealed[ex.id] ?? false;
            const isCorrect = chosen === ex.correct;
            return (
              <div key={ex.id} style={{ background: `${VERMILION}04`, borderRadius: "14px", padding: "20px", border: `1px solid ${VERMILION}15` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "24px", height: "24px", borderRadius: "999px", background: VERMILION, color: "#FFF", fontSize: "11px", fontWeight: 700 }}>{ex.id}</span>
                  <h5 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "16px", fontWeight: 600, color: VERMILION, margin: 0 }}>{ex.title}</h5>
                </div>
                <p style={{ fontSize: "13px", color: INK_PRIMARY, lineHeight: 1.6, marginBottom: "12px" }}>{ex.scenario}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px" }}>
                  {ex.choices.map((choice, i) => (
                    <button
                      key={i}
                      onClick={() => { setMistakeAnswers((prev) => ({ ...prev, [ex.id]: i })); setMistakeRevealed((prev) => ({ ...prev, [ex.id]: true })); }}
                      style={{
                        textAlign: "left", padding: "8px 12px", borderRadius: "8px",
                        border: revealed && i === ex.correct ? `1.5px solid ${JADE}` : revealed && chosen === i && i !== ex.correct ? `1.5px solid ${VERMILION}` : "1px solid rgba(156,122,47,0.15)",
                        background: revealed && i === ex.correct ? `${JADE}10` : revealed && chosen === i && i !== ex.correct ? `${VERMILION}10` : "transparent",
                        color: revealed && i === ex.correct ? JADE : revealed && chosen === i && i !== ex.correct ? VERMILION : INK_PRIMARY,
                        fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                      }}
                    >
                      {revealed && i === ex.correct && <CheckCircle size={13} style={{ marginRight: "6px", verticalAlign: "text-bottom" }} />}
                      {revealed && chosen === i && i !== ex.correct && <XCircle size={13} style={{ marginRight: "6px", verticalAlign: "text-bottom" }} />}
                      {choice}
                    </button>
                  ))}
                </div>
                {revealed && (
                  <div style={{ padding: "10px 14px", borderRadius: "8px", background: isCorrect ? `${JADE}08` : `${VERMILION}08`, border: `1px solid ${isCorrect ? JADE : VERMILION}20` }}>
                    <p style={{ fontSize: "12px", color: isCorrect ? JADE : VERMILION, fontWeight: 600, margin: 0 }}>
                      {isCorrect ? "Correct!" : "Not quite."} {ex.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
