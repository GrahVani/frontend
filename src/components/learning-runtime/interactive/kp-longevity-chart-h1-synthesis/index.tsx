"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Lock,
  MessageCircle,
  RotateCcw,
  ShieldCheck,
  Users,
} from "lucide-react";
import { grahas, ink, rashis, type GrahaSlug, type RashiSlug } from "@/design-tokens/grahvani-learning/colors";
import { fontFamilies } from "@/design-tokens/grahvani-learning/typography";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";

const NAKSHATRA_SPAN_ARCMIN = 800;
const VIMSHOTTARI_TOTAL = 120;

const GRAHA_ORDER: GrahaSlug[] = ["ketu", "shukra", "surya", "candra", "mangala", "rahu", "guru", "shani", "budha"];

const VIMSHOTTARI_YEARS: Record<GrahaSlug, number> = {
  ketu: 7,
  shukra: 20,
  surya: 6,
  candra: 10,
  mangala: 7,
  rahu: 18,
  guru: 16,
  shani: 19,
  budha: 17,
};

const HOUSE_LORDS: Record<number, GrahaSlug> = {
  0: "mangala",
  1: "shukra",
  2: "budha",
  3: "candra",
  4: "surya",
  5: "budha",
  6: "shukra",
  7: "mangala",
  8: "guru",
  9: "shani",
  10: "shani",
  11: "guru",
};

const RASHI_LIST: RashiSlug[] = [
  "mesha",
  "vrishabha",
  "mithuna",
  "karka",
  "simha",
  "kanya",
  "tula",
  "vrishchika",
  "dhanus",
  "makara",
  "kumbha",
  "mina",
];

const CHART_LAGNA: RashiSlug = "mithuna";
const SATURN_LONGITUDE_DEG = 18;
const BHARANI_START_DEG = 13 + 20 / 60;

const streams = {
  parashara: { label: "Parāśara", primary: ink.goldAccent },
  jaimini: { label: "Jaimini", primary: "#B88898" },
  kp: { label: "KP", primary: "#5A8AC8" },
};

type StreamSlug = keyof typeof streams;

function formatArcmin(arcmin: number): string {
  const deg = Math.floor(arcmin / 60);
  const min = Math.round(arcmin % 60);
  return `${deg}° ${min.toString().padStart(2, "0")}′`;
}

function subLordSpanArcmin(slug: GrahaSlug): number {
  return (VIMSHOTTARI_YEARS[slug] / VIMSHOTTARI_TOTAL) * NAKSHATRA_SPAN_ARCMIN;
}

function computeSubLord(starLord: GrahaSlug, offsetArcmin: number): { slug: GrahaSlug; start: number; end: number } {
  const startIndex = GRAHA_ORDER.indexOf(starLord);
  let cursor = 0;
  for (let i = 0; i < 9; i += 1) {
    const slug = GRAHA_ORDER[(startIndex + i) % 9];
    const span = subLordSpanArcmin(slug);
    const end = cursor + span;
    if (offsetArcmin < end || i === 8) {
      return { slug, start: cursor, end };
    }
    cursor = end;
  }
  return { slug: starLord, start: 0, end: NAKSHATRA_SPAN_ARCMIN };
}

function modalityLabel(modality: string): string {
  if (modality === "chara") return "Chara (movable)";
  if (modality === "sthira") return "Sthira (fixed)";
  return "Dvi-svabhāva (dual)";
}

function getBhadhakaOffset(modality: string): number {
  if (modality === "chara") return 10;
  if (modality === "sthira") return 8;
  return 6;
}

