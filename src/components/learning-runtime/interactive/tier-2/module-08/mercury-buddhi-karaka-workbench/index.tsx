"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  BookOpen,
  Calculator,
  CheckCircle2,
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

type TabKey = "roles" | "faculties" | "router" | "condition";

const TABS: { key: TabKey; label: string }[] = [
  { key: "roles", label: "Mercury's roles" },
  { key: "faculties", label: "Buddhi vs Jñāna" },
  { key: "router", label: "Question router" },
  { key: "condition", label: "Chart E1 condition" },
];

const ROLES = [
  { id: "buddhi", label: "Buddhi", detail: "intellect, reasoning, analysis", icon: <Sparkles size={16} /> },
  { id: "vac", label: "Vāc", detail: "speech, articulation, language", icon: <BookOpen size={16} /> },
  { id: "writing", label: "Writing", detail: "symbolic expression", icon: <BookOpen size={16} /> },
  { id: "math", label: "Mathematics", detail: "calculation, pattern recognition", icon: <Calculator size={16} /> },
  { id: "business", label: "Business", detail: "trade, negotiation, practical skill", icon: <Scale size={16} /> },
  { id: "fourth", label: "4th-house kāraka", detail: "secondary — education specifically", icon: <Home size={16} />, accent: GREEN },
  { id: "fifth", label: "5th-house kāraka", detail: "secondary — intellect specifically", icon: <Sparkles size={16} />, accent: GREEN },
];

const FACULTY_COMPARE = [
  { label: "Speed", mercury: "Fast, nimble", jupiter: "Slow, ripening" },
  { label: "Domain", mercury: "Processing and analysis", jupiter: "Meaning and wise judgment" },
  { label: "Activity", mercury: "Discrimination between options", jupiter: "Discrimination toward right action" },
  { label: "Risk", mercury: "Cleverness without wisdom", jupiter: "Wisdom without quickness" },
];

const ROUTER_CASES = [
  {
    id: "r1",
    prompt: "Is my child naturally quick with numbers or language?",
    answer: "mercury",
    reason: "This asks about the instrument of intellect itself — a buddhi-question.",
  },
  {
    id: "r2",
    prompt: "Will my child do well in a structured school environment?",
    answer: "house",
    reason: "This is a 4th-house domain question about institutional schooling, not raw intellect.",
  },
  {
    id: "r3",
    prompt: "Does this native have an analytical or a more intuitive mind?",
    answer: "mercury",
    reason: "The analytical/intuitive distinction is a faculty question, routed to Mercury and Jupiter respectively.",
  },
  {
    id: "r4",
    prompt: "Will formal higher study suit this person's life path?",
    answer: "house",
    reason: "Higher study as a life domain is a 9th-house question; Mercury is supporting information only.",
  },
];

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : color;
}

export function MercuryBuddhiKarakaWorkbench() {
  const [tab, setTab] = useState<TabKey>("roles");

  function reset() {
    setTab("roles");
  }

  return (
    <div
      data-interactive="mercury-buddhi-karaka-workbench"
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
            Mercury as intellect kāraka
          </p>
          <h2
            className="mt-1 text-xl sm:text-2xl"
            style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
          >
            Buddhi-kāraka workbench
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            Read Mercury&apos;s own condition for raw intellectual capacity. Distinguish buddhi from jñāna, route
            questions correctly, and check dignity, combustion, and chameleon conditioning on Chart E1.
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

      <nav className="mb-5 flex flex-wrap gap-2" aria-label="Mercury buddhi workbench sections">
        {TABS.map((t) => (
          <TabButton key={t.key} active={tab === t.key} onClick={() => setTab(t.key)}>
            {t.label}
          </TabButton>
        ))}
      </nav>

      {tab === "roles" && <RolesTab />}
      {tab === "faculties" && <FacultiesTab />}
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
  const [active, setActive] = useState<string | null>("buddhi");

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.1</p>
        <h3
          className="mt-1 text-lg"
          style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
        >
          Mercury&apos;s kāraka roles
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Mercury governs the fast, symbolic mind. For education specifically, it is a documented secondary kāraka of
          the 4th and 5th houses.
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
                  background: on ? wash(r.accent ?? GREEN, "10") : SURFACE_2,
                  border: `1px solid ${on ? (r.accent ?? GREEN) : HAIRLINE}`,
                }}
              >
                <div className="flex items-center gap-2" style={{ color: on ? (r.accent ?? GREEN) : INK_PRIMARY }}>
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
          <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>Where to use Mercury</p>
        </div>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          Mercury answers questions about the <em>instrument</em> — reasoning, speech, calculation, speed of mind. It
          supports, but does not replace, readings of the 4th, 5th, and 9th houses.
        </p>
        <RolesSvg />
      </aside>
    </div>
  );
}

