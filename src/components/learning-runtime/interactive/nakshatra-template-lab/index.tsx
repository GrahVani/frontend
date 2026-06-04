"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BookOpen,
  Compass,
  Layers,
  MapPinned,
  RotateCcw,
  Timer,
  Wand2,
  HelpCircle,
  CheckCircle2,
  Award,
  BookOpenCheck,
  ChevronRight,
  Info
} from "lucide-react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { IAST } from "../../chrome/typography";

// Group styles and palettes
type SlotGroup = "location" | "timing" | "meaning" | "temperament" | "correspondence";

interface GroupConfig {
  label: string;
  color: string;
  bg: string;
  accentBg: string;
  icon: typeof MapPinned;
  summary: string;
}

const GROUPS: Record<SlotGroup, GroupConfig> = {
  location: {
    label: "Location",
    color: "#4A6FA8", // Indigo Blue
    bg: "rgba(74, 111, 168, 0.08)",
    accentBg: "rgba(74, 111, 168, 0.15)",
    icon: MapPinned,
    summary: "Where the nakṣatra sits: degrees, rāśi, and padas.",
  },
  timing: {
    label: "Timing",
    color: "#8B5A2B", // Deep brown / earth
    bg: "rgba(139, 90, 43, 0.08)",
    accentBg: "rgba(139, 90, 43, 0.15)",
    icon: Timer,
    summary: "The Vimśottarī lord links the star to the time/daśā engine.",
  },
  meaning: {
    label: "Meaning",
    color: "#C28220", // Gold
    bg: "rgba(194, 130, 32, 0.08)",
    accentBg: "rgba(194, 130, 32, 0.15)",
    icon: BookOpen,
    summary: "Name, deity, and symbol form the interpretive heart.",
  },
  temperament: {
    label: "Temperament",
    color: "#2d7d46", // Jade Green
    bg: "rgba(45, 125, 70, 0.08)",
    accentBg: "rgba(45, 125, 70, 0.15)",
    icon: Layers,
    summary: "How the star behaves and what activity it suits.",
  },
  correspondence: {
    label: "Correspondences",
    color: "#A23A1E", // Vermilion
    bg: "rgba(162, 58, 30, 0.08)",
    accentBg: "rgba(162, 58, 30, 0.15)",
    icon: Compass,
    summary: "Finer mappings for health, compatibility, direction, and body.",
  },
};

interface TemplateSlot {
  id: number;
  label: string;
  group: SlotGroup;
  gives: string;
  ashwini: string;
}

const SLOTS: TemplateSlot[] = [
  { id: 1, label: "Name + meaning", group: "meaning", gives: "The Sanskrit seed name and literal image that begins the symbolism.", ashwini: "Aśvinī: 'of the horse'; representing swift arrival, healing energy, and beginnings." },
  { id: 2, label: "Sidereal range", group: "location", gives: "The exact 13°20′ lunar mansion span along the ecliptic.", ashwini: "0°00′ - 13°20′ of the zodiac." },
  { id: 3, label: "Rāśi correspondence", group: "location", gives: "The solar zodiac sign or signs it occupies; boundary-crossing changes flavor.", ashwini: "Entirely in Meṣa (Aries)." },
  { id: 4, label: "Padas", group: "location", gives: "Four 3°20′ quarters and their navāṁśa bridge (the D9 gateway).", ashwini: "1st Pada (Aries), 2nd (Taurus), 3rd (Gemini), 4th (Cancer navāṁśas)." },
  { id: 5, label: "Ruling graha (lord)", group: "timing", gives: "The operational Vimśottarī lord - the time system trigger and primary dasha anchor.", ashwini: "Ketu: starting the Vimśottarī lifecycle with a 7-year spiritualized phase." },
  { id: 6, label: "Presiding deity (devatā)", group: "meaning", gives: "The spiritual core and cosmic intelligence from which the star's meaning flows.", ashwini: "The Aśvinī Kumāras: divine twins, physicians of the gods, restoring youth and sight." },
  { id: 7, label: "Symbol", group: "meaning", gives: "The classical visible icon that makes the archetype memorable.", ashwini: "A horse's head: representing speed, therapeutic power, vitality, and dawn." },
  { id: 8, label: "Gaṇa", group: "temperament", gives: "The temperament tribe: deva (divine), manuṣya (human), or rākṣasa (challenging).", ashwini: "Deva: refined, benevolent, quick to help, aligned with high ideals." },
  { id: 9, label: "Yoni", group: "temperament", gives: "The animal-sexual archetype used for deep compatibility and primal temperament.", ashwini: "Male horse (Aśva): passionate, independent, and high-stamina." },
  { id: 10, label: "Tattva", group: "temperament", gives: "The elemental operating substance (Fire, Earth, Air, Water, Ether).", ashwini: "Earth (Prithivī): grounding the swift speed into practical, physical results." },
  { id: 11, label: "Quality", group: "temperament", gives: "The electional usage key (gentle, fierce, fixed, movable, etc.).", ashwini: "Kṣipra (Swift) and Laghu (Light): perfect for starting treatments, travels, and quick deeds." },
  { id: 12, label: "Nāḍī, caste, direction, body", group: "correspondence", gives: "Finer Ayurvedic, spatial, social, and physiological mappings used for detailed chart synthesis.", ashwini: "Vāta constitution; Vaiśya (merchant) caste; South direction; knees and shins." },
];

const GROUP_ORDER: SlotGroup[] = ["location", "timing", "meaning", "temperament", "correspondence"];

const SLOT_SHORT_LABELS = [
  "Name",
  "Range",
  "Rāśi",
  "Padas",
  "Lord",
  "Deity",
  "Symbol",
  "Gaṇa",
  "Yoni",
  "Tattva",
  "Quality",
  "Finer"
];

// ─── Math helpers for SVG annular segment ───
function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
}

function describeDonutArc(cx: number, cy: number, rOuter: number, rInner: number, startAngle: number, endAngle: number) {
  const startOuter = polarToCartesian(cx, cy, rOuter, endAngle);
  const endOuter = polarToCartesian(cx, cy, rOuter, startAngle);
  const startInner = polarToCartesian(cx, cy, rInner, endAngle);
  const endInner = polarToCartesian(cx, cy, rInner, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  
  return [
    `M ${startInner.x} ${startInner.y}`,
    `L ${startOuter.x} ${startOuter.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArcFlag} 0 ${endOuter.x} ${endOuter.y}`,
    `L ${endInner.x} ${endInner.y}`,
    `A ${rInner} ${rInner} 0 ${largeArcFlag} 1 ${startInner.x} ${startInner.y}`,
    "Z"
  ].join(" ");
}

// ─── Quiz configuration for Slot Quiz ───
interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: number; // Index of the correct option
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Which slot group does the 'Ruling graha (lord)' belong to?",
    options: ["Location", "Timing", "Meaning", "Temperament"],
    answer: 1,
    explanation: "The ruling planet (lord) belongs to the 'Timing' group because it acts as the primary operational link to the Vimśottarī Daśā lifecycle."
  },
  {
    id: 2,
    question: "What is the spiritual core from which a nakṣatra's deeper archetype and meaning flows?",
    options: ["The sidereal range", "The presiding deity (devatā)", "The Gaṇa", "The Ayurvedic Nāḍī"],
    answer: 1,
    explanation: "The presiding deity (devatā) represents the specific cosmic intelligence and spiritual core that animates the nakṣatra's themes."
  },
  {
    id: 3,
    question: "Which attribute classifies a nakṣatra into 'deva', 'manuṣya', or 'rākṣasa'?",
    options: ["Yoni", "Tattva", "Gaṇa", "Quality"],
    answer: 2,
    explanation: "Gaṇa represents the 'tribe' or spiritual temperament, classifying nakṣatras into divine (deva), human (manuṣya), or demonic/intense (rākṣasa)."
  }
];

