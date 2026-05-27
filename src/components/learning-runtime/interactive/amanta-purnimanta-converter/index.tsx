"use client";

import { useState, useMemo } from "react";

/* ─── Data ─── */
const MONTHS = [
  "Caitra",
  "Vaiśākha",
  "Jyaiṣṭha",
  "Āṣāḍha",
  "Śrāvaṇa",
  "Bhādrapada",
  "Aśvina",
  "Kārtika",
  "Mārgaśīrṣa",
  "Pauṣa",
  "Māgha",
  "Phālguna",
];

interface FestivalDef {
  name: string;
  amanta: string;
  purnimanta: string;
  paksha: "śukla" | "kṛṣṇa";
  note: string;
}

const FESTIVALS: FestivalDef[] = [
  {
    name: "Mahā-Śivarātri",
    amanta: "Māgha Kṛṣṇa Caturdaśī",
    purnimanta: "Pauṣa Kṛṣṇa Caturdaśī",
    paksha: "kṛṣṇa",
    note: "Kṛṣṇa-pakṣa festival shifts to the previous month in Pūrṇimānta",
  },
  {
    name: "Janmāṣṭamī",
    amanta: "Śrāvaṇa Kṛṣṇa Aṣṭamī",
    purnimanta: "Āṣāḍha Kṛṣṇa Aṣṭamī",
    paksha: "kṛṣṇa",
    note: "Kṛṣṇa-pakṣa festival shifts to the previous month in Pūrṇimānta",
  },
  {
    name: "Diwali / Amāvāsyā",
    amanta: "Kārtika Kṛṣṇa Amāvāsyā",
    purnimanta: "Aśvina Kṛṣṇa Amāvāsyā",
    paksha: "kṛṣṇa",
    note: "New-moon festival shifts to the previous month in Pūrṇimānta",
  },
  {
    name: "Holi / Pūrṇimā",
    amanta: "Phālguna Śukla Pūrṇimā",
    purnimanta: "Phālguna Śukla Pūrṇimā",
    paksha: "śukla",
    note: "Śukla-pakṣa festival keeps the same month name in both conventions",
  },
  {
    name: "Rāma Navamī",
    amanta: "Caitra Śukla Navamī",
    purnimanta: "Caitra Śukla Navamī",
    paksha: "śukla",
    note: "Śukla-pakṣa festival keeps the same month name in both conventions",
  },
  {
    name: "Gaṇeśa Caturthī",
    amanta: "Bhādrapada Śukla Caturthī",
    purnimanta: "Bhādrapada Śukla Caturthī",
    paksha: "śukla",
    note: "Śukla-pakṣa festival keeps the same month name in both conventions",
  },
];

const REGIONS = [
  { name: "Kerala", convention: "Amānta" as const },
  { name: "Tamil Nadu", convention: "Amānta" as const },
  { name: "Karnataka", convention: "Amānta" as const },
  { name: "Andhra Pradesh", convention: "Amānta" as const },
  { name: "Maharashtra", convention: "Amānta" as const },
  { name: "Gujarat", convention: "Amānta" as const },
  { name: "Uttar Pradesh", convention: "Pūrṇimānta" as const },
  { name: "Bihar", convention: "Pūrṇimānta" as const },
  { name: "Rajasthan", convention: "Pūrṇimānta" as const },
  { name: "Punjab", convention: "Pūrṇimānta" as const },
];

/* ─── Helpers ─── */
function getPrevMonth(month: string) {
  const idx = MONTHS.indexOf(month);
  return MONTHS[(idx - 1 + MONTHS.length) % MONTHS.length];
}

function getNextMonth(month: string) {
  const idx = MONTHS.indexOf(month);
  return MONTHS[(idx + 1) % MONTHS.length];
}

/* ─── Palette ─── */
const AMANTA_BG = "rgba(74, 111, 165, 0.10)";
const AMANTA_BORDER = "rgba(74, 111, 165, 0.45)";
const AMANTA_TEXT = "#4A6FA5";

const PURNIMANTA_BG = "rgba(107, 63, 160, 0.10)";
const PURNIMANTA_BORDER = "rgba(107, 63, 160, 0.45)";
const PURNIMANTA_TEXT = "#6B3FA0";

