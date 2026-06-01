"use client";

import { useState, useMemo, createContext, useContext, Fragment, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { IAST } from "../../chrome/typography";
import {
  RASHIS, getDignitiesForRashi, MULA_TRIKONA_REDIRECTS, OPPOSITE_PAIRS,
  ELEMENT_COLORS, MODALITY_COLORS, DIGNITY_COLORS, GRAHA_SYMBOLS,
  describeArc, polarToCartesian, midAngle,
  type RashiData,
} from "../rashi-data";

/* ─── Lesson context for lesson-aware defaults ─── */
export const LessonContext = createContext<{ slug: string }>({ slug: "" });

export function LessonProvider({ children, value }: { children: ReactNode; value: { slug: string } }) {
  return <LessonContext.Provider value={value}>{children}</LessonContext.Provider>;
}

export function useLessonSlug() {
  return useContext(LessonContext).slug;
}

function getDefaultRashiFromSlug(slug: string): number {
  const map: Record<string, number> = {
    "mesha-aries-the-fiery-cardinal": 1,
    "vrishabha-taurus-the-earthen-fixed": 2,
    "mithuna-gemini-the-airy-mutable": 3,
    "karka-cancer-the-watery-cardinal": 4,
    "simha-leo-the-fiery-fixed": 5,
    "kanya-virgo-the-earthen-mutable": 6,
    "tula-libra-the-airy-cardinal": 7,
    "vrishchika-scorpio-the-watery-fixed": 8,
    "dhanus-sagittarius-the-fiery-mutable": 9,
    "makara-capricorn-the-earthen-cardinal": 10,
    "kumbha-aquarius-the-airy-fixed": 11,
    "meena-pisces-the-watery-mutable": 12,
  };
  return map[slug] ?? 1;
}

/* ─── SVG Wheel sub-component ─── */
function RashiWheel({
  selected,
  compare,
  onSelect,
  onHover,
  hovered,
  showAxis,
  highlightGroup,
}: {
  selected: number;
  compare: number | null;
  onSelect: (n: number) => void;
  onHover: (n: number | null) => void;
  hovered: number | null;
  showAxis?: boolean;
  highlightGroup?: number[];
}) {
  const cx = 150;
  const cy = 150;
  const r = 128;
  const innerR = 72;
  const shouldReduceMotion = useReducedMotion();
  const [focusedSegment, setFocusedSegment] = useState<number | null>(null);

  return (
    <svg viewBox="0 0 300 300" className="w-full" style={{ maxWidth: 300 }} role="img" aria-label="Interactive 12-segment Zodiac Wheel showing sign attributes">
      <defs>
        {/* Inner hub gradient to match Module 4 Chapter 1 Lesson 1 */}
        <radialGradient id="hubGrad" cx={cx} cy={cy} r={innerR} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF9F0" />
          <stop offset="60%" stopColor="#F2E6D0" />
          <stop offset="100%" stopColor="#E7D6B8" />
        </radialGradient>
      </defs>
      {/* Background rings */}
      <circle cx={cx} cy={cy} r={r} fill="var(--gl-surface-manuscript)" opacity={0.15} stroke="var(--gl-gold-accent)" strokeOpacity={0.25} strokeWidth={1} />
      <circle cx={cx} cy={cy} r={innerR} fill="none" stroke="var(--gl-gold-accent)" strokeOpacity={0.15} strokeWidth={1} />

      {/* 180° axis lines */}
      {showAxis && OPPOSITE_PAIRS.map((pair) => {
        const a = polarToCartesian(cx, cy, r - 4, (pair.rashiA - 1) * 30 + 15);
        const b = polarToCartesian(cx, cy, r - 4, (pair.rashiB - 1) * 30 + 15);
        const isActive = selected === pair.rashiA || selected === pair.rashiB;
        return (
          <line
            key={pair.axis}
            x1={a.x} y1={a.y} x2={b.x} y2={b.y}
            stroke={isActive ? "#C9A24D" : "var(--gl-gold-accent)"}
            strokeOpacity={isActive ? 0.5 : 0.1}
            strokeWidth={isActive ? 2 : 1}
            strokeDasharray={isActive ? "none" : "4 4"}
          />
        );
      })}

      {RASHIS.map((rashi) => {
        const i = rashi.number - 1;
        const startAngle = i * 30;
        const endAngle = (i + 1) * 30;
        const isSelected = selected === rashi.number;
        const isCompare = compare === rashi.number;
        const isHovered = hovered === rashi.number;
        const isHighlighted = highlightGroup?.includes(rashi.number);
        const isFocused = focusedSegment === rashi.number;

        const path = describeArc(cx, cy, r, startAngle, endAngle);
        const m = midAngle(startAngle, endAngle);
        const labelPos = polarToCartesian(cx, cy, (r + innerR) / 2, m);
        const numPos = polarToCartesian(cx, cy, (r + innerR) / 2 + 16, m);

        const ec = ELEMENT_COLORS[rashi.element];
        const baseFill = isSelected || isCompare || isHovered || isHighlighted
          ? `${rashi.color}35`
          : `${rashi.color}12`;
        const stroke = isSelected ? rashi.color : isHovered ? rashi.color : `${rashi.color}45`;
        const strokeW = isSelected ? 2.5 : isHovered ? 2 : 1;

        return (
          <g
            key={rashi.number}
            role="button"
            tabIndex={0}
            aria-pressed={isSelected || isCompare}
            aria-label={`${rashi.nameDevanagari} ${rashi.nameIAST} (${rashi.nameEnglish}) segment, spanning from ${startAngle} to ${endAngle} degrees`}
            style={{ cursor: "pointer", outline: "none" }}
            onClick={() => onSelect(rashi.number)}
            onMouseEnter={() => onHover(rashi.number)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => setFocusedSegment(rashi.number)}
            onBlur={() => setFocusedSegment(null)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onSelect(rashi.number);
                e.preventDefault();
              }
            }}
          >
            <path
              d={path}
              fill={baseFill}
              stroke={stroke}
              strokeWidth={strokeW}
              style={{ pointerEvents: "auto", transition: shouldReduceMotion ? undefined : "all 0.2s ease" }}
            />
            {isFocused && (
              <path
                d={path}
                fill="none"
                stroke="var(--gl-gold-accent)"
                strokeWidth={2}
                strokeDasharray="3 3"
                style={{ pointerEvents: "none" }}
              />
            )}
            {/* Inner cutout */}
            <path d={describeArc(cx, cy, innerR, startAngle, endAngle)} fill="url(#hubGrad)" opacity={1} style={{ pointerEvents: "none" }} />
            <text x={labelPos.x} y={labelPos.y - 3} textAnchor="middle" dominantBaseline="middle" fill={isSelected ? "#fff" : "var(--gl-ink-primary)"} fontSize={10} fontFamily="var(--font-devanagari)" style={{ pointerEvents: "none", fontWeight: isSelected ? 700 : 400 }}>
              {rashi.nameDevanagari}
            </text>
            <text x={numPos.x} y={numPos.y + 10} textAnchor="middle" dominantBaseline="middle" fill={isSelected ? "#fff" : "var(--gl-ink-muted)"} fontSize={8} style={{ pointerEvents: "none" }}>
              {rashi.number}
            </text>
          </g>
        );
      })}

      {/* Center label */}
      <text x={cx} y={cy - 5} textAnchor="middle" dominantBaseline="middle" fill="var(--gl-gold-accent)" fontSize={12} fontFamily="var(--font-cormorant)" fontWeight={600}>12 Rāśis</text>
      <text x={cx} y={cy + 9} textAnchor="middle" dominantBaseline="middle" fill="var(--gl-ink-muted)" fontSize={9}>360° sidereal</text>
    </svg>
  );
}

