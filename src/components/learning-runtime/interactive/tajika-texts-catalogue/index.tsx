"use client";

import { useState } from "react";
import { Search, Filter, BookOpen, Layers, CheckCircle2, ChevronRight } from "lucide-react";

interface TextProfile {
  slug: string;
  title: string;
  author: string;
  dateLabel: string;
  century: "16th" | "17th" | "18th-19th" | "20th-21st";
  role: "Primary" | "Commentary" | "Auxiliary" | "Modern";
  language: "Sanskrit" | "Bilingual" | "English / Hindi";
  description: string;
  pedagogicalUse: string;
  coverColor: string; // Tailwind-like color style helper
}

const TEXTS: TextProfile[] = [
  {
    slug: "tajika-neelakanthi",
    title: "Tājika Nīlakaṇṭhī",
    author: "Pandit Nīlakaṇṭha",
    dateLabel: "1587 CE",
    century: "16th",
    role: "Primary",
    language: "Sanskrit",
    description: "The canonical foundational text of the Tājika tradition. Written in classical Sanskrit verse with prose commentary, it systematically Sanskritized Persian-Arabic horoscopic concepts into the six-tantra structure.",
    pedagogicalUse: "Acts as the primary technical foundation for the entire M19 module (yogas, sahams, annual dasha computations, praśna).",
    coverColor: "#9C7A2F" // Mughal Gold
  },
  {
    slug: "tajika-sara",
    title: "Tājika Sāra",
    author: "Hari Bhaṭṭa",
    dateLabel: "17th Century",
    century: "17th",
    role: "Commentary",
    language: "Sanskrit",
    description: "The primary Sanskrit commentary on the Tājika Nīlakaṇṭhī. It clarifies Nīlakaṇṭha's terse Sanskrit definitions and adds worked examples, preserving tradition continuity across the generations.",
    pedagogicalUse: "Provides interpretive bridge rules and calculations to prevent contemporary practitioners from misconstruing base formulas.",
    coverColor: "#A23A1E" // Royal Vermilion
  },
  {
    slug: "tajika-bhushana",
    title: "Tājika Bhūṣaṇa",
    author: "Gaṇeśa Daivajña",
    dateLabel: "16th Century",
    century: "16th",
    role: "Auxiliary",
    language: "Sanskrit",
    description: "An auxiliary canonical text predating or contemporary with Tājika Nīlakaṇṭhī. It represents an earlier phase of the Sanskritization movement, indicating a multi-author research project rather than a single-author anomaly.",
    pedagogicalUse: "Demonstrates the historical active Sanskritization movement of astronomical/astrological sciences in 16th-century India.",
    coverColor: "#B59F6D" // Parchment Gold
  },
  {
    slug: "varshaphala-treatises",
    title: "Varṣa-phala Treatises",
    author: "Regional Scholars",
    dateLabel: "17th–19th Century",
    century: "18th-19th",
    role: "Auxiliary",
    language: "Bilingual",
    description: "An extended genre of regional treatises composed across North, South, and Western India. These texts adapted and expanded solar return principles to local calendar systems and language dialects.",
    pedagogicalUse: "Illustrates the regional adaptability and robust structural continuity of the Tājika framework over three centuries.",
    coverColor: "#8E7B5E" // Leather Brown
  },
  {
    slug: "modern-scholarship",
    title: "Modern Tājika Publications",
    author: "K.N. Rao, V.P. Goel, B.V. Raman",
    dateLabel: "20th–21st Century",
    century: "20th-21st",
    role: "Modern",
    language: "English / Hindi",
    description: "Living textual tradition that carries forward Tājika translation, worked case-studies, and mathematical calculations. Adapts classical rules to modern computer-cast charts and contemporary client use cases.",
    pedagogicalUse: "Provides contemporary students with accessible commentary, translation guides, and real-world client chart case studies.",
    coverColor: "#2F7D55" // Jade Green
  }
];

const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const HAIRLINE = "var(--gl-gold-hairline, rgba(156, 122, 47, 0.15))";
const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GREEN = "#2F7D55";
const RED = "#A23A1E";
const AMBER = "#D97706";

