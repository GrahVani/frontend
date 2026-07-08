"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Crown,
  Eye,
  Layers,
  Lock,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { grahas, ink, rashis, type GrahaSlug, type RashiSlug } from "@/design-tokens/grahvani-learning/colors";
import { fontFamilies } from "@/design-tokens/grahvani-learning/typography";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";


const NAKSHATRA_SPAN_DEG = 13 + 20 / 60;
const NAKSHATRA_SPAN_ARCMIN = 800;
const VIMSHOTTARI_TOTAL = 120;


const GRAHA_ORDER: GrahaSlug[] = [
  "ketu",
  "shukra",
  "surya",
  "candra",
  "mangala",
  "rahu",
  "guru",
  "shani",
  "budha",
];

const VIMSHOTTARI_YEARS: Record<GrahaSlug, number> = {
  ketu: 7,
  shukra: 20,
  surya: 6,
  candra: 10,
  mangala: 7,
  rahu: 18,
  guru: 16,
  shani: 19,
  budha: 17,
};

const HOUSE_LORDS: Record<number, GrahaSlug> = {
  0: "mangala",
  1: "shukra",
  2: "budha",
  3: "candra",
  4: "surya",
  5: "budha",
  6: "shukra",
  7: "mangala",
  8: "guru",
  9: "shani",
  10: "shani",
  11: "guru",
};

const RASHI_LIST: RashiSlug[] = [
  "mesha",
  "vrishabha",
  "mithuna",
  "karka",
  "simha",
  "kanya",
  "tula",
  "vrishchika",
  "dhanus",
  "makara",
  "kumbha",
  "mina",
];

function formatArcmin(arcmin: number): string {
  const deg = Math.floor(arcmin / 60);
  const min = Math.round(arcmin % 60);
  return `${deg}° ${min.toString().padStart(2, "0")}′`;
}

function subLordSpanArcmin(slug: GrahaSlug): number {
  return (VIMSHOTTARI_YEARS[slug] / VIMSHOTTARI_TOTAL) * NAKSHATRA_SPAN_ARCMIN;
}

function computeSubLord(starLord: GrahaSlug, offsetArcmin: number): { slug: GrahaSlug; start: number; end: number } {
  const startIndex = GRAHA_ORDER.indexOf(starLord);
  let cursor = 0;
  for (let i = 0; i < 9; i += 1) {
    const slug = GRAHA_ORDER[(startIndex + i) % 9];
    const span = subLordSpanArcmin(slug);
    const end = cursor + span;
    if (offsetArcmin < end || i === 8) {
      return { slug, start: cursor, end };
    }
    cursor = end;
  }
  return { slug: starLord, start: 0, end: NAKSHATRA_SPAN_ARCMIN };
}

function getBhadhakaOffset(modality: string): number {
  if (modality === "chara") return 10;
  if (modality === "sthira") return 8;
  return 6;
}

function modalityLabel(modality: string): string {
  if (modality === "chara") return "Chara (movable)";
  if (modality === "sthira") return "Sthira (fixed)";
  return "Dvi-svabhāva (dual)";
}

function bhadhakaHouseLabel(offset: number): string {
  const house = offset + 1;
  if (house === 11) return "11th";
  if (house === 9) return "9th";
  return "7th";
}

