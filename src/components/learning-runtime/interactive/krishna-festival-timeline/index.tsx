"use client";

import { useState } from "react";
import { IAST } from "../../chrome/typography";

interface TithiNode {
  pakshaNumber: number;
  name: string;
  devanagari: string;
  deity: string;
  quality: string;
  significance: string;
  festivals: string;
  isFestivalMajor: boolean;
  illuminationPct: number; // 100 = full, 0 = dark
}

const NODES: TithiNode[] = [
  { pakshaNumber: 1,  name: "Pratipadā",   devanagari: "प्रतिपदा",   deity: "Agni",            quality: "Nandā",  significance: "Ancestor worship; Pitṛ Pakṣa opening", festivals: "Pitṛ Pakṣa Pratipadā", illuminationPct: 93, isFestivalMajor: false },
  { pakshaNumber: 2,  name: "Dvitīyā",     devanagari: "द्वितीया",     deity: "Aśvinī Kumāra",   quality: "Bhadrā", significance: "Health-related actions", festivals: "—", illuminationPct: 87, isFestivalMajor: false },
  { pakshaNumber: 3,  name: "Tṛtīyā",      devanagari: "तृतीया",      deity: "Gaurī",           quality: "Jayā",   significance: "Victory-anchored actions; marriage muhūrta", festivals: "—", illuminationPct: 80, isFestivalMajor: false },
  { pakshaNumber: 4,  name: "Caturthī",    devanagari: "चतुर्थी",    deity: "Gaṇeśa",          quality: "Riktā",  significance: "Gaṇeśa worship; obstacle removal", festivals: "Saṅkaṭahara Caturthī", illuminationPct: 73, isFestivalMajor: false },
  { pakshaNumber: 5,  name: "Pañcamī",     devanagari: "पञ्चमी",     deity: "Nāga",            quality: "Pūrṇā",  significance: "Learning & completion; serpent worship", festivals: "—", illuminationPct: 67, isFestivalMajor: false },
  { pakshaNumber: 6,  name: "Ṣaṣṭhī",      devanagari: "षष्ठी",      deity: "Kārtikeya",       quality: "Nandā",  significance: "Skanda-vrata", festivals: "—", illuminationPct: 60, isFestivalMajor: false },
  { pakshaNumber: 7,  name: "Saptamī",     devanagari: "सप्तमी",     deity: "Sūrya",           quality: "Bhadrā", significance: "Sun-related observances", festivals: "—", illuminationPct: 53, isFestivalMajor: false },
  { pakshaNumber: 8,  name: "Aṣṭamī",      devanagari: "अष्टमी",      deity: "Rudra / Śiva",    quality: "Jayā",   significance: "Kṛṣṇa's birth; devotion & celebration", festivals: "Janmāṣṭamī — Kṛṣṇa's birth", illuminationPct: 47, isFestivalMajor: true },
  { pakshaNumber: 9,  name: "Navamī",      devanagari: "नवमी",      deity: "Durgā",           quality: "Riktā",  significance: "Devī worship; inauspicious for ventures", festivals: "Mahānavamī", illuminationPct: 40, isFestivalMajor: false },
  { pakshaNumber: 10, name: "Daśamī",      devanagari: "दशमी",      deity: "Dharma",          quality: "Pūrṇā",  significance: "Completion & dhārmic actions", festivals: "—", illuminationPct: 33, isFestivalMajor: false },
  { pakshaNumber: 11, name: "Ekādaśī",     devanagari: "एकादशी",     deity: "Viṣṇu",           quality: "Nandā",  significance: "Vaiṣṇava fast-day (second monthly)", festivals: "~24 named Ekādaśīs annually", illuminationPct: 27, isFestivalMajor: false },
  { pakshaNumber: 12, name: "Dvādaśī",     devanagari: "द्वादशी",     deity: "Viṣṇu",           quality: "Bhadrā", significance: "Ekādaśī pāraṇa; Viṣṇu observances", festivals: "—", illuminationPct: 20, isFestivalMajor: false },
  { pakshaNumber: 13, name: "Trayodaśī",   devanagari: "त्रयोदशी",   deity: "Kāma / Dharma",   quality: "Jayā",   significance: "Pradoṣa-vrata (Śaiva twilight worship)", festivals: "Pradoṣa (twice monthly)", illuminationPct: 13, isFestivalMajor: false },
  { pakshaNumber: 14, name: "Caturdaśī",   devanagari: "चतुर्दशी",   deity: "Śiva / Kālī",     quality: "Riktā",  significance: "Mahā-Śivarātri; all-night Śiva worship", festivals: "Mahā-Śivarātri — annual great observance", illuminationPct: 7, isFestivalMajor: true },
  { pakshaNumber: 15, name: "Amāvāsyā",    devanagari: "अमावास्या",   deity: "Pitṛ / Kālī / Soma", quality: "Pūrṇā", significance: "New moon; cycle completion; ancestor worship; Lakṣmī Pūjā", festivals: "Diwali; Mahālaya Amāvāsyā; Mauni; Somavatī", illuminationPct: 0, isFestivalMajor: true },
];

