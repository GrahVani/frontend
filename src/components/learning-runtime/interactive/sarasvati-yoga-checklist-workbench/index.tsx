"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  BookOpen,
  CheckCircle2,
  GraduationCap,
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
const SAFFRON = grahas.guru.primary;
const BLUE = grahas.shukra.primary;

type TabKey = "checklist" | "friendship" | "related" | "verdict";

const TABS: { key: TabKey; label: string }[] = [
  { key: "checklist", label: "Sarasvatī checklist" },
  { key: "friendship", label: "Friendship misconception" },
  { key: "related", label: "Related yogas" },
  { key: "verdict", label: "Final verdict" },
];

const PLANET_CHECKS = [
  {
    planet: "Mercury",
    color: GREEN,
    sign: "Virgo",
    house: 1,
    houseClass: "1st — kendra and trikoṇa",
    debilitated: false,
    dignity: "own sign + exact exaltation",
  },
  {
    planet: "Jupiter",
    color: SAFFRON,
    sign: "Pisces",
    house: 7,
    houseClass: "7th — kendra",
    debilitated: false,
    dignity: "own sign",
    jupiterCheck: "kendra-placed AND own-signed",
  },
  {
    planet: "Venus",
    color: BLUE,
    sign: "Libra",
    house: 2,
    houseClass: "2nd house — explicit qualifying category",
    debilitated: false,
    dignity: "own sign",
  },
];

const FRIENDSHIP_GRID: Record<string, Record<string, string>> = {
  Mercury: { Jupiter: "N", Venus: "F" },
  Jupiter: { Mercury: "E", Venus: "E" },
  Venus: { Mercury: "F", Jupiter: "N" },
};

const FRIENDSHIP_QUIZ = [
  {
    id: "f1",
    statement: "Sarasvatī yoga requires Mercury, Jupiter, and Venus to be mutually friendly.",
    answer: false,
    rationale: "The yoga checks each planet's own house-class and dignity, not mutual friendship.",
  },
  {
    id: "f2",
    statement: "In Chart E1, Jupiter treats both Mercury and Venus as enemies, yet the yoga is still fully formed.",
    answer: true,
    rationale: "Jupiter's one-way enmity is a relational fact; the yoga is a positional-and-dignity convergence.",
  },
];

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : color;
}

