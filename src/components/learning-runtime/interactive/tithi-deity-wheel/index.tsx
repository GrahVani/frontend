"use client";

import { useState, useMemo } from "react";
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

const QUALITY_META: Record<string, { color: string; bg: string; meaning: string }> = {
  Nandā:  { color: "#C28220", bg: "rgba(232,158,42,0.12)", meaning: "joyful / delightful" },
  Bhadrā: { color: "#4A7C59", bg: "rgba(74,124,89,0.10)",  meaning: "gentle / auspicious" },
  Jayā:   { color: "#7A3E2C", bg: "rgba(162,58,30,0.10)",  meaning: "victorious" },
  Riktā:  { color: "#5A5A5A", bg: "rgba(90,90,90,0.10)",   meaning: "empty / inauspicious for new beginnings" },
  Pūrṇā:  { color: "#4F6FA8", bg: "rgba(79,111,168,0.10)", meaning: "full / complete" },
};

const FESTIVAL_MAJOR = new Set([1, 3, 9, 10, 15, 23, 26, 29, 30]);

/* ─── Wheel segment component ─── */
function WheelDiagram({ activeFilter, selectedTithi, onSelect }: {
  activeFilter: string;
  selectedTithi: number | null;
  onSelect: (n: number) => void;
}) {
  const CX = 320;
  const CY = 320;
  const R_INNER = 68;
  const R_OUTER = 250;

  const getOpacity = (t: TithiData) => {
    if (activeFilter === "all") return 1;
    if (activeFilter === "festival") return FESTIVAL_MAJOR.has(t.number) ? 1 : 0.18;
    return t.quality === activeFilter ? 1 : 0.18;
  };

  const getFill = (t: TithiData, isActive: boolean) => {
    if (isActive) return t.paksha === "śukla" ? "rgba(232,158,42,0.24)" : "rgba(212,80,46,0.20)";
    return t.paksha === "śukla" ? "rgba(232,158,42,0.07)" : "rgba(212,80,46,0.06)";
  };

  const getStroke = (t: TithiData, isActive: boolean) => {
    if (isActive) return t.paksha === "śukla" ? "#E89E2A" : "#D4502E";
    return t.paksha === "śukla" ? "rgba(156,122,47,0.22)" : "rgba(162,58,30,0.20)";
  };

  return (
    <svg viewBox="0 0 640 640" className="w-full h-auto" style={{ maxWidth: 560, display: "block", margin: "0 auto" }}>
      <defs>
        <filter id="wheelShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#6B4423" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* Outer decorative ring */}
      <circle cx={CX} cy={CY} r={R_OUTER + 16} fill="none" stroke="#E8DCC8" strokeWidth={1} opacity={0.35} />
      <circle cx={CX} cy={CY} r={R_OUTER + 8} fill="none" stroke="#E8DCC8" strokeWidth={0.5} opacity={0.25} strokeDasharray="4 4" />

      {/* Pakṣa divider line (horizontal) */}
      <line x1={CX - R_OUTER - 12} y1={CY} x2={CX + R_OUTER + 12} y2={CY} stroke="rgba(156,122,47,0.22)" strokeWidth={1.2} strokeDasharray="6 4" />

      {/* Pakṣa labels */}
      <text x={CX} y={CY - R_OUTER - 4} textAnchor="middle" fill="#9C7A2F" fontSize={13} fontWeight={700} letterSpacing={0.12} style={{ fontFamily: "var(--font-sans), sans-serif", textTransform: "uppercase" }}>Śukla Pakṣa · 1–15</text>
      <text x={CX} y={CY + R_OUTER + 18} textAnchor="middle" fill="#A23A1E" fontSize={13} fontWeight={700} letterSpacing={0.12} style={{ fontFamily: "var(--font-sans), sans-serif", textTransform: "uppercase" }}>Kṛṣṇa Pakṣa · 1–15</text>

      {/* 30 segments */}
      {TITHI_DB.map((t) => {
        const startAngle = (t.number - 1) * 12;
        const endAngle = t.number * 12;
        const x1 = CX + R_OUTER * Math.cos((startAngle - 90) * (Math.PI / 180));
        const y1 = CY + R_OUTER * Math.sin((startAngle - 90) * (Math.PI / 180));
        const x2 = CX + R_OUTER * Math.cos((endAngle - 90) * (Math.PI / 180));
        const y2 = CY + R_OUTER * Math.sin((endAngle - 90) * (Math.PI / 180));
        const xi1 = CX + R_INNER * Math.cos((startAngle - 90) * (Math.PI / 180));
        const yi1 = CY + R_INNER * Math.sin((startAngle - 90) * (Math.PI / 180));
        const xi2 = CX + R_INNER * Math.cos((endAngle - 90) * (Math.PI / 180));
        const yi2 = CY + R_INNER * Math.sin((endAngle - 90) * (Math.PI / 180));
        const isSelected = selectedTithi === t.number;
        const opacity = getOpacity(t);

        const midAngle = (startAngle + endAngle) / 2;
        const labelR = (R_INNER + R_OUTER) / 2;
        const lx = CX + labelR * Math.cos((midAngle - 90) * (Math.PI / 180));
        const ly = CY + labelR * Math.sin((midAngle - 90) * (Math.PI / 180));

        return (
          <g key={t.number} style={{ cursor: "pointer", opacity, transition: "opacity 0.25s ease" }} onClick={() => onSelect(t.number)}>
            <path
              d={`M ${xi1} ${yi1} L ${x1} ${y1} A ${R_OUTER} ${R_OUTER} 0 0 1 ${x2} ${y2} L ${xi2} ${yi2} A ${R_INNER} ${R_INNER} 0 0 0 ${xi1} ${yi1} Z`}
              fill={getFill(t, isSelected)}
              stroke={getStroke(t, isSelected)}
              strokeWidth={isSelected ? 2.5 : 0.7}
              style={{ transition: "all 0.2s ease" }}
            />
            <text
              x={lx} y={ly + 4}
              textAnchor="middle"
              fill={isSelected ? (t.paksha === "śukla" ? "#8A5E1A" : "#A23A1E") : t.paksha === "śukla" ? "rgba(107,68,35,0.60)" : "rgba(122,44,30,0.55)"}
              fontSize={12}
              fontWeight={isSelected ? 800 : 600}
              style={{ fontFamily: "var(--font-sans), sans-serif", pointerEvents: "none" }}
            >
              {t.pakshaNumber}
            </text>
          </g>
        );
      })}

      {/* Inner hub circle */}
      <circle cx={CX} cy={CY} r={R_INNER - 3} fill="#FFF9F0" stroke="#C9A24D" strokeWidth={1.2} strokeOpacity={0.35} filter="url(#wheelShadow)" />
      <text x={CX} y={CY + 7} textAnchor="middle" fill="#9C7A2F" fontSize={28} fontWeight={700} style={{ fontFamily: "var(--font-devanagari), serif" }}>ॐ</text>

      {selectedTithi === null && (
        <text x={CX} y={CY + 28} textAnchor="middle" fill="#9C7A2F" fontSize={10} fontWeight={600} letterSpacing={0.08} style={{ fontFamily: "var(--font-sans), sans-serif", textTransform: "uppercase" }}>
          Click a segment
        </text>
      )}
    </svg>
  );
}

