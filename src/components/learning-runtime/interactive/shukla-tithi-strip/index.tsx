"use client";

import { useState } from "react";
import { IAST } from "../../chrome/typography";

interface TithiData {
  number: number;
  name: string;
  devanagari: string;
  deity: string;
  quality: string;
  significance: string;
  festivals: string;
}

const SHUKLA_TITHIS: TithiData[] = [
  { number: 1,  name: "Pratipadā",   devanagari: "प्रतिपदा",   deity: "Agni / Brahmā",       quality: "Nandā",  significance: "Year & month opening; Vāstu foundational rites", festivals: "Caitra Pratipadā = Hindu New Year" },
  { number: 2,  name: "Dvitīyā",     devanagari: "द्वितीया",     deity: "Brahmā / Vidhātā",    quality: "Bhadrā", significance: "Auspicious for lasting actions, treaties, commitments", festivals: "Bhrātṛ-Dvitīyā / Bhai Dooj" },
  { number: 3,  name: "Tṛtīyā",      devanagari: "तृतीया",      deity: "Gaurī / Pārvatī",     quality: "Jayā",   significance: "Marriage muhūrta; victory-anchored actions", festivals: "Akṣaya Tṛtīyā" },
  { number: 4,  name: "Caturthī",    devanagari: "चतुर्थी",    deity: "Gaṇeśa",              quality: "Riktā",  significance: "Inauspicious for new ventures; Gaṇeśa's day", festivals: "Vināyaka Caturthī" },
  { number: 5,  name: "Pañcamī",     devanagari: "पञ्चमी",     deity: "Nāga / Sarasvatī",    quality: "Pūrṇā",  significance: "Learning & completion; scholarly endeavours", festivals: "Vasanta Pañcamī; Nāga Pañcamī" },
  { number: 6,  name: "Ṣaṣṭhī",      devanagari: "षष्ठी",      deity: "Skanda / Kārttikeya", quality: "Nandā",  significance: "Skanda-vrata; commander of deva armies", festivals: "Skanda Ṣaṣṭhī" },
  { number: 7,  name: "Saptamī",     devanagari: "सप्तमी",     deity: "Sūrya",               quality: "Bhadrā", significance: "Sun-related observances", festivals: "Ratha Saptamī" },
  { number: 8,  name: "Aṣṭamī",      devanagari: "अष्टमी",      deity: "Rudra / Śiva + Devī", quality: "Jayā",   significance: "Devī observances; warrior-vrata", festivals: "Durgā Aṣṭamī" },
  { number: 9,  name: "Navamī",      devanagari: "नवमी",      deity: "Durgā / Ambikā",      quality: "Riktā",  significance: "Devī worship; inauspicious for ventures", festivals: "Rāma Navamī; Mahā-Navamī" },
  { number: 10, name: "Daśamī",      devanagari: "दशमी",      deity: "Yama / Dharma",       quality: "Pūrṇā",  significance: "Dhārmic actions; completion", festivals: "Vijaya Daśamī / Dussehra" },
  { number: 11, name: "Ekādaśī",     devanagari: "एकादशी",     deity: "Viṣṇu / Viśvedevā",   quality: "Nandā",  significance: "Vaiṣṇava fast-day; bi-monthly observance", festivals: "~24 named Ekādaśīs annually" },
  { number: 12, name: "Dvādaśī",     devanagari: "द्वादशी",     deity: "Viṣṇu / Hari",        quality: "Bhadrā", significance: "Ekādaśī pāraṇa (breaking fast)", festivals: "Vāmana Dvādaśī" },
  { number: 13, name: "Trayodaśī",   devanagari: "त्रयोदशी",   deity: "Kāmadeva / Dharma",   quality: "Jayā",   significance: "Pradoṣa-vrata (Śaiva twilight worship)", festivals: "Pradoṣa; Anaṅga Trayodaśī" },
  { number: 14, name: "Caturdaśī",   devanagari: "चतुर्दशी",   deity: "Śiva / Rudra",        quality: "Riktā",  significance: "Śaiva observances; inauspicious for ventures", festivals: "Naraka Caturdaśī" },
  { number: 15, name: "Pūrṇimā",     devanagari: "पूर्णिमा",     deity: "Soma / Candra",       quality: "Pūrṇā",  significance: "Full moon; most-festival-anchoring tithi", festivals: "Guru Pūrṇimā; Buddha Pūrṇimā; Sharad Pūrṇimā" },
];

