"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Compass,
  Eye,
  MapPinned,
  RotateCcw,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type SystemKey = "vimshottari" | "cara" | "sthira" | "kalachakra";
type MistakeKey = "real" | "fix" | "pointless";
type RouteChoice = "invent" | "notReal" | "refuse" | "honest" | null;

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
const PURPLE = "#6B5AA8";

const SYSTEMS: Record<SystemKey, {
  label: string;
  stream: string;
  status: string;
  color: string;
  icon: ReactNode;
  detail: string;
}> = {
  vimshottari: {
    label: "Vimśottarī",
    stream: "Parāśarī",
    status: "Computed & used throughout",
    color: BLUE,
    icon: <Compass size={18} aria-hidden="true" />,
    detail:
      "Planet-based, Moon-nakṣatra-anchored, fixed 120-year cycle. This module’s anchor timing system, computed from Chapter 1 onward.",
  },
  cara: {
    label: "Cara Daśā",
    stream: "Jaimini",
    status: "Computed for Kavya’s chart",
    color: GREEN,
    icon: <MapPinned size={18} aria-hidden="true" />,
    detail:
      "Sign-based, Lagna-anchored, chart-computed. Re-derived and verified in Lesson 18.4.2; read through Lagna, AL, and Chāra Kāraka in Lessons 18.4.3-18.4.4.",
  },
  sthira: {
    label: "Sthira Daśā",
    stream: "Jaimini",
    status: "Acknowledged; computation gap",
    color: AMBER,
    icon: <Scale size={18} aria-hidden="true" />,
    detail:
      "A second Jaimini sign-daśā with a different fixed-pattern rule. T1-10 10.6.2 defers full computation to T1-17, but T1-17 contains no Sthira Daśā chapter.",
  },
  kalachakra: {
    label: "Kālacakra Daśā",
    stream: "Jaimini",
    status: "Acknowledged; not summarised",
    color: PURPLE,
    icon: <BookOpen size={18} aria-hidden="true" />,
    detail:
      "A real, complex classical system. T1-10 10.6.3 exists at genuine length but was not read in full for this module, so this lesson points to it rather than summarising it.",
  },
};

const CONTRIBUTIONS = [
  "Verified Cara Daśā computation for Kavya’s chart",
  "Structural finding: Moon MD sits entirely inside Pisces Cara MD",
  "Ārūḍha Lagna and Chāra Kāraka computations, including bounded tie and Dārākāraka",
  "Moon/Moon antardaśā evaluated for the first time",
  "Lesson 18.3.4’s hypothetical tested honestly",
  "Two favourable citation-honesty findings and one disclosed gap",
] as const;

const MISTAKES: Record<MistakeKey, { label: string; offText: string }> = {
  real: {
    label: "Silence on computation does not mean the system is unreal",
    offText: "Warning: Sthira and Kālacakra are genuinely attested systems; this module’s silence is a scope decision, not a validity judgment.",
  },
  fix: {
    label: "A disclosed gap is not this lesson’s error to fix by invention",
    offText: "Warning: the honest response to a real gap is disclosure; inventing a rule would misrepresent the tradition.",
  },
  pointless: {
    label: "Chapter 4 delivered real value without a tier upgrade",
    offText: "Warning: verified computation, structural findings, a new indicator, and honest hypothesis-testing are valuable even when no window reaches Moderate.",
  },
};

const ROUTE_OPTIONS: { id: RouteChoice; label: string; feedback: string; ok: boolean }[] = [
  { id: "invent", label: "Invent a plausible Sthira rule and compute it", feedback: "This repeats the mistake this module avoids: a plausible invention is not a verified rule.", ok: false },
  { id: "notReal", label: "Say Sthira Daśā is not a real system", feedback: "Sthira Daśā is genuinely attested; silence here is about scope, not validity.", ok: false },
  { id: "refuse", label: "Refuse to engage with the question", feedback: "Refusing to engage is less useful than naming the gap precisely and pointing to the source.", ok: false },
  { id: "honest", label: "Acknowledge the gap and point to T1-10 10.6.2", feedback: "Correct: name what the source says, where the deferral does not resolve, and decline to invent.", ok: true },
];

