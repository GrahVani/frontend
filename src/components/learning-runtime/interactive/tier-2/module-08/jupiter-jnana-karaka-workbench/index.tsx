"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import {
  BookOpen,
  CheckCircle2,
  Eye,
  GraduationCap,
  Home,
  MapPinned,
  RotateCcw,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
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
const SAFFRON = grahas.guru.primary;
const BLUE = grahas.shukra.primary;

type TabKey = "roles" | "structure" | "router" | "condition";

const TABS: { key: TabKey; label: string }[] = [
  { key: "roles", label: "Jupiter's roles" },
  { key: "structure", label: "Special-aspect structure" },
  { key: "router", label: "Question router" },
  { key: "condition", label: "Chart E1 condition" },
];

const ROLES = [
  { id: "jnana", label: "Jñāna", detail: "wisdom, meaning-making", icon: <Sparkles size={16} /> },
  { id: "dharma", label: "Dharma", detail: "righteousness, dharmic study", icon: <Scale size={16} /> },
  { id: "putra", label: "Putra", detail: "children, creative output", icon: <Home size={16} /> },
  { id: "dhana", label: "Dhana", detail: "wealth, abundance", icon: <Scale size={16} /> },
  { id: "guru", label: "Guru/teacher", detail: "mentor, guide figure", icon: <BookOpen size={16} /> },
  { id: "fifth", label: "5th-house kāraka", detail: "primary — children/intellect", icon: <Sparkles size={16} />, accent: SAFFRON },
  { id: "ninth", label: "9th-house kāraka", detail: "primary — dharma/higher learning", icon: <GraduationCap size={16} />, accent: SAFFRON },
];

const ROUTER_CASES = [
  {
    id: "r1",
    prompt: "Will this child value learning for its own sake?",
    answer: "jupiter",
    reason: "This is a jñāna-question about the wisdom-faculty itself.",
  },
  {
    id: "r2",
    prompt: "Does this native have an aptitude for philosophy or religious study?",
    answer: "jupiter",
    reason: "Dharmic and philosophical aptitude is Jupiter's domain.",
  },
  {
    id: "r3",
    prompt: "Will this child do well in a structured school environment?",
    answer: "house",
    reason: "This is a 4th-house institutional question; Jupiter is supporting information only.",
  },
  {
    id: "r4",
    prompt: "Is this person more analytical or more intuitive?",
    answer: "mercury",
    reason: "The analytical/intuitive distinction is a buddhi-question, answered by Mercury (and the Moon), not Jupiter directly.",
  },
];

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : color;
}

function aspectTargets(jupiterHouse: number) {
  return [5, 7, 9].map((offset) => (((jupiterHouse - 1 + offset - 1) % 12) + 1));
}

export function JupiterJnanaKarakaWorkbench() {
  const [tab, setTab] = useState<TabKey>("roles");

  function reset() {
    setTab("roles");
  }

  return (
    <div
      data-interactive="jupiter-jnana-karaka-workbench"
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
            Jupiter as wisdom kāraka
          </p>
          <h2
            className="mt-1 text-xl sm:text-2xl"
            style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
          >
            Jñāna-kāraka workbench
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            Read Jupiter&apos;s own condition for wisdom and dharma questions. Explore its special-aspect structure, route
            jñāna-questions correctly, and read Chart E1&apos;s Jupiter including its aspect pattern.
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

      <nav className="mb-5 flex flex-wrap gap-2" aria-label="Jupiter jnana workbench sections">
        {TABS.map((t) => (
          <TabButton key={t.key} active={tab === t.key} onClick={() => setTab(t.key)}>
            {t.label}
          </TabButton>
        ))}
      </nav>

      {tab === "roles" && <RolesTab />}
      {tab === "structure" && <StructureTab />}
      {tab === "router" && <RouterTab />}
      {tab === "condition" && <ConditionTab />}
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

function RolesTab() {
  const [active, setActive] = useState<string | null>("jnana");

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.1</p>
        <h3
          className="mt-1 text-lg"
          style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
        >
          Jupiter&apos;s kāraka roles
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Jupiter governs wisdom, dharma, and guidance. It is the <em>primary</em> naisargika kāraka of both the 5th and
          9th houses — the only planet with a primary role in this module&apos;s three-tier scheme.
        </p>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {ROLES.map((r) => {
            const on = active === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setActive(r.id)}
                className="rounded-lg p-3 text-left"
                style={{
                  background: on ? wash(r.accent ?? SAFFRON, "10") : SURFACE_2,
                  border: `1px solid ${on ? (r.accent ?? SAFFRON) : HAIRLINE}`,
                }}
              >
                <div className="flex items-center gap-2" style={{ color: on ? (r.accent ?? SAFFRON) : INK_PRIMARY }}>
                  {r.icon}
                  <span className="text-sm" style={{ fontWeight: 600 }}>{r.label}</span>
                </div>
                <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY }}>{r.detail}</p>
              </button>
            );
          })}
        </div>
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <MapPinned size={18} style={{ color: GOLD }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>Where to use Jupiter</p>
        </div>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          Jupiter answers questions about meaning, wisdom, dharma-orientation, teaching, and mentor figures. It is not
          the planet of raw analytical speed; that is Mercury&apos;s buddhi.
        </p>
        <RolesSvg />
      </aside>
    </div>
  );
}

