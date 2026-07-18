"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Circle,
  Home,
  Info,
  RotateCcw,
  Star,
  Sun,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";

type Mode = "reference" | "candidate" | "mercury-jupiter" | "house-bala";
type LimbKey = "tithi" | "vara" | "nakshatra" | "yoga" | "karana";
type Category = "favoured" | "avoided" | "neutral";
type PlanetKey = "mercury" | "jupiter";

interface LimbData {
  label: string;
  favoured: string[];
  avoided: string[];
  notes?: string;
}

const PANCA_LIMBS: Record<LimbKey, LimbData> = {
  tithi: {
    label: "Tithi",
    favoured: ["Pūrṇā class (5th / 10th / 15th)", "Nandā class (1st / 6th / 11th)", "Bhadrā class (2nd / 7th / 12th)"],
    avoided: ["Riktā class (4th / 9th / 14th) — no exception"],
  },
  vara: {
    label: "Vāra",
    favoured: ["Wednesday — most-favoured (Mercury)", "Thursday — strongly-favoured (Jupiter)"],
    avoided: ["Tuesday (Mars)", "Saturday (Saturn) — limited manufacturing exception"],
    notes: "Monday / Sunday / Friday are neutral in this table.",
  },
  nakshatra: {
    label: "Nakṣatra",
    favoured: ["Hasta", "Puṣya", "Citrā", "Anurādhā — most-favoured"],
    avoided: ["Ugra class", "Tīkṣṇa class"],
  },
  yoga: {
    label: "Yoga",
    favoured: ["Siddhi (16) — most-favoured", "Sukarmā (7), Vṛddhi (11), Sādhya (22), Varīyān (18) — strongly-favoured"],
    avoided: ["Vyatīpāta (17)", "Vaidhṛti (27)"],
  },
  karana: {
    label: "Karaṇa",
    favoured: ["Vaṇija (6) — most-favoured", "Taitila and other favoured karaṇas"],
    avoided: ["Viṣṭi (Bhadrā-mukha)"],
  },
};

const FAV_TITHI = new Set(["Shukla Daśamī (Pūrṇā class)", "Pūrṇā tithi", "Nandā tithi", "Bhadrā tithi"]);
const AV_TITHI = new Set(["Riktā tithi"]);

const FAV_VARA = new Set(["Wednesday", "Thursday"]);
const AV_VARA = new Set(["Tuesday", "Saturday"]);

const FAV_NAK = new Set(["Hasta", "Puṣya", "Citrā", "Anurādhā"]);
const AV_NAK = new Set(["Ugra class", "Tīkṣṇa class"]);

const FAV_YOGA = new Set(["Siddhi", "Sukarmā", "Vṛddhi", "Sādhya", "Varīyān"]);
const AV_YOGA = new Set(["Vyatīpāta", "Vaidhṛti"]);

const FAV_KAR = new Set(["Vaṇija", "Taitila", "Bava", "Bālava", "Garaja"]);
const AV_KAR = new Set(["Viṣṭi"]);

const CANDIDATE_OPTIONS: Record<LimbKey, string[]> = {
  tithi: ["Shukla Daśamī (Pūrṇā class)", "Pūrṇā tithi", "Nandā tithi", "Bhadrā tithi", "Riktā tithi", "Other tithi"],
  vara: ["Wednesday", "Thursday", "Monday", "Friday", "Sunday", "Tuesday", "Saturday"],
  nakshatra: ["Hasta", "Puṣya", "Citrā", "Anurādhā", "Ugra class", "Tīkṣṇa class", "Other nakṣatra"],
  yoga: ["Siddhi", "Sukarmā", "Vṛddhi", "Sādhya", "Varīyān", "Vyatīpāta", "Vaidhṛti", "Other yoga"],
  karana: ["Taitila", "Vaṇija", "Bava", "Bālava", "Garaja", "Viṣṭi", "Other karaṇa"],
};

const PLANET_META: Record<PlanetKey, { label: string; color: string; icon: typeof Star }> = {
  mercury: { label: "Mercury", color: BLUE, icon: Sun },
  jupiter: { label: "Jupiter", color: GREEN, icon: Star },
};

const TRIAD_LABELS = ["Own / exalted / friendly sign", "Favourable house placement", "Non-combust", "Benefic aspect environment"];

