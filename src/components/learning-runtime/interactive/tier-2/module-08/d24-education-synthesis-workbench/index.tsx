"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  ArrowLeftRight,
  CheckCircle2,
  Layers,
  RotateCcw,
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


type TabKey = "assemble" | "compare" | "convergence" | "synthesis";

const TABS: { key: TabKey; label: string }[] = [
  { key: "assemble", label: "Assemble the D24" },
  { key: "compare", label: "D1 vs D24" },
  { key: "convergence", label: "9th convergence" },
  { key: "synthesis", label: "Client synthesis" },
];

const D24_FINDINGS = [
  {
    id: "lagna",
    label: "D24-Lagna: Capricorn + exalted Mars",
    color: CORAL,
    text: "The D24-Lagna is Capricorn, occupied by Moon and exalted Mars — a strong overall orientation toward learning.",
  },
  {
    id: "fourth",
    label: "D24 4th: Aries, lord Mars exalted",
    color: CORAL,
    text: "The D24 4th is Aries, occupied by Rāhu and Ketu, and its lord Mars is exalted — formal education is strongly anchored.",
  },
  {
    id: "fifth",
    label: "D24 5th: Taurus, lord Venus own sign",
    color: BLUE,
    text: "The D24 5th is empty Taurus, lorded by Venus in its own sign — applied learning is genuinely supported.",
  },
  {
    id: "ninth",
    label: "D24 9th: Virgo, lord Mercury mixed",
    color: GREEN,
    text: "The D24 9th is empty Virgo, lorded by Mercury in Cancer — an enemy's sign, but in a kendra. This is the most modest facet.",
  },
  {
    id: "jupiter",
    label: "Jupiter: friend sign in upachaya",
    color: SAFFRON,
    text: "Jupiter in D24 Scorpio is in a friend's sign and the 11th, an upachaya — a mild, maturing positive.",
  },
  {
    id: "mars",
    label: "Mars: triple concentrated strength",
    color: CORAL,
    text: "Mars is exalted in the D24-Lagna, lord of the D24 4th, and the only planet to fully reconfirm its D1 dignity — the D24's structural signature.",
  },
];

const COMPARISONS = [
  {
    facet: "4th (foundational)",
    d1: "Strong: Jupiter (4th lord), own sign, 7th house",
    d24: "Strong: Rāhu/Ketu occupants; lord Mars exalted",
    relationship: "Confirms",
    tone: "confirm",
  },
  {
    facet: "5th (applied)",
    d1: "Strong: Saturn occupant + strong analysis",
    d24: "Strong: empty; lord Venus own sign",
    relationship: "Confirms",
    tone: "confirm",
  },
  {
    facet: "9th (higher/dharma)",
    d1: "Strong lord Venus, unconventional occupant Ketu",
    d24: "Kendra but sign-afflicted lord Mercury (enemy's sign)",
    relationship: "Converges on complication by different mechanisms",
    tone: "converge",
  },
  {
    facet: "Structural signature",
    d1: "Sarasvatī yoga (Mercury + Jupiter + Venus)",
    d24: "Mars's concentrated triple role",
    relationship: "Different in kind",
    tone: "different",
  },
];

const CONVERGENCE_QUIZ = [
  {
    id: "c1",
    statement: "The D1 and D24 9th findings rely on the same type of astrological fact.",
    answer: false,
    rationale: "D1 uses Ketu's occupant nature; D24 uses Mercury's sign-lord friendship. The mechanisms differ.",
  },
  {
    id: "c2",
    statement: "Because both charts point to 'complicated,' the conclusion is automatically certain.",
    answer: false,
    rationale: "Agreement alone is not enough; you must verify that the two derivations are genuinely independent.",
  },
  {
    id: "c3",
    statement: "The D24 9th reading was adjusted to match the D1 9th finding.",
    answer: false,
    rationale: "The D24 reading was derived from D24-internal data and the friendship grid, not tuned to match D1.",
  },
  {
    id: "c4",
    statement: "Two independent methods converging on the same direction is real corroboration.",
    answer: true,
    rationale: "This is exactly the standard applied here: independent derivations strengthen a conclusion.",
  },
];

