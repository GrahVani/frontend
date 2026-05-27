"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { IAST } from "../../chrome/typography";

/* ─── Complete 30-tithi database ─── */
interface TithiData {
  number: number;
  pakshaNumber: number;
  name: string;
  devanagari: string;
  deity: string;
  quality: string;
  qualitySanskrit: string;
  significance: string;
  festivals: string;
  paksha: "śukla" | "kṛṣṇa";
}

const TITHI_DB: TithiData[] = [
  { number: 1,  pakshaNumber: 1,  name: "Pratipadā",   devanagari: "प्रतिपदा",   deity: "Agni / Brahmā",     quality: "Nandā",  qualitySanskrit: "नन्दा", significance: "Year & month opening; Vāstu foundational rites", festivals: "Caitra Pratipadā = Hindu New Year (many regions)", paksha: "śukla" },
  { number: 2,  pakshaNumber: 2,  name: "Dvitīyā",     devanagari: "द्वितीया",     deity: "Brahmā / Vidhātā",  quality: "Bhadrā", qualitySanskrit: "भद्रा", significance: "Auspicious for lasting actions, treaties, commitments", festivals: "Bhrātṛ-Dvitīyā / Bhai Dooj (Kārtika)", paksha: "śukla" },
  { number: 3,  pakshaNumber: 3,  name: "Tṛtīyā",      devanagari: "तृतीया",      deity: "Gaurī / Pārvatī",   quality: "Jayā",   qualitySanskrit: "जया",  significance: "Marriage muhūrta; victory-anchored actions", festivals: "Akṣaya Tṛtīyā (Vaiśākha) = gold purchase, marriage", paksha: "śukla" },
  { number: 4,  pakshaNumber: 4,  name: "Caturthī",    devanagari: "चतुर्थी",    deity: "Gaṇeśa",            quality: "Riktā",  qualitySanskrit: "रिक्ता", significance: "Inauspicious for new ventures; Gaṇeśa's day", festivals: "Vināyaka Caturthī (monthly); Saṅkaṭahara Caturthī", paksha: "śukla" },
  { number: 5,  pakshaNumber: 5,  name: "Pañcamī",     devanagari: "पञ्चमी",     deity: "Nāga / Sarasvatī",  quality: "Pūrṇā",  qualitySanskrit: "पूर्णा", significance: "Learning & completion; scholarly endeavours", festivals: "Vasanta Pañcamī (Māgha); Nāga Pañcamī (Śrāvaṇa)", paksha: "śukla" },
  { number: 6,  pakshaNumber: 6,  name: "Ṣaṣṭhī",      devanagari: "षष्ठी",      deity: "Skanda / Kārttikeya", quality: "Nandā", qualitySanskrit: "नन्दा", significance: "Skanda-vrata; commander of deva armies", festivals: "Skanda Ṣaṣṭhī (Kārtika)", paksha: "śukla" },
  { number: 7,  pakshaNumber: 7,  name: "Saptamī",     devanagari: "सप्तमी",     deity: "Sūrya",             quality: "Bhadrā", qualitySanskrit: "भद्रा", significance: "Sun-related observances", festivals: "Ratha Saptamī (Māgha)", paksha: "śukla" },
  { number: 8,  pakshaNumber: 8,  name: "Aṣṭamī",      devanagari: "अष्टमी",      deity: "Rudra / Śiva + Devī", quality: "Jayā", qualitySanskrit: "जया",  significance: "Devī observances; warrior-vrata", festivals: "Durgā Aṣṭamī (Āśvina = Navarātri 8th)", paksha: "śukla" },
  { number: 9,  pakshaNumber: 9,  name: "Navamī",      devanagari: "नवमी",      deity: "Durgā / Ambikā",    quality: "Riktā",  qualitySanskrit: "रिक्ता", significance: "Devī worship; inauspicious for ventures", festivals: "Rāma Navamī (Caitra); Mahā-Navamī (Āśvina)", paksha: "śukla" },
  { number: 10, pakshaNumber: 10, name: "Daśamī",      devanagari: "दशमी",      deity: "Yama / Dharma",     quality: "Pūrṇā",  qualitySanskrit: "पूर्णा", significance: "Dhārmic actions; completion", festivals: "Vijaya Daśamī / Dussehra (Āśvina)", paksha: "śukla" },
  { number: 11, pakshaNumber: 11, name: "Ekādaśī",     devanagari: "एकादशी",     deity: "Viṣṇu / Viśvedevā", quality: "Nandā",  qualitySanskrit: "नन्दा", significance: "Vaiṣṇava fast-day; bi-monthly observance", festivals: "~24 named Ekādaśīs annually", paksha: "śukla" },
  { number: 12, pakshaNumber: 12, name: "Dvādaśī",     devanagari: "द्वादशी",     deity: "Viṣṇu / Hari",      quality: "Bhadrā", qualitySanskrit: "भद्रा", significance: "Ekādaśī pāraṇa (breaking fast)", festivals: "Ekādaśī pāraṇa day; Vāmana Dvādaśī", paksha: "śukla" },
  { number: 13, pakshaNumber: 13, name: "Trayodaśī",   devanagari: "त्रयोदशी",   deity: "Kāmadeva / Dharma", quality: "Jayā",   qualitySanskrit: "जया",  significance: "Pradoṣa-vrata (Śaiva twilight worship)", festivals: "Pradoṣa (twice monthly); Anaṅga Trayodaśī", paksha: "śukla" },
  { number: 14, pakshaNumber: 14, name: "Caturdaśī",   devanagari: "चतुर्दशी",   deity: "Śiva / Rudra",      quality: "Riktā",  qualitySanskrit: "रिक्ता", significance: "Śaiva observances; inauspicious for ventures", festivals: "Anaṅga Caturdaśī; Naraka Caturdaśī (Dīpāvalī eve)", paksha: "śukla" },
  { number: 15, pakshaNumber: 15, name: "Pūrṇimā",     devanagari: "पूर्णिमा",     deity: "Soma / Candra",     quality: "Pūrṇā",  qualitySanskrit: "पूर्णा", significance: "Full moon; most-festival-anchoring tithi", festivals: "Guru Pūrṇimā (Āṣāḍha); Buddha Pūrṇimā (Vaiśākha); Sharad Pūrṇimā (Āśvina)", paksha: "śukla" },
  { number: 16, pakshaNumber: 1,  name: "Pratipadā",   devanagari: "प्रतिपदा",   deity: "Agni",              quality: "Nandā",  qualitySanskrit: "नन्दा", significance: "Ancestor worship; Pitṛ Pakṣa opening", festivals: "Pitṛ Pakṣa Pratipadā", paksha: "kṛṣṇa" },
  { number: 17, pakshaNumber: 2,  name: "Dvitīyā",     devanagari: "द्वितीया",     deity: "Aśvinī Kumāra",     quality: "Bhadrā", qualitySanskrit: "भद्रा", significance: "Health-related actions", festivals: "Bhrātṛ-Dvitīyā / Bhai Dooj (Kārtika)", paksha: "kṛṣṇa" },
  { number: 18, pakshaNumber: 3,  name: "Tṛtīyā",      devanagari: "तृतीया",      deity: "Gaurī",             quality: "Jayā",   qualitySanskrit: "जया",  significance: "Victory-anchored actions; marriage muhūrta", festivals: "—", paksha: "kṛṣṇa" },
  { number: 19, pakshaNumber: 4,  name: "Caturthī",    devanagari: "चतुर्थी",    deity: "Gaṇeśa",            quality: "Riktā",  qualitySanskrit: "रिक्ता", significance: "Gaṇeśa worship; inauspicious for ventures", festivals: "Saṅkaṭahara Caturthī (kṛṣṇa)", paksha: "kṛṣṇa" },
  { number: 20, pakshaNumber: 5,  name: "Pañcamī",     devanagari: "पञ्चमी",     deity: "Nāga",              quality: "Pūrṇā",  qualitySanskrit: "पूर्णा", significance: "Learning & completion; serpent worship", festivals: "—", paksha: "kṛṣṇa" },
  { number: 21, pakshaNumber: 6,  name: "Ṣaṣṭhī",      devanagari: "षष्ठी",      deity: "Kārtikeya",         quality: "Nandā",  qualitySanskrit: "नन्दा", significance: "Skanda-vrata", festivals: "—", paksha: "kṛṣṇa" },
  { number: 22, pakshaNumber: 7,  name: "Saptamī",     devanagari: "सप्तमी",     deity: "Sūrya",             quality: "Bhadrā", qualitySanskrit: "भद्रा", significance: "Sun-related observances", festivals: "—", paksha: "kṛṣṇa" },
  { number: 23, pakshaNumber: 8,  name: "Aṣṭamī",      devanagari: "अष्टमी",      deity: "Rudra / Śiva",      quality: "Jayā",   qualitySanskrit: "जया",  significance: "Devī observances; warrior-vrata", festivals: "Janmāṣṭamī (Bhādrapada) = Kṛṣṇa's birth", paksha: "kṛṣṇa" },
  { number: 24, pakshaNumber: 9,  name: "Navamī",      devanagari: "नवमी",      deity: "Durgā",             quality: "Riktā",  qualitySanskrit: "रिक्ता", significance: "Devī worship; inauspicious for ventures", festivals: "Mahānavamī (Āśvina = Navarātri 9th)", paksha: "kṛṣṇa" },
  { number: 25, pakshaNumber: 10, name: "Daśamī",      devanagari: "दशमी",      deity: "Dharma",            quality: "Pūrṇā",  qualitySanskrit: "पूर्णा", significance: "Completion & dhārmic actions", festivals: "—", paksha: "kṛṣṇa" },
  { number: 26, pakshaNumber: 11, name: "Ekādaśī",     devanagari: "एकादशी",     deity: "Viṣṇu",             quality: "Nandā",  qualitySanskrit: "नन्दा", significance: "Vaiṣṇava fast-day (second monthly)", festivals: "~24 named Ekādaśīs annually", paksha: "kṛṣṇa" },
  { number: 27, pakshaNumber: 12, name: "Dvādaśī",     devanagari: "द्वादशी",     deity: "Viṣṇu",             quality: "Bhadrā", qualitySanskrit: "भद्रा", significance: "Ekādaśī pāraṇa; Viṣṇu observances", festivals: "—", paksha: "kṛṣṇa" },
  { number: 28, pakshaNumber: 13, name: "Trayodaśī",   devanagari: "त्रयोदशी",   deity: "Kāma / Dharma",     quality: "Jayā",   qualitySanskrit: "जया",  significance: "Pradoṣa-vrata (Śaiva twilight worship)", festivals: "Pradoṣa (twice monthly)", paksha: "kṛṣṇa" },
  { number: 29, pakshaNumber: 14, name: "Caturdaśī",   devanagari: "चतुर्दशी",   deity: "Śiva / Kālī / Bhairavī", quality: "Riktā", qualitySanskrit: "रिक्ता", significance: "Śaiva observances; Mahā-Śivarātri", festivals: "Mahā-Śivarātri (Phālguna)", paksha: "kṛṣṇa" },
  { number: 30, pakshaNumber: 15, name: "Amāvāsyā",    devanagari: "अमावास्या",   deity: "Pitṛ / Candra",     quality: "Pūrṇā",  qualitySanskrit: "पूर्णा", significance: "New moon; ancestor worship", festivals: "Mahālaya Amāvāsyā (Pitṛ Pakṣa); Diwali Amāvāsyā (Kārtika)", paksha: "kṛṣṇa" },
];

