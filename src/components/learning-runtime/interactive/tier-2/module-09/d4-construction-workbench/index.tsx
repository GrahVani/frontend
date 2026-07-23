"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Calculator,
  CheckCircle2,
  ChevronRight,
  Grid3X3,
  RotateCcw,
  Scale,
} from "lucide-react";
import { grahas, ink } from "@/design-tokens/grahvani-learning/colors";
import { fontFamilies } from "@/design-tokens/grahvani-learning/typography";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #1A1408)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #5A4E2E)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #8A7E5E)";
const GOLD = ink.goldAccent;
const GREEN = grahas.budha.primary;
const SAFFRON = grahas.guru.primary;
const BLUE = grahas.shukra.primary;

const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const CHART_P1_POINTS = [
  { label: "Lagna", sign: "Libra", degree: 15.0 },
  { label: "Sun", sign: "Leo", degree: 10.0 },
  { label: "Moon", sign: "Cancer", degree: 8.0 },
  { label: "Mars", sign: "Capricorn", degree: 18.0 },
  { label: "Mercury", sign: "Virgo", degree: 20.0 },
  { label: "Jupiter", sign: "Cancer", degree: 15.0 },
  { label: "Venus", sign: "Libra", degree: 25.0 },
  { label: "Saturn", sign: "Taurus", degree: 11.0 },
  { label: "Rāhu", sign: "Gemini", degree: 20.5 },
  { label: "Ketu", sign: "Sagittarius", degree: 20.5 },
];

type TabKey = "chart" | "calculator" | "kendra" | "boundaries";

const TABS: { key: TabKey; label: string }[] = [
  { key: "chart", label: "Chart P1 table" },
  { key: "calculator", label: "Calculator" },
  { key: "kendra", label: "Kendra map" },
  { key: "boundaries", label: "Boundary cases" },
];

function computeD4(signIndex: number, degree: number) {
  const clamped = Math.min(Math.max(degree, 0), 29.999999);
  const raw = clamped / 7.5;
  const part = Math.floor(raw) + 1;
  const offset = (part - 1) * 3;
  const d4Index = (signIndex + offset) % 12;
  return { part, offset, d4Sign: SIGNS[d4Index], d4Index };
}

function formatDegree(deg: number) {
  const d = Math.floor(deg);
  const minutes = Math.round((deg - d) * 60);
  if (minutes === 0) return `${d}°00′`;
  return `${d}°${minutes.toString().padStart(2, "0")}′`;
}

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : color;
}

export function D4ConstructionWorkbench() {
  const [tab, setTab] = useState<TabKey>("chart");

  function reset() {
    setTab("chart");
  }

  return (
    <div
      data-interactive="d4-construction-workbench"
      className="w-full min-w-0"
      style={{
        background: SURFACE,
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 16,
        padding: 20,
        color: INK_PRIMARY,
        boxSizing: "border-box",
        overflow: "hidden",
        fontFamily: fontFamilies.body,
      }}
    >
      <header className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="m-0 text-xs uppercase" style={{ color: GOLD, letterSpacing: "0.08em", fontWeight: 600 }}>
            Caturthāṁśa construction
          </p>
          <h2
            className="mt-1 text-xl sm:text-2xl"
            style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
          >
            D4 construction workbench
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            Apply the kendra-mapping rule to Chart P1&apos;s ten points, verify boundary cases, and practise the
            modular shortcut.
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 self-start rounded-lg px-3 py-2 text-sm"
          style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY, fontWeight: 500 }}
        >
          <RotateCcw size={15} aria-hidden="true" />
          Restart
        </button>
      </header>

      <nav className="mb-5 flex flex-wrap gap-2" aria-label="D4 construction sections">
        {TABS.map((t) => (
          <TabButton key={t.key} active={tab === t.key} onClick={() => setTab(t.key)}>
            {t.label}
          </TabButton>
        ))}
      </nav>

      {tab === "chart" && <ChartTab />}
      {tab === "calculator" && <CalculatorTab />}
      {tab === "kendra" && <KendraMapTab />}
      {tab === "boundaries" && <BoundaryTab />}
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className="rounded-lg px-3 py-2 text-sm"
      style={{
        border: `1px solid ${active ? GOLD : HAIRLINE}`,
        background: active ? GOLD : "transparent",
        color: active ? "#1A1408" : INK_SECONDARY,
        fontWeight: 500,
      }}
    >
      {children}
    </button>
  );
}

