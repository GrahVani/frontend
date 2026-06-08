"use client";

import { useState, useMemo } from "react";
import { BookOpen, Languages, List, Route, ArrowRight, ArrowLeft } from "lucide-react";

const GOLD = "#C28220";
const INDIGO = "#4A6FA5";
const VERMILION = "#A23A1E";
const JADE = "#2F8C5A";
const PURPLE = "#6F4FA8";
const TEAL = "#2A6E80";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";

/* ─── Ayanamsha convention data ─── */
const CONVENTIONS = [
  {
    name: "Lahiri",
    value2026: "24°19′",
    diffFromLahiri: "—",
    origin: "N.C. Lahiri 1955 — official Indian government calendar reform",
    usedBy: "Indian government standard; most Parāśari; curriculum default; Lal Kitab; Jaiminī revival (SJC + BVB)",
    color: GOLD,
  },
  {
    name: "Krishnamurti (KP)",
    value2026: "24°13′",
    diffFromLahiri: "−6′",
    origin: "K.S. Krishnamurti's KP Reader I (1963–1972)",
    usedBy: "All KP practice — horary + sub-lord + CSL methodology",
    color: INDIGO,
  },
  {
    name: "Raman",
    value2026: "22°55′",
    diffFromLahiri: "−1°24′",
    origin: "B.V. Raman's specifications",
    usedBy: "Raman-lineage practitioners",
    color: VERMILION,
  },
  {
    name: "Yukteshwar",
    value2026: "22°42′",
    diffFromLahiri: "−1°37′",
    origin: "Sri Yukteshwar's The Holy Science (1894)",
    usedBy: "Yukteshwar-lineage practitioners; some Western-Vedic-fusion contexts",
    color: JADE,
  },
  {
    name: "Pushya-pakṣa",
    value2026: "26°15′",
    diffFromLahiri: "+1°56′",
    origin: "Traditional alignment-epoch based on Pushya nakṣatra",
    usedBy: "Some traditional Indian regional practitioners",
    color: PURPLE,
  },
  {
    name: "Sūrya Siddhānta",
    value2026: "varies",
    diffFromLahiri: "varies",
    origin: "Classical Indian astronomical tradition — Spaṣṭādhyāya precession model",
    usedBy: "Some traditional + scholarly contexts",
    color: TEAL,
  },
  {
    name: "Tropical",
    value2026: "0°",
    diffFromLahiri: "−24°19′",
    origin: "Treats sidereal positions = tropical positions (no offset)",
    usedBy: "Western-tropical-Vedic experimental practice (minority)",
    color: "#8B5A2B",
  },
];

/* ─── Stream mapping ─── */
const STREAMS = [
  { name: "Parāśari", ayanamsha: "Lahiri", note: "General predictive methodology — Indian government standard", color: GOLD },
  { name: "Jaiminī (SJC + BVB)", ayanamsha: "Lahiri", note: "Jaiminī revival lineages — same ayanāṁśa as Parāśari", color: GOLD },
  { name: "KP", ayanamsha: "Krishnamurti", note: "Mandatory — sub-lord + CSL system depends on KP ayanāṁśa", color: INDIGO },
  { name: "Lal Kitab", ayanamsha: "Lahiri", note: "Typically Lahiri; some regional practitioners use Pushya-pakṣa", color: GOLD },
  { name: "Raman lineage", ayanamsha: "Raman", note: "Distinct lineage with its own ayanāṁśa convention", color: VERMILION },
  { name: "Yukteshwar lineage", ayanamsha: "Yukteshwar", note: "Distinct lineage — The Holy Science (1894) framework", color: JADE },
];

/* ─── Helpers ─── */
function toDMS(decimalDeg: number): string {
  const d = Math.floor(decimalDeg);
  const mFull = (decimalDeg - d) * 60;
  const m = Math.floor(mFull);
  const s = Math.round((mFull - m) * 60);
  return `${d}°${m}′${s}″`;
}