function StructureTab() {
  const [jupiterHouse, setJupiterHouse] = useState(7);
  const targets = aspectTargets(jupiterHouse);

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.2</p>
        <h3
          className="mt-1 text-lg"
          style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
        >
          Special aspects: a structural, chart-independent design
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Jupiter aspects the 5th, 7th, and 9th houses counted from itself. This symmetric pattern is oriented toward the
          dharma-trine, but the specific houses it reaches must be freshly computed for each chart.
        </p>

        <div className="mt-4">
          <label className="block text-sm" style={{ color: INK_SECONDARY }}>
            Place Jupiter in house
            <select
              value={jupiterHouse}
              onChange={(e) => setJupiterHouse(Number(e.target.value))}
              className="ml-2 rounded-lg px-3 py-2 text-sm"
              style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                <option key={h} value={h}>House {h}</option>
              ))}
            </select>
          </label>
        </div>

        <AspectRing jupiterHouse={jupiterHouse} targets={targets} />

        <div className="mt-4 rounded-lg p-3" style={{ background: wash(SAFFRON, "10"), border: `1px solid ${wash(SAFFRON, "55")}` }}>
          <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            From house <strong style={{ color: SAFFRON, fontWeight: 600 }}>{jupiterHouse}</strong>, Jupiter aspects houses{" "}
            <strong style={{ color: SAFFRON, fontWeight: 600 }}>{targets.join(", ")}</strong>.
            {jupiterHouse === 7
              ? " In Chart E1, this lands the opposition aspect directly on the Lagna (house 1), connecting Jupiter to Mercury's exalted position."
              : " Compare this with Chart E1, where Jupiter sits in house 7."}
          </p>
        </div>
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <Eye size={18} style={{ color: GOLD }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>Pattern vs placement</p>
        </div>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          The <em>pattern</em> (5/7/9 from itself) is always true of Jupiter. The <em>houses reached</em> depend on where
          Jupiter is placed. Do not assume the aspects always land on the 4th, 5th, and 9th.
        </p>
        <div className="mt-3 rounded-lg p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            <strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>Chart E1:</strong> Jupiter in 7 → aspects 11, 1, 3.
            Only house 1 (Lagna) is an education-relevant point here.
          </p>
        </div>
      </aside>
    </div>
  );
}