const QUALITY_STYLE: Record<string, { color: string; bg: string }> = {
  Nandā:  { color: "#C28220", bg: "rgba(232,158,42,0.10)" },
  Bhadrā: { color: "#4A7C59", bg: "rgba(74,124,89,0.08)" },
  Jayā:   { color: "#7A3E2C", bg: "rgba(162,58,30,0.08)" },
  Riktā:  { color: "#5A5A5A", bg: "rgba(90,90,90,0.08)" },
  Pūrṇā:  { color: "#4F6FA8", bg: "rgba(79,111,168,0.08)" },
};

export function ShuklaTithiStrip() {
  const [selected, setSelected] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const filtered = SHUKLA_TITHIS.filter((t) => filter === "all" || t.quality === filter);
  const active = selected ? SHUKLA_TITHIS.find((t) => t.number === selected) ?? null : null;

  return (
    <div className="space-y-5">
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {["all", "Nandā", "Bhadrā", "Jayā", "Riktā", "Pūrṇā"].map((q) => (
          <button
            key={q}
            onClick={() => setFilter(q)}
            className="px-3 py-1 rounded-full text-xs font-medium transition-all"
            style={{
              background: filter === q ? "rgba(156,122,47,0.18)" : "rgba(255,249,234,0.5)",
              color: filter === q ? "#9C7A2F" : "var(--gl-ink-muted)",
              border: "1px solid rgba(156,122,47,0.2)",
              cursor: "pointer",
            }}
          >
            {q === "all" ? "All 15" : q}
          </button>
        ))}
      </div>

      {/* Horizontal strip */}
      <div
        className="flex gap-3 overflow-x-auto pb-3"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#9C7A2F transparent" }}
      >
        {filtered.map((t) => {
          const qs = QUALITY_STYLE[t.quality] ?? QUALITY_STYLE.Nandā;
          const isActive = selected === t.number;
          return (
            <button
              key={t.number}
              onClick={() => setSelected(isActive ? null : t.number)}
              className="flex-shrink-0 p-4 rounded-xl text-left transition-all"
              style={{
                width: 140,
                background: isActive ? qs.bg : "rgba(255,249,234,0.5)",
                border: isActive ? `2px solid ${qs.color}` : "1px solid rgba(156,122,47,0.15)",
                cursor: "pointer",
              }}
            >
              <p className="text-xs mb-1" style={{ color: "var(--gl-ink-muted)" }}>
                Śukla {t.number}/15
              </p>
              <p
                className="text-base mb-1"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontWeight: 600,
                  color: "var(--gl-ink-primary)",
                }}
              >
                <IAST>{t.name}</IAST>
              </p>
              <p
                className="text-sm mb-2"
                style={{ fontFamily: "var(--font-devanagari), serif", color: "#9C7A2F" }}
              >
                {t.devanagari}
              </p>
              <span
                className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                style={{ background: qs.bg, color: qs.color }}
              >
                {t.quality}
              </span>
            </button>
          );
        })}
      </div>

      {/* Detail panel */}
      {active && (
        <div
          className="p-5 rounded-xl"
          style={{
            background: "rgba(232,158,42,0.04)",
            border: "1px solid rgba(156,122,47,0.15)",
          }}
        >
          <div className="flex items-baseline gap-3 mb-2">
            <p
              className="text-xl"
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontWeight: 600,
                color: "var(--gl-gold-accent)",
              }}
            >
              <IAST>{active.name}</IAST>
            </p>
            <span
              className="px-2 py-0.5 rounded text-xs font-medium"
              style={{
                background: QUALITY_STYLE[active.quality]?.bg,
                color: QUALITY_STYLE[active.quality]?.color,
              }}
            >
              {active.quality}
            </span>
          </div>
          <p className="text-sm mb-1" style={{ color: "var(--gl-ink-secondary)" }}>
            <span style={{ fontWeight: 600 }}>Deity:</span> {active.deity}
          </p>
          <p className="text-sm mb-1" style={{ color: "var(--gl-ink-secondary)" }}>
            <span style={{ fontWeight: 600 }}>Significance:</span> {active.significance}
          </p>
          <p className="text-sm" style={{ color: "var(--gl-ink-secondary)" }}>
            <span style={{ fontWeight: 600 }}>Festivals:</span> {active.festivals}
          </p>
        </div>
      )}
    </div>
  );
}
