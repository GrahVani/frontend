"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  ArrowRight,
  Calendar,
  Layers,
  BookOpen,
  AlertTriangle,
  Award,
  Book,
} from "lucide-react";
import { ink, goldOnGlassHairline } from "@/design-tokens/grahvani-learning/colors";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary, #3E2A1F)";
const INK_SECONDARY = "var(--gl-ink-secondary, #5C3D26)";
const GOLD = "#A8821E";
const VERMILION = "#A23A1E";
const GREEN = "#2E7D32";

interface Stratum {
  layerName: string;
  sanskritExample: string;
  englishExplanation: string;
}

interface CanonText {
  id: string;
  title: string;
  sanskrit: string;
  academicDate: string;
  academicYearVal: number;
  traditionalDate: string;
  traditionalYearVal: number;
  recension: "Low" | "Moderate" | "Major";
  description: string;
  strata: Stratum[];
  guardrail: string;
}

const CANON_TEXTS: CanonText[] = [
  {
    id: "yavanajataka",
    title: "Yavanajātaka (Sphujidhvaja)",
    sanskrit: "यवनजातक",
    academicDate: "269 CE (Colophon date)",
    academicYearVal: 269,
    traditionalDate: "2nd century CE",
    traditionalYearVal: 150,
    recension: "Low",
    description: "The earliest surviving substantial Sanskrit treatise on horoscopic astrology (Phalita Jyotiṣa), presenting the Sanskritisation of a Hellenistic Greek text.",
    strata: [
      {
        layerName: "1. Hellenistic Greek Core",
        sanskritExample: "होरा (hōra) · लिप्ता (liptā) · द्रक्काण (drekkāṇa)",
        englishExplanation: "Core horoscopic techniques (aspects, houses, planetary configurations) imported via Roman-Indian maritime trade networks."
      },
      {
        layerName: "2. Yavaneśvara Prose (149 CE)",
        sanskritExample: "यवनेश्वरेण प्रोक्तं तत् गद्यमयम्",
        englishExplanation: "Initial prose translation and structural translation from Greek into early classical Sanskrit by Yavaneśvara ('Lord of the Greeks')."
      },
      {
        layerName: "3. Sphujidhvaja Verse (269 CE)",
        sanskritExample: "इन्द्रवज्रा उपेन्द्रवज्रा छन्दांसि",
        englishExplanation: "Final versification into regular classical Sanskrit meters. Retained Greek loanwords in Sanskritised phonetic spelling."
      }
    ],
    guardrail: "Respect the 269 CE colophon date. It illustrates that Indian predictive astrology is a dynamic synthesis of indigenous calendar metrics and Hellenistic horoscopy."
  },
  {
    id: "brihat-jataka",
    title: "Bṛhat Jātaka (Varāhamihira)",
    sanskrit: "बृहज्जातक",
    academicDate: "6th century CE (c. 505–587 CE)",
    academicYearVal: 550,
    traditionalDate: "6th century CE",
    traditionalYearVal: 550,
    recension: "Low",
    description: "The classical consolidation of birth-chart astrology. Written by Varāhamihira of Ujjain in highly sophisticated, compact Sanskrit verse.",
    strata: [
      {
        layerName: "1. Siddhāntic Astronomy Core",
        sanskritExample: "पञ्चसिद्धान्तिका गणितम्",
        englishExplanation: "Anchored to the five mathematical astronomy schools, ensuring predictive rules line up with correct planetary calculations."
      },
      {
        layerName: "2. Classical Verse Formulation",
        sanskritExample: "त्रिस्कन्धं ज्योतिषं शास्त्रम्",
        englishExplanation: "Varāhamihira's original composition of 28 chapters. Elevates the status of the practitioner (*daivajña*) to high scholarly competence."
      },
      {
        layerName: "3. Utpala's Commentary (10th c.)",
        sanskritExample: "भट्टोत्पलविरचिता चिन्तामणिः टीका",
        englishExplanation: "Bṛhat Jātaka Vivṛti, which stabilized the textual manuscript readings and explained technical metaphors."
      }
    ],
    guardrail: "Varāhamihira's lifespan is highly stable across both academic and lineage traditions, serving as the historical anchor of classical astrology."
  },
  {
    id: "bphs",
    title: "Bṛhat Parāśara Horā Śāstra (BPHS)",
    sanskrit: "बृहत्पाराशरहोराशास्त्र",
    academicDate: "10th–14th century CE (Recensional compile)",
    academicYearVal: 1200,
    traditionalDate: "Pre-classical sage (c. 3000 BCE)",
    traditionalYearVal: -3000,
    recension: "Major",
    description: "The foundational encyclopedia of predictive Parāśarī astrology. Attributed to Sage Parāśara, but survives strictly in highly variable medieval recensions.",
    strata: [
      {
        layerName: "1. Oral Parāśarī Lineage Core",
        sanskritExample: "पाराशर्यः सूत्ररूपः उपदेशः",
        englishExplanation: "Aphorisms and planetary rules compiled orally over centuries by lineage schools identifying with the Parāśara name."
      },
      {
        layerName: "2. Medieval Compilation Layer",
        sanskritExample: "अध्यायग्रन्थनं षोडशवर्गाः",
        englishExplanation: "Integration of disparate chapters, divisional charts (vargas), and multiple dasha systems into a single handbook in Northern/Western India."
      },
      {
        layerName: "3. 19th/20th Century Printed Recensions",
        sanskritExample: "खेमराज मुद्रणालय संस्करणम्",
        englishExplanation: "Printed compilations by Sitaram Jha and Devacandra Jha. Standardized in English via the Santhanam translation (1996)."
      }
    ],
    guardrail: "CRITICAL: Do not conflate the ancient sage Parāśara with the medieval written compilation. Always specify the recension/edition when citing verses to remain historically honest."
  },
  {
    id: "jaimini-sutras",
    title: "Jaimini Upadeśa Sūtras",
    sanskrit: "जैमिनि उपदेश सूत्र",
    academicDate: "c. 5th–8th century CE",
    academicYearVal: 650,
    traditionalDate: "Maharṣi Jaimini (c. 1500 BCE)",
    traditionalYearVal: -1500,
    recension: "Moderate",
    description: "The foundational text of the Jaimini stream. Uses sign-aspects (rāśi-dṛṣṭi) and sliding-scale indicators (cara-kārakas) rather than Parāśarī rules.",
    strata: [
      {
        layerName: "1. Sūtra Core",
        sanskritExample: "उपदेशसूत्रम् — जीवे च खेटे च",
        englishExplanation: "Highly compressed, abbreviation-heavy Sanskrit aphorisms composed by Jaimini."
      },
      {
        layerName: "2. Commentary Layer",
        sanskritExample: "नीलकण्ठ विरचिता सुबोधिनी टीका",
        englishExplanation: "Nīlakaṇṭha Daivajña's Vivṛti commentary (16th c.) which unlocked the secret letter-code calculations (Katapayadi system)."
      },
      {
        layerName: "3. Regional Lineages",
        sanskritExample: "दाक्षिणात्य सम्प्रदायः",
        englishExplanation: "Transmission via South Indian and West Indian schools that preserved Jaimini as a co-equal stream, not a Parāśarī derivative."
      }
    ],
    guardrail: "Ensure stream neutrality. Never treat Jaimini as subordinate or a derivative of Parāśara; it is a co-equal, parallel classical system."
  },
  {
    id: "phaladipika",
    title: "Phaladīpikā (Mantreśvara)",
    sanskrit: "फलदीपिका",
    academicDate: "14th century CE",
    academicYearVal: 1350,
    traditionalDate: "14th century CE",
    traditionalYearVal: 1350,
    recension: "Low",
    description: "A brilliant, pedagogically organized compilation of the predictive tradition from the Kerala school of astrology.",
    strata: [
      {
        layerName: "1. Classical Synthesis Core",
        sanskritExample: "मन्त्रेश्वर प्रणीतं फलसङ्ग्रहः",
        englishExplanation: "Synthesizes rules from Bṛhat Jātaka, Sāravalī, and Jātaka Pārijāta into logical themes."
      },
      {
        layerName: "2. Mantreśvara’s Reorganization",
        sanskritExample: "द्वादश भाव फलानि",
        englishExplanation: "Logical sequencing of house indications, yogas, and Vimśottarī daśā details for student fluency."
      },
      {
        layerName: "3. Kerala Lineage Transmission",
        sanskritExample: "केरल ज्योतिर्गणपतिः",
        englishExplanation: "Highly stable preservation within the Southern lineage networks without significant recensional alterations."
      }
    ],
    guardrail: "Shows the vitality of the post-classical compilation period, reorganizing the extensive classical database into structured, practical guides."
  }
];