const QUALITY_STYLE: Record<string, { color: string; bg: string }> = {
  Nandā:  { color: "#C28220", bg: "rgba(232,158,42,0.10)" },
  Bhadrā: { color: "#4A7C59", bg: "rgba(74,124,89,0.08)" },
  Jayā:   { color: "#7A3E2C", bg: "rgba(162,58,30,0.08)" },
  Riktā:  { color: "#5A5A5A", bg: "rgba(90,90,90,0.08)" },
  Pūrṇā:  { color: "#4F6FA8", bg: "rgba(79,111,168,0.08)" },
};

function getMoonPath(illum: number, cx: number, cy: number, r: number): string {
  const rx = r * Math.abs(2 * illum - 1);
  if (illum >= 0.5) {
    return `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${rx} ${r} 0 0 0 ${cx} ${cy - r} Z`;
  }
  return `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${rx} ${r} 0 0 1 ${cx} ${cy - r} Z`;
}

function MoonPhase({ pct, isSelected, isFestival, onClick }: {
  pct: number;
  isSelected: boolean;
  isFestival: boolean;
  onClick: () => void;
}) {
  const illum = pct / 100;
  const darkColor = "#1a1a2e";
  const lightColor = "#E8DCC8";
  const glowColor = isFestival ? "#E89E2A" : isSelected ? "#9C7A2F" : "transparent";
  const glowWidth = isFestival ? 3 : isSelected ? 2 : 0;
  const pathD = getMoonPath(illum, 50, 50, 45);

  return (
    <button
      onClick={onClick}
      className="transition-transform hover:scale-110"
      style={{
        width: 72,
        height: 72,
        borderRadius: "50%",
        border: `${glowWidth}px solid ${glowColor}`,
        background: darkColor,
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
        boxShadow: isSelected ? `0 0 16px ${glowColor}60` : "none",
        transition: "all 0.25s ease",
      }}
    >
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
        <circle cx={50} cy={50} r={45} fill={darkColor} />
        <path d={pathD} fill={lightColor} />
        {isFestival && (
          <>
            <circle cx={78} cy={22} r={7} fill="#E89E2A" opacity={0.95} />
            <text x={78} y={25} textAnchor="middle" fill="#1a1a2e" fontSize={12} fontWeight={700}>★</text>
          </>
        )}
      </svg>
    </button>
  );
}

function LargeMoonPhase({ pct, isFestival }: { pct: number; isFestival: boolean }) {
  const illum = pct / 100;
  const darkColor = "#1a1a2e";
  const lightColor = "#E8DCC8";
  const pathD = getMoonPath(illum, 100, 100, 90);

  return (
    <div
      style={{
        width: 220,
        height: 220,
        borderRadius: "50%",
        border: `3px solid ${isFestival ? "#E89E2A" : "#9C7A2F"}`,
        background: darkColor,
        overflow: "hidden",
        boxShadow: isFestival
          ? "0 0 30px rgba(232,158,42,0.35), 0 0 60px rgba(232,158,42,0.15)"
          : "0 0 20px rgba(156,122,47,0.25)",
      }}
    >
      <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%" }}>
        <circle cx={100} cy={100} r={90} fill={darkColor} />
        <path d={pathD} fill={lightColor} />
        {isFestival && (
          <>
            <circle cx={170} cy={40} r={14} fill="#E89E2A" opacity={0.95} />
            <text x={170} y={46} textAnchor="middle" fill="#1a1a2e" fontSize={18} fontWeight={700}>★</text>
          </>
        )}
      </svg>
    </div>
  );
}

