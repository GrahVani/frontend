"use client";

import { useMemo, useState } from "react";
import { BookOpen, Compass, Crosshair, Gem, Layers3, Scale, Sparkles } from "lucide-react";
import {
  APPROACHES,
  CONVERGENCE_FINDINGS,
  DIVERGENCE_DIMENSIONS,
  UNIQUE_CONTRIBUTIONS,
  type LineageApproach,
} from "./data";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const GOLD = "var(--gl-gold-accent)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";

type ViewMode = "chart" | "convergence" | "divergence" | "synthesis";

const CHART_POINTS = [
  { key: "lagna", label: "Cancer Lagna", sub: "Moon in own sign", x: 164, y: 76, color: "#3A8C5A" },
  { key: "sun", label: "Sun", sub: "Libra 28 deg 15", x: 78, y: 204, color: "#C8412E" },
  { key: "moon", label: "Moon", sub: "Cancer 12 deg", x: 164, y: 123, color: "#3A8C5A" },
  { key: "mars", label: "Mars", sub: "Pisces 5 deg 45", x: 255, y: 76, color: "#C8412E" },
  { key: "jupiter", label: "Jupiter", sub: "Capricorn 18 deg 30", x: 255, y: 245, color: "#9C7A2F" },
  { key: "venus", label: "Venus", sub: "Sagittarius 25 deg 10", x: 164, y: 245, color: "#7A5E1E" },
  { key: "saturn", label: "Saturn AK", sub: "Sagittarius 29 deg 50", x: 122, y: 245, color: "#4F6FA8" },
  { key: "rahu", label: "Rahu", sub: "Aquarius 14 deg 30", x: 298, y: 164, color: "#7C5FA8" },
  { key: "ketu", label: "Ketu", sub: "Leo 14 deg 30", x: 32, y: 164, color: "#7C5FA8" },
];

export function ThreeLineageComparisonChartAnalyzer() {
  const [activeApproach, setActiveApproach] = useState("tamil-nadu-kp");
  const [activePoint, setActivePoint] = useState("saturn");
  const [viewMode, setViewMode] = useState<ViewMode>("chart");

  const approach = useMemo(
    () => APPROACHES.find((item) => item.slug === activeApproach) ?? APPROACHES[0],
    [activeApproach],
  );
  const point = CHART_POINTS.find((item) => item.key === activePoint) ?? CHART_POINTS[0];

  return (
    <div className="w-full" data-interactive="three-lineage-comparison-chart-analyzer" style={{ color: INK_PRIMARY }}>
      <div className="grid gap-4 xl:grid-cols-[minmax(360px,0.78fr)_minmax(0,1.22fr)]">
        <section
          className="self-start overflow-hidden rounded-lg"
          style={{
            border: `1px solid ${HAIRLINE}`,
            background: "linear-gradient(180deg, rgba(255,251,239,0.94), rgba(245,232,203,0.72))",
            boxShadow: "0 18px 40px rgba(72, 48, 16, 0.10)",
          }}
        >
          <div className="grid gap-3 p-3 lg:grid-cols-[minmax(220px,0.78fr)_minmax(220px,0.72fr)] xl:grid-cols-1">
            <ChartSvg activePoint={activePoint} onSelect={setActivePoint} approach={approach} />
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: INK_MUTED }}>
                  Demonstration chart
                </p>
                <h3 className="mt-1 text-[22px] font-semibold leading-tight" style={{ color: approach.color }}>
                  {point.label}
                </h3>
                <p className="mt-1 text-sm" style={{ color: INK_SECONDARY }}>
                  {point.sub}
                </p>
              </div>
              <div className="rounded-md p-2.5" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
                <p className="text-[12px] leading-relaxed" style={{ color: INK_SECONDARY }}>
                  The same chart is read three ways. Tap a graha or lineage to watch the practitioner&apos;s centre of
                  gravity shift without pretending the other methods disappear.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {APPROACHES.map((item) => (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => setActiveApproach(item.slug)}
                    className="gl-focus-ring gl-clickable rounded-md px-2 py-2 text-xs font-semibold"
                    aria-pressed={item.slug === activeApproach}
                    style={{
                      minHeight: 42,
                      color: item.slug === activeApproach ? "#fffaf0" : item.color,
                      background: item.slug === activeApproach ? item.color : "rgba(255, 250, 238, 0.76)",
                      border: `1px solid ${item.slug === activeApproach ? item.color : `${item.color}40`}`,
                    }}
                  >
                    {item.shortName}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          className="rounded-lg p-4"
          style={{ borderLeft: `3px solid ${approach.color}`, background: "rgba(255,250,238,0.54)" }}
        >
          <div className="flex flex-wrap gap-2">
            {[
              { key: "chart", label: "Lineage", icon: Compass },
              { key: "convergence", label: "Converge", icon: Scale },
              { key: "divergence", label: "Diverge", icon: Crosshair },
              { key: "synthesis", label: "Synthesis", icon: Sparkles },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setViewMode(key as ViewMode)}
                className="gl-focus-ring gl-clickable inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold"
                aria-pressed={viewMode === key}
                style={{
                  color: viewMode === key ? "#fffaf0" : INK_SECONDARY,
                  background: viewMode === key ? approach.color : "transparent",
                  border: `1px solid ${viewMode === key ? approach.color : HAIRLINE}`,
                }}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          {viewMode === "chart" ? <ApproachPanel approach={approach} /> : null}
          {viewMode === "convergence" ? <MatrixPanel title="Where the three lineages converge" rows={CONVERGENCE_FINDINGS} /> : null}
          {viewMode === "divergence" ? <MatrixPanel title="Where their methods diverge" rows={DIVERGENCE_DIMENSIONS} dimensionKey="dimension" /> : null}
          {viewMode === "synthesis" ? <SynthesisPanel approach={approach} /> : null}
        </section>
      </div>
    </div>
  );
}

function ChartSvg({
  activePoint,
  onSelect,
  approach,
}: {
  activePoint: string;
  onSelect: (key: string) => void;
  approach: LineageApproach;
}) {
  return (
    <svg viewBox="0 0 330 330" role="img" aria-label="Clickable South Indian demonstration chart" className="h-auto min-h-[240px] w-full">
      <rect x="8" y="8" width="314" height="314" rx="8" fill="#fff8e8" stroke="#d7b769" strokeWidth="1.5" />
      <path d="M8 8 L165 165 L322 8 M8 322 L165 165 L322 322 M8 8 L8 322 M322 8 L322 322 M8 8 L322 8 M8 322 L322 322" stroke="#d8bd79" strokeWidth="1.2" fill="none" />
      <circle cx="165" cy="165" r="70" fill={`${approach.color}12`} stroke={approach.color} strokeDasharray="4 5" />
      <text x="165" y="159" textAnchor="middle" fontSize="12" fontWeight="700" fill="#7A5E1E">
        same chart
      </text>
      <text x="165" y="176" textAnchor="middle" fontSize="10" fill="#5E4A36">
        three readings
      </text>

      {CHART_POINTS.map((point) => {
        const active = point.key === activePoint;
        return (
          <g key={point.key}>
            <button type="button" aria-label={`Select ${point.label}`} onClick={() => onSelect(point.key)}>
              <circle
                cx={point.x}
                cy={point.y}
                r={active ? 19 : 14}
                fill={active ? point.color : "#fffaf0"}
                stroke={point.color}
                strokeWidth={active ? 3 : 2}
                style={{ cursor: "pointer" }}
              />
              <text
                x={point.x}
                y={point.y + 34}
                textAnchor="middle"
                fontSize="9"
                fontWeight="700"
                fill={active ? point.color : "#5E4A36"}
                style={{ pointerEvents: "none" }}
              >
                {point.label}
              </text>
            </button>
          </g>
        );
      })}
    </svg>
  );
}

function ApproachPanel({ approach }: { approach: LineageApproach }) {
  return (
    <div className="mt-4 space-y-3">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: INK_MUTED }}>
          Active lineage
        </p>
        <h3 className="mt-1 text-[26px] font-semibold leading-tight" style={{ color: approach.color }}>
          {approach.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: INK_SECONDARY }}>
          {approach.lineageContext}
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <InfoBlock icon={Layers3} title="Chart conventions" color={approach.color} items={approach.chartConventions} />
        <InfoBlock icon={Crosshair} title="Primary lens" color={approach.color} items={[approach.primaryLens]} />
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        {approach.predictiveJudgments.map((item) => (
          <div key={item.area} className="rounded-md p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <p className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: approach.color }}>
              {item.area}
            </p>
            <p className="mt-2 text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
              {item.judgment}
            </p>
          </div>
        ))}
      </div>
      <InfoBlock icon={Gem} title="Remedial default" color={approach.color} items={[approach.remedialDefaults]} />
    </div>
  );
}

