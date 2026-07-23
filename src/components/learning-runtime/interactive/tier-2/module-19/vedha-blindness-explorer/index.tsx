"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  RotateCcw,
  ShieldAlert,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type Variant = "omission" | "override";
type DraftVersion = "blind" | "corrected";
type VedhaStatus = "clear" | "transitObstructed" | "natalOpen";
type ProvenanceKey = "priorConcern" | "newName";
type MistakeKey = "assumedOriginal" | "equalSeverity" | "natalResolved";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const AMBER = "#B88421";
const VERMILION = "#A23A1E";
const TEAL = "#2E7D7A";
const PURPLE = "#6B5AA8";

const VARIANTS: Record<Variant, { label: string; color: string; severity: string; body: string; correction: string }> = {
  omission: {
    label: "Omission variant",
    color: AMBER,
    severity: "Missed step",
    body: "The vedha check simply never appears in the draft. The practitioner forgot to run Step 3's obstruction check.",
    correction: "Add the specific vedha-point to the claim: '...pending a check of Aries, the vedha-point for Saturn's Libra transit.'",
  },
  override: {
    label: "Override variant",
    color: VERMILION,
    severity: "Discipline failure",
    body: "The check was performed, an obstruction was found, and the prediction was made anyway on unsourced grounds.",
    correction: "Withhold the event claim and look for the next unobstructed contact, rather than overriding a sourced classical rule.",
  },
};

const VEDHA_STATUS: Record<VedhaStatus, { label: string; color: string; result: string }> = {
  clear: { label: "Aries clear", color: GREEN, result: "The Saturn-into-Libra trigger is vedha-clear. A T-D-V-complete claim can be stated, still as a window rather than a date." },
  transitObstructed: { label: "Aries occupied by a co-transiting planet", color: VERMILION, result: "The promised good is suspended. The trigger does not fire this time; wait for the next unobstructed contact." },
  natalOpen: { label: "Aries occupied by Kavya's natal Mars only", color: AMBER, result: "Genuinely unresolved. The module uses the standard reading (natal placement not an automatic standing vedha) and discloses the alternative as open." },
};

const PROVENANCE: Record<ProvenanceKey, { label: string; fact: string }> = {
  priorConcern: { label: "Underlying concern is prior", fact: "T2-01 Lesson 1.1.4 already listed 'Common Mistake #3: Ignoring vedha' with a worked example." },
  newName: { label: "Formal name is new", fact: "The name 'vedha-blindness' and its treatment as a numbered failure mode are this module's own contribution." },
};

const MISTAKES: Record<MistakeKey, { label: string; heldText: string; releasedText: string }> = {
  assumedOriginal: {
    label: "Vedha-blindness is not one of T2-01's original eight modes",
    heldText: "Held: the name and formal treatment are new; the underlying concern is already present in T2-01 1.1.4.",
    releasedText: "Warning: presenting it as long-catalogued misrepresents its actual provenance.",
  },
  equalSeverity: {
    label: "Omission and override are not equally serious",
    heldText: "Held: omission is a missed step; override is a discipline failure after the check was run.",
    releasedText: "Warning: treating both the same blurs the corrective conversation.",
  },
  natalResolved: {
    label: "Do not resolve the natal-vs-transit vedha question with false confidence",
    heldText: "Held: the module uses the standard reading and discloses the alternative as genuinely open.",
    releasedText: "Warning: inventing certainty either way exceeds what T1-11's text supports.",
  },
};

