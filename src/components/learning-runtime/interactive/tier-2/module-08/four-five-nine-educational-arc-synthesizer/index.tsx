"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import {
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Home,
  Lightbulb,
  Link2,
  RotateCcw,
  Sparkles,
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
const VERMILION = ink.vermilionAccent;

type TabKey = "arc" | "convergence" | "single-vs-synthesis" | "narrative";

const TABS: { key: TabKey; label: string }[] = [
  { key: "arc", label: "The arc" },
  { key: "convergence", label: "Convergence detector" },
  { key: "single-vs-synthesis", label: "Single vs synthesis" },
  { key: "narrative", label: "Build the narrative" },
];

const HOUSES = [
  {
    house: 4,
    title: "Foundation",
    sanskrit: "चतुर्थ",
    sign: "Sagittarius",
    lord: "Jupiter",
    occupant: "Saturn",
    karaka: "Mercury",
    reading:
      "Strong, well-resourced foundational schooling — but built through real structure and effort, not unearned ease.",
    icon: Home,
    color: grahas.guru.primary,
  },
  {
    house: 5,
    title: "Applied intellect",
    sanskrit: "पञ्चम",
    sign: "Capricorn",
    lord: "Saturn",
    occupant: "Mars exalted",
    karaka: "Jupiter",
    reading:
      "Sharp, decisive, competitively-flavoured discernment, linked back to the same disciplined foundation.",
    icon: Lightbulb,
    color: grahas.mangala.primary,
  },
  {
    house: 9,
    title: "Higher learning",
    sanskrit: "नवम",
    sign: "Taurus",
    lord: "Venus",
    occupant: "Ketu",
    karaka: "Sun & Jupiter",
    reading:
      "Genuine higher-learning capability shaped into an unconventional, self-directed path; paternal support at a remove.",
    icon: GraduationCap,
    color: grahas.shukra.primary,
  },
];

const CONVERGENCE_PLANETS = [
  {
    key: "jupiter",
    name: "Jupiter",
    devanagari: "गुरु",
    color: grahas.guru.primary,
    roles: [
      "4th lord (foundation)",
      "5th karaka (applied intellect)",
      "Co-former of Sarasvatī yoga",
      "Own sign, 7th house (kendra)",
    ],
  },
  {
    key: "venus",
    name: "Venus",
    devanagari: "शुक्र",
    color: grahas.shukra.primary,
    roles: [
      "9th lord (higher learning)",
      "Co-former of Sarasvatī yoga",
      "Own sign, 2nd house",
    ],
  },
  {
    key: "mercury",
    name: "Mercury",
    devanagari: "बुध",
    color: grahas.budha.primary,
    roles: [
      "4th-house education karaka",
      "Co-former of Sarasvatī yoga",
      "Own sign + exact exaltation, Lagna",
    ],
  },
  {
    key: "saturn",
    name: "Saturn",
    devanagari: "शनि",
    color: grahas.shani.primary,
    roles: [
      "4th-house occupant (effort/structure)",
      "5th lord (applied intellect)",
      "Ties 4th and 5th together",
    ],
  },
];

const YOGA_CONDITIONS = [
  { planet: "Mercury", status: "own sign + exalted", house: "1st (Lagna)", met: true },
  { planet: "Jupiter", status: "own sign", house: "7th (kendra)", met: true },
  { planet: "Venus", status: "own sign", house: "2nd", met: true },
];

const SINGLE_VS_SYNTHESIS = [
  {
    perspective: "4th house only",
    sees: "Strong foundational education built through effort.",
    misses: "That the same Jupiter also anchors dharma/higher learning, and that Mercury-Venus-Jupiter form a yoga.",
  },
  {
    perspective: "5th house only",
    sees: "Decisive, competitive applied intellect.",
    misses: "The structural link to foundational schooling and the higher-learning outlet for that intellect.",
  },
  {
    perspective: "9th house only",
    sees: "Unconventional higher-learning path.",
    misses: "How substantial the underlying capability is; might underweight the strength behind the unconventional shape.",
  },
  {
    perspective: "Three-house synthesis",
    sees: "One coherent story + the Sarasvatī yoga explaining why all three houses agree.",
    misses: "Nothing essential — this is the complete picture.",
  },
];