// ─── A2B Theory Analyzer Data ───
interface DrillItem {
  id: number;
  statement: string;
  answer: "nakshatra" | "rashi";
  correction: string;
}

const A2B_DRILL_ITEMS: DrillItem[] = [
  { id: 1, statement: "Divides the 360° zodiacal circle into 12 equal divisions of 30° each.", answer: "rashi", correction: "A Rāśi (Zodiac Sign) divides the ecliptic into 12 distinct segments of exactly 30° each." },
  { id: 2, statement: "Divides the 360° zodiacal circle into 27 equal divisions of 13°20′ each.", answer: "nakshatra", correction: "A Nakṣatra (Lunar Mansion) divides the ecliptic into 27 segments, mapping the Moon's daily orbit of 13°20′." },
  { id: 3, statement: "Ruled by a Vimśottarī dasha lord, acting as the key timer for life events.", answer: "nakshatra", correction: "The Nakṣatra occupied by the Moon at birth determines the Vimśottarī dasha timeline and cycles." },
  { id: 4, statement: "Associated with a specific animal archetype (Yoni) and Vedic deity (Devatā).", answer: "nakshatra", correction: "Nakṣatras contain detailed mythical structures, mapping to specific animal symbols and ancient deities." },
  { id: 5, statement: "Determines planetary dignity (exaltation, debilitation, own-sign strength).", answer: "rashi", correction: "Planetary strengths, exaltation, and lordships are governed at the Rāśi level (e.g. Sun exalted in Aries/Meṣa)." },
  { id: 6, statement: "Subdivided into four quarters (Padas) of 3°20′ each, bridging directly to the Navāṁśa chart.", answer: "nakshatra", correction: "Each Nakṣatra is made of 4 Padas of 3°20′. Nine padas fill one sign, linking the D1 zodiac directly to the D9 navāṁśa." },
  { id: 7, statement: "Primarily represents the solar, logical, physical, and societal container of life.", answer: "rashi", correction: "Rāśis govern the outer social/physical environments and logical containers of planetary placements." },
  { id: 8, statement: "Primarily represents the lunar, intuitive, mental, and deep emotional layer of consciousness.", answer: "nakshatra", correction: "Nakṣatras map Chandra's (the Moon's) path, governing the deep emotional matrix, mental instincts, and karmic seeds." }
];

const A2B_COMPARISON_ROWS = [
  { dim: "Cosmic Ruler", nak: "Chandra (Moon) / Intuitive & instinctual", ras: "Sūrya (Sun) / Rational & physical" },
  { dim: "Divisions", nak: "27 mansions (13°20′ each)", ras: "12 signs (30° each)" },
  { dim: "Key Archetypes", nak: "27 Deities (Devatās) & 14 Animal Yonis", ras: "Elements, Modalities, Gender, Directions" },
  { dim: "Timing System", nak: "Vimśottarī Daśā lifecycle trigger", ras: "Transits (Gocara) & house placements" },
  { dim: "Astrological Subdivisions", nak: "4 Padas (3°20′) mapping to Navāṁśa", ras: "16 divisional charts (Vargas) mathematically" },
  { dim: "Classical Source", nak: "Ṛg Veda, Atharva Veda, BPHS ch. 3", ras: "Bṛhat Parāśara Horā Śāstra, Yavana Jātaka" }
];