function RouterTab() {
  const [judgments, setJudgments] = useState<Record<string, "jupiter" | "house" | "mercury" | null>>({});

  function judge(id: string, answer: "jupiter" | "house" | "mercury") {
    setJudgments((prev) => ({ ...prev, [id]: answer }));
  }

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.3 & §6</p>
        <h3
          className="mt-1 text-lg"
          style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
        >
          Route the question to the right significator
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          A jñāna-question targets wisdom or dharma; a buddhi-question targets analytical intellect; a house-question
          targets an institutional domain.
        </p>

        <div className="mt-4 space-y-3">
          {ROUTER_CASES.map((item) => {
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
                <p className="m-0 text-sm" style={{ color: INK_PRIMARY, lineHeight: 1.55 }}>{item.prompt}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(["jupiter", "mercury", "house"] as const).map((val) => {
                    const selected = judged === val;
                    const color = val === "jupiter" ? SAFFRON : val === "mercury" ? GREEN : BLUE;
                    return (
                      <button
                        key={val}
                        type="button"
                        disabled={judged !== undefined && judged !== null}
                        onClick={() => judge(item.id, val)}
                        className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm"
                        style={{
                          background: selected ? color : SURFACE,
                          border: `1px solid ${selected ? color : HAIRLINE}`,
                          color: selected ? "#fff" : INK_SECONDARY,
                          fontWeight: 500,
                          opacity: judged !== undefined && judged !== null && !selected ? 0.5 : 1,
                        }}
                      >
                        {selected && (correct ? <CheckCircle2 size={14} aria-hidden="true" /> : <XCircle size={14} aria-hidden="true" />)}
                        {val === "jupiter" ? "Jupiter first" : val === "mercury" ? "Mercury first" : "House first"}
                      </button>
                    );
                  })}
                </div>
                {judged !== undefined && judged !== null && (
                  <p className="m-0 mt-2 text-sm" style={{ color: correct ? GREEN : VERMILION, lineHeight: 1.55 }}>
                    {correct ? "Correct. " : "Not quite. "}{item.reason}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <Target size={18} style={{ color: GOLD }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>Routing guide</p>
        </div>
        <div className="mt-3 space-y-2 text-sm" style={{ color: INK_SECONDARY }}>
          <p className="m-0"><strong style={{ color: SAFFRON, fontWeight: 600 }}>Jupiter</strong> — wisdom, dharma, philosophy, mentors, meaning.</p>
          <p className="m-0"><strong style={{ color: GREEN, fontWeight: 600 }}>Mercury</strong> — analysis, language, numbers, speed of mind.</p>
          <p className="m-0"><strong style={{ color: BLUE, fontWeight: 500 }}>House</strong> — school, study, higher education as a life domain.</p>
        </div>
      </aside>
    </div>
  );
}

function ConditionTab() {
  const jupiterHouse = 7;
  const targets = aspectTargets(jupiterHouse);
  const dignityOk = true;
  const afflictionOk = true;

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.4</p>
        <h3
          className="mt-1 text-lg"
          style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
        >
          Chart E1&apos;s Jupiter, read directly
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Jupiter is own-signed in Pisces, placed in the 7th house, and its opposition aspect lands on the Lagna —
          directly connecting wisdom to the exalted Mercury.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <ConditionCard title="Sign / dignity" value="Pisces 6°" detail="own sign" ok={dignityOk} color={SAFFRON} />
          <ConditionCard title="House" value="7th house" detail="angular / relationship arena" ok={true} color={SAFFRON} />
          <ConditionCard title="Affliction check" value="Unafflicted" detail="not debilitated, combust, or badly associated" ok={afflictionOk} color={GREEN} />
          <ConditionCard title="Aspect pattern" value="Aspects 11, 1, 3" detail="opposition on Lagna connects to Mercury" ok={true} color={SAFFRON} />
        </div>

        <div className="mt-4 rounded-lg p-3" style={{ background: wash(SAFFRON, "10"), border: `1px solid ${wash(SAFFRON, "55")}` }}>
          <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            <strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>Reading for a jñāna-question:</strong> Jupiter gives a
            strong, dignified answer. Its gaze on the Lagna links wisdom to the chart&apos;s strongest intellectual point,
            suggesting that meaning-making and analytical skill work together rather than compete.
          </p>
        </div>
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} style={{ color: GREEN }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: GREEN, fontWeight: 600 }}>Aspect targets</p>
        </div>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          From house 7, Jupiter&apos;s 5th/7th/9th aspects land on houses 11, 1, and 3. The Lagna aspect is the
          chart-specific connection; houses 11 and 3 are not this module&apos;s 4th/5th/9th — reported accurately.
        </p>
        <AspectRing jupiterHouse={jupiterHouse} targets={targets} />
      </aside>
    </div>
  );
}

function ConditionCard({ title, value, detail, ok, color }: { title: string; value: string; detail: string; ok: boolean; color: string }) {
  return (
    <div className="rounded-lg p-3" style={{ background: wash(color, "10"), border: `1px solid ${wash(color, "55")}` }}>
      <div className="flex items-center justify-between">
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>{title}</p>
        {ok ? <CheckCircle2 size={16} style={{ color: GREEN }} aria-hidden="true" /> : <XCircle size={16} style={{ color: VERMILION }} aria-hidden="true" />}
      </div>
      <p className="m-0 mt-1 text-base" style={{ color: INK_PRIMARY, fontWeight: 600 }}>{value}</p>
      <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY }}>{detail}</p>
    </div>
  );
}

