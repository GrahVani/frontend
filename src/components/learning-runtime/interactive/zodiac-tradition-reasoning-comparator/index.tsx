"use client";

import { useState } from "react";
import { BookOpen, Telescope, Landmark, Scale, ChevronDown, ChevronUp } from "lucide-react";

const GOLD = "#C28220";
const INDIGO = "#4A6FA5";
const VERMILION = "#A23A1E";
const JADE = "#2F8C5A";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";

interface Dimension {
  key: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  vedic: { title: string; points: string[]; quote?: string };
  western: { title: string; points: string[]; quote?: string };
  synthesis: string;
}

const DIMENSIONS: Dimension[] = [
  {
    key: "doctrinal",
    label: "Doctrinal",
    icon: <BookOpen size={15} />,
    color: GOLD,
    vedic: {
      title: "Vedic — Sidereal Commitment",
      points: [
        "Classical Indian astronomy (Sūrya Siddhānta, Vedāṅga Jyotiṣa) defines the zodiac against fixed stars.",
        "The nakṣatra system (27/28 lunar mansions) is inherently star-based — each nakṣatra is anchored to a specific asterism.",
        "Rāśi boundaries are derived from nakṣatra divisions; moving to tropical would break the nakṣatra-rāśi correspondence.",
        "All four streams (Parāśari, Jaiminī, KP, Lal Kitab) operate within the sidereal frame without internal disagreement.",
      ],
      quote: "Sūrya Siddhānta Spaṣṭādhyāya 1.27 establishes the fixed-star reference frame for all planetary computation.",
    },
    western: {
      title: "Western — Tropical Commitment",
      points: [
        "Hellenistic astrology (Ptolemy's Tetrabiblos) defines the zodiac against seasonal markers.",
        "The tropical zodiac aligns with the Sun-Earth geometric relationship: equinoxes and solstices.",
        "The four cardinal points (Aries, Cancer, Libra, Capricorn) correspond to seasonal turning points.",
        "Psychological astrology emphasizes the 'seasonal temperament' theory — spring-born = Aries temperament.",
      ],
      quote: "Ptolemy's Tetrabiblos I.11–12 grounds the tropical zodiac in the observable Sun-Earth seasonal cycle.",
    },
    synthesis: "Both traditions have internally coherent doctrinal reasoning. The Vedic commitment is star-based because the classical corpus is built on nakṣatras. The Western commitment is season-based because the Hellenistic corpus is built on solar geometry. Neither refutes the other.",
  },
  {
    key: "observational",
    label: "Observational",
    icon: <Telescope size={15} />,
    color: INDIGO,
    vedic: {
      title: "Vedic — Fixed-Star Observation",
      points: [
        "Sidereal 0° Aries is defined by a specific point in the constellation Aries (near Revatī/ζ Piscium in Lahiri).",
        "This point is physically observable and stable on human-civilisational timescales (stars move, but imperceptibly over millennia).",
        "Observation: 'Point telescope at this region of sky — you are looking at sidereal Aries.'",
        "The fixed-star reference is independent of Earth's axial precession.",
      ],
      quote: "The sidereal reference is what you actually see when you look up at the night sky.",
    },
    western: {
      title: "Western — Seasonal Observation",
      points: [
        "Tropical 0° Aries is defined by the spring equinox — when day and night are equal and the Sun crosses the equator northward.",
        "This is directly observable without a telescope — anyone can note the equal-day-equal-night moment.",
        "Observation: 'Mark the day when shadows are balanced — that is tropical Aries 0°.'",
        "The seasonal reference is directly tied to Earth's climate and agriculture.",
      ],
      quote: "The tropical reference is what you experience when you feel the change of seasons.",
    },
    synthesis: "Both are observationally rigorous — they just observe different phenomena. Sidereal observes stellar positions. Tropical observes solar-seasonal geometry. Both are real, physical, repeatable measurements.",
  },
  {
    key: "historical",
    label: "Historical",
    icon: <Landmark size={15} />,
    color: VERMILION,
    vedic: {
      title: "Vedic — Historical Lineage",
      points: [
        "Vedāṅga Jyotiṣa (pre-classical, ~1400–1200 BCE per academic dating) already uses sidereal reference.",
        "Sūrya Siddhānta (classical, ~400–600 CE) formalises the sidereal computational framework.",
        "Varāhamihira's Pañcasiddhāntikā compares five schools — three are sidereal-foundational.",
        "The sidereal commitment predates the ~285 CE alignment epoch by over a millennium.",
      ],
      quote: "Indian astronomical tradition was sidereal before the tropical-sidereal gap was large enough to matter operationally.",
    },
    western: {
      title: "Western — Historical Lineage",
      points: [
        "Babylonian astronomy (2nd millennium BCE) used a zodiac of constellations — but the tropical formalisation came later.",
        "Hipparchus (~150–100 BCE) discovered precession and the tropical-sidereal distinction.",
        "Ptolemy (~150 CE) systematised the tropical zodiac in the Tetrabiblos, defining signs by seasonal quarters.",
        "Medieval European astrology inherited Ptolemy's tropical framework through Arabic transmission.",
      ],
      quote: "Western astrology's tropical commitment was formalised by Ptolemy and transmitted through the medieval Arabic-Latin translation movement.",
    },
    synthesis: "Both traditions have deep historical lineages. The Vedic sidereal commitment is older in continuous transmission. The Western tropical commitment was formalised later but has an equally rigorous historiography. The divergence is historical, not error.",
  },
  {
    key: "comparative",
    label: "Comparative",
    icon: <Scale size={15} />,
    color: JADE,
    vedic: {
      title: "Vedic — Cross-Tradition View",
      points: [
        "All four Vedic-astrology streams (Parāśari, Jaiminī, KP, Lal Kitab) use sidereal — no internal disagreement.",
        "The sidereal frame is necessary for nakṣatra-based techniques (daśā, muhūrta, praśna).",
        "Vedic practitioners generally acknowledge tropical as a valid parallel tradition for Western astrology.",
        "Misunderstanding: Some Western practitioners think sidereal 'does not account for precession' — it does; it simply uses a different reference point.",
      ],
      quote: "Within Jyotiṣa, the sidereal choice is unanimous across all schools and streams.",
    },
    western: {
      title: "Western — Cross-Tradition View",
      points: [
        "Modern Western astrology (psychological, evolutionary, Hellenistic revival) is overwhelmingly tropical.",
        "A small minority of Western sidereal practitioners exist (Cyril Fagan, James Eshelman lineage) — but this is not mainstream.",
        "Western practitioners often encounter Vedic astrology through Sun-sign differences ('I'm a Leo in Western but Cancer in Vedic').",
        "Misunderstanding: Some Vedic practitioners think tropical is 'wrong' — both are internally coherent within their own traditions.",
      ],
      quote: "Within Western astrology, the tropical choice is dominant; sidereal is a minority position with its own practitioner lineage.",
    },
    synthesis: "The honest comparative framing: two classical traditions, two reference frames, two internally coherent systems. The Vedic tradition is sidereal-unanimous. The Western tradition is tropical-dominant with a sidereal minority. Neither tradition's choice invalidates the other's.",
  },
];

