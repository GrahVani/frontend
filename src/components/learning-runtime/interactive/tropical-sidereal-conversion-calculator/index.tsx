"use client";

import { useState, useMemo } from "react";
import { Calculator, ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react";

const GOLD = "#C28220";
const INDIGO = "#4A6FA5";
const VERMILION = "#A23A1E";
const JADE = "#2F8C5A";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";

/* ─── Zodiac sign data ─── */
const SIGNS = [
  { name: "Aries", devanagari: "मेष", symbol: "♈", start: 0, element: "Fire" },
  { name: "Taurus", devanagari: "वृष", symbol: "♉", start: 30, element: "Earth" },
  { name: "Gemini", devanagari: "मिथुन", symbol: "♊", start: 60, element: "Air" },
  { name: "Cancer", devanagari: "कर्क", symbol: "♋", start: 90, element: "Water" },
  { name: "Leo", devanagari: "सिंह", symbol: "♌", start: 120, element: "Fire" },
  { name: "Virgo", devanagari: "कन्या", symbol: "♍", start: 150, element: "Earth" },
  { name: "Libra", devanagari: "तुला", symbol: "♎", start: 180, element: "Air" },
  { name: "Scorpio", devanagari: "वृश्चिक", symbol: "♏", start: 210, element: "Water" },
  { name: "Sagittarius", devanagari: "धनु", symbol: "♐", start: 240, element: "Fire" },
  { name: "Capricorn", devanagari: "मकर", symbol: "♑", start: 270, element: "Earth" },
  { name: "Aquarius", devanagari: "कुम्भ", symbol: "♒", start: 300, element: "Air" },
  { name: "Pisces", devanagari: "मीन", symbol: "♓", start: 330, element: "Water" },
];

function signForLongitude(deg: number) {
  const normalized = ((deg % 360) + 360) % 360;
  for (let i = SIGNS.length - 1; i >= 0; i--) {
    if (normalized >= SIGNS[i].start) return SIGNS[i];
  }
  return SIGNS[0];
}

function toDMS(decimalDeg: number): string {
  const d = Math.floor(decimalDeg);
  const mFull = (decimalDeg - d) * 60;
  const m = Math.floor(mFull);
  const s = Math.round((mFull - m) * 60);
  return `${d}°${m}′${s}″`;
}

/* ─── Ayanamsha by year (Lahiri / Citrāpakṣa) ─── */
function ayanamshaForYear(year: number): number {
  // Curriculum's taught Lahiri simplified formula (2.2.2 §4.4): linear from the
  // 285 CE zero-point at 50.2388″/year. → 2026 ≈ 24°17′46″ (precise ≈ 24°19′).
  return (year - 285) * 50.2388 / 3600;
}

/* ─── Sun longitude approximation by date ─── */
function sunLongitudeForDate(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  /* Very rough: Sun moves ~0.9856° per day. 0° at spring equinox (~March 20 = day 79) */
  return ((dayOfYear - 79) * 0.9856 + 360) % 360;
}

export function TropicalSiderealConversionCalculator() {
  const [tab, setTab] = useState<"date" | "longitude">("date");
  const [birthDate, setBirthDate] = useState("1990-06-15");
  const [tropicalDeg, setTropicalDeg] = useState<string>("75.5");
  const [year, setYear] = useState<string>("2026");

  const ayanamsha = useMemo(() => {
    const y = parseInt(year, 10);
    return Number.isNaN(y) ? ayanamshaForYear(2026) : ayanamshaForYear(y);
  }, [year]);

  /* Date tab computation */
  const dateResult = useMemo(() => {
    const d = new Date(birthDate);
    if (Number.isNaN(d.getTime())) return null;
    const y = d.getFullYear();
    const ay = ayanamshaForYear(y);
    const sunLon = sunLongitudeForDate(d);
    const siderealLon = (sunLon - ay + 360) % 360;
    return {
      tropicalSign: signForLongitude(sunLon),
      siderealSign: signForLongitude(siderealLon),
      tropicalDeg: sunLon,
      siderealDeg: siderealLon,
      ayanamsha: ay,
      year: y,
    };
  }, [birthDate]);

  /* Longitude tab computation */
  const lonResult = useMemo(() => {
    const t = parseFloat(tropicalDeg);
    if (Number.isNaN(t)) return null;
    const y = parseInt(year, 10);
    const ay = Number.isNaN(y) ? 24.18 : ayanamshaForYear(y);
    const s = (t - ay + 360) % 360;
    return {
      tropicalSign: signForLongitude(t),
      siderealSign: signForLongitude(s),
      tropicalDeg: t,
      siderealDeg: s,
      ayanamsha: ay,
    };
  }, [tropicalDeg, year]);

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "var(--font-sans), system-ui, sans-serif",
      }}
    >
      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        {[
          { key: "date" as const, label: "Sun Sign by Birth Date" },
          { key: "longitude" as const, label: "Longitude Converter" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              flex: 1,
              padding: "10px 16px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.04em",
              background: tab === t.key ? GOLD : `${GOLD}12`,
              color: tab === t.key ? "#FFF" : GOLD,
              transition: "all 180ms ease",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Ayanamsha year input (shared) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "20px",
          padding: "12px 16px",
          background: "rgba(194, 130, 32, 0.05)",
          borderRadius: "12px",
          border: "1px solid rgba(194, 130, 32, 0.12)",
        }}
      >
        <span style={{ fontSize: "13px", color: INK_SECONDARY, fontWeight: 500 }}>Ayanāṁśa year:</span>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          style={{
            width: "80px",
            padding: "6px 10px",
            borderRadius: "8px",
            border: "1px solid rgba(156, 122, 47, 0.3)",
            background: "rgba(252, 245, 224, 0.5)",
            color: INK_PRIMARY,
            fontSize: "14px",
            fontWeight: 700,
            textAlign: "center",
            outline: "none",
          }}
        />
        <span style={{ fontSize: "13px", color: VERMILION, fontWeight: 700 }}>
          ≈ {toDMS(ayanamsha)}
        </span>
        <span style={{ fontSize: "11px", color: INK_MUTED, marginLeft: "auto" }}>
          Formula: (Year − 285) ÷ 72
        </span>
      </div>

      {/* ═══════ TAB 1: Date → Sun Signs ═══════ */}
      {tab === "date" && (
        <div>
          <div style={{ display: "flex", gap: "12px", marginBottom: "24px", alignItems: "center" }}>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid rgba(156, 122, 47, 0.3)",
                background: "rgba(252, 245, 224, 0.5)",
                color: INK_PRIMARY,
                fontSize: "14px",
                outline: "none",
                flex: 1,
              }}
            />
          </div>

          {dateResult && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
              {/* Tropical result */}
              <SignResultCard
                label="Tropical Sun Sign"
                color={INDIGO}
                sign={dateResult.tropicalSign}
                longitude={dateResult.tropicalDeg}
                frame="tropical"
              />

              {/* Arrow */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ArrowRight size={24} color={VERMILION} />
              </div>

              {/* Sidereal result */}
              <SignResultCard
                label="Sidereal Sun Sign"
                color={GOLD}
                sign={dateResult.siderealSign}
                longitude={dateResult.siderealDeg}
                frame="sidereal"
              />
            </div>
          )}

          {/* Consequence note */}
          {dateResult && dateResult.tropicalSign.name !== dateResult.siderealSign.name && (
            <div
              style={{
                marginTop: "20px",
                padding: "14px 18px",
                borderRadius: "12px",
                background: "rgba(162, 58, 30, 0.05)",
                border: "1px solid rgba(162, 58, 30, 0.15)",
                display: "flex",
                gap: "10px",
                alignItems: "flex-start",
              }}
            >
              <AlertTriangle size={18} color={VERMILION} style={{ marginTop: "2px", flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: "13px", color: INK_PRIMARY, fontWeight: 600, marginBottom: "4px" }}>
                  Sign shift detected
                </p>
                <p style={{ fontSize: "12px", color: INK_SECONDARY, lineHeight: 1.6 }}>
                  Tropical {dateResult.tropicalSign.name} → Sidereal {dateResult.siderealSign.name}.{" "}
                  The ~{dateResult.ayanamsha.toFixed(1)}° gap pushes the Sun back by approximately one sign for most modern-era births. This is why many people find their "Vedic Sun sign" is the sign before their "Western Sun sign."
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════ TAB 2: Longitude Converter ═══════ */}
      {tab === "longitude" && (
        <div>
          <div style={{ display: "flex", gap: "12px", marginBottom: "24px", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <label style={{ display: "block", fontSize: "11px", color: INK_MUTED, marginBottom: "4px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Tropical Longitude (°)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="360"
                value={tropicalDeg}
                onChange={(e) => setTropicalDeg(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid rgba(74, 111, 165, 0.3)",
                  background: "rgba(74, 111, 165, 0.04)",
                  color: INK_PRIMARY,
                  fontSize: "15px",
                  fontWeight: 700,
                  outline: "none",
                }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", paddingTop: "18px" }}>
              <ArrowRight size={20} color={VERMILION} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <label style={{ display: "block", fontSize: "11px", color: INK_MUTED, marginBottom: "4px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Sidereal Longitude (°)
              </label>
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid rgba(194, 130, 32, 0.3)",
                  background: "rgba(194, 130, 32, 0.04)",
                  color: GOLD,
                  fontSize: "15px",
                  fontWeight: 700,
                }}
              >
                {lonResult ? lonResult.siderealDeg.toFixed(2) : "—"}°
              </div>
            </div>
          </div>

          {lonResult && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
              <ConversionDetailCard
                label="Tropical"
                color={INDIGO}
                sign={lonResult.tropicalSign}
                dms={toDMS(lonResult.tropicalDeg)}
              />
              <ConversionDetailCard
                label="Sidereal"
                color={GOLD}
                sign={lonResult.siderealSign}
                dms={toDMS(lonResult.siderealDeg)}
              />
              <div
                style={{
                  padding: "14px",
                  borderRadius: "12px",
                  background: "rgba(162, 58, 30, 0.04)",
                  border: "1px solid rgba(162, 58, 30, 0.12)",
                }}
              >
                <p style={{ fontSize: "11px", color: INK_MUTED, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
                  Ayanāṁśa subtracted
                </p>
                <p style={{ fontSize: "18px", fontWeight: 700, color: VERMILION, fontFamily: "var(--font-cormorant), serif" }}>
                  {toDMS(lonResult.ayanamsha)}
                </p>
                <p style={{ fontSize: "11px", color: INK_SECONDARY, marginTop: "4px" }}>
                  {lonResult.tropicalDeg.toFixed(2)}° − {lonResult.ayanamsha.toFixed(2)}° = {lonResult.siderealDeg.toFixed(2)}°
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════ Consequences section ═══════ */}
      <div style={{ marginTop: "28px" }}>
        <h4
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "18px",
            fontWeight: 600,
            color: INK_PRIMARY,
            marginBottom: "14px",
          }}
        >
          What shifts when the reference frame is wrong?
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {[
            {
              label: "Graha-in-rāśi",
              desc: "Every planet lands in a different sign. A tropical Leo Sun becomes sidereal Cancer Sun. All rāśi-based analysis (lordship, dignity, yogas) changes.",
              color: VERMILION,
            },
            {
              label: "Daśā starting lord",
              desc: "Vimśottarī daśā depends on Moon's nakṣatra, which is computed from sidereal longitude. Wrong ayanāṁśa → wrong starting daśā lord → wrong timing predictions.",
              color: GOLD,
            },
            {
              label: "Nakṣatra placement",
              desc: "The 27 nakṣatras are purely sidereal. A 24° error can shift Moon from one nakṣatra to an adjacent one, changing deity, guna, and directional attributes.",
              color: INDIGO,
            },
            {
              label: "Varga (divisional) charts",
              desc: "D-9 (navāṁśa), D-10 (daśamāṁśa), and all vargas compute from rāśi positions. Wrong rāśi → every varga is misaligned.",
              color: JADE,
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
                padding: "12px 16px",
                borderRadius: "10px",
                background: `${item.color}06`,
                border: `1px solid ${item.color}18`,
              }}
            >
              <AlertTriangle size={16} color={item.color} style={{ marginTop: "2px", flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: "12px", fontWeight: 700, color: item.color, marginBottom: "2px" }}>{item.label}</p>
                <p style={{ fontSize: "12px", color: INK_SECONDARY, lineHeight: 1.55 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function SignResultCard({
  label,
  color,
  sign,
  longitude,
  frame,
}: {
  label: string;
  color: string;
  sign: (typeof SIGNS)[0];
  longitude: number;
  frame: string;
}) {
  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "16px",
        background: `${color}06`,
        border: `1px solid ${color}20`,
        textAlign: "center",
      }}
    >
      <p style={{ fontSize: "11px", fontWeight: 700, color: color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
        {label}
      </p>
      <p style={{ fontSize: "42px", lineHeight: 1, marginBottom: "6px" }}>{sign.symbol}</p>
      <p style={{ fontSize: "18px", fontWeight: 700, color: INK_PRIMARY, marginBottom: "2px" }}>
        {sign.name} <span style={{ fontSize: "13px", color: INK_MUTED, fontWeight: 500 }}>({sign.devanagari})</span>
      </p>
      <p style={{ fontSize: "12px", color: INK_SECONDARY, marginBottom: "8px" }}>{sign.element}</p>
      <p style={{ fontSize: "13px", color: color, fontWeight: 700, fontFamily: "monospace" }}>
        {toDMS(longitude)} {frame}
      </p>
    </div>
  );
}

function ConversionDetailCard({
  label,
  color,
  sign,
  dms,
}: {
  label: string;
  color: string;
  sign: (typeof SIGNS)[0];
  dms: string;
}) {
  return (
    <div
      style={{
        padding: "14px",
        borderRadius: "12px",
        background: `${color}06`,
        border: `1px solid ${color}18`,
      }}
    >
      <p style={{ fontSize: "11px", color: INK_MUTED, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
        {label}
      </p>
      <p style={{ fontSize: "16px", fontWeight: 700, color: INK_PRIMARY, marginBottom: "2px" }}>
        {sign.symbol} {sign.name}
      </p>
      <p style={{ fontSize: "12px", color: color, fontWeight: 700, fontFamily: "monospace" }}>{dms}</p>
    </div>
  );
}
