"use client";

import { useState } from "react";
import { Info, AlertTriangle, ArrowRight, BookOpen, Layers, CheckCircle2, Navigation, Map } from "lucide-react";

interface Milestone {
  year: string;
  title: string;
  era: string;
  description: string;
  layer1: string; // Legitimacy
  layer2: string; // Arabic-Persian counterparts
  sanskritizationTerms: Array<{ arabic: string; sanskrit: string; translit: string; meaning: string }>;
  guardrailScoffing: string;
  guardrailMystification: string;
  activeNode: string; // node highlighted on map
}

const MILESTONES: Milestone[] = [
  {
    year: "Pre-12th C.",
    title: "Maritime Trade & Lore Contacts",
    era: "Pre-Sultanate Era",
    description: "Maritime and overland trade routes connected Indian ports with Persian and Arab merchants. Astrological exchange was limited to fragmented observations; no formal Sanskritization or translation had occurred yet.",
    layer1: "Indian classical astronomy (Siddhānta) was already mature, with canonical works from Aryabhata and Varāhamihira acting as the absolute mathematical authorities.",
    layer2: "Medieval Islamic scholars compiled Persian translations of Greek/Hellenistic systems, forming the core horoscopic models in Baghdad and Central Asia.",
    sanskritizationTerms: [
      { arabic: "Tāzik / Tājik", sanskrit: "तजिक", translit: "Tājika", meaning: "Arab/Persian people & their astrology" }
    ],
    guardrailScoffing: "Refuse the claim that India was isolated from Persian contact; trade routes had long been operational.",
    guardrailMystification: "Refuse the claim that Tājika methods existed in early Vedic texts; the specific yearly return formulas do not appear in Sanskrit prior to this reception.",
    activeNode: "Maritime"
  },
  {
    year: "1206-1300 CE",
    title: "Delhi Sultanate Arrivals",
    era: "Early Delhi Sultanate Reception",
    description: "The Delhi Sultanate brought Persian-influenced court astrologers to North India. Pundits and Persian court astronomers observed each other's distinct horoscopic methods side-by-side.",
    layer1: "Sanskrit pundits observed solar return calculations and noted their predictive efficacy for short-term annual timing.",
    layer2: "The source tradition was classical Islamic astrology, utilizing planetary lots (Sahm) and annual anniversary return charts.",
    sanskritizationTerms: [
      { arabic: "Sahm", sanskrit: "सहम", translit: "Saham", meaning: "Astrological Lot / Calculated algebraic degree" }
    ],
    guardrailScoffing: "Refuse the claim that Tājika is 'foreign-trash' that compromises Vedic values; the system was immediately mapped onto the sidereal zodiac.",
    guardrailMystification: "Refuse the claim that Sahams were originally taught by Parāśara; they are direct algebraic adaptations of Hellenistic-Arabic Lots.",
    activeNode: "Sultanate"
  },
  {
    year: "1300-1400 CE",
    title: "Court Translation & Patronage",
    era: "Bilingual Dynastic Exchange",
    description: "Sultans like Feroz Shah Tughlaq sponsored translations of astronomical and astrological works. Astrolabes and astrological tables were Sanskritized, establishing early bilingual manuscript threads.",
    layer1: "Vedic scholars adapted calculation tables to the Indian sidereal calendar, preserving coordinate accuracy.",
    layer2: "The astrolabe ('Yantra-Rāja') and solar-return algorithms (Varṣaphala) were documented in Sanskrit manuals.",
    sanskritizationTerms: [
      { arabic: "Intihā' / Muntahā", sanskrit: "मुन्था", translit: "Munthā", meaning: "Progressed Year Point (advancing 1 sign per year)" }
    ],
    guardrailScoffing: "Refuse the claim that borrowing astrolabes and return coordinates was a sign of astronomical inferiority; it was standard scientific synthesis.",
    guardrailMystification: "Refuse the claim that Munthā is an indigenous Sanskrit root word; it is the direct phonetic adaptation of the Arabic Intihā.",
    activeNode: "Translation"
  },
  {
    year: "1400-1550 CE",
    title: "Early Systematization",
    era: "Pre-Nilakantha Textual Phase",
    description: "Sanskrit scholars systematically translated Persian-Arabic horoscopic mechanics into Sanskrit verse (ślokas). They mapped the Arabic aspect system onto the Sanskrit concept of Yogas.",
    layer1: "Tājika became a fully recognized branch of Sanskrit jyotiṣa, using classical poetic meters to state the rules.",
    layer2: "The 16 Tājika Yogas were formulated, converting Arabic aspect configurations and planetary strengths (Tajrabah) into Sanskritized yoga formulas.",
    sanskritizationTerms: [
      { arabic: "Ittiṣāl", sanskrit: "इत्थशाल", translit: "Ithasala", meaning: "Applying Aspect (exact mathematical conjunction)" },
      { arabic: "Inṣirāf", sanskrit: "इशराफ", translit: "Isarapha", meaning: "Separating Aspect" }
    ],
    guardrailScoffing: "Refuse the claim that Sanskritized Tājika was just a superficial translation; it was a deep methodological integration.",
    guardrailMystification: "Refuse the claim that Ithasala and Isarapha are classical Parāśari aspects; they operate on numeric orbs, not sign-based sights.",
    activeNode: "Systematize"
  },
  {
    year: "1587 CE",
    title: "Tājika Nīlakaṇṭhī Masterpiece",
    era: "Mughal Empire (Reign of Akbar)",
    description: "Pandit Nīlakaṇṭha composed the canonical Tājika Nīlakaṇṭhī in 1587 CE, during the peak of Mughal cross-cultural patronage. This text became the definitive, comprehensive Sanskrit reference work for the tradition.",
    layer1: "Nīlakaṇṭha established a rigorous six-tantra structure that unified all Tājika techniques under a classical Brāhmaṇical presentation.",
    layer2: "The text openly acknowledges Arabic-Persian sources, using Sanskritization to bridge the two intellectual spheres.",
    sanskritizationTerms: [
      { arabic: "Qabūl / Al-Qabūl", sanskrit: "कम्बूल", translit: "Kambūla", meaning: "Planetary Reception (aspect strength helper)" }
    ],
    guardrailScoffing: "Refuse the claim that Tājika Nīlakaṇṭhī is not Vedic; it employs the sidereal zodiac and aligns with Parāśarī house significations.",
    guardrailMystification: "Refuse the Akbar-era context denial; court patronage of multi-faith translation projects provided the enabling conditions for this synthesis.",
    activeNode: "Mughal"
  },
  {
    year: "17th C. - Modern",
    title: "Commentary Loops & Living Practice",
    era: "Textual Evolution & Continuous Practice",
    description: "Commentaries like Hari Bhaṭṭa's Tājika Sāra (17th c.) expanded on the Nīlakaṇṭhī. Today, modern masters like K.N. Rao and V.P. Goel integrate Tājika Varṣaphala directly into their client consultation workflows.",
    layer1: "Varṣaphala (solar returns) is practiced globally by millions of Vedic astrologers as a complementary annual layer.",
    layer2: "Modern software cast returns using sidereal coordinates and compute the 50 Sahams instantly.",
    sanskritizationTerms: [
      { arabic: "Waz'", sanskrit: "मनाऊ", translit: "Manaau", meaning: "Planetary Debility / Obstruction of aspect" }
    ],
    guardrailScoffing: "Refuse the claim that Tājika is obsolete; it remains the most mathematically sound system for annual return timing in astrology.",
    guardrailMystification: "Refuse the claim that modern Varṣaphala has discarded its Arabic roots; the terminology and calculation steps remain identical.",
    activeNode: "Modern"
  }
];