export function TajikaTextsCatalogue() {
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [centuryFilter, setCenturyFilter] = useState<string>("All");
  const [langFilter, setLangFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const [selectedSlug, setSelectedSlug] = useState<string>("tajika-neelakanthi");
  const [compareSlug, setCompareSlug] = useState<string>("tajika-sara");
  const [compareMode, setCompareMode] = useState<boolean>(false);

  const filteredTexts = TEXTS.filter((t) => {
    const matchesRole = roleFilter === "All" || t.role === roleFilter;
    const matchesCentury = centuryFilter === "All" || t.century === centuryFilter;
    const matchesLang = langFilter === "All" || t.language === langFilter;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesCentury && matchesLang && matchesSearch;
  });

  const selectedText = TEXTS.find((t) => t.slug === selectedSlug) || TEXTS[0];
  const compareText = TEXTS.find((t) => t.slug === compareSlug) || TEXTS[1];

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{
        padding: "20px",
        borderRadius: "12px",
        background: "rgba(255, 253, 246, 0.7)",
        border: "1px solid rgba(156, 122, 47, 0.15)",
        boxShadow: "0 8px 32px rgba(156, 122, 47, 0.05)",
        fontFamily: "'Inter', sans-serif",
        color: INK_PRIMARY,
        maxWidth: "920px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "16px"
      }}
      data-interactive="tajika-texts-catalogue"
    >
      {/* Header section */}
      <div style={{ borderBottom: "1px solid rgba(156, 122, 47, 0.12)", paddingBottom: "12px", marginBottom: "4px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Module 19 — Chapter 1 — Lesson 3
        </span>
        <h3 style={{ fontSize: "20px", fontWeight: 700, color: INK_PRIMARY, margin: "4px 0 0" }}>
          Tājika Canonical Literature Catalogue
        </h3>
        <p style={{ fontSize: "12.5px", color: INK_SECONDARY, margin: "2px 0 0" }}>
          Explore commentaries, auxiliary treatises, and modern applications surrounding the canonical core.
        </p>
      </div>

      {/* Filters section */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "4px",
          flexWrap: "wrap",
          alignItems: "center",
          backgroundColor: "#ffffff",
          border: "1px solid rgba(156, 122, 47, 0.12)",
          borderRadius: "8px",
          padding: "12px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          <Filter size={14} /> Filters:
        </div>

        {/* Search */}
        <div style={{ position: "relative", flex: 1, minWidth: "160px" }}>
          <Search size={14} color={GOLD} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            placeholder="Search catalog..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "6px 12px 6px 30px",
              border: "1px solid rgba(156, 122, 47, 0.15)",
              borderRadius: "6px",
              backgroundColor: "rgba(255, 255, 255, 0.4)",
              fontSize: "13px",
              color: INK_PRIMARY
            }}
          />
        </div>

        {/* Role */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{
            padding: "6px 10px",
            border: "1px solid rgba(156, 122, 47, 0.15)",
            borderRadius: "6px",
            backgroundColor: "#ffffff",
            fontSize: "12.5px",
            color: INK_PRIMARY
          }}
        >
          <option value="All">All Roles</option>
          <option value="Primary">Primary</option>
          <option value="Commentary">Commentary</option>
          <option value="Auxiliary">Auxiliary</option>
          <option value="Modern">Modern</option>
        </select>

        {/* Century */}
        <select
          value={centuryFilter}
          onChange={(e) => setCenturyFilter(e.target.value)}
          style={{
            padding: "6px 10px",
            border: "1px solid rgba(156, 122, 47, 0.15)",
            borderRadius: "6px",
            backgroundColor: "#ffffff",
            fontSize: "12.5px",
            color: INK_PRIMARY
          }}
        >
          <option value="All">All Centuries</option>
          <option value="16th">16th C.</option>
          <option value="17th">17th C.</option>
          <option value="18th-19th">18th-19th C.</option>
          <option value="20th-21st">20th-21st C.</option>
        </select>

        {/* Language */}
        <select
          value={langFilter}
          onChange={(e) => setLangFilter(e.target.value)}
          style={{
            padding: "6px 10px",
            border: "1px solid rgba(156, 122, 47, 0.15)",
            borderRadius: "6px",
            backgroundColor: "#ffffff",
            fontSize: "12.5px",
            color: INK_PRIMARY
          }}
        >
          <option value="All">All Languages</option>
          <option value="Sanskrit">Sanskrit</option>
          <option value="Bilingual">Bilingual</option>
          <option value="English / Hindi">English / Hindi</option>
        </select>
      </div>

      {/* Main Interactive Shelf Board */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", alignItems: "start" }}>
        
        {/* Left: Interactive Bookshelf */}
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.4)",
            border: "1px solid rgba(156, 122, 47, 0.12)",
            borderRadius: "8px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}
        >
          <span style={{ fontSize: "10px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center" }}>
            The Canonical Bookshelf
          </span>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {filteredTexts.map((t) => {
              const isSelected = t.slug === selectedSlug;
              const isCompare = t.slug === compareSlug && compareMode;
              return (
                <button
                  key={t.slug}
                  onClick={() => {
                    if (compareMode) {
                      setCompareSlug(t.slug);
                    } else {
                      setSelectedSlug(t.slug);
                    }
                  }}
                  style={{
                    backgroundColor: isSelected || isCompare ? "#ffffff" : "transparent",
                    border: `1.5px solid ${isSelected ? GOLD : isCompare ? RED : "rgba(156, 122, 47, 0.15)"}`,
                    borderRadius: "8px",
                    padding: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 200ms ease"
                  }}
                >
                  {/* Styled Book Spine */}
                  <div
                    style={{
                      width: "12px",
                      height: "36px",
                      backgroundColor: t.coverColor,
                      borderRadius: "2px",
                      flexShrink: 0,
                      boxShadow: "1px 1px 3px rgba(0,0,0,0.15)"
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: INK_PRIMARY, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {t.title}
                    </div>
                    <div style={{ fontSize: "11.5px", color: INK_MUTED, fontStyle: "italic" }}>
                      {t.author}
                    </div>
                  </div>
                  <ChevronRight size={14} color={GOLD} />
                </button>
              );
            })}
          </div>

          {/* Toggle Compare Mode */}
          <button
            onClick={() => setCompareMode(prev => !prev)}
            style={{
              marginTop: "8px",
              padding: "6px",
              backgroundColor: compareMode ? RED : "transparent",
              color: compareMode ? "#ffffff" : RED,
              border: `1px solid ${RED}`,
              borderRadius: "6px",
              fontWeight: 700,
              fontSize: "11px",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 150ms ease"
            }}
          >
            {compareMode ? "Deactivate Compare" : "Compare Two Texts"}
          </button>
        </div>

        {/* Right: Reading Stand detail card */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid rgba(156, 122, 47, 0.12)",
            borderRadius: "8px",
            padding: "16px",
            boxShadow: "0 2px 12px rgba(156, 122, 47, 0.02)"
          }}
        >
          {!compareMode ? (
            /* Single view */
            <div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
                <span style={{ fontSize: "9.5px", fontWeight: 700, textTransform: "uppercase", padding: "2px 6px", backgroundColor: "rgba(162, 58, 30, 0.05)", color: RED, borderRadius: "4px" }}>
                  {selectedText.role}
                </span>
                <span style={{ fontSize: "9.5px", fontWeight: 700, textTransform: "uppercase", padding: "2px 6px", backgroundColor: "rgba(156, 122, 47, 0.05)", color: GOLD, borderRadius: "4px" }}>
                  {selectedText.century} Century
                </span>
                <span style={{ fontSize: "9.5px", fontWeight: 700, textTransform: "uppercase", padding: "2px 6px", backgroundColor: "rgba(47, 125, 85, 0.05)", color: GREEN, borderRadius: "4px" }}>
                  {selectedText.language}
                </span>
              </div>

              <h4 style={{ fontSize: "18px", fontWeight: 700, color: INK_PRIMARY, margin: 0 }}>
                {selectedText.title}
              </h4>
              <p style={{ fontSize: "12.5px", fontStyle: "italic", color: INK_MUTED, marginTop: "2px", marginBottom: "12px" }}>
                By {selectedText.author} ({selectedText.dateLabel})
              </p>

              <div style={{ borderLeft: `3px solid ${selectedText.coverColor}`, paddingLeft: "12px", marginBottom: "16px" }}>
                <p style={{ fontSize: "13px", lineHeight: "1.5", color: INK_SECONDARY, margin: 0 }}>
                  {selectedText.description}
                </p>
              </div>

              <div style={{ borderTop: "1px dashed rgba(156, 122, 47, 0.15)", paddingTop: "12px" }}>
                <span style={{ fontSize: "10.5px", fontWeight: 700, textTransform: "uppercase", color: GOLD_DEEP }}>
                  Pedagogical Role in Curriculum
                </span>
                <p style={{ fontSize: "12.5px", lineHeight: "1.45", color: INK_SECONDARY, marginTop: "2px", margin: 0 }}>
                  {selectedText.pedagogicalUse}
                </p>
              </div>
            </div>
          ) : (
            /* Compare view */
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <span style={{ fontSize: "10.5px", fontWeight: 700, textTransform: "uppercase", color: RED, textAlign: "center" }}>
                Ecosystem Chronology Comparison
              </span>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {/* Book 1 */}
                <div style={{ backgroundColor: "rgba(156, 122, 47, 0.03)", padding: "10px", borderRadius: "6px", borderTop: `3px solid ${selectedText.coverColor}` }}>
                  <h5 style={{ fontSize: "14px", fontWeight: 700, color: INK_PRIMARY, margin: 0 }}>
                    {selectedText.title}
                  </h5>
                  <span style={{ fontSize: "9.5px", color: INK_MUTED }}>{selectedText.author} ({selectedText.dateLabel})</span>
                  <p style={{ fontSize: "12px", lineHeight: "1.4", color: INK_SECONDARY, marginTop: "6px", margin: 0 }}>
                    {selectedText.description.slice(0, 120)}...
                  </p>
                  <div style={{ marginTop: "6px", borderTop: "1px dashed rgba(156, 122, 47, 0.1)", paddingTop: "4px", fontSize: "10.5px", fontWeight: 700, color: GOLD }}>
                    Role: {selectedText.role}
                  </div>
                </div>

                {/* Book 2 */}
                <div style={{ backgroundColor: "rgba(156, 122, 47, 0.03)", padding: "10px", borderRadius: "6px", borderTop: `3px solid ${compareText.coverColor}` }}>
                  <h5 style={{ fontSize: "14px", fontWeight: 700, color: INK_PRIMARY, margin: 0 }}>
                    {compareText.title}
                  </h5>
                  <span style={{ fontSize: "9.5px", color: INK_MUTED }}>{compareText.author} ({compareText.dateLabel})</span>
                  <p style={{ fontSize: "12px", lineHeight: "1.4", color: INK_SECONDARY, marginTop: "6px", margin: 0 }}>
                    {compareText.description.slice(0, 120)}...
                  </p>
                  <div style={{ marginTop: "6px", borderTop: "1px dashed rgba(156, 122, 47, 0.15)", paddingTop: "4px", fontSize: "10.5px", fontWeight: 700, color: GOLD }}>
                    Role: {compareText.role}
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: "rgba(217, 119, 6, 0.04)", border: "1px solid rgba(217, 119, 6, 0.2)", borderRadius: "6px", padding: "10px", fontSize: "12.5px" }}>
                <strong style={{ color: AMBER }}>Ecosystem Relationship:</strong>
                <p style={{ margin: "2px 0 0", color: INK_SECONDARY, lineHeight: "1.45" }}>
                  Selected works form part of the same historical arc. The Tājika canon relies on commentarial layers (like Tājika Sāra) to render the primary Sanskrit verses accessible for practical annual predictions.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