function InfoBlock({
  icon: Icon,
  title,
  items,
  color,
}: {
  icon: typeof Layers3;
  title: string;
  items: string[];
  color: string;
}) {
  return (
    <div className="rounded-md p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div className="mb-2 flex items-center gap-2">
        <Icon size={16} style={{ color }} />
        <p className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: INK_MUTED }}>
          {title}
        </p>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <p key={item} className="text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

function MatrixPanel({
  title,
  rows,
  dimensionKey = "theme",
}: {
  title: string;
  rows: Array<Record<string, string>>;
  dimensionKey?: "theme" | "dimension";
}) {
  return (
    <div className="mt-4">
      <h3 className="text-[24px] font-semibold leading-tight" style={{ color: GOLD }}>
        {title}
      </h3>
      <div className="mt-3 grid gap-3 xl:grid-cols-2">
        {rows.map((row) => (
          <div key={row[dimensionKey]} className="rounded-md p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <p className="mb-3 text-sm font-bold" style={{ color: INK_PRIMARY }}>
              {row[dimensionKey]}
            </p>
            <div className="grid gap-2 md:grid-cols-3">
              {[
                ["KP", row.kp],
                ["BVB", row.bvb],
                ["Western", row.western],
              ].map(([label, text]) => (
                <div key={label} className="rounded-md px-3 py-2" style={{ background: "rgba(156,122,47,0.08)" }}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: INK_MUTED }}>
                    {label}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SynthesisPanel({ approach }: { approach: LineageApproach }) {
  return (
    <div className="mt-4 space-y-3">
      <h3 className="text-[24px] font-semibold leading-tight" style={{ color: approach.color }}>
        Synthesis without collapse
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: INK_SECONDARY }}>
        The capstone discipline is not to flatten KP, BVB, and Western-Vedic-fusion into one generic reading. It is to
        keep each lineage&apos;s method visible, compare what repeats, and name what only one lineage can contribute.
      </p>
      <div className="grid gap-3 xl:grid-cols-3">
        {UNIQUE_CONTRIBUTIONS.map((item) => (
          <div key={item.lineage} className="rounded-md p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-1 flex items-center gap-2">
              <BookOpen size={15} style={{ color: approach.color }} />
              <p className="text-sm font-bold" style={{ color: INK_PRIMARY }}>
                {item.lineage}
              </p>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
              {item.contribution}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