const QUALITY_META: Record<string, { color: string; bg: string; meaning: string; dotColor: string }> = {
  Nandā:  { color: "#C28220", bg: "rgba(232,158,42,0.12)", meaning: "joyful / delightful", dotColor: "#E89E2A" },
  Bhadrā: { color: "#4A7C59", bg: "rgba(74,124,89,0.10)",  meaning: "gentle / auspicious", dotColor: "#5A9E6A" },
  Jayā:   { color: "#7A3E2C", bg: "rgba(162,58,30,0.10)",  meaning: "victorious", dotColor: "#B85C00" },
  Riktā:  { color: "#5A5A5A", bg: "rgba(90,90,90,0.10)",   meaning: "empty / inauspicious for new beginnings", dotColor: "#888888" },
  Pūrṇā:  { color: "#4F6FA8", bg: "rgba(79,111,168,0.10)", meaning: "full / complete", dotColor: "#6B8FC8" },
};

const FESTIVAL_MAJOR = new Set([1, 3, 9, 10, 15, 23, 26, 29, 30]);

/* ─── Helpers ─── */
function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/* ─── Wheel Diagram — hero visual, large & readable ─── */
function WheelDiagram({
  activeFilter,
  selectedTithi,
  onSelect,
}: {
  activeFilter: string;
  selectedTithi: number | null;
  onSelect: (n: number) => void;
}) {
  const CX = 400;
  const CY = 400;
  const R_INNER = 90;
  const R_OUTER = 310;
  const R_LABEL = (R_INNER + R_OUTER) / 2 - 20;
  const R_NAME = (R_INNER + R_OUTER) / 2 + 38;
  const R_DOT = R_OUTER + 22;

  const [hovered, setHovered] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const getOpacity = (t: TithiData) => {
    if (activeFilter === "all") return 1;
    if (activeFilter === "festival") return FESTIVAL_MAJOR.has(t.number) ? 1 : 0.18;
    return t.quality === activeFilter ? 1 : 0.18;
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scale = 800 / rect.width;
    const mx = (e.clientX - rect.left) * scale;
    const my = (e.clientY - rect.top) * scale;

    const dx = mx - CX;
    const dy = my - CY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < R_INNER - 10 || dist > R_OUTER + 30) {
      setHovered(null);
      setTooltipPos(null);
      return;
    }
    let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;
    const seg = Math.floor(angle / 12);
    setHovered(seg);
    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseLeave = () => {
    setHovered(null);
    setTooltipPos(null);
  };

  const hoveredTithi = hovered !== null ? TITHI_DB[hovered] : null;
  const selTithi = selectedTithi !== null ? TITHI_DB.find(t => t.number === selectedTithi) : null;

  return (
    <div style={{ position: "relative" }}>
      <svg
        ref={svgRef}
        viewBox="0 0 800 800"
        className="w-full h-auto"
        style={{ display: "block", margin: "0 auto" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <defs>
          <filter id="wheelShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#6B4423" floodOpacity="0.18" />
          </filter>
          <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="selectedGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Śukla background tint */}
          <radialGradient id="shuklaGlow" cx="50%" cy="25%" r="55%">
            <stop offset="0%" stopColor="#F5C842" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#F5C842" stopOpacity="0" />
          </radialGradient>
          {/* Kṛṣṇa background tint */}
          <radialGradient id="krishnaGlow" cx="50%" cy="75%" r="55%">
            <stop offset="0%" stopColor="#8B4513" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#8B4513" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background glows */}
        <rect x="0" y="0" width="800" height="400" fill="url(#shuklaGlow)" />
        <rect x="0" y="400" width="800" height="400" fill="url(#krishnaGlow)" />

        {/* Outer decorative rings */}
        <circle cx={CX} cy={CY} r={R_OUTER + 38} fill="none" stroke="#E8DCC8" strokeWidth={0.8} opacity={0.25} />
        <circle cx={CX} cy={CY} r={R_OUTER + 30} fill="none" stroke="#E8DCC8" strokeWidth={0.4} opacity={0.18} strokeDasharray="5 5" />

        {/* Pakṣa divider line — prominent */}
        <line x1={CX - R_OUTER - 35} y1={CY} x2={CX + R_OUTER + 35} y2={CY}
          stroke="rgba(156,122,47,0.28)" strokeWidth={1.5} strokeDasharray="8 5" />

        {/* Pakṣa labels — larger and bolder */}
        <text x={CX} y={CY - R_OUTER - 32} textAnchor="middle" fill="#9C7A2F" fontSize={15}
          fontWeight={800} letterSpacing={0.2}
          style={{ fontFamily: "var(--font-sans), sans-serif", textTransform: "uppercase" }}>
          Śukla Pakṣa · Tithis 1–15
        </text>
        <text x={CX} y={CY + R_OUTER + 46} textAnchor="middle" fill="#A23A1E" fontSize={15}
          fontWeight={800} letterSpacing={0.2}
          style={{ fontFamily: "var(--font-sans), sans-serif", textTransform: "uppercase" }}>
          Kṛṣṇa Pakṣa · Tithis 16–30
        </text>

        {/* 30 segments */}
        {TITHI_DB.map((t) => {
          const startAngle = (t.number - 1) * 12;
          const endAngle = t.number * 12;
          const p1 = polar(CX, CY, R_OUTER, startAngle);
          const p2 = polar(CX, CY, R_OUTER, endAngle);
          const pi1 = polar(CX, CY, R_INNER, startAngle);
          const pi2 = polar(CX, CY, R_INNER, endAngle);
          const isSelected = selectedTithi === t.number;
          const isHovered = hovered === t.number - 1;
          const opacity = getOpacity(t);
          const qm = QUALITY_META[t.quality];

          const midAngle = (startAngle + endAngle) / 2;
          const labelP = polar(CX, CY, R_LABEL, midAngle);
          const nameP = polar(CX, CY, R_NAME, midAngle);

          return (
            <g
              key={t.number}
              style={{ cursor: "pointer", opacity, transition: "opacity 0.25s ease" }}
              onClick={() => onSelect(t.number)}
            >
              {/* Invisible hit area */}
              <path
                d={`M ${pi1.x} ${pi1.y} L ${p1.x} ${p1.y} A ${R_OUTER} ${R_OUTER} 0 0 1 ${p2.x} ${p2.y} L ${pi2.x} ${pi2.y} A ${R_INNER} ${R_INNER} 0 0 0 ${pi1.x} ${pi1.y} Z`}
                fill="transparent"
                stroke="none"
                style={{ pointerEvents: "all" }}
              />
              {/* Visible segment */}
              <path
                d={`M ${pi1.x} ${pi1.y} L ${p1.x} ${p1.y} A ${R_OUTER} ${R_OUTER} 0 0 1 ${p2.x} ${p2.y} L ${pi2.x} ${pi2.y} A ${R_INNER} ${R_INNER} 0 0 0 ${pi1.x} ${pi1.y} Z`}
                fill={isSelected
                  ? (t.paksha === "śukla" ? "rgba(232,158,42,0.32)" : "rgba(212,80,46,0.28)")
                  : isHovered
                    ? (t.paksha === "śukla" ? "rgba(232,158,42,0.20)" : "rgba(212,80,46,0.18)")
                    : (t.paksha === "śukla" ? "rgba(232,158,42,0.08)" : "rgba(212,80,46,0.06)")}
                stroke={isSelected
                  ? (t.paksha === "śukla" ? "#E89E2A" : "#D4502E")
                  : isHovered
                    ? qm?.dotColor ?? "#9C7A2F"
                    : (t.paksha === "śukla" ? "rgba(156,122,47,0.22)" : "rgba(162,58,30,0.18)")}
                strokeWidth={isSelected ? 3 : isHovered ? 2 : 0.6}
                filter={isSelected ? "url(#selectedGlow)" : undefined}
                style={{ transition: "all 0.2s ease", pointerEvents: "none" }}
              />
              {/* Pakṣa number — bigger and bolder */}
              <text
                x={labelP.x} y={labelP.y + 5}
                textAnchor="middle"
                fill={isSelected
                  ? (t.paksha === "śukla" ? "#7A4E10" : "#8A2E1E")
                  : isHovered
                    ? (t.paksha === "śukla" ? "#8A5E1A" : "#A23A1E")
                    : (t.paksha === "śukla" ? "rgba(107,68,35,0.75)" : "rgba(122,44,30,0.70)")}
                fontSize={isSelected ? 18 : 15}
                fontWeight={isSelected ? 900 : 700}
                style={{ fontFamily: "var(--font-sans), sans-serif", pointerEvents: "none", transition: "all 0.15s ease" }}
              >
                {t.pakshaNumber}
              </text>
              {/* Tithi name abbreviation — more readable */}
              <text
                x={nameP.x} y={nameP.y + 4}
                textAnchor="middle"
                fill={isSelected
                  ? (t.paksha === "śukla" ? "#7A4E10" : "#8A2E1E")
                  : isHovered
                    ? (t.paksha === "śukla" ? "#7A4E10" : "#8A2E1E")
                    : (t.paksha === "śukla" ? "rgba(107,68,35,0.52)" : "rgba(122,44,30,0.48)")}
                fontSize={isSelected ? 12 : 10}
                fontWeight={isSelected ? 700 : 600}
                style={{ fontFamily: "var(--font-cormorant), serif", pointerEvents: "none", transition: "all 0.15s ease" }}
              >
                {t.name.length <= 5 ? t.name : t.name.slice(0, 5)}
              </text>
            </g>
          );
        })}

        {/* Quality dots on outer ring — larger for visibility */}
        {TITHI_DB.map((t) => {
          const midAngle = (t.number - 1) * 12 + 6;
          const dp = polar(CX, CY, R_DOT, midAngle);
          const qm = QUALITY_META[t.quality];
          const isSelected = selectedTithi === t.number;
          const isHovered = hovered === t.number - 1;
          return (
            <circle
              key={`dot-${t.number}`}
              cx={dp.x} cy={dp.y} r={isSelected ? 6.5 : isHovered ? 5.5 : 4}
              fill={qm?.dotColor ?? "#9C7A2F"}
              opacity={isSelected ? 1 : isHovered ? 0.9 : 0.65}
              style={{ transition: "all 0.2s ease", pointerEvents: "none" }}
            />
          );
        })}

        {/* Inner hub — sacred center */}
        <circle cx={CX} cy={CY} r={R_INNER} fill="none" stroke="rgba(201,162,77,0.18)" strokeWidth={1} />
        <circle cx={CX} cy={CY} r={R_INNER - 6} fill="var(--gl-card-surface-solid, #FFF9F0)" stroke="#C9A24D" strokeWidth={1.5} strokeOpacity={0.4} filter="url(#wheelShadow)" />

        {/* Selected tithi info in hub — or OM symbol */}
        {selTithi ? (
          <>
            <text x={CX} y={CY - 18} textAnchor="middle" fill="#9C7A2F" fontSize={11}
              fontWeight={800} letterSpacing={0.14}
              style={{ fontFamily: "var(--font-sans), sans-serif", textTransform: "uppercase" }}>
              {selTithi.paksha === "śukla" ? "ŚUKLA" : "KṚṢṆA"} {selTithi.pakshaNumber}
            </text>
            <text x={CX} y={CY + 6} textAnchor="middle" fill="var(--gl-ink-primary, #3E2A1F)" fontSize={18}
              fontWeight={700} style={{ fontFamily: "var(--font-cormorant), serif" }}>
              <IAST>{selTithi.name}</IAST>
            </text>
            <text x={CX} y={CY + 26} textAnchor="middle" fill="var(--gl-ink-secondary, #6B5B4A)" fontSize={15}
              style={{ fontFamily: "var(--font-devanagari), serif" }}>
              {selTithi.devanagari}
            </text>
          </>
        ) : (
          <>
            <text x={CX} y={CY + 10} textAnchor="middle" fill="#9C7A2F" fontSize={34} fontWeight={700}
              style={{ fontFamily: "var(--font-devanagari), serif" }}>ॐ</text>
            <text x={CX} y={CY + 34} textAnchor="middle" fill="#9C7A2F" fontSize={11} fontWeight={600}
              letterSpacing={0.08} opacity={0.7}
              style={{ fontFamily: "var(--font-sans), sans-serif", textTransform: "uppercase" }}>
              Click a segment
            </text>
          </>
        )}
      </svg>

      {/* Hover tooltip */}
      {hoveredTithi && tooltipPos && (
        <div
          className="hidden sm:block"
          style={{
            position: "absolute",
            left: Math.min(tooltipPos.x + 16, (svgRef.current?.clientWidth ?? 700) - 200),
            top: tooltipPos.y - 10,
            pointerEvents: "none",
            zIndex: 10,
            background: "var(--gl-card-surface-solid, #FFF9F0)",
            border: "1px solid var(--gl-gold-hairline)",
            borderRadius: 12,
            padding: "12px 16px",
            boxShadow: "0 6px 24px rgba(62,42,31,0.16)",
            minWidth: 180,
            maxWidth: 240,
          }}
        >
          <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 0.14, color: hoveredTithi.paksha === "śukla" ? "#9C7A2F" : "#A23A1E", fontWeight: 700, fontFamily: "var(--font-sans), sans-serif", marginBottom: 5 }}>
            {hoveredTithi.paksha === "śukla" ? "Śukla" : "Kṛṣṇa"} {hoveredTithi.pakshaNumber}/15 · Tithi {hoveredTithi.number}/30
          </p>
          <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: 19, fontWeight: 600, color: "var(--gl-ink-primary)", lineHeight: 1.2 }}>
            <IAST>{hoveredTithi.name}</IAST>
          </p>
          <p style={{ fontFamily: "var(--font-devanagari), serif", fontSize: 15, color: "var(--gl-ink-secondary)", marginTop: 2 }}>
            {hoveredTithi.devanagari}
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="rounded-full" style={{ width: 8, height: 8, background: QUALITY_META[hoveredTithi.quality]?.dotColor ?? "#9C7A2F" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: QUALITY_META[hoveredTithi.quality]?.color ?? "#9C7A2F", fontFamily: "var(--font-cormorant), serif" }}>
              <IAST>{hoveredTithi.quality}</IAST>
            </span>
          </div>
          <p style={{ fontSize: 12, color: "var(--gl-ink-muted)", marginTop: 4, fontFamily: "var(--font-cormorant), serif", fontStyle: "italic" }}>
            Deity: <IAST>{hoveredTithi.deity}</IAST>
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── Compact Detail Panel — slim sidebar ─── */
function DetailPanel({ tithi }: { tithi: TithiData | null }) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tithi && panelRef.current && window.innerWidth < 1024) {
      panelRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [tithi]);

  if (!tithi) {
    return (
      <div
        ref={panelRef}
        className="gl-surface-twilight-glass"
        style={{ padding: "28px 20px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", minHeight: 220 }}
      >
        <svg width="40" height="40" viewBox="0 0 48 48" opacity={0.35}>
          <circle cx="24" cy="24" r="18" fill="none" stroke="#9C7A2F" strokeWidth={1.5} strokeDasharray="4 3" />
          <circle cx="24" cy="24" r="6" fill="#9C7A2F" opacity={0.3} />
          <circle cx="36" cy="12" r="4" fill="#E89E2A" opacity={0.5} />
        </svg>
        <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "17px", fontStyle: "italic", color: "var(--gl-ink-muted)", lineHeight: 1.4 }}>
          Click any segment on the wheel to explore its attributes.
        </p>
        <p style={{ fontSize: "12px", color: "var(--gl-ink-muted)", maxWidth: 240, lineHeight: 1.5 }}>
          Use quality filters to highlight the mod-5 pattern.
        </p>
      </div>
    );
  }

  const qm = QUALITY_META[tithi.quality] ?? { color: "#9C7A2F", bg: "rgba(156,122,47,0.10)", meaning: "", dotColor: "#9C7A2F" };
  const isFestivalMajor = FESTIVAL_MAJOR.has(tithi.number);
  const accentColor = tithi.paksha === "śukla" ? "#C28220" : "#A23A1E";

  return (
    <div ref={panelRef} className="gl-surface-twilight-glass" style={{ padding: "18px 16px", borderTop: `3px solid ${accentColor}`, animation: "fadeSlideIn 0.3s ease" }}>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Pakṣa + festival badge row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px", flexWrap: "wrap", gap: "4px" }}>
        <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, color: accentColor, fontFamily: "var(--font-sans), sans-serif" }}>
          {tithi.paksha === "śukla" ? "Śukla Pakṣa" : "Kṛṣṇa Pakṣa"} · {tithi.pakshaNumber}/15
        </span>
        {isFestivalMajor && (
          <span style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.10em", fontWeight: 700, color: "#C28220", background: "rgba(232,158,42,0.12)", padding: "2px 8px", borderRadius: "999px", border: "1px solid rgba(194,130,32,0.30)" }}>
            Festival-major
          </span>
        )}
      </div>

      {/* Tithi Name — compact */}
      <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "24px", fontWeight: 600, color: "var(--gl-ink-primary)", lineHeight: 1.1 }}>
        <IAST>{tithi.name}</IAST>
      </p>
      <p style={{ fontFamily: "var(--font-devanagari), serif", fontSize: "16px", color: "var(--gl-ink-secondary)", marginTop: "2px", marginBottom: "8px" }}>
        {tithi.devanagari}
      </p>

      {/* Quality badge — compact */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 10px", borderRadius: "999px", background: qm.bg, border: `1px solid ${qm.color}44`, marginBottom: "12px" }}>
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: qm.dotColor }} />
        <span style={{ fontSize: "12px", fontWeight: 700, color: qm.color, fontFamily: "var(--font-cormorant), serif" }}>
          <IAST>{tithi.quality}</IAST>
        </span>
        <span style={{ fontSize: "10px", color: "var(--gl-ink-muted)", fontFamily: "var(--font-cormorant), serif", fontStyle: "italic" }}>
          ({qm.meaning.split(" / ")[0]})
        </span>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "linear-gradient(to right, transparent, rgba(156,122,47,0.25) 30%, rgba(156,122,47,0.25) 70%, transparent)", marginBottom: "10px" }} />

      {/* Presiding Deity */}
      <div style={{ marginBottom: "10px" }}>
        <p style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--gl-ink-muted)", fontWeight: 700, fontFamily: "var(--font-sans), sans-serif", marginBottom: "3px" }}>
          Presiding Deity
        </p>
        <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "16px", fontWeight: 500, color: "var(--gl-ink-primary)" }}>
          <IAST>{tithi.deity}</IAST>
        </p>
      </div>

      {/* Operational Significance */}
      <div style={{ marginBottom: "10px" }}>
        <p style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--gl-ink-muted)", fontWeight: 700, fontFamily: "var(--font-sans), sans-serif", marginBottom: "3px" }}>
          Significance
        </p>
        <p style={{ fontSize: "13px", color: "var(--gl-ink-secondary)", lineHeight: 1.5, fontFamily: "var(--font-cormorant)", fontStyle: "italic" }}>
          {tithi.significance}
        </p>
      </div>

      {/* Festival Anchors */}
      <div>
        <p style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--gl-ink-muted)", fontWeight: 700, fontFamily: "var(--font-sans), sans-serif", marginBottom: "3px" }}>
          Festival Anchors
        </p>
        <p style={{ fontSize: "13px", color: "var(--gl-ink-primary)", lineHeight: 1.5, fontFamily: "var(--font-cormorant), serif" }}>
          {tithi.festivals}
        </p>
      </div>
    </div>
  );
}

