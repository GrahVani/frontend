"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  BookOpen,
  Calculator,
  Compass,
  MapPinned,
  Palette,
  RotateCcw,
  Scale,
  Sparkles,
  Swords,
  Target,
} from "lucide-react";
import { grahas, ink } from "@/design-tokens/grahvani-learning/colors";
import { fontFamilies } from "@/design-tokens/grahvani-learning/typography";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #1A1408)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #5A4E2E)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #8A7E5E)";
const GOLD = ink.goldAccent;
const GREEN = grahas.budha.primary;
const SAFFRON = grahas.guru.primary;
const BLUE = grahas.shukra.primary;
const CORAL = grahas.mangala.primary;

type TabKey = "profile" | "question" | "compare";

type Strength = "strong" | "neutral" | "afflicted";

const TABS: { key: TabKey; label: string }[] = [
  { key: "profile", label: "Chart E1 profile" },
  { key: "question", label: "Question tester" },
  { key: "compare", label: "Compare conditions" },
];

const THREADS: Record<string, { label: string; color: string; icon: ReactNode; flavour: string; keywords: string[]; strongText: string; weakText: string }> = {
  mercury: {
    label: "Mercury — analytical / verbal",
    color: GREEN,
    icon: <Calculator size={16} />,
    flavour: "analytical, verbal, and symbol-manipulation fields",
    keywords: ["engineering", "medicine", "law", "mathematics", "science", "coding", "programming", "data", "writing", "commerce", "accounting", "research", "technology", "analysis"],
    strongText: "strong analytical and verbal capacity",
    weakText: "analytical work may need more deliberate effort",
  },
  jupiter: {
    label: "Jupiter — meaning / dharmic / pedagogical",
    color: SAFFRON,
    icon: <BookOpen size={16} />,
    flavour: "meaning-oriented, dharmic, or pedagogical fields",
    keywords: ["philosophy", "teaching", "law", "religion", "humanities", "counselling", "ethics", "mentoring", "guidance", "education", "spirituality", "social work"],
    strongText: "a real pull toward meaning, principle, and teaching",
    weakText: "meaning-oriented work may be less naturally central",
  },
  venus: {
    label: "Venus — aesthetic / creative",
    color: BLUE,
    icon: <Palette size={16} />,
    flavour: "aesthetic and creative fields",
    keywords: ["arts", "music", "design", "fashion", "architecture", "literature", "performance", "fine arts", "film", "media", "creative", "writing", "visual"],
    strongText: "a genuine aesthetic and creative thread",
    weakText: "creative expression may require more cultivation",
  },
  mars: {
    label: "Mars — competitive / decisive edge",
    color: CORAL,
    icon: <Swords size={16} />,
    flavour: "assertive, competitive, or results-oriented fields",
    keywords: ["surgery", "sports", "military", "entrepreneurship", "litigation", "competitive exams", "technology", "leadership", "management", "engineering", "finance", "trading"],
    strongText: "a sharp, competitive, decisive edge",
    weakText: "competitive drive may be less pronounced",
  },
};

const CHART_E1_STRENGTHS: Record<string, Strength> = {
  mercury: "strong",
  jupiter: "strong",
  venus: "strong",
  mars: "strong",
};

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : color;
}

function strengthScore(strength: Strength) {
  if (strength === "strong") return 100;
  if (strength === "neutral") return 55;
  return 25;
}

export function AptitudeTendencyMapper() {
  const [tab, setTab] = useState<TabKey>("profile");

  function reset() {
    setTab("profile");
  }

  return (
    <div
      data-interactive="aptitude-tendency-mapper"
      className="w-full min-w-0"
      style={{
        background: SURFACE,
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 16,
        padding: 20,
        color: INK_PRIMARY,
        boxSizing: "border-box",
        overflow: "hidden",
        fontFamily: fontFamilies.body,
      }}
    >
      <header className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="m-0 text-xs uppercase" style={{ color: GOLD, letterSpacing: "0.08em", fontWeight: 600 }}>
            Field-of-study aptitude
          </p>
          <h2
            className="mt-1 text-xl sm:text-2xl"
            style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
          >
            Tendency mapper
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            Map this chapter&apos;s kāraka and yoga findings to aptitude flavours. Frame every reading as a tendency to
            explore, never a deterministic verdict.
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 self-start rounded-lg px-3 py-2 text-sm"
          style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY, fontWeight: 500 }}
        >
          <RotateCcw size={15} aria-hidden="true" />
          Restart
        </button>
      </header>

      <nav className="mb-5 flex flex-wrap gap-2" aria-label="Aptitude tendency mapper sections">
        {TABS.map((t) => (
          <TabButton key={t.key} active={tab === t.key} onClick={() => setTab(t.key)}>
            {t.label}
          </TabButton>
        ))}
      </nav>

      {tab === "profile" && <ProfileTab />}
      {tab === "question" && <QuestionTab />}
      {tab === "compare" && <CompareTab />}
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className="rounded-lg px-3 py-2 text-sm"
      style={{
        border: `1px solid ${active ? GOLD : HAIRLINE}`,
        background: active ? GOLD : "transparent",
        color: active ? "#1A1408" : INK_SECONDARY,
        fontWeight: 500,
      }}
    >
      {children}
    </button>
  );
}

