"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Info, BookOpen, CheckCircle2, XCircle, RotateCcw, ArrowRight, Award } from "lucide-react";

export interface TajikaYogaData {
  number: number;
  name: string;
  sanskrit: string;
  category: "completes" | "fails" | "transfers" | "blocks";
  categoryLabel: string;
  isFoundational: boolean;
  gloss: string;
  definition: string;
  workedExample?: string;
  timeArc?: string;
  variations?: string;
}

const YOGAS_DATA: TajikaYogaData[] = [
  {
    number: 1,
    name: "Itthaśāla",
    sanskrit: "इत्थशालः",
    category: "completes",
    categoryLabel: "Completes",
    isFoundational: true,
    gloss: "Applying aspect — light coming together (the core 'yes, forming')",
    definition: "When two planets are within mutual orb, and the faster planet is approaching the exact aspect angle of the slower planet.",
    workedExample: "Moon (fastest) at 10° Aries is applying to Sun (slower) at 14° Leo. Since they are within mutual orb and the gap is closing, the aspect is forming.",
    timeArc: "Matter is approaching / future / coming into effect.",
    variations: "Ithasala / Ithashala"
  },
  {
    number: 2,
    name: "Iśrāf",
    sanskrit: "इश्राफः",
    category: "fails",
    categoryLabel: "Wanes / Fades",
    isFoundational: true,
    gloss: "Separating aspect — light moving apart (fading)",
    definition: "When two planets are within mutual orb, but the faster planet has already crossed the exact degree of the aspect and is pulling away.",
    workedExample: "Mars (faster) at 15° Gemini has crossed the exact square to Sun (slower) at 13° Libra. They are still within orb, but the gap is expanding.",
    timeArc: "Matter is passing / past / going out of effect.",
    variations: "Iśrāpha / Īsarpha"
  },
  {
    number: 3,
    name: "Nakta",
    sanskrit: "नक्तयोगः",
    category: "transfers",
    categoryLabel: "Translates Light",
    isFoundational: true,
    gloss: "Translation of light — a fast graha carries light between two not in aspect",
    definition: "Occurs when two planets do not aspect each other directly, but a faster third planet aspects both, positioned between them to translate the light.",
    workedExample: "Mars at 10° Aries and Jupiter at 12° Virgo have no aspect. The Moon at 11° Cancer aspects both Mars (square) and Jupiter (sextile), translating the light.",
    timeArc: "Outcome is carried or resolved by an intermediate third party.",
    variations: "Nakta Yoga"
  },
  {
    number: 4,
    name: "Yamayā",
    sanskrit: "यमयायोगः",
    category: "transfers",
    categoryLabel: "Collects Light",
    isFoundational: true,
    gloss: "Collection of light — two grahas relate through a third they both aspect",
    definition: "Occurs when two planets do not aspect each other directly, but both apply to aspect a third, slower planet, collecting their light at that common point.",
    workedExample: "Sun and Mars have no aspect between them, but both apply to aspect a slower Saturn. Saturn acts as the common collector of their rays.",
    timeArc: "Fructification through a shared arbiter or shared third platform.",
    variations: "Yamaya"
  },
  {
    number: 5,
    name: "Mānau",
    sanskrit: "मानऊयोगः",
    category: "blocks",
    categoryLabel: "Obstruction",
    isFoundational: false,
    gloss: "A prohibition/withholding register (the slower graha's role)",
    definition: "An aspect of obstruction where a malefic planet intervenes or the slower planet rejects the faster one's light.",
    variations: "Manau"
  },
  {
    number: 6,
    name: "Kambūla",
    sanskrit: "कम्बूलयोगः",
    category: "completes",
    categoryLabel: "Completes",
    isFoundational: false,
    gloss: "A reinforcing configuration (classically involving the Moon)",
    definition: "A yoga where the Moon connects with the aspecting planets, adding its lunar strength to reinforce the aspect.",
    variations: "Kamboola"
  },
  {
    number: 7,
    name: "Gairi-Kambūla",
    sanskrit: "गैरीकम्बूलः",
    category: "blocks",
    categoryLabel: "Obstruction",
    isFoundational: false,
    gloss: "A variant/absence of Kambūla",
    definition: "A weakened or obstructed aspect configuration that fails to receive the Moon's reinforcement.",
    variations: "Gair-Kamboola"
  },
  {
    number: 8,
    name: "Khallāsara",
    sanskrit: "खल्लासरः",
    category: "fails",
    categoryLabel: "Wanes / Fades",
    isFoundational: false,
    gloss: "Loss of light — the aspect does not consummate (void)",
    definition: "Occurs when an applying aspect is voided because one of the planets changes signs or goes out of orb before the aspect reaches exactness.",
    variations: "Khallasara"
  },
  {
    number: 9,
    name: "Dutthottha",
    sanskrit: "दुत्थोत्थः",
    category: "transfers",
    categoryLabel: "Translates Light",
    isFoundational: false,
    gloss: "'Twice-risen' configuration",
    definition: "A complex combination involving retrograde motion and sign-boundary transitions.",
    variations: "Duttha-Uttha"
  },
  {
    number: 10,
    name: "Tambīra",
    sanskrit: "तम्बीरयोगः",
    category: "transfers",
    categoryLabel: "Translates Light",
    isFoundational: false,
    gloss: "A named relational state ('copper-coloured')",
    definition: "A yoga defined by specific degree alignments near sign boundaries.",
    variations: "Tambira"
  },
  {
    number: 11,
    name: "Kuttha",
    sanskrit: "कुत्थयोगः",
    category: "completes",
    categoryLabel: "Completes",
    isFoundational: false,
    gloss: "A favourable ('smiling') state",
    definition: "Formed when planets occupy powerful houses (kendras/trikonas) with strong dignities, creating an easy flow.",
    variations: "Kutha"
  },
  {
    number: 12,
    name: "Dhruva",
    sanskrit: "ध्रुवयोगः",
    category: "completes",
    categoryLabel: "Completes",
    isFoundational: false,
    gloss: "A 'fixed' yoga",
    definition: "A stable relational alignment promising steady, locked-in results over time."
  },
  {
    number: 13,
    name: "Duphāli-Kuttha",
    sanskrit: "दुफालिकुत्थः",
    category: "completes",
    categoryLabel: "Completes",
    isFoundational: false,
    gloss: "An intensified favourable state",
    definition: "Double-smile: An upgraded, exceptionally strong variant of Kuttha Yoga."
  },
  {
    number: 14,
    name: "Dur-pha",
    sanskrit: "दुर्पयोगः",
    category: "fails",
    categoryLabel: "Wanes / Fades",
    isFoundational: false,
    gloss: "An unfavourable 'bad-light' state",
    definition: "An aspect marred by debility, retrogression, or malefic interference, indicating trouble.",
    variations: "Durpha"
  },
  {
    number: 15,
    name: "Iśarātha",
    sanskrit: "इशराथयोगः",
    category: "completes",
    categoryLabel: "Completes",
    isFoundational: false,
    gloss: "An equality/balance of aspect",
    definition: "A state of perfect equilibrium between two aspecting planets' relative strengths."
  },
  {
    number: 16,
    name: "Rūdha",
    sanskrit: "रूढयोगः",
    category: "completes",
    categoryLabel: "Completes",
    isFoundational: false,
    gloss: "A 'risen' yoga",
    definition: "A configuration representing public recognition, success, or rise of the matter in question."
  }
];

