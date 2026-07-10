"use client";

import { useMemo, useState } from "react";
import { Brain, CheckCircle2, Eye, GitBranch, RotateCcw, ShieldAlert, Sparkles } from "lucide-react";

type PlanetKey = "jupiter" | "venus" | "moon" | "sun" | "mars" | "saturn" | "rahu" | "ketu";
type ContactType = "conjunction" | "aspect";
type School = "strict" | "lenient";

interface Planet {
  key: PlanetKey;
  name: string;
  sanskrit: string;
  nature: "benefic" | "malefic";
  note: string;
  color: string;
}

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const BUDHA = "#2F7D55";
const BUDHA_DEEP = "#235E43";
const BENEFIC = "#2F7D55";
const MALEFIC = "#A44135";
const MILD = "#B88719";

const PLANETS: Planet[] = [
  { key: "jupiter", name: "Jupiter", sanskrit: "Guru", nature: "benefic", note: "wisdom, ethics, teaching", color: "#B88719" },
  { key: "venus", name: "Venus", sanskrit: "Shukra", nature: "benefic", note: "grace, art, refinement", color: "#8B5FA8" },
  { key: "moon", name: "Strong Moon", sanskrit: "Candra", nature: "benefic", note: "nourishing mind; use strong/waxing Moon here", color: "#6F83B8" },
  { key: "sun", name: "Sun", sanskrit: "Surya", nature: "malefic", note: "mild malefic heat and authority", color: "#D99622" },
  { key: "mars", name: "Mars", sanskrit: "Mangala", nature: "malefic", note: "sharpness, conflict, injury", color: "#C8412E" },
  { key: "saturn", name: "Saturn", sanskrit: "Shani", nature: "malefic", note: "pressure, delay, fear", color: "#4F5F78" },
  { key: "rahu", name: "Rahu", sanskrit: "Rahu", nature: "malefic", note: "amplification and distortion", color: "#6B5AA8" },
  { key: "ketu", name: "Ketu", sanskrit: "Ketu", nature: "malefic", note: "separation and sharp withdrawal", color: "#7A5E1E" },
];

const PRESETS = [
  { label: "Jupiter alone", contacts: { jupiter: "conjunction" } },
  { label: "Saturn alone", contacts: { saturn: "conjunction" } },
  { label: "Mixed company", contacts: { jupiter: "conjunction", venus: "aspect", saturn: "aspect" } },
  { label: "Mercury alone", contacts: {} },
] satisfies Array<{ label: string; contacts: Partial<Record<PlanetKey, ContactType>> }>;

const CONTACT_OPTIONS: Array<[ContactType | "none", string]> = [
  ["none", "None"],
  ["conjunction", "Join"],
  ["aspect", "Aspect"],
];