const BUSINESS_TYPES = [
  { key: "commerce", label: "Commerce", emphasis: "Mercury and the 3rd house emphasised", color: BLUE },
  { key: "financial", label: "Financial services", emphasis: "Jupiter, 2nd and 11th houses emphasised", color: GREEN },
  { key: "manufacturing", label: "Manufacturing", emphasis: "Limited Tuesday/Saturday vāra exception; Mars / 6th skill", color: VERMILION },
  { key: "technology", label: "Technology services", emphasis: "Mercury and the 3rd house emphasised (Ananya's category)", color: PURPLE },
  { key: "leadership", label: "Leadership venture", emphasis: "Sun and the 10th house emphasised", color: GOLD },
];

function limbStatus(limb: LimbKey, value: string): Category {
  if (limb === "tithi") {
    if (FAV_TITHI.has(value)) return "favoured";
    if (AV_TITHI.has(value)) return "avoided";
    return "neutral";
  }
  if (limb === "vara") {
    if (FAV_VARA.has(value)) return "favoured";
    if (AV_VARA.has(value)) return "avoided";
    return "neutral";
  }
  if (limb === "nakshatra") {
    if (FAV_NAK.has(value)) return "favoured";
    if (AV_NAK.has(value)) return "avoided";
    return "neutral";
  }
  if (limb === "yoga") {
    if (FAV_YOGA.has(value)) return "favoured";
    if (AV_YOGA.has(value)) return "avoided";
    return "neutral";
  }
  if (FAV_KAR.has(value)) return "favoured";
  if (AV_KAR.has(value)) return "avoided";
  return "neutral";
}

function categoryColor(status: Category): string {
  if (status === "favoured") return GREEN;
  if (status === "avoided") return VERMILION;
  return INK_MUTED;
}

function CategoryChip({ status }: { status: Category }) {
  const color = categoryColor(status);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.25rem",
        padding: "0.125rem 0.5rem",
        borderRadius: "9999px",
        border: `1px solid ${color}`,
        color,
        fontSize: "0.7rem",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.03em",
      }}
    >
      {status === "favoured" ? <CheckCircle2 size={10} /> : null}
      {status === "avoided" ? <XCircle size={10} /> : null}
      {status === "neutral" ? <Info size={10} /> : null}
      {status}
    </span>
  );
}