/* ─── Quality bar with legend ─── */
function QualityBar() {
  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "12px 16px" }}>
      <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--gl-ink-muted)", fontWeight: 700, fontFamily: "var(--font-sans), sans-serif", marginBottom: "8px" }}>
        5-Fold Quality Quick-Reference
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {Object.entries(QUALITY_META).map(([name, meta]) => (
          <div key={name} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "5px 10px", borderRadius: "8px", background: meta.bg, border: `1px solid ${meta.color}33` }}>
            <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: meta.dotColor, flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "14px", fontWeight: 600, color: "var(--gl-ink-primary)" }}>
              <IAST>{name}</IAST>
            </span>
            <span style={{ fontSize: "11px", color: "var(--gl-ink-muted)", fontFamily: "var(--font-cormorant), serif", fontStyle: "italic" }}>
              {meta.meaning.split(" / ")[0]}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs" style={{ color: "var(--gl-ink-muted)", fontFamily: "var(--font-cormorant), serif", fontStyle: "italic" }}>
        The coloured dots on the outer ring of the wheel show how these 5 qualities repeat every 5 tithis (mod-5 pattern).
      </p>
    </div>
  );
}

/* ─── Search / jump input ─── */
function SearchBar({ onSelect }: { onSelect: (n: number) => void }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return TITHI_DB.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.devanagari.includes(q) ||
        t.deity.toLowerCase().includes(q) ||
        t.quality.toLowerCase().includes(q) ||
        String(t.number).includes(q)
    ).slice(0, 6);
  }, [query]);

  return (
    <div style={{ position: "relative" }}>
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search tithi, deity, or quality..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          className="flex-1 rounded-lg px-3 py-2 text-sm outline-none"
          style={{
            background: "rgba(0,0,0,0.06)",
            border: "1px solid var(--gl-border-subtle)",
            color: "var(--gl-ink-primary)",
            fontFamily: "var(--font-sans), sans-serif",
          }}
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setOpen(false); inputRef.current?.focus(); }}
            className="px-3 py-2 rounded-lg text-xs font-medium"
            style={{ background: "rgba(0,0,0,0.08)", color: "var(--gl-ink-muted)", border: "1px solid var(--gl-border-subtle)" }}
          >
            Clear
          </button>
        )}
      </div>
      {open && results.length > 0 && (
        <div
          className="absolute z-20 w-full mt-1 rounded-lg overflow-hidden"
          style={{
            background: "var(--gl-card-surface-solid, #FFF9F0)",
            border: "1px solid var(--gl-gold-hairline)",
            boxShadow: "0 4px 16px rgba(62,42,31,0.12)",
          }}
        >
          {results.map((t) => (
            <button
              key={t.number}
              className="w-full text-left px-4 py-2.5 transition-all hover:bg-black/5 flex items-center justify-between"
              onClick={() => { onSelect(t.number); setQuery(""); setOpen(false); }}
            >
              <div>
                <span className="text-sm font-semibold" style={{ color: "var(--gl-ink-primary)", fontFamily: "var(--font-cormorant), serif" }}>
                  <IAST>{t.name}</IAST>
                </span>
                <span className="text-xs ml-2" style={{ color: "var(--gl-ink-muted)" }}>
                  {t.devanagari} · {t.deity}
                </span>
              </div>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: QUALITY_META[t.quality]?.bg ?? "rgba(156,122,47,0.10)",
                  color: QUALITY_META[t.quality]?.color ?? "#9C7A2F",
                }}
              >
                <IAST>{t.quality}</IAST>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Main component — SVG hero layout ─── */
export function TithiDeityWheel() {
  const [selected, setSelected] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const selectedTithi = useMemo(() => TITHI_DB.find((t) => t.number === selected) ?? null, [selected]);

  const filters = [
    { key: "all", label: "All 30", color: "#9C7A2F" },
    { key: "Nandā", label: "Nandā", color: QUALITY_META.Nandā.color },
    { key: "Bhadrā", label: "Bhadrā", color: QUALITY_META.Bhadrā.color },
    { key: "Jayā", label: "Jayā", color: QUALITY_META.Jayā.color },
    { key: "Riktā", label: "Riktā", color: QUALITY_META.Riktā.color },
    { key: "Pūrṇā", label: "Pūrṇā", color: QUALITY_META.Pūrṇā.color },
    { key: "festival", label: "Festival-major", color: "#C28220" },
  ];

  return (
    <div className="my-6" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {/* Header strip */}
      <header className="gl-surface-twilight-glass" style={{ padding: "14px 18px", display: "grid", gridTemplateColumns: "auto 1fr", gap: "14px", alignItems: "center", borderLeft: "4px solid #C28220" }}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <img src="/assets/learning/tithi-moon-glyph.png" alt="Sūrya-Candra mandala" width={40} height={40}
            style={{ borderRadius: "50%", objectFit: "cover", objectPosition: "center", border: "2px solid rgba(201,162,77,0.35)", boxShadow: "0 2px 8px rgba(107,68,35,0.15)" }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #F5C842 0%, #E89E2A 50%, #C47A1A 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", position: "absolute", top: 0, left: 0, zIndex: -1 }}>☉☽</div>
        </div>
        <div>
          <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--gl-ink-muted)", fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif", marginBottom: "2px" }}>
            Tithi-Deity Wheel
          </p>
          <p style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 500, fontSize: "18px", color: "#C28220", lineHeight: 1.2 }}>
            30 Tithis · 15 Deities · 5 Qualities
          </p>
          <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: "12px", color: "var(--gl-ink-secondary)", marginTop: "1px" }}>
            Click any segment. Filter by quality or festival-major tithis.
          </p>
        </div>
      </header>

      {/* Search + Filter row — combined to save vertical space */}
      <div className="gl-surface-twilight-glass" style={{ padding: "12px 16px" }}>
        <SearchBar onSelect={setSelected} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
          {filters.map((f) => {
            const isActive = filter === f.key;
            return (
              <button key={f.key} onClick={() => setFilter(f.key)} style={{
                padding: "4px 12px", borderRadius: "999px",
                background: isActive ? `${f.color}18` : "rgba(156,122,47,0.05)",
                border: isActive ? `1.5px solid ${f.color}` : "1px solid rgba(156,122,47,0.20)",
                color: isActive ? f.color : "#9C7A2F",
                fontFamily: "var(--font-sans), system-ui, sans-serif", fontSize: "11px", fontWeight: isActive ? 700 : 600,
                letterSpacing: "0.06em", cursor: "pointer", transition: "all 180ms cubic-bezier(0.32, 0.72, 0.24, 1)", whiteSpace: "nowrap",
              }}>
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN LAYOUT — SVG hero with compact sidebar */}
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_280px] gap-3">
        {/* LEFT — Wheel (hero) — takes majority of space */}
        <div className="gl-surface-twilight-glass" style={{ padding: "16px 12px", overflow: "hidden" }}>
          <WheelDiagram activeFilter={filter} selectedTithi={selected} onSelect={setSelected} />
        </div>

        {/* RIGHT — Compact Detail Panel */}
        <div className="flex flex-col gap-3">
          <DetailPanel tithi={selectedTithi} />

          {/* Mini quality legend in sidebar */}
          <div className="gl-surface-twilight-glass hidden lg:block" style={{ padding: "10px 12px" }}>
            <p style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--gl-ink-muted)", fontWeight: 700, fontFamily: "var(--font-sans), sans-serif", marginBottom: "6px" }}>
              Quality Legend
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {Object.entries(QUALITY_META).map(([name, meta]) => (
                <div key={name} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "3px 0" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: meta.dotColor, flexShrink: 0 }} />
                  <span style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "13px", fontWeight: 600, color: meta.color }}>
                    <IAST>{name}</IAST>
                  </span>
                  <span style={{ fontSize: "10px", color: "var(--gl-ink-muted)", fontFamily: "var(--font-cormorant), serif", fontStyle: "italic" }}>
                    — {meta.meaning.split(" / ")[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quality bar — mobile only (desktop gets sidebar legend) */}
      <div className="lg:hidden">
        <QualityBar />
      </div>

      {/* Instruction */}
      <p className="text-xs italic text-center" style={{ fontFamily: "var(--font-cormorant), serif", color: "var(--gl-ink-muted)", lineHeight: 1.5 }}>
        Click any segment on the wheel to reveal its full attributes. Use quality filters to see the mod-5 cyclic pattern.
        Festival-major tithis are marked with a gold badge. Śukla pakṣa (waxing) is the top half; Kṛṣṇa pakṣa (waning) is the bottom half.
      </p>
    </div>
  );
}