const SYNTHESIS_ROWS = [
  {
    layer: "Bālāriṣṭa",
    stream: "parashara" as StreamSlug,
    chapter: "2",
    finding: "No configuration matched",
    detail: "A clean negative finding from the Parāśarī infant-mortality checklist.",
    signal: "clean",
  },
  {
    layer: "Longevity computation",
    stream: "parashara" as StreamSlug,
    chapter: "3",
    finding: "Three disagreeing figures (70.9 / 68.3 / 56.7 yrs)",
    detail: "The three classical āyu methods do not converge on a single number.",
    signal: "disagreement",
  },
  {
    layer: "Maraka",
    stream: "parashara" as StreamSlug,
    chapter: "4",
    finding: "Unamplified (dignified, unassociated 2nd/7th lords)",
    detail: "The maraka houses are present structurally but not sharpened by affliction or association.",
    signal: "moderate",
  },
  {
    layer: "Rudra / Maheśvara",
    stream: "jaimini" as StreamSlug,
    chapter: "5",
    finding: "Rudra = Moon (clean); Maheśvara = Saturn (moderate confidence)",
    detail: "Jaimini adds an independent voice: Moon is clean, Saturn's Maheśvara role is held with caution.",
    signal: "mixed",
  },
  {
    layer: "Bhādhaka / sub-lord",
    stream: "kp" as StreamSlug,
    chapter: "5",
    finding: "Bhādhakeśa = Jupiter; Saturn's sub-lord = Mars (mixed signal)",
    detail: "KP's Bhādhaka lord matches the Parāśarī 7th-lord maraka, while Saturn's sub-lord is genuinely mixed.",
    signal: "mixed",
  },
];

const ETHICAL_SCENARIOS = [
  {
    id: "client-question",
    prompt:
      'Client: "I\'ve heard some astrologers use different systems — Vedic, Jaimini, KP. Would you get a more accurate answer about my health and lifespan if you checked all of them?"',
    options: [
      {
        text: "Yes — with three agreeing systems I can give you a much more specific timeline.",
        correct: false,
        feedback:
          "Too specific. Cross-stream agreement adds to the practitioner's internal confidence, but it does not license a precise client-facing prediction.",
      },
      {
        text: "Cross-checking matters to me, but it still produces only general, proactive guidance — not a precise lifespan number.",
        correct: true,
        feedback:
          "Correct. The disclosure register stays universal, undated, and proactive regardless of how many streams agree.",
      },
      {
        text: "No — the three methods contradict each other, so none of them is useful.",
        correct: false,
        feedback:
          "Not quite. The disagreement is real information too; the honest response is nuanced, not dismissive.",
      },
    ],
  },
  {
    id: "diagnosis-word",
    prompt:
      'Learner: "Moon and Jupiter keep showing up across Parāśarī and Jaimini. Rudra, the Bhādhaka lord, and a maraka lord all point to related planets. Isn\'t that basically a diagnosis?"',
    options: [
      {
        text: "Yes — recurring planets across independent systems is enough to call it a medical-style diagnosis.",
        correct: false,
        feedback:
          "Overclaim. Recurring structural significance is real, but 'diagnosis' imports a certainty and specificity that astrological techniques do not support.",
      },
      {
        text: "No — recurring significance is information, not a diagnosis; the module's own findings include disagreements and mixed signals.",
        correct: true,
        feedback:
          "Correct. The word diagnosis belongs to medicine. Astrological synthesis can note recurring planets while also reporting moderate-confidence and mixed findings honestly.",
      },
      {
        text: "Maybe — it depends on how strongly the practitioner feels about the convergence.",
        correct: false,
        feedback:
          "Feeling more confident does not change what the techniques can actually claim. The discipline is independent of subjective confidence.",
      },
    ],
  },
];

export function KpLongevityChartH1Synthesis() {
  const [tab, setTab] = useState<"bhadhaka" | "sublord" | "synthesis" | "ethics">("bhadhaka");

  function reset() {
    setTab("bhadhaka");
  }

  return (
    <div
      data-interactive="kp-longevity-chart-h1-synthesis"
      className="w-full min-w-0"
      style={{
        color: INK_PRIMARY,
        background: SURFACE,
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 16,
        padding: 20,
        boxSizing: "border-box",
        overflow: "hidden",
        fontFamily: fontFamilies.body,
      }}
    >
      <header className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <Eyebrow>Worked example: Chart H1 · KP longevity synthesis</Eyebrow>
          <h2
            className="mt-1 text-xl sm:text-2xl"
            style={{ color: streams.kp.primary, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
          >
            Apply KP doctrine to Chart H1, then close the three-stream synthesis
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            Compute the Bhādhaka house and a verified planetary sub-lord for Chart H1, then build the honest three-stream
            synthesis with ethical guardrails.
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

      <nav className="mb-5 flex flex-wrap gap-2" aria-label="Chart H1 synthesis sections">
        {[
          { key: "bhadhaka", label: "Bhādhaka" },
          { key: "sublord", label: "Saturn sub-lord" },
          { key: "synthesis", label: "Three-stream synthesis" },
          { key: "ethics", label: "Ethical framing" },
        ].map((item) => (
          <TabButton key={item.key} active={tab === (item.key as typeof tab)} onClick={() => setTab(item.key as typeof tab)}>
            {item.label}
          </TabButton>
        ))}
      </nav>

      {tab === "bhadhaka" && <BhadhakaPanel />}
      {tab === "sublord" && <SubLordPanel />}
      {tab === "synthesis" && <SynthesisPanel />}
      {tab === "ethics" && <EthicsPanel />}
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
        border: `1px solid ${active ? streams.kp.primary : HAIRLINE}`,
        background: active ? streams.kp.primary : "transparent",
        color: active ? "#fff" : INK_SECONDARY,
        fontWeight: 500,
      }}
    >
      {children}
    </button>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, letterSpacing: "0.08em", fontWeight: 600 }}>
      {children}
    </p>
  );
}

