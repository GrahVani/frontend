"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Layers,
  MapPinned,
  RotateCcw,
  Scale,
  ShieldCheck,
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
const SAFFRON = grahas.guru.primary;
const CORAL = grahas.mangala.primary;
const SILVER = grahas.candra.primary;

const SIGN_LORDS: Record<string, { lord: string; grahaSlug: string; color: string }> = {
  Aries: { lord: "Mars", grahaSlug: "mangala", color: CORAL },
  Taurus: { lord: "Venus", grahaSlug: "shukra", color: BLUE },
  Gemini: { lord: "Mercury", grahaSlug: "budha", color: GREEN },
  Cancer: { lord: "Moon", grahaSlug: "candra", color: SILVER },
  Leo: { lord: "Sun", grahaSlug: "surya", color: GOLD },
  Virgo: { lord: "Mercury", grahaSlug: "budha", color: GREEN },
  Libra: { lord: "Venus", grahaSlug: "shukra", color: BLUE },
  Scorpio: { lord: "Mars", grahaSlug: "mangala", color: CORAL },
  Sagittarius: { lord: "Jupiter", grahaSlug: "guru", color: SAFFRON },
  Capricorn: { lord: "Saturn", grahaSlug: "shani", color: "#2C2C3E" },
  Aquarius: { lord: "Saturn", grahaSlug: "shani", color: "#2C2C3E" },
  Pisces: { lord: "Jupiter", grahaSlug: "guru", color: SAFFRON },
};

type FriendshipValue = "F" | "N" | "E" | "—";

const FRIENDSHIP_GRID: Record<string, Record<string, FriendshipValue>> = {
  Sun: { Sun: "—", Moon: "F", Mars: "F", Mercury: "N", Jupiter: "F", Venus: "E", Saturn: "E", Rahu: "E", Ketu: "E" },
  Moon: { Sun: "F", Moon: "—", Mars: "N", Mercury: "F", Jupiter: "N", Venus: "N", Saturn: "N", Rahu: "N", Ketu: "N" },
  Mars: { Sun: "F", Moon: "F", Mars: "—", Mercury: "E", Jupiter: "F", Venus: "N", Saturn: "N", Rahu: "E", Ketu: "F" },
  Mercury: { Sun: "F", Moon: "E", Mars: "N", Mercury: "—", Jupiter: "N", Venus: "F", Saturn: "N", Rahu: "F", Ketu: "N" },
  Jupiter: { Sun: "F", Moon: "F", Mars: "F", Mercury: "E", Jupiter: "—", Venus: "E", Saturn: "N", Rahu: "N", Ketu: "N" },
  Venus: { Sun: "E", Moon: "E", Mars: "N", Mercury: "F", Jupiter: "N", Venus: "—", Saturn: "F", Rahu: "F", Ketu: "F" },
  Saturn: { Sun: "E", Moon: "E", Mars: "E", Mercury: "F", Jupiter: "N", Venus: "F", Saturn: "—", Rahu: "F", Ketu: "F" },
};

const GRID_HEADERS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

type TabKey = "mercury" | "jupiter" | "contrast" | "lordship";

const TABS: { key: TabKey; label: string }[] = [
  { key: "mercury", label: "Mercury: D1 peak → D24 enemy" },
  { key: "jupiter", label: "Jupiter: own → friend" },
  { key: "contrast", label: "Three-way contrast" },
  { key: "lordship", label: "Lordship does not carry" },
];

const MERCURY_CASE = {
  planet: "Mercury",
  color: GREEN,
  d1: { sign: "Virgo", dignity: "own sign + exact exaltation", house: 1, note: "the chart's strongest single dignity claim" },
  d24: { sign: "Cancer", lord: "Moon", friendship: "E" as FriendshipValue, house: 7, houseType: "kendra", tier: "enemy's sign" },
};

const JUPITER_CASE = {
  planet: "Jupiter",
  color: SAFFRON,
  d1: { sign: "Pisces", dignity: "own sign", house: 7, note: "also D1 4th lord (Sagittarius)" },
  d24: { sign: "Scorpio", lord: "Mars", friendship: "F" as FriendshipValue, house: 11, houseType: "upachaya", tier: "friend's sign" },
};

