"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, GitCompare, HelpCircle, RotateCcw, Route } from "lucide-react";

type RegisterKey = "brothers" | "valour" | "land" | "profession" | "conflict";
type Strength = "strong" | "mixed" | "weak";

interface Scenario {
  key: string;
  question: string;
  register: RegisterKey;
  marsPreset: Strength;
  housePreset: Strength;
  teaching: string;
}

interface RegisterDef {
  key: RegisterKey;
  title: string;
  sanskrit: string;
  covers: string;
  houseSide: string;
  marsStrong: string;
  marsWeak: string;
  color: string;
}

const REGISTERS: RegisterDef[] = [
  {
    key: "brothers",
    title: "Brothers",
    sanskrit: "bhratr-karaka",
    covers: "Younger brother and sibling bond.",
    houseSide: "3rd house + 3rd lord",
    marsStrong: "Mars well-dignified and the 3rd is sound.",
    marsWeak: "Mars debilitated or the 3rd house/lord is afflicted.",
    color: "#C8412E",
  },
  {
    key: "valour",
    title: "Valour / Will",
    sanskrit: "parakrama-karaka",
    covers: "Courage, drive, the capacity to push through resistance.",
    houseSide: "3rd house + Lagna lord + 1st house",
    marsStrong: "Mars in own sign/exaltation or connected to courage houses.",
    marsWeak: "Mars weak, isolated, or cut off from action houses.",
    color: "#B88719",
  },
  {
    key: "land",
    title: "Land",
    sanskrit: "bhu-karaka",
    covers: "Land and property as a life theme.",
    houseSide: "4th house + 4th lord",
    marsStrong: "Mars unafflicted and supported by the 4th house.",
    marsWeak: "Mars debilitated, afflicting the 4th, or linked to dispute.",
    color: "#2F7D55",
  },
  {
    key: "profession",
    title: "Profession",
    sanskrit: "karma-register",
    covers: "Surgery, military, policing, engineering, athletics, cutting trades.",
    houseSide: "10th house; 6th for service; 8th for surgery",
    marsStrong: "Mars well-dignified in or aspecting the 10th/6th/8th constructively.",
    marsWeak: "Mars weak and isolated in difficult houses.",
    color: "#336CA8",
  },
  {
    key: "conflict",
    title: "Conflict",
    sanskrit: "yuddha-register",
    covers: "Fights, litigation, accidents, and misdirected aggression.",
    houseSide: "6th for conflict; 8th for crisis; 12th for loss",
    marsStrong: "Mars placed where conflict is constructive, such as a managed 6th.",
    marsWeak: "Mars weak in the 8th/12th or tied to Rahu-like volatility.",
    color: "#6B5AA8",
  },
];

const SCENARIOS: Scenario[] = [
  {
    key: "brother",
    question: "How is my younger brother doing?",
    register: "brothers",
    marsPreset: "strong",
    housePreset: "strong",
    teaching: "The client's words name the brother register. Confirm Mars with the 3rd house and 3rd lord.",
  },
  {
    key: "property",
    question: "Will I acquire property?",
    register: "land",
    marsPreset: "weak",
    housePreset: "mixed",
    teaching: "Land routes to Mars as bhu-karaka, then to the 4th house for the actual property event.",
  },
  {
    key: "courage",
    question: "Do I have the courage for this?",
    register: "valour",
    marsPreset: "mixed",
    housePreset: "strong",
    teaching: "Valour needs Mars, the 3rd house, the 1st house, and Lagna lord support.",
  },
  {
    key: "surgery",
    question: "Should I take the surgery residency?",
    register: "profession",
    marsPreset: "strong",
    housePreset: "mixed",
    teaching: "Surgery is a Mars profession, but the 10th and 8th decide whether it becomes the concrete path.",
  },
  {
    key: "fights",
    question: "Why do I keep getting into fights?",
    register: "conflict",
    marsPreset: "strong",
    housePreset: "weak",
    teaching: "A strong Mars can still be mis-aimed. For conflict, inspect the 6th, 8th, and 12th.",
  },
];

const STRENGTH_META: Record<Strength, { label: string; color: string; bg: string; score: number }> = {
  strong: { label: "Strong", color: "#2F7D55", bg: "#DDF1E7", score: 80 },
  mixed: { label: "Mixed", color: "#887A42", bg: "#F3EBC8", score: 52 },
  weak: { label: "Weak", color: "#A44135", bg: "#F7D9D5", score: 24 },
};

function registerByKey(key: RegisterKey) {
  return REGISTERS.find((item) => item.key === key) ?? REGISTERS[0];
}