/* ─── Detail panel — vertical stack for sidebar readability ─── */
function DetailPanel({ tithi }: { tithi: TithiData | null }) {
  if (!tithi) {
    return (
      <div className="gl-surface-twilight-glass" style={{ padding: "40px 24px", textAlign: "center", minHeight: 280, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px" }}>
        <span style={{ fontSize: "44px" }}>🌙</span>
        <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "20px", fontStyle: "italic", color: "var(--gl-ink-muted)" }}>
          Click any segment on the wheel to explore its attributes.
        </p>
        <p style={{ fontSize: "13px", color: "var(--gl-ink-muted)", maxWidth: 280, lineHeight: 1.5 }}>
          Try the quality filters to highlight tithis by their 5-fold classification.
        </p>
      </div>
    );
  }

  const qm = QUALITY_META[tithi.quality] ?? { color: "#9C7A2F", bg: "rgba(156,122,47,0.10)", meaning: "" };
  const isFestivalMajor = FESTIVAL_MAJOR.has(tithi.number);
  const accentColor = tithi.paksha === "śukla" ? "#C28220" : "#A23A1E";

  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "24px", borderTop: `4px solid ${accentColor}` }}>
      {/* Pakṣa + festival badge row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "6px" }}>
        <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.16em", fontWeight: 700, color: accentColor, fontFamily: "var(--font-sans), sans-serif" }}>
          {tithi.paksha === "śukla" ? "Śukla Pakṣa" : "Kṛṣṇa Pakṣa"} · {tithi.pakshaNumber}/15
        </span>
        {isFestivalMajor && (
          <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, color: "#C28220", background: "rgba(232,158,42,0.12)", padding: "3px 10px", borderRadius: "999px", border: "1px solid rgba(194,130,32,0.30)" }}>
            Festival-major
          </span>
        )}
      </div>

      {/* Tithi Name */}
      <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "32px", fontWeight: 600, color: "var(--gl-ink-primary)", lineHeight: 1.1 }}>
        <IAST>{tithi.name}</IAST>
      </p>
      <p style={{ fontFamily: "var(--font-devanagari), serif", fontSize: "20px", color: "var(--gl-ink-secondary)", marginTop: "4px", marginBottom: "12px" }}>
        {tithi.devanagari}
      </p>

      {/* Quality badge */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", borderRadius: "999px", background: qm.bg, border: `1px solid ${qm.color}44`, marginBottom: "20px" }}>
        <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: qm.color }} />
        <span style={{ fontSize: "14px", fontWeight: 700, color: qm.color, fontFamily: "var(--font-cormorant), serif" }}>
          <IAST>{tithi.quality}</IAST>
        </span>
        <span style={{ fontSize: "12px", color: "var(--gl-ink-muted)", fontFamily: "var(--font-cormorant), serif", fontStyle: "italic" }}>
          ({qm.meaning})
        </span>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "linear-gradient(to right, transparent, rgba(156,122,47,0.25) 30%, rgba(156,122,47,0.25) 70%, transparent)", marginBottom: "16px" }} />

      {/* Presiding Deity */}
      <div style={{ marginBottom: "16px" }}>
        <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--gl-ink-muted)", fontWeight: 700, fontFamily: "var(--font-sans), sans-serif", marginBottom: "5px" }}>
          Presiding Deity
        </p>
        <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "19px", fontWeight: 500, color: "var(--gl-ink-primary)" }}>
          <IAST>{tithi.deity}</IAST>
        </p>
      </div>

      {/* Operational Significance */}
      <div style={{ marginBottom: "16px" }}>
        <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--gl-ink-muted)", fontWeight: 700, fontFamily: "var(--font-sans), sans-serif", marginBottom: "5px" }}>
          Operational Significance
        </p>
        <p style={{ fontSize: "14px", color: "var(--gl-ink-secondary)", lineHeight: 1.55, fontFamily: "var(--font-cormorant), serif", fontStyle: "italic" }}>
          {tithi.significance}
        </p>
      </div>

      {/* Festival Anchors */}
      <div>
        <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--gl-ink-muted)", fontWeight: 700, fontFamily: "var(--font-sans), sans-serif", marginBottom: "5px" }}>
          Festival Anchors
        </p>
        <p style={{ fontSize: "14px", color: "var(--gl-ink-primary)", lineHeight: 1.55, fontFamily: "var(--font-cormorant), serif" }}>
          {tithi.festivals}
        </p>
      </div>
    </div>
  );
}