function ayanamshaForYear(year: number): number {
  // Curriculum's taught Lahiri simplified formula (2.2.2 §4.4): linear from the
  // 285 CE zero-point at 50.2388″/year. → 2026 ≈ 24°17′46″ (precise table 24°19′01″,
  // the ~1′ gap being nutation + higher-order terms, per 2.2.2).
  return (year - 285) * 50.2388 / 3600;
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export function AyanamshaDefinitionExplorer() {
  const [tab, setTab] = useState<"definition" | "etymology" | "conventions" | "streams">("definition");
  const [tropicalInput, setTropicalInput] = useState<string>("75.5");
  const [convYear, setConvYear] = useState<string>("2026");
  const [selectedConv, setSelectedConv] = useState<string | null>("Lahiri");
  const [selectedStream, setSelectedStream] = useState<string | null>(null);

  const ay = useMemo(() => {
    const y = parseInt(convYear, 10);
    return Number.isNaN(y) ? ayanamshaForYear(2026) : ayanamshaForYear(y);
  }, [convYear]);

  const siderealResult = useMemo(() => {
    const t = parseFloat(tropicalInput);
    if (Number.isNaN(t)) return null;
    return (t - ay + 360) % 360;
  }, [tropicalInput, ay]);

  const activeConv = CONVENTIONS.find((c) => c.name === selectedConv);

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
          { key: "definition" as const, label: "Definition", icon: <BookOpen size={14} /> },
          { key: "etymology" as const, label: "Etymology", icon: <Languages size={14} /> },
          { key: "conventions" as const, label: "7 Conventions", icon: <List size={14} /> },
          { key: "streams" as const, label: "Stream Matcher", icon: <Route size={14} /> },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
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

      {/* ═══════ TAB 1: Definition + Calculator ═══════ */}
      {tab === "definition" && (
        <div>
          {/* Visual diagram */}
          <div
            className="gl-surface-twilight-glass"
            style={{
              borderRadius: "18px",
              padding: "28px",
              border: "1px solid rgba(156, 122, 47, 0.15)",
              marginBottom: "24px",
            }}
          >
            <svg viewBox="0 0 700 280" style={{ width: "100%", height: "auto", display: "block" }}>
              {/* Ecliptic line */}
              <line x1="60" y1="200" x2="640" y2="200" stroke="#4A6FA5" strokeWidth="2" strokeDasharray="6 4" opacity="0.6" />
              <text x="645" y="205" fontSize="11" fill="#4A6FA5" opacity="0.8" fontFamily="var(--font-sans), sans-serif">Ecliptic</text>

              {/* Sidereal zero */}
              <line x1="160" y1="140" x2="160" y2="200" stroke={GOLD} strokeWidth="2.5" strokeDasharray="4 2" />
              <circle cx="160" cy="200" r="7" fill={GOLD} stroke="#FFF" strokeWidth="1.5" />
              <text x="160" y="125" textAnchor="middle" fontSize="13" fill={GOLD} fontWeight={700} fontFamily="var(--font-sans), sans-serif">Sidereal 0° ♈</text>
              <text x="160" y="110" textAnchor="middle" fontSize="10" fill={GOLD} opacity="0.85" fontFamily="var(--font-sans), sans-serif">Fixed-star reference</text>

              {/* Tropical zero */}
              <line x1="440" y1="140" x2="440" y2="200" stroke={INDIGO} strokeWidth="2.5" strokeDasharray="4 2" />
              <circle cx="440" cy="200" r="7" fill={INDIGO} stroke="#FFF" strokeWidth="1.5" />
              <text x="440" y="125" textAnchor="middle" fontSize="13" fill={INDIGO} fontWeight={700} fontFamily="var(--font-sans), sans-serif">Tropical 0° ♈</text>
              <text x="440" y="110" textAnchor="middle" fontSize="10" fill={INDIGO} opacity="0.85" fontFamily="var(--font-sans), sans-serif">Vernal Equinox</text>

              {/* Gap arrow */}
              <line x1="170" y1="170" x2="430" y2="170" stroke={VERMILION} strokeWidth="2.5" markerEnd="url(#arrowRed)" markerStart="url(#arrowRedRev)" />
              <text x="300" y="162" textAnchor="middle" fontSize="14" fill={VERMILION} fontWeight={700} fontFamily="var(--font-sans), sans-serif">
                Ayanāṁśa ≈ {toDMS(ay)}
              </text>
              <text x="300" y="190" textAnchor="middle" fontSize="11" fill={VERMILION} opacity="0.9" fontFamily="var(--font-sans), sans-serif">
                (Year {convYear} CE · Lahiri)
              </text>

              {/* Direction labels */}
              <text x="100" y="230" textAnchor="middle" fontSize="10" fill="#9C7A2F" opacity="0.7" fontFamily="var(--font-sans), sans-serif">← Eastward along ecliptic</text>
              <text x="520" y="230" textAnchor="middle" fontSize="10" fill="#9C7A2F" opacity="0.7" fontFamily="var(--font-sans), sans-serif">Westward →</text>

              {/* Year slider */}
              <foreignObject x="200" y="240" width="300" height="40">
                <input
                  type="range"
                  min="1900"
                  max="2100"
                  step="1"
                  value={convYear}
                  onChange={(e) => setConvYear(e.target.value)}
                  style={{ width: "100%", accentColor: GOLD, cursor: "pointer" }}
                />
              </foreignObject>

              <defs>
                <marker id="arrowRed" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                  <path d="M0,0 L8,4 L0,8" fill={VERMILION} />
                </marker>
                <marker id="arrowRedRev" markerWidth="8" markerHeight="8" refX="2" refY="4" orient="auto">
                  <path d="M8,0 L0,4 L8,8" fill={VERMILION} />
                </marker>
              </defs>
            </svg>
          </div>

          {/* Conversion calculator */}
          <div
            style={{
              padding: "22px",
              borderRadius: "16px",
              background: `${GOLD}06`,
              border: `1px solid ${GOLD}18`,
            }}
          >
            <h4
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "20px",
                fontWeight: 600,
                color: INK_PRIMARY,
                marginBottom: "16px",
              }}
            >
              Conversion Formula
            </h4>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                marginBottom: "20px",
                flexWrap: "wrap",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "11px", color: INK_MUTED, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>
                  Tropical Longitude
                </p>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="360"
                  value={tropicalInput}
                  onChange={(e) => setTropicalInput(e.target.value)}
                  style={{
                    width: "120px",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: `1px solid ${INDIGO}40`,
                    background: `${INDIGO}08`,
                    color: INK_PRIMARY,
                    fontSize: "15px",
                    fontWeight: 700,
                    textAlign: "center",
                    outline: "none",
                  }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <ArrowRight size={20} color={VERMILION} />
                <span style={{ fontSize: "11px", color: VERMILION, fontWeight: 700 }}>− {toDMS(ay)}</span>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "11px", color: INK_MUTED, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>
                  Sidereal Longitude
                </p>
                <div
                  style={{
                    width: "120px",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: `1px solid ${GOLD}40`,
                    background: `${GOLD}08`,
                    color: GOLD,
                    fontSize: "15px",
                    fontWeight: 700,
                    textAlign: "center",
                    fontFamily: "monospace",
                  }}
                >
                  {siderealResult ? siderealResult.toFixed(2) : "—"}°
                </div>
              </div>
            </div>
            <p style={{ fontSize: "12px", color: INK_SECONDARY, textAlign: "center", lineHeight: 1.5 }}>
              <code style={{ color: GOLD, fontWeight: 700 }}>Sidereal = Tropical − Ayanāṁśa</code> · Using Lahiri ayanāṁśa for {convYear} CE
            </p>
          </div>
        </div>
      )}

      {/* ═══════ TAB 2: Etymology ═══════ */}
      {tab === "etymology" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Sanskrit compound visualization */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              flexWrap: "wrap",
              padding: "28px",
              background: `${GOLD}06`,
              borderRadius: "16px",
              border: `1px solid ${GOLD}15`,
            }}
          >
            <WordBlock devanagari="अयन" iast="ayana" meaning="equinox-motion / going" color={INDIGO} />
            <span style={{ fontSize: "28px", color: GOLD, fontWeight: 300 }}>+</span>
            <WordBlock devanagari="अंश" iast="aṁśa" meaning="portion / part / share" color={VERMILION} />
            <span style={{ fontSize: "28px", color: GOLD, fontWeight: 300 }}>=</span>
            <WordBlock devanagari="अयनांश" iast="ayanāṁśa" meaning="portion of equinox-motion" color={GOLD} isResult />
          </div>

          {/* Detailed breakdown */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            <EtymologyCard
              title="Ayana (अयन)"
              color={INDIGO}
              root="√i (going / moving)"
              meaning="Equinox motion — the precession-driven movement of equinox points along the ecliptic"
              related={["uttarāyaṇa (north-going)", "dakṣiṇāyana (south-going)"]}
            />
            <EtymologyCard
              title="Aṁśa (अंश)"
              color={VERMILION}
              root="√aṁś (to share / divide)"
              meaning="Portion / part / share — used for angular portions of the zodiac"
              related={["navamāṁśa (D-9)", "daśāṁśa (D-10)", "ṣaṣṭyāṁśa (D-60)"]}
            />
          </div>

          {/* Full meaning */}
          <div
            style={{
              padding: "20px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, rgba(194, 130, 32, 0.06), rgba(156, 122, 47, 0.03))",
              border: `1px solid ${GOLD}15`,
            }}
          >
            <p style={{ fontSize: "15px", color: INK_PRIMARY, lineHeight: 1.7, margin: 0 }}>
              <strong style={{ color: GOLD }}>Ayanāṁśa</strong> literally means{" "}
              <em>"the portion of the equinox-motion"</em> — the accumulated angular portion of equinox precession since the alignment epoch (~285 CE per Lahiri). The current ~{toDMS(ay)} means: <em>the equinox has moved approximately {toDMS(ay)} westward against the fixed stars since the alignment epoch.</em>
            </p>
          </div>
        </div>
      )}

      {/* ═══════ TAB 3: 7 Conventions ═══════ */}
      {tab === "conventions" && (
        <div>
          {/* Convention selector */}
          <div style={{ display: "flex", gap: "6px", marginBottom: "16px", flexWrap: "wrap" }}>
            {CONVENTIONS.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedConv(c.name)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "999px",
                  border: `1.5px solid ${selectedConv === c.name ? c.color : "rgba(156,122,47,0.15)"}`,
                  background: selectedConv === c.name ? `${c.color}12` : "transparent",
                  color: selectedConv === c.name ? c.color : INK_MUTED,
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 150ms ease",
                }}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Detail card */}
          {activeConv && (
            <div
              style={{
                padding: "22px",
                borderRadius: "16px",
                background: `${activeConv.color}06`,
                border: `1px solid ${activeConv.color}20`,
                marginBottom: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "32px",
                    height: "32px",
                    borderRadius: "10px",
                    background: activeConv.color,
                    color: "#FFF",
                    fontSize: "14px",
                    fontWeight: 700,
                  }}
                >
                  {activeConv.name[0]}
                </span>
                <h4 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "22px", fontWeight: 600, color: activeConv.color, margin: 0 }}>
                  {activeConv.name}
                </h4>
                <span style={{ marginLeft: "auto", fontSize: "20px", fontWeight: 700, color: activeConv.color, fontFamily: "monospace" }}>
                  {activeConv.value2026}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <DataRow label="Diff from Lahiri" value={activeConv.diffFromLahiri} color={activeConv.color} />
                <DataRow label="Origin" value={activeConv.origin} color={activeConv.color} />
                <DataRow label="Used by" value={activeConv.usedBy} color={activeConv.color} />
              </div>
            </div>
          )}

          {/* Comparison table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${GOLD}30` }}>
                  <th style={{ textAlign: "left", padding: "8px", color: INK_MUTED, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>System</th>
                  <th style={{ textAlign: "center", padding: "8px", color: INK_MUTED, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>2026</th>
                  <th style={{ textAlign: "center", padding: "8px", color: INK_MUTED, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>vs Lahiri</th>
                  <th style={{ textAlign: "left", padding: "8px", color: INK_MUTED, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Primary Users</th>
                </tr>
              </thead>
              <tbody>
                {CONVENTIONS.map((c) => (
                  <tr
                    key={c.name}
                    style={{
                      borderBottom: "1px solid rgba(156,122,47,0.08)",
                      cursor: "pointer",
                      background: selectedConv === c.name ? `${c.color}06` : "transparent",
                    }}
                    onClick={() => setSelectedConv(c.name)}
                  >
                    <td style={{ padding: "10px 8px", fontWeight: 700, color: c.color }}>{c.name}</td>
                    <td style={{ padding: "10px 8px", textAlign: "center", fontFamily: "monospace", fontWeight: 700, color: INK_PRIMARY }}>{c.value2026}</td>
                    <td style={{ padding: "10px 8px", textAlign: "center", fontFamily: "monospace", color: c.diffFromLahiri.startsWith("+") ? VERMILION : c.diffFromLahiri === "—" ? INK_MUTED : JADE }}>{c.diffFromLahiri}</td>
                    <td style={{ padding: "10px 8px", color: INK_SECONDARY, maxWidth: "300px" }}>{c.usedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══════ TAB 4: Stream Matcher ═══════ */}
      {tab === "streams" && (
        <div>
          <p style={{ fontSize: "13px", color: INK_SECONDARY, marginBottom: "16px", lineHeight: 1.5 }}>
            Click a Jyotiṣa stream or lineage to see which ayanāṁśa convention it uses. Mixing conventions across methodologies produces operational mismatches.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {STREAMS.map((s) => {
              const isActive = selectedStream === s.name;
              const conv = CONVENTIONS.find((c) => c.name === s.ayanamsha);
              return (
                <div key={s.name}>
                  <button
                    onClick={() => setSelectedStream(isActive ? null : s.name)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "14px 18px",
                      borderRadius: "12px",
                      border: `1.5px solid ${isActive ? s.color : "rgba(156,122,47,0.12)"}`,
                      background: isActive ? `${s.color}08` : "transparent",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "32px",
                        height: "32px",
                        borderRadius: "10px",
                        background: s.color,
                        color: "#FFF",
                        fontSize: "12px",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {s.name[0]}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "14px", fontWeight: 700, color: INK_PRIMARY, marginBottom: "2px" }}>{s.name}</p>
                      <p style={{ fontSize: "11px", color: INK_SECONDARY, lineHeight: 1.4 }}>{s.note}</p>
                    </div>
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: "999px",
                        background: `${conv?.color || s.color}15`,
                        color: conv?.color || s.color,
                        fontSize: "12px",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {s.ayanamsha}
                    </span>
                    {isActive ? <ArrowLeft size={16} color={s.color} style={{ transform: "rotate(-90deg)" }} /> : <ArrowLeft size={16} color={INK_MUTED} style={{ transform: "rotate(90deg)" }} />}
                  </button>

                  {isActive && conv && (
                    <div
                      style={{
                        marginTop: "8px",
                        marginLeft: "44px",
                        padding: "14px 18px",
                        borderRadius: "12px",
                        background: `${conv.color}06`,
                        border: `1px solid ${conv.color}15`,
                      }}
                    >
                      <p style={{ fontSize: "12px", color: INK_SECONDARY, lineHeight: 1.6, margin: 0 }}>
                        <strong style={{ color: conv.color }}>{conv.name}</strong> ayanāṁśa ({conv.value2026} in 2026).{" "}
                        {conv.origin}. This convention is operationally required for {s.name} methodology — using a different ayanāṁśa would shift all planetary positions, nakṣatras, and daśā calculations.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Sub-components ─── */

function WordBlock({ devanagari, iast, meaning, color, isResult }: { devanagari: string; iast: string; meaning: string; color: string; isResult?: boolean }) {
  return (
    <div
      style={{
        padding: isResult ? "18px 24px" : "14px 20px",
        borderRadius: "14px",
        background: `${color}${isResult ? "15" : "08"}`,
        border: `2px solid ${color}${isResult ? "40" : "25"}`,
        textAlign: "center",
        minWidth: "120px",
      }}
    >
      <p style={{ fontSize: isResult ? "28px" : "22px", color: color, fontWeight: 700, marginBottom: "4px", lineHeight: 1.2 }}>{devanagari}</p>
      <p style={{ fontSize: "13px", color: color, fontWeight: 600, fontStyle: "italic", marginBottom: "2px" }}>{iast}</p>
      <p style={{ fontSize: "11px", color: INK_MUTED, lineHeight: 1.4 }}>{meaning}</p>
    </div>
  );
}

function EtymologyCard({ title, color, root, meaning, related }: { title: string; color: string; root: string; meaning: string; related: string[] }) {
  return (
    <div style={{ padding: "18px", borderRadius: "14px", background: `${color}06`, border: `1px solid ${color}18` }}>
      <h5 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "18px", fontWeight: 600, color: color, marginBottom: "10px" }}>{title}</h5>
      <p style={{ fontSize: "12px", color: INK_MUTED, marginBottom: "6px" }}>
        Root: <em>{root}</em>
      </p>
      <p style={{ fontSize: "13px", color: INK_PRIMARY, lineHeight: 1.6, marginBottom: "10px" }}>{meaning}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {related.map((r) => (
          <span key={r} style={{ padding: "4px 10px", borderRadius: "8px", background: `${color}12`, color: color, fontSize: "11px", fontWeight: 600 }}>
            {r}
          </span>
        ))}
      </div>
    </div>
  );
}

function DataRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "baseline" }}>
      <span style={{ fontSize: "11px", color: INK_MUTED, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", minWidth: "100px" }}>{label}</span>
      <span style={{ fontSize: "13px", color: INK_PRIMARY, lineHeight: 1.5 }}>{value}</span>
    </div>
  );
}
