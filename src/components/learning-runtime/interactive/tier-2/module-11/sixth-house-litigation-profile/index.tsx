"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Gem,
  GraduationCap,
  HandHelping,
  RefreshCcw,
  Scale,
  ShieldAlert,
  Swords,
  XCircle,
} from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";

const SIGNIFICATION_MAP = [
  {
    general: "Śatru — enemies",
    litigation: "Opposing party in a lawsuit",
    icon: <Swords size={16} aria-hidden="true" />,
  },
  {
    general: "Ṛṇa — debts",
    litigation: "Creditor dispute / recovery suit",
    icon: <Scale size={16} aria-hidden="true" />,
  },
  {
    general: "Roga — disease",
    litigation: "Procedural friction, delays, attrition",
    icon: <Clock size={16} aria-hidden="true" />,
  },
  {
    general: "Sevā — service & daily work",
    litigation: "Sustained compliance and disciplined effort",
    icon: <HandHelping size={16} aria-hidden="true" />,
  },
];

const CHART_L1 = {
  lagna: "Virgo",
  sixthSign: "Aquarius",
  lord: "Saturn",
  occupant: "Saturn",
  dignity: "own sign (Makara/Kumbha)",
  note: "Saturn is both lord and sole whole-sign occupant of the 6th — a clean, direct, unambiguous signal.",
};

const DISCIPLINE_STATEMENTS = [
  {
    key: "new-sig",
    label: "Litigation is a separate signification not connected to the 6th house's existing meanings.",
    correction:
      "Litigation is the formal, court-adjudicated instance of śatru and ṛṇa — not a new signification.",
  },
  {
    key: "defeat",
    label: "A difficult 6th house always means the native will lose a dispute.",
    correction:
      "The 6th is also an upachaya; outcomes can improve with sustained effort and persistence.",
  },
  {
    key: "final",
    label: "The whole-sign 6th-house picture is the final, complete reading for Chart L1.",
    correction:
      "Chapter 3's KP cuspal analysis will show a genuine divergence; hold that open in advance.",
  },
] as const;

