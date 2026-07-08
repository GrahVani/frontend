"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Calculator,
  CheckCircle2,
  Home,
  RotateCcw,
  Table,
} from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { fontFamilies } from "@/design-tokens/grahvani-learning/typography";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #1A1408)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #5A4E2E)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #8A7E5E)";
const GOLD = ink.goldAccent;
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const VERMILION = ink.vermilionAccent;

type TabKey = "rule" | "table" | "try-it" | "houses";

const TABS: { key: TabKey; label: string }[] = [
  { key: "rule", label: "Rule & verify" },
  { key: "table", label: "Chart E1 table" },
  { key: "try-it", label: "Try it" },
  { key: "houses", label: "D24 houses" },
];

const SIGNS = [
  { english: "Aries", devanagari: "मेष", iast: "Meṣa" },
  { english: "Taurus", devanagari: "वृषभ", iast: "Vṛṣabha" },
  { english: "Gemini", devanagari: "मिथुन", iast: "Mithuna" },
  { english: "Cancer", devanagari: "कर्क", iast: "Karka" },
  { english: "Leo", devanagari: "सिंह", iast: "Siṁha" },
  { english: "Virgo", devanagari: "कन्या", iast: "Kanyā" },
  { english: "Libra", devanagari: "तुला", iast: "Tulā" },
  { english: "Scorpio", devanagari: "वृश्चिक", iast: "Vṛścika" },
  { english: "Sagittarius", devanagari: "धनुः", iast: "Dhanus" },
  { english: "Capricorn", devanagari: "मकर", iast: "Makara" },
  { english: "Aquarius", devanagari: "कुम्भ", iast: "Kumbha" },
  { english: "Pisces", devanagari: "मीन", iast: "Mīna" },
];

const CHART_E1_POINTS = [
  { point: "Lagna", sign: "Virgo", degree: 8.0 },
  { point: "Sun", sign: "Leo", degree: 24.0 },
  { point: "Moon", sign: "Cancer", degree: 22.5 },
  { point: "Mars", sign: "Capricorn", degree: 8.0 },
  { point: "Mercury", sign: "Virgo", degree: 15.0 },
  { point: "Jupiter", sign: "Pisces", degree: 6.0 },
  { point: "Venus", sign: "Libra", degree: 18.0 },
  { point: "Saturn", sign: "Sagittarius", degree: 24.0 },
  { point: "Rāhu", sign: "Scorpio", degree: 12.0 },
  { point: "Ketu", sign: "Taurus", degree: 12.0 },
];

const SELF_CHECK_EXAMPLES = [
  {
    label: "T1-09 Example A",
    sign: "Aries",
    degree: 4,
    expected: "Scorpio",
    explanation:
      "Degree-in-sign = 4°. Part = ⌊4/1.25⌋ + 1 = 4. Aries is odd → count 4 signs from Leo: Leo, Virgo, Libra, Scorpio.",
  },
  {
    label: "T1-09 Example B",
    sign: "Taurus",
    degree: 0.1,
    expected: "Cancer",
    explanation:
      "Degree-in-sign ≈ 0°. Part = ⌊0.1/1.25⌋ + 1 = 1. Taurus is even → count 1 sign from Cancer = Cancer.",
  },
];

function signIndex(signName: string) {
  return SIGNS.findIndex((s) => s.english === signName);
}

function computeD24(signName: string, degree: number) {
  const sIdx = signIndex(signName);
  const partNumber = Math.floor(degree / 1.25) + 1;
  const isOdd = sIdx % 2 === 0;
  const startIndex = isOdd ? 4 : 3; // Leo for odd, Cancer for even
  const d24Index = (startIndex + partNumber - 1) % 12;
  return { sIdx, partNumber, isOdd, startIndex, d24Index };
}

function formatDegree(deg: number) {
  const d = Math.floor(deg);
  const m = Math.round((deg - d) * 60);
  return `${d}°${m.toString().padStart(2, "0")}′`;
}

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : color;
}