const LORDSHIP_QUIZ = [
  {
    id: "l1",
    statement: "Because Jupiter is Chart E1's D1 4th lord, it also lords the D24 4th house.",
    answer: false,
    rationale: "The D24 4th is Aries, lorded by Mars. House-lordship must be re-derived from the D24-Lagna.",
  },
  {
    id: "l2",
    statement: "Mercury is the D24 9th lord because Virgo falls in D24 house 9, and Mercury lords Virgo.",
    answer: true,
    rationale: "This lordship is derived fresh inside the D24, not imported from the D1.",
  },
  {
    id: "l3",
    statement: "A D1 house-lordship map can be reused directly in any divisional chart without recomputation.",
    answer: false,
    rationale: "Each varga has its own Lagna, so the numbered houses fall on different signs and have different lords.",
  },
  {
    id: "l4",
    statement: "In Chart E1, the D24 4th lord is Mars.",
    answer: true,
    rationale: "D24-Lagna Capricorn makes Aries the 4th house; Mars lords Aries.",
  },
];

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : color;
}

function tierColor(tier: string) {
  if (tier.includes("enemy")) return VERMILION;
  if (tier.includes("friend")) return GREEN;
  if (tier.includes("own") || tier.includes("exalt")) return GOLD;
  return INK_MUTED;
}

export function D24MercuryJupiterKarakaWorkbench() {
  const [tab, setTab] = useState<TabKey>("mercury");

  function reset() {
    setTab("mercury");
  }

  return (
    <div
      data-interactive="d24-mercury-jupiter-karaka-workbench"
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
            D24 education kārakas
          </p>
          <h2
            className="mt-1 text-xl sm:text-2xl"
            style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
          >
            Mercury and Jupiter dignity workbench
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            Compare D1 and D24 dignity for Chart E1&apos;s two education kārakas. Apply the naisargika friendship grid,
            hold positional strength alongside sign-dignity, and see why house-lordship does not carry between vargas.
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

      <nav className="mb-5 flex flex-wrap gap-2" aria-label="D24 kāraka workbench sections">
        {TABS.map((t) => (
          <TabButton key={t.key} active={tab === t.key} onClick={() => setTab(t.key)}>
            {t.label}
          </TabButton>
        ))}
      </nav>

      {tab === "mercury" && <MercuryTab />}
      {tab === "jupiter" && <JupiterTab />}
      {tab === "contrast" && <ContrastTab />}
      {tab === "lordship" && <LordshipTab />}
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

function MercuryTab() {
  const [mode, setMode] = useState<"grid" | "naive">("grid");
  const caseData = MERCURY_CASE;

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.2</p>
        <h3
          className="mt-1 text-lg"
          style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
        >
          Mercury: D1 exaltation, D24 enemy&apos;s sign
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          In D1 Mercury is at Virgo 15°, its own sign and exact exaltation point. In D24 it lands in Cancer, the
          Moon&apos;s sign. Mercury treats the Moon as an enemy.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <DignityCard title="D1 position" sign={caseData.d1.sign} dignity={caseData.d1.dignity} house={caseData.d1.house} color={caseData.color} />
          <DignityCard title="D24 position" sign={caseData.d24.sign} dignity={caseData.d24.tier} house={caseData.d24.house} color={tierColor(caseData.d24.tier)} />
        </div>

        <div className="mt-4 rounded-lg p-3" style={{ background: wash(GREEN, "10"), border: `1px solid ${wash(GREEN, "55")}` }}>
          <div className="flex items-center gap-2">
            <Scale size={18} style={{ color: GREEN }} aria-hidden="true" />
            <p className="m-0 text-sm" style={{ color: GREEN, fontWeight: 600 }}>Mixed condition, not a single verdict</p>
          </div>
          <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            The D24 7th is a kendra — a genuine structural asset. But the sign is hostile for Mercury. Both facts must be
            held together; the kendra does not erase the enemy sign.
          </p>
        </div>
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <BookOpen size={18} style={{ color: GREEN }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: GREEN, fontWeight: 600 }}>Apply the friendship grid</p>
        </div>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          Toggle between the precise grid reading and the common mistake of calling the placement neutral.
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={mode === "grid"}
            onClick={() => setMode("grid")}
            className="rounded-lg px-3 py-2 text-sm"
            style={{
              background: mode === "grid" ? GREEN : SURFACE,
              border: `1px solid ${mode === "grid" ? GREEN : HAIRLINE}`,
              color: mode === "grid" ? "#fff" : INK_SECONDARY,
              fontWeight: 500,
            }}
          >
            Use grid
          </button>
          <button
            type="button"
            aria-pressed={mode === "naive"}
            onClick={() => setMode("naive")}
            className="rounded-lg px-3 py-2 text-sm"
            style={{
              background: mode === "naive" ? VERMILION : SURFACE,
              border: `1px solid ${mode === "naive" ? VERMILION : HAIRLINE}`,
              color: mode === "naive" ? "#fff" : INK_SECONDARY,
              fontWeight: 500,
            }}
          >
            Call it neutral
          </button>
        </div>

        {mode === "grid" ? (
          <div className="mt-4 rounded-lg p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              Mercury&apos;s row, Moon&apos;s column = <strong style={{ color: VERMILION, fontWeight: 600 }}>E (enemy)</strong>.
              Cancer is therefore an enemy&apos;s sign for Mercury.
            </p>
          </div>
        ) : (
          <div className="mt-4 rounded-lg p-3" style={{ background: wash(VERMILION, "10"), border: `1px solid ${wash(VERMILION, "55")}` }}>
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} style={{ color: VERMILION }} aria-hidden="true" />
              <p className="m-0 text-sm" style={{ color: VERMILION, fontWeight: 600 }}>Common mistake</p>
            </div>
            <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              Calling Cancer &quot;neutral&quot; for Mercury under-describes a real affliction. Check the grid instead of
              defaulting to neutral.
            </p>
          </div>
        )}

        <MiniGrid highlightRow="Mercury" highlightCol="Moon" />
      </aside>
    </div>
  );
}