function ProfileTab() {
  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.3</p>
        <h3
          className="mt-1 text-lg"
          style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
        >
          Chart E1 aptitude-tendency profile
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Each thread is a flavour of capacity, not a job title. The strongest threads combine into a range of plausible
          directions rather than one named profession.
        </p>

        <div className="mt-4 space-y-3">
          {Object.entries(THREADS).map(([key, t]) => (
            <div key={key} className="rounded-lg p-3" style={{ background: wash(t.color, "10"), border: `1px solid ${wash(t.color, "55")}` }}>
              <div className="flex items-center gap-2" style={{ color: t.color }}>
                {t.icon}
                <span className="text-sm" style={{ fontWeight: 600 }}>{t.label}</span>
              </div>
              <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
                {key === "mercury" && "Exalted at its precise degree, angular, uncombust — gives strong analytical/verbal and symbol-manipulation tendencies."}
                {key === "jupiter" && "Own-signed, unafflicted, aspecting the Lagna — gives a real meaning/dharmic/pedagogical pull."}
                {key === "venus" && "Own-signed in the 2nd, co-forming the Sarasvatī yoga — adds an aesthetic/creative thread."}
                {key === "mars" && "Exalted in the 5th — adds a sharp, competitive, decisive edge to the aptitude mix."}
              </p>
            </div>
          ))}
        </div>
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <Compass size={18} style={{ color: GOLD }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>Full synthesis</p>
        </div>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          Multi-threaded aptitude: strong analytical capacity, a meaning-oriented pull, an aesthetic thread, and a
          competitive edge. This suits a considerable range of fields rather than one narrow profession.
        </p>
        <ProfileSvg />
      </aside>
    </div>
  );
}

function QuestionTab() {
  const [question, setQuestion] = useState("Should my child pursue engineering?");

  const analysis = useMemo(() => {
    const lower = question.toLowerCase();
    const matched = Object.entries(THREADS).filter(([, t]) => t.keywords.some((k) => lower.includes(k))).map(([key]) => key);
    const unique = Array.from(new Set(matched));
    return { matched: unique };
  }, [question]);

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§6</p>
        <h3
          className="mt-1 text-lg"
          style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
        >
          Test a specific-field question
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Enter a parent&apos;s question naming a field. The mapper answers with underlying tendencies, not a yes/no
          verdict.
        </p>

        <label className="mt-4 block text-sm" style={{ color: INK_SECONDARY }}>
          Parent question
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="mt-1 w-full rounded-lg px-3 py-2 text-sm"
            style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
          />
        </label>

        <div className="mt-4 rounded-lg p-3" style={{ background: wash(GOLD, "10"), border: `1px solid ${wash(GOLD, "55")}` }}>
          <div className="flex items-center gap-2">
            <Target size={18} style={{ color: GOLD }} aria-hidden="true" />
            <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>Tendency response</p>
          </div>
          <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            {analysis.matched.length === 0
              ? "No direct keyword match in this lesson's mapped threads. The question may belong to a domain this chart reading does not specifically address; route to a qualified career counsellor for a fuller assessment."
              : buildResponse(analysis.matched)}
          </p>
        </div>

        <div className="mt-3 rounded-lg p-3" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
          <div className="flex items-center gap-2">
            <MapPinned size={18} style={{ color: GREEN }} aria-hidden="true" />
            <p className="m-0 text-sm" style={{ color: GREEN, fontWeight: 600 }}>Routing note</p>
          </div>
          <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            For specific programme, college, or career-pathway decisions, route to a qualified career counsellor or
            educational advisor. The chart supports capacities; it does not replace professional counselling.
          </p>
        </div>
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <Scale size={18} style={{ color: GOLD }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>Matched threads</p>
        </div>
        {analysis.matched.length === 0 ? (
          <p className="m-0 mt-2 text-sm" style={{ color: INK_MUTED }}>No threads matched the current question.</p>
        ) : (
          <ul className="m-0 mt-2 list-disc space-y-1 pl-5 text-sm" style={{ color: INK_SECONDARY }}>
            {analysis.matched.map((key) => (
              <li key={key} style={{ color: THREADS[key].color }}>
                {THREADS[key].label}
              </li>
            ))}
          </ul>
        )}
        <QuestionSvg />
      </aside>
    </div>
  );
}