function RolesSvg() {
  return (
    <svg viewBox="0 0 320 170" role="img" aria-label="Jupiter as a hub connecting wisdom, dharma, children, wealth, and the 5th and 9th houses" style={{ width: "100%", maxHeight: 190, margin: "1rem auto 0", display: "block" }}>
      <rect x="20" y="20" width="280" height="130" rx="8" fill={`${SAFFRON}0F`} stroke={HAIRLINE} />
      <circle cx="160" cy="85" r="32" fill={`${SAFFRON}22`} stroke={SAFFRON} strokeWidth="3" />
      <text x="160" y="80" textAnchor="middle" fill={SAFFRON} fontSize="12" fontWeight={600}>Jupiter</text>
      <text x="160" y="94" textAnchor="middle" fill={INK_PRIMARY} fontSize="10" fontWeight={600}>jñāna</text>

      <circle cx="60" cy="50" r="20" fill={SURFACE} stroke={HAIRLINE} strokeWidth="1.5" />
      <text x="60" y="54" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight={600}>dharma</text>

      <circle cx="60" cy="120" r="20" fill={SURFACE} stroke={HAIRLINE} strokeWidth="1.5" />
      <text x="60" y="124" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight={600}>guru</text>

      <circle cx="260" cy="50" r="20" fill={SURFACE} stroke={HAIRLINE} strokeWidth="1.5" />
      <text x="260" y="54" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight={600}>5th</text>

      <circle cx="260" cy="120" r="20" fill={SURFACE} stroke={HAIRLINE} strokeWidth="1.5" />
      <text x="260" y="124" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight={600}>9th</text>

      <path d="M 78 55 L 128 74" stroke={HAIRLINE} strokeWidth="1.5" />
      <path d="M 78 115 L 128 96" stroke={HAIRLINE} strokeWidth="1.5" />
      <path d="M 242 55 L 192 74" stroke={HAIRLINE} strokeWidth="1.5" />
      <path d="M 242 115 L 192 96" stroke={HAIRLINE} strokeWidth="1.5" />

      <text x="160" y="152" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight={600}>Primary kāraka of the dharma-trine houses</text>
    </svg>
  );
}

function AspectRing({ jupiterHouse, targets }: { jupiterHouse: number; targets: number[] }) {
  const centerX = 160;
  const centerY = 140;
  const radius = 90;

  function housePos(house: number) {
    const angle = (house - 1) * 30 - 90; // start at top
    const rad = (angle * Math.PI) / 180;
    return { x: centerX + radius * Math.cos(rad), y: centerY + radius * Math.sin(rad) };
  }

  const jupiterPos = housePos(jupiterHouse);

  return (
    <svg viewBox="0 0 320 280" role="img" aria-label={`House ring showing Jupiter in house ${jupiterHouse} and its aspect targets`} style={{ width: "100%", maxHeight: 300, margin: "1rem auto 0", display: "block" }}>
      <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke={HAIRLINE} strokeWidth="2" />
      {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => {
        const pos = housePos(h);
        const isJupiter = h === jupiterHouse;
        const isTarget = targets.includes(h);
        return (
          <g key={h}>
            <circle cx={pos.x} cy={pos.y} r={isJupiter ? 18 : 14} fill={isJupiter ? SAFFRON : isTarget ? wash(SAFFRON, "30") : SURFACE} stroke={isJupiter || isTarget ? SAFFRON : HAIRLINE} strokeWidth={isJupiter ? 3 : 1.5} />
            <text x={pos.x} y={pos.y + 4} textAnchor="middle" fill={isJupiter ? "#fff" : isTarget ? SAFFRON : INK_SECONDARY} fontSize="12" fontWeight={600}>{h}</text>
          </g>
        );
      })}

      {targets.map((t) => {
        const targetPos = housePos(t);
        return (
          <g key={t}>
            <line x1={jupiterPos.x} y1={jupiterPos.y} x2={targetPos.x} y2={targetPos.y} stroke={SAFFRON} strokeWidth="2" strokeDasharray="4 3" opacity={0.7} />
          </g>
        );
      })}

      <text x={centerX} y={centerY} textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight={600}>Jupiter in {jupiterHouse}</text>
      <text x={centerX} y={centerY + 14} textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight={600}>aspects {targets.join(", ")}</text>
    </svg>
  );
}