function ChartTab() {
  const [selected, setSelected] = useState<string | null>("Lagna");

  const selectedPoint = useMemo(
    () => CHART_P1_POINTS.find((p) => p.label === selected) || CHART_P1_POINTS[0],
    [selected]
  );

  const signIndex = SIGNS.indexOf(selectedPoint.sign);
  const result = computeD4(signIndex, selectedPoint.degree);
  const d4House = result.d4Index + 1;

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.4</p>
        <h3
          className="mt-1 text-lg"
          style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
        >
          Chart P1 complete D4 computation
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Click any row to inspect the four-step derivation. D4-Lagna = Aries, so D4 house numbers follow the zodiac from
          Aries.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                <th className="py-2 pr-3 text-left" style={{ color: INK_MUTED, fontWeight: 600 }}>Point</th>
                <th className="py-2 pr-3 text-left" style={{ color: INK_MUTED, fontWeight: 600 }}>D1 position</th>
                <th className="py-2 pr-3 text-left" style={{ color: INK_MUTED, fontWeight: 600 }}>Part</th>
                <th className="py-2 pr-3 text-left" style={{ color: INK_MUTED, fontWeight: 600 }}>Offset</th>
                <th className="py-2 text-left" style={{ color: INK_MUTED, fontWeight: 600 }}>D4 sign</th>
              </tr>
            </thead>
            <tbody>
              {CHART_P1_POINTS.map((p) => {
                const idx = SIGNS.indexOf(p.sign);
                const r = computeD4(idx, p.degree);
                const isSel = selected === p.label;
                return (
                  <tr
                    key={p.label}
                    onClick={() => setSelected(p.label)}
                    style={{
                      borderBottom: `1px solid ${HAIRLINE}`,
                      cursor: "pointer",
                      background: isSel ? wash(GOLD, "10") : "transparent",
                    }}
                  >
                    <td className="py-2 pr-3" style={{ color: isSel ? GOLD : INK_PRIMARY, fontWeight: 600 }}>{p.label}</td>
                    <td className="py-2 pr-3" style={{ color: INK_SECONDARY }}>{p.sign} {formatDegree(p.degree)}</td>
                    <td className="py-2 pr-3" style={{ color: INK_SECONDARY }}>{r.part}</td>
                    <td className="py-2 pr-3" style={{ color: INK_SECONDARY }}>+{r.offset}</td>
                    <td className="py-2" style={{ color: INK_PRIMARY, fontWeight: 600 }}>{r.d4Sign}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <Calculator size={18} style={{ color: GOLD }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>Derivation</p>
        </div>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          <strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>{selectedPoint.label}</strong> sits at{" "}
          {selectedPoint.sign} {formatDegree(selectedPoint.degree)}.
        </p>
        <ol className="m-0 mt-2 list-decimal space-y-1 pl-5 text-sm" style={{ color: INK_SECONDARY }}>
          <li>Degree in sign = {selectedPoint.degree.toFixed(3)}°</li>
          <li>
            Part number = ⌊{selectedPoint.degree.toFixed(3)} / 7.5⌋ + 1 ={" "}
            <strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>{result.part}</strong>
          </li>
          <li>
            Kendra offset = +{result.offset} ({kendraName(result.offset)})
          </li>
          <li>
            D4 sign = {selectedPoint.sign} + {result.offset} signs ={" "}
            <strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>{result.d4Sign}</strong> (D4 house {d4House})
          </li>
        </ol>
        <PointArrowSvg fromSign={selectedPoint.sign} toSign={result.d4Sign} />
      </aside>
    </div>
  );
}

function kendraName(offset: number) {
  if (offset === 0) return "same sign";
  if (offset === 3) return "4th";
  if (offset === 6) return "7th";
  return "10th";
}

function CalculatorTab() {
  const [sign, setSign] = useState("Libra");
  const [degree, setDegree] = useState<string>("25");

  const signIndex = SIGNS.indexOf(sign);
  const degNum = parseFloat(degree) || 0;
  const result = computeD4(signIndex, degNum);

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.1</p>
        <h3
          className="mt-1 text-lg"
          style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
        >
          Try any longitude
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Select a sign and enter a degree (0.0-29.999). The workbench computes the D4 sign and shows both the counting
          method and the modular shortcut.
        </p>

        <div className="mt-4 flex flex-wrap items-end gap-3">
          <label className="block text-sm" style={{ color: INK_SECONDARY }}>
            Sign
            <select
              value={sign}
              onChange={(e) => setSign(e.target.value)}
              className="mt-1 block rounded-lg px-3 py-2 text-sm"
              style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
            >
              {SIGNS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm" style={{ color: INK_SECONDARY }}>
            Degree in sign
            <input
              type="number"
              min="0"
              max="29.999999"
              step="0.0001"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              className="mt-1 block rounded-lg px-3 py-2 text-sm"
              style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY, width: 140 }}
            />
          </label>
        </div>

        <div className="mt-4 rounded-lg p-3" style={{ background: wash(GREEN, "10"), border: `1px solid ${wash(GREEN, "55")}` }}>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} style={{ color: GREEN }} aria-hidden="true" />
            <p className="m-0 text-sm" style={{ color: GREEN, fontWeight: 600 }}>Result</p>
          </div>
          <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
            Part number = <strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>{result.part}</strong>; kendra offset =
            +{result.offset} ({kendraName(result.offset)}); D4 sign ={" "}
            <strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>{result.d4Sign}</strong>.
          </p>
        </div>

        <div className="mt-3 rounded-lg p-3" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            <strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>Modular shortcut:</strong>{" "}
            D4_index = (sign_index + kendra_offset) mod 12 = ({signIndex} + {result.offset}) mod 12 = {result.d4Index} →{" "}
            {result.d4Sign}.
          </p>
        </div>
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <Scale size={18} style={{ color: GOLD }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>Self-verify</p>
        </div>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          Cross-check against T1-09 Lesson 9.3.1 §6:
        </p>
        <ul className="m-0 mt-2 list-disc space-y-1 pl-5 text-sm" style={{ color: INK_SECONDARY }}>
          <li>12° Aries → part 2 → Cancer</li>
          <li>20° Aries → part 3 → Libra</li>
        </ul>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          If the calculator matches these published examples, you can trust it on new data.
        </p>
        <PointArrowSvg fromSign={sign} toSign={result.d4Sign} />
      </aside>
    </div>
  );
}

function KendraMapTab() {
  const [activePart, setActivePart] = useState<number | null>(3);

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.1 step 3</p>
        <h3
          className="mt-1 text-lg"
          style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
        >
          Kendra mapping
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Each 30° sign is divided into four 7°30′ parts. The parts always map to the sign&apos;s kendras: same, 4th, 7th,
          10th. Click a part to highlight its destination.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setActivePart(p)}
              className="rounded-lg px-3 py-2 text-sm"
              style={{
                background: activePart === p ? GOLD : SURFACE_2,
                border: `1px solid ${activePart === p ? GOLD : HAIRLINE}`,
                color: activePart === p ? "#1A1408" : INK_SECONDARY,
                fontWeight: 500,
              }}
            >
              Part {p}
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-lg p-3" style={{ background: wash(SAFFRON, "10"), border: `1px solid ${wash(SAFFRON, "55")}` }}>
          <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            <strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>Part {activePart}:</strong>{" "}
            {activePart === 1 && "maps to the same sign (offset 0)."}
            {activePart === 2 && "maps to the 4th from the sign (offset +3)."}
            {activePart === 3 && "maps to the 7th from the sign (offset +6)."}
            {activePart === 4 && "maps to the 10th from the sign (offset +9)."}
          </p>
        </div>
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <KendraSvg activePart={activePart} />
      </aside>
    </div>
  );
}