export function KrishnaFestivalTimeline() {
  const [selected, setSelected] = useState<number>(8); // Default to Aṣṭamī (Janmāṣṭamī)
  const active = NODES.find((n) => n.pakshaNumber === selected) ?? NODES[0];
  const qs = QUALITY_STYLE[active.quality] ?? QUALITY_STYLE.Nandā;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div style={{ textAlign: "center" }}>
        <p className="text-xs uppercase mb-2" style={{ color: "#9C7A2F", letterSpacing: "0.16em", fontWeight: 700 }}>
          B-Explorer · Visual Mode
        </p>
        <h3
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "26px",
            fontWeight: 500,
            color: "var(--gl-gold-accent)",
          }}
        >
          The Moon's Darkening Journey
        </h3>
        <p
          className="text-base italic mt-2 mx-auto"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            color: "var(--gl-ink-secondary)",
            maxWidth: 600,
            lineHeight: 1.5,
          }}
        >
          Kṛṣṇa pakṣa: the waning half. Tap any moon phase to see the tithi, deity, and festival.
          Golden stars mark the three festival-major tithis.
        </p>
      </div>

      {/* Moon phase strip */}
      <div
        className="flex items-center gap-2 overflow-x-auto pb-3 px-2"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#9C7A2F transparent" }}
      >
        {NODES.map((node) => (
          <div key={node.pakshaNumber} className="flex flex-col items-center gap-1 flex-shrink-0">
            <MoonPhase
              pct={node.illuminationPct}
              isSelected={selected === node.pakshaNumber}
              isFestival={node.isFestivalMajor}
              onClick={() => setSelected(node.pakshaNumber)}
            />
            <span
              className="text-xs font-medium"
              style={{
                color: selected === node.pakshaNumber ? "#9C7A2F" : "var(--gl-ink-muted)",
                fontWeight: selected === node.pakshaNumber ? 700 : 400,
              }}
            >
              {node.pakshaNumber}
            </span>
          </div>
        ))}
      </div>

      {/* Detail panel */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5">
        {/* Left — large moon for selected tithi */}
        <div
          className="flex items-center justify-center p-6 rounded-xl"
          style={{
            background: "rgba(26,26,46,0.06)",
            border: "1px solid rgba(156,122,47,0.15)",
          }}
        >
          <LargeMoonPhase pct={active.illuminationPct} isFestival={active.isFestivalMajor} />
        </div>

        {/* Right — text details */}
        <div
          className="p-5 rounded-xl"
          style={{
            background: qs.bg,
            border: `1px solid ${qs.color}40`,
          }}
        >
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-xs font-bold" style={{ color: "var(--gl-ink-muted)", minWidth: 56 }}>
              Kṛṣṇa {active.pakshaNumber}/15
            </span>
            <p
              className="text-2xl"
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontWeight: 600,
                color: "var(--gl-gold-accent)",
              }}
            >
              <IAST>{active.name}</IAST>
            </p>
            {active.isFestivalMajor && (
              <span
                className="px-2 py-0.5 rounded text-xs font-bold"
                style={{ background: "rgba(232,158,42,0.15)", color: "#9C7A2F" }}
              >
                ★ Festival-major
              </span>
            )}
          </div>

          <p
            className="text-lg mb-3"
            style={{ fontFamily: "var(--font-devanagari), serif", color: "#9C7A2F" }}
          >
            {active.devanagari}
          </p>

          <div className="space-y-2 text-sm" style={{ color: "var(--gl-ink-secondary)" }}>
            <p>
              <span style={{ fontWeight: 600, color: "var(--gl-ink-primary)" }}>Deity:</span>{" "}
              {active.deity}
            </p>
            <p>
              <span style={{ fontWeight: 600, color: "var(--gl-ink-primary)" }}>Quality:</span>{" "}
              <span
                className="px-2 py-0.5 rounded text-xs font-medium"
                style={{ background: qs.bg, color: qs.color }}
              >
                {active.quality}
              </span>
            </p>
            <p>
              <span style={{ fontWeight: 600, color: "var(--gl-ink-primary)" }}>Significance:</span>{" "}
              {active.significance}
            </p>
            <p>
              <span style={{ fontWeight: 600, color: "var(--gl-ink-primary)" }}>Festivals:</span>{" "}
              {active.festivals}
            </p>
            <p>
              <span style={{ fontWeight: 600, color: "var(--gl-ink-primary)" }}>Illumination:</span>{" "}
              {active.illuminationPct}% → {active.illuminationPct > 50 ? "Waning gibbous" : active.illuminationPct > 20 ? "Waning crescent" : active.illuminationPct > 0 ? "Thin crescent" : "New moon (conjunction)"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
