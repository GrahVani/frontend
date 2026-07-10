/**
 * Vedic Ecosystem Orbital — B. Visualiser (with D. Navigator traits).
 * Spec: curriculum/interactive-specs/vedic-ecosystem-orbital.md
 *
 * Four Vedic saṁhitās at the cardinal directions of a central maṇḍala.
 * Six Vedāṅgas orbit them as labelled satellites.
 * A time-slider scrubs from 1400 BCE (Lagadha) to 2000 CE (Pingree);
 * scholars fade in at their eras with their attributed works.
 *
 * Rotation of the orbital ring via drag (mouse / touch).
 * Reduced-motion respects: rotation disabled; slider becomes step-by-year.
 */

"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Devanagari } from "../@/components/learning-runtime/chrome/typography";

interface Veda {
  slug: "rig" | "yajur" | "sama" | "atharva";
  devanagari: string;
  iast: string;
  /** Cardinal position: 0 = north (top), 90 = east (right), 180 = south, 270 = west. */
  bearingDeg: number;
}

const VEDAS: Veda[] = [
  { slug: "rig",     devanagari: "ऋग्",      iast: "Ṛg",      bearingDeg: 0   },
  { slug: "yajur",   devanagari: "यजुर्",    iast: "Yajur",   bearingDeg: 90  },
  { slug: "sama",    devanagari: "साम",      iast: "Sāma",    bearingDeg: 180 },
  { slug: "atharva", devanagari: "अथर्व",    iast: "Atharva", bearingDeg: 270 },
];

interface OrbitalLimb {
  slug: string;
  devanagari: string;
  iast: string;
}

const LIMBS: OrbitalLimb[] = [
  { slug: "shiksha",   devanagari: "शिक्षा",   iast: "Śikṣā"     },
  { slug: "kalpa",     devanagari: "कल्प",     iast: "Kalpa"     },
  { slug: "vyakarana", devanagari: "व्याकरण",  iast: "Vyākaraṇa" },
  { slug: "nirukta",   devanagari: "निरुक्त",  iast: "Nirukta"   },
  { slug: "chandas",   devanagari: "छन्दस्",   iast: "Chandas"   },
  { slug: "jyotisha",  devanagari: "ज्योतिष",  iast: "Jyotiṣa"   },
];

interface Scholar {
  slug: "lagadha" | "varahamihira" | "pingree";
  name: string;
  /** Year (negative for BCE). */
  year: number;
  /** Era range during which this scholar's portrait is visible. */
  era: [number, number];
  attribution: string;
  works: string[];
}

const SCHOLARS: Scholar[] = [
  {
    slug: "lagadha",
    name: "Lagadha",
    year: -1400,
    era: [-1500, -1100],
    attribution: "~1400 BCE · Vedic-era sage",
    works: ["Vedāṅga Jyotiṣa — the earliest surviving Indian Jyotiṣa text"],
  },
  {
    slug: "varahamihira",
    name: "Varāhamihira",
    year: 550,
    era: [450, 700],
    attribution: "~550 CE · Gupta-era polymath",
    works: ["Bṛhat Saṁhitā", "Bṛhat Jātaka", "Pañca-siddhāntikā"],
  },
  {
    slug: "pingree",
    name: "David Pingree",
    year: 1981,
    era: [1950, 2010],
    attribution: "1933-2005 · modern academic anchor",
    works: ["Jyotiḥśāstra (HIL Vol VI, 1981) — the definitive modern history"],
  },
];

const YEAR_MIN = -1400;
const YEAR_MAX = 2000;

interface Period {
  name: string;
  range: [number, number];
  /** Period-specific accent — colors the panel chrome when this era is active. */
  accent: string;
  /** Soft tint of the accent — used for the period pill background + Jyotiṣa-now block bg. */
  tintBg: string;
  /** Light border tint for the period pill. */
  tintBorder: string;
  jyotishaContext: string;
  alsoHappening: string;
}