export function SarasvatiYogaChecklistWorkbench() {
  const [tab, setTab] = useState<TabKey>("checklist");

  function reset() {
    setTab("checklist");
  }

  return (
    <div
      data-interactive="sarasvati-yoga-checklist-workbench"
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
            Sarasvatī yoga
          </p>
          <h2
            className="mt-1 text-xl sm:text-2xl"
            style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
          >
            Yoga-condition verifier
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            Verify Chart E1&apos;s Sarasvatī yoga point by point. Check each planet&apos;s house-class and dignity,
            separate the friendship misconception, and honestly check the related yogas.
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

      <nav className="mb-5 flex flex-wrap gap-2" aria-label="Sarasvati yoga verifier sections">
        {TABS.map((t) => (
          <TabButton key={t.key} active={tab === t.key} onClick={() => setTab(t.key)}>
            {t.label}
          </TabButton>
        ))}
      </nav>

      {tab === "checklist" && <ChecklistTab />}
      {tab === "friendship" && <FriendshipTab />}
      {tab === "related" && <RelatedTab />}
      {tab === "verdict" && <VerdictTab />}
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

function ChecklistTab() {
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>({});

  function toggle(key: string) {
    setConfirmed((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const allConfirmed = useMemo(() => {
    const keys = [
      "mercury-house", "mercury-deb", "mercury-dignity",
      "jupiter-house", "jupiter-deb", "jupiter-dignity", "jupiter-strong",
      "venus-house", "venus-deb", "venus-dignity",
    ];
    return keys.every((k) => confirmed[k]);
  }, [confirmed]);

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.1 & §4.4</p>
        <h3
          className="mt-1 text-lg"
          style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
        >
          The full classical condition
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Mercury, Jupiter, and Venus must each occupy a kendra, trikoṇa, or the 2nd house; none may be debilitated;
          Jupiter must be specifically strong. Click each criterion to verify it for Chart E1.
        </p>

        <div className="mt-4 space-y-3">
          {PLANET_CHECKS.map((p) => (
            <div key={p.planet} className="rounded-lg p-3" style={{ background: wash(p.color, "10"), border: `1px solid ${wash(p.color, "55")}` }}>
              <div className="flex items-center gap-2">
                <span className="text-sm" style={{ color: p.color, fontWeight: 600 }}>{p.planet}</span>
                <span className="text-sm" style={{ color: INK_MUTED }}>{p.sign}, house {p.house}</span>
              </div>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <CheckItem label={p.houseClass} confirmed={confirmed[`${p.planet.toLowerCase()}-house`]} onToggle={() => toggle(`${p.planet.toLowerCase()}-house`)} color={p.color} />
                <CheckItem label={p.debilitated ? "Debilitated" : "Not debilitated"} confirmed={confirmed[`${p.planet.toLowerCase()}-deb`]} onToggle={() => toggle(`${p.planet.toLowerCase()}-deb`)} color={p.color} />
                <CheckItem label={p.dignity} confirmed={confirmed[`${p.planet.toLowerCase()}-dignity`]} onToggle={() => toggle(`${p.planet.toLowerCase()}-dignity`)} color={p.color} />
                {p.jupiterCheck && (
                  <CheckItem label={`Jupiter strong: ${p.jupiterCheck}`} confirmed={confirmed["jupiter-strong"]} onToggle={() => toggle("jupiter-strong")} color={p.color} />
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} style={{ color: allConfirmed ? GREEN : GOLD }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: allConfirmed ? GREEN : GOLD, fontWeight: 600 }}>
            {allConfirmed ? "All criteria verified" : "Verify every criterion"}
          </p>
        </div>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          The yoga is not a vague impression; it is a checklist. Confirm each item before declaring the yoga formed.
        </p>
        <YogaSvg />
      </aside>
    </div>
  );
}

function CheckItem({ label, confirmed, onToggle, color }: { label: string; confirmed: boolean; onToggle: () => void; color: string }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center gap-2 rounded-lg p-2 text-left text-sm"
      style={{
        background: confirmed ? wash(color, "20") : SURFACE,
        border: `1px solid ${confirmed ? color : HAIRLINE}`,
        color: confirmed ? INK_PRIMARY : INK_SECONDARY,
        fontWeight: confirmed ? 500 : 400,
      }}
    >
      {confirmed ? <CheckCircle2 size={16} style={{ color }} aria-hidden="true" /> : <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${HAIRLINE}` }} />}
      {label}
    </button>
  );
}

function FriendshipTab() {
  const [judgments, setJudgments] = useState<Record<string, boolean | null>>({});

  function judge(id: string, answer: boolean) {
    setJudgments((prev) => ({ ...prev, [id]: answer }));
  }

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.2</p>
        <h3
          className="mt-1 text-lg"
          style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
        >
          Mutual friendship is not required
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Jupiter classically treats Mercury and Venus as enemies. The yoga still forms because it checks each
          planet&apos;s own placement and dignity, never their relationships.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-center text-sm" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                <th className="py-2 px-2" style={{ color: INK_MUTED, fontWeight: 600 }}>↓ \ →</th>
                <th className="py-2 px-2" style={{ color: GREEN, fontWeight: 600 }}>Mercury</th>
                <th className="py-2 px-2" style={{ color: SAFFRON, fontWeight: 600 }}>Jupiter</th>
                <th className="py-2 px-2" style={{ color: BLUE, fontWeight: 600 }}>Venus</th>
              </tr>
            </thead>
            <tbody>
              {["Mercury", "Jupiter", "Venus"].map((row) => (
                <tr key={row} style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                  <td className="py-2 px-2" style={{ color: INK_PRIMARY, fontWeight: 600 }}>{row}</td>
                  {["Mercury", "Jupiter", "Venus"].map((col) => {
                    const val = row === col ? "—" : FRIENDSHIP_GRID[row][col];
                    const color = val === "F" ? GREEN : val === "E" ? VERMILION : INK_SECONDARY;
                    return <td key={col} className="py-2 px-2" style={{ color, fontWeight: 600 }}>{val}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 space-y-3">
          {FRIENDSHIP_QUIZ.map((item) => {
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
          <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>Positional, not relational</p>
        </div>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          The Sarasvatī yoga asks: &quot;Is each planet well-placed and dignified?&quot; It never asks: &quot;Do they like each other?&quot;
          Those are two independent kinds of astrological fact.
        </p>
        <FriendshipSvg />
      </aside>
    </div>
  );
}

function RelatedTab() {
  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.3 & §4.4</p>
        <h3
          className="mt-1 text-lg"
          style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
        >
          Check related yogas honestly
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          A strong Sarasvatī yoga does not automatically grant other yogas. Each has its own specific condition.
        </p>

        <div className="mt-4 space-y-3">
          <RelatedCard
            title="Buddhāditya yoga"
            condition="Mercury and the Sun must occupy the same sign."
            check={[
              { label: "Sun sign", value: "Leo" },
              { label: "Mercury sign", value: "Virgo" },
            ]}
            present={false}
            reason="Different signs → Buddhāditya is not present."
          />
          <RelatedCard
            title="Gaja-Kesari yoga"
            condition="Jupiter must occupy a kendra counted from the Moon."
            check={[
              { label: "Moon sign", value: "Cancer (counted as 1)" },
              { label: "Jupiter sign", value: "Pisces (counted as 9)" },
            ]}
            present={false}
            reason="Pisces is the 9th from Cancer — a trikoṇa, not a kendra → Gaja-Kesari is not present."
          />
        </div>
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <Scale size={18} style={{ color: GOLD }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>No automatic entitlements</p>
        </div>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          Chart E1 has a clean, fully-formed Sarasvatī yoga and neither related yoga. This is a complete and accurate
          finding, not an incomplete one.
        </p>
        <RelatedSvg />
      </aside>
    </div>
  );
}

function RelatedCard({ title, condition, check, present, reason }: { title: string; condition: string; check: { label: string; value: string }[]; present: boolean; reason: string }) {
  return (
    <div className="rounded-lg p-3" style={{ background: wash(present ? GREEN : VERMILION, "10"), border: `1px solid ${wash(present ? GREEN : VERMILION, "55")}` }}>
      <div className="flex items-center gap-2">
        {present ? <CheckCircle2 size={18} style={{ color: GREEN }} aria-hidden="true" /> : <XCircle size={18} style={{ color: VERMILION }} aria-hidden="true" />}
        <p className="m-0 text-sm" style={{ color: present ? GREEN : VERMILION, fontWeight: 600 }}>{title}: {present ? "Present" : "Not present"}</p>
      </div>
      <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>{condition}</p>
      <div className="mt-2 grid gap-1 text-sm" style={{ color: INK_SECONDARY }}>
        {check.map((c) => (
          <p key={c.label} className="m-0"><span style={{ color: INK_MUTED }}>{c.label}:</span> {c.value}</p>
        ))}
      </div>
      <p className="m-0 mt-2 text-sm" style={{ color: present ? GREEN : VERMILION, lineHeight: 1.55 }}>{reason}</p>
    </div>
  );
}

function VerdictTab() {
  return (
    <div className="grid min-w-0 gap-4">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.4</p>
        <h3
          className="mt-1 text-lg"
          style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
        >
          Final verdict for Chart E1
        </h3>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <VerdictCard icon={<Sparkles size={18} />} color={GREEN} title="Mercury" detail="Virgo 1st, own + exalted" status="Passes" />
          <VerdictCard icon={<BookOpen size={18} />} color={SAFFRON} title="Jupiter" detail="Pisces 7th, own, strong" status="Passes" />
          <VerdictCard icon={<GraduationCap size={18} />} color={BLUE} title="Venus" detail="Libra 2nd, own" status="Passes" />
        </div>

        <div className="mt-4 rounded-lg p-3" style={{ background: wash(GREEN, "10"), border: `1px solid ${wash(GREEN, "55")}` }}>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} style={{ color: GREEN }} aria-hidden="true" />
            <p className="m-0 text-sm" style={{ color: GREEN, fontWeight: 600 }}>Sarasvatī yoga is fully and cleanly formed</p>
          </div>
          <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            All three planets independently satisfy the house-class and dignity conditions. Jupiter satisfies both of its
            own strength sub-conditions. Mutual friendship was never part of the check.
          </p>
        </div>

        <div className="mt-3 rounded-lg p-3" style={{ background: wash(GOLD, "10"), border: `1px solid ${wash(GOLD, "55")}` }}>
          <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            <strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>Related yogas:</strong> Buddhāditya not present
            (Sun and Mercury in different signs); Gaja-Kesari not present (Jupiter is 9th from the Moon, not a kendra).
            The chart&apos;s learning-yoga picture rests on Sarasvatī alone.
          </p>
        </div>
      </section>
    </div>
  );
}

function VerdictCard({ icon, color, title, detail, status }: { icon: ReactNode; color: string; title: string; detail: string; status: string }) {
  return (
    <div className="rounded-lg p-3" style={{ background: wash(color, "10"), border: `1px solid ${wash(color, "55")}` }}>
      <div className="flex items-center gap-2" style={{ color }}>
        {icon}
        <span className="text-sm" style={{ fontWeight: 600 }}>{title}</span>
      </div>
      <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY }}>{detail}</p>
      <p className="m-0 mt-1 text-sm" style={{ color: GREEN, fontWeight: 500 }}>{status}</p>
    </div>
  );
}

function YogaSvg() {
  return (
    <svg viewBox="0 0 320 180" role="img" aria-label="Mercury, Jupiter, and Venus each in qualifying houses with check marks" style={{ width: "100%", maxHeight: 200, margin: "1rem auto 0", display: "block" }}>
      <rect x="20" y="20" width="280" height="140" rx="8" fill={`${GOLD}0F`} stroke={HAIRLINE} />

      <circle cx="70" cy="80" r="28" fill={`${GREEN}22`} stroke={GREEN} strokeWidth="3" />
      <text x="70" y="76" textAnchor="middle" fill={GREEN} fontSize="11" fontWeight={600}>Mercury</text>
      <text x="70" y="90" textAnchor="middle" fill={INK_PRIMARY} fontSize="9" fontWeight={600}>Virgo 1</text>

      <circle cx="160" cy="55" r="28" fill={`${SAFFRON}22`} stroke={SAFFRON} strokeWidth="3" />
      <text x="160" y="51" textAnchor="middle" fill={SAFFRON} fontSize="11" fontWeight={600}>Jupiter</text>
      <text x="160" y="65" textAnchor="middle" fill={INK_PRIMARY} fontSize="9" fontWeight={600}>Pisces 7</text>

      <circle cx="250" cy="80" r="28" fill={`${BLUE}22`} stroke={BLUE} strokeWidth="3" />
      <text x="250" y="76" textAnchor="middle" fill={BLUE} fontSize="11" fontWeight={600}>Venus</text>
      <text x="250" y="90" textAnchor="middle" fill={INK_PRIMARY} fontSize="9" fontWeight={600}>Libra 2</text>

      <path d="M 95 70 L 132 60" stroke={HAIRLINE} strokeWidth="2" />
      <path d="M 188 60 L 225 70" stroke={HAIRLINE} strokeWidth="2" />
      <path d="M 95 90 L 225 90" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="4 3" />

      <text x="160" y="132" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight={600}>Each planet independently qualifies</text>
    </svg>
  );
}

function FriendshipSvg() {
  return (
    <svg viewBox="0 0 320 180" role="img" aria-label="Jupiter treats Mercury and Venus as enemies, but the yoga still forms" style={{ width: "100%", maxHeight: 200, margin: "1rem auto 0", display: "block" }}>
      <rect x="20" y="20" width="280" height="140" rx="8" fill={`${GOLD}0F`} stroke={HAIRLINE} />

      <circle cx="70" cy="80" r="24" fill={`${GREEN}18`} stroke={GREEN} strokeWidth="2" />
      <text x="70" y="85" textAnchor="middle" fill={GREEN} fontSize="11" fontWeight={600}>Mercury</text>

      <circle cx="160" cy="50" r="24" fill={`${SAFFRON}18`} stroke={SAFFRON} strokeWidth="2" />
      <text x="160" y="55" textAnchor="middle" fill={SAFFRON} fontSize="11" fontWeight={600}>Jupiter</text>

      <circle cx="250" cy="80" r="24" fill={`${BLUE}18`} stroke={BLUE} strokeWidth="2" />
      <text x="250" y="85" textAnchor="middle" fill={BLUE} fontSize="11" fontWeight={600}>Venus</text>

      <path d="M 90 70 L 138 58" stroke={VERMILION} strokeWidth="2" markerEnd="url(#arrow)" />
      <path d="M 182 58 L 230 70" stroke={VERMILION} strokeWidth="2" markerEnd="url(#arrow)" />
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M 0 0 L 6 3 L 0 6" fill={VERMILION} />
        </marker>
      </defs>

      <text x="160" y="120" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight={600}>Jupiter&apos;s enmity does not block the yoga</text>
    </svg>
  );
}

function RelatedSvg() {
  return (
    <svg viewBox="0 0 320 160" role="img" aria-label="Sarasvatī yoga confirmed; Buddhāditya and Gaja-Kesari each checked and rejected" style={{ width: "100%", maxHeight: 180, margin: "1rem auto 0", display: "block" }}>
      <rect x="20" y="20" width="280" height="120" rx="8" fill={`${GOLD}0F`} stroke={HAIRLINE} />

      <circle cx="70" cy="80" r="24" fill={`${GREEN}18`} stroke={GREEN} strokeWidth="2" />
      <text x="70" y="76" textAnchor="middle" fill={GREEN} fontSize="10" fontWeight={600}>Sarasvatī</text>
      <text x="70" y="88" textAnchor="middle" fill={GREEN} fontSize="9" fontWeight={600}>formed</text>

      <circle cx="160" cy="80" r="24" fill={`${VERMILION}10`} stroke={VERMILION} strokeWidth="2" />
      <text x="160" y="76" textAnchor="middle" fill={VERMILION} fontSize="10" fontWeight={600}>Buddhāditya</text>
      <text x="160" y="88" textAnchor="middle" fill={VERMILION} fontSize="9" fontWeight={600}>absent</text>

      <circle cx="250" cy="80" r="24" fill={`${VERMILION}10`} stroke={VERMILION} strokeWidth="2" />
      <text x="250" y="76" textAnchor="middle" fill={VERMILION} fontSize="10" fontWeight={600}>Gaja-Kesari</text>
      <text x="250" y="88" textAnchor="middle" fill={VERMILION} fontSize="9" fontWeight={600}>absent</text>

      <text x="160" y="128" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight={600}>Each yoga checked on its own terms</text>
    </svg>
  );
}