export function ClassicalCanonStratigraphy() {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [datingMode, setDatingMode] = useState<"academic" | "traditional">("academic");
  const [activeLayerIdx, setActiveLayerIdx] = useState<number>(0);

  const activeText = CANON_TEXTS[selectedIdx];
  const isBPHS = activeText.id === "bphs";

  const changeText = (idx: number) => {
    setSelectedIdx(idx);
    setActiveLayerIdx(0); // reset layer index
  };

  return (
    <div
      className="gl-surface-twilight-glass w-full animate-fadeIn"
      style={{
        background: "var(--gl-surface-card, var(--gl-card-surface, #FFF9F0))",
        border: `1px solid ${goldOnGlassHairline}`,
        borderRadius: 16,
        padding: "24px 26px 20px",
        color: INK_PRIMARY,
        fontFamily: "var(--font-sans), system-ui, sans-serif",
        boxShadow: "0 14px 40px rgba(62, 42, 31, 0.08)",
      }}
    >
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between border-b pb-4" style={{ borderColor: HAIRLINE }}>
        <div>
          <div className="flex items-center gap-2">
            <Layers size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>
              Textual Stratigraphy
            </p>
          </div>
          <h2 className="mt-1 m-0 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Classical Canon Stratigraphy Explorer
          </h2>
          <p className="mt-1 m-0 text-xs text-stone-600" style={{ color: INK_SECONDARY }}>
            Explore scriptures as stacks of historical layers. Slide open the palm leaves to examine core text structures, Sanskrit codices, and dating models.
          </p>
        </div>

        {/* Dating Mode Toggle */}
        <div className="flex gap-1 rounded-lg p-0.5" style={{ background: SURFACE_2 }}>
          <button
            onClick={() => setDatingMode("academic")}
            className="px-3 py-1.5 rounded-md text-xs font-semibold transition-all"
            style={{
              background: datingMode === "academic" ? SURFACE : "transparent",
              color: datingMode === "academic" ? INK_PRIMARY : INK_SECONDARY,
              boxShadow: datingMode === "academic" ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
            }}
          >
            Academic View
          </button>
          <button
            onClick={() => setDatingMode("traditional")}
            className="px-3 py-1.5 rounded-md text-xs font-semibold transition-all"
            style={{
              background: datingMode === "traditional" ? SURFACE : "transparent",
              color: datingMode === "traditional" ? INK_PRIMARY : INK_SECONDARY,
              boxShadow: datingMode === "traditional" ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
            }}
          >
            Traditional Lineage
          </button>
        </div>
      </div>

      {/* Grid selector */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
        {CANON_TEXTS.map((t, idx) => (
          <button
            key={t.id}
            onClick={() => changeText(idx)}
            className="py-2 px-1.5 rounded-lg border text-center transition-all flex flex-col justify-center gap-1 hover:border-amber-500"
            style={{
              background: selectedIdx === idx ? SURFACE_2 : SURFACE,
              borderColor: selectedIdx === idx ? GOLD : HAIRLINE,
              boxShadow: selectedIdx === idx ? `0 4px 10px rgba(168, 130, 30, 0.1)` : "none",
            }}
          >
            <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: INK_SECONDARY }}>
              {t.title.split(" (")[0]}
            </span>
            <span className="text-[8px] px-1.5 py-0.5 rounded font-bold uppercase tracking-widest mx-auto" style={{
              background: t.recension === "Major" ? `${VERMILION}15` : t.recension === "Moderate" ? `${GOLD}15` : `${GREEN}15`,
              color: t.recension === "Major" ? VERMILION : t.recension === "Moderate" ? GOLD : GREEN,
            }}>
              Recension: {t.recension}
            </span>
          </button>
        ))}
      </div>

      {/* Stratigraphy & Detailed Analysis */}
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] items-stretch">
        
        {/* Palm-leaf Manuscript Stack */}
        <div className="rounded-xl p-5 border flex flex-col justify-between" style={{ background: SURFACE, borderColor: HAIRLINE }}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: GOLD }}>
                <BookOpen size={14} />
                Palm-Leaf Codex Stack (ताडपत्र)
              </span>
              <span className="text-[10px] text-stone-500 italic">
                Click a leaf to slide it open
              </span>
            </div>

            {/* SVG Palm-leaf stack */}
            <div className="my-6 flex flex-col gap-3">
              {activeText.strata.map((s, idx) => {
                const isActive = activeLayerIdx === idx;
                const isFirst = idx === 0;
                const isSecond = idx === 1;
                const leafColor = isFirst ? "#E5C158" : isSecond ? "#D4A373" : "#C5A880";

                return (
                  <motion.div
                    key={idx}
                    onClick={() => setActiveLayerIdx(idx)}
                    className="cursor-pointer relative rounded-lg border-2 p-3 transition-all"
                    style={{
                      background: isActive ? SURFACE_2 : "#FBF4E4",
                      borderColor: isActive ? GOLD : HAIRLINE,
                      boxShadow: isActive ? "0 4px 15px rgba(168,130,30,0.15)" : "none",
                    }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    {/* Palm leaf visual features */}
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-stone-900/10 border border-stone-900/20 flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-stone-900/40" />
                    </div>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-stone-900/10 border border-stone-900/20 flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-stone-900/40" />
                    </div>

                    <div className="pl-6 pr-6 flex flex-col">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: isActive ? VERMILION : GOLD }}>
                          {s.layerName}
                        </span>
                        <span className="text-[9px] font-mono opacity-60">Leaf #{idx + 1}</span>
                      </div>
                      
                      {/* Sanskrit code snippet on leaf */}
                      <div
                        className="mt-1.5 font-devanagari text-[11px] select-none text-center tracking-wider italic"
                        style={{ color: INK_SECONDARY }}
                      >
                        {s.sanskritExample}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Explanation box for selected leaf */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeLayerIdx}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="p-3.5 rounded-lg border text-xs"
                style={{ background: SURFACE_2, borderColor: HAIRLINE, borderLeft: `3px solid ${activeLayerIdx === 0 ? VERMILION : activeLayerIdx === 1 ? GOLD : GREEN}` }}
              >
                <div className="font-bold mb-1" style={{ color: INK_PRIMARY }}>
                  Active Leaf Details: {activeText.strata[activeLayerIdx].layerName}
                </div>
                <p className="m-0 leading-relaxed" style={{ color: INK_SECONDARY }}>
                  {activeText.strata[activeLayerIdx].englishExplanation}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Date indicator */}
          <div className="mt-4 pt-3 border-t text-xs flex justify-between items-center" style={{ borderColor: HAIRLINE }}>
            <span style={{ color: INK_SECONDARY }}>
              <strong>Date Era:</strong> {datingMode === "academic" ? activeText.academicDate : activeText.traditionalDate}
            </span>
          </div>
        </div>

        {/* Audit Verdict & Guardrails */}
        <div className="flex flex-col justify-between gap-4">
          <div className="rounded-xl p-5 border flex-1" style={{ background: SURFACE_2, borderColor: HAIRLINE }}>
            <div className="flex items-center gap-2">
              <Book size={16} color={GOLD} />
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: GOLD }}>
                Text Metadata
              </span>
            </div>
            <h3 className="mt-2 m-0 text-base font-bold" style={{ color: INK_PRIMARY }}>
              {activeText.title}
            </h3>
            <p className="mt-1.5 m-0 text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
              {activeText.description}
            </p>

            <div style={{ height: "1px", background: `${GOLD}22`, margin: "14px 0" }} />

            <div className="space-y-3">
              <div>
                <span className="text-[10px] block font-bold text-stone-500 uppercase">Academic Consensus</span>
                <span className="text-xs font-semibold" style={{ color: INK_PRIMARY }}>{activeText.academicDate}</span>
              </div>
              <div>
                <span className="text-[10px] block font-bold text-stone-500 uppercase">Traditional / Lineage Date</span>
                <span className="text-xs font-semibold" style={{ color: INK_PRIMARY }}>{activeText.traditionalDate}</span>
              </div>
            </div>

            {/* BPHS specific prompt */}
            {isBPHS && datingMode === "traditional" && (
              <div className="mt-4 p-3 rounded-lg border bg-white flex flex-col gap-1 text-[11px]" style={{ borderColor: VERMILION }}>
                <span className="font-bold flex items-center gap-1" style={{ color: VERMILION }}>
                  <AlertTriangle size={12} />
                  Two-Layer Holding
                </span>
                <span style={{ color: INK_SECONDARY, lineHeight: 1.4 }}>
                  <strong>Layer 1 (Preserve):</strong> The Parāśarī oral lineage dates back to the ancient Vedic era.
                  <br />
                  <strong>Layer 2 (Refuse):</strong> Refuse the claim that our printed Sanskrit text is 5,000 years old. It is a medieval recension compiled in the 10th-14th c. CE.
                </span>
              </div>
            )}
          </div>

          {/* Guardrail Checklist */}
          <div className="rounded-xl p-4 border flex flex-col gap-2 bg-stone-50 text-xs shadow-sm" style={{
            background: SURFACE,
            borderColor: HAIRLINE,
          }}>
            <div className="flex items-center gap-1.5 font-bold" style={{ color: GOLD }}>
              <Award size={13} />
              <span>Pedagogical Guardrail</span>
            </div>
            <p className="m-0 text-xs leading-normal animate-fadeIn" style={{ color: INK_SECONDARY }}>
              {activeText.guardrail}
            </p>
            <button
              onClick={() => {
                const nextIdx = (selectedIdx + 1) % CANON_TEXTS.length;
                changeText(nextIdx);
              }}
              className="mt-1 w-full inline-flex items-center justify-center gap-1 py-1.5 rounded text-[10px] font-bold text-white uppercase tracking-wider active:scale-95"
              style={{ background: GOLD }}
            >
              Next Scripture
              <ArrowRight size={10} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