const SYNTHESIS_PIECES = [
  {
    id: "foundation",
    label: "4th and 5th confirm real capability",
    text: "Foundational and applied learning both read strongly at D1 and D24, giving high confidence in real capability.",
  },
  {
    id: "mars",
    label: "Mars gives drive and concentration",
    text: "The D24 adds a concentrated source of strength in exalted Mars, anchoring the Lagna and the 4th lordship with decisiveness.",
  },
  {
    id: "ninth",
    label: "9th is unconventional shape, not weakness",
    text: "Higher learning is the one facet that both charts independently read as complicated — an unconventional, self-directed shape rather than a deficit.",
  },
  {
    id: "jupiter",
    label: "Jupiter adds mild, maturing support",
    text: "Jupiter's D24 friend's sign and upachaya placement add a further, lesser positive that matures over time.",
  },
];

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : color;
}

export function D24EducationSynthesisWorkbench() {
  const [tab, setTab] = useState<TabKey>("assemble");

  function reset() {
    setTab("assemble");
  }

  return (
    <div
      data-interactive="d24-education-synthesis-workbench"
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
            Full D24 education reading
          </p>
          <h2
            className="mt-1 text-xl sm:text-2xl"
            style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
          >
            Synthesis workbench
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            Assemble every D24 finding, compare it systematically with the D1, test whether the 9th-house convergence is
            genuine corroboration, and build a complete client-ready synthesis.
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

      <nav className="mb-5 flex flex-wrap gap-2" aria-label="D24 synthesis workbench sections">
        {TABS.map((t) => (
          <TabButton key={t.key} active={tab === t.key} onClick={() => setTab(t.key)}>
            {t.label}
          </TabButton>
        ))}
      </nav>

      {tab === "assemble" && <AssembleTab />}
      {tab === "compare" && <CompareTab />}
      {tab === "convergence" && <ConvergenceTab />}
      {tab === "synthesis" && <SynthesisTab />}
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

function AssembleTab() {
  const [included, setIncluded] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    D24_FINDINGS.forEach((f) => { initial[f.id] = true; });
    return initial;
  });

  function toggle(id: string) {
    setIncluded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const activeFindings = D24_FINDINGS.filter((f) => included[f.id]);

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.1</p>
        <h3
          className="mt-1 text-lg"
          style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
        >
          Assemble the complete D24 picture
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Toggle each finding on or off and watch the synthesis build. A full reading uses every piece, not only the
          strongest ones.
        </p>

        <div className="mt-4 space-y-2">
          {D24_FINDINGS.map((f) => {
            const on = included[f.id];
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => toggle(f.id)}
                className="w-full rounded-lg p-3 text-left"
                style={{
                  background: on ? wash(f.color, "10") : SURFACE_2,
                  border: `1px solid ${on ? f.color : HAIRLINE}`,
                  opacity: on ? 1 : 0.7,
                }}
              >
                <div className="flex items-center gap-2">
                  {on ? <CheckCircle2 size={16} style={{ color: f.color }} aria-hidden="true" /> : <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${HAIRLINE}` }} />}
                  <span className="text-sm" style={{ color: on ? f.color : INK_MUTED, fontWeight: 600 }}>{f.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        <AssembleSvg />
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <Layers size={18} style={{ color: GOLD }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>Running D24 synthesis</p>
        </div>
        {activeFindings.length === 0 ? (
          <p className="m-0 mt-3 text-sm" style={{ color: INK_MUTED }}>Select at least one finding to begin.</p>
        ) : (
          <ul className="m-0 mt-3 list-disc space-y-2 pl-5 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            {activeFindings.map((f) => (
              <li key={f.id}>{f.text}</li>
            ))}
          </ul>
        )}
        <div className="mt-4 rounded-lg p-3" style={{ background: wash(GOLD, "10"), border: `1px solid ${wash(GOLD, "55")}` }}>
          <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            <strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>D24 headline:</strong>{" "}
            {activeFindings.length >= D24_FINDINGS.length
              ? "Real, concentrated strength overall; the 9th is the one genuinely mixed facet."
              : "Add more findings to see the full D24 picture."}
          </p>
        </div>
      </aside>
    </div>
  );
}

function CompareTab() {
  const [selected, setSelected] = useState<string | null>("9th (higher/dharma)");
  const current = COMPARISONS.find((c) => c.facet === selected);

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.3</p>
        <h3
          className="mt-1 text-lg"
          style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
        >
          D1 versus D24, side by side
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Click a row to inspect the relationship. Notice that the 9th is the only facet where the two charts converge on
          complication rather than simply confirming strength.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                <th className="py-2 pr-3 font-medium" style={{ color: INK_MUTED, fontWeight: 600 }}>Facet</th>
                <th className="py-2 pr-3 font-medium" style={{ color: INK_MUTED, fontWeight: 600 }}>D1 finding</th>
                <th className="py-2 pr-3 font-medium" style={{ color: INK_MUTED, fontWeight: 600 }}>D24 finding</th>
                <th className="py-2 font-medium" style={{ color: INK_MUTED, fontWeight: 600 }}>Relationship</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISONS.map((c) => (
                <tr
                  key={c.facet}
                  onClick={() => setSelected(c.facet)}
                  style={{ borderBottom: `1px solid ${HAIRLINE}`, cursor: "pointer", background: selected === c.facet ? wash(toneColor(c.tone), "10") : "transparent" }}
                >
                  <td className="py-2 pr-3" style={{ color: INK_PRIMARY, fontWeight: 600 }}>{c.facet}</td>
                  <td className="py-2 pr-3" style={{ color: INK_SECONDARY }}>{c.d1}</td>
                  <td className="py-2 pr-3" style={{ color: INK_SECONDARY }}>{c.d24}</td>
                  <td className="py-2" style={{ color: toneColor(c.tone), fontWeight: 500 }}>{c.relationship}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {current && (
          <div className="mt-4 rounded-lg p-3" style={{ background: wash(toneColor(current.tone), "10"), border: `1px solid ${wash(toneColor(current.tone), "55")}` }}>
            <p className="m-0 text-sm" style={{ color: toneColor(current.tone), fontWeight: 600 }}>{current.facet} — {current.relationship}</p>
            <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              {current.tone === "confirm" && "Both charts agree on a simple, strong finding."}
              {current.tone === "converge" && "Two independent mechanisms point to the same directional conclusion: the 9th is complicated, not weak."}
              {current.tone === "different" && "The D24's structural signature is its own: Mars's concentrated strength, not a forced echo of the D1 Sarasvatī yoga."}
            </p>
          </div>
        )}
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <ArrowLeftRight size={18} style={{ color: GOLD }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>Comparison discipline</p>
        </div>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          A good comparison names both agreement and divergence. Here, the 4th and 5th confirm; the 9th converges on
          complication; the overall structural signatures differ in kind.
        </p>
        <CompareSvg />
      </aside>
    </div>
  );
}

function ConvergenceTab() {
  const [judgments, setJudgments] = useState<Record<string, boolean | null>>({});

  function judge(id: string, answer: boolean) {
    setJudgments((prev) => ({ ...prev, [id]: answer }));
  }

  const allCorrect = useMemo(() => {
    return CONVERGENCE_QUIZ.every((q) => judgments[q.id] === q.answer);
  }, [judgments]);

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.4 & §6</p>
        <h3
          className="mt-1 text-lg"
          style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
        >
          Is the 9th-house convergence real corroboration?
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          The D1 finds complication through Ketu&apos;s occupant nature. The D24 finds it through Mercury&apos;s
          sign-lord friendship. Two different procedures, one direction — genuine corroboration, not confirmation bias.
        </p>

        <ConvergenceSvg />

        <div className="mt-4 space-y-3">
          {CONVERGENCE_QUIZ.map((item) => {
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
          <ShieldCheck size={18} style={{ color: allCorrect ? GREEN : GOLD }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: allCorrect ? GREEN : GOLD, fontWeight: 600 }}>
            {allCorrect ? "Independence verified" : "Test for independence"}
          </p>
        </div>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          The key question is not &quot;do the conclusions match?&quot; but &quot;were the derivations independent?&quot;
          Answer all four correctly to confirm the corroboration standard.
        </p>
        <div className="mt-3 rounded-lg p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            <strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>D1 path:</strong> Ketu as occupant → unconventional.
          </p>
          <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            <strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>D24 path:</strong> Mercury-Moon enemy → sign-afflicted lord.
          </p>
        </div>
      </aside>
    </div>
  );
}

function SynthesisTab() {
  const [included, setIncluded] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    SYNTHESIS_PIECES.forEach((p) => { initial[p.id] = true; });
    return initial;
  });
  const [shapeNotWeakness, setShapeNotWeakness] = useState(true);

  function toggle(id: string) {
    setIncluded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const active = SYNTHESIS_PIECES.filter((p) => included[p.id]);

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§6</p>
        <h3
          className="mt-1 text-lg"
          style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
        >
          Build the client-ready synthesis
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Select the pieces to include and keep the 9th framed as an unconventional shape, not a weakness.
        </p>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {SYNTHESIS_PIECES.map((p) => {
            const on = included[p.id];
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => toggle(p.id)}
                className="rounded-lg p-3 text-left text-sm"
                style={{
                  background: on ? wash(GOLD, "10") : SURFACE_2,
                  border: `1px solid ${on ? GOLD : HAIRLINE}`,
                  color: on ? INK_PRIMARY : INK_SECONDARY,
                  fontWeight: on ? 500 : 400,
                }}
              >
                {on ? <CheckCircle2 size={14} style={{ color: GOLD, marginRight: 6 }} aria-hidden="true" /> : null}
                {p.label}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={shapeNotWeakness}
            onClick={() => setShapeNotWeakness(true)}
            className="rounded-lg px-3 py-2 text-sm"
            style={{
              background: shapeNotWeakness ? GREEN : SURFACE,
              border: `1px solid ${shapeNotWeakness ? GREEN : HAIRLINE}`,
              color: shapeNotWeakness ? "#fff" : INK_SECONDARY,
              fontWeight: 500,
            }}
          >
            Shape, not weakness
          </button>
          <button
            type="button"
            aria-pressed={!shapeNotWeakness}
            onClick={() => setShapeNotWeakness(false)}
            className="rounded-lg px-3 py-2 text-sm"
            style={{
              background: !shapeNotWeakness ? VERMILION : SURFACE,
              border: `1px solid ${!shapeNotWeakness ? VERMILION : HAIRLINE}`,
              color: !shapeNotWeakness ? "#fff" : INK_SECONDARY,
              fontWeight: 500,
            }}
          >
            Collapse to weakness
          </button>
        </div>

        {!shapeNotWeakness && (
          <div className="mt-3 rounded-lg p-3" style={{ background: wash(VERMILION, "10"), border: `1px solid ${wash(VERMILION, "55")}` }}>
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} style={{ color: VERMILION }} aria-hidden="true" />
              <p className="m-0 text-sm" style={{ color: VERMILION, fontWeight: 600 }}>Nuance lost</p>
            </div>
            <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              Calling the 9th simply &quot;weak&quot; or &quot;difficult&quot; flattens the reading. The lesson&apos;s accurate framing
              is an unconventional, self-directed path.
            </p>
          </div>
        )}
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <Sparkles size={18} style={{ color: GOLD }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>Client-ready answer</p>
        </div>
        <div className="mt-3 rounded-lg p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-sm" style={{ color: INK_PRIMARY, lineHeight: 1.65 }}>
            {active.length === 0
              ? "Select synthesis pieces to build the final answer."
              : buildSynthesis(active, shapeNotWeakness)}
          </p>
        </div>
        <div className="mt-3 rounded-lg p-3" style={{ background: wash(GOLD, "10"), border: `1px solid ${wash(GOLD, "55")}` }}>
          <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            <strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>Overall verdict:</strong> real, substantial,
            effort-realised capability throughout, with higher learning expected to look unconventional rather than
            smooth.
          </p>
        </div>
      </aside>
    </div>
  );
}

function buildSynthesis(active: typeof SYNTHESIS_PIECES, shapeNotWeakness: boolean) {
  const sentences = active.map((p) => p.text);
  const closing = shapeNotWeakness
    ? "Higher learning specifically is the area most likely to take a genuinely unconventional, self-directed shape — a feature to plan for, not a deficit to fear."
    : "Higher learning is the weakest area.";
  return `${sentences.join(" ")} ${closing}`;
}

function toneColor(tone: string) {
  if (tone === "confirm") return GREEN;
  if (tone === "converge") return GOLD;
  if (tone === "different") return BLUE;
  return INK_MUTED;
}

function AssembleSvg() {
  return (
    <svg viewBox="0 0 560 170" role="img" aria-label="D24 findings assemble into a synthesis" style={{ width: "100%", maxHeight: 180, margin: "1rem auto 0", display: "block" }}>
      <rect x="20" y="20" width="520" height="130" rx="8" fill={`${GOLD}0F`} stroke={HAIRLINE} />
      <circle cx="85" cy="70" r="28" fill={`${CORAL}22`} stroke={CORAL} strokeWidth="3" />
      <text x="85" y="65" textAnchor="middle" fill={CORAL} fontSize="11" fontWeight={600}>Lagna</text>
      <text x="85" y="78" textAnchor="middle" fill={INK_PRIMARY} fontSize="10" fontWeight={600}>Mars</text>

      <circle cx="200" cy="70" r="28" fill={`${CORAL}22`} stroke={CORAL} strokeWidth="3" />
      <text x="200" y="65" textAnchor="middle" fill={CORAL} fontSize="11" fontWeight={600}>4th</text>
      <text x="200" y="78" textAnchor="middle" fill={INK_PRIMARY} fontSize="10" fontWeight={600}>Mars</text>

      <circle cx="315" cy="70" r="28" fill={`${BLUE}22`} stroke={BLUE} strokeWidth="3" />
      <text x="315" y="65" textAnchor="middle" fill={BLUE} fontSize="11" fontWeight={600}>5th</text>
      <text x="315" y="78" textAnchor="middle" fill={INK_PRIMARY} fontSize="10" fontWeight={600}>Venus</text>

      <circle cx="430" cy="70" r="28" fill={`${GREEN}22`} stroke={GREEN} strokeWidth="3" />
      <text x="430" y="65" textAnchor="middle" fill={GREEN} fontSize="11" fontWeight={600}>9th</text>
      <text x="430" y="78" textAnchor="middle" fill={INK_PRIMARY} fontSize="10" fontWeight={600}>Mercury</text>

      <path d="M 113 70 L 172 70" stroke={HAIRLINE} strokeWidth="2" />
      <path d="M 228 70 L 287 70" stroke={HAIRLINE} strokeWidth="2" />
      <path d="M 343 70 L 402 70" stroke={HAIRLINE} strokeWidth="2" />

      <text x="280" y="128" textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight={600}>Each finding is read in its own terms, then assembled</text>
    </svg>
  );
}

function CompareSvg() {
  return (
    <svg viewBox="0 0 320 180" role="img" aria-label="D1 and D24 comparison with agreement and divergence" style={{ width: "100%", maxHeight: 200, margin: "1rem auto 0", display: "block" }}>
      <rect x="20" y="20" width="120" height="130" rx="8" fill={`${GREEN}0F`} stroke={HAIRLINE} />
      <rect x="180" y="20" width="120" height="130" rx="8" fill={`${GOLD}0F`} stroke={HAIRLINE} />

      <text x="80" y="48" textAnchor="middle" fill={INK_PRIMARY} fontSize="14" fontWeight={600}>D1</text>
      <text x="240" y="48" textAnchor="middle" fill={INK_PRIMARY} fontSize="14" fontWeight={600}>D24</text>

      <circle cx="80" cy="82" r="22" fill={`${GREEN}18`} stroke={GREEN} strokeWidth="3" />
      <text x="80" y="88" textAnchor="middle" fill={GREEN} fontSize="11" fontWeight={600}>4-5 strong</text>

      <circle cx="240" cy="82" r="22" fill={`${GREEN}18`} stroke={GREEN} strokeWidth="3" />
      <text x="240" y="88" textAnchor="middle" fill={GREEN} fontSize="11" fontWeight={600}>4-5 strong</text>

      <circle cx="80" cy="126" r="22" fill={`${GOLD}18`} stroke={GOLD} strokeWidth="3" />
      <text x="80" y="131" textAnchor="middle" fill={GOLD} fontSize="10" fontWeight={600}>9th Ketu</text>

      <circle cx="240" cy="126" r="22" fill={`${GOLD}18`} stroke={GOLD} strokeWidth="3" />
      <text x="240" y="131" textAnchor="middle" fill={GOLD} fontSize="10" fontWeight={600}>9th Mercury</text>

      <path d="M 102 82 C 130 82, 170 82, 198 82" stroke={GREEN} strokeWidth="3" />
      <text x="150" y="74" textAnchor="middle" fill={GREEN} fontSize="10" fontWeight={600}>confirms</text>

      <path d="M 102 126 C 130 110, 170 110, 198 126" fill="none" stroke={GOLD} strokeWidth="3" />
      <text x="150" y="104" textAnchor="middle" fill={GOLD} fontSize="10" fontWeight={600}>converges</text>
    </svg>
  );
}

function ConvergenceSvg() {
  return (
    <svg viewBox="0 0 560 180" role="img" aria-label="Two independent paths converging on the 9th house conclusion" style={{ width: "100%", maxHeight: 200, margin: "1rem auto 0", display: "block" }}>
      <rect x="20" y="20" width="520" height="140" rx="8" fill={`${GOLD}0F`} stroke={HAIRLINE} />

      <circle cx="120" cy="75" r="38" fill={`${SAFFRON}18`} stroke={SAFFRON} strokeWidth="3" />
      <text x="120" y="70" textAnchor="middle" fill={SAFFRON} fontSize="12" fontWeight={600}>D1 9th</text>
      <text x="120" y="86" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight={600}>Ketu occupant</text>

      <circle cx="440" cy="75" r="38" fill={`${GREEN}18`} stroke={GREEN} strokeWidth="3" />
      <text x="440" y="70" textAnchor="middle" fill={GREEN} fontSize="12" fontWeight={600}>D24 9th</text>
      <text x="440" y="86" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight={600}>Mercury enemy</text>

      <path d="M 158 75 C 240 40, 320 40, 402 75" fill="none" stroke={GOLD} strokeWidth="4" strokeLinecap="round" />

      <rect x="220" y="105" width="120" height="36" rx="6" fill={`${GOLD}22`} stroke={GOLD} strokeWidth="2" />
      <text x="280" y="122" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight={600}>9th = unconventional</text>
      <text x="280" y="135" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight={600}>shape, not weakness</text>

      <text x="280" y="158" textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight={600}>Independent paths → one confirmed direction</text>
    </svg>
  );
}