function ReferencePanel({ activeLimb, setActiveLimb }: { activeLimb: LimbKey; setActiveLimb: (key: LimbKey) => void }) {
  const data = PANCA_LIMBS[activeLimb];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {(Object.keys(PANCA_LIMBS) as LimbKey[]).map((key) => (
          <button key={key} type="button" aria-pressed={activeLimb === key} onClick={() => setActiveLimb(key)} style={smallChipStyle(activeLimb === key, GOLD)}>
            {PANCA_LIMBS[key].label}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.65rem" }}>
        <CategoryCard title="Favoured" items={data.favoured} color={GREEN} />
        <CategoryCard title="Avoided" items={data.avoided} color={VERMILION} />
      </div>
      {data.notes ? (
        <div style={{ fontSize: "0.8rem", color: INK_SECONDARY, lineHeight: 1.55 }}>{data.notes}</div>
      ) : null}
      <div
        style={{
          padding: "0.5rem 0.75rem",
          borderRadius: 6,
          border: `1px solid ${BLUE}`,
          background: `${BLUE}08`,
          fontSize: "0.8rem",
          color: INK_SECONDARY,
          lineHeight: 1.55,
        }}
      >
        <Info size={14} color={BLUE} style={{ display: "inline", marginRight: 6 }} />
        {`Business-launch's tithi table is the most permissive of the event-types covered so far: only Riktā is avoided outright.`}
      </div>
    </div>
  );
}

function CategoryCard({ title, items, color }: { title: string; items: string[]; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}`, borderRadius: 8, padding: "0.75rem", background: `${color}08` }}>
      <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color, marginBottom: "0.45rem" }}>{title}</div>
      <ul style={{ margin: 0, paddingLeft: "1rem", color: INK_PRIMARY, fontSize: "0.85rem", lineHeight: 1.55 }}>
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function MercuryJupiterDrill({
  checks,
  setChecks,
}: {
  checks: Record<PlanetKey, boolean[]>;
  setChecks: (value: Record<PlanetKey, boolean[]>) => void;
}) {
  function toggle(planet: PlanetKey, index: number) {
    setChecks({
      ...checks,
      [planet]: checks[planet].map((value, i) => (i === index ? !value : value)),
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <p style={{ margin: 0, fontSize: "0.875rem", color: INK_SECONDARY, lineHeight: 1.55 }}>
        {`Mercury and Jupiter are business-launch's elevated-importance planets. Toggle the four criteria to see each planet's status flip from 'present' to 'strong'.`}
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.65rem" }}>
        {(Object.keys(PLANET_META) as PlanetKey[]).map((key) => {
          const meta = PLANET_META[key];
          const Icon = meta.icon;
          const values = checks[key];
          const strong = values.every(Boolean);
          return (
            <div key={key} style={{ ...cardStyle, borderColor: strong ? meta.color : HAIRLINE }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <Icon size={18} color={meta.color} />
                <span style={{ fontSize: "1rem", fontWeight: 600, color: meta.color }}>{meta.label}</span>
                <span style={{ marginLeft: "auto" }}>
                  <CategoryChip status={strong ? "favoured" : "avoided"} />
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                {TRIAD_LABELS.map((label, idx) => (
                  <button
                    key={label}
                    type="button"
                    aria-pressed={values[idx]}
                    onClick={() => toggle(key, idx)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "0.5rem",
                      padding: "0.35rem 0.5rem",
                      borderRadius: 6,
                      border: `1px solid ${values[idx] ? meta.color : HAIRLINE}`,
                      background: values[idx] ? `${meta.color}10` : "transparent",
                      color: values[idx] ? meta.color : INK_SECONDARY,
                      fontSize: "0.8rem",
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    {label}
                    {values[idx] ? <CheckCircle2 size={12} /> : <Circle size={12} />}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HouseBalaSvg() {
  const size = 240;
  const cx = size / 2;
  const cy = size / 2;
  const r = 82;
  const houses = [
    { n: 1, angle: -90, color: BLUE, note: "founder" },
    { n: 2, angle: -60, color: BLUE, note: "wealth" },
    { n: 10, angle: 90, color: GREEN, note: "career" },
    { n: 11, angle: 120, color: GREEN, note: "gains" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
      <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Business-launch house-bala emphasis" style={{ width: "100%", maxWidth: 280 }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={HAIRLINE} strokeWidth={1} />
        {houses.map((h) => {
          const rad = ((h.angle - 90) * Math.PI) / 180;
          const x = cx + (r - 24) * Math.cos(rad);
          const y = cy + (r - 24) * Math.sin(rad);
          return (
            <g key={h.n}>
              <circle cx={x} cy={y} r={20} fill={`${h.color}15`} stroke={h.color} strokeWidth={2} />
              <text x={x} y={y - 2} textAnchor="middle" fontSize={10} fill={h.color} fontWeight={700}>
                {h.n}
              </text>
              <text x={x} y={y + 8} textAnchor="middle" fontSize={7} fill={h.color} fontWeight={500}>
                {h.note}
              </text>
            </g>
          );
        })}
        <text x={cx} y={cy} textAnchor="middle" fontSize={10} fill={INK_MUTED} fontWeight={500}>
          business launch
        </text>
      </svg>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
        <span style={{ fontSize: "0.72rem", color: GREEN, display: "flex", alignItems: "center", gap: "0.25rem" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: GREEN }} />
          Most-central (10th / 11th)
        </span>
        <span style={{ fontSize: "0.72rem", color: BLUE, display: "flex", alignItems: "center", gap: "0.25rem" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: BLUE }} />
          Also of interest (1st / 2nd)
        </span>
      </div>
    </div>
  );
}

function BusinessTypePanel() {
  const [selected, setSelected] = useState("technology");
  const active = BUSINESS_TYPES.find((b) => b.key === selected) ?? BUSINESS_TYPES[0];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <p style={{ margin: 0, fontSize: "0.875rem", color: INK_SECONDARY, lineHeight: 1.55 }}>
        {`T1-23 Lesson 23.4.2 §4.5 refines the general table by business category. Select a category to see its emphasis shift.`}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
        {BUSINESS_TYPES.map((bt) => (
          <button
            key={bt.key}
            type="button"
            aria-pressed={selected === bt.key}
            onClick={() => setSelected(bt.key)}
            style={{
              padding: "0.35rem 0.65rem",
              borderRadius: 6,
              border: `1px solid ${selected === bt.key ? bt.color : HAIRLINE}`,
              background: selected === bt.key ? `${bt.color}15` : "transparent",
              color: selected === bt.key ? bt.color : INK_SECONDARY,
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {bt.label}
          </button>
        ))}
      </div>
      <div style={{ ...cardStyle, borderColor: active.color }}>
        <div style={{ fontSize: "1rem", fontWeight: 600, color: active.color, marginBottom: "0.35rem" }}>{active.label}</div>
        <div style={{ fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.6 }}>{active.emphasis}</div>
      </div>
    </div>
  );
}

function CandidateScreen({
  candidate,
  setCandidate,
}: {
  candidate: Record<LimbKey, string>;
  setCandidate: (value: Record<LimbKey, string>) => void;
}) {
  const limbStatuses = useMemo(() => {
    return (Object.keys(PANCA_LIMBS) as LimbKey[]).map((key) => ({
      limb: key,
      label: PANCA_LIMBS[key].label,
      value: candidate[key],
      status: limbStatus(key, candidate[key]),
    }));
  }, [candidate]);

  const anyAvoided = limbStatuses.some((item) => item.status === "avoided");
  const allFavoured = limbStatuses.every((item) => item.status === "favoured");

  let verdict = { text: "Strong first-pass candidate; Mercury-Jupiter and house-bala checks still pending", color: GREEN, icon: CheckCircle2 };
  if (anyAvoided) verdict = { text: "Avoided factor present — reconsider candidate", color: VERMILION, icon: XCircle };
  else if (!allFavoured) verdict = { text: "Acceptable first-pass candidate; some limbs neutral", color: GOLD, icon: Info };

  const Icon = verdict.icon;

  function update(key: LimbKey, value: string) {
    setCandidate({ ...candidate, [key]: value });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.65rem" }}>
        {(Object.keys(PANCA_LIMBS) as LimbKey[]).map((key) => (
          <label key={key} style={fieldLabelStyle}>
            {PANCA_LIMBS[key].label}
            <div style={{ position: "relative", marginTop: "0.35rem" }}>
              <select value={candidate[key]} onChange={(e) => update(key, e.target.value)} style={selectStyle}>
                {CANDIDATE_OPTIONS[key].map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} color={INK_MUTED} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            </div>
          </label>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.5rem" }}>
        {limbStatuses.map((item) => (
          <div key={item.limb} style={{ padding: "0.5rem", borderRadius: 6, border: `1px solid ${HAIRLINE}`, background: SURFACE }}>
            <div style={{ fontSize: "0.72rem", color: INK_MUTED, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.03em" }}>{item.label}</div>
            <div style={{ fontSize: "0.85rem", color: INK_PRIMARY, fontWeight: 500, marginTop: "0.15rem" }}>{item.value}</div>
            <div style={{ marginTop: "0.25rem" }}>
              <CategoryChip status={item.status} />
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          padding: "0.75rem 1rem",
          borderRadius: 8,
          border: `1px solid ${verdict.color}`,
          background: `${verdict.color}10`,
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <Icon size={22} color={verdict.color} />
        <div>
          <div style={{ fontSize: "0.95rem", fontWeight: 600, color: verdict.color }}>{verdict.text}</div>
          <div style={{ fontSize: "0.8rem", color: INK_SECONDARY }}>
            {`Remember: pañcāṅga is only the first pass. Mercury-Jupiter strength and 10th/11th house-bala are checked separately.`}
          </div>
        </div>
      </div>
    </div>
  );
}

export function BusinessLaunchClassicalWorkbench() {
  const [mode, setMode] = useState<Mode>("reference");
  const [activeLimb, setActiveLimb] = useState<LimbKey>("tithi");
  const [candidate, setCandidate] = useState<Record<LimbKey, string>>({
    tithi: "Shukla Daśamī (Pūrṇā class)",
    vara: "Wednesday",
    nakshatra: "Hasta",
    yoga: "Siddhi",
    karana: "Taitila",
  });
  const [checks, setChecks] = useState<Record<PlanetKey, boolean[]>>({
    mercury: [true, true, true, true],
    jupiter: [true, true, true, true],
  });

  function handleReset() {
    setMode("reference");
    setActiveLimb("tithi");
    setCandidate({
      tithi: "Shukla Daśamī (Pūrṇā class)",
      vara: "Wednesday",
      nakshatra: "Hasta",
      yoga: "Siddhi",
      karana: "Taitila",
    });
    setChecks({ mercury: [true, true, true, true], jupiter: [true, true, true, true] });
  }

  return (
    <div data-interactive="business-launch-classical-workbench" style={{ display: "flex", flexDirection: "column", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Business-launch classical considerations</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.25rem", fontWeight: 600 }}>
              {`Explore the pañcāṅga table, Mercury-Jupiter discipline, house-bala, and Ananya Rao's first-pass screen`}
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              {`This workbench loads T1-23 Lesson 23.4.2's business-launch-specific values and lets you screen Ananya's own candidate live.`}
            </p>
          </div>
          <button type="button" onClick={handleReset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
        <div
          style={{
            marginTop: "0.65rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            padding: "0.25rem 0.5rem",
            borderRadius: 4,
            background: `${BLUE}10`,
            color: BLUE,
            fontSize: "0.72rem",
            fontWeight: 500,
          }}
        >
          <BookOpen size={10} />
          Source: T1-23 Lesson 23.4.2 §4.2-§4.5, verbatim
        </div>
      </section>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        <button type="button" aria-pressed={mode === "reference"} onClick={() => setMode("reference")} style={buttonStyle(mode === "reference", GOLD)}>
          <BookOpen size={14} />
          Reference table
        </button>
        <button type="button" aria-pressed={mode === "candidate"} onClick={() => setMode("candidate")} style={buttonStyle(mode === "candidate", GREEN)}>
          <TrendingUp size={14} />
          Ananya candidate
        </button>
        <button type="button" aria-pressed={mode === "mercury-jupiter"} onClick={() => setMode("mercury-jupiter")} style={buttonStyle(mode === "mercury-jupiter", BLUE)}>
          <Star size={14} />
          Mercury-Jupiter
        </button>
        <button type="button" aria-pressed={mode === "house-bala"} onClick={() => setMode("house-bala")} style={buttonStyle(mode === "house-bala", PURPLE)}>
          <Home size={14} />
          House-bala
        </button>
      </div>

      {mode === "reference" ? (
        <div style={workbenchDiagramLayoutStyle}>
          <section style={{ ...cardStyle, flex: "2 1 460px" }}>
            <ReferencePanel activeLimb={activeLimb} setActiveLimb={setActiveLimb} />
          </section>
          <section style={{ ...cardStyle, flex: "1 1 280px" }}>
            <BusinessTypePanel />
          </section>
        </div>
      ) : null}

      {mode === "candidate" ? (
        <section style={cardStyle}>
          <CandidateScreen candidate={candidate} setCandidate={setCandidate} />
        </section>
      ) : null}

      {mode === "mercury-jupiter" ? (
        <section style={cardStyle}>
          <MercuryJupiterDrill checks={checks} setChecks={setChecks} />
        </section>
      ) : null}

      {mode === "house-bala" ? (
        <div style={workbenchDiagramLayoutStyle}>
          <section style={{ ...cardStyle, flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <p style={eyebrowStyle}>House-bala emphasis</p>
            <HouseBalaSvg />
          </section>
          <section style={{ ...cardStyle, flex: "2 1 400px", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <p style={eyebrowStyle}>What each house means here</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.65rem" }}>
              <HouseNote number={10} label="10th house" body="Career / karma — most-central for the venture's own action and authority." color={GREEN} />
              <HouseNote number={11} label="11th house" body="Gains / profit — most-central for the venture's own return." color={GREEN} />
              <HouseNote number={1} label="1st house" body="Founder / self — the person initiating the venture." color={BLUE} />
              <HouseNote number={2} label="2nd house" body="Wealth / finances — the venture's own treasury." color={BLUE} />
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}

function HouseNote({ number, label, body, color }: { number: number; label: string; body: string; color: string }) {
  return (
    <div style={{ padding: "0.65rem", borderRadius: 8, border: `1px solid ${color}`, background: `${color}08` }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", fontWeight: 600, color }}>
        <span style={{ width: 18, height: 18, borderRadius: "50%", background: color, color: "#fff", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>{number}</span>
        {label}
      </div>
      <div style={{ fontSize: "0.8rem", color: INK_SECONDARY, lineHeight: 1.55, marginTop: "0.25rem" }}>{body}</div>
    </div>
  );
}

const cardStyle: CSSProperties = {
  background: SURFACE,
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};

const buttonStyle = (active: boolean, color: string): CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.375rem",
  padding: "0.45rem 0.85rem",
  borderRadius: 6,
  border: `1px solid ${active ? color : HAIRLINE}`,
  background: active ? `${color}15` : "transparent",
  color: active ? color : INK_PRIMARY,
  fontSize: "0.85rem",
  fontWeight: 500,
  cursor: "pointer",
});

const smallChipStyle = (active: boolean, color: string): CSSProperties => ({
  padding: "0.35rem 0.55rem",
  borderRadius: 6,
  border: `1px solid ${active ? color : HAIRLINE}`,
  background: active ? `${color}15` : "transparent",
  color: active ? color : INK_SECONDARY,
  fontSize: "0.8rem",
  fontWeight: 600,
  cursor: "pointer",
});

const fieldLabelStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  fontSize: "0.78rem",
  fontWeight: 600,
  color: INK_MUTED,
  textTransform: "uppercase",
  letterSpacing: "0.03em",
};

const selectStyle: CSSProperties = {
  width: "100%",
  padding: "0.45rem 2rem 0.45rem 0.6rem",
  borderRadius: 6,
  border: `1px solid ${HAIRLINE}`,
  background: "transparent",
  color: INK_PRIMARY,
  fontSize: "0.85rem",
  fontWeight: 500,
  appearance: "none",
  cursor: "pointer",
};
