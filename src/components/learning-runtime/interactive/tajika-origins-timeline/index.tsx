"use client";

import { useState } from "react";
import { Info, AlertTriangle, ArrowRight, BookOpen, Layers, CheckCircle2 } from "lucide-react";

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
    guardrailMystification: "Refuse the claim that Tājika methods existed in early Vedic texts; the specific yearly return formulas do not appear in Sanskrit prior to this reception."
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
    guardrailMystification: "Refuse the claim that Sahams were originally taught by Parāśara; they are direct algebraic adaptations of Hellenistic-Arabic Lots."
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
    guardrailMystification: "Refuse the claim that Munthā is an indigenous Sanskrit root word; it is the direct phonetic adaptation of the Arabic Intihā."
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
    guardrailMystification: "Refuse the claim that Ithasala and Isarapha are classical Parāśari aspects; they operate on numeric orbs, not sign-based sights."
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
    guardrailMystification: "Refuse the Akbar-era context denial; court patronage of multi-faith translation projects provided the enabling conditions for this synthesis."
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
    guardrailMystification: "Refuse the claim that modern Varṣaphala has discarded its Arabic roots; the terminology and calculation steps remain identical."
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

export function TajikaOriginsTimeline() {
  const [activeStep, setActiveStep] = useState(4); // Default to Akbar 1587 CE
  const [twoLayerMode, setTwoLayerMode] = useState(true);

  const active = MILESTONES[activeStep];

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
      data-interactive="tajika-origins-timeline"
    >
      {/* Header Banner */}
      <div style={{ borderBottom: "1px solid rgba(156, 122, 47, 0.12)", paddingBottom: "12px", marginBottom: "4px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Module 19 — Chapter 1 — Lesson 1
        </span>
        <h3 style={{ fontSize: "20px", fontWeight: 700, color: INK_PRIMARY, margin: "4px 0 0" }}>
          Tāzik to Tājika: The Chronological Sanskritization Axis
        </h3>
        <p style={{ fontSize: "12.5px", color: INK_SECONDARY, margin: "2px 0 0" }}>
          Act as a senior Vedic Astrologer and UI/UX developer to explore the transmission history and vocabulary shifts.
        </p>
      </div>

      {/* Timeline Track Visualizer */}
      <div style={{ position: "relative", marginBottom: "8px", padding: "10px 0" }}>
        {/* Continuous track line */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "5%",
            right: "5%",
            height: "3px",
            backgroundColor: "rgba(156, 122, 47, 0.12)",
            transform: "translateY(-50%)",
            zIndex: 1
          }}
        />
        {/* Active track highlight */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "5%",
            width: `${(activeStep / (MILESTONES.length - 1)) * 90}%`,
            height: "3px",
            backgroundColor: GOLD,
            transform: "translateY(-50%)",
            zIndex: 1,
            transition: "width 300ms ease"
          }}
        />

        {/* Timeline nodes */}
        <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 2, padding: "0 5%" }}>
          {MILESTONES.map((m, idx) => {
            const isActive = idx === activeStep;
            return (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: isActive ? "#ffffff" : "rgba(255, 255, 255, 0.4)",
                  border: `1.5px solid ${isActive ? GOLD : "rgba(156, 122, 47, 0.2)"}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: isActive ? "0 4px 12px rgba(156, 122, 47, 0.15)" : "none",
                  transition: "all 250ms ease",
                  padding: 0
                }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: isActive ? GOLD_DEEP : INK_SECONDARY,
                    fontFamily: "'Inter', sans-serif",
                    textAlign: "center",
                    lineHeight: 1.1
                  }}
                >
                  {m.year.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigator controls */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "4px 0" }}>
        <button
          onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
          disabled={activeStep === 0}
          style={{
            padding: "6px 12px",
            backgroundColor: "#ffffff",
            border: "1px solid rgba(156, 122, 47, 0.15)",
            borderRadius: "6px",
            cursor: activeStep === 0 ? "default" : "pointer",
            opacity: activeStep === 0 ? 0.4 : 1,
            color: GOLD_DEEP,
            fontWeight: 700,
            fontSize: "12px",
            fontFamily: "'Inter', sans-serif"
          }}
        >
          &larr; Previous Phase
        </button>
        <span style={{ fontSize: "13px", fontWeight: 700, color: INK_SECONDARY }}>
          Phase {activeStep + 1} of {MILESTONES.length}: {active.title}
        </span>
        <button
          onClick={() => setActiveStep(prev => Math.min(MILESTONES.length - 1, prev + 1))}
          disabled={activeStep === MILESTONES.length - 1}
          style={{
            padding: "6px 12px",
            backgroundColor: "#ffffff",
            border: "1px solid rgba(156, 122, 47, 0.15)",
            borderRadius: "6px",
            cursor: activeStep === MILESTONES.length - 1 ? "default" : "pointer",
            opacity: activeStep === MILESTONES.length - 1 ? 0.4 : 1,
            color: GOLD_DEEP,
            fontWeight: 700,
            fontSize: "12px",
            fontFamily: "'Inter', sans-serif"
          }}
        >
          Next Phase &rarr;
        </button>
      </div>

      {/* Main content display: White Card Panel */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid rgba(156, 122, 47, 0.12)",
          borderRadius: "8px",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "8px"
        }}
      >
        <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: RED }}>
          Historical Era: {active.era}
        </span>
        <h4 style={{ fontSize: "18px", fontWeight: 700, color: INK_PRIMARY, margin: 0 }}>
          {active.title}
        </h4>
        <p style={{ fontSize: "13.5px", lineHeight: "1.6", color: INK_SECONDARY, margin: 0 }}>
          {active.description}
        </p>
      </div>

      {/* Two-Layer Holding Drill Module */}
      <div style={{ background: "#ffffff", border: "1px solid rgba(156, 122, 47, 0.12)", borderRadius: "8px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Layers size={18} color={GOLD} />
            <div>
              <span style={{ fontWeight: 700, color: GOLD_DEEP, fontSize: "14px" }}>The Two-Layer Holding Lens</span>
              <p style={{ fontSize: "11px", color: INK_MUTED, margin: 0 }}>
                Differentiate legitimacy (Layer 1) from the Arabic-Persian transmission roots (Layer 2).
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
              padding: "4px 10px",
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
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "4px" }}>
            <div style={{ borderLeft: `3.5px solid ${GREEN}`, paddingLeft: "12px", background: "rgba(47, 125, 85, 0.04)", padding: "10px", borderRadius: "0 6px 6px 0" }}>
              <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: GREEN, letterSpacing: "0.05em" }}>
                Layer 1: Preserve Vedic Legitimacy
              </span>
              <p style={{ fontSize: "13px", lineHeight: "1.5", color: INK_SECONDARY, margin: "4px 0 0" }}>
                {active.layer1}
              </p>
            </div>
            <div style={{ borderLeft: `3.5px solid ${RED}`, paddingLeft: "12px", background: "rgba(162, 58, 30, 0.04)", padding: "10px", borderRadius: "0 6px 6px 0" }}>
              <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: RED, letterSpacing: "0.05em" }}>
                Layer 2: Acknowledge Islamic/Persian Origin
              </span>
              <p style={{ fontSize: "13px", lineHeight: "1.5", color: INK_SECONDARY, margin: "4px 0 0" }}>
                {active.layer2}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Vocabulary Sanskritization Board */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <h5 style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: GOLD_DEEP, margin: "0 0 4px" }}>
          Sanskritization Translation Matrix
        </h5>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {active.sanskritizationTerms.map((term, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto 1fr 1.5fr",
                alignItems: "center",
                padding: "10px 14px",
                backgroundColor: "#ffffff",
                border: "1px solid rgba(156, 122, 47, 0.12)",
                borderRadius: "8px"
              }}
            >
              <div>
                <strong style={{ color: RED, fontSize: "13px" }}>{term.arabic}</strong>
                <span style={{ fontSize: "10px", color: INK_MUTED, display: "block" }}>Arabic/Persian Source</span>
              </div>
              <div style={{ padding: "0 10px" }}><ArrowRight size={12} color={GOLD} /></div>
              <div>
                <strong style={{ color: GOLD_DEEP, fontSize: "14px" }}>{term.sanskrit}</strong>
                <span style={{ fontSize: "10px", color: INK_MUTED, display: "block" }}>{term.translit}</span>
              </div>
              <div style={{ color: INK_SECONDARY, fontSize: "12.5px", fontStyle: "italic", lineHeight: "1.3" }}>
                {term.meaning}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guardrail Warnings */}
      <div style={{ background: "#ffffff", border: "1px solid rgba(156, 122, 47, 0.12)", borderRadius: "8px", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <AlertTriangle size={16} color={GOLD} />
          <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: GOLD_DEEP }}>
            Astrological Discipline Guardrails
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div style={{ backgroundColor: "rgba(162, 58, 30, 0.03)", padding: "10px", borderRadius: "6px", border: "1px solid rgba(162, 58, 30, 0.08)" }}>
            <span style={{ fontSize: "10px", fontWeight: 700, color: RED, textTransform: "uppercase", display: "block", marginBottom: "2px" }}>
              Refuse Scoffing Over-claim
            </span>
            <p style={{ fontSize: "12px", lineHeight: "1.45", color: INK_SECONDARY, margin: 0 }}>
              {active.guardrailScoffing}
            </p>
          </div>
          <div style={{ backgroundColor: "rgba(162, 58, 30, 0.03)", padding: "10px", borderRadius: "6px", border: "1px solid rgba(162, 58, 30, 0.08)" }}>
            <span style={{ fontSize: "10px", fontWeight: 700, color: RED, textTransform: "uppercase", display: "block", marginBottom: "2px" }}>
              Refuse Mystification Purity-Claim
            </span>
            <p style={{ fontSize: "12px", lineHeight: "1.45", color: INK_SECONDARY, margin: 0 }}>
              {active.guardrailMystification}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