function JupiterTab() {
  const [overclaim, setOverclaim] = useState(false);
  const caseData = JUPITER_CASE;

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.3</p>
        <h3
          className="mt-1 text-lg"
          style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
        >
          Jupiter: D1 own sign, D24 friend&apos;s sign
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Jupiter sits in Pisces in D1. In D24 it moves to Scorpio, Mars&apos;s sign. Jupiter treats Mars as a friend, so
          the placement is supportive — but it is one tier below own sign.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <DignityCard title="D1 position" sign={caseData.d1.sign} dignity={caseData.d1.dignity} house={caseData.d1.house} color={caseData.color} />
          <DignityCard title="D24 position" sign={caseData.d24.sign} dignity={caseData.d24.tier} house={caseData.d24.house} color={tierColor(caseData.d24.tier)} />
        </div>

        <div className="mt-4 rounded-lg p-3" style={{ background: wash(SAFFRON, "10"), border: `1px solid ${wash(SAFFRON, "55")}` }}>
          <div className="flex items-center gap-2">
            <Sparkles size={18} style={{ color: SAFFRON }} aria-hidden="true" />
            <p className="m-0 text-sm" style={{ color: SAFFRON, fontWeight: 600 }}>Upachaya growth quality</p>
          </div>
          <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            The D24 11th is an upachaya — a house that develops over time. Jupiter is a benefic, so the malefic-upachaya
            clause does not apply, but the forward-looking quality still adds a mild, maturing tone.
          </p>
        </div>
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} style={{ color: GREEN }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: GREEN, fontWeight: 600 }}>Name the tier precisely</p>
        </div>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          &quot;Friend&apos;s sign&quot; is real support, but it is not &quot;own sign.&quot; Toggle to see the overclaim
          warning.
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={!overclaim}
            onClick={() => setOverclaim(false)}
            className="rounded-lg px-3 py-2 text-sm"
            style={{
              background: !overclaim ? GREEN : SURFACE,
              border: `1px solid ${!overclaim ? GREEN : HAIRLINE}`,
              color: !overclaim ? "#fff" : INK_SECONDARY,
              fontWeight: 500,
            }}
          >
            Friend&apos;s sign
          </button>
          <button
            type="button"
            aria-pressed={overclaim}
            onClick={() => setOverclaim(true)}
            className="rounded-lg px-3 py-2 text-sm"
            style={{
              background: overclaim ? VERMILION : SURFACE,
              border: `1px solid ${overclaim ? VERMILION : HAIRLINE}`,
              color: overclaim ? "#fff" : INK_SECONDARY,
              fontWeight: 500,
            }}
          >
            Treat as own sign
          </button>
        </div>

        {overclaim ? (
          <div className="mt-4 rounded-lg p-3" style={{ background: wash(VERMILION, "10"), border: `1px solid ${wash(VERMILION, "55")}` }}>
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} style={{ color: VERMILION }} aria-hidden="true" />
              <p className="m-0 text-sm" style={{ color: VERMILION, fontWeight: 600 }}>Overclaim warning</p>
            </div>
            <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              Describing Jupiter&apos;s D24 Scorpio placement as own-sign strength flattens the dignity scale. Own sign
              and friend&apos;s sign are different tiers.
            </p>
          </div>
        ) : (
          <div className="mt-4 rounded-lg p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              Jupiter&apos;s row, Mars&apos;s column = <strong style={{ color: GREEN, fontWeight: 600 }}>F (friend)</strong>.
              Scorpio is a friend&apos;s sign — positive, but lesser than D1 Pisces.
            </p>
          </div>
        )}

        <MiniGrid highlightRow="Jupiter" highlightCol="Mars" />
      </aside>
    </div>
  );
}