export function VedhaBlindnessExplorer() {
  const [variant, setVariant] = useState<Variant>("omission");
  const [draftVersion, setDraftVersion] = useState<DraftVersion>("blind");
  const [vedhaStatus, setVedhaStatus] = useState<VedhaStatus>("natalOpen");
  const [provenance, setProvenance] = useState<Record<ProvenanceKey, boolean>>({ priorConcern: true, newName: true });
  const [mistakes, setMistakes] = useState<Record<MistakeKey, boolean>>({
    assumedOriginal: true, equalSeverity: true, natalResolved: true,
  });

  const allMistakesHeld = Object.values(mistakes).every(Boolean);
  const provenanceComplete = Object.values(provenance).every(Boolean);

  function reset() {
    setVariant("omission");
    setDraftVersion("blind");
    setVedhaStatus("natalOpen");
    setProvenance({ priorConcern: true, newName: true });
    setMistakes({ assumedOriginal: true, equalSeverity: true, natalResolved: true });
  }

  return (
    <div data-interactive="vedha-blindness-explorer" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Module 19 · Failure mode 3</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Vedha-blindness explorer
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Daśā and transit are correctly identified and connected, but the vedha obstruction check is missing or ignored — this module&apos;s own named formalisation of an already-recognised problem.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Structural signature</p>
        <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
          The remaining 2-of-3 T-D-V combination
        </h3>
        <SignatureSvg />
        <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
          Vedha-blindness sits at Daśā + Transit, no Vedha. Modes 2 and 3 occupied the other two missing-leg cases; this lesson names the third.
        </p>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 480px" }}>
          <p style={eyebrowStyle}>Variants</p>
          <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
            Omission vs override
          </h3>
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
            {(["omission", "override"] as Variant[]).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={variant === v}
                onClick={() => setVariant(v)}
                style={buttonStyle(variant === v, VARIANTS[v].color)}
              >
                {VARIANTS[v].label}
              </button>
            ))}
          </div>
          <VariantSvg active={variant} />
          <div
            style={{
              marginTop: "0.75rem",
              padding: "0.75rem",
              borderRadius: 8,
              border: `1px solid ${VARIANTS[variant].color}55`,
              background: `${VARIANTS[variant].color}10`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: VARIANTS[variant].color, fontWeight: 600 }}>
              <ShieldAlert size={18} aria-hidden="true" /> {VARIANTS[variant].label} — {VARIANTS[variant].severity}
            </div>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{VARIANTS[variant].body}</p>
            <p style={{ margin: "0.45rem 0 0", color: GREEN, lineHeight: 1.55 }}>Correction: {VARIANTS[variant].correction}</p>
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 320px" }}>
          <Panel title="Provenance" icon={<Lightbulb size={18} />} color={PURPLE}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
              Toggle both to see the honest boundary between prior source and new naming.
            </p>
            <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.65rem" }}>
              {(Object.keys(PROVENANCE) as ProvenanceKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={provenance[key]}
                  onClick={() => setProvenance((p) => ({ ...p, [key]: !p[key] }))}
                  style={{
                    textAlign: "left",
                    border: `1px solid ${provenance[key] ? PURPLE : HAIRLINE}`,
                    borderRadius: 8,
                    background: provenance[key] ? `${PURPLE}10` : "transparent",
                    color: provenance[key] ? PURPLE : INK_SECONDARY,
                    padding: "0.65rem 0.75rem",
                    cursor: "pointer",
                  }}
                >
                  <strong style={{ fontWeight: 600, display: "block", marginBottom: "0.25rem" }}>{PROVENANCE[key].label}</strong>
                  <span style={{ color: provenance[key] ? INK_PRIMARY : INK_SECONDARY }}>{PROVENANCE[key].fact}</span>
                </button>
              ))}
            </div>
            <div
              style={{
                marginTop: "0.65rem",
                padding: "0.55rem 0.75rem",
                borderRadius: 8,
                background: provenanceComplete ? `${GREEN}12` : `${AMBER}12`,
                border: `1px solid ${provenanceComplete ? GREEN : AMBER}55`,
                color: provenanceComplete ? GREEN : AMBER,
                fontWeight: 600,
              }}
            >
              {provenanceComplete
                ? "Both halves held: the concern is prior, the formal name is this module's own."
                : "Toggle the remaining provenance fact to keep the attribution honest."}
            </div>
          </Panel>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Kavya Scenario A</p>
        <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
          Saturn in Libra, vedha-point Aries — diagnose and rewrite
        </h3>
        <KavyaVedhaSvg />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "0.75rem" }}>
          {(["blind", "corrected"] as DraftVersion[]).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={draftVersion === v}
              onClick={() => setDraftVersion(v)}
              style={buttonStyle(draftVersion === v, v === "blind" ? VERMILION : GREEN)}
            >
              {v === "blind" ? "Vedha-blind draft" : "Corrected draft"}
            </button>
          ))}
        </div>
        <div
          style={{
            marginTop: "0.75rem",
            padding: "0.75rem",
            borderRadius: 8,
            border: `1px solid ${draftVersion === "blind" ? VERMILION : GREEN}55`,
            background: draftVersion === "blind" ? `${VERMILION}10` : `${GREEN}10`,
            color: draftVersion === "blind" ? VERMILION : GREEN,
          }}
        >
          {draftVersion === "blind" ? (
            <p style={{ margin: 0, lineHeight: 1.55 }}>
              &ldquo;Saturn&apos;s entry into Libra, during Kavya&apos;s Moon/Jupiter antardaśā, is a confirmed positive trigger.&rdquo;
              <br /><br />
              <span style={{ color: INK_SECONDARY }}>Diagnosis: Daśā and transit are correctly connected, but Aries (the vedha-point) is never mentioned. This is the omission variant of vedha-blindness.</span>
            </p>
          ) : (
            <p style={{ margin: 0, lineHeight: 1.55 }}>
              &ldquo;Saturn&apos;s entry into Libra, during Kavya&apos;s Moon/Jupiter antardaśā, is a candidate positive trigger, pending a vedha check on Aries — the corresponding obstruction point — before it can be treated as confirmed.&rdquo;
            </p>
          )}
        </div>

        <div style={{ marginTop: "0.85rem" }}>
          <p style={eyebrowStyle}>Vedha-status chooser</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "0.55rem" }}>
            {(["clear", "transitObstructed", "natalOpen"] as VedhaStatus[]).map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={vedhaStatus === s}
                onClick={() => setVedhaStatus(s)}
                style={buttonStyle(vedhaStatus === s, VEDHA_STATUS[s].color)}
              >
                {VEDHA_STATUS[s].label}
              </button>
            ))}
          </div>
          <div
            style={{
              marginTop: "0.65rem",
              padding: "0.75rem",
              borderRadius: 8,
              border: `1px solid ${VEDHA_STATUS[vedhaStatus].color}55`,
              background: `${VEDHA_STATUS[vedhaStatus].color}10`,
              color: VEDHA_STATUS[vedhaStatus].color,
            }}
          >
            {VEDHA_STATUS[vedhaStatus].result}
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Hold the discipline</p>
        <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.75rem" }}>
          {(Object.keys(MISTAKES) as MistakeKey[]).map((key) => {
            const held = mistakes[key];
            return (
              <button
                key={key}
                type="button"
                aria-pressed={held}
                onClick={() => setMistakes((m) => ({ ...m, [key]: !held }))}
                style={togglePanelStyle(held, held ? GREEN : VERMILION)}
              >
                {held ? <CheckCircle2 size={18} aria-hidden="true" /> : <AlertTriangle size={18} aria-hidden="true" />}
                <span>
                  <strong style={{ fontWeight: 600 }}>{MISTAKES[key].label}</strong>
                  <span style={{ color: held ? INK_SECONDARY : VERMILION }}> — {held ? MISTAKES[key].heldText : MISTAKES[key].releasedText}</span>
                </span>
              </button>
            );
          })}
        </div>
        <div
          style={{
            marginTop: "0.75rem",
            padding: "0.65rem 0.85rem",
            borderRadius: 8,
            background: allMistakesHeld ? `${GREEN}12` : `${VERMILION}12`,
            border: `1px solid ${allMistakesHeld ? GREEN : VERMILION}55`,
            color: allMistakesHeld ? GREEN : VERMILION,
            fontWeight: 600,
          }}
        >
          {allMistakesHeld
            ? "All discipline commitments are held. Vedha-blindness is named precisely and the open question is disclosed."
            : `${Object.keys(MISTAKES).length - Object.values(mistakes).filter(Boolean).length} discipline commitment(s) released. Review the warnings above.`}
        </div>
      </section>
    </div>
  );
}

