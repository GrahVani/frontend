"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  Flame,
  GitCompare,
  Moon,
  RotateCcw,
  Scale,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

type Graha = "Saturn" | "Jupiter" | "Mars" | "Mercury" | "Venus" | "Sun" | "Moon";
type MoonVariant = "none" | "drekkana" | "navamsa" | "dispositor-alone" | "dispositor-cluster";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";

const GRAHAS: Graha[] = ["Saturn", "Jupiter", "Mars", "Mercury", "Venus", "Sun", "Moon"];

const ASCETIC_TYPES: Record<Graha, string> = {
  Saturn: "Nirgrantha / austere renunciate register",
  Jupiter: "Tridandin / teacher-renunciate register",
  Mars: "Sakya / martial ascetic register",
  Mercury: "Ajivika / analytic wandering register",
  Venus: "Charaka / refined devotional register",
  Sun: "Vanaprastha / solar withdrawal register",
  Moon: "Vridha-shravaka / reflective devotional register",
};

const MOON_VARIANTS: Record<MoonVariant, { label: string; note: string }> = {
  none: {
    label: "No Moon variant",
    note: "No independent Moon-based Sannyasa formation is being claimed.",
  },
  drekkana: {
    label: "Moon in Saturn drekkana",
    note: "Moon in Saturn's own drekkana, aspected by Mars and Saturn.",
  },
  navamsa: {
    label: "Moon in Mars/Saturn navamsa",
    note: "Moon in Mars's or Saturn's own navamsa, aspected by Saturn.",
  },
  "dispositor-alone": {
    label: "Moon dispositor aspected by Saturn alone",
    note: "The Moon's dispositor receives Saturn's aspect and no other graha's aspect.",
  },
  "dispositor-cluster": {
    label: "Moon dispositor aspected by a clustered house",
    note: "The Moon's dispositor is aspected by all grahas occupying one house or sign together.",
  },
};