function buildResponse(matched: string[]) {
  const names = matched.map((k) => THREADS[k].label.split(" — ")[0]);
  const qualities = matched.map((k) => THREADS[k].strongText);
  return `This field draws on ${names.join(" and ")}: ${qualities.join(", ")}. It is a plausible fit among several, but the chart does not single it out as the only right path. The child's own interest and a career counsellor's fuller assessment should also weigh in.`;
}

function CompareTab() {
  const [strengths, setStrengths] = useState<Record<string, Strength>>(CHART_E1_STRENGTHS);

  function setStrength(key: string, value: Strength) {
    setStrengths((prev) => ({ ...prev, [key]: value }));
  }

  const synthesis = useMemo(() => {
    const strong = Object.entries(strengths).filter(([, v]) => v === "strong").map(([k]) => k);
    const afflicted = Object.entries(strengths).filter(([, v]) => v === "afflicted").map(([k]) => k);
    const neutral = Object.entries(strengths).filter(([, v]) => v === "neutral").map(([k]) => k);

    if (strong.length === 0 && afflicted.length === 0) {
      return "All threads read as neutral. The chart offers no strong aptitude signal in either direction; a career counsellor's assessment becomes especially important.";
    }

    const parts: string[] = [];
    if (strong.length > 0) {
      parts.push(`Strong tendencies: ${strong.map((k) => THREADS[k].strongText).join("; ")}.`);
    }
    if (neutral.length > 0) {
      parts.push(`Neutral tendencies: ${neutral.map((k) => THREADS[k].flavour).join("; ")}.`);
    }
    if (afflicted.length > 0) {
      parts.push(`Threads needing more support: ${afflicted.map((k) => THREADS[k].weakText).join("; ")}.`);
    }
    return `${parts.join(" ")} A tendency reading shifts in degree, never into a hard yes or no.`;
  }, [strengths]);

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.2</p>
        <h3
          className="mt-1 text-lg"
          style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
        >
          Shift the conditions, watch the tendency language shift
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          A strong thread points toward ease and natural fit; an afflicted thread points toward effort and support needs;
          neutral is simply unremarkable. None is a permanent closed door.
        </p>

        <div className="mt-4 space-y-3">
          {Object.entries(THREADS).map(([key, t]) => (
            <div key={key} className="rounded-lg p-3" style={{ background: wash(t.color, "10"), border: `1px solid ${wash(t.color, "55")}` }}>
              <div className="flex items-center gap-2" style={{ color: t.color }}>
                {t.icon}
                <span className="text-sm" style={{ fontWeight: 600 }}>{t.label}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {(["strong", "neutral", "afflicted"] as Strength[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={strengths[key] === s}
                    onClick={() => setStrength(key, s)}
                    className="rounded-lg px-3 py-1.5 text-sm"
                    style={{
                      background: strengths[key] === s ? t.color : SURFACE,
                      border: `1px solid ${strengths[key] === s ? t.color : HAIRLINE}`,
                      color: strengths[key] === s ? "#fff" : INK_SECONDARY,
                      fontWeight: 500,
                    }}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <Sparkles size={18} style={{ color: GOLD }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>Live synthesis</p>
        </div>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.65 }}>
          {synthesis}
        </p>
        <CompareSvg strengths={strengths} />
      </aside>
    </div>
  );
}

function ProfileSvg() {
  return (
    <svg viewBox="0 0 320 180" role="img" aria-label="Four aptitude threads radiating from a central tendency" style={{ width: "100%", maxHeight: 200, margin: "1rem auto 0", display: "block" }}>
      <rect x="20" y="20" width="280" height="140" rx="8" fill={`${GOLD}0F`} stroke={HAIRLINE} />
      <circle cx="160" cy="90" r="22" fill={`${GOLD}22`} stroke={GOLD} strokeWidth="2" />
      <text x="160" y="95" textAnchor="middle" fill={GOLD} fontSize="10" fontWeight={600}>tendency</text>

      <circle cx="80" cy="60" r="18" fill={`${GREEN}18`} stroke={GREEN} strokeWidth="2" />
      <text x="80" y="65" textAnchor="middle" fill={GREEN} fontSize="9" fontWeight={600}>Mercury</text>

      <circle cx="240" cy="60" r="18" fill={`${SAFFRON}18`} stroke={SAFFRON} strokeWidth="2" />
      <text x="240" y="65" textAnchor="middle" fill={SAFFRON} fontSize="9" fontWeight={600}>Jupiter</text>

      <circle cx="80" cy="120" r="18" fill={`${BLUE}18`} stroke={BLUE} strokeWidth="2" />
      <text x="80" y="125" textAnchor="middle" fill={BLUE} fontSize="9" fontWeight={600}>Venus</text>

      <circle cx="240" cy="120" r="18" fill={`${CORAL}18`} stroke={CORAL} strokeWidth="2" />
      <text x="240" y="125" textAnchor="middle" fill={CORAL} fontSize="9" fontWeight={600}>Mars</text>

      <path d="M 98 68 L 142 82" stroke={HAIRLINE} strokeWidth="1.5" />
      <path d="M 222 68 L 178 82" stroke={HAIRLINE} strokeWidth="1.5" />
      <path d="M 98 112 L 142 98" stroke={HAIRLINE} strokeWidth="1.5" />
      <path d="M 222 112 L 178 98" stroke={HAIRLINE} strokeWidth="1.5" />

      <text x="160" y="152" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight={600}>Capacities combine, not a single verdict</text>
    </svg>
  );
}

function QuestionSvg() {
  return (
    <svg viewBox="0 0 320 150" role="img" aria-label="A specific question is routed through tendency language, not a yes-no verdict" style={{ width: "100%", maxHeight: 160, margin: "1rem auto 0", display: "block" }}>
      <rect x="20" y="20" width="280" height="110" rx="8" fill={`${GOLD}0F`} stroke={HAIRLINE} />

      <rect x="40" y="45" width="100" height="30" rx="6" fill={SURFACE} stroke={HAIRLINE} strokeWidth="1.5" />
      <text x="90" y="65" textAnchor="middle" fill={INK_PRIMARY} fontSize="10" fontWeight={600}>“Engineering?”</text>

      <path d="M 140 60 L 170 60" stroke={GOLD} strokeWidth="2" />
      <polygon points="170,60 164,56 164,64" fill={GOLD} />

      <rect x="180" y="45" width="100" height="60" rx="6" fill={SURFACE} stroke={GOLD} strokeWidth="1.5" />
      <text x="230" y="64" textAnchor="middle" fill={INK_PRIMARY} fontSize="9" fontWeight={600}>Tendency fit</text>
      <text x="230" y="80" textAnchor="middle" fill={INK_MUTED} fontSize="8" fontWeight={600}>not yes/no</text>

      <text x="160" y="122" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight={600}>Specific question → capacity-based response</text>
    </svg>
  );
}

function CompareSvg({ strengths }: { strengths: Record<string, Strength> }) {
  const centerX = 160;
  const centerY = 90;
  const maxRadius = 60;
  const angles: Record<string, number> = { mercury: -90, jupiter: 0, mars: 90, venus: 180 };

  function point(key: string) {
    const rad = ((angles[key] * Math.PI) / 180);
    const r = (strengthScore(strengths[key]) / 100) * maxRadius;
    return { x: centerX + r * Math.cos(rad), y: centerY + r * Math.sin(rad) };
  }

  const points = ["mercury", "jupiter", "mars", "venus"].map((k) => point(k));
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  return (
    <svg viewBox="0 0 320 180" role="img" aria-label="Radar chart showing relative strength of the four aptitude threads" style={{ width: "100%", maxHeight: 200, margin: "1rem auto 0", display: "block" }}>
      <rect x="20" y="20" width="280" height="140" rx="8" fill={`${GOLD}0F`} stroke={HAIRLINE} />

      <circle cx={centerX} cy={centerY} r={maxRadius} fill="none" stroke={HAIRLINE} strokeWidth="1.5" />
      <circle cx={centerX} cy={centerY} r={maxRadius * 0.55} fill="none" stroke={HAIRLINE} strokeWidth="1" strokeDasharray="4 3" />

      <path d={pathD} fill={`${GREEN}18`} stroke={GREEN} strokeWidth="2" opacity={0.7} />

      {Object.entries(angles).map(([key, angle]) => {
        const rad = ((angle * Math.PI) / 180);
        const x = centerX + maxRadius * Math.cos(rad);
        const y = centerY + maxRadius * Math.sin(rad);
        const labelOffset = 14;
        const lx = centerX + (maxRadius + labelOffset) * Math.cos(rad);
        const ly = centerY + (maxRadius + labelOffset) * Math.sin(rad);
        return (
          <g key={key}>
            <line x1={centerX} y1={centerY} x2={x} y2={y} stroke={HAIRLINE} strokeWidth="1" />
            <text x={lx} y={ly + 4} textAnchor="middle" fill={THREADS[key].color} fontSize="9" fontWeight={600}>
              {key.charAt(0).toUpperCase() + key.slice(1, 3)}
            </text>
          </g>
        );
      })}

      <text x={centerX} y={165} textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight={600}>Tendency strength, not a verdict</text>
    </svg>
  );
}
