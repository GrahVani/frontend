"use client";

import { useState } from "react";
import { Search, Filter, BookOpen, Layers, CheckCircle2, ChevronRight, Inbox } from "lucide-react";

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
  coverColor: string;
  drawerY: number; // Y position in the SVG chest
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
    coverColor: "#9C7A2F", // Mughal Gold
    drawerY: 15
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
    coverColor: "#A23A1E", // Royal Vermilion
    drawerY: 50
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
    coverColor: "#B59F6D", // Parchment Gold
    drawerY: 85
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
    coverColor: "#8E7B5E", // Leather Brown
    drawerY: 120
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
    coverColor: "#2F7D55", // Jade Green
    drawerY: 155
  }
];

const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
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

  const handleSelectText = (slug: string) => {
    if (compareMode) {
      if (slug !== selectedSlug) {
        setCompareSlug(slug);
      }
    } else {
      setSelectedSlug(slug);
    }
  };

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{
        padding: "24px",
        borderRadius: "14px",
        background: "rgba(255, 253, 246, 0.85)",
        border: "1px solid rgba(156, 122, 47, 0.2)",
        boxShadow: "0 10px 40px rgba(156, 122, 47, 0.08)",
        fontFamily: "'Inter', sans-serif",
        color: INK_PRIMARY,
        maxWidth: "960px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
      }}
      data-interactive="tajika-texts-catalogue"
    >
      {/* Header section */}
      <div style={{ borderBottom: "1px solid rgba(156, 122, 47, 0.15)", paddingBottom: "14px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Module 19 — Chapter 1 — Lesson 3
        </span>
        <h3 style={{ fontSize: "22px", fontWeight: 800, color: INK_PRIMARY, margin: "6px 0 0", fontFamily: "var(--font-cormorant), serif" }}>
          Tājika Canonical Literature Catalogue
        </h3>
        <p style={{ fontSize: "13.5px", color: INK_SECONDARY, margin: "4px 0 0", lineHeight: "1.4" }}>
          Explore commentaries, auxiliary treatises, and modern applications surrounding the canonical core.
        </p>
      </div>

      {/* Filters section */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          alignItems: "center",
          backgroundColor: "#ffffff",
          border: "1px solid rgba(156, 122, 47, 0.15)",
          borderRadius: "8px",
          padding: "14px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11.5px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          <Filter size={14} /> Filters:
        </div>

        {/* Search */}
        <div style={{ position: "relative", flex: 1, minWidth: "180px" }}>
          <Search size={14} color={GOLD} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            placeholder="Search catalog..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px 8px 32px",
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
            padding: "8px 12px",
            border: "1px solid rgba(156, 122, 47, 0.15)",
            borderRadius: "6px",
            backgroundColor: "#ffffff",
            fontSize: "13px",
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
            padding: "8px 12px",
            border: "1px solid rgba(156, 122, 47, 0.15)",
            borderRadius: "6px",
            backgroundColor: "#ffffff",
            fontSize: "13px",
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
            padding: "8px 12px",
            border: "1px solid rgba(156, 122, 47, 0.15)",
            borderRadius: "6px",
            backgroundColor: "#ffffff",
            fontSize: "13px",
            color: INK_PRIMARY
          }}
        >
          <option value="All">All Languages</option>
          <option value="Sanskrit">Sanskrit</option>
          <option value="Bilingual">Bilingual</option>
          <option value="English / Hindi">English / Hindi</option>
        </select>
      </div>

      {/* Main Interactive Chest Board */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px", alignItems: "start" }}>
        
        {/* Left: Interactive Manuscript Chest Drawer */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid rgba(156, 122, 47, 0.15)",
            borderRadius: "10px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <span style={{ fontSize: "12px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "14px" }}>
            The Grantha Chest (Click drawer to pull out text)
          </span>

          <svg 
            viewBox="0 0 380 200" 
            style={{ 
              width: "100%", 
              maxWidth: "340px",
              height: "auto"
            }}
            aria-label="Grantha manuscript drawer chest"
          >
            {/* Wooden Cabinet Frame */}
            <rect x="15" y="10" width="350" height="180" fill="#E8DBC3" stroke="#BCA374" strokeWidth="2.5" rx="4" />
            <rect x="20" y="15" width="340" height="170" fill="#FCFAF2" stroke="#BCA374" strokeWidth="1" />

            {/* Drawers */}
            {TEXTS.map((t, idx) => {
              const isSelected = t.slug === selectedSlug;
              const isCompare = t.slug === compareSlug && compareMode;
              const isActive = isSelected || isCompare;
              
              // Drawer coordinates
              const drawerHeight = 28;
              const xPos = isActive ? 35 : 25; // Pull out drawer animation offset
              
              return (
                <g 
                  key={t.slug} 
                  cursor="pointer" 
                  onClick={() => handleSelectText(t.slug)}
                  style={{ transition: "transform 200ms ease" }}
                >
                  {/* Drawer Slot shadow */}
                  <rect x="25" y={t.drawerY} width="330" height={drawerHeight} fill="#E2D4B6" rx="2" />
                  
                  {/* Drawer Face */}
                  <rect 
                    x={xPos} 
                    y={t.drawerY} 
                    width="330" 
                    height={drawerHeight} 
                    fill={isActive ? (isCompare ? "rgba(162, 58, 30, 0.05)" : "rgba(156, 122, 47, 0.05)") : "#FAF6EE"} 
                    stroke={isCompare ? RED : (isSelected ? GOLD : "#C8B188")} 
                    strokeWidth={isActive ? "2.5" : "1"} 
                    rx="2" 
                  />

                  {/* Brass Label Bracket */}
                  <rect x={xPos + 20} y={t.drawerY + 6} width="85" height="16" fill="#F4EAD4" stroke="#C8B188" strokeWidth="1" rx="1" />
                  <text 
                    x={xPos + 62.5} 
                    y={t.drawerY + 17} 
                    fill={isCompare ? RED : (isSelected ? GOLD_DEEP : INK_SECONDARY)} 
                    fontSize="9" 
                    fontWeight="800" 
                    textAnchor="middle"
                    letterSpacing="0.05em"
                  >
                    {t.title.split(" ")[0]}
                  </text>

                  {/* Drawer Handle */}
                  <path 
                    d={`M ${xPos + 160} ${t.drawerY + 14} Q ${xPos + 170} ${t.drawerY + 22} ${xPos + 180} ${t.drawerY + 14}`} 
                    fill="none" 
                    stroke={isActive ? GOLD : "#8A7550"} 
                    strokeWidth="3.5" 
                    strokeLinecap="round" 
                  />

                  {/* Century Marker Label */}
                  <text 
                    x={xPos + 310} 
                    y={t.drawerY + 18} 
                    fill={INK_MUTED} 
                    fontSize="10" 
                    fontWeight="700" 
                    textAnchor="end"
                  >
                    {t.dateLabel}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Toggle Compare Mode */}
          <button
            onClick={() => setCompareMode(prev => !prev)}
            style={{
              marginTop: "16px",
              width: "100%",
              padding: "10px",
              backgroundColor: compareMode ? RED : "transparent",
              color: compareMode ? "#ffffff" : RED,
              border: `1.5px solid ${RED}`,
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: "12px",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 150ms ease"
            }}
          >
            {compareMode ? "Deactivate Compare" : "Compare Two Manuscript Drawers"}
          </button>
        </div>

        {/* Right: Reading Stand detail card */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid rgba(156, 122, 47, 0.15)",
            borderRadius: "10px",
            padding: "20px",
            boxShadow: "0 2px 10px rgba(156, 122, 47, 0.02)"
          }}
        >
          {!compareMode ? (
            /* Single view */
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
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

              <h4 style={{ fontSize: "20px", fontWeight: 800, color: INK_PRIMARY, margin: 0, fontFamily: "var(--font-cormorant), serif" }}>
                {selectedText.title}
              </h4>
              <p style={{ fontSize: "13px", fontStyle: "italic", color: INK_MUTED, marginTop: "-4px" }}>
                By {selectedText.author} ({selectedText.dateLabel})
              </p>

              <div style={{ borderLeft: `4px solid ${selectedText.coverColor}`, paddingLeft: "12px" }}>
                <p style={{ fontSize: "14px", lineHeight: "1.6", color: INK_SECONDARY, margin: 0 }}>
                  {selectedText.description}
                </p>
              </div>

              <div style={{ borderTop: "1px dashed rgba(156, 122, 47, 0.2)", paddingTop: "12px", marginTop: "4px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: GOLD_DEEP, letterSpacing: "0.05em" }}>
                  Pedagogical Role in Curriculum
                </span>
                <p style={{ fontSize: "13px", lineHeight: "1.5", color: INK_SECONDARY, marginTop: "4px", margin: 0 }}>
                  {selectedText.pedagogicalUse}
                </p>
              </div>
            </div>
          ) : (
            /* Compare view */
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: RED, textAlign: "center", letterSpacing: "0.08em" }}>
                Ecosystem Chronology Comparison
              </span>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {/* Book 1 */}
                <div style={{ backgroundColor: "rgba(156, 122, 47, 0.03)", padding: "12px", borderRadius: "8px", borderTop: `4px solid ${selectedText.coverColor}` }}>
                  <h5 style={{ fontSize: "15px", fontWeight: 800, color: INK_PRIMARY, margin: 0, fontFamily: "var(--font-cormorant), serif" }}>
                    {selectedText.title}
                  </h5>
                  <span style={{ fontSize: "10px", color: INK_MUTED }}>{selectedText.author} ({selectedText.dateLabel})</span>
                  <p style={{ fontSize: "12.5px", lineHeight: "1.5", color: INK_SECONDARY, marginTop: "6px", margin: 0 }}>
                    {selectedText.description.slice(0, 140)}...
                  </p>
                  <div style={{ marginTop: "6px", borderTop: "1px dashed rgba(156, 122, 47, 0.1)", paddingTop: "4px", fontSize: "11px", fontWeight: 700, color: GOLD }}>
                    Role: {selectedText.role}
                  </div>
                </div>

                {/* Book 2 */}
                <div style={{ backgroundColor: "rgba(156, 122, 47, 0.03)", padding: "12px", borderRadius: "8px", borderTop: `4px solid ${compareText.coverColor}` }}>
                  <h5 style={{ fontSize: "15px", fontWeight: 800, color: INK_PRIMARY, margin: 0, fontFamily: "var(--font-cormorant), serif" }}>
                    {compareText.title}
                  </h5>
                  <span style={{ fontSize: "10px", color: INK_MUTED }}>{compareText.author} ({compareText.dateLabel})</span>
                  <p style={{ fontSize: "12.5px", lineHeight: "1.5", color: INK_SECONDARY, marginTop: "6px", margin: 0 }}>
                    {compareText.description.slice(0, 140)}...
                  </p>
                  <div style={{ marginTop: "6px", borderTop: "1px dashed rgba(156, 122, 47, 0.15)", paddingTop: "4px", fontSize: "11px", fontWeight: 700, color: GOLD }}>
                    Role: {compareText.role}
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: "rgba(217, 119, 6, 0.04)", border: "1px solid rgba(217, 119, 6, 0.2)", borderRadius: "8px", padding: "12px", fontSize: "13px" }}>
                <strong style={{ color: AMBER, display: "block", marginBottom: "2px" }}>Ecosystem Relationship:</strong>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: "1.5" }}>
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
