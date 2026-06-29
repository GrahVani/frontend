"use client";

import { useState, useMemo } from "react";
import { Star, Calculator, RotateCcw, ChevronRight } from "lucide-react";

const GOLD = "#C28220";
const INDIGO = "#4A6FA5";
const VERMILION = "#A23A1E";
const JADE = "#2F8C5A";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_MUTED = "var(--gl-ink-muted)";

function toDMS(decimalDeg: number): string {
  const d = Math.floor(decimalDeg);
  const mFull = (decimalDeg - d) * 60;
  const m = Math.floor(mFull);
  const s = Math.round((mFull - m) * 60);
  return `${d}°${m.toString().padStart(2, "0")}′${s.toString().padStart(2, "0")}″`;
}

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/* ─── Pre-computed precise Lahiri values (fallback) ─── */
const PRECISE_TABLE = [
  { year: 285, dms: "0°00′00″", note: "Alignment epoch" },
  { year: 1000, dms: "9°59′00″", note: "—" },
  { year: 1500, dms: "16°56′00″", note: "—" },
  { year: 1800, dms: "21°08′00″", note: "—" },
  { year: 1900, dms: "22°28′00″", note: "—" },
  { year: 1950, dms: "23°10′00″", note: "—" },
  { year: 1985, dms: "23°37′00″", note: "Common birth year" },
  { year: 2000, dms: "23°51′00″", note: "—" },
  { year: 2026, dms: "24°19′01″", note: "Present day" },
  { year: 2050, dms: "24°39′00″", note: "Near future" },
  { year: 2100, dms: "25°11′00″", note: "—" },
];

const MILESTONES = [
  { year: 1906, label: "Born", detail: "Nirmala Chandra Lahiri born in Bengal" },
  { year: 1952, label: "Committee", detail: "Calendar Reform Committee formed; Lahiri key member" },
  { year: 1955, label: "Adopted", detail: "Committee adopts Lahiri ayanāṁśa as Indian government standard" },
  { year: 1980, label: "Died", detail: "Lahiri passes; standard already dominant across India" },
];