function SignatureSvg() {
  return (
    <svg viewBox="0 0 560 220" role="img" aria-label="T-D-V structural signature with vedha blindness highlighted" style={{ width: "100%", maxHeight: 220, margin: "0.55rem auto 0.25rem", display: "block" }}>
      {/* Daśā */}
      <rect x="40" y="80" width="120" height="60" rx="8" fill={`${AMBER}18`} stroke={AMBER} strokeWidth="2" />
      <text x="100" y="105" textAnchor="middle" fill={AMBER} fontSize="13" fontWeight={600}>Daśā</text>
      <text x="100" y="125" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight={600}>window</text>

      {/* Transit */}
      <rect x="220" y="80" width="120" height="60" rx="8" fill={`${BLUE}18`} stroke={BLUE} strokeWidth="2" />
      <text x="280" y="105" textAnchor="middle" fill={BLUE} fontSize="13" fontWeight={600}>Transit</text>
      <text x="280" y="125" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight={600}>trigger</text>

      {/* Vedha */}
      <rect x="400" y="80" width="120" height="60" rx="8" fill={`${TEAL}10`} stroke={HAIRLINE} strokeWidth="2" strokeDasharray="6 4" />
      <text x="460" y="105" textAnchor="middle" fill={INK_MUTED} fontSize="13" fontWeight={600}>Vedha</text>
      <text x="460" y="125" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight={600}>missing</text>

      {/* plus signs */}
      <text x="180" y="115" textAnchor="middle" fill={INK_MUTED} fontSize="18" fontWeight={600}>+</text>
      <text x="360" y="115" textAnchor="middle" fill={INK_MUTED} fontSize="18" fontWeight={600}>+</text>

      {/* arrow down */}
      <line x1="280" y1="150" x2="280" y2="175" stroke={VERMILION} strokeWidth="3" />
      <polygon points="280,185 274,175 286,175" fill={VERMILION} />

      <rect x="110" y="185" width="340" height="30" rx="6" fill={`${VERMILION}12`} stroke={VERMILION} strokeWidth="2" />
      <text x="280" y="205" textAnchor="middle" fill={VERMILION} fontSize="13" fontWeight={600}>Vedha-blindness: D + T confirmed, V absent</text>
    </svg>
  );
}