interface QuizQuestion {
  id: number;
  question: string;
  context?: string;
  options: { id: string; label: string; explanation: string; isCorrect: boolean }[];
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "A faster Moon at 11° Cancer aspects both a Mars at 10° Aries and a Jupiter at 12° Virgo (which do not aspect each other directly). What yoga is formed?",
    context: "The Moon is acting as the intermediate planet translating light between Mars and Jupiter.",
    options: [
      { id: "A", label: "Nakta", explanation: "Correct. Nakta represents the 'translation of light' where a faster planet relays the aspect between two other planets.", isCorrect: true },
      { id: "B", label: "Yamayā", explanation: "Incorrect. Yamayā is the 'collection of light' where two planets aspect a slower third planet.", isCorrect: false },
      { id: "C", label: "Itthaśāla", explanation: "Incorrect. Itthaśāla is a direct applying aspect between two planets.", isCorrect: false },
      { id: "D", label: "Khallāsara", explanation: "Incorrect. Khallāsara represents non-consummation or loss of light.", isCorrect: false }
    ]
  },
  {
    id: 2,
    question: "The faster planet is approaching the slower planet within orb, moving toward the exact aspect degree. What yoga is formed?",
    context: "The gap between the planets is closing.",
    options: [
      { id: "A", label: "Itthaśāla", explanation: "Correct. Itthaśāla is the applying aspect representing union, coming together, and future outcomes.", isCorrect: true },
      { id: "B", label: "Iśrāf", explanation: "Incorrect. Iśrāf is the separating aspect where the faster planet is moving away.", isCorrect: false },
      { id: "C", label: "Yamayā", explanation: "Incorrect. Yamayā involves three planets collecting light.", isCorrect: false },
      { id: "D", label: "Mānau", explanation: "Incorrect. Mānau is a prohibition or obstruction.", isCorrect: false }
    ]
  },
  {
    id: 3,
    question: "The faster planet has crossed the exact aspect degree and is pulling away, though still within orb. What yoga is formed?",
    context: "The aspect is past its peak and is now fading.",
    options: [
      { id: "A", label: "Iśrāf", explanation: "Correct. Iśrāf represents the separating aspect where light is receding, indicating past-oriented events.", isCorrect: true },
      { id: "B", label: "Itthaśāla", explanation: "Incorrect. Itthaśāla represents applying (forming) aspects, not separating.", isCorrect: false },
      { id: "C", label: "Nakta", explanation: "Incorrect. Nakta is a three-planet translation of light.", isCorrect: false },
      { id: "D", label: "Khallāsara", explanation: "Incorrect. Khallāsara is the failure of an aspect to become exact.", isCorrect: false }
    ]
  },
  {
    id: 4,
    question: "Two planets do not aspect each other, but they both cast aspects to a third slower planet, Saturn, collecting their rays there. What yoga is formed?",
    context: "The shared slower planet gathers the light of the other two.",
    options: [
      { id: "A", label: "Yamayā", explanation: "Correct. Yamayā represents the 'collection of light' on a shared slower planet.", isCorrect: true },
      { id: "B", label: "Nakta", explanation: "Incorrect. Nakta is the 'translation of light' by a faster intermediate planet.", isCorrect: false },
      { id: "C", label: "Kambūla", explanation: "Incorrect. Kambūla is a lunar reinforcement yoga.", isCorrect: false },
      { id: "D", label: "Gairi-Kambūla", explanation: "Incorrect. Gairi-Kambūla is a prohibition/weakness variant.", isCorrect: false }
    ]
  }
];