function BoundaryTab() {
  const cases = [
    { degree: 0, part: 1, note: "exactly on the cusp; belongs to part 1" },
    { degree: 7.5, part: 2, note: "boundary begins part 2" },
    { degree: 15, part: 3, note: "Jupiter's exact position" },
    { degree: 22.5, part: 4, note: "boundary begins part 4" },
  ];

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§6 Example 2</p>
        <h3
          className="mt-1 text-lg"
          style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
        >
          Exact 7°30′ boundaries
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          A degree landing exactly on a boundary belongs to the part that begins there, so the floor formula always adds
          1 after division. These are the most common manual-arithmetic slip points.
        </p>

        <div className="mt-4 space-y-3">
          {cases.map((c) => (
            <div key={c.degree} className="rounded-lg p-3" style={{ background: wash(BLUE, "10"), border: `1px solid ${wash(BLUE, "55")}` }}>
              <div className="flex items-center gap-2">
                <ChevronRight size={16} style={{ color: BLUE }} aria-hidden="true" />
                <p className="m-0 text-sm" style={{ color: BLUE, fontWeight: 600 }}>{formatDegree(c.degree)} in any sign</p>
              </div>
              <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
                ⌊{c.degree} / 7.5⌋ + 1 = {Math.floor(c.degree / 7.5)} + 1 ={" "}
                <strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>part {c.part}</strong> — {c.note}.
              </p>
            </div>
          ))}
        </div>
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <Grid3X3 size={18} style={{ color: GOLD }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>Common mistake #1</p>
        </div>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          Forgetting the +1 after floor division mislabels every part one number too low. Always use{" "}
          <strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>part = ⌊degree / 7.5⌋ + 1</strong>.
        </p>
        <div className="mt-4 rounded-lg p-3" style={{ background: wash(GOLD, "10"), border: `1px solid ${wash(GOLD, "55")}` }}>
          <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            Common mistake #2: the D4 maps to kendras (1/4/7/10), never trines (1/5/9). Keep the four kendras visible
            whenever you compute a D4.
          </p>
        </div>
        <BoundarySvg />
      </aside>
    </div>
  );
}