function VariantSvg({ active }: { active: Variant }) {
  return (
    <svg viewBox="0 0 560 160" role="img" aria-label="Omission versus override variants" style={{ width: "100%", maxHeight: 160, margin: "0.55rem auto 0.25rem", display: "block" }}>
      <rect x="30" y="30" width="220" height="100" rx="8" fill={active === "omission" ? `${AMBER}10` : "transparent"} stroke={active === "omission" ? AMBER : HAIRLINE} strokeWidth="2" />
      <text x="140" y="58" textAnchor="middle" fill={active === "omission" ? AMBER : INK_MUTED} fontSize="13" fontWeight={600}>Omission</text>
      <text x="140" y="80" textAnchor="middle" fill={INK_SECONDARY} fontSize="11" fontWeight={600}>Vedha check</text>
      <text x="140" y="96" textAnchor="middle" fill={INK_SECONDARY} fontSize="11" fontWeight={600}>never performed</text>
      <text x="140" y="120" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight={600}>missed step</text>

      <rect x="310" y="30" width="220" height="100" rx="8" fill={active === "override" ? `${VERMILION}10` : "transparent"} stroke={active === "override" ? VERMILION : HAIRLINE} strokeWidth="2" />
      <text x="420" y="58" textAnchor="middle" fill={active === "override" ? VERMILION : INK_MUTED} fontSize="13" fontWeight={600}>Override</text>
      <text x="420" y="80" textAnchor="middle" fill={INK_SECONDARY} fontSize="11" fontWeight={600}>Vedha check</text>
      <text x="420" y="96" textAnchor="middle" fill={INK_SECONDARY} fontSize="11" fontWeight={600}>performed, then ignored</text>
      <text x="420" y="120" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight={600}>discipline failure</text>
    </svg>
  );
}

function KavyaVedhaSvg() {
  return (
    <svg viewBox="0 0 560 200" role="img" aria-label="Saturn Libra transit and Aries vedha point" style={{ width: "100%", maxHeight: 200, margin: "0.55rem auto 0.25rem", display: "block" }}>
      <path d="M 80 150 A 200 200 0 0 1 480 150" fill="none" stroke={HAIRLINE} strokeWidth="2" strokeLinecap="round" />

      {/* Moon / Sagittarius reference */}
      <g transform="translate(150 70)">
        <circle r="24" fill={`${AMBER}18`} stroke={AMBER} strokeWidth="2" />
        <text textAnchor="middle" fill={AMBER} fontSize="10" fontWeight={600}>Sagittarius</text>
        <text y="12" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight={600}>natal Moon</text>
      </g>

      {/* Saturn transit / Libra */}
      <g transform="translate(280 50)">
        <circle r="32" fill={`${BLUE}18`} stroke={BLUE} strokeWidth="3" />
        <text textAnchor="middle" fill={BLUE} fontSize="12" fontWeight={600}>Libra</text>
        <text y="14" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight={600}>Saturn transit</text>
        <text y="26" textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight={600}>11th from Moon</text>
      </g>

      {/* Aries vedha-point */}
      <g transform="translate(410 70)">
        <circle r="28" fill={`${TEAL}18`} stroke={TEAL} strokeWidth="2" />
        <text textAnchor="middle" fill={TEAL} fontSize="11" fontWeight={600}>Aries</text>
        <text y="12" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight={600}>vedha-point</text>
        <text y="24" textAnchor="middle" fill={VERMILION} fontSize="9" fontWeight={600}>natal Mars</text>
      </g>

      <text x="280" y="180" textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight={600}>Saturn&apos;s Libra trigger is only confirmed after Aries is checked</text>
    </svg>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 600 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.55rem 0.75rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function togglePanelStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "24px 1fr",
    gap: "0.65rem",
    alignItems: "start",
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}14` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.75rem",
    cursor: "pointer",
  };
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
