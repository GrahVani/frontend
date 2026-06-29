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

const HOUSES: Record<HouseKey, { label: string; domain: string; friction: string; content: string; icon: LucideIcon }> = {
  "4": { label: "4th house", domain: "Home, mother, inner security", friction: "Disruption to domestic peace, feeling unrooted, heaviness around mother.", content: "Non-attachment to comfort; building inner steadiness without depending on perfect circumstances.", icon: Home },
  "5": { label: "5th house", domain: "Children, learning, creativity", friction: "Delays in having children, heavy responsibilities, creative blockages.", content: "Patience with joy, study, students, and the fruits of intelligence.", icon: Sparkles },
  "7": { label: "7th house", domain: "Marriage, partnership, contracts", friction: "Delays in marriage, coldness in partnerships, heavy contractual obligations.", content: "Humility, long commitment, honest boundaries, and mature reciprocity.", icon: HeartHandshake },
  "8": { label: "8th house", domain: "Karma, transformation, hidden material", friction: "Sudden disruptions, chronic anxieties, feeling blocked by unseen forces.", content: "Endurance through uncertainty; depth, research, occult seriousness, and resilience.", icon: ShieldCheck },
  "10": { label: "10th house", domain: "Career, duty, public work", friction: "Delays in career advancement, intense pressure at work, friction with authority.", content: "Patient career-building, service, responsibility, and respect earned slowly.", icon: Briefcase },
};

const CONDITIONS: Record<ConditionKey, { label: string; mode: string; frictionModifier: string; color: string; tone: string }> = {
  exalted: { label: "Exalted / own", mode: "Measured discipline", frictionModifier: "The restriction is steady and predictable.", color: GREEN, tone: "The judge is firm but fair. Pressure becomes structure." },
  friendly: { label: "Friendly", mode: "Manageable restriction", frictionModifier: "The difficulty is manageable with effort.", color: GOLD, tone: "The lesson is real, but the native can cooperate with it." },
  afflicted: { label: "Afflicted", mode: "Heavy friction", frictionModifier: "The obstacles are sudden and painful.", color: RED, tone: "The difficulty is more visible. Counsel must name pain and instruction together." },
  debilitated: { label: "Debilitated", mode: "Intense correction", frictionModifier: "The blockages feel completely overwhelming.", color: "#6B7280", tone: "The lesson feels like blockage first. Patient rebuilding is the medicine." },
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

        <section style={{ display: "grid", gap: "0.85rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1.5rem" }} aria-label="Paradox Card">
          
          <h3 style={{ margin: "0 0 1rem", color: SHANI_DEEP, fontSize: "1.25rem", textAlign: "center" }}>
            The Paradox Card: {house.label}
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {/* Left Half: The Malefic (Friction) */}
            <div style={{ background: SHANI_DEEP, color: "white", borderRadius: 8, padding: "1.25rem", position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem", color: "rgba(255,255,255,0.8)" }}>
                <ShieldCheck size={20} />
                <h4 style={{ margin: 0, textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "0.05em" }}>The Malefic (Friction)</h4>
              </div>
              <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.5 }}>
                {house.friction} <br/><br/>
                <span style={{ opacity: 0.8, fontStyle: "italic" }}>Mode: {condition.frictionModifier}</span>
              </p>
            </div>

            {/* Right Half: The Teacher (Curriculum) */}
            <div style={{ border: `1px solid ${GOLD}44`, background: "rgba(184, 135, 25, 0.05)", borderRadius: 8, padding: "1.25rem", position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem", color: GOLD }}>
                <Sparkles size={20} />
                <h4 style={{ margin: 0, textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "0.05em" }}>The Teacher (Curriculum)</h4>
              </div>
              <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.5, color: INK_PRIMARY }}>
                {house.content} <br/><br/>
                <span style={{ color: INK_SECONDARY, fontStyle: "italic" }}>Mode: {condition.tone}</span>
              </p>
            </div>
          </div>

          {/* Remedy Interaction */}
          <div style={{ 
            marginTop: "1.5rem", 
            borderTop: `1px solid ${HAIRLINE}`, 
            paddingTop: "1.5rem",
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center",
            gap: "1rem" 
          }}>
            <button
              type="button"
              aria-pressed={remedyApplied}
              onClick={() => setRemedyApplied((value) => !value)}
              style={{ 
                border: `1px solid ${remedyApplied ? GOLD : HAIRLINE}`, 
                borderRadius: 999, 
                background: remedyApplied ? GOLD : "transparent", 
                color: remedyApplied ? "#fff" : INK_SECONDARY, 
                padding: "0.6rem 1.2rem", 
                fontWeight: 850, 
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
            >
              {remedyApplied ? "Grace Applied" : "Apply Remedy"}
            </button>

            {remedyApplied && (
              <div style={{ 
                background: "rgba(184, 135, 25, 0.1)", 
                border: `1px dashed ${GOLD}`, 
                borderRadius: 8, 
                padding: "1rem", 
                textAlign: "center",
                animation: "fadeIn 0.5s ease" 
              }}>
                <p style={{ margin: 0, color: GOLD, fontWeight: 700, marginBottom: "0.5rem" }}>Remedy: {remedy.label}</p>
                <p style={{ margin: 0, color: INK_PRIMARY, fontSize: "0.95rem", lineHeight: 1.5 }}>
                  The friction remains, but your capacity to endure it gracefully expands. {remedy.action}
                </p>
              </div>
            )}
          </div>
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
