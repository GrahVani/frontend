"use client";

import React, { useState, useMemo } from "react";

const GOLD = "#9C7A2F";
const SAFFRON = "#C28220";
const VERMILION = "#C8412E";
const JADE = "#3A8C5A";
const SLATE = "#5A5A7A";

interface PancangaResult {
  tithi: string;
  tithiNumber: number;
  paksha: string;
  vara: string;
  nakshatra: string;
  yoga: string;
  karana: string;
}

const TITHIS = [
  "Pratipadā", "Dvitīyā", "Tṛtīyā", "Caturthī", "Pañcamī", "Ṣaṣṭhī", "Saptamī",
  "Aṣṭamī", "Navamī", "Daśamī", "Ekādaśī", "Dvādaśī", "Trayodaśī", "Caturdaśī", "Pūrṇimā/Amāvāsyā"
];

const NAKSHATRAS = [
  "Aśvinī", "Bharaṇī", "Kṛttikā", "Rohiṇī", "Mṛgaśīrṣa", "Ārdrā", "Punarvasū",
  "Puṣya", "Āśleṣā", "Maghā", "Pūrvaphālgunī", "Uttaraphālgunī", "Hasta", "Citrā",
  "Svātī", "Viśākhā", "Anurādhā", "Jyeṣṭhā", "Mūla", "Pūrvāṣāḍhā", "Uttarāṣāḍhā",
  "Śravaṇa", "Dhaniṣṭhā", "Śatabhiṣaj", "Pūrvabhādrapadā", "Uttarabhādrapadā", "Revatī"
];

const YOGAS = [
  "Viṣkambha", "Prīti", "Āyuṣmān", "Saubhāgya", "Śobhana", "Atigaṇḍa", "Sukarman",
  "Dhṛti", "Śūla", "Gaṇḍa", "Vṛddhi", "Dhruva", "Vyāghāta", "Harṣaṇa", "Vajra",
  "Siddhi", "Vyatīpāta", "Varīyas", "Parigha", "Śiva", "Siddha", "Sādhya", "Śubha",
  "Śukla", "Brahma", "Indra", "Vaidhṛti"
];

const KARANAS = [
  "Bava", "Bālava", "Kaulava", "Taitila", "Gara", "Vaṇija", "Vṛṣṭi",
  "Śakuni", "Catuṣpāda", "Nāga", "Kimstughna"
];

const VARAS = ["Sunday ☉", "Monday ☽", "Tuesday ♂", "Wednesday ☿", "Thursday ♃", "Friday ♀", "Saturday ♄"];

function computePancanga(day: number, month: number, year: number): PancangaResult {
  const date = new Date(year, month - 1, day);
  const dayOfWeek = date.getDay();
  
  // Simplified computation for demonstration
  const dayOfYear = Math.floor((date.getTime() - new Date(year, 0, 0).getTime()) / 86400000);
  const lunarDay = ((dayOfYear * 2) % 30) + 1;
  const paksha = lunarDay <= 15 ? "Śukla" : "Kṛṣṇa";
  const tithiIdx = ((lunarDay - 1) % 15);
  const tithiName = tithiIdx === 14 
    ? (paksha === "Śukla" ? "Pūrṇimā" : "Amāvāsyā")
    : TITHIS[tithiIdx];
  
  const nakshatraIdx = Math.floor((dayOfYear * 27) / 365) % 27;
  const yogaIdx = Math.floor((dayOfYear * 27) / 365) % 27;
  const karanaIdx = Math.floor((dayOfYear * 11) / 365) % 11;
  
  return {
    tithi: tithiName,
    tithiNumber: lunarDay,
    paksha,
    vara: VARAS[dayOfWeek],
    nakshatra: NAKSHATRAS[nakshatraIdx],
    yoga: YOGAS[yogaIdx],
    karana: KARANAS[karanaIdx],
  };
}