function Panel({ title, eyebrow, children, accent = streams.kp.primary }: { title?: string; eyebrow?: string; children: ReactNode; accent?: string }) {
  return (
    <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${accent}44` }}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      {title && (
        <h3 className="mt-1 text-lg" style={{ color: accent, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          {title}
        </h3>
      )}
      <div className="mt-3">{children}</div>
    </section>
  );
}

function BhadhakaPanel() {
  const lagnaIndex = RASHI_LIST.indexOf(CHART_LAGNA);
  const lagnaData = rashis[CHART_LAGNA];
  const offset = getBhadhakaOffset(lagnaData.modality);
  const bhadhakaSignIndex = (lagnaIndex + offset) % 12;
  const bhadhakaSign = RASHI_LIST[bhadhakaSignIndex];
  const bhadhakaLord = HOUSE_LORDS[bhadhakaSignIndex];
  const [showSteps, setShowSteps] = useState(false);

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
      <Panel eyebrow="§4.1" title="Bhādhaka house for Chart H1">
        <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Gemini is a dual sign. For a dvi-svabhāva lagna, the Bhādhaka house is the 7th. Because Gemini&apos;s 7th house is
          Sagittarius, the Bhādhakeśa is Jupiter.
        </p>

        <button
          type="button"
          onClick={() => setShowSteps((v) => !v)}
          className="mt-4 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
          style={{ background: `${streams.kp.primary}12`, border: `1px solid ${streams.kp.primary}`, color: streams.kp.primary, fontWeight: 500 }}
        >
          {showSteps ? "Hide steps" : "Show step-by-step"}
          <ChevronRight size={15} style={{ transform: showSteps ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }} aria-hidden="true" />
        </button>

        {showSteps && (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <StepCard number={1} label="Lagna sign" value={lagnaData.english} sub={modalityLabel(lagnaData.modality)} color={lagnaData.primary} />
            <StepCard number={2} label="Bhādhaka house" value={`${offset + 1}th house`} sub={rashis[bhadhakaSign].english} color={rashis[bhadhakaSign].primary} />
            <StepCard number={3} label="Bhādhakeśa" value={grahas[bhadhakaLord].iast} sub="Obstacle lord" color={grahas[bhadhakaLord].primary} />
          </div>
        )}

        <div
          className="mt-4 rounded-lg p-3"
          style={{ background: `${ink.goldAccent}10`, border: `1px solid ${ink.goldAccent}55` }}
        >
          <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            Notice: Jupiter is also Chart H1&apos;s Parāśarī 7th-lord maraka. This overlap is a direct structural consequence of
            Gemini being a dual sign — not a coincidence that needs extra explanation.
          </p>
        </div>
      </Panel>

      <Panel eyebrow="Visual" title="Gemini lagna and 7th-house Bhādhaka">
        <BhadhakaWheel lagnaIndex={lagnaIndex} bhadhakaOffset={offset} />
      </Panel>
    </div>
  );
}

function StepCard({ number, label, value, sub, color }: { number: number; label: string; value: string; sub: string; color: string }) {
  return (
    <div className="rounded-xl p-3" style={{ background: `${color}10`, border: `1px solid ${color}` }}>
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full text-xs" style={{ background: color, color: "#fff", fontWeight: 600 }}>
          {number}
        </span>
        <span className="text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>{label}</span>
      </div>
      <p className="m-0 mt-2 text-base" style={{ color, fontWeight: 600, fontFamily: fontFamilies.literarySerif }}>{value}</p>
      <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>{sub}</p>
    </div>
  );
}

function BhadhakaWheel({ lagnaIndex, bhadhakaOffset }: { lagnaIndex: number; bhadhakaOffset: number }) {
  const cx = 150;
  const cy = 150;
  const r = 95;
  const labelR = 70;

  return (
    <svg viewBox="0 0 300 300" role="img" aria-label="Chart H1 zodiac wheel showing Gemini lagna and Sagittarius Bhadhaka" className="mx-auto h-auto w-full max-w-xs">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={HAIRLINE} strokeWidth="1.5" />
      {RASHI_LIST.map((slug, i) => {
        const angle = (i - lagnaIndex) * 30 * (Math.PI / 180) - Math.PI / 2;
        const x1 = cx + r * Math.cos(angle);
        const y1 = cy + r * Math.sin(angle);
        const x2 = cx + (r - 18) * Math.cos(angle);
        const y2 = cy + (r - 18) * Math.sin(angle);
        return <line key={slug} x1={x1} y1={y1} x2={x2} y2={y2} stroke={HAIRLINE} strokeWidth="1" />;
      })}
      {RASHI_LIST.map((slug, i) => {
        const angle = (i - lagnaIndex) * 30 * (Math.PI / 180) - Math.PI / 2;
        const x = cx + labelR * Math.cos(angle);
        const y = cy + labelR * Math.sin(angle);
        const isLagna = i === lagnaIndex;
        const isBhadhaka = i === (lagnaIndex + bhadhakaOffset) % 12;
        const color = rashis[slug].primary;
        return (
          <g key={`label-${slug}`}>
            {(isLagna || isBhadhaka) && <circle cx={x} cy={y} r={16} fill={`${color}22`} stroke={color} strokeWidth="2" />}
            <text x={x} y={y + 4} textAnchor="middle" fill={isLagna || isBhadhaka ? color : INK_MUTED} fontSize="9" fontWeight={isLagna || isBhadhaka ? 600 : 500}>
              {rashis[slug].iast}
            </text>
          </g>
        );
      })}
      <text x={cx} y={cy + 4} textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="500">
        Chart H1
      </text>
      <g>
        <circle cx={cx} cy={cy - r + 28} r={12} fill={`${rashis[RASHI_LIST[lagnaIndex]].primary}22`} stroke={rashis[RASHI_LIST[lagnaIndex]].primary} strokeWidth="2" />
        <text x={cx} y={cy - r + 32} textAnchor="middle" fill={rashis[RASHI_LIST[lagnaIndex]].primary} fontSize="9" fontWeight="600">L</text>
      </g>
      <g>
        {(() => {
          const bIndex = (lagnaIndex + bhadhakaOffset) % 12;
          const angle = bhadhakaOffset * 30 * (Math.PI / 180) - Math.PI / 2;
          const x = cx + (r - 28) * Math.cos(angle);
          const y = cy + (r - 28) * Math.sin(angle);
          return (
            <>
              <circle cx={x} cy={y} r={12} fill={`${rashis[RASHI_LIST[bIndex]].primary}22`} stroke={rashis[RASHI_LIST[bIndex]].primary} strokeWidth="2" />
              <text x={x} y={y + 4} textAnchor="middle" fill={rashis[RASHI_LIST[bIndex]].primary} fontSize="9" fontWeight="600">B</text>
            </>
          );
        })()}
      </g>
    </svg>
  );
}

function SubLordPanel() {
  const [step, setStep] = useState(0);
  const starLord: GrahaSlug = "shukra";
  const offsetDeg = SATURN_LONGITUDE_DEG - BHARANI_START_DEG;
  const offsetArcmin = offsetDeg * 60;
  const sub = useMemo(() => computeSubLord(starLord, offsetArcmin), [starLord, offsetArcmin]);

  const steps = [
    { label: "Saturn's longitude", value: `Aries ${SATURN_LONGITUDE_DEG}°00′`, note: "Absolute longitude 18.000°" },
    { label: "Nakshatra", value: "Bharaṇī", note: `Ruled by ${grahas[starLord].iast}; spans 13°20′–26°40′ Aries` },
    { label: "Elapsed within nakshatra", value: formatArcmin(offsetArcmin), note: "18.000° − 13.333°" },
    { label: "Sub-lord", value: grahas[sub.slug].iast, note: `Falls in the ${grahas[sub.slug].iast} sub-range (${formatArcmin(sub.start)}–${formatArcmin(sub.end)})` },
  ];

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <Panel eyebrow="§4.2" title="Verified planetary sub-lord for Saturn">
        <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Saturn is Chart H1&apos;s 8th-house lord. Click through the steps to verify how its KP sub-lord is computed from
          longitude alone — no interpretive judgment enters until the result is read.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {steps.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-pressed={step >= i}
              onClick={() => setStep(i)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-sm"
              style={{
                background: step >= i ? streams.kp.primary : "transparent",
                border: `1px solid ${step >= i ? streams.kp.primary : HAIRLINE}`,
                color: step >= i ? "#fff" : INK_SECONDARY,
                fontWeight: 600,
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-3">
          {steps.map((s, i) => {
            const revealed = step >= i;
            return (
              <div
                key={i}
                className="rounded-xl p-3"
                style={{
                  background: revealed ? `${streams.kp.primary}10` : `${INK_MUTED}08`,
                  border: `1px solid ${revealed ? streams.kp.primary : HAIRLINE}`,
                  opacity: revealed ? 1 : 0.65,
                }}
              >
                <p className="m-0 text-xs uppercase" style={{ color: revealed ? streams.kp.primary : INK_MUTED, fontWeight: 600 }}>
                  Step {i + 1}
                </p>
                <p className="m-0 mt-1 text-base" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
                  {revealed ? s.value : s.label}
                </p>
                {revealed && <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>{s.note}</p>}
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => setStep((v) => Math.max(0, v - 1))}
            className="rounded-lg px-3 py-2 text-sm"
            style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY, fontWeight: 500 }}
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setStep((v) => Math.min(steps.length - 1, v + 1))}
            className="rounded-lg px-3 py-2 text-sm"
            style={{ background: streams.kp.primary, border: `1px solid ${streams.kp.primary}`, color: "#fff", fontWeight: 500 }}
          >
            Next
          </button>
        </div>
      </Panel>

      <Panel eyebrow="Sub-division table" title="Bharaṇī sub-lords">
        <SubLordTable offsetArcmin={offsetArcmin} />
        <div
          className="mt-4 rounded-lg p-3"
          style={{ background: `${grahas[sub.slug].secondaryTint}55`, border: `1px solid ${grahas[sub.slug].primary}` }}
        >
          <p className="m-0 text-sm" style={{ color: INK_PRIMARY, fontWeight: 500 }}>
            Saturn&apos;s sub-lord is {grahas[sub.slug].iast}
          </p>
          <p className="m-0 mt-1 text-xs" style={{ color: INK_SECONDARY, lineHeight: 1.5 }}>
            Mars is Chart H1&apos;s Ātmakāraka in an enemy sign — a genuinely mixed signal, not a clean yes or no.
          </p>
        </div>
      </Panel>
    </div>
  );
}

function SubLordTable({ offsetArcmin }: { offsetArcmin: number }) {
  const starLord: GrahaSlug = "shukra";
  const startIndex = GRAHA_ORDER.indexOf(starLord);
  let cursor = 0;
  const rows = [];
  for (let i = 0; i < 9; i += 1) {
    const slug = GRAHA_ORDER[(startIndex + i) % 9];
    const span = subLordSpanArcmin(slug);
    const start = cursor;
    const end = cursor + span;
    const active = offsetArcmin >= start && offsetArcmin < end;
    rows.push({ slug, start, end, active, years: VIMSHOTTARI_YEARS[slug] });
    cursor = end;
  }

  return (
    <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
      <table className="w-full min-w-0 border-collapse text-sm">
        <thead style={{ background: "var(--gl-surface-2, #F5EDD8)" }}>
          <tr>
            {["Sub-lord", "Years", "Range"].map((h) => (
              <th key={h} className="px-3 py-2 text-left text-xs uppercase" style={{ color: INK_SECONDARY, fontWeight: 600, letterSpacing: "0.05em" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.slug} style={{ background: row.active ? `${grahas[row.slug].primary}10` : SURFACE, borderTop: `1px solid ${HAIRLINE}` }}>
              <td className="px-3 py-2" style={{ color: row.active ? grahas[row.slug].primary : INK_PRIMARY, fontWeight: 500 }}>
                {grahas[row.slug].iast} {row.active && "← 280′"}
              </td>
              <td className="px-3 py-2" style={{ color: INK_SECONDARY }}>{row.years}</td>
              <td className="px-3 py-2" style={{ color: INK_SECONDARY }}>
                {formatArcmin(row.start)} – {formatArcmin(row.end)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SynthesisPanel() {
  const [filter, setFilter] = useState<"all" | StreamSlug>("all");
  const [selectedRow, setSelectedRow] = useState<number | null>(4);

  const filteredRows = useMemo(() => {
    return filter === "all" ? SYNTHESIS_ROWS : SYNTHESIS_ROWS.filter((r) => r.stream === filter);
  }, [filter]);

  const recurringPlanets = ["Moon", "Jupiter"];
  const mixedSignals = ["Saturn's sub-lord = Mars", "moderate confidence"];

  return (
    <div className="grid min-w-0 gap-4">
      <Panel eyebrow="§4.3" title="Complete four-layer, three-stream synthesis table">
        <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          The table extends Lesson 7.4.4&apos;s synthesis with this chapter&apos;s Jaimini and KP findings. Click any row to read
          the detail. Use the stream filter to see which system contributes what.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")} color={INK_MUTED}>All streams</FilterChip>
          {(Object.keys(streams) as StreamSlug[]).map((key) => (
            <FilterChip key={key} active={filter === key} onClick={() => setFilter(key)} color={streams[key].primary}>
              {streams[key].label}
            </FilterChip>
          ))}
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
          <table className="w-full min-w-0 border-collapse text-sm">
            <thead style={{ background: "var(--gl-surface-2, #F5EDD8)" }}>
              <tr>
                {["Layer", "Stream", "Chapter", "Finding for Chart H1"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs uppercase" style={{ color: INK_SECONDARY, fontWeight: 600, letterSpacing: "0.05em" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => {
                const originalIndex = SYNTHESIS_ROWS.indexOf(row);
                const active = selectedRow === originalIndex;
                return (
                  <tr
                    key={row.layer}
                    onClick={() => setSelectedRow(originalIndex)}
                    className="cursor-pointer align-top"
                    style={{ background: active ? `${streams[row.stream].primary}10` : SURFACE, borderTop: `1px solid ${HAIRLINE}` }}
                  >
                    <td className="px-4 py-3" style={{ color: INK_PRIMARY, fontWeight: 500 }}>{row.layer}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full px-2 py-1 text-xs" style={{ background: `${streams[row.stream].primary}22`, color: streams[row.stream].primary, fontWeight: 500 }}>
                        {streams[row.stream].label}
                      </span>
                    </td>
                    <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{row.chapter}</td>
                    <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{row.finding}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        <Panel eyebrow="Selected finding" title={selectedRow !== null ? SYNTHESIS_ROWS[selectedRow].layer : "Select a row"}>
          {selectedRow !== null ? (
            <>
              <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
                {SYNTHESIS_ROWS[selectedRow].detail}
              </p>
              <div
                className="mt-3 rounded-lg p-3"
                style={{
                  background: `${streams[SYNTHESIS_ROWS[selectedRow].stream].primary}10`,
                  border: `1px solid ${streams[SYNTHESIS_ROWS[selectedRow].stream].primary}55`,
                }}
              >
                <p className="m-0 text-xs uppercase" style={{ color: streams[SYNTHESIS_ROWS[selectedRow].stream].primary, fontWeight: 600 }}>
                  Signal type
                </p>
                <p className="m-0 mt-1 text-sm" style={{ color: INK_PRIMARY, fontWeight: 500 }}>
                  {SYNTHESIS_ROWS[selectedRow].signal}
                </p>
              </div>
            </>
          ) : (
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>Click a table row to see its interpretation.</p>
          )}
        </Panel>

        <Panel eyebrow="Reading the synthesis" title="Convergence and mixed signals">
          <div className="space-y-3">
            <div className="rounded-lg p-3" style={{ background: `${ink.goldAccent}10`, border: `1px solid ${ink.goldAccent}55` }}>
              <p className="m-0 text-xs uppercase" style={{ color: ink.goldAccent, fontWeight: 600 }}>Recurring across streams</p>
              <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
                {recurringPlanets.join(" and ")} appear as structurally significant across Parāśarī and Jaimini. That is
                real information — but not a diagnosis.
              </p>
            </div>
            <div className="rounded-lg p-3" style={{ background: `${ink.vermilionAccent}10`, border: `1px solid ${ink.vermilionAccent}55` }}>
              <p className="m-0 text-xs uppercase" style={{ color: ink.vermilionAccent, fontWeight: 600 }}>Mixed signals to keep</p>
              <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
                {mixedSignals.join("; ")}. An honest synthesis reports what does not resolve cleanly alongside what does.
              </p>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function FilterChip({ active, onClick, children, color }: { active: boolean; onClick: () => void; children: ReactNode; color: string }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className="rounded-full px-3 py-1.5 text-xs"
      style={{
        background: active ? color : "transparent",
        border: `1px solid ${color}`,
        color: active ? "#fff" : color,
        fontWeight: 500,
      }}
    >
      {children}
    </button>
  );
}

function EthicsPanel() {
  const [answers, setAnswers] = useState<Record<string, number | null>>({ "client-question": null, "diagnosis-word": null });

  function choose(scenarioId: string, optionIndex: number) {
    setAnswers((prev) => ({ ...prev, [scenarioId]: optionIndex }));
  }

  return (
    <div className="grid min-w-0 gap-4">
      <Panel eyebrow="§4.4 & §6" title="Ethical framing trainer">
        <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Adding a third stream does not loosen disclosure discipline. Choose the response that honours the module&apos;s
          ethical register.
        </p>
      </Panel>

      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        {ETHICAL_SCENARIOS.map((scenario) => {
          const chosen = answers[scenario.id];
          return (
            <Panel key={scenario.id} accent={chosen !== null ? (scenario.options[chosen]?.correct ? "#2F7D55" : ink.vermilionAccent) : streams.kp.primary}>
              <div className="flex items-start gap-3">
                <MessageCircle size={18} style={{ color: streams.kp.primary, flexShrink: 0 }} aria-hidden="true" />
                <p className="m-0 text-sm" style={{ color: INK_PRIMARY, lineHeight: 1.55 }}>{scenario.prompt}</p>
              </div>

              <div className="mt-4 space-y-2">
                {scenario.options.map((option, i) => {
                  const selected = chosen === i;
                  const showResult = chosen !== null;
                  const stateColor = option.correct ? "#2F7D55" : ink.vermilionAccent;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => choose(scenario.id, i)}
                      className="w-full rounded-lg p-3 text-left"
                      style={{
                        background: selected ? `${stateColor}10` : `${INK_MUTED}08`,
                        border: `1px solid ${selected ? stateColor : HAIRLINE}`,
                        opacity: showResult && !selected ? 0.55 : 1,
                      }}
                    >
                      <div className="flex items-start gap-2">
                        {showResult ? (
                          option.correct ? <CheckCircle2 size={16} style={{ color: "#2F7D55", flexShrink: 0 }} /> : <AlertTriangle size={16} style={{ color: ink.vermilionAccent, flexShrink: 0 }} />
                        ) : (
                          <span className="flex h-4 w-4 shrink-0 rounded-full border" style={{ borderColor: HAIRLINE }} />
                        )}
                        <span className="text-sm" style={{ color: INK_PRIMARY, fontWeight: 500 }}>{option.text}</span>
                      </div>
                      {selected && (
                        <p className="m-0 mt-2 text-xs" style={{ color: INK_SECONDARY, lineHeight: 1.5 }}>{option.feedback}</p>
                      )}
                    </button>
                  );
                })}
              </div>
            </Panel>
          );
        })}
      </div>

      <div className="grid min-w-0 gap-4 md:grid-cols-3">
        <EthicCard icon={ShieldCheck} title="Universal register" text="Guidance applies to anyone, not a dated or specific prediction." color="#2F7D55" />
        <EthicCard icon={Lock} title="Undated" text="No specific timeline is disclosed to the client." color={ink.goldAccent} />
        <EthicCard icon={Users} title="Proactive" text="Encourages check-ups and taking symptoms seriously." color={streams.kp.primary} />
      </div>
    </div>
  );
}

function EthicCard({ icon: Icon, title, text, color }: { icon: typeof ShieldCheck; title: string; text: string; color: string }) {
  return (
    <div className="rounded-xl p-4" style={{ background: `${color}10`, border: `1px solid ${color}55` }}>
      <Icon size={18} style={{ color }} aria-hidden="true" />
      <p className="m-0 mt-2 text-sm" style={{ color, fontWeight: 600 }}>{title}</p>
      <p className="m-0 mt-1 text-xs" style={{ color: INK_SECONDARY, lineHeight: 1.5 }}>{text}</p>
    </div>
  );
}