export function D24ConstructionWorkbench() {
  const [tab, setTab] = useState<TabKey>("rule");

  function reset() {
    setTab("rule");
  }

  return (
    <div
      data-interactive="d24-construction-workbench"
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
            D24 construction
          </p>
          <h2
            className="mt-1 text-xl sm:text-2xl"
            style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
          >
            24-way division workbench
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            Apply the odd/even-start rule, verify against published examples, and build Chart E1&apos;s complete D24.
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

      <nav className="mb-5 flex flex-wrap gap-2" aria-label="D24 construction sections">
        {TABS.map((t) => (
          <TabButton key={t.key} active={tab === t.key} onClick={() => setTab(t.key)}>
            {t.label}
          </TabButton>
        ))}
      </nav>

      {tab === "rule" && <RuleTab />}
      {tab === "table" && <TableTab />}
      {tab === "try-it" && <TryItTab />}
      {tab === "houses" && <HousesTab />}
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

function RuleTab() {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  function toggle(key: string) {
    setRevealed((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.1</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          The construction rule
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Each sign is divided into 24 parts of 1°15′. Apply the four steps below.
        </p>

        <ol className="m-0 mt-4 list-decimal space-y-3 pl-5 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          <li>Find the point&apos;s degree within its sign (0°–30°).</li>
          <li>
            Compute the part number: <code className="rounded px-1 py-0.5 text-xs" style={{ background: SURFACE_2 }}>⌊degree / 1.25⌋ + 1</code>.
          </li>
          <li>
            If the sign is <span style={{ color: GOLD, fontWeight: 500 }}>odd</span>, count the part number of signs starting from <span style={{ color: GOLD, fontWeight: 500 }}>Leo</span>.
          </li>
          <li>
            If the sign is <span style={{ color: BLUE, fontWeight: 500 }}>even</span>, count the part number of signs starting from <span style={{ color: BLUE, fontWeight: 500 }}>Cancer</span>.
          </li>
        </ol>

        <div className="mt-4 rounded-lg p-3" style={{ background: wash(GOLD, "10"), border: `1px solid ${wash(GOLD, "55")}` }}>
          <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>Modular shortcut</p>
          <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            <code className="rounded px-1 py-0.5 text-xs" style={{ background: SURFACE_2 }}>d24_index = (start_index + part_number - 1) mod 12</code>. Use this for part numbers greater than 12 to avoid miscounting wraparound.
          </p>
        </div>
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <CheckCircle2 size={18} style={{ color: GREEN }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: GREEN, fontWeight: 600 }}>Self-verification</p>
        </div>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          Check new computations against T1-09&apos;s published examples before trusting them.
        </p>
        <div className="mt-3 space-y-2">
          {SELF_CHECK_EXAMPLES.map((ex) => (
            <div key={ex.label} className="rounded-lg p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
              <div className="flex items-center justify-between">
                <p className="m-0 text-sm" style={{ color: INK_PRIMARY, fontWeight: 500 }}>{ex.label}</p>
                <button
                  type="button"
                  onClick={() => toggle(ex.label)}
                  className="text-xs"
                  style={{ color: GOLD, fontWeight: 500 }}
                >
                  {revealed[ex.label] ? "Hide" : "Show"}
                </button>
              </div>
              <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
                {ex.sign} {formatDegree(ex.degree)} → expected <span style={{ color: GREEN, fontWeight: 500 }}>{ex.expected}</span>
              </p>
              {revealed[ex.label] && (
                <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>{ex.explanation}</p>
              )}
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

function TableTab() {
  const rows = useMemo(() => {
    const lagnaD24 = computeD24("Virgo", 8.0).d24Index;
    return CHART_E1_POINTS.map((p) => {
      const calc = computeD24(p.sign, p.degree);
      const house = ((calc.d24Index - lagnaD24 + 12) % 12) + 1;
      return { ...p, ...calc, house };
    });
  }, []);

  return (
    <div className="grid min-w-0 gap-4">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.4</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          Chart E1 complete D24 computation
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          All ten points computed from their D1 positions. D24-Lagna = Capricorn.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                <th className="py-2 pr-3 font-medium" style={{ color: INK_MUTED, fontWeight: 600 }}>Point</th>
                <th className="py-2 pr-3 font-medium" style={{ color: INK_MUTED, fontWeight: 600 }}>D1 position</th>
                <th className="py-2 pr-3 font-medium" style={{ color: INK_MUTED, fontWeight: 600 }}>Part</th>
                <th className="py-2 pr-3 font-medium" style={{ color: INK_MUTED, fontWeight: 600 }}>Start</th>
                <th className="py-2 pr-3 font-medium" style={{ color: INK_MUTED, fontWeight: 600 }}>D24 sign</th>
                <th className="py-2 font-medium" style={{ color: INK_MUTED, fontWeight: 600 }}>D24 house</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.point} style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                  <td className="py-2 pr-3" style={{ color: INK_PRIMARY, fontWeight: 500 }}>{r.point}</td>
                  <td className="py-2 pr-3" style={{ color: INK_SECONDARY }}>
                    {r.sign} {formatDegree(r.degree)}
                  </td>
                  <td className="py-2 pr-3" style={{ color: INK_SECONDARY }}>{r.partNumber}</td>
                  <td className="py-2 pr-3" style={{ color: INK_SECONDARY }}>
                    {r.isOdd ? "Leo" : "Cancer"}
                  </td>
                  <td className="py-2 pr-3" style={{ color: GOLD, fontWeight: 500 }}>
                    {SIGNS[r.d24Index].english}
                  </td>
                  <td className="py-2" style={{ color: INK_SECONDARY }}>{r.house}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function TryItTab() {
  const [selectedPoint, setSelectedPoint] = useState<string>("Saturn");
  const [customSign, setCustomSign] = useState<string>("Aries");
  const [customDeg, setCustomDeg] = useState<number>(4);
  const [mode, setMode] = useState<"preset" | "custom">("preset");

  const { sign, degree } = useMemo(() => {
    if (mode === "preset") {
      const p = CHART_E1_POINTS.find((x) => x.point === selectedPoint)!;
      return { sign: p.sign, degree: p.degree };
    }
    return { sign: customSign, degree: customDeg };
  }, [mode, selectedPoint, customSign, customDeg]);

  const calc = useMemo(() => computeD24(sign, degree), [sign, degree]);
  const d24Sign = SIGNS[calc.d24Index];
  const countedSigns = useMemo(() => {
    const list: string[] = [];
    for (let i = 0; i < Math.min(calc.partNumber, 12); i++) {
      list.push(SIGNS[(calc.startIndex + i) % 12].english);
    }
    return list;
  }, [calc]);

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.1 & §6</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          Compute a D24 sign
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Choose a Chart E1 point or enter your own longitude, then walk through the steps.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode("preset")}
            className="rounded-lg px-3 py-2 text-sm"
            style={{
              background: mode === "preset" ? GOLD : SURFACE_2,
              border: `1px solid ${mode === "preset" ? GOLD : HAIRLINE}`,
              color: mode === "preset" ? "#1A1408" : INK_SECONDARY,
              fontWeight: 500,
            }}
          >
            Chart E1 point
          </button>
          <button
            type="button"
            onClick={() => setMode("custom")}
            className="rounded-lg px-3 py-2 text-sm"
            style={{
              background: mode === "custom" ? GOLD : SURFACE_2,
              border: `1px solid ${mode === "custom" ? GOLD : HAIRLINE}`,
              color: mode === "custom" ? "#1A1408" : INK_SECONDARY,
              fontWeight: 500,
            }}
          >
            Custom longitude
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-end gap-3">
          {mode === "preset" ? (
            <label className="flex flex-col gap-1 text-sm" style={{ color: INK_SECONDARY }}>
              Point
              <select
                value={selectedPoint}
                onChange={(e) => setSelectedPoint(e.target.value)}
                className="rounded-lg px-3 py-2 text-sm"
                style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
              >
                {CHART_E1_POINTS.map((p) => (
                  <option key={p.point} value={p.point}>{p.point}</option>
                ))}
              </select>
            </label>
          ) : (
            <>
              <label className="flex flex-col gap-1 text-sm" style={{ color: INK_SECONDARY }}>
                Sign
                <select
                  value={customSign}
                  onChange={(e) => setCustomSign(e.target.value)}
                  className="rounded-lg px-3 py-2 text-sm"
                  style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
                >
                  {SIGNS.map((s) => (
                    <option key={s.english} value={s.english}>{s.english}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-sm" style={{ color: INK_SECONDARY }}>
                Degree in sign
                <input
                  type="number"
                  min={0}
                  max={30}
                  step={0.01}
                  value={customDeg}
                  onChange={(e) => setCustomDeg(parseFloat(e.target.value) || 0)}
                  className="rounded-lg px-3 py-2 text-sm"
                  style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
                />
              </label>
            </>
          )}
        </div>

        <div className="mt-4 space-y-2">
          {[
            { label: "D1 position", value: `${sign} ${formatDegree(degree)}` },
            { label: "Sign parity", value: calc.isOdd ? "odd → count from Leo" : "even → count from Cancer" },
            { label: "Part number", value: `⌊${degree}/1.25⌋ + 1 = ${calc.partNumber}` },
            { label: "D24 sign", value: d24Sign.english, highlight: true },
          ].map((row) => (
            <div
              key={row.label}
              className="flex flex-col gap-1 rounded-lg p-2 sm:flex-row sm:gap-4"
              style={{ background: row.highlight ? wash(GOLD, "12") : SURFACE_2, border: `1px solid ${row.highlight ? GOLD : HAIRLINE}` }}
            >
              <span className="min-w-[120px] text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>{row.label}</span>
              <span className="text-sm" style={{ color: row.highlight ? GOLD : INK_PRIMARY, fontWeight: row.highlight ? 600 : 500 }}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <Calculator size={18} style={{ color: GOLD }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>Counting trail</p>
        </div>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          Counting {calc.partNumber} sign{calc.partNumber > 1 ? "s" : ""} from {calc.isOdd ? "Leo" : "Cancer"}:
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          {countedSigns.map((s, i) => (
            <span
              key={i}
              className="rounded px-2 py-1 text-xs"
              style={{
                background: i === countedSigns.length - 1 ? GOLD : SURFACE,
                border: `1px solid ${i === countedSigns.length - 1 ? GOLD : HAIRLINE}`,
                color: i === countedSigns.length - 1 ? "#1A1408" : INK_SECONDARY,
                fontWeight: 500,
              }}
            >
              {i + 1}. {s}
            </span>
          ))}
        </div>
        {calc.partNumber > 12 && (
          <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            The count wraps past Pisces and continues from Aries. The modular shortcut gives the same final sign.
          </p>
        )}
      </aside>
    </div>
  );
}

function HousesTab() {
  const lagnaD24Index = computeD24("Virgo", 8.0).d24Index; // Capricorn
  const placements = useMemo(() => {
    return CHART_E1_POINTS.map((p) => {
      const d24 = computeD24(p.sign, p.degree);
      const house = ((d24.d24Index - lagnaD24Index + 12) % 12) + 1;
      return { ...p, d24Index: d24.d24Index, house };
    });
  }, [lagnaD24Index]);

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.3 & §4.4</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          D24 whole-sign houses
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          D24-Lagna = <span style={{ color: GOLD, fontWeight: 500 }}>Capricorn</span>. The remaining houses follow in
          zodiacal order.
        </p>

        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 12 }, (_, i) => {
            const house = i + 1;
            const signIdx = (lagnaD24Index + i) % 12;
            const occupants = placements.filter((p) => p.house === house);
            return (
              <div
                key={house}
                className="rounded-lg p-3"
                style={{
                  background: occupants.length ? wash(GOLD, "10") : SURFACE_2,
                  border: `1px solid ${occupants.length ? GOLD : HAIRLINE}`,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>House {house}</span>
                  {house === 1 && <Home size={14} style={{ color: GOLD }} aria-hidden="true" />}
                </div>
                <p className="m-0 mt-1 text-sm" style={{ color: INK_PRIMARY, fontWeight: 500 }}>
                  {SIGNS[signIdx].english} <span style={{ fontFamily: fontFamilies.display }}>({SIGNS[signIdx].devanagari})</span>
                </p>
                {occupants.length > 0 && (
                  <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
                    {occupants.map((o) => o.point).join(", ")}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <Table size={18} style={{ color: GOLD }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>Occupancy summary</p>
        </div>
        <ul className="m-0 mt-2 list-disc space-y-2 pl-5 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          <li>Moon & Mars → D24 house 1 (Capricorn)</li>
          <li>Sun & Saturn → D24 house 3 (Pisces)</li>
          <li>Mercury → D24 house 7 (Cancer)</li>
          <li>Venus → D24 house 10 (Libra)</li>
          <li>Jupiter → D24 house 11 (Scorpio)</li>
          <li>Rāhu & Ketu → D24 house 4 (Aries)</li>
          <li>Houses 2, 5, 6, 8, 9, 12 are unoccupied</li>
        </ul>
        <div className="mt-3 rounded-lg p-2 text-sm" style={{ background: wash(VERMILION, "10"), border: `1px solid ${wash(VERMILION, "55")}`, color: INK_SECONDARY, lineHeight: 1.55 }}>
          Note: Mars in Capricorn in D24 echoes its D1 sign, but this is not vargottama — that term is reserved for D1-D9 matches.
        </div>
      </aside>
    </div>
  );
}
