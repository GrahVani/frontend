"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  RefreshCcw,
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

type Verdict = "YES" | "NO" | "CONDITIONAL";

const CUSPS = [
  {
    house: 12,
    sign: "Gemini",
    degree: "12°45'17\"",
    nakshatra: "Ārdrā",
    starLord: "Rāhu",
    subLord: "Mercury",
    subLordColor: GREEN,
    significatorHouses: [12, 9, 3],
    dignity: "debilitated in Pisces (classical neecha-bhaṅga cancelled)",
    rulingPlanet: false,
    aspectCusp: false,
  },
  {
    house: 9,
    sign: "Pisces",
    degree: "7°53'01\"",
    nakshatra: "Uttara Bhādrapada",
    starLord: "Saturn",
    subLord: "Ketu",
    subLordColor: BLUE,
    significatorHouses: [],
    dignity: "neutral",
    rulingPlanet: false,
    aspectCusp: false,
  },
] as const;

const DISCIPLINE_STATEMENTS = [
  {
    key: "conditional",
    label: "CONDITIONAL is just an evasion, not a real verdict.",
    correction:
      "CONDITIONAL is a legitimate output when strong convergence coexists with an unresolved tension, such as the cross-system dignity question.",
  },
  {
    key: "neecha",
    label: "Classical neecha-bhaṅga automatically applies to KP's dignity rule.",
    correction:
      "The cross-system transfer is not asserted here; KP's own dignity convention is treated as a disclosed open question.",
  },
  {
    key: "override",
    label: "The KP 9th-cusp NO disproves the classical 9th-house strength.",
    correction:
      "Two internally consistent frameworks can reach different verdicts. Neither overrides the other.",
  },
] as const;

export function KpForeignTravelCuspTool() {
  const [neechaBhangha, setNeechaBhangha] = useState(false);
  const [mistakes, setMistakes] = useState<Record<string, boolean>>({
    conditional: false,
    neecha: false,
    override: false,
  });

  const twelfthVerdict: Verdict = useMemo(() => {
    const cusp = CUSPS[0];
    const significatorYes = cusp.significatorHouses.length > 0;
    const dignityYes = neechaBhangha; // if cancellation accepted, debility question resolved
    if (significatorYes && dignityYes) return "YES";
    if (significatorYes && !dignityYes) return "CONDITIONAL";
    if (!significatorYes) return "NO";
    return "CONDITIONAL";
  }, [neechaBhangha]);

  const synthesis = useMemo(() => {
    return `12th cusp sub-lord Mercury is a significator of all three travel houses, so it scores a YES on the decisive gate. Dignity remains${
      neechaBhangha
        ? " resolved by accepting classical neecha-bhaṅga, giving a cleaner YES."
        : " unresolved cross-system, keeping the verdict CONDITIONAL, leaning favourable."
    } The 9th cusp sub-lord Ketu is a non-significator of 12/9/3, giving a clean NO. These are two different systems' own verdicts, held separately.`;
  }, [neechaBhangha]);

  function toggleMistake(key: string) {
    setMistakes((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function reset() {
    setNeechaBhangha(false);
    setMistakes({ conditional: false, neecha: false, override: false });
  }

  return (
    <div
      data-interactive="kp-foreign-travel-cusp-tool"
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
            <p style={eyebrowStyle}>Chart T1 — KP foreign-travel cusp tool</p>
            <h2
              style={{
                margin: "0.2rem 0 0",
                color: PURPLE,
                fontSize: "1.28rem",
                fontWeight: 600,
              }}
            >
              12th and 9th cuspal sub-lords tested against disposition rules
            </h2>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.55,
                maxWidth: 920,
              }}
            >
              Apply KP&apos;s cuspal sub-lord doctrine to the foreign-travel significator set (12, 9, 3). Toggle the neecha-bhaṅga assumption for Mercury and compare each cusp&apos;s KP verdict with its classical reading.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RefreshCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Significator set</p>
        <p
          style={{
            margin: "0.35rem 0 0",
            color: INK_SECONDARY,
            lineHeight: 1.55,
          }}
        >
          For a foreign-travel question, the relevant KP significator houses are the 12-9-3 arc: 12th for foreign residence, 9th for long-distance travel, 3rd for short journeys and effort.
        </p>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <CuspCard
          cusp={CUSPS[0]}
          verdict={twelfthVerdict}
          extra={
            <div style={{ marginTop: "0.65rem" }}>
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
                  checked={neechaBhangha}
                  onChange={(e) => setNeechaBhangha(e.target.checked)}
                />
                <span>Accept classical neecha-bhaṅga cancellation for Mercury</span>
              </label>
              <p
                style={{
                  margin: "0.45rem 0 0",
                  color: INK_MUTED,
                  fontSize: "0.82rem",
                  lineHeight: 1.45,
                }}
              >
                KP&apos;s own dignity convention may not automatically import classical cancellation; toggle to see the verdict shift.
              </p>
            </div>
          }
        />
        <CuspCard cusp={CUSPS[1]} verdict="NO" />
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>KP vs classical side-by-side</p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
            gap: "0.75rem",
            marginTop: "0.55rem",
          }}
        >
          <ComparisonCard
            title="12th house / cusp"
            kp={twelfthVerdict === "YES" ? "YES (with neecha-bhaṅga)" : "CONDITIONAL, leaning favourable"}
            classical="Classically strong: Mercury lord (neecha-bhaṅga-cancelled), Rāhu occupant"
            color={PURPLE}
          />
          <ComparisonCard
            title="9th house / cusp"
            kp="NO — Ketu is not a significator of 12/9/3"
            classical="Classically strong: Jupiter rules and occupies Pisces in own sign"
            color={BLUE}
          />
        </div>
      </section>

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
                    <AlertTriangle size={14} style={{ verticalAlign: "middle" }} aria-hidden="true" />{" "}
                    {s.correction}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Integrated reading</p>
        <p
          style={{
            margin: "0.45rem 0 0",
            color: INK_SECONDARY,
            lineHeight: 1.6,
          }}
        >
          {synthesis}
        </p>
      </section>
    </div>
  );
}