export function NakshatraTemplateLab() {
  const shouldReduceMotion = useReducedMotion();

  // Tabs: 'scaffold' (Wheel & Quiz), 'a2b' (Comparison & Drill), 'ashvini' (Sequential Reveal)
  const [activeTab, setActiveTab] = useState<"scaffold" | "a2b" | "ashvini">("scaffold");

  // --- TAB 1 States: Scaffold Lab ---
  const [selectedSlotId, setSelectedSlotId] = useState<number>(1);
  const [exploredSlots, setExploredSlots] = useState<Set<number>>(new Set([1]));

  // --- TAB 1 States: Slot Quiz ---
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  // --- TAB 2 States: A2B Theory Analyzer ---
  const [a2bAnswers, setA2bAnswers] = useState<Record<number, "nakshatra" | "rashi" | null>>({});
  const [a2bRevealed, setA2bRevealed] = useState<Record<number, boolean>>({});

  // --- TAB 3 States: Ashvini Sequential Preview ---
  const [ashviniRevealCount, setAshviniRevealCount] = useState<number>(3); // Initial reveal count

  // Fetch current slot details
  const activeSlot = useMemo(() => {
    return SLOTS.find((s) => s.id === selectedSlotId) || SLOTS[0];
  }, [selectedSlotId]);

  const activeGroupInfo = GROUPS[activeSlot.group];

  // Exploration tracker
  const markSlotExplored = useCallback((id: number) => {
    setExploredSlots((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const selectSlot = useCallback((id: number) => {
    setSelectedSlotId(id);
    markSlotExplored(id);
  }, [markSlotExplored]);

  // Keyboard navigation for the 12-segment wheel
  useEffect(() => {
    if (activeTab !== "scaffold") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const prevId = selectedSlotId === 1 ? 12 : selectedSlotId - 1;
        selectSlot(prevId);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextId = selectedSlotId === 12 ? 1 : selectedSlotId + 1;
        selectSlot(nextId);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab, selectedSlotId, selectSlot]);

  // --- Reset All State ---
  const handleReset = () => {
    setSelectedSlotId(1);
    setExploredSlots(new Set([1]));
    setQuizStarted(false);
    setCurrentQuestionIdx(0);
    setQuizScore(0);
    setQuizSelectedOption(null);
    setQuizAnswered(false);
    setQuizFinished(false);
    setA2bAnswers({});
    setA2bRevealed({});
    setAshviniRevealCount(3);
    setActiveTab("scaffold");
  };

  // --- Quiz Functions ---
  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIdx(0);
    setQuizScore(0);
    setQuizSelectedOption(null);
    setQuizAnswered(false);
    setQuizFinished(false);
  };

  const handleQuizOptionClick = (idx: number) => {
    if (quizAnswered) return;
    setQuizSelectedOption(idx);
  };

  const checkQuizAnswer = () => {
    if (quizSelectedOption === null || quizAnswered) return;
    const currentQ = QUIZ_QUESTIONS[currentQuestionIdx];
    const isCorrect = quizSelectedOption === currentQ.answer;
    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
    }
    setQuizAnswered(true);
  };

  const nextQuizQuestion = () => {
    setQuizSelectedOption(null);
    setQuizAnswered(false);
    if (currentQuestionIdx + 1 < QUIZ_QUESTIONS.length) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  // --- A2B Drill Functions ---
  const selectA2b = (id: number, choice: "nakshatra" | "rashi") => {
    if (a2bRevealed[id]) return;
    setA2bAnswers((prev) => ({ ...prev, [id]: choice }));
  };

  const checkA2b = (id: number) => {
    if (!a2bAnswers[id]) return;
    setA2bRevealed((prev) => ({ ...prev, [id]: true }));
  };

  const resetA2b = (id: number) => {
    setA2bAnswers((prev) => ({ ...prev, [id]: null }));
    setA2bRevealed((prev) => ({ ...prev, [id]: false }));
  };

  const correctA2bCount = Object.keys(a2bRevealed).filter(
    (key) => {
      const id = parseInt(key);
      const item = A2B_DRILL_ITEMS.find((d) => d.id === id);
      return item && a2bRevealed[id] && a2bAnswers[id] === item.answer;
    }
  ).length;

  // --- SVG Wheel variables ---
  const CX = 210;
  const CY = 210;
  const R_OUTER = 195;
  const R_INNER = 110;
  const R_HUB = 65;

  return (
    <div
      className="w-full p-6 md:p-8"
      data-interactive="nakshatra-template-lab"
      style={{
        background: "var(--gl-surface-card, var(--gl-card-surface, #FFF9F0))",
        border: "1px solid var(--gl-border-subtle, var(--gl-gold-hairline))",
        borderRadius: 16,
        boxShadow: "0 6px 36px rgba(0, 0, 0, 0.03)"
      }}
    >
      {/* Premium Header */}
      <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: "var(--gl-gold-hairline)" }}>
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--gl-gold-accent, #C28220)" }}>
            <Wand2 size={15} />
            Foundational Reading Scaffold
          </div>
          <h2 className="mt-2 text-2xl md:text-3xl font-semibold" style={{ fontFamily: "var(--font-cormorant), serif", color: "var(--gl-ink-primary)" }}>
            <IAST>The 12-Slot Nakṣatra Template Lab</IAST>
          </h2>
          <p className="mt-1 text-sm leading-relaxed max-w-2xl" style={{ color: "var(--gl-ink-secondary)" }}>
            Master the checklist that unlocks all 27 stars. Clear up key theoretical confusions and practice with Worked Examples.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition"
            style={{
              background: "var(--gl-surface-manuscript)",
              border: "1px solid var(--gl-gold-hairline)",
              color: "var(--gl-ink-primary)",
            }}
          >
            <RotateCcw size={14} />
            Reset Lab
          </motion.button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="mt-6 flex gap-2 flex-wrap border-b pb-4" style={{ borderColor: "var(--gl-gold-hairline)" }} role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === "scaffold"}
          onClick={() => setActiveTab("scaffold")}
          className={`px-4 py-2.5 text-sm rounded-lg font-semibold transition-all duration-200 border ${
            activeTab === "scaffold"
              ? "bg-[var(--gl-gold-accent,#C28220)] text-[#1a1a2e] border-[var(--gl-gold-accent,#C28220)]"
              : "bg-[var(--gl-surface-manuscript)] text-[var(--gl-ink-primary)] border-[var(--gl-gold-hairline)] opacity-85 hover:opacity-100"
          }`}
        >
          1. 12-Slot Scaffold
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "a2b"}
          onClick={() => setActiveTab("a2b")}
          className={`px-4 py-2.5 text-sm rounded-lg font-semibold transition-all duration-200 border ${
            activeTab === "a2b"
              ? "bg-[var(--gl-gold-accent,#C28220)] text-[#1a1a2e] border-[var(--gl-gold-accent,#C28220)]"
              : "bg-[var(--gl-surface-manuscript)] text-[var(--gl-ink-primary)] border-[var(--gl-gold-hairline)] opacity-85 hover:opacity-100"
          }`}
        >
          2. Theory A/B Analyzer
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "ashvini"}
          onClick={() => setActiveTab("ashvini")}
          className={`px-4 py-2.5 text-sm rounded-lg font-semibold transition-all duration-200 border ${
            activeTab === "ashvini"
              ? "bg-[var(--gl-gold-accent,#C28220)] text-[#1a1a2e] border-[var(--gl-gold-accent,#C28220)]"
              : "bg-[var(--gl-surface-manuscript)] text-[var(--gl-ink-primary)] border-[var(--gl-gold-hairline)] opacity-85 hover:opacity-100"
          }`}
        >
          3. Worked Aśvinī Profile
        </button>
      </div>

      {/* Main Tab View */}
      <div className="mt-6">
        <AnimatePresence mode="wait">
          {/* TAB 1: SCAFFOLD LAB */}
          {activeTab === "scaffold" && (
            <motion.div
              key="scaffold-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Progress & Completion Status panel */}
              <div
                className="rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300"
                style={{
                  background: "var(--gl-surface-manuscript)",
                  border: "1px solid var(--gl-gold-hairline)",
                }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
                      Scaffold Exploration Progress
                    </span>
                    {exploredSlots.size === 12 && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#2d7d46] bg-[rgba(45,125,70,0.1)] px-2 py-0.5 rounded-full animate-bounce">
                        <CheckCircle2 size={12} /> Mastered!
                      </span>
                    )}
                  </div>
                  <p className="text-xs mt-1" style={{ color: "var(--gl-ink-secondary)" }}>
                    Click all 12 slots on the interactive wheel below to study their interpretive role.
                  </p>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-[rgba(0,0,0,0.06)] h-2.5 rounded-full mt-3 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "var(--gl-gold-accent, #C28220)" }}
                      animate={{ width: `${(exploredSlots.size / 12) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end">
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: "var(--gl-ink-muted)" }}>
                      Slots Explored
                    </p>
                    <p className="text-xl font-bold" style={{ color: "var(--gl-ink-primary)" }}>
                      {exploredSlots.size} / 12
                    </p>
                  </div>
                  {exploredSlots.size === 12 && !quizStarted && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={startQuiz}
                      className="px-4 py-2 bg-[#2d7d46] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm hover:shadow transition"
                    >
                      Take Slot Quiz
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Slot Quiz Panel (if active) */}
              {quizStarted && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="rounded-xl p-5 border-2 overflow-hidden"
                  style={{
                    background: "rgba(194, 130, 32, 0.04)",
                    borderColor: "var(--gl-gold-accent, #C28220)",
                  }}
                >
                  <div className="flex items-center justify-between border-b pb-3 mb-4" style={{ borderColor: "rgba(194, 130, 32, 0.2)" }}>
                    <div className="flex items-center gap-2">
                      <Award size={18} className="text-[var(--gl-gold-accent,#C28220)]" />
                      <span className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--gl-ink-primary)" }}>
                        Scaffold Memorization Drill
                      </span>
                    </div>
                    <button
                      onClick={() => setQuizStarted(false)}
                      className="text-xs font-semibold hover:underline"
                      style={{ color: "var(--gl-ink-muted)" }}
                    >
                      Exit Quiz
                    </button>
                  </div>

                  {!quizFinished ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium" style={{ color: "var(--gl-ink-muted)" }}>
                          Question {currentQuestionIdx + 1} of {QUIZ_QUESTIONS.length}
                        </span>
                        <span className="text-xs font-semibold" style={{ color: "var(--gl-gold-accent, #C28220)" }}>
                          Score: {quizScore}/{QUIZ_QUESTIONS.length}
                        </span>
                      </div>

                      <h4 className="text-base font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
                        {QUIZ_QUESTIONS[currentQuestionIdx].question}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {QUIZ_QUESTIONS[currentQuestionIdx].options.map((opt, i) => {
                          let buttonStyle = {
                            background: "var(--gl-surface-manuscript)",
                            border: "1px solid var(--gl-gold-hairline)",
                            color: "var(--gl-ink-primary)",
                          };

                          if (quizAnswered) {
                            const isCorrect = i === QUIZ_QUESTIONS[currentQuestionIdx].answer;
                            const isSelected = i === quizSelectedOption;
                            if (isCorrect) {
                              buttonStyle = {
                                background: "rgba(45, 125, 70, 0.15)",
                                border: "1.5px solid #2d7d46",
                                color: "#2d7d46",
                              };
                            } else if (isSelected) {
                              buttonStyle = {
                                background: "rgba(162, 58, 30, 0.15)",
                                border: "1.5px solid #A23A1E",
                                color: "#A23A1E",
                              };
                            }
                          } else if (quizSelectedOption === i) {
                            buttonStyle = {
                              background: "rgba(194, 130, 32, 0.15)",
                              border: "1.5px solid var(--gl-gold-accent, #C28220)",
                              color: "var(--gl-ink-primary)",
                            };
                          }

                          return (
                            <button
                              key={i}
                              onClick={() => handleQuizOptionClick(i)}
                              disabled={quizAnswered}
                              className="px-4 py-3 text-left rounded-xl text-xs font-semibold transition"
                              style={buttonStyle}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {quizAnswered && (
                        <div
                          className="p-3.5 rounded-xl text-xs leading-relaxed"
                          style={{
                            background: "var(--gl-surface-manuscript)",
                            borderLeft: `3px solid ${
                              quizSelectedOption === QUIZ_QUESTIONS[currentQuestionIdx].answer ? "#2d7d46" : "#A23A1E"
                            }`,
                            color: "var(--gl-ink-secondary)",
                          }}
                        >
                          <p className="font-bold mb-1">
                            {quizSelectedOption === QUIZ_QUESTIONS[currentQuestionIdx].answer ? "✓ Correct!" : "✗ Incorrect"}
                          </p>
                          {QUIZ_QUESTIONS[currentQuestionIdx].explanation}
                        </div>
                      )}

                      <div className="flex justify-end pt-2">
                        {!quizAnswered ? (
                          <button
                            onClick={checkQuizAnswer}
                            disabled={quizSelectedOption === null}
                            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition ${
                              quizSelectedOption !== null
                                ? "bg-[var(--gl-gold-accent,#C28220)] text-[#1a1a2e]"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            Check Answer
                          </button>
                        ) : (
                          <button
                            onClick={nextQuizQuestion}
                            className="px-4 py-2 bg-[var(--gl-gold-accent,#C28220)] text-[#1a1a2e] text-xs font-bold uppercase tracking-wider rounded-lg transition"
                          >
                            {currentQuestionIdx + 1 === QUIZ_QUESTIONS.length ? "Finish Quiz" : "Next Question"}
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 space-y-4">
                      <div className="inline-flex items-center justify-center w-14 h-14 bg-[rgba(45,125,70,0.15)] rounded-full text-[#2d7d46]">
                        <BookOpenCheck size={32} />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold" style={{ color: "var(--gl-ink-primary)" }}>
                          Quiz Completed!
                        </h4>
                        <p className="text-sm mt-1" style={{ color: "var(--gl-ink-secondary)" }}>
                          You scored <span className="font-bold text-[#2d7d46]">{quizScore} out of {QUIZ_QUESTIONS.length}</span> questions correctly.
                        </p>
                      </div>
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={startQuiz}
                          className="px-4 py-2 border rounded-lg text-xs font-bold uppercase tracking-wider"
                          style={{
                            background: "var(--gl-surface-manuscript)",
                            borderColor: "var(--gl-gold-hairline)",
                            color: "var(--gl-ink-primary)"
                          }}
                        >
                          Retry Quiz
                        </button>
                        <button
                          onClick={() => setQuizStarted(false)}
                          className="px-4 py-2 bg-[var(--gl-gold-accent,#C28220)] text-[#1a1a2e] text-xs font-bold uppercase tracking-wider rounded-lg"
                        >
                          Study More
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Main Circular Wheel Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left Column: Interactive circular SVG wheel */}
                <div className="lg:col-span-6 flex flex-col justify-center items-center gap-6">
                  <div className="relative w-full max-w-[420px] aspect-square">
                    <svg
                      viewBox="0 0 420 420"
                      className="w-full h-full drop-shadow-md select-none"
                    >
                      <defs>
                        <filter id="wheelShadow" x="-10%" y="-10%" width="120%" height="120%">
                          <feDropShadow dx="0" dy={2} stdDeviation={4} floodColor="#4B331A" floodOpacity="0.1" />
                        </filter>
                        <radialGradient id="hubGrad" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="var(--gl-surface-card, #FFFDF8)" />
                          <stop offset="100%" stopColor="var(--gl-surface-manuscript, #F9F1E2)" />
                        </radialGradient>
                      </defs>

                      {/* Subtle background track */}
                      <circle cx={CX} cy={CY} r={R_OUTER} fill="rgba(0, 0, 0, 0.01)" stroke="var(--gl-gold-hairline)" strokeWidth={1} />
                      <circle cx={CX} cy={CY} r={R_INNER} fill="none" stroke="var(--gl-gold-hairline)" strokeWidth={0.5} strokeDasharray="3 3" />

                      {/* 12 Segments representing the 12 template slots */}
                      {SLOTS.map((slot, index) => {
                        const startAngle = index * 30;
                        const endAngle = (index + 1) * 30;
                        const midAng = (startAngle + endAngle) / 2;
                        
                        const isSelected = slot.id === selectedSlotId;
                        const groupConfig = GROUPS[slot.group];

                        // Calculate polar coordinates for tangential text alignment
                        const numPos = polarToCartesian(CX, CY, 168, midAng);
                        const labelPos = polarToCartesian(CX, CY, 138, midAng);

                        // Keep text upright and readable along the curve
                        const textRot = midAng < 180 ? midAng - 90 : midAng + 90;

                        return (
                          <g
                            key={slot.id}
                            className="cursor-pointer group"
                            onClick={() => selectSlot(slot.id)}
                          >
                            {/* Slice path */}
                            <path
                              d={describeDonutArc(CX, CY, R_OUTER, R_INNER, startAngle, endAngle)}
                              fill={isSelected ? groupConfig.color : groupConfig.bg}
                              stroke={isSelected ? "#C28220" : "var(--gl-gold-hairline)"}
                              strokeWidth={isSelected ? 2.5 : 1}
                              opacity={isSelected ? 1 : 0.85}
                              className="transition-all duration-200 hover:opacity-100"
                              style={{
                                filter: isSelected ? "url(#wheelShadow)" : "none",
                              }}
                            />
                            {/* Inner circle bounds to enforce boundaries */}
                            <circle cx={CX} cy={CY} r={R_INNER} fill="none" stroke="var(--gl-gold-hairline)" strokeWidth={1} />

                            {/* Slot Number Label */}
                            <text
                              x={numPos.x}
                              y={numPos.y + 3}
                              textAnchor="middle"
                              fill={isSelected ? "#FFF" : groupConfig.color}
                              fontSize={10}
                              fontWeight={800}
                              style={{
                                fontFamily: "var(--font-sans), sans-serif",
                              }}
                              transform={`rotate(${textRot}, ${numPos.x}, ${numPos.y})`}
                            >
                              {slot.id}
                            </text>

                            {/* Slot Content Name Label */}
                            <text
                              x={labelPos.x}
                              y={labelPos.y + 3}
                              textAnchor="middle"
                              fill={isSelected ? "#FFF" : "var(--gl-ink-primary)"}
                              fontSize={9}
                              fontWeight={700}
                              style={{
                                fontFamily: "var(--font-sans), sans-serif",
                                opacity: isSelected ? 1 : 0.75
                              }}
                              transform={`rotate(${textRot}, ${labelPos.x}, ${labelPos.y})`}
                            >
                              {SLOT_SHORT_LABELS[index]}
                            </text>
                          </g>
                        );
                      })}

                      {/* Decorative inner golden rim */}
                      <circle cx={CX} cy={CY} r={R_HUB} fill="url(#hubGrad)" stroke="var(--gl-gold-accent)" strokeWidth={1.5} />

                      {/* Center Hub Content */}
                      <g className="pointer-events-none">
                        <text
                          x={CX}
                          y={CY - 14}
                          textAnchor="middle"
                          fill="var(--gl-ink-muted)"
                          fontSize={9}
                          fontWeight={600}
                          style={{ textTransform: "uppercase", letterSpacing: "0.1em" }}
                        >
                          Active Slot
                        </text>
                        <text
                          x={CX}
                          y={CY + 10}
                          textAnchor="middle"
                          fill={activeGroupInfo.color}
                          fontSize={24}
                          fontWeight={800}
                          style={{ fontFamily: "var(--font-cormorant), serif" }}
                        >
                          #{activeSlot.id}
                        </text>
                        <text
                          x={CX}
                          y={CY + 26}
                          textAnchor="middle"
                          fill="var(--gl-ink-secondary)"
                          fontSize={10}
                          fontWeight={600}
                          style={{ letterSpacing: "0.02em" }}
                        >
                          {activeGroupInfo.label}
                        </text>
                      </g>
                    </svg>
                  </div>

                  {/* Physical Navigation Up and Down Arrow buttons utilizing whitespace */}
                  <div className="flex items-center justify-center gap-4 w-full pt-2">
                    <motion.button
                      whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
                      onClick={() => {
                        const prevId = selectedSlotId === 1 ? 12 : selectedSlotId - 1;
                        selectSlot(prevId);
                      }}
                      className="px-4 py-2 rounded-xl border flex items-center gap-2 text-xs font-bold transition shadow-sm hover:shadow"
                      style={{
                        background: "var(--gl-surface-manuscript)",
                        borderColor: "var(--gl-gold-hairline)",
                        color: "var(--gl-ink-primary)"
                      }}
                      title="Previous template slot (ArrowUp)"
                    >
                      <span>▲</span>
                      <span>Prev Slot (Up)</span>
                    </motion.button>

                    <motion.button
                      whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
                      onClick={() => {
                        const nextId = selectedSlotId === 12 ? 1 : selectedSlotId + 1;
                        selectSlot(nextId);
                      }}
                      className="px-4 py-2 rounded-xl border flex items-center gap-2 text-xs font-bold transition shadow-sm hover:shadow"
                      style={{
                        background: "var(--gl-surface-manuscript)",
                        borderColor: "var(--gl-gold-hairline)",
                        color: "var(--gl-ink-primary)"
                      }}
                      title="Next template slot (ArrowDown)"
                    >
                      <span>▼</span>
                      <span>Next Slot (Down)</span>
                    </motion.button>
                  </div>
                </div>

                {/* Right Column: Dynamic Detail Card + Group Info */}
                <div className="lg:col-span-6 space-y-6">
                  {/* Active slot detail panel with AnimatePresence */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeSlot.id}
                      initial={shouldReduceMotion ? undefined : { opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={shouldReduceMotion ? undefined : { opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="rounded-2xl p-6 border-t-4 transition-all duration-300"
                      style={{
                        background: "var(--gl-surface-manuscript)",
                        border: "1px solid var(--gl-gold-hairline)",
                        borderTopColor: activeGroupInfo.color,
                        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.02)"
                      }}
                    >
                      <div className="flex items-center justify-between border-b pb-3 mb-4" style={{ borderColor: "var(--gl-gold-hairline)" }}>
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{ background: activeGroupInfo.bg, color: activeGroupInfo.color }}
                          >
                            {activeSlot.id}
                          </span>
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: activeGroupInfo.color }}>
                              {activeGroupInfo.label} group
                            </span>
                            <h3 className="text-lg font-bold" style={{ color: "var(--gl-ink-primary)" }}>
                              {activeSlot.label}
                            </h3>
                          </div>
                        </div>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: "rgba(0,0,0,0.03)", color: "var(--gl-ink-muted)" }}>
                          Slot {activeSlot.id} of 12
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--gl-ink-muted)] mb-1">
                            Interpretive Purpose
                          </p>
                          <p className="text-sm leading-relaxed" style={{ color: "var(--gl-ink-secondary)" }}>
                            {activeSlot.gives}
                          </p>
                        </div>

                        {/* Worked Aśvinī value preview */}
                        <div className="rounded-xl p-4 border" style={{ background: activeGroupInfo.bg, borderColor: `${activeGroupInfo.color}18` }}>
                          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-2" style={{ color: activeGroupInfo.color }}>
                            <Award size={14} />
                            Aśvinī Example Value
                          </div>
                          <p className="text-xs font-medium leading-relaxed" style={{ color: "var(--gl-ink-primary)" }}>
                            <IAST>{activeSlot.ashwini}</IAST>
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Group Info Summary Pill */}
                  <div
                    className="rounded-xl p-4 transition-all duration-300 border-l-4"
                    style={{
                      background: "var(--gl-surface-manuscript)",
                      border: "1px solid var(--gl-gold-hairline)",
                      borderLeftColor: activeGroupInfo.color,
                      borderLeftWidth: 4
                    }}
                  >
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1" style={{ color: activeGroupInfo.color }}>
                      <activeGroupInfo.icon size={14} />
                      {activeGroupInfo.label} Family
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--gl-ink-secondary)" }}>
                      {activeGroupInfo.summary} study details apply to this entire coordinate family.
                    </p>
                  </div>
                </div>
              </div>

              {/* Group overview quick access toolbar */}
              <div className="space-y-3">
                <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: "var(--gl-ink-muted)", textAlign: "center" }}>
                  Quick Filter by Slot Family
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {GROUP_ORDER.map((key) => {
                    const item = GROUPS[key];
                    const isActive = activeSlot.group === key;
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          const slots = SLOTS.filter((s) => s.group === key);
                          if (slots.length > 0) {
                            selectSlot(slots[0].id);
                          }
                        }}
                        className="px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 border"
                        style={{
                          background: isActive ? item.color : "var(--gl-surface-manuscript)",
                          color: isActive ? "#FFF" : "var(--gl-ink-secondary)",
                          borderColor: isActive ? item.color : "var(--gl-gold-hairline)",
                          opacity: isActive ? 1 : 0.8
                        }}
                      >
                        <item.icon size={13} />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: NAKṢATRA VS RĀŚI THEORY ANALYZER (A2B) */}
          {activeTab === "a2b" && (
            <motion.div
              key="a2b-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Header Info */}
              <div className="rounded-xl p-4 bg-[var(--gl-surface-manuscript)] border border-[var(--gl-gold-hairline)] flex items-start gap-3">
                <Info className="text-[var(--gl-gold-accent,#C28220)] shrink-0 mt-0.5" size={18} />
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
                    The Essential Foundational Distinction
                  </h3>
                  <p className="text-xs mt-1" style={{ color: "var(--gl-ink-secondary)" }}>
                    Many practitioners confuse Nakṣatras (the 27 lunar mansions) with Rāśis (the 12 solar signs). 
                    Use this A2B Analyzer to map, compare, and drill your theoretical understanding.
                  </p>
                </div>
              </div>

              {/* Two Worlds SVG Diagram (Module 3 Reference style) */}
              <div className="rounded-xl p-5" style={{ background: "var(--gl-surface-manuscript)", border: "1px solid var(--gl-gold-hairline)" }}>
                <svg viewBox="0 0 720 280" className="w-full h-auto" style={{ maxWidth: "100%" }}>
                  <defs>
                    <filter id="twShadow" x="-10%" y="-10%" width="120%" height="120%">
                      <feDropShadow dx="0" dy={2} stdDeviation={3} floodColor="#4B331A" floodOpacity="0.08" />
                    </filter>
                    <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FCF7EE" />
                      <stop offset="100%" stopColor="#F5E8D2" />
                    </linearGradient>
                    <linearGradient id="indigoGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EEF2FA" />
                      <stop offset="100%" stopColor="#D5E0F2" />
                    </linearGradient>
                  </defs>

                  {/* Left Column: Nakshatra (Lunar Level) */}
                  <rect x={20} y={20} width={300} height={240} rx={16} fill="url(#goldGrad)" stroke="#C28220" strokeWidth={1.5} strokeOpacity={0.5} filter="url(#twShadow)" />
                  <text x={170} y={48} textAnchor="middle" fill="#C28220" fontSize={13} fontWeight={700} style={{ fontFamily: "var(--font-sans), sans-serif", textTransform: "uppercase", letterSpacing: "0.1em" }}>Nakṣatra Level</text>
                  <text x={170} y={64} textAnchor="middle" fill="var(--gl-ink-muted)" fontSize={10}>The Lunar mansions (Chandra)</text>

                  {/* Moon icon */}
                  <circle cx={170} cy={110} r={22} fill="#FCF7EE" stroke="#C28220" strokeWidth={1.5} />
                  <text x={170} y={117} textAnchor="middle" fill="#C28220" fontSize={20} fontWeight={700}>☽</text>
                  <text x={170} y={146} textAnchor="middle" fill="#C28220" fontSize={10} fontWeight={600}>Moon / Instincts</text>

                  {/* 27 divisions box */}
                  <rect x={110} y={175} width={120} height={34} rx={8} fill="#FFFDF8" stroke="#C28220" strokeWidth={1} />
                  <text x={170} y={191} textAnchor="middle" fill="#C28220" fontSize={11} fontWeight={700}>27 Divisions</text>
                  <text x={170} y={202} textAnchor="middle" fill="var(--gl-ink-muted)" fontSize={9}>13°20′ segment span</text>
                  <text x={170} y={242} textAnchor="middle" fill="#C28220" fontSize={11} fontWeight={600}>Dasha & Mental Matrix</text>

                  {/* VS divider */}
                  <line x1={360} y1={40} x2={360} y2={240} stroke="var(--gl-gold-hairline)" strokeWidth={1} strokeDasharray="6 4" />
                  <circle cx={360} cy={140} r={18} fill="#FFF9F0" stroke="#C28220" strokeWidth={1.5} />
                  <text x={360} y={146} textAnchor="middle" fill="#C28220" fontSize={11} fontWeight={700}>VS</text>

                  {/* Right Column: Rashi (Solar Level) */}
                  <rect x={400} y={20} width={300} height={240} rx={16} fill="url(#indigoGrad)" stroke="#4A6FA8" strokeWidth={1.5} strokeOpacity={0.5} filter="url(#twShadow)" />
                  <text x={550} y={48} textAnchor="middle" fill="#4A6FA8" fontSize={13} fontWeight={700} style={{ fontFamily: "var(--font-sans), sans-serif", textTransform: "uppercase", letterSpacing: "0.1em" }}>Rāśi Level</text>
                  <text x={550} y={64} textAnchor="middle" fill="var(--gl-ink-muted)" fontSize={10}>The Solar signs (Surya)</text>

                  {/* Sun icon */}
                  <circle cx={550} cy={110} r={22} fill="#EEF2FA" stroke="#4A6FA8" strokeWidth={1.5} />
                  <text x={550} y={117} textAnchor="middle" fill="#4A6FA8" fontSize={20} fontWeight={700}>☉</text>
                  <text x={550} y={146} textAnchor="middle" fill="#4A6FA8" fontSize={10} fontWeight={600}>Sun / Rationality</text>

                  {/* 12 signs box */}
                  <rect x={490} y={175} width={120} height={34} rx={8} fill="#FFFDF8" stroke="#4A6FA8" strokeWidth={1} />
                  <text x={550} y={191} textAnchor="middle" fill="#4A6FA8" fontSize={11} fontWeight={700}>12 Divisions</text>
                  <text x={550} y={202} textAnchor="middle" fill="var(--gl-ink-muted)" fontSize={9}>30° segment span</text>
                  <text x={550} y={242} textAnchor="middle" fill="#4A6FA8" fontSize={11} fontWeight={600}>Dignity & Physical Assets</text>
                </svg>
              </div>

              {/* Side-by-Side Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  className="rounded-2xl p-6 transition-all duration-300 border-t-4"
                  style={{
                    background: "var(--gl-surface-manuscript)",
                    border: "1px solid var(--gl-gold-hairline)",
                    borderTopColor: "#C28220"
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl" style={{ color: "#C28220" }}>☽</span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#C28220" }}>Lunar Axis</p>
                      <h4 className="text-lg font-bold" style={{ color: "var(--gl-ink-primary)" }}>Nakṣatra (Lunar Mansions)</h4>
                    </div>
                  </div>
                  <ul className="space-y-3 text-xs" style={{ color: "var(--gl-ink-secondary)" }}>
                    <li className="flex items-start gap-2">
                      <span className="text-[#C28220] font-bold">27</span>
                      <span>Divided into <strong>27 zones of 13°20′</strong> each.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#C28220] font-bold">🧠</span>
                      <span>Represents the <strong>mental matrix (manas)</strong>, emotions, and subtle karmic instincts.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#C28220] font-bold">⌛</span>
                      <span>Vimśottarī Dasha trigger - maps <strong>how karma unfolds in time</strong>.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#C28220] font-bold">🔱</span>
                      <span>Rooted in <strong>Vedic deity alignments</strong> (Devatā) and physical temperaments.</span>
                    </li>
                  </ul>
                </div>

                <div
                  className="rounded-2xl p-6 transition-all duration-300 border-t-4"
                  style={{
                    background: "var(--gl-surface-manuscript)",
                    border: "1px solid var(--gl-gold-hairline)",
                    borderTopColor: "#4A6FA8"
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl" style={{ color: "#4A6FA8" }}>☉</span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#4A6FA8" }}>Solar Axis</p>
                      <h4 className="text-lg font-bold" style={{ color: "var(--gl-ink-primary)" }}>Rāśi (Zodiac Signs)</h4>
                    </div>
                  </div>
                  <ul className="space-y-3 text-xs" style={{ color: "var(--gl-ink-secondary)" }}>
                    <li className="flex items-start gap-2">
                      <span className="text-[#4A6FA8] font-bold">12</span>
                      <span>Divided into <strong>12 signs of 30°</strong> each.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#4A6FA8] font-bold">🏛️</span>
                      <span>Represents the <strong>physical container</strong>, external circumstances, and logical fields.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#4A6FA8] font-bold">⚖️</span>
                      <span>Governs <strong>planetary dignity</strong> (exaltation, debilitation) and house lordship strengths.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#4A6FA8] font-bold">⚡</span>
                      <span>Rooted in <strong>elements</strong> (fire/earth/air/water) and signs' bodily configurations.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Comparison Table */}
              <div className="rounded-xl p-5" style={{ background: "var(--gl-surface-manuscript)", border: "1px solid var(--gl-gold-hairline)" }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "var(--gl-gold-accent)" }}>
                  Side-by-Side System Matrix
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs" style={{ borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th className="text-left px-3 py-2 uppercase tracking-wider text-[10px]" style={{ color: "var(--gl-gold-accent)", borderBottom: "2px solid var(--gl-gold-hairline)" }}>Dimension</th>
                        <th className="text-left px-3 py-2 uppercase tracking-wider text-[10px]" style={{ color: "#C28220", borderBottom: "2px solid var(--gl-gold-hairline)" }}>Nakṣatra System</th>
                        <th className="text-left px-3 py-2 uppercase tracking-wider text-[10px]" style={{ color: "#4A6FA8", borderBottom: "2px solid var(--gl-gold-hairline)" }}>Rāśi System</th>
                      </tr>
                    </thead>
                    <tbody>
                      {A2B_COMPARISON_ROWS.map((row, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? "rgba(0, 0, 0, 0.015)" : "transparent" }}>
                          <td className="px-3 py-3 font-semibold" style={{ color: "var(--gl-ink-primary)", borderBottom: "1px solid var(--gl-gold-hairline)" }}>{row.dim}</td>
                          <td className="px-3 py-3" style={{ color: "var(--gl-ink-secondary)", borderBottom: "1px solid var(--gl-gold-hairline)" }}>{row.nak}</td>
                          <td className="px-3 py-3" style={{ color: "var(--gl-ink-secondary)", borderBottom: "1px solid var(--gl-gold-hairline)" }}>{row.ras}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Interactive Discrimination Drill */}
              <div className="rounded-2xl p-6 space-y-4" style={{ background: "var(--gl-surface-manuscript)", border: "1px solid var(--gl-gold-hairline)" }}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-3 mb-4 gap-2" style={{ borderColor: "var(--gl-gold-hairline)" }}>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--gl-gold-accent)" }}>
                      A/B Discrimination Drill: 8 Statements
                    </h4>
                    <p className="text-xs" style={{ color: "var(--gl-ink-secondary)" }}>
                      Test your theoretical instincts. Classify each statement correctly.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-semibold" style={{ color: "var(--gl-ink-muted)" }}>
                      {correctA2bCount} / {A2B_DRILL_ITEMS.length} Correct
                    </span>
                  </div>
                </div>

                <div className="space-y-3.5">
                  {A2B_DRILL_ITEMS.map((item) => {
                    const picked = a2bAnswers[item.id];
                    const isRevealed = a2bRevealed[item.id];
                    const isCorrect = picked === item.answer;

                    return (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl transition-all duration-200"
                        style={{
                          background: isRevealed
                            ? isCorrect
                              ? "rgba(45, 125, 70, 0.04)"
                              : "rgba(162, 58, 30, 0.03)"
                            : "rgba(0, 0, 0, 0.01)",
                          border: isRevealed
                            ? `1px solid ${isCorrect ? "#2d7d46" : "#A23A1E"}`
                            : "1px solid var(--gl-gold-hairline)",
                        }}
                      >
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <p className="text-xs font-medium" style={{ color: "var(--gl-ink-primary)" }}>
                              <span className="font-bold text-[var(--gl-gold-accent)] mr-2">{item.id}.</span>
                              {item.statement}
                            </p>
                            {isRevealed && (
                              <div
                                className="p-3 rounded-lg text-xs leading-relaxed"
                                style={{
                                  background: isCorrect ? "rgba(45, 125, 70, 0.08)" : "rgba(162, 58, 30, 0.06)",
                                  color: isCorrect ? "#2d7d46" : "#A23A1E",
                                }}
                              >
                                <span className="font-bold">{isCorrect ? "Correct: " : "Not quite: "}</span>
                                {item.correction}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2 shrink-0 self-end md:self-start">
                            <button
                              onClick={() => selectA2b(item.id, "nakshatra")}
                              disabled={isRevealed}
                              className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition ${
                                picked === "nakshatra"
                                  ? "bg-[#C28220] text-[#1a1a2e]"
                                  : "bg-[var(--gl-surface-manuscript)] text-[#C28220] border border-[#C28220]"
                              }`}
                              style={{ opacity: isRevealed && picked !== "nakshatra" ? 0.5 : 1 }}
                            >
                              Nakṣatra
                            </button>
                            <button
                              onClick={() => selectA2b(item.id, "rashi")}
                              disabled={isRevealed}
                              className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition ${
                                picked === "rashi"
                                  ? "bg-[#4A6FA8] text-white"
                                  : "bg-[var(--gl-surface-manuscript)] text-[#4A6FA8] border border-[#4A6FA8]"
                              }`}
                              style={{ opacity: isRevealed && picked !== "rashi" ? 0.5 : 1 }}
                            >
                              Rāśi
                            </button>

                            {!isRevealed ? (
                              <button
                                onClick={() => checkA2b(item.id)}
                                disabled={!picked}
                                className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition ${
                                  picked
                                    ? "bg-[var(--gl-ink-primary)] text-white"
                                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                }`}
                              >
                                Check
                              </button>
                            ) : (
                              <button
                                onClick={() => resetA2b(item.id)}
                                className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-transparent text-[var(--gl-ink-muted)] border border-[var(--gl-gold-hairline)]"
                              >
                                Retry
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: WORKED ASHVINI APPLIED PROFILE */}
          {activeTab === "ashvini" && (
            <motion.div
              key="ashvini-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Header applied profile details */}
              <div className="rounded-xl p-5 border-l-4 border-[var(--gl-gold-accent)] bg-[var(--gl-surface-manuscript)] border border-[var(--gl-gold-hairline)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold" style={{ color: "var(--gl-ink-primary)", fontFamily: "var(--font-cormorant), serif" }}>
                    Aśvinī Applied Profile: First Worked Example
                  </h3>
                  <p className="text-xs mt-1" style={{ color: "var(--gl-ink-secondary)" }}>
                    See how the empty slots of the 12-attribute scaffold translate into the first nakṣatra profile.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAshviniRevealCount((prev) => Math.min(12, prev + 2))}
                    disabled={ashviniRevealCount === 12}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      ashviniRevealCount < 12
                        ? "bg-[var(--gl-gold-accent,#C28220)] text-[#1a1a2e] hover:shadow-sm"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Reveal Next Slots
                  </button>
                  <button
                    onClick={() => setAshviniRevealCount(12)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--gl-surface-manuscript)] border border-[var(--gl-gold-hairline)]"
                  >
                    Reveal All
                  </button>
                </div>
              </div>

              {/* Collapsible Step-by-Step guide to reading */}
              <div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--gl-gold-hairline)" }}>
                <details className="group">
                  <summary className="w-full text-left px-4 py-3 text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors bg-[var(--gl-surface-twilight-glass)] hover:bg-[var(--gl-surface-manuscript)]">
                    <span className="flex items-center gap-2 text-[var(--gl-gold-accent)] font-bold">
                      🎓 Step-by-step guideline: How to synthesize any profile
                    </span>
                    <span className="transition-transform group-open:rotate-180">▼</span>
                  </summary>
                  <div className="p-4 space-y-3 text-xs leading-relaxed bg-[var(--gl-surface-manuscript)] text-[var(--gl-ink-secondary)]">
                    <p>
                      A listing of 12 facts is not yet an astrological reading. To read a nakṣatra correctly, synthesize these 12 slots using this canonical sequence:
                    </p>
                    <div className="space-y-2 pt-1 border-t" style={{ borderColor: "var(--gl-gold-hairline)" }}>
                      <div className="flex items-start gap-2.5">
                        <span className="px-1.5 py-0.5 rounded bg-[#4A6FA8] text-white font-bold text-[9px]">1</span>
                        <span><strong>Map Coordinates (Location):</strong> Pin the range, sign, and padas. This establishes the structural house placement and divisional navāṁśa bridge (D1 ↔ D9).</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="px-1.5 py-0.5 rounded bg-[#8B5A2B] text-white font-bold text-[9px]">2</span>
                        <span><strong>Operational Clock (Timing):</strong> Identify the Vimśottarī lord. This dictates which dasha periods activate this star's potential.</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="px-1.5 py-0.5 rounded bg-[#C28220] text-white font-bold text-[9px]">3</span>
                        <span><strong>Spiritual Blueprint (Meaning):</strong> Weave the deity, symbol, and name together. E.g. Aśvinī = horse's head (vitality/speed) + divine physicians (healing) + 'of the horse' = swift medical/restorative action.</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="px-1.5 py-0.5 rounded bg-[#2d7d46] text-white font-bold text-[9px]">4</span>
                        <span><strong>Functional Mode (Temperament):</strong> Qualify the action using Gaṇa (compatibility/ethics) and Quality (light/swift, fixed, etc. to dictate muhūrta suitability).</span>
                      </div>
                    </div>
                  </div>
                </details>
              </div>

              {/* Grid of sequential cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {SLOTS.slice(0, ashviniRevealCount).map((slotItem) => {
                  const itemGroup = GROUPS[slotItem.group];
                  return (
                    <motion.div
                      key={slotItem.id}
                      initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.25 }}
                      className="rounded-xl p-5 border-t-4 transition-all duration-300 hover:shadow-md"
                      style={{
                        background: "var(--gl-surface-manuscript)",
                        border: "1px solid var(--gl-gold-hairline)",
                        borderTopColor: itemGroup.color,
                      }}
                    >
                      <div className="flex items-center justify-between border-b pb-2 mb-3" style={{ borderColor: "var(--gl-gold-hairline)" }}>
                        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: itemGroup.color }}>
                          {itemGroup.label}
                        </span>
                        <span className="text-[10px] font-bold text-[var(--gl-ink-muted)]">Slot #{slotItem.id}</span>
                      </div>

                      <h4 className="text-sm font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
                        {slotItem.label}
                      </h4>

                      {/* Line connector concept visualization */}
                      <div className="flex items-center gap-1.5 my-2.5">
                        <div className="h-[1px] flex-1 bg-[rgba(0,0,0,0.06)]" />
                        <span className="text-[9px] font-bold uppercase text-gray-400 tracking-wider">Applied Mapping</span>
                        <div className="h-[1px] flex-1 bg-[rgba(0,0,0,0.06)]" />
                      </div>

                      <div
                        className="rounded-lg p-3 transition-colors"
                        style={{
                          background: itemGroup.bg,
                          border: `1.5px solid ${itemGroup.color}15`,
                        }}
                      >
                        <p className="text-xs font-semibold leading-relaxed" style={{ color: "var(--gl-ink-primary)" }}>
                          <IAST>{slotItem.ashwini}</IAST>
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {ashviniRevealCount < 12 && (
                <div className="flex justify-center pt-4">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    onClick={() => setAshviniRevealCount((prev) => Math.min(12, prev + 3))}
                    className="px-6 py-2.5 bg-[var(--gl-gold-accent,#C28220)] text-[#1a1a2e] text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm hover:shadow transition flex items-center gap-2"
                  >
                    <span>Reveal Next 3 Attributes</span>
                    <ChevronRight size={14} />
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cross-References Footer (Design Token Aligned) */}
      <div
        className="mt-12 rounded-xl p-5 border-t"
        style={{
          borderColor: "var(--gl-gold-hairline)",
          background: "rgba(0,0,0,0.01)"
        }}
      >
        <p className="text-[10px] uppercase font-bold tracking-widest text-[var(--gl-ink-muted)] mb-3 text-center sm:text-left">
          Cross-References & Deep Study Threads
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <p style={{ color: "var(--gl-ink-secondary)" }}>
              <strong>Applied Star Profiles:</strong> Next Lesson →{" "}
              <a
                href="#/lesson/lesson-02-ashwini-the-horse-headed-physicians"
                className="underline transition hover:text-[var(--gl-gold-accent)]"
                style={{ color: "var(--gl-ink-primary)", fontWeight: 500 }}
              >
                Lesson 7.1.2: Aśvinī
              </a>
            </p>
            <p style={{ color: "var(--gl-ink-secondary)" }}>
              <strong>Solar/Rāśi Parallel:</strong> Reference Chapter 4 →{" "}
              <a
                href="#/lesson/lesson-4-1-the-rashi-boundary-wheel"
                className="underline transition hover:text-[var(--gl-gold-accent)]"
                style={{ color: "var(--gl-ink-primary)", fontWeight: 500 }}
              >
                Lesson 4.1.1: Sign Boundaries
              </a>
            </p>
          </div>
          <div className="text-left sm:text-right text-[10px]" style={{ color: "var(--gl-ink-muted)" }}>
            <p>Primary Sources: Bṛhat Pārāśara Horā Śāstra · Mantreśvara's Phaladīpikā ch. 16</p>
            <p className="mt-1">V1.0 Redesign • Complies with Foundation Design Standards</p>
          </div>
        </div>
      </div>
    </div>
  );
}