/* ─── SVG helper ─── */
function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export function ZodiacTraditionReasoningComparator() {
  const [activeDim, setActiveDim] = useState("doctrinal");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [svgTip, setSvgTip] = useState<string | null>(null);

  const dim = DIMENSIONS.find((d) => d.key === activeDim)!;

  const toggle = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleTab = (key: string) => {
    setActiveDim(key);
    setExpanded({});
    setSvgTip(null);
  };

  const svgTips: Record<string, { title: string; color: string; body: string }> = {
    sidereal: {
      title: "Sidereal Reference Frame",
      color: GOLD,
      body: "Vedic Jyotiṣa anchors the zodiac to fixed stars. The nakṣatra system (27/28 lunar mansions) is inherently star-based — each nakṣatra maps to a specific asterism. All four Vedic streams (Parāśari, Jaiminī, KP, Lal Kitab) operate within this frame.",
    },
    tropical: {
      title: "Tropical Reference Frame",
      color: INDIGO,
      body: "Western astrology anchors the zodiac to the Vernal Equinox — the moment when day and night are equal and the Sun crosses the celestial equator northward. Ptolemy's Tetrabiblos formalised this seasonal framework around 150 CE.",
    },
    gap: {
      title: "The Ayanāṁśa Gap",
      color: VERMILION,
      body: "The ~24° angular distance between tropical 0° Aries (Vernal Equinox) and sidereal 0° Aries (fixed-star reference). This gap grows by ~1° every 72 years due to axial precession.",
    },
  };

  return (
    <div
      style={{
        maxWidth: "960px",
        margin: "0 auto",
        fontFamily: "var(--font-sans), system-ui, sans-serif",
      }}
    >
      {/* ═══════ HEADER SVG: Interactive Two-Tradition Explorer ═══════ */}
      <div style={{ marginBottom: "20px" }}>
        <svg viewBox="0 0 800 260" style={{ width: "100%", height: "auto", display: "block" }}>
          <defs>
            <radialGradient id="sunGrad" cx="40%" cy="40%">
              <stop offset="0%" stopColor="#FFE4A1" />
              <stop offset="50%" stopColor="#CC9028" />
              <stop offset="100%" stopColor="#8B5A2B" />
            </radialGradient>
            <radialGradient id="earthGrad" cx="35%" cy="35%">
              <stop offset="0%" stopColor="#4A9683" />
              <stop offset="60%" stopColor="#2A6E80" />
              <stop offset="100%" stopColor="#1A4A55" />
            </radialGradient>
            <filter id="tipShadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.12" />
            </filter>
          </defs>

          {/* ─── LEFT PANEL (Sidereal / Vedic) ─── */}
          <g
            style={{ cursor: "pointer" }}
            onClick={() => setSvgTip(svgTip === "sidereal" ? null : "sidereal")}
            onMouseEnter={(e) => (e.currentTarget.querySelector("rect")?.setAttribute("stroke", GOLD), e.currentTarget.querySelector("rect")?.setAttribute("stroke-width", "2.5"))}
            onMouseLeave={(e) => (e.currentTarget.querySelector("rect")?.setAttribute("stroke", `${GOLD}35`), e.currentTarget.querySelector("rect")?.setAttribute("stroke-width", "1.5"))}
          >
            <rect x="16" y="12" width="370" height="216" rx="14" fill="#FFFDF5" stroke={`${GOLD}35`} strokeWidth="1.5" />
            {/* Star dots */}
            {[...Array(20)].map((_, i) => (
              <circle key={`sl-${i}`} cx={36 + (i * 37) % 340} cy={26 + (i * 29) % 180} r={1 + (i % 2) * 0.6} fill={GOLD} opacity={0.25 + (i % 5) * 0.1} />
            ))}
            {/* Nakṣatra ring */}
            <circle cx="200" cy="118" r="68" fill="none" stroke={`${GOLD}40`} strokeWidth="1.5" strokeDasharray="4 3" />
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a, i) => {
              const p = polar(200, 118, 68, a);
              return <circle key={`nk-${i}`} cx={p.x} cy={p.y} r="3" fill={GOLD} opacity="0.8" />;
            })}
            <text x="200" y="46" textAnchor="middle" fontSize="12" fill={GOLD} fontWeight="700" fontFamily="var(--font-sans), sans-serif" style={{ pointerEvents: "none" }}>♈ Sidereal 0°</text>
            <text x="200" y="196" textAnchor="middle" fontSize="15" fill={GOLD} fontWeight="700" fontFamily="var(--font-sans), sans-serif" style={{ pointerEvents: "none" }}>Vedic · Sidereal</text>
            <text x="200" y="214" textAnchor="middle" fontSize="11" fill="#8A7A60" fontFamily="var(--font-sans), sans-serif" style={{ pointerEvents: "none" }}>Fixed-star reference · Nakṣatra-based</text>
          </g>

          {/* ─── RIGHT PANEL (Tropical / Western) ─── */}
          <g
            style={{ cursor: "pointer" }}
            onClick={() => setSvgTip(svgTip === "tropical" ? null : "tropical")}
            onMouseEnter={(e) => (e.currentTarget.querySelector("rect")?.setAttribute("stroke", INDIGO), e.currentTarget.querySelector("rect")?.setAttribute("stroke-width", "2.5"))}
            onMouseLeave={(e) => (e.currentTarget.querySelector("rect")?.setAttribute("stroke", `${INDIGO}25`), e.currentTarget.querySelector("rect")?.setAttribute("stroke-width", "1.5"))}
          >
            <rect x="414" y="12" width="370" height="216" rx="14" fill="#F8FAFF" stroke={`${INDIGO}25`} strokeWidth="1.5" />
            <circle cx="640" cy="62" r="20" fill="url(#sunGrad)" />
            <ellipse cx="640" cy="118" rx="78" ry="50" fill="none" stroke={`${INDIGO}30`} strokeWidth="1.5" strokeDasharray="5 4" />
            <circle cx="562" cy="118" r="15" fill="url(#earthGrad)" stroke="#2A6E80" strokeWidth="1.5" />
            <line x1="562" y1="118" x2="572" y2="86" stroke="#C28220" strokeWidth="2.5" strokeLinecap="round" />
            <text x="575" y="84" fontSize="11" fill="#C28220" fontWeight="800" fontFamily="var(--font-sans), sans-serif" style={{ pointerEvents: "none" }}>N</text>
            <text x="640" y="52" textAnchor="middle" fontSize="11" fill="#B07820" fontWeight="700" fontFamily="var(--font-sans), sans-serif" style={{ pointerEvents: "none" }}>☀ Summer Solstice</text>
            <text x="640" y="190" textAnchor="middle" fontSize="11" fill="#4A6FA5" fontWeight="600" fontFamily="var(--font-sans), sans-serif" style={{ pointerEvents: "none" }}>❄ Winter Solstice</text>
            <text x="548" y="122" textAnchor="end" fontSize="11" fill="#2F8C5A" fontWeight="600" fontFamily="var(--font-sans), sans-serif" style={{ pointerEvents: "none" }}>🌸 Vernal Equinox →</text>
            <text x="640" y="110" textAnchor="middle" fontSize="12" fill={INDIGO} fontWeight="700" fontFamily="var(--font-sans), sans-serif" style={{ pointerEvents: "none" }}>♈ Tropical 0°</text>
            <text x="640" y="196" textAnchor="middle" fontSize="15" fill={INDIGO} fontWeight="700" fontFamily="var(--font-sans), sans-serif" style={{ pointerEvents: "none" }}>Western · Tropical</text>
            <text x="640" y="214" textAnchor="middle" fontSize="11" fill="#6A6A80" fontFamily="var(--font-sans), sans-serif" style={{ pointerEvents: "none" }}>Seasonal reference · Sun-Earth geometry</text>
          </g>

          {/* ─── CENTER GAP (clickable) ─── */}
          <g
            style={{ cursor: "pointer" }}
            onClick={() => setSvgTip(svgTip === "gap" ? null : "gap")}
          >
            <line x1="388" y1="118" x2="412" y2="118" stroke={VERMILION} strokeWidth="2" strokeDasharray="4 2" />
            <text x="400" y="104" textAnchor="middle" fontSize="13" fill={VERMILION} fontWeight="800" fontFamily="var(--font-sans), sans-serif" style={{ pointerEvents: "none" }}>~24°</text>
            <text x="400" y="138" textAnchor="middle" fontSize="11" fill={VERMILION} fontWeight="600" fontFamily="var(--font-sans), sans-serif" style={{ pointerEvents: "none" }}>Ayanāṁśa gap</text>
          </g>

          {/* ─── INLINE TOOLTIP ─── */}
          {svgTip && svgTips[svgTip] && (() => {
            const t = svgTips[svgTip];
            const isLeft = svgTip === "sidereal";
            const isRight = svgTip === "tropical";
            const x = isLeft ? 30 : isRight ? 440 : 270;
            const maxW = 340;
            return (
              <g transform={`translate(${x}, 180)`} filter="url(#tipShadow)">
                <rect x="0" y="0" width={maxW} height="52" rx="10" fill="rgba(255,253,245,0.98)" stroke={t.color} strokeWidth="1.5" />
                <text x="12" y="20" fontSize="12" fill={t.color} fontWeight="700" fontFamily="var(--font-sans), sans-serif">{t.title}</text>
                <text x="12" y="38" fontSize="10" fill="#5A4A32" fontFamily="var(--font-sans), sans-serif">
                  {t.body.length > 90 ? t.body.slice(0, 90) + "…" : t.body}
                </text>
                <text x={maxW - 10} y="20" textAnchor="end" fontSize="10" fill={t.color} fontWeight="700" fontFamily="var(--font-sans), sans-serif" style={{ cursor: "pointer" }} onClick={() => setSvgTip(null)}>✕</text>
              </g>
            );
          })()}
        </svg>

        {/* Caption */}
        <p style={{ textAlign: "center", fontSize: "11px", color: "var(--gl-ink-muted)", marginTop: "6px", fontStyle: "italic" }}>
          Click any panel or the gap to explore · Use the tabs below to compare dimensions
        </p>
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
        {DIMENSIONS.map((d) => (
          <button
            key={d.key}
            onClick={() => handleTab(d.key)}
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
              background: activeDim === d.key ? d.color : `${d.color}12`,
              color: activeDim === d.key ? "#FFF" : d.color,
            }}
          >
            {d.icon}
            {d.label}
          </button>
        ))}
      </div>

      {/* Comparison grid — keyed so React re-mounts on tab change */}
      <div key={activeDim} style={{ animation: "fadeIn 280ms ease" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
          <ComparisonCard
            title={dim.vedic.title}
            color={GOLD}
            accentBg="rgba(194, 130, 32, 0.06)"
            points={dim.vedic.points}
            quote={dim.vedic.quote}
            isExpanded={expanded["vedic"]}
            onToggle={() => toggle("vedic")}
          />
          <ComparisonCard
            title={dim.western.title}
            color={INDIGO}
            accentBg="rgba(74, 111, 165, 0.06)"
            points={dim.western.points}
            quote={dim.western.quote}
            isExpanded={expanded["western"]}
            onToggle={() => toggle("western")}
          />
        </div>

        {/* Synthesis banner */}
        <div
          style={{
            marginTop: "20px",
            padding: "18px 22px",
            borderRadius: "14px",
            background: "linear-gradient(135deg, rgba(47, 140, 90, 0.06), rgba(58, 140, 90, 0.03))",
            border: "1px solid rgba(47, 140, 90, 0.18)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <Scale size={16} color={JADE} />
            <span style={{ fontSize: "13px", fontWeight: 700, color: JADE, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Synthesis — Both Layers Honoured
            </span>
          </div>
          <p style={{ fontSize: "14px", color: INK_PRIMARY, lineHeight: 1.65, margin: 0 }}>
            {dim.synthesis}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function ComparisonCard({
  title,
  color,
  accentBg,
  points,
  quote,
  isExpanded,
  onToggle,
}: {
  title: string;
  color: string;
  accentBg: string;
  points: string[];
  quote?: string;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      style={{
        background: accentBg,
        borderRadius: "16px",
        padding: "20px",
        border: `1px solid ${color}25`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h4
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "18px",
          fontWeight: 600,
          color: color,
          marginBottom: "14px",
          lineHeight: 1.2,
        }}
      >
        {title}
      </h4>

      <ul style={{ padding: 0, margin: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
        {(isExpanded ? points : points.slice(0, 2)).map((p, i) => (
          <li
            key={i}
            style={{
              fontSize: "13px",
              color: INK_PRIMARY,
              lineHeight: 1.6,
              paddingLeft: "16px",
              position: "relative",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: 0,
                top: "6px",
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: color,
              }}
            />
            {p}
          </li>
        ))}
      </ul>

      {points.length > 2 && (
        <button
          onClick={onToggle}
          style={{
            marginTop: "12px",
            alignSelf: "flex-start",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            padding: "5px 12px",
            borderRadius: "8px",
            border: `1px solid ${color}30`,
            background: "transparent",
            color: color,
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {isExpanded ? "Show less" : `+${points.length - 2} more`}
        </button>
      )}

      {quote && (
        <blockquote
          style={{
            margin: "14px 0 0",
            padding: "12px 14px",
            borderLeft: `3px solid ${color}`,
            background: "rgba(255, 255, 255, 0.4)",
            borderRadius: "0 8px 8px 0",
            fontSize: "12px",
            color: INK_SECONDARY,
            fontStyle: "italic",
            lineHeight: 1.5,
          }}
        >
          {quote}
        </blockquote>
      )}
    </div>
  );
}
