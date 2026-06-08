"use client";

import { useState } from "react";
import { IAST } from "../../chrome/typography";

const GOLD = "#C28220";
const JADE = "#2d7d46";
const VERMILION = "#A23A1E";
const AMBER = "#B8860B";

const KARANAS = [
  "Bava", "Bālava", "Kaulava", "Taitila", "Garaja", "Vaṇija", "Viṣṭi",
  "Śakuni", "Catuṣpāda", "Nāga", "Kintughna",
];

const KARANA_TYPES: Record<string, "cara" | "sthira"> = {
  Bava: "cara", Bālava: "cara", Kaulava: "cara", Taitila: "cara",
  Garaja: "cara", Vaṇija: "cara", Viṣṭi: "cara",
  Śakuni: "sthira", Catuṣpāda: "sthira", Nāga: "sthira", Kintughna: "sthira",
};

const KARANA_META: Record<string, { deity: string; nature: string; natureColor: string }> = {
  Bava: { deity: "Indra", nature: "Auspicious for beginnings", natureColor: JADE },
  Bālava: { deity: "Brahmā", nature: "Auspicious for learning", natureColor: JADE },
  Kaulava: { deity: "Kubera", nature: "Auspicious for commerce", natureColor: JADE },
  Taitila: { deity: "Viṣṇu", nature: "Auspicious for construction", natureColor: JADE },
  Garaja: { deity: "Varuṇa", nature: "Mixed — caution advised", natureColor: AMBER },
  Vaṇija: { deity: "Vāyu", nature: "Auspicious for trade", natureColor: JADE },
  Viṣṭi: { deity: "Indra", nature: "Inauspicious — avoid new acts", natureColor: VERMILION },
  Śakuni: { deity: "Garuḍa", nature: "Inauspicious — avoid new ventures", natureColor: VERMILION },
  Catuṣpāda: { deity: "Vāmadeva", nature: "Inauspicious — avoid journeys", natureColor: VERMILION },
  Nāga: { deity: "Nāgas", nature: "Inauspicious — avoid important acts", natureColor: VERMILION },
  Kintughna: { deity: "Kubera", nature: "Inauspicious — routine only", natureColor: VERMILION },
};

const TITHI_NAMES = [
  "Pratipadā", "Dvitīyā", "Tṛtīyā", "Caturthī", "Pañcamī",
  "Ṣaṣṭhī", "Saptamī", "Aṣṭamī", "Navamī", "Daśamī",
  "Ekādaśī", "Dvādaśī", "Trayodaśī", "Caturdaśī", "Pūrṇimā/Amāvāsyā",
];

const PRESETS = [
  { label: "Full Moon (Pūrṇimā)", sun: { deg: 0, min: 0 }, moon: { deg: 174, min: 0 } },   // elong 174° → tithi 15
  { label: "New Moon (Amāvāsyā)", sun: { deg: 0, min: 0 }, moon: { deg: 354, min: 0 } },    // elong 354° → tithi 30 (Catuṣpāda + Nāga)
  { label: "Quarter (Aṣṭamī)", sun: { deg: 0, min: 0 }, moon: { deg: 90, min: 0 } },        // elong 90° → tithi 8
];