export function KpLongevityDoctrineExplorer() {
  const [tab, setTab] = useState<"sublord" | "hierarchy" | "maraka" | "bhadhaka" | "scope">("sublord");

  function reset() {
    setTab("sublord");
  }

  return (
    <div
      data-interactive="kp-longevity-doctrine-explorer"
      className="w-full min-w-0"
      style={{
        color: INK_PRIMARY,
        background: SURFACE,
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 16,
        padding: 20,
        boxSizing: "border-box",
        overflow: "hidden",
        fontFamily: fontFamilies.body,
      }}
    >
      <header className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <Eyebrow>KP longevity doctrine explorer</Eyebrow>
          <h2
            className="mt-1 text-xl sm:text-2xl"
            style={{ color: streams.kp.primary, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
          >
            Sub-lord, significator hierarchy, maraka list, and Bhādhaka
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            Explore the four KP doctrines introduced in KP Reader VI: the sub-lord as final arbiter, the four-level
            hierarchy, the broader maraka list, and the Bhādhaka house keyed to lagna sign type.
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 self-start rounded-lg px-3 py-2 text-sm"
          style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY, fontWeight: 500 }}
        >
          <Sparkles size={15} aria-hidden="true" />
          Start over
        </button>
      </header>

      <nav className="mb-5 flex flex-wrap gap-2" aria-label="KP doctrine sections">
        {[
          { key: "sublord", label: "Sub-lord arbiter" },
          { key: "hierarchy", label: "Significator hierarchy" },
          { key: "maraka", label: "Maraka list" },
          { key: "bhadhaka", label: "Bhādhaka" },
          { key: "scope", label: "Data-scope honesty" },
        ].map((item) => (
          <TabButton key={item.key} active={tab === (item.key as typeof tab)} onClick={() => setTab(item.key as typeof tab)}>
            {item.label}
          </TabButton>
        ))}
      </nav>

      {tab === "sublord" && <SubLordPanel />}
      {tab === "hierarchy" && <HierarchyPanel />}
      {tab === "maraka" && <MarakaPanel />}
      {tab === "bhadhaka" && <BhadhakaPanel />}
      {tab === "scope" && <DataScopePanel />}
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
        border: `1px solid ${active ? streams.kp.primary : HAIRLINE}`,
        background: active ? streams.kp.primary : "transparent",
        color: active ? "#fff" : INK_SECONDARY,
        fontWeight: 500,
      }}
    >
      {children}
    </button>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p
      className="m-0 text-xs uppercase"
      style={{ color: INK_MUTED, letterSpacing: "0.08em", fontWeight: 600 }}
    >
      {children}
    </p>
  );
}