/* ─── Main component ─── */
export function RashiAttributeWheel() {
  const slug = useLessonSlug();
  const [selected, setSelected] = useState<number>(getDefaultRashiFromSlug(slug));
  const [compare, setCompare] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"attributes" | "compare" | "grid" | "kalapurusa">("attributes");
  const [hovered, setHovered] = useState<number | null>(null);
  const [showAxis, setShowAxis] = useState(false);
  const [showRedirects, setShowRedirects] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  const rashi = useMemo(() => RASHIS.find((r) => r.number === selected)!, [selected]);
  const compareRashi = useMemo(() => (compare ? (RASHIS.find((r) => r.number === compare) ?? null) : null), [compare]);
  const dignities = useMemo(() => getDignitiesForRashi(selected), [selected]);

  /* Keyboard navigation */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (activeTab === "attributes" || activeTab === "compare") {
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          const prev = ((selected - 2 + 12) % 12) + 1;
          setSelected(prev);
          if (activeTab === "compare" && compare !== null) {
            setCompare(prev);
          }
        } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          const next = (selected % 12) + 1;
          setSelected(next);
          if (activeTab === "compare" && compare !== null) {
            setCompare(next);
          }
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, activeTab, compare]);

  const handleWheelClick = (n: number) => {
    if (activeTab === "compare" && selected !== n) {
      setCompare(n);
    } else {
      setSelected(n);
      setCompare(null);
    }
  };

  return (
    <div className="w-full" style={{ fontFamily: "var(--font-sans)" }}>
      {/* Context banner when loaded from per-rāśi lesson */}
      {slug.includes("mesha") || slug.includes("vrishabha") || slug.includes("mithuna") || slug.includes("karka") || slug.includes("simha") || slug.includes("kanya") || slug.includes("tula") || slug.includes("vrishchika") || slug.includes("dhanus") || slug.includes("makara") || slug.includes("kumbha") || slug.includes("meena") ? (
        <div className="mb-3 p-2 rounded-xl text-xs" style={{ background: "var(--gl-surface-twilight-glass)", border: "1px solid var(--gl-gold-hairline)", color: "var(--gl-ink-secondary)", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          📍 You are exploring <strong style={{ color: "var(--gl-gold-accent)" }}><IAST>{rashi.nameIAST}</IAST></strong> — the focus of this lesson. Use the wheel below to compare with other rāśis.
        </div>
      ) : null}

      {/* Tabs */}
      <div className="flex gap-2 mb-4 flex-wrap" role="tablist" aria-label="Zodiac visualizer modes">
        {(["attributes", "compare", "grid", "kalapurusa"] as const).map((t) => (
          <motion.button
            key={t}
            role="tab"
            aria-selected={activeTab === t}
            onClick={() => { setActiveTab(t); if (t !== "compare") setCompare(null); }}
            className="px-4 py-2 text-sm rounded-lg transition-all"
            whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
            style={{
              background: activeTab === t ? "var(--gl-gold-accent)" : "var(--gl-surface-manuscript)",
              color: activeTab === t ? "#1a1a2e" : "var(--gl-ink-primary)",
              border: "1px solid var(--gl-gold-accent)",
              opacity: activeTab === t ? 1 : 0.7,
            }}
          >
            {t === "attributes" ? "Attributes" : t === "compare" ? "Compare" : t === "grid" ? "Element Grid" : "Kālapuruṣa"}
          </motion.button>
        ))}
        <motion.button
          onClick={() => setShowAxis((s) => !s)}
          className="px-3 py-2 text-sm rounded-lg transition-all"
          whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
          style={{
            background: showAxis ? "#C9A24D25" : "var(--gl-surface-manuscript)",
            color: showAxis ? "#C9A24D" : "var(--gl-ink-muted)",
            border: "1px solid var(--gl-gold-hairline)",
          }}
        >
          {showAxis ? "Hide" : "Show"} 180° Axis
        </motion.button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Wheel */}
        <div className="flex-shrink-0 mx-auto lg:mx-0" style={{ maxWidth: 320 }}>
          <RashiWheel selected={selected} compare={compare} onSelect={handleWheelClick} onHover={setHovered} hovered={hovered} showAxis={showAxis} />
          {/* Legend */}
          <div className="flex gap-3 mt-2 flex-wrap justify-center">
            {["Fire", "Earth", "Air", "Water"].map((el) => {
              const c = ELEMENT_COLORS[el];
              return (
                <div key={el} className="flex items-center gap-1">
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: c.text }} />
                  <span className="text-xs" style={{ color: "var(--gl-ink-secondary)" }}>{el}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {activeTab === "attributes" && (
              <motion.div key="attributes" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                <AttributeCard rashi={rashi} dignities={dignities} showRedirects={showRedirects} />
              </motion.div>
            )}
            {activeTab === "compare" && (
              <motion.div key="compare" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                <ComparePanel rashiA={rashi} rashiB={compareRashi} onSelectB={setCompare} />
              </motion.div>
            )}
            {activeTab === "grid" && (
              <motion.div key="grid" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                <ElementGridPanel onSelectRashi={setSelected} />
              </motion.div>
            )}
            {activeTab === "kalapurusa" && (
              <motion.div key="kalapurusa" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                <KalapurusaPanel selected={selected} onSelect={setSelected} hovered={hovered} onHover={setHovered} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ─── Attribute Card ─── */
function AttributeCard({ rashi, dignities, showRedirects }: { rashi: RashiData; dignities: ReturnType<typeof getDignitiesForRashi>; showRedirects: boolean }) {
  const attrs = [
    { label: "Lord", value: rashi.lord, icon: GRAHA_SYMBOLS[rashi.lord] ?? "○" },
    { label: "Element", value: rashi.element, color: ELEMENT_COLORS[rashi.element].text },
    { label: "Modality", value: rashi.modality, color: MODALITY_COLORS[rashi.modality].text },
    { label: "Gender", value: rashi.gender },
    { label: "Body-part", value: rashi.bodyPart },
    { label: "Direction", value: rashi.direction },
  ];

  // Find mūla-trikoṇa redirect for this rashi's lord
  const redirect = Object.values(MULA_TRIKONA_REDIRECTS).find((r) => r.fromRashi === rashi.number);

  return (
    <div className="p-5 rounded-xl space-y-4" style={{ background: "var(--gl-surface-twilight-glass)", border: `1px solid ${rashi.color}35`, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl" style={{ background: `${rashi.color}25`, color: rashi.color, fontFamily: "var(--font-devanagari)" }}>
          {rashi.nameDevanagari}
        </div>
        <div>
          <h3 className="text-xl font-semibold" style={{ fontFamily: "var(--font-cormorant)", color: "var(--gl-gold-accent)" }}>
            <IAST>{rashi.nameIAST}</IAST> — {rashi.nameEnglish}
          </h3>
          <p className="text-xs" style={{ color: "var(--gl-ink-muted)" }}>Rāśi #{rashi.number} · Sidereal {rashi.startDegree}°–{rashi.endDegree}°</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {attrs.map((a) => (
          <div key={a.label} className="p-2.5 rounded-xl" style={{ background: "var(--gl-surface-manuscript)", border: "1px solid var(--gl-gold-hairline)", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
            <div className="text-xs uppercase tracking-wide" style={{ color: "var(--gl-ink-muted)" }}>{a.label}</div>
            <div className="text-sm font-medium flex items-center gap-1" style={{ color: a.color ?? "var(--gl-ink-primary)" }}>
              {a.icon && <span style={{ color: a.color }}>{a.icon}</span>}
              {a.value}
            </div>
          </div>
        ))}
      </div>

      {/* Dignities */}
      <div>
        <div className="text-xs uppercase tracking-wide mb-2 flex items-center gap-2" style={{ color: "var(--gl-ink-muted)" }}>
          Dignities
          {dignities.length === 0 && <span className="px-1.5 py-0.5 rounded text-xs" style={{ background: "var(--gl-surface-manuscript)", color: "var(--gl-ink-secondary)" }}>No classical exaltation / debilitation</span>}
        </div>
        <div className="flex gap-2 flex-wrap">
          {dignities.map((d, i) => {
            const dc = DIGNITY_COLORS[d.type];
            return (
              <span key={i} className="px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1" style={{ background: dc.bg, color: dc.text, border: `1px solid ${dc.border}` }}>
                {d.badge} {d.graha} {d.degree !== undefined ? `${d.degree}°` : d.degreeStart !== undefined ? `${d.degreeStart}°–${d.degreeEnd}°` : ""}
                <span style={{ opacity: 0.7 }}>{d.type}</span>
              </span>
            );
          })}
        </div>
        {/* Mūla-trikoṇa redirect arrow */}
        {showRedirects && redirect && (
          <div className="mt-2 p-2 rounded-lg flex items-center gap-2" style={{ background: "#A23A1E10", border: "1px dashed #A23A1E40" }}>
            <span className="text-lg">→</span>
            <span className="text-xs" style={{ color: "#A23A1E" }}>
              <strong>Mūla-trikoṇa redirect:</strong> {redirect.reason}
            </span>
          </div>
        )}
      </div>

      {/* Keywords */}
      <div>
        <div className="text-xs uppercase tracking-wide mb-2" style={{ color: "var(--gl-ink-muted)" }}>Interpretive flavour</div>
        <div className="flex gap-1.5 flex-wrap">
          {rashi.keywords.split(", ").map((kw) => (
            <span key={kw} className="px-2.5 py-1 rounded-full text-xs" style={{ background: `${rashi.color}12`, color: rashi.color, border: `1px solid ${rashi.color}30` }}>
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Cross-references */}
      <div className="pt-3 border-t" style={{ borderColor: "var(--gl-gold-hairline)" }}>
        <div className="text-xs" style={{ color: "var(--gl-ink-muted)" }}>
          Cross-references:{" "}
          <span style={{ color: "var(--gl-ink-secondary)" }}>
            Full rāśi interpretation → Module 05/06/13 · Dṛṣṭi mechanics → Module 08 · Daśā timing → Module 09 · Medical Jyotiṣa → Module 12
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Compare Panel ─── */
function ComparePanel({ rashiA, rashiB, onSelectB }: { rashiA: RashiData; rashiB: RashiData | null; onSelectB: (n: number) => void }) {
  const shouldReduceMotion = useReducedMotion();
  const rows = [
    { label: "Lord", key: "lord" as const },
    { label: "Element", key: "element" as const },
    { label: "Modality", key: "modality" as const },
    { label: "Gender", key: "gender" as const },
    { label: "Body-part", key: "bodyPart" as const },
    { label: "Direction", key: "direction" as const },
  ];

  // Find if these two are an opposite pair
  const oppositePair = OPPOSITE_PAIRS.find((p) => (p.rashiA === rashiA.number && p.rashiB === rashiB?.number) || (p.rashiB === rashiA.number && p.rashiA === rashiB?.number));

  return (
    <div className="space-y-3">
      <div className="text-sm" style={{ color: "var(--gl-ink-secondary)" }}>
        Comparing <strong style={{ color: rashiA.color }}><IAST>{rashiA.nameIAST}</IAST></strong> with{" "}
        {rashiB ? <strong style={{ color: rashiB.color }}><IAST>{rashiB.nameIAST}</IAST></strong> : "select another rāśi on the wheel..."}
      </div>

      {oppositePair && (
        <div className="p-2 rounded-lg text-xs" style={{ background: "#C9A24D15", border: "1px solid #C9A24D40", color: "var(--gl-gold-accent)" }}>
          <strong>180° Opposition Axis:</strong> {oppositePair.axis} — {oppositePair.significance}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th className="text-left p-2 text-xs" style={{ color: "var(--gl-ink-muted)", borderBottom: "1px solid var(--gl-gold-hairline)" }}>Attribute</th>
              <th className="text-left p-2 text-xs" style={{ color: rashiA.color, borderBottom: `1px solid ${rashiA.color}40` }}>{rashiA.nameDevanagari} {rashiA.nameIAST}</th>
              <th className="text-left p-2 text-xs" style={{ color: rashiB?.color ?? "var(--gl-ink-muted)", borderBottom: rashiB ? `1px solid ${rashiB.color}40` : "1px solid var(--gl-gold-hairline)" }}>
                {rashiB ? `${rashiB.nameDevanagari} ${rashiB.nameIAST}` : "—"}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const aVal = rashiA[row.key];
              const bVal = rashiB?.[row.key];
              const same = bVal !== undefined && aVal === bVal;
              const diff = bVal !== undefined && aVal !== bVal;
              return (
                <tr key={row.key}>
                  <td className="p-2" style={{ color: "var(--gl-ink-muted)", borderBottom: "1px solid var(--gl-gold-hairline)" }}>{row.label}</td>
                  <td className="p-2" style={{ color: "var(--gl-ink-primary)", borderBottom: "1px solid var(--gl-gold-hairline)", background: same ? "#C9A24D12" : undefined }}>{aVal}</td>
                  <td className="p-2" style={{ color: "var(--gl-ink-primary)", borderBottom: "1px solid var(--gl-gold-hairline)", background: same ? "#C9A24D12" : diff ? "#A23A1E12" : undefined }}>
                    {bVal ?? "—"}
                    {diff && <span className="ml-1 text-xs" style={{ color: "#A23A1E" }}>✕</span>}
                    {same && <span className="ml-1 text-xs" style={{ color: "#C9A24D" }}>✓</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex gap-2 flex-wrap">
        {[
          { pair: [1, 5], label: "Fire triad" },
          { pair: [4, 5], label: "Throne axis" },
          { pair: [1, 7], label: "Self–Other" },
          { pair: [2, 8], label: "Resources–Transform" },
          { pair: [10, 11], label: "Saturn pair" },
          { pair: [9, 12], label: "Jupiter pair" },
        ].map(({ pair, label }) => {
          const r1 = RASHIS[pair[0] - 1];
          const r2 = RASHIS[pair[1] - 1];
          return (
            <motion.button
              key={label}
              onClick={() => onSelectB(pair[1])}
              className="px-2.5 py-1.5 rounded-lg text-xs transition-all"
              whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
              style={{ background: "var(--gl-surface-manuscript)", border: "1px solid var(--gl-gold-hairline)", color: "var(--gl-ink-secondary)" }}
            >
              {label}: {r1.nameDevanagari}↔{r2.nameDevanagari}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Element Grid Panel ─── */
function ElementGridPanel({ onSelectRashi }: { onSelectRashi: (n: number) => void }) {
  const elements = ["Fire", "Earth", "Air", "Water"] as const;
  const modalities = ["Chara", "Sthira", "Dvi-svabhāva"] as const;
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="space-y-3">
      <div className="text-sm" style={{ color: "var(--gl-ink-secondary)" }}>4 × 3 matrix: Elements × Modalities. Every cell is filled — one rāśi per intersection.</div>
      <div className="grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
        <div className="p-2 text-xs font-semibold" style={{ color: "var(--gl-ink-muted)" }}>Element \ Modality</div>
        {modalities.map((m) => (
          <div key={m} className="p-2 text-xs font-semibold text-center" style={{ color: "var(--gl-gold-accent)" }}>{m}</div>
        ))}
        {elements.map((el) => (
          <Fragment key={el}>
            <div key={`h-${el}`} className="p-2 text-xs font-semibold flex items-center" style={{ color: "var(--gl-ink-primary)" }}>{el}</div>
            {modalities.map((mod) => {
              const found = RASHIS.filter((r) => r.element === el && r.modality === mod);
              const color = ELEMENT_COLORS[el].text;
              const hasItem = found.length > 0;
              return (
                <motion.div
                  key={`${el}-${mod}`}
                  role={hasItem ? "button" : undefined}
                  tabIndex={hasItem ? 0 : undefined}
                  aria-label={hasItem ? `Select ${found[0].nameIAST} for ${el} ${mod}` : undefined}
                  className="p-2 rounded-lg text-center cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--gl-gold-accent)] outline-none"
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
                  style={{ background: `${color}12`, border: `1px solid ${color}35`, minHeight: 56 }}
                  onClick={() => found[0] && onSelectRashi(found[0].number)}
                  onKeyDown={(e) => {
                    if (hasItem && (e.key === "Enter" || e.key === " ")) {
                      onSelectRashi(found[0].number);
                      e.preventDefault();
                    }
                  }}
                >
                  {found.map((r) => (
                    <div key={r.number} className="text-xs font-medium" style={{ color }}>
                      <span style={{ fontFamily: "var(--font-devanagari)" }}>{r.nameDevanagari}</span> {r.nameIAST}
                    </div>
                  ))}
                </motion.div>
              );
            })}
          </Fragment>
        ))}
      </div>
      <div className="text-xs p-2 rounded-xl" style={{ background: "var(--gl-surface-twilight-glass)", border: "1px solid var(--gl-gold-hairline)", color: "var(--gl-ink-secondary)", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
        <strong style={{ color: "var(--gl-gold-accent)" }}>Pattern insight:</strong> Each element contains one rāśi of each modality. Each modality contains one rāśi of each element. This 4×3 = 12 tessellation is structurally complete — no empty cells.
      </div>
    </div>
  );
}

/* ─── Kālapuruṣa Panel ─── */
function KalapurusaPanel({ selected, onSelect, hovered, onHover }: { selected: number; onSelect: (n: number) => void; hovered: number | null; onHover: (n: number | null) => void }) {
  const shouldReduceMotion = useReducedMotion();
  const bodyParts = [
    { num: 1, part: "Head", y: 12 },
    { num: 2, part: "Face/Neck", y: 24 },
    { num: 3, part: "Shoulders/Arms", y: 36 },
    { num: 4, part: "Chest/Heart", y: 48 },
    { num: 5, part: "Stomach", y: 60 },
    { num: 6, part: "Digestive", y: 72 },
    { num: 7, part: "Hips", y: 84 },
    { num: 8, part: "Genitals", y: 96 },
    { num: 9, part: "Thighs", y: 108 },
    { num: 10, part: "Knees", y: 120 },
    { num: 11, part: "Calves/Ankles", y: 132 },
    { num: 12, part: "Feet", y: 144 },
  ];

  return (
    <div className="space-y-3">
      <div className="text-sm" style={{ color: "var(--gl-ink-secondary)" }}>
        The cosmic body (Kālapuruṣa): head-to-feet progression. Click any body region or rāśi in the list.
      </div>
      <div className="flex gap-4">
        <svg viewBox="0 0 80 156" className="flex-shrink-0" style={{ width: 80, height: 156 }} role="img" aria-label="Diagram showing correspondence of signs to parts of the cosmic body">
          <ellipse cx={40} cy={14} rx={14} ry={16} fill="none" stroke="var(--gl-gold-accent)" strokeOpacity={0.35} strokeWidth={1} />
          <line x1={40} y1={30} x2={40} y2={70} stroke="var(--gl-gold-accent)" strokeOpacity={0.35} strokeWidth={1} />
          <line x1={22} y1={42} x2={58} y2={42} stroke="var(--gl-gold-accent)" strokeOpacity={0.35} strokeWidth={1} />
          <line x1={40} y1={70} x2={26} y2={110} stroke="var(--gl-gold-accent)" strokeOpacity={0.35} strokeWidth={1} />
          <line x1={40} y1={70} x2={54} y2={110} stroke="var(--gl-gold-accent)" strokeOpacity={0.35} strokeWidth={1} />
          <line x1={26} y1={110} x2={22} y2={148} stroke="var(--gl-gold-accent)" strokeOpacity={0.35} strokeWidth={1} />
          <line x1={54} y1={110} x2={58} y2={148} stroke="var(--gl-gold-accent)" strokeOpacity={0.35} strokeWidth={1} />
          {bodyParts.map((bp) => {
            const rashi = RASHIS[bp.num - 1];
            const isActive = selected === bp.num || hovered === bp.num;
            return (
              <g key={bp.num} style={{ cursor: "pointer" }} onClick={() => onSelect(bp.num)} onMouseEnter={() => onHover(bp.num)} onMouseLeave={() => onHover(null)}>
                <circle cx={40} cy={bp.y} r={isActive ? 7 : 4.5} fill={isActive ? rashi.color : `${rashi.color}55`} stroke={rashi.color} strokeWidth={1} />
                <text x={54} y={bp.y + 3} fontSize={7} fill={isActive ? rashi.color : "var(--gl-ink-muted)"} style={{ pointerEvents: "none" }}>{bp.part}</text>
              </g>
            );
          })}
        </svg>
        <div className="flex-1 space-y-1" role="listbox" aria-label="Body part correspondences">
          {bodyParts.map((bp) => {
            const rashi = RASHIS[bp.num - 1];
            const isActive = selected === bp.num;
            return (
              <motion.div
                key={bp.num}
                role="option"
                aria-selected={isActive}
                tabIndex={0}
                className="flex items-center gap-2 p-1.5 rounded cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--gl-gold-accent)] outline-none"
                whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                style={{ background: isActive ? `${rashi.color}12` : "transparent", borderLeft: isActive ? `3px solid ${rashi.color}` : "3px solid transparent" }}
                onClick={() => onSelect(bp.num)}
                onMouseEnter={() => onHover(bp.num)}
                onMouseLeave={() => onHover(null)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    onSelect(bp.num);
                    e.preventDefault();
                  }
                }}
              >
                <span className="text-xs font-mono w-5" style={{ color: "var(--gl-ink-muted)" }}>{bp.num}</span>
                <span className="text-xs" style={{ fontFamily: "var(--font-devanagari)", color: isActive ? rashi.color : "var(--gl-ink-primary)" }}>{rashi.nameDevanagari}</span>
                <span className="text-xs" style={{ color: "var(--gl-ink-secondary)" }}><IAST>{rashi.nameIAST}</IAST></span>
                <span className="text-xs ml-auto" style={{ color: "var(--gl-ink-muted)" }}>{bp.part}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
      <div className="text-xs p-2 rounded-xl" style={{ background: "var(--gl-surface-twilight-glass)", border: "1px solid var(--gl-gold-hairline)", color: "var(--gl-ink-secondary)", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
        <strong style={{ color: "var(--gl-gold-accent)" }}>Progression:</strong> Meṣa (head) → Vṛṣabha (face) → Mithuna (shoulders) → Karka (chest) → Siṁha (stomach) → Kanyā (digestive) → Tulā (hips) → Vṛścika (genitals) → Dhanus (thighs) → Makara (knees) → Kumbha (calves) → Mīna (feet). A graha in a rāśi influences the corresponding body part.
      </div>
    </div>
  );
}