const PERIODS: Period[] = [
  {
    name: "Vedic",
    range: [-1500, -500],
    accent: "#C28220",
    tintBg: "rgba(232, 158, 42, 0.14)",
    tintBorder: "rgba(194, 130, 32, 0.45)",
    jyotishaContext:
      "Earliest formalisation of celestial time-keeping. Lagadha's Vedāṅga Jyotiṣa establishes the discipline as one of the six limbs of Veda.",
    alsoHappening:
      "The other five Vedāṅgas (Śikṣā, Kalpa, Vyākaraṇa, Nirukta, Chandas) are being codified as the oral support-disciplines for Vedic recitation.",
  },
  {
    name: "Classical",
    range: [-500, 1200],
    accent: "#4F6FA8",
    tintBg: "rgba(79, 111, 168, 0.10)",
    tintBorder: "rgba(79, 111, 168, 0.45)",
    jyotishaContext:
      "Mathematical astronomy enters the discipline. Varāhamihira systematises siddhāntic, horā, and saṁhitā as the three skandhas. Charts, dashas, and predictive frameworks mature.",
    alsoHappening:
      "Pāṇini's grammatical corpus (Aṣṭādhyāyī) becomes canonical for Vyākaraṇa. Sūtra-traditions across Kalpa and Nirukta consolidate.",
  },
  {
    name: "Modern",
    range: [1200, 2000],
    accent: "#7A3E2C",
    tintBg: "rgba(162, 58, 30, 0.10)",
    tintBorder: "rgba(122, 62, 44, 0.45)",
    jyotishaContext:
      "Regional schools formalise (Parāśarī, Jaimini, KP). Academic Indology (Pingree) reconstructs the textual lineage from manuscript evidence; computational platforms re-engage the discipline.",
    alsoHappening:
      "The Vedāṅgas as a system shifts from oral-living tradition to scholarly-textual study. Jyotiṣa carries the discipline into the present.",
  },
];

function periodFor(year: number): Period {
  return PERIODS.find((p) => year >= p.range[0] && year <= p.range[1]) ?? PERIODS[1];
}

/** Two-syllable display name for each scholar — keeps the pill labels even-width. */
const SCHOLAR_PILL_LABEL: Record<string, string> = {
  lagadha: "Lagadha",
  varahamihira: "Varāha",
  pingree: "Pingree",
};

function formatYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} BCE`;
  if (year === 0) return "0 CE";
  return `${year} CE`;
}

export function VedicEcosystemOrbital() {
  const [year, setYear] = useState(550);
  const [rotation, setRotation] = useState(0);
  const [activeLimb, setActiveLimb] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragRef = useRef<{ startAngle: number; startRotation: number } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const activeScholars = useMemo(
    () => SCHOLARS.filter((s) => year >= s.era[0] && year <= s.era[1]),
    [year],
  );

  // Rotation drag handlers
  const onPointerDown = (e: React.PointerEvent) => {
    if (reducedMotion || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
    dragRef.current = { startAngle: angle, startRotation: rotation };
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
    setRotation(dragRef.current.startRotation + (angle - dragRef.current.startAngle));
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    if ((e.target as Element).hasPointerCapture(e.pointerId)) {
      (e.target as Element).releasePointerCapture(e.pointerId);
    }
  };

  // Limb positions on the orbital ring (radius 180, 6 evenly spaced)
  const ORBITAL_R = 180;
  const limbPositions = LIMBS.map((_, i) => {
    const angle = (i / LIMBS.length) * 360 + rotation - 90; // start at top
    return {
      x: Math.cos((angle * Math.PI) / 180) * ORBITAL_R,
      y: Math.sin((angle * Math.PI) / 180) * ORBITAL_R,
    };
  });

  const vedaPositions = VEDAS.map((v) => {
    const angle = v.bearingDeg - 90;
    return {
      x: Math.cos((angle * Math.PI) / 180) * 70,
      y: Math.sin((angle * Math.PI) / 180) * 70,
    };
  });

  const currentPeriod = periodFor(year);

  return (
    <div className="my-6" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* ───── TOP — Era reader strip (horizontal band, full canvas width) ───── */}
      <header
        className="gl-surface-twilight-glass"
        style={{
          padding: "18px 24px",
          display: "grid",
          gridTemplateColumns: "auto auto 1fr 1.4fr",
          gap: "28px",
          alignItems: "center",
          borderLeft: `4px solid ${currentPeriod.accent}`,
          transition: "border-color 320ms cubic-bezier(0.32, 0.72, 0.24, 1)",
        }}
      >
        {/* Period pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 14px",
            borderRadius: "999px",
            background: currentPeriod.tintBg,
            border: `1px solid ${currentPeriod.tintBorder}`,
            transition: "all 320ms cubic-bezier(0.32, 0.72, 0.24, 1)",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: currentPeriod.accent,
            }}
          />
          <span
            style={{
              fontSize: "11.5px",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: currentPeriod.accent,
              fontWeight: 700,
              fontFamily: "var(--font-sans), system-ui, sans-serif",
            }}
          >
            {currentPeriod.name} period
          </span>
        </div>

        {/* Year */}
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "28px",
            fontWeight: 500,
            color: "var(--gl-ink-primary)",
            lineHeight: 1.1,
            letterSpacing: "0.005em",
            flexShrink: 0,
          }}
        >
          {formatYear(year)}
        </p>

        {/* Scholar */}
        <div style={{ borderLeft: "1px solid rgba(156, 122, 47, 0.18)", paddingLeft: "20px" }}>
          {activeScholars.length > 0 ? (
            activeScholars.slice(0, 1).map((s) => (
              <div key={s.slug}>
                <p
                  style={{
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "0.18em",
                    color: "var(--gl-ink-muted)",
                    fontWeight: 700,
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                    marginBottom: "4px",
                  }}
                >
                  Anchor scholar
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontWeight: 500,
                    fontSize: "20px",
                    color: currentPeriod.accent,
                    lineHeight: 1.2,
                    transition: "color 320ms cubic-bezier(0.32, 0.72, 0.24, 1)",
                  }}
                >
                  {s.name}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontStyle: "italic",
                    fontSize: "13.5px",
                    color: "var(--gl-ink-secondary)",
                    marginTop: "2px",
                  }}
                >
                  {s.attribution}
                </p>
              </div>
            ))
          ) : (
            <p
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontStyle: "italic",
                fontSize: "14px",
                color: "var(--gl-ink-muted)",
                lineHeight: 1.55,
              }}
            >
              No anchor scholar at this exact year. Jump to one of the canonical scholars below.
            </p>
          )}
        </div>

        {/* Jyotiṣa-now context — period-tinted block */}
        <div
          style={{
            background: currentPeriod.tintBg,
            border: `1px solid ${currentPeriod.tintBorder}`,
            borderLeft: `3px solid ${currentPeriod.accent}`,
            padding: "12px 14px",
            borderRadius: "0 8px 8px 0",
            transition: "all 320ms cubic-bezier(0.32, 0.72, 0.24, 1)",
          }}
        >
          <p
            style={{
              fontSize: "10.5px",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: currentPeriod.accent,
              fontWeight: 700,
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              marginBottom: "4px",
            }}
          >
            Jyotiṣa now
          </p>
          <p
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontStyle: "italic",
              fontSize: "14.5px",
              color: "var(--gl-ink-primary)",
              lineHeight: 1.55,
            }}
          >
            {currentPeriod.jyotishaContext}
          </p>
        </div>
      </header>

      {/* ───── MIDDLE — Orbital diagram (centered hero) ───── */}
      <div
        className="gl-surface-twilight-glass"
        style={{ padding: "32px 24px", textAlign: "center" }}
      >
          <svg
            ref={svgRef}
            viewBox="-240 -240 480 480"
            role="group"
            aria-label="Vedic ecosystem orbital — four Vedas at the centre, six Vedāṅgas orbiting"
            style={{
              width: "100%",
              maxWidth: "480px",
              height: "auto",
              cursor: reducedMotion ? "default" : "grab",
              touchAction: "none",
              margin: "0 auto",
              display: "block",
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <defs>
              <radialGradient id="orbitalCenterGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#F4C77B" stopOpacity="0.32" />
                <stop offset="65%" stopColor="#E8A85C" stopOpacity="0.10" />
                <stop offset="100%" stopColor="#E8A85C" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="orbitalVedaFill" cx="35%" cy="30%" r="80%">
                <stop offset="0%" stopColor="#FFFCF0" />
                <stop offset="100%" stopColor="#F5EDD8" />
              </radialGradient>
              <radialGradient id="orbitalLimbFill" cx="35%" cy="30%" r="80%">
                <stop offset="0%" stopColor="#FFF9E5" />
                <stop offset="100%" stopColor="#F0E0BA" />
              </radialGradient>
              <filter id="orbitalShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="1.6" floodColor="#6B4423" floodOpacity="0.20" />
              </filter>
            </defs>

            {/* Warm radial backdrop at the maṇḍala centre */}
            <circle cx={0} cy={0} r={220} fill="url(#orbitalCenterGlow)" />

            {/* Orbital ring — visible dashed bronze on parchment */}
            <circle
              cx={0}
              cy={0}
              r={ORBITAL_R}
              fill="none"
              stroke="#8B5A2B"
              strokeWidth={1.4}
              strokeDasharray="5 7"
              strokeOpacity={0.55}
            />

            {/* Central maṇḍala — 4 Vedas at cardinal positions */}
            <circle
              cx={0}
              cy={0}
              r={108}
              fill="none"
              stroke="#9C7A2F"
              strokeWidth={1.6}
              strokeOpacity={0.70}
            />
            {/* Inner gold seal ring */}
            <circle
              cx={0}
              cy={0}
              r={48}
              fill="none"
              stroke="#C9A24D"
              strokeWidth={0.8}
              strokeOpacity={0.55}
            />
            {/* OM at center — bigger, solid copper-gold */}
            <text
              x={0}
              y={10}
              textAnchor="middle"
              fontSize={36}
              fill="#9C7A2F"
              fontFamily="var(--font-devanagari), serif"
              fontWeight={500}
            >
              ॐ
            </text>

            {/* Four Vedas — cream fill, copper border, drop shadow */}
            {VEDAS.map((v, i) => (
              <g key={v.slug} transform={`translate(${vedaPositions[i].x}, ${vedaPositions[i].y})`}>
                <circle
                  r={26}
                  fill="url(#orbitalVedaFill)"
                  stroke="#9C7A2F"
                  strokeWidth={2.2}
                  filter="url(#orbitalShadow)"
                />
                <circle r={20} fill="none" stroke="#C9A24D" strokeWidth={0.8} strokeOpacity={0.45} />
                <text
                  y={-34}
                  textAnchor="middle"
                  fontSize={14}
                  fill="#6B4423"
                  fontFamily="var(--font-devanagari), serif"
                  fontWeight={500}
                >
                  {v.devanagari}
                </text>
                <text
                  y={5}
                  textAnchor="middle"
                  fontSize={12}
                  fill="#8B5A2B"
                  fontFamily="var(--font-cormorant), serif"
                  fontStyle="italic"
                  fontWeight={600}
                >
                  {v.iast}
                </text>
              </g>
            ))}

            {/* Six Vedāṅgas on the orbital ring */}
            {LIMBS.map((l, i) => {
              const pos = limbPositions[i];
              const isActive = activeLimb === l.slug;
              const isJyotisha = l.slug === "jyotisha";
              return (
                <g
                  key={l.slug}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  role="button"
                  aria-label={`${l.iast} — Vedāṅga ${i + 1} of 6. Activate to highlight its relationship to the four Vedas.`}
                  aria-pressed={isActive}
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveLimb(isActive ? null : l.slug);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveLimb(isActive ? null : l.slug);
                    }
                  }}
                  className="gl-focus-ring"
                  style={{ cursor: "pointer" }}
                >
                  <circle
                    r={28}
                    fill="url(#orbitalLimbFill)"
                    stroke={isActive ? "#A23A1E" : isJyotisha ? "#C9A24D" : "#9C7A2F"}
                    strokeWidth={isActive ? 2.6 : isJyotisha ? 2.2 : 1.8}
                    filter="url(#orbitalShadow)"
                  />
                  <circle
                    r={22}
                    fill="none"
                    stroke={isActive ? "#C9A24D" : "rgba(201, 162, 77, 0.40)"}
                    strokeWidth={0.8}
                  />
                  <text
                    textAnchor="middle"
                    fontSize={isJyotisha ? 14 : 12}
                    y={5}
                    fill={isActive ? "#A23A1E" : isJyotisha ? "#9C7A2F" : "#6B4423"}
                    fontFamily="var(--font-cormorant), serif"
                    fontStyle="italic"
                    fontWeight={isJyotisha ? 700 : 600}
                  >
                    {l.iast}
                  </text>
                </g>
              );
            })}

            {/* Relationship lines from active Vedāṅga to the 4 Vedas */}
            {activeLimb && (() => {
              const idx = LIMBS.findIndex((l) => l.slug === activeLimb);
              if (idx === -1) return null;
              const from = limbPositions[idx];
              return VEDAS.map((_, vi) => (
                <line
                  key={vi}
                  x1={from.x}
                  y1={from.y}
                  x2={vedaPositions[vi].x}
                  y2={vedaPositions[vi].y}
                  stroke="#A23A1E"
                  strokeWidth={0.9}
                  strokeOpacity={0.55}
                  strokeDasharray="3 5"
                />
              ));
            })()}
          </svg>
        </div>


        {/* ───── BOTTOM — Slider + scholar quick-jump (full canvas width) ───── */}
        {(() => {
          const period = currentPeriod;
          return (
            <div
              className="gl-surface-twilight-glass"
              style={{
                padding: "20px 28px 22px",
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: "32px",
                alignItems: "center",
              }}
            >
              <div>
                <label
                  htmlFor="orbital-year-slider"
                  style={{
                    fontSize: "11.5px",
                    textTransform: "uppercase",
                    letterSpacing: "0.18em",
                    color: "var(--gl-ink-muted)",
                    fontWeight: 700,
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                    display: "block",
                    marginBottom: "10px",
                  }}
                >
                  Scrub through history
                </label>
                <input
                  id="orbital-year-slider"
                  type="range"
                  min={YEAR_MIN}
                  max={YEAR_MAX}
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value, 10))}
                  aria-valuetext={formatYear(year)}
                  style={{
                    width: "100%",
                    accentColor: period.accent,
                    cursor: "pointer",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "12.5px",
                    marginTop: "6px",
                    fontFamily: "var(--font-cormorant), serif",
                    fontStyle: "italic",
                    color: "var(--gl-ink-muted)",
                  }}
                >
                  <span>1400 BCE</span>
                  <span>0</span>
                  <span>2000 CE</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                {SCHOLARS.map((s) => {
                  const isActive = year >= s.era[0] && year <= s.era[1];
                  const scholarPeriod = periodFor(s.year);
                  const fill = isActive ? scholarPeriod.accent : "transparent";
                  return (
                    <button
                      key={s.slug}
                      type="button"
                      onClick={() => setYear(s.year)}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "999px",
                        background: fill,
                        border: isActive
                          ? `1px solid ${scholarPeriod.accent}`
                          : `1px solid ${scholarPeriod.tintBorder}`,
                        color: isActive ? "#FFF9F0" : scholarPeriod.accent,
                        fontFamily: "var(--font-sans), system-ui, sans-serif",
                        fontSize: "12px",
                        fontWeight: isActive ? 700 : 600,
                        letterSpacing: "0.10em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        transition: "all 180ms cubic-bezier(0.32, 0.72, 0.24, 1)",
                        boxShadow: isActive
                          ? `0 2px 8px ${scholarPeriod.accent}44`
                          : "none",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {SCHOLAR_PILL_LABEL[s.slug] ?? s.name.split(" ")[0]}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })()}


      {!reducedMotion && (
        <p
          className="text-xs italic mt-4 text-center"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            color: "var(--gl-ink-muted)",
          }}
        >
          Drag the orbital ring to rotate. Drag the time slider — or tap a scholar name — to scrub history. Tap a Vedāṅga to see its relationship lines to the four Vedas.
        </p>
      )}
    </div>
  );
}