/* ─── Component ─── */
export function AmantaPurnimantaConverter() {
  const [tab, setTab] = useState<"converter" | "festivals" | "regions">("converter");
  const [month, setMonth] = useState("Caitra");
  const [paksha, setPaksha] = useState<"śukla" | "kṛṣṇa">("śukla");
  const [source, setSource] = useState<"Amānta" | "Pūrṇimānta">("Amānta");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const result = useMemo(() => {
    const target = source === "Amānta" ? "Pūrṇimānta" : "Amānta";
    if (paksha === "śukla") {
      return { target, month, paksha, shifted: false };
    }
    if (source === "Amānta") {
      return { target, month: getPrevMonth(month), paksha, shifted: true };
    }
    return { target, month: getNextMonth(month), paksha, shifted: true };
  }, [month, paksha, source]);

  return (
    <div className="space-y-5">
      {/* Tab bar */}
      <div className="flex gap-2 flex-wrap">
        {(["converter", "festivals", "regions"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2 rounded-md text-sm font-medium transition-all"
            style={{
              background: tab === t ? "var(--gl-gold-accent)" : "var(--gl-surface-card)",
              color: tab === t ? "#0a0a0f" : "var(--gl-ink-primary)",
              border: `1px solid ${tab === t ? "var(--gl-gold-accent)" : "var(--gl-border-subtle)"}`,
            }}
          >
            {t === "converter" ? "Pakṣa-Month Converter" : t === "festivals" ? "Festival Cross-Reference" : "Regional Identifier"}
          </button>
        ))}
      </div>

      {/* ── Converter ── */}
      {tab === "converter" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Input card */}
          <div
            className="rounded-xl p-5 space-y-4"
            style={{
              background: "var(--gl-surface-card)",
              border: "1px solid var(--gl-border-subtle)",
            }}
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--gl-gold-accent)" }}>
              Input
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: "var(--gl-ink-muted)" }}>
                  Lunar Month
                </label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full rounded-md px-3 py-2 text-sm outline-none"
                  style={{
                    background: "rgba(0,0,0,0.15)",
                    border: "1px solid var(--gl-border-subtle)",
                    color: "var(--gl-ink-primary)",
                  }}
                >
                  {MONTHS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: "var(--gl-ink-muted)" }}>
                  Pakṣa
                </label>
                <div className="flex gap-2">
                  {(["śukla", "kṛṣṇa"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPaksha(p)}
                      className="flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all"
                      style={{
                        background: paksha === p ? "rgba(201,162,77,0.15)" : "rgba(0,0,0,0.15)",
                        border: `1.5px solid ${paksha === p ? "var(--gl-gold-accent)" : "var(--gl-border-subtle)"}`,
                        color: paksha === p ? "var(--gl-gold-accent)" : "var(--gl-ink-secondary)",
                      }}
                    >
                      {p === "śukla" ? "Śukla (waxing)" : "Kṛṣṇa (waning)"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: "var(--gl-ink-muted)" }}>
                  Source Convention
                </label>
                <div className="flex gap-2">
                  {(["Amānta", "Pūrṇimānta"] as const).map((c) => (
                    <button
                      key={c}
                      onClick={() => setSource(c)}
                      className="flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all"
                      style={{
                        background:
                          source === c
                            ? c === "Amānta"
                              ? AMANTA_BG
                              : PURNIMANTA_BG
                            : "rgba(0,0,0,0.15)",
                        border: `1.5px solid ${source === c ? (c === "Amānta" ? AMANTA_BORDER : PURNIMANTA_BORDER) : "var(--gl-border-subtle)"}`,
                        color: source === c ? (c === "Amānta" ? AMANTA_TEXT : PURNIMANTA_TEXT) : "var(--gl-ink-secondary)",
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Output card */}
          <div
            className="rounded-xl p-5 space-y-4"
            style={{
              background: "var(--gl-surface-card)",
              border: "1px solid var(--gl-border-subtle)",
            }}
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--gl-gold-accent)" }}>
              Equivalent in {result.target}
            </h3>

            <div
              className="rounded-lg p-5 space-y-3 transition-all"
              style={{
                background: result.target === "Amānta" ? AMANTA_BG : PURNIMANTA_BG,
                border: `1.5px solid ${result.target === "Amānta" ? AMANTA_BORDER : PURNIMANTA_BORDER}`,
              }}
            >
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold" style={{ color: result.target === "Amānta" ? AMANTA_TEXT : PURNIMANTA_TEXT }}>
                  {result.month}
                </span>
                <span className="text-sm font-medium" style={{ color: "var(--gl-ink-muted)" }}>
                  {result.paksha} pakṣa
                </span>
              </div>

              {result.shifted ? (
                <p className="text-sm leading-relaxed" style={{ color: "var(--gl-ink-secondary)" }}>
                  The <strong>{source}</strong> month <strong>{month}</strong> in {paksha} pakṣa maps to{" "}
                  <strong>{result.month}</strong> in <strong>{result.target}</strong> because kṛṣṇa pakṣa shifts by one month.
                </p>
              ) : (
                <p className="text-sm leading-relaxed" style={{ color: "var(--gl-ink-secondary)" }}>
                  Śukla pakṣa keeps the same month name in both conventions. No shift is needed.
                </p>
              )}
            </div>

            {/* Rule reminder */}
            <div
              className="rounded-lg p-4 text-xs leading-relaxed"
              style={{
                background: "rgba(0,0,0,0.12)",
                border: "1px solid var(--gl-gold-hairline)",
                color: "var(--gl-ink-muted)",
              }}
            >
              <strong style={{ color: "var(--gl-gold-accent)" }}>Rule of thumb:</strong>{" "}
              Śukla pakṣa = same month name in both conventions. Kṛṣṇa pakṣa = shift by one month:
              Amānta → Pūrṇimānta is the <em>previous</em> month; Pūrṇimānta → Amānta is the <em>next</em> month.
            </div>
          </div>
        </div>
      )}

      {/* ── Festivals ── */}
      {tab === "festivals" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FESTIVALS.map((f) => (
            <div
              key={f.name}
              className="rounded-xl p-5 space-y-3 transition-all hover:scale-[1.01]"
              style={{
                background: "var(--gl-surface-card)",
                border: "1px solid var(--gl-border-subtle)",
              }}
            >
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold" style={{ color: "var(--gl-ink-primary)" }}>
                  {f.name}
                </h4>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: f.paksha === "śukla" ? "rgba(232,158,42,0.12)" : "rgba(212,80,46,0.12)",
                    color: f.paksha === "śukla" ? "#C28220" : "#A23A1E",
                    border: `1px solid ${f.paksha === "śukla" ? "rgba(194,130,32,0.35)" : "rgba(162,58,30,0.35)"}`,
                  }}
                >
                  {f.paksha}
                </span>
              </div>

              <div className="space-y-2">
                <div
                  className="rounded-md p-3"
                  style={{ background: AMANTA_BG, border: `1px solid ${AMANTA_BORDER}` }}
                >
                  <span className="text-xs font-semibold block mb-0.5" style={{ color: AMANTA_TEXT }}>
                    Amānta
                  </span>
                  <span className="text-sm font-medium" style={{ color: "var(--gl-ink-primary)" }}>
                    {f.amanta}
                  </span>
                </div>
                <div
                  className="rounded-md p-3"
                  style={{ background: PURNIMANTA_BG, border: `1px solid ${PURNIMANTA_BORDER}` }}
                >
                  <span className="text-xs font-semibold block mb-0.5" style={{ color: PURNIMANTA_TEXT }}>
                    Pūrṇimānta
                  </span>
                  <span className="text-sm font-medium" style={{ color: "var(--gl-ink-primary)" }}>
                    {f.purnimanta}
                  </span>
                </div>
              </div>

              <p className="text-xs italic leading-relaxed" style={{ color: "var(--gl-ink-muted)" }}>
                {f.note}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ── Regions ── */}
      {tab === "regions" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Amānta regions */}
            <div
              className="rounded-xl p-5 space-y-3"
              style={{ background: AMANTA_BG, border: `1.5px solid ${AMANTA_BORDER}` }}
            >
              <h4 className="text-sm font-bold uppercase tracking-wider" style={{ color: AMANTA_TEXT }}>
                Amānta — South & West
              </h4>
              <div className="flex flex-wrap gap-2">
                {REGIONS.filter((r) => r.convention === "Amānta").map((r) => (
                  <button
                    key={r.name}
                    onClick={() => setSelectedRegion(r.name)}
                    className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                    style={{
                      background: selectedRegion === r.name ? AMANTA_TEXT : "rgba(255,255,255,0.25)",
                      color: selectedRegion === r.name ? "#fff" : AMANTA_TEXT,
                      border: `1px solid ${AMANTA_BORDER}`,
                    }}
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Pūrṇimānta regions */}
            <div
              className="rounded-xl p-5 space-y-3"
              style={{ background: PURNIMANTA_BG, border: `1.5px solid ${PURNIMANTA_BORDER}` }}
            >
              <h4 className="text-sm font-bold uppercase tracking-wider" style={{ color: PURNIMANTA_TEXT }}>
                Pūrṇimānta — North
              </h4>
              <div className="flex flex-wrap gap-2">
                {REGIONS.filter((r) => r.convention === "Pūrṇimānta").map((r) => (
                  <button
                    key={r.name}
                    onClick={() => setSelectedRegion(r.name)}
                    className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                    style={{
                      background: selectedRegion === r.name ? PURNIMANTA_TEXT : "rgba(255,255,255,0.25)",
                      color: selectedRegion === r.name ? "#fff" : PURNIMANTA_TEXT,
                      border: `1px solid ${PURNIMANTA_BORDER}`,
                    }}
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {selectedRegion && (
            <div
              className="rounded-lg p-4 text-sm"
              style={{
                background: "var(--gl-surface-card)",
                border: "1px solid var(--gl-gold-hairline)",
                color: "var(--gl-ink-secondary)",
              }}
            >
              <strong style={{ color: "var(--gl-gold-accent)" }}>{selectedRegion}</strong> follows the{" "}
              <strong>
                {REGIONS.find((r) => r.name === selectedRegion)?.convention}
              </strong>{" "}
              convention.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