/* ─── Quality bar ─── */
function QualityBar() {
  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "16px 20px" }}>
      <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--gl-ink-muted)", fontWeight: 700, fontFamily: "var(--font-sans), sans-serif", marginBottom: "12px" }}>
        5-Fold Quality Quick-Reference
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
        {Object.entries(QUALITY_META).map(([name, meta]) => (
          <div key={name} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 14px", borderRadius: "8px", background: meta.bg, border: `1px solid ${meta.color}33` }}>
            <span style={{ width: "11px", height: "11px", borderRadius: "50%", background: meta.color, flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "16px", fontWeight: 600, color: "var(--gl-ink-primary)" }}>
              <IAST>{name}</IAST>
            </span>
            <span style={{ fontSize: "12px", color: "var(--gl-ink-muted)", fontFamily: "var(--font-cormorant), serif", fontStyle: "italic" }}>
              {meta.meaning}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main component ─── */
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
    <div className="my-6" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      {/* Header strip */}
      <header className="gl-surface-twilight-glass" style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "auto 1fr", gap: "16px", alignItems: "center", borderLeft: "4px solid #C28220" }}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <img src="/assets/learning/tithi-moon-glyph.png" alt="Sūrya-Candra mandala" width={44} height={44}
            style={{ borderRadius: "50%", objectFit: "cover", objectPosition: "center", border: "2px solid rgba(201,162,77,0.35)", boxShadow: "0 2px 8px rgba(107,68,35,0.15)" }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #F5C842 0%, #E89E2A 50%, #C47A1A 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", position: "absolute", top: 0, left: 0, zIndex: -1 }}>☉☽</div>
        </div>
        <div>
          <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--gl-ink-muted)", fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif", marginBottom: "3px" }}>
            Tithi-Deity Wheel
          </p>
          <p style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 500, fontSize: "20px", color: "#C28220", lineHeight: 1.2 }}>
            30 Tithis · 15 Deities · 5 Qualities
          </p>
          <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: "13px", color: "var(--gl-ink-secondary)", marginTop: "2px" }}>
            Click any segment. Filter by quality or festival-major tithis.
          </p>
        </div>
      </header>

      {/* Filter pills */}
      <div className="gl-surface-twilight-glass" style={{ padding: "14px 18px" }}>
        <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--gl-ink-muted)", fontWeight: 700, fontFamily: "var(--font-sans), sans-serif", marginBottom: "10px" }}>
          Highlight by Quality
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {filters.map((f) => {
            const isActive = filter === f.key;
            return (
              <button key={f.key} onClick={() => setFilter(f.key)} style={{
                padding: "6px 14px", borderRadius: "999px",
                background: isActive ? `${f.color}18` : "rgba(156,122,47,0.05)",
                border: isActive ? `1.5px solid ${f.color}` : "1px solid rgba(156,122,47,0.20)",
                color: isActive ? f.color : "#9C7A2F",
                fontFamily: "var(--font-sans), system-ui, sans-serif", fontSize: "12px", fontWeight: isActive ? 700 : 600,
                letterSpacing: "0.06em", cursor: "pointer", transition: "all 180ms cubic-bezier(0.32, 0.72, 0.24, 1)", whiteSpace: "nowrap",
              }}>
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ MAIN TWO-COLUMN LAYOUT ═══ */}
      {/* Desktop (lg+): side-by-side grid  •  Mobile: stacked */}
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_380px] gap-3.5">
        {/* LEFT — Wheel */}
        <div className="gl-surface-twilight-glass" style={{ padding: "20px 16px" }}>
          <WheelDiagram activeFilter={filter} selectedTithi={selected} onSelect={setSelected} />
        </div>

        {/* RIGHT — Detail Panel (always visible beside the wheel on desktop) */}
        <div>
          <DetailPanel tithi={selectedTithi} />
        </div>
      </div>

      {/* Quality bar */}
      <QualityBar />

      {/* Instruction */}
      <p className="text-sm italic text-center" style={{ fontFamily: "var(--font-cormorant), serif", color: "var(--gl-ink-muted)" }}>
        Click any segment on the wheel to reveal its full attributes. Use quality filters to see the mod-5 cyclic pattern.
        Festival-major tithis are marked with a gold badge. Śukla pakṣa (waxing) is the top half; Kṛṣṇa pakṣa (waning) is the bottom half.
      </p>
    </div>
  );
}
