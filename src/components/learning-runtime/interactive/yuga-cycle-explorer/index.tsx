"use client";

import { useState } from "react";
import { ZoomIn, ZoomOut, RotateCcw, Eye, EyeOff } from "lucide-react";

const GOLD = "#C28220";
const VERMILION = "#A23A1E";
const INDIGO = "#4A6FA5";
const KALI_SLATE = "#4A4A5A";
const JADE = "#2F8C5A";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";

const YUGAS = [
  { key: "satya", name: "Satya", color: GOLD, proportion: 4, human: 1728000, divya: 4800 },
  { key: "treta", name: "Tretā", color: VERMILION, proportion: 3, human: 1296000, divya: 3600 },
  { key: "dvapara", name: "Dvāpara", color: INDIGO, proportion: 2, human: 864000, divya: 2400 },
  { key: "kali", name: "Kali", color: KALI_SLATE, proportion: 1, human: 432000, divya: 1200 },
];

const TOTAL_PROP = 10;
const MAHAYUGA_HUMAN = 4320000;
const MAHAYUGA_DIVYA = 12000;
const MANV_HUMAN_CORE = 306720000; // 71 * 4,320,000
const MANV_SANDHI_HUMAN = 1728000; // 1 Kṛta-yuga
const MANV_TOTAL_HUMAN = 308448000;
const KALPA_HUMAN = 4320000000; // 1,000 * 4,320,000

const MANUS = [
  { n: 1, name: "Svāyambhuva", dev: "स्वायम्भुव", past: true },
  { n: 2, name: "Svārociṣa", dev: "स्वारोचिष", past: true },
  { n: 3, name: "Auttami", dev: "औत्तमि", past: true },
  { n: 4, name: "Tāmasa", dev: "तामस", past: true },
  { n: 5, name: "Raivata", dev: "रैवत", past: true },
  { n: 6, name: "Cākṣuṣa", dev: "चाक्षुष", past: true },
  { n: 7, name: "Vaivasvata", dev: "वैवस्वत", current: true },
  { n: 8, name: "Sāvarṇi", dev: "सावर्णि", future: true },
  { n: 9, name: "Dakṣasāvarṇi", dev: "दक्षसावर्णि", future: true },
  { n: 10, name: "Brahmasāvarṇi", dev: "ब्रह्मसावर्णि", future: true },
  { n: 11, name: "Dharmasāvarṇi", dev: "धर्मसावर्णि", future: true },
  { n: 12, name: "Rudrasāvarṇi", dev: "रुद्रसावर्णि", future: true },
  { n: 13, name: "Raucya / Devasāvarṇi", dev: "रौच्य", future: true },
  { n: 14, name: "Bhautya / Indrasāvarṇi", dev: "भौत्य", future: true },
];

function fmt(n: number): string {
  if (n >= 1_000_000_000_000) return `${(n / 1_000_000_000_000).toFixed(2)} trillion`;
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)} billion`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)} million`;
  return n.toLocaleString();
}

function fmtDivya(n: number): string {
  return n.toLocaleString();
}

/* ─── Mahā-Yuga zoom ─── */
function MahayugaZoom({ accounting }: { accounting: "human" | "divya" }) {
  return (
    <div className="space-y-2">
      {YUGAS.map((y) => {
        const pct = (y.proportion / TOTAL_PROP) * 100;
        const label = accounting === "human" ? fmt(y.human) : fmtDivya(y.divya);
        return (
          <div key={y.key}>
            <div className="flex items-center justify-between text-xs mb-0.5" style={{ color: INK_SECONDARY }}>
              <span className="font-semibold">{y.name}</span>
              <span>{label} {accounting === "human" ? "years" : "divya-varṣa"}</span>
            </div>
            <div
              className="h-6 rounded flex items-center px-2"
              style={{ width: `${pct}%`, minWidth: 60, backgroundColor: y.color }}
            >
              <span className="text-xs text-white font-semibold">{y.proportion}</span>
            </div>
          </div>
        );
      })}
      <div className="text-center text-xs pt-1" style={{ color: INK_MUTED }}>
        Total: {accounting === "human" ? fmt(MAHAYUGA_HUMAN) : fmtDivya(MAHAYUGA_DIVYA)}{" "}
        {accounting === "human" ? "human years" : "divya-varṣa"}
      </div>
    </div>
  );
}

