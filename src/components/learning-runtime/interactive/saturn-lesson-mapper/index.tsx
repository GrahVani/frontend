"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Briefcase, HeartHandshake, Home, Moon, RotateCcw, Scale, ShieldCheck, Sparkles, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type HouseKey = "4" | "5" | "7" | "8" | "10";
type ConditionKey = "exalted" | "friendly" | "afflicted" | "debilitated";
type RemedyKey = "service" | "saturday" | "hanuman" | "sapphire";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const SHANI = "#4F5F78";
const SHANI_DEEP = "#303A4D";
const GREEN = "#2F7D55";
const RED = "#A44135";
const GOLD = "#B88719";

const HOUSES: Record<HouseKey, { label: string; domain: string; content: string; icon: LucideIcon }> = {
  "4": { label: "4th house", domain: "Home, mother, inner security", content: "Non-attachment to comfort; building inner steadiness without depending on perfect circumstances.", icon: Home },
  "5": { label: "5th house", domain: "Children, learning, creativity", content: "Patience with joy, study, students, and the fruits of intelligence.", icon: Sparkles },
  "7": { label: "7th house", domain: "Marriage, partnership, contracts", content: "Humility, long commitment, honest boundaries, and mature reciprocity.", icon: HeartHandshake },
  "8": { label: "8th house", domain: "Karma, transformation, hidden material", content: "Endurance through uncertainty; depth, research, occult seriousness, and resilience.", icon: ShieldCheck },
  "10": { label: "10th house", domain: "Career, duty, public work", content: "Patient career-building, service, responsibility, and respect earned slowly.", icon: Briefcase },
};

const CONDITIONS: Record<ConditionKey, { label: string; mode: string; color: string; tone: string }> = {
  exalted: { label: "Exalted / own", mode: "Measured discipline", color: GREEN, tone: "The judge is firm but fair. Pressure becomes structure." },
  friendly: { label: "Friendly", mode: "Manageable restriction", color: GOLD, tone: "The lesson is real, but the native can cooperate with it." },
  afflicted: { label: "Afflicted", mode: "Heavy friction", color: RED, tone: "The difficulty is more visible. Counsel must name pain and instruction together." },
  debilitated: { label: "Debilitated", mode: "Intense correction", color: "#6B7280", tone: "The lesson feels like blockage first. Patient rebuilding is the medicine." },
};

const REMEDIES: Record<RemedyKey, { label: string; action: string }> = {
  service: { label: "Service", action: "Serve elders, workers, the poor, or anyone carrying Saturnian heaviness." },
  saturday: { label: "Saturday observance", action: "Use Saturday for restraint, simplicity, charity, and steady repetition." },
  hanuman: { label: "Hanuman practice", action: "Build courage, humility, and protection without denying the lesson." },
  sapphire: { label: "Blue sapphire caution", action: "Use only after proper chart judgment; it strengthens Saturn rather than deleting Saturn." },
};

const PRESETS = [
  { label: "Saturn in 7th", house: "7", condition: "friendly", remedy: "service" },
  { label: "Exalted 10th", house: "10", condition: "exalted", remedy: "saturday" },
  { label: "Debilitated 4th", house: "4", condition: "debilitated", remedy: "hanuman" },
  { label: "Sade-Sati", house: "8", condition: "afflicted", remedy: "service" },
] as const;