export function SannyasaYogaSpotter() {
  const [clusterCount, setClusterCount] = useState(4);
  const [strongestGraha, setStrongestGraha] = useState<Graha>("Saturn");
  const [powerfulGrahas, setPowerfulGrahas] = useState(1);
  const [combust, setCombust] = useState(true);
  const [warDefeat, setWarDefeat] = useState(false);
  const [maleficAffliction, setMaleficAffliction] = useState(false);
  const [moonVariant, setMoonVariant] = useState<MoonVariant>("none");
  const [ketu12, setKetu12] = useState(true);
  const [ketuSupport, setKetuSupport] = useState(false);

  const verdict = useMemo(() => {
    const hasCore = clusterCount >= 4;
    if (!hasCore && moonVariant === "none" && !ketu12) {
      return {
        status: "No formation selected",
        color: INK_MUTED,
        body: "Turn on a core conjunction, Moon variant, or Ketu-in-12th scenario to test the rules.",
      };
    }

    if (hasCore && combust) {
      return {
        status: "Core yoga cancelled",
        color: VERMILION,
        body: "Four-plus grahas are present, but combustion of the strongest graha prevents a clean Sannyasa result.",
      };
    }

    if (hasCore && powerfulGrahas > 1) {
      return {
        status: powerfulGrahas === 2 ? "Path-change condition" : "Clean verdict withheld",
        color: GOLD,
        body:
          powerfulGrahas === 2
            ? "Exactly two powerful grahas points to an initial path followed by a later shift, not a simple one-line verdict."
            : "More than one powerful graha contests the strongest-graha reading; the clean Sannyasa verdict is disqualified.",
      };
    }

    if (hasCore && warDefeat) {
      return {
        status: "Yoga weakened",
        color: GOLD,
        body: "Planetary-war defeat allows a taking-up and later discarding of the path, so the reading must be cautious.",
      };
    }

    if (hasCore) {
      return {
        status: maleficAffliction ? "Present, ethically cautioned" : "Core formation present",
        color: maleficAffliction ? GOLD : GREEN,
        body: maleficAffliction
          ? "The formation can operate under affliction, but the lesson requires a serious caution about outcome quality."
          : `${strongestGraha} leads the classical formation. Read it as capacity/disposition, not prescription.`,
      };
    }

    if (moonVariant !== "none") {
      return {
        status: "Moon-based variant flagged",
        color: PURPLE,
        body: `${MOON_VARIANTS[moonVariant].note} This is independent of the four-graha conjunction.`,
      };
    }

    return {
      status: ketuSupport ? "Ketu qualification passes" : "Ketu alone is insufficient",
      color: ketuSupport ? GREEN : VERMILION,
      body: ketuSupport
        ? "Ketu in the 12th has corroboration from the 5th lord, 9th lord, or Jupiter, so the spiritual reading is qualified."
        : "Rao's inherited standard blocks Ketu-in-12th from being read as spiritual by itself.",
    };
  }, [clusterCount, combust, ketu12, ketuSupport, maleficAffliction, moonVariant, powerfulGrahas, strongestGraha, warDefeat]);

  const checklist = [
    { label: "Core four-plus graha ingredient", ok: clusterCount >= 4, icon: <GitCompare size={18} /> },
    { label: "Strongest graha not combust", ok: !combust, icon: <Flame size={18} /> },
    { label: "No planetary-war defeat", ok: !warDefeat, icon: <ShieldCheck size={18} /> },
    { label: "Only one powerful graha leads", ok: powerfulGrahas === 1, icon: <Scale size={18} /> },
    { label: "Moon variant checked separately", ok: moonVariant !== "none", icon: <Moon size={18} /> },
    { label: "Ketu-in-12th support checked", ok: !ketu12 || ketuSupport, icon: <Sparkles size={18} /> },
  ];

  return (
    <div data-interactive="sannyasa-yoga-spotter" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Sannyasa-yoga spotter</p>
            <h2 style={{ margin: "0.28rem 0 0", color: INK_PRIMARY, fontSize: "1.35rem", fontWeight: 650, lineHeight: 1.25 }}>
              Run the formation, cancellation, Moon-variant, and Ketu qualification checks
            </h2>
            <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, fontSize: "1.04rem", lineHeight: 1.6, maxWidth: 900 }}>
              The point is not to force a dramatic verdict. The tool trains the lesson&apos;s discipline: raw four-plus grahas are necessary but never sufficient.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setClusterCount(4);
              setStrongestGraha("Saturn");
              setPowerfulGrahas(1);
              setCombust(true);
              setWarDefeat(false);
              setMaleficAffliction(false);
              setMoonVariant("none");
              setKetu12(true);
              setKetuSupport(false);
            }}
            style={softButtonStyle}
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 0.9fr) minmax(320px, 1fr)", gap: "1rem" }}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Core formation inputs</p>
          <div style={{ display: "grid", gap: "0.8rem", marginTop: "0.9rem" }}>
            <label style={fieldStyle}>
              Grahas conjoined in one sign/house
              <input type="range" min={0} max={7} value={clusterCount} onChange={(event) => setClusterCount(Number(event.target.value))} />
              <strong style={{ color: clusterCount >= 4 ? GREEN : VERMILION }}>{clusterCount} grahas</strong>
            </label>

            <label style={fieldStyle}>
              Strongest graha
              <select value={strongestGraha} onChange={(event) => setStrongestGraha(event.target.value as Graha)} style={selectStyle}>
                {GRAHAS.map((graha) => (
                  <option key={graha} value={graha}>{graha}</option>
                ))}
              </select>
              <span style={{ color: INK_MUTED }}>{ASCETIC_TYPES[strongestGraha]}</span>
            </label>

            <label style={fieldStyle}>
              Powerful grahas inside the cluster
              <input type="range" min={1} max={4} value={powerfulGrahas} onChange={(event) => setPowerfulGrahas(Number(event.target.value))} />
              <strong style={{ color: powerfulGrahas === 1 ? GREEN : GOLD }}>{powerfulGrahas}</strong>
            </label>
          </div>
        </div>

        <div style={{ ...cardStyle, borderColor: verdict.color }}>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
            <span style={{ color: verdict.color, marginTop: "0.15rem" }}>
              {verdict.color === GREEN ? <BadgeCheck size={24} /> : <AlertTriangle size={24} />}
            </span>
            <div>
              <p style={eyebrowStyle}>Verdict</p>
              <h3 style={{ margin: "0.25rem 0 0", color: verdict.color, fontSize: "1.35rem", lineHeight: 1.2 }}>{verdict.status}</h3>
              <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, fontSize: "1.06rem", lineHeight: 1.58 }}>{verdict.body}</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "1rem" }}>
        <ToggleCard checked={combust} onChange={setCombust} title="Combust strongest graha" body="Cancels the clean core Sannyasa result." color={VERMILION} icon={<Flame size={18} />} />
        <ToggleCard checked={warDefeat} onChange={setWarDefeat} title="Planetary-war defeat" body="Weakens into take-up and later discard." color={GOLD} icon={<ShieldCheck size={18} />} />
        <ToggleCard checked={maleficAffliction} onChange={setMaleficAffliction} title="Malefic affliction" body="May operate, but with caution about outcome quality." color={GOLD} icon={<AlertTriangle size={18} />} />
        <ToggleCard checked={ketu12} onChange={setKetu12} title="Ketu in 12th" body="Must be qualified by 5th lord, 9th lord, or Jupiter." color={PURPLE} icon={<Sparkles size={18} />} />
        <ToggleCard checked={ketuSupport} onChange={setKetuSupport} title="Ketu has support" body="Corroborating aspect passes Rao's qualification standard." color={GREEN} icon={<BadgeCheck size={18} />} />
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "minmax(280px, 0.7fr) minmax(0, 1fr)", gap: "1rem" }}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Moon-based variant</p>
          <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.8rem" }}>
            {(Object.keys(MOON_VARIANTS) as MoonVariant[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setMoonVariant(key)}
                style={{
                  ...buttonReset,
                  border: `1px solid ${moonVariant === key ? PURPLE : HAIRLINE}`,
                  background: moonVariant === key ? "rgba(107, 90, 168, 0.1)" : "transparent",
                  color: moonVariant === key ? PURPLE : INK_SECONDARY,
                  borderRadius: 8,
                  padding: "0.7rem 0.75rem",
                  fontSize: "0.98rem",
                  fontWeight: 650,
                }}
              >
                {MOON_VARIANTS[key].label}
              </button>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Checklist discipline</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.65rem", marginTop: "0.85rem" }}>
            {checklist.map((item) => (
              <div key={item.label} style={{ border: `1px solid ${item.ok ? GREEN : HAIRLINE}`, borderRadius: 8, padding: "0.75rem", background: item.ok ? "rgba(47, 125, 85, 0.08)" : "rgba(255,255,255,0.25)" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", color: item.ok ? GREEN : INK_MUTED, fontWeight: 650, fontSize: "0.96rem" }}>
                  {item.icon}
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ToggleCard({ checked, onChange, title, body, color, icon }: { checked: boolean; onChange: (checked: boolean) => void; title: string; body: string; color: string; icon: ReactNode }) {
  return (
    <label style={{ ...cardStyle, borderColor: checked ? color : HAIRLINE, cursor: "pointer", display: "grid", gap: "0.45rem" }}>
      <span style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "start" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", color: checked ? color : INK_SECONDARY, fontWeight: 700, fontSize: "1rem" }}>
          {icon}
          {title}
        </span>
        <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} aria-label={title} />
      </span>
      <span style={{ color: INK_SECONDARY, lineHeight: 1.45, fontSize: "0.95rem" }}>{body}</span>
    </label>
  );
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  boxShadow: "var(--gl-shadow-soft)",
  padding: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontSize: "0.78rem",
  fontWeight: 700,
};

const fieldStyle: CSSProperties = {
  display: "grid",
  gap: "0.42rem",
  color: INK_SECONDARY,
  fontSize: "1rem",
  lineHeight: 1.4,
};

const selectStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: "rgba(255,255,255,0.45)",
  color: INK_PRIMARY,
  padding: "0.6rem 0.7rem",
  font: "inherit",
};

const buttonReset: CSSProperties = {
  appearance: "none",
  cursor: "pointer",
  font: "inherit",
  textAlign: "left",
};

const softButtonStyle: CSSProperties = {
  ...buttonReset,
  display: "inline-flex",
  alignItems: "center",
  gap: "0.45rem",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: "transparent",
  color: INK_SECONDARY,
  padding: "0.58rem 0.78rem",
  fontSize: "0.92rem",
  fontWeight: 650,
};
