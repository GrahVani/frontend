"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowLeftRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Home,
  Layers,
  RotateCcw,
  Scale,
  Sparkles,
  XCircle,
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
const BLUE = grahas.shukra.primary;

type TabKey = "gateway" | "houses" | "empty-house" | "compare";

const TABS: { key: TabKey; label: string }[] = [
  { key: "gateway", label: "D24-Lagna gateway" },
  { key: "houses", label: "4th / 5th / 9th" },
  { key: "empty-house", label: "Empty-house technique" },
  { key: "compare", label: "D1 vs D24" },
];

const HOUSE_READINGS = [
  {
    house: "D24-Lagna",
    sign: "Capricorn",
    devanagari: "मकर",
    occupants: "Moon, Mars (exalted)",
    lordNote: "—",
    reading:
      "Real overall learning orientation, anchored by exalted Mars — capable, driven, and decisive rather than passive.",
    empty: false,
    icon: Home,
    color: grahas.mangala.primary,
  },
  {
    house: "D24 4th",
    sign: "Aries",
    devanagari: "मेष",
    occupants: "Rāhu, Ketu",
    lordNote: "Lord Mars exalted in Capricorn (D24-1)",
    reading:
      "Formal education within the D24 carries a non-standard or intensified quality, but the lord's exaltation keeps it strong rather than weak.",
    empty: false,
    icon: BookOpen,
    color: grahas.ketu.primary,
  },
  {
    house: "D24 5th",
    sign: "Taurus",
    devanagari: "वृषभ",
    occupants: "—",
    lordNote: "Lord Venus in Libra (own sign, D24-10)",
    reading:
      "Empty house, but backed by a fully dignified lord — genuine applied-learning capacity, confirming the D1 5th finding.",
    empty: true,
    icon: Sparkles,
    color: grahas.shukra.primary,
  },
  {
    house: "D24 9th",
    sign: "Virgo",
    devanagari: "कन्या",
    occupants: "—",
    lordNote: "Lord Mercury in Cancer (enemy's sign, but kendra from Lagna)",
    reading:
      "Empty house with a mixed lord: angularly supported, but in an enemy's sign for Mercury. More modest than the D24 4th and 5th.",
    empty: true,
    icon: GraduationCap,
    color: grahas.budha.primary,
  },
];

const EMPTY_HOUSE_CHECK = [
  {
    id: "e1",
    statement: "An empty D24 house has nothing useful to report.",
    answer: false,
    rationale: "The lord's own condition carries real interpretive weight when no planet occupies the house.",
  },
  {
    id: "e2",
    statement: "For the D24 5th, Venus in Libra acts as the house's strength.",
    answer: true,
    rationale: "Venus is the 5th lord and sits in its own sign, giving a strong signal despite the empty house.",
  },
  {
    id: "e3",
    statement: "For the D24 9th, Mercury in Cancer is simply 'weak' and can be ignored.",
    answer: false,
    rationale: "Mercury is angular (kendra) from the D24-Lagna, which offsets the enemy-sign complication. It is mixed, not negligible.",
  },
];

const COMPARISONS = [
  {
    domain: "D1 9th house",
    findings: "Dignified Venus lord, Ketu occupant, strong Jupiter kāraka.",
    verdict: "Strong higher-learning capability, unconventional shape.",
  },
  {
    domain: "D24 9th house",
    findings: "Empty; lord Mercury in Cancer (enemy sign, but kendra).",
    verdict: "Comparatively more modest; angular support keeps it from weak outright.",
  },
];

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : color;
}