/* ─── Large Tithi-Karana Split SVG ─── */
function TithiSplitSVG({ tithiNum, firstKarana, secondKarana }: { tithiNum: number; firstKarana: string; secondKarana: string }) {
  const W = 600;
  const H = 160;
  const barW = 520;
  const barH = 44;
  const barX = (W - barW) / 2;
  const barY = 46;
  const halfW = barW / 2;

  const firstType = KARANA_TYPES[firstKarana] ?? "cara";
  const secondType = KARANA_TYPES[secondKarana] ?? "cara";
  const firstColor = firstType === "cara" ? JADE : VERMILION;
  const secondColor = secondType === "cara" ? JADE : VERMILION;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: "100%" }}>
      <defs>
        <filter id="tsShadow" x="-5%" y="-10%" width="110%" height="130%"><feDropShadow dx="0" dy={2} stdDeviation={3} floodColor="#6B4423" floodOpacity="0.1" /></filter>
      </defs>

      {/* Tithi label above */}
      <rect x={barX + halfW - 60} y={6} width={120} height={26} rx={12} fill="#FDF6E3" stroke={GOLD} strokeWidth={1.5} />
      <text x={barX + halfW} y={23} textAnchor="middle" fill={GOLD} fontSize={13} fontWeight={800} style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>Tithi #{tithiNum}</text>

      {/* Background bar */}
      <rect x={barX} y={barY} width={barW} height={barH} rx={10} fill="#FFF9F0" stroke={GOLD} strokeWidth={1.5} filter="url(#tsShadow)" />
      {/* Divider */}
      <line x1={barX + halfW} y1={barY} x2={barX + halfW} y2={barY + barH} stroke={GOLD} strokeWidth={2} strokeDasharray="6 4" />

      {/* First half */}
      <rect x={barX + 2} y={barY + 2} width={halfW - 4} height={barH - 4} rx={8} fill={firstColor} opacity={0.12} />
      <text x={barX + halfW / 2} y={barY + barH / 2 + 5} textAnchor="middle" fill={firstColor} fontSize={16} fontWeight={800} fontStyle="italic">{firstKarana}</text>
      <text x={barX + halfW / 2} y={barY + barH + 18} textAnchor="middle" fill={firstColor} fontSize={11} fontWeight={700}>1st half · #{((tithiNum - 1) * 2 + 1)}</text>

      {/* Second half */}
      <rect x={barX + halfW + 2} y={barY + 2} width={halfW - 4} height={barH - 4} rx={8} fill={secondColor} opacity={0.12} />
      <text x={barX + halfW + halfW / 2} y={barY + barH / 2 + 5} textAnchor="middle" fill={secondColor} fontSize={16} fontWeight={800} fontStyle="italic">{secondKarana}</text>
      <text x={barX + halfW + halfW / 2} y={barY + barH + 18} textAnchor="middle" fill={secondColor} fontSize={11} fontWeight={700}>2nd half · #{((tithiNum - 1) * 2 + 2)}</text>

      {/* Degree markers */}
      <text x={barX + 4} y={barY + barH + 34} textAnchor="start" fill="var(--gl-ink-muted)" fontSize={10} fontWeight={600}>0°</text>
      <text x={barX + halfW} y={barY + barH + 34} textAnchor="middle" fill="var(--gl-ink-muted)" fontSize={10} fontWeight={600}>6°</text>
      <text x={barX + barW - 4} y={barY + barH + 34} textAnchor="end" fill="var(--gl-ink-muted)" fontSize={10} fontWeight={600}>12°</text>
    </svg>
  );
}

/* ─── Large 11-Karana Type Bar SVG ─── */
function KaranaBarSVG() {
  const W = 820;
  const H = 100;
  const cara = KARANAS.slice(0, 7);
  const sthira = KARANAS.slice(7);
  const slotW = 64;
  const gap = 6;
  const groupGap = 24;
  const caraW = cara.length * (slotW + gap) - gap;
  const sthiraW = sthira.length * (slotW + gap) - gap;
  const totalW = caraW + groupGap + sthiraW;
  const startX = (W - totalW) / 2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: "100%" }}>
      {/* Cara group label */}
      <text x={startX + caraW / 2} y={18} textAnchor="middle" fill={JADE} fontSize={11} fontWeight={800} style={{ textTransform: "uppercase", letterSpacing: "0.1em" }}>Cara — Moving / Repeating (7)</text>
      {cara.map((k, i) => (
        <g key={k}>
          <rect x={startX + i * (slotW + gap)} y={26} width={slotW} height={48} rx={6} fill="#E8F5EE" stroke="#A8D4B8" strokeWidth={1.5} />
          <text x={startX + i * (slotW + gap) + slotW / 2} y={48} textAnchor="middle" fill={JADE} fontSize={11} fontWeight={700} fontStyle="italic">{k}</text>
          <text x={startX + i * (slotW + gap) + slotW / 2} y={64} textAnchor="middle" fill={JADE} fontSize={8} opacity={0.7}>{KARANA_TYPES[k]}</text>
        </g>
      ))}

      {/* Divider */}
      <line x1={startX + caraW + groupGap / 2} y1={30} x2={startX + caraW + groupGap / 2} y2={78} stroke="var(--gl-gold-hairline)" strokeWidth={1} strokeDasharray="4 3" />

      {/* Sthira group label */}
      <text x={startX + caraW + groupGap + sthiraW / 2} y={18} textAnchor="middle" fill={VERMILION} fontSize={11} fontWeight={800} style={{ textTransform: "uppercase", letterSpacing: "0.1em" }}>Sthira — Fixed (4)</text>
      {sthira.map((k, i) => (
        <g key={k}>
          <rect x={startX + caraW + groupGap + i * (slotW + gap)} y={26} width={slotW} height={48} rx={6} fill="#FDE8E5" stroke="#E8AFA8" strokeWidth={1.5} />
          <text x={startX + caraW + groupGap + i * (slotW + gap) + slotW / 2} y={50} textAnchor="middle" fill={VERMILION} fontSize={10} fontWeight={700} fontStyle="italic">{k}</text>
          <text x={startX + caraW + groupGap + i * (slotW + gap) + slotW / 2} y={64} textAnchor="middle" fill={VERMILION} fontSize={8} opacity={0.7}>{KARANA_TYPES[k]}</text>
        </g>
      ))}
    </svg>
  );
}