export function KarakaRouter() {
  const [scenarioKey, setScenarioKey] = useState(SCENARIOS[0].key);
  const scenario = SCENARIOS.find((item) => item.key === scenarioKey) ?? SCENARIOS[0];
  const [marsStrength, setMarsStrength] = useState<Strength>(scenario.marsPreset);
  const [houseStrength, setHouseStrength] = useState<Strength>(scenario.housePreset);

  const activeRegister = registerByKey(scenario.register);
  const marsMeta = STRENGTH_META[marsStrength];
  const houseMeta = STRENGTH_META[houseStrength];

  const verdict = useMemo(() => {
    if (marsStrength === houseStrength) {
      return {
        title: `${houseMeta.label} agreement`,
        detail: "Planet-side and house-side agree, so the reading is straightforward.",
        color: houseMeta.color,
        bg: houseMeta.bg,
      };
    }
    if (houseStrength === "strong") {
      return {
        title: "House-side carries the event",
        detail: "Mars gives the disposition, but the house-side is more specific. Expect possibility with Mars-flavoured effort.",
        color: "#2F7D55",
        bg: "#DDF1E7",
      };
    }
    if (houseStrength === "weak") {
      return {
        title: "House-side blocks specifics",
        detail: "Even if Mars has force, the event-side is weak. Read this as drive without easy concrete result.",
        color: "#A44135",
        bg: "#F7D9D5",
      };
    }
    return {
      title: "Mixed house-side modifies Mars",
      detail: "The matter is possible but not clean. Read effort, delay, negotiation, or partial result.",
      color: "#887A42",
      bg: "#F3EBC8",
    };
  }, [houseMeta.bg, houseMeta.color, houseMeta.label, houseStrength, marsStrength]);

  const chooseScenario = (key: string) => {
    const next = SCENARIOS.find((item) => item.key === key) ?? SCENARIOS[0];
    setScenarioKey(next.key);
    setMarsStrength(next.marsPreset);
    setHouseStrength(next.housePreset);
  };

  return (
    <div
      data-interactive="karaka-router"
      className="w-full"
      style={{
        background: "var(--gl-surface-card, #FFF9F0)",
        border: "1px solid var(--gl-gold-hairline)",
        borderRadius: "16px",
        padding: "20px",
      }}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase" style={{ color: "var(--gl-ink-muted)", letterSpacing: "0.08em" }}>
            Karaka router
          </div>
          <h2 className="mt-1 text-xl font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
            Let the question choose Mars&apos;s register
          </h2>
          <p className="mt-1 max-w-2xl text-sm" style={{ color: "var(--gl-ink-secondary)", lineHeight: 1.55 }}>
            Pick a client question, then route it through register, Mars condition, and the house-side confirmation.
          </p>
        </div>
        <button
          type="button"
          onClick={() => chooseScenario(SCENARIOS[0].key)}
          className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold"
          style={{ background: "transparent", color: "var(--gl-ink-secondary)", border: "1px solid var(--gl-gold-hairline)" }}
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>

      <div className="mt-5 grid gap-2 md:grid-cols-5">
        {SCENARIOS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => chooseScenario(item.key)}
            aria-pressed={item.key === scenario.key}
            className="rounded-lg p-3 text-left text-xs font-semibold"
            style={{
              minHeight: "86px",
              background: item.key === scenario.key ? `${registerByKey(item.register).color}18` : "rgba(255,255,255,0.52)",
              color: "var(--gl-ink-primary)",
              border: `1px solid ${item.key === scenario.key ? registerByKey(item.register).color : "var(--gl-gold-hairline)"}`,
            }}
          >
            {item.question}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(280px,0.9fr)_minmax(0,1.1fr)]">
        <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.5)", border: "1px solid var(--gl-gold-hairline)" }}>
          <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
            <Route size={16} />
            Three-step route
          </div>
          <div className="mt-4 space-y-3">
            <StepCard
              number="1"
              title="Question names the register"
              body={scenario.question}
              accent={activeRegister.color}
            />
            <StepCard
              number="2"
              title="Read Mars for that register"
              body={`${activeRegister.title}: ${activeRegister.covers}`}
              accent={marsMeta.color}
            />
            <StepCard
              number="3"
              title="Confirm house-side"
              body={activeRegister.houseSide}
              accent={houseMeta.color}
            />
          </div>

          <div className="mt-4 rounded-xl p-4" style={{ background: `${activeRegister.color}12`, border: `1px solid ${activeRegister.color}40` }}>
            <div className="text-xs font-bold uppercase" style={{ color: activeRegister.color, letterSpacing: "0.08em" }}>
              Active register
            </div>
            <h3 className="mt-1 text-lg font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
              {activeRegister.title}
            </h3>
            <p className="mt-1 text-sm italic" style={{ color: "var(--gl-ink-muted)" }}>
              {activeRegister.sanskrit}
            </p>
            <p className="mt-2 text-sm" style={{ color: "var(--gl-ink-secondary)", lineHeight: 1.55 }}>
              {scenario.teaching}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <AssessmentPanel
              title="Mars condition"
              value={marsStrength}
              onChange={setMarsStrength}
              strongText={activeRegister.marsStrong}
              weakText={activeRegister.marsWeak}
            />
            <AssessmentPanel
              title="House-side"
              value={houseStrength}
              onChange={setHouseStrength}
              strongText={`Strong ${activeRegister.houseSide} confirms the concrete matter.`}
              weakText={`Weak ${activeRegister.houseSide} challenges the concrete matter.`}
            />
          </div>

          <div className="rounded-xl p-4" style={{ background: verdict.bg, border: `1px solid ${verdict.color}55` }}>
            <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: verdict.color }}>
              <GitCompare size={16} />
              Tie-breaker result
            </div>
            <h3 className="mt-2 text-lg font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
              {verdict.title}
            </h3>
            <p className="mt-1 text-sm" style={{ color: "var(--gl-ink-secondary)", lineHeight: 1.55 }}>
              {verdict.detail}
            </p>
          </div>

          <div className="rounded-xl p-4" style={{ background: "#FFFDF7", border: "1px solid var(--gl-gold-hairline)" }}>
            <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
              <HelpCircle size={16} />
              Why this matters
            </div>
            <p className="mt-2 text-sm" style={{ color: "var(--gl-ink-secondary)", lineHeight: 1.58 }}>
              One Mars can answer many questions, but not all at once. The question chooses the register; Mars gives the constitutional disposition; the house-side gives event specificity.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            {REGISTERS.slice(0, 3).map((item) => (
              <div key={item.key} className="rounded-lg p-3" style={{ background: `${item.color}12`, border: `1px solid ${item.color}40` }}>
                <div className="text-xs font-bold" style={{ color: item.color }}>
                  {item.title}
                </div>
                <div className="mt-1 text-xs" style={{ color: "var(--gl-ink-muted)", lineHeight: 1.45 }}>
                  {item.houseSide}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepCard({ number, title, body, accent }: { number: string; title: string; body: string; accent: string }) {
  return (
    <div className="flex gap-3 rounded-xl p-3" style={{ background: "#FFFDF7", border: "1px solid var(--gl-gold-hairline)" }}>
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold" style={{ background: accent, color: "#fff" }}>
        {number}
      </span>
      <div>
        <div className="text-sm font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
          {title}
        </div>
        <div className="mt-1 text-xs" style={{ color: "var(--gl-ink-muted)", lineHeight: 1.45 }}>
          {body}
        </div>
      </div>
    </div>
  );
}

function AssessmentPanel({
  title,
  value,
  onChange,
  strongText,
  weakText,
}: {
  title: string;
  value: Strength;
  onChange: (value: Strength) => void;
  strongText: string;
  weakText: string;
}) {
  const meta = STRENGTH_META[value];
  return (
    <div className="rounded-xl p-4" style={{ background: meta.bg, border: `1px solid ${meta.color}55` }}>
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
          {title}
        </div>
        <span className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-bold" style={{ background: "#fff", color: meta.color }}>
          <CheckCircle2 size={13} />
          {meta.label}
        </span>
      </div>
      <div className="mt-3 flex rounded-md" style={{ overflow: "hidden", border: `1px solid ${meta.color}44` }}>
        {(["strong", "mixed", "weak"] as Strength[]).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className="flex-1 px-2 py-2 text-xs font-semibold capitalize"
            style={{
              background: value === option ? STRENGTH_META[option].color : "#fff",
              color: value === option ? "#fff" : "var(--gl-ink-secondary)",
              borderRight: option === "weak" ? "none" : `1px solid ${meta.color}33`,
            }}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="mt-3 text-xs" style={{ color: "var(--gl-ink-secondary)", lineHeight: 1.5 }}>
        {value === "strong" ? strongText : value === "weak" ? weakText : "Mixed means possible, but not clean: look for effort, delay, partial support, or competing signals."}
      </div>
    </div>
  );
}