function polar(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export function AssociationClassifier() {
  const [contacts, setContacts] = useState<Partial<Record<PlanetKey, ContactType>>>({ jupiter: "conjunction" });
  const [school, setSchool] = useState<School>("strict");

  const selectedPlanets = PLANETS.filter((planet) => contacts[planet.key]);
  const benefics = selectedPlanets.filter((planet) => planet.nature === "benefic");
  const malefics = selectedPlanets.filter((planet) => planet.nature === "malefic");

  const verdict = useMemo(() => {
    if (selectedPlanets.length === 0) {
      return {
        label: "Mildly benefic",
        color: MILD,
        icon: Brain,
        body: "Kevala Budha: no close conjunction or aspect, so Mercury defaults to gentle, balanced, mildly positive.",
      };
    }
    if (malefics.length === 0) {
      return {
        label: "Benefic",
        color: BENEFIC,
        icon: CheckCircle2,
        body: "Shubha-sanga: Mercury is surrounded only by benefics, so intellect, speech, trade, and skill become clearer and more trustworthy.",
      };
    }
    if (benefics.length === 0) {
      return {
        label: "Malefic",
        color: MALEFIC,
        icon: ShieldAlert,
        body: "Papa-sanga: Mercury keeps only malefic company, so intellect can bend toward distortion, harsh speech, anxiety, or clever manipulation.",
      };
    }
    if (school === "strict") {
      return {
        label: "Malefic by strict school",
        color: MALEFIC,
        icon: ShieldAlert,
        body: "Mixed company with the strict rule: one malefic contact is enough to contaminate Mercury's result. State that you are using this school.",
      };
    }
    return {
      label: benefics.length > malefics.length ? "Net benefic with caveat" : "Mixed / cautious",
      color: benefics.length > malefics.length ? BENEFIC : MILD,
      icon: GitBranch,
      body:
        benefics.length > malefics.length
          ? "Mixed company with the lenient rule: benefics outweigh the malefic, so Mercury can act net-benefic with a caveat."
          : "Mixed company with the lenient rule: benefics do not clearly outweigh malefics, so the reading stays cautious.",
    };
  }, [benefics.length, malefics.length, school, selectedPlanets.length]);

  const VerdictIcon = verdict.icon;

  const setContact = (planet: PlanetKey, contact: ContactType | "none") => {
    setContacts((current) => {
      const next = { ...current };
      if (contact === "none") delete next[planet];
      else next[planet] = contact;
      return next;
    });
  };

  return (
    <div
      className="w-full rounded-lg p-4 md:p-5"
      data-interactive="association-classifier"
      style={{
        color: INK_PRIMARY,
        background: "linear-gradient(180deg, rgba(255,251,239,0.96), rgba(245,232,203,0.72))",
        border: `1px solid ${HAIRLINE}`,
        boxShadow: "0 18px 40px rgba(72, 48, 16, 0.10)",
      }}
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(320px,0.95fr)_minmax(0,1.05fr)]">
        <section className="rounded-lg p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: INK_MUTED }}>
                Budha association
              </p>
              <h3 className="text-[26px] font-semibold leading-tight" style={{ color: BUDHA_DEEP }}>
                Mercury becomes the company it keeps
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed" style={{ color: INK_SECONDARY }}>
                Add conjunctions or aspects to Mercury. The verdict follows the lesson rule: only benefics, any malefic,
                or no company.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setContacts({});
                setSchool("strict");
              }}
              className="gl-focus-ring gl-clickable inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold"
              style={{ color: INK_SECONDARY, border: `1px solid ${HAIRLINE}` }}
            >
              <RotateCcw size={14} />
              Reset
            </button>
          </div>

          <AssociationSvg selectedPlanets={selectedPlanets} contacts={contacts} verdictColor={verdict.color} />

          <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setContacts(preset.contacts)}
                className="gl-focus-ring gl-clickable rounded-md px-3 py-2 text-xs font-semibold"
                style={{ color: BUDHA_DEEP, background: "rgba(47,125,85,0.10)", border: `1px solid rgba(47,125,85,0.26)` }}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-lg p-4" style={{ background: `${verdict.color}12`, border: `1px solid ${verdict.color}48` }}>
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2" style={{ background: `${verdict.color}18`, color: verdict.color }}>
                <VerdictIcon size={22} />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: verdict.color }}>
                  Mercury verdict
                </p>
                <h3 className="text-[28px] font-semibold leading-tight" style={{ color: INK_PRIMARY }}>
                  {verdict.label}
                </h3>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: INK_SECONDARY }}>
              {verdict.body}
            </p>
          </div>

          <div className="rounded-lg p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center gap-2">
              <Eye size={17} style={{ color: BUDHA }} />
              <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
                Strict vs lenient mixed-company rule
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(["strict", "lenient"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setSchool(item)}
                  aria-pressed={school === item}
                  className="gl-focus-ring gl-clickable rounded-md px-3 py-2 text-sm font-semibold capitalize"
                  style={{
                    color: school === item ? "#fffaf0" : INK_SECONDARY,
                    background: school === item ? BUDHA : "transparent",
                    border: `1px solid ${school === item ? BUDHA : HAIRLINE}`,
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
              Student default: strict. Advanced readers may use lenient cancellation when benefic support is strong, but
              the method must be named.
            </p>
          </div>

          <div className="rounded-lg p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center gap-2">
              <Sparkles size={17} style={{ color: BUDHA }} />
              <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
                Build Mercury&apos;s company
              </h3>
            </div>
            <div className="space-y-3">
              {PLANETS.map((planet) => (
                <PlanetControl key={planet.key} planet={planet} contact={contacts[planet.key]} onChange={(contact) => setContact(planet.key, contact)} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function AssociationSvg({
  selectedPlanets,
  contacts,
  verdictColor,
}: {
  selectedPlanets: Planet[];
  contacts: Partial<Record<PlanetKey, ContactType>>;
  verdictColor: string;
}) {
  const positions = selectedPlanets.map((planet, index) => {
    const angle = selectedPlanets.length === 1 ? -90 : -120 + (240 / Math.max(1, selectedPlanets.length - 1)) * index;
    const p = polar(190, 160, 112, angle + 90);
    return { planet, ...p };
  });

  return (
    <svg viewBox="0 0 380 320" className="h-auto w-full" role="img" aria-label="Mercury association diagram">
      <defs>
        <filter id="assocShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#6B4423" floodOpacity="0.15" />
        </filter>
      </defs>
      <rect x="10" y="10" width="360" height="300" rx="10" fill="#fffaf0" stroke="#d7b769" />
      <circle cx="190" cy="160" r="58" fill="#E7F4EC" stroke={verdictColor} strokeWidth="3" filter="url(#assocShadow)" />
      <text x="190" y="154" textAnchor="middle" fontSize="30" fontWeight="900" fill={BUDHA}>
        Bu
      </text>
      <text x="190" y="177" textAnchor="middle" fontSize="13" fontWeight="800" fill={INK_PRIMARY}>
        Mercury
      </text>
      {positions.map(({ planet, x, y }) => {
        const contact = contacts[planet.key];
        return (
          <g key={planet.key}>
            <line
              x1={190}
              y1={160}
              x2={x}
              y2={y}
              stroke={planet.nature === "benefic" ? BENEFIC : MALEFIC}
              strokeWidth="2"
              strokeDasharray={contact === "aspect" ? "5 5" : undefined}
              opacity="0.72"
            />
            <circle cx={x} cy={y} r="30" fill={planet.nature === "benefic" ? "#DDF1E7" : "#F7D9D5"} stroke={planet.color} strokeWidth="2" />
            <text x={x} y={y - 2} textAnchor="middle" fontSize="11" fontWeight="900" fill={planet.color}>
              {planet.sanskrit}
            </text>
            <text x={x} y={y + 13} textAnchor="middle" fontSize="9" fontWeight="700" fill={INK_MUTED}>
              {contact}
            </text>
          </g>
        );
      })}
      {positions.length === 0 ? (
        <text x="190" y="260" textAnchor="middle" fontSize="13" fontWeight="700" fill={MILD}>
          No conjunctions or aspects: kevala Budha
        </text>
      ) : null}
    </svg>
  );
}

function PlanetControl({
  planet,
  contact,
  onChange,
}: {
  planet: Planet;
  contact: ContactType | undefined;
  onChange: (contact: ContactType | "none") => void;
}) {
  return (
    <div className="rounded-md p-3" style={{ background: planet.nature === "benefic" ? "rgba(47,125,85,0.08)" : "rgba(164,65,53,0.08)", border: `1px solid ${planet.color}30` }}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold" style={{ color: INK_PRIMARY }}>
            {planet.name} <span style={{ color: INK_MUTED }}>({planet.sanskrit})</span>
          </p>
          <p className="mt-1 text-xs" style={{ color: INK_SECONDARY }}>
            {planet.nature}; {planet.note}
          </p>
        </div>
        <div className="flex rounded-md" style={{ border: `1px solid ${HAIRLINE}` }}>
          {CONTACT_OPTIONS.map(([key, label]) => {
            const active = (key === "none" && !contact) || contact === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onChange(key)}
                aria-pressed={active}
                className="gl-focus-ring gl-clickable px-2.5 py-1.5 text-xs font-semibold"
                style={{
                  color: active ? "#fffaf0" : INK_SECONDARY,
                  background: active ? planet.color : "transparent",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
