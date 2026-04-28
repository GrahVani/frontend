"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sun,
  Flame,
  Star,
  Zap,
  CheckCircle2,
  Circle,
  ChevronRight,
  RotateCcw,
  BookOpen,
  BrainCircuit,
  Puzzle,
  Sparkles,
  Telescope,
  Lightbulb,
  ArrowRight,
  Trophy,
  Clock,
} from "lucide-react";

/* ─── Types ─── */
interface DailyTask {
  id: string;
  type: "concept-card" | "knowledge-check" | "matching" | "keyword-blend" | "case-study" | "guided-reading";
  title: string;
  description: string;
  durationMin: number;
  astroPoints: number;
  completed: boolean;
}

interface ConceptCard {
  front: string;
  back: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface MatchPair {
  id: string;
  left: string;
  right: string;
}

/* ─── Mock Daily Content ─── */
const dailyTransit = {
  title: "Venus enters Leo today",
  summary:
    "Venus, the planet of love and values, moves into the fiery sign of Leo. This transit brings warmth, generosity, and creative expression to relationships and artistic pursuits.",
  conceptual:
    "Leo is a Fire sign ruled by the Sun — it seeks recognition, drama, and heartfelt expression. When Venus visits Leo, affection becomes more demonstrative and pride plays a role in how we give and receive love.",
  manifestation:
    "You may feel drawn to bold romantic gestures, creative hobbies, or luxury experiences. It's a favorable time for creative projects, social events, and expressing appreciation openly.",
  chartNote:
    "If you have planets in Leo — especially the Sun, Moon, or Ascendant — this transit activates your personal chart directly, amplifying your charisma and desire for recognition.",
};

const conceptCards: ConceptCard[] = [
  { front: "Leo zodiac glyph", back: "Leo — Fire, Fixed, Ruled by the Sun. Keywords: Creativity, Drama, Generosity, Leadership, Loyalty." },
  { front: "Venus planetary symbol", back: "Venus — Love, Values, Beauty, Relationships, Money, Art. Rules Taurus and Libra. Exalted in Pisces." },
  { front: "5th House icon", back: "5th House — House of Creativity, Romance, Children, Self-Expression, Pleasure, Speculation. Ruled by Leo / Sun." },
];

const knowledgeCheckQuestions: QuizQuestion[] = [
  {
    question: "What element is Leo associated with?",
    options: ["Earth", "Water", "Fire", "Air"],
    correctIndex: 2,
    explanation: "Leo is a Fire sign, along with Aries and Sagittarius. Fire signs are associated with inspiration, action, and enthusiasm.",
  },
  {
    question: "Which planet rules Leo?",
    options: ["Mars", "Jupiter", "Saturn", "The Sun"],
    correctIndex: 3,
    explanation: "Leo is ruled by the Sun, representing core identity, ego, and conscious will. The Sun is the center of our solar system and the chart.",
  },
  {
    question: "When Venus enters Leo, relationships tend to become:",
    options: ["Reserved and practical", "Dramatic and expressive", "Detached and intellectual", "Secretive and intense"],
    correctIndex: 1,
    explanation: "Venus in Leo brings warmth, generosity, and a desire for recognition in relationships. Affection is expressed openly and dramatically.",
  },
];

const matchPairs: MatchPair[] = [
  { id: "1", left: "Aries", right: "Mars" },
  { id: "2", left: "Taurus", right: "Venus" },
  { id: "3", left: "Gemini", right: "Mercury" },
  { id: "4", left: "Cancer", right: "Moon" },
];

const keywordBlend = {
  placement: "Venus in Leo in the 5th House",
  keywords: { planet: "love/values/creativity", sign: "generosity/drama/self-expression", house: "romance/creativity/children" },
  options: [
    "This person is shy and reserved in love, preferring quiet solitude.",
    "This person expresses love through grand, creative gestures and seeks romantic recognition. They may be drawn to artistic partners and enjoy playful, dramatic self-expression.",
    "This person approaches relationships with cold logic and detachment.",
    "This person prefers secretive, behind-the-scenes connections without public acknowledgment.",
  ],
  correctIndex: 1,
  explanation:
    "Venus (love) + Leo (drama/generosity) + 5th House (romance/creativity) = expressive, heartfelt affection channeled through creative and romantic outlets.",
};

const caseStudy = {
  title: "Creative Block Breakthrough",
  scenario:
    "Ravi, a 28-year-old musician, has felt uninspired for months. His birth chart shows Venus in Leo in the 5th House. Today, Venus transits exactly over his natal Venus.",
  questions: [
    {
      question: "What is the primary creative theme in Ravi's chart?",
      options: ["Technical precision", "Emotional depth", "Dramatic self-expression", "Intellectual analysis"],
      correctIndex: 2,
      explanation: "Venus in Leo in the 5th House points to creative expression that is warm, dramatic, and heartfelt — performance and recognition matter.",
    },
    {
      question: "What advice aligns best with his Venus placement?",
      options: [
        "Work alone in silence",
        "Share his music publicly and embrace the spotlight",
        "Focus only on commercial success",
        "Abandon music for a practical career",
      ],
      correctIndex: 1,
      explanation: "Leo energy thrives on recognition and heartfelt expression. Sharing his work publicly aligns with Venus in Leo's need for appreciative audience.",
    },
  ],
};

const guidedReading = {
  title: "Understanding Venus Transits",
  sections: [
    {
      heading: "What is a Venus Transit?",
      text: "A Venus transit occurs when Venus moves through a zodiac sign and makes aspects to planets in your natal chart. Venus changes signs approximately every 4-5 weeks, bringing shifting flavors to love, money, and aesthetics.",
    },
    {
      heading: "Venus in Leo: The Heart on Display",
      text: "When Venus enters Leo, the heart wants to be seen. This is not a time for hiding feelings — it's a time for grand romantic gestures, creative risks, and generous expressions of affection. Think of it as the cosmic equivalent of writing a love letter in gold ink.",
    },
    {
      heading: "How to Work With This Energy",
      text: "1. Express appreciation openly and dramatically. 2. Start a creative project that puts you in the spotlight. 3. Dress with confidence and flair. 4. Plan social gatherings that celebrate connection. 5. Avoid letting pride block vulnerability — Leo's shadow is ego-driven conflict.",
    },
  ],
};

/* ─── Main Page ─── */
export default function DailyPage() {
  const [tasks, setTasks] = useState<DailyTask[]>([
    { id: "t1", type: "concept-card", title: "Daily Concept Cards", description: "Review 3 flashcards with spaced repetition", durationMin: 3, astroPoints: 30, completed: false },
    { id: "t2", type: "knowledge-check", title: "Knowledge Check", description: "3-question quiz on today's theme", durationMin: 3, astroPoints: 30, completed: false },
    { id: "t3", type: "matching", title: "Sign-to-Ruler Match", description: "Match zodiac signs to their ruling planets", durationMin: 2, astroPoints: 20, completed: false },
    { id: "t4", type: "keyword-blend", title: "Keyword Blending", description: "Blend planet + sign + house into interpretation", durationMin: 4, astroPoints: 40, completed: false },
    { id: "t5", type: "case-study", title: "Case Study", description: "Apply theory to a realistic chart scenario", durationMin: 5, astroPoints: 50, completed: false },
    { id: "t6", type: "guided-reading", title: "Guided Reading", description: "Short lesson on Venus transits", durationMin: 4, astroPoints: 40, completed: false },
  ]);

  const streakDays = 3;
  const totalPoints = tasks.reduce((s, t) => s + (t.completed ? t.astroPoints : 0), 0);
  const maxPoints = tasks.reduce((s, t) => s + t.astroPoints, 0);
  const allCompleted = tasks.every((t) => t.completed);

  const markComplete = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: true } : t)));
  };

  const resetAll = () => {
    setTasks((prev) => prev.map((t) => ({ ...t, completed: false })));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-orange-900 text-white shadow-lg">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sun className="w-5 h-5 text-amber-300" />
                <span className="text-amber-300 text-sm font-semibold tracking-wide uppercase">Daily Cosmic Weather</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Today&apos;s Learning</h1>
              <p className="text-amber-200 text-lg max-w-xl">
                A daily 3-minute lesson connecting current astrological transits to real-world events and your chart.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="text-center px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm">
                <Flame className="w-6 h-6 text-orange-400 mx-auto mb-1" />
                <div className="text-2xl font-bold">{streakDays}</div>
                <div className="text-xs text-amber-300">Day Streak</div>
              </div>
              <div className="text-center px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm">
                <Star className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                <div className="text-2xl font-bold">{totalPoints}</div>
                <div className="text-xs text-amber-300">AstroPoints</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* ── Daily Cosmic Weather Card ── */}
        <section className="bg-white rounded-2xl border border-amber-200/60 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Telescope className="w-5 h-5 text-amber-700" />
            <h2 className="text-xl font-bold text-amber-900">Daily Cosmic Weather</h2>
            <span className="ml-auto text-xs font-semibold text-amber-600 bg-amber-100 px-2.5 py-1 rounded-full">{new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</span>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200/50 p-5 mb-4">
            <h3 className="text-lg font-bold text-amber-900 mb-2">{dailyTransit.title}</h3>
            <p className="text-amber-800 leading-relaxed mb-4">{dailyTransit.summary}</p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white/70 rounded-lg p-4 border border-amber-100">
                <h4 className="font-semibold text-amber-900 text-sm mb-1 flex items-center gap-1.5">
                  <BrainCircuit className="w-4 h-4 text-amber-600" /> Concept
                </h4>
                <p className="text-sm text-amber-700 leading-relaxed">{dailyTransit.conceptual}</p>
              </div>
              <div className="bg-white/70 rounded-lg p-4 border border-amber-100">
                <h4 className="font-semibold text-amber-900 text-sm mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" /> Manifestation
                </h4>
                <p className="text-sm text-amber-700 leading-relaxed">{dailyTransit.manifestation}</p>
              </div>
              <div className="bg-white/70 rounded-lg p-4 border border-amber-100">
                <h4 className="font-semibold text-amber-900 text-sm mb-1 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-600" /> Your Chart
                </h4>
                <p className="text-sm text-amber-700 leading-relaxed">{dailyTransit.chartNote}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Daily Tasks ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-amber-700" />
              <h2 className="text-xl font-bold text-amber-900">Daily Tasks</h2>
              <span className="text-sm text-amber-600">
                {tasks.filter((t) => t.completed).length} / {tasks.length} completed
              </span>
            </div>
            <button
              onClick={resetAll}
              className="flex items-center gap-1.5 text-sm text-amber-600 hover:text-amber-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>

          <div className="grid gap-4">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onComplete={() => markComplete(task.id)} />
            ))}
          </div>
        </section>

        {/* ── Completion Banner ── */}
        {allCompleted && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-green-900">Daily Mission Complete!</h3>
              <p className="text-green-700 text-sm">You earned {maxPoints} AstroPoints today. Your streak is safe — come back tomorrow for new tasks.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Task Card ─── */
function TaskCard({ task, onComplete }: { task: DailyTask; onComplete: () => void }) {
  const [expanded, setExpanded] = useState(false);

  const iconMap = {
    "concept-card": BookOpen,
    "knowledge-check": BrainCircuit,
    matching: Puzzle,
    "keyword-blend": Sparkles,
    "case-study": Lightbulb,
    "guided-reading": BookOpen,
  };

  const Icon = iconMap[task.type];

  return (
    <div className={`bg-white rounded-2xl border transition-all ${task.completed ? "border-green-200/60 shadow-sm" : "border-amber-200/60 shadow-sm hover:shadow-md"}`}>
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${task.completed ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-700"}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`font-bold ${task.completed ? "text-green-900 line-through opacity-70" : "text-amber-900"}`}>{task.title}</h3>
              <p className="text-sm text-amber-600">{task.description}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-amber-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {task.durationMin} min
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3" /> +{task.astroPoints} pts
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!task.completed ? (
              <>
                <button
                  onClick={() => setExpanded((p) => !p)}
                  className="text-sm font-medium text-amber-700 hover:text-amber-900 px-3 py-1.5 rounded-lg hover:bg-amber-50 transition-colors"
                >
                  {expanded ? "Close" : "Start"}
                </button>
                <button
                  onClick={onComplete}
                  className="flex items-center gap-1.5 text-sm font-semibold bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Done
                </button>
              </>
            ) : (
              <div className="flex items-center gap-1.5 text-green-700 text-sm font-semibold bg-green-50 px-3 py-2 rounded-xl">
                <CheckCircle2 className="w-4 h-4" />
                Completed
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && !task.completed && (
        <div className="border-t border-amber-100 px-5 py-5 animate-in fade-in slide-in-from-top-1">
          {task.type === "concept-card" && <ConceptCardActivity onFinish={onComplete} />}
          {task.type === "knowledge-check" && <KnowledgeCheckActivity onFinish={onComplete} />}
          {task.type === "matching" && <MatchingActivity onFinish={onComplete} />}
          {task.type === "keyword-blend" && <KeywordBlendActivity onFinish={onComplete} />}
          {task.type === "case-study" && <CaseStudyActivity onFinish={onComplete} />}
          {task.type === "guided-reading" && <GuidedReadingActivity onFinish={onComplete} />}
        </div>
      )}
    </div>
  );
}

/* ─── Activity: Concept Cards ─── */
function ConceptCardActivity({ onFinish }: { onFinish: () => void }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [finished, setFinished] = useState(false);

  if (finished) {
    return (
      <div className="text-center py-6">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-6 h-6 text-green-600" />
        </div>
        <p className="text-amber-900 font-semibold mb-4">Concept cards reviewed!</p>
        <button onClick={onFinish} className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-2 rounded-xl transition-colors">
          Mark Complete
        </button>
      </div>
    );
  }

  const card = conceptCards[idx];

  return (
    <div className="max-w-md mx-auto">
      <div className="text-sm text-amber-600 text-center mb-3">
        Card {idx + 1} of {conceptCards.length}
      </div>
      <div
        onClick={() => setFlipped((p) => !p)}
        className={`cursor-pointer bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-8 text-center transition-all hover:shadow-md ${flipped ? "ring-2 ring-amber-300" : ""}`}
      >
        <p className="text-amber-900 font-bold text-lg mb-2">{flipped ? card.back : card.front}</p>
        <p className="text-xs text-amber-500 mt-2">{flipped ? "Tap to flip back" : "Tap to reveal"}</p>
      </div>
      <div className="flex items-center justify-center gap-3 mt-4">
        {flipped && (
          <>
            <button
              onClick={() => {
                setFlipped(false);
                if (idx < conceptCards.length - 1) setIdx((p) => p + 1);
                else setFinished(true);
              }}
              className="flex items-center gap-1.5 text-sm font-semibold bg-green-100 text-green-700 hover:bg-green-200 px-4 py-2 rounded-xl transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" /> Know It
            </button>
            <button
              onClick={() => {
                setFlipped(false);
                if (idx < conceptCards.length - 1) setIdx((p) => p + 1);
                else setFinished(true);
              }}
              className="flex items-center gap-1.5 text-sm font-semibold bg-amber-100 text-amber-700 hover:bg-amber-200 px-4 py-2 rounded-xl transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Still Learning
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Activity: Knowledge Check ─── */
function KnowledgeCheckActivity({ onFinish }: { onFinish: () => void }) {
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  if (finished) {
    return (
      <div className="text-center py-6">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Trophy className="w-6 h-6 text-green-600" />
        </div>
        <p className="text-amber-900 font-semibold mb-1">Quiz Complete!</p>
        <p className="text-amber-600 text-sm mb-4">{correctCount} / {knowledgeCheckQuestions.length} correct</p>
        <button onClick={onFinish} className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-2 rounded-xl transition-colors">
          Mark Complete
        </button>
      </div>
    );
  }

  const q = knowledgeCheckQuestions[qIdx];

  const handleSelect = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    setShowExplanation(true);
    if (i === q.correctIndex) setCorrectCount((p) => p + 1);
  };

  const next = () => {
    if (qIdx < knowledgeCheckQuestions.length - 1) {
      setQIdx((p) => p + 1);
      setSelected(null);
      setShowExplanation(false);
    } else {
      setFinished(true);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-sm text-amber-600 mb-3">Question {qIdx + 1} of {knowledgeCheckQuestions.length}</div>
      <h4 className="font-bold text-amber-900 mb-4">{q.question}</h4>
      <div className="space-y-2">
        {q.options.map((opt, i) => {
          const state = selected === null ? "neutral" : i === q.correctIndex ? "correct" : i === selected ? "wrong" : "dim";
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                state === "correct"
                  ? "bg-green-50 border-green-300 text-green-800"
                  : state === "wrong"
                  ? "bg-red-50 border-red-300 text-red-800"
                  : state === "dim"
                  ? "bg-gray-50 border-gray-200 text-gray-400"
                  : "bg-white border-amber-200 text-amber-900 hover:bg-amber-50 hover:border-amber-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold shrink-0">
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </div>
            </button>
          );
        })}
      </div>
      {showExplanation && (
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 animate-in fade-in">
          <p className="text-sm text-amber-800">
            <span className="font-semibold">Explanation:</span> {q.explanation}
          </p>
          <div className="text-right mt-3">
            <button onClick={next} className="text-sm font-semibold bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl transition-colors">
              {qIdx < knowledgeCheckQuestions.length - 1 ? "Next Question" : "See Results"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Activity: Matching ─── */
function MatchingActivity({ onFinish }: { onFinish: () => void }) {
  const [leftSelected, setLeftSelected] = useState<string | null>(null);
  const [rightSelected, setRightSelected] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [shake, setShake] = useState(false);

  const handleLeft = (id: string) => {
    if (matched.has(id)) return;
    setLeftSelected(id);
    if (rightSelected) checkMatch(id, rightSelected);
  };

  const handleRight = (text: string) => {
    setRightSelected(text);
    if (leftSelected) checkMatch(leftSelected, text);
  };

  const checkMatch = (leftId: string, rightText: string) => {
    const pair = matchPairs.find((p) => p.id === leftId);
    if (pair && pair.right === rightText) {
      setMatched((prev) => new Set(prev).add(leftId));
      setLeftSelected(null);
      setRightSelected(null);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      setLeftSelected(null);
      setRightSelected(null);
    }
  };

  if (matched.size === matchPairs.length) {
    return (
      <div className="text-center py-6">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-6 h-6 text-green-600" />
        </div>
        <p className="text-amber-900 font-semibold mb-4">All pairs matched!</p>
        <button onClick={onFinish} className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-2 rounded-xl transition-colors">
          Mark Complete
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide text-center">Signs</p>
          {matchPairs.map((p) => (
            <button
              key={p.id}
              onClick={() => handleLeft(p.id)}
              disabled={matched.has(p.id)}
              className={`w-full text-center py-3 rounded-xl border text-sm font-semibold transition-all ${
                matched.has(p.id)
                  ? "bg-green-50 border-green-300 text-green-700"
                  : leftSelected === p.id
                  ? "bg-amber-200 border-amber-400 text-amber-900 ring-2 ring-amber-300"
                  : "bg-white border-amber-200 text-amber-900 hover:bg-amber-50"
              }`}
            >
              {p.left}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide text-center">Rulers</p>
          {[...matchPairs].sort(() => Math.random() - 0.5).map((p) => (
            <button
              key={p.id + "-r"}
              onClick={() => handleRight(p.right)}
              className={`w-full text-center py-3 rounded-xl border text-sm font-semibold transition-all ${
                matched.has(matchPairs.find((mp) => mp.right === p.right)?.id || "")
                  ? "bg-green-50 border-green-300 text-green-700"
                  : rightSelected === p.right
                  ? "bg-amber-200 border-amber-400 text-amber-900 ring-2 ring-amber-300"
                  : shake && rightSelected === p.right
                  ? "bg-red-50 border-red-300 text-red-700 animate-pulse"
                  : "bg-white border-amber-200 text-amber-900 hover:bg-amber-50"
              }`}
            >
              {p.right}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Activity: Keyword Blending ─── */
function KeywordBlendActivity({ onFinish }: { onFinish: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
        <p className="text-sm font-bold text-amber-900 mb-2">{keywordBlend.placement}</p>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs bg-white border border-amber-200 text-amber-700 px-2 py-1 rounded-md">Planet: {keywordBlend.keywords.planet}</span>
          <span className="text-xs bg-white border border-amber-200 text-amber-700 px-2 py-1 rounded-md">Sign: {keywordBlend.keywords.sign}</span>
          <span className="text-xs bg-white border border-amber-200 text-amber-700 px-2 py-1 rounded-md">House: {keywordBlend.keywords.house}</span>
        </div>
      </div>
      <p className="text-sm text-amber-700 mb-3 font-medium">Select the most accurate blended interpretation:</p>
      <div className="space-y-2 mb-4">
        {keywordBlend.options.map((opt, i) => {
          const state = !submitted ? (selected === i ? "selected" : "neutral") : i === keywordBlend.correctIndex ? "correct" : selected === i ? "wrong" : "dim";
          return (
            <button
              key={i}
              onClick={() => !submitted && setSelected(i)}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                state === "correct"
                  ? "bg-green-50 border-green-300 text-green-800"
                  : state === "wrong"
                  ? "bg-red-50 border-red-300 text-red-800"
                  : state === "selected"
                  ? "bg-amber-100 border-amber-400 text-amber-900 ring-1 ring-amber-300"
                  : state === "dim"
                  ? "bg-gray-50 border-gray-200 text-gray-400"
                  : "bg-white border-amber-200 text-amber-900 hover:bg-amber-50"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {!submitted ? (
        <button
          onClick={() => setSubmitted(true)}
          disabled={selected === null}
          className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          Submit Answer
        </button>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 animate-in fade-in">
          <p className="text-sm text-amber-800 mb-3">
            <span className="font-semibold">Explanation:</span> {keywordBlend.explanation}
          </p>
          <button onClick={onFinish} className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors">
            Mark Complete
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Activity: Case Study ─── */
function CaseStudyActivity({ onFinish }: { onFinish: () => void }) {
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  if (finished) {
    return (
      <div className="text-center py-6">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Trophy className="w-6 h-6 text-green-600" />
        </div>
        <p className="text-amber-900 font-semibold mb-1">Case Study Complete!</p>
        <p className="text-amber-600 text-sm mb-4">{correctCount} / {caseStudy.questions.length} correct</p>
        <button onClick={onFinish} className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-2 rounded-xl transition-colors">
          Mark Complete
        </button>
      </div>
    );
  }

  const q = caseStudy.questions[qIdx];

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
    if (selected === q.correctIndex) setCorrectCount((p) => p + 1);
  };

  const next = () => {
    if (qIdx < caseStudy.questions.length - 1) {
      setQIdx((p) => p + 1);
      setSelected(null);
      setSubmitted(false);
    } else {
      setFinished(true);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 mb-4">
        <h4 className="font-bold text-amber-900 mb-1">{caseStudy.title}</h4>
        <p className="text-sm text-amber-800 leading-relaxed">{caseStudy.scenario}</p>
      </div>
      <div className="text-sm text-amber-600 mb-3">Question {qIdx + 1} of {caseStudy.questions.length}</div>
      <h4 className="font-bold text-amber-900 mb-3">{q.question}</h4>
      <div className="space-y-2 mb-4">
        {q.options.map((opt, i) => {
          const state = !submitted ? (selected === i ? "selected" : "neutral") : i === q.correctIndex ? "correct" : selected === i ? "wrong" : "dim";
          return (
            <button
              key={i}
              onClick={() => !submitted && setSelected(i)}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                state === "correct"
                  ? "bg-green-50 border-green-300 text-green-800"
                  : state === "wrong"
                  ? "bg-red-50 border-red-300 text-red-800"
                  : state === "selected"
                  ? "bg-amber-100 border-amber-400 text-amber-900 ring-1 ring-amber-300"
                  : state === "dim"
                  ? "bg-gray-50 border-gray-200 text-gray-400"
                  : "bg-white border-amber-200 text-amber-900 hover:bg-amber-50"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          Submit Answer
        </button>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 animate-in fade-in">
          <p className="text-sm text-amber-800 mb-3">
            <span className="font-semibold">Explanation:</span> {q.explanation}
          </p>
          <button onClick={next} className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors">
            {qIdx < caseStudy.questions.length - 1 ? "Next Question" : "See Results"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Activity: Guided Reading ─── */
function GuidedReadingActivity({ onFinish }: { onFinish: () => void }) {
  const [revealIndex, setRevealIndex] = useState<number | null>(null);

  return (
    <div className="max-w-2xl mx-auto">
      <h4 className="font-bold text-amber-900 mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-amber-600" />
        {guidedReading.title}
      </h4>
      <div className="space-y-4 mb-6">
        {guidedReading.sections.map((sec, i) => (
          <div key={i} className="bg-white border border-amber-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setRevealIndex((p) => (p === i ? null : i))}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-amber-50 transition-colors"
            >
              <span className="font-semibold text-amber-900 text-sm">{sec.heading}</span>
              <ChevronRight className={`w-4 h-4 text-amber-500 transition-transform ${revealIndex === i ? "rotate-90" : ""}`} />
            </button>
            {revealIndex === i && (
              <div className="px-4 pb-4 text-sm text-amber-800 leading-relaxed animate-in fade-in">
                {sec.text}
              </div>
            )}
          </div>
        ))}
      </div>
      <button onClick={onFinish} className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors">
        Mark Complete
      </button>
    </div>
  );
}