function CuspCard({
  cusp,
  verdict,
  extra,
}: {
  cusp: (typeof CUSPS)[number];
  verdict: Verdict;
  extra?: React.ReactNode;
}) {
  const verdictColor =
    verdict === "YES" ? GREEN : verdict === "NO" ? VERMILION : GOLD;
  const verdictIcon =
    verdict === "YES" ? (
      <CheckCircle2 size={18} />
    ) : verdict === "NO" ? (
      <XCircle size={18} />
    ) : (
      <HelpCircle size={18} />
    );

  return (
    <section
      style={{
        ...cardStyle,
        borderColor: `${verdictColor}${"66"}`,
        background: `${verdictColor}${"08"}`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "0.5rem",
          alignItems: "start",
          flexWrap: "wrap",
        }}
      >
        <div>
          <p style={eyebrowStyle}>
            {cusp.house}th cusp
          </p>
          <h3
            style={{
              margin: "0.15rem 0 0",
              color: verdictColor,
              fontSize: "1.2rem",
              fontWeight: 600,
            }}
          >
            {cusp.sign} {cusp.degree}
          </h3>
        </div>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            padding: "0.35rem 0.65rem",
            borderRadius: 8,
            background: verdictColor,
            color: "#fff",
            fontSize: "0.85rem",
            fontWeight: 600,
          }}
        >
          {verdictIcon}
          {verdict}
        </span>
      </div>
      <div
        style={{
          marginTop: "0.55rem",
          color: INK_SECONDARY,
          fontSize: "0.88rem",
          lineHeight: 1.55,
        }}
      >
        <p style={{ margin: "0.25rem 0" }}>
          <span style={{ color: INK_MUTED }}>Nakṣatra:</span> {cusp.nakshatra}
        </p>
        <p style={{ margin: "0.25rem 0" }}>
          <span style={{ color: INK_MUTED }}>Star lord:</span> {cusp.starLord}
        </p>
        <p style={{ margin: "0.25rem 0" }}>
          <span style={{ color: INK_MUTED }}>Sub-lord:</span>{" "}
          <span style={{ color: cusp.subLordColor, fontWeight: 600 }}>{cusp.subLord}</span>
        </p>
        <p style={{ margin: "0.25rem 0" }}>
          <span style={{ color: INK_MUTED }}>Significator of 12/9/3:</span>{" "}
          {cusp.significatorHouses.length > 0
            ? `yes — ${cusp.significatorHouses.join(", ")}`
            : "no"}
        </p>
        <p style={{ margin: "0.25rem 0" }}>
          <span style={{ color: INK_MUTED }}>Dignity:</span> {cusp.dignity}
        </p>
      </div>
      {extra}
    </section>
  );
}

function ComparisonCard({
  title,
  kp,
  classical,
  color,
}: {
  title: string;
  kp: string;
  classical: string;
  color: string;
}) {
  return (
    <div
      style={{
        border: `1px solid ${color}${"44"}`,
        borderRadius: 8,
        background: `${color}${"08"}`,
        padding: "0.85rem",
      }}
    >
      <p
        style={{
          margin: "0 0 0.45rem",
          color,
          fontWeight: 600,
        }}
      >
        {title}
      </p>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.86rem" }}>
        <span style={{ color: PURPLE, fontWeight: 600 }}>KP:</span> {kp}
      </p>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.86rem" }}>
        <span style={{ color: GREEN, fontWeight: 600 }}>Classical:</span> {classical}
      </p>
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
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))",
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