export function LahiriAyanamshaExplorer() {
  const [tab, setTab] = useState<"spica" | "calculator">("spica");
  const [calcYear, setCalcYear] = useState<string>("2026");
  const [calcSteps, setCalcSteps] = useState<{ year: number; elapsed: number; arcsec: number; decimal: number; dms: string } | null>(null);
  const [svgTip, setSvgTip] = useState<string | null>(null);

  const toggleSvgTip = (tip: string) => {
    setSvgTip((current) => (current === tip ? null : tip));
  };

  const handleCalc = () => {
    const y = parseInt(calcYear, 10);
    if (Number.isNaN(y)) return;
    const elapsed = y - 285;
    const arcsec = elapsed * 50.2388;
    const decimal = arcsec / 3600;
    setCalcSteps({ year: y, elapsed, arcsec, decimal, dms: toDMS(decimal) });
  };

  const activePrecise = useMemo(() => {
    const y = parseInt(calcYear, 10);
    if (Number.isNaN(y)) return null;
    return PRECISE_TABLE.find((r) => r.year === y) ?? null;
  }, [calcYear]);

  return (
    <div
      style={{
        maxWidth: "960px",
        margin: "0 auto",
        fontFamily: "var(--font-sans), system-ui, sans-serif",
      }}
    >
      {/* Tab bar */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
        {[
          { key: "spica" as const, label: "Spica Anchor", icon: <Star size={14} /> },
          { key: "calculator" as const, label: "Calculator", icon: <Calculator size={14} /> },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setSvgTip(null); }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.04em",
              transition: "all 180ms ease",
              background: tab === t.key ? GOLD : `${GOLD}12`,
              color: tab === t.key ? "#FFF" : GOLD,
            }}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════
          TAB 1 — Timeline: Lahiri's Life + 1955 Committee
         ═══════════════════════════════════════════════════════════ */}
      {false && (
        <div>
          {/* Timeline */}
          <div
            style={{
              background: `${GOLD}06`,
              borderRadius: "16px",
              padding: "24px",
              border: `1px solid ${GOLD}18`,
              marginBottom: "20px",
            }}
          >
            <h4 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "20px", fontWeight: 600, color: GOLD, marginBottom: "18px" }}>
              N.C. Lahiri (1906 – 1980)
            </h4>
            <svg viewBox="0 0 880 110" style={{ width: "100%", height: "auto", display: "block" }}>
              {/* Horizontal axis */}
              <line x1="40" y1="60" x2="840" y2="60" stroke={`${GOLD}40`} strokeWidth="2" />
              {MILESTONES.map((m, i) => {
                const x = 80 + i * 190;
                const isPeak = m.year === 1955;
                return (
                  <g key={m.year}>
                    <circle cx={x} cy="60" r={isPeak ? 7 : 5} fill={isPeak ? VERMILION : GOLD} stroke="#FFF" strokeWidth="2" />
                    <text x={x} y="38" textAnchor="middle" fontSize="12" fill={isPeak ? VERMILION : GOLD} fontWeight={700} fontFamily="var(--font-sans), sans-serif">{m.year}</text>
                    <text x={x} y="88" textAnchor="middle" fontSize="10" fill="#5A4A32" fontWeight={600} fontFamily="var(--font-sans), sans-serif">{m.label}</text>
                    <text x={x} y="102" textAnchor="middle" fontSize="9" fill="#8A7A60" fontFamily="var(--font-sans), sans-serif">{m.detail}</text>
                    {isPeak && (
                      <text x={x} y="22" textAnchor="middle" fontSize="10" fill={VERMILION} fontWeight={700} fontFamily="var(--font-sans), sans-serif">★ Adopted</text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* 1955 Committee card */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px" }}>
            <div style={{ background: "rgba(74, 111, 165, 0.06)", borderRadius: "14px", padding: "18px", border: `1px solid ${INDIGO}20` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "26px", height: "26px", borderRadius: "8px", background: INDIGO, color: "#FFF", fontSize: "11px", fontWeight: 700 }}>MS</span>
                <h5 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "16px", fontWeight: 600, color: INDIGO }}>Prof. Meghnad Saha</h5>
              </div>
              <p style={{ fontSize: "12px", color: INK_PRIMARY, lineHeight: 1.6 }}>
                <strong>Chairman</strong> of the 1952–1955 Indian Calendar Reform Committee. Internationally renowned astrophysicist; founder of the Saha Equation in stellar physics.
              </p>
            </div>
            <div style={{ background: "rgba(194, 130, 32, 0.06)", borderRadius: "14px", padding: "18px", border: `1px solid ${GOLD}20` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "26px", height: "26px", borderRadius: "8px", background: GOLD, color: "#FFF", fontSize: "11px", fontWeight: 700 }}>NL</span>
                <h5 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "16px", fontWeight: 600, color: GOLD }}>N.C. Lahiri</h5>
              </div>
              <p style={{ fontSize: "12px", color: INK_PRIMARY, lineHeight: 1.6 }}>
                <strong>Key member</strong> — Bengali astronomer + astrologer; author of the <em>Indian Ephemeris</em>. His ayanāṁśa specification was adopted by the committee.
              </p>
            </div>
            <div style={{ background: "rgba(47, 140, 90, 0.06)", borderRadius: "14px", padding: "18px", border: `1px solid ${JADE}20` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "26px", height: "26px", borderRadius: "8px", background: JADE, color: "#FFF", fontSize: "11px", fontWeight: 700 }}>GOI</span>
                <h5 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "16px", fontWeight: 600, color: JADE }}>Government Mandate</h5>
              </div>
              <p style={{ fontSize: "12px", color: INK_PRIMARY, lineHeight: 1.6 }}>
                Rationalise regional Indian calendars + establish a <strong>single Indian National Calendar</strong> integrating Gregorian + classical Indian tradition.
              </p>
            </div>
          </div>

          {/* Adoption rationale */}
          <div
            style={{
              marginTop: "16px",
              padding: "16px 20px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, rgba(194, 130, 32, 0.06), rgba(156, 122, 47, 0.03))",
              border: `1px solid ${GOLD}15`,
            }}
          >
            <p style={{ fontSize: "13px", color: INK_PRIMARY, fontWeight: 500, lineHeight: 1.6, margin: 0 }}>
              <strong>Why Lahiri was adopted:</strong> (1) <em>Practical-administrative</em> — existing operational implementation via Indian Ephemeris; (2) <em>Classical-Sanskrit-grounded</em> — cross-referenced Sūrya Siddhānta + Citrā nakṣatra anchor; (3) <em>Cross-stream uptake</em> — practitioner-community familiarity before government adoption.
            </p>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          TAB 2 — Spica Anchor (interactive SVG)
         ═══════════════════════════════════════════════════════════ */}
      {tab === "spica" && (
        <div>
          <div style={{ textAlign: "center", marginBottom: "14px" }}>
            <h4 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "20px", fontWeight: 600, color: INK_PRIMARY, marginBottom: "4px" }}>
              Spica (Citrā) — The Lahiri Anchor
            </h4>
            <p style={{ fontSize: "12px", color: INK_MUTED, margin: 0 }}>
              Click any element to explore · Spica at sidereal 180° Libra → 0° Aries is 180° opposite
            </p>
          </div>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-start" }}>
            {/* SVG */}
            <div style={{ flex: "1 1 420px", minWidth: 0 }}>
              <svg viewBox="0 0 460 460" style={{ width: "100%", height: "auto", display: "block" }}>
                <defs>
                  <radialGradient id="spicaGlow" cx="50%" cy="50%">
                    <stop offset="0%" stopColor={`${GOLD}60`} />
                    <stop offset="100%" stopColor={`${GOLD}10`} />
                  </radialGradient>
                </defs>
                {/* Zodiac ring */}
                <g
                  role="button"
                  tabIndex={0}
                  aria-label="Explore the zodiac reference ring"
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleSvgTip("zodiac")}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      toggleSvgTip("zodiac");
                    }
                  }}
                >
                  <circle cx="230" cy="230" r="206" fill="rgba(255, 250, 238, 0.01)" />
                  <circle cx="230" cy="230" r="190" fill="none" stroke={`${GOLD}34`} strokeWidth="2.5" />
                  <circle cx="230" cy="230" r="150" fill="none" stroke={`${GOLD}24`} strokeWidth="1.5" strokeDasharray="4 3" />
                </g>

                {/* Zodiac segments */}
                {["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"].map((sign, i) => {
                  const mid = i * 30 + 15;
                  const p = polar(230, 230, 170, mid);
                  const sym = ["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓"][i];
                  return (
                    <g key={sign}>
                      <line x1={polar(230, 230, 150, i * 30).x} y1={polar(230, 230, 150, i * 30).y} x2={polar(230, 230, 190, i * 30).x} y2={polar(230, 230, 190, i * 30).y} stroke={`${GOLD}20`} strokeWidth="1" />
                      <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="10" fill={i === 0 ? GOLD : i === 6 ? INDIGO : "#9C8A6A"} fontWeight={i === 0 || i === 6 ? 700 : 500} fontFamily="var(--font-sans), sans-serif">{sym}</text>
                    </g>
                  );
                })}

                {/* 0° Aries marker */}
                <g style={{ cursor: "pointer" }} onClick={(event) => { event.stopPropagation(); toggleSvgTip("aries"); }}>
                  <circle cx="230" cy="40" r="14" fill={`${GOLD}15`} stroke={GOLD} strokeWidth="2" />
                  <text x="230" y="22" textAnchor="middle" fontSize="11" fill={GOLD} fontWeight={800} fontFamily="var(--font-sans), sans-serif">♈ 0°</text>
                </g>

                {/* Spica at 180° Libra */}
                <g style={{ cursor: "pointer" }} onClick={(event) => { event.stopPropagation(); toggleSvgTip("spica"); }}>
                  <circle cx="230" cy="420" r="18" fill="url(#spicaGlow)" stroke={INDIGO} strokeWidth="2.5" />
                  <text x="230" y="416" textAnchor="middle" fontSize="10" fill={INDIGO} fontWeight="800" fontFamily="var(--font-sans), sans-serif">★</text>
                  <text x="230" y="452" textAnchor="middle" fontSize="11" fill={INDIGO} fontWeight="700" fontFamily="var(--font-sans), sans-serif">Spica · 180°</text>
                </g>

                {/* Center cross */}
                <line x1="230" y1="230" x2="230" y2="40" stroke={GOLD} strokeWidth="1.5" strokeDasharray="5 3" opacity="0.6" />
                <line x1="230" y1="230" x2="230" y2="402" stroke={INDIGO} strokeWidth="1.5" strokeDasharray="5 3" opacity="0.6" />
                <circle cx="230" cy="230" r="4" fill={VERMILION} />

                {/* 180° label */}
                <text x="248" y="235" fontSize="10" fill={VERMILION} fontWeight={700} fontFamily="var(--font-sans), sans-serif">180°</text>

                {/* Inline tooltip */}
                {svgTip && (
                  <g transform={`translate(${svgTip === "aries" ? 30 : svgTip === "spica" ? 30 : 150}, ${svgTip === "aries" ? 60 : svgTip === "spica" ? 310 : 200})`}>
                    <rect x="0" y="0" width="260" height="58" rx="10" fill="rgba(255,253,245,0.98)" stroke={svgTip === "aries" ? GOLD : svgTip === "spica" ? INDIGO : JADE} strokeWidth="1.5" />
                    <text x="12" y="20" fontSize="12" fill={svgTip === "aries" ? GOLD : svgTip === "spica" ? INDIGO : JADE} fontWeight={700} fontFamily="var(--font-sans), sans-serif">
                      {svgTip === "aries" ? "Sidereal 0° Aries" : svgTip === "spica" ? "Spica (Citrā) · 180° Libra" : "Zodiac reference ring"}
                    </text>
                    <text x="12" y="38" fontSize="10" fill="#5A4A32" fontFamily="var(--font-sans), sans-serif">
                      {svgTip === "aries"
                        ? "Lahiri’s alignment-epoch zero: 21 March 285 CE."
                        : svgTip === "spica"
                          ? "Brightest star in Virgo. Citrā nakṣatra (14th of 27)."
                          : "The ring shows the 12-sign sidereal frame for the Lahiri anchor."}
                    </text>
                    <text x="248" y="18" textAnchor="end" fontSize="12" fill="#999" fontWeight={700} style={{ cursor: "pointer" }} onClick={() => setSvgTip(null)}>✕</text>
                  </g>
                )}
              </svg>
            </div>

            {/* Info panel */}
            <div style={{ flex: "1 1 280px", minWidth: 0 }}>
              <div style={{ background: `${INDIGO}06`, borderRadius: "14px", padding: "18px", border: `1px solid ${INDIGO}18`, marginBottom: "12px" }}>
                <h5 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "16px", fontWeight: 600, color: INDIGO, marginBottom: "8px" }}>Why Spica?</h5>
                <ul style={{ padding: 0, margin: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
                  {[
                    "Brightest star near the ecliptic — easy to observe",
                    "In Virgo, opposite Aries; anchors 0° Aries 180° away",
                    "Corresponds to Citrā nakṣatra (14th of 27) in classical tradition",
                  ].map((p, i) => (
                    <li key={i} style={{ fontSize: "12px", color: INK_PRIMARY, lineHeight: 1.5, paddingLeft: "14px", position: "relative" }}>
                      <span style={{ position: "absolute", left: 0, top: "5px", width: "5px", height: "5px", borderRadius: "50%", background: INDIGO }} />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ background: `${GOLD}06`, borderRadius: "14px", padding: "18px", border: `1px solid ${GOLD}18` }}>
                <h5 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "16px", fontWeight: 600, color: GOLD, marginBottom: "8px" }}>Alignment Epoch</h5>
                <p style={{ fontSize: "12px", color: INK_PRIMARY, lineHeight: 1.6, margin: 0 }}>
                  <strong>21 March 285 CE 12:00 UTC</strong> — the moment when the spring equinox coincided approximately with sidereal 0° Aries per Lahiri&apos;s specification. From this epoch, ayanāṁśa accumulates at ~50.2388 arc-sec per Julian year.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          TAB 3 — Calculator
         ═══════════════════════════════════════════════════════════ */}
      {tab === "calculator" && (
        <div>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <h4 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "20px", fontWeight: 600, color: INK_PRIMARY, marginBottom: "4px" }}>
              Lahiri Ayanāṁśa Calculator
            </h4>
            <p style={{ fontSize: "12px", color: INK_MUTED, margin: 0 }}>
              Simplified formula: <code style={{ color: GOLD, fontWeight: 700 }}>(Year − 285) × 50.2388 ÷ 3600</code> degrees
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center", justifyContent: "center", marginBottom: "24px", flexWrap: "wrap" }}>
            <input
              type="number"
              value={calcYear}
              onChange={(e) => setCalcYear(e.target.value)}
              placeholder="Year CE"
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                border: "1px solid rgba(156, 122, 47, 0.3)",
                background: "rgba(252, 245, 224, 0.5)",
                color: "var(--gl-ink-primary)",
                fontSize: "15px",
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                width: "140px",
                textAlign: "center",
                outline: "none",
              }}
            />
            <button
              onClick={handleCalc}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "10px 20px",
                borderRadius: "10px",
                border: "none",
                background: GOLD,
                color: "#FFF",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "var(--font-sans), system-ui, sans-serif",
              }}
            >
              <ChevronRight size={15} />
              Calculate
            </button>
            <button
              onClick={() => { setCalcYear("2026"); setCalcSteps(null); }}
              style={{
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid rgba(156, 122, 47, 0.25)",
                background: "transparent",
                color: "#9C7A2F",
                cursor: "pointer",
              }}
              title="Reset"
            >
              <RotateCcw size={15} />
            </button>
          </div>

          {calcSteps && (
            <div style={{ maxWidth: "640px", margin: "0 auto 24px" }}>
              {/* Steps */}
              <div style={{ background: `${GOLD}06`, borderRadius: "14px", padding: "22px", border: `1px solid ${GOLD}15`, marginBottom: "16px" }}>
                <h5 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "18px", fontWeight: 600, color: GOLD, marginBottom: "16px" }}>
                  Step-by-step for Year {calcSteps.year}
                </h5>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {[
                    { step: 1, text: "Subtract alignment epoch (285 CE)", math: `${calcSteps.year} − 285 = ${calcSteps.elapsed} years` },
                    { step: 2, text: "Multiply by Lahiri rate (50.2388 arc-sec/year)", math: `${calcSteps.elapsed} × 50.2388 = ${calcSteps.arcsec.toLocaleString(undefined, { maximumFractionDigits: 1 })} arc-seconds` },
                    { step: 3, text: "Divide by 3600 (arc-sec → degrees)", math: `${calcSteps.arcsec.toLocaleString(undefined, { maximumFractionDigits: 1 })} ÷ 3600 = ${calcSteps.decimal.toFixed(4)}°` },
                    { step: 4, text: "Convert to DMS", math: calcSteps.dms },
                  ].map((s) => (
                    <div key={s.step} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "26px", height: "26px", borderRadius: "999px", background: GOLD, color: "#FFF", fontSize: "12px", fontWeight: 700, flexShrink: 0, marginTop: "2px" }}>{s.step}</span>
                      <div>
                        <p style={{ fontSize: "12px", color: INK_PRIMARY, fontWeight: 600, marginBottom: "2px" }}>{s.text}</p>
                        <p style={{ fontSize: "14px", color: GOLD, fontWeight: 700, fontFamily: "monospace" }}>{s.math}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comparison card */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "16px" }}>
                <div style={{ background: `${GOLD}08`, borderRadius: "10px", padding: "14px", textAlign: "center", border: `1px solid ${GOLD}20` }}>
                  <p style={{ fontSize: "10px", color: INK_MUTED, marginBottom: "4px" }}>Simplified</p>
                  <p style={{ fontSize: "18px", fontWeight: 700, color: GOLD, fontFamily: "monospace" }}>{calcSteps.dms}</p>
                </div>
                <div style={{ background: `${INDIGO}08`, borderRadius: "10px", padding: "14px", textAlign: "center", border: `1px solid ${INDIGO}20` }}>
                  <p style={{ fontSize: "10px", color: INK_MUTED, marginBottom: "4px" }}>Precise (Astro)</p>
                  <p style={{ fontSize: "18px", fontWeight: 700, color: INDIGO, fontFamily: "monospace" }}>{activePrecise?.dms ?? "—"}</p>
                </div>
                <div style={{ background: `${VERMILION}08`, borderRadius: "10px", padding: "14px", textAlign: "center", border: `1px solid ${VERMILION}20` }}>
                  <p style={{ fontSize: "10px", color: INK_MUTED, marginBottom: "4px" }}>Difference</p>
                  <p style={{ fontSize: "18px", fontWeight: 700, color: VERMILION, fontFamily: "monospace" }}>
                    {activePrecise && calcSteps ? (() => {
                      const m = activePrecise.dms.match(/(\d+)°(\d+)′(\d+)″/);
                      const precise = m ? Number(m[1]) + Number(m[2]) / 60 + Number(m[3]) / 3600 : NaN;
                      const diffMin = Math.abs(calcSteps.decimal - precise) * 60;
                      return Number.isNaN(diffMin) ? "—" : `~${diffMin < 1 ? diffMin.toFixed(1) : Math.round(diffMin)}′`;
                    })() : "—"}
                  </p>
                </div>
              </div>

              {activePrecise && (
                <p style={{ textAlign: "center", fontSize: "11px", color: INK_MUTED, fontStyle: "italic" }}>
                  The simplified formula is within ~1 arc-minute of the precise modern Lahiri formula — sufficient for understanding + operational verification.
                </p>
              )}
            </div>
          )}

          {/* Reference table */}
          <div style={{ maxWidth: "520px", margin: "0 auto" }}>
            <h5 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "16px", fontWeight: 600, color: INK_PRIMARY, marginBottom: "12px", textAlign: "center" }}>
              Reference values
            </h5>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              {PRECISE_TABLE.map((r) => (
                <div
                  key={r.year}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "7px 14px",
                    borderRadius: "8px",
                    background: r.year === 2026 ? `${GOLD}08` : "transparent",
                    border: r.year === 2026 ? `1px solid ${GOLD}20` : "1px solid transparent",
                  }}
                >
                  <span style={{ fontSize: "12px", color: INK_PRIMARY, fontWeight: 500, width: "60px" }}>{r.year} CE</span>
                  <span style={{ fontSize: "13px", color: GOLD, fontWeight: 700, fontFamily: "monospace", flex: 1, textAlign: "center" }}>{r.dms}</span>
                  <span style={{ fontSize: "10px", color: INK_MUTED, fontStyle: "italic", width: "120px", textAlign: "right" }}>{r.note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
