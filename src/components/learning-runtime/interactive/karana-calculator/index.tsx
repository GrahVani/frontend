"use client";

import React, { useState } from "react";

const KARANAS = [
  "Bava", "Bālava", "Kaulava", "Taitila", "Gara", "Vaṇija", "Vṛṣṭi",
  "Śakuni", "Catuṣpāda", "Nāga", "Kimstughna",
];

const KARANA_TYPES: Record<string, string> = {
  Bava: "cara", Bālava: "cara", Kaulava: "cara", Taitila: "cara",
  Gara: "cara", Vaṇija: "cara", Vṛṣṭi: "cara",
  Śakuni: "sthira", Catuṣpāda: "sthira", Nāga: "sthira", Kimstughna: "sthira",
};

const TITHI_NAMES = [
  "Pratipadā", "Dvitīyā", "Tṛtīyā", "Caturthī", "Pañcamī",
  "Ṣaṣṭhī", "Saptamī", "Aṣṭamī", "Navamī", "Daśamī",
  "Ekādaśī", "Dvādaśī", "Trayodaśī", "Caturdaśī", "Pūrṇimā/Amāvāsyā",
];

export function KaranaCalculator() {
  const [sunDeg, setSunDeg] = useState(0);
  const [sunMin, setSunMin] = useState(0);
  const [moonDeg, setMoonDeg] = useState(0);
  const [moonMin, setMoonMin] = useState(0);

  const sunLong = sunDeg + sunMin / 60;
  const moonLong = moonDeg + moonMin / 60;
  const elongation = moonLong - sunLong < 0 ? moonLong - sunLong + 360 : moonLong - sunLong;
  const tithiNum = Math.floor(elongation / 12) + 1;
  const tithiIdx = Math.min(Math.max(tithiNum - 1, 0), 14);

  const firstKaranaNum = (tithiNum - 1) * 2 + 1;
  const secondKaranaNum = (tithiNum - 1) * 2 + 2;

  const getKaranaName = (n: number) => {
    if (n === 57) return "Śakuni";
    if (n === 58) return "Catuṣpāda";
    if (n === 59) return "Nāga";
    if (n === 60) return "Kimstughna";
    return KARANAS[(n - 1) % 7];
  };

  const firstKarana = getKaranaName(firstKaranaNum);
  const secondKarana = getKaranaName(secondKaranaNum);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="text-xs block mb-1" style={{ color: "var(--gl-ink-muted)" }}>Sun °</label>
          <input type="number" min={0} max={360} value={sunDeg} onChange={(e) => setSunDeg(Number(e.target.value))}
            className="w-full p-2 rounded text-sm" style={{ background: "var(--gl-surface-card)", color: "var(--gl-ink-primary)", border: "1px solid var(--gl-border-subtle)" }} />
        </div>
        <div>
          <label className="text-xs block mb-1" style={{ color: "var(--gl-ink-muted)" }}>Sun ′</label>
          <input type="number" min={0} max={59} value={sunMin} onChange={(e) => setSunMin(Number(e.target.value))}
            className="w-full p-2 rounded text-sm" style={{ background: "var(--gl-surface-card)", color: "var(--gl-ink-primary)", border: "1px solid var(--gl-border-subtle)" }} />
        </div>
        <div>
          <label className="text-xs block mb-1" style={{ color: "var(--gl-ink-muted)" }}>Moon °</label>
          <input type="number" min={0} max={360} value={moonDeg} onChange={(e) => setMoonDeg(Number(e.target.value))}
            className="w-full p-2 rounded text-sm" style={{ background: "var(--gl-surface-card)", color: "var(--gl-ink-primary)", border: "1px solid var(--gl-border-subtle)" }} />
        </div>
        <div>
          <label className="text-xs block mb-1" style={{ color: "var(--gl-ink-muted)" }}>Moon ′</label>
          <input type="number" min={0} max={59} value={moonMin} onChange={(e) => setMoonMin(Number(e.target.value))}
            className="w-full p-2 rounded text-sm" style={{ background: "var(--gl-surface-card)", color: "var(--gl-ink-primary)", border: "1px solid var(--gl-border-subtle)" }} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg text-center" style={{ background: "var(--gl-surface-card)", border: "1px solid var(--gl-gold-hairline)" }}>
          <div className="text-sm" style={{ color: "var(--gl-ink-muted)" }}>Tithi</div>
          <div className="text-lg font-bold" style={{ color: "var(--gl-gold-accent)" }}>{TITHI_NAMES[tithiIdx]}</div>
          <div className="text-xs" style={{ color: "var(--gl-ink-muted)" }}>#{tithiNum} of 30</div>
        </div>
        <div className="p-4 rounded-lg text-center" style={{ background: "var(--gl-surface-card)", border: "1px solid var(--gl-gold-hairline)" }}>
          <div className="text-sm" style={{ color: "var(--gl-ink-muted)" }}>First Karaṇa</div>
          <div className="text-lg font-bold" style={{ color: KARANA_TYPES[firstKarana] === "cara" ? "#6ab4ff" : "#daa520" }}>{firstKarana}</div>
          <div className="text-xs" style={{ color: "var(--gl-ink-muted)" }}>{KARANA_TYPES[firstKarana]} — #{firstKaranaNum}</div>
        </div>
        <div className="p-4 rounded-lg text-center" style={{ background: "var(--gl-surface-card)", border: "1px solid var(--gl-gold-hairline)" }}>
          <div className="text-sm" style={{ color: "var(--gl-ink-muted)" }}>Second Karaṇa</div>
          <div className="text-lg font-bold" style={{ color: KARANA_TYPES[secondKarana] === "cara" ? "#6ab4ff" : "#daa520" }}>{secondKarana}</div>
          <div className="text-xs" style={{ color: "var(--gl-ink-muted)" }}>{KARANA_TYPES[secondKarana]} — #{secondKaranaNum}</div>
        </div>
      </div>

      <div className="p-3 rounded text-sm" style={{ background: "rgba(0,0,0,0.2)", color: "var(--gl-ink-secondary)" }}>
        <strong>Formula:</strong> Each tithi has 2 karaṇas. Karaṇa # = (tithi − 1) × 2 + 1 (first) or + 2 (second).
        Cara karaṇas (Bava–Vaṇija) repeat every 7. Sthira karaṇas (Śakuni–Kimstughna) occupy the last 4 positions of the 60-karaṇa cycle.
      </div>
    </div>
  );
}