export function JaiminiDashasAcknowledgmentWorkbench() {
  const [selected, setSelected] = useState<SystemKey>("cara");
  const [contributions, setContributions] = useState<boolean[]>(CONTRIBUTIONS.map(() => true));
  const [route, setRoute] = useState<RouteChoice>(null);
  const [mistakes, setMistakes] = useState<Record<MistakeKey, boolean>>({
    real: true,
    fix: true,
    pointless: true,
  });

  const allHeld = Object.values(mistakes).every(Boolean);
  const allContributions = contributions.every(Boolean);

  function reset() {
    setSelected("cara");
    setContributions(CONTRIBUTIONS.map(() => true));
    setRoute(null);
    setMistakes({ real: true, fix: true, pointless: true });
  }

  return (
    <div data-interactive="jaimini-dashas-acknowledgment-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Jaimini daśā landscape</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Acknowledge what lies beyond verified scope
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Cara Daśā was computed; Sthira and Kālacakra are real systems this module names honestly without inventing rules.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Four-system landscape</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))", gap: "0.75rem", marginTop: "0.75rem" }}>
          {(Object.keys(SYSTEMS) as SystemKey[]).map((key) => {
            const sys = SYSTEMS[key];
            const active = key === selected;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={active}
                onClick={() => { setSelected(key); setRoute(null); }}
                style={{
                  textAlign: "left",
                  padding: "0.85rem",
                  borderRadius: 8,
                  border: `1px solid ${active ? sys.color : HAIRLINE}`,
                  background: active ? `${sys.color}10` : SURFACE,
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: sys.color, fontWeight: 700 }}>
                  {sys.icon} {sys.label}
                </div>
                <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.82rem", lineHeight: 1.4 }}>
                  {sys.status}
                </p>
              </button>
            );
          })}
        </div>
        <DetailPanel systemKey={selected} />
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 480px" }}>
          <p style={eyebrowStyle}>Route the learner’s question</p>
          <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
            “Can you compute Kavya’s Sthira Daśā the way you computed her Cara Daśā?”
          </h3>
          <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.75rem" }}>
            {ROUTE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                aria-pressed={route === opt.id}
                onClick={() => setRoute(opt.id)}
                style={scenarioButtonStyle(route === opt.id, opt.ok ? GREEN : VERMILION)}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {route && (
            <div
              style={{
                marginTop: "0.75rem",
                padding: "0.65rem 0.85rem",
                borderRadius: 8,
                background: ROUTE_OPTIONS.find((o) => o.id === route)?.ok ? `${GREEN}12` : `${VERMILION}12`,
                border: `1px solid ${ROUTE_OPTIONS.find((o) => o.id === route)?.ok ? GREEN : VERMILION}55`,
                color: ROUTE_OPTIONS.find((o) => o.id === route)?.ok ? GREEN : VERMILION,
              }}
            >
              {ROUTE_OPTIONS.find((o) => o.id === route)?.feedback}
            </div>
          )}
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 300px" }}>
          <Panel title="Scope-decision parallels" icon={<ShieldCheck size={18} />} color={BLUE}>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              <ScopeParallel label="Placidus / KP cusps" lesson="Lesson 18.3.3" reason="No fresh computed data" />
              <ScopeParallel label="Antar-rāśi (Cara sub-periods)" lesson="Lesson 18.4.2" reason="No verified formula" />
              <ScopeParallel label="Sthira & Kālacakra Daśā" lesson="Lesson 18.4.5" reason="Source deferred / unread" />
            </div>
          </Panel>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Chapter 4 contribution checklist</p>
        <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
          Toggle any item off to see what Chapter 4 would lose if it were removed.
        </p>
        <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.75rem" }}>
          {CONTRIBUTIONS.map((text, idx) => {
            const on = contributions[idx];
            return (
              <button
                key={idx}
                type="button"
                aria-pressed={on}
                onClick={() => {
                  const next = [...contributions];
                  next[idx] = !on;
                  setContributions(next);
                }}
                style={togglePanelStyle(on, on ? GREEN : AMBER)}
              >
                {on ? <CheckCircle2 size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                <span>
                  <strong style={{ fontWeight: 700 }}>{text}</strong>
                  <span>{on ? " — included in Chapter 4’s value." : " — removed; the chapter would be poorer without it."}</span>
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
            background: allContributions ? `${GREEN}12` : `${AMBER}12`,
            border: `1px solid ${allContributions ? GREEN : AMBER}55`,
            color: allContributions ? GREEN : AMBER,
            fontWeight: 600,
          }}
        >
          {allContributions
            ? "All six contributions are recognised. Chapter 4 delivered real value even without a Moderate-tier window."
            : `${CONTRIBUTIONS.length - contributions.filter(Boolean).length} contribution(s) removed. Consider whether the chapter would still feel worthwhile without them.`}
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Hold the discipline</p>
        <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.75rem" }}>
          {(Object.keys(MISTAKES) as MistakeKey[]).map((key) => {
            const on = mistakes[key];
            return (
              <button
                key={key}
                type="button"
                aria-pressed={on}
                onClick={() => setMistakes((m) => ({ ...m, [key]: !on }))}
                style={togglePanelStyle(on, on ? GREEN : VERMILION)}
              >
                {on ? <CheckCircle2 size={18} aria-hidden="true" /> : <AlertTriangle size={18} aria-hidden="true" />}
                <span>
                  <strong style={{ fontWeight: 700 }}>{MISTAKES[key].label}</strong>
                  <span>{on ? " — discipline held." : ` ${MISTAKES[key].offText}`}</span>
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
            background: allHeld ? `${GREEN}12` : `${VERMILION}12`,
            border: `1px solid ${allHeld ? GREEN : VERMILION}55`,
            color: allHeld ? GREEN : VERMILION,
            fontWeight: 600,
          }}
        >
          {allHeld
            ? "All discipline commitments are held. The acknowledgment-level closing is honest and bounded."
            : `${Object.keys(MISTAKES).length - Object.values(mistakes).filter(Boolean).length} discipline commitment(s) released. Review the warnings above.`}
        </div>
      </section>
    </div>
  );
}

function DetailPanel({ systemKey }: { systemKey: SystemKey }) {
  const sys = SYSTEMS[systemKey];
  return (
    <div
      style={{
        marginTop: "0.85rem",
        padding: "0.85rem",
        borderRadius: 8,
        border: `1px solid ${sys.color}55`,
        background: `${sys.color}0A`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: sys.color, fontWeight: 700 }}>
        {sys.icon} {sys.label}
      </div>
      <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{sys.detail}</p>
      {systemKey === "sthira" && (
        <div style={{ marginTop: "0.65rem" }}>
          <GapSvg />
          <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
            T1-10 10.6.2 says “full computation is in the Jaimini module.” T1-17’s seven chapters do not include Sthira Daśā.
            This lesson names the gap rather than patching it with an invented rule.
          </p>
        </div>
      )}
      {systemKey === "kalachakra" && (
        <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
          T1-10 10.6.3 is confirmed to be 186 lines and genuinely substantial. Because it was not read in full for this module,
          the honest move is to point the learner directly to that source.
        </p>
      )}
    </div>
  );
}

function GapSvg() {
  return (
    <svg viewBox="0 0 560 120" role="img" aria-label="Sthira Dasha cross-reference gap" style={{ width: "100%", maxHeight: 160, margin: "0.5rem auto 0", display: "block" }}>
      <rect x="30" y="25" width="140" height="70" rx="8" fill={`${BLUE}12`} stroke={BLUE} strokeWidth="2" />
      <text x="100" y="55" textAnchor="middle" fill={BLUE} fontSize="13" fontWeight={700}>T1-10 10.6.2</text>
      <text x="100" y="75" textAnchor="middle" fill={INK_SECONDARY} fontSize="11" fontWeight={600}>defers Sthira</text>
      <text x="100" y="90" textAnchor="middle" fill={INK_SECONDARY} fontSize="11" fontWeight={600}>to Jaimini module</text>

      <line x1="170" y1="60" x2="250" y2="60" stroke={HAIRLINE} strokeWidth="2" />
      <text x="210" y="55" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight={700}>→</text>
      <path d="M 240 52 L 250 60 L 240 68" fill="none" stroke={INK_MUTED} strokeWidth="2" />

      <rect x="250" y="25" width="140" height="70" rx="8" fill={`${VERMILION}10`} stroke={VERMILION} strokeWidth="2" strokeDasharray="6 4" />
      <text x="320" y="55" textAnchor="middle" fill={VERMILION} fontSize="13" fontWeight={700}>T1-17</text>
      <text x="320" y="75" textAnchor="middle" fill={INK_SECONDARY} fontSize="11" fontWeight={600}>7 chapters,</text>
      <text x="320" y="90" textAnchor="middle" fill={INK_SECONDARY} fontSize="11" fontWeight={600}>no Sthira</text>

      <line x1="390" y1="60" x2="470" y2="60" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="6 4" />
      <text x="430" y="55" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight={700}>×</text>

      <rect x="470" y="25" width="80" height="70" rx="8" fill={`${AMBER}10`} stroke={AMBER} strokeWidth="2" />
      <text x="510" y="55" textAnchor="middle" fill={AMBER} fontSize="13" fontWeight={700}>Gap</text>
      <text x="510" y="75" textAnchor="middle" fill={INK_SECONDARY} fontSize="11" fontWeight={600}>disclosed,</text>
      <text x="510" y="90" textAnchor="middle" fill={INK_SECONDARY} fontSize="11" fontWeight={600}>not patched</text>
    </svg>
  );
}

function ScopeParallel({ label, lesson, reason }: { label: string; lesson: string; reason: string }) {
  return (
    <div style={{ display: "flex", gap: "0.65rem", alignItems: "start" }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: BLUE, marginTop: "0.4rem", flexShrink: 0 }} />
      <div>
        <p style={{ margin: 0, color: INK_PRIMARY, fontWeight: 600, fontSize: "0.88rem" }}>{label}</p>
        <p style={{ margin: "0.15rem 0 0", color: INK_SECONDARY, fontSize: "0.8rem" }}>{lesson} — {reason}</p>
      </div>
    </div>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 700 }}>{icon}{title}</div>
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

function scenarioButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    textAlign: "left",
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