const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GREEN = "#2F7D55";
const RED = "#A23A1E";
const LIGHT_BG = "#FCFAF2";

export function TajikaOriginsTimeline() {
  const [activeStep, setActiveStep] = useState(4); // Default to Akbar 1587 CE
  const [twoLayerMode, setTwoLayerMode] = useState(true);

  const active = MILESTONES[activeStep];

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
      data-interactive="tajika-origins-timeline"
    >
      {/* Header Banner */}
      <div style={{ borderBottom: "1px solid rgba(156, 122, 47, 0.15)", paddingBottom: "14px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Module 19 — Chapter 1 — Lesson 1
        </span>
        <h3 style={{ fontSize: "22px", fontWeight: 800, color: INK_PRIMARY, margin: "6px 0 0", fontFamily: "var(--font-cormorant), serif" }}>
          Tāzik to Tājika: The Chronological Sanskritization Axis
        </h3>
        <p style={{ fontSize: "13.5px", color: INK_SECONDARY, margin: "4px 0 0", lineHeight: "1.4" }}>
          Explore the historical transmission of solar returns (Varṣaphala), lots (Saham), and aspects (Yogas) from Greek and Arab-Persian realms into the classical Sanskrit astrological corpus.
        </p>
      </div>

      {/* Interactive Map & Path SVG Container */}
      <div 
        style={{ 
          background: "#ffffff", 
          border: "1px solid rgba(156, 122, 47, 0.15)", 
          borderRadius: "10px", 
          padding: "16px",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <Map size={18} color={GOLD_DEEP} />
          <span style={{ fontSize: "12px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Transmission Journey Map (Click nodes or timeline below to navigate)
          </span>
        </div>

        <svg 
          viewBox="0 0 800 280" 
          style={{ 
            width: "100%", 
            height: "auto", 
            backgroundColor: LIGHT_BG, 
            borderRadius: "6px",
            border: "1px solid rgba(156, 122, 47, 0.08)"
          }}
          aria-label="Transmission map of Tajik astrology to Sanskrit Jyotish"
        >
          {/* Grid Background/Parchment lines */}
          <line x1="50" y1="0" x2="50" y2="280" stroke="rgba(156, 122, 47, 0.03)" />
          <line x1="200" y1="0" x2="200" y2="280" stroke="rgba(156, 122, 47, 0.03)" />
          <line x1="350" y1="0" x2="350" y2="280" stroke="rgba(156, 122, 47, 0.03)" />
          <line x1="500" y1="0" x2="500" y2="280" stroke="rgba(156, 122, 47, 0.03)" />
          <line x1="650" y1="0" x2="650" y2="280" stroke="rgba(156, 122, 47, 0.03)" />

          {/* Region Borders and Labels */}
          {/* Baghdad/Persia */}
          <rect x="20" y="20" width="160" height="240" rx="6" fill="rgba(162, 58, 30, 0.02)" stroke="rgba(162, 58, 30, 0.06)" strokeDasharray="3,3" />
          <text x="30" y="40" fontSize="11" fontWeight="700" fill={RED} opacity="0.6" letterSpacing="0.05em">ARAB-PERSIAN REALM</text>
          
          {/* India */}
          <rect x="220" y="20" width="360" height="240" rx="6" fill="rgba(47, 125, 85, 0.02)" stroke="rgba(47, 125, 85, 0.06)" strokeDasharray="3,3" />
          <text x="230" y="40" fontSize="11" fontWeight="700" fill={GREEN} opacity="0.6" letterSpacing="0.05em">SANSKRIT JYOTIṢA SPHERE</text>

          {/* Global */}
          <rect x="600" y="20" width="180" height="240" rx="6" fill="rgba(156, 122, 47, 0.02)" stroke="rgba(156, 122, 47, 0.06)" strokeDasharray="3,3" />
          <text x="610" y="40" fontSize="11" fontWeight="700" fill={GOLD_DEEP} opacity="0.6" letterSpacing="0.05em">GLOBAL PRACTICE</text>

          {/* Maritime Route wave lines (Pre-12th C. visual indicators) */}
          <path d="M 60,180 Q 140,230 250,220 T 440,240" fill="none" stroke="rgba(156, 122, 47, 0.15)" strokeWidth="1.5" strokeDasharray="4,4" />
          <text x="110" y="225" fontSize="10.5" fontStyle="italic" fill={INK_MUTED}>Maritime trade contacts</text>

          {/* Core Transmission Paths (Baghdad -> Delhi -> Agra -> South India / Global) */}
          {/* Path 1: Baghdad to Gujarat (Maritime) */}
          <path 
            d="M 100,130 Q 180,210 260,200" 
            fill="none" 
            stroke={activeStep >= 0 ? RED : "rgba(156, 122, 47, 0.15)"} 
            strokeWidth={activeStep === 0 ? "3.5" : "1.5"} 
            strokeDasharray={activeStep === 0 ? "none" : "5,5"}
            style={{ transition: "stroke-dasharray 0.2s, stroke-width 0.2s" }}
          />
          {/* Path 2: Baghdad to Delhi (Sultanate) */}
          <path 
            d="M 100,130 C 190,90 270,75 350,90" 
            fill="none" 
            stroke={activeStep >= 1 ? RED : "rgba(156, 122, 47, 0.15)"} 
            strokeWidth={activeStep === 1 ? "3.5" : "1.5"}
            strokeDasharray={activeStep === 1 ? "none" : "5,5"}
          />
          {/* Path 3: Delhi to Agra (Mughal court translation) */}
          <path 
            d="M 350,90 Q 395,95 440,110" 
            fill="none" 
            stroke={activeStep >= 2 ? GOLD : "rgba(156, 122, 47, 0.15)"} 
            strokeWidth={activeStep === 2 || activeStep === 4 ? "3.5" : "1.5"}
            strokeDasharray={activeStep === 2 ? "none" : "5,5"}
          />
          {/* Path 4: Agra to South India (Systematization) */}
          <path 
            d="M 440,110 C 420,165 400,205 420,230" 
            fill="none" 
            stroke={activeStep >= 3 ? GREEN : "rgba(156, 122, 47, 0.15)"} 
            strokeWidth={activeStep === 3 ? "3.5" : "1.5"}
            strokeDasharray={activeStep === 3 ? "none" : "5,5"}
          />
          {/* Path 5: India to Global (Modern) */}
          <path 
            d="M 440,110 C 530,110 590,130 680,130" 
            fill="none" 
            stroke={activeStep >= 5 ? GOLD : "rgba(156, 122, 47, 0.15)"} 
            strokeWidth={activeStep === 5 ? "3.5" : "1.5"}
            strokeDasharray={activeStep === 5 ? "none" : "5,5"}
          />

          {/* Interactive Geographic Nodes */}
          {/* Node 1: Baghdad */}
          <g transform="translate(100, 130)" cursor="pointer" onClick={() => setActiveStep(0)}>
            <circle r="12" fill={active.activeNode === "Maritime" ? RED : "#ffffff"} stroke={RED} strokeWidth="2.5" />
            <circle r="6" fill={RED} opacity={active.activeNode === "Maritime" ? 1 : 0.4} />
            <text x="18" y="4" fontSize="12" fontWeight="800" fill={INK_PRIMARY}>Baghdad</text>
            <text x="18" y="16" fontSize="10" fill={INK_MUTED}>Hellenistic-Arabic Synthesis</text>
          </g>

          {/* Node 2: Gujarat Port */}
          <g transform="translate(260, 200)" cursor="pointer" onClick={() => setActiveStep(0)}>
            <circle r="9" fill={active.activeNode === "Maritime" ? RED : "#ffffff"} stroke={GOLD} strokeWidth="2" />
            <text x="14" y="4" fontSize="11" fontWeight="700" fill={INK_SECONDARY}>Gujarat Ports</text>
          </g>

          {/* Node 3: Delhi */}
          <g transform="translate(350, 90)" cursor="pointer" onClick={() => setActiveStep(1)}>
            <circle r="12" fill={active.activeNode === "Sultanate" || active.activeNode === "Translation" ? RED : "#ffffff"} stroke={RED} strokeWidth="2.5" />
            <circle r="6" fill={RED} opacity={active.activeNode === "Sultanate" || active.activeNode === "Translation" ? 1 : 0.4} />
            <text x="-40" y="-18" fontSize="12" fontWeight="800" fill={INK_PRIMARY}>Delhi Sultanate</text>
            <text x="-40" y="-6" fontSize="10" fill={INK_MUTED}>Early Reception</text>
          </g>

          {/* Node 4: Agra / Mughal Court */}
          <g transform="translate(440, 110)" cursor="pointer" onClick={() => setActiveStep(4)}>
            <circle r="14" fill={active.activeNode === "Mughal" ? GOLD : "#ffffff"} stroke={GOLD} strokeWidth="3" />
            <circle r="7" fill={GOLD} opacity={active.activeNode === "Mughal" ? 1 : 0.4} />
            <text x="20" y="4" fontSize="12" fontWeight="800" fill={INK_PRIMARY}>Agra Court</text>
            <text x="20" y="16" fontSize="10" fontWeight="700" fill={GOLD_DEEP}>1587 Nīlakaṇṭhī</text>
          </g>

          {/* Node 5: Varanasi / South India */}
          <g transform="translate(420, 230)" cursor="pointer" onClick={() => setActiveStep(3)}>
            <circle r="12" fill={active.activeNode === "Systematize" ? GREEN : "#ffffff"} stroke={GREEN} strokeWidth="2.5" />
            <circle r="6" fill={GREEN} opacity={active.activeNode === "Systematize" ? 1 : 0.4} />
            <text x="18" y="4" fontSize="12" fontWeight="800" fill={INK_PRIMARY}>South / East India</text>
            <text x="18" y="16" fontSize="10" fill={INK_MUTED}>Sanskritization of Yogas</text>
          </g>

          {/* Node 6: Global Reach */}
          <g transform="translate(680, 130)" cursor="pointer" onClick={() => setActiveStep(5)}>
            <circle r="12" fill={active.activeNode === "Modern" ? GOLD_DEEP : "#ffffff"} stroke={GOLD_DEEP} strokeWidth="2.5" />
            <circle r="6" fill={GOLD_DEEP} opacity={active.activeNode === "Modern" ? 1 : 0.4} />
            <text x="-40" y="-18" fontSize="12" fontWeight="800" fill={INK_PRIMARY}>Global Era</text>
            <text x="-40" y="-6" fontSize="10" fill={INK_MUTED}>Modern Software & Study</text>
          </g>

          {/* Dynamic Map Information Banner */}
          <g transform="translate(250, 140)">
            <rect width="200" height="42" rx="4" fill="#ffffff" stroke="rgba(156, 122, 47, 0.15)" strokeWidth="1" />
            <text x="10" y="16" fontSize="9.5" fontWeight="700" fill={GOLD_DEEP} letterSpacing="0.05em">ACTIVE MAP SECTOR</text>
            <text x="10" y="32" fontSize="12.5" fontWeight="800" fill={INK_PRIMARY}>
              {active.activeNode === "Maritime" && "Trade & Coastal Nodes"}
              {active.activeNode === "Sultanate" && "Sultanate Astronomy Hub"}
              {active.activeNode === "Translation" && "Bilingual Text Teams"}
              {active.activeNode === "Systematize" && "Sanskrit Verse Translation"}
              {active.activeNode === "Mughal" && "Nilakanthi Masterpiece (1587)"}
              {active.activeNode === "Modern" && "Commentary Loops to Present"}
            </text>
          </g>
        </svg>
      </div>

      {/* Timeline Buttons Navigation */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Chronological Steps:
        </span>
        <div 
          style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(6, 1fr)", 
            gap: "8px" 
          }}
        >
          {MILESTONES.map((m, idx) => {
            const isActive = idx === activeStep;
            return (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                style={{
                  padding: "10px 4px",
                  borderRadius: "8px",
                  backgroundColor: isActive ? GOLD : "rgba(255, 255, 255, 0.6)",
                  border: `1.5px solid ${isActive ? GOLD_DEEP : "rgba(156, 122, 47, 0.15)"}`,
                  color: isActive ? "#ffffff" : INK_SECONDARY,
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: 700,
                  transition: "all 200ms ease",
                  textAlign: "center"
                }}
              >
                <div style={{ fontSize: "10px", opacity: isActive ? 0.9 : 0.7 }}>{m.year}</div>
                <div style={{ fontSize: "11px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {m.title.split(" ")[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Timeline Controls (Previous/Next) */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "4px 0" }}>
        <button
          onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
          disabled={activeStep === 0}
          style={{
            padding: "8px 14px",
            backgroundColor: "#ffffff",
            border: "1px solid rgba(156, 122, 47, 0.2)",
            borderRadius: "6px",
            cursor: activeStep === 0 ? "default" : "pointer",
            opacity: activeStep === 0 ? 0.4 : 1,
            color: GOLD_DEEP,
            fontWeight: 700,
            fontSize: "12.5px"
          }}
        >
          &larr; Previous Phase
        </button>
        <span style={{ fontSize: "14px", fontWeight: 700, color: INK_SECONDARY }}>
          Phase {activeStep + 1} of {MILESTONES.length}: <strong style={{ color: GOLD_DEEP }}>{active.title}</strong>
        </span>
        <button
          onClick={() => setActiveStep(prev => Math.min(MILESTONES.length - 1, prev + 1))}
          disabled={activeStep === MILESTONES.length - 1}
          style={{
            padding: "8px 14px",
            backgroundColor: "#ffffff",
            border: "1px solid rgba(156, 122, 47, 0.2)",
            borderRadius: "6px",
            cursor: activeStep === MILESTONES.length - 1 ? "default" : "pointer",
            opacity: activeStep === MILESTONES.length - 1 ? 0.4 : 1,
            color: GOLD_DEEP,
            fontWeight: 700,
            fontSize: "12.5px"
          }}
        >
          Next Phase &rarr;
        </button>
      </div>

      {/* Main content display: White Card Panel */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid rgba(156, 122, 47, 0.15)",
          borderRadius: "8px",
          padding: "20px",
          boxShadow: "0 2px 8px rgba(156, 122, 47, 0.02)"
        }}
      >
        <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: RED }}>
          Historical Era: {active.era}
        </span>
        <h4 style={{ fontSize: "19px", fontWeight: 700, color: INK_PRIMARY, marginTop: "4px", marginBottom: "8px", fontFamily: "var(--font-cormorant), serif" }}>
          {active.title} ({active.year})
        </h4>
        <p style={{ fontSize: "14px", lineHeight: "1.6", color: INK_SECONDARY, margin: 0 }}>
          {active.description}
        </p>
      </div>

      {/* Two-Layer Holding Drill Module */}
      <div style={{ background: "#ffffff", border: "1px solid rgba(156, 122, 47, 0.15)", borderRadius: "8px", padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Layers size={18} color={GOLD} />
            <div>
              <span style={{ fontWeight: 700, color: GOLD_DEEP, fontSize: "14.5px" }}>The Two-Layer Holding Lens</span>
              <p style={{ fontSize: "11px", color: INK_MUTED, margin: 0 }}>
                Differentiate technical adaptation (Sanskrit Jyotish parameters) from Persian-Arabic origin roots.
              </p>
            </div>
          </div>
          <button
            onClick={() => setTwoLayerMode(prev => !prev)}
            style={{
              backgroundColor: twoLayerMode ? GOLD : "transparent",
              color: twoLayerMode ? "#ffffff" : GOLD,
              border: `1px solid ${GOLD}`,
              borderRadius: "4px",
              padding: "6px 12px",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "11px",
              textTransform: "uppercase",
              transition: "all 150ms ease"
            }}
          >
            {twoLayerMode ? "Hide Details" : "Expose Details"}
          </button>
        </div>

        {twoLayerMode && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={{ borderLeft: `4px solid ${GREEN}`, padding: "12px", background: "rgba(47, 125, 85, 0.03)", borderRadius: "0 6px 6px 0" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: GREEN, letterSpacing: "0.05em" }}>
                Layer 1: Sanskritization & Vedic Legitimacy
              </span>
              <p style={{ fontSize: "13px", lineHeight: "1.5", color: INK_SECONDARY, marginTop: "6px", margin: 0 }}>
                {active.layer1}
              </p>
            </div>
            <div style={{ borderLeft: `4px solid ${RED}`, padding: "12px", background: "rgba(162, 58, 30, 0.03)", borderRadius: "0 6px 6px 0" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: RED, letterSpacing: "0.05em" }}>
                Layer 2: Historic Arab-Persian Source
              </span>
              <p style={{ fontSize: "13px", lineHeight: "1.5", color: INK_SECONDARY, marginTop: "6px", margin: 0 }}>
                {active.layer2}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Vocabulary Sanskritization Board */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: GOLD_DEEP }}>
          Sanskritization Terminology Shifts
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {active.sanskritizationTerms.map((term, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto 1.2fr 1.5fr",
                alignItems: "center",
                padding: "12px 16px",
                backgroundColor: "#ffffff",
                border: "1px solid rgba(156, 122, 47, 0.15)",
                borderRadius: "8px"
              }}
            >
              <div>
                <strong style={{ color: RED, fontSize: "14px" }}>{term.arabic}</strong>
                <span style={{ fontSize: "10px", color: INK_MUTED, display: "block" }}>Arabic/Persian Source</span>
              </div>
              <div style={{ padding: "0 12px" }}><ArrowRight size={14} color={GOLD} /></div>
              <div>
                <strong style={{ color: GOLD_DEEP, fontSize: "15px", fontFamily: "var(--font-cormorant), serif" }}>{term.sanskrit}</strong>
                <span style={{ fontSize: "10px", color: INK_MUTED, display: "block" }}>{term.translit}</span>
              </div>
              <div style={{ color: INK_SECONDARY, fontSize: "13px", fontStyle: "italic", lineHeight: "1.4" }}>
                {term.meaning}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guardrail Warnings */}
      <div style={{ background: "#ffffff", border: "1px solid rgba(156, 122, 47, 0.15)", borderRadius: "8px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <AlertTriangle size={16} color={GOLD_DEEP} />
          <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: GOLD_DEEP }}>
            Astrological Discipline Guardrails
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div style={{ backgroundColor: "rgba(162, 58, 30, 0.02)", padding: "12px", borderRadius: "6px", border: "1px solid rgba(162, 58, 30, 0.08)" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: RED, textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
              Refuse Scoffing (Isolate View)
            </span>
            <p style={{ fontSize: "12.5px", lineHeight: "1.5", color: INK_SECONDARY, margin: 0 }}>
              {active.guardrailScoffing}
            </p>
          </div>
          <div style={{ backgroundColor: "rgba(162, 58, 30, 0.02)", padding: "12px", borderRadius: "6px", border: "1px solid rgba(162, 58, 30, 0.08)" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: RED, textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
              Refuse Mystification (Pure View)
            </span>
            <p style={{ fontSize: "12.5px", lineHeight: "1.5", color: INK_SECONDARY, margin: 0 }}>
              {active.guardrailMystification}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