function FacultiesTab() {
  return (
    <div className="grid min-w-0 gap-4">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.2</p>
        <h3
          className="mt-1 text-lg"
          style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
        >
          Buddhi and jñāna are different faculties
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Mercury owns the processing mind. Jupiter owns meaning-making and wise judgment. A chart can excel in one and
          be modest in the other.
        </p>

        <FacultySvg />

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                <th className="py-2 pr-3 font-medium" style={{ color: INK_MUTED, fontWeight: 600 }}>Dimension</th>
                <th className="py-2 pr-3 font-medium" style={{ color: GREEN, fontWeight: 600 }}>Mercury — buddhi</th>
                <th className="py-2 font-medium" style={{ color: SAFFRON, fontWeight: 600 }}>Jupiter — jñāna</th>
              </tr>
            </thead>
            <tbody>
              {FACULTY_COMPARE.map((row) => (
                <tr key={row.label} style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                  <td className="py-2 pr-3" style={{ color: INK_PRIMARY, fontWeight: 500 }}>{row.label}</td>
                  <td className="py-2 pr-3" style={{ color: INK_SECONDARY }}>{row.mercury}</td>
                  <td className="py-2" style={{ color: INK_SECONDARY }}>{row.jupiter}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function RouterTab() {
  const [judgments, setJudgments] = useState<Record<string, "mercury" | "house" | null>>({});

  function judge(id: string, answer: "mercury" | "house") {
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
          Route the question to the right technique
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          A buddhi-question asks about the faculty itself; a house-question asks about an institutional or applied
          domain. Choose the first move for each prompt.
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
                  {(["mercury", "house"] as const).map((val) => {
                    const selected = judged === val;
                    const color = val === "mercury" ? GREEN : BLUE;
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
                        {val === "mercury" ? "Mercury first" : "House first"}
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
          <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>The routing rule</p>
        </div>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          Faculty = the native&apos;s own instrument of mind. Domain = the institutional or life area in which that
          instrument operates.
        </p>
        <div className="mt-3 rounded-lg p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            <strong style={{ color: GREEN, fontWeight: 600 }}>Mercury first</strong> when the question is about speed,
            analysis, language, or reasoning itself.
          </p>
          <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            <strong style={{ color: BLUE, fontWeight: 500 }}>House first</strong> when the question is about school,
            study, or higher learning as a life domain.
          </p>
        </div>
      </aside>
    </div>
  );
}

function ConditionTab() {
  const [combust, setCombust] = useState(false);

  const separation = combust ? 8 : 21;
  const combustStatus = separation <= 12;

  const dignityOk = true;
  const houseOk = true;
  const combustOk = !combustStatus;
  const chameleonOk = true;

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.4</p>
        <h3
          className="mt-1 text-lg"
          style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
        >
          Chart E1&apos;s Mercury, read directly
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Read the planet&apos;s own condition: sign and dignity, house, combustion, and chameleon conditioning. Toggle
          the combustion simulation to see how a close Sun would change the reading.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <ConditionCard title="Sign / dignity" value="Virgo 15°" detail="own sign + exact exaltation" ok={dignityOk} color={GREEN} />
          <ConditionCard title="House" value="Lagna (1st)" detail="angular, in the self-point" ok={houseOk} color={GREEN} />
          <ConditionCard title="Combustion" value={combustOk ? "Not combust" : "Combust"} detail={`Sun-Mercury separation ${separation}°`} ok={combustOk} color={combustOk ? GREEN : VERMILION} />
          <ConditionCard title="Chameleon conditioning" value="No co-occupant" detail="defaults to own benefic nature" ok={chameleonOk} color={GREEN} />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <span className="text-sm" style={{ color: INK_SECONDARY }}>Simulate combust Mercury:</span>
          <button
            type="button"
            aria-pressed={combust}
            onClick={() => setCombust((v) => !v)}
            className="rounded-lg px-3 py-2 text-sm"
            style={{
              background: combust ? VERMILION : SURFACE,
              border: `1px solid ${combust ? VERMILION : HAIRLINE}`,
              color: combust ? "#fff" : INK_SECONDARY,
              fontWeight: 500,
            }}
          >
            {combust ? "On (8° separation)" : "Off (21° separation)"}
          </button>
        </div>

        {combust && (
          <div className="mt-4 rounded-lg p-3" style={{ background: wash(VERMILION, "10"), border: `1px solid ${wash(VERMILION, "55")}` }}>
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} style={{ color: VERMILION }} aria-hidden="true" />
              <p className="m-0 text-sm" style={{ color: VERMILION, fontWeight: 600 }}>Combustion changes the output</p>
            </div>
            <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              Dignity is still strong, but a combust Mercury may express through authority, ego, or difficulty being
              heard. The raw capacity remains; its clear expression is compromised.
            </p>
          </div>
        )}
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} style={{ color: GREEN }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: GREEN, fontWeight: 600 }}>Reading for a buddhi-question</p>
        </div>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          {combust
            ? "Mercury is dignified but combust. Expect real analytical capacity that can be overshadowed by authority or self-assertion; expression needs deliberate cultivation."
            : "Mercury is exalted at its precise degree, angular, uncombust, and unmodified by difficult company. This is a top-tier condition for raw analytical capacity, language, mathematics, and precise reasoning."}
        </p>
        <ConditionSvg combust={combust} />
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
    <svg viewBox="0 0 320 170" role="img" aria-label="Mercury as a hub connecting intellect, speech, writing, math, business, and the 4th and 5th houses" style={{ width: "100%", maxHeight: 190, margin: "1rem auto 0", display: "block" }}>
      <rect x="20" y="20" width="280" height="130" rx="8" fill={`${GREEN}0F`} stroke={HAIRLINE} />
      <circle cx="160" cy="85" r="32" fill={`${GREEN}22`} stroke={GREEN} strokeWidth="3" />
      <text x="160" y="80" textAnchor="middle" fill={GREEN} fontSize="12" fontWeight={600}>Mercury</text>
      <text x="160" y="94" textAnchor="middle" fill={INK_PRIMARY} fontSize="10" fontWeight={600}>buddhi</text>

      <circle cx="60" cy="50" r="20" fill={SURFACE} stroke={HAIRLINE} strokeWidth="1.5" />
      <text x="60" y="54" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight={600}>vāc</text>

      <circle cx="60" cy="120" r="20" fill={SURFACE} stroke={HAIRLINE} strokeWidth="1.5" />
      <text x="60" y="124" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight={600}>math</text>

      <circle cx="260" cy="50" r="20" fill={SURFACE} stroke={HAIRLINE} strokeWidth="1.5" />
      <text x="260" y="54" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight={600}>4th</text>

      <circle cx="260" cy="120" r="20" fill={SURFACE} stroke={HAIRLINE} strokeWidth="1.5" />
      <text x="260" y="124" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight={600}>5th</text>

      <path d="M 78 55 L 128 74" stroke={HAIRLINE} strokeWidth="1.5" />
      <path d="M 78 115 L 128 96" stroke={HAIRLINE} strokeWidth="1.5" />
      <path d="M 242 55 L 192 74" stroke={HAIRLINE} strokeWidth="1.5" />
      <path d="M 242 115 L 192 96" stroke={HAIRLINE} strokeWidth="1.5" />

      <text x="160" y="152" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight={600}>General buddhi + two secondary house roles</text>
    </svg>
  );
}

function FacultySvg() {
  return (
    <svg viewBox="0 0 560 170" role="img" aria-label="Mercury buddhi and Jupiter jnana as complementary but distinct faculties" style={{ width: "100%", maxHeight: 190, margin: "1rem auto 0", display: "block" }}>
      <rect x="20" y="20" width="250" height="130" rx="8" fill={`${GREEN}0F`} stroke={HAIRLINE} />
      <rect x="290" y="20" width="250" height="130" rx="8" fill={`${SAFFRON}0F`} stroke={HAIRLINE} />

      <circle cx="145" cy="70" r="32" fill={`${GREEN}22`} stroke={GREEN} strokeWidth="3" />
      <text x="145" y="65" textAnchor="middle" fill={GREEN} fontSize="13" fontWeight={600}>Mercury</text>
      <text x="145" y="80" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight={600}>buddhi</text>

      <circle cx="415" cy="70" r="32" fill={`${SAFFRON}22`} stroke={SAFFRON} strokeWidth="3" />
      <text x="415" y="65" textAnchor="middle" fill={SAFFRON} fontSize="13" fontWeight={600}>Jupiter</text>
      <text x="415" y="80" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight={600}>jñāna</text>

      <path d="M 177 70 C 240 40, 320 40, 383 70" fill="none" stroke={GOLD} strokeWidth="3" strokeLinecap="round" strokeDasharray="6 5" />
      <text x="280" y="52" textAnchor="middle" fill={GOLD} fontSize="11" fontWeight={600}>complementary</text>

      <text x="145" y="124" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight={600}>processing · analysis</text>
      <text x="415" y="124" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight={600}>meaning · wisdom</text>
    </svg>
  );
}

function ConditionSvg({ combust }: { combust: boolean }) {
  return (
    <svg viewBox="0 0 320 160" role="img" aria-label={combust ? "Sun and Mercury close together, combustion active" : "Sun and Mercury separated, no combustion"} style={{ width: "100%", maxHeight: 180, margin: "1rem auto 0", display: "block" }}>
      <rect x="20" y="20" width="280" height="120" rx="8" fill={`${combust ? VERMILION : GREEN}0F`} stroke={HAIRLINE} />

      <circle cx={combust ? 130 : 80} cy="80" r="24" fill={`${GOLD}22`} stroke={GOLD} strokeWidth="3" />
      <text x={combust ? 130 : 80} y="86" textAnchor="middle" fill={GOLD} fontSize="12" fontWeight={600}>Sun</text>

      <circle cx={combust ? 190 : 240} cy="80" r="24" fill={`${GREEN}22`} stroke={combust ? VERMILION : GREEN} strokeWidth="3" />
      <text x={combust ? 190 : 240} y="86" textAnchor="middle" fill={combust ? VERMILION : GREEN} fontSize="12" fontWeight={600}>Mercury</text>

      {combust ? (
        <>
          <path d="M 154 80 L 166 80" stroke={VERMILION} strokeWidth="4" />
          <text x="160" y="130" textAnchor="middle" fill={VERMILION} fontSize="11" fontWeight={600}>8° separation — combustion zone</text>
        </>
      ) : (
        <>
          <path d="M 104 80 L 216 80" stroke={GREEN} strokeWidth="2" strokeDasharray="5 4" />
          <text x="160" y="130" textAnchor="middle" fill={GREEN} fontSize="11" fontWeight={600}>21° separation — clear of combustion</text>
        </>
      )}
    </svg>
  );
}