function Panel({ title, eyebrow, children, accent = streams.kp.primary }: { title?: string; eyebrow?: string; children: ReactNode; accent?: string }) {
  return (
    <section
      className="min-w-0 rounded-xl p-4"
      style={{ background: SURFACE, border: `1px solid ${accent}44` }}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      {title && (
        <h3
          className="mt-1 text-lg"
          style={{ color: accent, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
        >
          {title}
        </h3>
      )}
      <div className="mt-3">{children}</div>
    </section>
  );
}

function SubLordPanel() {
  const [starLord, setStarLord] = useState<GrahaSlug>("shukra");
  const [offsetDeg, setOffsetDeg] = useState<number>(4 + 40 / 60); // 4°40′ into nakshatra

  const offsetArcmin = offsetDeg * 60;
  const sub = useMemo(() => computeSubLord(starLord, offsetArcmin), [starLord, offsetArcmin]);
  const starLordLabel = grahas[starLord].iast;
  const subLordLabel = grahas[sub.slug].iast;

  function applyPreset(deg: number, star: GrahaSlug) {
    setOffsetDeg(deg);
    setStarLord(star);
  }

  return (
    <div className="grid min-w-0 gap-4">
      <Panel eyebrow="§4.1" title="The sub-lord as final arbiter" accent={ink.goldAccent}>
        <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          A planet can look promising by sign, house, and nakshatra. The sub-lord — the ruler of the tiny sub-division
          within the nakshatra — can still override the reading. Drag the marker to see how the sub-lord changes.
        </p>
      </Panel>

      <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
        <Panel eyebrow="Nakshatra sub-divisions" title="Sub-lords sized by Vimshottari years">
          <SubLordBar starLord={starLord} offsetArcmin={offsetArcmin} activeSlug={sub.slug} />

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg p-3" style={{ background: `${grahas[starLord].secondaryTint}55`, border: `1px solid ${grahas[starLord].primary}` }}>
              <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>Star lord</p>
              <p className="mt-1 text-base" style={{ color: grahas[starLord].primary, fontWeight: 600 }}>{starLordLabel}</p>
              <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>Ruler of the nakshatra</p>
            </div>
            <div className="rounded-lg p-3" style={{ background: `${grahas[sub.slug].secondaryTint}55`, border: `1px solid ${grahas[sub.slug].primary}` }}>
              <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>Sub-lord</p>
              <p className="mt-1 text-base" style={{ color: grahas[sub.slug].primary, fontWeight: 600 }}>{subLordLabel}</p>
              <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>Final arbiter for this point</p>
            </div>
          </div>

          <div className="mt-4 rounded-lg p-3" style={{ background: `${ink.goldAccent}10`, border: `1px solid ${ink.goldAccent}55` }}>
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              At <span style={{ color: INK_PRIMARY, fontWeight: 500 }}>{formatArcmin(offsetArcmin)}</span> into the
              nakshatra, the point has fallen in the <span style={{ color: grahas[sub.slug].primary, fontWeight: 500 }}>{subLordLabel}</span>{" "}
              sub (span {formatArcmin(sub.start)}–{formatArcmin(sub.end)}). That sub-lord is read as the final
              decision-maker.
            </p>
          </div>
        </Panel>

        <div className="grid min-w-0 gap-4">
          <Panel eyebrow="Controls" title="Move the point">
            <label className="block text-sm" style={{ color: INK_SECONDARY }}>
              Star lord (nakshatra ruler)
            </label>
            <select
              value={starLord}
              onChange={(e) => setStarLord(e.target.value as GrahaSlug)}
              className="mt-2 w-full rounded-lg p-2 text-sm"
              style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
            >
              {GRAHA_ORDER.map((slug) => (
                <option key={slug} value={slug}>
                  {grahas[slug].iast} ({grahas[slug].devanagari})
                </option>
              ))}
            </select>

            <label className="mt-4 block text-sm" style={{ color: INK_SECONDARY }}>
              Offset into nakshatra: {offsetDeg.toFixed(3)}°
            </label>
            <input
              type="range"
              min={0}
              max={NAKSHATRA_SPAN_DEG - 0.001}
              step={0.01}
              value={offsetDeg}
              onChange={(e) => setOffsetDeg(Number(e.target.value))}
              className="mt-2 w-full"
              aria-label="Offset into nakshatra"
            />

            <div className="mt-4 flex flex-wrap gap-2">
              <PresetButton onClick={() => applyPreset(4 + 40 / 60, "shukra")}>Saturn in Bharaṇī (lesson preset)</PresetButton>
              <PresetButton onClick={() => applyPreset(0.5, "shukra")}>Near start</PresetButton>
              <PresetButton onClick={() => applyPreset(12.5, "shukra")}>Near end</PresetButton>
            </div>
          </Panel>

          <Panel accent={ink.vermilionAccent}>
            <div className="flex items-start gap-3">
              <Crown size={18} style={{ color: ink.goldAccent, flexShrink: 0 }} aria-hidden="true" />
              <div>
                <p className="m-0 text-sm" style={{ color: INK_PRIMARY, fontWeight: 500 }}>Why this matters for longevity</p>
                <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
                  Even a planet that rules or occupies a longevity-relevant house can be qualified, strengthened, or
                  denied by its sub-lord. The sub-lord is the last filter before a KP reading is formed.
                </p>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function PresetButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg px-3 py-2 text-xs"
      style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY, fontWeight: 500 }}
    >
      {children}
    </button>
  );
}

function SubLordBar({ starLord, offsetArcmin, activeSlug }: { starLord: GrahaSlug; offsetArcmin: number; activeSlug: GrahaSlug }) {
  const width = 720;
  const height = 120;
  const startIndex = GRAHA_ORDER.indexOf(starLord);
  let cursor = 0;
  const segments = [];
  for (let i = 0; i < 9; i += 1) {
    const slug = GRAHA_ORDER[(startIndex + i) % 9];
    const spanArcmin = subLordSpanArcmin(slug);
    const segmentWidth = (spanArcmin / NAKSHATRA_SPAN_ARCMIN) * width;
    const isActive = slug === activeSlug;
    segments.push({ slug, x: cursor, width: segmentWidth, isActive, spanArcmin });
    cursor += segmentWidth;
  }
  const markerX = (offsetArcmin / NAKSHATRA_SPAN_ARCMIN) * width;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Nakshatra divided into Vimshottari-proportional sub-lords" className="h-auto w-full min-w-0">
      <rect x="10" y="10" width={width - 20} height={height - 20} rx="12" fill={`${ink.goldAccent}0A`} stroke={HAIRLINE} />
      {segments.map((seg) => (
        <g key={seg.slug}>
          <rect
            x={seg.x + 10}
            y="42"
            width={Math.max(seg.width - 2, 2)}
            height="46"
            rx="6"
            fill={seg.isActive ? `${grahas[seg.slug].primary}30` : `${grahas[seg.slug].primary}14`}
            stroke={seg.isActive ? grahas[seg.slug].primary : HAIRLINE}
            strokeWidth={seg.isActive ? 2.5 : 1}
          />
          <text
            x={seg.x + 10 + seg.width / 2}
            y="55"
            textAnchor="middle"
            fill={seg.isActive ? grahas[seg.slug].primary : INK_SECONDARY}
            fontSize="11"
            fontWeight="600"
          >
            {grahas[seg.slug].iast}
          </text>
          <text
            x={seg.x + 10 + seg.width / 2}
            y="74"
            textAnchor="middle"
            fill={INK_MUTED}
            fontSize="9"
            fontWeight="500"
          >
            {VIMSHOTTARI_YEARS[seg.slug]}y
          </text>
        </g>
      ))}
      <line x1={markerX + 10} y1="32" x2={markerX + 10} y2="100" stroke={INK_PRIMARY} strokeWidth="2.5" strokeDasharray="4 3" />
      <polygon points={`${markerX + 10},32 ${markerX + 4},42 ${markerX + 16},42`} fill={INK_PRIMARY} />
      <text x={markerX + 10} y="28" textAnchor="middle" fill={INK_PRIMARY} fontSize="10" fontWeight="600">
        {formatArcmin(offsetArcmin)}
      </text>
    </svg>
  );
}

