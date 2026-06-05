"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { ArrowRight, BadgeCheck, Calculator, Grid2X2, RotateCcw, Sparkles } from "lucide-react";

type Fixed = "friend" | "neutral" | "enemy";
type Temporary = "friend" | "enemy";

interface Tier {
  key: string;
  sanskrit: string;
  english: string;
  score: number;
  color: string;
  reading: string;
}

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const GOLD = "#B88421";
const BLUE = "#356CAB";
const SATURN = "#4F5664";

const TIERS: Record<string, Tier> = {
  "friend-friend": {
    key: "adhi-mitra",
    sanskrit: "Adhi-mitra",
    english: "Great friend",
    score: 2,
    color: GREEN,
    reading: "Two layers support each other. This is the most helpful contact.",
  },
  "neutral-friend": {
    key: "mitra",
    sanskrit: "Mitra",
    english: "Friend",
    score: 1,
    color: "#3A8C5A",
    reading: "The temporary layer adds support where nature was neutral.",
  },
  "friend-enemy": {
    key: "sama",
    sanskrit: "Sama",
    english: "Neutral",
    score: 0,
    color: GOLD,
    reading: "One friendship layer and one enmity layer cancel to balance.",
  },
  "enemy-friend": {
    key: "sama",
    sanskrit: "Sama",
    english: "Neutral",
    score: 0,
    color: GOLD,
    reading: "Natural hostility is softened by chart-specific support.",
  },
  "neutral-enemy": {
    key: "shatru",
    sanskrit: "Shatru",
    english: "Enemy",
    score: -1,
    color: VERMILION,
    reading: "The temporary layer makes an otherwise neutral contact difficult.",
  },
  "enemy-enemy": {
    key: "adhi-shatru",
    sanskrit: "Adhi-shatru",
    english: "Great enemy",
    score: -2,
    color: "#8E2E22",
    reading: "Both layers stress the contact. This is the most difficult tier.",
  },
};

const FIXED_OPTIONS: { key: Fixed; label: string; note: string }[] = [
  { key: "friend", label: "Fixed friend", note: "Naisargika friend" },
  { key: "neutral", label: "Fixed neutral", note: "Naisargika neutral" },
  { key: "enemy", label: "Fixed enemy", note: "Naisargika enemy" },
];

const TEMP_OPTIONS: { key: Temporary; label: string; note: string }[] = [
  { key: "friend", label: "Temporary friend", note: "2/3/4/10/11/12" },
  { key: "enemy", label: "Temporary enemy", note: "1/5/6/7/8/9" },
];

const PRESETS = [
  { label: "Great enemy", fixed: "enemy" as Fixed, temporary: "enemy" as Temporary, note: "Sun-Saturn natural enemy plus temporary enemy houses." },
  { label: "Cancel to neutral", fixed: "friend" as Fixed, temporary: "enemy" as Temporary, note: "Fixed friend but chart-position pushes back." },
  { label: "Great friend", fixed: "friend" as Fixed, temporary: "friend" as Temporary, note: "Mercury-Venus style support in both layers." },
  { label: "Plain friend", fixed: "neutral" as Fixed, temporary: "friend" as Temporary, note: "Nature is neutral; the chart gives support." },
];

function combine(fixed: Fixed, temporary: Temporary): Tier {
  return TIERS[`${fixed}-${temporary}`];
}