export function SaturnLessonMapper() {
  const [houseKey, setHouseKey] = useState<HouseKey>("7");
  const [conditionKey, setConditionKey] = useState<ConditionKey>("friendly");
  const [remedyKey, setRemedyKey] = useState<RemedyKey>("service");
  const [remedyApplied, setRemedyApplied] = useState(false);

  const house = HOUSES[houseKey];
  const condition = CONDITIONS[conditionKey];
  const remedy = REMEDIES[remedyKey];

  const Icon = house.icon;
  const counsel = useMemo(() => {
    const base = `Difficulty is real in ${house.domain.toLowerCase()}, and that difficulty is the teaching.`;
    return remedyApplied
      ? `${base} The remedy does not remove the curriculum; it gives steadier capacity to endure it gracefully.`
      : `${base} Name the lesson before prescribing a remedy.`;
  }, [house, remedyApplied]);

  return (
    <div data-interactive="saturn-lesson-mapper" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "end", flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Saturn lesson mapper
            </p>
            <h2 style={{ margin: "0.2rem 0 0", color: SHANI_DEEP, fontSize: "1.35rem" }}>
              Hold the paradox: malefic and teacher
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setHouseKey("7");
              setConditionKey("friendly");
              setRemedyKey("service");
              setRemedyApplied(false);
            }}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "transparent", color: INK_SECONDARY, padding: "0.55rem 0.75rem", fontWeight: 800, cursor: "pointer" }}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.65rem", marginTop: "1rem" }}>
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                setHouseKey(preset.house);
                setConditionKey(preset.condition);
                setRemedyKey(preset.remedy);
                setRemedyApplied(preset.label === "Sade-Sati");
              }}
              style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "rgba(255,255,255,0.55)", color: INK_PRIMARY, padding: "0.75rem", textAlign: "left", fontWeight: 850, cursor: "pointer" }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(260px, 0.78fr) minmax(0, 1.22fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }} aria-label="Saturn mapper controls">
          <ControlGroup title="1. Karmic domain">
            {(Object.keys(HOUSES) as HouseKey[]).map((key) => (
              <ChoiceButton key={key} active={houseKey === key} color={SHANI} onClick={() => setHouseKey(key)}>
                {HOUSES[key].label}
              </ChoiceButton>
            ))}
          </ControlGroup>

          <ControlGroup title="2. Teaching mode">
            {(Object.keys(CONDITIONS) as ConditionKey[]).map((key) => (
              <ChoiceButton key={key} active={conditionKey === key} color={CONDITIONS[key].color} onClick={() => setConditionKey(key)}>
                {CONDITIONS[key].label}
              </ChoiceButton>
            ))}
          </ControlGroup>

          <ControlGroup title="4. Remedy">
            {(Object.keys(REMEDIES) as RemedyKey[]).map((key) => (
              <ChoiceButton key={key} active={remedyKey === key} color={SHANI} onClick={() => setRemedyKey(key)}>
                {REMEDIES[key].label}
              </ChoiceButton>
            ))}
          </ControlGroup>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }} aria-label="Saturn four-step reading">
          <StepCard step="1" title="Domain" color={SHANI} icon={<Icon size={20} aria-hidden="true" />} body={house.domain} />
          <StepCard step="2" title="Mode" color={condition.color} icon={<Scale size={20} aria-hidden="true" />} body={`${condition.mode}. ${condition.tone}`} />
          <StepCard step="3" title="Content" color={GOLD} icon={<Moon size={20} aria-hidden="true" />} body={house.content} />
          <div style={{ border: `1px solid ${remedyApplied ? GREEN : HAIRLINE}`, borderRadius: 8, background: remedyApplied ? "rgba(47, 125, 85, 0.12)" : SURFACE, padding: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start", flexWrap: "wrap" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: remedyApplied ? GREEN : SHANI_DEEP, fontWeight: 900 }}>
                  <Users size={20} aria-hidden="true" />
                  <span>4. Remedy: {remedy.label}</span>
                </div>
                <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{remedy.action}</p>
              </div>
              <button
                type="button"
                aria-pressed={remedyApplied}
                onClick={() => setRemedyApplied((value) => !value)}
                style={{ border: `1px solid ${remedyApplied ? GREEN : HAIRLINE}`, borderRadius: 8, background: remedyApplied ? GREEN : "transparent", color: remedyApplied ? "#fff" : INK_SECONDARY, padding: "0.55rem 0.75rem", fontWeight: 850, cursor: "pointer" }}
              >
                {remedyApplied ? "Enduring gracefully" : "Apply remedy"}
              </button>
            </div>
          </div>

          <section style={{ borderLeft: `4px solid ${condition.color}`, background: "rgba(255, 251, 241, 0.78)", padding: "1rem" }}>
            <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Practitioner framing
            </p>
            <h3 style={{ margin: "0.4rem 0", color: SHANI_DEEP, fontSize: "1.25rem" }}>Real difficulty, real instruction</h3>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.65 }}>{counsel}</p>
          </section>
        </section>
      </div>
    </div>
  );
}

function ControlGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ display: "grid", gap: "0.5rem", marginBottom: "1rem" }}>
      <h3 style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>{title}</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: "0.45rem" }}>{children}</div>
    </div>
  );
}

function ChoiceButton({ active, color, onClick, children }: { active: boolean; color: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      style={{ border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 8, background: active ? color : "transparent", color: active ? "#fff" : INK_SECONDARY, padding: "0.58rem 0.55rem", fontWeight: 850, cursor: "pointer" }}
    >
      {children}
    </button>
  );
}

function StepCard({ step, title, body, icon, color }: { step: string; title: string; body: string; icon: ReactNode; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", color, fontWeight: 900 }}>
        <span style={{ display: "grid", placeItems: "center", width: 28, height: 28, borderRadius: 999, background: `${color}22` }}>{step}</span>
        {icon}
        <span>{title}</span>
      </div>
      <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{body}</p>
    </div>
  );
}