export function D24EducationReadingWorkbench() {
  const [tab, setTab] = useState<TabKey>("gateway");

  function reset() {
    setTab("gateway");
  }

  return (
    <div
      data-interactive="d24-education-reading-workbench"
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
            D24 education reading
          </p>
          <h2
            className="mt-1 text-xl sm:text-2xl"
            style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
          >
            Lagna and 4-5-9 workbench
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            Read Chart E1&apos;s D24-Lagna first, then the D24 4th, 5th, and 9th, applying the empty-house lord
            substitution and comparing D1 vs D24 findings.
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

      <nav className="mb-5 flex flex-wrap gap-2" aria-label="D24 education reading sections">
        {TABS.map((t) => (
          <TabButton key={t.key} active={tab === t.key} onClick={() => setTab(t.key)}>
            {t.label}
          </TabButton>
        ))}
      </nav>

      {tab === "gateway" && <GatewayTab />}
      {tab === "houses" && <HousesTab />}
      {tab === "empty-house" && <EmptyHouseTab />}
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

function GatewayTab() {
  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.2</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          D24-Lagna as gateway
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Before examining any specific D24 house, read the D24-Lagna as the native&apos;s overall orientation toward the
          varga&apos;s domain.
        </p>

        <div
          className="mt-4 rounded-lg p-4"
          style={{ background: wash(grahas.mangala.primary, "10"), border: `1px solid ${wash(grahas.mangala.primary, "55")}` }}
        >
          <div className="flex items-center gap-2">
            <Home size={18} style={{ color: grahas.mangala.primary }} aria-hidden="true" />
            <p className="m-0 text-sm" style={{ color: grahas.mangala.primary, fontWeight: 600 }}>D24-Lagna = Capricorn</p>
          </div>
          <p className="m-0 mt-2 text-sm" style={{ color: INK_PRIMARY, lineHeight: 1.55 }}>
            Occupied by <strong style={{ fontWeight: 600 }}>Moon</strong> and <strong style={{ fontWeight: 600 }}>Mars</strong>.
            Mars is <span style={{ color: GREEN, fontWeight: 500 }}>exalted</span> here — a genuinely strong occupant.
          </p>
          <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            The native&apos;s overall orientation toward learning is capable and driven. Mars gives decisiveness and
            competitive edge; the Moon adds mental engagement without a specific dignity claim.
          </p>
        </div>
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <Scale size={18} style={{ color: GOLD }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>Gateway discipline</p>
        </div>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          The D24-Lagna is read <em>alongside</em>, never <em>instead of</em>, the specific house findings. It sets the
          general tone.
        </p>
        <ul className="m-0 mt-2 list-disc space-y-2 pl-5 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          <li>Strong D24-Lagna = favourable overall orientation.</li>
          <li>Weak D24-Lagna = domain requires deliberate cultivation.</li>
          <li>Always complete the specific houses before rendering a final verdict.</li>
        </ul>
      </aside>
    </div>
  );
}

function HousesTab() {
  const [active, setActive] = useState<string | null>("D24 4th");
  const current = HOUSE_READINGS.find((h) => h.house === active);

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.4</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          Read the D24 4th, 5th, and 9th
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Click each house card. When a house is empty, its lord&apos;s own D24 condition carries the reading.
        </p>

        <div className="mt-4 space-y-2">
          {HOUSE_READINGS.filter((h) => h.house !== "D24-Lagna").map((h) => {
            const Icon = h.icon;
            const isActive = active === h.house;
            return (
              <button
                key={h.house}
                type="button"
                onClick={() => setActive(h.house)}
                className="w-full rounded-lg p-3 text-left"
                style={{
                  background: isActive ? wash(h.color, "12") : SURFACE_2,
                  border: `1px solid ${isActive ? h.color : HAIRLINE}`,
                }}
              >
                <div className="flex items-center gap-2">
                  <Icon size={16} style={{ color: h.color }} aria-hidden="true" />
                  <span className="text-sm" style={{ color: isActive ? h.color : INK_PRIMARY, fontWeight: 600 }}>
                    {h.house} <span style={{ fontFamily: fontFamilies.display }}>({h.devanagari})</span>
                  </span>
                  {h.empty && <span className="ml-auto text-xs" style={{ color: INK_MUTED }}>empty</span>}
                </div>
              </button>
            );
          })}
        </div>

        {current && (
          <div
            className="mt-4 rounded-lg p-3"
            style={{ background: wash(current.color, "10"), border: `1px solid ${wash(current.color, "55")}` }}
          >
            <p className="m-0 text-sm" style={{ color: current.color, fontWeight: 600 }}>{current.house} reading</p>
            <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              <span style={{ color: INK_MUTED, fontWeight: 500 }}>Sign:</span> {current.sign}
            </p>
            <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              <span style={{ color: INK_MUTED, fontWeight: 500 }}>Occupants:</span> {current.occupants || "none"}
            </p>
            <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              <span style={{ color: INK_MUTED, fontWeight: 500 }}>Lord:</span> {current.lordNote}
            </p>
            <p className="m-0 mt-2 text-sm" style={{ color: INK_PRIMARY, lineHeight: 1.55 }}>{current.reading}</p>
          </div>
        )}
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <Layers size={18} style={{ color: GOLD }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>Reading order</p>
        </div>
        <ol className="m-0 mt-2 list-decimal space-y-2 pl-5 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          <li>D24-Lagna first — overall orientation.</li>
          <li>D24 4th — formal education foundation.</li>
          <li>D24 5th — applied intellect.</li>
          <li>D24 9th — higher learning.</li>
        </ol>
      </aside>
    </div>
  );
}

function EmptyHouseTab() {
  const [judgments, setJudgments] = useState<Record<string, boolean | null>>({});

  function judge(id: string, answer: boolean) {
    setJudgments((prev) => ({ ...prev, [id]: answer }));
  }

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.3 & §6</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          Empty does not mean uninformative
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          When a D24 house has no occupant, read its lord&apos;s own condition. Classify each statement below.
        </p>

        <div className="mt-4 space-y-3">
          {EMPTY_HOUSE_CHECK.map((item) => {
            const judged = judgments[item.id];
            const correct = judged === item.answer;
            return (
              <div
                key={item.id}
                className="rounded-lg p-3"
                style={{
                  background: judged !== undefined && judged !== null ? (correct ? wash(GREEN, "10") : wash(VERMILION, "10")) : SURFACE_2,
                  border: `1px solid ${judged !== undefined && judged !== null ? (correct ? wash(GREEN, "55") : wash(VERMILION, "55")) : HAIRLINE}`,
                }}
              >
                <p className="m-0 text-sm" style={{ color: INK_PRIMARY, lineHeight: 1.55 }}>{item.statement}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {[true, false].map((val) => {
                    const selected = judged === val;
                    return (
                      <button
                        key={val ? "true" : "false"}
                        type="button"
                        disabled={judged !== undefined && judged !== null}
                        onClick={() => judge(item.id, val)}
                        className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm"
                        style={{
                          background: selected ? (val ? GREEN : VERMILION) : SURFACE,
                          border: `1px solid ${selected ? (val ? GREEN : VERMILION) : HAIRLINE}`,
                          color: selected ? "#fff" : INK_SECONDARY,
                          fontWeight: 500,
                          opacity: judged !== undefined && judged !== null && !selected ? 0.5 : 1,
                        }}
                      >
                        {selected && (val ? <CheckCircle2 size={14} aria-hidden="true" /> : <XCircle size={14} aria-hidden="true" />)}
                        {val ? "True" : "False"}
                      </button>
                    );
                  })}
                </div>
                {judged !== undefined && judged !== null && (
                  <p className="m-0 mt-2 text-sm" style={{ color: correct ? GREEN : VERMILION, lineHeight: 1.55 }}>
                    {correct ? "Correct. " : "Not quite. "}{item.rationale}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <BookOpen size={18} style={{ color: GOLD }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>Lord substitution examples</p>
        </div>
        <ul className="m-0 mt-2 list-disc space-y-2 pl-5 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          <li>D24 5th (empty) → Venus in Libra = strong applied-learning signal.</li>
          <li>D24 9th (empty) → Mercury in Cancer = mixed (kendra, but enemy sign).</li>
        </ul>
        <div className="mt-3 rounded-lg p-2 text-sm" style={{ background: wash(GOLD, "10"), border: `1px solid ${wash(GOLD, "55")}`, color: INK_SECONDARY, lineHeight: 1.55 }}>
          The empty-house technique turns absence into a precise reading rather than a dead end.
        </div>
      </aside>
    </div>
  );
}

function CompareTab() {
  return (
    <div className="grid min-w-0 gap-4">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§6</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          D1 vs D24: an honest divergence
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          The D24 can confirm or genuinely diverge from the D1. The 9th house is the clearest example in Chart E1.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {COMPARISONS.map((c) => (
            <div
              key={c.domain}
              className="rounded-lg p-3"
              style={{
                background: c.domain.startsWith("D24") ? wash(BLUE, "10") : wash(GOLD, "10"),
                border: `1px solid ${c.domain.startsWith("D24") ? wash(BLUE, "55") : wash(GOLD, "55")}`,
              }}
            >
              <div className="flex items-center gap-2">
                <ArrowLeftRight size={16} style={{ color: c.domain.startsWith("D24") ? BLUE : GOLD }} aria-hidden="true" />
                <p className="m-0 text-sm" style={{ color: c.domain.startsWith("D24") ? BLUE : GOLD, fontWeight: 600 }}>{c.domain}</p>
              </div>
              <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
                <span style={{ color: INK_MUTED, fontWeight: 500 }}>Findings:</span> {c.findings}
              </p>
              <p className="m-0 mt-2 text-sm" style={{ color: INK_PRIMARY, lineHeight: 1.55 }}>
                <span style={{ color: c.domain.startsWith("D24") ? BLUE : GOLD, fontWeight: 500 }}>Verdict:</span> {c.verdict}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-lg p-3" style={{ background: wash(GOLD, "10"), border: `1px solid ${wash(GOLD, "55")}` }}>
          <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>Overall synthesis</p>
          <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            The D24 largely confirms the D1 story of real, effortful, somewhat unconventional educational strength — but
            adds the honest nuance that the higher-learning facet is the least strongly confirmed at this finer
            resolution.
          </p>
        </div>
      </section>
    </div>
  );
}