function PointArrowSvg({ fromSign, toSign }: { fromSign: string; toSign: string }) {
  return (
    <svg viewBox="0 0 320 110" role="img" aria-label={`D4 mapping from ${fromSign} to ${toSign}`} style={{ width: "100%", maxHeight: 130, margin: "1rem auto 0", display: "block" }}>
      <rect x="20" y="20" width="280" height="70" rx="8" fill={`${GOLD}0F`} stroke={HAIRLINE} />

      <rect x="45" y="45" width="80" height="32" rx="6" fill={SURFACE} stroke={HAIRLINE} strokeWidth="1.5" />
      <text x="85" y="66" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight={600}>{fromSign}</text>

      <path d="M 135 61 L 175 61" stroke={GOLD} strokeWidth="2" />
      <polygon points="175,61 169,57 169,65" fill={GOLD} />
      <text x="155" y="55" textAnchor="middle" fill={GOLD} fontSize="9" fontWeight={600}>D4</text>

      <rect x="195" y="45" width="80" height="32" rx="6" fill={`${SAFFRON}18`} stroke={SAFFRON} strokeWidth="1.5" />
      <text x="235" y="66" textAnchor="middle" fill={SAFFRON} fontSize="11" fontWeight={600}>{toSign}</text>
    </svg>
  );
}

function KendraSvg({ activePart }: { activePart: number | null }) {
  const parts = [
    { n: 1, label: "0°-7°30′", offset: 0, dest: "same" },
    { n: 2, label: "7°30′-15°", offset: 3, dest: "4th" },
    { n: 3, label: "15°-22°30′", offset: 6, dest: "7th" },
    { n: 4, label: "22°30′-30°", offset: 9, dest: "10th" },
  ];

  return (
    <svg viewBox="0 0 320 220" role="img" aria-label="Sign divided into four kendra-mapped parts" style={{ width: "100%", maxHeight: 240, margin: "0 auto", display: "block" }}>
      <rect x="20" y="20" width="280" height="180" rx="8" fill={`${GOLD}0F`} stroke={HAIRLINE} />

      <text x="160" y="40" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight={600}>One sign divided into four 7°30′ parts</text>

      {parts.map((p, idx) => {
        const y = 60 + idx * 32;
        const active = activePart === p.n;
        return (
          <g key={p.n}>
            <rect x="50" y={y} width="120" height="24" rx="4" fill={active ? wash(GOLD, "25") : SURFACE} stroke={active ? GOLD : HAIRLINE} strokeWidth={active ? 2 : 1} />
            <text x="110" y={y + 16} textAnchor="middle" fill={active ? INK_PRIMARY : INK_SECONDARY} fontSize="10" fontWeight={600}>
              Part {p.n}: {p.label}
            </text>

            <path d={`M 175 ${y + 12} L 215 ${y + 12}`} stroke={active ? GOLD : HAIRLINE} strokeWidth={active ? 2 : 1} />
            <polygon points={`215,${y + 12} 209,${y + 8} 209,${y + 16}`} fill={active ? GOLD : HAIRLINE} />

            <rect x="225" y={y} width="70" height="24" rx="4" fill={active ? wash(SAFFRON, "25") : SURFACE} stroke={active ? SAFFRON : HAIRLINE} strokeWidth={active ? 2 : 1} />
            <text x="260" y={y + 16} textAnchor="middle" fill={active ? SAFFRON : INK_SECONDARY} fontSize="10" fontWeight={600}>
              +{p.offset} ({p.dest})
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function BoundarySvg() {
  return (
    <svg viewBox="0 0 320 110" role="img" aria-label="A sign with exact 7 degree 30 minute boundaries marked" style={{ width: "100%", maxHeight: 130, margin: "1rem auto 0", display: "block" }}>
      <rect x="20" y="20" width="280" height="70" rx="8" fill={`${GOLD}0F`} stroke={HAIRLINE} />

      <rect x="40" y="45" width="240" height="20" rx="4" fill={SURFACE} stroke={HAIRLINE} strokeWidth="1.5" />
      {[0, 60, 120, 180, 240].map((x, i) => (
        <g key={i}>
          <line x1={40 + x} y1={45} x2={40 + x} y2={65} stroke={BLUE} strokeWidth="1.5" />
          <text x={40 + x} y="80" textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight={600}>
            {i === 0 ? "0°" : i === 1 ? "7°30′" : i === 2 ? "15°" : i === 3 ? "22°30′" : "30°"}
          </text>
        </g>
      ))}

      <text x="160" y="38" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight={600}>Boundary belongs to the part that begins here</text>
    </svg>
  );
}