export function PancangaBuilder() {
  const [day, setDay] = useState(15);
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(2026);
  const [showDetails, setShowDetails] = useState(false);

  const result = useMemo(() => computePancanga(day, month, year), [day, month, year]);

  const limbColors: Record<string, string> = {
    tithi: VERMILION,
    vara: GOLD,
    nakshatra: SAFFRON,
    yoga: JADE,
    karana: SLATE,
  };

  return (
    <div className="space-y-6">
      {/* Date Input */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium" style={{ color: "var(--gl-ink-secondary)" }}>Day:</label>
          <input type="number" min={1} max={31} value={day} onChange={(e) => setDay(parseInt(e.target.value) || 1)}
            className="w-16 px-2 py-1 rounded text-center" style={{ background: "var(--gl-surface-card)", border: "1px solid var(--gl-gold-hairline)", color: "var(--gl-ink-primary)" }} />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium" style={{ color: "var(--gl-ink-secondary)" }}>Month:</label>
          <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))}
            className="px-2 py-1 rounded" style={{ background: "var(--gl-surface-card)", border: "1px solid var(--gl-gold-hairline)", color: "var(--gl-ink-primary)" }}>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString("en", { month: "long" })}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium" style={{ color: "var(--gl-ink-secondary)" }}>Year:</label>
          <input type="number" min={1900} max={2100} value={year} onChange={(e) => setYear(parseInt(e.target.value) || 2026)}
            className="w-20 px-2 py-1 rounded text-center" style={{ background: "var(--gl-surface-card)", border: "1px solid var(--gl-gold-hairline)", color: "var(--gl-ink-primary)" }} />
        </div>
      </div>

      {/* Pañcāṅga Result Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { key: "tithi", label: "Tithi", value: `${result.tithi} (${result.tithiNumber})`, sub: result.paksha + " Pakṣa" },
          { key: "vara", label: "Vāra", value: result.vara.split(" ")[0], sub: result.vara.split(" ")[1] || "" },
          { key: "nakshatra", label: "Nakṣatra", value: result.nakshatra, sub: "Lunar mansion" },
          { key: "yoga", label: "Yoga", value: result.yoga, sub: "Time-yoga" },
          { key: "karana", label: "Karaṇa", value: result.karana, sub: "Half-tithi" },
        ].map((item) => (
          <div key={item.key} className="rounded-xl p-4 text-center transition-all hover:scale-105"
            style={{ background: `${limbColors[item.key]}10`, border: `2px solid ${limbColors[item.key]}40` }}>
            <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: limbColors[item.key] }}>{item.label}</div>
            <div className="text-lg font-bold" style={{ color: "var(--gl-ink-primary)" }}>{item.value}</div>
            <div className="text-xs mt-1" style={{ color: "var(--gl-ink-muted)" }}>{item.sub}</div>
          </div>
        ))}
      </div>

      {/* Visual Pañcāṅga Diagram */}
      <div className="flex justify-center">
        <svg width="320" height="320" viewBox="0 0 320 320">
          <defs>
            <filter id="pbShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#6B4423" floodOpacity="0.12" />
            </filter>
          </defs>
          
          {/* Outer ring */}
          <circle cx="160" cy="160" r="150" fill="none" stroke={GOLD} strokeWidth="1" opacity="0.3" />
          <circle cx="160" cy="160" r="140" fill="none" stroke={GOLD} strokeWidth="0.5" opacity="0.2" strokeDasharray="4 4" />
          
          {/* 5 limbs as segments */}
          {[
            { label: "Tithi", color: VERMILION, angle: -90 },
            { label: "Vāra", color: GOLD, angle: -18 },
            { label: "Nakṣatra", color: SAFFRON, angle: 54 },
            { label: "Yoga", color: JADE, angle: 126 },
            { label: "Karaṇa", color: SLATE, angle: 198 },
          ].map((limb, i) => {
            const angle = (limb.angle * Math.PI) / 180;
            const x1 = 160 + 110 * Math.cos(angle);
            const y1 = 160 + 110 * Math.sin(angle);
            const x2 = 160 + 135 * Math.cos(angle);
            const y2 = 160 + 135 * Math.sin(angle);
            const tx = 160 + 95 * Math.cos(angle);
            const ty = 160 + 95 * Math.sin(angle);
            return (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={limb.color} strokeWidth="2" />
                <circle cx={x2} cy={y2} r="18" fill={`${limb.color}15`} stroke={limb.color} strokeWidth="1.5" filter="url(#pbShadow)" />
                <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle" fill={limb.color} fontSize="10" fontWeight="600">{limb.label}</text>
              </g>
            );
          })}
          
          {/* Center */}
          <circle cx="160" cy="160" r="55" fill="var(--gl-card-surface-solid, #FFF9F0)" stroke={GOLD} strokeWidth="2" filter="url(#pbShadow)" />
          <text x="160" y="150" textAnchor="middle" fill={GOLD} fontSize="12" fontWeight="700">Pañcāṅga</text>
          <text x="160" y="168" textAnchor="middle" fill="var(--gl-ink-secondary)" fontSize="9">{day}/{month}/{year}</text>
          <text x="160" y="182" textAnchor="middle" fill="var(--gl-ink-muted)" fontSize="8">5 limbs</text>
        </svg>
      </div>

      {/* Detail Toggle */}
      <button onClick={() => setShowDetails(!showDetails)}
        className="w-full py-2 rounded-lg text-sm font-medium transition-all"
        style={{ background: showDetails ? `${GOLD}20` : "transparent", border: `1px solid ${GOLD}60`, color: GOLD }}>
        {showDetails ? "Hide Details" : "Show Full Details"}
      </button>

      {showDetails && (
        <div className="rounded-xl p-5 space-y-3" style={{ background: "var(--gl-surface-card)", border: "1px solid var(--gl-gold-hairline)" }}>
          <h4 className="font-semibold" style={{ color: "var(--gl-ink-primary)" }}>Pañcāṅga Computation Details</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span style={{ color: "var(--gl-ink-muted)" }}>Tithi:</span> <span style={{ color: VERMILION, fontWeight: 600 }}>{result.tithi}</span> ({result.tithiNumber}/30)</div>
            <div><span style={{ color: "var(--gl-ink-muted)" }}>Pakṣa:</span> <span style={{ color: VERMILION, fontWeight: 600 }}>{result.paksha}</span></div>
            <div><span style={{ color: "var(--gl-ink-muted)" }}>Vāra:</span> <span style={{ color: GOLD, fontWeight: 600 }}>{result.vara}</span></div>
            <div><span style={{ color: "var(--gl-ink-muted)" }}>Nakṣatra:</span> <span style={{ color: SAFFRON, fontWeight: 600 }}>{result.nakshatra}</span></div>
            <div><span style={{ color: "var(--gl-ink-muted)" }}>Yoga:</span> <span style={{ color: JADE, fontWeight: 600 }}>{result.yoga}</span></div>
            <div><span style={{ color: "var(--gl-ink-muted)" }}>Karaṇa:</span> <span style={{ color: SLATE, fontWeight: 600 }}>{result.karana}</span></div>
          </div>
          <p className="text-xs italic mt-2" style={{ color: "var(--gl-ink-muted)" }}>
            Note: This is a simplified demonstration. For accurate pañcāṅga computation, 
            precise astronomical calculations (Sūrya Siddhānta ephemeris) are required per Module 02.
          </p>
        </div>
      )}
    </div>
  );
}