export function TajikaYogaGlossary() {
  const [tab, setTab] = useState<"directory" | "quiz">("directory");
  const [filter, setFilter] = useState<"all" | "foundational" | "completes" | "fails" | "transfers" | "blocks">("all");
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const toggleCard = (num: number) => {
    setFlippedCards((prev) => ({
      ...prev,
      [num]: !prev[num]
    }));
  };

  const filteredYogas = useMemo(() => {
    return YOGAS_DATA.filter((y) => {
      if (filter === "all") return true;
      if (filter === "foundational") return y.isFoundational;
      return y.category === filter;
    });
  }, [filter]);

  const handleSelectOption = (optId: string) => {
    if (isSubmitted) return;
    setSelectedOption(optId);
  };

  const handleQuizSubmit = () => {
    if (!selectedOption || isSubmitted) return;
    const currentQ = QUIZ_QUESTIONS[quizIndex];
    const selected = currentQ.options.find((o) => o.id === selectedOption);
    if (selected?.isCorrect) {
      setScore((s) => s + 1);
    }
    setIsSubmitted(true);
  };

  const handleQuizNext = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    if (quizIndex < QUIZ_QUESTIONS.length - 1) {
      setQuizIndex((idx) => idx + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  const getCategoryColor = (cat: TajikaYogaData["category"]) => {
    switch (cat) {
      case "completes":
        return { text: "#3A8C5A", bg: "rgba(58, 140, 90, 0.08)", border: "rgba(58, 140, 90, 0.3)" };
      case "fails":
        return { text: "#A23A1E", bg: "rgba(162, 58, 30, 0.08)", border: "rgba(162, 58, 30, 0.3)" };
      case "transfers":
        return { text: "#4F6FA8", bg: "rgba(79, 111, 168, 0.08)", border: "rgba(79, 111, 168, 0.3)" };
      case "blocks":
        return { text: "#C28220", bg: "rgba(194, 130, 32, 0.08)", border: "rgba(194, 130, 32, 0.3)" };
    }
  };

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{
        padding: "24px",
        color: "var(--gl-ink-primary)",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
      }}
      data-interactive="tajika-yoga-glossary"
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .glossary-tab-btn {
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 13.5px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .glossary-tab-btn.active {
          background: var(--gl-gold-accent, #9C7A2F);
          color: #FFF;
          border: 1px solid var(--gl-gold-accent, #9C7A2F);
        }
        .glossary-tab-btn.inactive {
          background: rgba(156, 122, 47, 0.05);
          color: var(--gl-ink-secondary);
          border: 1px solid var(--gl-gold-hairline);
        }
        .glossary-tab-btn.inactive:hover {
          background: rgba(156, 122, 47, 0.1);
        }

        .filter-pill-btn {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid var(--gl-gold-hairline);
          background: rgba(255, 255, 255, 0.6);
          color: var(--gl-ink-secondary);
        }
        .filter-pill-btn:hover {
          border-color: var(--gl-gold-accent);
          background: #FFF;
        }
        .filter-pill-btn.active {
          background: rgba(156, 122, 47, 0.12);
          border-color: var(--gl-gold-accent);
          color: var(--gl-ink-primary);
        }

        /* 3D Flip Card Styles - Refined Heights & Zero scrollbars */
        .perspective-container {
          perspective: 1000px;
          height: 265px;
          width: 100%;
        }
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: left;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
          cursor: pointer;
        }
        .perspective-container.flipped .flip-card-inner {
          transform: rotateY(180deg);
        }
        .flip-card-front, .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          border-radius: 14px;
          padding: 18px;
          box-shadow: 0 4px 16px rgba(62, 42, 31, 0.04);
          overflow-y: auto; /* Scroll if content overflows */
        }

        /* Styled thin scrollbars for premium UX */
        .flip-card-front::-webkit-scrollbar, .flip-card-back::-webkit-scrollbar {
          width: 4px;
        }
        .flip-card-front::-webkit-scrollbar-track, .flip-card-back::-webkit-scrollbar-track {
          background: rgba(156, 122, 47, 0.03);
          border-radius: 4px;
        }
        .flip-card-front::-webkit-scrollbar-thumb, .flip-card-back::-webkit-scrollbar-thumb {
          background: rgba(156, 122, 47, 0.2);
          border-radius: 4px;
        }
        .flip-card-front::-webkit-scrollbar-thumb:hover, .flip-card-back::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 122, 47, 0.4);
        }
        .flip-card-front {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 253, 248, 0.95) 100%);
          border: 1px solid var(--gl-gold-hairline);
        }
        .flip-card-front.foundational {
          border: 2px solid var(--gl-gold-accent);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(253, 244, 220, 0.95) 100%);
          box-shadow: 0 6px 20px rgba(156, 122, 47, 0.12);
        }
        .flip-card-back {
          background: #FFFDF9;
          transform: rotateY(180deg);
        }

        .quiz-opt-btn {
          width: 100%;
          text-align: left;
          padding: 14px 18px;
          border-radius: 10px;
          border: 1px solid var(--gl-gold-hairline);
          background: rgba(255, 252, 240, 0.55);
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }
        .quiz-opt-btn:hover:not(:disabled) {
          border-color: var(--gl-gold-accent);
          background: #FFF;
        }
        .quiz-opt-btn.selected {
          border-color: var(--gl-gold-accent);
          background: rgba(156, 122, 47, 0.08);
        }
      `}} />

      {/* Title block */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "var(--gl-gold-accent)", display: "flex", alignItems: "center", gap: "8px" }}>
            <Sparkles size={18} style={{ color: "var(--gl-copper)" }} />
            Tājika Yogas Reference Hub
          </h3>
          <p style={{ margin: "2px 0 0", fontSize: "12px", color: "var(--gl-ink-muted)" }}>
            Learn and recognize the sixteen dynamic relational aspect states
          </p>
        </div>

        {/* Tab switchers */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => setTab("directory")}
            className={`glossary-tab-btn ${tab === "directory" ? "active" : "inactive"}`}
          >
            16-Yoga Directory
          </button>
          <button
            onClick={() => { setTab("quiz"); resetQuiz(); }}
            className={`glossary-tab-btn ${tab === "quiz" ? "active" : "inactive"}`}
          >
            Recognition Quiz
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {tab === "directory" ? (
          <motion.div
            key="directory"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Filter Pill Row */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
              <button onClick={() => setFilter("all")} className={`filter-pill-btn ${filter === "all" ? "active" : ""}`}>All 16</button>
              <button onClick={() => setFilter("foundational")} className={`filter-pill-btn ${filter === "foundational" ? "active" : ""}`}>⭐ Foundational 4</button>
              <button onClick={() => setFilter("completes")} className={`filter-pill-btn ${filter === "completes" ? "active" : ""}`}>Completes / Forming</button>
              <button onClick={() => setFilter("fails")} className={`filter-pill-btn ${filter === "fails" ? "active" : ""}`}>Fails / Waning</button>
              <button onClick={() => setFilter("transfers")} className={`filter-pill-btn ${filter === "transfers" ? "active" : ""}`}>Transfers / Relays</button>
              <button onClick={() => setFilter("blocks")} className={`filter-pill-btn ${filter === "blocks" ? "active" : ""}`}>Blocks / Obstructs</button>
            </div>

            {/* Grid of cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
              {filteredYogas.map((yoga) => {
                const colors = getCategoryColor(yoga.category);
                const isFlipped = !!flippedCards[yoga.number];

                return (
                  <div
                    key={yoga.number}
                    className={`perspective-container ${isFlipped ? "flipped" : ""}`}
                    onClick={() => toggleCard(yoga.number)}
                  >
                    <div className="flip-card-inner">
                      
                      {/* CARD FRONT */}
                      <div className={`flip-card-front ${yoga.isFoundational ? "foundational" : ""}`}>
                        <div style={{ display: "flex", flexDirection: "column", minHeight: "100%", justifyContent: "space-between" }}>
                          <div>
                            {/* Top Row: category badge & yoga num */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                              <span style={{ fontSize: "10px", fontWeight: 750, color: "var(--gl-gold-accent)", letterSpacing: "0.08em" }}>
                                YOGA {yoga.number.toString().padStart(2, "0")} {yoga.isFoundational && "★"}
                              </span>
                              <span style={{ 
                                fontSize: "9.5px", 
                                fontWeight: 700, 
                                color: colors.text, 
                                background: colors.bg, 
                                border: `1.5px solid ${colors.border}`,
                                borderRadius: "4px", 
                                padding: "1px 5px",
                                letterSpacing: "0.04em",
                                textTransform: "uppercase"
                              }}>
                                {yoga.categoryLabel}
                              </span>
                            </div>
                            
                            {/* Middle: Name & Devanagari */}
                            <div style={{ marginTop: "10px" }}>
                              <h4 style={{ margin: 0, fontSize: "19px", fontWeight: 800, color: "var(--gl-ink-primary)", fontFamily: "var(--font-cormorant), serif", letterSpacing: "0.02em" }}>
                                {yoga.name}
                              </h4>
                              <span style={{ fontSize: "12px", color: "var(--gl-gold-accent)", fontWeight: 650, marginTop: "2px", display: "inline-block" }}>
                                {yoga.sanskrit}
                              </span>
                            </div>

                            {/* Definition on front card */}
                            <p style={{ margin: "10px 0 0 0", fontSize: "12.5px", color: "var(--gl-ink-primary)", lineHeight: "1.45" }}>
                              {yoga.definition}
                            </p>
                          </div>

                          {/* Bottom: Divider & Gloss */}
                          <div>
                            <div style={{ borderTop: "1px dashed rgba(156, 122, 47, 0.22)", margin: "8px 0" }} />
                            <div style={{ fontSize: "12px", color: "var(--gl-ink-secondary)", lineHeight: "1.4", fontStyle: "italic" }}>
                              {yoga.gloss}
                            </div>
                            
                            <div style={{ fontSize: "9.5px", color: "var(--gl-ink-muted)", textAlign: "right", marginTop: "10px", fontWeight: 500 }}>
                              Click to see worked example ↺
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* CARD BACK */}
                      <div 
                        className="flip-card-back"
                        style={{ border: `1px solid ${yoga.isFoundational ? "var(--gl-gold-accent)" : "rgba(156, 122, 47, 0.2)"}` }}
                      >
                        <div style={{ display: "flex", flexDirection: "column", minHeight: "100%", justifyContent: "space-between" }}>
                          <div>
                            {/* Header */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                              <span style={{ fontSize: "14px", fontWeight: 800, color: "var(--gl-ink-primary)", fontFamily: "var(--font-cormorant), serif" }}>
                                {yoga.name} (Example)
                              </span>
                              <span style={{ fontSize: "9px", color: colors.text, textTransform: "uppercase", fontWeight: 700 }}>
                                {yoga.categoryLabel}
                              </span>
                            </div>

                            {yoga.isFoundational ? (
                              <div style={{ marginTop: "8px" }}>
                                <div style={{ background: "rgba(156, 122, 47, 0.04)", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(156, 122, 47, 0.15)" }}>
                                  <span style={{ fontSize: "9.5px", fontWeight: 750, textTransform: "uppercase", color: "var(--gl-gold-accent)", display: "block", marginBottom: "4px" }}>Worked Example</span>
                                  <span style={{ fontSize: "12px", color: "var(--gl-ink-secondary)", display: "block", lineHeight: "1.45" }}>{yoga.workedExample}</span>
                                </div>
                                {yoga.timeArc && (
                                  <div style={{ marginTop: "10px", background: "rgba(79, 111, 168, 0.04)", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(79, 111, 168, 0.15)" }}>
                                    <span style={{ fontSize: "9.5px", fontWeight: 750, textTransform: "uppercase", color: "#4F6FA8", display: "block", marginBottom: "4px" }}>Time-Arc & Fructification</span>
                                    <span style={{ fontSize: "12px", color: "var(--gl-ink-secondary)", display: "block", lineHeight: "1.45" }}>{yoga.timeArc}</span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div style={{ marginTop: "12px", background: "linear-gradient(90deg, rgba(194, 130, 32, 0.06) 0%, rgba(255, 255, 255, 0) 100%)", padding: "12px 14px", borderRadius: "6px", borderLeft: "3px solid var(--gl-gold-accent)" }}>
                                <span style={{ fontSize: "10px", fontWeight: 800, color: "#C28220", display: "flex", alignItems: "center", gap: "4px", textTransform: "uppercase" }}>
                                  <Award size={13} /> Deferred to Module 19
                                </span>
                                <span style={{ fontSize: "12px", color: "var(--gl-ink-muted)", marginTop: "4px", display: "block", lineHeight: "1.45" }}>
                                  Full computational rules & yearly fructification will be taught in the Tājika deep-dive.
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Footer */}
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "9.5px", color: "var(--gl-ink-muted)", borderTop: "1px dashed var(--gl-gold-hairline)", paddingTop: "6px", marginTop: "12px" }}>
                            <span>{yoga.variations ? `Alt: ${yoga.variations}` : ""}</span>
                            <span>Click to see details ↺</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{ maxWidth: "600px", margin: "0 auto", padding: "10px 0" }}
          >
            {/* Quiz view */}
            {!quizFinished ? (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--gl-gold-accent)", textTransform: "uppercase" }}>
                    Recognition Drill — Question {quizIndex + 1} of {QUIZ_QUESTIONS.length}
                  </span>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--gl-ink-muted)" }}>
                    Score: {score} / {quizIndex}
                  </span>
                </div>

                <div style={{ background: "rgba(255,255,255,0.45)", border: "1px solid var(--gl-gold-hairline)", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
                  <p style={{ margin: 0, fontSize: "16.5px", fontWeight: 700, color: "var(--gl-ink-primary)", lineHeight: "1.4" }}>
                    {QUIZ_QUESTIONS[quizIndex].question}
                  </p>
                  {QUIZ_QUESTIONS[quizIndex].context && (
                    <p style={{ margin: "6px 0 0 0", fontSize: "13.5px", color: "var(--gl-ink-muted)", fontStyle: "italic" }}>
                      {QUIZ_QUESTIONS[quizIndex].context}
                    </p>
                  )}
                </div>

                {/* Options list */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
                  {QUIZ_QUESTIONS[quizIndex].options.map((opt) => {
                    const isSelected = selectedOption === opt.id;
                    const showCorrect = isSubmitted && opt.isCorrect;
                    const showWrong = isSubmitted && isSelected && !opt.isCorrect;

                    return (
                      <button
                        key={opt.id}
                        disabled={isSubmitted}
                        onClick={() => handleSelectOption(opt.id)}
                        className={`quiz-opt-btn ${isSelected ? "selected" : ""}`}
                        style={{
                          borderColor: showCorrect 
                            ? "#3A8C5A" 
                            : showWrong 
                            ? "#A23A1E" 
                            : isSelected 
                            ? "var(--gl-gold-accent)" 
                            : "var(--gl-gold-hairline)",
                          background: showCorrect 
                            ? "rgba(58, 140, 90, 0.08)" 
                            : showWrong 
                            ? "rgba(162, 58, 30, 0.08)" 
                            : isSelected 
                            ? "rgba(156, 122, 47, 0.08)" 
                            : "rgba(255, 252, 240, 0.55)",
                          opacity: isSubmitted && !isSelected && !opt.isCorrect ? 0.65 : 1
                        }}
                      >
                        <span style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          background: showCorrect 
                            ? "#3A8C5A" 
                            : showWrong 
                            ? "#A23A1E" 
                            : isSelected 
                            ? "var(--gl-gold-accent)" 
                            : "rgba(156, 122, 47, 0.12)",
                          color: showCorrect || showWrong || isSelected ? "#FFF" : "var(--gl-gold-accent)",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          fontWeight: 700,
                          flexShrink: 0
                        }}>
                          {opt.id}
                        </span>
                        
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ fontSize: "14.5px", fontWeight: isSelected ? 600 : 500, color: "var(--gl-ink-primary)" }}>
                            {opt.label}
                          </span>
                          {isSubmitted && (isSelected || opt.isCorrect) && (
                            <span style={{ 
                              fontSize: "12.5px", 
                              color: opt.isCorrect ? "#3A8C5A" : "#A23A1E", 
                              marginTop: "4px",
                              fontWeight: 500,
                              lineHeight: "1.4"
                            }}>
                              {opt.explanation}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Navigation / Action button */}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  {!isSubmitted ? (
                    <button
                      onClick={handleQuizSubmit}
                      disabled={!selectedOption}
                      style={{
                        padding: "10px 20px",
                        borderRadius: "8px",
                        border: "none",
                        background: selectedOption ? "var(--gl-gold-accent)" : "rgba(156, 122, 47, 0.15)",
                        color: selectedOption ? "#FFF" : "var(--gl-ink-muted)",
                        fontWeight: 700,
                        fontSize: "13.5px",
                        cursor: selectedOption ? "pointer" : "not-allowed",
                        transition: "all 0.2s ease"
                      }}
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <button
                      onClick={handleQuizNext}
                      style={{
                        padding: "10px 20px",
                        borderRadius: "8px",
                        border: "none",
                        background: "var(--gl-gold-accent)",
                        color: "#FFF",
                        fontWeight: 700,
                        fontSize: "13.5px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                    >
                      {quizIndex < QUIZ_QUESTIONS.length - 1 ? "Next Scenario" : "Finish Drill"}
                      <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <h4 style={{ fontSize: "20px", fontWeight: 800, color: "var(--gl-gold-accent)", margin: "0 0 8px 0" }}>
                  Drill Completed!
                </h4>
                <p style={{ fontSize: "14px", color: "var(--gl-ink-secondary)", margin: "0 0 20px 0" }}>
                  You scored <strong>{score} out of {QUIZ_QUESTIONS.length}</strong>.
                </p>

                {score === QUIZ_QUESTIONS.length ? (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(58, 140, 90, 0.08)", border: "1px solid rgba(58, 140, 90, 0.3)", borderRadius: "20px", padding: "6px 16px", color: "#3A8C5A", fontSize: "13px", fontWeight: 700, marginBottom: "24px" }}>
                    <CheckCircle2 size={15} /> Perfect Score! You recognize the core yogas.
                  </div>
                ) : (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(194, 130, 32, 0.08)", border: "1px solid rgba(194, 130, 32, 0.3)", borderRadius: "20px", padding: "6px 16px", color: "#C28220", fontSize: "13px", fontWeight: 700, marginBottom: "24px" }}>
                    Keep practicing to cement the foundational four in memory.
                  </div>
                )}

                <div>
                  <button
                    onClick={resetQuiz}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "8px",
                      border: "1px solid var(--gl-gold-accent)",
                      background: "transparent",
                      color: "var(--gl-gold-accent)",
                      fontWeight: 700,
                      fontSize: "13px",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "all 0.2s ease"
                    }}
                    className="hover:bg-[rgba(156,122,47,0.05)]"
                  >
                    <RotateCcw size={14} /> Try Again
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