function ContrastTab() {
  return (
    <div className="grid min-w-0 gap-4">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.4</p>
        <h3
          className="mt-1 text-lg"
          style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
        >
          Three outcomes from the same method
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Mars, Jupiter, and Mercury show three different D1-to-D24 stories. No rule predicts which outcome a planet will
          give — each varga placement must be checked fresh.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                <th className="py-2 pr-3 font-medium" style={{ color: INK_MUTED, fontWeight: 600 }}>Planet</th>
                <th className="py-2 pr-3 font-medium" style={{ color: INK_MUTED, fontWeight: 600 }}>D1 sign / dignity</th>
                <th className="py-2 pr-3 font-medium" style={{ color: INK_MUTED, fontWeight: 600 }}>D24 sign / dignity</th>
                <th className="py-2 font-medium" style={{ color: INK_MUTED, fontWeight: 600 }}>Carryover</th>
              </tr>
            </thead>
            <tbody>
              <ContrastRow planet="Mars" color={CORAL} d1="Capricorn, exalted" d24="Capricorn, exalted" carryover="Full reconfirmation" />
              <ContrastRow planet="Jupiter" color={SAFFRON} d1="Pisces, own sign" d24="Scorpio, friend's sign" carryover="Positive, one tier down" />
              <ContrastRow planet="Mercury" color={GREEN} d1="Virgo, own + exact exaltation" d24="Cancer, enemy's sign" carryover="Negative shift" />
            </tbody>
          </table>
        </div>

        <CarryoverSvg />

        <div className="mt-4 rounded-lg p-3" style={{ background: wash(GOLD, "10"), border: `1px solid ${wash(GOLD, "55")}` }}>
          <div className="flex items-center gap-2">
            <Layers size={18} style={{ color: GOLD }} aria-hidden="true" />
            <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>Core principle</p>
          </div>
          <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            <strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>D1 dignity does not mechanically carry into any
            divisional chart.</strong> Each varga is an independent computation producing an independent sign placement.
          </p>
        </div>
      </section>
    </div>
  );
}