function HierarchyPanel() {
  const [activeLevel, setActiveLevel] = useState<number | null>(1);

  const levels = [
    {
      rank: 1,
      label: "Planets in the star of the house occupant",
      note: "Strongest significance for the house outcome.",
      color: "#2F7D55",
    },
    {
      rank: 2,
      label: "The occupant of the house",
      note: "Direct occupancy significance.",
      color: "#356CAB",
    },
    {
      rank: 3,
      label: "Planets in the star of the house lord",
      note: "Lord-level significance through stellar linkage.",
      color: "#6B5AA8",
    },
    {
      rank: 4,
      label: "The house lord itself",
      note: "Weakest but still valid level.",
      color: "#8A7E5E",
    },
  ];

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <Panel eyebrow="§4.2" title="Four-level significator hierarchy">
        <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Applied to longevity-relevant houses, the hierarchy runs from strongest to weakest. Click a level to see how
          its weight changes.
        </p>
        <div className="mt-4 grid gap-3">
          {levels.map((level, index) => {
            const active = activeLevel === null ? true : activeLevel <= index;
            const dimmed = activeLevel !== null && activeLevel < index;
            return (
              <button
                key={level.rank}
                type="button"
                onClick={() => setActiveLevel(index)}
                className="flex items-center gap-3 rounded-xl p-3 text-left"
                style={{
                  background: active ? `${level.color}12` : "transparent",
                  border: `1px solid ${active ? level.color : HAIRLINE}`,
                  opacity: dimmed ? 0.55 : 1,
                }}
              >
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm"
                  style={{ background: level.color, color: "#fff", fontWeight: 600 }}
                >
                  {level.rank}
                </span>
                <div className="min-w-0">
                  <p className="m-0 text-sm" style={{ color: active ? level.color : INK_PRIMARY, fontWeight: 500 }}>
                    {level.label}
                  </p>
                  <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>{level.note}</p>
                </div>
                {active && <CheckCircle2 size={16} style={{ color: level.color, marginLeft: "auto" }} aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      </Panel>

      <Panel eyebrow="Visual summary" title="Hierarchy pyramid">
        <svg viewBox="0 0 340 240" role="img" aria-label="Four-level significator hierarchy pyramid" className="h-auto w-full min-w-0">
          <polygon points="170,20 40,220 300,220" fill={`${ink.goldAccent}0A`} stroke={HAIRLINE} strokeWidth="1.5" />
          {levels.map((level, index) => {
            const yTop = 50 + index * 45;
            const yBottom = yTop + 38;
            const leftTop = 85 + index * 28;
            const rightTop = 255 - index * 28;
            const leftBottom = leftTop + 22;
            const rightBottom = rightTop - 22;
            const active = activeLevel === null ? true : activeLevel <= index;
            return (
              <g key={level.rank} onClick={() => setActiveLevel(index)} style={{ cursor: "pointer" }}>
                <polygon
                  points={`${leftTop},${yTop} ${rightTop},${yTop} ${rightBottom},${yBottom} ${leftBottom},${yBottom}`}
                  fill={active ? `${level.color}22` : `${HAIRLINE}22`}
                  stroke={active ? level.color : HAIRLINE}
                  strokeWidth={active ? 2.5 : 1}
                />
                <text x="170" y={yTop + 17} textAnchor="middle" fill={active ? level.color : INK_MUTED} fontSize="11" fontWeight="600">
                  {level.rank}. {level.label.split(" ").slice(0, 3).join(" ")}…
                </text>
                <text x="170" y={yTop + 32} textAnchor="middle" fill={active ? INK_PRIMARY : INK_MUTED} fontSize="9" fontWeight="500">
                  {level.note}
                </text>
              </g>
            );
          })}
        </svg>
        <p className="mt-3 text-xs" style={{ color: INK_SECONDARY, lineHeight: 1.5 }}>
          A planet meeting the highest available level of significance for a longevity house is read as more strongly
          connected than one meeting only the lowest level.
        </p>
      </Panel>
    </div>
  );
}

function MarakaPanel() {
  const [stream, setStream] = useState<"parashari" | "kp">("kp");

  const parashariHouses = [2, 7];
  const kpHouses = [2, 7, 12];
  const included = stream === "parashari" ? parashariHouses : kpHouses;

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <Panel eyebrow="§4.3" title="KP's maraka-house list is broader than Parāśara's">
        <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Chapter 4 taught Parāśarī maraka houses as 2nd and 7th. KP longevity doctrine adds the 12th. This is a
          documented, structural difference — not a restatement.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={stream === "parashari"}
            onClick={() => setStream("parashari")}
            className="rounded-lg px-3 py-2 text-sm"
            style={{
              border: `1px solid ${stream === "parashari" ? streams.parashara.primary : HAIRLINE}`,
              background: stream === "parashari" ? streams.parashara.primary : "transparent",
              color: stream === "parashari" ? "#1A1408" : INK_SECONDARY,
              fontWeight: 500,
            }}
          >
            Parāśarī: 2nd / 7th
          </button>
          <button
            type="button"
            aria-pressed={stream === "kp"}
            onClick={() => setStream("kp")}
            className="rounded-lg px-3 py-2 text-sm"
            style={{
              border: `1px solid ${stream === "kp" ? streams.kp.primary : HAIRLINE}`,
              background: stream === "kp" ? streams.kp.primary : "transparent",
              color: stream === "kp" ? "#fff" : INK_SECONDARY,
              fontWeight: 500,
            }}
          >
            KP: 2nd / 7th / 12th
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[2, 7, 12].map((house) => {
            const isIncluded = included.includes(house);
            return (
              <div
                key={house}
                className="rounded-xl p-4 text-center"
                style={{
                  background: isIncluded ? `${ink.vermilionAccent}10` : `${INK_MUTED}10`,
                  border: `1px solid ${isIncluded ? ink.vermilionAccent : HAIRLINE}`,
                  opacity: isIncluded ? 1 : 0.6,
                }}
              >
                <p className="m-0 text-2xl" style={{ color: isIncluded ? ink.vermilionAccent : INK_MUTED, fontWeight: 600, fontFamily: fontFamilies.literarySerif }}>
                  {house === 12 ? "12th" : house === 2 ? "2nd" : "7th"}
                </p>
                <p className="m-0 mt-1 text-xs" style={{ color: INK_SECONDARY }}>
                  {isIncluded ? "Maraka house" : "Not in this list"}
                </p>
              </div>
            );
          })}
        </div>

        <div
          className="mt-4 flex items-start gap-3 rounded-lg p-3"
          style={{ background: `${streams.kp.primary}10`, border: `1px solid ${streams.kp.primary}55` }}
        >
          <Scale size={18} style={{ color: streams.kp.primary, flexShrink: 0 }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            {stream === "kp"
              ? "The 12th house is included because it signifies loss in its most extreme form. When doing KP longevity analysis, do not silently drop back to the Parāśarī list."
              : "Parāśarī longevity analysis stops at the 2nd and 7th. Switch to KP to see the documented addition."}
          </p>
        </div>
      </Panel>

      <Panel eyebrow="Side-by-side" title="Where the lists overlap and diverge">
        <div className="relative rounded-xl p-4" style={{ background: `${ink.goldAccent}0A`, border: `1px solid ${HAIRLINE}` }}>
          <div className="flex items-center justify-between gap-2">
            <div
              className="flex-1 rounded-lg p-3 text-center"
              style={{ background: `${streams.parashara.primary}22`, border: `1px solid ${streams.parashara.primary}` }}
            >
              <p className="m-0 text-sm" style={{ color: INK_PRIMARY, fontWeight: 500 }}>Parāśarī</p>
              <p className="m-0 mt-1 text-xs" style={{ color: INK_SECONDARY }}>2nd, 7th</p>
            </div>
            <ArrowRight size={18} style={{ color: INK_MUTED }} aria-hidden="true" />
            <div
              className="flex-1 rounded-lg p-3 text-center"
              style={{ background: `${streams.kp.primary}22`, border: `1px solid ${streams.kp.primary}` }}
            >
              <p className="m-0 text-sm" style={{ color: INK_PRIMARY, fontWeight: 500 }}>KP</p>
              <p className="m-0 mt-1 text-xs" style={{ color: INK_SECONDARY }}>2nd, 7th, 12th</p>
            </div>
          </div>
          <div className="mt-3 rounded-lg p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              Shared: 2nd and 7th. KP-specific addition: 12th. The overlap is large, which is why the difference is easy
              to overlook — but it is structurally real.
            </p>
          </div>
        </div>
      </Panel>
    </div>
  );
}

function BhadhakaPanel() {
  const [lagna, setLagna] = useState<RashiSlug>("karka");

  const lagnaIndex = RASHI_LIST.indexOf(lagna);
  const lagnaData = rashis[lagna];
  const modality = lagnaData.modality;
  const offset = getBhadhakaOffset(modality);
  const bhadhakaSignIndex = (lagnaIndex + offset) % 12;
  const bhadhakaSign = RASHI_LIST[bhadhakaSignIndex];
  const bhadhakaLord = HOUSE_LORDS[bhadhakaSignIndex];

  const examples: { label: string; rashi: RashiSlug }[] = [
    { label: "Cancer (chara)", rashi: "karka" },
    { label: "Leo (sthira)", rashi: "simha" },
    { label: "Virgo (dual)", rashi: "kanya" },
  ];

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <Panel eyebrow="§4.4" title="Bhādhaka is keyed to lagna sign type only">
        <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Bhādhaka means “obstacle.” Its house is assigned purely by whether the lagna is movable, fixed, or dual. No
          planetary placement or cusp data is needed.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { type: "chara", house: "11th", signs: "Aries, Cancer, Libra, Capricorn", color: "#356CAB" },
            { type: "sthira", house: "9th", signs: "Taurus, Leo, Scorpio, Aquarius", color: "#6B5AA8" },
            { type: "dvi-svabhava", house: "7th", signs: "Gemini, Virgo, Sagittarius, Pisces", color: "#2F7D55" },
          ].map((row) => (
            <div
              key={row.type}
              className="rounded-xl p-3"
              style={{
                background: modality === row.type ? `${row.color}12` : `${INK_MUTED}08`,
                border: `1px solid ${modality === row.type ? row.color : HAIRLINE}`,
                opacity: modality === row.type ? 1 : 0.65,
              }}
            >
              <p className="m-0 text-xs uppercase" style={{ color: row.color, fontWeight: 600 }}>{modalityLabel(row.type)}</p>
              <p className="m-0 mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
                {row.house} house
              </p>
              <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>{row.signs}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg p-3" style={{ background: `${lagnaData.primary}10`, border: `1px solid ${lagnaData.primary}` }}>
            <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>Selected lagna</p>
            <p className="m-0 mt-1 text-base" style={{ color: lagnaData.primary, fontWeight: 600 }}>
              {lagnaData.english} ({lagnaData.iast})
            </p>
            <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>{modalityLabel(modality)}</p>
          </div>
          <div className="rounded-lg p-3" style={{ background: `${grahas[bhadhakaLord].secondaryTint}55`, border: `1px solid ${grahas[bhadhakaLord].primary}` }}>
            <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>Bhādhaka</p>
            <p className="m-0 mt-1 text-base" style={{ color: grahas[bhadhakaLord].primary, fontWeight: 600 }}>
              {bhadhakaHouseLabel(offset)} → {rashis[bhadhakaSign].english} → {grahas[bhadhakaLord].iast}
            </p>
            <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>Bhādhakeśa (obstacle lord)</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>Quick examples from the lesson:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {examples.map((ex) => (
              <PresetButton key={ex.label} onClick={() => setLagna(ex.rashi)}>
                {ex.label}
              </PresetButton>
            ))}
          </div>
        </div>
      </Panel>

      <Panel eyebrow="Visual" title="Lagna and Bhādhaka house on the zodiac">
        <BhadhakaWheel lagnaIndex={lagnaIndex} bhadhakaOffset={offset} />
      </Panel>
    </div>
  );
}

function BhadhakaWheel({ lagnaIndex, bhadhakaOffset }: { lagnaIndex: number; bhadhakaOffset: number }) {
  const cx = 150;
  const cy = 150;
  const r = 95;
  const labelR = 70;

  return (
    <svg viewBox="0 0 300 300" role="img" aria-label="Zodiac wheel highlighting lagna and Bhadhaka house" className="mx-auto h-auto w-full max-w-xs">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={HAIRLINE} strokeWidth="1.5" />
      {RASHI_LIST.map((slug, i) => {
        const angle = (i - lagnaIndex) * 30 * (Math.PI / 180) - Math.PI / 2;
        const x1 = cx + r * Math.cos(angle);
        const y1 = cy + r * Math.sin(angle);
        const x2 = cx + (r - 18) * Math.cos(angle);
        const y2 = cy + (r - 18) * Math.sin(angle);
        return <line key={slug} x1={x1} y1={y1} x2={x2} y2={y2} stroke={HAIRLINE} strokeWidth="1" />;
      })}
      {RASHI_LIST.map((slug, i) => {
        const angle = (i - lagnaIndex) * 30 * (Math.PI / 180) - Math.PI / 2;
        const x = cx + labelR * Math.cos(angle);
        const y = cy + labelR * Math.sin(angle);
        const isLagna = i === lagnaIndex;
        const isBhadhaka = i === (lagnaIndex + bhadhakaOffset) % 12;
        const color = rashis[slug].primary;
        return (
          <g key={`label-${slug}`}>
            {(isLagna || isBhadhaka) && (
              <circle cx={x} cy={y} r={16} fill={`${color}22`} stroke={color} strokeWidth="2" />
            )}
            <text x={x} y={y + 4} textAnchor="middle" fill={isLagna || isBhadhaka ? color : INK_MUTED} fontSize="9" fontWeight={isLagna || isBhadhaka ? 600 : 500}>
              {rashis[slug].iast}
            </text>
          </g>
        );
      })}
      <text x={cx} y={cy + 4} textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="500">
        Lagna at top
      </text>
      <g>
        <circle cx={cx} cy={cy - r + 28} r={12} fill={`${rashis[RASHI_LIST[lagnaIndex]].primary}22`} stroke={rashis[RASHI_LIST[lagnaIndex]].primary} strokeWidth="2" />
        <text x={cx} y={cy - r + 32} textAnchor="middle" fill={rashis[RASHI_LIST[lagnaIndex]].primary} fontSize="9" fontWeight="600">L</text>
      </g>
      <g>
        {(() => {
          const bIndex = (lagnaIndex + bhadhakaOffset) % 12;
          const angle = bhadhakaOffset * 30 * (Math.PI / 180) - Math.PI / 2;
          const x = cx + (r - 28) * Math.cos(angle);
          const y = cy + (r - 28) * Math.sin(angle);
          return (
            <>
              <circle cx={x} cy={y} r={12} fill={`${rashis[RASHI_LIST[bIndex]].primary}22`} stroke={rashis[RASHI_LIST[bIndex]].primary} strokeWidth="2" />
              <text x={x} y={y + 4} textAnchor="middle" fill={rashis[RASHI_LIST[bIndex]].primary} fontSize="9" fontWeight="600">B</text>
            </>
          );
        })()}
      </g>
    </svg>
  );
}

function DataScopePanel() {
  const [mode, setMode] = useState<"planetary" | "cuspal">("planetary");

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-2">
      <Panel eyebrow="§4.5" title="Honest data-scope for this module">
        <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Full KP cuspal analysis needs Placidus house cusps, which require exact birth time and place. Chart H1 was
          built on whole-sign houses and never carried that data. This lesson does not invent it.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={mode === "planetary"}
            onClick={() => setMode("planetary")}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
            style={{
              border: `1px solid ${mode === "planetary" ? "#2F7D55" : HAIRLINE}`,
              background: mode === "planetary" ? "#2F7D55" : "transparent",
              color: mode === "planetary" ? "#fff" : INK_SECONDARY,
              fontWeight: 500,
            }}
          >
            <CheckCircle2 size={15} aria-hidden="true" />
            Planetary sub-lord
          </button>
          <button
            type="button"
            aria-pressed={mode === "cuspal"}
            onClick={() => setMode("cuspal")}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
            style={{
              border: `1px solid ${mode === "cuspal" ? ink.vermilionAccent : HAIRLINE}`,
              background: mode === "cuspal" ? ink.vermilionAccent : "transparent",
              color: mode === "cuspal" ? "#fff" : INK_SECONDARY,
              fontWeight: 500,
            }}
          >
            <Lock size={15} aria-hidden="true" />
            Cuspal sub-lord
          </button>
        </div>

        {mode === "planetary" ? (
          <div className="mt-4 rounded-lg p-3" style={{ background: `${"#2F7D55"}10`, border: `1px solid ${"#2F7D55"}55` }}>
            <p className="m-0 text-sm" style={{ color: INK_PRIMARY, fontWeight: 500 }}>This lesson can honestly compute:</p>
            <ul className="mt-2 space-y-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              <li className="flex items-start gap-2">
                <Target size={15} style={{ color: "#2F7D55", flexShrink: 0, marginTop: 3 }} aria-hidden="true" />
                <span>Planetary sub-lords — only a planet&apos;s longitude is required.</span>
              </li>
              <li className="flex items-start gap-2">
                <Eye size={15} style={{ color: "#2F7D55", flexShrink: 0, marginTop: 3 }} aria-hidden="true" />
                <span>Bhādhaka house and lord — only the lagna sign type is required.</span>
              </li>
            </ul>
          </div>
        ) : (
          <div className="mt-4 rounded-lg p-3" style={{ background: `${ink.vermilionAccent}10`, border: `1px solid ${ink.vermilionAccent}55` }}>
            <div className="flex items-start gap-3">
              <AlertTriangle size={18} style={{ color: ink.vermilionAccent, flexShrink: 0 }} aria-hidden="true" />
              <div>
                <p className="m-0 text-sm" style={{ color: ink.vermilionAccent, fontWeight: 500 }}>Requires data this module does not have</p>
                <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
                  Cuspal sub-lords are computed from Placidus house cusps. Those cusps need exact birth time and place.
                  Chart H1 was never given them; inventing them now would quietly break consistency across the module.
                </p>
              </div>
            </div>
          </div>
        )}
      </Panel>

      <Panel eyebrow="Discipline" title="What an honest KP reading reports">
        <div className="space-y-3">
          <div className="flex items-start gap-3 rounded-lg p-3" style={{ background: `${ink.goldAccent}0A`, border: `1px solid ${HAIRLINE}` }}>
            <ShieldCheck size={18} style={{ color: ink.goldAccent, flexShrink: 0 }} aria-hidden="true" />
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              State plainly which parts of KP doctrine can be applied with the data on hand.
            </p>
          </div>
          <div className="flex items-start gap-3 rounded-lg p-3" style={{ background: `${ink.goldAccent}0A`, border: `1px solid ${HAIRLINE}` }}>
            <Layers size={18} style={{ color: ink.goldAccent, flexShrink: 0 }} aria-hidden="true" />
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              Apply planetary sub-lord and Bhādhaka identification without pretending to have Placidus cusps.
            </p>
          </div>
          <div className="flex items-start gap-3 rounded-lg p-3" style={{ background: `${ink.goldAccent}0A`, border: `1px solid ${HAIRLINE}` }}>
            <ChevronRight size={18} style={{ color: ink.goldAccent, flexShrink: 0 }} aria-hidden="true" />
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              Lesson 7.5.4 then applies only the honestly-translatable parts to Chart H1.
            </p>
          </div>
        </div>
      </Panel>
    </div>
  );
}

const streams = {
  parashara: { primary: ink.goldAccent },
  kp: { primary: "#5A8AC8" },
};