/* ─── Manvantara zoom ─── */
function ManvantaraZoom({ accounting }: { accounting: "human" | "divya" }) {
  const blocks = Array.from({ length: 71 }, (_, i) => i);
  const sandhiLabel = accounting === "human" ? fmt(MANV_SANDHI_HUMAN) : fmtDivya(4800);
  const totalLabel = accounting === "human" ? fmt(MANV_TOTAL_HUMAN) : fmtDivya(852000);

  return (
    <div className="space-y-3">
      {/* Leading saṁdhi */}
      <div>
        <div className="text-xs mb-1" style={{ color: INK_SECONDARY }}>
          Leading saṁdhi (1 Kṛta-yuga) — {sandhiLabel} {accounting === "human" ? "years" : "divya-varṣa"}
        </div>
        <div className="h-4 rounded" style={{ width: "1.4%", minWidth: 20, backgroundColor: `${GOLD}60` }} />
      </div>

      {/* 71 Mahā-Yugas grid */}
      <div>
        <div className="text-xs mb-1 flex items-center justify-between" style={{ color: INK_SECONDARY }}>
          <span>71 Mahā-Yugas</span>
          <span className="text-xs" style={{ color: INK_MUTED }}>
            Present epoch marked ★
          </span>
        </div>
        <div className="flex flex-wrap gap-0.5">
          {blocks.map((i) => {
            const isCurrent = i === 28; // approximate position within Manvantara
            return (
              <div
                key={i}
                className="relative"
                style={{ width: 10, height: 10 }}
              >
                <div
                  className="w-full h-full rounded-sm"
                  style={{ backgroundColor: isCurrent ? VERMILION : `${INDIGO}50` }}
                />
                {isCurrent && (
                  <div
                    className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white flex items-center justify-center"
                    style={{ boxShadow: `0 0 0 2px ${VERMILION}` }}
                  >
                    <span className="text-[6px] font-bold" style={{ color: VERMILION }}>★</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center text-xs" style={{ color: INK_MUTED }}>
        One Manvantara total: {totalLabel} {accounting === "human" ? "human years" : "divya-varṣa"} (~308.4M years)
      </div>
    </div>
  );
}

/* ─── Kalpa zoom ─── */
function KalpaZoom({ accounting }: { accounting: "human" | "divya" }) {
  const manvWidthPct = 100 / 14;
  const totalLabel = accounting === "human" ? fmt(KALPA_HUMAN) : "12,000,000";

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1">
        {MANUS.map((m, i) => {
          const isCurrent = m.current;
          return (
            <div key={m.n} className="flex-1 flex flex-col items-center">
              <div
                className="w-full h-10 rounded-sm flex items-end justify-center pb-1 relative"
                style={{
                  backgroundColor: isCurrent ? `${JADE}25` : i < 6 ? `${INDIGO}20` : `${KALI_SLATE}15`,
                  border: isCurrent ? `2px solid ${JADE}` : `1px solid ${INK_MUTED}30`,
                }}
              >
                {isCurrent && (
                  <div
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: JADE }}
                  >
                    <span className="text-[8px] text-white font-bold">★</span>
                  </div>
                )}
              </div>
              <div className="text-[9px] mt-0.5 text-center leading-tight" style={{ color: isCurrent ? JADE : INK_SECONDARY }}>
                <div className="font-semibold">{m.n}</div>
                <div>{m.name}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Saṁdhi annotations */}
      <div className="flex items-center gap-0.5 text-[9px]" style={{ color: INK_MUTED }}>
        {Array.from({ length: 15 }, (_, i) => (
          <div key={i} className="flex-1 text-center">
            {i === 0 ? "← saṁdhi" : i === 14 ? "saṁdhi →" : i === 7 ? "│" : "·"}
          </div>
        ))}
      </div>

      <div className="text-center text-xs" style={{ color: INK_MUTED }}>
        One Kalpa: {totalLabel} {accounting === "human" ? "human years" : "divya-varṣa"} (~4.32 billion years) = 14 Manvantaras + 15 saṁdhi = 1,000 Mahā-Yugas
      </div>
    </div>
  );
}

/* ─── Benchmark overlay ─── */
function BenchmarkOverlay({ accounting }: { accounting: "human" | "divya" }) {
  const benchmarks = [
    { label: "Earth age", humanVal: 4_500_000_000, color: "#5A8C5A" },
    { label: "Universe age", humanVal: 13_800_000_000, color: "#6B5A8C" },
  ];

  return (
    <div className="space-y-2 mt-3 p-3 rounded-lg" style={{ backgroundColor: "var(--gl-surface-1)" }}>
      <div className="text-xs font-semibold mb-2" style={{ color: INK_SECONDARY }}>
        Modern cosmology benchmarks (human years only)
      </div>
      {benchmarks.map((b) => (
        <div key={b.label} className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: b.color }} />
          <span className="text-xs">{b.label}: ~{fmt(b.humanVal)}</span>
        </div>
      ))}
      <p className="text-xs mt-1" style={{ color: INK_MUTED }}>
        For order-of-magnitude comparison only. The yuga-cycle framework is cosmological-philosophical, not empirical-scientific.
      </p>
    </div>
  );
}

export function YugaCycleExplorer() {
  const [zoom, setZoom] = useState<"mahayuga" | "manvantara" | "kalpa">("mahayuga");
  const [accounting, setAccounting] = useState<"human" | "divya">("human");
  const [showBenchmarks, setShowBenchmarks] = useState(false);

  const zooms = [
    { key: "mahayuga" as const, label: "Mahā-Yuga", duration: "~4.32M years", scale: 1 },
    { key: "manvantara" as const, label: "Manvantara", duration: "~308M years", scale: 71 },
    { key: "kalpa" as const, label: "Kalpa", duration: "~4.32B years", scale: 1000 },
  ];

  const activeZoom = zooms.find((z) => z.key === zoom)!;

  return (
    <div className="w-full" style={{ color: INK_PRIMARY }}>
      {/* Zoom controls */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {zooms.map((z) => {
          const active = zoom === z.key;
          return (
            <button
              key={z.key}
              onClick={() => setZoom(z.key)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors"
              style={{
                backgroundColor: active ? INDIGO : "var(--gl-surface-2)",
                color: active ? "#fff" : INK_SECONDARY,
              }}
            >
              {active ? <ZoomIn size={14} /> : <ZoomOut size={14} />}
              {z.label}
              <span className="text-xs opacity-70">({z.duration})</span>
            </button>
          );
        })}
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-1.5 p-1 rounded-full" style={{ backgroundColor: "var(--gl-surface-2)" }}>
          <button
            onClick={() => setAccounting("human")}
            className="px-3 py-1 rounded-full text-xs font-medium transition-colors"
            style={{
              backgroundColor: accounting === "human" ? INDIGO : "transparent",
              color: accounting === "human" ? "#fff" : INK_SECONDARY,
            }}
          >
            Human years
          </button>
          <button
            onClick={() => setAccounting("divya")}
            className="px-3 py-1 rounded-full text-xs font-medium transition-colors"
            style={{
              backgroundColor: accounting === "divya" ? INDIGO : "transparent",
              color: accounting === "divya" ? "#fff" : INK_SECONDARY,
            }}
          >
            Divya-varṣa
          </button>
        </div>

        <button
          onClick={() => setShowBenchmarks((s) => !s)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
          style={{
            backgroundColor: showBenchmarks ? `${JADE}18` : "var(--gl-surface-2)",
            color: showBenchmarks ? JADE : INK_SECONDARY,
          }}
        >
          {showBenchmarks ? <Eye size={12} /> : <EyeOff size={12} />}
          Cosmology benchmarks
        </button>
      </div>

      {/* Zoom title */}
      <div className="mb-3">
        <div className="text-sm font-semibold">{activeZoom.label}</div>
        <div className="text-xs" style={{ color: INK_SECONDARY }}>
          Scale: 1 {activeZoom.label.toLowerCase()} = {activeZoom.scale === 1 ? "1 unit" : `${activeZoom.scale} Mahā-Yugas`}
        </div>
      </div>

      {/* Zoom visual */}
      <div className="p-4 rounded-lg" style={{ backgroundColor: "var(--gl-surface-1)" }}>
        {zoom === "mahayuga" && <MahayugaZoom accounting={accounting} />}
        {zoom === "manvantara" && <ManvantaraZoom accounting={accounting} />}
        {zoom === "kalpa" && <KalpaZoom accounting={accounting} />}
      </div>

      {/* Benchmarks */}
      {showBenchmarks && accounting === "human" && <BenchmarkOverlay accounting={accounting} />}
      {showBenchmarks && accounting === "divya" && (
        <div className="mt-3 p-3 rounded-lg text-xs" style={{ backgroundColor: "var(--gl-surface-1)", color: INK_MUTED }}>
          <EyeOff size={12} className="inline mr-1" />
          Modern cosmology benchmarks are only meaningful in human-year accounting. Switch to "Human years" to see them.
        </div>
      )}

      {/* Context panel */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        <div className="p-3 rounded-lg" style={{ backgroundColor: "var(--gl-surface-1)" }}>
          <div className="font-semibold mb-1" style={{ color: INK_SECONDARY }}>Current epoch</div>
          <div>Kalpa: Śveta-Vārāha</div>
          <div>Manvantara: Vaivasvata (7th of 14)</div>
          <div>Yuga: Kali (within current Mahā-Yuga)</div>
        </div>
        <div className="p-3 rounded-lg" style={{ backgroundColor: "var(--gl-surface-1)" }}>
          <div className="font-semibold mb-1" style={{ color: INK_SECONDARY }}>Brahmā's life</div>
          <div>Day + Night: ~8.64B years</div>
          <div>Year (360 days): ~3.11T years</div>
          <div>Life (100 years): ~311T years</div>
        </div>
      </div>

      {/* Reset */}
      <div className="mt-3 text-center">
        <button
          onClick={() => { setZoom("mahayuga"); setAccounting("human"); setShowBenchmarks(false); }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
          style={{ backgroundColor: "var(--gl-surface-2)", color: INK_SECONDARY }}
        >
          <RotateCcw size={12} />
          Reset view
        </button>
      </div>
    </div>
  );
}