export function KaranaCalculator() {
  const [sunDeg, setSunDeg] = useState(0);
  const [sunMin, setSunMin] = useState(0);
  const [moonDeg, setMoonDeg] = useState(0);
  const [moonMin, setMoonMin] = useState(0);
  const [showSteps, setShowSteps] = useState(false);

  const sunLong = sunDeg + sunMin / 60;
  const moonLong = moonDeg + moonMin / 60;
  const elongationRaw = moonLong - sunLong;
  const elongation = elongationRaw < 0 ? elongationRaw + 360 : elongationRaw;
  const tithiNum = Math.floor(elongation / 12) + 1;
  // Pakṣa-aware tithi name (tithi 1–15 = Śukla, 16–30 = Kṛṣṇa).
  const pakshaNum = ((tithiNum - 1) % 15) + 1;
  const paksha = tithiNum <= 15 ? "Śukla" : "Kṛṣṇa";
  const tithiName = pakshaNum === 15 ? (paksha === "Śukla" ? "Pūrṇimā" : "Amāvāsyā") : TITHI_NAMES[pakshaNum - 1];

  const firstKaranaNum = (tithiNum - 1) * 2 + 1;
  const secondKaranaNum = (tithiNum - 1) * 2 + 2;

  // Canonical 60-position placement (lesson §4.5): position 1 = Kintughna (1st
  // half of Śukla Pratipadā); positions 2–57 = the 7 cara repeating 8× (Bava…
  // Viṣṭi); 58 = Śakuni (2nd half of Kṛṣṇa Caturdaśī), 59 = Catuṣpāda + 60 = Nāga
  // (the two halves of Amāvāsyā). 1 + 56 + 3 = 60.
  const getKaranaName = (n: number) => {
    if (n === 1) return "Kintughna";
    if (n === 58) return "Śakuni";
    if (n === 59) return "Catuṣpāda";
    if (n === 60) return "Nāga";
    return KARANAS[(n - 2) % 7];
  };

  const firstKarana = getKaranaName(firstKaranaNum);
  const secondKarana = getKaranaName(secondKaranaNum);
  const firstMeta = KARANA_META[firstKarana] ?? { deity: "", nature: "", natureColor: GOLD };
  const secondMeta = KARANA_META[secondKarana] ?? { deity: "", nature: "", natureColor: GOLD };

  const applyPreset = (idx: number) => {
    const p = PRESETS[idx];
    setSunDeg(p.sun.deg);
    setSunMin(p.sun.min);
    setMoonDeg(p.moon.deg);
    setMoonMin(p.moon.min);
  };

  const steps = [
    { label: "Sun's longitude", value: `${sunLong.toFixed(2)}°`, note: "Input or computed from ephemeris" },
    { label: "Moon's longitude", value: `${moonLong.toFixed(2)}°`, note: "Input or computed from ephemeris" },
    { label: "Sun-Moon elongation", value: `${elongation.toFixed(2)}°`, note: "Moon minus Sun (wrapped to 0–360°)" },
    { label: "Tithi number", value: `${tithiNum}`, note: `floor(${elongation.toFixed(2)} / 12°) + 1 = ${tithiNum}` },
    { label: "First karaṇa #", value: `${firstKaranaNum}`, note: "(tithi − 1) × 2 + 1" },
    { label: "Second karaṇa #", value: `${secondKaranaNum}`, note: "(tithi − 1) × 2 + 2" },
  ];

  return (
    <div className="w-full" style={{ background: "var(--gl-surface-card, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)", borderRadius: "16px", padding: "20px" }} data-interactive="karana-calculator">
      <div className="mb-4">
        <h2 className="text-lg font-semibold" style={{ color: "var(--gl-ink-primary)" }}><IAST>Karaṇa Calculator</IAST></h2>
        <p className="text-sm mt-1" style={{ color: "var(--gl-ink-muted)" }}>Compute karaṇas from Sun and Moon longitudes. Each tithi contains two karaṇas (6° each).</p>
      </div>

      {/* Large 11-Karana bar — full width */}
      <div className="rounded-xl p-4 mb-4" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1.5px solid var(--gl-gold-hairline)" }}>
        <KaranaBarSVG />
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
        <div>
          <label className="text-xs block mb-1" style={{ color: "var(--gl-ink-muted)" }}>Sun degrees</label>
          <input type="number" min={0} max={359} value={sunDeg} onChange={(e) => setSunDeg(Number(e.target.value))} className="w-full px-2.5 py-1.5 rounded-lg text-sm outline-none" style={{ background: "var(--gl-card-surface-solid)", color: "var(--gl-ink-primary)", border: "1px solid var(--gl-gold-hairline)" }} />
        </div>
        <div>
          <label className="text-xs block mb-1" style={{ color: "var(--gl-ink-muted)" }}>Sun minutes</label>
          <input type="number" min={0} max={59} value={sunMin} onChange={(e) => setSunMin(Number(e.target.value))} className="w-full px-2.5 py-1.5 rounded-lg text-sm outline-none" style={{ background: "var(--gl-card-surface-solid)", color: "var(--gl-ink-primary)", border: "1px solid var(--gl-gold-hairline)" }} />
        </div>
        <div>
          <label className="text-xs block mb-1" style={{ color: "var(--gl-ink-muted)" }}>Moon degrees</label>
          <input type="number" min={0} max={359} value={moonDeg} onChange={(e) => setMoonDeg(Number(e.target.value))} className="w-full px-2.5 py-1.5 rounded-lg text-sm outline-none" style={{ background: "var(--gl-card-surface-solid)", color: "var(--gl-ink-primary)", border: "1px solid var(--gl-gold-hairline)" }} />
        </div>
        <div>
          <label className="text-xs block mb-1" style={{ color: "var(--gl-ink-muted)" }}>Moon minutes</label>
          <input type="number" min={0} max={59} value={moonMin} onChange={(e) => setMoonMin(Number(e.target.value))} className="w-full px-2.5 py-1.5 rounded-lg text-sm outline-none" style={{ background: "var(--gl-card-surface-solid)", color: "var(--gl-ink-primary)", border: "1px solid var(--gl-gold-hairline)" }} />
        </div>
      </div>

      {/* Presets + Steps toggle */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {PRESETS.map((p, i) => (
          <button key={i} onClick={() => applyPreset(i)} className="px-3 py-1.5 rounded text-xs font-medium transition-all" style={{ background: "var(--gl-card-surface-solid)", color: "var(--gl-ink-primary)", border: "1px solid var(--gl-gold-hairline)", cursor: "pointer" }}>{p.label}</button>
        ))}
        <button onClick={() => setShowSteps((s) => !s)} className="px-3 py-1.5 rounded text-xs font-medium transition-all ml-auto" style={{ background: showSteps ? "#FDF6E3" : "var(--gl-card-surface-solid)", color: showSteps ? GOLD : "var(--gl-ink-primary)", border: `1px solid ${showSteps ? GOLD : "var(--gl-gold-hairline)"}`, cursor: "pointer" }}>
          {showSteps ? "Hide Steps" : "Show Steps"}
        </button>
      </div>

      {/* Large Tithi-Karana Split SVG — full width */}
      <div className="rounded-xl p-4 mb-4" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1.5px solid var(--gl-gold-hairline)" }}>
        <TithiSplitSVG tithiNum={tithiNum} firstKarana={firstKarana} secondKarana={secondKarana} />
      </div>

      {/* Result Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="rounded-xl p-4 text-center" style={{ background: "#FDF6E3", border: "1px solid #E8D5A3" }}>
          <p className="text-xs mb-1" style={{ color: "var(--gl-ink-muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>Tithi</p>
          <p className="text-lg font-bold" style={{ color: GOLD }}><IAST>{paksha} {tithiName}</IAST></p>
          <p className="text-xs" style={{ color: "var(--gl-ink-muted)" }}>#{tithiNum} of 30</p>
          <p className="text-xs mt-1" style={{ color: "var(--gl-ink-secondary)" }}>Elongation: {elongation.toFixed(2)}°</p>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ background: firstMeta.natureColor === VERMILION ? "#FDE8E5" : "#E8F5EE", border: `1px solid ${firstMeta.natureColor === VERMILION ? "#E8AFA8" : "#A8D4B8"}` }}>
          <p className="text-xs mb-1" style={{ color: "var(--gl-ink-muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>First Karaṇa</p>
          <p className="text-lg font-bold" style={{ color: firstMeta.natureColor }}><IAST>{firstKarana}</IAST></p>
          <p className="text-xs" style={{ color: "var(--gl-ink-muted)" }}>{KARANA_TYPES[firstKarana]} · #{firstKaranaNum}</p>
          <p className="text-xs mt-1" style={{ color: "var(--gl-ink-secondary)" }}>{firstMeta.nature}</p>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ background: secondMeta.natureColor === VERMILION ? "#FDE8E5" : "#E8F5EE", border: `1px solid ${secondMeta.natureColor === VERMILION ? "#E8AFA8" : "#A8D4B8"}` }}>
          <p className="text-xs mb-1" style={{ color: "var(--gl-ink-muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>Second Karaṇa</p>
          <p className="text-lg font-bold" style={{ color: secondMeta.natureColor }}><IAST>{secondKarana}</IAST></p>
          <p className="text-xs" style={{ color: "var(--gl-ink-muted)" }}>{KARANA_TYPES[secondKarana]} · #{secondKaranaNum}</p>
          <p className="text-xs mt-1" style={{ color: "var(--gl-ink-secondary)" }}>{secondMeta.nature}</p>
        </div>
      </div>

      {/* Step Breakdown */}
      {showSteps && (
        <div className="rounded-xl p-4 mb-4" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)" }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: GOLD }}>Step-by-Step Computation</p>
          <div className="space-y-2">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "var(--gl-card-surface-solid)", border: "1px solid var(--gl-gold-hairline)" }}>
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: GOLD, color: "#fff" }}>{i + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium" style={{ color: "var(--gl-ink-secondary)" }}>{step.label}</span>
                    <span className="text-sm font-bold" style={{ color: "var(--gl-ink-primary)" }}>{step.value}</span>
                  </div>
                  <span className="text-xs" style={{ color: "var(--gl-ink-muted)" }}>{step.note}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formula Footer */}
      <div className="p-3 rounded-lg text-sm" style={{ background: "#F0F1F5", color: "var(--gl-ink-secondary)", border: "1px dashed var(--gl-gold-hairline)" }}>
        <strong style={{ color: GOLD }}>Formula:</strong>{" "}
        Each tithi has 2 karaṇas. Karaṇa # = (tithi − 1) × 2 + 1 (first) or + 2 (second).
        Cara karaṇas (Bava–Vaṇija) repeat every 7. Sthira karaṇas (Śakuni–Kintughna) occupy the last 4 positions of the 60-karaṇa cycle.
      </div>
    </div>
  );
}