export function PanchadhaCombiner() {
  const [fixed, setFixed] = useState<Fixed>("enemy");
  const [temporary, setTemporary] = useState<Temporary>("enemy");
  const result = combine(fixed, temporary);

  return (
    <div data-interactive="panchadha-combiner" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Panchadha friendship
            </p>
            <h2 style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.35rem" }}>
              Combine fixed nature with temporary chart position
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setFixed("enemy");
              setTemporary("enemy");
            }}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "transparent", color: INK_SECONDARY, padding: "0.55rem 0.75rem", fontWeight: 850, cursor: "pointer" }}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: "1rem", alignItems: "start" }}>
        <section style={{ display: "grid", gap: "0.85rem" }} aria-label="Compound friendship controls">
          <Panel title="1. Fixed layer" icon={<Grid2X2 size={18} />} color={BLUE}>
            <ChoiceGrid>
              {FIXED_OPTIONS.map((option) => (
                <ChoiceButton
                  key={option.key}
                  active={fixed === option.key}
                  label={option.label}
                  note={option.note}
                  color={option.key === "friend" ? GREEN : option.key === "enemy" ? VERMILION : GOLD}
                  onClick={() => setFixed(option.key)}
                />
              ))}
            </ChoiceGrid>
          </Panel>

          <Panel title="2. Temporary layer" icon={<Calculator size={18} />} color={SATURN}>
            <ChoiceGrid>
              {TEMP_OPTIONS.map((option) => (
                <ChoiceButton
                  key={option.key}
                  active={temporary === option.key}
                  label={option.label}
                  note={option.note}
                  color={option.key === "friend" ? GREEN : VERMILION}
                  onClick={() => setTemporary(option.key)}
                />
              ))}
            </ChoiceGrid>
          </Panel>

          <section style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }} aria-label="Worked presets">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setFixed(preset.fixed);
                  setTemporary(preset.temporary);
                }}
                title={preset.note}
                style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "transparent", color: INK_SECONDARY, padding: "0.52rem 0.65rem", fontWeight: 850, cursor: "pointer" }}
              >
                {preset.label}
              </button>
            ))}
          </section>
        </section>

        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }} aria-label="Panchadha combination matrix">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: BLUE, fontWeight: 950, marginBottom: "0.8rem" }}>
            <Sparkles size={18} aria-hidden="true" />
            3 x 2 combination matrix
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "128px repeat(2, minmax(0, 1fr))", gap: "0.5rem", alignItems: "stretch" }}>
            <div />
            {TEMP_OPTIONS.map((temp) => (
              <Header key={temp.key} label={temp.label} />
            ))}
            {FIXED_OPTIONS.map((fixedOption) => (
              <Row key={fixedOption.key} fixedOption={fixedOption} activeFixed={fixed} activeTemporary={temporary} onPick={(nextFixed, nextTemporary) => {
                setFixed(nextFixed);
                setTemporary(nextTemporary);
              }} />
            ))}
          </div>
          <p style={{ margin: "0.8rem 0 0", color: INK_MUTED, lineHeight: 1.5 }}>
            Like layers reinforce; opposite layers cancel. Fixed neutral becomes plain friend or enemy depending on the temporary layer.
          </p>
        </section>
      </div>

      <section style={{ border: `1px solid ${result.color}55`, borderRadius: 8, background: `${result.color}12`, padding: "1rem" }} aria-label="Compound verdict">
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: "1rem", alignItems: "center" }}>
          <div>
            <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.76rem", fontWeight: 950, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              3. Combine
            </p>
            <h3 style={{ margin: "0.2rem 0 0", color: result.color, fontSize: "1.35rem" }}>
              {result.sanskrit}: {result.english}
            </h3>
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
              {result.reading}
            </p>
          </div>
          <div style={{ display: "grid", gap: "0.35rem", justifyItems: "center", color: result.color, fontWeight: 950 }}>
            <span style={{ fontSize: "2.2rem", lineHeight: 1 }}>{result.score > 0 ? `+${result.score}` : result.score}</span>
            <span>score cue</span>
          </div>
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "0.8rem" }} aria-label="Four step method">
        <Step title="Fixed" body="Read the directed natural friendship cell from the last lesson." />
        <Step title="Temporary" body="Count the house-position relation from this chart." />
        <Step title="Combine" body="Use the matrix: reinforce, cancel, or become plain friend/enemy." />
        <Step title="Apply" body="Read conjunctions, aspects, or shared houses through the compound tier." />
      </section>
    </div>
  );
}

function ChoiceGrid({ children }: { children: ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(145px, 1fr))", gap: "0.6rem" }}>{children}</div>;
}

function ChoiceButton({ active, label, note, color, onClick }: { active: boolean; label: string; note: string; color: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      style={{
        border: `1px solid ${active ? color : HAIRLINE}`,
        borderRadius: 8,
        background: active ? `${color}18` : "transparent",
        color: active ? color : INK_SECONDARY,
        padding: "0.72rem",
        minHeight: 82,
        textAlign: "left",
        fontWeight: 900,
        cursor: "pointer",
      }}
    >
      <span style={{ display: "block" }}>{label}</span>
      <span style={{ display: "block", marginTop: "0.25rem", color: INK_MUTED, fontSize: "0.78rem", fontWeight: 750 }}>{note}</span>
    </button>
  );
}

function Header({ label }: { label: string }) {
  return (
    <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "rgba(255,251,241,0.72)", padding: "0.6rem", color: INK_MUTED, fontWeight: 950, textAlign: "center" }}>
      {label}
    </div>
  );
}

function Row({ fixedOption, activeFixed, activeTemporary, onPick }: { fixedOption: { key: Fixed; label: string }; activeFixed: Fixed; activeTemporary: Temporary; onPick: (fixed: Fixed, temporary: Temporary) => void }) {
  return (
    <>
      <Header label={fixedOption.label} />
      {TEMP_OPTIONS.map((temp) => {
        const tier = combine(fixedOption.key, temp.key);
        const active = activeFixed === fixedOption.key && activeTemporary === temp.key;
        return (
          <button
            key={`${fixedOption.key}-${temp.key}`}
            type="button"
            onClick={() => onPick(fixedOption.key, temp.key)}
            style={{
              border: `2px solid ${active ? tier.color : `${tier.color}44`}`,
              borderRadius: 8,
              background: active ? `${tier.color}20` : SURFACE,
              color: tier.color,
              padding: "0.75rem 0.55rem",
              minHeight: 86,
              cursor: "pointer",
              fontWeight: 950,
            }}
          >
            <span style={{ display: "block" }}>{tier.sanskrit}</span>
            <span style={{ display: "block", marginTop: "0.25rem", color: INK_SECONDARY, fontWeight: 800 }}>{tier.english}</span>
          </button>
        );
      })}
    </>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 950 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function Step({ title, body }: { title: string; body: string }) {
  return (
    <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "0.9rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: BLUE, fontWeight: 950 }}>
        <BadgeCheck size={16} aria-hidden="true" />
        {title}
        <ArrowRight size={14} aria-hidden="true" />
      </div>
      <p style={{ margin: "0.4rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{body}</p>
    </div>
  );
}