const NARRATIVE_SEGMENTS = [
  { id: "strength", text: "Real, substantial educational capability across every stage.", correct: true },
  { id: "effort", text: "Capability is consistently realised through effort and discipline, not unearned ease.", correct: true },
  { id: "unconventional", text: "The path is likely unconventional, especially in higher learning.", correct: true },
  { id: "yoga", text: "The convergence is explained by the Sarasvatī yoga linking Mercury, Jupiter, and Venus.", correct: true },
  { id: "perfection", text: "Everything will come easily and follow a standard template.", correct: false, reason: "This ignores the Saturn-effort and Ketu-unconventional threads." },
  { id: "struggle", text: "The native will face significant struggle in education overall.", correct: false, reason: "The overall picture is genuinely strong, not a story of struggle." },
];

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : color;
}

export function FourFiveNineEducationalArcSynthesizer() {
  const [tab, setTab] = useState<TabKey>("arc");

  function reset() {
    setTab("arc");
  }

  return (
    <div
      data-interactive="four-five-nine-educational-arc-synthesizer"
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
            4-5-9 educational arc
          </p>
          <h2
            className="mt-1 text-xl sm:text-2xl"
            style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
          >
            Synthesise the education cluster
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            Read the 4th, 5th, and 9th houses as one developmental story, detect the structural convergence, and build
            a client-facing narrative.
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

      <nav className="mb-5 flex flex-wrap gap-2" aria-label="4-5-9 educational arc sections">
        {TABS.map((t) => (
          <TabButton key={t.key} active={tab === t.key} onClick={() => setTab(t.key)}>
            {t.label}
          </TabButton>
        ))}
      </nav>

      {tab === "arc" && <ArcTab />}
      {tab === "convergence" && <ConvergenceTab />}
      {tab === "single-vs-synthesis" && <SingleVsSynthesisTab />}
      {tab === "narrative" && <NarrativeTab />}
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

function ArcTab() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.1</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          The arc, told in sequence
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Click each house to expand its reading. Read end-to-end, the three houses tell one developmental story.
        </p>

        <div className="relative mt-4 space-y-3 pl-5">
          <div className="absolute left-[1.15rem] top-3 bottom-3 w-px" style={{ background: HAIRLINE }} aria-hidden="true" />
          {HOUSES.map((h) => {
            const Icon = h.icon;
            const isOpen = open === h.house;
            return (
              <div key={h.house} className="relative">
                <div
                  className="absolute -left-5 top-3 flex h-5 w-5 items-center justify-center rounded-full text-xs"
                  style={{ background: h.color, color: "#fff", fontWeight: 600 }}
                >
                  {h.house}
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : h.house)}
                  className="w-full rounded-lg p-3 text-left"
                  style={{
                    background: isOpen ? wash(h.color, "12") : SURFACE_2,
                    border: `1px solid ${isOpen ? h.color : HAIRLINE}`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Icon size={16} style={{ color: h.color }} aria-hidden="true" />
                    <span className="text-sm" style={{ color: INK_PRIMARY, fontWeight: 600 }}>
                      {h.title} <span style={{ fontFamily: fontFamilies.display }}>({h.sanskrit})</span>
                    </span>
                  </div>
                  {isOpen && (
                    <div className="mt-2 space-y-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
                      <p className="m-0"><span style={{ color: INK_MUTED, fontWeight: 500 }}>Sign:</span> {h.sign}</p>
                      <p className="m-0"><span style={{ color: INK_MUTED, fontWeight: 500 }}>Lord:</span> {h.lord}</p>
                      <p className="m-0"><span style={{ color: INK_MUTED, fontWeight: 500 }}>Occupant:</span> {h.occupant}</p>
                      <p className="m-0"><span style={{ color: INK_MUTED, fontWeight: 500 }}>Kāraka:</span> {h.karaka}</p>
                      <p className="m-0 mt-2" style={{ color: INK_PRIMARY }}>{h.reading}</p>
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <Link2 size={18} style={{ color: GOLD }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>The throughline</p>
        </div>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          Real, substantial capability at every stage — consistently realised through effort and an unconventional shape
          rather than unearned ease.
        </p>
        <div className="mt-3 rounded-lg p-2 text-sm" style={{ background: wash(GOLD, "10"), border: `1px solid ${wash(GOLD, "55")}`, color: INK_SECONDARY, lineHeight: 1.55 }}>
          This is not three unrelated findings; it is one native&apos;s educational story, told from three vantage points.
        </div>
      </aside>
    </div>
  );
}

function ConvergenceTab() {
  const [activePlanet, setActivePlanet] = useState<string | null>("jupiter");
  const planet = CONVERGENCE_PLANETS.find((p) => p.key === activePlanet);

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.2</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          Convergence detector
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          The same planets do double or triple duty across the education houses. Click each planet to see its roles.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {CONVERGENCE_PLANETS.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setActivePlanet(p.key)}
              className="rounded-lg p-3 text-left text-sm"
              style={{
                background: activePlanet === p.key ? wash(p.color, "18") : SURFACE_2,
                border: `1px solid ${activePlanet === p.key ? p.color : HAIRLINE}`,
                color: INK_PRIMARY,
                fontWeight: 500,
              }}
            >
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ background: p.color }} aria-hidden="true" />
                <span style={{ color: activePlanet === p.key ? p.color : INK_PRIMARY, fontWeight: 600 }}>
                  {p.name} <span style={{ fontFamily: fontFamilies.display }}>({p.devanagari})</span>
                </span>
              </span>
            </button>
          ))}
        </div>

        {planet && (
          <div
            className="mt-4 rounded-lg p-3"
            style={{ background: wash(planet.color, "12"), border: `1px solid ${wash(planet.color, "55")}` }}
          >
            <p className="m-0 text-sm" style={{ color: planet.color, fontWeight: 600 }}>{planet.name} across the cluster</p>
            <ul className="m-0 mt-2 list-disc space-y-1 pl-5 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              {planet.roles.map((role, idx) => (
                <li key={idx}>{role}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <Sparkles size={18} style={{ color: GOLD }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>Sarasvatī yoga</p>
        </div>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          Mercury, Jupiter, and Venus form the learning/arts yoga. Two of them are 4th/9th lords; the third is the
          education karaka in the Lagna.
        </p>
        <div className="mt-3 space-y-2">
          {YOGA_CONDITIONS.map((c) => (
            <div
              key={c.planet}
              className="flex items-center justify-between rounded-lg p-2 text-sm"
              style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
            >
              <span style={{ color: INK_PRIMARY, fontWeight: 500 }}>{c.planet}</span>
              <span style={{ color: INK_SECONDARY }}>{c.status}, {c.house}</span>
              {c.met && <CheckCircle2 size={14} style={{ color: GREEN }} aria-hidden="true" />}
            </div>
          ))}
        </div>
        <p className="m-0 mt-3 text-sm" style={{ color: GREEN, fontWeight: 500 }}>Sarasvatī yoga formed</p>
      </aside>
    </div>
  );
}

function SingleVsSynthesisTab() {
  const [active, setActive] = useState<number | null>(3);

  return (
    <div className="grid min-w-0 gap-4">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.3</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          Why three-house synthesis outperforms a single house
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Click each perspective to see what it sees and what it misses.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {SINGLE_VS_SYNTHESIS.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActive(idx)}
              className="rounded-lg p-3 text-left text-sm"
              style={{
                background: active === idx ? wash(idx === 3 ? GREEN : GOLD, "12") : SURFACE_2,
                border: `1px solid ${active === idx ? (idx === 3 ? GREEN : GOLD) : HAIRLINE}`,
                color: INK_PRIMARY,
                fontWeight: 500,
              }}
            >
              <span style={{ color: active === idx ? (idx === 3 ? GREEN : GOLD) : INK_PRIMARY, fontWeight: 600 }}>
                {item.perspective}
              </span>
            </button>
          ))}
        </div>

        {active !== null && (
          <div
            className="mt-4 rounded-lg p-3"
            style={{
              background: wash(active === 3 ? GREEN : GOLD, "12"),
              border: `1px solid ${wash(active === 3 ? GREEN : GOLD, "55")}`,
            }}
          >
            <p className="m-0 text-sm" style={{ color: active === 3 ? GREEN : GOLD, fontWeight: 600 }}>
              {SINGLE_VS_SYNTHESIS[active].perspective}
            </p>
            <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              <span style={{ color: GREEN, fontWeight: 500 }}>Sees:</span> {SINGLE_VS_SYNTHESIS[active].sees}
            </p>
            <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              <span style={{ color: VERMILION, fontWeight: 500 }}>Misses:</span> {SINGLE_VS_SYNTHESIS[active].misses}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function NarrativeTab() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [reviewed, setReviewed] = useState(false);

  const selectedSegments = NARRATIVE_SEGMENTS.filter((s) => selectedIds.includes(s.id));

  function toggle(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    setReviewed(false);
  }

  const correctIds = NARRATIVE_SEGMENTS.filter((s) => s.correct).map((s) => s.id);
  const isModel = selectedIds.length === correctIds.length && correctIds.every((id) => selectedIds.includes(id));
  const hasIncorrect = selectedSegments.some((s) => !s.correct);

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§6</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          Build the client-facing narrative
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Select the statements that belong in a complete, honest synthesis. Avoid smoothing away the effortful and
          unconventional threads, and avoid overstating struggle or effortless brilliance.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {NARRATIVE_SEGMENTS.map((s) => {
            const selected = selectedIds.includes(s.id);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => toggle(s.id)}
                className="rounded-lg p-3 text-left text-sm"
                style={{
                  background: selected ? wash(GOLD, "18") : SURFACE_2,
                  border: `1px solid ${selected ? GOLD : HAIRLINE}`,
                  color: INK_PRIMARY,
                  fontWeight: 500,
                }}
              >
                {selected && <CheckCircle2 size={14} className="mb-1" style={{ color: GOLD }} aria-hidden="true" />}
                {s.text}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setReviewed(true)}
          className="mt-4 rounded-lg px-4 py-2 text-sm"
          style={{ background: GOLD, color: "#1A1408", fontWeight: 500 }}
        >
          Review narrative
        </button>

        {reviewed && (
          <div
            className="mt-4 rounded-lg p-3"
            style={{
              background: isModel ? wash(GREEN, "10") : hasIncorrect ? wash(VERMILION, "10") : wash(GOLD, "10"),
              border: `1px solid ${isModel ? wash(GREEN, "55") : hasIncorrect ? wash(VERMILION, "55") : wash(GOLD, "55")}`,
            }}
          >
            <p className="m-0 text-sm" style={{ color: isModel ? GREEN : hasIncorrect ? VERMILION : GOLD, fontWeight: 500 }}>
              {isModel ? "Complete narrative built" : hasIncorrect ? "Contains misleading content" : "Incomplete — include all correct segments and remove incorrect ones"}
            </p>
            {hasIncorrect && (
              <ul className="m-0 mt-2 list-disc space-y-1 pl-5 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
                {selectedSegments.filter((s) => !s.correct).map((s) => (
                  <li key={s.id}>{s.reason}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <BookOpen size={18} style={{ color: GOLD }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>Model narrative</p>
        </div>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_PRIMARY, lineHeight: 1.55 }}>
          &ldquo;This native shows real, substantial educational capability across every stage — foundational schooling,
          applied intellect, and higher learning — and that strength traces back to a single underlying pattern
          (Sarasvatī yoga) rather than three separate strokes of luck. The shape of the journey is unlikely to be smooth
          or conventional: expect effort and discipline in the foundational years, a sharp and competitive edge to
          applied intellect, and an unconventional higher-learning path. The overall picture is real capability that has
          to be actively worked and is likely to look different from the standard template.&rdquo;
        </p>
      </aside>
    </div>
  );
}