function LordshipTab() {
  const [judgments, setJudgments] = useState<Record<string, boolean | null>>({});

  function judge(id: string, answer: boolean) {
    setJudgments((prev) => ({ ...prev, [id]: answer }));
  }

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.5</p>
        <h3
          className="mt-1 text-lg"
          style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
        >
          House-lordship must be re-derived in each varga
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Because the D24-Lagna (Capricorn) differs from the D1 Lagna (Virgo), the numbered houses fall on different
          signs. A planet&apos;s D1 lordship role does not automatically apply to the same-numbered D24 house.
        </p>

        <LordshipSvg />

        <div className="mt-4 space-y-3">
          {LORDSHIP_QUIZ.map((item) => {
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
          <MapPinned size={18} style={{ color: GOLD }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>D1 vs D24 house maps</p>
        </div>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          The 4th and 9th houses change lords because their cusp signs change.
        </p>
        <div className="mt-3 space-y-2 text-sm" style={{ color: INK_SECONDARY }}>
          <div className="rounded-lg p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <p className="m-0" style={{ color: INK_PRIMARY, fontWeight: 600 }}>D1 4th house</p>
            <p className="m-0 mt-1">Sign: Sagittarius → Lord: <span style={{ color: SAFFRON, fontWeight: 500 }}>Jupiter</span></p>
          </div>
          <div className="rounded-lg p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <p className="m-0" style={{ color: INK_PRIMARY, fontWeight: 600 }}>D24 4th house</p>
            <p className="m-0 mt-1">Sign: Aries → Lord: <span style={{ color: CORAL, fontWeight: 500 }}>Mars</span></p>
          </div>
          <div className="rounded-lg p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <p className="m-0" style={{ color: INK_PRIMARY, fontWeight: 600 }}>D1 9th house</p>
            <p className="m-0 mt-1">Sign: Taurus → Lord: <span style={{ color: BLUE, fontWeight: 500 }}>Venus</span></p>
          </div>
          <div className="rounded-lg p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <p className="m-0" style={{ color: INK_PRIMARY, fontWeight: 600 }}>D24 9th house</p>
            <p className="m-0 mt-1">Sign: Virgo → Lord: <span style={{ color: GREEN, fontWeight: 500 }}>Mercury</span></p>
          </div>
        </div>
      </aside>
    </div>
  );
}

function DignityCard({ title, sign, dignity, house, color }: { title: string; sign: string; dignity: string; house: number; color: string }) {
  const lord = SIGN_LORDS[sign];
  return (
    <div className="rounded-lg p-3" style={{ background: wash(color, "10"), border: `1px solid ${wash(color, "55")}` }}>
      <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>{title}</p>
      <p className="m-0 mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
        {sign}
      </p>
      <p className="m-0 mt-1 text-sm" style={{ color: color, fontWeight: 500 }}>{dignity}</p>
      <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY }}>
        House {house} <span style={{ color: INK_MUTED }}>(lord: {lord ? lord.lord : "—"})</span>
      </p>
    </div>
  );
}

function MiniGrid({ highlightRow, highlightCol }: { highlightRow: string; highlightCol: string }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full text-center text-sm" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
            <th className="py-1.5 px-1" style={{ color: INK_MUTED, fontWeight: 600 }}>↓ \ →</th>
            {GRID_HEADERS.map((h) => (
              <th
                key={h}
                className="py-1.5 px-1"
                style={{
                  color: h === highlightCol ? INK_PRIMARY : INK_MUTED,
                  fontWeight: 600,
                  background: h === highlightCol ? wash(GOLD, "18") : "transparent",
                }}
              >
                {h.slice(0, 3)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {GRID_HEADERS.map((row) => (
            <tr key={row} style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
              <td
                className="py-1.5 px-1"
                style={{
                  color: row === highlightRow ? INK_PRIMARY : INK_SECONDARY,
                  fontWeight: 600,
                  background: row === highlightRow ? wash(GOLD, "18") : "transparent",
                }}
              >
                {row.slice(0, 3)}
              </td>
              {GRID_HEADERS.map((col) => {
                const val = FRIENDSHIP_GRID[row]?.[col] ?? "—";
                const isTarget = row === highlightRow && col === highlightCol;
                return (
                  <td
                    key={col}
                    className="py-1.5 px-1"
                    style={{
                      color: isTarget ? "#fff" : val === "F" ? GREEN : val === "E" ? VERMILION : INK_SECONDARY,
                      background: isTarget ? VERMILION : "transparent",
                      fontWeight: isTarget ? 600 : 500,
                    }}
                  >
                    {val}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ContrastRow({ planet, color, d1, d24, carryover }: { planet: string; color: string; d1: string; d24: string; carryover: string }) {
  return (
    <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
      <td className="py-2 pr-3" style={{ color: color, fontWeight: 600 }}>{planet}</td>
      <td className="py-2 pr-3" style={{ color: INK_SECONDARY }}>{d1}</td>
      <td className="py-2 pr-3" style={{ color: INK_SECONDARY }}>{d24}</td>
      <td className="py-2" style={{ color: INK_PRIMARY, fontWeight: 500 }}>{carryover}</td>
    </tr>
  );
}

function CarryoverSvg() {
  return (
    <svg viewBox="0 0 560 180" role="img" aria-label="D1 to D24 dignity carryover comparison for Mars, Jupiter, and Mercury" style={{ width: "100%", maxHeight: 220, margin: "1rem auto 0", display: "block" }}>
      <rect x="20" y="20" width="520" height="140" rx="8" fill={`${GOLD}0F`} stroke={HAIRLINE} />
      <text x="40" y="52" fill={INK_MUTED} fontSize="13" fontWeight={600}>Strength of D1-to-D24 reconfirmation</text>

      <Bar x={60} label="Mars" value={100} color={CORAL} text="Full — exalted in both" />
      <Bar x={210} label="Jupiter" value={60} color={SAFFRON} text="Partial — own → friend" />
      <Bar x={360} label="Mercury" value={20} color={GREEN} text="Weak — peak → enemy" />

      <text x="280" y="158" textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight={600}>Same computational method, three different outcomes</text>
    </svg>
  );
}

function Bar({ x, label, value, color, text }: { x: number; label: string; value: number; color: string; text: string }) {
  const barHeight = Math.max(18, (value / 100) * 72);
  return (
    <g transform={`translate(${x} 0)`}>
      <rect x="0" y={110 - barHeight} width="70" height={barHeight} rx="6" fill={color} opacity={0.85} />
      <text x="35" y={110 - barHeight - 8} textAnchor="middle" fill={color} fontSize="12" fontWeight={600}>{value}%</text>
      <text x="35" y="132" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight={600}>{label}</text>
      <text x="35" y="148" textAnchor="middle" fill={INK_SECONDARY} fontSize="11" fontWeight={500}>{text}</text>
    </g>
  );
}

function LordshipSvg() {
  return (
    <svg viewBox="0 0 560 210" role="img" aria-label="D1 and D24 house lordship maps showing Jupiter and Mercury roles" style={{ width: "100%", maxHeight: 240, margin: "1rem auto 0", display: "block" }}>
      <rect x="20" y="20" width="245" height="170" rx="8" fill={`${GOLD}0F`} stroke={HAIRLINE} />
      <rect x="295" y="20" width="245" height="170" rx="8" fill={`${GREEN}0F`} stroke={HAIRLINE} />

      <text x="142" y="46" textAnchor="middle" fill={INK_PRIMARY} fontSize="14" fontWeight={600}>D1 Lagna = Virgo</text>
      <text x="417" y="46" textAnchor="middle" fill={INK_PRIMARY} fontSize="14" fontWeight={600}>D24 Lagna = Capricorn</text>

      <Box x={50} y={65} label="4th house" sign="Sagittarius" lord="Jupiter" color={SAFFRON} />
      <Box x={50} y={125} label="9th house" sign="Taurus" lord="Venus" color={BLUE} />

      <Box x={325} y={65} label="4th house" sign="Aries" lord="Mars" color={CORAL} />
      <Box x={325} y={125} label="9th house" sign="Virgo" lord="Mercury" color={GREEN} />

      <path d="M 190 90 C 245 90, 300 90, 325 90" fill="none" stroke={VERMILION} strokeWidth="3" strokeDasharray="6 5" />
      <text x="257" y="82" textAnchor="middle" fill={VERMILION} fontSize="11" fontWeight={600}>lordship does not carry</text>
      <path d="M 190 150 C 245 150, 300 150, 325 150" fill="none" stroke={GREEN} strokeWidth="3" />
      <text x="257" y="170" textAnchor="middle" fill={GREEN} fontSize="11" fontWeight={600}>fresh derivation</text>
    </svg>
  );
}

function Box({ x, y, label, sign, lord, color }: { x: number; y: number; label: string; sign: string; lord: string; color: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0" y="0" width="170" height="48" rx="6" fill={`${color}18`} stroke={color} strokeWidth="1.5" />
      <text x="85" y="18" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight={600}>{label}: {sign}</text>
      <text x="85" y="36" textAnchor="middle" fill={color} fontSize="12" fontWeight={600}>lord: {lord}</text>
    </g>
  );
}