export function SixthHouseLitigationProfile() {
  const [mode, setMode] = useState<"general" | "litigation">("general");
  const [dualityFace, setDualityFace] = useState<"dusthana" | "upachaya">("dusthana");
  const [mistakes, setMistakes] = useState<Record<string, boolean>>({
    "new-sig": false,
    defeat: false,
    final: false,
  });

  function toggleMistake(key: string) {
    setMistakes((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function reset() {
    setMode("general");
    setDualityFace("dusthana");
    setMistakes({ "new-sig": false, defeat: false, final: false });
  }

  return (
    <div
      data-interactive="sixth-house-litigation-profile"
      style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}
    >
      <section style={cardStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <p style={eyebrowStyle}>Chart L1 — 6th house at predictive depth</p>
            <h2
              style={{
                margin: "0.2rem 0 0",
                color: VERMILION,
                fontSize: "1.28rem",
                fontWeight: 600,
              }}
            >
              Litigation significations revisited
            </h2>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.55,
                maxWidth: 920,
              }}
            >
              Toggle between the 6th house&apos;s general meanings and their litigation-specific formalisation. Inspect Chart L1&apos;s own placement and the house&apos;s dusthāna/upachaya duality.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RefreshCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Signification translator</p>
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            marginTop: "0.55rem",
          }}
        >
          <button
            type="button"
            aria-pressed={mode === "general"}
            onClick={() => setMode("general")}
            style={buttonStyle(mode === "general", BLUE)}
          >
            <GraduationCap size={15} aria-hidden="true" />
            General 6th-house meanings
          </button>
          <button
            type="button"
            aria-pressed={mode === "litigation"}
            onClick={() => setMode("litigation")}
            style={buttonStyle(mode === "litigation", VERMILION)}
          >
            <Scale size={15} aria-hidden="true" />
            Litigation formalisation
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
            gap: "0.75rem",
            marginTop: "0.85rem",
          }}
        >
          {SIGNIFICATION_MAP.map((item, i) => (
            <div
              key={i}
              style={{
                border: `1px solid ${mode === "litigation" ? VERMILION : BLUE}`,
                borderRadius: 8,
                background: `${mode === "litigation" ? VERMILION : BLUE}${"08"}`,
                padding: "0.85rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: mode === "litigation" ? VERMILION : BLUE }}>
                {item.icon}
                <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                  {mode === "general" ? item.general : item.litigation}
                </span>
              </div>
              <p
                style={{
                  margin: "0.4rem 0 0",
                  color: INK_MUTED,
                  fontSize: "0.82rem",
                  lineHeight: 1.5,
                }}
              >
                {mode === "general" ? "Click litigation view to see the court-adjudicated form." : `General root: ${item.general}`}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <Gem size={18} style={{ color: PURPLE }} aria-hidden="true" />
            <p style={eyebrowStyle}>Chart L1 — 6th-house profile</p>
          </div>
          <div
            style={{
              display: "grid",
              gap: "0.55rem",
              marginTop: "0.65rem",
            }}
          >
            <ProfileRow label="Lagna" value={CHART_L1.lagna} />
            <ProfileRow label="6th house sign" value={CHART_L1.sixthSign} />
            <ProfileRow label="Lord" value={CHART_L1.lord} />
            <ProfileRow label="Occupant" value={CHART_L1.occupant} />
            <ProfileRow label="Dignity" value={CHART_L1.dignity} />
          </div>
          <p
            style={{
              margin: "0.75rem 0 0",
              color: INK_SECONDARY,
              lineHeight: 1.6,
            }}
          >
            {CHART_L1.note} The native&apos;s capacity to engage with contests is structurally well-supported by disciplined, persistent, rule-following handling — Saturn&apos;s own signature.
          </p>

          <div
            style={{
              marginTop: "0.85rem",
              padding: "0.75rem",
              borderRadius: 8,
              border: `1px dashed ${PURPLE}`,
              background: `${PURPLE}${"08"}`,
            }}
          >
            <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.86rem", lineHeight: 1.55 }}>
              <ArrowRight size={14} style={{ verticalAlign: "middle" }} aria-hidden="true" />{" "}
              <strong style={{ color: PURPLE, fontWeight: 600 }}>Forward pointer:</strong>{" "}
              Whole-sign gives Saturn as the sole occupant. Chapter 3&apos;s KP cuspal reckoning will add Jupiter into the 6th — hold that divergence open.
            </p>
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Dusthāna + upachaya duality</p>
          <p
            style={{
              margin: "0.35rem 0 0",
              color: INK_SECONDARY,
              fontSize: "0.88rem",
              lineHeight: 1.55,
            }}
          >
            The 6th is both a difficult house and a house that improves with effort. Toggle to see each face.
          </p>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
              marginTop: "0.65rem",
            }}
          >
            <button
              type="button"
              aria-pressed={dualityFace === "dusthana"}
              onClick={() => setDualityFace("dusthana")}
              style={buttonStyle(dualityFace === "dusthana", VERMILION)}
            >
              <XCircle size={15} aria-hidden="true" />
              Dusthāna face
            </button>
            <button
              type="button"
              aria-pressed={dualityFace === "upachaya"}
              onClick={() => setDualityFace("upachaya")}
              style={buttonStyle(dualityFace === "upachaya", GREEN)}
            >
              <CheckCircle2 size={15} aria-hidden="true" />
              Upachaya face
            </button>
          </div>
          <div
            style={{
              marginTop: "0.75rem",
              padding: "0.85rem",
              borderRadius: 8,
              border: `1px solid ${dualityFace === "dusthana" ? VERMILION : GREEN}`,
              background: `${dualityFace === "dusthana" ? VERMILION : GREEN}${"08"}`,
            }}
          >
            <p
              style={{
                margin: 0,
                color: INK_SECONDARY,
                lineHeight: 1.6,
              }}
            >
              {dualityFace === "dusthana"
                ? "The 6th is a dusthāna: it brings enemies, debts, disease, obstacles, and the stress of contests. Early setbacks in litigation are real and must not be dismissed."
                : "The 6th is an upachaya: it improves with sustained effort and the passage of time. A protracted matter can genuinely shift in the native's favour through persistence and disciplined handling."}
            </p>
          </div>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Discipline checks</p>
        <p
          style={{
            margin: "0.35rem 0 0",
            color: INK_SECONDARY,
            fontSize: "0.88rem",
            lineHeight: 1.5,
          }}
        >
          Mark each false statement to reveal the correction.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "0.75rem",
            marginTop: "0.65rem",
          }}
        >
          {DISCIPLINE_STATEMENTS.map((s) => {
            const active = mistakes[s.key];
            return (
              <div
                key={s.key}
                style={{
                  border: `1px solid ${active ? VERMILION : HAIRLINE}`,
                  borderRadius: 8,
                  background: active ? `${VERMILION}${"0A"}` : "transparent",
                  padding: "0.75rem",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "start",
                    gap: "0.55rem",
                    color: INK_SECONDARY,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggleMistake(s.key)}
                  />
                  <span>{s.label}</span>
                </label>
                {active ? (
                  <p
                    style={{
                      margin: "0.55rem 0 0",
                      color: VERMILION,
                      fontSize: "0.86rem",
                      lineHeight: 1.5,
                    }}
                  >
                    <ShieldAlert size={14} style={{ verticalAlign: "middle" }} aria-hidden="true" />{" "}
                    {s.correction}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "0.75rem",
        padding: "0.45rem 0",
        borderBottom: `1px solid ${HAIRLINE}`,
      }}
    >
      <span style={{ color: INK_MUTED, fontSize: "0.86rem" }}>{label}</span>
      <span style={{ color: INK_PRIMARY, fontWeight: 600, fontSize: "0.86rem" }}>{value}</span>
    </div>
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

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  boxShadow: "var(--gl-shadow-soft)",
};

const responsiveTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
  gap: "1rem",
  alignItems: "start",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
